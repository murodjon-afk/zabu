
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
} from 'lucide-react';
import {GreetingBannerSkeleton}  from "../../Skeletons";
import type { DashboardCtx } from '../../types';

// Ссылки на страницы
const START_LESSONS_HREF = '/dashboard/lessons';
const START_AI_HREF = '/dashboard/ai';
const START_FRIENDS_HREF = '/dashboard/friends';

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
    arabic: 'خوش كېلیбسیز',
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
        className="animate-spin motion-reduce:animate-none flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full bg-white text-[#158F66] border-2 border-[#0B3D2E]"
        style={spin(seconds, true)}
      >
        {children}
      </div>
    </div>
  );
}

/* ---------- Кнопки ---------- */

type Tone = 'green' | 'deep' | 'purple' | 'coral';

const BUTTON_TONE: Record<Tone, string> = {
  // Первый баннер — без изменений
  green:
    'bg-white text-[#158F66] shadow-[0_3px_0_#0B3D2E] hover:bg-[#D9F36B] hover:text-[#0B3D2E]',

  deep:
    'bg-[#D9F36B] text-[#0B3D2E] shadow-[0_3px_0_#158F66] hover:bg-white',

  // Второй баннер — фиолетовая тень
  purple:
    'bg-white text-[#50356F] shadow-[0_3px_0_#50356F] hover:bg-[#D9F36B] hover:text-[#0B3D2E]',

  // Третий баннер — оранжевая тень
  coral:
    'bg-white text-[#A64B13] shadow-[0_3px_0_#A64B13] hover:bg-[#FFF0DE] hover:text-[#71380F]',
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
      className={`inline-flex items-center justify-center h-8 md:h-9 px-4 md:px-5 rounded-full text-xs md:text-sm font-extrabold transition active:translate-y-[2px] active:shadow-none focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-white ${BUTTON_TONE[tone]}`}
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

      @keyframes pulse-pop {
        0%, 100% { transform: scale(1); }
        50%      { transform: scale(1.12); }
      }

      @keyframes twinkle {
        0%, 100% { opacity: 0.2; transform: scale(0.8); }
        50%      { opacity: 1; transform: scale(1.2); }
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

/* Мерцающие звёздочки */

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

  // Автоматическая смена слайдов
  useEffect(() => {
    if (paused) return;

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 3);
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
    'relative isolate shrink-0 w-full h-[120px] md:h-[136px] overflow-hidden px-4 md:px-6 flex items-center';

  // Цвет внешней рамки и объёмной тени зависит от слайда
  // Первый слайд сохраняет прежние цвета
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
        {/* ===================================== */}
        {/* SLIDE 1 — WELCOME */}
        {/* ПЕРВЫЙ БАННЕР НЕ ИЗМЕНЁН */}
        {/* ===================================== */}

        <section
          className={`${slideBase} text-white`}
          style={{ backgroundColor: GREEN, ...dots('rgba(255,255,255,.18)') }}
        >
          <div className="absolute -top-20 -right-10 w-56 h-56 rounded-full border-2 border-white/15 pointer-events-none" />

          <div className="absolute -top-10 -right-1 w-40 h-40 rounded-full border-2 border-white/15 pointer-events-none" />

          <div className="absolute -bottom-24 left-1/3 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />

          <Languages className="absolute -left-6 -bottom-8 w-32 h-32 text-white opacity-[0.1] pointer-events-none" />

          <div className="relative z-10 w-full flex items-center justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h2
                dir={rtl ? 'rtl' : 'ltr'}
                className="text-xl md:text-3xl font-black tracking-tight leading-tight truncate"
              >
                {showWelcome ? welcome : '...'}
              </h2>

              <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-1">
                {showWelcome && (
                  <span className="text-xs md:text-sm font-semibold text-white/85">
                    {translation}
                  </span>
                )}

                <span
                  className="hidden sm:inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-black"
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
              <div className="relative shrink-0 w-[84px] h-[84px] md:w-[100px] md:h-[100px] flex items-center justify-center">
                <div className="absolute inset-3 rounded-full bg-white/15" />

                <div className="absolute inset-0 rounded-full border-2 border-white/30" />

                <div
                  className="absolute inset-0 animate-spin motion-reduce:animate-none"
                  style={spin(16)}
                >
                  <div className="absolute inset-1.5 rounded-full border-2 border-dashed border-white/40" />

                  <OrbitChip
                    className="top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
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

                <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 border-[#0B3D2E] bg-white shadow-[0_4px_0_#0B3D2E]">
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

        {/* ===================================== */}
        {/* SLIDE 2 — AI PRACTICE */}
        {/* НЕЖНО-ФИОЛЕТОВЫЙ */}
        {/* ===================================== */}

        <section
          className={`${slideBase} text-[#39264F]`}
          style={{
            backgroundColor: PURPLE_BG,
            ...dots('rgba(80,53,111,.13)'),
          }}
        >
          <div className="absolute -top-24 -right-8 w-60 h-60 rounded-full border-2 border-[#50356F]/15 pointer-events-none" />

          <div className="absolute -bottom-24 left-1/4 w-60 h-60 rounded-full bg-[#50356F]/10 pointer-events-none" />

          <div className="absolute top-4 right-1/4 w-1.5 h-1.5 rounded-full bg-[#50356F]" />

          <div className="absolute bottom-6 left-1/3 w-2 h-2 rounded-full bg-[#9B7BC1]" />

          <div className="relative z-10 w-full flex items-center justify-between gap-3">
            {/* TEXT */}

            <div className="flex-1 min-w-0 max-w-2xl">
              <h2 className="text-base md:text-2xl font-black tracking-tight leading-tight">
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

            {/* AI ICON */}

            <div className="relative shrink-0 w-[84px] h-[84px] md:w-[100px] md:h-[100px] flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-[#50356F]/25" />

              <div
                className="absolute inset-2 rounded-full border-2 border-dashed border-[#50356F]/45 animate-spin motion-reduce:animate-none"
                style={spin(20)}
              />

              <div className="absolute inset-4 rounded-full bg-white/55" />

              <div className="relative z-10 w-11 h-11 md:w-14 md:h-14 rounded-2xl bg-[#D9F36B] text-[#50356F] flex items-center justify-center border-2 border-[#50356F] shadow-[0_4px_0_#50356F] rotate-6">
                <BrainCircuit size={26} className="md:hidden" />
                <BrainCircuit size={34} className="hidden md:block" />
              </div>

              <div className="absolute top-0 right-0 z-20 bg-white text-[#50356F] p-1 rounded-lg border-2 border-[#50356F]">
                <Sparkles size={12} />
              </div>

              <div className="absolute bottom-0 left-0 z-20 bg-[#50356F] text-white border-2 border-white p-1 rounded-lg">
                <MessageCircle size={12} />
              </div>

              <div className="absolute top-0 left-0 z-20 bg-white text-[#50356F] border-2 border-[#50356F] p-1 rounded-lg">
                <Languages size={11} />
              </div>
            </div>
          </div>
        </section>

        {/* ===================================== */}
        {/* SLIDE 3 — INVITE FRIENDS */}
        {/* МЯГКИЙ ОРАНЖЕВЫЙ */}
        {/* ===================================== */}

        <section
          className={`${slideBase}`}
          style={{
            backgroundColor: ORANGE_BG,
            color: ORANGE_DEEP,
            ...dots('rgba(122,59,18,.13)'),
          }}
        >
          {/* Фоновые круги */}

          <div className="absolute -top-20 -right-10 w-52 h-52 rounded-full border-2 border-[#A64B13]/20 pointer-events-none" />

          <div className="absolute -bottom-24 left-1/4 w-56 h-56 rounded-full bg-white/35 pointer-events-none" />

          {/* Падающие монетки и эмодзи */}

          <div
            className="absolute inset-0 pointer-events-none overflow-hidden"
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
                className="anim absolute text-[#A64B13]/50 text-xs select-none"
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

          <div className="relative z-10 w-full flex items-center justify-between gap-3">
            {/* TEXT */}

            <div className="flex-1 min-w-0">
              <h2 className="text-base md:text-2xl font-black tracking-tight leading-tight">
                Пригласи друга
              </h2>

              {/* Награда */}

              <div className="anim relative inline-flex items-center gap-1.5 mt-1.5 px-3 py-1 rounded-2xl bg-white border-2 border-[#A64B13] shadow-[0_4px_0_#A64B13] overflow-hidden">
                <span className="text-lg md:text-2xl leading-none">
                  🪙
                </span>

                <span className="text-xl md:text-3xl font-black leading-none text-[#A64B13]">
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

            {/* ILLUSTRATION */}

            <div className="relative shrink-0 w-[100px] h-[100px] md:w-[120px] md:h-[120px] flex items-center justify-center">
              <div className="absolute inset-2 rounded-full bg-white/35" />

              {/* Орбита 1 */}

              <div
                className="anim absolute inset-0 animate-spin"
                style={spin(10)}
              >
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#A64B13]/45" />

                <OrbitCoin
                  className="top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
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

              {/* Орбита 2 */}

              <div
                className="anim absolute inset-4 animate-spin"
                style={spin(7, true)}
              >
                <div className="absolute inset-0 rounded-full border-2 border-[#A64B13]/30" />

                <div className="absolute top-1/2 -right-2 -translate-y-1/2 text-sm">
                  💎
                </div>

                <div className="absolute top-1/2 -left-2 -translate-y-1/2 text-sm">
                  ⭐
                </div>
              </div>

              {/* Центральная монета */}

              <div
                className="anim relative z-10 w-14 h-14 md:w-[68px] md:h-[68px] rounded-full border-4 border-[#A64B13] shadow-[0_4px_0_#A64B13] flex items-center justify-center"
                style={{
                  backgroundColor: GOLD,
                  animation: 'coin-flip 3.5s ease-in-out infinite',
                }}
              >
                <span className="text-xl md:text-2xl font-black text-[#71380F]">
                  50
                </span>
              </div>

              {/* Друзья */}

              <div
                className="anim absolute -bottom-1 -left-2 z-20 w-8 h-8 rounded-full bg-white text-[#A64B13] border-2 border-[#A64B13] flex items-center justify-center"
                style={{
                  animation: 'float-y 2.4s ease-in-out infinite',
                }}
              >
                <Users size={16} />
              </div>

              <div
                className="anim absolute -top-1 -right-1 z-20 w-7 h-7 rounded-full bg-white text-[#A64B13] border-2 border-[#A64B13] flex items-center justify-center"
                style={{
                  animation: 'float-y 2.4s ease-in-out 0.8s infinite',
                }}
              >
                <UserPlus size={14} />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* SLIDE INDICATORS */}

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 rounded-full bg-[#0B3D2E]/80 px-2 py-1">
        {[0, 1, 2].map((slide) => (
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
