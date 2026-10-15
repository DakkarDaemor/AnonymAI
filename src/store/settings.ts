import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_PROVIDERS } from '../config/defaults';
import type { Config, ModelRef, Provider, Rule } from '../schemas';

interface SettingsState extends Config {
  /** Sostituisce l'intera configurazione (import da file). */
  importConfig: (config: Config) => void;

  updateProvider: (id: string, patch: Partial<Omit<Provider, 'id'>>) => void;
  addModel: (providerId: string, model: string) => void;
  removeModel: (providerId: string, model: string) => void;
  select: (ref: ModelRef | null) => void;

  addRule: () => void;
  updateRule: (id: string, patch: Partial<Omit<Rule, 'id'>>) => void;
  removeRule: (id: string) => void;
}

const isSame = (a: ModelRef | null, b: ModelRef) => a?.providerId === b.providerId && a.model === b.model;

export const selectConfig = ({ providers, rules, selected }: Config): Config => ({ providers, rules, selected });

/** Configurazione utente, salvata in localStorage (API key incluse: non lasciano mai il browser). */
export const useSettings = create<SettingsState>()(
  persist(
    set => ({
      providers: DEFAULT_PROVIDERS,
      rules: [],
      selected: null,

      importConfig: ({ providers, rules, selected }) => set({ providers, rules, selected }),

      updateProvider: (id, patch) =>
        set(s => ({ providers: s.providers.map(p => (p.id === id ? { ...p, ...patch } : p)) })),

      addModel: (providerId, model) =>
        set(s => ({
          providers: s.providers.map(p =>
            p.id === providerId && !p.models.includes(model) ? { ...p, models: [...p.models, model] } : p,
          ),
          selected: s.selected ?? { providerId, model },
        })),

      removeModel: (providerId, model) =>
        set(s => ({
          providers: s.providers.map(p =>
            p.id === providerId ? { ...p, models: p.models.filter(m => m !== model) } : p,
          ),
          selected: isSame(s.selected, { providerId, model }) ? null : s.selected,
        })),

      select: selected => set({ selected }),

      addRule: () => set(s => ({ rules: [...s.rules, { id: crypto.randomUUID(), from: '', to: '' }] })),

      updateRule: (id, patch) => set(s => ({ rules: s.rules.map(r => (r.id === id ? { ...r, ...patch } : r)) })),

      removeRule: id => set(s => ({ rules: s.rules.filter(r => r.id !== id) })),
    }),
    { name: 'anonymai-settings', version: 1 },
  ),
);
