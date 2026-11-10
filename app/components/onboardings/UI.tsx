import type { ReactNode } from "react";

/* ───────────── Shared UI ───────────── */

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#11704C] sm:text-[11px] lg:gap-2.5 lg:text-xs lg:tracking-[0.2em]">
      <i className="block h-1.5 w-1.5 rounded-full bg-[#2EB67D]" />
      {children}
    </span>
  );
}

export function CheckMark({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={`h-3 w-3 transition duration-200 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 ${active ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
    >
      <path d="M3.5 8.5l3 3 6-7" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ───────────── Icons ───────────── */
export function GoogleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.77.9 7.35 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

/* Логотип Яндекса: красный круг и белая «Я» */
export function YandexLogo() {
  return (
    <svg width="22" height="22" viewBox="0 0 44 44" aria-hidden="true">
      <circle cx="22" cy="22" r="22" fill="#FC3F1D" />
      <rect x="24.4" y="10" width="3.6" height="24" fill="#fff" />
      <path
        d="M24.4 11.8h-2.5c-3.1 0-4.9 1.6-4.9 4.2s1.5 4.1 4.9 4.1h2.5"
        fill="none"
        stroke="#fff"
        strokeWidth="3.4"
      />
      <path d="M22.3 20.2 17 33.8" fill="none" stroke="#fff" strokeWidth="3.6" />
    </svg>
  );
}
const LEVEL_PATHS: Record<string, ReactNode> = {
  beginner: (
    <>
      <path d="M12 21V11" />
      <path d="M12 15C5 15 4 10 4 7c5 0 8 2 8 8Z" />
      <path d="M12 12c0-5 3-8 8-8 0 5-2 8-8 8Z" />
      <path d="M5 21h14" />
    </>
  ),
  alphabet: (
    <>
      <path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v17H7.5A2.5 2.5 0 0 0 5 21.5Z" />
      <path d="M5 4.5v17" />
      <path d="M9 7h7" />
      <path d="m10 14 2-5 2 5" />
      <path d="M10.8 12h2.4" />
    </>
  ),
  understand: (
    <>
      <path d="M3 12a9 9 0 0 1 18 0" />
      <rect x="2.5" y="11" width="4" height="7" rx="2" />
      <rect x="17.5" y="11" width="4" height="7" rx="2" />
      <path d="M18 19c-.7 1.5-2 2-4 2h-2" />
      <path d="M10 21h2" />
    </>
  ),
  speaking: (
    <>
      <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H8l-4 2v-5.5A7.5 7.5 0 1 1 20 11.5Z" />
      <path d="M8 11h.01" strokeWidth="2.5" />
      <path d="M12 11h.01" strokeWidth="2.5" />
      <path d="M16 11h.01" strokeWidth="2.5" />
    </>
  ),
  fluent: (
    <>
      <path d="m12 2 2.9 6 6.6.9-4.8 4.7 1.1 6.6-5.8-3.1-5.8 3.1 1.1-6.6-4.8-4.7 6.6-.9Z" />
      <path d="m9.5 11.5 1.7 1.7 3.5-3.5" />
    </>
  ),
};

function StrokeSvg({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function LevelIcon({ id, color }: { id: string; color: string }) {
  return (
    <span style={{ color }} className="inline-flex">
      <StrokeSvg className="h-6 w-6 shrink-0 sm:h-7 sm:w-7">
        {LEVEL_PATHS[id] ?? LEVEL_PATHS.beginner}
      </StrokeSvg>
    </span>
  );
}

export const ArrowRightIcon = ({ className }: { className?: string }) => (
  <StrokeSvg className={className}>
    <path d="M5 12h14" />
    <path d="m13 6 6 6-6 6" />
  </StrokeSvg>
);

export const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <StrokeSvg className={className}>
    <path d="M19 12H5" />
    <path d="m11 6-6 6 6 6" />
  </StrokeSvg>
);

const brand = "h-5 w-5 shrink-0 sm:h-6 sm:w-6";

export const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className={brand} aria-hidden="true">
    <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.87h5.38a4.6 4.6 0 0 1-2 3.02v2.52h3.24c1.9-1.75 2.98-4.33 2.98-7.36Z" />
    <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.62-2.41l-3.24-2.52c-.9.6-2.05.96-3.38.96-2.6 0-4.8-1.76-5.58-4.12H3.08v2.6A10 10 0 0 0 12 22Z" />
    <path fill="#FBBC05" d="M6.42 13.91A6 6 0 0 1 6.1 12c0-.66.11-1.3.32-1.91V7.49H3.08A10 10 0 0 0 2 12c0 1.62.39 3.15 1.08 4.51l3.34-2.6Z" />
    <path fill="#EA4335" d="M12 5.97c1.47 0 2.79.51 3.82 1.52l2.87-2.87C16.96 2.98 14.7 2 12 2a10 10 0 0 0-8.92 5.49l3.34 2.6C7.2 7.73 9.4 5.97 12 5.97Z" />
  </svg>
);

export const YandexIcon = () => (
  <svg viewBox="0 0 24 24" className={brand} aria-hidden="true">
    <path
      fill="#FC3F1D"
      d="M13.4 2h-2.1C7.7 2 5.8 4.1 5.8 7.2c0 2.4 1.1 4.2 3.2 5.7L5 22h3.3l4.3-9.8h1.5V22h3V2h-3.7Zm.7 7.7h-1.3c-2.4 0-3.8-.9-3.8-3 0-2 1.2-3.1 3.5-3.1h1.6v6.1Z"
    />
  </svg>
);

export const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className={brand} aria-hidden="true">
    <path
      fill="#1877F2"
      d="M24 12a12 12 0 1 0-13.88 11.86v-8.4H7.08V12h3.04V9.36c0-3 1.79-4.66 4.52-4.66 1.31 0 2.68.23 2.68.23v2.95h-1.51c-1.49 0-1.95.92-1.95 1.87V12h3.32l-.53 3.46h-2.79v8.4A12 12 0 0 0 24 12Z"
    />
  </svg>
);