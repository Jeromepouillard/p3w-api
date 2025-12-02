import { NextResponse } from "next/server";
import { loadProject } from "../db";

function withCors(res: NextResponse) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

export async function OPTIONS() {
  // Réponse au preflight CORS
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return withCors(
      NextResponse.json({ error: "Missing projectId" }, { status: 400 })
    );
  }

  const record = loadProject(projectId);

  if (!record) {
    return withCors(
      NextResponse.json({ error: "Not found" }, { status: 404 })
    );
  }

  return withCors(NextResponse.json(record));
}
