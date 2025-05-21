"use client"

import { useState, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Upload, Database, PlusCircle, RefreshCcw, FolderOpen, List, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"

interface Table {
  name: string
  columns: { name: string; type: string; description?: string }[]
}

interface Schema {
  name: string
  tables: Table[]
}

// Sample schema data
const sampleSchema: Schema = {
  name: "E-commerce Database",
  tables: [
    {
      name: "customers",
      columns: [
        { name: "customer_id", type: "uuid", description: "Primary key" },
        { name: "first_name", type: "varchar" },
        { name: "last_name", type: "varchar" },
        { name: "email", type: "varchar", description: "Unique" },
        { name: "created_at", type: "timestamp" },
      ]
    },
    {
      name: "orders",
      columns: [
        { name: "order_id", type: "uuid", description: "Primary key" },
        { name: "customer_id", type: "uuid", description: "Foreign key to customers" },
        { name: "order_date", type: "timestamp" },
        { name: "status", type: "varchar" },
        { name: "total_amount", type: "decimal" },
      ]
    },
    {
      name: "products",
      columns: [
        { name: "product_id", type: "uuid", description: "Primary key" },
        { name: "product_name", type: "varchar" },
        { name: "description", type: "text" },
        { name: "price", type: "decimal" },
        { name: "category", type: "varchar" },
        { name: "inventory_count", type: "integer" },
      ]
    },
    {
      name: "order_items",
      columns: [
        { name: "item_id", type: "uuid", description: "Primary key" },
        { name: "order_id", type: "uuid", description: "Foreign key to orders" },
        { name: "product_id", type: "uuid", description: "Foreign key to products" },
        { name: "quantity", type: "integer" },
        { name: "unit_price", type: "decimal" },
      ]
    }
  ]
};

interface AppSchemaSectionProps {
  onSchemaChange?: (schema: Schema | null) => void;
}

export function AppSchemaSection({ onSchemaChange }: AppSchemaSectionProps) {
  const { toast } = useToast()
  const [schema, setSchema] = useState<Schema | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  
  const filteredTables = schema?.tables.filter(table => 
    table.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []
  
  const handleFileUpload = useCallback(async (file?: File) => {
    try {
      if (file) {
        // Handle actual file upload here
        const reader = new FileReader()
        reader.onload = (e) => {
          try {
            // Parse the file content and validate schema
            const newSchema = sampleSchema // Replace with actual schema parsing
            setSchema(newSchema)
            onSchemaChange?.(newSchema)
            toast({
              title: "Schema Uploaded",
              description: "Database schema has been successfully loaded.",
            })
          } catch (error) {
            toast({
              title: "Error",
              description: "Failed to parse schema file. Please check the format.",
              variant: "destructive"
            })
          }
        }
        reader.readAsText(file)
      } else {
        toast({
          title: "Schema Upload",
          description: "Please select a file to upload.",
        })
      }
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
    onSchemaChange?.(null)
    toast({
      title: "Schema Removed",
      description: "The current schema has been removed.",
    })
  }, [toast, onSchemaChange])

  const handleUseSampleSchema = useCallback(() => {
    setSchema(sampleSchema)
    onSchemaChange?.(sampleSchema)
    toast({
      title: "Sample Schema Loaded",
      description: "Sample e-commerce database schema has been loaded.",
    })
  }, [onSchemaChange, toast])

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
          <div className="mb-4 relative">
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
            </TabsList>
            
            <TabsContent value="tables" className="flex-1 m-0">
              <ScrollArea className="flex-1 h-[calc(100vh-300px)]">
                <div className="space-y-4">
                  {filteredTables.map((table) => (
                    <Card key={table.name} className="border-border/50">
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
                                {column.description && (
                                  <span className="text-xs px-1.5 py-0.5 rounded-full bg-secondary/10 text-secondary">
                                    {column.description}
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
              <div className="flex items-center justify-center h-full">
                <Card className="w-full">
                  <CardHeader>
                    <CardTitle className="text-base">Entity Relationship Diagram</CardTitle>
                    <CardDescription>
                      Visual representation of database relationships
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center py-8">
                    <div className="text-center text-muted-foreground">
                      <Database className="h-12 w-12 mx-auto mb-4 opacity-20" />
                      <p>ERD visualization would be displayed here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="text-lg">Upload Schema</CardTitle>
              <CardDescription>
                Upload your database schema to generate better queries
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
                
                <Button variant="ghost" className="w-full" onClick={handleUseSampleSchema}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Use Sample Schema
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}