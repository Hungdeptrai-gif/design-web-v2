"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { SITE_CONFIG } from "@/cau-hinh/thong-tin-chung";
import { useDuLieuStudio } from "@/dich-vu-du-lieu/useDuLieuStudio";
import { ProjectItem } from "@/kieu-du-lieu";
import ThanhMenuTrangCon from "@/giao-dien/khung-chung/ThanhMenuTrangCon";
import ChanTrangLienHe from "@/giao-dien/khung-chung/ChanTrangLienHe";
import NutLienHeNoi from "@/giao-dien/khung-chung/NutLienHeNoi";
import BoLocVaTimKiemDuAn from "@/giao-dien/du-an/BoLocVaTimKiemDuAn";
import TheDuAn from "@/giao-dien/du-an/TheDuAn";
import ThanhPhanTrang from "@/giao-dien/du-an/ThanhPhanTrang";
import ChiTietDuAnModal from "@/giao-dien/du-an/ChiTietDuAnModal";

const ITEMS_PER_PAGE = SITE_CONFIG.stats.archiveItemsPerPage;

function DuAnArchiveContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { categories, projects } = useDuLieuStudio();

  const [activeCat, setActiveCat] = useState<string>("Tất cả");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const selectedProject = selectedProjectId
    ? projects.find((p) => p.id === selectedProjectId) || null
    : null;

  useEffect(() => {
    const catParam = searchParams.get("category");
    if (catParam) setActiveCat(catParam);
  }, [searchParams]);

  const handleRequestSimilar = (proj: ProjectItem) => {
    setSelectedProjectId(null);
    const catParam = encodeURIComponent(proj.categories[0] || "Thang máy");
    const projParam = encodeURIComponent(proj.title);
    router.push(`/bao-gia?category=${catParam}&project=${projParam}`);
  };

  const filteredProjects = projects.filter((proj) => {
    const matchCat = activeCat === "Tất cả" || proj.categories.includes(activeCat);
    const q = searchQuery.trim().toLowerCase();
    if (!q) return matchCat;
    return (
      matchCat &&
      (proj.title.toLowerCase().includes(q) ||
        proj.summary.toLowerCase().includes(q) ||
        proj.clientType.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedProjects = filteredProjects.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const goToPage = (p: number) => {
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1917] flex flex-col">
      <ThanhMenuTrangCon rightMode="quote-cta" />

      <main className="flex-1 py-10 sm:py-14 relative">
        <div className="absolute inset-x-0 top-0 h-64 bg-cad-grid mask-grid-fade pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-8">
          <BoLocVaTimKiemDuAn
            totalCount={projects.length}
            categories={categories}
            activeCat={activeCat}
            searchQuery={searchQuery}
            onSelectCat={(cat) => {
              setActiveCat(cat);
              setCurrentPage(1);
            }}
            onSearchChange={(q) => {
              setSearchQuery(q);
              setCurrentPage(1);
            }}
          />

          {paginatedProjects.length === 0 ? (
            <div className="rounded-3xl bg-white border border-[#e5e0d5] py-16 px-6 text-center space-y-3">
              <p className="text-base font-semibold text-slate-800">
                Không tìm thấy dự án nào khớp với bộ lọc hiện tại.
              </p>
              <button
                onClick={() => {
                  setActiveCat("Tất cả");
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                className="px-5 py-2 rounded-full bg-[#1e293b] text-white text-xs font-semibold cursor-pointer"
              >
                Xem lại tất cả dự án
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {paginatedProjects.map((proj) => (
                  <TheDuAn
                    key={proj.id}
                    project={proj}
                    compact
                    showFeaturedBadge
                    onSelect={(p) => setSelectedProjectId(p.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          <ThanhPhanTrang
            currentPage={safePage}
            totalPages={totalPages}
            itemsPerPage={ITEMS_PER_PAGE}
            totalItems={filteredProjects.length}
            onPageChange={goToPage}
          />
        </div>
      </main>

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

export default function DuAnPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#faf8f5]" />}>
      <DuAnArchiveContent />
    </Suspense>
  );
}
