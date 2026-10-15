# Convenzioni del progetto

## Struttura
- `src/schemas.ts`: unica fonte dei tipi (zod); valida anche i file importati.
- `src/lib/`: logica pura, senza React né DOM.
- `src/store/`: stato persistente (zustand). Settings in localStorage, chat in IndexedDB.
- `src/components/`: UI React, un componente per file.

## Test
- Sempre in una sottocartella `__tests__/` accanto al codice testato: `src/lib/__tests__/filter.test.ts` testa `src/lib/filter.ts`.
- Nome file `<modulo>.test.ts(x)`, import relativi `../<modulo>`.
- Runner: vitest (`npm test`). Ogni logica non banale nuova ha il suo test.

## Versioni
Formato `VERSIONE.MAJOR.MINOR`, fonte unica `version` in `package.json`. Usare solo gli script:
- `npm run release:version`: cambi radicali
- `npm run release:major`: nuove funzionalità
- `npm run release:minor`: correzioni e ritocchi

Le modifiche che non toccano l'app pubblicata (test, docs, tooling) non cambiano versione.

## Vincoli
- Nessun backend: API key, configurazione e chat restano nel browser dell'utente.
- Il testo inviato al modello e quello salvato in cronologia è sempre già filtrato.
- L'HTML prodotto dal modello non va mai interpretato.
- Dipendenze: verificare l'ultima versione stabile prima di aggiungerle.
