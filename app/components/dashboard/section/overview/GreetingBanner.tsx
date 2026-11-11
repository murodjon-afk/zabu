
'use client';

import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import {
  Languages,
  Sparkles,
  MessageCircle,
  BrainCircuit,
  BookOpen,
  Volume2,
  Users,
  UserPlus,
  Smartphone,
  Download,
  Gift,
  Coins,
} from 'lucide-react';

import { GreetingBannerSkeleton } from '../../Skeletons';
import type { DashboardCtx } from '../../types';

// Ссылки на страницы
const START_LESSONS_HREF = '/dashboard/lessons';
const START_AI_HREF = '/dashboard/ai';
const START_FRIENDS_HREF = '/dashboard/friends';
const START_APP_HREF = '/install'; // Измени, если адрес страницы установки другой

/* Фирменные цвета ZABU */
const GREEN = '#158F66';
const DEEP = '#0B3D2E';
const LIME = '#D9F36B';
const GOLD = '#F6C945';

/* Второй баннер — нежно-фиолетовый */
const PURPLE_BG = '#E9DDF7';
const PURPLE_DEEP = '#50356F';

/* Третий баннер — мягкий оранжевый */
const ORANGE_BG = '#FFE1C5';
const ORANGE_DEEP = '#A64B13';

/* Четвёртый баннер — лаймовый */
const LIME_BG = '#D9F36B';
const LIME_DEEP = '#0B3D2E';

type Script = 'cyrillic' | 'latin' | 'arabic';

const WELCOME: Record<string, Partial<Record<Script, string>>> = {
  tajik: {
    cyrillic: 'Хуш омадед',
    latin: 'Xush omaded',
    arabic: 'خوش آمدید',
  },
  persian: {
    arabic: 'خوش آمدید',
    latin: 'Khosh amadid',
  },
  uzbek: {
    latin: 'Xush kelibsiz',
    cyrillic: 'Хуш келибсиз',
    arabic: 'خوش كېلیبسیز',
  },
  russian: {
    cyrillic: 'Добро пожаловать',
    latin: 'Dobro pozhalovat',
  },
  english: { latin: 'Welcome' },
  italian: { latin: 'Benvenuto' },
  turkish: { latin: 'Hoş geldiniz' },
  arabic: {
    arabic: 'أهلاً وسهلاً',
    latin: 'Ahlan wa sahlan',
  },
  kazakh: {
    cyrillic: 'Қош келдіңіз',
    latin: 'Qosh keldiniz',
  },
  kyrgyz: {
    cyrillic: 'Кош келиңиз',
    latin: 'Kosh keliniz',
  },
  german: { latin: 'Willkommen' },
  french: { latin: 'Bienvenue' },
  spanish: { latin: 'Bienvenido' },
  chinese: { latin: '欢迎' },
  korean: { latin: '환영합니다' },
  japanese: { latin: 'ようこそ' },
};

const LANGUAGE_NAMES: Record<string, string> = {
  tajik: 'Таджикский',
  persian: 'Персидский',
  uzbek: 'Узбекский',
  russian: 'Русский',
  english: 'Английский',
  italian: 'Итальянский',
  turkish: 'Турецкий',
  arabic: 'Арабский',
  kazakh: 'Казахский',
  kyrgyz: 'Кыргызский',
  german: 'Немецкий',
  french: 'Французский',
  spanish: 'Испанский',
  chinese: 'Китайский',
  korean: 'Корейский',
  japanese: 'Японский',
};

const LANGUAGE_LOGOS: Record<string, string> = {
  tajik: '/logo-tj.webp',
  english: '/logo-en.webp',
  persian: '/logo-ir.webp',
};

const norm = (s: unknown) =>
  (typeof s === 'string' ? s : '').trim().toLowerCase();

function pickWelcome(
  tongue: unknown,
  script: unknown
): { text: string; rtl: boolean } {
  const entry = WELCOME[norm(tongue)];

  if (!entry) {
    return { text: 'Welcome', rtl: false };
  }

  const selectedScript = norm(script) as Script;
  const text =
    entry[selectedScript] ??
    Object.values(entry)[0] ??
    'Welcome';

  return {
    text,
    rtl: text === entry.arabic,
  };
}

