import type { ReactNode } from 'react';
import type { useUsers } from '@/app/providers';
import type { LangInfo, TabId } from './constants';

type UsersCtx = ReturnType<typeof useUsers>;
export type AppUser = UsersCtx['users'][number];

export interface ModalConfig { isOpen: boolean; title?: string; content?: ReactNode }

export interface Profile {
  fullName: string;
  firstName: string;
  email: string;
  image: string | null;
  status: string;
  level: string;
  targetTongue: string;
  nativeTongue: string;
  target: LangInfo;
  native: LangInfo;
  homework: number;
  scores: number;
  lessonsDone: number;
  lessonsTotal: number;
  lessonsPct: number;
  wordsLearned: number;
  wordsSaved: number;
  wordsPct: number;
}

/** Всё, что нужно разделам дашборда */
export interface DashboardCtx {
  p: Profile;
  users: AppUser[];
  ranked: AppUser[];
  rank: number | null;
  currentUser: UsersCtx['currentUser'];
  loading: boolean;
  goTo: (id: TabId) => void;
  openModal: (title: string, content: ReactNode) => void;
  closeModal: () => void;
  triggerToast: (msg: string) => void;
  copyInvite: () => void;
}


