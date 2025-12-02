
// app/api/save/route.ts
import { NextResponse } from "next/server";
import { saveProject } from "../db";

function withCors(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectId, chantier, intervenants } = body;

    if (!projectId) {
      return withCors(
        NextResponse.json({ error: "Missing projectId" }, { status: 400 })
      );
    }

    saveProject(projectId, chantier, intervenants);

    return withCors(
      NextResponse.json({
        ok: true,
        updatedAt: new Date().toISOString(),
      })
    );
  } catch (err) {
    return withCors(
      NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    );
  }
}
