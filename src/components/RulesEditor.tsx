import { useEffect, useRef } from 'react';
import { useSettings } from '../store/settings';
import Card from './Card';

export default function RulesEditor() {
  const { rules, addRule, updateRule, removeRule } = useSettings();
  const listRef = useRef<HTMLUListElement>(null);
  const prevCount = useRef(rules.length);

  // nuova regola aggiunta: portala in vista (la lista scorre) e mettici il cursore
  useEffect(() => {
    if (rules.length > prevCount.current) {
      const last = listRef.current?.lastElementChild;
      last?.scrollIntoView({ block: 'nearest' });
      last?.querySelector('input')?.focus();
    }
    prevCount.current = rules.length;
  }, [rules.length]);

  return (
    <Card title="Filtri" hint="Sostituiti prima dell'invio, senza distinguere maiuscole/minuscole.">
      {/* altezza di 4 righe (campi da 16px su mobile, 14px da sm), poi scorre; padding per non tagliare l'anello di focus */}
      <ul ref={listRef} className="max-h-49 space-y-2 overflow-y-auto p-0.5 sm:max-h-45">
        {rules.map(r => (
          <li key={r.id} className="flex items-center gap-2">
            <input
              className="field"
              placeholder="Testo"
              aria-label="Testo da sostituire"
              value={r.from}
              onChange={e => updateRule(r.id, { from: e.target.value })}
            />
            <span className="text-slate-400" aria-hidden>→</span>
            <input
              className="field"
              placeholder="[SEGNAPOSTO]"
              aria-label="Sostituto"
              value={r.to}
              onChange={e => updateRule(r.id, { to: e.target.value })}
            />
            <button className="btn-ghost" aria-label="Elimina filtro" onClick={() => removeRule(r.id)}>
              ✕
            </button>
          </li>
        ))}
      </ul>
      <button className="btn-ghost mt-2 text-indigo-600" onClick={addRule}>
        + Aggiungi filtro
      </button>
    </Card>
  );
}
