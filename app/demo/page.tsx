"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeHighlight } from "@/components/ui/code-highlight"
import { ArrowDown, Database, Play } from "lucide-react"

const exampleQueries = [
  {
    id: 1,
    name: "Customer Orders",
    description: "Find recent customer orders with details",
    natural: "Show me all orders placed by customers in New York during the last month with product details and total amount",
    dialects: {
      postgres: `SELECT 
  c.customer_id,
  c.first_name || ' ' || c.last_name AS customer_name,
  o.order_id,
  o.order_date,
  p.product_name,
  oi.quantity,
  oi.unit_price,
  (oi.quantity * oi.unit_price) AS line_total
FROM 
  customers c
JOIN 
  orders o ON c.customer_id = o.customer_id
JOIN 
  order_items oi ON o.order_id = oi.order_id
JOIN 
  products p ON oi.product_id = p.product_id
WHERE 
  c.state = 'NY'
  AND o.order_date >= CURRENT_DATE - INTERVAL '1 month'
ORDER BY 
  o.order_date DESC, c.last_name, c.first_name;`,
      mysql: `SELECT 
  c.customer_id,
  CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
  o.order_id,
  o.order_date,
  p.product_name,
  oi.quantity,
  oi.unit_price,
  (oi.quantity * oi.unit_price) AS line_total
FROM 
  customers c
JOIN 
  orders o ON c.customer_id = o.customer_id
JOIN 
  order_items oi ON o.order_id = oi.order_id
JOIN 
  products p ON oi.product_id = p.product_id
WHERE 
  c.state = 'NY'
  AND o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 1 MONTH)
ORDER BY 
  o.order_date DESC, c.last_name, c.first_name;`
    }
  },
  {
    id: 2,
    name: "Revenue Analysis",
    description: "Analyze product revenue by category",
    natural: "Calculate total revenue for each product category in the last quarter, sorted by revenue descending",
    dialects: {
      postgres: `SELECT 
  p.category,
  SUM(oi.quantity * oi.unit_price) AS total_revenue,
  COUNT(DISTINCT o.order_id) AS order_count,
  COUNT(DISTINCT o.customer_id) AS customer_count,
  ROUND(SUM(oi.quantity * oi.unit_price) / COUNT(DISTINCT o.order_id), 2) AS avg_order_value
FROM 
  products p
JOIN 
  order_items oi ON p.product_id = oi.product_id
JOIN 
  orders o ON oi.order_id = o.order_id
WHERE 
  o.order_date >= DATE_TRUNC('quarter', CURRENT_DATE - INTERVAL '3 months')
  AND o.order_date < DATE_TRUNC('quarter', CURRENT_DATE)
GROUP BY 
  p.category
ORDER BY 
  total_revenue DESC;`,
      mysql: `SELECT 
  p.category,
  SUM(oi.quantity * oi.unit_price) AS total_revenue,
  COUNT(DISTINCT o.order_id) AS order_count,
  COUNT(DISTINCT o.customer_id) AS customer_count,
  ROUND(SUM(oi.quantity * oi.unit_price) / COUNT(DISTINCT o.order_id), 2) AS avg_order_value
FROM 
  products p
JOIN 
  order_items oi ON p.product_id = oi.product_id
JOIN 
  orders o ON oi.order_id = o.order_id
WHERE 
  o.order_date >= DATE_SUB(DATE_SUB(CURRENT_DATE, INTERVAL DAYOFQUARTER(CURRENT_DATE)-1 DAY), INTERVAL 3 MONTH)
  AND o.order_date < DATE_SUB(CURRENT_DATE, INTERVAL DAYOFQUARTER(CURRENT_DATE)-1 DAY)
GROUP BY 
  p.category
ORDER BY 
  total_revenue DESC;`
    }
  },
  {
    id: 3,
    name: "Customer Retention",
    description: "Identify repeat customers",
    natural: "Find customers who have placed more than 3 orders in the past 6 months and their most purchased product category",
    dialects: {
      postgres: `WITH customer_orders AS (
  SELECT 
    c.customer_id,
    c.first_name || ' ' || c.last_name AS customer_name,
    COUNT(DISTINCT o.order_id) AS order_count
  FROM 
    customers c
  JOIN 
    orders o ON c.customer_id = o.customer_id
  WHERE 
    o.order_date >= CURRENT_DATE - INTERVAL '6 months'
  GROUP BY 
    c.customer_id, c.first_name, c.last_name
  HAVING 
    COUNT(DISTINCT o.order_id) > 3
),
customer_categories AS (
  SELECT 
    co.customer_id,
    p.category,
    COUNT(*) AS purchase_count,
    ROW_NUMBER() OVER (PARTITION BY co.customer_id ORDER BY COUNT(*) DESC) AS category_rank
  FROM 
    customer_orders co
  JOIN 
    orders o ON co.customer_id = o.customer_id
  JOIN 
    order_items oi ON o.order_id = oi.order_id
  JOIN 
    products p ON oi.product_id = p.product_id
  WHERE 
    o.order_date >= CURRENT_DATE - INTERVAL '6 months'
  GROUP BY 
    co.customer_id, p.category
)
SELECT 
  co.customer_id,
  co.customer_name,
  co.order_count,
  cc.category AS top_category,
  cc.purchase_count
FROM 
  customer_orders co
JOIN 
  customer_categories cc ON co.customer_id = cc.customer_id AND cc.category_rank = 1
ORDER BY 
  co.order_count DESC, cc.purchase_count DESC;`,
      mysql: `WITH customer_orders AS (
  SELECT 
    c.customer_id,
    CONCAT(c.first_name, ' ', c.last_name) AS customer_name,
    COUNT(DISTINCT o.order_id) AS order_count
  FROM 
    customers c
  JOIN 
    orders o ON c.customer_id = o.customer_id
  WHERE 
    o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
  GROUP BY 
    c.customer_id, c.first_name, c.last_name
  HAVING 
    COUNT(DISTINCT o.order_id) > 3
),
customer_categories AS (
  SELECT 
    co.customer_id,
    p.category,
    COUNT(*) AS purchase_count,
    ROW_NUMBER() OVER (PARTITION BY co.customer_id ORDER BY COUNT(*) DESC) AS category_rank
  FROM 
    customer_orders co
  JOIN 
    orders o ON co.customer_id = o.customer_id
  JOIN 
    order_items oi ON o.order_id = oi.order_id
  JOIN 
    products p ON oi.product_id = p.product_id
  WHERE 
    o.order_date >= DATE_SUB(CURRENT_DATE, INTERVAL 6 MONTH)
  GROUP BY 
    co.customer_id, p.category
)
SELECT 
  co.customer_id,
  co.customer_name,
  co.order_count,
  cc.category AS top_category,
  cc.purchase_count
FROM 
  customer_orders co
JOIN 
  customer_categories cc ON co.customer_id = cc.customer_id AND cc.category_rank = 1
ORDER BY 
  co.order_count DESC, cc.purchase_count DESC;`
    }
  }
]

