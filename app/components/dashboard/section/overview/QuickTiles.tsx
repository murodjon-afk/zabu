
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Trophy,
  UserPlus,
  Award,
  Globe,
  Languages,
  Copy,
  ArrowUpRight,
} from 'lucide-react';
import { QuickTilesSkeleton  } from "../../Skeletons";
import { fmt, num } from '../../constants';
import type { DashboardCtx } from '../../types';
import { ModalAction } from '../../UI';

/* Фирменные цвета ZABU */
const GREEN = '#158F66';
const DEEP = '#0B3D2E';
const LIME = '#D9F36B';

/* Белые карточки */
const TILE =
  'group relative flex min-h-[120px] w-full h-full flex-col justify-between overflow-hidden rounded-[24px] border border-[#0B3D2E]/[0.07] bg-white p-4 text-left shadow-[0_4px_0_rgba(11,61,46,0.07),0_8px_20px_rgba(11,61,46,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#158F66]/30 hover:shadow-[0_6px_0_rgba(11,61,46,0.08),0_14px_24px_rgba(11,61,46,0.09)] active:translate-y-0.5 motion-reduce:transition-none md:p-5';

/* Вторая карточка — фирменный зелёный */
const FRIEND_TILE =
  'group relative flex min-h-[120px] w-full h-full flex-col justify-between overflow-hidden rounded-[24px] border border-[#0B3D2E]/20 bg-[#158F66] p-4 text-left text-white shadow-[0_5px_0_#0B3D2E,0_10px_20px_rgba(11,61,46,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_7px_0_#0B3D2E,0_14px_24px_rgba(11,61,46,0.16)] active:translate-y-0.5 motion-reduce:transition-none md:p-5';

/* Подписи */
const LABEL =
  'text-[10px] md:text-xs font-bold uppercase tracking-wider text-[#0B3D2E]/45';

/* Лаймовые иконки */
const ICON_BADGE =
  'grid h-8 w-8 md:h-9 md:w-9 shrink-0 place-items-center rounded-xl border border-[#0B3D2E]/10 bg-[#D9F36B] text-[#0B3D2E] transition-transform group-hover:rotate-6';

/* Плитки */
const ITEM =
  'snap-start shrink-0 w-[44%] min-[480px]:w-[32%] md:w-auto md:shrink';

export function QuickTiles({ ctx }: { ctx: DashboardCtx }) {
const {
  p,
  ranked,
  rank,
  users,
  currentUser,
  loading,
  openModal,
  copyInvite,
  triggerToast,
  goTo,
} = ctx;
  const scrollRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);
  const [thumb, setThumb] = useState(0.4);

  const update = useCallback(() => {
    const el = scrollRef.current;

    if (!el) return;

    const max = el.scrollWidth - el.clientWidth;

    setProgress(max > 0 ? el.scrollLeft / max : 0);

    setThumb(
      el.scrollWidth > 0
        ? Math.min(1, el.clientWidth / el.scrollWidth)
        : 1
    );
  }, []);

  useEffect(() => {
    update();

    window.addEventListener('resize', update);

    return () => window.removeEventListener('resize', update);
  }, [update]);
