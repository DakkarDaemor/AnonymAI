import { Component, type ReactNode } from 'react';

/** Ultima rete di sicurezza: un errore di rendering mostra un messaggio invece di una pagina vuota. */
export default class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <div className="mx-auto max-w-lg space-y-3 p-6 text-slate-900">
        <h1 className="text-lg font-semibold">Qualcosa è andato storto</h1>
        <p className="text-sm text-slate-600">
          I tuoi dati sono ancora salvati nel browser. Ricarica la pagina; se l'errore si ripete, segnalalo con il testo qui sotto.
        </p>
        <pre className="overflow-x-auto rounded-md bg-slate-100 p-3 text-xs whitespace-pre-wrap">{error.message}</pre>
        <button className="btn" onClick={() => location.reload()}>
          Ricarica
        </button>
      </div>
    );
  }
}
