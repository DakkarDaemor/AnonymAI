import { describe, expect, it } from 'vitest';
import { ChatsFileSchema, ConfigFileSchema, parseBackup, wrap } from './backup';

const config = { providers: [], rules: [{ id: 'r1', from: 'Mario', to: '[N]' }], selected: null };

describe('parseBackup', () => {
  it('rilegge un export valido', () => {
    expect(parseBackup(ConfigFileSchema, JSON.stringify(wrap('config', config)))).toEqual(config);
  });

  it('rifiuta un file di tipo diverso', () => {
    expect(() => parseBackup(ChatsFileSchema, JSON.stringify(wrap('config', config)))).toThrow(/non riconosciuto/);
  });

  it('rifiuta JSON non valido', () => {
    expect(() => parseBackup(ConfigFileSchema, '{')).toThrow(/JSON valido/);
  });
});
