import {
  HeroSlide,
  QuoteLead,
  ServicePillar,
  SoftwareItem,
  StudioVerifiedStats,
  WorkflowStep,
} from "@/kieu-du-lieu";

export const HERO_SHOWCASE: HeroSlide[] = [
  {
    label: "Thang máy",
    title: "Kết cấu Cơ khí & Cabin Thang máy Kính",
    spec: "SolidWorks 3D • Trải phẳng tôn CNC • Hố thang phi tiêu chuẩn",
    image: "/images/elevator-clean-3d.jpg",
  },
  {
    label: "Đường ống",
    title: "Hệ thống Tuyến ống Công nghệ (Piping)",
    spec: "Plant 3D • Bản vẽ Isometric • Bóc tách vật tư MTO chuẩn xác",
    image: "/images/industrial-piping.jpg",
  },
  {
    label: "Cơ khí 3D",
    title: "Thiết bị Công nghiệp & Dựng hình 2D/3D",
    spec: "Inventor / AutoCAD • Thiết kế theo mẫu • Hồ sơ gia công chế tạo",
    image: "/images/machinery-cad.jpg",
  },
  {
    label: "Nội thất",
    title: "Không gian Nhà ở Đồng bộ Thang máy & Nội thất",
    spec: "3ds Max / SketchUp • Phối cảnh 3D • Không gian sống đồng bộ",
    image: "/images/villa-interior.jpg",
  },
];

export const MARQUEE_CAPABILITIES: string[] = [
  "THIẾT KẾ CƠ KHÍ & CABIN THANG MÁY",
  "ĐỊNH TUYẾN ĐƯỜNG ỐNG NHÀ MÁY (PIPING)",
  "TRẢI PHẲNG KIM LOẠI TẤM CHẤN ĐỘT CNC",
  "BẢN VẼ ISOMETRIC & BÓC TÁCH BOM/MTO",
  "DỰNG MÔ HÌNH 3D TỪ ẢNH CHỤP & MẪU THẬT",
  "PHỐI CẢNH KIẾN TRÚC NHÀ Ở & NỘI THẤT",
  "SOLIDWORKS • AUTOCAD PLANT 3D • INVENTOR • 3DS MAX",
];

export const SERVICE_PILLARS: ServicePillar[] = [
  {
    id: "srv-elevator",
    title: "Thiết kế Thang máy & Kết cấu Cơ khí",
    badge: "Mũi nhọn chủ lực",
    targetCategory: "Thang máy",
    description:
      "Thiết kế trọn gói cơ khí thang máy tải khách, thang kính gia đình, thang hàng: từ dựng 3D cabin, khung bệ máy đến xuất bản vẽ trải tôn CNC chuẩn xác cho xưởng sản xuất.",
    deliverables: [
      "Bản vẽ chấn đột CNC (.DXF/.DWG)",
      "Mô hình 3D SolidWorks",
      "Bản vẽ lắp đặt hố thang",
      "Bóc tách vật tư BOM",
    ],
  },
  {
    id: "srv-piping",
    title: "Hệ thống Đường ống & Thiết bị Nhà máy",
    badge: "Mũi nhọn chủ lực",
    targetCategory: "Đường ống nhà máy",
    description:
      "Thiết kế định tuyến đường ống công nghiệp (Piping), bồn bể áp lực, sàn thao tác khung thép và bố trí dây chuyền thiết bị nhà máy không xung đột khi thi công.",
    deliverables: [
      "Sơ đồ P&ID & Layout 2D/3D",
      "Bản vẽ Isometric gia công ống",
      "Kiểm tra va chạm 3D",
      "Bảng tổng hợp vật tư van/ống",
    ],
  },
  {
    id: "srv-cad3d",
    title: "Vẽ Kỹ thuật 2D & Dựng Mẫu 3D Theo Yêu cầu",
    badge: "Theo mọi mẫu có sẵn",
    targetCategory: "Dựng mẫu 2D/3D",
    description:
      "Có ảnh chụp, bản phác tay hoặc sản phẩm mẫu là dựng được hết! Số hóa bản vẽ kỹ thuật mọi loại chi tiết máy, đồ gia dụng, nội thất rời để đưa vào gia công sản xuất.",
    deliverables: [
      "File 3D (.STEP, .IGES, .STL)",
      "Bản vẽ gia công 2D có dung sai",
      "Ảnh Render 3D làm Catalogue",
    ],
  },
  {
    id: "srv-architecture",
    title: "Kiến trúc Nhà ở, Nội thất & Đồ dùng Đồng bộ",
    badge: "Tổ hợp Chuyên gia",
    targetCategory: "Nhà ở & Nội thất",
    description:
      "Triển khai phối cảnh 3D và hồ sơ thiết kế nhà phố, biệt thự, nội thất đồng bộ thang máy & đồ dùng may đo cùng đội ngũ Kiến trúc sư, Kỹ sư xây dựng chuyên sâu.",
    deliverables: [
      "Mặt bằng công năng 2D",
      "Phối cảnh 3D sắc nét",
      "Bản vẽ triển khai thi công nội thất",
    ],
  },
];

export const SOFTWARE_STACK: SoftwareItem[] = [
  { name: "SolidWorks", role: "3D Cơ khí & Kim loại tấm" },
  { name: "AutoCAD Plant 3D", role: "Đường ống Nhà máy (Piping)" },
  { name: "Autodesk Inventor", role: "Thiết bị & Cụm máy Công nghiệp" },
  { name: "AutoCAD Mechanical", role: "Bản vẽ Chế tạo & Gia công 2D" },
  { name: "Revit / Navisworks", role: "Phối hợp BIM & Chống xung đột" },
  { name: "3ds Max & SketchUp", role: "Diễn họa Kiến trúc & Nội thất" },
];

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    step: "BƯỚC 01",
    title: "Tiếp nhận Đề bài / Mẫu",
    desc: "Nhận thông số, ảnh chụp mẫu, file mặt bằng hoặc phác thảo tay qua Zalo/Web.",
  },
  {
    step: "BƯỚC 02",
    title: "Phân bổ Kỹ sư & Báo giá",
    desc: "Chốt phạm vi hồ sơ bàn giao, tiến độ và chi phí minh bạch trọn gói.",
  },
  {
    step: "BƯỚC 03",
    title: "Dựng 3D & Duyệt Phương án",
    desc: "Gửi mô hình 3D trực quan để khách hàng kiểm tra góc nhìn & kết cấu.",
  },
  {
    step: "BƯỚC 04",
    title: "Xuất Bản vẽ Sản xuất",
    desc: "Bàn giao trọn bộ file gốc CAD/3D/PDF/BOM & đồng hành hỗ trợ khi thi công.",
  },
];

export const INITIAL_QUOTES: QuoteLead[] = [];

export const INITIAL_VERIFIED_STATS: StudioVerifiedStats = {
  useLiveProjectCount: true,
  completedProjects: 9,
  partnersCount: 18,
  onTimeRate: 100,
  confidentialityRate: 100,
};
