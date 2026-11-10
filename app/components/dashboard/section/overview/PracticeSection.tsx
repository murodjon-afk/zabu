"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { SendHorizonal, BookOpen, MessageCircle, Languages, Sparkles } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Как сказать «спасибо» по-таджикски?",
  "Объясни разницу между to be и to have",
  "Дай 5 слов на персидском для знакомства",
];

const SUGGESTION_STYLES = [
  "bg-white",
  "bg-[#D9F36B]",
  "bg-[#EAF6F0]",
];

// Плитки быстрых тем: палитра идёт по кругу
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

// Языковые логотипы на внешней орбите
const ORBIT_LOGOS = [
  { src: "/logo-tj.webp", alt: "Таджикский" },
  { src: "/logo-ir.webp", alt: "Персидский" },
  { src: "/logo-en.webp", alt: "Английский" },
];

// Цветные точки на внутренней орбите
const ORBIT_DOTS = ["bg-[#FF7A59]", "bg-[#F6C945]", "bg-[#D9F36B]"];

const OUTER_T = 30; // секунд на оборот
const INNER_T = 22;

type CSSVars = React.CSSProperties & Record<`--${string}`, string>;

function Orbit() {
  const sceneStyle: CSSVars = {
    "--s": "clamp(200px, 30vh, 280px)",
    width: "var(--s)",
    height: "var(--s)",
  };

  return (
    <div className="flex shrink-0 justify-center py-8" aria-hidden="true">
      <div className="relative" style={sceneStyle}>
        {/* плоский мятный диск */}
        <span className="absolute inset-[17%] rounded-full bg-[#EAF6F0]" />

        {/* пунктирные орбиты */}
        <span className="absolute inset-0 rounded-full border-2 border-dashed border-[#158F66]/30" />
        <span className="absolute inset-[17%] rounded-full border-2 border-dashed border-[#158F66]/30" />

        {/* центральная сфера */}
        <div className="absolute inset-[33%]">
          <span className="zc-ring absolute inset-0 rounded-full border-2 border-[#158F66]/50" />
          <span className="zc-ring absolute inset-0 rounded-full border-2 border-[#D9F36B]" style={{ animationDelay: "1.4s" }} />
          <div className="zc-bob relative flex h-full w-full items-center justify-center rounded-full border-2 border-[#0B3D2E] bg-white shadow-[0_6px_0_#0B3D2E]">
            <Image
              src="/logo-bg.png"
              alt=""
              width={96}
              height={96}
              className="h-[72%] w-[72%] object-contain"
            />
          </div>
        </div>

        {/* внутренняя орбита: точки идут в обратную сторону */}
        {ORBIT_DOTS.map((bg, i) => {
          const st: CSSVars = {
            "--r": "calc(var(--s) * 0.33)",
            "--t": `${INNER_T}s`,
            "--d": `${-(INNER_T * i) / ORBIT_DOTS.length}s`,
            "--a": `${-(360 / ORBIT_DOTS.length) * i}deg`,
          };
          return (
            <span
              key={i}
              style={st}
              className={`zc-orb zc-orb-rev -ml-[7px] -mt-[7px] h-[14px] w-[14px] rounded-full border-2 border-[#0B3D2E] ${bg}`}
            />
          );
        })}

        {/* внешняя орбита: логотипы языков */}
        {ORBIT_LOGOS.map((l, i) => {
          const st: CSSVars = {
            "--r": "calc(var(--s) / 2)",
            "--t": `${OUTER_T}s`,
            "--d": `${-(OUTER_T * i) / ORBIT_LOGOS.length}s`,
            "--a": `${(360 / ORBIT_LOGOS.length) * i}deg`,
          };
          return (
            <span key={l.src} style={st} className="zc-orb -ml-[26px] -mt-[26px] h-[52px] w-[52px]">
              <Image
                src={l.src}
                alt={l.alt}
                width={52}
                height={52}
                className="h-[52px] w-[52px] rounded-full border-2 border-[#0B3D2E] bg-white object-cover shadow-[0_3px_0_#0B3D2E]"
              />
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function Page() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send(override?: string) {
    const text = (override ?? input).trim();
    if (!text || loading) return;

    const next: Msg[] = [...messages, { role: "user", content: text }];

    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });

      const data = await res.json();

      setMessages([
        ...next,
        {
          role: "assistant",
          content: data.reply ?? `Ошибка: ${data.error}`,
        },
      ]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Ошибка сети" }]);
    } finally {
      setLoading(false);
    }
  }

  const empty = messages.length === 0;

  return (
    <main className="mx-auto flex h-[88dvh] min-h-[600px] max-h-[850px] w-full max-w-[1100px] flex-col gap-3 bg-[#F6F9F7] p-3 text-[#0B3D2E] sm:gap-4 sm:p-5">
      <style>{`
        @keyframes zc-greet {
          0% { opacity: 0; transform: translateY(10px); }
          6%,30% { opacity: 1; transform: none; }
          36%,100% { opacity: 0; transform: translateY(-10px); }
        }
        @keyframes zc-bob {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes zc-ring {
          0% { transform: scale(.9); opacity: .6; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes zc-dot {
          0%,80%,100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        @keyframes zc-orbit {
          from { transform: rotate(0deg) translateX(var(--r)) rotate(0deg); }
          to { transform: rotate(360deg) translateX(var(--r)) rotate(-360deg); }
        }
        @keyframes zc-orbit-rev {
          from { transform: rotate(0deg) translateX(var(--r)) rotate(0deg); }
          to { transform: rotate(-360deg) translateX(var(--r)) rotate(360deg); }
        }

        .zc-greet { animation: zc-greet 9s infinite both; }
        .zc-bob { animation: zc-bob 3.4s ease-in-out infinite; }
        .zc-ring { animation: zc-ring 2.8s ease-out infinite; }
        .zc-dot { animation: zc-dot 1s ease-in-out infinite; }
        .zc-orb {
          position: absolute;
          left: 50%;
          top: 50%;
          animation: zc-orbit var(--t) linear infinite;
          animation-delay: var(--d);
        }
        .zc-orb-rev { animation-name: zc-orbit-rev; }

        @media (prefers-reduced-motion: reduce) {
          .zc-greet,.zc-bob,.zc-ring,.zc-dot { animation: none; }
          .zc-greet { opacity: 0; }
          .zc-greet:first-child { opacity: 1; }
          .zc-orb {
            animation: none;
            transform: rotate(var(--a)) translateX(var(--r)) rotate(calc(var(--a) * -1));
          }
        }
      `}</style>

      {/* HEADER */}
      <header
        className="relative flex shrink-0 items-center gap-4 overflow-hidden rounded-[24px] border-2 border-[#0B3D2E] bg-[#158F66] px-5 py-3 text-white shadow-[0_5px_0_#0B3D2E] sm:px-6"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,.22) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      >
        <span aria-hidden="true" className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-white/10" />
        <span aria-hidden="true" className="pointer-events-none absolute right-24 top-3 h-2.5 w-2.5 rounded-full bg-[#FF7A59]" />

        <div className="relative h-12 w-12 shrink-0">
          <span className="zc-ring absolute inset-0 rounded-full border-2 border-[#D9F36B]/60" />
          <div className="zc-bob relative flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#0B3D2E] bg-white shadow-[0_3px_0_#0B3D2E]">
            <Image src="/logo-bg.png" alt="ZABU" width={36} height={36} className="h-9 w-9 object-contain" />
          </div>
        </div>

        <div className="relative min-w-0">
          <h1 className="text-3xl font-black tracking-[-0.03em]">
            <span className="mr-2 inline-block -rotate-2 rounded-lg bg-[#D9F36B] px-2 text-[#0B3D2E] shadow-[3px_3px_0_#0B3D2E]">
              ZABU
            </span>
            Чат<span className="text-[#D9F36B]">.</span>
          </h1>
          <p className="mt-0.5 text-xs font-bold text-white/80">Учись без границ</p>
        </div>

        <div className="relative ml-auto hidden items-center gap-2 rounded-full border-2 border-white/25 bg-white/10 px-4 py-2 text-xs font-bold sm:flex">
          <span className="h-2 w-2 rounded-full bg-[#D9F36B]" />
          AI Language Assistant
        </div>
      </header>

      {/* CHAT */}
      <section
        aria-live="polite"
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto rounded-[24px] border-2 border-[#E3EBE5] bg-white p-4 shadow-[0_5px_0_rgba(11,61,46,0.08)] sm:p-5"
      >
        {empty && (
          <>
            {/* ORBIT + WELCOME */}
            <div className="flex shrink-0 flex-col items-center gap-3 text-center">

              <div className="grid h-[1.2em] text-[length:clamp(28px,4vh,38px)] font-black tracking-[-0.03em]">
                <span className="zc-greet col-start-1 row-start-1 text-[#158F66]">Welcome</span>
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

              <p className="max-w-lg text-sm font-semibold text-[#0B3D2E]/60">
                Спроси про слова, грамматику или перевод. Изучай новые слова вместе с ZABU AI.
              </p>

              <div className="flex flex-wrap justify-center gap-2.5">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className={`rounded-full border-2 border-[#0B3D2E] px-4 py-2 text-xs font-extrabold text-[#0B3D2E] shadow-[0_3px_0_#0B3D2E] transition hover:translate-y-[1px] hover:shadow-[0_2px_0_#0B3D2E] active:translate-y-[3px] active:shadow-none motion-reduce:transition-none focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#2EB67D] ${SUGGESTION_STYLES[i % SUGGESTION_STYLES.length]}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* FOUR LEARNING BLOCKS */}
            <div className="grid shrink-0 grid-cols-2 gap-3 pb-2 sm:grid-cols-4">
              {TILES.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.title}
                    type="button"
                    onClick={() => send(t.prompt)}
                    className={`flex flex-col items-start gap-3 rounded-3xl border-2 border-[#0B3D2E] p-4 text-left shadow-[0_5px_0_#0B3D2E] transition hover:-translate-y-0.5 active:translate-y-[3px] active:shadow-[0_2px_0_#0B3D2E] motion-reduce:transition-none motion-reduce:hover:translate-y-0 focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#2EB67D] ${t.cls}`}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0B3D2E]">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-lg font-black leading-tight tracking-[-0.03em]">{t.title}</span>
                      <span className="mt-0.5 block text-xs font-bold opacity-75">{t.hint}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* MESSAGES */}
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div
              key={i}
              className="max-w-[85%] self-end whitespace-pre-wrap break-words rounded-3xl rounded-br-lg border-2 border-[#0B3D2E] bg-[#158F66] px-4 py-2.5 text-sm font-bold text-white shadow-[0_3px_0_#0B3D2E]"
            >
              {m.content}
            </div>
          ) : (
            <div key={i} className="flex max-w-[90%] items-end gap-2 self-start">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[#0B3D2E] bg-white shadow-[0_2px_0_#0B3D2E]">
                <Image src="/logo-bg.png" alt="" width={22} height={22} className="h-5 w-5 object-contain" />
              </span>
              <div className="whitespace-pre-wrap break-words rounded-3xl rounded-bl-lg border-2 border-[#E3EBE5] bg-[#F8FBF9] px-4 py-2.5 text-sm font-semibold text-[#0B3D2E]">
                {m.content}
              </div>
            </div>
          )
        )}

        {loading && (
          <div className="flex items-end gap-2 self-start">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-[#0B3D2E] bg-white shadow-[0_2px_0_#0B3D2E]">
              <Image src="/logo-bg.png" alt="" width={22} height={22} className="h-5 w-5 object-contain" />
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

        <div ref={endRef} />
      </section>

      {/* INPUT */}
      <div className="flex shrink-0 gap-2 sm:gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.nativeEvent.isComposing && send()}
          placeholder="Напишите сообщение..."
          className="h-12 min-w-0 flex-1 rounded-2xl border-2 border-[#E3EBE5] bg-[#F8FBF9] px-4 text-sm font-bold text-[#0B3D2E] transition placeholder:text-[#0B3D2E]/35 focus:border-[#158F66] focus:bg-white focus:outline-none"
        />

        <button
          onClick={() => send()}
          disabled={loading || !input.trim()}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-[#158F66] px-5 text-sm font-extrabold text-white shadow-[0_6px_0_#0B3D2E] transition hover:translate-y-[2px] hover:bg-[#0F7352] hover:shadow-[0_4px_0_#0B3D2E] active:translate-y-[4px] active:shadow-[0_2px_0_#0B3D2E] disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-[#E2EBE5] disabled:text-[#0B3D2E]/35 disabled:shadow-none motion-reduce:transition-none focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#2EB67D]"
        >
          <span className="hidden sm:inline">Отправить</span>
          <SendHorizonal className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </main>
  );
}