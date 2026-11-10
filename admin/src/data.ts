import {
  Activity,
  BookOpen,
  BriefcaseBusiness,
  ClipboardList,
  FileImage,
  Film,
  FolderKanban,
  Gauge,
  Headphones,
  House,
  Images,
  MessageCircle,
  MessageSquareText,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { ActivityItem, DemoRecord, NavigationItem, SectionId } from './types';

export const navigationGroups: { label: string; items: NavigationItem[] }[] = [
  {
    label: 'Workspace',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: Gauge },
      { id: 'homepage', label: 'Homepage Manager', icon: House },
      { id: 'services', label: 'Services', icon: Sparkles },
    ],
  },
  {
    label: 'Content',
    items: [
      { id: 'booklets', label: 'Material Booklets', icon: BookOpen },
      { id: 'samples', label: 'Material Samples', icon: ClipboardList },
      { id: 'projects', label: 'Project Portfolio', icon: FolderKanban },
      { id: 'videos', label: 'Video Library', icon: Film },
      { id: 'media', label: 'Media Library', icon: Images },
      { id: 'testimonials', label: 'Testimonials', icon: MessageSquareText },
    ],
  },
  {
    label: 'Business',
    items: [
      { id: 'enquiries', label: 'Customer Enquiries', icon: MessageCircle },
      { id: 'chatbot', label: 'Chatbot Manager', icon: Headphones },
      { id: 'whatsapp', label: 'WhatsApp Settings', icon: MessageCircle },
    ],
  },
  {
    label: 'Administration',
    items: [
      { id: 'users', label: 'Users & Roles', icon: Users },
      { id: 'settings', label: 'Website Settings', icon: Settings },
      { id: 'audit', label: 'Audit Logs', icon: ShieldCheck },
    ],
  },
];

export const pageTitles: Record<SectionId, string> = {
  dashboard: 'Dashboard',
  homepage: 'Homepage Manager',
  services: 'Services',
  booklets: 'Material Booklets',
  samples: 'Material Samples',
  projects: 'Project Portfolio',
  videos: 'Video Library',
  enquiries: 'Customer Enquiries',
  testimonials: 'Testimonials',
  chatbot: 'Chatbot Manager',
  whatsapp: 'WhatsApp Settings',
  media: 'Media Library',
  users: 'Users & Roles',
  settings: 'Website Settings',
  audit: 'Audit Logs',
};

export const demoNote =
  'Demo data · This preview is not connected to a database or live website.';

export const booklets: DemoRecord[] = [
  {
    id: 'BK-001',
    title: 'Wood & Plywood',
    subtitle: 'Illustrative references · 10 samples',
    status: 'Draft',
    category: 'Wood',
    updated: 'Today',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'BK-002',
    title: 'Laminates & Finishes',
    subtitle: 'Illustrative references · 7 samples',
    status: 'Draft',
    category: 'Finishes',
    updated: 'Yesterday',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'BK-003',
    title: 'Marble Collection',
    subtitle: 'Illustrative references · 6 samples',
    status: 'Draft',
    category: 'Stone',
    updated: 'Oct 18, 2026',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'BK-004',
    title: 'Tiles & Surfaces',
    subtitle: 'Illustrative references · 9 samples',
    status: 'Draft',
    category: 'Tiles',
    updated: 'Oct 12, 2026',
    image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=800&q=80',
  },
];

