"use client"

import { useState, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, Database, PlusCircle, RefreshCcw, FolderOpen, List, X, Play } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { CodeHighlight } from "@/components/ui/code-highlight"
import { nlToSql } from "@/lib/nl-to-sql"
import { format } from "sql-formatter"

interface Column {
  name: string
  type: string
  description?: string
  isPrimary?: boolean
  isForeign?: boolean
  references?: {
    table: string
    column: string
  }
}

interface Table {
  name: string
  columns: Column[]
  sampleData?: any[]
}

interface Schema {
  name: string
  tables: Table[]
  relations: Array<{
    from: { table: string; column: string }
    to: { table: string; column: string }
  }>
}

interface ExampleQuery {
  description: string
  query: string
  output?: any[]
}

export function AppSchemaSection({ onSchemaChange }: { onSchemaChange?: (schema: Schema | null) => void }) {
  const { toast } = useToast()
  const [schema, setSchema] = useState<Schema | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [exampleQueries, setExampleQueries] = useState<ExampleQuery[]>([])
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState('')
  const [generatedQuery, setGeneratedQuery] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  
  const filteredTables = schema?.tables.filter(table => 
    table.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const generateSchemaString = (schema: Schema): string => {
    return schema.tables.map(table => {
      const columns = table.columns.map(col => {
        let colDef = `${col.name} ${col.type}`
        if (col.isPrimary) colDef += ' PRIMARY KEY'
        if (col.isForeign && col.references) {
          colDef += ` REFERENCES ${col.references.table}(${col.references.column})`
        }
        return colDef
      }).join(',\n  ')

      return `CREATE TABLE ${table.name} (\n  ${columns}\n);`
    }).join('\n\n')
  }

  const handleGenerateQuery = async () => {
    if (!schema || !naturalLanguageQuery.trim()) {
      toast({
        title: "Error",
        description: "Please provide both a schema and a query.",
        variant: "destructive"
      })
      return
    }

    setIsGenerating(true)
    try {
      const schemaString = generateSchemaString(schema)
      const result = await nlToSql(naturalLanguageQuery, schemaString)
      
      setGeneratedQuery(format(result.sqlQuery, {
        language: 'sqlite',
        uppercase: true,
        linesBetweenQueries: 2
      }))

      toast({
        title: "Query Generated",
        description: "SQL query has been generated successfully."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate SQL query. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const analyzeDatabase = (content: string) => {
    try {
      // This is where we would parse the SQL dump or CSV content
      // For now, we'll simulate finding tables and relations
      const tables: Table[] = []
      const relations: Schema['relations'] = []
      
      // Basic SQL parsing (this should be enhanced with a proper SQL parser)
      const createTableStatements = content.match(/CREATE TABLE [^;]+;/g) || []
      
      createTableStatements.forEach(statement => {
        const tableName = statement.match(/CREATE TABLE (\w+)/)?.[1]
        if (!tableName) return

        const columns: Column[] = []
        const columnMatches = statement.matchAll(/(\w+)\s+(\w+)(\s+PRIMARY KEY)?(\s+REFERENCES (\w+)\((\w+)\))?/g)
        
        for (const match of columnMatches) {
          const [_, name, type, isPrimary, _, refTable, refColumn] = match
          columns.push({
            name,
            type,
            isPrimary: !!isPrimary,
            isForeign: !!refTable,
            references: refTable ? { table: refTable, column: refColumn } : undefined
          })

          if (refTable) {
            relations.push({
              from: { table: tableName, column: name },
              to: { table: refTable, column: refColumn }
            })
          }
        }

        tables.push({ name: tableName, columns })
      })

      // Generate example queries based on the schema
      const queries: ExampleQuery[] = generateExampleQueries(tables, relations)

      return {
        name: "Uploaded Database",
        tables,
        relations,
        queries
      }
    } catch (error) {
      console.error('Error analyzing database:', error)
      throw new Error('Failed to analyze database structure')
    }
  }

  const generateExampleQueries = (tables: Table[], relations: Schema['relations']): ExampleQuery[] => {
    const queries: ExampleQuery[] = []
    
    // Generate basic SELECT queries for each table
    tables.forEach(table => {
      queries.push({
        description: `Get all ${table.name}`,
        query: `SELECT * FROM ${table.name} LIMIT 5;`
      })

      // Generate JOIN queries for related tables
      const tableRelations = relations.filter(r => r.from.table === table.name)
      tableRelations.forEach(relation => {
        queries.push({
          description: `Get ${table.name} with related ${relation.to.table}`,
          query: `SELECT 
  ${table.name}.*,
  ${relation.to.table}.*
FROM 
  ${table.name}
JOIN 
  ${relation.to.table} ON ${table.name}.${relation.from.column} = ${relation.to.table}.${relation.to.column}
LIMIT 5;`
        })
      })
    })

    return queries
  }
  
  const handleFileUpload = useCallback(async (file?: File) => {
    try {
      if (!file) {
        toast({
          title: "Schema Upload",
          description: "Please select a file to upload.",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string
          const analysis = analyzeDatabase(content)
          
          setSchema({
            name: analysis.name,
            tables: analysis.tables,
            relations: analysis.relations
          })
          
          setExampleQueries(analysis.queries)
          
          onSchemaChange?.({
            name: analysis.name,
            tables: analysis.tables,
            relations: analysis.relations
          })

          toast({
            title: "Schema Analyzed",
            description: `Successfully analyzed database with ${analysis.tables.length} tables and ${analysis.relations.length} relations.`,
          })
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to analyze database schema. Please check the file format.",
            variant: "destructive"
          })
        }
      }
      reader.readAsText(file)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload schema. Please try again.",
        variant: "destructive"
      })
    }
  }, [toast, onSchemaChange])
  
  const handleRemoveSchema = useCallback(() => {
    setSchema(null)
    setExampleQueries([])
    onSchemaChange?.(null)
    toast({
      title: "Schema Removed",
      description: "The current schema has been removed.",
    })
  }, [toast, onSchemaChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }, [handleFileUpload])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Database Schema</h2>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" title="Refresh Schema">
            <RefreshCcw className="h-4 w-4" />
          </Button>
          {schema && (
            <Button 
              variant="ghost" 
              size="icon"
              title="Remove Schema"
              onClick={handleRemoveSchema}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {schema ? (
        <div className="flex-1 flex flex-col">
          <div className="mb-4">
            <div className="relative mb-4">
              <Input
                placeholder="Enter your question in natural language..."
                value={naturalLanguageQuery}
                onChange={(e) => setNaturalLanguageQuery(e.target.value)}
                className="pr-24"
              />
              <Button 
                size="sm"
                className="absolute right-1 top-1"
                onClick={handleGenerateQuery}
                disabled={isGenerating || !naturalLanguageQuery.trim()}
              >
                <Play className="h-4 w-4 mr-1" />
                Generate
              </Button>
            </div>

            {generatedQuery && (
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle className="text-base">Generated SQL Query</CardTitle>
                </CardHeader>
                <CardContent>
                  <CodeHighlight code={generatedQuery} language="sql" />
                </CardContent>
              </Card>
            )}
          </div>

          <div className="relative mb-4">
            <Input
              placeholder="Search tables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
            <List className="h-4 w-4 absolute left-2.5 top-2.5 text-muted-foreground" />
          </div>

          <Tabs defaultValue="tables" className="flex-1 flex flex-col">
            <TabsList className="self-start">
              <TabsTrigger value="tables">Tables</TabsTrigger>
              <TabsTrigger value="relations">Relations</TabsTrigger>
              <TabsTrigger value="queries">Example Queries</TabsTrigger>
            </TabsList>
            
            <TabsContent value="tables" className="flex-1 m-0">
              <ScrollArea className="flex-1 h-[calc(100vh-300px)]">
                <div className="space-y-4">
                  {filteredTables.map((table) => (
                    <Card 
                      key={table.name} 
                      className={`border-border/50 cursor-pointer transition-colors ${
                        selectedTable === table.name ? 'border-primary' : ''
                      }`}
                      onClick={() => setSelectedTable(table.name)}
                    >
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-base flex items-center gap-2">
                          <Database className="h-4 w-4 text-primary" />
                          {table.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 py-2">
                        <div className="text-xs">
                          {table.columns.map((column) => (
                            <div 
                              key={column.name}
                              className="flex justify-between py-1 border-b border-border/30 last:border-0"
                            >
                              <div className="font-medium">{column.name}</div>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">{column.type}</span>
                                {column.isPrimary && (
                                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                                    PK
                                  </span>
                                )}
                                {column.isForeign && (
                                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-secondary/10 text-secondary">
                                    FK
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="relations" className="m-0 flex-1">
              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-4">
                  {schema.relations.map((relation, index) => (
                    <Card key={index} className="border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{relation.from.table}</span>
                          <span className="text-muted-foreground">→</span>
                          <span className="font-medium">{relation.to.table}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          {relation.from.table}.{relation.from.column} references {relation.to.table}.{relation.to.column}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="queries" className="m-0 flex-1">
              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-6">
                  {exampleQueries.map((query, index) => (
                    <Card key={index} className="border-border/50">
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-base">{query.description}</CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 py-2">
                        <CodeHighlight code={query.query} language="sql" />
                        {query.output && (
                          <div className="mt-4">
                            <h4 className="text-sm font-medium mb-2">Sample Output:</h4>
                            <pre className="text-xs bg-muted p-2 rounded">
                              {JSON.stringify(query.output, null, 2)}
                            </pre>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg">Upload Schema</CardTitle>
              <CardDescription>
                Upload your database schema to analyze structure and generate queries
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div 
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = '.sql,.csv,.sqlite,.db'
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) handleFileUpload(file)
                  }
                  input.click()
                }}
              >
                <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm font-medium">Drag and drop your schema files</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Support for .sql, .csv, and SQLite files
                </p>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = '.sql,.csv,.sqlite,.db'
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0]
                      if (file) handleFileUpload(file)
                    }
                    input.click()
                  }}
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Browse Files
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}