"use client";

import React, { createContext, useContext, useState } from "react";
import { SITE_CONFIG } from "@/cau-hinh/thong-tin-chung";
import { useDuLieuStudio } from "@/dich-vu-du-lieu/useDuLieuStudio";
import {
  ComparisonPair,
  ProjectItem,
  QuoteLead,
  StudioVerifiedStats,
} from "@/kieu-du-lieu";

interface AdminStudioContextValue {
  categories: string[];
  projects: ProjectItem[];
  comparisons: ComparisonPair[];
  quotes: QuoteLead[];
  verifiedStats: StudioVerifiedStats;
  syncing: boolean;
  pinnedCount: number;
  totalCadSheets: number;
  quotesPending: number;
  pinNotice: string;
  saveProject: (item: ProjectItem, isEdit: boolean) => void;
  togglePin: (id: string) => void;
  deleteProject: (id: string) => void;
  addCategory: (name: string) => void;
  removeCategory: (name: string) => void;
  updateComparisons: (next: ComparisonPair[]) => Promise<void>;
  toggleQuoteStatus: (id: string) => void;
  deleteQuote: (id: string) => void;
  updateVerifiedStats: (next: StudioVerifiedStats) => Promise<void>;
}

const AdminStudioContext = createContext<AdminStudioContextValue | null>(null);

export function AdminStudioProvider({ children }: { children: React.ReactNode }) {
  const {
    categories,
    projects,
    comparisons,
    quotes,
    verifiedStats,
    syncing,
    updateCategories,
    updateProjects,
    updateComparisons,
    updateQuotes,
    updateVerifiedStats,
  } = useDuLieuStudio();

  const [pinNotice, setPinNotice] = useState<string>("");
  const maxPinned = SITE_CONFIG.stats.maxPinnedOnHome;
  const pinnedCount = projects.filter((p) => p.featured).length;
  const totalCadSheets = projects.reduce((sum, p) => sum + (p.cadSheets?.length || 0), 0);
  const quotesPending = quotes.filter((q) => q.status !== "contacted").length;

  const enforceMaxPinned = (list: ProjectItem[], priorityId?: string): ProjectItem[] => {
    let count = 0;
    return list
      .map((p) => {
        if (p.id === priorityId && p.featured) {
          count += 1;
          return p;
        }
        return p;
      })
      .map((p) => {
        if (p.id === priorityId) return p;
        if (p.featured) {
          if (count < maxPinned) {
            count += 1;
            return p;
          }
          return { ...p, featured: false };
        }
        return p;
      });
  };

  const saveProject = (item: ProjectItem, isEdit: boolean) => {
    if (isEdit) {
      const merged = projects.map((p) => (p.id === item.id ? item : p));
      void updateProjects(item.featured ? enforceMaxPinned(merged, item.id) : merged);
    } else {
      const merged = [item, ...projects];
      void updateProjects(item.featured ? enforceMaxPinned(merged, item.id) : merged);
    }
  };

  const togglePin = (id: string) => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;
    if (!target.featured) {
      const pinnedTarget: ProjectItem = { ...target, featured: true };
      const rest = projects.filter((p) => p.id !== id);
      const reordered = [pinnedTarget, ...rest];

      if (pinnedCount >= maxPinned) {
        setPinNotice(
          `Đã đưa bài lên vị trí số 1 ngoài Trang chủ (tự động bỏ ghim 1 bài cũ nhất để giữ đúng ${maxPinned} bài).`
        );
      } else {
        setPinNotice("Đã ghim dự án lên vị trí số 1 ngoài Trang chủ!");
      }
      setTimeout(() => setPinNotice(""), 4000);
      void updateProjects(enforceMaxPinned(reordered, id));
    } else {
      setPinNotice("");
      void updateProjects(projects.map((p) => (p.id === id ? { ...p, featured: false } : p)));
    }
  };

  const deleteProject = (id: string) => {
    void updateProjects(projects.filter((p) => p.id !== id));
  };

  const addCategory = (name: string) => {
    if (categories.includes(name)) return;
    void updateCategories([...categories, name]);
  };

  const removeCategory = (name: string) => {
    if (categories.length <= 1) return;
    void updateCategories(categories.filter((c) => c !== name));
  };

  const toggleQuoteStatus = (id: string) => {
    void updateQuotes(
      quotes.map((q) =>
        q.id === id
          ? { ...q, status: q.status === "contacted" ? "pending" : "contacted" }
          : q
      )
    );
  };

  const deleteQuote = (id: string) => {
    void updateQuotes(quotes.filter((q) => q.id !== id));
  };

  return (
    <AdminStudioContext.Provider
      value={{
        categories,
        projects,
        comparisons,
        quotes,
        verifiedStats,
        syncing,
        pinnedCount,
        totalCadSheets,
        quotesPending,
        pinNotice,
        saveProject,
        togglePin,
        deleteProject,
        addCategory,
        removeCategory,
        updateComparisons,
        toggleQuoteStatus,
        deleteQuote,
        updateVerifiedStats,
      }}
    >
      {children}
    </AdminStudioContext.Provider>
  );
}

export function useAdminStudio() {
  const ctx = useContext(AdminStudioContext);
  if (!ctx) {
    throw new Error("useAdminStudio phải được gọi bên trong AdminStudioProvider.");
  }
  return ctx;
}