export default function DemoPage() {
  const [selectedExample, setSelectedExample] = useState(exampleQueries[0])
  const [selectedDialect, setSelectedDialect] = useState<string>("postgres")
  
  const handleExampleChange = (value: string) => {
    const example = exampleQueries.find(q => q.id === parseInt(value))
    if (example) {
      setSelectedExample(example)
    }
  }
  
  return (
    <div className="container py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Interactive Demo</h1>
          <p className="text-xl text-muted-foreground">
            See how SQL Scribe transforms natural language into optimized SQL queries
          </p>
        </div>
        
        <Card className="mb-12 border-border/50">
          <CardHeader>
            <CardTitle>Select an Example</CardTitle>
            <CardDescription>
              Choose from our curated examples or see how SQL Scribe handles various scenarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Select
                  value={selectedExample.id.toString()}
                  onValueChange={handleExampleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an example" />
                  </SelectTrigger>
                  <SelectContent>
                    {exampleQueries.map((example) => (
                      <SelectItem key={example.id} value={example.id.toString()}>
                        {example.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-2">
                  {selectedExample.description}
                </p>
              </div>
              
              <div>
                <Select 
                  value={selectedDialect}
                  onValueChange={setSelectedDialect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="SQL dialect" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="postgres">PostgreSQL</SelectItem>
                    <SelectItem value="mysql">MySQL</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-2">
                  SQL Scribe supports multiple SQL dialects with optimizations specific to each
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-3">Natural Language Input</h2>
              <div className="bg-muted p-4 rounded-md text-foreground">
                {selectedExample.natural}
              </div>
            </div>
            
            <div className="flex justify-center py-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <ArrowDown className="h-8 w-8 text-primary" />
              </motion.div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Generated SQL Query</h2>
                <Button variant="outline" size="sm" className="gap-2">
                  <Play className="h-3 w-3" />
                  Run Query
                </Button>
              </div>
              <CodeHighlight 
                code={selectedExample.dialects[selectedDialect as keyof typeof selectedExample.dialects] || ''}
                language="sql"
              />
            </div>
          </div>
        </motion.div>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6">Try SQL Scribe with Your Data</h2>
          <div className="flex justify-center">
            <Button className="mr-4">
              <Database className="mr-2 h-4 w-4" />
              Upload Schema
            </Button>
            <Button variant="outline">
              Try for Free
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}