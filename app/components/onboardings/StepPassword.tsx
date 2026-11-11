'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Eye,
  EyeOff,
  Lock,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';

interface Props {
  value?: string;
  onNext: (password: string) => void;
  onBack?: () => void;
  loading?: boolean;
  /** Необязательно: имя, e-mail и т.п. — их нельзя использовать в пароле */
  userInfo?: string[];
}

/* ───────────────────────── КОНСТАНТЫ ───────────────────────── */

const MIN_LENGTH = 8;
const MAX_BYTES = 72; // лимит bcrypt

/** Точные совпадения — такие пароли запрещены целиком */
const COMMON = new Set([
  '12345678', '123456789', '1234567890', '12341234', '123123123', '11111111',
  '00000000', '87654321', 'password', 'password1', 'password123', 'passw0rd',
  'p@ssw0rd', 'qwertyui', 'qwerty12', 'qwerty123', 'qwertyuiop', '1q2w3e4r',
  '1qaz2wsx', 'zaq12wsx', 'qazwsxedc', 'iloveyou', 'admin123', 'welcome1',
  'letmein1', 'abc12345', 'sunshine', 'princess', 'football', 'monkey123',
  'dragon12', 'zabu1234', 'zabu12345', 'йцукенгш', 'qwertyuiop123',
]);

/** Частые слова — штраф, если встречаются внутри пароля */
const COMMON_WORDS = [
  'password', 'passw0rd', 'qwerty', 'admin', 'welcome', 'iloveyou',
  'letmein', 'zabu', 'парол', 'йцукен',
];

const KEY_ROWS = [
  'qwertyuiop', 'asdfghjkl', 'zxcvbnm',
  'йцукенгшщзхъ', 'фывапролджэ', 'ячсмитьбю',
];

const ALPHABET =
  'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*';

const LEVELS = [
  { label: 'Нет пароля', text: 'text-slate-400', bar: 'bg-slate-200' },
  { label: 'Слабый', text: 'text-rose-600', bar: 'bg-rose-500' },
  { label: 'Средний', text: 'text-amber-600', bar: 'bg-amber-400' },
  { label: 'Хороший', text: 'text-[#158F66]', bar: 'bg-[#2EB67D]' },
  { label: 'Отличный', text: 'text-[#0B3D2E]', bar: 'bg-[#158F66]' },
] as const;

/* ───────────────────────── УТИЛИТЫ ───────────────────────── */

const byteLength = (s: string) => new TextEncoder().encode(s).length;

/** Криптостойкий генератор без смещения (rejection sampling) */
function generatePassword(len = 16): string {
  const limit = Math.floor(2 ** 32 / ALPHABET.length) * ALPHABET.length;
  const buf = new Uint32Array(1);

  const pick = () => {
    do {
      crypto.getRandomValues(buf);
    } while (buf[0] >= limit);
    return ALPHABET[buf[0] % ALPHABET.length];
  };

  for (;;) {
    const pw = Array.from({ length: len }, pick).join('');
    if (
      /[a-z]/.test(pw) &&
      /[A-Z]/.test(pw) &&
      /\d/.test(pw) &&
      /[!@#$%&*]/.test(pw)
    ) {
      return pw;
    }
  }
}

/** Последовательности вида abcd / 1234 / 4321 */
function hasRun(s: string, min = 4): boolean {
  let up = 1;
  let down = 1;
  for (let i = 1; i < s.length; i++) {
    const d = s.charCodeAt(i) - s.charCodeAt(i - 1);
    up = d === 1 ? up + 1 : 1;
    down = d === -1 ? down + 1 : 1;
    if (up >= min || down >= min) return true;
  }
  return false;
}

/** Куски клавиатурных рядов: qwer, asdf, йцук … */
function hasKeyboardRun(s: string): boolean {
  for (const row of KEY_ROWS) {
    const rev = [...row].reverse().join('');
    for (let i = 0; i <= row.length - 4; i++) {
      if (s.includes(row.slice(i, i + 4)) || s.includes(rev.slice(i, i + 4))) {
        return true;
      }
    }
  }
  return false;
}

type Analysis = {
  level: number;
  entropy: number;
  issues: string[];
  blocked: boolean; // нельзя использовать вообще
};

/** Оценка надёжности по энтропии с учётом типичных слабых мест */
function analyze(pw: string, userInfo: string[]): Analysis {
  if (!pw) return { level: 0, entropy: 0, issues: [], blocked: false };

  const lower = pw.toLowerCase();
  const issues: string[] = [];
  let blocked = false;

  let pool = 0;
  if (/[a-z]/.test(pw)) pool += 26;
  if (/[A-Z]/.test(pw)) pool += 26;
  if (/\d/.test(pw)) pool += 10;
  if (/[\u0400-\u052F]/.test(pw)) pool += 66; // кириллица (в т.ч. таджикская)
  if (/[\u0600-\u06FF]/.test(pw)) pool += 40; // арабская графика
  if (/[^\p{L}\d]/u.test(pw)) pool += 33;
  if (pool === 0) pool = 10;

  const unique = new Set(pw).size;
  const effLen = unique + (pw.length - unique) * 0.3;
  let entropy = effLen * Math.log2(pool);

  if (/(.)\1{2,}/.test(pw)) {
    entropy -= 6;
    issues.push('Повторяющиеся символы подряд');
  }
  if (hasRun(lower)) {
    entropy -= 8;
    issues.push('Простая последовательность (1234, abcd)');
  }
  if (hasKeyboardRun(lower)) {
    entropy -= 10;
    issues.push('Клавиатурный узор (qwer, йцук)');
  }
  if (COMMON_WORDS.some((w) => lower.includes(w))) {
    entropy -= 12;
    issues.push('Содержит слишком частое слово');
  }
  if (COMMON.has(lower)) {
    entropy = Math.min(entropy, 10);
    blocked = true;
    issues.unshift('Слишком частый пароль');
  }

  const tokens = userInfo
    .flatMap((s) => s.toLowerCase().split(/[^\p{L}\d]+/u))
    .filter((t) => t.length >= 3);
  if (tokens.some((t) => lower.includes(t))) {
    entropy = Math.min(entropy, 20);
    blocked = true;
    issues.unshift('Не используйте имя или почту в пароле');
  }

  entropy = Math.max(0, entropy);

  let level = 1;
  if (entropy >= 80) level = 4;
  else if (entropy >= 60) level = 3;
  else if (entropy >= 36) level = 2;

  return { level, entropy, issues, blocked };
}

const plural = (n: number, f: [string, string, string]) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return f[0];
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return f[1];
  return f[2];
};

