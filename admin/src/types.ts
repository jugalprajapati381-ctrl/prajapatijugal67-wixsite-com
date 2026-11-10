import type { LucideIcon } from 'lucide-react';

export type SectionId =
  | 'dashboard'
  | 'homepage'
  | 'services'
  | 'booklets'
  | 'samples'
  | 'projects'
  | 'videos'
  | 'enquiries'
  | 'testimonials'
  | 'chatbot'
  | 'whatsapp'
  | 'media'
  | 'users'
  | 'settings'
  | 'audit';

export interface NavigationItem {
  id: SectionId;
  label: string;
  icon: LucideIcon;
}

export interface DemoRecord {
  id: string;
  title: string;
  subtitle: string;
  status: string;
  category: string;
  updated: string;
  image?: string;
}

export interface ActivityItem {
  title: string;
  description: string;
  time: string;
  icon: LucideIcon;
  color: string;
}
