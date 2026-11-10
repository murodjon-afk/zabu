import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { GOALS, type GoalId, h1Class, subClass } from "./constants";

const ICON_PATHS: Record<GoalId, string[]> = {
  beginner: [
    "M12 21V11",
    "M12 15C5 15 4 10 4 7c5 0 8 2 8 8Z",
    "M12 12c0-5 3-8 8-8 0 5-2 8-8 8Z",
    "M5 21h14",
  ],

  alphabet: [
    "M5 4.5A2.5 2.5 0 0 1 7.5 2H20v17H7.5A2.5 2.5 0 0 0 5 21.5Z",
    "M5 4.5v17",
    "M9 7h7",
    "M10 14l2-5 2 5",
    "M10.8 12h2.4",
  ],

  understand: [
    "M3 12a9 9 0 0 1 18 0",
    "M2.5 11h4v7h-2a2 2 0 0 1-2-2Z",
    "M17.5 11h4v5a2 2 0 0 1-2 2h-2Z",
    "M18 19c-.7 1.5-2 2-4 2h-2",
  ],

  speaking: [
    "M20 11.5a7.5 7.5 0 0 1-7.5 7.5H8l-4 2v-5.5A7.5 7.5 0 1 1 20 11.5Z",
    "M8 11h.01",
    "M12 11h.01",
    "M16 11h.01",
  ],

  fluent: [
    "m12 2 2.9 6 6.6.9-4.8 4.7 1.1 6.6-5.8-3.1-5.8 3.1 1.1-6.6-4.8-4.7 6.6-.9Z",
    "m9.5 11.5 1.7 1.7 3.5-3.5",
  ],
};

