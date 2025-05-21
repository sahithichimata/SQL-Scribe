"use client"

import { useState } from "react"
import { CheckCheck, Copy } from "lucide-react"
import SyntaxHighlighter from "react-syntax-highlighter"
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs"

interface CodeHighlightProps {
  code: string
  language?: string
  showLineNumbers?: boolean
}

export function CodeHighlight({ 
  code, 
  language = "sql", 
  showLineNumbers = true
}: CodeHighlightProps) {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group">
      <div 
        className="absolute right-2 top-2 p-2 rounded-md bg-muted/80 hover:bg-muted cursor-pointer z-10 transition-opacity opacity-0 group-hover:opacity-100"
        onClick={handleCopy}
      >
        {copied ? (
          <CheckCheck className="h-4 w-4 text-primary" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </div>
      <SyntaxHighlighter
        language={language}
        style={atomOneDark}
        showLineNumbers={showLineNumbers}
        customStyle={{
          borderRadius: '0.5rem',
          padding: '1rem',
          fontSize: '0.875rem',
          fontFamily: 'var(--font-jetbrains)',
          margin: 0,
          backgroundColor: 'hsl(var(--muted))'
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}