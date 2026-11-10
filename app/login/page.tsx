import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "../auth";
import { Background } from "../components/onboardings/Background";
import LoginForm from "../components/onboardings/LoginForm";
import { connection } from "next/server";

/** Три языка на орбите */
const ORBIT_LOGOS = [
  { src: "/logo-tj.webp", alt: "Тоҷикӣ" },
  { src: "/logo-ir.webp", alt: "فارسی" },
  { src: "/logo-en.webp", alt: "English" },
] as const;

const WELCOME = [
  { text: "Welcome", dir: "ltr" },
  { text: "Хуш омадед", dir: "ltr" },
  { text: "خوش آمدید", dir: "rtl" },
] as const;

const CSS = `
  @keyframes zp-spin {
    to { transform: rotate(360deg); }
  }

  @keyframes zp-ring {
    0% { transform: scale(1); opacity: .5; }
    100% { transform: scale(1.7); opacity: 0; }
  }

  @keyframes zp-word {
    0%, 28% { opacity: 1; transform: translateY(0) scale(1); }
    33%, 100% { opacity: 0; transform: translateY(6px) scale(.96); }
  }

  @keyframes zp-rise {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: none; }
  }

  .zp-orbit {
    animation: zp-spin var(--d, 30s) linear infinite;
    animation-delay: var(--delay, 0s);
  }

  .zp-orbit-item {
    animation: zp-spin var(--d, 30s) linear infinite reverse;
    animation-delay: var(--delay, 0s);
  }

  .zp-ring {
    animation: zp-ring 2.8s ease-out infinite;
  }

  .zp-ring-2 {
    animation: zp-ring 2.8s ease-out 1.4s infinite;
  }

  .zp-word {
    animation: zp-word 7.2s ease-in-out infinite;
    opacity: 0;
  }

  .zp-rise {
    animation: zp-rise .7s cubic-bezier(.2,.8,.2,1) both;
  }

  @media (prefers-reduced-motion: reduce) {
    .zp-orbit, .zp-orbit-item, .zp-ring, .zp-ring-2, .zp-rise {
      animation: none !important;
    }

    .zp-word {
      animation: none !important;
      display: none;
    }

    .zp-word:first-child {
      display: block;
      opacity: 1;
    }
  }
`;

function LogoTile({
  size = 48,
  pulse = false,
}: {
  size?: number;
  pulse?: boolean;
}) {
  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
    >
      {pulse && (
        <>
          <span className="zp-ring absolute inset-0 rounded-[28%] border-2 border-[#158F66]/50" />
          <span className="zp-ring-2 absolute inset-0 rounded-[28%] border-2 border-[#158F66]/40" />
        </>
      )}

      <div className="relative flex h-full w-full items-center justify-center rounded-[28%] border-2 border-[#0B3D2E] bg-[#158F66] shadow-[0_5px_0_#0B3D2E]">
        <Image
          src="/logo-bg.png"
          alt="ZABU"
          width={size}
          height={size}
          priority
          className="h-[72%] w-[72%] object-contain"
        />
      </div>
    </div>
  );
}

