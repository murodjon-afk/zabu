"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import {
  AlertTriangle,
  BookOpen,
  Languages,
  MessageCircle,
  Plus,
  RotateCcw,
  SendHorizonal,
  Sparkles,
  X,
} from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const MAX_LEN = 2000;

// Быстрые темы: палитра ZABU
const TILES = [
  {
    title: "Слова",
    hint: "5 новых слов",
    prompt: "Дай 5 новых слов для начинающих с переводом и примерами",
    icon: BookOpen,
    cls: "bg-[#158F66] text-white",
  },
  {
    title: "Грамматика",
    hint: "Просто о сложном",
    prompt: "Объясни простое правило грамматики с примерами",
    icon: Sparkles,
    cls: "bg-[#D9F36B] text-[#0B3D2E]",
  },
  {
    title: "Перевод",
    hint: "Фраза или текст",
    prompt: "Помоги перевести фразу и объясни перевод",
    icon: Languages,
    cls: "bg-[#FF7A59] text-[#0B3D2E]",
  },
  {
    title: "Практика",
    hint: "Диалог с ИИ",
    prompt: "Давай потренируем разговорную речь: начни простой диалог",
    icon: MessageCircle,
    cls: "bg-[#0B3D2E] text-white",
  },
];

export default function Page() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const empty = messages.length === 0;
  const lastIsUser = messages[messages.length - 1]?.role === "user";

  /* прокрутка только внутри чата (страница не дёргается) */
  useEffect(() => {
    const el = scrollRef.current;
    el?.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, loading, error]);

  /* поле ввода растёт вместе с текстом (до ~5 строк) */
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  }, [input]);

  const ask = useCallback(async (history: Msg[]) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.reply) {
        throw new Error(data.error ?? "Не удалось получить ответ");
      }

      setMessages([...history, { role: "assistant", content: data.reply }]);
    } catch (e) {
      // ошибки не попадают в историю — её не отправляем обратно в API
      const msg = e instanceof Error ? e.message : "";
      setError(
        !msg || msg === "Failed to fetch"
          ? "Нет соединения. Проверьте интернет и попробуйте ещё раз."
          : msg
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const send = (override?: string) => {
    const text = (override ?? input).trim();
    if (!text || loading) return;

    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    ask(next);
    inputRef.current?.focus();
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send();
  };

  // Enter — отправить, Shift+Enter — новая строка
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send();
    }
  };

  const newChat = () => {
    if (loading) return;
    setMessages([]);
    setError(null);
    setInput("");
    inputRef.current?.focus();
  };

  return (
    /*
      Высота = экран минус шапка и нижний навбар (на телефоне) / минус шапка (от 900px).
      Если у тебя другие отступы у контейнера — поправь два числа в h-[calc(...)].
    */
<main className="
  mx-auto flex
  h-[calc(100dvh-9rem)]
  min-h-[490px]
  w-full max-w-[900px]
  flex-col
  gap-4
  px-3 pt-3 pb-4
  text-[#0B3D2E]
  sm:px-4 sm:pt-4
">      <style>{`
        @keyframes zc-greet {
          0% { opacity: 0; transform: translateY(10px); }
          6%,30% { opacity: 1; transform: none; }
          36%,100% { opacity: 0; transform: translateY(-10px); }
        }
        @keyframes zc-dot {
          0%,80%,100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        .zc-greet { animation: zc-greet 9s infinite both; }
        .zc-dot { animation: zc-dot 1s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .zc-greet, .zc-dot { animation: none; }
          .zc-greet { opacity: 0; }
          .zc-greet:first-child { opacity: 1; }
        }
      `}</style>

      {/* ШАПКА */}
      <header
        className="flex shrink-0 items-center gap-3 rounded-[24px] border-2 border-[#0B3D2E] bg-[#158F66] px-4 py-2.5 text-white shadow-[0_5px_0_#0B3D2E]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,.2) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      >
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-[#0B3D2E] bg-white shadow-[0_3px_0_#0B3D2E]">
          <Image
            src="/logo-ai.webp"
            alt="ZABU"
            width={30}
            height={30}
            className="h-[30px] w-[30px] object-contain"
          />
        </span>

        <div className="min-w-0">
          <h1 className="truncate text-2xl font-black leading-none tracking-[-0.03em]">
            <span className="mr-1.5 inline-block -rotate-2 rounded-lg bg-[#D9F36B] px-1.5 text-[#0B3D2E] shadow-[2px_2px_0_#0B3D2E]">
              ZABU
            </span>
            Чат<span className="text-[#D9F36B]">.</span>
          </h1>
          <p className="mt-1 text-xs font-bold text-white/80">ИИ-помощник по языкам</p>
        </div>

        {!empty && (
          <button
            type="button"
            onClick={newChat}
            disabled={loading}
            aria-label="Новый чат"
            className="ml-auto inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full bg-white px-3 text-xs font-extrabold text-[#158F66] shadow-[0_3px_0_#0B3D2E] transition hover:bg-[#D9F36B] hover:text-[#0B3D2E] active:translate-y-[2px] active:shadow-[0_1px_0_#0B3D2E] disabled:opacity-50 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Новый чат</span>
          </button>
        )}
      </header>

      {/* ЧАТ */}
      <section
        className="min-h-0 flex-1 overflow-hidden rounded-[24px] border-2 border-[#E3EBE5] bg-white shadow-[0_5px_0_rgba(11,61,46,0.08)]"
        aria-label="Переписка"
      >
        <div
          ref={scrollRef}
          aria-live="polite"
          className="h-full overflow-y-auto overscroll-contain p-4 sm:p-5"
        >
          {empty ? (
            <div className="flex min-h-full flex-col items-center justify-center gap-5 py-2 text-center">
              <div className="flex flex-col items-center gap-2">
                <div className="grid h-[1.2em] text-[length:clamp(28px,4vh,38px)] font-black tracking-[-0.03em]">
                  <span className="zc-greet col-start-1 row-start-1 text-[#158F66]">
                    Welcome
                  </span>
                  <span
                    className="zc-greet col-start-1 row-start-1 text-[#158F66] opacity-0"
                    style={{ animationDelay: "3s" }}
                  >
                    Хуш омадед
                  </span>
                  <span
                    dir="rtl"
                    className="zc-greet col-start-1 row-start-1 text-[#158F66] opacity-0"
                    style={{ animationDelay: "6s" }}
                  >
                    خوش آمدید
                  </span>
                </div>

                <p className="max-w-md text-sm font-semibold text-[#0B3D2E]/60">
                  Спроси про слова, грамматику или перевод — или выбери тему ниже.
                </p>
              </div>

              <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
                {TILES.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.title}
                      type="button"
                      onClick={() => send(t.prompt)}
                      disabled={loading}
                      className={`flex flex-col items-start gap-2.5 rounded-3xl border-2 border-[#0B3D2E] p-3.5 text-left shadow-[0_5px_0_#0B3D2E] transition hover:-translate-y-0.5 active:translate-y-[3px] active:shadow-[0_2px_0_#0B3D2E] disabled:opacity-60 motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#2EB67D] ${t.cls}`}
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#0B3D2E]">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block text-base font-black leading-tight tracking-[-0.02em]">
                          {t.title}
                        </span>
                        <span className="mt-0.5 block text-xs font-bold opacity-75">
                          {t.hint}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {messages.map((m, i) =>
                m.role === "user" ? (
                  <div
                    key={i}
                    dir="auto"
                    className="max-w-[85%] self-end whitespace-pre-wrap break-words rounded-3xl rounded-br-lg border-2 border-[#0B3D2E] bg-[#158F66] px-4 py-2.5 text-sm font-bold text-white shadow-[0_3px_0_#0B3D2E]"
                  >
                    {m.content}
                  </div>
                ) : (
                  <div key={i} className="flex max-w-[92%] items-end gap-2 self-start">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[#0B3D2E] bg-white shadow-[0_2px_0_#0B3D2E]">
                      <Image
                        src="/logo-bg.png"
                        alt=""
                        width={22}
                        height={22}
                        className="h-5 w-5 object-contain"
                      />
                    </span>
                    <div
                      dir="auto"
                      className="whitespace-pre-wrap break-words rounded-3xl rounded-bl-lg border-2 border-[#E3EBE5] bg-[#F8FBF9] px-4 py-2.5 text-sm font-semibold leading-relaxed text-[#0B3D2E]"
                    >
                      {m.content}
                    </div>
                  </div>
                )
              )}

              {loading && (
                <div className="flex items-end gap-2 self-start">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[#0B3D2E] bg-white shadow-[0_2px_0_#0B3D2E]">
                    <Image
                      src="/logo-bg.png"
                      alt=""
                      width={22}
                      height={22}
                      className="h-5 w-5 object-contain"
                    />
                  </span>
                  <div
                    role="status"
                    aria-label="Печатает"
                    className="flex items-center gap-1.5 rounded-3xl border-2 border-[#E3EBE5] bg-[#F8FBF9] px-4 py-3"
                  >
                    {[0, 0.15, 0.3].map((d) => (
                      <span
                        key={d}
                        className="zc-dot h-2 w-2 rounded-full bg-[#158F66]"
                        style={{ animationDelay: `${d}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ОШИБКА */}
      {error && (
        <div
          role="alert"
          className="flex shrink-0 items-center gap-3 rounded-2xl border-2 border-rose-200 bg-rose-50 py-2 pl-4 pr-2 text-sm font-bold text-rose-700"
        >
          <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="min-w-0 flex-1">{error}</span>

          {lastIsUser && (
            <button
              type="button"
              onClick={() => ask(messages)}
              disabled={loading}
              className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-white px-3 text-xs font-extrabold text-rose-700 shadow-[0_2px_0_rgba(190,18,60,0.25)] transition active:translate-y-[1px] disabled:opacity-50"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Повторить
            </button>
          )}

          <button
            type="button"
            onClick={() => setError(null)}
            aria-label="Закрыть"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-rose-500 transition hover:bg-rose-100"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}

   
{/* ВВОД */}
<form onSubmit={onSubmit} className="shrink-0">
  <div className="flex items-end gap-2 rounded-2xl border border-[#E3EBE5] bg-white p-2 transition focus-within:border-[#158F66] focus-within:ring-2 focus-within:ring-[#158F66]/10">

    <textarea
      ref={inputRef}
      value={input}
      onChange={(e) => setInput(e.target.value.slice(0, MAX_LEN))}
      onKeyDown={onKeyDown}
      rows={1}
      dir="auto"
      placeholder="Напишите сообщение…"
      aria-label="Сообщение"
      className="max-h-32 min-h-10 min-w-0 flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm font-medium leading-6 text-[#0B3D2E] outline-none placeholder:text-[#0B3D2E]/40 focus:ring-0"
    />

    <button
      type="submit"
      disabled={loading || !input.trim()}
      aria-label="Отправить"
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#158F66] text-white transition-colors hover:bg-[#0F7352] active:bg-[#0B3D2E] disabled:cursor-not-allowed disabled:bg-[#E3EBE5] disabled:text-[#0B3D2E]/35 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#158F66]"
    >
      <SendHorizonal className="h-[18px] w-[18px]" aria-hidden="true" />
    </button>
  </div>

  <p className="mt-2 hidden text-center text-[11px] font-medium text-[#0B3D2E]/40 sm:block">
    Enter — отправить · Shift+Enter — новая строка
  </p>
</form>

    </main>
  );
}