"use client";

import { useRef, useState } from "react";
import { WELCOME, getGoal, getLanguage, type LearningId } from "./constants";
import { LevelIcon } from "./UI";

type Props = { learning: LearningId; native: string | null; goal: string | null };

import {LOGOS} from "./constants"


const BORDER = "border-[#DCE9E1]";

export function Passport({ learning, native, goal }: Props) {
  const learnLang = getLanguage(learning);
  const nativeLang = getLanguage(native);
  const goalData = getGoal(goal);
  const welcome = WELCOME[learning];
  const cardRef = useRef<HTMLDivElement>(null);

  const setVars = (v: Record<string, string>) => {
    const el = cardRef.current;
    if (el) for (const k in v) el.style.setProperty(k, v[k]);
  };

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    setVars({
      "--rx": `${((0.5 - y) * 7).toFixed(2)}deg`,
      "--ry": `${((x - 0.5) * 9).toFixed(2)}deg`,
      "--mx": `${(x * 100).toFixed(1)}%`,
      "--my": `${(y * 100).toFixed(1)}%`,
    });
  };

  const onLeave = () => setVars({ "--rx": "0deg", "--ry": "0deg", "--mx": "50%", "--my": "30%" });

  const [stampKey, setStampKey] = useState(0);

  const accent = goalData?.color ?? "#16865B";
  const route = [
    { label: "ИЗУЧАЮ", lang: learnLang, Flag: learnLang?.Flag },
    { label: "ОБЪЯСНЕНИЯ НА", lang: nativeLang, Flag: nativeLang?.Flag },
  ];

  return (
    <div onPointerMove={onMove} onPointerLeave={onLeave} className="w-full min-w-0">
      <div ref={cardRef} className={`zabu-card relative w-full min-w-0 overflow-hidden rounded-[36px] border ${BORDER}`}>
        {/* блик */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 opacity-70"
          style={{
            background: "radial-gradient(340px circle at var(--mx) var(--my), rgba(255,255,255,.35), transparent 65%)",
            mixBlendMode: "soft-light",
          }}
        />

        {/* верх: приветствие + логотип */}
        <div className="relative flex min-h-[180px] items-center justify-between gap-5 px-8 py-8 xl:px-12">
          <div className="relative z-[1] min-w-0 flex-1">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#16865B]" />
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#5E8A73]">Паспорт языков</p>
            </div>

            {welcome && (
              <p
                lang={welcome.lang}
                dir={welcome.dir}
                className={`break-words text-[48px] font-semibold leading-[1.12] tracking-tight text-[#14231C] xl:text-[60px] ${welcome.className}`}
              >
                {welcome.text}
              </p>
            )}
            <p className="mt-4 max-w-[300px] text-base leading-relaxed text-[#6C8878]">
              Твой путь к новым языкам начинается здесь.
            </p>
          </div>

          <div className="zabu-bob relative z-[1] flex h-[160px] w-[175px] shrink-0 items-center justify-center xl:h-[180px] xl:w-[190px]">
            <img src={LOGOS[learning] ?? "/logo-en.webp"} alt="ZABU logo" className="h-full w-full object-contain" />
          </div>
        </div>

        {/* перфорация */}
        <div className="relative h-0">
          <span className={`absolute -left-4 -top-4 h-8 w-8 rounded-full border ${BORDER}`} />
          <span className={`absolute -right-4 -top-4 h-8 w-8 rounded-full border ${BORDER}`} />
          <div className={`mx-10 border-t-2 border-dashed ${BORDER}`} />
        </div>

        {/* маршрут + печать */}
        <div className="relative flex min-w-0 items-center justify-between gap-8 px-10 py-9 xl:px-12 xl:py-12">
          <ul className="relative min-w-0 flex-1 space-y-7">
            <span aria-hidden="true" className="absolute left-[23px] top-12 h-9 border-l-2 border-dotted border-[#B7D3C3]" />
            {route.map(({ label, lang, Flag }) => (
              <li key={label} className="flex min-w-0 items-center gap-5">
                <span className="flex h-[64px] w-[76px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E3EAE5]">
                  {Flag && <Flag />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="mb-2 text-xs font-bold tracking-[0.16em] text-[#8A9790]">{label}</p>
                  <p lang={lang?.lang} dir={lang?.dir} className={`break-words text-xl font-semibold leading-tight text-[#1C2B23] ${lang?.font ?? ""}`}>
                    {lang?.native ?? "—"}
                    {lang?.english && <span className="ml-2 text-base font-normal text-[#929D96]">{lang.english}</span>}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <button
            type="button"
            key={stampKey}
            onClick={() => setStampKey((k) => k + 1)}
            aria-label={`Мой уровень: ${goalData?.title ?? "не выбран"}`}
            className={`${stampKey === 0 ? "zabu-stamp" : "zabu-stamp-replay"} relative flex h-[148px] w-[148px] shrink-0 flex-col items-center justify-center gap-2 rounded-full border-2 border-dashed px-3 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#16865B] xl:h-[160px] xl:w-[160px]`}
            style={{ borderColor: accent }}
          >
            <span aria-hidden="true" className="absolute inset-2 rounded-full border" style={{ borderColor: accent, opacity: 0.35 }} />
            {goalData && <LevelIcon id={goalData.id} color={goalData.color} />}
            <span className="max-w-full text-sm font-bold leading-tight" style={{ color: accent }}>
              {goalData?.title ?? "—"}
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.15em] text-[#9BA89F]">МОЙ УРОВЕНЬ</span>
          </button>
        </div>

        {/* низ */}
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 border-t border-[#EDF2EE] px-10 py-5 xl:px-12">
          <span className="text-[10px] font-semibold tracking-[0.2em] text-[#A0ADA4]">ZABU LANGUAGE PASSPORT</span>
          <span className="text-xs font-semibold text-[#16865B]">YOUR JOURNEY STARTS HERE</span>
        </div>
      </div>
    </div>
  );
}