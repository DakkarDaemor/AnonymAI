import { useSettings } from '../store/settings';
import Card from './Card';

export default function RulesEditor() {
  const { rules, addRule, updateRule, removeRule } = useSettings();

  return (
    <Card title="Filtri" hint="Sostituiti prima dell'invio, senza distinguere maiuscole/minuscole.">
      <ul className="space-y-2">
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
