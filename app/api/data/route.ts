import { NextResponse } from "next/server"
import sqlite3 from "sqlite3"
import { open } from "sqlite"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = parseInt(searchParams.get("limit") || "30")
  
  try {
    const db = await open({
      filename: "./data.db",
      driver: sqlite3.Database
    })

    // Get the first table name
    const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table'")
    if (tables.length === 0) {
      throw new Error("No tables found in database")
    }

    const tableName = tables[0].name
    const data = await db.all(`SELECT * FROM ${tableName} LIMIT ?`, limit)
    
    await db.close()

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    )
  }
}