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
    // 1) On lit la liste des ID dans le set "p3w:index"
    const ids = await redis.smembers("p3w:index");

    if (!ids || ids.length === 0) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    // 2) Pour chaque ID, on va chercher le projet complet
    const projects = await Promise.all(
      ids.map(async (projectId: string) => {
        const key = `p3w:${projectId}`;
        const raw = await redis.get(key);

        if (!raw) return null;

        // Upstash renvoie déjà un objet → pas de JSON.parse
        const data = raw as any;

        const nomProjet =
          data?.chantier?.nomProjet ||
          data?.chantier?.projectName ||
          "";

        return {
          projectId,
          nomProjet,
        };
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
