
import {
  TajikFlag,
  IranFlag,
  UKFlag,
  RussianFlag,
  UzbekFlag,
  ItalianFlag,
} from "./Flags";

/* ═══════════════════════════════════════════
   ZABU — CENTRAL FONT SYSTEM
   Unbounded + Manrope + Inter
═══════════════════════════════════════════ */

// UNBOUNDED — headings and display elements
export const DISPLAY = "font-heading";
export const UNBOUNDED = "font-heading";

// MANROPE — main interface and readable text
export const SANS = "font-body";
export const MANROPE = "font-body";

// INTER — technical text and phonetics
export const TECH = "font-technical";
export const INTER = "font-technical";

// Compatibility with previous components
export const BEBAS = DISPLAY;
export const NEWS = SANS;
export const NOTO = SANS;
export const FA = SANS;
export const ZH = SANS;

// Compatibility with components using fontVariables
export const fontVariables = SANS;

/* ═══════════════════════════════════════════
   TEXT STYLE PRESETS
═══════════════════════════════════════════ */

// MANROPE
export const BODY = `${SANS} font-normal`;
export const BODY_MEDIUM = `${SANS} font-medium`;
export const BODY_SEMIBOLD = `${SANS} font-semibold`;
export const BODY_BOLD = `${SANS} font-bold`;

// INTER
export const TECH_TEXT = `${TECH} font-normal tabular-nums`;
export const IPA_TEXT = `${TECH} font-normal tracking-wide`;
export const NUMBER_TEXT = `${TECH} font-normal tabular-nums`;

// UNBOUNDED
export const DISPLAY_TEXT = `${DISPLAY} font-normal`;
export const LEVEL_TEXT = `${DISPLAY} font-normal tracking-tight`;

/* ═══════════════════════════════════════════
   ONBOARDING STEPS
═══════════════════════════════════════════ */

export type Step = 1 | 2 | 3 | 4 | 5 | 6;

export const TOTAL_STEPS = 6;

export const STORAGE_KEY = "zabu:onboarding";

/* ═══════════════════════════════════════════
   GENERAL TYPOGRAPHY
═══════════════════════════════════════════ */

// Main headings — UNBOUNDED
export const h1Class =
  `${DISPLAY} font-heading mx-auto mt-3 max-w-[900px] text-[26px] leading-[1.2] tracking-[-0.035em] sm:mt-4 sm:text-[44px] sm:leading-[1.12] lg:mt-[22px] lg:text-[64px]`;

// Subheadings — MANROPE
export const subClass =
  `${SANS} mx-auto mt-2 max-w-[320px] text-[13px] font-normal leading-relaxed text-[#55625A] sm:mt-3 sm:max-w-none sm:text-base lg:mt-[18px] lg:text-[19px]`;

// Primary button — MANROPE
export const primaryBtn =
  `group/btn ${SANS} inline-flex h-11 items-center gap-2.5 rounded-full bg-[#16865B] px-7 text-[15px] font-semibold text-white shadow-[0_14px_28px_-12px_rgba(22,134,91,0.65)] transition hover:-translate-y-0.5 hover:bg-[#11704C] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#2EB67D] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0 disabled:hover:bg-[#16865B] sm:h-[52px] sm:px-9 sm:text-base lg:h-[58px] lg:gap-3 lg:px-10 lg:text-[17px]`;

// Secondary button — MANROPE
export const secondaryBtn =
  `group/back ${SANS} inline-flex h-11 items-center gap-2.5 rounded-full border border-[#D9D7CB] bg-white px-5 text-[15px] font-semibold text-[#14231C] transition hover:-translate-y-0.5 hover:border-[#16865B] hover:text-[#11704C] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#2EB67D] sm:h-[52px] sm:px-7 sm:text-base lg:h-[58px] lg:gap-3 lg:px-8 lg:text-[17px]`;

export const ghost =
  `${DISPLAY} pointer-events-none absolute select-none whitespace-nowrap leading-none text-[#16865B]`;

export const levelClass =
  `${DISPLAY} text-sm font-normal tracking-tight`;

export const textClass =
  `${SANS} text-sm font-normal leading-relaxed`;

export const labelClass =
  `${SANS} text-xs font-semibold tracking-wide`;

export const captionClass =
  `${SANS} text-xs font-medium leading-relaxed text-[#718078]`;

export const numberClass =
  `${TECH} font-normal tabular-nums`;

export const ipaClass =
  `${TECH} font-normal tracking-wide`;

/* ═══════════════════════════════════════════
   LANGUAGES
═══════════════════════════════════════════ */

/**
 * Central source of language data for ZABU.
 *
 * Learning languages:
 * - Tajik
 * - Persian
 * - English
 *
 * Interface / explanation languages:
 * - Russian
 * - English
 * - Tajik
 * - Uzbek
 * - Italian
 * - Persian
 */

