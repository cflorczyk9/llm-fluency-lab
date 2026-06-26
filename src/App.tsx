import { useEffect, useRef, useState } from 'react';

import Button from './components/Button';
import Tabs, { type TabItem } from './components/Tabs';
import AccountBar from './features/auth/AccountBar';
import { track } from './features/analytics/track';
import { isSupabaseConfigured } from './lib/supabase';
import { useStore } from './store/store';

import Program from './features/program/Program';
import Learn from './features/learn/Learn';
import Study from './features/study/Study';
import Dashboard from './features/dashboard/Dashboard';
import Diagnostic from './features/diagnostic/Diagnostic';

type ViewKey = 'program' | 'learn' | 'study' | 'dashboard' | 'diagnostic';

const TABS: ReadonlyArray<TabItem<ViewKey>> = [
  { key: 'program', label: 'Home' },
  { key: 'learn', label: 'Learn' },
  { key: 'study', label: 'Study' },
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'diagnostic', label: 'Diagnostic' },
];

function ActiveView({ view }: { view: ViewKey }) {
  switch (view) {
    case 'program':
      return <Program />;
    case 'learn':
      return <Learn />;
    case 'study':
      return <Study />;
    case 'dashboard':
      return <Dashboard />;
    case 'diagnostic':
      return <Diagnostic />;
  }
}

const VIEW_KEYS: ReadonlySet<ViewKey> = new Set([
  'program',
  'learn',
  'study',
  'dashboard',
  'diagnostic',
]);

function isViewKey(value: unknown): value is ViewKey {
  return typeof value === 'string' && VIEW_KEYS.has(value as ViewKey);
}

export default function App() {
  const [view, setView] = useState<ViewKey>('program');
  const fileInput = useRef<HTMLInputElement>(null);

  // Cross-tab navigation. Feature components cannot reach App's tab state
  // directly, so they ask to switch tabs by dispatching a window event. Two
  // shapes exist in the codebase:
  //   'llm-fluency-lab:nav'      detail = a view key string (Program, Diagnostic)
  //   'llm-fluency-lab:navigate' detail = { view, categoryKey } (Study visual guide)
  useEffect(() => {
    function go(target: unknown) {
      if (isViewKey(target)) {
        setView(target);
        track('view_opened', { view: target, source: 'nav' });
      }
    }
    function onNav(e: Event) {
      go((e as CustomEvent).detail);
    }
    function onNavigate(e: Event) {
      const detail = (e as CustomEvent).detail as { view?: unknown } | undefined;
      go(detail?.view);
    }
    window.addEventListener('llm-fluency-lab:nav', onNav);
    window.addEventListener('llm-fluency-lab:navigate', onNavigate);
    return () => {
      window.removeEventListener('llm-fluency-lab:nav', onNav);
      window.removeEventListener('llm-fluency-lab:navigate', onNavigate);
    };
  }, []);

  const exportJSON = useStore((s) => s.exportJSON);
  const importJSON = useStore((s) => s.importJSON);
  const resetAll = useStore((s) => s.resetAll);

  function handleExport() {
    const text = exportJSON();
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'llm-fluency-lab-backup.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importJSON(String(reader.result ?? ''));
      } catch {
        window.alert('That file could not be imported. Check it is a valid backup.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function handleReset() {
    if (window.confirm('Reset all progress? This clears your saved data on this device.')) {
      resetAll();
    }
  }

  return (
    <div className="wrap">
      <header className="top">
        <div>
          <div className="brand">
            LLM <span>Fluency</span> Lab
          </div>
          <div className="sub">
            Learn each area from a short video, check you got it, then lock it in with
            spaced repetition.
          </div>
        </div>
        <div className="toolbar">
          <Tabs
            items={TABS}
            active={view}
            onChange={(v) => {
              setView(v);
              track('view_opened', { view: v, source: 'tab' });
            }}
          />
          <Button small variant="ghost" onClick={handleExport}>
            Export
          </Button>
          <Button small variant="ghost" onClick={() => fileInput.current?.click()}>
            Import
          </Button>
          <Button small variant="ghost" onClick={handleReset}>
            Reset
          </Button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={handleImportFile}
          />
          <AccountBar />
        </div>
      </header>

      <main>
        <ActiveView view={view} />
      </main>

      <footer>
        {isSupabaseConfigured
          ? 'Local-first. Your progress stays in this browser, and syncs across devices when you sign in.'
          : 'Local-first. Your progress stays in this browser.'}
      </footer>
    </div>
  );
}
