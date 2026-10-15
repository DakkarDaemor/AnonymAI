/**
 * Riduce a testo il campo `content` di un messaggio. Secondo provider e modello può essere
 * una stringa, null (risposta bloccata o solo "reasoning") oppure un array di parti `{ type, text }`.
 */
export function toText(content: unknown): string {
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content.map(part => (typeof part === 'string' ? part : typeof part?.text === 'string' ? part.text : '')).join('');
  }
  return '';
}
