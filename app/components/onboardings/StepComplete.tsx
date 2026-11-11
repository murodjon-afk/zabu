"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft } from "lucide-react";

import { LOGOS, buildUser, type LearningId } from "./constants";
import type { Script } from "./StepLetter";
import { Passport } from "./Passport";
import { ProviderButtons } from "./ProvideButton";

type Props = {
  learning: LearningId;
  native: string | null;
  goal: string | null;
  script: Script | null;
  password: string;
  onBack: () => void;
  onFinish: () => void;
};

const USER_KEY = "zabu:user";

/* Классы zabu-card / zabu-stamp используются компонентом Passport — оставлены */
const CSS = `
  @keyframes zabu-rise { from { opacity: 0; transform: translateY(22px) scale(.98); } to { opacity: 1; transform: none; } }
  @keyframes zabu-stamp {
    0% { opacity: 0; transform: rotate(-12deg) scale(2.2); }
    55% { opacity: 1; transform: rotate(-12deg) scale(.92); }
    75% { transform: rotate(-12deg) scale(1.05); }
    100% { opacity: 1; transform: rotate(-12deg) scale(1); }
  }
  @keyframes zabu-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
  @keyframes zabu-ring { to { transform: rotate(360deg); } }
  @keyframes zabu-pop-in { from { opacity: 0; transform: translateY(10px) scale(.92); } to { opacity: 1; transform: none; } }

  .zabu-card {
    --rx: 0deg; --ry: 0deg; --mx: 50%; --my: 30%;
    transform: perspective(1200px) rotateX(var(--rx)) rotateY(var(--ry));
    transition: transform .2s ease-out;
    animation: zabu-rise .8s cubic-bezier(.2,.8,.2,1) both;
  }
  .zabu-stamp { animation: zabu-stamp .65s cubic-bezier(.2,.9,.3,1.2) .55s both; }
  .zabu-stamp-replay { animation: zabu-stamp .65s cubic-bezier(.2,.9,.3,1.2) both; }
  .zabu-bob { animation: zabu-bob 5s ease-in-out infinite; }
  .zabu-ring { animation: zabu-ring 22s linear infinite; }
  .zabu-perk { animation: zabu-pop-in .5s cubic-bezier(.2,.9,.3,1.2) both; }
  .zabu-btn { transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease; }
  .zabu-btn:hover { transform: translateY(-2px); border-color: #16865B; }

  @media (prefers-reduced-motion: reduce) {
    .zabu-card, .zabu-stamp, .zabu-stamp-replay, .zabu-bob, .zabu-ring, .zabu-perk, .zabu-btn { animation: none !important; transition: none !important; }
    .zabu-card { transform: none !important; }
    .zabu-stamp, .zabu-stamp-replay { transform: rotate(-12deg); opacity: 1; }
  }
`;

const PERKS = [
  { emoji: "🪪", text: "Языковой паспорт" },
  { emoji: "📈", text: "Прогресс" },
  { emoji: "📱", text: "Любое устройство" },
];

/** Только поля схемы MockAPI (без id, Coins, wordsSaved) */
function toSchema(u: Record<string, any>) {
  return {
    namefull: u.namefull ?? "",
    email: u.email ?? "",
    status: u.status ?? "student",
    targetTongue: u.targetTongue ?? null,
    nativeTongue: u.nativeTongue ?? null,
    hw: u.hw ?? 0,
    lvl: u.lvl ?? null,
    wordsLearned: u.wordsLearned ?? 0,
    Scores: u.Scores ?? 0,
    lessonsComleted: u.lessonsComleted ?? 0,
    script: u.script ?? null,
    password: u.password ?? "",
    coins: u.coins ?? u.Coins ?? 0,
  };
}

/** Пароль, уже лежащий в черновике */
function savedPassword(): string {
  try {
    const prev = JSON.parse(localStorage.getItem(USER_KEY) ?? "{}");
    return typeof prev?.password === "string" ? prev.password : "";
  } catch {
    return "";
  }
}

