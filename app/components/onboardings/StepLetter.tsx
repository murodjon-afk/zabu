"use client";

import { useCallback, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  BookOpen,
  Volume2,
  Info,
} from "lucide-react";

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
  example: string;
  description: string;
  previewWord: string;
  phonetic: string;
  translation: string;
  phrase: string;
  rtl?: boolean;
  speechLang: string;
};

const TAJIK_OPTIONS: ScriptOption[] = [
  {
    id: "cyrillic",
    label: "КИРИЛЛИЦА",
    title: "Тоҷикӣ",
    alphabet: "А Б В Г Ғ Д Е Ё Ж З",
    example: "Салом, чӣ хел ҳастӣ?",
    description: "Классическая письменность таджикского языка.",
    previewWord: "Салом",
    phonetic: "Salom",
    translation: "Привет · Hello",
    phrase: "Ташаккур, ман хубам!",
    speechLang: "tg-TJ",
  },
  {
    id: "latin",
    label: "LATIN",
    title: "Tojiki",
    alphabet: "A B C D E F G Ğ",
    example: "Salom, chi khel hasti?",
    description: "Таджикский язык в латинской записи.",
    previewWord: "Salom",
    phonetic: "Salom",
    translation: "Привет · Hello",
    phrase: "Tashakkur, man xubam!",
    speechLang: "tg-TJ",
  },
];

