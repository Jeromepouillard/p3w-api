// app/api/load/route.ts
import { redis } from "../db";

export const dynamic = "force-dynamic";

// CORS preflight
export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return new Response(JSON.stringify({ error: "projectId missing" }), {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    // Correction de la syntaxe de la template string pour la clé
    const key = `p3w:${projectId}`;
    const raw = await redis.get<string>(key);

    if (!raw) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    const payload = JSON.parse(raw);

    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    console.error("Error in load:", err);
    return new Response(JSON.stringify({ error: "server error" }), {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
}