import { useId, useState } from 'react';
import { createClient } from '../lib/openai-client';
import { useSettings } from '../store/settings';
import type { Provider } from '../schemas';
import Card from './Card';

export default function ProvidersEditor() {
  const providers = useSettings(s => s.providers);

  return (
    <Card title="Provider" hint="API key e modelli restano salvati in questo browser.">
      <div className="divide-y divide-slate-100">
        {providers.map(p => (
          <ProviderItem key={p.id} provider={p} />
        ))}
      </div>
    </Card>
  );
}

function ProviderItem({ provider }: { provider: Provider }) {
  const { updateProvider, addModel, removeModel } = useSettings();
  const [catalog, setCatalog] = useState<string[]>([]);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState('');
  const listId = useId();

  async function loadCatalog() {
    setStatus('Caricamento…');
    try {
      setCatalog(await createClient(provider).listModels());
      setStatus('');
    } catch (e) {
      setStatus((e as Error).message);
    }
  }

  function add() {
    if (!draft.trim()) return;
    addModel(provider.id, draft.trim());
    setDraft('');
  }

  return (
    <details className="group py-2">
      <summary className="flex cursor-pointer items-center justify-between text-sm font-medium">
        {provider.name}
        <span className="text-xs font-normal text-slate-500">
          {provider.apiKey ? `${provider.models.length} modelli` : 'nessuna key'}
        </span>
      </summary>

      <div className="mt-3 space-y-2">
        <input
          className="field"
          aria-label="Endpoint"
          value={provider.baseUrl}
          onChange={e => updateProvider(provider.id, { baseUrl: e.target.value })}
        />
        <input
          className="field"
          type="password"
          autoComplete="off"
          placeholder="API key"
          aria-label="API key"
          value={provider.apiKey}
          onChange={e => updateProvider(provider.id, { apiKey: e.target.value })}
        />

        <ul className="flex flex-wrap gap-1">
          {provider.models.map(m => (
            <li key={m} className="flex items-center gap-1 rounded-full bg-slate-100 py-0.5 pr-1 pl-3 text-xs">
              {m}
              <button className="btn-ghost px-1 py-0" aria-label={`Rimuovi ${m}`} onClick={() => removeModel(provider.id, m)}>
                ✕
              </button>
            </li>
          ))}
        </ul>

        <form className="flex gap-2" onSubmit={e => { e.preventDefault(); add(); }}>
          <input
            className="field"
            list={listId}
            placeholder="id modello"
            aria-label="Aggiungi modello"
            value={draft}
            onChange={e => setDraft(e.target.value)}
          />
          <datalist id={listId}>
            {catalog.map(m => <option key={m} value={m} />)}
          </datalist>
          <button className="btn" type="submit">Aggiungi</button>
        </form>

        <button className="btn-ghost text-indigo-600" disabled={!provider.apiKey} onClick={loadCatalog}>
          Carica elenco modelli disponibili
        </button>
        {status && <p className="text-xs text-slate-500">{status}</p>}
      </div>
    </details>
  );
}
