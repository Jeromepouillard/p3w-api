// app/api/db.ts
const memoryDb: Record<string, any> = {};

export function saveProject(projectId: string, data: any) {
  memoryDb[projectId] = data;
}

export function loadProject(projectId: string) {
  return memoryDb[projectId];
}
