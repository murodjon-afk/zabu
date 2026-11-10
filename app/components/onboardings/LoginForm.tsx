
"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Check,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
} from "lucide-react";

type Role = "student" | "staff";

export default function LoginForm() {
  const [role, setRole] = useState<Role>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [error, setError] = useState("");
  const [verificationOpen, setVerificationOpen] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Заполните все поля.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Введите корректный адрес электронной почты.");
      return;
    }

    setVerificationOpen(true);
  };

  const handlePasswordKeyUp = (
    e: KeyboardEvent<HTMLInputElement>
  ) => {
    setCapsLock(e.getModifierState("CapsLock"));
  };

  const inputClass =
    "h-[54px] w-full rounded-2xl border-2 border-[#E3EBE5] bg-[#F8FBF9] pl-12 pr-4 text-sm font-bold text-[#0B3D2E] outline-none transition placeholder:font-medium placeholder:text-[#0B3D2E]/35 focus:border-[#158F66] focus:bg-white focus:ring-4 focus:ring-[#158F66]/15 disabled:cursor-not-allowed disabled:opacity-60";

  const roleClass = (selected: boolean) =>
    `relative flex min-w-0 flex-1 items-center gap-2.5 rounded-2xl border-2 p-3 text-left transition duration-200 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#2EB67D] ${
      selected
        ? "border-[#0B3D2E] bg-[#158F66] text-white shadow-[0_6px_0_#0B3D2E]"
        : "border-[#E3EBE5] bg-white text-[#0B3D2E] shadow-[0_5px_0_rgba(11,61,46,0.08)] hover:-translate-y-0.5 hover:border-[#9FCDB7] hover:bg-[#EAF6F0]"
    }`;

  return (
    <div className="w-full min-w-0">

      {/* ROLE SELECTION */}
      <div className="mb-7">

        <div className="mb-3 flex items-center justify-between gap-2">
          <label className="text-sm font-black text-[#0B3D2E]">
            Тип аккаунта
          </label>

          <span className="rounded-full border-2 border-[#E3EBE5] bg-[#F8FBF9] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#0B3D2E]/45">
            Выберите роль
          </span>
        </div>

        <div
          className="grid grid-cols-2 gap-3"
          role="radiogroup"
          aria-label="Выберите тип аккаунта"
        >
          {/* STUDENT */}
          <button
            type="button"
            role="radio"
            aria-checked={role === "student"}
            onClick={() => setRole("student")}
            className={roleClass(role === "student")}
          >
            <div
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border-2 ${
                role === "student"
                  ? "border-[#0B3D2E] bg-[#D9F36B] text-[#0B3D2E]"
                  : "border-[#E3EBE5] bg-[#EAF6F0] text-[#158F66]"
              }`}
            >
              <GraduationCap size={21} strokeWidth={2.5} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black">
                Ученик
              </p>
              <p
                className={`mt-0.5 text-[10px] font-bold ${
                  role === "student"
                    ? "text-white/75"
                    : "text-[#0B3D2E]/45"
                }`}
              >
                Изучать языки
              </p>
            </div>

            {role === "student" && (
              <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full border-2 border-[#0B3D2E] bg-[#D9F36B] text-[#0B3D2E]">
                <Check size={12} strokeWidth={3.5} />
              </span>
            )}
          </button>

          {/* STAFF */}
          <button
            type="button"
            role="radio"
            aria-checked={role === "staff"}
            onClick={() => setRole("staff")}
            className={roleClass(role === "staff")}
          >
            <div
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border-2 ${
                role === "staff"
                  ? "border-[#0B3D2E] bg-[#D9F36B] text-[#0B3D2E]"
                  : "border-[#E3EBE5] bg-[#EAF6F0] text-[#158F66]"
              }`}
            >
              <Briefcase size={20} strokeWidth={2.5} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-black">
                Сотрудник
              </p>
              <p
                className={`mt-0.5 text-[10px] font-bold ${
                  role === "staff"
                    ? "text-white/75"
                    : "text-[#0B3D2E]/45"
                }`}
              >
                Управление ZABU
              </p>
            </div>

            {role === "staff" && (
              <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full border-2 border-[#0B3D2E] bg-[#D9F36B] text-[#0B3D2E]">
                <Check size={12} strokeWidth={3.5} />
              </span>
            )}
          </button>
        </div>
      </div>

      {/* LOGIN FORM */}
      <form onSubmit={handleSubmit} noValidate>

        {/* EMAIL */}
        <div className="mb-5">
          <label
            htmlFor="login-email"
            className="mb-2 block text-sm font-black text-[#0B3D2E]"
          >
            Электронная почта
          </label>

          <div className="relative">
            <Mail
              size={19}
              strokeWidth={2.3}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#158F66]/65"
            />

            <input
              id="login-email"
              type="email"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="example@email.com"
              className={inputClass}
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="mb-5">
          <label
            htmlFor="login-password"
            className="mb-2 block text-sm font-black text-[#0B3D2E]"
          >
            Пароль
          </label>

          <div className="relative">
            <Lock
              size={19}
              strokeWidth={2.3}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#158F66]/65"
            />

            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyUp={handlePasswordKeyUp}
              onBlur={() => setCapsLock(false)}
              placeholder="Введите пароль"
              className={`${inputClass} pr-12`}
            />

            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={
                showPassword ? "Скрыть пароль" : "Показать пароль"
              }
              aria-pressed={showPassword}
              className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-xl text-[#0B3D2E]/45 transition hover:bg-[#EAF6F0] hover:text-[#158F66] focus-visible:outline-[3px] focus-visible:outline-offset-1 focus-visible:outline-[#2EB67D]"
            >
              {showPassword ? (
                <EyeOff size={19} />
              ) : (
                <Eye size={19} />
              )}
            </button>
          </div>

          {/* CAPS LOCK */}
          {capsLock && (
            <div className="mt-2 flex items-center gap-2 rounded-xl border-2 border-amber-200 bg-amber-50 px-3 py-2">
              <AlertTriangle
                size={15}
                className="shrink-0 text-amber-600"
              />
              <p className="text-xs font-bold text-amber-600">
                Включён Caps Lock
              </p>
            </div>
          )}
        </div>

        {/* ERROR */}
        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="mb-5 flex items-start gap-2.5 rounded-2xl border-2 border-rose-200 bg-rose-50 px-4 py-3"
          >
            <AlertTriangle
              size={18}
              className="mt-0.5 shrink-0 text-rose-600"
            />
            <p className="text-sm font-bold leading-5 text-rose-700">
              {error}
            </p>
          </div>
        )}

        {/* SUBMIT */}
        <button
          type="submit"
          className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#158F66] px-6 text-sm font-extrabold text-white shadow-[0_6px_0_#0B3D2E] transition hover:translate-y-[2px] hover:bg-[#0F7352] hover:shadow-[0_4px_0_#0B3D2E] active:translate-y-[4px] active:shadow-[0_2px_0_#0B3D2E] focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#2EB67D]"
        >
          Продолжить
          <ArrowRight
            size={18}
            strokeWidth={2.8}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      </form>

      {/* VERIFICATION STATUS */}
      {verificationOpen && (
        <div
          role="status"
          className="mt-5 rounded-2xl border-2 border-[#158F66]/30 bg-[#EAF6F0] p-4"
        >
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#D9F36B] text-[#0B3D2E]">
              <Mail size={19} />
            </span>

            <div className="min-w-0">
              <p className="text-sm font-black text-[#0B3D2E]">
                Продолжаем вход
              </p>
              <p className="mt-1 break-all text-xs font-medium leading-5 text-[#0B3D2E]/65">
                Проверяем данные для {email.trim()}.
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
