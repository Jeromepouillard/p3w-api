
// app/api/save/route.ts
import { NextResponse } from "next/server";
import { saveProject } from "../db";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.projectId) {
      return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
    }

    await saveProject(body.projectId, body);

    return NextResponse.json({
      ok: true,
      projectId: body.projectId,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Erreur API /save:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}