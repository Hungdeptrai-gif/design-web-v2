export interface StudioVerifiedStats {
  useLiveProjectCount: boolean;
  completedProjects: number;
  partnersCount: number;
  onTimeRate: number;
  confidentialityRate: number;
}

export interface ServicePillar {
  id: string;
  title: string;
  badge: string;
  targetCategory: string;
  description: string;
  deliverables: string[];
}

export interface HeroSlide {
  label: string;
  title: string;
  spec: string;
  image: string;
}

export interface SoftwareItem {
  name: string;
  role: string;
}

export interface WorkflowStep {
  step: string;
  title: string;
  desc: string;
}
