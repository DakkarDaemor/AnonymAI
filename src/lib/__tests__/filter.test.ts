import { describe, expect, it } from 'vitest';
import { applyRules } from '../filter';

const rule = (from: string, to: string) => ({ id: from, from, to });

describe('applyRules', () => {
  it('applica prima le stringhe più lunghe, ignorando le maiuscole', () => {
    expect(applyRules('mario rossi e Mario', [rule('Mario', '[N]'), rule('Mario Rossi', '[NC]')])).toBe('[NC] e [N]');
  });

  it('tratta i caratteri speciali come testo letterale', () => {
    expect(applyRules('costa $5 (circa)', [rule('$5', '$1'), rule('(circa)', '~')])).toBe('costa $1 ~');
  });

  it('ignora le regole vuote', () => {
    expect(applyRules('ciao', [rule('  ', 'x')])).toBe('ciao');
  });
});
