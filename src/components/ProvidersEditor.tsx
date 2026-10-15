import { useState } from 'react';
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

  const query = draft.trim().toLowerCase();
  const matches = catalog.filter(m => m.toLowerCase().includes(query) && !provider.models.includes(m));

  // alcuni provider (es. OpenRouter) espongono l'elenco senza key: non la richiediamo qui
  async function loadCatalog() {
    setStatus('Caricamento…');
    try {
      const ids = await createClient(provider).listModels();
      setCatalog(ids);
      setStatus(`${ids.length} modelli disponibili: filtra scrivendo nel campo, clic per aggiungere.`);
    } catch (e) {
      setStatus('Errore: ' + (e as Error).message);
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
            placeholder={catalog.length ? 'Cerca, es. :free' : 'id modello'}
            aria-label="Aggiungi modello"
            value={draft}
            onChange={e => setDraft(e.target.value)}
          />
          <button className="btn" type="submit">Aggiungi</button>
        </form>

        <button className="btn-ghost text-indigo-600" onClick={loadCatalog}>
          Carica elenco modelli disponibili
        </button>
        {status && <p className="text-xs text-slate-500">{status}</p>}

        {catalog.length > 0 && (
          <ul className="max-h-56 overflow-y-auto rounded-md border border-slate-200 text-xs">
            {matches.map(m => (
              <li key={m}>
                <button className="w-full px-3 py-1.5 text-left hover:bg-indigo-50" onClick={() => addModel(provider.id, m)}>
                  {m}
                </button>
              </li>
            ))}
            {!matches.length && <li className="px-3 py-1.5 text-slate-400">Nessun modello corrispondente</li>}
          </ul>
        )}
      </div>
    </details>
  );
}