const PERSIAN_OPTIONS: ScriptOption[] = [
  {
    id: "arabic",
    label: "АРАБСКАЯ ГРАФИКА",
    title: "فارسی",
    alphabet: "ا ب پ ت ث ج چ ح خ",
    example: "سلام، چطور هستی؟",
    description: "Персидский язык в арабской графике.",
    previewWord: "سلام",
    phonetic: "Salâm",
    translation: "Привет · Hello",
    phrase: "ممنون، من خوبم!",
    rtl: true,
    speechLang: "fa-IR",
  },
  {
    id: "latin",
    label: "LATIN",
    title: "Persian",
    alphabet: "A B P T S J Ch H Kh",
    example: "Salam, chetor hasti?",
    description: "Персидский язык в латинской записи.",
    previewWord: "Salam",
    phonetic: "Salâm",
    translation: "Привет · Hello",
    phrase: "Mamnoon, man khoobam!",
    speechLang: "fa-IR",
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

  const selectedOption = SCRIPT_OPTIONS.find(
    (option) => option.id === selectedScript
  );

  const handleSelect = useCallback((script: Script) => {
    setSelectedScript(script);
  }, []);

  const handleContinue = useCallback(() => {
    if (!selectedScript) return;
    onNext(selectedScript);
  }, [selectedScript, onNext]);

  const handleAudio = useCallback(() => {
    if (!selectedOption || typeof window === "undefined") return;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(
        selectedOption.previewWord
      );

      utterance.lang = selectedOption.speechLang;
      window.speechSynthesis.speak(utterance);
    }
  }, [selectedOption]);

  return (
    /*
      Без внутреннего скролла: высота делится между заголовком, карточками,
      предпросмотром и кнопками через flex, а второстепенные блоки скрываются
      на низких экранах. Фон (<Background />) остаётся.
    */
    <div className="relative flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#F8FBF9] text-[#0B3D2E]">
      <Background />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-3 sm:px-8 sm:py-5 lg:px-12">
        <main className="mx-auto flex h-full max-h-[780px] w-full max-w-[1050px] min-h-0 flex-col gap-3 sm:gap-5">
          {/* ЗАГОЛОВОК */}
          <header className="shrink-0 text-center">
            <h1 className="text-[length:clamp(24px,4.4vh,42px)] font-black leading-[1.1] tracking-[-0.03em]">
              Выбери{" "}
              <em className="inline-block -rotate-2 rounded-xl bg-[#D9F36B] px-2.5 pb-0.5 not-italic shadow-[3px_3px_0_#0B3D2E] sm:px-3 sm:shadow-[4px_4px_0_#0B3D2E]">
                письменность
              </em>
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-xs leading-relaxed text-[#0B3D2E]/60 sm:text-sm lg:text-base [@media(max-height:700px)]:hidden">
              Один язык — два способа написания. Выбери тот, который тебе
              ближе.
            </p>
          </header>

          {/* КАРТОЧКИ */}
          <section className="grid min-h-0 flex-1 grid-cols-2 gap-3 pb-2 sm:gap-5 lg:gap-7">
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
                  className={`group relative flex min-h-0 min-w-0 flex-col overflow-hidden rounded-3xl border-2 p-3 text-left transition duration-300 focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#2EB67D] motion-reduce:transform-none motion-reduce:transition-none sm:p-5 lg:p-6 ${
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
                    className={`mb-2 w-fit max-w-[75%] rounded-full px-2.5 py-1 text-[9px] font-black tracking-wider sm:mb-3 sm:text-[11px] ${
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
                    className={`text-[length:clamp(24px,4.6vh,42px)] font-black leading-tight tracking-[-0.02em] ${
                      option.rtl ? "text-right" : "text-left"
                    }`}
                  >
                    {option.title}
                  </h2>

                  {/* буквы-плитки */}
                  <div
                    dir={dir}
                    className="mt-2 flex max-h-[68px] flex-wrap gap-1 overflow-hidden sm:mt-3 sm:gap-1.5"
                  >
                    {letters.map((l, i) => (
                      <span
                        key={`${l}-${i}`}
                        className={`grid h-6 min-w-6 place-items-center rounded-lg px-1 font-mono text-xs font-black sm:h-8 sm:min-w-8 sm:text-sm ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-[#EAF6F0] text-[#158F66]"
                        }`}
                      >
                        {l}
                      </span>
                    ))}
                  </div>

                  {/* пример */}
                  <div className="mt-2 sm:mt-4">
                    <span
                      className={`text-[9px] font-black uppercase tracking-wider sm:text-[11px] ${
                        isSelected ? "text-white/60" : "text-[#0B3D2E]/35"
                      }`}
                    >
                      Пример
                    </span>
                    <p
                      dir={dir}
                      className={`mt-0.5 break-words text-[11px] font-bold leading-snug sm:text-sm lg:text-base ${
                        option.rtl ? "text-right" : "text-left"
                      } ${isSelected ? "text-white" : "text-[#0B3D2E]/85"}`}
                    >
                      {option.example}
                    </p>
                  </div>

                  {/* описание — только на высоких экранах */}
                  <p
                    className={`mt-auto hidden pt-3 text-xs leading-relaxed sm:block lg:text-sm [@media(max-height:760px)]:!hidden ${
                      isSelected ? "text-white/80" : "text-[#0B3D2E]/55"
                    }`}
                  >
                    {option.description}
                  </p>
                </button>
              );
            })}
          </section>

          {/* ПРЕДПРОСМОТР УРОКА */}
          <section className="shrink-0 rounded-3xl border-2 border-[#E3EBE5] bg-white p-3 shadow-[0_6px_0_rgba(11,61,46,0.08)] sm:p-4">
            <div className="flex min-h-[56px] items-center justify-between gap-3 sm:min-h-[64px]">
              {selectedOption ? (
                <>
                  <div className="flex min-w-0 items-center gap-3">
                    <button
                      type="button"
                      onClick={handleAudio}
                      aria-label="Прослушать произношение"
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#D9F36B] text-[#0B3D2E] shadow-[0_4px_0_#0B3D2E] transition hover:brightness-95 active:translate-y-[2px] active:shadow-[0_2px_0_#0B3D2E] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#2EB67D] sm:h-12 sm:w-12"
                    >
                      <Volume2 className="h-5 w-5" />
                    </button>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span
                          dir={selectedOption.rtl ? "rtl" : "ltr"}
                          className="text-lg font-black tracking-tight sm:text-2xl"
                        >
                          {selectedOption.previewWord}
                        </span>
                        <span className="hidden text-xs font-semibold text-[#0B3D2E]/45 sm:inline">
                          [{selectedOption.phonetic}]
                        </span>
                      </div>
                      <p className="truncate text-xs font-semibold text-[#0B3D2E]/55 sm:text-sm">
                        {selectedOption.translation}
                      </p>
                    </div>
                  </div>

                  {/* реплика */}
                  <div className="hidden min-w-0 text-right sm:block">
                    <p className="mb-1 inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#158F66]">
                      <BookOpen className="h-3.5 w-3.5" />
                      Урок 1
                    </p>
                    <p
                      dir={selectedOption.rtl ? "rtl" : "ltr"}
                      className="block max-w-[280px] truncate rounded-2xl rounded-br-md bg-[#158F66] px-4 py-2 text-sm font-bold text-white shadow-[0_4px_0_rgba(11,61,46,0.3)]"
                    >
                      {selectedOption.phrase}
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#158F66]/30 py-3 text-center text-[11px] font-bold text-[#158F66] sm:text-sm">
                  <BookOpen className="h-4 w-4 shrink-0" />
                  Выбери письменность, чтобы увидеть пример
                </div>
              )}
            </div>
          </section>

          {/* КНОПКИ */}
          <footer className="shrink-0">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onBack}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-[#0B3D2E]/10 bg-white px-4 text-xs font-bold text-[#0B3D2E] transition hover:bg-[#EAF6F0] active:scale-[0.98] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#2EB67D] sm:h-12 sm:px-6 sm:text-sm"
              >
                <ArrowLeft className="h-4 w-4" />
                Назад
              </button>

              <button
                type="button"
                onClick={handleContinue}
                disabled={!selectedScript}
                className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#158F66] px-5 text-xs font-extrabold text-white shadow-[0_6px_0_#0B3D2E] transition hover:translate-y-[2px] hover:shadow-[0_4px_0_#0B3D2E] active:translate-y-[4px] active:shadow-[0_2px_0_#0B3D2E] focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#2EB67D] disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-[#E2EBE5] disabled:text-[#0B3D2E]/35 disabled:shadow-none sm:h-12 sm:flex-none sm:min-w-[210px] sm:px-8 sm:text-sm"
              >
                Продолжить
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-center [@media(max-height:760px)]:hidden">
              <Info className="h-3 w-3 shrink-0 text-[#158F66]/70 sm:h-3.5 sm:w-3.5" />
              <p className="text-[10px] text-[#0B3D2E]/45 sm:text-[11px]">
                Письменность можно изменить в настройках профиля.
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default StepLetter;