"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  INITIAL_CATEGORIES,
  INITIAL_COMPARISONS,
  INITIAL_PROJECTS,
  INITIAL_QUOTES,
  INITIAL_VERIFIED_STATS,
} from "@/du-lieu-mau";
import {
  STUDIO_CHANNEL_NAME,
  STUDIO_LOCAL_EVENT,
  StudioSnapshot,
  studioStorage,
} from "@/dich-vu-du-lieu/luu-tru";
import {
  ComparisonPair,
  ProjectItem,
  QuoteLead,
  StudioVerifiedStats,
} from "@/kieu-du-lieu";

export function useDuLieuStudio() {
  const [categories, setCategories] = useState<string[]>(INITIAL_CATEGORIES);
  const [projects, setProjects] = useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [comparisons, setComparisons] = useState<ComparisonPair[]>(INITIAL_COMPARISONS);
  const [quotes, setQuotes] = useState<QuoteLead[]>(INITIAL_QUOTES);
  const [verifiedStats, setVerifiedStats] =
    useState<StudioVerifiedStats>(INITIAL_VERIFIED_STATS);
  const [syncing, setSyncing] = useState<boolean>(false);
  const lastUpdatedAtRef = useRef<number>(0);

  const applyPartial = useCallback((data: Partial<StudioSnapshot>) => {
    if (data.updatedAt && data.updatedAt < lastUpdatedAtRef.current) {
      return;
    }
    if (data.updatedAt) {
      lastUpdatedAtRef.current = data.updatedAt;
    }
    if (Array.isArray(data.categories)) setCategories(data.categories);
    if (Array.isArray(data.projects)) setProjects(data.projects);
    if (Array.isArray(data.comparisons)) setComparisons(data.comparisons);
    if (Array.isArray(data.quotes)) setQuotes(data.quotes);
    if (data.verifiedStats) setVerifiedStats(data.verifiedStats);
  }, []);

  const refreshFromServer = useCallback(async () => {
    const serverData = await studioStorage.syncFromServer();
    if (serverData) {
      applyPartial(serverData);
    }
  }, [applyPartial]);

  useEffect(() => {
    setCategories(studioStorage.getCategories());
    setProjects(studioStorage.getProjects());
    setComparisons(studioStorage.getComparisons());
    setQuotes(studioStorage.getQuotes());
    setVerifiedStats(studioStorage.getVerifiedStats());
    void refreshFromServer();

    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel(STUDIO_CHANNEL_NAME);
      bc.onmessage = (ev: MessageEvent<Partial<StudioSnapshot>>) => {
        if (ev.data) applyPartial(ev.data);
      };
    } catch {
      bc = null;
    }

    const handleLocalUpdate = (ev: Event) => {
      const custom = ev as CustomEvent<Partial<StudioSnapshot>>;
      if (custom.detail) applyPartial(custom.detail);
    };

    const handleFocus = () => {
      void refreshFromServer();
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        void refreshFromServer();
      }
    };

    const pollTimer = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void refreshFromServer();
      }
    }, 2000);

    window.addEventListener(STUDIO_LOCAL_EVENT, handleLocalUpdate);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (bc) bc.close();
      window.clearInterval(pollTimer);
      window.removeEventListener(STUDIO_LOCAL_EVENT, handleLocalUpdate);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [applyPartial, refreshFromServer]);

  const updateCategories = async (next: string[]) => {
    setCategories(next);
    setSyncing(true);
    await studioStorage.saveCategories(next);
    setSyncing(false);
  };

  const updateProjects = async (next: ProjectItem[]) => {
    setProjects(next);
    setSyncing(true);
    await studioStorage.saveProjects(next);
    setSyncing(false);
  };

  const updateComparisons = async (next: ComparisonPair[]) => {
    setComparisons(next);
    setSyncing(true);
    await studioStorage.saveComparisons(next);
    setSyncing(false);
  };

  const updateQuotes = async (next: QuoteLead[]) => {
    setQuotes(next);
    setSyncing(true);
    await studioStorage.saveQuotes(next);
    setSyncing(false);
  };

  const updateVerifiedStats = async (next: StudioVerifiedStats) => {
    setVerifiedStats(next);
    setSyncing(true);
    await studioStorage.saveVerifiedStats(next);
    setSyncing(false);
  };

  return {
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
    refresh: refreshFromServer,
  };
}
