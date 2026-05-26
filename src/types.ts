export interface LinkItem {
  id: string;
  title: string;
  url: string;
  platform: "instagram" | "tiktok" | "twitter" | "linkedin" | "peerlist" | "github" | "gmail" | "custom";
  clickCount: number;
  isPublished: boolean;
  engagementRate?: number;
}

export type ThemePresetId = "cosmic" | "aurora" | "sunset" | "nordic" | "cyberpunk" | "editorial";

export interface ThemeConfig {
  id: ThemePresetId;
  name: string;
  backgroundClass: string;
  cardBgClass: string;
  textClass: string;
  accentClass: string;
  buttonClass: string;
  fontFamily: string;
  borderRadius: string; // "none" | "md" | "full"
  isDark: boolean;
}

export interface PlatformConfig {
  name: string;
  color: string;
  icon: string;
  placeholder: string;
  prefix: string;
}

export interface MetricMilestone {
  id: string;
  metric: "clicks" | "visitors" | "ctr";
  threshold: number;
  role: "owner" | "editor" | "manager" | "viewer";
  isEnabled: boolean;
  notified: boolean;
}

export interface HashtagSuggestion {
  tag: string;
  category: string;
  reachMultiplier: string;
  explanation: string;
}

export interface AnalyticsDataPoint {
  date: string;
  clicks: number;
  visitors: number;
  ctr: number;
}
