import { useState } from 'react';
import type { Chat } from '../schemas';
import { useChats } from '../store/chats';
import Card from './Card';

const matches = (chat: Chat, query: string) =>
  chat.title.toLowerCase().includes(query) || chat.messages.some(m => m.content.toLowerCase().includes(query));

export default function ChatList() {
  const { chats, activeId, open, remove } = useChats();
  const [search, setSearch] = useState('');

  const query = search.trim().toLowerCase();
  const visible = query ? chats.filter(c => matches(c, query)) : chats;

  return (
    <Card title="Chat">
      <button className="btn w-full" onClick={() => open(null)}>
        + Nuova chat
      </button>
      <input
        className="field mt-3"
        type="search"
        placeholder="Cerca nelle chat…"
        aria-label="Cerca nelle chat"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <ul className="mt-3 space-y-1">
        {visible.map(c => (
          <li key={c.id} className="group flex items-center gap-1">
            <button
              className={`flex-1 truncate rounded-md px-2 py-1.5 text-left text-sm ${
                c.id === activeId ? 'bg-indigo-50 font-medium text-indigo-900' : 'hover:bg-slate-100'
              }`}
              title={c.title}
              onClick={() => open(c.id)}
            >
              {c.title || 'Senza titolo'}
            </button>
            <button
              className="btn-ghost opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label={`Elimina chat ${c.title}`}
              onClick={() => confirm('Eliminare questa chat?') && remove(c.id)}
            >
              ✕
            </button>
          </li>
        ))}
        {query && !visible.length && <li className="px-2 text-sm text-slate-400">Nessuna chat trovata</li>}
      </ul>
    </Card>
  );
}
