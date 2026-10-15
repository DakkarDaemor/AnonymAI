import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { applyRules } from '../lib/filter';
import { createClient } from '../lib/openai-client';
import type { ChatMessage } from '../schemas';
import { useActiveChat, useChats } from '../store/chats';
import { useSettings } from '../store/settings';

const TITLE_LENGTH = 40;

export default function ChatPanel() {
  const { providers, rules, selected } = useSettings();
  const chat = useActiveChat();
  const { newChat, setMessages } = useChats();
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);

  const provider = providers.find(p => p.id === selected?.providerId);
  const messages = chat?.messages ?? []; // solo testo già filtrato: è ciò che il modello vede
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => endRef.current?.scrollIntoView({ block: 'end' }), [chat?.id, messages.length, pending]);

  async function send(e?: FormEvent) {
    e?.preventDefault();
    const raw = input.trim();
    if (!raw || pending) return;
    if (!provider || !selected) return setError('Scegli un modello.');
    if (!provider.apiKey) return setError(`Imposta la API key di ${provider.name}.`);

    const filtered = applyRules(raw, rules);
    // titolo dal testo filtrato: nemmeno la cronologia locale conserva i dati originali
    const chatId = chat?.id ?? newChat(filtered.slice(0, TITLE_LENGTH));
    const history: ChatMessage[] = [...messages, { role: 'user', content: filtered }];
    setMessages(chatId, history);
    setInput('');
    setError('');
    setPending(true);
    try {
      const answer = await createClient(provider).chat(selected.model, history);
      setMessages(chatId, [...history, { role: 'assistant', content: answer, model: selected.model }]);
    } catch (err) {
      setMessages(chatId, messages); // non arrivato al modello: fuori dalla conversazione
      setInput(raw); // restituisce il testo all'utente invece di perderlo
      setError((err as Error).message);
    } finally {
      setPending(false);
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && e.ctrlKey) send();
  }

  return (
    <section className="flex min-h-0 min-w-0 flex-col bg-white lg:rounded-lg lg:border lg:border-slate-200 lg:shadow-sm">
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3 sm:p-4" aria-live="polite">
        {!messages.length && <p className="text-sm text-slate-400">Nessun messaggio.</p>}
        {messages.map((m, i) => (
          <article
            key={i}
            className={`max-w-[90%] rounded-lg break-words sm:max-w-[85%] px-4 py-2 text-sm whitespace-pre-wrap ${
              m.role === 'user' ? 'ml-auto bg-indigo-50 text-indigo-950' : 'bg-slate-100'
            }`}
          >
            <p className="mb-1 text-xs text-slate-500">{m.role === 'user' ? 'Inviato al modello' : m.model}</p>
            {m.content}
          </article>
        ))}
        {pending && <p className="text-sm text-slate-400">In attesa di risposta…</p>}
        <div ref={endRef} />
      </div>

      <form onSubmit={send} className="space-y-2 border-t border-slate-200 p-3 sm:p-4">
        {error && <p className="text-sm text-red-600">{error}</p>}
        <textarea
          className="field resize-y"
          rows={2}
          placeholder="Scrivi un messaggio…"
          aria-label="Messaggio"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <div className="flex justify-end">
          <button className="btn" type="submit" disabled={pending || !input.trim()}>
            Invia
          </button>
        </div>
      </form>
    </section>
  );
}
