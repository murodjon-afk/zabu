"use client";

import { useEffect, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { Unbounded } from "next/font/google";

// Широкий шрифт для заголовка (есть кириллица)
const display = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["800"],
});

const WELCOME = [
  { text: "Welcome", dir: "ltr" },
  { text: "Хуш омадед", dir: "ltr" },
  { text: "خوش آمدید", dir: "rtl" },
] as const;

/** Плавающий предмет. x — смещение от центра, y — от верха волны (px) */
function Spot({
  x,
  y,
  rot = 0,
  delay = 0,
  children,
}: {
  x: number;
  y: number;
  rot?: number;
  delay?: number;
  children: ReactNode;
}) {
  return (
    <div
      className="absolute hidden md:block"
      style={{ left: `calc(50% + ${x}px)`, top: y }}
    >
      <div className="-translate-x-1/2 -translate-y-1/2">
        <div
          className="cta-bob"
          style={
            { "--r": `${rot}deg`, animationDelay: `${delay}s` } as CSSProperties
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function Diamond({ size }: { size: number }) {
  return (
    <div
      className="rotate-45 rounded-[22%] bg-[#D9F36B] shadow-[inset_-4px_-4px_0_rgba(21,143,102,0.35)]"
      style={{ width: size, height: size }}
    />
  );
}

function Flame() {
  return (
    <svg viewBox="0 0 64 64" width="52" height="52" className="cta-flicker">
      <path
        d="M32 4c4 10 18 18 18 34a18 18 0 0 1-36 0c0-8 4-12 8-16 1 5 3 7 6 8-2-9 0-17 4-26z"
        fill="#FF7A59"
      />
      <path
        d="M32 60a10 10 0 0 1-10-10c0-6 5-9 7-13 2 4 5 5 7 8 2 3 6 5 6 9a10 10 0 0 1-10 6z"
        fill="#FFC2AE"
      />
    </svg>
  );
}

function CheckHex() {
  return (
    <svg viewBox="0 0 64 70" width="62" height="68">
      <polygon points="32,12 58,26 58,54 32,68 6,54 6,26" fill="#0B3D2E" />
      <polygon points="32,4 58,18 58,46 32,60 6,46 6,18" fill="#158F66" />
      <path
        d="M20 32l9 9 16-17"
        fill="none"
        stroke="#fff"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LogoBadge({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="h-[68px] w-[68px] rounded-full border-4 border-white object-cover shadow-[0_8px_0_rgba(11,61,46,0.18)]"
    />
  );
}

export default function CtaSection() {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((v) => (v + 1) % WELCOME.length), 2200);
    return () => clearInterval(t);
  }, []);

  const w = WELCOME[i];

  return (
    <section className="relative overflow-hidden bg-white">
      <style>{`
        @keyframes cta-bob {
          0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)); }
          50% { transform: translateY(-12px) rotate(calc(var(--r, 0deg) + 4deg)); }
        }
        @keyframes cta-mascot {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }
        @keyframes cta-shadow {
          0%, 100% { transform: scaleX(1); opacity: .28; }
          50% { transform: scaleX(.72); opacity: .16; }
        }
        @keyframes cta-flicker {
          0%, 100% { transform: scale(1) rotate(-3deg); }
          50% { transform: scale(1.12) rotate(3deg); }
        }
        @keyframes cta-pop {
          0% { opacity: 0; transform: translateY(8px) scale(.85); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .cta-bob { animation: cta-bob 5s ease-in-out infinite; }
        .cta-mascot { animation: cta-mascot 3.2s ease-in-out infinite; }
        .cta-shadow { animation: cta-shadow 3.2s ease-in-out infinite; }
        .cta-flicker { animation: cta-flicker 1.4s ease-in-out infinite; }
        .cta-pop { animation: cta-pop .3s cubic-bezier(.2,.9,.3,1.3) both; }
        @media (prefers-reduced-motion: reduce) {
          .cta-bob, .cta-mascot, .cta-shadow, .cta-flicker, .cta-pop { animation: none; }
        }
      `}</style>

      {/* ЗАГОЛОВОК + КНОПКА */}
      <div className="relative z-10 px-6 pb-12 pt-16 text-center sm:pt-20">
        <h2
          className={`${display.className} mx-auto max-w-[900px] text-[22px] leading-[1.25] tracking-[-0.5px] text-[#0B3D2E] min-[400px]:text-[26px] sm:text-[44px] sm:tracking-[-1px] lg:text-[56px]`}
        >
          Учись говорить
          <br />
          на языках мира
          <br />с <span className="text-[#158F66]">ZABU</span>
        </h2>

        <Link
          href="/onboarding"
          className="mt-10 inline-block min-w-[260px] rounded-2xl border-2 border-b-[6px] border-[#158F66] bg-white px-10 py-4 text-sm font-extrabold uppercase tracking-wider text-[#158F66] transition hover:bg-[#EAF6F0] active:translate-y-[3px] active:border-b-[3px] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#158F66]"
        >
          Начать
        </Link>
      </div>

      {/* ВОЛНА */}
      <div
        className="relative h-[480px] overflow-hidden bg-[#158F66]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,.2) 1.5px, transparent 1.5px)",
          backgroundSize: "26px 26px",
        }}
      >
        {/* белая чаша */}
        <svg
          aria-hidden
          viewBox="0 0 1440 480"
          className="absolute left-1/2 top-0 h-[480px] w-[1440px] max-w-none -translate-x-1/2"
        >
          <path
            fill="#fff"
            d="M170 0 C330 0 350 170 450 225 C540 275 590 290 640 360 C670 402 700 420 720 420 C740 420 770 402 800 360 C850 290 900 275 990 225 C1090 170 1110 0 1270 0 Z"
          />
        </svg>

        {/* предметы слева */}
        <Spot x={-345} y={60} rot={-8}>
          <LogoBadge src="/logo-tj.webp" alt="Тоҷикӣ" />
        </Spot>
        <Spot x={-175} y={95} rot={12} delay={0.4}>
          <Diamond size={24} />
        </Spot>
        <Spot x={-235} y={150} rot={-6} delay={1}>
          <Diamond size={34} />
        </Spot>
        <Spot x={-165} y={205} rot={8} delay={1.6}>
          <Diamond size={44} />
        </Spot>
        <Spot x={-175} y={262} rot={-4} delay={0.8}>
          <div className="rounded-full border-2 border-[#158F66] bg-white px-4 py-2 text-sm font-black text-[#158F66] shadow-[0_4px_0_#158F66]">
            Салом 👋
          </div>
        </Spot>

        {/* предметы справа */}
        <Spot x={345} y={60} rot={8} delay={0.6}>
          <LogoBadge src="/logo-en.webp" alt="English" />
        </Spot>
        <Spot x={235} y={150} rot={-6} delay={1.2}>
          <LogoBadge src="/logo-ir.webp" alt="فارسی" />
        </Spot>
        <Spot x={125} y={215} rot={0} delay={0.2}>
          <Flame />
        </Spot>
        <Spot x={205} y={250} rot={-5} delay={1.8}>
          <CheckHex />
        </Spot>

        {/* реплика над маскотом */}
        <div className="absolute left-1/2 top-[168px] z-10 -translate-x-1/2">
          <div
            key={i}
            dir={w.dir}
            className="cta-pop relative whitespace-nowrap rounded-2xl bg-[#158F66] px-5 py-3 text-base font-black text-white shadow-[0_6px_0_rgba(11,61,46,0.3)]"
          >
            {w.text}
            <span className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-[#158F66]" />
          </div>
        </div>

        {/* ЛОГО В ЦЕНТРЕ — favicon.ico */}
        <div className="cta-mascot absolute left-1/2 top-[250px] z-10 -translate-x-1/2">
          <img
            src="/favicon.ico"
            alt="ZABU"
            className="h-36 w-36 object-contain drop-shadow-[0_10px_16px_rgba(21,143,102,0.35)]"
          />
        </div>
        <div className="cta-shadow absolute left-1/2 top-[432px] h-4 w-32 -translate-x-1/2 rounded-full bg-[#0B3D2E]" />
      </div>
    </section>
  );
}