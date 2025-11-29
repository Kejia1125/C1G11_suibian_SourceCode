import { NextResponse } from "next/server"

// Mock rooms API endpoint
export async function GET() {
  const rooms = [
    { id: "A1", name: "Tutorial Room 1" },
    { id: "A2", name: "Tutorial Room 2" },
    { id: "LIB1", name: "Library Area 1" },
    { id: "LAB1", name: "Computer Lab 1" },
    { id: "MTG1", name: "Meeting Room 1" },
  ]

  return NextResponse.json(rooms)
}
