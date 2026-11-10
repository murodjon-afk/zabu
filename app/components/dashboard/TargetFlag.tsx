import type { ComponentType } from 'react';
import { RuFlag, TjFlag, UzFlag, IrFlag, ItFlag } from '../onboardings/Flags';

type FlagComp = ComponentType<{ className?: string }>;

const FLAG_BY_TONGUE: Record<string, FlagComp> = {
  russian: RuFlag, ru: RuFlag,
  tajik: TjFlag, tj: TjFlag,
  uzbek: UzFlag, uz: UzFlag,
  persian: IrFlag, farsi: IrFlag, iran: IrFlag, ir: IrFlag, fa: IrFlag,
  italian: ItFlag, it: ItFlag,
};

interface Props {
  tongue?: string | null;
  fallback?: string;
  label: string;
}

export function TargetFlag({ tongue, fallback, label }: Props) {
  const Flag = FLAG_BY_TONGUE[(tongue ?? '').trim().toLowerCase()];

  if (Flag) {
    return (
      <span
        className="w-9 h-6 rounded-md overflow-hidden shrink-0 block shadow-sm ring-1 ring-white/40"
        role="img"
        aria-label={label}
      >
        <Flag className="w-full h-full block" />
      </span>
    );
  }

  return (
    <span className="text-2xl leading-none" role="img" aria-label={label}>
      {fallback}
    </span>
  );
}