import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import Header from './components/Header';
import Modal from './components/Modal';
import Screen from './components/Screen';
import Sidebar from './components/Sidebar';
import { navigationGroups, pageTitles } from './data';
import { getCurrentAdmin, isSupabaseConfigured, signInAdmin, signOutAdmin, supabase, supabaseConfigurationError } from './auth/supabase';
import type { SectionId } from './types';
import type { AdminIdentity } from './auth/supabase';
import type { Session } from '@supabase/supabase-js';

const sectionPaths: Record<SectionId, string> = {
  dashboard: '/dashboard',
  homepage: '/homepage',
  services: '/services',
  booklets: '/booklets',
  samples: '/materials',
  projects: '/projects',
  videos: '/videos',
  enquiries: '/enquiries',
  testimonials: '/testimonials',
  chatbot: '/chatbot',
  whatsapp: '/whatsapp',
  media: '/media',
  users: '/users',
  settings: '/settings',
  audit: '/audit',
};

type AuthState =
  | { status: 'loading' }
  | { status: 'unconfigured'; message: string }
  | { status: 'signed_out' }
  | { status: 'unauthorized'; message: string }
  | { status: 'error'; message: string }
  | { status: 'authenticated'; identity: AdminIdentity };

interface OwnerLoginProps {
  authState: AuthState;
  onAuthenticated: (identity: AdminIdentity) => void;
}

function OwnerLogin({ authState, onAuthenticated }: OwnerLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      const identity = await signInAdmin(email.trim(), password);
      setPassword('');
      onAuthenticated(identity);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Sign-in failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="auth-title">
        <div className="auth-brand"><span className="auth-brand-mark">HO</span><span><strong>HARI OM</strong><small>ENTERPRISES</small></span></div>
        <p className="eyebrow">Owner access</p>
        <h1 id="auth-title">{authState.status === 'unconfigured' ? 'Owner sign-in is not configured.' : 'Sign in to your admin studio.'}</h1>
        <p className="auth-description">Use an invited owner account. Public registration is disabled, and admin access is verified against the protected membership table.</p>
        {authState.status === 'loading' && <div className="auth-notice" role="status"><strong>Checking secure access</strong><span>Verifying the current session and admin membership…</span></div>}
        {authState.status === 'unconfigured' && <div className="auth-notice" role="status"><strong>Access is disabled</strong><span>{authState.message}</span></div>}
        {(authState.status === 'unauthorized' || authState.status === 'error') && <p className="auth-error" role="alert">{authState.message}</p>}
        {formError && <p className="auth-error" role="alert">{formError}</p>}
        {isSupabaseConfigured && authState.status !== 'loading' && (
          <form className="auth-form" onSubmit={(event) => void handleSubmit(event)}>
            <label className="form-field">Email address
              <input type="email" name="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label className="form-field">Password
              <input type="password" name="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>
            <button className="button button-primary auth-submit" type="submit" disabled={submitting}>
              {submitting ? 'Verifying access…' : 'Sign in securely'}
            </button>
          </form>
        )}
        <a className="button button-quiet auth-home-link" href="/">Return to the public website</a>
        <p className="auth-footnote">Hari Om Enterprises · Invite-only admin area</p>
      </section>
    </main>
  );
}

interface AdminWorkspaceProps {
  identity: AdminIdentity;
  section: SectionId;
  onNavigate: (path: string) => void;
  onLogout: () => void;
}

