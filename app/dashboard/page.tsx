"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DataTable } from "@/components/dashboard/data-table"
import { QuerySection } from "@/components/dashboard/query-section"
import { useToast } from "@/hooks/use-toast"
import { Database, Table as TableIcon, FileQuestion } from "lucide-react"

interface TableData {
  [key: string]: any
}

export default function DashboardPage() {
  const [data, setData] = useState<TableData[]>([])
  const [columns, setColumns] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [queryResults, setQueryResults] = useState<any[] | null>(null)
  const [queryError, setQueryError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/data?limit=30")
      if (!response.ok) throw new Error("Failed to fetch data")
      
      const result = await response.json()
      setData(result.data)
      
      // Generate columns from the first row
      if (result.data.length > 0) {
        const cols = Object.keys(result.data[0]).map(key => ({
          accessorKey: key,
          header: key.charAt(0).toUpperCase() + key.slice(1),
        }))
        setColumns(cols)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRunQuery = async (query: string) => {
    setQueryError(null)
    setQueryResults(null)
    setIsLoading(true)

    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Failed to execute query")
      }

      const results = await response.json()
      setQueryResults(results.data)
    } catch (error) {
      setQueryError(error instanceof Error ? error.message : "An error occurred")
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to execute query",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tables</CardTitle>
            <TableIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Queries Run</CardTitle>
            <FileQuestion className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{queryResults ? 1 : 0}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Data Explorer</CardTitle>
          </CardHeader>
          <CardContent>
            {columns.length > 0 && (
              <DataTable
                columns={columns}
                data={data}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Query Builder</CardTitle>
          </CardHeader>
          <CardContent>
            <QuerySection
              onRunQuery={handleRunQuery}
              isLoading={isLoading}
              results={queryResults}
              error={queryError}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}