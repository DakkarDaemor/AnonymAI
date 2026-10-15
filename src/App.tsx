import BackupPanel from './components/BackupPanel';
import ChatList from './components/ChatList';
import ChatPanel from './components/ChatPanel';
import ModelSelect from './components/ModelSelect';
import ProvidersEditor from './components/ProvidersEditor';
import RulesEditor from './components/RulesEditor';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <h1 className="text-lg font-semibold">
            AnonymAI <span className="text-xs font-normal text-slate-400">v{__APP_VERSION__}</span>
          </h1>
          <ModelSelect />
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[240px_1fr_340px]">
        <aside>
          <ChatList />
        </aside>
        <ChatPanel />
        <aside className="space-y-6">
          <RulesEditor />
          <ProvidersEditor />
          <BackupPanel />
        </aside>
      </main>
    </div>
  );
}
