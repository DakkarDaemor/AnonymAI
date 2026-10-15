import { describe, expect, it } from 'vitest';
import { toText } from './content';

describe('toText', () => {
  it('lascia invariate le stringhe', () => {
    expect(toText('ciao')).toBe('ciao');
  });

  it('unisce le parti di testo di un array', () => {
    expect(toText([{ type: 'text', text: 'a' }, { type: 'image_url' }, 'b'])).toBe('ab');
  });

  it('restituisce stringa vuota per null o tipi inattesi', () => {
    expect(toText(null)).toBe('');
    expect(toText({ text: 'x' })).toBe('');
  });
});
