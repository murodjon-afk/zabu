
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Bell } from 'lucide-react';

import { TargetFlag } from './TargetFlag';
import { Avatar } from './UI';
import type { Profile } from './types';

interface Props {
  p: Profile;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  onLogo: () => void;
  onBell: () => void;
  onProfile: () => void;
}

export function Header({
  p,
  sidebarOpen,
  onToggleSidebar,
  onLogo,
  onBell,
  onProfile,
}: Props) {
  return (
    <header className="fixed top-0 inset-x-0 z-40 h-16 sm:h-[72px] bg-[#158F66] text-white border-b-2 border-[#0B3D2E] flex items-center justify-between gap-3 px-4 md:px-6">

      {/* Decorative dot pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-70"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255,255,255,.2) 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* LOGO */}
      <Link
        href="/"
        onClick={onLogo}
        className="relative z-10 flex min-w-0 items-center gap-1.5 sm:gap-2 group"
      >
        <Image
          src="/logo-bg.png"
          alt="ZABU mascot"
          width={48}
          height={48}
          priority
          className="h-9 w-9 sm:h-11 sm:w-11 object-contain transition-transform group-hover:-rotate-6 group-hover:scale-105"
        />

        <span className="text-xl sm:text-2xl font-black tracking-[-1.5px] text-white">
          ZABU<span className="text-[#D9F36B]">.</span>
        </span>
      </Link>

      {/* RIGHT ACTIONS */}
      <div className="relative z-10 flex items-center gap-2 sm:gap-3">

        {/* Notifications */}
        <button
          onClick={onBell}
          aria-label="Уведомления"
          className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border-2 border-[#0B3D2E] bg-white text-[#0B3D2E] shadow-[0_4px_0_#0B3D2E] transition hover:-translate-y-[2px] hover:bg-[#D9F36B] hover:shadow-[0_6px_0_#0B3D2E] active:translate-y-[3px] active:shadow-[0_1px_0_#0B3D2E] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#D9F36B]"
        >
          <Bell className="h-5 w-5" strokeWidth={2.5} />

          {p.homework > 0 && (
            <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-[#0B3D2E] bg-[#FF7A59]" />
          )}
        </button>

        {/* Profile */}
        <button
          onClick={onProfile}
          aria-label="Открыть профиль"
          className="flex items-center gap-2 sm:gap-3 rounded-full border-2 border-[#0B3D2E] bg-white pl-2.5 pr-1.5 py-1 shadow-[0_4px_0_#0B3D2E] transition hover:-translate-y-[2px] hover:shadow-[0_6px_0_#0B3D2E] active:translate-y-[3px] active:shadow-[0_1px_0_#0B3D2E]"
        >
          <TargetFlag
            tongue={p.targetTongue}
            fallback={p.target.flag}
            label={p.target.ru}
          />

          <span className="hidden sm:block text-left leading-tight">
            <span className="block text-sm font-black text-[#0B3D2E]">
              {p.target.native}
            </span>
            <span className="block text-[11px] font-bold text-[#0B3D2E]/55">
              Уровень: {p.level}
            </span>
          </span>

          <Avatar
            src={p.image}
            name={p.fullName}
            className="h-8 w-8 rounded-full border-2 border-[#0B3D2E] bg-[#D9F36B] text-xs text-[#0B3D2E]"
          />
        </button>
      </div>
    </header>
  );
}
