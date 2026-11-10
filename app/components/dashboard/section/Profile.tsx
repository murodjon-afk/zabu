'use client';
import React from 'react';
import Image from 'next/image';
import { ArrowRight, BookOpen, Check, ClipboardCheck, Coins, Pencil, Star, Trophy, Zap } from 'lucide-react';
import type { DashboardCtx } from '../types';
import {ProfileSkeleton} from "../Skeletons"
/* ───────── Данные пользователя (ctx.currentUser) ───────── */

type Raw = Record<string, unknown>;
type IconType = React.ComponentType<{ className?: string; strokeWidth?: number; 'aria-hidden'?: boolean }>;

function str(v: unknown, fallback = ''): string {
  if (typeof v === 'string' && v.trim()) return v.trim();
  if (typeof v === 'number' && Number.isFinite(v)) return String(v);
  return fallback;
}

function num(v: unknown, fallback = 0): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) return Number(v);
  return fallback;
}

type LangInfo = { name: string; logo: string | null };

function langInfo(value: unknown): LangInfo {
  const s = str(value).toLowerCase();
  if (!s) return { name: 'Не выбран', logo: null };
  if (/(tajik|tj|тадж|тоҷик|точик)/.test(s)) return { name: 'Таджикский', logo: '/logo-tj.webp' };
  if (/(persian|farsi|iran|ir\b|перс|фарси|فارسی)/.test(s)) return { name: 'Персидский', logo: '/logo-ir.webp' };
  if (/(english|eng|en\b|англ)/.test(s)) return { name: 'Английский', logo: '/logo-en.webp' };
  if (/(russian|рус)/.test(s)) return { name: 'Русский', logo: null };
  if (/(uzbek|узб)/.test(s)) return { name: 'Узбекский', logo: null };
  if (/(italian|итал)/.test(s)) return { name: 'Итальянский', logo: null };
  return { name: str(value), logo: null };
}

function scriptName(value: unknown): string {
  const s = str(value).toLowerCase();
  if (s.startsWith('cyr')) return 'Кириллица';
  if (s.startsWith('lat')) return 'Латиница';
  if (s.startsWith('ar') || s.startsWith('per')) return 'Арабское письмо';
  return str(value, '—');
}

function statusName(value: unknown): string {
  const s = str(value).toLowerCase();
  if (s === 'student') return 'Ученик';
  if (s === 'teacher') return 'Учитель';
  if (s === 'admin') return 'Администратор';
  return str(value, '—');
}

// TODO: когда в API появится аватар — читать его здесь
function readUser(ctx: DashboardCtx) {
  const u = ((ctx as unknown as { currentUser?: Raw | null }).currentUser ?? {}) as Raw;
  const rank = (ctx as unknown as { rank?: number }).rank;
  return {
    fullName: str(u.namefull ?? u.fullName ?? u.name, 'Ученик ZABU'),
    email: str(u.email, '—'),
    status: statusName(u.status),
    target: langInfo(u.targetTongue),
    native: langInfo(u.nativeTongue),
    script: scriptName(u.script),
    level: str(u.lvl, '—'),
    hw: num(u.hw),
    words: num(u.wordsLearned),
    scores: num(u.Scores ?? u.scores),
    lessons: num(u.lessonsComleted ?? u.lessonsCompleted),
    coins: num(u.coins),
    rank: typeof rank === 'number' && rank > 0 ? rank : null,
    image: str(u.image ?? u.avatar),
    hasUser: Object.keys(u).length > 0,
  };
}

// TODO: цели достижений можно менять здесь
function buildAchievements(pr: ReturnType<typeof readUser>) {
  return [
    { id: 'a1', title: 'Первый урок', icon: BookOpen as IconType, done: pr.lessons >= 1 },
    { id: 'a2', title: '100 слов', icon: Star as IconType, done: pr.words >= 100 },
    { id: 'a3', title: '100 монет', icon: Coins as IconType, done: pr.coins >= 100 },
    { id: 'a4', title: 'Домашка', icon: ClipboardCheck as IconType, done: pr.hw >= 1 },
    { id: 'a5', title: '500 очков', icon: Zap as IconType, done: pr.scores >= 500 },
    { id: 'a6', title: 'Топ-3', icon: Trophy as IconType, done: pr.rank !== null && pr.rank <= 3 },
  ];
}

