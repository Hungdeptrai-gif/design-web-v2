"use client";

import React from "react";
import { useAdminStudio } from "@/giao-dien/quan-tri/khung-quan-tri/NguCanhQuanTri";
import CauHinhSoLieuStudio from "@/giao-dien/quan-tri/07-CauHinhSoLieuStudio";

export default function AdminSoLieuPage() {
  const {
    verifiedStats,
    projects,
    totalCadSheets,
    categories,
    quotes,
    updateVerifiedStats,
  } = useAdminStudio();

  return (
    <CauHinhSoLieuStudio
      verifiedStats={verifiedStats}
      liveProjectCount={projects.length}
      liveCadSheetCount={totalCadSheets}
      liveCategoryCount={categories.length}
      liveQuoteCount={quotes.length}
      onSaveStats={updateVerifiedStats}
    />
  );
}
