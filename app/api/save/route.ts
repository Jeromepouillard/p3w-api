// app/api/save/route.ts
import { redis } from "../db";

export const dynamic = "force-dynamic";

// CORS preflight
export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.projectId) {
      return new Response(JSON.stringify({ error: "projectId missing" }), {
        status: 400,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    const key = `p3w:${body.projectId}`;

    // 🔥 On sauvegarde le projet
    await redis.set(key, JSON.stringify(body));

    // 🔥 On ajoute son ID à l’index global
    await redis.sadd("p3w:index", body.projectId);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    console.error("Error in save:", err);
    return new Response(JSON.stringify({ error: "server error" }), {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
}