export function AdminWorkspace({ identity, section, onNavigate, onLogout }: AdminWorkspaceProps) {
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
    setMobileOpen(false);
  }, [section]);
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

  function navigateSection(id: SectionId) {
    setQuery('');
    onNavigate(sectionPaths[id]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className={`admin-app ${collapsed ? 'admin-app--collapsed' : ''}`}>
      <Sidebar active={section} collapsed={collapsed} mobileOpen={mobileOpen} onNavigate={navigateSection} onCollapse={() => setCollapsed(!collapsed)} onClose={() => setMobileOpen(false)} />
      <div className="app-main">
        <Header title={pageTitles[section]} search={query} onSearch={setQuery} dark={dark} onTheme={() => setDark(!dark)} onMenu={() => setMobileOpen(true)} onNavigate={navigateSection} identity={identity} onLogout={onLogout} />
        {searchMatch && query.trim().length > 1 && (
          <div className="search-suggestion">
            <span>Go to</span><button onClick={() => navigateSection(searchMatch.id)}>{searchMatch.label}</button><span>section</span>
          </div>
        )}
        <main className="page-content" key={section}><Screen section={section} query={query} onNavigate={navigateSection} onModal={(title, description) => setModal({ title, description })} /></main>
        <footer className="app-footer"><span>Hari Om Enterprises <span className="footer-divider">·</span> Admin Studio</span><span><i /> Prototype preview <span className="footer-divider">·</span> Not connected to the public website</span></footer>
      </div>
      {modal && <Modal title={modal.title} description={modal.description} onClose={() => setModal(null)} />}
    </div>
  );
}

function App() {
  const [pathname, setPathname] = useState(window.location.pathname);
  const [authState, setAuthState] = useState<AuthState>({ status: 'loading' });

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (!supabase) {
      setAuthState({
        status: 'unconfigured',
        message: supabaseConfigurationError ?? 'Configure the Supabase project URL and publishable key to enable sign-in.',
      });
      return;
    }

    let active = true;
    let revision = 0;
    const client = supabase;

    async function applySession(session: Session | null, currentRevision: number) {
      if (!session) {
        if (active && currentRevision === revision) setAuthState({ status: 'signed_out' });
        return;
      }

      try {
        const identity = await getCurrentAdmin();
        if (!active || currentRevision !== revision) return;
        if (identity) {
          setAuthState({ status: 'authenticated', identity });
        } else {
          setAuthState({ status: 'unauthorized', message: 'This account does not have an active admin membership.' });
        }
      } catch (error) {
        if (active && currentRevision === revision) {
          setAuthState({ status: 'error', message: error instanceof Error ? error.message : 'Could not verify admin access.' });
        }
      }
    }

    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      const currentRevision = ++revision;
      window.setTimeout(() => { void applySession(session, currentRevision); }, 0);
    });

    const initialRevision = ++revision;
    void client.auth.getSession().then(({ data, error }) => {
      if (error) throw error;
      return applySession(data.session, initialRevision);
    }).catch((error: unknown) => {
      if (active && initialRevision === revision) {
        setAuthState({ status: 'error', message: error instanceof Error ? error.message : 'Could not load the sign-in session.' });
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const normalizedPath = pathname.replace(/\/+$/, '');
  const section = navigationGroups
    .flatMap((group) => group.items)
    .find((item) => normalizedPath === `/admin${sectionPaths[item.id]}`)?.id;

  function navigateAdmin(path: string, replace = false) {
    if (replace) window.history.replaceState(null, '', path);
    else window.history.pushState(null, '', path);
    setPathname(window.location.pathname);
  }

  useEffect(() => {
    if (!normalizedPath.startsWith('/admin') || authState.status === 'loading') return;
    if (authState.status === 'authenticated') {
      if (!section) navigateAdmin('/admin/dashboard', true);
    } else if (normalizedPath !== '/admin') {
      navigateAdmin('/admin', true);
    }
  }, [authState, normalizedPath, section]);

  async function handleLogout() {
    try {
      await signOutAdmin();
      navigateAdmin('/admin', true);
    } catch (error) {
      setAuthState({ status: 'error', message: error instanceof Error ? error.message : 'Could not sign out.' });
    }
  }

  if (authState.status === 'authenticated' && section) {
    return <AdminWorkspace identity={authState.identity} section={section} onNavigate={navigateAdmin} onLogout={() => { void handleLogout(); }} />;
  }
  return (
    <OwnerLogin
      authState={authState}
      onAuthenticated={(identity) => {
        setAuthState({ status: 'authenticated', identity });
        navigateAdmin('/admin/dashboard', true);
      }}
    />
  );
}

export default App;