export function StepComplete({
  learning,
  native,
  goal,
  script,
  password,
  onBack,
}: Props) {
  const { data: session, status } = useSession();

  // Блокируем прокрутку страницы на последнем шаге
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prev = [html.style.overflow, body.style.overflow];
    html.style.overflow = body.style.overflow = "hidden";
    return () => {
      [html.style.overflow, body.style.overflow] = prev;
    };
  }, []);

  // Черновик пользователя: пароль из пропса, иначе из уже сохранённого
  useEffect(() => {
    if (status === "loading") return;

    const pw = password || savedPassword();

    const user = toSchema(
      buildUser(
        learning,
        native,
        goal,
        session?.user ?? null,
        script ?? null,
        pw
      )
    );

    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {}

    if (process.env.NODE_ENV !== "production") {
      console.log("ZABU user:", { ...user, password: user.password ? "***" : "" });
    }
  }, [learning, native, goal, script, password, session, status]);

  return (
    <main className="relative flex h-full min-h-0 w-full flex-1 flex-col items-center justify-center overflow-hidden bg-transparent text-[#0B3D2E]">
      <style>{CSS}</style>

      {/* ОСНОВНОЙ КОНТЕНТ */}
      <div className="mx-auto flex min-h-0 w-full max-w-[1600px] flex-1 items-center justify-center overflow-hidden px-4 pb-16 pt-4 sm:px-8 sm:pb-20 sm:pt-8 lg:px-12 xl:px-16">
        <div className="grid w-full min-w-0 grid-cols-1 place-items-center lg:grid-cols-[1.12fr_0.88fr] lg:gap-12 xl:gap-20">
          {/* ПАСПОРТ — только десктоп */}
          <section className="hidden w-full min-w-0 items-center justify-center lg:flex">
            <Passport learning={learning} native={native} goal={goal} />
          </section>

          {/* РЕГИСТРАЦИЯ */}
          <section className="flex w-full min-w-0 max-w-[440px] flex-col items-center text-center lg:max-w-none lg:items-start lg:pl-2 lg:text-left">
            {/* ЛОГОТИП — только мобильный */}
            <div className="relative mb-3 flex h-[88px] w-[96px] items-center justify-center min-[375px]:h-[104px] min-[375px]:w-[114px] sm:mb-4 sm:h-[128px] sm:w-[140px] lg:hidden [@media(max-height:620px)]:hidden">
              <span
                aria-hidden
                className="zabu-ring absolute -inset-3 rounded-full border-2 border-dashed border-[#158F66]/35"
              />
              <span className="zabu-bob flex h-full w-full items-center justify-center">
                <img
                  src={LOGOS[learning] ?? "/logo-en.webp"}
                  alt="ZABU logo"
                  className="h-full w-full object-contain"
                />
              </span>
            </div>

            {/* ЗАГОЛОВОК */}
            <h1 className="text-[length:clamp(30px,6.4vh,68px)] font-black leading-[1.08] tracking-[-0.03em]">
              Открой мир
              <br />
              <span className="mt-1.5 inline-block -rotate-2 rounded-2xl bg-[#D9F36B] px-3 pb-1 pt-0.5 shadow-[4px_4px_0_#0B3D2E] sm:px-4 sm:shadow-[5px_5px_0_#0B3D2E]">
                языков.
              </span>
            </h1>

         

            <p className="mt-5 inline-flex rounded-full bg-[#158F66] px-4 py-1.5 text-xs font-black text-white sm:mt-6 sm:text-sm">
              Зарегистрируйся и начни своё путешествие
            </p>

            <div className="mt-4 w-full">
              <ProviderButtons
                learning={learning}
                native={native}
                goal={goal}
                script={script}
                password={password}
              />
            </div>

            <p className="mt-4 max-w-[420px] text-[11px] leading-relaxed text-[#0B3D2E]/55 sm:text-xs">
              Регистрируясь, ты соглашаешься с{" "}
              <a
                href="/terms"
                className="font-bold text-[#158F66] underline decoration-[#158F66]/40 underline-offset-2 transition hover:text-[#0B3D2E]"
              >
                условиями использования
              </a>{" "}
              и{" "}
              <a
                href="/privacy"
                className="font-bold text-[#158F66] underline decoration-[#158F66]/40 underline-offset-2 transition hover:text-[#0B3D2E]"
              >
                политикой конфиденциальности
              </a>{" "}
              ZABU.
            </p>
          </section>
        </div>
      </div>

      {/* КНОПКА НАЗАД */}
      <footer className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-1 sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto flex w-full max-w-[1600px] justify-center lg:justify-start">
          <button
            type="button"
            onClick={onBack}
            className="pointer-events-auto inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-[#0B3D2E]/10 bg-white px-5 text-sm font-bold text-[#0B3D2E] shadow-[0_4px_0_rgba(11,61,46,0.1)] transition hover:-translate-y-0.5 hover:bg-[#EAF6F0] active:translate-y-0 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#2EB67D] sm:h-12 sm:px-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад
          </button>
        </div>
      </footer>
    </main>
  );
}

export default StepComplete;