function LanguageOrbit() {
  return (
    <div
      aria-hidden="true"
      className="relative mx-auto h-[300px] w-[300px] shrink-0 xl:h-[340px] xl:w-[340px]"
    >
      <div className="absolute inset-0 rounded-full border-2 border-dashed border-[#158F66]/30" />

      {ORBIT_LOGOS.map((l, i) => (
        <div
          key={l.src}
          className="zp-orbit absolute inset-0"
          style={
            {
              "--d": "36s",
              "--delay": `${-i * 12}s`,
            } as CSSProperties
          }
        >
          <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
            <div
              className="zp-orbit-item"
              style={
                {
                  "--d": "36s",
                  "--delay": `${-i * 12}s`,
                } as CSSProperties
              }
            >
              <Image
                src={l.src}
                alt=""
                width={52}
                height={52}
                className="h-[52px] w-[52px] rounded-full border-2 border-[#0B3D2E] bg-white object-cover shadow-[0_4px_0_#0B3D2E]"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="absolute inset-[20%] rounded-full border-2 border-[#158F66]/15" />

      <div
        className="zp-orbit absolute inset-[20%]"
        style={
          {
            "--d": "22s",
            animationDirection: "reverse",
          } as CSSProperties
        }
      >
        <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D9F36B] ring-2 ring-[#0B3D2E]" />

        <span className="absolute bottom-0 left-1/2 h-2.5 w-2.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#FF7A59] ring-2 ring-[#0B3D2E]" />
      </div>

      <div className="absolute inset-0 grid place-items-center">
        <LogoTile size={88} pulse />
      </div>

      <div className="absolute left-1/2 top-[27%] h-9 w-36 -translate-x-1/2">
        {WELCOME.map((w, i) => (
          <span
            key={w.text}
            dir={w.dir}
            className="zp-word absolute inset-0 flex items-center justify-center rounded-2xl border-2 border-[#0B3D2E] bg-[#D9F36B] text-sm font-black text-[#0B3D2E] shadow-[0_3px_0_#0B3D2E]"
            style={{ animationDelay: `${i * 2.4}s` }}
          >
            {w.text}
          </span>
        ))}
      </div>
    </div>
  );
}

async function LoginContent() {
  await connection();

  const session = await auth();

  // Если пользователь уже авторизован — перенаправляем в его профиль
  if (session?.user?.email) {
    const rawUsername = session.user.name?.trim() || "user";

    const username =
      rawUsername
        .toLowerCase()
        .normalize("NFC")
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/^-|-$/g, "") || "user";

    redirect(`/user/${encodeURIComponent(username)}`);
  }

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#F6F9F7] px-6 py-10 text-[#0B3D2E] sm:px-10">
      <style>{CSS}</style>

      {/* ФОН */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-60">
        <Background />
      </div>

      {/* ГЛАВНАЯ */}
      <Link
        href="/"
        aria-label="Главная"
        className="group absolute left-5 top-5 inline-flex h-10 items-center gap-2 rounded-full border-2 border-[#0B3D2E]/10 bg-white pl-3 pr-4 text-sm font-bold shadow-[0_3px_0_rgba(11,61,46,0.1)] transition hover:-translate-y-0.5 hover:bg-[#D9F36B] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#2EB67D] sm:left-8 sm:top-8"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform group-hover:-translate-x-1"
          aria-hidden="true"
        >
          <path d="M19 12H5" />
          <path d="m12 19-7-7 7-7" />
        </svg>

        Главная
      </Link>

      {/* КОНТЕНТ */}
      <div className="grid w-full max-w-[1200px] items-center gap-12 lg:grid-cols-[1fr_460px] lg:gap-20">
        {/* ЛЕВАЯ ЧАСТЬ */}
        <section className="zp-rise hidden lg:block">
          <h1 className="max-w-[560px] text-[48px] font-black leading-[1.08] tracking-[-0.04em] xl:text-[56px]">
            Открой свой мир
            <br />
            через{" "}
            <span className="inline-block -rotate-2 rounded-2xl bg-[#D9F36B] px-3 pb-1 pt-0.5 shadow-[5px_5px_0_#0B3D2E]">
              языки.
            </span>
          </h1>

          <p className="mt-6 max-w-[440px] text-[17px] font-medium leading-8 text-[#0B3D2E]/65">
            Одно место, чтобы открыть для себя таджикский, персидский и
            английский. Продолжай своё путешествие вместе с ZABU.
          </p>

          <div className="mt-10">
            <LanguageOrbit />
          </div>
        </section>

        {/* КАРТОЧКА ВХОДА */}
        <section
          className="zp-rise w-full rounded-[28px] border-2 border-[#0B3D2E]/10 bg-white p-7 shadow-[0_10px_0_rgba(11,61,46,0.1)] sm:p-9"
          style={{ animationDelay: ".12s" }}
        >
          <div className="mb-7 flex items-center gap-4">
            <LogoTile size={52} pulse />

            <div className="min-w-0">
              <h2 className="text-[26px] font-black leading-tight tracking-[-0.03em]">
                Войти в{" "}
                <span className="inline-block -rotate-2 rounded-lg bg-[#158F66] px-2 pb-0.5 text-white">
                  ZABU
                </span>
              </h2>

              <p className="mt-1.5 text-sm font-medium leading-6 text-[#0B3D2E]/55">
                Введите почту и пароль, чтобы продолжить.
              </p>
            </div>
          </div>

          <LoginForm />
        </section>
      </div>
    </main>
  );
}


export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#F6F9F7]">
          <div className="h-10 w-10 rounded-full border-4 border-[#158F66]/20 border-t-[#158F66] animate-spin" />
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}