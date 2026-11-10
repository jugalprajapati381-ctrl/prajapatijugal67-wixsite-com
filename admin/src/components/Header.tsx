import { Bell, ChevronDown, Menu, Moon, Search, Sun } from 'lucide-react';
import { useState } from 'react';
import type { SectionId } from '../types';

interface HeaderProps {
  title: string;
  search: string;
  onSearch: (value: string) => void;
  dark: boolean;
  onTheme: () => void;
  onMenu: () => void;
  onNavigate: (id: SectionId) => void;
}

export default function Header({ title, search, onSearch, dark, onTheme, onMenu, onNavigate }: HeaderProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-button mobile-menu-button" onClick={onMenu} aria-label="Open navigation"><Menu size={20} /></button>
        <div><p className="breadcrumb">Studio <span>/</span> <strong>{title}</strong></p><h1>{title}</h1></div>
      </div>
      <div className="topbar-actions">
        <label className="global-search">
          <Search size={17} />
          <input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search anything..." aria-label="Search demo content" />
          <kbd>⌘ K</kbd>
        </label>
        <div className="popover-wrap">
          <button className={`icon-button notification-button ${notificationsOpen ? 'is-open' : ''}`} onClick={() => { setNotificationsOpen(!notificationsOpen); setProfileOpen(false); }} aria-label="Notifications">
            <Bell size={18} /><span className="notification-dot" />
          </button>
          {notificationsOpen && <div className="popover notification-popover"><strong>Notifications</strong><p>You're viewing demo data. Notifications are not connected.</p><button onClick={() => setNotificationsOpen(false)}>Got it</button></div>}
        </div>
        <button className="icon-button theme-button" onClick={onTheme} aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
        <div className="popover-wrap profile-wrap">
          <button className="profile-button" onClick={() => { setProfileOpen(!profileOpen); setNotificationsOpen(false); }} aria-expanded={profileOpen}>
            <span className="profile-avatar">HO</span><span className="profile-copy"><strong>Demo owner</strong><small>Preview mode</small></span><ChevronDown size={15} />
          </button>
          {profileOpen && <div className="popover profile-popover"><strong>Demo profile</strong><p>No account is signed in. Authentication has not been implemented.</p><button onClick={() => { onNavigate('settings'); setProfileOpen(false); }}>Website settings</button></div>}
        </div>
      </div>
    </header>
  );
}
