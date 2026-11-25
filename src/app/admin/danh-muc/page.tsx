"use client";

import React from "react";
import { useAdminStudio } from "@/giao-dien/quan-tri/khung-quan-tri/NguCanhQuanTri";
import QuanLyDanhMuc from "@/giao-dien/quan-tri/04-QuanLyDanhMuc";

export default function AdminDanhMucPage() {
  const { categories, projects, addCategory, removeCategory } = useAdminStudio();

  return (
    <QuanLyDanhMuc
      categories={categories}
      projects={projects}
      onAddCategory={addCategory}
      onRemoveCategory={removeCategory}
    />
  );
}
