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
    // On scanne tous les keys p3w:* (compatible Upstash)
    let cursor: any = 0;
    const allKeys: string[] = [];

    do {
      const [nextCursor, keys] = await redis.scan(cursor, {
        match: "p3w:*",
        count: 100,
      });

      cursor = nextCursor as any;
      allKeys.push(...(keys as string[]));
    } while (cursor !== 0 && cursor !== "0");

    if (allKeys.length === 0) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Access-Control-Allow-Origin": "*" },
      });
    }

    const projects = await Promise.all(
      allKeys.map(async (key: string) => {
        const raw = await redis.get(key);
        if (!raw) return null;

        try {
          const data = JSON.parse(raw as string);
          const projectId = key.replace("p3w:", "");
          const nomProjet = data?.chantier?.nomProjet || "";

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
