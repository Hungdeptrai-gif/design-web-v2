"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAdminStudio } from "@/giao-dien/quan-tri/khung-quan-tri/NguCanhQuanTri";
import QuanLyKhoDuAn from "@/giao-dien/quan-tri/02-QuanLyKhoDuAn";

export default function AdminKhoDuAnPage() {
  const router = useRouter();
  const {
    categories,
    projects,
    pinnedCount,
    pinNotice,
    togglePin,
    deleteProject,
  } = useAdminStudio();

  return (
    <QuanLyKhoDuAn
      categories={categories}
      projects={projects}
      pinnedCount={pinnedCount}
      pinNotice={pinNotice}
      onTogglePin={togglePin}
      onSelectEdit={(proj) => router.push(`/admin/dang-du-an?sua=${encodeURIComponent(proj.id)}`)}
      onDeleteProject={deleteProject}
      onCreateNewClick={() => router.push("/admin/dang-du-an")}
    />
  );
}
