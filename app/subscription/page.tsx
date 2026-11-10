"use client";

import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Bot,
  Gamepad2,
  ClipboardList,
  Library,
  User,
  BadgeCheck,
  BarChart3,
  Award,
  Infinity as InfinityIcon,
  GraduationCap,
  PenLine,
  Mic,
  Volume2,
  Target,
  SearchCheck,
  Zap,
  Clock,
  Loader2,
} from "lucide-react";

/* ============================================================
   ЦЕНТРАЛИЗОВАННАЯ КОНФИГУРАЦИЯ
   Тарифы, цены, функции и тексты меняются только здесь.
   ============================================================ */

type PlanId = "free" | "pro" | "plus";

interface Feature {
  icon: LucideIcon;
  text: string;
}

interface Plan {
  id: PlanId;
  name: string;
  title: string;
  description: string;
  price: number;
  oldPrice?: number; // если задано — показывается зачёркнутым (скидка)
  temporary?: boolean; // временная цена
  features: Feature[];
  cta: string;
  ctaCurrent: string;
  highlighted?: boolean;
  note?: string;
}

const CURRENCY = "$";

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Обычный",
    title: "Начни бесплатно",
    description: "Начни изучать языки совершенно бесплатно.",
    price: 0,
    features: [
      { icon: BookOpen, text: "1 урок в день" },
      { icon: Bot, text: "Базовая практика" },
      { icon: Gamepad2, text: "Игровые тренажёры" },
      { icon: ClipboardList, text: "Домашние задания" },
      { icon: Library, text: "Базовый словарь" },
      { icon: User, text: "Обычная аватарка" },
    ],
    cta: "Начать бесплатно",
    ctaCurrent: "Ваш текущий план",
  },
  {
    id: "pro",
    name: "Pro",
    title: "Учись быстрее",
    description: "Практикуй язык каждый день.",
    price: 4,
    oldPrice: 7,
    temporary: true,
    features: [
      { icon: BookOpen, text: "До 5 уроков в день" },
      { icon: Bot, text: "ИИ-практика с интерактивными диалогами" },
      { icon: Gamepad2, text: "Все игровые тренажёры" },
      { icon: ClipboardList, text: "Домашние задания" },
      { icon: Library, text: "Расширенный словарь" },
      { icon: BarChart3, text: "Расширенная статистика обучения" },
      { icon: Award, text: "Сертификаты за прохождение тестов" },
      { icon: BadgeCheck, text: "Значок PRO возле аватарки" },
    ],
    cta: "Перейти на Pro",
    ctaCurrent: "Ваш текущий план",
    highlighted: true,
    note: "Временная цена. Скидка действует ограниченное время, затем подписка Pro будет стоить 7 $ в месяц. Отменить можно в любое время.",
  },
  {
    id: "plus",
    name: "Plus",
    title: "Максимальный прогресс",
    description: "Персональный ИИ-наставник и подготовка к экзаменам.",
    price: 10,
    features: [
      { icon: Zap, text: "Все функции Pro" },
      { icon: InfinityIcon, text: "Неограниченное число уроков в день" },
      { icon: GraduationCap, text: "Подготовка к IELTS" },
      { icon: PenLine, text: "Проверка Writing" },
      { icon: Mic, text: "Голосовая практика с ИИ" },
      { icon: Volume2, text: "Проверка произношения" },
      { icon: Target, text: "Персональная программа обучения" },
      { icon: SearchCheck, text: "Детальный анализ ошибок" },
      { icon: BadgeCheck, text: "Значок PLUS возле аватарки" },
    ],
    cta: "Получить Plus",
    ctaCurrent: "Ваш текущий план",
  },
];

const TEXT = {
  heading: "Выбери свой план обучения",
  perMonth: "/ месяц",
  temporary: "Временная цена",
};

/* ============================================================
   ОБРАБОТЧИК — точка подключения реальной оплаты
   ============================================================ */

async function handleSelectPlan(planId: PlanId): Promise<void> {
  // TODO: подключить реальную систему оплаты.
  console.info("[ZABU] select plan:", planId);
  await new Promise((r) => setTimeout(r, 600));
}

/* ============================================================
   КОМПОНЕНТЫ
   ============================================================ */

