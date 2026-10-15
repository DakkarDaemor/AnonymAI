import { useSettings } from '../store/settings';

/** Tendina dei modelli salvati, raggruppati per provider. */
export default function ModelSelect() {
  const { providers, selected, select } = useSettings();
  const available = providers.filter(p => p.models.length);

  if (!available.length) {
    return <span className="text-sm text-slate-500">Aggiungi un modello dalle impostazioni provider</span>;
  }

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-slate-500">Modello</span>
      <select
        className="field w-auto"
        value={selected ? JSON.stringify(selected) : ''}
        onChange={e => select(e.target.value ? JSON.parse(e.target.value) : null)}
      >
        <option value="">— scegli —</option>
        {available.map(p => (
          <optgroup key={p.id} label={p.name}>
            {p.models.map(model => (
              <option key={model} value={JSON.stringify({ providerId: p.id, model })}>
                {model}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </label>
  );
}