/** Грубая оценка времени подбора при 10 млрд попыток/сек */
function crackTime(entropy: number): string {
  const sec = 2 ** Math.max(0, entropy - 1) / 1e10;
  if (sec < 1) return 'мгновенно';
  if (sec < 60) return 'секунды';
  if (sec < 3600) return 'минуты';
  if (sec < 86400) return 'часы';
  const days = sec / 86400;
  if (days < 365) {
    const n = Math.round(days);
    return `≈ ${n} ${plural(n, ['день', 'дня', 'дней'])}`;
  }
  const years = days / 365;
  if (years < 100) {
    const n = Math.round(years);
    return `≈ ${n} ${plural(n, ['год', 'года', 'лет'])}`;
  }
  return 'века';
}

/**
 * Проверка по базе утечек Have I Been Pwned (k-анонимность):
 * наружу уходят только первые 5 символов SHA-1, сам пароль — никогда.
 * При любой ошибке сети возвращаем 0 (не блокируем пользователя).
 */
async function pwnedCount(pw: string): Promise<number> {
  try {
    if (typeof crypto === 'undefined' || !crypto.subtle) return 0;

    const digest = await crypto.subtle.digest(
      'SHA-1',
      new TextEncoder().encode(pw)
    );
    const hex = Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
    const prefix = hex.slice(0, 5);
    const suffix = hex.slice(5);

    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);

    const res = await fetch(
      `https://api.pwnedpasswords.com/range/${prefix}`,
      {
        headers: { 'Add-Padding': 'true' },
        signal: ctrl.signal,
        cache: 'no-store',
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
      }
    );
    clearTimeout(timer);
    if (!res.ok) return 0;

    const text = await res.text();
    for (const line of text.split('\n')) {
      const [h, c] = line.trim().split(':');
      if (h === suffix) return parseInt(c, 10) || 0;
    }
    return 0;
  } catch {
    return 0;
  }
}

/* ───────────────────────── КОМПОНЕНТ ───────────────────────── */

