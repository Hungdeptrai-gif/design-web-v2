"use client";

import React from "react";
import { useAdminStudio } from "@/giao-dien/quan-tri/khung-quan-tri/NguCanhQuanTri";
import QuanLyDoiChieuCAD from "@/giao-dien/quan-tri/05-QuanLyDoiChieuCAD";

export default function AdminDoiChieuCADPage() {
  const { comparisons, updateComparisons } = useAdminStudio();

  return (
    <QuanLyDoiChieuCAD
      comparisons={comparisons}
      onUpdateComparisons={updateComparisons}
    />
  );
}
