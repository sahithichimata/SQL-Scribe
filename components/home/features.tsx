"use client"

import { motion } from "framer-motion"
import { Database, Sparkles, Zap, RefreshCw, Cpu, Globe, Lock, Gauge } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const features = [
  {
    icon: <Sparkles className="h-12 w-12 text-primary" />,
    title: "Natural Language to SQL",
    description: "Translate plain English questions into precise SQL queries using advanced AI language models."
  },
  {
    icon: <Database className="h-12 w-12 text-primary" />,
    title: "Multi-Dialect Support",
    description: "Works with MySQL, PostgreSQL, SQLite, Oracle, and MS SQL Server dialects seamlessly."
  },
  {
    icon: <Zap className="h-12 w-12 text-primary" />,
    title: "Real-Time Generation",
    description: "Get instant query suggestions and auto-completions as you type with minimal latency."
  },
  {
    icon: <RefreshCw className="h-12 w-12 text-primary" />,
    title: "Schema Upload",
    description: "Upload your database schema via SQL files, CSV or SQLite databases for context-aware queries."
  },
  {
    icon: <Cpu className="h-12 w-12 text-primary" />,
    title: "Query Optimization",
    description: "Automatically optimizes your SQL queries for better performance with detailed metrics."
  },
  {
    icon: <Globe className="h-12 w-12 text-primary" />,
    title: "Syntax Highlighting",
    description: "Beautiful, customizable syntax highlighting for all supported SQL dialects."
  },
  {
    icon: <Lock className="h-12 w-12 text-primary" />,
    title: "Schema Privacy",
    description: "Your database schema never leaves your device. All processing happens locally."
  },
  {
    icon: <Gauge className="h-12 w-12 text-primary" />,
    title: "Performance Metrics",
    description: "Get detailed insights about query performance and optimization opportunities."
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
}

export function Features() {
  return (
    <div className="py-24 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Powerful Features</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Transform how you work with databases using our comprehensive set of features
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full hover:shadow-md transition-shadow border-border/50">
                <CardHeader className="pb-2">
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}