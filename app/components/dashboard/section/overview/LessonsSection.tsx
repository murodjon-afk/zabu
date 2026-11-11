'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Star,
  Trophy,
  LockKeyhole,
  Check,
  Sparkles,
  MessageCircle,
  GraduationCap,
  Languages,
  Hash,
  Utensils,
  Users,
  Smile,
  Mountain,
  Plane,
  Briefcase,
  Home,
  ClipboardCheck,
  type LucideIcon,
} from 'lucide-react';
import type { DashboardCtx } from '../../types';
import { LessonsSectionSkeleton} from "../../Skeletons";
type Lesson = {
  id: number;
  type: 'alphabet' | 'lesson' | 'mini_test' | 'test';
  category: string;
  title: Record<string, string>;
  words: number[];
  lessonIds?: number[];
};

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  alphabet: Languages,
  greetings: MessageCircle,
  numbers: Hash,
  food: Utensils,
  family: Users,
  emotions: Smile,
  education: GraduationCap,
  nature: Mountain,
  travel: Plane,
  work: Briefcase,
  home: Home,
};

const isHomework = (l: Lesson) => l.type === 'mini_test' || l.type === 'test';

function getIcon(l: Lesson): LucideIcon {
  if (isHomework(l)) return ClipboardCheck;
  return CATEGORY_ICONS[l.category] ?? BookOpen;
}

function getSubtitle(l: Lesson) {
  if (l.type === 'alphabet') return 'Алфавит';
  if (isHomework(l)) return 'Домашнее задание';
  return `${l.words.length} слов`;
}

/* ───────── геометрия карты ───────── */

const W = 360; // ширина карты (viewBox)
const CENTER = W / 2;
const OFFSET = 105; // отклонение дороги влево/вправо
const STEP = 150; // расстояние между узлами по вертикали
const PAD = 80; // отступ сверху и снизу
const ZIG = [1, 0, -1, 0]; // волна: право, центр, лево, центр

const SHOW_TEST_LINKS = true; // линии от уроков к ДЗ

const segment = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const my = (a.y + b.y) / 2;
  return `M ${a.x} ${a.y} C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${b.y}`;
};

