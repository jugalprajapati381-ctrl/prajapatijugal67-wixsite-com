import {
  ArrowDown,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  FileImage,
  Filter,
  FolderKanban,
  Grid2X2,
  House,
  ImagePlus,
  LayoutList,
  MessageCircle,
  Plus,
  Search,
  SlidersHorizontal,
  Upload,
  Users,
  Video,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { activities, booklets, demoNote, enquiries, mediaItems, projects, quickActions, videos } from '../data';
import type { ActivityItem, DemoRecord, SectionId } from '../types';

interface ScreenProps {
  section: SectionId;
  query: string;
  onNavigate: (id: SectionId) => void;
  onModal: (title: string, description: string) => void;
}

const datasets: Partial<Record<SectionId, DemoRecord[]>> = {
  booklets, media: mediaItems, projects, videos, enquiries,
};

function DemoBanner() {
  return <div className="demo-banner"><span className="demo-banner-icon"><CircleHelp size={15} /></span><span><strong>Demo workspace</strong> · {demoNote.replace('Demo data · ', '')}</span></div>;
}

function Badge({ children }: { children: string }) {
  const lower = children.toLowerCase();
  const tone = lower === 'new' ? 'badge-green' : lower.includes('draft') || lower.includes('coming') ? 'badge-sand' : lower.includes('contact') || lower.includes('demo') ? 'badge-blue' : 'badge-neutral';
  return <span className={`status-badge ${tone}`}><span />{children}</span>;
}

function MetricCard({ label, value, note, icon: Icon, tone }: { label: string; value: string; note: string; icon: typeof BookOpen; tone: string }) {
  return <article className="metric-card"><div className="metric-top"><span>{label}</span><span className={`metric-icon ${tone}`}><Icon size={18} /></span></div><strong className="metric-value">{value}</strong><div className="metric-foot"><span className="metric-trend"><ArrowUpRight size={14} /> Demo</span><span>{note}</span></div></article>;
}

function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return <div className="activity-feed">{items.map(({ title, description, time, icon: Icon, color }, index) => <div className="activity-row" key={title}><span className={`activity-icon activity-icon--${color}`}><Icon size={16} /></span><div className="activity-content"><strong>{title}</strong><p>{description}</p></div><time>{time}</time>{index < items.length - 1 && <span className="activity-line" />}</div>)}</div>;
}

function Dashboard({ onNavigate }: Pick<ScreenProps, 'onNavigate'>) {
  return <>
    <DemoBanner />
    <div className="welcome-row"><div><p className="eyebrow">Tuesday, November 10, 2026</p><h2>A good day to make progress.</h2><p>Here's a snapshot of your business workspace.</p></div><button className="button button-quiet dashboard-date"><Clock3 size={16} /> Demo overview <ChevronDown size={14} /></button></div>
    <div className="metrics-grid">
      <MetricCard label="Total enquiries" value="24" note="Example records" icon={MessageCircle} tone="metric-icon--green" />
      <MetricCard label="Pending enquiries" value="08" note="Example records" icon={Clock3} tone="metric-icon--amber" />
      <MetricCard label="Projects" value="12" note="Illustrative only" icon={FolderKanban} tone="metric-icon--blue" />
      <MetricCard label="Material booklets" value="06" note="Demo categories" icon={BookOpen} tone="metric-icon--rose" />
      <MetricCard label="Media files" value="38" note="Not in storage" icon={FileImage} tone="metric-icon--lavender" />
    </div>
    <div className="dashboard-columns">
      <section className="panel activity-panel"><div className="panel-heading"><div><h3>Recent activity</h3><p>Illustrative events · Not an audit log</p></div><button className="text-button" onClick={() => onNavigate('audit')}>View all <ArrowRight size={14} /></button></div><ActivityFeed items={activities.slice(0, 4)} /></section>
      <section className="panel quick-panel"><div className="panel-heading"><div><h3>Quick actions</h3><p>Shortcuts to common tasks</p></div><span className="subtle-icon"><SlidersHorizontal size={17} /></span></div><div className="quick-actions">{quickActions.map(({ label, target, icon: Icon, tone }) => <button key={label} className="quick-action" onClick={() => onNavigate(target)}><span className={`quick-icon quick-icon--${tone}`}><Icon size={17} /></span><span>{label}</span><ArrowRight size={15} className="quick-arrow" /></button>)}</div></section>
    </div>
    <section className="panel attention-panel"><div className="attention-mark"><span>✦</span></div><div><strong>A note about this preview</strong><p>All counts, activities, enquiries, and content shown here are sample data—not live business records.</p></div><button onClick={() => onNavigate('settings')}>About the demo <ArrowRight size={14} /></button></section>
  </>;
}

