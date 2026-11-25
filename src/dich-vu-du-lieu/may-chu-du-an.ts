import { ProjectItem } from "@/kieu-du-lieu";

import { getSiteContent } from "./kho-du-lieu";

export async function getServerProjects(): Promise<ProjectItem[]> {
  return (await getSiteContent()).projects;
}

export async function getServerProjectById(id: string): Promise<ProjectItem | null> {
  const list = await getServerProjects();
  return list.find((p) => p.id === id) || null;
}
