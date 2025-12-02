// app/api/db.ts
type RecordP3W = {
  chantier: any;
  intervenants: any;
  updatedAt: string;
};

const memoryDb: Record<string, RecordP3W> = {};

export function saveProject(projectId: string, chantier: any, intervenants: any) {
  memoryDb[projectId] = {
    chantier,
    intervenants,
    updatedAt: new Date().toISOString(),
  };
}

export function loadProject(projectId: string) {
  return memoryDb[projectId] || null;
}