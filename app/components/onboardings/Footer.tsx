"use client";

import Link from "next/link";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { Unbounded } from "next/font/google";

const display = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["800"],
});

const LANGS = [
  { name: "Тоҷикӣ", welcome: "Хуш омадед", logo: "/logo-tj.webp", dir: "ltr" },
  { name: "فارسی", welcome: "خوش آمدید", logo: "/logo-ir.webp", dir: "rtl" },
  { name: "English", welcome: "Welcome", logo: "/logo-en.webp", dir: "ltr" },
] as const;

export default function Footer() {
  return (
    <footer className="w-full">
      <style>{`
        @keyframes ft-bob {
          0%, 100% { transform: translateY(0) rotate(-3deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }
        .ft-bob { animation: ft-bob 4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .ft-bob { animation: none; } }
      `}</style>

      {/* Во всю ширину, без скруглений и отступов — стыкуется с волной выше.
          Точки: тот же шаг и прозрачность, что у секции с волной (высота 480px),
          сдвиг по Y выравнивает сетку на стыке. */}
      <div
        className="relative w-full overflow-hidden bg-[#158F66] text-white"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,.2) 1.5px, transparent 1.5px)",
          backgroundSize: "26px 26px",
          backgroundPosition: "0 -12px",
        }}
      >
        {/* пятна света */}
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-[#D9F36B]/25 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 bottom-24 h-72 w-72 rounded-full bg-[#FF7A59]/25 blur-3xl"
        />

        <div className="relative mx-auto w-full max-w-[1350px] px-6 pt-14 lg:px-14 lg:pt-20">
          {/* верх: призыв + колонки */}
          <div className="grid gap-12 md:grid-cols-[1.3fr_1fr]">
            {/* призыв */}
            <div>
              <div className="flex items-center gap-3">
                <img
                  src="/logo-bg.png"
                  alt="ZABU"
                  className="ft-bob h-16 w-auto object-contain drop-shadow-[0_8px_12px_rgba(11,61,46,0.3)]"
                />
                <span className="text-3xl font-black tracking-[-1.5px]">
                  ZABU<span className="text-[#D9F36B]">.</span>
                </span>
              </div>

              <h2
                className={`${display.className} mt-8 max-w-[560px] text-[28px] leading-[1.2] tracking-[-1px] sm:text-[38px]`}
              >
                Готов сказать
                <br />
                <span className="mt-2 inline-block -rotate-2 rounded-2xl bg-[#D9F36B] px-4 pb-1 pt-0.5 text-[#0B3D2E] shadow-[5px_5px_0_#0B3D2E]">
                  Welcome?
                </span>
              </h2>

              <Link
                href="/onboarding"
                className="group mt-9 inline-flex items-center gap-5 rounded-full bg-white py-2.5 pl-7 pr-2.5 text-sm font-extrabold text-[#0B3D2E] shadow-[0_8px_0_rgba(11,61,46,0.35)] transition hover:translate-y-[3px] hover:shadow-[0_5px_0_rgba(11,61,46,0.35)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                Начать
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#158F66] text-white">
                  <ArrowUpRight
                    size={18}
                    className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </div>

            {/* языки + аккаунт */}
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
              <div>
                <p className="mb-4 text-sm font-bold text-white/70">Языки</p>
                <ul className="flex flex-col gap-3">
                  {LANGS.map((l) => (
                    <li key={l.name}>
                      <Link
                        href="/onboarding"
                        className="group flex w-fit items-center gap-3 rounded-full bg-white/15 py-1.5 pl-1.5 pr-5 backdrop-blur transition hover:bg-white hover:text-[#0B3D2E]"
                      >
                        <img
                          src={l.logo}
                          alt=""
                          className="h-9 w-9 rounded-full border-2 border-white object-cover"
                        />
                        <span className="leading-tight">
                          <span className="block text-sm font-extrabold">
                            {l.name}
                          </span>
                          <span
                            dir={l.dir}
                            className="block text-xs text-white/75 group-hover:text-[#158F66]"
                          >
                            {l.welcome}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-4 text-sm font-bold text-white/70">Аккаунт</p>
                <ul className="flex flex-col gap-3 text-base font-bold">
                  <li>
                    <Link
                      href="/onboarding"
                      className="transition hover:text-[#D9F36B]"
                    >
                      Создать аккаунт
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/login"
                      className="transition hover:text-[#D9F36B]"
                    >
                      Войти
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* нижняя полоса */}
          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t-2 border-dashed border-white/30 pt-6">
            <span className="text-xs font-semibold text-white/80">
              © 2026 ZABU. Learn beyond borders.
            </span>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2 rounded-full bg-[#D9F36B] py-2 pl-5 pr-2 text-sm font-extrabold text-[#0B3D2E] shadow-[0_5px_0_rgba(11,61,46,0.35)] transition hover:translate-y-[2px] hover:shadow-[0_3px_0_rgba(11,61,46,0.35)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Наверх
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0B3D2E] text-white">
                <ArrowUp size={16} />
              </span>
            </button>
          </div>
        </div>

        {/* гигантская надпись, обрезанная снизу */}
        <div
          aria-hidden
          className={`${display.className} pointer-events-none relative mt-6 select-none whitespace-nowrap text-center text-[26vw] leading-[0.78] tracking-[-0.04em] text-white/15 sm:text-[22vw] lg:text-[300px]`}
          style={{ marginBottom: "-0.12em" }}
        >
          ZABU.
        </div>
      </div>
    </footer>
  );
}