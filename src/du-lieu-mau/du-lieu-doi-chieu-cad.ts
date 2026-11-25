import { ComparisonPair } from "@/kieu-du-lieu";

export const INITIAL_COMPARISONS: ComparisonPair[] = [
  {
    id: "cmp-elevator",
    label: "Thang máy Kính",
    cadImage: "/cad-samples/ban-ve-thang-may-tong-the.svg",
    renderImage: "/images/elevator-clean-3d.jpg",
    dwgCode: "DWG-ELV-630KG-R04",
    scale: "TỶ LỆ 1:15",
    dimensions: ["Rộng: 1400 mm", "Sâu: 1350 mm", "Cao: 2450 mm", "Tải: 630 kg"],
  },
  {
    id: "cmp-piping",
    label: "Đường ống Nhà máy",
    cadImage: "/cad-samples/ban-ve-isometric-duong-ong.svg",
    renderImage: "/images/industrial-piping.jpg",
    dwgCode: "ISO-PIP-ASME-B31.3",
    scale: "TỶ LỆ 1:25",
    dimensions: ["Ống chính: DN150", "Áp suất: PN16", "Vật liệu: SUS316L", "Xung đột: 0"],
  },
  {
    id: "cmp-villa",
    label: "Nội thất & Thang gia đình",
    cadImage: "/cad-samples/ban-ve-kien-truc-thang-gia-dinh.svg",
    renderImage: "/images/villa-interior.jpg",
    dwgCode: "ARC-VIL-INT-3D09",
    scale: "TỶ LỆ 1:50",
    dimensions: ["Tim ngang: 7600 mm", "Hố PIT: 450 mm", "OH: 2900 mm", "Đồng bộ: 100%"],
  },
];
