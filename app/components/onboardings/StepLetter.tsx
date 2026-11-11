"use client";

import { useCallback, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { Background } from "./Background";

export type LearningLanguage = "tajik" | "persian";
export type TajikScript = "cyrillic" | "latin";
export type PersianScript = "arabic" | "latin";
export type Script = "cyrillic" | "latin" | "arabic";

type StepLetterProps = {
  language?: LearningLanguage;
  onNext: (script: Script) => void;
  onBack?: () => void;
  initialValue?: Script | null;
};

type ScriptOption = {
  id: Script;
  label: string;
  title: string;
  alphabet: string;
  rtl?: boolean;
};

const TAJIK_OPTIONS: ScriptOption[] = [
  {
    id: "cyrillic",
    label: "КИРИЛЛИЦА",
    title: "Тоҷикӣ",
    alphabet: "А Б В Г Ғ Д Е Ё Ж З",
  },
  {
    id: "latin",
    label: "LATIN",
    title: "Tojiki",
    alphabet: "A B C D E F G Ğ",
  },
];

const PERSIAN_OPTIONS: ScriptOption[] = [
  {
    id: "arabic",
    label: "АРАБСКАЯ ГРАФИКА",
    title: "فارسی",
    alphabet: "ا ب پ ت ث ج چ ح خ",
    rtl: true,
  },
  {
    id: "latin",
    label: "LATIN",
    title: "Persian",
    alphabet: "A B P T S J Ch H Kh",
  },
];

export function StepLetter({
  language = "tajik",
  onNext,
  onBack,
  initialValue = null,
}: StepLetterProps) {
  const SCRIPT_OPTIONS =
    language === "persian" ? PERSIAN_OPTIONS : TAJIK_OPTIONS;

  const [selectedScript, setSelectedScript] = useState<Script | null>(
    initialValue && SCRIPT_OPTIONS.some((option) => option.id === initialValue)
      ? initialValue
      : null
  );

  const handleSelect = useCallback((script: Script) => {
    setSelectedScript(script);
  }, []);

  const handleContinue = useCallback(() => {
    if (!selectedScript) return;
    onNext(selectedScript);
  }, [selectedScript, onNext]);

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#F8FBF9] text-[#0B3D2E]">
      <Background />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-3 sm:px-8 sm:py-5 lg:px-12">
        <main className="mx-auto flex h-full max-h-[620px] w-full min-h-0 max-w-[1050px] flex-col gap-4 sm:gap-6">
          {/* ЗАГОЛОВОК */}
          <header className="shrink-0 text-center">
            <h1 className="text-[length:clamp(26px,4.6vh,42px)] max-[600px]:text-[30px] font-black leading-[1.1] tracking-[-0.03em]">
              Выбери{" "}
              <em className="inline-block -rotate-2 rounded-xl bg-[#D9F36B] px-2.5 pb-0.5 not-italic shadow-[3px_3px_0_#0B3D2E] sm:px-3 sm:shadow-[4px_4px_0_#0B3D2E]">
                письменность
              </em>
            </h1>
          </header>

          {/* КАРТОЧКИ */}
          <section className="grid min-h-0 flex-1  gap-3 pb-2 sm:gap-5 lg:gap-7 ">
            {SCRIPT_OPTIONS.map((option) => {
              const isSelected = selectedScript === option.id;
              const dir = option.rtl ? "rtl" : "ltr";
              const letters = option.alphabet.split(" ");

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleSelect(option.id)}
                  aria-pressed={isSelected}
                  className={`group relative flex min-h-0 min-w-0 flex-col justify-center overflow-hidden rounded-3xl border-2 p-3 text-left transition duration-300 focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#2EB67D] motion-reduce:transform-none motion-reduce:transition-none sm:p-6 lg:p-8 ${
                    isSelected
                      ? "border-[#0B3D2E] bg-[#158F66] text-white shadow-[0_8px_0_#0B3D2E] sm:scale-[1.02]"
                      : "border-[#E3EBE5] bg-white text-[#0B3D2E] shadow-[0_6px_0_rgba(11,61,46,0.1)] hover:-translate-y-1 hover:border-[#9FCDB7]"
                  }`}
                >
                  {/* галочка */}
                  <span
                    className={`absolute right-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full border-2 transition duration-300 sm:right-4 sm:top-4 sm:h-9 sm:w-9 ${
                      isSelected
                        ? "border-[#0B3D2E] bg-[#D9F36B] text-[#0B3D2E]"
                        : "scale-90 border-[#0B3D2E]/15 bg-white text-transparent group-hover:border-[#158F66]"
                    }`}
                  >
                    <Check className="h-4 w-4 stroke-[3.5]" />
                  </span>

                  {/* метка */}
                  <span
                    className={`mb-3 w-fit max-w-[75%] rounded-full px-3 py-1 text-[10px] font-black tracking-wider sm:mb-4 sm:text-xs ${
                      isSelected
                        ? "bg-[#D9F36B] text-[#0B3D2E]"
                        : "bg-[#EAF6F0] text-[#158F66]"
                    }`}
                  >
                    {option.label}
                  </span>

                  {/* название */}
                  <h2
                    dir={dir}
                    className={`text-[length:clamp(28px,5vh,46px)] font-black leading-tight tracking-[-0.02em] ${
                      option.rtl ? "text-right" : "text-left"
                    }`}
                  >
                    {option.title}
                  </h2>

                  {/* буквы-плитки */}
                  <div
                    dir={dir}
                    className="mt-3 flex flex-wrap gap-1.5 sm:mt-5 sm:gap-2"
                  >
                    {letters.map((l, i) => (
                      <span
                        key={`${l}-${i}`}
                        className={`grid h-7 min-w-7 place-items-center rounded-lg px-1 font-mono text-sm font-black sm:h-9 sm:min-w-9 sm:text-base ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-[#EAF6F0] text-[#158F66]"
                        }`}
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </section>

          {/* КНОПКИ */}
          <footer className="shrink-0">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-[#0B3D2E]/10 bg-white px-5 text-sm font-bold text-[#0B3D2E] transition hover:bg-[#EAF6F0] active:scale-[0.98] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#2EB67D] sm:px-6"
              >
                <ArrowLeft className="h-4 w-4" />
                Назад
              </button>

              <button
                type="button"
                onClick={handleContinue}
                disabled={!selectedScript}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#158F66] px-5 text-sm font-extrabold text-white shadow-[0_6px_0_#0B3D2E] transition hover:translate-y-[2px] hover:shadow-[0_4px_0_#0B3D2E] active:translate-y-[4px] active:shadow-[0_2px_0_#0B3D2E] focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#2EB67D] disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-[#E2EBE5] disabled:text-[#0B3D2E]/35 disabled:shadow-none sm:flex-none sm:min-w-[210px] sm:px-8"
              >
                Продолжить
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default StepLetter;