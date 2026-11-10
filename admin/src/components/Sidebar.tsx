import { ChevronLeft, ChevronRight, Leaf, X } from 'lucide-react';
import { navigationGroups } from '../data';
import type { SectionId } from '../types';

interface SidebarProps {
  active: SectionId;
  collapsed: boolean;
  mobileOpen: boolean;
  onNavigate: (id: SectionId) => void;
  onCollapse: () => void;
  onClose: () => void;
}

export default function Sidebar({
  active,
  collapsed,
  mobileOpen,
  onNavigate,
  onCollapse,
  onClose,
}: SidebarProps) {
  return (
    <>
      {mobileOpen && <button className="sidebar-backdrop" onClick={onClose} aria-label="Close navigation" />}
      <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''} ${mobileOpen ? 'sidebar--mobile-open' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-mark"><Leaf size={19} strokeWidth={2.2} /></div>
          {!collapsed && <div className="brand-copy"><strong>Hari Om</strong><span>ENTERPRISES</span></div>}
          <button className="icon-button sidebar-mobile-close" onClick={onClose} aria-label="Close navigation"><X size={18} /></button>
        </div>
        <div className="workspace-switcher">
          <span className="workspace-avatar">H</span>
          {!collapsed && <span className="workspace-copy"><strong>Hari Om Studio</strong><small>Demo workspace</small></span>}
          {!collapsed && <span className="workspace-dots">···</span>}
        </div>
        <nav className="sidebar-nav" aria-label="Admin navigation">
          {navigationGroups.map((group) => (
            <div className="nav-group" key={group.label}>
              {!collapsed && <p className="nav-group-label">{group.label}</p>}
              {group.items.map(({ id, label, icon: Icon }) => (
                <button
                  type="button"
                  key={id}
                  className={`nav-link ${active === id ? 'nav-link--active' : ''}`}
                  onClick={() => { onNavigate(id); onClose(); }}
                  title={label}
                  aria-label={label}
                  aria-current={active === id ? 'page' : undefined}
                >
                  <Icon size={18} strokeWidth={1.8} />
                  {!collapsed && <span>{label}</span>}
                  {!collapsed && id === 'enquiries' && <span className="nav-count">4</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          {!collapsed && <div className="sidebar-help"><div className="help-icon"><span>?</span></div><strong>Need a hand?</strong><p>This is a demo interface. No live support is connected.</p></div>}
          <button className="collapse-button" onClick={onCollapse} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
            {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
            {!collapsed && <span>Collapse menu</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
