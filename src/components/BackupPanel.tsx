import { useRef, useState, type ChangeEvent } from 'react';
import { ChatsFileSchema, ConfigFileSchema, downloadJson, parseBackup, wrap } from '../lib/backup';
import { useChats } from '../store/chats';
import { selectConfig, useSettings } from '../store/settings';

const today = () => new Date().toISOString().slice(0, 10);

export default function BackupPanel() {
  const [status, setStatus] = useState('');
  const configInput = useRef<HTMLInputElement>(null);
  const chatsInput = useRef<HTMLInputElement>(null);

  function exportConfig() {
    downloadJson(`anonymai-config-${today()}.json`, wrap('config', selectConfig(useSettings.getState())));
  }

  function exportChats() {
    downloadJson(`anonymai-chats-${today()}.json`, wrap('chats', useChats.getState().chats));
  }

  async function onImport(e: ChangeEvent<HTMLInputElement>, kind: 'config' | 'chats') {
    const file = e.target.files?.[0];
    e.target.value = ''; // permette di reimportare lo stesso file
    if (!file) return;
    try {
      const text = await file.text();
      if (kind === 'config') {
        const config = parseBackup(ConfigFileSchema, text);
        if (!confirm('La configurazione attuale (provider, API key, filtri) verrà sostituita. Continuare?')) return;
        useSettings.getState().importConfig(config);
        setStatus('Configurazione importata.');
      } else {
        const chats = parseBackup(ChatsFileSchema, text);
        useChats.getState().importChats(chats);
        setStatus(`${chats.length} chat importate.`);
      }
    } catch (err) {
      setStatus((err as Error).message);
    }
  }

  return (
    <div>
      <p className="mb-3 text-xs text-slate-500">L'export della configurazione contiene le API key: conservalo con cura.</p>
      <div className="grid grid-cols-2 gap-2">
        <button className="btn-ghost border border-slate-200" onClick={exportConfig}>Esporta config</button>
        <button className="btn-ghost border border-slate-200" onClick={() => configInput.current?.click()}>Importa config</button>
        <button className="btn-ghost border border-slate-200" onClick={exportChats}>Esporta chat</button>
        <button className="btn-ghost border border-slate-200" onClick={() => chatsInput.current?.click()}>Importa chat</button>
      </div>
      <input ref={configInput} type="file" accept="application/json" hidden onChange={e => onImport(e, 'config')} />
      <input ref={chatsInput} type="file" accept="application/json" hidden onChange={e => onImport(e, 'chats')} />
      {status && <p className="mt-2 text-xs whitespace-pre-wrap text-slate-600">{status}</p>}
    </div>
  );
}
