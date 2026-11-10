"use client";

import Link from "next/link";
import { TOTAL_STEPS, type Step } from "./constants";
import LanguageSwitcher from "../LanguageSwitcher";

export function Header({ step }: { step: Step }) {
  return (
    <header className="sticky top-3 z-30 mx-3 mb-3 mt-3 sm:top-5 sm:mx-5 sm:mb-4 sm:mt-5">
      <div className="mx-auto flex h-[64px]  items-center justify-between gap-2 rounded-[22px] bg-[#158F66] px-3 shadow-[0_8px_0_rgba(11,61,46,0.18)] sm:h-[76px] sm:rounded-[28px] sm:px-6 lg:px-10">
        {/* LOGO */}
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

        {/* RIGHT SIDE */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3 lg:gap-4">
          {/* STEPS */}
          <div
            className="flex items-center gap-2.5 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-bold text-white sm:px-4 sm:py-2 sm:text-xs lg:text-[13px]"
            aria-label={`Шаг ${step} из ${TOTAL_STEPS}`}
          >
            <span className="whitespace-nowrap">
              <span className="sm:hidden">
                {step}/{TOTAL_STEPS}
              </span>
              <span className="hidden sm:inline">
                Шаг {step} из {TOTAL_STEPS}
              </span>
            </span>

            <span
              className="hidden items-center gap-1 min-[480px]:flex"
              aria-hidden="true"
            >
              {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((n) => (
                <i
                  key={n}
                  className={`block h-1.5 rounded-full transition-all duration-300 ${
                    n === step ? "w-6 lg:w-8" : "w-1.5 lg:w-2"
                  } ${n <= step ? "bg-[#D9F36B]" : "bg-white/30"}`}
                />
              ))}
            </span>
          </div>

          <LanguageSwitcher />

          {/* LOGIN */}
          <Link
            href="/login"
            className="whitespace-nowrap rounded-full bg-white px-4 py-2.5 text-xs font-bold text-[#158F66] transition hover:-translate-y-0.5 hover:bg-[#D9F36B] hover:text-[#0B3D2E] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-6 sm:py-3 sm:text-sm"
          >
            Войти
          </Link>
        </div>
      </div>
    </header>
  );
}