function pickTranslation(native: unknown): string {
  const entry = WELCOME[norm(native)];

  if (!entry) return 'Welcome';

  return (
    entry.cyrillic ??
    entry.latin ??
    Object.values(entry)[0] ??
    'Welcome'
  );
}

/* ---------- Вращение орбиты ---------- */

const spin = (
  seconds: number,
  reverse = false
): CSSProperties => ({
  animationDuration: `${seconds}s`,
  animationDirection: reverse ? 'reverse' : 'normal',
  animationTimingFunction: 'linear',
});

/** Точечный фон */
const dots = (color: string): CSSProperties => ({
  backgroundImage: `radial-gradient(${color} 1.5px, transparent 1.5px)`,
  backgroundSize: '22px 22px',
});

function OrbitChip({
  className,
  children,
  seconds,
}: {
  className: string;
  children: ReactNode;
  seconds: number;
}) {
  return (
    <div className={`absolute ${className}`}>
      <div
        className="flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#0B3D2E] bg-white text-[#158F66] md:h-6 md:w-6"
        style={spin(seconds, true)}
      >
        {children}
      </div>
    </div>
  );
}

/* ---------- Кнопки ---------- */

type Tone = 'green' | 'deep' | 'purple' | 'coral' | 'lime';

const BUTTON_TONE: Record<Tone, string> = {
  green:
    'bg-white text-[#158F66] shadow-[0_3px_0_#0B3D2E] hover:bg-[#D9F36B] hover:text-[#0B3D2E]',

  deep:
    'bg-[#D9F36B] text-[#0B3D2E] shadow-[0_3px_0_#158F66] hover:bg-white',

  purple:
    'bg-white text-[#50356F] shadow-[0_3px_0_#50356F] hover:bg-[#D9F36B] hover:text-[#0B3D2E]',

  coral:
    'bg-white text-[#A64B13] shadow-[0_3px_0_#A64B13] hover:bg-[#FFF0DE] hover:text-[#71380F]',

  lime:
    'bg-[#0B3D2E] text-[#D9F36B] shadow-[0_3px_0_#158F66] hover:bg-white hover:text-[#0B3D2E]',
};

