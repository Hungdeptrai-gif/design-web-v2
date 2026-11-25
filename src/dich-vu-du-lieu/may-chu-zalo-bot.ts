/**
 * Dịch vụ kết nối Bot Zalo phía máy chủ (Lưu riêng trong data/zalo-bot-config.json để bảo mật Token).
 * Tự động lắng nghe tin nhắn kích hoạt đầu tiên để bắt Chat ID và phản hồi xác nhận ngay trên Zalo.
 */
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { QuoteLead, ZaloBotConfig } from "@/kieu-du-lieu";

const DATA_DIR = path.join(process.cwd(), "data");
const ZALO_CONFIG_FILE = path.join(DATA_DIR, "zalo-bot-config.json");

const DEFAULT_ZALO_CONFIG: ZaloBotConfig = {
  enabled: false,
  mode: "zalo-bot-api",
  botToken: "",
  chatId: "",
  customWebhookUrl: "",
};

declare global {
  // Ngăn tạo trùng tiến trình lắng nghe khi Next.js hot-reload
  var __piuZaloAutoPairRunning: boolean | undefined;
}

export interface ZaloBotInfo {
  id: string;
  account_name: string;
  display_name: string;
}

export async function loadZaloBotConfig(): Promise<ZaloBotConfig> {
  const envToken = process.env.ZALO_BOT_TOKEN?.trim() || "";
  const envChatId = process.env.ZALO_CHAT_ID?.trim() || "";

  try {
    const raw = await readFile(ZALO_CONFIG_FILE, "utf-8");
    const parsed = JSON.parse(raw) as Partial<ZaloBotConfig>;
    return {
      enabled: Boolean(parsed.enabled ?? Boolean(envToken)),
      mode: parsed.mode === "custom-webhook" ? "custom-webhook" : "zalo-bot-api",
      botToken: parsed.botToken?.trim() || envToken,
      chatId: parsed.chatId?.trim() || envChatId,
      customWebhookUrl: parsed.customWebhookUrl?.trim() || "",
    };
  } catch {
    if (envToken) {
      return {
        enabled: true,
        mode: "zalo-bot-api",
        botToken: envToken,
        chatId: envChatId,
        customWebhookUrl: "",
      };
    }
    return DEFAULT_ZALO_CONFIG;
  }
}

export async function saveZaloBotConfig(config: ZaloBotConfig): Promise<ZaloBotConfig> {
  const clean: ZaloBotConfig = {
    enabled: Boolean(config.enabled),
    mode: config.mode === "custom-webhook" ? "custom-webhook" : "zalo-bot-api",
    botToken: config.botToken.trim(),
    chatId: config.chatId.trim(),
    customWebhookUrl: config.customWebhookUrl.trim(),
  };
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(ZALO_CONFIG_FILE, JSON.stringify(clean, null, 2), "utf-8");
  return clean;
}

export async function fetchZaloBotProfile(botToken: string): Promise<ZaloBotInfo | null> {
  const token = botToken.trim();
  if (!token) return null;
  try {
    const res = await fetch(`https://bot-api.zaloplatforms.com/bot${token}/getMe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json?.ok && json?.result) {
      return json.result as ZaloBotInfo;
    }
    return null;
  } catch {
    return null;
  }
}

export async function sendZaloBotText(
  config: ZaloBotConfig,
  text: string,
  extraPayload?: Record<string, unknown>
): Promise<{ ok: boolean; detail: string }> {
  if (config.mode === "custom-webhook") {
    if (!config.customWebhookUrl) {
      return { ok: false, detail: "Chưa nhập đường dẫn Webhook Bot Zalo." };
    }
    try {
      const res = await fetch(config.customWebhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: config.chatId || undefined,
          text,
          ...extraPayload,
        }),
      });
      if (!res.ok) {
        const errBody = await res.text();
        return {
          ok: false,
          detail: `Webhook trả về mã ${res.status}: ${errBody.slice(0, 140)}`,
        };
      }
      return { ok: true, detail: "Đã gửi thông báo qua Webhook Zalo thành công!" };
    } catch (err) {
      return {
        ok: false,
        detail: `Không thể kết nối tới Webhook: ${(err as Error).message}`,
      };
    }
  }

  if (!config.botToken || !config.chatId) {
    return {
      ok: false,
      detail:
        "Đã có Bot Token nhưng chưa nhận được Chat ID. Hãy mở Zalo nhắn chữ 'hi' vào Bot Planitup Studio để tự động kích hoạt!",
    };
  }

  const endpoints = [
    `https://bot-api.zaloplatforms.com/bot${config.botToken}/sendMessage`,
    `https://bot-api.zapps.me/bot${config.botToken}/sendMessage`,
  ];

  let lastError = "Không thể kết nối máy chủ Zalo Bot.";

  for (const url of endpoints) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: config.chatId,
          text,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      const data = await res.json().catch(() => null);
      if (res.ok && (!data || data.ok !== false)) {
        return { ok: true, detail: "Đã bắn tin nhắn thành công về Zalo của bạn!" };
      }
      lastError = data?.description || data?.message || `Mã phản hồi ${res.status}`;
    } catch (err) {
      lastError = (err as Error).message;
    }
  }

  return { ok: false, detail: `Zalo Bot phản hồi: ${lastError}` };
}

