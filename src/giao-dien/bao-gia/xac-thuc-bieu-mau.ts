export const OTHER_CATEGORY_KEY = "Lĩnh vực khác";

export function isValidVietnamPhone(raw: string): boolean {
  const cleaned = raw.replace(/[\s.-]/g, "");
  if (!/^(0|\+84)(2|3|5|7|8|9)[0-9]{8,9}$/.test(cleaned)) return false;
  const digitsOnly = cleaned.replace(/^\+84/, "0").slice(2);
  if (/^(\d)\1{7,}$/.test(digitsOnly)) return false;
  return true;
}

export function formatExactTimestamp(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())} — ${pad(
    date.getDate()
  )}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}