export const LANGUAGES = [
  {
    id: "tajik",
    english: "Таджикский",
    native: "Тоҷикӣ",
    lang: "tg",
    dir: "ltr",
    script: "Кириллица",
    scriptShort: "Кириллица",
    scriptClass: SANS,
    nativeClass: `${SANS} font-semibold leading-[1.15]`,
    Flag: TajikFlag,
    font: `${SANS} font-medium`,
    tint: "#F3ECDD",
    glyph: "Ӯ",
    glyphFont: DISPLAY,
    glyphColor: "#B89B62",
  },
  {
    id: "persian",
    english: "Персидский",
    native: "فارسی",
    lang: "fa",
    dir: "rtl",
    script: "Арабская графика",
    scriptShort: "Араб. графика",
    scriptClass: SANS,
    nativeClass: `${FA} font-medium leading-[1.5]`,
    Flag: IranFlag,
    font: `${FA} font-medium`,
    tint: "#E6EFE8",
    glyph: "ف",
    glyphFont: FA,
    glyphColor: "#6E9A7A",
  },
  {
    id: "english",
    english: "Английский",
    native: "English",
    lang: "en",
    dir: "ltr",
    script: "Латиница",
    scriptShort: "Латиница",
    scriptClass: SANS,
    nativeClass: `${SANS} font-semibold leading-[1.15]`,
    Flag: UKFlag,
    font: `${SANS} font-semibold`,
    tint: "#ECEEF2",
    glyph: "Aa",
    glyphFont: DISPLAY,
    glyphColor: "#8A94A8",
  },
  {
    id: "russian",
    english: "Русский",
    native: "Русский",
    lang: "ru",
    dir: "ltr",
    script: "Кириллица",
    scriptShort: "Кириллица",
    scriptClass: SANS,
    nativeClass: `${SANS} font-semibold leading-[1.15]`,
    Flag: RussianFlag,
    font: `${SANS} font-medium`,
    tint: "#E9EDF6",
    glyph: "Я",
    glyphFont: DISPLAY,
    glyphColor: "#7E91BC",
  },
  {
    id: "uzbek",
    english: "Узбекский",
    native: "O‘zbekcha",
    lang: "uz",
    dir: "ltr",
    script: "Латиница",
    scriptShort: "Латиница",
    scriptClass: SANS,
    nativeClass: `${SANS} font-semibold leading-[1.15]`,
    Flag: UzbekFlag,
    font: `${SANS} font-medium`,
    tint: "#E3F0F4",
    glyph: "Oʻ",
    glyphFont: DISPLAY,
    glyphColor: "#5FA3B8",
  },
  {
    id: "italian",
    english: "Итальянский",
    native: "Italiano",
    lang: "it",
    dir: "ltr",
    script: "Латиница",
    scriptShort: "Латиница",
    scriptClass: SANS,
    nativeClass: `${SANS} font-semibold leading-[1.15]`,
    Flag: ItalianFlag,
    font: `${SANS} font-medium`,
    tint: "#F2EDE8",
    glyph: "Aa",
    glyphFont: DISPLAY,
    glyphColor: "#CE2B37",
  },
] as const;

export type LangId = (typeof LANGUAGES)[number]["id"];

/* ═══════════════════════════════════════════
   LEARNING LANGUAGES
═══════════════════════════════════════════ */

export const LEARNING_IDS = [
  "tajik",
  "persian",
  "english",
] as const;

export type LearningId = (typeof LEARNING_IDS)[number];

export const LEARNING_LANGUAGES = LEARNING_IDS.flatMap((id) => {
  const language = LANGUAGES.find((item) => item.id === id);
  return language ? [language] : [];
});

/* ═══════════════════════════════════════════
   NATIVE / INTERFACE LANGUAGES
═══════════════════════════════════════════ */

export const NATIVE_BY_LEARNING: Record<
  LearningId,
  readonly LangId[]
> = {
  tajik: ["russian", "english", "uzbek", "italian", "persian"],
  persian: ["russian", "english", "tajik", "uzbek", "italian"],
  english: ["russian", "tajik", "uzbek", "italian", "persian"],
};

/**
 * Returns available interface / explanation languages.
 * Excludes the selected learning language.
 */

export function getNativeOptions(learning: string) {
  const ids = NATIVE_BY_LEARNING[learning as LearningId] ?? [];

  return ids.flatMap((id) => {
    const language = LANGUAGES.find((item) => item.id === id);

    return language && language.id !== learning
      ? [language]
      : [];
  });
}

/* ═══════════════════════════════════════════
   ZABU LOGOS
═══════════════════════════════════════════ */

export const LOGOS: Record<string, string> = {
  tajik: "/logo-tj.webp",
  persian: "/logo-ir.webp",
  english: "/logo-en.webp",
};

/* ═══════════════════════════════════════════
   LANGUAGE HELPERS
═══════════════════════════════════════════ */

export function getLanguage(
  id: string | null | undefined
) {
  return LANGUAGES.find((language) => language.id === id);
}

