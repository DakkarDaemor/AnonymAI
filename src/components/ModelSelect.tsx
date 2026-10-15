import { useSettings } from '../store/settings';

/** Tendina dei modelli salvati, raggruppati per provider. */
export default function ModelSelect() {
  const { providers, selected, select } = useSettings();
  const available = providers.filter(p => p.models.length);

  if (!available.length) {
    return <span className="block truncate text-xs text-slate-500 sm:text-sm">Aggiungi un modello nelle impostazioni</span>;
  }

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="hidden text-slate-500 sm:inline">Modello</span>
      <select
        className="field w-auto max-w-full truncate"
        aria-label="Modello"
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