export const mediaItems: DemoRecord[] = [
  { id: 'IMG-001', title: 'Kitchen interior reference', subtitle: 'JPG · 1.8 MB', status: 'Demo asset', category: 'Images', updated: 'Today', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=800&q=80' },
  { id: 'IMG-002', title: 'Warm wood cabinetry', subtitle: 'JPG · 2.1 MB', status: 'Demo asset', category: 'Images', updated: 'Yesterday', image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80' },
  { id: 'IMG-003', title: 'Stone finish reference', subtitle: 'WebP · 940 KB', status: 'Demo asset', category: 'Images', updated: 'Oct 18, 2026', image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80' },
  { id: 'IMG-004', title: 'Contemporary living space', subtitle: 'JPG · 1.4 MB', status: 'Demo asset', category: 'Images', updated: 'Oct 16, 2026', image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80' },
  { id: 'IMG-005', title: 'Floor tile reference', subtitle: 'WebP · 860 KB', status: 'Demo asset', category: 'Images', updated: 'Oct 11, 2026', image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=800&q=80' },
  { id: 'IMG-006', title: 'Office interior reference', subtitle: 'JPG · 1.6 MB', status: 'Demo asset', category: 'Images', updated: 'Oct 08, 2026', image: 'https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=800&q=80' },
];

export const projects: DemoRecord[] = [
  { id: 'PR-001', title: 'Kitchen design inspiration', subtitle: 'Illustrative stock image · Not a completed project', status: 'Demo only', category: 'Kitchen', updated: 'Oct 20, 2026', image: mediaItems[0].image },
  { id: 'PR-002', title: 'Wardrobe design inspiration', subtitle: 'Illustrative stock image · Not a completed project', status: 'Demo only', category: 'Carpentry', updated: 'Oct 18, 2026', image: mediaItems[1].image },
  { id: 'PR-003', title: 'Flooring design inspiration', subtitle: 'Illustrative stock image · Not a completed project', status: 'Demo only', category: 'Flooring', updated: 'Oct 12, 2026', image: mediaItems[4].image },
  { id: 'PR-004', title: 'Commercial interior inspiration', subtitle: 'Illustrative stock image · Not a completed project', status: 'Demo only', category: 'Commercial', updated: 'Oct 09, 2026', image: mediaItems[5].image },
];

export const videos: DemoRecord[] = [
  { id: 'VD-001', title: 'Kitchen inspiration', subtitle: 'Video placeholder · No video uploaded', status: 'Coming soon', category: 'Kitchen', updated: 'Not published', image: mediaItems[0].image },
  { id: 'VD-002', title: 'Commercial interiors', subtitle: 'Video placeholder · No video uploaded', status: 'Coming soon', category: 'Commercial', updated: 'Not published', image: mediaItems[5].image },
  { id: 'VD-003', title: 'Flooring and stone', subtitle: 'Video placeholder · No video uploaded', status: 'Coming soon', category: 'Flooring', updated: 'Not published', image: mediaItems[4].image },
];

export const enquiries: DemoRecord[] = [
  { id: 'ENQ-1042', title: 'Example enquiry — carpentry', subtitle: 'Illustrative record · No customer details', status: 'New', category: 'Carpentry', updated: 'Today' },
  { id: 'ENQ-1041', title: 'Example enquiry — flooring', subtitle: 'Illustrative record · No customer details', status: 'Contacted', category: 'Flooring', updated: 'Yesterday' },
  { id: 'ENQ-1040', title: 'Example enquiry — renovation', subtitle: 'Illustrative record · No customer details', status: 'Consultation Scheduled', category: 'Renovation', updated: 'Oct 18, 2026' },
  { id: 'ENQ-1039', title: 'Example enquiry — kitchen', subtitle: 'Illustrative record · No customer details', status: 'Quotation Sent', category: 'Kitchen', updated: 'Oct 16, 2026' },
];

const iconByActivity: LucideIcon = Activity;
export const activities: ActivityItem[] = [
  { title: 'Material booklet draft updated', description: 'Wood & Plywood · Demo activity', time: '2 hours ago', icon: BookOpen, color: 'bronze' },
  { title: 'Media item added to library', description: 'Kitchen interior reference · Demo activity', time: 'Yesterday', icon: FileImage, color: 'sage' },
  { title: 'Example enquiry status changed', description: 'ENQ-1041 moved to Contacted · Demo activity', time: 'Yesterday', icon: iconByActivity, color: 'blue' },
  { title: 'Project inspiration created', description: 'Wardrobe design · Demo activity', time: 'Oct 18, 2026', icon: BriefcaseBusiness, color: 'rose' },
];

export const quickActions: { label: string; target: SectionId; icon: LucideIcon; tone: string }[] = [
  { label: 'Create booklet', target: 'booklets', icon: BookOpen, tone: 'sand' },
  { label: 'Add project', target: 'projects', icon: FolderKanban, tone: 'sage' },
  { label: 'Browse media', target: 'media', icon: Images, tone: 'blue' },
  { label: 'View enquiries', target: 'enquiries', icon: MessageCircle, tone: 'rose' },
];
