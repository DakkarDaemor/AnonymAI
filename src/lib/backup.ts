import { z } from 'zod';
import { ChatSchema, ConfigSchema } from '../schemas';

// Formato dei file di export: busta con tipo e versione, così un file chat non viene importato come config.

const envelope = <K extends string, T extends z.ZodType>(kind: K, data: T) =>
  z.object({ app: z.literal('anonymai'), kind: z.literal(kind), version: z.literal(1), data });

export const ConfigFileSchema = envelope('config', ConfigSchema);
export const ChatsFileSchema = envelope('chats', z.array(ChatSchema));

export function wrap<K extends 'config' | 'chats', T>(kind: K, data: T) {
  return { app: 'anonymai' as const, kind, version: 1 as const, data };
}

/** Valida il contenuto di un file importato; lancia un errore leggibile se non è conforme. */
export function parseBackup<T extends z.ZodType<{ data: unknown }>>(schema: T, text: string): z.infer<T>['data'] {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error('Il file non è un JSON valido.');
  }
  const result = schema.safeParse(json);
  if (!result.success) throw new Error('File non riconosciuto: ' + z.prettifyError(result.error));
  return result.data.data;
}

export function downloadJson(filename: string, value: unknown) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: filename });
  a.click();
  URL.revokeObjectURL(url);
}
