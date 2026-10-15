import { useEffect, type ReactNode } from 'react';

interface DrawerProps {
  side: 'left' | 'right';
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
}

/** Pannello laterale a scomparsa sotto il breakpoint lg; colonna fissa da lg in su. */
export default function Drawer({ side, open, onClose, label, children }: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const position = side === 'left' ? 'left-0' : 'right-0';
  // invisible da chiuso: fuori schermo non deve ricevere il focus da tastiera
  const state = open ? 'translate-x-0' : `${side === 'left' ? '-translate-x-full' : 'translate-x-full'} invisible`;

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden" onClick={onClose} aria-hidden />}
      <aside
        aria-label={label}
        className={`fixed inset-y-0 ${position} ${state} z-40 w-80 max-w-[85vw] space-y-6 overflow-y-auto bg-slate-50 p-4 shadow-xl transition-[translate,visibility] duration-200
          lg:visible lg:static lg:z-auto lg:w-auto lg:max-w-none lg:translate-x-0 lg:bg-transparent lg:p-0 lg:shadow-none`}
      >
        {children}
      </aside>
    </>
  );
}
