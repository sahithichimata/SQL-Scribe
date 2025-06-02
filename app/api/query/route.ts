import { NextResponse } from "next/server"
import sqlite3 from "sqlite3"
import { open } from "sqlite"

export async function POST(request: Request) {
  try {
    const { query } = await request.json()
    
    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      )
    }

    // Basic SQL injection prevention
    if (query.toLowerCase().includes("drop") || 
        query.toLowerCase().includes("delete") ||
        query.toLowerCase().includes("truncate")) {
      return NextResponse.json(
        { error: "Operation not allowed" },
        { status: 403 }
      )
    }

    const db = await open({
      filename: "./data.db",
      driver: sqlite3.Database
    })

    const data = await db.all(query)
    await db.close()

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Query error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to execute query" },
      { status: 500 }
    )
  }
}