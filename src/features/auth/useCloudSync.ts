// Optional cloud sync, wired to the auth session.
//
// Local-first is preserved: the Zustand store still persists to localStorage and
// the app works fully signed out. This hook only adds a cloud copy on top.
//
// On sign-in it reconciles without data loss:
//   1. pull the cloud snapshot
//   2. merge it with whatever is already on this device (mergeSnapshots)
//   3. load the merged result into the store (so the screen updates)
//   4. push the merged result back, so device and cloud converge
// After that, any change to the store is pushed to the cloud, debounced.

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';

import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { useStore } from '../../store/store';
import { mergeSnapshots } from './merge';
import { pullSnapshot, pushSnapshot } from './cloud';
import { setAnalyticsUserId } from '../analytics/track';

export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error';

const PUSH_DEBOUNCE_MS = 1500;

export interface CloudSync {
  configured: boolean;
  user: User | null;
  emailSent: boolean;
  status: SyncStatus;
  error: string | null;
  signInWithEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export function useCloudSync(): CloudSync {
  const [user, setUser] = useState<User | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [status, setStatus] = useState<SyncStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  // Guards so the initial reconcile runs once per signed-in user, and so the
  // store writes we make while applying remote data don't echo back as pushes.
  const reconciledFor = useRef<string | null>(null);
  const applyingRemote = useRef(false);
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track the auth session.
  useEffect(() => {
    if (!supabase) return;
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setAnalyticsUserId(data.session?.user?.id ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        setUser(session?.user ?? null);
        setAnalyticsUserId(session?.user?.id ?? null);
        if (session?.user) setEmailSent(false);
      },
    );
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  // Initial reconcile when a user signs in.
  useEffect(() => {
    if (!supabase || !user) {
      if (!user) {
        reconciledFor.current = null;
        setStatus('idle');
      }
      return;
    }
    if (reconciledFor.current === user.id) return;
    reconciledFor.current = user.id;

    let cancelled = false;
    (async () => {
      setStatus('syncing');
      setError(null);
      try {
        const remote = await pullSnapshot(user.id);
        const local = useStore.getState().getSnapshot();
        const merged = remote ? mergeSnapshots(local, remote) : local;
        if (cancelled) return;
        applyingRemote.current = true;
        useStore.getState().loadSnapshot(merged);
        applyingRemote.current = false;
        await pushSnapshot(user.id, useStore.getState().getSnapshot());
        if (!cancelled) setStatus('synced');
      } catch (e) {
        applyingRemote.current = false;
        if (!cancelled) {
          setStatus('error');
          setError(e instanceof Error ? e.message : 'Sync failed');
          reconciledFor.current = null; // allow a retry on next change
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user]);

  // Push store changes to the cloud while signed in, debounced.
  useEffect(() => {
    if (!supabase || !user) return;
    const unsub = useStore.subscribe(() => {
      if (applyingRemote.current) return;
      if (pushTimer.current) clearTimeout(pushTimer.current);
      pushTimer.current = setTimeout(() => {
        setStatus('syncing');
        pushSnapshot(user.id, useStore.getState().getSnapshot())
          .then(() => setStatus('synced'))
          .catch((e) => {
            setStatus('error');
            setError(e instanceof Error ? e.message : 'Sync failed');
          });
      }, PUSH_DEBOUNCE_MS);
    });
    return () => {
      unsub();
      if (pushTimer.current) clearTimeout(pushTimer.current);
    };
  }, [user]);

  const signInWithEmail = useCallback(async (email: string) => {
    if (!supabase) return;
    setError(null);
    const { error: err } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    if (err) {
      setError(err.message);
      throw err;
    }
    setEmailSent(true);
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    if (pushTimer.current) clearTimeout(pushTimer.current);
    await supabase.auth.signOut();
    setEmailSent(false);
    setStatus('idle');
    // Local data stays on the device; signing out never wipes progress.
  }, []);

  return {
    configured: isSupabaseConfigured,
    user,
    emailSent,
    status,
    error,
    signInWithEmail,
    signOut,
  };
}
