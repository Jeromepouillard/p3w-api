// app/api/db.ts
import { Redis } from "@upstash/redis";

// On initialise le client Redis avec les variables d'environnement Vercel
export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

// Enregistre un projet (écrasement complet)
export async function saveProject(projectId: string, data: any) {
  await redis.set(`p3w:${projectId}`, data);
}

// Charge un projet (retourne null si inexistant)
export async function loadProject(projectId: string) {
  return await redis.get(`p3w:${projectId}`);
}