if (loading && !currentUser) {
  return <QuickTilesSkeleton />;
}
  return (
    <div className="relative">

      {/* КАРТОЧКИ */}

      <div
        ref={scrollRef}
        onScroll={update}
        className="
          flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth
          -mx-4 px-4 scroll-px-4 pb-2 overscroll-x-contain
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          md:mx-0 md:px-0 md:pb-0 md:overflow-visible
          md:grid md:grid-cols-5 md:gap-4 xl:gap-5
        "
      >

        {/* 1. РЕЙТИНГ */}

        <div className={ITEM}>
          <button
            type="button"
            onClick={() =>
              openModal(
                'Рейтинг учеников',
                <div className="space-y-2">
                  {ranked.slice(0, 10).map((u, i) => (
                    <div
                      key={u.id}
                      className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm border ${
                        u.id === currentUser?.id
                          ? 'bg-[#EAF6F0] border-[#158F66]/20 font-bold text-[#0B3D2E]'
                          : 'bg-slate-50 border-slate-100 text-slate-700'
                      }`}
                    >
                      <span className="truncate">
                        {i + 1}. {u.namefull || 'Ученик'}
                      </span>

                      <span className="font-bold shrink-0 ml-3">
                        {fmt(num(u.Scores))}
                      </span>
                    </div>
                  ))}

                  {ranked.length === 0 && (
                    <p className="text-sm text-slate-500">
                      Пока нет данных.
                    </p>
                  )}
                </div>
              )
            }
            className={TILE}
          >
            <div className="flex items-center justify-between gap-2">
              <span className={LABEL}>Рейтинг</span>

              <span className={ICON_BADGE}>
                <Trophy size={18} />
              </span>
            </div>

            <div>
              <div className="text-2xl md:text-3xl font-black tracking-tight text-[#158F66]">
                {rank ? `#${rank}` : '—'}
              </div>

              <div className="text-[11px] md:text-xs text-[#0B3D2E]/45 font-semibold">
                из {users.length} учеников
              </div>
            </div>
          </button>
        </div>

        {/* 2. ДОБАВИТЬ ДРУГА — ЗЕЛЁНАЯ КАРТОЧКА */}

        <div className={ITEM}>
          <button
            type="button"
            onClick={() =>
              openModal(
                'Добавить друга',
                <div className="space-y-4">
                  <p className="text-sm text-slate-600">
                    Отправьте другу ссылку на ZABU, чтобы вместе учиться и соревноваться в рейтинге.
                  </p>

                  <div className="p-3 bg-[#EAF6F0] rounded-xl border border-[#158F66]/15 text-sm text-[#0B3D2E] break-all">
                    {typeof window !== 'undefined'
                      ? window.location.origin
                      : ''}
                  </div>

                  <ModalAction
                    label="Скопировать ссылку"
                    icon={<Copy className="w-4 h-4" />}
                    onClick={copyInvite}
                  />
                </div>
              )
            }
            className={FRIEND_TILE}
          >
            {/* Декоративный круг */}

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-8 -top-9 h-28 w-28 rounded-full border-[15px] border-white/[0.10]"
            />

            <div className="relative z-10 flex items-center justify-between gap-2">
              <span className="text-[10px] md:text-xs font-black uppercase tracking-wider text-white/80">
                Друзья
              </span>

              <span className="grid h-8 w-8 md:h-9 md:w-9 shrink-0 place-items-center rounded-xl border border-[#0B3D2E]/10 bg-[#D9F36B] text-[#0B3D2E] transition-transform group-hover:rotate-6">
                <UserPlus size={18} />
              </span>
            </div>

            <div className="relative z-10 mt-3 flex items-end justify-between gap-2">
              <span className="text-base md:text-lg font-black leading-tight">
                Добавить друга
              </span>

              <ArrowUpRight
                size={18}
                className="shrink-0 text-white/70 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </div>
          </button>
        </div>

        {/* 3. УРОВЕНЬ */}

        <div className={ITEM}>
          <button
            type="button"
            onClick={() => triggerToast(`Ваш уровень: ${p.level}`)}
            className={TILE}
          >
            <div className="flex items-center justify-between gap-2">
              <span className={LABEL}>Уровень</span>

              <span className={ICON_BADGE}>
                <Award size={19} />
              </span>
            </div>

            <div className="text-lg md:text-2xl font-black text-[#158F66] truncate">
              {p.level}
            </div>
          </button>
        </div>

        {/* 4. ЯЗЫК ОБУЧЕНИЯ */}

        <div className={ITEM}>
          <button
            type="button"
            onClick={() => goTo('lessons')}
            className={TILE}
          >
            <div className="flex items-center justify-between gap-2">
              <span className={LABEL}>Изучаю</span>

              <span className={ICON_BADGE}>
                <Globe size={19} />
              </span>
            </div>

            <div className="text-lg md:text-2xl font-black text-[#0B3D2E] truncate">
              {p.target.flag} {p.target.native}
            </div>
          </button>
        </div>

        {/* 5. ПЕРЕВОДЧИК */}

        <div className={ITEM}>
          <button
            type="button"
            onClick={() => triggerToast('Переводчик скоро появится')}
            className={TILE}
          >
            <div className="flex items-center justify-between gap-2">
              <span className={LABEL}>Инструменты</span>

              <span className={ICON_BADGE}>
                <Languages size={19} />
              </span>
            </div>

            <div className="text-lg md:text-2xl font-black text-[#0B3D2E] truncate">
              Переводчик
            </div>
          </button>
        </div>
      </div>

      {/* ИНДИКАТОР ПРОКРУТКИ — ТОЛЬКО ТЕЛЕФОН */}

      <div
        className="md:hidden mt-2 mx-auto h-1 w-16 rounded-full bg-[#EAF6F0] overflow-hidden"
        aria-hidden
      >
        <div
          className="h-full rounded-full bg-[#158F66] transition-[margin] duration-100"
          style={{
            width: `${thumb * 100}%`,
            marginLeft: `${progress * (1 - thumb) * 100}%`,
          }}
        />
      </div>

      {/* ПОДСКАЗКА О ПРОКРУТКЕ */}

      <div
        className="md:hidden pointer-events-none absolute right-0 top-0 bottom-3 w-5 bg-white/60 transition-opacity"
        style={{
          opacity: progress > 0.95 ? 0 : 1,
        }}
        aria-hidden
      />
    </div>
  );
}
