"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  RefreshCw,
  Search,
  Volume2,
  X,
} from "lucide-react";
import { useDictionary } from "@/app/providers";
import type { DashboardCtx } from "../../types";

type Word = {
  id: number | string;
  word: string;
  sam_dialect?: string;
  translation?: string;
  translations?: Record<string, string>;
  transcription?: string;
  partOfSpeech?: string;
  url?: string;
  level?: string;
  category?: string;
  example?: string;
  exampleTranslation?: string;
};

type Section =
  | { kind: "all" }
  | { kind: "learned" }
  | { kind: "category"; name: string };

type Props = {
  ctx?: DashboardCtx;
  learnedIds?: Array<number | string>;
};

const EMPTY_IDS: Array<number | string> = [];

const OTHER = "Другое";
const PAGE = 40;

const PALETTE = [
  { bg: "#158F66", fg: "#FFFFFF" },
  { bg: "#D9F36B", fg: "#0B3D2E" },
  { bg: "#FF7A59", fg: "#FFFFFF" },
  { bg: "#0B3D2E", fg: "#FFFFFF" },
  { bg: "#7BD3A9", fg: "#0B3D2E" },
  { bg: "#F6C945", fg: "#0B3D2E" },
] as const;

const plural = (n: number, f: [string, string, string]) => {
  const m10 = n % 10;
  const m100 = n % 100;

  if (m10 === 1 && m100 !== 11) return f[0];
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return f[1];

  return f[2];
};

const OTHER_POS = "__other";

const posKey = (w: { partOfSpeech?: string }) =>
  w.partOfSpeech?.trim().toLowerCase() || OTHER_POS;

const POS_RU: Record<string, string> = {
  noun: "Существительные",
  verb: "Глаголы",
  adjective: "Прилагательные",
  adverb: "Наречия",
  pronoun: "Местоимения",
  preposition: "Предлоги",
  conjunction: "Союзы",
  numeral: "Числительные",
  number: "Числительные",
  interjection: "Междометия",
  particle: "Частицы",
  phrase: "Фразы",
  expression: "Фразы",
};

const posLabel = (key: string) => {
  if (key === OTHER_POS) return "Другое";

  const ru = POS_RU[key];

  if (ru) return ru;

  return key.charAt(0).toUpperCase() + key.slice(1);
};

const wordsLabel = (n: number) =>
  `${n.toLocaleString("ru-RU")} ${plural(n, ["слово", "слова", "слов"])}`;