function Price({ plan }: { plan: Plan }) {
  return (
    <p className="flex items-baseline gap-2 text-[#0B3D2E]">
      {plan.oldPrice !== undefined && (
        <span className="flex items-baseline text-[#0B3D2E]/40 line-through decoration-2">
          <span className="mr-0.5 text-xs align-super">{CURRENCY}</span>
          <span className="text-2xl">{plan.oldPrice}</span>
        </span>
      )}
      <span className="flex items-baseline">
        <span className="mr-0.5 self-start pt-1 text-xs">{CURRENCY}</span>
        <span className="text-4xl font-medium leading-none">{plan.price}</span>
      </span>
      <span className="ml-1 text-sm text-[#0B3D2E]/60">{TEXT.perMonth}</span>
    </p>
  );
}

function PlanCard({
  plan,
  currentPlan,
  pendingId,
  onSelect,
}: {
  plan: Plan;
  currentPlan: PlanId;
  pendingId: PlanId | null;
  onSelect: (id: PlanId) => void;
}) {
  const isCurrent = currentPlan === plan.id;
  const pending = pendingId === plan.id;

  const card = plan.highlighted
    ? "border-[#158F66] bg-[#F0F9F4] shadow-[0_6px_0_0_rgba(21,143,102,0.18)]"
    : "border-[#0B3D2E]/10 bg-white shadow-[0_4px_0_0_rgba(11,61,46,0.06)]";

  const button = isCurrent
    ? "border border-[#0B3D2E]/15 bg-white text-[#0B3D2E]/50 cursor-default"
    : plan.highlighted
    ? "bg-[#158F66] text-white hover:bg-[#0B3D2E]"
    : "bg-[#0B3D2E] text-white hover:bg-[#158F66]";

  return (
    <article className={`flex flex-col rounded-[28px] border-2 p-6 text-[#0B3D2E] ${card}`}>
      <div className="flex h-7 items-center justify-between">
        <h2 className="text-[15px] font-semibold">{plan.name}</h2>
        {plan.temporary && (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#D9F36B] px-2.5 py-1 text-[11px] font-semibold text-[#0B3D2E]">
            <Clock size={12} aria-hidden /> {TEXT.temporary}
          </span>
        )}
      </div>

      <h3 className="mt-4 text-[22px] font-semibold leading-tight">{plan.title}</h3>
      <p className="mt-2 min-h-[44px] text-sm leading-snug text-[#0B3D2E]/60">{plan.description}</p>

      <button
        disabled={isCurrent || pending}
        onClick={() => onSelect(plan.id)}
        className={`mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#158F66] active:translate-y-px ${button}`}
      >
        {pending && <Loader2 size={16} className="animate-spin" aria-hidden />}
        {isCurrent ? plan.ctaCurrent : plan.cta}
      </button>

      <div className="mt-6">
        <Price plan={plan} />
      </div>

      <ul className="mt-6 space-y-3.5">
        {plan.features.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-start gap-3 text-[13.5px] leading-snug">
            <Icon size={18} strokeWidth={1.75} className="mt-px shrink-0 text-[#158F66]" aria-hidden />
            <span>{text}</span>
          </li>
        ))}
      </ul>

      {plan.note && (
        <p className="mt-auto pt-8 text-[11px] leading-snug text-[#0B3D2E]/50">{plan.note}</p>
      )}
    </article>
  );
}

/* ============================================================
   СТРАНИЦА
   ============================================================ */

export default function Subscriptions({ currentPlan = "free" }: { currentPlan?: PlanId }) {
  // currentPlan позже придёт из данных пользователя.
  const [pendingId, setPendingId] = useState<PlanId | null>(null);

  const onSelect = async (id: PlanId) => {
    setPendingId(id);
    try {
      await handleSelectPlan(id);
    } finally {
      setPendingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-[#F3F4F2] px-5 py-14 sm:py-20">
      <h1 className="text-center text-3xl font-semibold tracking-tight text-[#0B3D2E] sm:text-4xl">
        {TEXT.heading}
      </h1>

      <section aria-label="Тарифы" className="mx-auto mt-12 grid max-w-5xl items-stretch gap-5 md:grid-cols-3">
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            currentPlan={currentPlan}
            pendingId={pendingId}
            onSelect={onSelect}
          />
        ))}
      </section>
    </main>
  );
}