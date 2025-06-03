'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DatabaseIcon } from 'lucide-react';

interface SchemaSectionProps {
  onSchemaChange?: (schema: string) => void;
}

export function SchemaSection({ onSchemaChange }: SchemaSectionProps) {
  const handleSchemaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    onSchemaChange?.(event.target.value);
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center gap-2">
        <DatabaseIcon className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold">Database Schema</h2>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="schema">Enter your database schema</Label>
        <Textarea
          id="schema"
          placeholder="CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE
);"
          className="h-[200px] font-mono"
          onChange={handleSchemaChange}
        />
      </div>
    </Card>
  );
}

export default SchemaSection;