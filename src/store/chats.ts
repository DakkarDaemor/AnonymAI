import { del, get, set as idbSet } from 'idb-keyval';
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import type { Chat, ChatMessage } from '../schemas';

interface ChatsState {
  chats: Chat[];
  activeId: string | null;

  /** Crea una chat vuota e la rende attiva; restituisce l'id. */
  newChat: (title: string) => string;
  open: (id: string | null) => void;
  remove: (id: string) => void;
  setMessages: (id: string, messages: ChatMessage[]) => void;
  /** Unisce le chat importate: a parità di id vince quella importata. */
  importChats: (chats: Chat[]) => void;
}

// IndexedDB invece di localStorage: la cronologia può superare i ~5 MB di localStorage.
const indexedDbStorage: StateStorage = {
  getItem: async name => (await get<string>(name)) ?? null,
  setItem: (name, value) => idbSet(name, value),
  removeItem: name => del(name),
};

export const useChats = create<ChatsState>()(
  persist(
    set => ({
      chats: [],
      activeId: null,

      newChat: title => {
        const id = crypto.randomUUID();
        set(s => ({ chats: [{ id, title, createdAt: Date.now(), messages: [] }, ...s.chats], activeId: id }));
        return id;
      },

      open: activeId => set({ activeId }),

      remove: id =>
        set(s => ({ chats: s.chats.filter(c => c.id !== id), activeId: s.activeId === id ? null : s.activeId })),

      setMessages: (id, messages) =>
        set(s => ({ chats: s.chats.map(c => (c.id === id ? { ...c, messages } : c)) })),

      importChats: imported =>
        set(s => {
          const ids = new Set(imported.map(c => c.id));
          const merged = [...imported, ...s.chats.filter(c => !ids.has(c.id))];
          return { chats: merged.sort((a, b) => b.createdAt - a.createdAt) };
        }),
    }),
    { name: 'anonymai-chats', version: 1, storage: createJSONStorage(() => indexedDbStorage) },
  ),
);

export const useActiveChat = () => useChats(s => s.chats.find(c => c.id === s.activeId) ?? null);
