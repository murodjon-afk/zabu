
"use client";

import {
  ArrowUpRight,
  Coins,
  GraduationCap,
  Star,
} from "lucide-react";
import Image from "next/image";
import {HomeCardsSkeleton} from "../../Skeletons"
import { fmt, num } from "../../constants";
import type { DashboardCtx } from "../../types";

const CARD =
  "group relative flex min-h-[155px] w-full flex-col justify-between overflow-hidden rounded-[24px] border border-[#0B3D2E]/[0.07] bg-white p-4 text-left shadow-[0_4px_0_rgba(11,61,46,0.07),0_8px_20px_rgba(11,61,46,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#158F66]/30 hover:shadow-[0_6px_0_rgba(11,61,46,0.08),0_14px_24px_rgba(11,61,46,0.09)] active:translate-y-0.5 motion-reduce:transition-none md:min-h-[170px] md:p-5";

const HOMEWORK_CARD =
  "group relative flex min-h-[155px] w-full flex-col justify-between overflow-hidden rounded-[24px] border border-[#A72E43]/30 bg-[#E95757] p-4 text-left text-white shadow-[0_5px_0_#8F263A,0_10px_20px_rgba(143,38,58,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_7px_0_#8F263A,0_15px_24px_rgba(143,38,58,0.2)] active:translate-y-0.5 motion-reduce:transition-none md:min-h-[170px] md:p-5";

const ICON_BADGE =
  "grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-[#0B3D2E]/10 bg-[#D9F36B] text-[#0B3D2E]";

export function HomeCards({ ctx }: { ctx: DashboardCtx }) {
const {
  p,
  currentUser,
  loading,
  openModal,
  closeModal,
  goTo,
  triggerToast,
} = ctx;

  const coins = num(currentUser?.coins);

  const lessonsPct = Math.min(
    100,
    Math.max(0, Number(p.lessonsPct) || 0)
  );
if (loading && !currentUser) {
  return <HomeCardsSkeleton />;
}
  return (
    <section className="space-y-4 md:space-y-5">

      {/* ЗАГОЛОВОК */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-black tracking-tight text-[#0B3D2E] md:text-2xl">
            Главное<span className="text-[#158F66]">.</span>
          </h2>
          <p className="mt-0.5 text-xs font-medium text-[#0B3D2E]/45">
            Твои результаты и достижения
          </p>
        </div>

        <span className="rounded-full bg-[#EAF6F0] px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-[#158F66]">
          ZABU
        </span>
      </div>

      {/* КАРТОЧКИ */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 xl:gap-5">

        {/* ДОМАШНИЕ ЗАДАНИЯ — КРАСНАЯ КАРТОЧКА */}
        <button
          type="button"
          onClick={() =>
            openModal(
              "Домашние задания",
              p.homework > 0 ? (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
                    <h4 className="mb-1 font-bold text-rose-900">
                      Активных заданий: {p.homework}
                    </h4>
                    <p className="text-xs text-slate-600">
                      Выполните их, чтобы получить баллы.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      closeModal();
                      goTo("lessons");
                    }}
                    className="w-full rounded-full bg-[#158F66] py-3 font-black text-white transition hover:bg-[#0B3D2E]"
                  >
                    Перейти к заданиям
                  </button>
                </div>
              ) : (
                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-[#0B3D2E]">
                  Сейчас у вас нет активных домашних заданий.
                  Отличная работа!
                </div>
              )
            )
          }
          className={HOMEWORK_CARD}
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.15) 1.5px, transparent 1.5px)",
            backgroundSize: "19px 19px",
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full border-[16px] border-white/[0.08]"
          />

          <div className="relative z-10 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[10px] font-black uppercase tracking-wider text-white/75">
                Домашнее задание
              </span>

              <h3 className="mt-2 text-lg font-black leading-tight md:text-xl">
                {p.homework > 0
                  ? `${p.homework} заданий`
                  : "Нет заданий"}
              </h3>
            </div>

            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-white/20 bg-white/15 text-white transition-transform group-hover:rotate-6">
              <ArrowUpRight size={19} />
            </span>
          </div>

          <div className="relative z-10 mt-4 flex items-center justify-between gap-2">
            <span className="text-[10px] font-bold text-white/80 md:text-xs">
              {p.homework > 0
                ? "Нажмите, чтобы открыть"
                : "Всё сдано вовремя"}
            </span>

            <span className="h-1.5 w-7 rounded-full bg-white/70" />
          </div>
        </button>

        {/* МОНЕТЫ */}
        <button
          type="button"
          onClick={() =>
            triggerToast(`У вас ${fmt(coins)} монет 🪙`)
          }
          className={CARD}
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B3D2E]/45 md:text-xs">
                Монеты
              </span>

              <span className={ICON_BADGE}>
                <Coins size={19} />
              </span>
            </div>

            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-[#158F66] md:text-3xl">
                {fmt(coins)}
              </span>

              <Image
                src="/icons.webp"
                alt=""
                width={38}
                height={38}
                className="h-9 w-9 object-contain"
              />
            </div>
          </div>

          <span className="mt-3 inline-flex self-start rounded-full border border-[#158F66]/10 bg-[#EAF6F0] px-2.5 py-1 text-[10px] font-bold text-[#158F66] md:text-xs">
            Ваш баланс
          </span>
        </button>

        {/* УРОКИ */}
        <button
          type="button"
          onClick={() => goTo("lessons")}
          className={CARD}
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B3D2E]/45 md:text-xs">
                Пройдено уроков
              </span>

              <span className={ICON_BADGE}>
                <GraduationCap size={20} />
              </span>
            </div>

            <div className="mt-3 text-2xl font-black tracking-tight text-[#0B3D2E] md:text-3xl">
              {p.lessonsDone}
              <span className="text-[#0B3D2E]/30">
                {" "}/ {p.lessonsTotal}
              </span>
            </div>
          </div>

          <div className="mt-3">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <span className="text-[10px] font-semibold text-[#0B3D2E]/45 md:text-xs">
                Прогресс курса
              </span>

              <span className="text-xs font-black text-[#158F66]">
                {lessonsPct}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[#EAF6F0]">
              <div
                className="h-full rounded-full bg-[#158F66] transition-[width] duration-700 motion-reduce:transition-none"
                style={{ width: `${lessonsPct}%` }}
              />
            </div>
          </div>
        </button>

        {/* XP / БАЛЛЫ */}
        <button
          type="button"
          onClick={() =>
            triggerToast(`Ваш опыт: ${fmt(p.scores)} XP`)
          }
          className={CARD}
        >
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0B3D2E]/45 md:text-xs">
                Баллы опыта
              </span>

              <span className={ICON_BADGE}>
                <Star size={19} />
              </span>
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-2xl font-black tracking-tight text-[#158F66] md:text-3xl">
              {fmt(p.scores)}

              <Image
                src="/xp.webp"
                alt=""
                width={38}
                height={38}
                className="h-9 w-9 shrink-0 object-contain"
              />
            </div>
          </div>

          <span className="mt-3 inline-flex self-start rounded-full border border-[#D9F36B] bg-[#F6FBE7] px-2.5 py-1 text-[10px] font-bold text-[#0B3D2E] md:text-xs">
            XP · Опыт
          </span>
        </button>

      </div>
    </section>
  );
}
