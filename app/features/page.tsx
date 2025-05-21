"use client"

import { motion } from "framer-motion"
import { Braces, Cpu, Database, LineChart, Lock, RefreshCw, Sparkles, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeHighlight } from "@/components/ui/code-highlight"

// Example schema upload file
const schemaExample = `CREATE TABLE customers (
  customer_id UUID PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
  order_id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(customer_id),
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'pending',
  total_amount DECIMAL(10, 2) NOT NULL
);`

// Example visualizations
const visualizationExample = `// Schema visualization using d3.js
const svg = d3.select("#schema-viz")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Create nodes for each table
const nodes = svg.selectAll("g")
  .data(tables)
  .enter()
  .append("g")
  .attr("transform", d => \`translate(\${d.x}, \${d.y})\`);

// Add table rectangles
nodes.append("rect")
  .attr("width", 200)
  .attr("height", d => d.columns.length * 25 + 40)
  .attr("rx", 6)
  .attr("ry", 6)
  .attr("fill", "#f8fafc")
  .attr("stroke", "#e2e8f0");

// Add table names
nodes.append("text")
  .attr("x", 10)
  .attr("y", 25)
  .text(d => d.name)
  .attr("font-weight", "bold");`

// Example optimizations
const optimizationExample = `// Optimize SQL query
function optimizeQuery(query, schema) {
  // Parse the SQL query
  const parsedQuery = parseSQL(query);
  
  // Identify potential optimizations
  const optimizations = [];
  
  // Check for missing indexes
  const missingIndexes = findMissingIndexes(parsedQuery, schema);
  if (missingIndexes.length > 0) {
    optimizations.push({
      type: 'missing_indexes',
      details: missingIndexes
    });
  }
  
  // Check for inefficient joins
  const inefficientJoins = findInefficientJoins(parsedQuery);
  if (inefficientJoins.length > 0) {
    optimizations.push({
      type: 'inefficient_joins',
      details: inefficientJoins
    });
  }
  
  // Apply optimizations to the query
  const optimizedQuery = applyOptimizations(parsedQuery, optimizations);
  
  return {
    originalQuery: query,
    optimizedQuery: optimizedQuery,
    optimizations: optimizations,
    score: calculateOptimizationScore(optimizations)
  };
}`

export default function FeaturesPage() {
  const features = [
    {
      icon: <Sparkles className="h-10 w-10 text-primary" />,
      title: "Natural Language to SQL",
      description: "Convert plain English questions into precise SQL queries using advanced AI language models."
    },
    {
      icon: <Database className="h-10 w-10 text-primary" />,
      title: "Multi-Dialect Support",
      description: "Generate queries for MySQL, PostgreSQL, SQLite, Oracle, and MS SQL Server with dialect-specific optimizations."
    },
    {
      icon: <RefreshCw className="h-10 w-10 text-primary" />,
      title: "Schema Upload",
      description: "Upload your database schema via SQL files, CSV or SQLite databases for context-aware queries."
    },
    {
      icon: <Braces className="h-10 w-10 text-primary" />,
      title: "Syntax Highlighting",
      description: "Beautiful, customizable syntax highlighting for all supported SQL dialects."
    },
    {
      icon: <Cpu className="h-10 w-10 text-primary" />,
      title: "Query Optimization",
      description: "Automatically optimize generated SQL queries with performance metrics and suggestions."
    },
    {
      icon: <LineChart className="h-10 w-10 text-primary" />,
      title: "Performance Metrics",
      description: "Get detailed insights into query performance with visual metrics and optimization scores."
    },
    {
      icon: <Lock className="h-10 w-10 text-primary" />,
      title: "Schema Privacy",
      description: "Your database schema never leaves your device. All processing happens locally."
    },
    {
      icon: <Zap className="h-10 w-10 text-primary" />,
      title: "Real-Time Generation",
      description: "Generate SQL queries in real-time as you type with instant feedback and suggestions."
    }
  ]
  
  return (
    <div className="container py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Powerful Features</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover how SQL Scribe can transform your database workflow
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-border/50 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="mb-4">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-24 mb-16">
        <h2 className="text-3xl font-bold text-center mb-16">Explore Key Capabilities</h2>
        
        <Tabs defaultValue="schema" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="schema">Schema Management</TabsTrigger>
            <TabsTrigger value="visualization">Visualization</TabsTrigger>
            <TabsTrigger value="optimization">Query Optimization</TabsTrigger>
          </TabsList>
          
          <TabsContent value="schema" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Schema Upload</h3>
                <p className="text-muted-foreground mb-6">
                  SQL Scribe allows you to upload your database schema in various formats, 
                  including SQL files, CSV, and SQLite databases. This enables the AI to 
                  generate context-aware queries that are specific to your database structure.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full w-5 h-5 bg-primary/20 text-primary flex items-center justify-center mt-0.5">✓</div>
                    <span>Support for multiple schema formats</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full w-5 h-5 bg-primary/20 text-primary flex items-center justify-center mt-0.5">✓</div>
                    <span>Automatic schema parsing and validation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full w-5 h-5 bg-primary/20 text-primary flex items-center justify-center mt-0.5">✓</div>
                    <span>Local processing for data privacy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full w-5 h-5 bg-primary/20 text-primary flex items-center justify-center mt-0.5">✓</div>
                    <span>Relationship detection between tables</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Example Schema</h3>
                <CodeHighlight code={schemaExample} language="sql" />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="visualization" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Schema Visualization</h3>
                <p className="text-muted-foreground mb-6">
                  SQL Scribe provides powerful visualization tools that help you understand your 
                  database structure. The interactive entity relationship diagrams (ERDs) make 
                  it easy to see table relationships and dependencies at a glance.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full w-5 h-5 bg-primary/20 text-primary flex items-center justify-center mt-0.5">✓</div>
                    <span>Interactive entity relationship diagrams</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full w-5 h-5 bg-primary/20 text-primary flex items-center justify-center mt-0.5">✓</div>
                    <span>Table and column detail views</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full w-5 h-5 bg-primary/20 text-primary flex items-center justify-center mt-0.5">✓</div>
                    <span>Foreign key relationship visibility</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full w-5 h-5 bg-primary/20 text-primary flex items-center justify-center mt-0.5">✓</div>
                    <span>Customizable visualization options</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Visualization Code</h3>
                <CodeHighlight code={visualizationExample} language="javascript" />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="optimization" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Query Optimization</h3>
                <p className="text-muted-foreground mb-6">
                  SQL Scribe doesn't just generate SQL queries—it optimizes them for 
                  performance. The AI analyzes your schema and query patterns to suggest 
                  improvements like adding indexes, rewriting joins, and more.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full w-5 h-5 bg-primary/20 text-primary flex items-center justify-center mt-0.5">✓</div>
                    <span>Performance-focused query generation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full w-5 h-5 bg-primary/20 text-primary flex items-center justify-center mt-0.5">✓</div>
                    <span>Index recommendation engine</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full w-5 h-5 bg-primary/20 text-primary flex items-center justify-center mt-0.5">✓</div>
                    <span>Query execution plan analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full w-5 h-5 bg-primary/20 text-primary flex items-center justify-center mt-0.5">✓</div>
                    <span>Dialect-specific optimization techniques</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Optimization Algorithm</h3>
                <CodeHighlight code={optimizationExample} language="javascript" />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}