
'use client';

import {
  BookOpen,
  ChevronRight,
  Gamepad2,
  Play,
  Sparkles,
} from 'lucide-react';

import { fmt } from '../../constants';
import type { DashboardCtx } from '../../types';
import { SectionTitle } from '../../UI';
import {VocabularyBlockSkeleton} from "../../Skeletons"
const RING =
  'M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831';

const GREEN = '#158F66';
const DEEP = '#0B3D2E';
const LIME = '#D9F36B';

const ORANGE = '#FF9F43';
const ORANGE_DARK = '#A64B13';

export function VocabularyBlock({ ctx }: { ctx: DashboardCtx }) {
const {
  p,
  goTo,
  openModal,
  closeModal,
  triggerToast,
  loading,
  currentUser,
} = ctx;
  const wordsPct = Math.min(
    100,
    Math.max(0, Number(p.wordsPct) || 0)
  );

  const dotPattern = (color: string) => ({
    backgroundImage: `radial-gradient(${color} 1.5px, transparent 1.5px)`,
    backgroundSize: '22px 22px',
  });
if (loading && !currentUser) {
  return <VocabularyBlockSkeleton />;
}
  return (
    <section className="space-y-4">

      {/* ЗАГОЛОВОК */}
      <SectionTitle>Словарь</SectionTitle>

      <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-12">

        {/* 1. ВЫУЧЕННЫЕ СЛОВА — ОСНОВНОЙ ЗЕЛЁНЫЙ */}

        <button
          type="button"
          onClick={() => goTo('dictionary')}
          className="group relative isolate flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[26px] border-2 border-[#0B3D2E] bg-[#158F66] p-6 text-left text-white shadow-[0_7px_0_#0B3D2E,0_13px_22px_rgba(11,61,46,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_9px_0_#0B3D2E,0_17px_26px_rgba(11,61,46,0.16)] active:translate-y-0.5 motion-reduce:transition-none lg:col-span-7 md:p-8"
          style={dotPattern('rgba(255,255,255,0.16)')}
        >
          {/* Декоративные круги */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border-2 border-white/10"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-7 -top-10 h-44 w-44 rounded-full border-2 border-white/10"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-white/[0.05]"
          />

          {/* Верхняя часть */}
          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
              <BookOpen size={14} className="text-[#D9F36B]" />

              <span className="text-[10px] font-black uppercase tracking-wider text-white/90">
                Learned words
              </span>
            </div>

            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-[#0B3D2E]/20 bg-[#D9F36B] text-[#0B3D2E] transition-transform duration-300 group-hover:rotate-6">
              <Sparkles size={20} />
            </span>
          </div>

          {/* Прогресс */}
          <div className="relative z-10 my-5 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="text-4xl font-black tracking-tight md:text-5xl">
                {fmt(p.wordsLearned)}
              </div>

              <p className="mt-2 text-xs font-semibold text-white/75 md:text-sm">
                Выучено слов
              </p>

              <p className="mt-1 text-[11px] font-medium text-white/55 md:text-xs">
                Сохранено: {fmt(p.wordsSaved)}
              </p>
            </div>

            {/* Круговой прогресс */}
            <div
              className="relative h-24 w-24 shrink-0 md:h-28 md:w-28"
              role="img"
              aria-label={`Прогресс изучения слов: ${wordsPct}%`}
            >
              <svg
                className="h-full w-full -rotate-90"
                viewBox="0 0 36 36"
              >
                <path
                  stroke="#0B3D2E"
                  strokeOpacity="0.25"
                  strokeWidth="3.5"
                  fill="none"
                  d={RING}
                />

                <path
                  stroke={LIME}
                  strokeDasharray={`${wordsPct}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                  d={RING}
                  className="transition-all duration-700 motion-reduce:transition-none"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <BookOpen className="mb-1 h-5 w-5 text-[#D9F36B]" />

                <span className="text-sm font-black text-white">
                  {wordsPct}%
                </span>
              </div>
            </div>
          </div>

          {/* Нижняя часть */}
          <div className="relative z-10 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-white/85 md:text-xs">
              Нажмите для тренировки карточек
              <ChevronRight size={15} />
            </span>

            <span className="rounded-full bg-[#D9F36B] px-3 py-1.5 text-[10px] font-black text-[#0B3D2E] transition group-hover:bg-white">
              Открыть
            </span>
          </div>
        </button>

        {/* 2. ИГРОВЫЕ ТРЕНАЖЁРЫ — ЯРКИЙ ОРАНЖЕВЫЙ */}

        <button
          type="button"
          onClick={() =>
            openModal(
              'Vocabulary Games',
              <div className="space-y-3">
                <p className="text-sm text-slate-600">
                  Закрепляйте слова в игровом режиме:
                </p>

                {/* FLASHCARDS */}
                <button
                  type="button"
                  onClick={() => {
                    closeModal();
                    triggerToast('Запущена игра: Карточки');
                  }}
                  className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-[#158F66]/15 bg-[#EAF6F0] p-4 text-left transition hover:border-[#158F66]/40 hover:bg-[#D9F36B]/40"
                >
                  <div>
                    <span className="block text-sm font-black text-[#0B3D2E]">
                      🃏 Карточки
                    </span>

                    <span className="mt-1 block text-xs font-medium text-[#0B3D2E]/55">
                      Flashcards
                    </span>
                  </div>

                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#158F66] text-white">
                    <Play size={16} fill="currentColor" />
                  </span>
                </button>

                {/* QUICK TRANSLATION */}
                <button
                  type="button"
                  onClick={() => {
                    closeModal();
                    triggerToast('Запущена игра: Быстрый перевод');
                  }}
                  className="group flex w-full items-center justify-between gap-3 rounded-2xl border border-[#FF9F43]/30 bg-[#FFF1DF] p-4 text-left transition hover:border-[#A64B13]/40 hover:bg-[#FFE1C5]"
                >
                  <div>
                    <span className="block text-sm font-black text-[#71380F]">
                      ⚡ Быстрый перевод
                    </span>

                    <span className="mt-1 block text-xs font-medium text-[#A64B13]/70">
                      Quick translation
                    </span>
                  </div>

                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#FF9F43] text-[#71380F]">
                    <Play size={16} fill="currentColor" />
                  </span>
                </button>
              </div>
            )
          }
          className="group relative isolate flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[26px] border-2 border-[#A64B13] bg-[#FF9F43] p-6 text-left text-[#71380F] shadow-[0_7px_0_#A64B13,0_13px_22px_rgba(166,75,19,0.13)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_9px_0_#A64B13,0_17px_26px_rgba(166,75,19,0.18)] active:translate-y-0.5 motion-reduce:transition-none lg:col-span-5 md:p-8"
          style={dotPattern('rgba(113,56,15,0.12)')}
        >
          {/* Декоративные элементы */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-12 -top-14 h-56 w-56 rounded-full border-2 border-[#71380F]/15"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-5 -top-7 h-40 w-40 rounded-full border-2 border-[#71380F]/15"
          />

          <Gamepad2
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-5 -right-5 h-36 w-36 text-[#71380F]/10"
            strokeWidth={1.5}
          />

          {/* Заголовок */}
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#A64B13]/15 bg-white/30 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#71380F]">
                <Sparkles size={13} />
                Vocabulary games
              </span>

              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border-2 border-[#A64B13] bg-white text-[#A64B13] transition-transform duration-300 group-hover:rotate-6">
                <Gamepad2 size={21} />
              </span>
            </div>

            <h3 className="mt-5 text-2xl font-black leading-tight tracking-tight md:text-3xl">
              Игровые
              <br />
              тренажёры
            </h3>

            <p className="mt-3 max-w-xs text-xs font-semibold leading-relaxed text-[#71380F]/75 md:text-sm">
              Учите слова с удовольствием и соревнуйтесь в рейтинге учеников!
            </p>
          </div>

          {/* Кнопка */}
          <div className="relative z-10 mt-6 inline-flex h-10 items-center justify-center gap-2 self-start rounded-full border-2 border-[#A64B13] bg-white px-5 text-xs font-black text-[#A64B13] shadow-[0_4px_0_#A64B13] transition-all duration-300 group-hover:bg-[#D9F36B] group-hover:text-[#0B3D2E] group-active:translate-y-1 group-active:shadow-none md:text-sm">
            Играть сейчас

            <Play
              size={15}
              fill="currentColor"
            />
          </div>
        </button>
      </div>
    </section>
  );
}
