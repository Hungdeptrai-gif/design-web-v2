"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDuLieuStudio } from "@/dich-vu-du-lieu/useDuLieuStudio";
import { ProjectItem } from "@/kieu-du-lieu";
import ThanhMenuChinh from "@/giao-dien/khung-chung/ThanhMenuChinh";
import MoDauTrangChu from "@/giao-dien/trang-chu/01-MoDauTrangChu";
import LinhVucThietKe from "@/giao-dien/trang-chu/03-LinhVucThietKe";
import DuAnTieuBieu from "@/giao-dien/trang-chu/04-DuAnTieuBieu";
import SoSanhBanVe3D from "@/giao-dien/trang-chu/05-SoSanhBanVe3D";
import DoiNguVaQuyTrinh from "@/giao-dien/trang-chu/06-DoiNguVaQuyTrinh";
import ChanTrangLienHe from "@/giao-dien/khung-chung/ChanTrangLienHe";
import NutLienHeNoi from "@/giao-dien/khung-chung/NutLienHeNoi";
import ChiTietDuAnModal from "@/giao-dien/du-an/ChiTietDuAnModal";

export default function HomePage() {
  const router = useRouter();
  const { categories, projects, comparisons, verifiedStats } = useDuLieuStudio();
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const selectedProject = selectedProjectId
    ? projects.find((p) => p.id === selectedProjectId) || null
    : null;

  const handleRequestSimilar = (proj: ProjectItem) => {
    setSelectedProjectId(null);
    const catParam = encodeURIComponent(proj.categories[0] || "Thang máy");
    const projParam = encodeURIComponent(proj.title);
    router.push(`/bao-gia?category=${catParam}&project=${projParam}`);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1917] relative overflow-x-hidden">
      <ThanhMenuChinh />
      <MoDauTrangChu verifiedStats={verifiedStats} liveProjectCount={projects.length} />
      <LinhVucThietKe categories={categories} />
      <DuAnTieuBieu projects={projects} onSelectProject={(p) => setSelectedProjectId(p.id)} />
      <SoSanhBanVe3D comparisons={comparisons} />
      <DoiNguVaQuyTrinh />
      <ChanTrangLienHe />
      <NutLienHeNoi />

      <ChiTietDuAnModal
        project={selectedProject}
        onClose={() => setSelectedProjectId(null)}
        onRequestSimilar={handleRequestSimilar}
      />
    </div>
  );
}
