"use client";

import React from "react";
import { useAdminStudio } from "@/giao-dien/quan-tri/khung-quan-tri/NguCanhQuanTri";
import TongQuanHeThong from "@/giao-dien/quan-tri/01-TongQuanHeThong";

export default function AdminTongQuanPage() {
  const { projects, categories, comparisons, quotes } = useAdminStudio();

  return (
    <TongQuanHeThong
      projects={projects}
      categoriesCount={categories.length}
      comparisonsCount={comparisons.length}
      quotes={quotes}
    />
  );
}