/* ───────── Стили ───────── */

const DOTS_WHITE = {
  backgroundImage: 'radial-gradient(rgba(255,255,255,.22) 1.5px, transparent 1.5px)',
  backgroundSize: '24px 24px',
} as const;

const FOCUS = 'focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#2EB67D]';

const BTN_ON_GREEN = `inline-flex h-11 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-extrabold text-[#158F66] shadow-[0_4px_0_#0B3D2E] transition hover:translate-y-[2px] hover:bg-[#D9F36B] hover:text-[#0B3D2E] hover:shadow-[0_2px_0_#0B3D2E] active:translate-y-[4px] active:shadow-none motion-reduce:transition-none ${FOCUS}`;

const BTN_PRIMARY = `inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#158F66] px-6 text-sm font-extrabold text-white shadow-[0_6px_0_#0B3D2E] transition hover:translate-y-[2px] hover:shadow-[0_4px_0_#0B3D2E] active:translate-y-[4px] active:shadow-[0_2px_0_#0B3D2E] motion-reduce:transition-none ${FOCUS}`;

const CARD =
  'rounded-[28px] border-2 border-[#0B3D2E]/10 bg-white p-5 shadow-[0_8px_0_rgba(11,61,46,0.08)] sm:p-6';

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((s) => s[0]?.toUpperCase() ?? '').join('') || 'Z';
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-2xl font-black leading-[1.1] tracking-[-0.03em] text-[#0B3D2E]">
      {children}
      <span className="text-[#158F66]">.</span>
    </h2>
  );
}

function Stat({ icon: Icon, label, value }: { icon: IconType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF6F0] text-[#158F66]">
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <div className="truncate text-2xl font-black leading-none tracking-[-0.03em] text-[#0B3D2E]">{value}</div>
        <div className="mt-1 truncate text-xs font-bold text-[#0B3D2E]/55">{label}</div>
      </div>
    </div>
  );
}

