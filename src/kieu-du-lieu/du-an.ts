export interface CadSheetItem {
  id: string;
  title: string;
  url: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  categories: string[];
  clientType: string;
  year: string;
  duration: string;
  software: string[];
  deliverables: string[];
  image: string;
  cadSheets?: CadSheetItem[];
  pdfUrl?: string;
  pdfName?: string;
  summary: string;
  challenge: string;
  solution: string;
  featured?: boolean;
}

export interface ComparisonPair {
  id: string;
  label: string;
  cadImage: string;
  renderImage: string;
  dwgCode: string;
  scale: string;
  dimensions: string[];
}
