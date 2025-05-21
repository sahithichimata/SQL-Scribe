"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Upload, Database, Trash, Copy, Play, Download, Award, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CodeHighlight } from "@/components/ui/code-highlight"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ResizableHandle, 
  ResizablePanel, 
  ResizablePanelGroup 
} from "@/components/ui/resizable"
import { AppSchemaSection } from "@/components/app/schema-section"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

const exampleQueries = [
  "Show me all customers who made a purchase in the last 30 days",
  "Find the top 5 products by revenue last quarter",
  "Count how many employees work in each department",
  "List all projects that are behind schedule"
]

export default function AppPage() {
  const { toast } = useToast()
  const [inputText, setInputText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedDialect, setSelectedDialect] = useState("postgres")
  const [generatedQuery, setGeneratedQuery] = useState("")
  const [optimizationScore, setOptimizationScore] = useState(0)
  const [schema, setSchema] = useState(null)
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value)
  }
  
  const generateQuery = useCallback(async () => {
    if (inputText.trim() === "") return
    
    setIsGenerating(true)
    setOptimizationScore(0)
    
    try {
      // This would be replaced with actual API call in production
      const queryMap = {
        "Show me all customers who made a purchase in the last 30 days": `SELECT 
  c.customer_id,
  c.first_name,
  c.last_name,
  c.email,
  COUNT(o.order_id) as order_count,
  SUM(o.total_amount) as total_spent
FROM 
  customers c
JOIN 
  orders o ON c.customer_id = o.customer_id
WHERE 
  o.order_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY 
  c.customer_id, c.first_name, c.last_name, c.email
ORDER BY 
  total_spent DESC;`,
        "Find the top 5 products by revenue last quarter": `SELECT 
  p.product_id, 
  p.product_name,
  p.category,
  ROUND(SUM(oi.quantity * oi.unit_price), 2) AS revenue
FROM 
  products p
JOIN 
  order_items oi ON p.product_id = oi.product_id
JOIN 
  orders o ON oi.order_id = o.order_id
WHERE 
  o.order_date BETWEEN 
    DATE_SUB(CURRENT_DATE, INTERVAL 3 MONTH) AND CURRENT_DATE
GROUP BY 
  p.product_id, p.product_name, p.category
ORDER BY 
  revenue DESC
LIMIT 5;`,
        "Count how many employees work in each department": `SELECT 
  department,
  COUNT(*) as employee_count
FROM 
  employees
GROUP BY 
  department
ORDER BY 
  employee_count DESC;`,
        "List all projects that are behind schedule": `SELECT 
  project_id,
  project_name,
  start_date,
  due_date,
  status
FROM 
  projects
WHERE 
  status = 'delayed'
  OR (completion_percentage < 100 AND due_date < CURRENT_DATE)
ORDER BY 
  due_date ASC;`
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newQuery = queryMap[inputText] || `SELECT 
  *
FROM 
  ${inputText.toLowerCase().includes('customer') ? 'customers' : 'orders'}
LIMIT 10;`

      setGeneratedQuery(newQuery)

      // Animate optimization score
      const timer = setInterval(() => {
        setOptimizationScore(prev => {
          if (prev >= 95) {
            clearInterval(timer)
            return 95
          }
          return prev + 5
        })
      }, 100)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate query. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }, [inputText, toast])
  
  const handleGenerate = () => {
    generateQuery()
  }
  
  const handleExampleClick = (example: string) => {
    setInputText(example)
    generateQuery()
  }

  const handleCopyQuery = () => {
    navigator.clipboard.writeText(generatedQuery)
    toast({
      title: "Copied!",
      description: "Query copied to clipboard"
    })
  }
  
  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">SQL Assistant</h1>
        <p className="text-muted-foreground max-w-3xl">
          Translate your questions into optimized SQL queries. Select your database dialect, 
          upload your schema, and start generating queries.
        </p>
      </div>

      <ResizablePanelGroup
        direction="horizontal"
        className="split-pane-container border rounded-lg bg-card"
      >
        <ResizablePanel defaultSize={25} minSize={20}>
          <div className="h-full p-4">
            <AppSchemaSection onSchemaChange={setSchema} />
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        
        <ResizablePanel defaultSize={75} minSize={30}>
          <Tabs defaultValue="input" className="h-full flex flex-col">
            <div className="px-4 pt-4 border-b">
              <div className="flex items-center justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="input">Query Input</TabsTrigger>
                  <TabsTrigger value="output">SQL Output</TabsTrigger>
                  <TabsTrigger value="optimization">Optimization</TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-2">
                  <Select 
                    value={selectedDialect}
                    onValueChange={setSelectedDialect}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select dialect" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="postgres">PostgreSQL</SelectItem>
                      <SelectItem value="mysql">MySQL</SelectItem>
                      <SelectItem value="sqlite">SQLite</SelectItem>
                      <SelectItem value="oracle">Oracle</SelectItem>
                      <SelectItem value="mssql">MS SQL Server</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    onClick={handleGenerate}
                    disabled={isGenerating || inputText.trim() === ""}
                  >
                    {isGenerating ? 
                      "Generating..." : 
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        Generate
                      </>
                    }
                  </Button>
                </div>
              </div>
            </div>
            
            <TabsContent value="input" className="flex-1 p-0 m-0">
              <div className="h-full flex flex-col p-4">
                <div className="mb-4">
                  <Label htmlFor="query-input">Natural Language Query</Label>
                  <Textarea
                    id="query-input"
                    className="font-jetbrains min-h-32"
                    placeholder="Describe the query you want to generate in plain English..."
                    value={inputText}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="mb-6">
                  <h3 className="text-sm font-medium mb-2">Example Queries</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {exampleQueries.map((query, index) => (
                      <Button 
                        key={index} 
                        variant="outline" 
                        className="justify-start h-auto py-2 px-3 text-left text-sm font-normal"
                        onClick={() => handleExampleClick(query)}
                      >
                        {query}
                      </Button>
                    ))}
                  </div>
                </div>
                
                {generatedQuery && (
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <Label>Generated SQL</Label>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={handleCopyQuery}>
                          <Copy className="h-3.5 w-3.5 mr-1" />
                          Copy
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-3.5 w-3.5 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                    <ScrollArea className="h-[250px] rounded-md border">
                      <CodeHighlight
                        code={generatedQuery}
                        language="sql"
                      />
                    </ScrollArea>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="output" className="flex-1 p-0 m-0">
              <div className="h-full p-4">
                {generatedQuery ? (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">SQL Query</h3>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleCopyQuery}>
                          <Copy className="h-3.5 w-3.5 mr-1" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-3.5 w-3.5 mr-1" />
                          Export
                        </Button>
                      </div>
                    </div>
                    <CodeHighlight
                      code={generatedQuery}
                      language="sql"
                      showLineNumbers={true}
                    />
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Database className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>Generate a query to see the results here</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="optimization" className="flex-1 p-0 m-0">
              <div className="h-full p-4">
                {generatedQuery ? (
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Query Optimization Score</h3>
                        <div className="flex items-center gap-1 text-sm">
                          <Award className="h-4 w-4 text-primary" />
                          <span className="text-primary font-medium">{optimizationScore}/100</span>
                        </div>
                      </div>
                      <Progress value={optimizationScore} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Performance Analysis</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <div className="rounded-full w-5 h-5 bg-success/20 text-success flex items-center justify-center mt-0.5">✓</div>
                              <span>Efficient JOIN operations used</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="rounded-full w-5 h-5 bg-success/20 text-success flex items-center justify-center mt-0.5">✓</div>
                              <span>Appropriate indexing for filtered columns</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="rounded-full w-5 h-5 bg-success/20 text-success flex items-center justify-center mt-0.5">✓</div>
                              <span>Selective WHERE clause conditions</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <div className="rounded-full w-5 h-5 bg-warning/20 text-warning flex items-center justify-center mt-0.5">!</div>
                              <span>Consider adding LIMIT clause for large datasets</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Improvement Suggestions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                              <PlusCircle className="h-4 w-4 text-primary mt-0.5" />
                              <span>Add index on order_date for faster filtering</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <PlusCircle className="h-4 w-4 text-primary mt-0.5" />
                              <span>Consider using a materialized view for frequent queries</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <PlusCircle className="h-4 w-4 text-primary mt-0.5" />
                              <span>Review GROUP BY clause for optimization</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Query Explanation</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm text-muted-foreground">
                        <p>
                          This query performs a JOIN between customers and orders tables to find customers
                          with recent purchases. It calculates aggregate values (count and sum) for each customer.
                          The query execution plan will likely use indexes on customer_id and order_date columns.
                          For large datasets, consider adding pagination using LIMIT and OFFSET clauses.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Database className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>Generate a query to see optimization insights</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}