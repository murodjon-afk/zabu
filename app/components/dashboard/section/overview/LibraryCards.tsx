
'use client';

import {
  Book,
  BookMarked,
  Headphones,
  Play,
  Video,
  ArrowUpRight,
} from 'lucide-react';
import {LibraryCardsSkeleton} from "../../Skeletons"
import type { DashboardCtx } from '../../types';
import { ModalAction, SectionTitle } from '../../UI';

/* ZABU COLORS */
const GREEN = '#158F66';
const DEEP = '#0B3D2E';
const LIME = '#D9F36B';

/* Общий стиль карточек */
const CARD_BASE =
  'group relative isolate overflow-hidden rounded-[26px] border-2 border-[#0B3D2E] p-4 md:p-6 text-left flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 active:translate-y-1 motion-reduce:transition-none';

/* Dot pattern */
const dots = (color: string): React.CSSProperties => ({
  backgroundImage: `radial-gradient(${color} 1.5px, transparent 1.5px)`,
  backgroundSize: '20px 20px',
});

export function LibraryCards({ ctx }: { ctx: DashboardCtx }) {
const {
  p,
  openModal,
  closeModal,
  triggerToast,
  loading,
  currentUser,
} = ctx;

if (loading && !currentUser) {
  return <LibraryCardsSkeleton />;
}
  const cards = [
    {
      title: 'Подкасты',
      desc: 'Более 250 подкастов для прослушивания',
      cta: 'Слушать',
      icon: Headphones,

      modalTitle: 'Библиотека подкастов',
      text: `Слушайте подкасты на языке «${p.target.ru}» с разбором носителей.`,
      item: '#1 Диалоги на базаре · 12 мин',
      action: 'Слушать трек',
      actionIcon: <Play className="w-4 h-4 fill-white" />,
      toast: 'Аудио возобновлено 🎧',

      wrap: 'col-span-2 md:col-span-1 min-h-[150px] md:min-h-[170px]',

      variant: 'lime',
    },
    {
      title: 'Видео',
      desc: 'Более 250 обучающих видео',
      cta: 'Смотреть',
      icon: Video,

      modalTitle: 'Библиотека видео',
      text: 'Обучающие видеоролики с субтитрами и караоке-переводом.',
      item: 'Урок культуры: праздники и традиции',
      action: 'Смотреть',
      actionIcon: <Play className="w-4 h-4 fill-[#0B3D2E]" />,
      toast: 'Воспроизведение видео ▶️',

      wrap: 'col-span-1 min-h-[150px] md:min-h-[170px]',

      variant: 'dark',
    },
    {
      title: 'Книги',
      desc: 'Более 250 книг для чтения',
      cta: 'Читать',
      icon: Book,

      modalTitle: 'Библиотека книг',
      text: 'Адаптированные книги для чтения с быстрым словарём по клику на слова.',
      item: 'Сказочные легенды Востока',
      action: 'Читать онлайн',
      actionIcon: <BookMarked className="w-4 h-4" />,
      toast: 'Открыта ридер-версия 📖',

      wrap: 'col-span-1 min-h-[150px] md:min-h-[170px]',

      variant: 'green',
    },
  ] as const;

  return (
    <section className="space-y-4">
      <SectionTitle>Библиотека</SectionTitle>

      {/* BENTO GRID */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">
        {cards.map((c) => {
          const Icon = c.icon;

          const isLime = c.variant === 'lime';
          const isDark = c.variant === 'dark';
          const isGreen = c.variant === 'green';

          const bg = isLime
            ? LIME
            : isDark
              ? DEEP
              : GREEN;

          const fg = isDark || isGreen ? '#FFFFFF' : DEEP;

          const shadow = isLime
            ? '0 6px 0 #0B3D2E, 0 12px 20px rgba(11,61,46,0.10)'
            : isDark
              ? '0 6px 0 #061F18, 0 12px 20px rgba(6,31,24,0.18)'
              : '0 6px 0 #0B3D2E, 0 12px 20px rgba(11,61,46,0.12)';

          const buttonStyle = isLime
            ? 'bg-[#0B3D2E] text-[#D9F36B] shadow-[0_3px_0_#061F18] hover:bg-[#158F66] hover:text-white'
            : isDark
              ? 'bg-[#D9F36B] text-[#0B3D2E] shadow-[0_3px_0_#503D16] hover:bg-white'
              : 'bg-white text-[#158F66] shadow-[0_3px_0_#0B3D2E] hover:bg-[#D9F36B] hover:text-[#0B3D2E]';

          return (
            <button
              key={c.title}
              type="button"
              onClick={() =>
                openModal(
                  c.modalTitle,
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                      {c.text}
                    </p>

                    <div className="space-y-3 rounded-2xl border border-[#158F66]/15 bg-[#EAF6F0] p-4">
                      <div className="text-sm font-bold text-[#0B3D2E]">
                        {c.item}
                      </div>

                      <ModalAction
                        label={c.action}
                        icon={c.actionIcon}
                        onClick={() => {
                          closeModal();
                          triggerToast(c.toast);
                        }}
                      />
                    </div>
                  </div>
                )
              }
              className={`${CARD_BASE} ${c.wrap}`}
              style={{
                backgroundColor: bg,
                color: fg,
                borderColor: DEEP,
                boxShadow: shadow,
                ...dots(
                  isLime
                    ? 'rgba(11,61,46,0.12)'
                    : 'rgba(255,255,255,0.13)'
                ),
              }}
            >
              {/* ДЕКОРАТИВНЫЕ КРУГИ */}

              <div
                aria-hidden="true"
                className={`pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full border-[18px] ${
                  isLime
                    ? 'border-[#0B3D2E]/[0.07]'
                    : 'border-white/[0.07]'
                }`}
              />

              <div
                aria-hidden="true"
                className={`pointer-events-none absolute -bottom-16 left-1/3 h-36 w-36 rounded-full ${
                  isLime
                    ? 'bg-[#0B3D2E]/[0.04]'
                    : 'bg-white/[0.05]'
                }`}
              />

              {/* БОЛЬШАЯ ИКОНКА НА ФОНЕ */}

              <Icon
                className={`pointer-events-none absolute -bottom-5 -right-5 h-28 w-28 md:h-32 md:w-32 ${
                  isLime
                    ? 'text-[#0B3D2E]/10'
                    : 'text-white/10'
                }`}
                strokeWidth={1.5}
              />

              {/* ЗАГОЛОВОК */}

              <div className="relative z-10">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <h3 className="text-lg font-black leading-tight tracking-tight md:text-xl">
                    {c.title}
                  </h3>

                  {/* ИКОНКА */}
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-2xl border-2 transition-transform duration-300 group-hover:rotate-6 ${
                      isLime
                        ? 'border-[#0B3D2E] bg-[#0B3D2E] text-[#D9F36B]'
                        : 'border-[#0B3D2E]/30 bg-[#D9F36B] text-[#0B3D2E]'
                    }`}
                  >
                    <Icon size={21} strokeWidth={2.2} />
                  </span>
                </div>

                <p
                  className={`max-w-[95%] text-xs font-semibold leading-relaxed md:text-sm ${
                    isLime
                      ? 'text-[#0B3D2E]/70'
                      : 'text-white/75'
                  }`}
                >
                  {c.desc}
                </p>
              </div>

              {/* CTA BUTTON */}

              <span
                className={`relative z-10 mt-5 inline-flex h-9 items-center justify-center gap-2 self-start rounded-full px-5 text-xs font-black transition-all duration-300 group-hover:gap-3 group-active:scale-95 md:text-sm ${buttonStyle}`}
              >
                {c.cta}
                <ArrowUpRight size={15} />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
