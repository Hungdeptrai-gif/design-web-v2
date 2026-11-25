import React from "react";
import { MessageSquare, PhoneCall } from "lucide-react";
import { SITE_CONFIG } from "@/cau-hinh/thong-tin-chung";

export default function NutLienHeNoi() {
  return (
    <div className="fixed bottom-5 right-5 z-30 flex flex-col gap-2.5">
      <a
        href={SITE_CONFIG.contact.zaloUrl}
        target="_blank"
        rel="noreferrer"
        className="px-4 py-3 rounded-full bg-white hover:bg-stone-50 border border-[#dfd9cd] text-slate-900 font-bold text-xs shadow-lg flex items-center gap-2 transition"
      >
        <MessageSquare className="w-4 h-4 text-[#b45309]" /> Chat Zalo Kỹ Thuật
      </a>
      <a
        href={SITE_CONFIG.contact.phoneHref}
        className="px-4 py-3 rounded-full bg-[#1e293b] hover:bg-slate-800 text-white font-bold text-xs shadow-xl flex items-center gap-2 transition"
      >
        <PhoneCall className="w-4 h-4 text-amber-300" /> {SITE_CONFIG.contact.phoneDisplay}
      </a>
    </div>
  );
}
