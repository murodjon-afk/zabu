'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from 'react';
import {SettingsSkeleton} from "../../Skeletons"
import { useSession } from 'next-auth/react';
import {
  Camera,
  Check,
  Coins,
  Eye,
  EyeOff,
  Info,
  Languages,
  Lock,
  RotateCcw,
  Trash2,
  Type,
  UserRound,
    Headset
} from 'lucide-react';
// Путь подправь, если у тебя другой (раньше был ../components/onboardings/Flags)
import {
  RuFlag,
  TjFlag,
  UzFlag,
  IrFlag,
  ItFlag,
} from '../../../onboardings/Flags';
import type { DashboardCtx } from '../../types';

/* =====================================================================
   SESSION (временный макет)
   Настройки пока хранятся в localStorage под ключом SESSION_KEY.
   Когда появится бэкенд — замени только readSession / writeSession и
   changePassword (там стоит TODO).
   Пароль в localStorage НЕ хранится.
   ===================================================================== */

const SESSION_KEY = 'session';

type Script = 'cyrillic' | 'latin' | 'arabic';

type Session = {
  id?: string;
  namefull?: string;
  email?: string;
  status?: string;
  targetTongue?: string;
  nativeTongue?: string;
  script?: string;
  coins?: number;
  avatar?: string | null;
  [k: string]: unknown;
};

/** Убираем возможный пароль из старых версий сессии */
const sanitize = (s: Session): Session => {
  const { password: _legacy, ...rest } = s as Session & { password?: unknown };
  return rest;
};

const readSession = (): Session => {
  try {
    return sanitize(JSON.parse(localStorage.getItem(SESSION_KEY) || '{}'));
  } catch {
    return {};
  }
};

const writeSession = (s: Session) => {
  const clean = sanitize(s);
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(clean));
  } catch {
    /* хранилище переполнено или недоступно */
  }
  window.dispatchEvent(new CustomEvent('session:update', { detail: clean }));
};

/* ---------- справочники ---------- */

/** Языки, которые можно изучать (у каждого есть логотип с флагом) */
const TARGETS = [
  { id: 'Tajik', ru: 'Таджикский', native: 'Тоҷикӣ', logo: '/logo-tj.webp', dir: 'ltr' },
  { id: 'Persian', ru: 'Персидский', native: 'فارسی', logo: '/logo-ir.webp', dir: 'rtl' },
  { id: 'English', ru: 'Английский', native: 'English', logo: '/logo-en.webp', dir: 'ltr' },
] as const;

/** Языки, на которых можно объяснять */
const NATIVES = [
  { id: 'Russian', ru: 'Русский', Flag: RuFlag },
  { id: 'Tajik', ru: 'Таджикский', Flag: TjFlag },
  { id: 'Uzbek', ru: 'Узбекский', Flag: UzFlag },
  { id: 'Persian', ru: 'Персидский', Flag: IrFlag },
  { id: 'Italian', ru: 'Итальянский', Flag: ItFlag },
] as const;

const langRu = (id: string) =>
  TARGETS.find((t) => t.id === id)?.ru ??
  NATIVES.find((n) => n.id === id)?.ru ??
  id;

/** Письменности, доступные для каждого изучаемого языка */
const SCRIPTS_FOR: Record<string, Script[]> = {
  Tajik: ['cyrillic', 'latin'],
  Persian: ['arabic', 'latin'],
  English: ['latin'], // английский всегда на латинице
};

const DEFAULT_SCRIPT: Record<string, Script> = {
  Tajik: 'cyrillic',
  Persian: 'arabic',
  English: 'latin',
};

const SCRIPT_LABEL: Record<Script, string> = {
  cyrillic: 'Кириллица',
  latin: 'Латиница',
  arabic: 'Арабское письмо',
};

const SAMPLE: Record<string, Partial<Record<Script, string>>> = {
  Tajik: { cyrillic: 'Салом', latin: 'Salom' },
  Persian: { arabic: 'سلام', latin: 'Salam' },
  English: { latin: 'Hello' },
};

const GRADIENTS = [
  ['#158F66', '#D9F36B'],
  ['#0B3D2E', '#158F66'],
  ['#FF7A59', '#F6C945'],
  ['#158F66', '#7BD3A9'],
  ['#0B3D2E', '#FF7A59'],
];

