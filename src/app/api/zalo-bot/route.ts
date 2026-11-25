import { NextRequest, NextResponse } from "next/server";

import { StoreUnavailableError } from "@/dich-vu-du-lieu/kho-du-lieu";
import {
  detectZaloBotChatId,
  fetchZaloBotProfile,
  loadZaloBotConfig,
  saveZaloBotConfig,
  sendZaloBotText,
} from "@/dich-vu-du-lieu/may-chu-zalo-bot";
import { isAdminRequest } from "@/dich-vu-du-lieu/xac-thuc-quan-tri";
import { SITE_CONFIG } from "@/cau-hinh/thong-tin-chung";
import type { ZaloBotConfig } from "@/kieu-du-lieu";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const unauthorized = () =>
  NextResponse.json({ ok: false, detail: "Phiên quản trị đã hết hạn. Vui lòng đăng nhập lại." }, { status: 401 });

/** The token never leaves the server: the browser only sees whether one is set and its last characters. */
function maskConfig(config: ZaloBotConfig) {
  return {
    ...config,
    botToken: "",
    hasToken: Boolean(config.botToken),
    tokenHint: config.botToken ? `…${config.botToken.slice(-4)}` : "",
  };
}

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized();
  const config = await loadZaloBotConfig();
  const botProfile = config.botToken ? await fetchZaloBotProfile(config.botToken) : null;
  return NextResponse.json({ config: maskConfig(config), botProfile });
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) return unauthorized();
  try {
    const body = await req.json();
    const action = body.action as "save" | "test" | "detect-chat-id";
    const current = await loadZaloBotConfig();

    if (action === "detect-chat-id") {
      // An empty token field means "use the saved token".
      const token = String(body.botToken || "").trim() || current.botToken;
      const result = await detectZaloBotChatId(token, 20);
      return NextResponse.json(result);
    }

    const incomingToken = String(body.config?.botToken || "").trim();
    const incoming: ZaloBotConfig = {
      enabled: Boolean(body.config?.enabled),
      mode: body.config?.mode === "custom-webhook" ? "custom-webhook" : "zalo-bot-api",
      // Keep the saved token unless the admin typed a new one.
      botToken: incomingToken || current.botToken,
      chatId: String(body.config?.chatId || ""),
      customWebhookUrl: String(body.config?.customWebhookUrl || ""),
    };
    if (incoming.mode === "custom-webhook" && incoming.customWebhookUrl && !/^https:\/\//i.test(incoming.customWebhookUrl)) {
      return NextResponse.json({ ok: false, detail: "Đường dẫn Webhook phải bắt đầu bằng https://" }, { status: 400 });
    }

    const saved = await saveZaloBotConfig(incoming);

    if (action === "test") {
      const testText = [
        `🔔 [${SITE_CONFIG.brandUpper} — KIỂM TRA BOT ZALO]`,
        "Kết nối thành công! Từ bây giờ mỗi khi có khách hàng gửi phiếu đăng ký báo giá trên website, Bot sẽ báo ngay lập tức về cuộc trò chuyện này.",
      ].join("\n");
      const sendRes = await sendZaloBotText(saved, testText, { isTest: true });
      return NextResponse.json({ config: maskConfig(saved), ...sendRes });
    }

    return NextResponse.json({ ok: true, config: maskConfig(saved), detail: "Đã lưu cấu hình kết nối Bot Zalo thành công!" });
  } catch (err) {
    if (err instanceof StoreUnavailableError) {
      return NextResponse.json({ ok: false, detail: err.message }, { status: 503 });
    }
    return NextResponse.json({ ok: false, detail: `Lỗi xử lý cấu hình Bot Zalo: ${(err as Error).message}` }, { status: 500 });
  }
}
