import { describe, expect, it } from 'vitest';
import { repairChats } from './chats';

const chat = (messages: unknown[]) => ({ id: 'c1', title: 't', createdAt: 1, messages });

describe('repairChats', () => {
  it('converte in testo i content non stringa', () => {
    const [fixed] = repairChats([chat([{ role: 'assistant', content: [{ type: 'text', text: 'ok' }] }, { role: 'assistant', content: null }])]);
    expect(fixed.messages.map(m => m.content)).toEqual(['ok', '']);
  });

  it('scarta le chat illeggibili e tiene le altre', () => {
    expect(repairChats([null, { id: 'x' }, chat([])]).map(c => c.id)).toEqual(['c1']);
  });

  it('gestisce dati mancanti', () => {
    expect(repairChats(undefined)).toEqual([]);
  });
});
