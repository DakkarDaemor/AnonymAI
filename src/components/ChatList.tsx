import { useChats } from '../store/chats';
import Card from './Card';

export default function ChatList() {
  const { chats, activeId, open, remove } = useChats();

  return (
    <Card title="Chat">
      <button className="btn w-full" onClick={() => open(null)}>
        + Nuova chat
      </button>
      <ul className="mt-3 space-y-1">
        {chats.map(c => (
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
      </ul>
    </Card>
  );
}
