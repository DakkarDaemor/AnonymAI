import type { Rule } from '../schemas';

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Sostituzione letterale e case-insensitive di ogni regola.
 * Le stringhe più lunghe vengono applicate prima ("Mario Rossi" vince su "Mario").
 */
export function applyRules(text: string, rules: Rule[]): string {
  return rules
    .filter(r => r.from.trim())
    .sort((a, b) => b.from.trim().length - a.from.trim().length)
    // funzione come sostituto: evita che "$1" nel testo di sostituzione venga interpretato
    .reduce((acc, r) => acc.replace(new RegExp(escapeRegExp(r.from.trim()), 'gi'), () => r.to), text);
}