function LangBadge({ lang, size }: { lang: LangInfo; size: number }) {
  if (lang.logo) {
    return (
      <Image
        src={lang.logo}
        alt={lang.name}
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="shrink-0 rounded-full border-2 border-[#0B3D2E] bg-white object-cover shadow-[0_3px_0_#0B3D2E]"
      />
    );
  }
  return (
    <span
      style={{ width: size, height: size }}
      aria-label={lang.name}
      className="flex shrink-0 items-center justify-center rounded-full border-2 border-[#0B3D2E] bg-white text-base font-black text-[#0B3D2E] shadow-[0_3px_0_#0B3D2E]"
    >
      {lang.name.slice(0, 1).toUpperCase()}
    </span>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b-2 border-[#EAF6F0] py-3 last:border-b-0">
      <dt className="shrink-0 text-sm font-bold text-[#0B3D2E]/55">{label}</dt>
      <dd className="min-w-0 truncate text-right text-[15px] font-black text-[#0B3D2E]">{value}</dd>
    </div>
  );
}

/* ───────── Секция «Профиль» ───────── */

export function Profile({ ctx }: { ctx: DashboardCtx }) {
  const pr = readUser(ctx);
  const loading = Boolean((ctx as unknown as { loading?: boolean }).loading);
  const achievements = buildAchievements(pr);
if (loading && !pr.hasUser) {
  return <ProfileSkeleton />;
}
  const isNewbie = pr.lessons === 0;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* ───────── HERO ───────── */}
      <section
        className="relative overflow-hidden rounded-[28px] border-2 border-[#0B3D2E] bg-[#158F66] p-5 shadow-[0_8px_0_#0B3D2E] sm:rounded-[48px] sm:p-8"
        style={DOTS_WHITE}
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 -right-4 select-none text-[120px] font-black leading-none tracking-[-0.04em] text-white/15 sm:text-[200px]"
        >
          ZABU.
        </span>

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <div className="flex min-w-0 items-center gap-4 sm:gap-6">
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-[#0B3D2E] bg-[#D9F36B] shadow-[0_5px_0_#0B3D2E] sm:h-28 sm:w-28">
              <div className="flex h-full w-full items-center justify-center text-3xl font-black tracking-[-0.03em] text-[#0B3D2E] sm:text-5xl">
                {pr.image ? (
                  <Image src={pr.image} alt={pr.fullName} fill sizes="112px" unoptimized className="object-cover" />
                ) : (
                  initials(pr.fullName)
                )}
              </div>
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-[26px] font-black leading-[1.1] tracking-[-0.04em] text-white sm:text-[40px]">
                {pr.fullName}
                <span className="text-[#D9F36B]">.</span>
              </h1>
              <p className="mt-1 truncate text-sm font-bold text-white/80 sm:text-base">{pr.email}</p>
            </div>
          </div>

          <button
            type="button"
            className={`${BTN_ON_GREEN} w-full shrink-0 sm:w-auto`}
            onClick={() => ctx.goTo('settings')}
          >
            <Pencil className="h-4 w-4" aria-hidden /> Редактировать
          </button>
        </div>
      </section>

      {/* ───────── СТАТИСТИКА ───────── */}
      <section className={CARD} aria-label="Статистика">
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          <Stat icon={Star} label="Слов" value={String(pr.words)} />
          <Stat icon={BookOpen} label="Уроков" value={String(pr.lessons)} />
          <Stat icon={Zap} label="Очков" value={String(pr.scores)} />
          <Stat icon={Coins} label="Монет" value={String(pr.coins)} />
        </div>
      </section>

      {/* ───────── КУРС ───────── */}
      <section className={CARD} aria-label="Мой курс">
        <Title>Мой курс</Title>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex items-center">
          
              <LangBadge lang={pr.target} size={60} />
            </div>
            <div className="min-w-0">
              <div className="truncate text-xl font-black tracking-[-0.03em] text-[#0B3D2E]">{pr.target.name}</div>
              <div className="text-sm font-bold text-[#0B3D2E]/55">{pr.level}</div>
            </div>
          </div>

          <button type="button" className={`${BTN_PRIMARY} shrink-0`} onClick={() => ctx.goTo('lessons')}>
            {isNewbie ? 'Начать' : 'Продолжить'}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </section>

      {/* ───────── ДОСТИЖЕНИЯ ───────── */}
      <section className={CARD} aria-label="Достижения">
        <Title>Достижения</Title>
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {achievements.map((a) => {
            const Icon = a.icon;
            return (
              <li
                key={a.id}
                className={`relative flex flex-col items-center gap-2 rounded-2xl border-2 px-2 py-4 text-center ${
                  a.done ? 'border-[#9FCDB7] bg-[#EAF6F0]' : 'border-[#E3EBE5] bg-[#F8FBF9]'
                }`}
              >
                {a.done && (
                  <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#158F66] text-white">
                    <Check className="h-3 w-3" strokeWidth={4} aria-hidden />
                  </span>
                )}
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    a.done ? 'bg-[#F6C945] text-[#0B3D2E]' : 'bg-[#E2EBE5] text-[#0B3D2E]/35'
                  }`}
                >
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <span className={`text-xs font-black leading-tight ${a.done ? 'text-[#0B3D2E]' : 'text-[#0B3D2E]/45'}`}>
                  {a.title}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ───────── АККАУНТ ───────── */}
      <section className={CARD} aria-label="Аккаунт">
        <Title>Аккаунт</Title>
        <dl>
          <Row label="Email" value={pr.email} />
          <Row label="Статус" value={pr.status} />
          <Row label="Родной язык" value={pr.native.name} />
          <Row label="Изучаю" value={pr.target.name} />
          <Row label="Письмо" value={pr.script} />
        </dl>
      </section>
    </div>
  );
}

export default Profile;