function DataTable({ items, section, onModal }: { items: DemoRecord[]; section: SectionId; onModal: ScreenProps['onModal'] }) {
  const columns = section === 'enquiries' ? ['Reference', 'Service', 'Status', 'Received'] : ['Name', 'Category', 'Status', 'Last updated'];
  return <div className="table-scroll"><table className="data-table"><thead><tr>{columns.map((column) => <th key={column}>{column}<ArrowDown size={12} /></th>)}<th aria-label="Actions" /></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td><div className="table-primary"><strong>{item.title}</strong><small>{item.id} · {item.subtitle}</small></div></td><td>{item.category}</td><td><Badge>{item.status}</Badge></td><td>{item.updated}</td><td><button className="text-button" onClick={() => onModal(`Preview ${item.title}`, 'This demo record is provided to illustrate the interface. It is not stored or connected to any service.')}>View <ArrowUpRight size={14} /></button></td></tr>)}</tbody></table></div>;
}

function RecordsScreen({ section, query, onModal }: Pick<ScreenProps, 'section' | 'query' | 'onModal'>) {
  const [filter, setFilter] = useState('All items');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [localSearch, setLocalSearch] = useState('');
  const source = datasets[section] ?? [];
  const filtered = useMemo(() => source.filter((item) => {
    const recordText = `${item.title} ${item.subtitle} ${item.category} ${item.status}`.toLowerCase();
    const matchesText = recordText.includes(query.toLowerCase()) && recordText.includes(localSearch.toLowerCase());
    const matchesFilter = filter === 'All items' || item.category.toLowerCase() === filter.toLowerCase() || item.status.toLowerCase() === filter.toLowerCase();
    return matchesText && matchesFilter;
  }), [source, query, localSearch, filter]);
  const media = section === 'media';
  const portfolio = section === 'projects';
  const video = section === 'videos';
  const booklet = section === 'booklets';
  const enquiry = section === 'enquiries';
  const filterOptions = booklet ? ['All items', 'Wood', 'Finishes', 'Stone', 'Tiles'] : portfolio ? ['All items', 'Kitchen', 'Carpentry', 'Flooring', 'Commercial'] : enquiry ? ['All items', 'New', 'Contacted', 'Quotation Sent'] : ['All items'];
  const action = media ? 'Upload media' : portfolio ? 'Add project' : video ? 'Add video' : booklet ? 'Create booklet' : 'New enquiry';
  const Icon = media ? Upload : video ? Video : booklet ? BookOpen : portfolio ? FolderKanban : MessageCircle;
  const description = media ? 'Browse image placeholders for the proposed media library.' : video ? 'Video walkthrough placeholders from the public site.' : booklet ? 'Illustrative material chapters based on the existing public catalogue.' : portfolio ? 'Design inspiration examples only—not verified company projects.' : 'Example enquiry rows only. No customer information is shown or stored.';
  return <>
    <DemoBanner />
    <div className="content-intro"><div><p className="eyebrow">Workspace / Content</p><h2>{section === 'booklets' ? 'Digital catalogues, thoughtfully arranged.' : section === 'media' ? 'Your creative library.' : section === 'projects' ? 'A gallery of ideas and work.' : section === 'videos' ? 'Video library' : 'Enquiries at a glance.'}</h2><p>{description}</p></div><button className="button button-primary" onClick={() => onModal(action, `Preview the ${action.toLowerCase()} interface. No information is uploaded, saved, or published.`)}><Plus size={17} />{action}</button></div>
    <div className="toolbar"><label className="local-search"><Search size={16} /><input value={localSearch} onChange={(event) => setLocalSearch(event.target.value)} placeholder="Search this library..." aria-label="Search this library" /></label><label className="filter-select"><Filter size={15} /><select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter records">{filterOptions.map((option) => <option key={option}>{option}</option>)}</select><ChevronDown size={14} /></label>{media && <button className="button button-quiet" onClick={() => onModal('Upload media', 'Choose an image, video, or PDF to preview the upload interface. Files are not sent or saved.')}><ImagePlus size={16} /> Add files</button>}<span className="toolbar-count">{filtered.length} demo {enquiry ? 'records' : media ? 'files' : video ? 'videos' : booklet ? 'booklets' : 'projects'}</span><div className="view-switch"><button className={view === 'grid' ? 'selected' : ''} aria-label="Grid view" onClick={() => setView('grid')}><Grid2X2 size={16} /></button><button className={view === 'list' ? 'selected' : ''} aria-label="List view" onClick={() => setView('list')}><LayoutList size={17} /></button></div></div>
    {enquiry ? <section className="panel table-panel"><DataTable items={filtered} section={section} onModal={onModal} /></section> : view === 'list' ? <section className="panel table-panel"><DataTable items={filtered} section={section} onModal={onModal} /></section> : <div className={`record-grid ${media ? 'record-grid--media' : ''}`}>{filtered.map((item) => <article className="record-card" key={item.id}><div className={`record-cover ${media ? 'record-cover--media' : ''}`}>{item.image ? <img src={item.image} alt="" loading="lazy" /> : <span className="cover-placeholder"><Icon size={25} /></span>}<Badge>{item.status}</Badge><button className="cover-open" aria-label={`Preview ${item.title}`} onClick={() => onModal(`Preview ${item.title}`, 'This content is demo-only and is not published to the public website.')}><ArrowUpRight size={16} /></button></div><div className="record-body"><div className="record-category">{item.category}<span>·</span>{item.id}</div><h3>{item.title}</h3><p>{item.subtitle}</p><div className="record-footer"><span><Clock3 size={13} />{item.updated}</span><button className="text-button" onClick={() => onModal(`Edit ${item.title}`, 'This edit form is a non-persistent demo. Changes will not be saved or published.')}>Edit <ArrowRight size={14} /></button></div></div></article>)}{filtered.length === 0 && <div className="empty-state"><span><Search size={22} /></span><h3>No matching demo items</h3><p>Try a different search or filter. No live records are connected.</p><button className="button button-quiet" onClick={() => setFilter('All items')}>Clear filters</button></div>}</div>}
    <p className="screen-footnote"><ArrowDownToLine size={14} /> Demo content only · Changes, uploads and publishing are not connected.</p>
  </>;
}