const hash = (s: string) =>
  [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('') || '?';

/** 'farsi' / 'TAJIK' / 'tajik' → 'Persian' / 'Tajik' */
const canon = (v?: string | null) => {
  if (!v) return '';
  const s = v.trim().toLowerCase();
  if (s === 'farsi') return 'Persian';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const MAX_PHOTO_MB = 8;

/** Обрезаем фото до квадрата 256×256, чтобы оно влезало в хранилище. */
const squarePhoto = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const size = 256;
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      const g = canvas.getContext('2d')!;
      const m = Math.min(img.width, img.height);
      g.drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('bad image'));
    };
    img.src = url;
  });

/* ---------- мелкие компоненты ---------- */

const Card = ({ delay = 0, children }: { delay?: number; children: ReactNode }) => (
  <section
    className="st-rise rounded-[28px] border-2 border-[#0B3D2E]/10 bg-white p-5 shadow-[0_8px_0_rgba(11,61,46,0.08)] sm:p-6"
    style={{ animationDelay: `${delay}s` }}
  >
    {children}
  </section>
);

const CardTitle = ({
  icon: Icon,
  children,
  hint,
}: {
  icon: typeof Lock;
  children: ReactNode;
  hint?: string;
}) => (
  <div className="mb-4">
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#D9F36B] text-[#0B3D2E] shadow-[0_3px_0_#0B3D2E]">
        <Icon size={19} />
      </span>
      <h3 className="text-lg font-black tracking-[-0.02em] text-[#0B3D2E]">{children}</h3>
    </div>
    {hint && <p className="mt-2 text-sm font-medium text-[#0B3D2E]/55">{hint}</p>}
  </div>
);

const inputCls =
  'h-12 w-full rounded-2xl border-2 border-[#E3EBE5] bg-[#F8FBF9] px-4 text-sm font-bold text-[#0B3D2E] outline-none transition placeholder:font-medium placeholder:text-[#0B3D2E]/35 focus:border-[#158F66] focus:bg-white focus:ring-4 focus:ring-[#158F66]/15';

const primaryBtn =
  'inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#158F66] px-6 text-sm font-extrabold text-white shadow-[0_6px_0_#0B3D2E] transition hover:translate-y-[2px] hover:shadow-[0_4px_0_#0B3D2E] active:translate-y-[4px] active:shadow-[0_2px_0_#0B3D2E] focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#2EB67D] disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-[#E2EBE5] disabled:text-[#0B3D2E]/35 disabled:shadow-none';

const ghostBtn =
  'inline-flex h-10 items-center justify-center gap-2 rounded-full border-2 border-[#0B3D2E]/10 bg-white px-4 text-sm font-bold text-[#0B3D2E] transition hover:bg-[#EAF6F0] active:scale-[0.98] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#2EB67D]';

type Toast = { id: number; msg: string; tone: 'ok' | 'error'; undo?: () => void };

/* ---------- скелетон ---------- */



/* ---------- страница ---------- */

