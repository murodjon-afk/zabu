import type { ElementType, ReactNode } from 'react';

interface Props {
  title: string;
  icon: ElementType;
  description: string;
  children?: ReactNode;
}

export function SectionPlaceholder({ title, icon: Icon, description, children }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm text-center py-14 px-6 space-y-4">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
          <Icon className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900">{title}</h2>
        <p className="text-slate-500 max-w-md mx-auto text-sm">{description}</p>
      </div>
      {children}
    </div>
  );
}