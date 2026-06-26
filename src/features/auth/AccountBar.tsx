// Header control for optional cloud sync. Renders nothing when Supabase is not
// configured, so a plain local checkout sees no account UI at all.

import { useState } from 'react';

import Button from '../../components/Button';
import { useCloudSync, type SyncStatus } from './useCloudSync';
import './auth.css';

const STATUS_LABEL: Record<SyncStatus, string> = {
  idle: '',
  syncing: 'Syncing…',
  synced: 'Synced',
  error: 'Sync error',
};

export default function AccountBar() {
  const { configured, user, emailSent, status, error, signInWithEmail, signOut } =
    useCloudSync();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);

  // No backend wired: stay fully local, show nothing.
  if (!configured) return null;

  // Signed in: show a status dot, the email, and sign out.
  if (user) {
    return (
      <span className="account">
        <span className="account-chip" title={STATUS_LABEL[status] || 'Cloud sync on'}>
          <span className={`account-dot ${status}`} aria-hidden />
          <span className="account-email">{user.email}</span>
        </span>
        <Button small variant="ghost" onClick={() => void signOut()}>
          Sign out
        </Button>
      </span>
    );
  }

  // Signed out, link just sent.
  if (emailSent) {
    return (
      <span className="account">
        <span className="account-note">Check your email for a sign-in link.</span>
        <Button
          small
          variant="ghost"
          onClick={() => {
            setOpen(true);
            setEmail('');
          }}
        >
          Use another email
        </Button>
      </span>
    );
  }

  // Signed out, prompting for email.
  if (open) {
    return (
      <form
        className="account account-form"
        onSubmit={async (e) => {
          e.preventDefault();
          if (!email.trim() || busy) return;
          setBusy(true);
          try {
            await signInWithEmail(email.trim());
          } catch {
            // error surfaces via the hook's `error`
          } finally {
            setBusy(false);
          }
        }}
      >
        <input
          type="email"
          required
          autoFocus
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email for sign-in link"
        />
        <Button small variant="primary" type="submit" disabled={busy}>
          {busy ? 'Sending…' : 'Send link'}
        </Button>
        <Button small variant="ghost" type="button" onClick={() => setOpen(false)}>
          Cancel
        </Button>
        {error && <span className="account-note error">{error}</span>}
      </form>
    );
  }

  // Signed out, resting state.
  return (
    <Button small variant="ghost" onClick={() => setOpen(true)}>
      Sign in to sync
    </Button>
  );
}
