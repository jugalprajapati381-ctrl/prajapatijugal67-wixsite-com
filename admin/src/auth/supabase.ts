import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

type AdminRole = 'super_admin' | 'owner' | 'content_editor' | 'enquiry_manager' | 'viewer';

interface Database {
  public: {
    Tables: {
      admin_memberships: {
        Row: { user_id: string; role: AdminRole; active: boolean; created_at: string };
        Insert: { user_id: string; role: AdminRole; active?: boolean; created_at?: string };
        Update: { role?: AdminRole; active?: boolean };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export interface AdminIdentity {
  id: string;
  email: string;
  role: string;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? '';
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() ?? '';

let configurationError: string | null = null;
let supabase: SupabaseClient<Database> | null = null;

if (supabaseUrl && supabaseKey) {
  try {
    const parsedUrl = new URL(supabaseUrl);
    const isLocalhost = ['localhost', '127.0.0.1', '[::1]'].includes(parsedUrl.hostname);
    if (parsedUrl.protocol !== 'https:' && !isLocalhost) {
      throw new Error('The Supabase URL must use HTTPS.');
    }
    supabase = createClient<Database>(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
        persistSession: true,
      },
    });
  } catch (error) {
    configurationError = error instanceof Error ? error.message : 'Invalid Supabase configuration.';
  }
} else if (supabaseUrl || supabaseKey) {
  configurationError = 'Both Supabase URL and publishable key must be configured.';
}

export const isSupabaseConfigured = supabase !== null;
export const supabaseConfigurationError = configurationError;
export { supabase };

export async function getCurrentAdmin(): Promise<AdminIdentity | null> {
  if (!supabase) return null;

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw new Error(`Could not verify the sign-in session: ${userError.message}`);
  if (!userData.user) return null;

  const { data: membership, error: membershipError } = await supabase
    .from('admin_memberships')
    .select('role')
    .eq('user_id', userData.user.id)
    .eq('active', true)
    .maybeSingle();

  if (membershipError) {
    throw new Error(`Could not verify admin access: ${membershipError.message}`);
  }
  if (!membership) return null;

  return {
    id: userData.user.id,
    email: userData.user.email ?? 'Owner account',
    role: membership.role,
  };
}

export async function signInAdmin(email: string, password: string): Promise<AdminIdentity> {
  if (!supabase) throw new Error('Supabase authentication is not configured.');

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(`Sign-in failed: ${error.message}`);

  let identity: AdminIdentity | null;
  try {
    identity = await getCurrentAdmin();
  } catch (error) {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      throw new Error(`Admin verification failed and sign-out failed: ${signOutError.message}`);
    }
    throw error;
  }
  if (identity) return identity;

  const { error: signOutError } = await supabase.auth.signOut();
  if (signOutError) {
    throw new Error(`This account has no active admin membership, and sign-out failed: ${signOutError.message}`);
  }
  throw new Error('This account does not have an active admin membership.');
}

export async function signOutAdmin(): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(`Sign-out failed: ${error.message}`);
}