export function SettingsSection({ ctx }: { ctx: DashboardCtx }) {
  const { p } = ctx;
  const { data: auth } = useSession(); // сессия из layout (Google / Яндекс)

  const [session, setSession] = useState<Session>({});
  const [ready, setReady] = useState(false);
  const [name, setName] = useState('');
  const [toast, setToast] = useState<Toast | null>(null);
  const [confirmPhoto, setConfirmPhoto] = useState(false);
  const [broken, setBroken] = useState<string | null>(null);

  const [curPw, setCurPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [repPw, setRepPw] = useState('');
  const [show, setShow] = useState({ cur: false, new: false, rep: false });
  const [pwSaving, setPwSaving] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* читаем сессию после монтирования (иначе рассинхрон при SSR) */
  useEffect(() => {
    const s = readSession();
    setSession(s);
    setName(s.namefull ?? p.fullName ?? auth?.user?.name ?? '');
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* сессию могли обновить в другой вкладке */
  useEffect(() => {
    const sync = () => setSession(readSession());
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const savedName = session.namefull ?? p.fullName ?? auth?.user?.name ?? 'Без имени';
  const email = session.email ?? p.email ?? auth?.user?.email ?? '';
  const status = session.status ?? p.status;

  const native = canon(session.nativeTongue) || 'Russian';
  const target = canon(session.targetTongue ?? (p as { targetTongue?: string }).targetTongue) || 'Tajik';

  const allowedScripts = SCRIPTS_FOR[target] ?? ['latin'];
  const script: Script = allowedScripts.includes(session.script as Script)
    ? (session.script as Script)
    : DEFAULT_SCRIPT[target] ?? allowedScripts[0];

  const targetInfo = TARGETS.find((t) => t.id === target);

  /* аватар: загруженный → из аккаунта (next-auth) → из профиля → инициалы */
  const customAvatar = session.avatar || null;
  const accountImage = auth?.user?.image || (p as { image?: string }).image || null;
  const avatarSrc = customAvatar || accountImage;
  const showImg = !!avatarSrc && broken !== avatarSrc;

  const [c1, c2] = useMemo(
    () => GRADIENTS[hash(savedName) % GRADIENTS.length],
    [savedName]
  );

  const nameTrim = name.trim();
  const nameDirty = ready && nameTrim !== savedName;
  const nameError =
    nameTrim.length === 0
      ? 'Введите имя'
      : nameTrim.length < 2
      ? 'Минимум 2 символа'
      : nameTrim.length > 40
      ? 'Максимум 40 символов'
      : '';

  /* если сохранённая письменность не подходит языку — тихо исправляем */
  useEffect(() => {
    if (!ready) return;
    if (session.script !== script || session.targetTongue !== target) {
      const next = { ...session, script, targetTongue: target };
      setSession(next);
      writeSession(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, target, script]);

  /* ---------- уведомления с «Отменить» ---------- */

  const showToast = (msg: string, opts: { tone?: 'ok' | 'error'; undo?: () => void } = {}) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ id: Date.now(), msg, tone: opts.tone ?? 'ok', undo: opts.undo });
    toastTimer.current = setTimeout(() => setToast(null), opts.undo ? 6000 : 2600);
  };

  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    []
  );

  const commit = (patch: Partial<Session>, message: string, undoable = false) => {
    const prev = session;
    const next = { ...session, ...patch };
    setSession(next);
    writeSession(next);
    showToast(message, {
      undo: undoable
        ? () => {
            setSession(prev);
            writeSession(prev);
            showToast('Изменение отменено');
          }
        : undefined,
    });
  };

  /* ---------- аватар ---------- */

  const pickPhoto = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      return showToast('Выберите файл с изображением (JPG, PNG, WebP)', { tone: 'error' });
    }
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
      return showToast(`Файл слишком большой — максимум ${MAX_PHOTO_MB} МБ`, { tone: 'error' });
    }
    try {
      commit({ avatar: await squarePhoto(file) }, 'Фото обновлено', true);
      setBroken(null);
    } catch {
      showToast('Не удалось открыть изображение', { tone: 'error' });
    }
  };

  const removePhoto = () => {
    setConfirmPhoto(false);
    commit(
      { avatar: null },
      accountImage ? 'Вернули фото из аккаунта' : 'Фото удалено',
      true
    );
  };

  /* ---------- имя ---------- */

  const saveName = (e: FormEvent) => {
    e.preventDefault();
    if (!nameDirty || nameError) return;
    commit({ namefull: nameTrim }, 'Имя сохранено', true);
  };

  /* ---------- языки и письменность ---------- */

  /** Если письменность не подходит новому языку — подбираем подходящую */
  const fixScript = (nextTarget: string, patch: Partial<Session>, notes: string[]) => {
    const allowed = SCRIPTS_FOR[nextTarget] ?? ['latin'];
    if (!allowed.includes(script)) {
      const s = DEFAULT_SCRIPT[nextTarget] ?? allowed[0];
      patch.script = s;
      notes.push(`письменность: ${SCRIPT_LABEL[s].toLowerCase()}`);
    }
  };

  const changeTarget = (id: string) => {
    if (id === target) return;
    const patch: Partial<Session> = { targetTongue: id };
    const notes: string[] = [];

    // родной и изучаемый не должны совпадать
    if (id === native) {
      const nextNative = NATIVES.some((n) => n.id === target) ? target : 'Russian';
      patch.nativeTongue = nextNative;
      notes.push(`родной язык: ${langRu(nextNative).toLowerCase()}`);
    }
    fixScript(id, patch, notes);

    commit(
      patch,
      `Изучаю: ${langRu(id).toLowerCase()}${notes.length ? ` (${notes.join(', ')})` : ''}`,
      true
    );
  };

  const changeNative = (id: string) => {
    if (id === native) return;
    const patch: Partial<Session> = { nativeTongue: id };
    const notes: string[] = [];

    if (id === target) {
      const nextTarget =
        TARGETS.find((t) => t.id === native)?.id ??
        TARGETS.find((t) => t.id !== id)!.id;
      patch.targetTongue = nextTarget;
      notes.push(`изучаю: ${langRu(nextTarget).toLowerCase()}`);
      fixScript(nextTarget, patch, notes);
    }

    commit(
      patch,
      `Родной язык: ${langRu(id).toLowerCase()}${notes.length ? ` (${notes.join(', ')})` : ''}`,
      true
    );
  };

  const changeScript = (s: Script) => {
    if (s === script) return;
    commit({ script: s }, `Письменность: ${SCRIPT_LABEL[s].toLowerCase()}`, true);
  };

  /* ---------- пароль ---------- */

  const pwChecks = {
    length: newPw.length >= 8,
    match: newPw.length > 0 && newPw === repPw,
    differs: newPw.length > 0 && newPw !== curPw,
  };
  const pwValid =
    curPw.length > 0 && pwChecks.length && pwChecks.match && pwChecks.differs;

  const changePassword = (e: FormEvent) => {
    e.preventDefault();
    if (!pwValid || pwSaving) return;
    setPwSaving(true);

    // TODO: заменить на запрос к API (проверка текущего пароля + смена на сервере).
    // Пока это макет: пароль никуда не сохраняется.
    setTimeout(() => {
      setPwSaving(false);
      setCurPw('');
      setNewPw('');
      setRepPw('');
      setShow({ cur: false, new: false, rep: false });
      showToast('Пароль изменён');
    }, 700);
  };

  // Скелетон, пока сессия не прочитана. Стоит после всех хуков (порядок хуков не нарушается).
  if (!ready) return <SettingsSkeleton />;

  const pwFields = [
    { id: 'cur', label: 'Текущий пароль', v: curPw, set: setCurPw, ac: 'current-password' },
    { id: 'new', label: 'Новый пароль', v: newPw, set: setNewPw, ac: 'new-password' },
    { id: 'rep', label: 'Повторите новый пароль', v: repPw, set: setRepPw, ac: 'new-password' },
  ] as const;

  return (
    <div className="mx-auto max-w-2xl space-y-5 pb-24 text-[#0B3D2E]">
      <style>{`
        @keyframes st-rise { from { opacity: 0; transform: translateY(14px) scale(.98); } to { opacity: 1; transform: none; } }
        @keyframes st-pop { 0% { transform: scale(.6); opacity: 0; } 70% { transform: scale(1.08); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes st-toast { from { opacity: 0; transform: translate(-50%, 16px); } to { opacity: 1; transform: translate(-50%, 0); } }
        @keyframes st-bob { 0%, 100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-5px) rotate(4deg); } }
        @keyframes st-ring { to { transform: rotate(360deg); } }
        @keyframes st-sk { 0%,100% { opacity: 1 } 50% { opacity: .45 } }
        .st-rise { animation: st-rise .6s cubic-bezier(.2,.8,.2,1) both; }
        .st-pop { animation: st-pop .45s cubic-bezier(.34,1.56,.64,1) both; }
        .st-toast { animation: st-toast .35s cubic-bezier(.2,.8,.2,1) both; }
        .st-bob { animation: st-bob 4s ease-in-out infinite; }
        .st-ring { animation: st-ring 14s linear infinite; }
        .st-sk { animation: st-sk 1.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .st-rise, .st-pop, .st-toast, .st-bob, .st-ring, .st-sk { animation: none !important; }
        }
      `}</style>

      {/* ---------- заголовок ---------- */}
      <header>
        <h1 className="text-[34px] font-black leading-none tracking-[-0.04em] sm:text-[44px]">
          <span className="inline-block -rotate-2 rounded-2xl bg-[#D9F36B] px-3 pb-1 pt-0.5 shadow-[4px_4px_0_#0B3D2E] sm:px-4 sm:shadow-[5px_5px_0_#0B3D2E]">
            Настройки
          </span>
          <span className="text-[#158F66]">.</span>
        </h1>
        <p className="mt-3 text-sm font-semibold text-[#0B3D2E]/55">
          Профиль, языки и безопасность — все изменения сохраняются сразу.
        </p>
      </header>

      {/* ---------- профиль ---------- */}


      {/* ---------- имя ---------- */}
      <Card delay={0.08}>
        <CardTitle icon={UserRound}>Имя</CardTitle>
        <form onSubmit={saveName} noValidate>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="min-w-0 flex-1">
              <input
                id="st-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                maxLength={60}
                aria-label="Имя"
                aria-invalid={nameDirty && !!nameError}
                aria-describedby="st-name-hint"
                placeholder="Как к вам обращаться?"
                className={`${inputCls} ${
                  nameDirty && nameError ? '!border-rose-300 focus:!ring-rose-500/10' : ''
                }`}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!nameDirty || !!nameError}
                className={`${primaryBtn} flex-1 sm:flex-none`}
              >
                <Check size={16} />
                Сохранить
              </button>
              {nameDirty && (
                <button
                  type="button"
                  onClick={() => setName(savedName)}
                  className={ghostBtn}
                >
                  Отмена
                </button>
              )}
            </div>
          </div>

          <p
            id="st-name-hint"
            className={`mt-2 flex items-center justify-between text-xs font-semibold ${
              nameDirty && nameError ? 'text-rose-600' : 'text-[#0B3D2E]/45'
            }`}
          >
            <span>
              {nameDirty && nameError
                ? nameError
                : nameDirty
                ? 'Есть несохранённые изменения'
                : 'Имя видят в профиле и рейтинге'}
            </span>
            <span>{nameTrim.length}/40</span>
          </p>
        </form>
      </Card>

      {/* ---------- языки ---------- */}
      <Card delay={0.16}>
        <CardTitle
          icon={Languages}
          hint="Выберите, какой язык учите и на каком вам объяснять."
        >
          Языки
        </CardTitle>

        <p className="mb-2 text-xs font-black uppercase tracking-wider text-[#0B3D2E]/45">
          Я изучаю
        </p>
        <div role="radiogroup" aria-label="Изучаемый язык" className="grid grid-cols-3 gap-2 sm:gap-3">
          {TARGETS.map((t) => {
            const active = t.id === target;
            return (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => changeTarget(t.id)}
                className={`group relative flex flex-col items-center gap-1 rounded-3xl border-2 px-2 pb-3 pt-3 text-center transition duration-300 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#2EB67D] motion-reduce:transition-none ${
                  active
                    ? 'border-[#0B3D2E] bg-[#158F66] text-white shadow-[0_6px_0_#0B3D2E]'
                    : 'border-[#E3EBE5] bg-white shadow-[0_5px_0_rgba(11,61,46,0.1)] hover:-translate-y-0.5 hover:border-[#9FCDB7]'
                }`}
              >
                <span
                  className={`absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full border-2 transition ${
                    active
                      ? 'border-[#0B3D2E] bg-[#D9F36B] text-[#0B3D2E]'
                      : 'scale-90 border-[#0B3D2E]/15 bg-white text-transparent'
                  }`}
                >
                  <Check size={13} strokeWidth={3.5} />
                </span>

                <img
                  src={t.logo}
                  alt=""
                  className="h-14 w-14 object-contain transition duration-300 group-hover:scale-105 sm:h-16 sm:w-16"
                />
                <span className="text-sm font-black leading-tight">{t.ru}</span>
                <span
                  dir={t.dir}
                  className={`text-xs font-bold ${
                    active ? 'text-white/80' : 'text-[#0B3D2E]/45'
                  }`}
                >
                  {t.native}
                </span>
              </button>
            );
          })}
        </div>

        <p className="mb-2 mt-6 text-xs font-black uppercase tracking-wider text-[#0B3D2E]/45">
          Объяснения на
        </p>
        <div role="radiogroup" aria-label="Родной язык" className="flex flex-wrap gap-2">
          {NATIVES.map(({ id, ru, Flag }) => {
            const active = id === native;
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => changeNative(id)}
                className={`inline-flex h-11 items-center gap-2.5 rounded-full border-2 pl-2 pr-4 text-sm font-bold transition focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#2EB67D] ${
                  active
                    ? 'border-[#0B3D2E] bg-[#158F66] text-white shadow-[0_4px_0_#0B3D2E]'
                    : 'border-[#E3EBE5] bg-white text-[#0B3D2E] hover:border-[#9FCDB7] hover:bg-[#EAF6F0]'
                }`}
              >
                <span className="overflow-hidden rounded-md border-2 border-white leading-[0] shadow-[0_2px_6px_-2px_rgba(20,35,28,0.45)]">
                  <Flag />
                </span>
                {ru}
                {active && <Check size={15} strokeWidth={3.5} className="text-[#D9F36B]" />}
              </button>
            );
          })}
        </div>

        <p className="mt-4 flex items-start gap-2 text-xs font-medium leading-relaxed text-[#0B3D2E]/50">
          <Info size={14} className="mt-px shrink-0 text-[#158F66]" />
          Родной и изучаемый язык не могут совпадать — второй язык поменяется
          автоматически, а мы подскажем об этом.
        </p>
      </Card>

      {/* ---------- письменность ---------- */}
      <Card delay={0.24}>
        <CardTitle
          icon={Type}
          hint={`Так слова на языке «${langRu(target)}» будут выглядеть в уроках и карточках.`}
        >
          Письменность
        </CardTitle>

        {allowedScripts.length > 1 ? (
          <div
            role="radiogroup"
            aria-label="Письменность"
            className="grid grid-cols-2 gap-3"
          >
            {allowedScripts.map((s) => {
              const active = s === script;
              const sample = SAMPLE[target]?.[s] ?? '';
              return (
                <button
                  key={s}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => changeScript(s)}
                  className={`relative flex flex-col items-center gap-1 rounded-3xl border-2 px-3 py-4 text-center transition duration-300 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#2EB67D] motion-reduce:transition-none ${
                    active
                      ? 'border-[#0B3D2E] bg-[#158F66] text-white shadow-[0_6px_0_#0B3D2E]'
                      : 'border-[#E3EBE5] bg-white shadow-[0_5px_0_rgba(11,61,46,0.1)] hover:-translate-y-0.5 hover:border-[#9FCDB7]'
                  }`}
                >
                  <span
                    className={`absolute right-2.5 top-2.5 grid h-6 w-6 place-items-center rounded-full border-2 transition ${
                      active
                        ? 'border-[#0B3D2E] bg-[#D9F36B] text-[#0B3D2E]'
                        : 'scale-90 border-[#0B3D2E]/15 bg-white text-transparent'
                    }`}
                  >
                    <Check size={13} strokeWidth={3.5} />
                  </span>

                  <span
                    dir={s === 'arabic' ? 'rtl' : 'ltr'}
                    className="text-[length:clamp(26px,5vw,36px)] font-black leading-tight"
                  >
                    {sample}
                  </span>
                  <span
                    className={`text-xs font-black ${
                      active ? 'text-white/85' : 'text-[#0B3D2E]/55'
                    }`}
                  >
                    {SCRIPT_LABEL[s]}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          /* английский: выбор не нужен */
          <div className="flex items-center gap-4 rounded-3xl border-2 border-dashed border-[#158F66]/35 bg-[#EAF6F0] p-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white text-[#158F66] shadow-[0_4px_0_rgba(11,61,46,0.12)]">
              <Lock size={22} />
            </span>
            <div className="min-w-0">
              <p className="text-lg font-black">
                Латиница <span className="text-[#158F66]">· Hello</span>
              </p>
              <p className="mt-0.5 text-sm font-medium text-[#0B3D2E]/60">
                Английский всегда пишется латиницей — переключать ничего не нужно.
              </p>
            </div>
          </div>
        )}

        {allowedScripts.length > 1 && (
          <p className="mt-4 flex items-start gap-2 text-xs font-medium leading-relaxed text-[#0B3D2E]/50">
            <Info size={14} className="mt-px shrink-0 text-[#158F66]" />
            {target === 'Tajik'
              ? 'Для таджикского доступны кириллица и латиница.'
              : 'Для персидского доступны арабское письмо и латиница.'}{' '}
            Выбор можно менять в любой момент.
          </p>
        )}
      </Card>

      {/* ---------- пароль ---------- */}
      <Card delay={0.32}>
        <CardTitle icon={Lock}>Пароль</CardTitle>

        <form onSubmit={changePassword} noValidate className="space-y-3">
          {pwFields.map((f) => (
            <div key={f.id}>
              <label
                htmlFor={`st-${f.id}`}
                className="mb-1.5 block text-xs font-black uppercase tracking-wider text-[#0B3D2E]/45"
              >
                {f.label}
              </label>
              <div className="relative">
                <input
                  id={`st-${f.id}`}
                  type={show[f.id] ? 'text' : 'password'}
                  autoComplete={f.ac}
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  value={f.v}
                  onChange={(e) => f.set(e.target.value)}
                  className={`${inputCls} pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => ({ ...s, [f.id]: !s[f.id] }))}
                  aria-label={show[f.id] ? 'Скрыть пароль' : 'Показать пароль'}
                  aria-pressed={show[f.id]}
                  className="absolute right-2.5 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-[#0B3D2E]/45 transition hover:bg-[#EAF6F0] hover:text-[#158F66]"
                >
                  {show[f.id] ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
          ))}

          {/* живые подсказки */}
          {(newPw || repPw) && (
            <ul className="flex flex-wrap gap-2 pt-1" aria-live="polite">
              {[
                { ok: pwChecks.length, text: 'От 8 символов' },
                { ok: pwChecks.differs, text: 'Не такой, как текущий' },
                { ok: pwChecks.match, text: 'Пароли совпадают' },
              ].map((c) => (
                <li
                  key={c.text}
                  className={`inline-flex items-center gap-1 rounded-full border-2 px-2.5 py-0.5 text-xs font-black transition ${
                    c.ok
                      ? 'border-[#158F66]/30 bg-[#EAF6F0] text-[#158F66]'
                      : 'border-[#E3EBE5] bg-white text-[#0B3D2E]/40'
                  }`}
                >
                  {c.ok && <Check size={11} strokeWidth={3.5} />}
                  {c.text}
                </li>
              ))}
            </ul>
          )}

          <button type="submit" disabled={!pwValid || pwSaving} className={`${primaryBtn} mt-2`}>
            {pwSaving ? (
              <>
                <span className="st-sk block h-3 w-24 rounded-full bg-white/60" aria-hidden />
                <span className="sr-only">Сохраняем…</span>
              </>
            ) : (
              <>
                <Check size={16} />
                Сменить пароль
              </>
            )}
          </button>
        </form>
      </Card>

      {/* ---------- уведомление ---------- */}
      {toast && (
        <div
          key={toast.id}
          role={toast.tone === 'error' ? 'alert' : 'status'}
          className={`st-toast fixed bottom-6 left-1/2 z-50 flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-full py-2.5 pl-4 pr-2.5 text-sm font-bold text-white shadow-[0_6px_0_rgba(11,61,46,0.35)] ${
            toast.tone === 'error' ? 'bg-rose-600' : 'bg-[#0B3D2E]'
          }`}
        >
          {toast.tone === 'ok' && (
            <Check size={16} strokeWidth={3.5} className="shrink-0 text-[#D9F36B]" />
          )}
          <span className="min-w-0">{toast.msg}</span>
          {toast.undo && (
            <button
              type="button"
              onClick={() => {
                toast.undo?.();
              }}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[#D9F36B] px-3 py-1.5 text-xs font-black text-[#0B3D2E] transition hover:brightness-95"
            >
              <RotateCcw size={12} />
              Отменить
            </button>
          )}
        </div>
      )}
            {/* ---------- ПОМОЩЬ ОПЕРАТОРА ---------- */}
      <button
        type="button"
        onClick={() =>
          showToast('Служба поддержки скоро будет доступна')
        }
        className={`${primaryBtn} w-full`}
      >
        <Headset size={19} strokeWidth={2.5} />
        Помощь Админа
      </button>
    </div>
  );
}