export function DictionarySection({ ctx, learnedIds }: Props) {
  // learnedIds берём из пропса, а если его нет — из ctx.p.
  // Если в DashboardCtx выученные слова лежат в другом месте, поменяйте путь здесь.
  const ids: Array<number | string> =
    learnedIds ??
    (ctx as unknown as { p?: { learnedIds?: Array<number | string> } })?.p
      ?.learnedIds ??
    EMPTY_IDS;

  const { words, loading, error, language } = useDictionary();

  const [query, setQuery] = useState("");
  const [section, setSection] = useState<Section | null>(null);
  const [visible, setVisible] = useState(PAGE);
  const [sub, setSub] = useState<string | null>(null);

  const topRef = useRef<HTMLDivElement>(null);

  const all = words as Word[];

  const learnedSet = useMemo(
    () => new Set(ids.map(String)),
    [ids]
  );

  // Счётчики
  const total = all.length;

  const learnedCount = useMemo(
    () => all.filter((w) => learnedSet.has(String(w.id))).length,
    [all, learnedSet]
  );

  const percent = total ? Math.round((learnedCount / total) * 100) : 0;

  // Темы из поля category
  const topics = useMemo(() => {
    const map = new Map<
      string,
      { name: string; total: number; learned: number; url?: string }
    >();

    for (const w of all) {
      const name = w.category?.trim() || OTHER;

      const t = map.get(name) ?? {
        name,
        total: 0,
        learned: 0,
        url: undefined,
      };

      t.total += 1;

      if (learnedSet.has(String(w.id))) {
        t.learned += 1;
      }

      if (!t.url && w.url) {
        t.url = w.url;
      }

      map.set(name, t);
    }

    return [...map.values()].sort((a, b) => b.total - a.total);
  }, [all, learnedSet]);

  // Шапка открытого раздела
  const banner = useMemo(() => {
    if (!section) return null;

    if (section.kind === "category") {
      const idx = topics.findIndex((t) => t.name === section.name);
      const t = topics[idx];
      const c = PALETTE[Math.max(idx, 0) % PALETTE.length];

      return {
        title: section.name,
        learned: t?.learned ?? 0,
        total: t?.total ?? 0,
        url: t?.url,
        Icon: BookOpen,
        bg: c.bg,
        fg: c.fg,
      };
    }

    return {
      title: section.kind === "learned" ? "Выученные слова" : "Все слова",
      learned: learnedCount,
      total,
      url: undefined as string | undefined,
      Icon: section.kind === "learned" ? CheckCircle2 : BookOpen,
      bg: "#158F66",
      fg: "#FFFFFF",
    };
  }, [section, topics, learnedCount, total]);

  // Все слова открытой категории
  const catWords = useMemo(() => {
    if (section?.kind !== "category") return [];

    return all.filter(
      (w) => (w.category?.trim() || OTHER) === section.name
    );
  }, [all, section]);

  // Подразделы внутри категории
  const subCards = useMemo(() => {
    if (section?.kind !== "category") return [];

    const map = new Map<
      string,
      {
        key: string | null;
        name: string;
        total: number;
        learned: number;
        url?: string;
      }
    >();

    for (const w of catWords) {
      const key = posKey(w);

      const g = map.get(key) ?? {
        key,
        name: posLabel(key),
        total: 0,
        learned: 0,
        url: undefined as string | undefined,
      };

      g.total += 1;

      if (learnedSet.has(String(w.id))) {
        g.learned += 1;
      }

      if (!g.url && w.url) {
        g.url = w.url;
      }

      map.set(key, g);
    }

    if (map.size < 2) return [];

    const groups = [...map.values()].sort(
      (a, b) => b.total - a.total
    );

    return [
      {
        key: null as string | null,
        name: "Все слова",
        total: catWords.length,
        learned: catWords.filter((w) =>
          learnedSet.has(String(w.id))
        ).length,
        url: catWords.find((w) => w.url)?.url,
      },
      ...groups,
    ];
  }, [section, catWords, learnedSet]);

  // Слова открытого раздела
  const base = useMemo(() => {
    if (!section || section.kind === "all") return all;

    if (section.kind === "learned") {
      return all.filter((w) => learnedSet.has(String(w.id)));
    }

    if (!sub) return catWords;

    return catWords.filter((w) => posKey(w) === sub);
  }, [all, section, learnedSet, catWords, sub]);

  // Поиск
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    if (!q) return base;

    return base.filter((w) =>
      [
        w.word,
        w.sam_dialect,
        w.translation,
        w.transcription,
        w.translations?.ru,
        w.translations?.en,
        w.translations?.fa,
        w.translations?.uz,
      ].some((v) => v?.toLowerCase().includes(q))
    );
  }, [base, query]);

  const sectionKey = section
    ? section.kind === "category"
      ? `c:${section.name}`
      : section.kind
    : "home";

  useEffect(() => {
    setVisible(PAGE);
  }, [sectionKey, query, sub]);

  const searching = query.trim().length > 0;
  const showList = section !== null || searching;
  const shown = filtered.slice(0, visible);

  // Открытие раздела
  const open = (next: Section | null) => {
    setSection(next);
    setSub(null);
    setQuery("");

    topRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Озвучивание слова
  const speak = (word: string) => {
    if (
      typeof window === "undefined" ||
      !("speechSynthesis" in window)
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);

    const speechLanguages: Record<string, string> = {
      tajik: "tg-TJ",
      farsi: "fa-IR",
      russian: "ru-RU",
    };

    utterance.lang = speechLanguages[language ?? "tajik"] ?? "tg-TJ";

    window.speechSynthesis.speak(utterance);
  };

  return (
<main className="mx-auto max-w-6xl space-y-5 pb-[calc(7rem+env(safe-area-inset-bottom))] text-[#0B3D2E] sm:space-y-6 min-[900px]:pb-5">      <div ref={topRef} className="scroll-mt-24" />
{!section && (
  <header className="flex items-end justify-between gap-3">
    <div>
      <h1 className="text-[34px] font-black leading-none tracking-[-0.04em] text-[#0B3D2E] sm:text-[46px]">
        <span className="inline-block -rotate-2 rounded-2xl bg-[#D9F36B] px-3 pb-1 pt-0.5 shadow-[4px_4px_0_#0B3D2E] sm:px-4 sm:shadow-[5px_5px_0_#0B3D2E]">
          Словарь
        </span>
        <span className="text-[#158F66]">.</span>
      </h1>

      <p className="mt-3 text-sm font-semibold text-[#0B3D2E]/55">
        Слова, темы и твой прогресс
      </p>
    </div>


  </header>
)}
      {/* ПОИСК */}
      <div className="relative">
        <Search
          size={20}
          className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-[#0B3D2E]/45"
        />

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            section
              ? "Поиск в этом разделе…"
              : "Поиск слова или перевода…"
          }
          aria-label="Поиск по словарю"
          className="h-14 w-full rounded-full border-2 border-[#E3EBE5] bg-white pl-14 pr-12 text-sm font-bold outline-none transition placeholder:font-medium placeholder:text-[#0B3D2E]/35 focus:border-[#158F66] focus:ring-4 focus:ring-[#158F66]/15"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Очистить поиск"
            className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full bg-[#EAF6F0] text-[#158F66] transition hover:bg-[#D9F36B] hover:text-[#0B3D2E]"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* ОТКРЫТЫЙ РАЗДЕЛ */}
      {section && banner && !loading && !error && (
        <>
          <button
            type="button"
            onClick={() => open(null)}
            className="inline-flex h-10 items-center gap-2 rounded-full border-2 border-[#0B3D2E]/10 bg-white px-4 text-sm font-bold shadow-[0_3px_0_rgba(11,61,46,0.1)] transition hover:-translate-y-0.5 hover:bg-[#EAF6F0] active:translate-y-0 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#2EB67D]"
          >
            <ArrowLeft size={16} />
            Все темы
          </button>

          <section
            className="relative overflow-hidden rounded-[28px] border-2 border-[#0B3D2E] p-4 shadow-[0_8px_0_#0B3D2E] sm:p-5"
            style={{
              backgroundColor: banner.bg,
              color: banner.fg,
              backgroundImage: `radial-gradient(${banner.fg}33 1.5px, transparent 1.5px)`,
              backgroundSize: "24px 24px",
            }}
          >
            <div className="relative flex items-center gap-4">
              <div
                className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl sm:h-20 sm:w-20"
                style={{
                  backgroundColor: `${banner.fg}26`,
                }}
              >
                {banner.url ? (
                  <img
                    src={banner.url}
                    alt=""
                    className="h-full w-full object-contain p-2"
                  />
                ) : (
                  <banner.Icon size={30} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h1 className="truncate text-lg font-black tracking-[-0.02em] sm:text-2xl">
                  {banner.title}
                </h1>

                <div className="mt-3 flex items-center gap-3">
                  <div
                    className="h-2 flex-1 overflow-hidden rounded-full"
                    style={{
                      backgroundColor: `${banner.fg}33`,
                    }}
                  >
                    <div
                      className="h-full rounded-full transition-[width] duration-700 motion-reduce:transition-none"
                      style={{
                        width: `${
                          banner.total
                            ? (banner.learned / banner.total) * 100
                            : 0
                        }%`,
                        backgroundColor: banner.fg,
                      }}
                    />
                  </div>

                  <span className="text-xs font-black sm:text-sm">
                    {banner.learned}/{banner.total}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ПОДРАЗДЕЛЫ КАТЕГОРИИ */}
          {subCards.length > 0 && (
            <section
              aria-label="Разделы категории"
              className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5"
            >
              {subCards.map((c) => {
                const active = sub === c.key;
                const pct = c.total
                  ? (c.learned / c.total) * 100
                  : 0;

                return (
                  <button
                    key={c.key ?? "all"}
                    type="button"
                    onClick={() => setSub(c.key)}
                    aria-pressed={active}
                    className={`group relative h-[104px] overflow-hidden rounded-3xl border-2 p-3.5 text-left transition duration-300 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#2EB67D] motion-reduce:transition-none sm:h-[112px] ${
                      active
                        ? "border-[#0B3D2E] bg-[#158F66] text-white shadow-[0_6px_0_#0B3D2E]"
                        : "border-[#E3EBE5] bg-white shadow-[0_5px_0_rgba(11,61,46,0.1)] hover:-translate-y-0.5 hover:border-[#9FCDB7]"
                    }`}
                  >
                    <span className="block max-w-[78%] truncate text-sm font-black">
                      {c.name}
                    </span>

                    <span
                      className={`mt-0.5 block text-[11px] font-bold ${
                        active
                          ? "text-white/80"
                          : "text-[#0B3D2E]/55"
                      }`}
                    >
                      {wordsLabel(c.total)}
                    </span>

                    <span
                      className={`mt-2.5 block h-1.5 overflow-hidden rounded-full ${
                        active ? "bg-white/25" : "bg-[#E3EBE5]"
                      }`}
                    >
                      <span
                        className={`block h-full rounded-full ${
                          active ? "bg-[#D9F36B]" : "bg-[#158F66]"
                        }`}
                        style={{
                          width: `${pct}%`,
                        }}
                      />
                    </span>

                    {c.url ? (
                      <img
                        src={c.url}
                        alt=""
                        loading="lazy"
                        className="pointer-events-none absolute -bottom-2 -right-1 h-12 w-12 object-contain transition duration-300 group-hover:scale-110 sm:h-14 sm:w-14"
                      />
                    ) : (
                      <span
                        aria-hidden
                        className={`pointer-events-none absolute -bottom-3 right-2 select-none text-[48px] font-black leading-none ${
                          active
                            ? "text-white/25"
                            : "text-[#158F66]/20"
                        }`}
                      >
                        {c.name.charAt(0)}
                      </span>
                    )}
                  </button>
                );
              })}
            </section>
          )}
        </>
      )}

      {/* ГЛАВНАЯ: ПРОГРЕСС И ТЕМЫ */}
      {!showList && !loading && !error && (
        <>
          {/* ПРОГРЕСС */}
          <section
            className="relative overflow-hidden rounded-[28px] border-2 border-[#0B3D2E] bg-[#158F66] p-5 text-white shadow-[0_8px_0_#0B3D2E] sm:p-7"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,.22) 1.5px, transparent 1.5px)",
              backgroundSize: "24px 24px",
            }}
          >
            <div className="relative flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-black uppercase tracking-wider">
                  <span className="h-2 w-2 rounded-full bg-[#D9F36B]" />
                  Выучено слов
                </p>

                <p className="mt-3 text-[length:clamp(26px,5vw,44px)] font-black leading-none tracking-[-0.03em]">
                  {learnedCount.toLocaleString("ru-RU")}{" "}
                  <span className="text-white/70">из</span>{" "}
                  {total.toLocaleString("ru-RU")}
                </p>
              </div>

              <div
                className="relative grid h-24 w-24 shrink-0 place-items-center sm:h-28 sm:w-28"
                role="img"
                aria-label={`Прогресс ${percent}%`}
              >
                <svg
                  viewBox="0 0 100 100"
                  className="h-full w-full -rotate-90"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="rgba(255,255,255,.25)"
                    strokeWidth="9"
                  />

                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#D9F36B"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 42}
                    strokeDashoffset={
                      2 * Math.PI * 42 * (1 - percent / 100)
                    }
                    className="transition-[stroke-dashoffset] duration-700 motion-reduce:transition-none"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <BookOpen size={18} />
                  <span className="mt-0.5 text-lg font-black">
                    {percent}%
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* ТЕМЫ СЛОВАРЯ */}
          {topics.length > 0 && (
            <section aria-label="Темы словаря">
              <h2 className="mb-3 text-base font-black sm:text-lg">
                Темы словаря
              </h2>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                {topics.map((t, i) => {
                  const c = PALETTE[i % PALETTE.length];

                  const pct = t.total
                    ? (t.learned / t.total) * 100
                    : 0;

                  return (
                    <button
                      key={t.name}
                      type="button"
                      onClick={() =>
                        open({
                          kind: "category",
                          name: t.name,
                        })
                      }
                      style={{
                        backgroundColor: c.bg,
                        color: c.fg,
                      }}
                      className="group relative h-[112px] overflow-hidden rounded-3xl border-2 border-[#0B3D2E] p-3.5 text-left shadow-[0_5px_0_#0B3D2E] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_7px_0_#0B3D2E] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#2EB67D] motion-reduce:transition-none sm:h-[124px] sm:p-4"
                    >
                      <span className="block max-w-[78%] truncate text-sm font-black">
                        {t.name}
                      </span>

                      <span className="mt-0.5 block text-[11px] font-bold opacity-80">
                        {wordsLabel(t.total)}
                      </span>

                      <span className="mt-2 flex items-center gap-2">
                        <span
                          className="h-1.5 flex-1 overflow-hidden rounded-full"
                          style={{
                            backgroundColor: `${c.fg}33`,
                          }}
                        >
                          <span
                            className="block h-full rounded-full"
                            style={{
                              width: `${pct}%`,
                              backgroundColor: c.fg,
                            }}
                          />
                        </span>

                        <span className="text-[11px] font-black opacity-90">
                          {t.learned}/{t.total}
                        </span>
                      </span>

                      {t.url ? (
                        <img
                          src={t.url}
                          alt=""
                          loading="lazy"
                          className="pointer-events-none absolute -bottom-2 -right-1 h-14 w-14 object-contain transition duration-300 group-hover:scale-110 sm:h-16 sm:w-16"
                        />
                      ) : (
                        <span
                          aria-hidden
                          className="pointer-events-none absolute -bottom-3 right-2 select-none text-[56px] font-black leading-none opacity-25"
                        >
                          {t.name.charAt(0)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}

      {/* СПИСОК СЛОВ */}
      <div className="space-y-4">
        {loading && (
          <div className="space-y-3" aria-busy="true">
            {Array.from({ length: 5 }, (_, i) => (
              <div
                key={i}
                className="h-[84px] animate-pulse rounded-3xl bg-[#E3EBE5]/70 motion-reduce:animate-none"
              />
            ))}

            <p className="py-2 text-center text-sm font-bold text-[#0B3D2E]/45">
              Загружаем слова…
            </p>
          </div>
        )}

        {error && !loading && (
          <div
            role="alert"
            className="rounded-3xl border-2 border-rose-200 bg-rose-50 p-6 text-center"
          >
            <p className="font-black text-rose-700">
              Не удалось загрузить слова
            </p>

            <p className="mt-2 text-sm font-medium text-rose-600">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-rose-700 shadow-[0_3px_0_rgba(190,18,60,0.25)] transition active:translate-y-[2px]"
            >
              <RefreshCw size={15} />
              Обновить страницу
            </button>
          </div>
        )}

        {!loading && !error && showList && (
          <>
            <p className="text-sm font-bold text-[#0B3D2E]/50">
              {section ? "Слов в списке" : "Результаты поиска"}:{" "}
              {filtered.length.toLocaleString("ru-RU")}
            </p>

            <ul className="space-y-3">
              {shown.map((w) => {
                const id = String(w.id);
                const isLearned = learnedSet.has(id);

                return (
                  <li
                    key={id}
                    className="flex flex-col gap-3 rounded-3xl border-2 border-[#E3EBE5] bg-white p-3 shadow-[0_5px_0_rgba(11,61,46,0.08)] transition hover:border-[#9FCDB7] sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4"
                  >
                    <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                      <div className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#EAF6F0] sm:h-16 sm:w-16">
                        {w.url ? (
                          <img
                            src={w.url}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-contain p-1.5"
                          />
                        ) : (
                          <span className="text-2xl font-black text-[#158F66]/50">
                            {w.word.charAt(0)}
                          </span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black leading-tight">
                            {w.word}
                          </h3>

                          {w.level && (
                            <span className="rounded-full bg-[#D9F36B] px-2 py-0.5 text-[11px] font-black text-[#0B3D2E]">
                              {w.level}
                            </span>
                          )}

                          {isLearned && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#EAF6F0] px-2 py-0.5 text-[11px] font-black text-[#158F66]">
                              <CheckCircle2 size={12} />
                              Выучено
                            </span>
                          )}
                        </div>

                        {w.transcription && (
                          <p className="mt-0.5 text-xs font-semibold text-[#0B3D2E]/45">
                            [{w.transcription}]
                          </p>
                        )}

                        {w.example && (
                          <p className="mt-1.5 text-xs font-medium text-[#0B3D2E]/65">
                            {w.example}
                          </p>
                        )}

                        {w.exampleTranslation && (
                          <p className="text-xs text-[#0B3D2E]/40">
                            {w.exampleTranslation}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
                      <div className="min-w-0 text-left sm:text-right">
                        <p className="font-black text-[#158F66]">
                          {w.translation || w.translations?.ru || "—"}
                        </p>

                        {w.translations?.en && (
                          <p className="mt-0.5 text-xs font-medium text-[#0B3D2E]/45">
                            {w.translations.en}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => speak(w.word)}
                        aria-label={`Произнести ${w.word}`}
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#158F66] text-white shadow-[0_3px_0_#0B3D2E] transition hover:brightness-110 active:translate-y-[2px] active:shadow-[0_1px_0_#0B3D2E] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#2EB67D]"
                      >
                        <Volume2 size={18} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>

            {filtered.length === 0 && (
              <div className="rounded-3xl border-2 border-dashed border-[#158F66]/30 py-12 text-center">
                <p className="font-black text-[#158F66]">
                  {section?.kind === "learned" && !searching
                    ? "Пока нет выученных слов"
                    : "Слова не найдены"}
                </p>

                <p className="mt-1 text-sm font-medium text-[#0B3D2E]/50">
                  {section?.kind === "learned" && !searching
                    ? "Учи слова на уроках — они появятся здесь."
                    : "Попробуй другой запрос."}
                </p>
              </div>
            )}

            {filtered.length > visible && (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + PAGE)}
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[#158F66] px-8 text-sm font-extrabold text-white shadow-[0_6px_0_#0B3D2E] transition hover:translate-y-[2px] hover:shadow-[0_4px_0_#0B3D2E] active:translate-y-[4px] active:shadow-[0_2px_0_#0B3D2E] focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#2EB67D]"
                >
                  Показать ещё (
                  {Math.min(PAGE, filtered.length - visible)})
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

export default DictionarySection;