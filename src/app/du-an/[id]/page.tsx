import React from "react";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { SITE_CONFIG } from "@/cau-hinh/thong-tin-chung";
import { getServerProjectById } from "@/dich-vu-du-lieu/may-chu-du-an";
import TrangChiTietDuAn from "@/giao-dien/du-an/TrangChiTietDuAn";

export const dynamic = "force-dynamic";

interface DuAnDetailPageProps {
  params: Promise<{ id: string }>;
}

async function resolveOrigin(): Promise<string> {
  try {
    const h = await headers();
    const host = h.get("x-forwarded-host") || h.get("host") || "localhost:3000";
    const proto = h.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
    return `${proto}://${host}`;
  } catch {
    return "http://localhost:3000";
  }
}

export async function generateMetadata({ params }: DuAnDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getServerProjectById(decodeURIComponent(id));

  if (!project) {
    return {
      title: `Không tìm thấy dự án | ${SITE_CONFIG.name}`,
    };
  }

  const origin = await resolveOrigin();
  const pageUrl = `${origin}/du-an/${encodeURIComponent(project.id)}`;
  const ogImage = project.image.startsWith("http")
    ? project.image
    : `${origin}${project.image.startsWith("/") ? "" : "/"}${project.image}`;

  return {
    title: `${project.title} | ${SITE_CONFIG.name}`,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      url: pageUrl,
      siteName: SITE_CONFIG.name,
      locale: "vi_VN",
      type: "article",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
      images: [ogImage],
    },
  };
}

export default async function DuAnDetailPage({ params }: DuAnDetailPageProps) {
  const { id } = await params;
  const project = await getServerProjectById(decodeURIComponent(id));

  if (!project) {
    notFound();
  }

  return <TrangChiTietDuAn project={project} />;
}
