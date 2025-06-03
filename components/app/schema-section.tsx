'use client';

import { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Database, Table as TableIcon, ArrowRight, AlertCircle } from 'lucide-react';

interface Column {
  name: string;
  type: string;
  isPrimaryKey: boolean;
  references?: {
    table: string;
    column: string;
  };
}

interface Table {
  name: string;
  columns: Column[];
}

interface SchemaSectionProps {
  onSchemaChange?: (schema: string | null) => void;
}

export function SchemaSection({ onSchemaChange }: SchemaSectionProps) {
  const [schema, setSchema] = useState<string>('');
  const [tables, setTables] = useState<Table[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const parseSchema = useCallback((schemaText: string) => {
    try {
      setError(null);
      const tables: Table[] = [];
      
      // Split schema into individual CREATE TABLE statements
      const createTableStatements = schemaText.match(/CREATE TABLE.*?;/gis);
      
      if (!createTableStatements) {
        throw new Error('No valid CREATE TABLE statements found');
      }

      for (const statement of createTableStatements) {
        // Extract table name
        const tableNameMatch = statement.match(/CREATE TABLE\s+(\w+)\s*\(/i);
        if (!tableNameMatch) continue;
        
        const tableName = tableNameMatch[1];
        const columns: Column[] = [];
        
        // Extract column definitions
        const columnDefinitions = statement
          .substring(statement.indexOf('(') + 1, statement.lastIndexOf(')'))
          .split(',')
          .map(col => col.trim())
          .filter(col => col.length > 0);

        for (const colDef of columnDefinitions) {
          const [name, ...rest] = colDef.split(/\s+/);
          const type = rest[0];
          const isPrimaryKey = colDef.toLowerCase().includes('primary key');
          const refMatch = colDef.match(/references\s+(\w+)\s*\((\w+)\)/i);
          
          columns.push({
            name,
            type,
            isPrimaryKey,
            ...(refMatch && {
              references: {
                table: refMatch[1],
                column: refMatch[2]
              }
            })
          });
        }

        tables.push({ name: tableName, columns });
      }

      setTables(tables);
      onSchemaChange?.(schemaText);
      
      toast({
        title: 'Schema parsed successfully',
        description: `Found ${tables.length} tables`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse schema';
      setError(errorMessage);
      onSchemaChange?.(null);
      
      toast({
        title: 'Error parsing schema',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [onSchemaChange, toast]);

  const handleSchemaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newSchema = event.target.value;
    setSchema(newSchema);
    
    if (newSchema.trim() === '') {
      setTables([]);
      setError(null);
      onSchemaChange?.(null);
      return;
    }
  };

  const handleParseClick = () => {
    parseSchema(schema);
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Database Schema</h2>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="schema">Enter your SQL schema</Label>
            <Textarea
              id="schema"
              value={schema}
              placeholder="CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE
);"
              className="h-[200px] font-mono"
              onChange={handleSchemaChange}
            />
          </div>
          
          <div className="flex justify-end">
            <Button
              onClick={handleParseClick}
              disabled={!schema.trim()}
              className="gap-2"
            >
              Parse Schema
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {error && (
        <Card className="p-4 border-destructive/50 bg-destructive/5">
          <div className="flex gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        </Card>
      )}

      {tables.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TableIcon className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">Detected Tables</h3>
          </div>
          
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-6">
              {tables.map((table) => (
                <div key={table.name} className="space-y-2">
                  <h4 className="font-medium">{table.name}</h4>
                  <div className="rounded-md border">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr className="border-b">
                          <th className="text-left p-2">Column</th>
                          <th className="text-left p-2">Type</th>
                          <th className="text-left p-2">Constraints</th>
                        </tr>
                      </thead>
                      <tbody>
                        {table.columns.map((column, i) => (
                          <tr key={i} className="border-b last:border-0">
                            <td className="p-2">{column.name}</td>
                            <td className="p-2">{column.type}</td>
                            <td className="p-2">
                              {column.isPrimaryKey && (
                                <span className="text-xs bg-primary/10 text-primary rounded-full px-2 py-1 mr-1">
                                  PRIMARY KEY
                                </span>
                              )}
                              {column.references && (
                                <span className="text-xs bg-secondary/10 text-secondary rounded-full px-2 py-1">
                                  → {column.references.table}({column.references.column})
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
}

export default SchemaSection;