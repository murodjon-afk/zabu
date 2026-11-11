"use client";

import { useState } from "react";
import { signIn, signOut } from "next-auth/react";

import { YandexLogo, GoogleLogo } from "./UI";
import { buildUser } from "./constants";

type Provider = "google" | "yandex";
type Script = "cyrillic" | "latin" | "arabic";

type Props = {
  learning?: string | null;
  native?: string | null;
  goal?: string | null;
  script?: Script | null;
  password?: string;
};

const USER_KEY = "zabu:user";
const PROVIDER_KEY = "zabu:provider";

const btn =
  "flex h-[52px] w-full items-center justify-center gap-3 rounded-full border border-[#DCE6DF] bg-white px-5 text-sm font-semibold text-[#25382E] transition hover:border-[#16865B] hover:bg-[#F8FBF9] disabled:opacity-50";

const spinner =
  "h-5 w-5 animate-spin rounded-full border-2 border-[#16865B] border-t-transparent";

/** Читает текущий черновик из localStorage */
function readDraft(): Record<string, any> {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) ?? "{}") ?? {};
  } catch {
    return {};
  }
}

/** Только поля схемы MockAPI */
function toSchema(u: Record<string, any>) {
  return {
    namefull: u.namefull ?? "",
    email: u.email ?? "",
    status: u.status ?? "student",
    targetTongue: u.targetTongue ?? null,
    nativeTongue: u.nativeTongue ?? null,
    hw: u.hw ?? 0,
    lvl: u.lvl ?? null,
    wordsLearned: u.wordsLearned ?? 0,
    Scores: u.Scores ?? 0,
    lessonsComleted: u.lessonsComleted ?? 0,
    script: u.script ?? null,
    password: u.password ?? "",
    coins: u.coins ?? u.Coins ?? 0,
  };
}

export function ProviderButtons({
  learning,
  native,
  goal,
  script,
  password = "",
}: Props) {
  const [loading, setLoading] = useState<Provider | null>(null);
  const [error, setError] = useState("");

  async function handleSignIn(provider: Provider) {
    setError("");

    const draft = readDraft();

    // Пароль пользователя: из пропса, иначе тот, что уже в черновике
    const pw =
      password ||
      (typeof draft.password === "string" ? draft.password : "");

    // Без пароля на провайдера не уходим, иначе пользователь создастся без него
    if (pw.length < 8) {
      setError("Пароль не найден. Вернитесь назад и введите пароль заново.");
      return;
    }

    setLoading(provider);

    // Обновляем черновик, пароль всегда остаётся пользовательским
    const user = {
      ...draft,
      ...toSchema(buildUser(learning, native, goal, null, script ?? null, pw)),
      password: pw,
    };

    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      localStorage.setItem(PROVIDER_KEY, provider);

      if (process.env.NODE_ENV !== "production") {
        console.log("ZABU черновик:", { ...user, password: `*** (${pw.length})` });
      }
    } catch {
      console.warn("localStorage недоступен");
    }

    try {
      await signIn(provider, { redirectTo: "/api/user/redirect" });
    } catch {
      setError("Не удалось войти. Попробуй ещё раз.");
      setLoading(null);
    }
  }

  return (
    <div className="flex w-full flex-col gap-3">
      <button
        type="button"
        disabled={loading !== null}
        onClick={() => handleSignIn("google")}
        className={btn}
      >
        {loading === "google" ? <span className={spinner} /> : <GoogleLogo />}
        {loading === "google" ? "Переход в Google..." : "Продолжить с Google"}
      </button>

      <button
        type="button"
        disabled={loading !== null}
        onClick={() => handleSignIn("yandex")}
        className={btn}
      >
        {loading === "yandex" ? <span className={spinner} /> : <YandexLogo />}
        {loading === "yandex" ? "Переход в Яндекс..." : "Продолжить с Яндексом"}
      </button>

      {error && (
        <p className="text-center text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ redirectTo: "/" })}
      className=" border border-[#DCE6DF] bg-white px-5 py-3 text-sm font-semibold text-[#35483C] transition hover:border-[#16865B]"
    >
      Выйти из аккаунта
    </button>
  );
}

export default ProviderButtons;