function StartButton({
  href,
  tone,
  label = 'Начать',
}: {
  href: string;
  tone: Tone;
  label?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex h-8 items-center justify-center rounded-full px-4 text-xs font-extrabold transition active:translate-y-[2px] active:shadow-none focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-white md:h-9 md:px-5 md:text-sm ${BUTTON_TONE[tone]}`}
    >
      {label}
    </Link>
  );
}

/* ---------- Анимации ---------- */

function BannerKeyframes() {
  return (
    <style>{`
      @keyframes coin-fall {
        0%   { transform: translateY(-30px) rotate(0deg); opacity: 0; }
        10%  { opacity: 1; }
        90%  { opacity: 1; }
        100% { transform: translateY(170px) rotate(360deg); opacity: 0; }
      }

      @keyframes coin-flip {
        0%   { transform: rotateY(0deg); }
        100% { transform: rotateY(360deg); }
      }

      @keyframes float-y {
        0%, 100% { transform: translateY(0); }
        50%      { transform: translateY(-6px); }
      }

      @keyframes twinkle {
        0%, 100% { opacity: 0.2; transform: scale(0.8); }
        50%      { opacity: 1; transform: scale(1.2); }
      }

      @keyframes phone-float {
        0%, 100% { transform: translateY(0) rotate(-7deg); }
        50%      { transform: translateY(-7px) rotate(3deg); }
      }

      @keyframes lime-orbit {
        from { transform: rotate(0deg); }
        to   { transform: rotate(360deg); }
      }

      @keyframes lime-pulse {
        0%, 100% { transform: scale(1); }
        50%      { transform: scale(1.08); }
      }

      @media (prefers-reduced-motion: reduce) {
        .anim { animation: none !important; }
      }
    `}</style>
  );
}

/* Падающие монетки и эмодзи */

const FALLING = [
  { left: '4%', emoji: '🪙', size: 18, dur: 4.2, delay: 0 },
  { left: '14%', emoji: '💰', size: 16, dur: 5.5, delay: 1.2 },
  { left: '26%', emoji: '🪙', size: 14, dur: 3.8, delay: 2.1 },
  { left: '38%', emoji: '✨', size: 14, dur: 4.8, delay: 0.6 },
  { left: '50%', emoji: '🪙', size: 20, dur: 5.2, delay: 1.8 },
  { left: '62%', emoji: '🎁', size: 16, dur: 6.0, delay: 0.3 },
  { left: '72%', emoji: '🪙', size: 16, dur: 4.0, delay: 2.6 },
  { left: '84%', emoji: '💎', size: 15, dur: 5.0, delay: 1.0 },
  { left: '94%', emoji: '🪙', size: 18, dur: 4.5, delay: 2.0 },
];

const TWINKLES = [
  { top: '12%', left: '30%', delay: 0 },
  { top: '70%', left: '45%', delay: 0.7 },
  { top: '25%', left: '58%', delay: 1.3 },
  { top: '60%', left: '12%', delay: 0.4 },
  { top: '18%', left: '80%', delay: 1.0 },
];

function OrbitCoin({
  className,
  size = 'text-base',
}: {
  className: string;
  size?: string;
}) {
  return (
    <div className={`absolute ${className}`}>
      <div
        className={`anim animate-spin ${size}`}
        style={spin(6, true)}
      >
        🪙
      </div>
    </div>
  );
}

/* ---------- Главный баннер ---------- */

export function GreetingBanner({ ctx }: { ctx: DashboardCtx }) {
  const { loading, currentUser } = ctx;

  const [activeSlide, setActiveSlide] = useState(0);
  const [paused, setPaused] = useState(false);

  // Автоматическая смена четырёх слайдов
  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 4);
    }, 5000);

    return () => clearInterval(interval);
  }, [paused]);

  const targetTongue = currentUser?.targetTongue;
  const nativeTongue = currentUser?.nativeTongue;
  const script = currentUser?.script;

  const key = norm(targetTongue);
  const logo = LANGUAGE_LOGOS[key];

  const { text: welcome, rtl } = pickWelcome(targetTongue, script);
  const translation = pickTranslation(nativeTongue);
  const languageName = LANGUAGE_NAMES[key] || 'Новый язык';

  const showWelcome = !(loading && !currentUser);

  const slideBase =
    'relative isolate flex h-[120px] w-full shrink-0 items-center overflow-hidden px-4 md:h-[136px] md:px-6';

  // Цвет внешней рамки и объёмной тени зависит от слайда
  const frameStyle: CSSProperties =
    activeSlide === 1
      ? {
          backgroundColor: PURPLE_BG,
          borderColor: PURPLE_DEEP,
          boxShadow: `0 8px 0 ${PURPLE_DEEP}`,
        }
      : activeSlide === 2
        ? {
            backgroundColor: ORANGE_BG,
            borderColor: ORANGE_DEEP,
            boxShadow: `0 8px 0 ${ORANGE_DEEP}`,
          }
        : activeSlide === 3
          ? {
              backgroundColor: LIME_BG,
              borderColor: LIME_DEEP,
              boxShadow: `0 8px 0 ${LIME_DEEP}`,
            }
          : {
              backgroundColor: DEEP,
              borderColor: DEEP,
              boxShadow: `0 8px 0 ${DEEP}`,
            };

  if (loading && !currentUser) {
    return <GreetingBannerSkeleton />;
  }

  return (
    <div
      className="relative mb-5 w-full overflow-hidden rounded-[28px] border-2"
      style={frameStyle}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Баннеры"
    >
      <BannerKeyframes />

      {/* SLIDES CONTAINER */}

      <div
        className="flex transition-transform duration-700 ease-in-out motion-reduce:transition-none"
        style={{
          transform: `translateX(-${activeSlide * 100}%)`,
        }}
      >
        {/* SLIDE 1 — WELCOME */}

        <section
          className={`${slideBase} text-white`}
          style={{
            backgroundColor: GREEN,
            ...dots('rgba(255,255,255,.18)'),
          }}
        >
          <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full border-2 border-white/15" />
          <div className="pointer-events-none absolute -right-1 -top-10 h-40 w-40 rounded-full border-2 border-white/15" />
          <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-white/10" />

          <Languages className="pointer-events-none absolute -bottom-8 -left-6 h-32 w-32 text-white opacity-[0.1]" />

          <div className="relative z-10 flex w-full items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2
                dir={rtl ? 'rtl' : 'ltr'}
                className="truncate text-xl font-black leading-tight tracking-tight md:text-3xl"
              >
                {showWelcome ? welcome : '...'}
              </h2>

              <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                {showWelcome && (
                  <span className="text-xs font-semibold text-white/85 md:text-sm">
                    {translation}
                  </span>
                )}

                <span
                  className="hidden items-center rounded-full px-2.5 py-0.5 text-[11px] font-black sm:inline-flex"
                  style={{ backgroundColor: LIME, color: DEEP }}
                >
                  {languageName}
                </span>
              </div>

              <div className="mt-2.5">
                <StartButton href={START_LESSONS_HREF} tone="green" />
              </div>
            </div>

            {logo && (
              <div className="relative flex h-[84px] w-[84px] shrink-0 items-center justify-center md:h-[100px] md:w-[100px]">
                <div className="absolute inset-3 rounded-full bg-white/15" />
                <div className="absolute inset-0 rounded-full border-2 border-white/30" />

                <div
                  className="absolute inset-0 animate-spin motion-reduce:animate-none"
                  style={spin(16)}
                >
                  <div className="absolute inset-1.5 rounded-full border-2 border-dashed border-white/40" />

                  <OrbitChip
                    className="left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
                    seconds={16}
                  >
                    <BookOpen size={11} />
                  </OrbitChip>

                  <OrbitChip
                    className="bottom-[14%] right-[2%] translate-x-1/2 translate-y-1/2"
                    seconds={16}
                  >
                    <Volume2 size={11} />
                  </OrbitChip>

                  <OrbitChip
                    className="bottom-[14%] left-[2%] -translate-x-1/2 translate-y-1/2"
                    seconds={16}
                  >
                    <Sparkles size={11} />
                  </OrbitChip>
                </div>

                <div className="relative h-12 w-12 overflow-hidden rounded-xl border-2 border-[#0B3D2E] bg-white shadow-[0_4px_0_#0B3D2E] md:h-16 md:w-16">
                  <Image
                    src={logo}
                    alt={`${languageName} logo`}
                    fill
                    sizes="(max-width: 768px) 48px, 64px"
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SLIDE 2 — AI PRACTICE */}

        <section
          className={`${slideBase} text-[#39264F]`}
          style={{
            backgroundColor: PURPLE_BG,
            ...dots('rgba(80,53,111,.13)'),
          }}
        >
          <div className="pointer-events-none absolute -right-8 -top-24 h-60 w-60 rounded-full border-2 border-[#50356F]/15" />
          <div className="pointer-events-none absolute -bottom-24 left-1/4 h-60 w-60 rounded-full bg-[#50356F]/10" />
          <div className="absolute right-1/4 top-4 h-1.5 w-1.5 rounded-full bg-[#50356F]" />
          <div className="absolute bottom-6 left-1/3 h-2 w-2 rounded-full bg-[#9B7BC1]" />

          <div className="relative z-10 flex w-full items-center justify-between gap-3">
            <div className="min-w-0 max-w-2xl flex-1">
              <h2 className="text-base font-black leading-tight tracking-tight md:text-2xl">
                Практикуй язык{' '}
                <span
                  className="inline-block -rotate-2 rounded-lg px-2 pb-0.5"
                  style={{
                    backgroundColor: LIME,
                    color: PURPLE_DEEP,
                  }}
                >
                  с ИИ
                </span>
              </h2>

              <p className="mt-1 text-[10px] font-semibold text-[#50356F]/65 md:text-xs">
                Учись общаться и практикуй каждый день
              </p>

              <div className="mt-2.5">
                <StartButton href={START_AI_HREF} tone="purple" />
              </div>
            </div>

            <div className="relative flex h-[84px] w-[84px] shrink-0 items-center justify-center md:h-[100px] md:w-[100px]">
              <div className="absolute inset-0 rounded-full border-2 border-[#50356F]/25" />

              <div
                className="absolute inset-2 animate-spin rounded-full border-2 border-dashed border-[#50356F]/45 motion-reduce:animate-none"
                style={spin(20)}
              />

              <div className="absolute inset-4 rounded-full bg-white/55" />

              <div className="relative z-10 flex h-11 w-11 rotate-6 items-center justify-center rounded-2xl border-2 border-[#50356F] bg-[#D9F36B] text-[#50356F] shadow-[0_4px_0_#50356F] md:h-14 md:w-14">
                <BrainCircuit size={26} className="md:hidden" />
                <BrainCircuit size={34} className="hidden md:block" />
              </div>

              <div className="absolute right-0 top-0 z-20 rounded-lg border-2 border-[#50356F] bg-white p-1 text-[#50356F]">
                <Sparkles size={12} />
              </div>

              <div className="absolute bottom-0 left-0 z-20 rounded-lg border-2 border-white bg-[#50356F] p-1 text-white">
                <MessageCircle size={12} />
              </div>

              <div className="absolute left-0 top-0 z-20 rounded-lg border-2 border-[#50356F] bg-white p-1 text-[#50356F]">
                <Languages size={11} />
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 3 — INVITE FRIENDS */}

        <section
          className={slideBase}
          style={{
            backgroundColor: ORANGE_BG,
            color: ORANGE_DEEP,
            ...dots('rgba(122,59,18,.13)'),
          }}
        >
          <div className="pointer-events-none absolute -right-10 -top-20 h-52 w-52 rounded-full border-2 border-[#A64B13]/20" />
          <div className="pointer-events-none absolute -bottom-24 left-1/4 h-56 w-56 rounded-full bg-white/35" />

          {/* Падающие монетки и эмодзи */}

          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden="true"
          >
            {FALLING.map((f, i) => (
              <span
                key={i}
                className="anim absolute top-0 select-none"
                style={{
                  left: f.left,
                  fontSize: f.size,
                  animation: `coin-fall ${f.dur}s linear ${f.delay}s infinite`,
                }}
              >
                {f.emoji}
              </span>
            ))}

            {TWINKLES.map((t, i) => (
              <span
                key={i}
                className="anim absolute select-none text-xs text-[#A64B13]/50"
                style={{
                  top: t.top,
                  left: t.left,
                  animation: `twinkle 2s ease-in-out ${t.delay}s infinite`,
                }}
              >
                ✦
              </span>
            ))}
          </div>

          <div className="relative z-10 flex w-full items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-black leading-tight tracking-tight md:text-2xl">
                Пригласи друга
              </h2>

              <div className="anim relative mt-1.5 inline-flex items-center gap-1.5 overflow-hidden rounded-2xl border-2 border-[#A64B13] bg-white px-3 py-1 shadow-[0_4px_0_#A64B13]">
                <span className="text-lg leading-none md:text-2xl">🪙</span>
                <span className="text-xl font-black leading-none text-[#A64B13] md:text-3xl">
                  +50
                </span>
              </div>

              <div className="mt-2.5">
                <StartButton
                  href={START_FRIENDS_HREF}
                  tone="coral"
                  label="Добавить друга"
                />
              </div>
            </div>

            <div className="relative flex h-[100px] w-[100px] shrink-0 items-center justify-center md:h-[120px] md:w-[120px]">
              <div className="absolute inset-2 rounded-full bg-white/35" />

              <div
                className="anim absolute inset-0 animate-spin"
                style={spin(10)}
              >
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#A64B13]/45" />

                <OrbitCoin
                  className="left-1/2 top-0 -translate-x-1/2 -translate-y-1/2"
                  size="text-lg"
                />

                <OrbitCoin
                  className="bottom-[14%] right-[2%] translate-x-1/2 translate-y-1/2"
                  size="text-base"
                />

                <OrbitCoin
                  className="bottom-[14%] left-[2%] -translate-x-1/2 translate-y-1/2"
                  size="text-base"
                />
              </div>

              <div
                className="anim absolute inset-4 animate-spin"
                style={spin(7, true)}
              >
                <div className="absolute inset-0 rounded-full border-2 border-[#A64B13]/30" />
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 text-sm">💎</div>
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 text-sm">⭐</div>
              </div>

              <div
                className="anim relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#A64B13] shadow-[0_4px_0_#A64B13] md:h-[68px] md:w-[68px]"
                style={{
                  backgroundColor: GOLD,
                  animation: 'coin-flip 3.5s ease-in-out infinite',
                }}
              >
                <span className="text-xl font-black text-[#71380F] md:text-2xl">
                  50
                </span>
              </div>

              <div
                className="anim absolute -bottom-1 -left-2 z-20 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#A64B13] bg-white text-[#A64B13]"
                style={{ animation: 'float-y 2.4s ease-in-out infinite' }}
              >
                <Users size={16} />
              </div>

              <div
                className="anim absolute -right-1 -top-1 z-20 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#A64B13] bg-white text-[#A64B13]"
                style={{ animation: 'float-y 2.4s ease-in-out 0.8s infinite' }}
              >
                <UserPlus size={14} />
              </div>
            </div>
          </div>
        </section>

        {/* SLIDE 4 — INSTALL APP */}

        <section
          className={`${slideBase} text-[#0B3D2E]`}
          style={{
            backgroundColor: LIME_BG,
            ...dots('rgba(11,61,46,.14)'),
          }}
        >
          {/* Декоративные круги */}

          <div className="pointer-events-none absolute -right-12 -top-24 h-64 w-64 rounded-full border-2 border-[#0B3D2E]/15" />
          <div className="pointer-events-none absolute -right-4 -top-16 h-48 w-48 rounded-full border-2 border-[#0B3D2E]/10" />
          <div className="pointer-events-none absolute -bottom-24 left-1/4 h-56 w-56 rounded-full bg-white/30" />

          {/* Звёздочки */}

          <div className="pointer-events-none absolute right-[38%] top-5 text-lg text-[#158F66]">
            ✦
          </div>
          <div className="pointer-events-none absolute bottom-5 left-[45%] text-sm text-[#158F66]">
            ✦
          </div>
          <div className="pointer-events-none absolute right-[12%] top-8 text-xs text-[#0B3D2E]/60">
            ✦
          </div>

          {/* Плавающие монеты */}

          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden="true"
          >
            {[
              { left: '8%', delay: '0s', size: 15 },
              { left: '30%', delay: '1s', size: 18 },
              { left: '48%', delay: '0.5s', size: 13 },
              { left: '70%', delay: '1.5s', size: 16 },
              { left: '90%', delay: '0.8s', size: 14 },
            ].map((coin, i) => (
              <span
                key={i}
                className="anim absolute top-0"
                style={{
                  left: coin.left,
                  fontSize: coin.size,
                  animation: `coin-fall 4.5s linear ${coin.delay} infinite`,
                }}
              >
                🪙
              </span>
            ))}
          </div>

          <div className="relative z-10 flex w-full items-center justify-between gap-3">
            {/* ТЕКСТ */}

            <div className="min-w-0 flex-1">
              <div className="mb-1 inline-flex items-center gap-1 rounded-full border border-[#0B3D2E]/20 bg-white/60 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#0B3D2E] md:text-[10px]">
                <Sparkles size={11} />
                ZABU APP
              </div>

              <h2 className="text-base font-black leading-tight tracking-tight md:text-2xl">
                Установи приложение
              </h2>

              <p className="mt-1 text-[10px] font-semibold text-[#0B3D2E]/70 md:text-xs">
                И получи бонус на свой аккаунт
              </p>

              <div className="anim relative mt-1.5 inline-flex items-center gap-2 rounded-xl border-2 border-[#0B3D2E] bg-white px-3 py-1 shadow-[0_4px_0_#0B3D2E]">
                <Coins size={19} className="text-[#158F66] md:h-6 md:w-6" />

                <span className="text-xl font-black leading-none text-[#0B3D2E] md:text-3xl">
                  +100
                </span>

                <span className="text-[10px] font-extrabold text-[#158F66] md:text-xs">
                  коинов
                </span>
              </div>

              <div className="mt-2.5">
                <StartButton
                  href={START_APP_HREF}
                  tone="lime"
                  label="Установить"
                />
              </div>
            </div>

            {/* АНИМИРОВАННЫЙ СМАРТФОН */}

            <div className="relative flex h-[100px] w-[100px] shrink-0 items-center justify-center md:h-[120px] md:w-[120px]">
              {/* Орбита */}

              <div
                className="anim absolute inset-0 rounded-full border-2 border-dashed border-[#0B3D2E]/35"
                style={{
                  animation: 'lime-orbit 15s linear infinite',
                }}
              >
                <div className="absolute -left-1 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border-2 border-[#0B3D2E] bg-white" />
                <div className="absolute -right-1 top-1/4 h-2.5 w-2.5 rounded-full bg-[#158F66]" />
              </div>

              {/* Внешняя окружность */}

              <div className="absolute inset-3 rounded-full border-2 border-[#0B3D2E]/15 bg-white/25" />

              {/* Телефон */}

              <div
                className="anim relative z-10 flex h-[76px] w-[43px] items-center justify-center rounded-[12px] border-[3px] border-[#0B3D2E] bg-white shadow-[0_5px_0_#0B3D2E] md:h-[88px] md:w-[51px]"
                style={{
                  animation: 'phone-float 3s ease-in-out infinite',
                }}
              >
                <div className="absolute left-1/2 top-1 h-1 w-4 -translate-x-1/2 rounded-full bg-[#0B3D2E]/25" />

                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#D9F36B] md:h-11 md:w-11">
                  <span className="text-xl font-black text-[#158F66] md:text-2xl">
                    Z
                  </span>
                </div>

                <div className="absolute bottom-1 h-1 w-3 rounded-full bg-[#0B3D2E]/25" />
              </div>

              {/* Значок установки */}

              <div
                className="anim absolute -right-1 top-1 z-20 flex h-8 w-8 items-center justify-center rounded-xl border-2 border-[#0B3D2E] bg-white text-[#158F66] shadow-[0_3px_0_#0B3D2E] md:h-9 md:w-9"
                style={{
                  animation: 'float-y 2.2s ease-in-out infinite',
                }}
              >
                <Download size={17} />
              </div>

              {/* Значок подарка */}

              <div
                className="anim absolute -bottom-1 -left-1 z-20 flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#0B3D2E] bg-[#F6C945] text-[#0B3D2E] shadow-[0_3px_0_#0B3D2E] md:h-9 md:w-9"
                style={{
                  animation: 'lime-pulse 2s ease-in-out infinite',
                }}
              >
                <Gift size={17} />
              </div>

              {/* Маленькая монета */}

              <div className="absolute -left-1 top-3 z-20 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#0B3D2E] bg-white text-[11px]">
                🪙
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* SLIDE INDICATORS */}

      <div className="absolute bottom-2 left-1/2 z-30 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-[#0B3D2E]/80 px-2 py-1">
        {[0, 1, 2, 3].map((slide) => (
          <button
            key={slide}
            type="button"
            onClick={() => setActiveSlide(slide)}
            aria-label={`Перейти к баннеру ${slide + 1}`}
            aria-current={activeSlide === slide ? 'true' : undefined}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              activeSlide === slide
                ? 'w-6 bg-[#D9F36B]'
                : 'w-1.5 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
