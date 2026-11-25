"use client";

import React, { useState, useEffect } from "react";
import { studioStorage } from "@/dich-vu-du-lieu/luu-tru";
import ManHinhDangNhap from "@/giao-dien/quan-tri/khung-quan-tri/ManHinhDangNhap";
import ThanhTieuDeAdmin from "@/giao-dien/quan-tri/khung-quan-tri/ThanhTieuDeAdmin";
import MenuDocAdmin from "@/giao-dien/quan-tri/khung-quan-tri/MenuDocAdmin";
import {
  AdminStudioProvider,
  useAdminStudio,
} from "@/giao-dien/quan-tri/khung-quan-tri/NguCanhQuanTri";

function KhungNoiDungAdmin({
  children,
  onLogout,
}: {
  children: React.ReactNode;
  onLogout: () => void;
}) {
  const { projects, categories, comparisons, quotes, quotesPending, syncing } =
    useAdminStudio();

  return (
    <div className="min-h-screen bg-[#f3efe8] text-[#1c1917] flex flex-col">
      <ThanhTieuDeAdmin syncing={syncing} onLogout={onLogout} />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7 flex flex-col lg:flex-row gap-6 items-start">
        <MenuDocAdmin
          counts={{
            projects: projects.length,
            categories: categories.length,
            comparisons: comparisons.length,
            quotesTotal: quotes.length,
            quotesPending,
          }}
        />
        <main className="flex-1 w-full min-w-0">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [hydrated, setHydrated] = useState<boolean>(false);

  useEffect(() => {
    setAuthenticated(studioStorage.isAdminAuthenticated());
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return <div className="min-h-screen bg-[#1e293b]" />;
  }

  if (!authenticated) {
    return (
      <ManHinhDangNhap
        onSuccess={() => {
          studioStorage.setAdminAuthenticated(true);
          setAuthenticated(true);
        }}
      />
    );
  }

  return (
    <AdminStudioProvider>
      <KhungNoiDungAdmin
        onLogout={() => {
          studioStorage.setAdminAuthenticated(false);
          setAuthenticated(false);
        }}
      >
        {children}
      </KhungNoiDungAdmin>
    </AdminStudioProvider>
  );
}
