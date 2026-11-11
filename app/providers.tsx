
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { SessionProvider, useSession } from "next-auth/react";

/* ───────────── DICTIONARY ───────────── */

export type DictionaryWord = {
  id: number;
  word: string;
  translation: string;
  transcription?: string;
  sam_dialect?: string;
  partOfSpeech?: string;
  level?: string;
  category?: string;
  example?: string;
  exampleTranslation?: string;
  url?: string;
  [key: string]: unknown;
};

type DictionaryState = {
  words: DictionaryWord[];
  loading: boolean;
  error: string | null;
  language: string | null;
};

const initialDictionaryState: DictionaryState = {
  words: [],
  loading: true,
  error: null,
  language: null,
};

// Общий экспорт слов
export let dictionary: DictionaryWord[] = [];

let dictionaryState = initialDictionaryState;
let dictionaryRequest: Promise<void> | null = null;

const dictionaryListeners = new Set<() => void>();

function notifyDictionary() {
  dictionaryListeners.forEach((listener) => listener());
}

function subscribeDictionary(callback: () => void) {
  dictionaryListeners.add(callback);

  return () => {
    dictionaryListeners.delete(callback);
  };
}

function getDictionarySnapshot() {
  return dictionaryState;
}

function getServerDictionarySnapshot() {
  return initialDictionaryState;
}

// Загрузка словаря
async function loadDictionary(language: string) {
  if (dictionaryRequest) return dictionaryRequest;

  if (
    dictionaryState.language === language &&
    dictionaryState.words.length > 0
  ) {
    return;
  }

  dictionaryState = {
    ...dictionaryState,
    loading: true,
    error: null,
    language,
  };

  notifyDictionary();

  dictionaryRequest = (async () => {
    try {
      const response = await fetch(
        `/api/dictionary?lang=${encodeURIComponent(language)}`,
        { cache: "no-store" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ?? "Ошибка загрузки словаря"
        );
      }

      const words = Array.isArray(data.dictionary)
        ? data.dictionary
        : [];

      dictionary = words;

      dictionaryState = {
        words,
        loading: false,
        error: null,
        language,
      };
    } catch (error) {
      dictionaryState = {
        ...dictionaryState,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Ошибка загрузки словаря",
      };
    } finally {
      dictionaryRequest = null;
      notifyDictionary();
    }
  })();

  return dictionaryRequest;
}

// Hook словаря
export function useDictionary() {
  return useSyncExternalStore(
    subscribeDictionary,
    getDictionarySnapshot,
    getServerDictionarySnapshot
  );
}

// Чтение языка из localStorage

function DictionaryLoader() {
  const { currentUser, loading: userLoading } = useUsers();

  useEffect(() => {
    if (userLoading) return;

    if (!currentUser) {
      dictionaryState = {
        ...dictionaryState,
        loading: false,
        error: "Пользователь не найден",
      };
      notifyDictionary();
      return;
    }

    const targetTongue = String(
      currentUser.targetTongue ?? ""
    )
      .trim()
      .toLowerCase();

    const languages: Record<string, string> = {
      tajik: "tajik",
      tj: "tajik",
      tjk: "tajik",
      farsi: "farsi",
      persian: "farsi",
      fa: "farsi",
      far: "farsi",
      russian: "russian",
      ru: "russian",
      rus: "russian",
    };

    const language = languages[targetTongue];

    if (!language) {
      dictionaryState = {
        ...dictionaryState,
        loading: false,
        error: `Неизвестный изучаемый язык: ${
          targetTongue || "не указан"
        }`,
      };

      notifyDictionary();
      return;
    }

    void loadDictionary(language);
  }, [currentUser, userLoading]);

  return null;
}


/* ───────────── USER PROVIDER ───────────── */

export type ZabuUser = {
  id: string;
  namefull?: string;
  email?: string;
  [key: string]: unknown;
};

type UserContextValue = {
  users: ZabuUser[];
  currentUser: ZabuUser | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

const UserContext = createContext<UserContextValue | null>(null);

function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  const [users, setUsers] = useState<ZabuUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка пользователей
  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/user/get", {
        cache: "no-store",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(
          data.error ??
            `Ошибка загрузки пользователей (${res.status})`
        );
      }

      setUsers(
        Array.isArray(data.users) ? data.users : []
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Неизвестная ошибка"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      refetch();
    }

    if (status === "unauthenticated") {
      setUsers([]);
      setLoading(false);
    }
  }, [status, refetch]);

  // Текущий пользователь
  const currentUser = useMemo(() => {
    const email = session?.user?.email?.toLowerCase();

    if (!email) return null;

    return (
      users.find(
        (u) => u.email?.toLowerCase() === email
      ) ?? null
    );
  }, [users, session]);

  const value = useMemo(
    () => ({
      users,
      currentUser,
      loading,
      error,
      refetch,
    }),
    [users, currentUser, loading, error, refetch]
  );

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUsers() {
  const ctx = useContext(UserContext);

  if (!ctx) {
    throw new Error(
      "useUsers должен быть внутри <Providers>"
    );
  }

  return ctx;
}

/* ───────────── SYNC SESSION ───────────── */

const USER_KEY = "zabu:user";

let registering: string | null = null;

