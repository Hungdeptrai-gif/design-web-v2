"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAdminStudio } from "@/giao-dien/quan-tri/khung-quan-tri/NguCanhQuanTri";
import DangVaSuaDuAn from "@/giao-dien/quan-tri/03-DangVaSuaDuAn";

function DangDuAnContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, projects, saveProject } = useAdminStudio();

  const editId = searchParams.get("sua");
  const editingProject = editId ? projects.find((p) => p.id === editId) || null : null;

  return (
    <DangVaSuaDuAn
      categories={categories}
      editingProject={editingProject}
      onCancelEdit={() => router.push("/admin/kho-du-an")}
      onSaveProject={(item, isEdit) => {
        saveProject(item, isEdit);
        if (isEdit) {
          router.push("/admin/kho-du-an");
        }
      }}
    />
  );
}

export default function AdminDangDuAnPage() {
  return (
    <Suspense fallback={<div className="p-8 rounded-3xl bg-white" />}>
      <DangDuAnContent />
    </Suspense>
  );
}
