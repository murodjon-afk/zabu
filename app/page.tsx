"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Mic, Send } from "lucide-react";
import CtaSection  from "./components/onboardings/CtaSection";
import Footer from "./components/onboardings/Footer"
import LanguageSwitcher from "./components/LanguageSwitcher";
/**
 * Каждый язык живёт на своей орбите:
 * size  — диаметр орбиты (% от контейнера)
 * dur   — время полного оборота
 * delay — отрицательная задержка, чтобы плашки стартовали в разных точках
 */
const ORBITS = [
  {
    code: "en",
    logo: "/logo-en.webp",
    welcome: "Welcome",
    lang: "English",
    size: 100,
    dur: 30,
    delay: -4,
    dir: "ltr",
  },
  {
    code: "tj",
    logo: "/logo-tj.webp",
    welcome: "Хуш омадед",
    lang: "Тоҷикӣ",
    size: 72,
    dur: 22,
    delay: -13,
    dir: "ltr",
  },
  {
    code: "ir",
    logo: "/logo-ir.webp",
    welcome: "خوش آمدید",
    lang: "فارسی",
    size: 46,
    dur: 16,
    delay: -7,
    dir: "rtl",
  },
] as const;

const MARQUEE = ["Welcome", "Хуш омадед", "خوش آمدید", "Добро пожаловать"];

/* ───────────── ВТОРАЯ СЕКЦИЯ: АНИМИРОВАННЫЙ ДИАЛОГ ───────────── */

type LangKey = "tj" | "ir" | "en";
type Msg = { from: "bot" | "me"; text: string; tr: string };

const DIALOGS: Record<
  LangKey,
  { label: string; logo: string; dir: "ltr" | "rtl"; messages: Msg[] }
> = {
  tj: {
    label: "Тоҷикӣ",
    logo: "/logo-tj.webp",
    dir: "ltr",
    messages: [
      { from: "bot", text: "Салом! Номат чист?", tr: "Привет! Как тебя зовут?" },
      { from: "me", text: "Салом! Номи ман Алӣ.", tr: "Привет! Меня зовут Али." },
      { from: "bot", text: "Хуш омадед! Аз куҷо ҳастед?", tr: "Добро пожаловать! Откуда ты?" },
      { from: "me", text: "Ман аз Тошканд ҳастам.", tr: "Я из Ташкента." },
      { from: "bot", text: "Офарин! Хеле хуб гап мезанӣ 🎉", tr: "Молодец! Ты отлично говоришь" },
    ],
  },
  ir: {
    label: "فارسی",
    logo: "/logo-ir.webp",
    dir: "rtl",
    messages: [
      { from: "bot", text: "سلام! اسمت چیه؟", tr: "Привет! Как тебя зовут?" },
      { from: "me", text: "سلام! اسم من علی است.", tr: "Привет! Меня зовут Али." },
      { from: "bot", text: "خوش آمدید! اهل کجایی؟", tr: "Добро пожаловать! Откуда ты?" },
      { from: "me", text: "من اهل تاشکند هستم.", tr: "Я из Ташкента." },
      { from: "bot", text: "آفرین! عالی صحبت می‌کنی 🎉", tr: "Молодец! Ты отлично говоришь" },
    ],
  },
  en: {
    label: "English",
    logo: "/logo-en.webp",
    dir: "ltr",
    messages: [
      { from: "bot", text: "Hi! What's your name?", tr: "Привет! Как тебя зовут?" },
      { from: "me", text: "Hi! My name is Ali.", tr: "Привет! Меня зовут Али." },
      { from: "bot", text: "Welcome! Where are you from?", tr: "Добро пожаловать! Откуда ты?" },
      { from: "me", text: "I'm from Tashkent.", tr: "Я из Ташкента." },
      { from: "bot", text: "Great job! You speak really well 🎉", tr: "Молодец! Ты отлично говоришь" },
    ],
  },
};

