'use client';
import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useUsers } from '@/app/providers';
import { langInfo, num, STATUS_RU } from '../constants';
import type { Profile } from '../types';

export function useDashboardProfile() {
  const { data: session } = useSession();
  const { users, currentUser, loading, error } = useUsers();

  const p: Profile = useMemo(() => {
    const fullName = currentUser?.namefull || session?.user?.name || 'Ученик';
    const targetTongue = (currentUser?.targetTongue as string | undefined) ?? '';
    const nativeTongue = (currentUser?.nativeTongue as string | undefined) ?? '';

    const lessonsDone = num(currentUser?.lessonsComleted); // в API опечатка: Comleted
    const lessonsTotal = num(currentUser?.totalLessons);
    const wordsLearned = num(currentUser?.wordsLearned);
    const wordsSaved = num(currentUser?.wordsSaved);

    const lessonsPct = lessonsTotal > 0 ? Math.min(100, Math.round((lessonsDone / lessonsTotal) * 100)) : 0;
    const wordsAll = wordsLearned + wordsSaved;
    const wordsPct = wordsAll > 0 ? Math.round((wordsLearned / wordsAll) * 100) : 0;

    return {
      fullName,
      firstName: fullName.split(' ')[0],
      email: (currentUser?.email as string) || session?.user?.email || '',
      image: session?.user?.image ?? null,
      status: STATUS_RU[String(currentUser?.status)] ?? (currentUser?.status as string) ?? 'Ученик',
      level: (currentUser?.lvl as string) || 'Новичок',
      targetTongue,
      nativeTongue,
      target: langInfo(targetTongue),
      native: langInfo(nativeTongue),
      homework: num(currentUser?.hw),
      scores: num(currentUser?.Scores),
      lessonsDone,
      lessonsTotal,
      lessonsPct,
      wordsLearned,
      wordsSaved,
      wordsPct,
    };
  }, [currentUser, session]);

  const ranked = useMemo(() => [...users].sort((a, b) => num(b.Scores) - num(a.Scores)), [users]);

  const rank = useMemo(() => {
    if (!currentUser) return null;
    const i = ranked.findIndex((u) => u.id === currentUser.id);
    return i < 0 ? null : i + 1;
  }, [ranked, currentUser]);

  return { p, users, ranked, rank, currentUser, loading, error };
}