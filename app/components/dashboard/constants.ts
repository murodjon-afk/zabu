import type { ElementType } from 'react';
import { Home, BookOpen, Book, Bot, Settings } from 'lucide-react';

export type TabId =
  | 'overview'
  | 'profile'
  | 'lessons'
  | 'practice'
  | 'dictionary'
  | 'settings';
export interface SidebarItem { id: TabId; label: string; icon: ElementType }

export const navItems: SidebarItem[] = [
  { id: 'overview', label: 'Обзор', icon: Home },
  { id: 'lessons', label: 'Уроки', icon: BookOpen },
  { id: 'practice', label: 'ИИ практика', icon: Bot },
  { id: 'dictionary', label: 'Словарь', icon: Book },
  { id: 'settings', label: 'Настройки', icon: Settings },
];

export const isTabId = (v: string): v is TabId => navItems.some((i) => i.id === v);

export interface LangInfo { flag: string; ru: string; native: string }

export const LANGS: Record<string, LangInfo> = {
  Tajik: { flag: '🇹🇯', ru: 'Таджикский', native: 'Тоҷикӣ' },
  Persian: { flag: '🇮🇷', ru: 'Персидский', native: 'فارسی' },
  English: { flag: '🇬🇧', ru: 'Английский', native: 'English' },
  Russian: { flag: '🇷🇺', ru: 'Русский', native: 'Русский' },
};

export const langInfo = (key?: string): LangInfo =>
  (key && LANGS[key]) || { flag: '🌐', ru: key || 'Не выбран', native: key || '—' };

export const STATUS_RU: Record<string, string> = {
  student: 'Ученик',
  teacher: 'Преподаватель',
  admin: 'Администратор',
};

export const num = (v: unknown) =>
  typeof v === 'number' && Number.isFinite(v) ? v : Number(v) || 0;

export const fmt = (n: number) => n.toLocaleString('ru-RU');