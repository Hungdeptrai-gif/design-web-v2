/**
 * Dịch vụ tải tệp ảnh 3D, bản vẽ CAD (.PNG/.JPG/.SVG) và hồ sơ .PDF lên máy chủ (/api/upload).
 */
export async function uploadStudioFile(
  file: File
): Promise<{ url: string; fileName: string }> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      return { url: data.url, fileName: data.fileName || file.name };
    }
  } catch {
    // Fallback DataURL khi không kết nối máy chủ
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve({ url: reader.result, fileName: file.name });
      } else {
        reject(new Error("Không thể đọc tệp."));
      }
    };
    reader.onerror = () => reject(new Error("Không thể đọc tệp."));
    reader.readAsDataURL(file);
  });
}