function ManagerScreen({ section, onModal }: Pick<ScreenProps, 'section' | 'onModal'>) {
  const home = section === 'homepage';
  const services = section === 'services';
  const testimonial = section === 'testimonials';
  const chatbot = section === 'chatbot';
  const whatsapp = section === 'whatsapp';
  const users = section === 'users';
  const audit = section === 'audit';
  const title = home ? 'Homepage sections' : services ? 'Service offerings' : testimonial ? 'Customer feedback' : chatbot ? 'Chatbot responses' : whatsapp ? 'WhatsApp preferences' : users ? 'Team access' : audit ? 'Recent activity' : 'Site configuration';
  const subtitle = home ? 'A preview of homepage content sections; updates are not applied to the live website.' : services ? 'Service content based on the current public site.' : testimonial ? 'No genuine reviews are configured. Never publish unverified testimonials.' : chatbot ? 'Existing demo FAQ topics; responses are not dynamically connected.' : whatsapp ? 'Business contact information is not configured in this preview.' : users ? 'Authentication and user management have not been implemented.' : audit ? 'Illustrative events only. This is not a security or audit log.' : 'Demo preferences only. No settings are saved.';
  const rows = home ? [['Hero introduction', 'Headline and description', 'Draft'], ['Business highlights', 'Service area · Mumbai', 'Draft'], ['Featured images', 'Illustrative references', 'Draft']] : services ? [['Carpentry & woodwork', 'Kitchens, wardrobes and custom furniture', 'Demo'], ['Flooring & stone work', 'Tiles, marble and granite', 'Demo'], ['Interior & renovation', 'Residential and commercial interiors', 'Demo']] : testimonial ? [['Customer testimonials', 'Genuine feedback not supplied', 'Empty']] : chatbot ? [['Welcome message', 'Local FAQ guide · No AI service', 'Demo'], ['Services & materials', 'Existing FAQ references', 'Demo'], ['WhatsApp handoff', 'Requires verified business number', 'Unavailable']] : whatsapp ? [['Business number', 'Not configured', 'Unavailable'], ['Default greeting', 'Example greeting only', 'Demo'], ['Enquiry messages', 'Prepared message; customer sends manually', 'Demo']] : users ? [['Authentication', 'Not configured', 'Unavailable'], ['Role-based access', 'Requires backend implementation', 'Unavailable'], ['Invitations', 'No accounts are connected', 'Unavailable']] : audit ? activities.map((item) => [item.title, item.description, item.time]) : [['Public content API', 'Not configured', 'Unavailable'], ['Publishing workflow', 'Backend not connected', 'Demo'], ['SEO metadata', 'Existing site HTML remains unchanged', 'Demo']];
  const editLabel = home || services ? 'Edit section' : users ? 'Invite user' : testimonial ? 'Add approved review' : 'Configure';
  return <>
    <DemoBanner />
    <div className="content-intro"><div><p className="eyebrow">Workspace / Management</p><h2>{title}</h2><p>{subtitle}</p></div><button className="button button-primary" onClick={() => onModal(editLabel, `${editLabel} is available as a visual preview only. No accounts, edits, or settings will be saved.`)}><Plus size={17} />{editLabel}</button></div>
    <section className="panel manager-panel"><div className="manager-panel-heading"><div><h3>{audit ? 'Activity timeline' : 'Configured items'}</h3><p>{audit ? 'Demo events only · Not a recorded audit log' : 'Preview content · No live connection'}</p></div><button className="button button-quiet" onClick={() => onModal('Preview settings', 'This configuration preview is not saved and does not change the public website.')}><SlidersHorizontal size={16} /> Preview settings</button></div><div className="manager-list">{rows.map(([name, detail, status], index) => <div className="manager-row" key={`${name}-${index}`}><div className="manager-row-icon">{home ? <House size={18} /> : services ? <SparklesFallback /> : testimonial ? <MessageCircle size={18} /> : chatbot ? <MessageCircle size={18} /> : whatsapp ? <MessageCircle size={18} /> : users ? <Users size={18} /> : audit ? <Clock3 size={18} /> : <SettingsFallback />}</div><div className="manager-row-copy"><strong>{name}</strong><span>{detail}</span></div><Badge>{status}</Badge><button className="text-button" onClick={() => onModal(`Preview ${name}`, 'Preview only. This item is not connected to a backend and cannot be changed here.')}>View <ArrowRight size={14} /></button></div>)}</div><div className="manager-empty-note"><Check size={16} /><span>Safe preview mode · No changes can be published from this screen.</span></div></section>
  </>;
}

function SparklesFallback() { return <BookOpen size={18} />; }
function SettingsFallback() { return <SlidersHorizontal size={18} />; }

export default function Screen(props: ScreenProps) {
  if (props.section === 'dashboard') return <Dashboard onNavigate={props.onNavigate} />;
  if (datasets[props.section]) return <RecordsScreen {...props} section={props.section} />;
  return <ManagerScreen section={props.section} onModal={props.onModal} />;
}
