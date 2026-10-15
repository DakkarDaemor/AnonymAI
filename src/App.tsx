import { useCallback, useState } from 'react';
import BackupPanel from './components/BackupPanel';
import ChatList from './components/ChatList';
import ChatPanel from './components/ChatPanel';
import Drawer from './components/Drawer';
import ModelSelect from './components/ModelSelect';
import ProvidersEditor from './components/ProvidersEditor';
import RulesEditor from './components/RulesEditor';

type Panel = 'chats' | 'settings' | null;

const MENU_ICON = 'M3 5h14M3 10h14M3 15h14';
const SETTINGS_ICON = 'M4 6h12M4 14h12M7 4v4M13 12v4';

function IconButton({ path, label, onClick }: { path: string; label: string; onClick: () => void }) {
  return (
    <button className="btn-ghost p-2 lg:hidden" aria-label={label} onClick={onClick}>
      <svg className="size-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden>
        <path d={path} />
      </svg>
    </button>
  );
}

export default function App() {
  const [panel, setPanel] = useState<Panel>(null);
  const close = useCallback(() => setPanel(null), []);

  return (
    <div className="flex h-dvh flex-col bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-2 py-2 sm:px-4 sm:py-3">
          <IconButton path={MENU_ICON} label="Apri elenco chat" onClick={() => setPanel('chats')} />
          <h1 className="shrink-0 text-lg font-semibold">
            AnonymAI <span className="hidden text-xs font-normal text-slate-400 sm:inline">v{__APP_VERSION__}</span>
          </h1>
          <div className="ml-auto min-w-0">
            <ModelSelect />
          </div>
          <IconButton path={SETTINGS_ICON} label="Apri impostazioni" onClick={() => setPanel('settings')} />
        </div>
      </header>

      <main className="mx-auto grid min-h-0 w-full max-w-7xl flex-1 gap-6 lg:grid-cols-[240px_1fr_340px] lg:px-4 lg:py-6">
        <Drawer side="left" label="Elenco chat" open={panel === 'chats'} onClose={close}>
          <ChatList onSelect={close} />
        </Drawer>
        <ChatPanel />
        <Drawer side="right" label="Impostazioni" open={panel === 'settings'} onClose={close}>
          <RulesEditor />
          <ProvidersEditor />
          <BackupPanel />
          <p className="text-center text-xs text-slate-400 lg:hidden">v{__APP_VERSION__}</p>
        </Drawer>
      </main>
    </div>
  );
}
