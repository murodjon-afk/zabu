'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Check, MoreHorizontal, X } from 'lucide-react';
import { navItems, type TabId } from './constants';

interface Props {
  activeTab: TabId;
  onSelect: (id: TabId) => void;
  /** больше не нужны: на узких экранах вместо бокового меню используется нижняя панель */
  open?: boolean;
  onClose?: () => void;
}

/** Сколько ячеек помещается в нижней панели. Если пунктов больше — последняя ячейка становится «Ещё». */
const MAX_BAR = 5;

const FOCUS =
  'focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#2EB67D]';

const DOTS = {
  backgroundImage:
    'radial-gradient(rgba(255,255,255,.22) 1.5px, transparent 1.5px)',
  backgroundSize: '20px 20px',
} as const;

const LANG_LOGOS = [
  { src: '/logo-tj.webp', alt: 'Тоҷикӣ' },
  { src: '/logo-ir.webp', alt: 'فارسی' },
  { src: '/logo-en.webp', alt: 'English' },
] as const;

export function Sidebar({ activeTab, onSelect }: Props) {
  const [moreOpen, setMoreOpen] = useState(false);

  const overflow = navItems.length > MAX_BAR;
  const primary = overflow ? navItems.slice(0, MAX_BAR - 1) : navItems;
  const extra = overflow ? navItems.slice(MAX_BAR - 1) : [];

  const activeInExtra = extra.some((i) => i.id === activeTab);
  const cols = primary.length + (extra.length ? 1 : 0);
  const activeIndex = activeInExtra
    ? primary.length
    : primary.findIndex((i) => i.id === activeTab);

  /* Esc закрывает «Ещё»; пока оно открыто, страница под ним не прокручивается */
  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMoreOpen(false);
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [moreOpen]);

  const go = (id: TabId) => {
    onSelect(id);
    setMoreOpen(false);
  };

  return (
    <>
      <style>{`
        @keyframes sb-sheet { from { transform: translateY(100%); } to { transform: none; } }
        @keyframes sb-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes sb-pop { 0% { transform: translateY(0) scale(1); } 40% { transform: translateY(-6px) scale(1.2); } 100% { transform: translateY(-1px) scale(1.1); } }
        @keyframes sb-bob { 0%, 100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-6px) rotate(3deg); } }
        @keyframes sb-ring { 0% { transform: scale(1); opacity: .5; } 100% { transform: scale(1.6); opacity: 0; } }
        .sb-sheet { animation: sb-sheet .35s cubic-bezier(.2,.8,.2,1) both; }
        .sb-fade { animation: sb-fade .25s ease both; }
        .sb-pop { animation: sb-pop .45s cubic-bezier(.34,1.56,.64,1) both; }
        .sb-bob { animation: sb-bob 4.5s ease-in-out infinite; }
        .sb-ring { animation: sb-ring 2.8s ease-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .sb-sheet, .sb-fade, .sb-pop, .sb-bob, .sb-ring { animation: none !important; }
        }
      `}</style>

      {/* ================= ≥900px: боковая панель ================= */}
      <aside className="fixed bottom-0 left-0 top-16 z-30 hidden w-64 flex-col border-r-2 border-[#E3EBE5] bg-white min-[900px]:flex">
        <nav aria-label="Разделы" className="flex-1 overflow-y-auto px-4 pb-4 pt-5">
       

          <div className="space-y-2.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelect(item.id);
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group relative flex w-full items-center gap-3 rounded-2xl border-2 p-2 pr-3 text-[15px] transition duration-300 motion-reduce:transition-none ${FOCUS} ${
                    isActive
                      ? 'translate-x-1 border-[#0B3D2E] bg-[#158F66] font-black text-white shadow-[0_5px_0_#0B3D2E]'
                      : 'border-transparent font-bold text-[#0B3D2E] hover:border-[#E3EBE5] hover:bg-[#EAF6F0]'
                  }`}
                >
                  <span
                    className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl transition duration-300 group-hover:-rotate-6 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:transform-none ${
                      isActive
                        ? 'bg-[#D9F36B] text-[#0B3D2E] shadow-[0_3px_0_#0B3D2E]'
                        : 'bg-[#EAF6F0] text-[#158F66] shadow-[0_3px_0_rgba(11,61,46,0.1)]'
                    }`}
                  >
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>

                  <span className="min-w-0 flex-1 truncate">{item.label}</span>

                  {isActive && (
                    <span
                      aria-hidden
                      className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#D9F36B] ring-2 ring-[#0B3D2E]"
                    />
                  )}
                </a>
              );
            })}
          </div>
        </nav>

      </aside>

      {/* ================= <900px: «Ещё» — лист со стикерами ================= */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-40 min-[900px]:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Все разделы"
        >
          <div
            className="sb-fade absolute inset-0 bg-[#0B3D2E]/55"
            onClick={() => setMoreOpen(false)}
          />

          <div className="sb-sheet absolute inset-x-0 bottom-0 rounded-t-[32px] border-2 border-b-0 border-[#0B3D2E] bg-white px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-3">
            <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-[#E3EBE5]" />

            <div className="mb-4 flex items-center justify-between">
              <p className="text-lg font-black tracking-[-0.02em] text-[#0B3D2E]">
                <span className="inline-block -rotate-2 rounded-lg bg-[#D9F36B] px-2 pb-0.5 shadow-[3px_3px_0_#0B3D2E]">
                  Ещё
                </span>{' '}
                разделы
              </p>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                aria-label="Закрыть"
                className={`grid h-9 w-9 place-items-center rounded-full bg-[#EAF6F0] text-[#158F66] transition hover:bg-[#D9F36B] hover:text-[#0B3D2E] ${FOCUS}`}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {extra.map((item, i) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      go(item.id);
                    }}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative flex flex-col items-center gap-2 rounded-3xl border-2 px-2 py-4 text-center transition motion-reduce:transition-none ${FOCUS} ${
                      isActive
                        ? 'border-[#0B3D2E] bg-[#158F66] text-white shadow-[0_5px_0_#0B3D2E]'
                        : `border-[#E3EBE5] bg-white text-[#0B3D2E] shadow-[0_5px_0_rgba(11,61,46,0.1)] hover:-translate-y-0.5 active:scale-95 ${
                            i % 2 === 0 ? '-rotate-1' : 'rotate-1'
                          }`
                    }`}
                  >
                    {isActive && (
                      <span className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full border-2 border-[#0B3D2E] bg-[#D9F36B] text-[#0B3D2E]">
                        <Check className="h-3.5 w-3.5" strokeWidth={3.5} aria-hidden="true" />
                      </span>
                    )}
                    <span
                      className={`grid h-12 w-12 place-items-center rounded-2xl ${
                        isActive
                          ? 'bg-[#D9F36B] text-[#0B3D2E] shadow-[0_3px_0_#0B3D2E]'
                          : 'bg-[#EAF6F0] text-[#158F66]'
                      }`}
                    >
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <span className="w-full truncate text-xs font-black">{item.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= <900px: плавающая нижняя навигация ================= */}
      <nav
        aria-label="Основная навигация"
        className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 min-[900px]:hidden"
      >
        <div
          className="relative mx-auto grid max-w-xl rounded-[28px] border-2 border-[#0B3D2E] bg-white p-1.5 shadow-[0_6px_0_#0B3D2E]"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {/* скользящая зелёная «таблетка» активного пункта */}
          {activeIndex >= 0 && (
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-1.5 left-1.5 top-1.5 transition-transform duration-500 motion-reduce:transition-none"
              style={{
                width: `calc((100% - 0.75rem) / ${cols})`,
                transform: `translateX(${activeIndex * 100}%)`,
                transitionTimingFunction: 'cubic-bezier(.34,1.3,.64,1)',
              }}
            >
              <span className="block h-full w-full rounded-[20px] border-2 border-[#0B3D2E] bg-[#158F66] shadow-[0_3px_0_#0B3D2E]" />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#0B3D2E] bg-[#D9F36B]" />
            </span>
          )}

          {primary.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  go(item.id);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`relative z-10 flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-[20px] px-1 py-2.5 transition-transform active:scale-90 motion-reduce:transition-none ${FOCUS}`}
              >
                <Icon
                  key={isActive ? 'on' : 'off'}
                  className={`h-6 w-6 transition-colors duration-300 motion-reduce:transition-none ${
                    isActive ? 'sb-pop text-white' : 'text-[#0B3D2E]/50'
                  }`}
                  aria-hidden="true"
                />
                <span
                  className={`w-full truncate text-center text-[11px] leading-tight transition-colors duration-300 motion-reduce:transition-none ${
                    isActive ? 'font-black text-white' : 'font-bold text-[#0B3D2E]/55'
                  }`}
                >
                  {item.label}
                </span>
              </a>
            );
          })}

          {extra.length > 0 && (
            <button
              type="button"
              onClick={() => setMoreOpen((o) => !o)}
              aria-expanded={moreOpen}
              aria-label="Ещё разделы"
              className={`relative z-10 flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-[20px] px-1 py-2.5 transition-transform active:scale-90 motion-reduce:transition-none ${FOCUS}`}
            >
              <MoreHorizontal
                key={activeInExtra ? 'on' : 'off'}
                className={`h-6 w-6 transition-colors duration-300 motion-reduce:transition-none ${
                  activeInExtra ? 'sb-pop text-white' : 'text-[#0B3D2E]/50'
                }`}
                aria-hidden="true"
              />
              <span
                className={`w-full truncate text-center text-[11px] leading-tight transition-colors duration-300 motion-reduce:transition-none ${
                  activeInExtra ? 'font-black text-white' : 'font-bold text-[#0B3D2E]/55'
                }`}
              >
                {activeInExtra ? extra.find((i) => i.id === activeTab)?.label : 'Ещё'}
              </span>
            </button>
          )}
        </div>
      </nav>
    </>
  );
}