type RegistrationResponse = {
  user?: Record<string, unknown> & {
    id?: string;
    email?: string;
  };
  created?: boolean;
  error?: string;
};

function SyncSession() {
  const { data: session, status } = useSession();
  const { refetch } = useUsers();

  useEffect(() => {
    if (
      status !== "authenticated" ||
      !session?.user?.email
    ) {
      return;
    }

    const email = session.user.email.toLowerCase();

    let draft: Record<string, unknown> = {};

    // 1. Получаем данные регистрации
    try {
      draft = JSON.parse(
        localStorage.getItem(USER_KEY) ?? "{}"
      );
    } catch {
      console.error("Не удалось прочитать zabu:user");
      return;
    }

    // 2. Проверяем, зарегистрирован ли пользователь
    if (
      draft.registered === true &&
      String(draft.email ?? "").toLowerCase() === email
    ) {
      return;
    }

    // 3. Защита от повторного запроса
    if (registering === email) {
      return;
    }

    // 4. Получаем пароль из StepPassword
    const password =
      typeof draft.password === "string"
        ? draft.password
        : "";

    if (password.length < 8) {
      console.error(
        "ZABU: пароль не найден или слишком короткий.",
        {
          email,
          passwordExists: Boolean(password),
          passwordLength: password.length,
          hint:
            "Проверь, сохраняется ли password из StepPassword в zabu:user.",
        }
      );

      return;
    }

    registering = email;

const user: Record<string, unknown> = {
  ...draft,
  namefull: session.user.name ?? "",
  email,
  password,
};

    // 6. Отправляем данные в API
    void (async () => {
      try {
        const res = await fetch("/api/user/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        });

        const data = (await res
          .json()
          .catch(() => null)) as RegistrationResponse | null;

        // 7. Если пользователь уже существует
        // API из предыдущего варианта возвращает 409
      if (res.status === 409) {
  console.warn(
    "ZABU: аккаунт с таким email уже существует. Пароль в базе не изменён.",
    email
  );

  const {
    password: _draftPassword,
    passwordHash: _draftHash,
    passwordSalt: _draftSalt,
    ...safeDraft
  } = user;

  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      ...safeDraft,
      registered: true,
    })
  );

  await refetch();
  return;
}

        // 8. Проверяем ответ API
        if (!res.ok) {
          console.error(
            "ZABU регистрация не удалась:",
            {
              status: res.status,
              statusText: res.statusText,
              response: data,
            }
          );

          return;
        }

        if (!data?.user) {
          throw new Error(
            "API не вернул объект пользователя"
          );
        }

        // 9. Убираем пароль и хеши из локального профиля
        const {
          password: _password,
          passwordHash: _hash,
          passwordSalt: _salt,
          ...safeUser
        } = data.user;

        localStorage.setItem(
          USER_KEY,
          JSON.stringify({
            ...safeUser,
            registered: true,
          })
        );

        // 10. Сообщение о результате
        console.log(
          data.created
            ? "ZABU: пользователь успешно создан."
            : "ZABU: пользователь уже существует.",
          {
            email: safeUser.email,
            id: safeUser.id,
          }
        );

        // 11. Обновляем список пользователей
        await refetch();
      } catch (e) {
        console.error(
          "ZABU ошибка регистрации:",
          e instanceof Error
            ? e.message
            : e
        );
      } finally {
        registering = null;
      }
    })();
  }, [session, status, refetch]);

  return null;
}

/* ───────────── ROOT ───────────── */
/* ───────────── LESSONS ───────────── */

export type Lesson = {
  id: number;
  type: "alphabet" | "lesson" | "mini_test" | "test";
  category: string;
  title: Record<string, string>; // ru, tg, fa, en, it, he, uz
  words: number[];
  afterLessonId?: number;
  lessonIds?: number[];
};

type LessonsContextValue = {
  lessons: Lesson[];
  loading: boolean;
  error: string | null;
};

const LessonsContext = createContext<LessonsContextValue | null>(null);

function LessonsProvider({
  initialLessons,
  children,
}: {
  initialLessons: Lesson[];
  children: React.ReactNode;
}) {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [loading, setLoading] = useState(initialLessons.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialLessons.length > 0) return; // уже пришли с сервера

    const controller = new AbortController();

    fetch("/api/lessons", { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Ошибка загрузки уроков (${res.status})`);
        return res.json();
      })
      .then((data) => setLessons(Array.isArray(data) ? data : []))
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [initialLessons.length]);

  const value = useMemo(
    () => ({ lessons, loading, error }),
    [lessons, loading, error]
  );

  return (
    <LessonsContext.Provider value={value}>{children}</LessonsContext.Provider>
  );
}

export function useLessons() {
  const ctx = useContext(LessonsContext);
  if (!ctx) throw new Error("useLessons должен быть внутри <Providers>");
  return ctx;
}

export function Providers({
  children,
  lessons = [],
}: {
  children: React.ReactNode;
  lessons?: Lesson[];
}) {
  return (
    <SessionProvider>
      <LessonsProvider initialLessons={lessons}>
        <UserProvider>
          <DictionaryLoader />
          <SyncSession />
          {children}
        </UserProvider>
      </LessonsProvider>
    </SessionProvider>
  );
}