function extractChatInfoFromZaloUpdate(json: unknown): {
  chatId?: string;
  senderName?: string;
} {
  if (!json || typeof json !== "object") return {};
  const root = json as Record<string, unknown>;
  if (root.ok === false || !root.result) return {};

  const candidate = (
    Array.isArray(root.result) ? root.result[root.result.length - 1] : root.result
  ) as Record<string, unknown> | undefined;
  if (!candidate) return {};

  const msg = (candidate.message || candidate) as Record<string, unknown>;
  const chat = msg.chat as Record<string, unknown> | undefined;
  const from = msg.from as Record<string, unknown> | undefined;

  const chatId = chat?.id || from?.id || candidate.chat_id || candidate.user_id;
  const senderName =
    (from?.display_name as string) ||
    (from?.name as string) ||
    (chat?.title as string) ||
    "";

  return {
    chatId: chatId ? String(chatId) : undefined,
    senderName,
  };
}

/**
 * Lắng nghe trực tiếp 1 lượt long-polling (mặc định 20 giây) để bắt Chat ID khi người dùng nhắn cho Bot.
 */
export async function detectZaloBotChatId(
  botToken: string,
  waitSeconds = 20
): Promise<{ ok: boolean; chatId?: string; senderName?: string; detail: string }> {
  const token = botToken.trim();
  if (!token) {
    return { ok: false, detail: "Vui lòng dán Bot Token trước khi dò Chat ID." };
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), (waitSeconds + 5) * 1000);
    const res = await fetch(`https://bot-api.zaloplatforms.com/bot${token}/getUpdates`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timeout: waitSeconds }),
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timer);

    const json = await res.json().catch(() => null);
    const { chatId, senderName } = extractChatInfoFromZaloUpdate(json);

    if (chatId) {
      const current = await loadZaloBotConfig();
      const updated = await saveZaloBotConfig({
        ...current,
        enabled: true,
        botToken: token,
        chatId,
      });

      await sendZaloBotText(
        updated,
        [
          "✅ [PLANITUP STUDIO — ĐÃ KẾT NỐI BOT THÀNH CÔNG]",
          `Xin chào${senderName ? ` ${senderName}` : ""}! Hệ thống website PlanItUp Studio đã liên kết với cuộc trò chuyện này.`,
          "Từ bây giờ, hễ có khách hàng gửi phiếu đăng ký báo giá mới tại /bao-gia, thông tin sẽ báo ngay lập tức về đây!",
        ].join("\n")
      );

      return {
        ok: true,
        chatId,
        senderName,
        detail: `Đã bắt thành công Chat ID (${chatId})${
          senderName ? ` của "${senderName}"` : ""
        } và gửi tin nhắn xác nhận về Zalo!`,
      };
    }
  } catch {
    // Hết thời gian chờ
  }

  return {
    ok: false,
    detail:
      "Chưa nhận được tin nhắn kích hoạt. Hãy mở Zalo nhắn chữ 'hi' vào Bot Planitup Studio!",
  };
}

/**
 * Tự động chạy ngầm chờ người dùng nhắn chữ đầu tiên vào Bot Planitup Studio (tối đa 15 phút)
 * để người dùng chỉ việc mở Zalo nhắn 'hi' là tự động kích hoạt ngay mà không cần bấm nút thủ công.
 */
export function ensureAutoPairBackgroundListener(): void {
  if (globalThis.__piuZaloAutoPairRunning) return;
  globalThis.__piuZaloAutoPairRunning = true;

  void (async () => {
    try {
      for (let attempt = 0; attempt < 40; attempt++) {
        const cfg = await loadZaloBotConfig();
        if (!cfg.botToken || cfg.mode !== "zalo-bot-api" || cfg.chatId) {
          break;
        }
        const res = await detectZaloBotChatId(cfg.botToken, 20);
        if (res.ok && res.chatId) {
          break;
        }
      }
    } finally {
      globalThis.__piuZaloAutoPairRunning = false;
    }
  })();
}

export async function notifyZaloBotNewQuote(quote: QuoteLead): Promise<void> {
  const config = await loadZaloBotConfig();
  if (!config.enabled) return;

  const zaloDigits = quote.phone.replace(/^\+84/, "0").replace(/[^0-9]/g, "");
  const lines = [
    `🔔 PHIẾU ĐĂNG KÝ BÁO GIÁ MỚI (${quote.code ? `#${quote.code}` : "WEBSITE"})`,
    `━━━━━━━━━━━━━━━━━━`,
    `👤 Khách hàng: ${quote.name}`,
    `📞 SĐT xác thực: ${quote.phone}`,
    quote.email ? `✉️ Email: ${quote.email}` : null,
    `📐 Lĩnh vực: ${quote.category}`,
    `📝 Yêu cầu: ${quote.note}`,
    `🕒 Thời gian: ${quote.createdAt}`,
    `━━━━━━━━━━━━━━━━━━`,
    `👉 Mở chat Zalo khách ngay: https://zalo.me/${zaloDigits}`,
  ].filter(Boolean);

  await sendZaloBotText(config, lines.join("\n"), { quote });
}