export function StepPassword({
  value = '',
  onNext,
  onBack,
  loading = false,
  userInfo = [],
}: Props) {
  const [password, setPassword] = useState(value);
  const [confirm, setConfirm] = useState(value);

  const [show, setShow] = useState(false);
  const [touched, setTouched] = useState(false);
  const [caps, setCaps] = useState(false);
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);
  const [breach, setBreach] = useState<number | null>(null);

  const busy = useRef(false);

  /* Безопасность: прячем пароль, когда вкладка/окно теряет фокус */
  useEffect(() => {
    const hide = () => setShow(false);
    const onVis = () => {
      if (document.hidden) hide();
    };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('blur', hide);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('blur', hide);
    };
  }, []);

  const info = useMemo(() => analyze(password, userInfo), [password, userInfo]);
  const L = LEVELS[info.level];

  const checks = useMemo(
    () => ({
      length: password.length >= MIN_LENGTH,
      bytes: byteLength(password) <= MAX_BYTES,
      match: password.length > 0 && password === confirm,
      strong: info.level >= 2 && !info.blocked,
    }),
    [password, confirm, info]
  );

  const valid =
    checks.length && checks.bytes && checks.match && checks.strong;

  const tips = [
    { ok: password.length >= 12, text: '12+ символов' },
    {
      ok: /[a-zа-яё]/.test(password) && /[A-ZА-ЯЁ]/.test(password),
      text: 'Аа',
    },
    { ok: /\d/.test(password), text: '123' },
    { ok: /[^\p{L}\d]/u.test(password), text: '#@!' },
  ];

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    setCaps(e.getModifierState('CapsLock'));
  };

  const generate = () => {
    const pw = generatePassword(16);
    setPassword(pw);
    setConfirm(pw);
    setShow(true);
    setCopied(false);
    setBreach(null);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched(true);

    // защита от двойной отправки
    if (!valid || loading || busy.current) return;
    busy.current = true;
    setChecking(true);
    setBreach(null);

    try {
      const hits = await pwnedCount(password);
      if (hits > 0) {
        setBreach(hits);
        return;
      }
      onNext(password);
    } finally {
      busy.current = false;
      setChecking(false);
    }
  };

  const inputCls =
    'h-[52px] w-full rounded-2xl border-2 border-[#E3EBE5] bg-[#F8FBF9] pl-11 pr-12 text-sm font-bold text-[#0B3D2E] outline-none transition placeholder:font-medium placeholder:text-[#0B3D2E]/35 focus:border-[#158F66] focus:bg-white focus:ring-4 focus:ring-[#158F66]/15';

  const mismatch = confirm.length > 0 && !checks.match;
  const working = loading || checking;

  return (
    <form
      onSubmit={submit}
      noValidate
      className="mx-auto w-full max-w-md  rounded-[28px] border-2 border-[#0B3D2E]/10 bg-white p-5 shadow-[0_10px_0_rgba(11,61,46,0.1)] sm:p-7"
    >
      {/* ЗАГОЛОВОК */}
      <div className="mb-6 flex items-start gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#D9F36B] text-[#0B3D2E] shadow-[0_4px_0_#0B3D2E]">
          <ShieldCheck size={24} />
        </div>

        <div className="min-w-0 text-[length:clamp(26px,4.6vh,42px)] max-[600px]:text-[30px]">
          <h2 className="text-[26px] font-black leading-tight tracking-[-0.03em] text-[#0B3D2E]">
            Создайте{' '}
            <span className="inline-block -rotate-2 rounded-lg bg-[#158F66] px-2 pb-0.5 text-white">
              пароль
            </span>
          </h2>
         
        </div>
      </div>

      {/* ПАРОЛЬ */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor="zabu-password"
            className="text-sm font-extrabold text-[#0B3D2E]"
          >
            Пароль
          </label>

          <button
            type="button"
            onClick={generate}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#D9F36B] px-3 py-1 text-xs font-black text-[#0B3D2E] shadow-[0_3px_0_#0B3D2E] transition active:translate-y-[2px] active:shadow-[0_1px_0_#0B3D2E] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#2EB67D]"
          >
            <Sparkles size={13} />
            Сгенерировать
          </button>
        </div>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0B3D2E]/40" />

          <input
            id="zabu-password"
            type={show ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setCopied(false);
              setBreach(null);
            }}
            onKeyUp={onKey}
            onKeyDown={onKey}
            autoComplete="new-password"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-invalid={touched && !checks.strong}
            aria-describedby="zabu-password-hint"
            placeholder="Минимум 8 символов"
            className={inputCls}
          />

          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? 'Скрыть пароль' : 'Показать пароль'}
            aria-pressed={show}
            className="absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-[#0B3D2E]/45 transition hover:bg-[#EAF6F0] hover:text-[#158F66]"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {caps && (
          <p className="flex items-center gap-1.5 text-xs font-bold text-amber-600">
            <AlertTriangle size={13} />
            Включён Caps Lock
          </p>
        )}

        {/* ШКАЛА НАДЁЖНОСТИ */}
        <div className="pt-2" aria-live="polite">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
                  i <= info.level ? L.bar : 'bg-[#E3EBE5]'
                }`}
              />
            ))}
          </div>

          <div className="mt-2 flex items-center justify-between gap-3 text-xs">
            <span className={`font-black ${L.text}`}>{L.label}</span>
            <span className="font-semibold text-[#0B3D2E]/45">
              {password ? `Подбор: ${crackTime(info.entropy)}` : 'Надёжность пароля'}
            </span>
          </div>
        </div>

        {/* ПОДСКАЗКА: что не так с паролем */}
        <div id="zabu-password-hint" className="min-h-[18px]">
          {password && info.issues.length > 0 && (
            <p className="flex items-start gap-1.5 text-xs font-bold text-amber-700">
              <AlertTriangle size={13} className="mt-px shrink-0" />
              {info.issues[0]}
            </p>
          )}
          {touched && password && !checks.length && (
            <p className="text-xs font-bold text-rose-600">
              Минимум {MIN_LENGTH} символов
            </p>
          )}
          {touched && checks.length && !checks.strong && !info.blocked && (
            <p className="text-xs font-bold text-rose-600">
              Пароль слишком простой — добавьте длину и разные символы
            </p>
          )}
          {!checks.bytes && (
            <p className="text-xs font-bold text-rose-600">
              Максимальная длина — {MAX_BYTES} байта
            </p>
          )}
        </div>

        {/* ТРЕБОВАНИЯ */}
        <div className="flex flex-wrap gap-2">
          {tips.map((t) => (
            <span
              key={t.text}
              className={`inline-flex items-center gap-1 rounded-full border-2 px-2.5 py-0.5 text-xs font-black transition ${
                t.ok
                  ? 'border-[#158F66]/30 bg-[#EAF6F0] text-[#158F66]'
                  : 'border-[#E3EBE5] bg-white text-[#0B3D2E]/35'
              }`}
            >
              {t.ok && <Check size={11} strokeWidth={3.5} />}
              {t.text}
            </span>
          ))}
        </div>
      </div>

      {/* ПОВТОР */}
      <div className="mt-5 space-y-2">
        <label
          htmlFor="zabu-password-confirm"
          className="text-sm font-extrabold text-[#0B3D2E]"
        >
          Повторите пароль
        </label>

        <div className="relative">
          <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0B3D2E]/40" />

          <input
            id="zabu-password-confirm"
            type={show ? 'text' : 'password'}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            onKeyUp={onKey}
            onKeyDown={onKey}
            autoComplete="new-password"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            aria-invalid={mismatch}
            placeholder="Введите пароль ещё раз"
            className={`${inputCls} ${
              mismatch
                ? '!border-rose-300 focus:!border-rose-500 focus:!ring-rose-500/10'
                : ''
            }`}
          />

          {checks.match && (
            <span className="absolute right-3.5 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full bg-[#D9F36B] text-[#0B3D2E]">
              <Check size={14} strokeWidth={3.5} />
            </span>
          )}
        </div>

        {(touched || confirm.length > 0) && !checks.match && (
          <p
            role="alert"
            className="flex items-center gap-1.5 text-xs font-bold text-rose-600"
          >
            <X size={13} />
            Пароли не совпадают
          </p>
        )}
      </div>

      {/* УТЕЧКА */}
      {breach !== null && (
        <div
          role="alert"
          className="mt-5 flex items-start gap-3 rounded-2xl border-2 border-rose-200 bg-rose-50 p-3 text-xs font-bold leading-relaxed text-rose-700"
        >
          <ShieldAlert size={18} className="mt-0.5 shrink-0" />
          <span>
            Этот пароль найден в утечках данных ({breach.toLocaleString('ru-RU')}{' '}
            {plural(breach, ['раз', 'раза', 'раз'])}). Придумайте другой или
            нажмите «Сгенерировать».
          </span>
        </div>
      )}

      {/* КОПИРОВАТЬ */}
      {password && show && (
        <button
          type="button"
          onClick={copy}
          className="mt-4 inline-flex items-center gap-2 text-xs font-black text-[#158F66] transition hover:text-[#0B3D2E]"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Скопировано' : 'Скопировать пароль'}
        </button>
      )}

      {/* КНОПКИ */}
      <div className="mt-6 flex gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            disabled={working}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 border-[#0B3D2E]/10 bg-white px-5 text-sm font-bold text-[#0B3D2E] transition hover:bg-[#EAF6F0] active:scale-[0.98] disabled:opacity-50 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#2EB67D]"
          >
            <ArrowLeft size={17} />
            Назад
          </button>
        )}

        <button
          type="submit"
          disabled={!valid || working}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-[#158F66] px-5 text-sm font-extrabold text-white shadow-[0_6px_0_#0B3D2E] transition hover:translate-y-[2px] hover:shadow-[0_4px_0_#0B3D2E] active:translate-y-[4px] active:shadow-[0_2px_0_#0B3D2E] disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-[#E2EBE5] disabled:text-[#0B3D2E]/35 disabled:shadow-none focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#2EB67D]"
        >
          {working ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white motion-reduce:animate-none" />
              {checking ? 'Проверяем безопасность…' : 'Создаём аккаунт…'}
            </>
          ) : (
            <>
              Создать аккаунт
              <ArrowRight size={17} />
            </>
          )}
        </button>
      </div>

    
    </form>
  );
}