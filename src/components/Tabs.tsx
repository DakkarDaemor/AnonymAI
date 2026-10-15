import { useId, useState, type ReactNode } from 'react';

interface Tab {
  label: string;
  content: ReactNode;
}

/** Riquadro a schede (pattern ARIA tabs): una sola scheda visibile alla volta. */
export default function Tabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);
  const id = useId();

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div role="tablist" className="flex border-b border-slate-200">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            id={`${id}-tab-${i}`}
            role="tab"
            aria-selected={i === active}
            aria-controls={`${id}-panel-${i}`}
            className={`flex-1 border-b-2 px-4 py-3 text-sm font-medium ${
              i === active ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
            onClick={() => setActive(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div id={`${id}-panel-${active}`} role="tabpanel" aria-labelledby={`${id}-tab-${active}`} className="p-4">
        {tabs[active].content}
      </div>
    </section>
  );
}