/* ═══════════════════════════════════════════
   GOALS
═══════════════════════════════════════════ */

export type GoalId =
  | "beginner"
  | "alphabet"
  | "understand"
  | "speaking"
  | "fluent";

export const GOALS: {
  id: GoalId;
  title: string;
  tint: string;
  color: string;
}[] = [
  {
    id: "beginner",
    title: "Новичок",
    tint: "#EAF5EF",
    color: "#16865B",
  },
  {
    id: "alphabet",
    title: "Знаю алфавит",
    tint: "#F0F1FA",
    color: "#6865B5",
  },
  {
    id: "understand",
    title: "Понимаю речь",
    tint: "#FFF4E8",
    color: "#D58A36",
  },
  {
    id: "speaking",
    title: "Могу говорить",
    tint: "#EAF3FA",
    color: "#4386B5",
  },
  {
    id: "fluent",
    title: "Говорю бегло",
    tint: "#F5EDF8",
    color: "#9863A8",
  },
];

export function getGoal(id: string | null | undefined) {
  return GOALS.find((goal) => goal.id === id) ?? null;
}

/* ═══════════════════════════════════════════
   WELCOME MESSAGES
═══════════════════════════════════════════ */

export const WELCOME: Record<
  LearningId,
  {
    text: string;
    lang: string;
    dir: "ltr" | "rtl";
    className: string;
  }
> = {
  tajik: {
    text: "Хуш омадед!",
    lang: "tg",
    dir: "ltr",
    className: `${SANS} font-bold`,
  },
  persian: {
    text: "خوش آمدید",
    lang: "fa",
    dir: "rtl",
    className: `${FA} font-medium`,
  },
  english: {
    text: "Welcome!",
    lang: "en",
    dir: "ltr",
    className: `${DISPLAY} font-normal`,
  },
};

/* ═══════════════════════════════════════════
   STEP COMPLETE
═══════════════════════════════════════════ */

export const completeTitleClass =
  `${DISPLAY} text-[30px] font-normal leading-[1.15] tracking-[-0.035em] min-[375px]:text-[34px] sm:text-[42px] lg:text-[52px] xl:text-[60px]`;

export const completeDescriptionClass =
  `${SANS} mt-3 max-w-[460px] text-xs font-normal leading-relaxed text-[#718078] min-[375px]:text-sm sm:mt-4 sm:text-base lg:text-lg`;

export const completeLabelClass =
  `${SANS} mb-3 text-xs font-semibold text-[#35483C] sm:mb-4 sm:text-sm`;

export const legalTextClass =
  `${SANS} mt-3 border-t border-[#DCE9E1] pt-3 text-[10px] leading-[1.8] text-[#8A9990] min-[375px]:text-[11px] sm:pt-4 sm:text-[13px]`;

export const legalLinkClass =
  `${SANS} font-medium text-[#4E8065] underline decoration-[#B7D3C3] underline-offset-4 hover:text-[#16865B]`;

export const backButtonClass =
  `${SANS} zabu-btn inline-flex h-11 items-center gap-2 rounded-xl border border-[#DCE6DF] bg-white px-5 text-sm font-semibold text-[#2C3C33] shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#16865B] active:scale-[0.98] max-sm:w-full max-sm:justify-center`;

export const completeLogoClass =
  `${DISPLAY} flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#16865B] text-xl font-normal text-white lg:hidden`;

/* ═══════════════════════════════════════════
   LANGUAGE NAMES
═══════════════════════════════════════════ */
const TONGUE: Record<string, string> = {
  tajik: "Tajik",
  persian: "Persian",
  english: "English",
  russian: "Russian",
  uzbek: "Uzbek",
  italian: "Italian",
};

export type ZabuUser = {
  id: string;
  namefull: string;
  email: string;
  status: string;
  targetTongue: string | null;
  nativeTongue: string | null;
  hw: number;
  lvl: string | null;
  wordsLearned: number;
  Scores: number;
  lessonsComleted: number;
  script: "latin" | "cyrillic" | "arabic" | null;
  password: string;
  coins: number;
  wordsSaved: number;
};

type SessionUser = {
  id?: string | null;
  name?: string | null;
  email?: string | null;
} | null;

export function buildUser(
  learning?: string | null,
  native?: string | null,
  goal?: string | null,
  sessionUser?: SessionUser,
  script?: "cyrillic" | "latin" | "arabic" | null,
  password?: string
): ZabuUser {
  return {
id: sessionUser?.id ?? "",
    namefull: sessionUser?.name ?? "",
    email: sessionUser?.email ?? "",
    status: "student",

    targetTongue: TONGUE[learning ?? ""] ?? null,
    nativeTongue: TONGUE[native ?? ""] ?? null,

    hw: 0,
    lvl: getGoal(goal)?.title ?? null,

    wordsLearned: 0,
    Scores: 0,
    lessonsComleted: 0,

    script: script ?? null,
    password: password ?? "",
    coins: 0,

    wordsSaved: 0,
  };
}