import { NextResponse } from "next/server"

import { isRecordKind, readPlannerData, writePlannerRecord } from "@/lib/google-sheets"

export async function GET() {
  try {
    return NextResponse.json(await readPlannerData())
  } catch (error) {
    console.error("Unable to read planner data", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to read planner data." },
      { status: 503 },
    )
  }
}

export async function POST(request: Request) {
  let input: {
    kind?: unknown
    id?: unknown
    item?: unknown
    operation?: unknown
  }
  try {
    input = await request.json()
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 })
  }

  if (
    !isRecordKind(input.kind) ||
    typeof input.id !== "string" ||
    !input.id ||
    (input.operation !== "upsert" && input.operation !== "delete") ||
    (input.operation === "upsert" && (!input.item || typeof input.item !== "object"))
  ) {
    return NextResponse.json({ error: "Invalid planner record." }, { status: 400 })
  }

  try {
    await writePlannerRecord({
      kind: input.kind,
      id: input.id,
      item: input.item,
      operation: input.operation,
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Unable to write planner record", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to save planner data." },
      { status: 503 },
    )
  }
}