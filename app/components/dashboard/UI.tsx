'use client';
import React, { useEffect, useState } from 'react';

export const CARD =
  'bg-white rounded-3xl p-6 border-2 border-emerald-400/70 shadow-sm hover:shadow-lg hover:border-emerald-500 transition-shadow duration-200 cursor-pointer h-full min-h-[160px] flex flex-col justify-between text-left w-full';

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-lg md:text-xl font-bold text-slate-900 flex items-center">
    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full mr-2.5" />
    {children}
  </h2>
);

export const ModalAction = ({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2.5 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
  >
    {icon}
    <span>{label}</span>
  </button>
);

// Аватарка из сессии; если нет или не загрузилась — буква имени
export function Avatar({ src, name, className }: { src?: string | null; name: string; className: string }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);

  if (src && !failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={name}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={`${className} object-cover`}
      />
    );
  }
  return (
    <span className={`${className} flex items-center justify-center font-extrabold`}>
      {name.trim().charAt(0).toUpperCase() || '?'}
    </span>
  );
}


