import { Avatar, } from './UI';
import { fmt } from './constants';
import type { Profile } from './types';

export function ProfileModalContent({ p }: { p: Profile }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
        <Avatar src={p.image} name={p.fullName} className="w-14 h-14 rounded-2xl bg-emerald-600 text-white text-xl shrink-0" />
        <div className="min-w-0">
          <h4 className="font-bold text-slate-900 text-lg truncate">{p.fullName}</h4>
          <p className="text-sm text-slate-500 truncate">{p.email}</p>
          <span className="inline-block mt-1 text-xs font-semibold text-emerald-700 bg-emerald-200/60 px-2.5 py-0.5 rounded-md">
            {p.status} · {p.level}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
          <div className="text-xs text-slate-400 font-semibold mb-0.5">Родной язык</div>
          <div className="font-bold text-slate-800">{p.native.flag} {p.native.ru}</div>
        </div>
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
          <div className="text-xs text-slate-400 font-semibold mb-0.5">Изучаю</div>
          <div className="font-bold text-slate-800">{p.target.flag} {p.target.ru}</div>
        </div>
      </div>
      <p className="text-sm text-slate-600">
        Пройдено уроков: {p.lessonsDone} из {p.lessonsTotal}. Выучено слов: {fmt(p.wordsLearned)}.
      </p>
    </div>
  );
}