export function LessonsSection({ ctx }: { ctx: DashboardCtx }) {
  const { p } = ctx;

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/lessons', { signal: controller.signal })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error ?? 'Не удалось загрузить уроки');
        setLessons(Array.isArray(data.lessons) ? data.lessons : []);
      })
      .catch((e) => {
        if (e.name !== 'AbortError') setError(e.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  const total = lessons.length;
  const completed = Math.min(total, Math.max(0, Math.floor(p.lessonsDone)));
  const progress = total ? Math.round((completed / total) * 100) : 0;

  /* координаты узлов */
  const { points, H } = useMemo(() => {
    let zig = 0;
    const pts = lessons.map((l, i) => {
      const x =
        l.type === 'lesson' ? CENTER + ZIG[zig++ % ZIG.length] * OFFSET : CENTER;
      return { x, y: PAD + i * STEP };
    });
    return { points: pts, H: PAD * 2 + Math.max(0, lessons.length - 1) * STEP };
  }, [lessons]);

  /* линии от уроков к их ДЗ */
  const testLinks = useMemo(() => {
    if (!SHOW_TEST_LINKS) return [];
    const links: { from: number; to: number }[] = [];

    lessons.forEach((t, ti) => {
      if (t.type !== 'mini_test' || !t.lessonIds) return;
      t.lessonIds.forEach((id) => {
        const li = lessons.findIndex((l) => l.type === 'lesson' && l.id === id);
        // соседний урок уже соединён основной дорогой
        if (li >= 0 && li < ti - 1) links.push({ from: li, to: ti });
      });
    });

    return links;
  }, [lessons]);

  if (loading) {
    return <p className="p-6 text-sm font-bold text-[#0B3D2E]/50">Загрузка уроков...</p>;
  }

  if (error || total === 0) {
    return (
      <p className="p-6 text-sm font-bold text-red-600">
        {error ?? 'Уроки не найдены'}
      </p>
    );
  }
if (loading) return <LessonsSectionSkeleton />;
  return (
<div className="space-y-6 pb-[calc(7rem+env(safe-area-inset-bottom))] min-[900px]:pb-8">
      {/* HEADER */}
      <div>
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-[#D9F36B] px-3 py-1.5 text-xs font-black text-[#0B3D2E]">
          <Sparkles size={14} />
          ТВОЙ ПУТЬ К ЗНАНИЯМ
        </div>

        <h2 className="text-3xl font-black tracking-[-0.04em] text-[#0B3D2E]">
          Уроки<span className="text-[#158F66]">.</span>
        </h2>

        <p className="mt-1 text-sm font-medium text-[#0B3D2E]/55">
          Курс {p.target.ru} · {total} увлекательных этапов
        </p>
      </div>

      {/* PROGRESS */}
      <div className="rounded-[28px] border-2 border-[#0B3D2E] bg-[#158F66] p-5 text-white shadow-[0_8px_0_#0B3D2E]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-white/70">
              Твой прогресс
            </p>
            <p className="mt-1 text-3xl font-black tracking-tight">{progress}%</p>
            <p className="mt-1 text-sm font-semibold text-white/80">
              {completed} из {total} этапов пройдено
            </p>
          </div>

          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-[#0B3D2E] bg-[#D9F36B] text-[#0B3D2E] shadow-[4px_4px_0_#0B3D2E]">
            <Trophy size={32} strokeWidth={2.5} />
          </div>
        </div>

        <div className="mt-5 h-4 overflow-hidden rounded-full border-2 border-[#0B3D2E] bg-[#0B3D2E]/20">
          <div
            className="h-full rounded-full bg-[#D9F36B] transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* MAP */}
      <div className="relative overflow-hidden rounded-[32px] border-2 border-[#0B3D2E]/10 bg-[#EAF6F0] px-3 py-8 sm:px-6">

        <div className="pointer-events-none absolute -right-8 top-10 h-28 w-28 rounded-full border-2 border-dashed border-[#158F66]/20" />
        <div className="pointer-events-none absolute -left-10 bottom-24 h-36 w-36 rounded-full border-2 border-dashed border-[#158F66]/20" />

        <div className="relative z-10 mb-6 text-center">
          <span className="rounded-full bg-white px-4 py-2 text-xs font-black text-[#158F66] shadow-[0_3px_0_rgba(11,61,46,0.1)]">
            🌱 НАЧАЛО ПУТЕШЕСТВИЯ
          </span>
        </div>

        <div
          className="relative mx-auto w-full max-w-[420px]"
          style={{ aspectRatio: `${W} / ${H}` }}
        >
          {/* ДОРОГА */}
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="absolute inset-0 h-full w-full"
            fill="none"
            aria-hidden
          >
            {/* линии от уроков к ДЗ */}
            {testLinks.map(({ from, to }) => {
              const a = points[from];
              const b = points[to];
              const bow = a.x === CENTER ? (from % 2 ? 70 : -70) : (a.x - CENTER) * 0.6;
              const d = `M ${a.x} ${a.y} Q ${a.x + bow} ${(a.y + b.y) / 2}, ${b.x} ${b.y}`;

              return (
                <path
                  key={`link-${from}-${to}`}
                  d={d}
                  stroke="#158F66"
                  strokeOpacity={completed > to ? 0.55 : 0.3}
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeDasharray="1 9"
                />
              );
            })}

            {/* основная дорога */}
            {points.slice(0, -1).map((a, i) => {
              const d = segment(a, points[i + 1]);
              const done = i < completed;

              return (
                <g key={`seg-${i}`}>
                  <path
                    d={d}
                    stroke={done ? '#0B3D2E' : 'rgba(11,61,46,0.12)'}
                    strokeWidth={done ? 24 : 20}
                    strokeLinecap="round"
                  />
                  <path
                    d={d}
                    stroke={done ? '#D9F36B' : '#ffffff'}
                    strokeWidth={14}
                    strokeLinecap="round"
                  />
                  {!done && (
                    <path
                      d={d}
                      stroke="rgba(11,61,46,0.18)"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeDasharray="2 12"
                    />
                  )}
                </g>
              );
            })}
          </svg>

          {/* УЗЛЫ */}
          {lessons.map((lesson, index) => {
            const { x, y } = points[index];
            const isCompleted = index < completed;
            const isCurrent = index === completed;
            const isLocked = index > completed;
            const hw = isHomework(lesson);
            const Icon = getIcon(lesson);

            return (
              <div
                key={`${lesson.type}-${lesson.id}`}
                className="absolute z-10 flex w-[120px] -translate-x-1/2 -translate-y-10 flex-col items-center"
                style={{ left: `${(x / W) * 100}%`, top: `${(y / H) * 100}%` }}
              >
                {/* ISLAND */}
                <div
                  className={`relative flex h-20 w-20 items-center justify-center border-[3px] transition-transform ${
                    hw ? 'rounded-full' : 'rounded-[28px]'
                  } ${
                    isCompleted
                      ? 'border-[#0B3D2E] bg-[#D9F36B] text-[#0B3D2E] shadow-[0_6px_0_#0B3D2E]'
                      : isCurrent
                        ? 'border-[#0B3D2E] bg-[#158F66] text-white shadow-[0_7px_0_#0B3D2E] -translate-y-1'
                        : 'border-[#0B3D2E]/10 bg-white text-[#0B3D2E]/30 shadow-[0_5px_0_rgba(11,61,46,0.1)]'
                  }`}
                >
                  {isCurrent && (
                    <span
                      className={`absolute inset-0 -z-10 animate-ping bg-[#158F66]/30 ${
                        hw ? 'rounded-full' : 'rounded-[28px]'
                      }`}
                    />
                  )}

                  {isLocked ? (
                    <LockKeyhole size={27} strokeWidth={2.5} />
                  ) : isCompleted ? (
                    <Check size={34} strokeWidth={3.5} />
                  ) : (
                    <Icon size={32} strokeWidth={2.5} />
                  )}

                  {isCurrent && (
                    <span className="absolute -right-2 -top-3 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0B3D2E] bg-[#D9F36B] text-[#0B3D2E]">
                      <Star size={14} fill="currentColor" />
                    </span>
                  )}

                  {isCompleted && (
                    <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#0B3D2E] bg-white text-[#158F66]">
                      <Star size={13} fill="currentColor" />
                    </span>
                  )}

                  {/* ДЗ-метка */}
                  {hw && (
                    <span className="absolute -left-3 -top-2 rounded-full border-2 border-[#0B3D2E] bg-white px-1.5 py-0.5 text-[9px] font-black text-[#0B3D2E]">
                      ДЗ
                    </span>
                  )}
                </div>

                {/* LABEL */}
                <div className="mt-3 w-full text-center">
                  <p
                    className={`break-words text-xs font-black leading-tight ${
                      isLocked ? 'text-[#0B3D2E]/40' : 'text-[#0B3D2E]'
                    }`}
                  >
                    {lesson.title.ru}
                  </p>

                  <p className="mt-1 text-[10px] font-semibold text-[#0B3D2E]/45">
                    {isCompleted
                      ? 'Пройдено'
                      : isCurrent
                        ? 'Твой урок!'
                        : getSubtitle(lesson)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* FINISH */}
        <div className="relative z-10 mt-10 flex justify-center">
          <div className="flex items-center gap-3 rounded-full border-2 border-[#0B3D2E] bg-[#D9F36B] px-5 py-3 shadow-[0_5px_0_#0B3D2E]">
            <Trophy size={22} className="text-[#0B3D2E]" />
            <span className="text-sm font-black text-[#0B3D2E]">Финиш · A1</span>
          </div>
        </div>
      </div>

      {/* LEGEND */}
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 rounded-2xl border-2 border-[#0B3D2E]/10 bg-white p-4">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border-2 border-[#0B3D2E] bg-[#D9F36B]" />
          <span className="text-xs font-bold text-[#0B3D2E]/65">Пройдено</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border-2 border-[#0B3D2E] bg-[#158F66]" />
          <span className="text-xs font-bold text-[#0B3D2E]/65">Текущий</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border-2 border-[#0B3D2E]/10 bg-white" />
          <span className="text-xs font-bold text-[#0B3D2E]/65">Закрыто</span>
        </div>
        <div className="flex items-center gap-2">
          <ClipboardCheck size={14} className="text-[#0B3D2E]/65" />
          <span className="text-xs font-bold text-[#0B3D2E]/65">Домашнее задание</span>
        </div>
      </div>
    </div>
  );
}

