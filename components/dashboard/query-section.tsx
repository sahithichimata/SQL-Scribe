"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CodeHighlight } from "@/components/ui/code-highlight"
import { Card } from "@/components/ui/card"
import { Play, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface QuerySectionProps {
  onRunQuery: (query: string) => Promise<void>
  isLoading: boolean
  results: any[] | null
  error: string | null
}

const exampleQueries = [
  {
    name: "Basic Select",
    query: "SELECT * FROM users LIMIT 5;"
  },
  {
    name: "Aggregation",
    query: "SELECT department, COUNT(*) as count FROM employees GROUP BY department;"
  },
  {
    name: "Complex Join",
    query: `SELECT 
  c.name as customer_name,
  p.name as product_name,
  o.order_date,
  oi.quantity
FROM customers c
JOIN orders o ON c.id = o.customer_id
JOIN order_items oi ON o.id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE o.order_date >= DATE('now', '-30 days')
ORDER BY o.order_date DESC;`
  }
]

export function QuerySection({
  onRunQuery,
  isLoading,
  results,
  error
}: QuerySectionProps) {
  const [query, setQuery] = useState("")
  const { toast } = useToast()

  const handleRunQuery = async () => {
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a query",
        variant: "destructive"
      })
      return
    }
    await onRunQuery(query)
  }

  const handleExampleClick = (exampleQuery: string) => {
    setQuery(exampleQuery)
  }

  const handleCopyQuery = () => {
    navigator.clipboard.writeText(query)
    toast({
      title: "Copied!",
      description: "Query copied to clipboard"
    })
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {exampleQueries.map((eq, index) => (
          <Button
            key={index}
            variant="outline"
            className="justify-start h-auto py-2 px-3"
            onClick={() => handleExampleClick(eq.query)}
          >
            <div className="text-left">
              <div className="font-medium">{eq.name}</div>
              <div className="text-xs text-muted-foreground truncate">
                {eq.query}
              </div>
            </div>
          </Button>
        ))}
      </div>

      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">SQL Query</label>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyQuery}
              disabled={!query}
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
            <Button
              onClick={handleRunQuery}
              disabled={isLoading || !query}
              size="sm"
            >
              <Play className="h-4 w-4 mr-1" />
              {isLoading ? "Running..." : "Run Query"}
            </Button>
          </div>
        </div>

        <Textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your SQL query here..."
          className="font-mono min-h-[200px]"
        />
      </div>

      {error && (
        <Card className="p-4 bg-destructive/10 text-destructive">
          {error}
        </Card>
      )}

      {results && (
        <Card className="p-4">
          <CodeHighlight
            code={JSON.stringify(results, null, 2)}
            language="json"
          />
        </Card>
      )}
    </div>
  )
}