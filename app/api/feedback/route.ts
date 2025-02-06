import { NextResponse } from "next/server"
import { supabase } from "../../../lib/superbase"

export async function GET() {
  try {
    const { data: feedbacks, error } = await supabase
      .from("feedbacks")
      .select("*")
      .order("timestamp", { ascending: false })

    if (error) throw error

    return NextResponse.json({ feedbacks })
  } catch (error) {
    console.error("Error fetching feedback data:", error)
    return NextResponse.json({ error: "Error fetching feedback data" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const feedback = await req.json()

    const { data, error } = await supabase.from("feedbacks").insert([feedback]).select()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Error saving feedback:", error)
    return NextResponse.json({ error: "Error saving feedback" }, { status: 500 })
  }
}
