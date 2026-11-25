import { readFile } from "fs/promises";
import path from "path";
import { INITIAL_PROJECTS } from "@/du-lieu-mau";
import { ProjectItem } from "@/kieu-du-lieu";

const DB_FILE = path.join(process.cwd(), "data", "studio-db.json");

export async function getServerProjects(): Promise<ProjectItem[]> {
  try {
    const raw = await readFile(DB_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed?.projects)) {
      return parsed.projects as ProjectItem[];
    }
    return INITIAL_PROJECTS;
  } catch {
    return INITIAL_PROJECTS;
  }
}

export async function getServerProjectById(id: string): Promise<ProjectItem | null> {
  const list = await getServerProjects();
  return list.find((p) => p.id === id) || null;
}