function DialogSection() {
  const [lang, setLang] = useState<LangKey>("tj");
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState<"bot" | "me" | null>(null);
  const d = DIALOGS[lang];

  useEffect(() => {
    const msgs = DIALOGS[lang].messages;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(msgs.length);
      setTyping(null);
      return;
    }

    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        timers.push(setTimeout(resolve, ms));
      });

    (async () => {
      while (!cancelled) {
        setShown(0);
        setTyping(null);
        await wait(600);
        for (let i = 0; i < msgs.length; i++) {
          if (cancelled) return;
          setTyping(msgs[i].from);
          await wait(1100);
          if (cancelled) return;
          setTyping(null);
          setShown(i + 1);
          await wait(800);
        }
        await wait(3800);
      }
    })();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [lang]);

  return (
    <section className="relative mx-3 mb-3 overflow-hidden rounded-[36px] bg-[#EAF6F0] sm:mx-5 sm:mb-5 sm:rounded-[48px]">
      <style>{`
        @keyframes zabu-pop {
          0% { opacity: 0; transform: translateY(14px) scale(.92); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes zabu-dot {
          0%, 80%, 100% { transform: translateY(0); opacity: .45; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
        .zabu-pop { animation: zabu-pop .35s cubic-bezier(.2,.9,.3,1.2) both; }
        .zabu-dot { animation: zabu-dot 1s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .zabu-pop, .zabu-dot { animation: none; }
        }
      `}</style>

      {/* декор */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-10 h-[520px] w-[520px] rounded-full border-2 border-dashed border-[#158F66]/25"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-[#D9F36B]/50 blur-3xl"
      />

      <div className="relative mx-auto grid w-full max-w-[1350px] items-center gap-14 px-6 py-16 md:grid-cols-2 lg:px-14 lg:py-24">
        {/* LEFT */}
        <div className="max-w-[560px]">
          <h2 className="text-[40px] font-black leading-[1.05] tracking-[-2px] text-[#0B3D2E] sm:text-[54px] lg:text-[64px]">
            Не просто слова,
            <br />
            а живой разговор
          </h2>

          <p className="mt-7 max-w-[470px] text-base leading-8 text-[#0B3D2E]/70 sm:text-lg">
            Короткие диалоги на таджикском, персидском и английском с
            переводом к каждой фразе. Выбери язык и ответь на первый вопрос.
          </p>

          <div
            role="tablist"
            aria-label="Язык диалога"
            className="mt-9 flex flex-wrap gap-3"
          >
            {(Object.keys(DIALOGS) as LangKey[]).map((k) => {
              const active = k === lang;
              return (
                <button
                  key={k}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setLang(k)}
                  className={`flex items-center gap-2 rounded-full py-2 pl-2 pr-5 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#158F66] ${
                    active
                      ? "bg-[#158F66] text-white shadow-[0_6px_0_rgba(11,61,46,0.3)]"
                      : "bg-white text-[#0B3D2E] hover:-translate-y-0.5 hover:bg-[#D9F36B]"
                  }`}
                >
                  <img
                    src={DIALOGS[k].logo}
                    alt=""
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  {DIALOGS[k].label}
                </button>
              );
            })}
          </div>

          <Link
            href="/onboarding"
            className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#158F66] transition hover:gap-3"
          >
            Все диалоги
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* RIGHT: КАРТОЧКА С ЧАТОМ */}
        <div className="relative mx-auto w-full max-w-[520px]">
          {/* стикеры */}
          <div
            className="zabu-float absolute -right-2 -top-5 z-20 rounded-2xl bg-[#D9F36B] px-4 py-2 text-sm font-black text-[#0B3D2E] shadow-[4px_4px_0_#0B3D2E] sm:-right-6"
            style={{ "--r": "5deg" } as React.CSSProperties}
          >
            🔥 7 дней подряд
          </div>
          <div
            key={shown}
            className="zabu-pop absolute -bottom-5 -left-2 z-20 rounded-2xl bg-white px-4 py-2 text-sm font-black text-[#158F66] shadow-[4px_4px_0_#158F66] sm:-left-6"
          >
            +{shown * 10} XP
          </div>

          <div className="overflow-hidden rounded-[32px] bg-[#158F66] shadow-[0_40px_70px_-25px_rgba(21,143,102,0.65)]">
            {/* верхняя панель */}
            <div className="flex items-center justify-between gap-3 px-5 py-4">
              <div className="flex items-center gap-2 rounded-xl bg-white/15 py-1.5 pl-1.5 pr-3 text-sm font-bold text-white">
                <img
                  src={d.logo}
                  alt=""
                  className="h-7 w-7 rounded-full object-cover"
                />
                {d.label}
              </div>
              <Link
                href="/onboarding"
                className="rounded-full bg-white px-4 py-2 text-sm font-bold text-[#158F66] transition hover:bg-[#D9F36B] hover:text-[#0B3D2E]"
              >
                Начать диалог
              </Link>
            </div>

            {/* окно чата */}
            <div className="mx-3 mb-3 overflow-hidden rounded-[24px] bg-white">
              <div className="h-1.5 w-full bg-[#E7F5EE]">
                <div
                  className="h-full rounded-r-full bg-[#158F66] transition-all duration-700"
                  style={{ width: `${(shown / d.messages.length) * 100}%` }}
                />
              </div>

              <div className="flex h-[400px] flex-col justify-end gap-3 overflow-hidden px-4 py-5">
                {d.messages.slice(0, shown).map((m, i) => {
                  const me = m.from === "me";
                  return (
                    <div
                      key={`${lang}-${i}`}
                      className={`zabu-pop flex items-end gap-2 ${
                        me ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!me && (
                        <img
                          src={d.logo}
                          alt=""
                          className="h-8 w-8 shrink-0 rounded-full object-cover"
                        />
                      )}
                      <div
                        className={`max-w-[78%] rounded-[20px] px-4 py-3 ${
                          me
                            ? "rounded-br-md bg-[#158F66] text-white"
                            : "rounded-bl-md bg-[#E7F5EE] text-[#0B3D2E]"
                        }`}
                      >
                        <div dir={d.dir} className="text-[15px] font-bold">
                          {m.text}
                        </div>
                        <div
                          className={`mt-1 text-xs ${
                            me ? "text-white/75" : "text-[#0B3D2E]/55"
                          }`}
                        >
                          {m.tr}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {typing && (
                  <div
                    className={`zabu-pop flex items-end gap-2 ${
                      typing === "me" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {typing === "bot" && (
                      <img
                        src={d.logo}
                        alt=""
                        className="h-8 w-8 shrink-0 rounded-full object-cover"
                      />
                    )}
                    <div
                      className={`flex items-center gap-1.5 rounded-full px-4 py-3.5 ${
                        typing === "me" ? "bg-[#158F66]" : "bg-[#E7F5EE]"
                      }`}
                    >
                      {[0, 1, 2].map((n) => (
                        <span
                          key={n}
                          className={`zabu-dot h-2 w-2 rounded-full ${
                            typing === "me" ? "bg-white" : "bg-[#158F66]"
                          }`}
                          style={{ animationDelay: `${n * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* поле ввода */}
              <div className="flex items-center gap-2 border-t border-[#158F66]/10 px-3 py-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E7F5EE] text-[#158F66]">
                  <Mic size={18} />
                </div>
                <div className="flex-1 rounded-full bg-[#F3F8F5] px-4 py-3 text-sm text-[#0B3D2E]/45">
                  Напиши ответ…
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#158F66] text-white">
                  <Send size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col bg-white text-[#0B3D2E]">
      <style>{`
        @keyframes zabu-spin { to { transform: rotate(360deg); } }
        @keyframes zabu-marquee { to { transform: translateX(-50%); } }
        @keyframes zabu-float {
          0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)); }
          50% { transform: translateY(-10px) rotate(var(--r, 0deg)); }
        }
        .zabu-orbit { animation: zabu-spin var(--d) linear infinite; animation-delay: var(--delay); }
        .zabu-orbit-item { animation: zabu-spin var(--d) linear infinite reverse; animation-delay: var(--delay); }
        .zabu-marquee { animation: zabu-marquee 28s linear infinite; }
        .zabu-float { animation: zabu-float 5s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .zabu-orbit, .zabu-orbit-item, .zabu-marquee, .zabu-float { animation: none; }
        }
      `}</style>

  {/* HEADER — зелёный, слегка отделён от блока через mb */}
      <header className="relative z-20 mx-3 mb-3 mt-3 flex h-[64px] items-center justify-between gap-2 rounded-[22px] bg-[#158F66] px-3 sm:mx-5 sm:mb-4 sm:mt-5 sm:h-[76px] sm:rounded-[28px] sm:px-6 lg:px-10">
        <Link href="/" className="flex min-w-0 items-center gap-1.5 sm:gap-2">
          <img
            src="/logo-bg.png"
            alt="ZABU"
            className="h-9 w-auto shrink-0 object-contain sm:h-11"
          />
          <span className="text-xl font-black tracking-[-1.5px] text-white sm:text-2xl">
            ZABU<span className="text-[#D9F36B]">.</span>
          </span>
        </Link>
 
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <LanguageSwitcher />
          <Link
            href="/onboarding"
            className="whitespace-nowrap rounded-full bg-white px-4 py-2.5 text-xs font-bold text-[#158F66] transition hover:-translate-y-0.5 hover:bg-[#D9F36B] hover:text-[#0B3D2E] sm:px-6 sm:py-3 sm:text-sm"
          >
            Начать
            <ArrowUpRight className="ml-2 hidden sm:inline" size={16} />
          </Link>
        </div>
      </header>

      {/* HERO — зелёная панель */}
      <section className="relative mx-3 mb-3 flex flex-1 flex-col overflow-hidden rounded-[36px] bg-[#158F66] sm:mx-5 sm:mb-5 sm:rounded-[48px]">
        {/* точечная сетка */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,.55) 1.5px, transparent 1.5px)",
            backgroundSize: "26px 26px",
            maskImage:
              "radial-gradient(ellipse at 75% 45%, black 10%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 75% 45%, black 10%, transparent 70%)",
          }}
        />
        {/* цветные пятна */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-[#D9F36B]/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-24 right-10 h-80 w-80 rounded-full bg-[#FF7A59]/30 blur-3xl"
        />

        <div className="relative mx-auto grid w-full max-w-[1350px] flex-1 items-center gap-12 px-6 py-14 md:grid-cols-2 lg:px-14">
          {/* LEFT */}
          <div className="relative z-10 max-w-[600px] text-white">
            

            <h1 className="text-[52px] font-black leading-[1.02] tracking-[-2.5px] sm:text-[68px] lg:text-[84px]">
              Открой мир
              <br />
              <span className="mt-3 inline-block -rotate-2 rounded-[20px] bg-[#D9F36B] px-4 pb-2 pt-1 text-[#0B3D2E] shadow-[6px_6px_0_#0B3D2E]">
                новых языков
              </span>
            </h1>

            <p className="mt-9 max-w-[440px] text-base leading-8 text-white/85 sm:text-lg">
              Изучай языки, знакомься с новыми культурами и общайся без
              границ. Твой путь начинается здесь.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/onboarding"
                className="group flex items-center gap-6 rounded-full bg-white py-3 pl-8 pr-3 text-base font-extrabold text-[#0B3D2E] shadow-[0_10px_0_rgba(11,61,46,0.35)] transition hover:translate-y-[3px] hover:shadow-[0_6px_0_rgba(11,61,46,0.35)]"
              >
                Начать
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#158F66] text-white">
                  <ArrowUpRight
                    size={20}
                    className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>

              <Link
                href="/login"
                className="flex items-center gap-2 rounded-full border-2 border-white/60 px-7 py-4 text-sm font-bold text-white transition hover:bg-white hover:text-[#158F66]"
              >
                Уже есть аккаунт
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* стикеры */}
            <div className="mt-12 flex flex-wrap gap-3">
              {ORBITS.map((o, i) => (
                <div
                  key={o.code}
                  className="zabu-float flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-bold text-[#0B3D2E]"
                  style={
                    {
                      "--r": `${i === 1 ? 3 : -3}deg`,
                      animationDelay: `${i * 0.6}s`,
                    } as React.CSSProperties
                  }
                >
                  <img
                    src={o.logo}
                    alt={o.lang}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                  {o.lang}
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: ОРБИТЫ */}
          <div className="relative mx-auto aspect-square w-full max-w-[560px]">
            {/* кольца */}
            {ORBITS.map((o) => (
              <div
                key={`ring-${o.code}`}
                aria-hidden
                className="absolute inset-0 m-auto rounded-full border-2 border-dashed border-white/35"
                style={{ width: `${o.size}%`, height: `${o.size}%` }}
              />
            ))}

            {/* центр */}
            <div className="absolute inset-0 z-10 m-auto flex h-[24%] w-[24%] flex-col items-center justify-center rounded-full bg-white shadow-[0_0_0_8px_rgba(255,255,255,0.25)]">
              <img
                src="/favicon.ico"
                alt="ZABU"
                className="h-[62%] w-[62%] object-contain"
              />
            
            </div>

            {/* вращающиеся орбиты */}
            {ORBITS.map((o) => (
              <div
                key={o.code}
                className="zabu-orbit absolute inset-0 z-20 m-auto"
                style={
                  {
                    width: `${o.size}%`,
                    height: `${o.size}%`,
                    "--d": `${o.dur}s`,
                    "--delay": `${o.delay}s`,
                  } as React.CSSProperties
                }
              >
                <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                  <div className="zabu-orbit-item flex items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-4 shadow-[0_6px_0_rgba(11,61,46,0.35)]">
                    <img
                      src={o.logo}
                      alt={o.lang}
                      className="h-9 w-9 shrink-0 rounded-full object-cover sm:h-11 sm:w-11"
                    />
                    <div className="leading-tight">
                      <div
                        dir={o.dir}
                        className="whitespace-nowrap text-sm font-black text-[#0B3D2E] sm:text-base"
                      >
                        {o.welcome}
                      </div>
                      <div
                        dir={o.dir}
                        className="whitespace-nowrap text-[10px] font-bold text-[#158F66] sm:text-xs"
                      >
                        {o.lang}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* БЕГУЩАЯ СТРОКА */}
        <div className="relative overflow-hidden bg-[#0B3D2E] py-4">
          <div className="zabu-marquee flex w-max whitespace-nowrap">
            {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((w, i) => (
              <span
                key={i}
                className="mx-6 flex items-center gap-12 text-xl font-black text-white sm:text-2xl"
              >
                {w}
                <span className="text-[#D9F36B]">✦</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ВТОРАЯ СЕКЦИЯ — анимированный диалог */}
      <DialogSection />
        <CtaSection></CtaSection>
      {/* FOOTER */}
     
      <Footer></Footer>
    </main>
  );
}