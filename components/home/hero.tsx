"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Database, ArrowRight } from "lucide-react"
import Link from "next/link"
import { ParticlesBackground } from "@/components/ui/particles-background"

export function Hero() {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-30">
        <ParticlesBackground />
      </div>
      
      <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 pb-32 pt-12 md:pt-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block mb-6 p-2 bg-accent/10 rounded-full"
          >
            <span className="flex items-center text-sm font-medium px-3 py-1">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Now with support for 5+ SQL dialects
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
          >
            Speak to Your Database.
            <br />
            <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
              Let AI Handle the SQL.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto"
          >
            Transform natural language into optimized SQL queries with our AI-powered assistant. 
            Support for MySQL, PostgreSQL, SQLite, Oracle, and MS SQL Server.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/app">
              <Button 
                size="lg"
                className="group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <span>Try Now</span>
                <motion.span
                  animate={{ x: isHovered ? 5 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="ml-2 h-4 w-4" />
                </motion.span>
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline">
                <Database className="mr-2 h-4 w-4" />
                <span>Upload Schema</span>
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}