export function GoalIcon({
  id,
  color,
  className = "",
}: {
  id: GoalId;
  color: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {ICON_PATHS[id].map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

export function StepGoal({
  selected,
  onSelect,
  onBack,
  onContinue,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    /*
      Ровно на высоту экрана минус шапка (88px на телефоне, 112px от sm):
      пять строк делят свободное место (flex-1), скролла нет.
      Фон остаётся тот, что у родителя.
    */
    <section className="mx-auto flex h-[calc(100dvh-88px)] min-h-[470px] w-full max-w-[880px] flex-col px-3 sm:h-[calc(100dvh-112px)] sm:px-0">
      {/* ЗАГОЛОВОК */}
      <header className="shrink-0 pt-1 text-center sm:pt-3">
  

        <h1
          className={`${h1Class} !text-[length:clamp(22px,4.2vh,42px)] !leading-[1.2]`}
        >
          Насколько хорошо вы{" "}
          <em className="inline-block -rotate-2 rounded-xl bg-[#D9F36B] px-2.5 pb-0.5 not-italic text-[#0B3D2E] shadow-[3px_3px_0_#0B3D2E] sm:px-3 sm:shadow-[4px_4px_0_#0B3D2E]">
            знаете язык
          </em>
          ?
        </h1>

        <div className="hidden [@media(min-height:720px)]:block">
          <p className={subClass}>
            Выберите свой текущий уровень. Мы адаптируем обучение под ваши
            знания.
          </p>
        </div>
      </header>

      {/* СТРОКИ УРОВНЕЙ */}
      <fieldset className="min-h-0 min-w-0 flex-1 border-0 p-0">
        <legend className="sr-only">Выберите уровень владения языком</legend>

        <div className="flex h-full flex-col justify-center gap-2.5 py-3 sm:gap-3.5 lg:gap-4">
          {GOALS.map(({ id, title, tint, color }, index) => {
            const active = selected === id;

            return (
              <label
                key={id}
                className="group relative block min-h-[52px] min-w-0 max-h-[104px] flex-1 cursor-pointer"
              >
                <input
                  type="radio"
                  name="learning-level"
                  value={id}
                  checked={active}
                  onChange={() => onSelect(id)}
                  className="peer sr-only"
                />

                <span
                  style={active ? undefined : { backgroundColor: tint }}
                  className={`relative flex h-full w-full items-center gap-3 overflow-hidden rounded-2xl border-2 px-3.5 transition duration-300 motion-reduce:transform-none motion-reduce:transition-none peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#2EB67D] sm:gap-4 sm:rounded-3xl sm:px-5 lg:gap-6 lg:px-8 ${
                    active
                      ? "border-[#0B3D2E] bg-[#158F66] text-white shadow-[0_6px_0_#0B3D2E] sm:scale-[1.015]"
                      : "border-[#E3EBE5] text-[#0B3D2E] shadow-[0_5px_0_rgba(11,61,46,0.1)] group-hover:-translate-y-0.5 group-hover:border-[#9FCDB7]"
                  }`}
                >
                  {/* фоновая иконка */}
                  <GoalIcon
                    id={id}
                    color={active ? "#ffffff" : color}
                    className={`pointer-events-none absolute -bottom-3 right-12 h-[64px] w-[64px] sm:-bottom-4 sm:right-16 sm:h-[96px] sm:w-[96px] lg:-bottom-6 lg:right-24 lg:h-[140px] lg:w-[140px] ${
                      active ? "opacity-20" : "opacity-[0.22]"
                    }`}
                  />

                  {/* основная иконка */}
                  <span
                    className={`relative grid h-9 w-9 shrink-0 place-items-center rounded-xl transition duration-300 sm:h-12 sm:w-12 sm:rounded-2xl lg:h-[60px] lg:w-[60px] ${
                      active
                        ? "bg-[#D9F36B] shadow-[0_3px_0_#0B3D2E]"
                        : "bg-white shadow-[0_3px_0_rgba(11,61,46,0.12)]"
                    }`}
                  >
                    <GoalIcon
                      id={id}
                      color={active ? "#0B3D2E" : color}
                      className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8"
                    />
                  </span>

                  {/* название */}
                  <span className="relative flex min-w-0 flex-1 flex-col justify-center">
                    <span className="block break-words text-left font-[family-name:var(--f-news)] text-[length:clamp(17px,3.2vh,32px)] leading-[1.15] tracking-[-0.01em]">
                      {title}
                    </span>
                  </span>

                  {/* шкала уровня: чем ниже строка, тем выше уровень */}
                  <span
                    aria-hidden="true"
                    className="relative hidden items-end gap-1 sm:flex"
                  >
                    {GOALS.map((g, i) => (
                      <i
                        key={g.id}
                        style={{ height: 8 + i * 5 }}
                        className={`block w-1.5 rounded-full transition-colors duration-300 lg:w-2 ${
                          i <= index
                            ? active
                              ? "bg-[#D9F36B]"
                              : "bg-[#158F66]"
                            : active
                            ? "bg-white/30"
                            : "bg-[#0B3D2E]/15"
                        }`}
                      />
                    ))}
                  </span>

                  {/* галочка */}
                  <span
                    className={`relative grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition duration-300 sm:h-9 sm:w-9 ${
                      active
                        ? "border-[#0B3D2E] bg-[#D9F36B] text-[#0B3D2E]"
                        : "scale-90 border-[#0B3D2E]/15 bg-white/80 text-transparent group-hover:border-[#158F66]"
                    }`}
                  >
                    <Check className="h-4 w-4 stroke-[3.5]" />
                  </span>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* КНОПКИ */}
      <div className="shrink-0 pb-3 pt-1 text-center sm:pb-5">
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border-2 border-[#0B3D2E]/10 bg-white px-5 text-xs font-bold text-[#0B3D2E] transition hover:bg-[#EAF6F0] active:scale-[0.98] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#2EB67D] sm:h-12 sm:px-6 sm:text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Назад
          </button>

          <button
            type="button"
            onClick={onContinue}
            disabled={!selected}
            className="inline-flex h-11 min-w-[170px] items-center justify-center gap-2 rounded-full bg-[#158F66] px-6 text-xs font-extrabold text-white shadow-[0_6px_0_#0B3D2E] transition hover:translate-y-[2px] hover:shadow-[0_4px_0_#0B3D2E] active:translate-y-[4px] active:shadow-[0_2px_0_#0B3D2E] focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#2EB67D] disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-[#E2EBE5] disabled:text-[#0B3D2E]/35 disabled:shadow-none sm:h-12 sm:min-w-[210px] sm:px-8 sm:text-sm"
          >
            Продолжить
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <p
          className="mt-3 text-xs font-medium text-[#0B3D2E]/50 lg:text-sm [@media(max-height:700px)]:hidden"
          aria-live="polite"
        >
          {selected
            ? "Уровень можно поменять в любой момент."
            : "Выберите свой уровень, чтобы продолжить."}
        </p>
      </div>
    </section>
  );
}