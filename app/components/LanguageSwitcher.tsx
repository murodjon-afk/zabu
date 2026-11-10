"use client";

import { useEffect, useState } from "react";
import {
  RuFlag,
  TjFlag,
  UzFlag,
  IrFlag,
  ItFlag,
  IsFlag 
} from "../components/onboardings/Flags";

export const UI_LANGUAGES = [
  { id: "russian", code: "RU", name: "Русский", Flag: RuFlag, dir: "ltr" },
  { id: "tajik", code: "TJ", name: "Тоҷикӣ", Flag: TjFlag, dir: "ltr" },
  { id: "uzbek", code: "UZ", name: "O‘zbekcha", Flag: UzFlag, dir: "ltr" },
  { id: "persian", code: "IR", name: "فارسی", Flag: IrFlag, dir: "rtl" },
  { id: "italian", code: "IT", name: "Italiano", Flag: ItFlag, dir: "ltr" },
    { id: "jewish", code: "IS", name: "Hebrew", Flag: IsFlag, dir: "ltr" },


] as const;

export type UiLanguageId = (typeof UI_LANGUAGES)[number]["id"];

type Props = {
  /** Если не передать — компонент хранит выбор сам */
  value?: UiLanguageId;
  onChange?: (id: UiLanguageId) => void;
};

export default function LanguageSwitcher({ value, onChange }: Props) {
  const [inner, setInner] = useState<UiLanguageId>("russian");
  const [open, setOpen] = useState(false);

  const language = value ?? inner;
  const selectedLanguage =
    UI_LANGUAGES.find((l) => l.id === language) ?? UI_LANGUAGES[0];

  // закрытие по Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const changeLanguage = (id: UiLanguageId) => {
    setInner(id);
    onChange?.(id);
    setOpen(false);
  };

  return (
    <div className="relative">
      {/* Обычный CSS вместо arbitrary-вариантов Tailwind — работает в любой версии.
          Код языка (RU, TJ…) скрыт на экранах уже 500px. */}
      <style>{`
        @media (max-width: 499px) {
          .ls-code { display: none; }
        }
      `}</style>

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Change interface language"
        aria-expanded={open}
        aria-haspopup="listbox"
        className="inline-flex h-8 items-center gap-1.5 rounded-full border border-white/30 bg-white/10 pl-2.5 pr-2 text-xs font-bold tracking-wide text-white transition hover:bg-white/20 sm:h-9"
      >
        <selectedLanguage.Flag />
        <span className="ls-code">{selectedLanguage.code}</span>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          className={`h-3.5 w-3.5 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          <path
            d="m5 7.5 5 5 5-5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-label="Close language menu"
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />

          <div
            role="listbox"
            className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-[#E3EBE5] bg-white p-1 shadow-xl"
          >
            {UI_LANGUAGES.map((item) => {
              const active = item.id === language;

              return (
                <button
                  key={item.id}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => changeLanguage(item.id)}
                  className={`flex h-10 w-full items-center gap-3 rounded-lg px-2.5 text-sm transition ${
                    active
                      ? "bg-[#EAF5EF] font-semibold text-[#16865B]"
                      : "text-[#35483C] hover:bg-[#F4F7F4]"
                  }`}
                >
                  <item.Flag />

                  <span dir={item.dir} className="truncate">
                    {item.name}
                  </span>

                  {active && (
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      className="ml-auto h-4 w-4 shrink-0"
                    >
                      <path
                        d="m4 10 4 4 8-8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}