import { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import Modal from './components/Modal';
import Screen from './components/Screen';
import Sidebar from './components/Sidebar';
import { navigationGroups, pageTitles } from './data';
import type { SectionId } from './types';

function App() {
  const [section, setSection] = useState<SectionId>('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [dark, setDark] = useState(false);
  const [modal, setModal] = useState<{ title: string; description: string } | null>(null);

  const searchItems = useMemo(() => navigationGroups.flatMap((group) => group.items), []);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  }, [dark]);
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        document.querySelector<HTMLInputElement>('.global-search input')?.focus();
      }
      if (event.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const searchMatch = query.trim()
    ? searchItems.find((item) => item.label.toLowerCase().includes(query.trim().toLowerCase()))
    : undefined;

  function navigate(id: SectionId) {
    setSection(id);
    setQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className={`admin-app ${collapsed ? 'admin-app--collapsed' : ''}`}>
      <Sidebar active={section} collapsed={collapsed} mobileOpen={mobileOpen} onNavigate={navigate} onCollapse={() => setCollapsed(!collapsed)} onClose={() => setMobileOpen(false)} />
      <div className="app-main">
        <Header title={pageTitles[section]} search={query} onSearch={setQuery} dark={dark} onTheme={() => setDark(!dark)} onMenu={() => setMobileOpen(true)} onNavigate={navigate} />
        {searchMatch && query.trim().length > 1 && (
          <div className="search-suggestion">
            <span>Go to</span><button onClick={() => navigate(searchMatch.id)}>{searchMatch.label}</button><span>section</span>
          </div>
        )}
        <main className="page-content" key={section}><Screen section={section} query={query} onNavigate={navigate} onModal={(title, description) => setModal({ title, description })} /></main>
        <footer className="app-footer"><span>Hari Om Enterprises <span className="footer-divider">·</span> Admin Studio</span><span><i /> Prototype preview <span className="footer-divider">·</span> Not connected to the public website</span></footer>
      </div>
      {modal && <Modal title={modal.title} description={modal.description} onClose={() => setModal(null)} />}
    </div>
  );
}

export default App;
