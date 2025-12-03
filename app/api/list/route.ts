// app/api/list/route.ts
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

export async function GET() {
  try {
    // On récupère tous les projets P3W
    const keys = await redis.keys("p3w:*");  // ⬅️ FIX ICI, plus de <string>

    if (!keys || keys.length === 0) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    const projects = await Promise.all(
    (keys as string[]).map(async (key: string) => {
        const raw = await redis.get(key as string);
        if (!raw) return null;

        try {
        const payload = JSON.parse(raw as string);
        const projectId = (key as string).replace(/^p3w:/, "");
        const nomProjet =
            payload?.chantier?.nomProjet ||
            payload?.chantier?.projectName ||
            "";

        return { projectId, nomProjet };
        } catch {
        return null;
        }
    })
    );

    const filtered = projects.filter((p) => p !== null);

    return new Response(JSON.stringify(filtered), {
      status: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (err) {
    console.error("Error in list:", err);
    return new Response(JSON.stringify({ error: "server error" }), {
      status: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
}
