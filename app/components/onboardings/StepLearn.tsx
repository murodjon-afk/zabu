import { Check } from "lucide-react";
import { LEARNING_LANGUAGES } from "./constants";
import { ART } from "./Artworks";

/** Приветствие на каждом языке — выскакивает пузырём на карточке */
const WELCOME: Record<string, string> = {
  tg: "Хуш омадед",
  tj: "Хуш омадед",
  fa: "خوش آمدید",
  ir: "خوش آمدید",
  en: "Welcome",
};

/** Лёгкий наклон невыбранных карточек (только от sm) */
const TILT = ["sm:-rotate-1", "sm:rotate-1", "sm:-rotate-1"];

/** Точечная сетка на выбранной зелёной карточке (узор, не градиент-заливка) */
const DOTS = {
  backgroundImage:
    "radial-gradient(rgba(255,255,255,.22) 1.5px, transparent 1.5px)",
  backgroundSize: "24px 24px",
} as const;

export function StepLearn({
  selected,
  onSelect,
  onContinue,
}: {
  selected: string;
  onSelect: (id: string) => void;
  onContinue: () => void;
}) {
  return (
    /*
      Телефон: высота по содержимому, карточки компактные — без скролла.
      От sm: ровно на высоту экрана минус шапка (112px).
    */
    <section className="mx-auto flex w-full max-w-[1100px] flex-col px-3 sm:h-[calc(100dvh-112px)] sm:px-0">
      {/* ЗАГОЛОВОК */}
      <header className="shrink-0 pt-1 text-center sm:pt-3">
        <h1 className="text-[length:clamp(26px,4.6vh,42px)] max-[600px]:text-[30px] font-black leading-[1.15] tracking-[-0.03em] text-[#0B3D2E] sm:text-[length:clamp(24px,4.6vh,46px)] sm:leading-[1.1]">
          Какой{" "}
          <em className="inline-block -rotate-2 rounded-xl bg-[#D9F36B] px-2.5 pb-0.5 not-italic shadow-[3px_3px_0_#0B3D2E] sm:rounded-2xl sm:px-3 sm:shadow-[4px_4px_0_#0B3D2E]">
            язык
          </em>{" "}
          вы хотите
          <br />
          изучать<span className="text-[#158F66]">?</span>
        </h1>
      </header>

      {/* КАРТОЧКИ: на телефоне три строки, от sm — три колонки */}
      <fieldset className="min-h-0 min-w-0 border-0 p-0 py-4 sm:flex sm:flex-1 sm:items-center sm:py-4">
        <legend className="sr-only">Выберите язык, который хотите изучать</legend>

        <div className="grid w-full grid-cols-1 gap-3.5 pb-1 sm:h-full sm:max-h-[520px] sm:grid-cols-3 sm:grid-rows-1 sm:gap-5 sm:pb-2 lg:gap-7">
          {LEARNING_LANGUAGES.map(
            (
              { id, english, native, lang, dir, script, scriptShort, nativeClass, Flag },
              index
            ) => {
              const active = selected === id;
              const Art = ART[id];
              const welcome = WELCOME[lang as string];

              return (
                <label
                  key={id}
                  className="group relative block h-[clamp(92px,15vh,120px)] min-h-0 min-w-0 cursor-pointer sm:h-auto"
                >
                  <input
                    type="radio"
                    name="learning-language"
                    value={id}
                    checked={active}
                    onChange={() => onSelect(id)}
                    className="peer sr-only"
                  />

                  <span
                    style={active ? DOTS : undefined}
                    className={`flex h-full min-h-0 flex-row overflow-hidden rounded-3xl border-2 transition duration-300 motion-reduce:transform-none motion-reduce:transition-none peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-4 peer-focus-visible:outline-[#2EB67D] sm:flex-col ${
                      active
                        ? "border-[#0B3D2E] bg-[#158F66] text-white shadow-[0_6px_0_#0B3D2E] sm:rotate-0 sm:scale-[1.03] sm:shadow-[0_8px_0_#0B3D2E]"
                        : `border-[#E3EBE5] bg-white text-[#0B3D2E] shadow-[0_5px_0_rgba(11,61,46,0.1)] group-hover:-translate-y-0.5 group-hover:border-[#9FCDB7] sm:group-hover:-translate-y-1 ${
                            TILT[index % TILT.length]
                          }`
                    }`}
                  >
                    {/* ИЛЛЮСТРАЦИЯ */}
                    <span className="relative w-[38%] shrink-0 overflow-hidden sm:min-h-0 sm:w-auto sm:flex-1">
                      {Art && (
                        <span className="absolute inset-0 block [&>*]:h-full [&>*]:w-full">
                          <Art />
                        </span>
                      )}

                      {/* пузырь с приветствием */}
                      {welcome && (
                        <span
                          dir={dir}
                          className={`absolute left-3 top-3 z-10 hidden rounded-2xl rounded-bl-md border-2 border-[#0B3D2E] px-3 py-1.5 text-xs font-black shadow-[0_3px_0_#0B3D2E] transition duration-300 motion-reduce:transition-none sm:block ${
                            active
                              ? "scale-110 bg-[#D9F36B] text-[#0B3D2E]"
                              : "bg-white text-[#158F66]"
                          }`}
                        >
                          {welcome}
                        </span>
                      )}

                      {/* флаг-стикер */}
                      <span className="absolute bottom-2 left-2 z-10 overflow-hidden rounded-md border-2 border-white leading-[0] shadow-[0_3px_0_#0B3D2E] sm:bottom-3 sm:left-3 sm:rounded-lg sm:border-[3px]">
                        <Flag />
                      </span>
                    </span>

                    {/* ТЕКСТ */}
                    <span className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 py-2 pl-4 pr-14 sm:flex-none sm:gap-2 sm:px-5 sm:py-4 sm:pr-5 lg:px-6">
                      <span
                        lang={lang}
                        dir={dir}
                        className={`block break-words text-[length:clamp(22px,3.6vh,40px)] font-black leading-tight tracking-[-0.02em] ${
                          dir === "rtl" ? "text-right" : "text-left"
                        } ${nativeClass}`}
                      >
                        {native}
                      </span>

                      <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1 sm:gap-x-3">
                        <span
                          className={`text-xs font-bold sm:text-sm ${
                            active ? "text-white/85" : "text-[#0B3D2E]/65"
                          }`}
                        >
                          {english}
                        </span>
                        <span
                          className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-black transition motion-reduce:transition-none sm:text-xs ${
                            active
                              ? "bg-[#D9F36B] text-[#0B3D2E]"
                              : "bg-[#EAF6F0] text-[#158F66]"
                          }`}
                        >
                          <span className="lg:hidden">{scriptShort}</span>
                          <span className="hidden lg:inline">{script}</span>
                        </span>
                      </span>
                    </span>

                    {/* ГАЛОЧКА: лаймовый бейдж */}
                    <span
                      className={`absolute right-3 top-1/2 z-20 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full border-2 transition duration-300 motion-reduce:transition-none sm:top-3 sm:translate-y-0 ${
                        active
                          ? "scale-100 border-[#0B3D2E] bg-[#D9F36B] text-[#0B3D2E]"
                          : "scale-90 border-[#0B3D2E]/15 bg-white text-transparent group-hover:border-[#158F66]"
                      }`}
                    >
                      <Check size={16} strokeWidth={3.5} />
                    </span>
                  </span>
                </label>
              );
            }
          )}
        </div>
      </fieldset>

      {/* КНОПКА: основная объёмная */}
      <div className="shrink-0 pb-4 pt-1 text-center sm:pb-5">
        <button
          type="button"
          onClick={onContinue}
          className="group/btn inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#158F66] px-6 text-sm font-extrabold text-white shadow-[0_6px_0_#0B3D2E] transition hover:translate-y-[2px] hover:bg-[#0F7352] hover:shadow-[0_4px_0_#0B3D2E] focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#2EB67D] active:translate-y-[4px] active:shadow-[0_2px_0_#0B3D2E] motion-reduce:transform-none motion-reduce:transition-none disabled:translate-y-0 disabled:cursor-not-allowed disabled:bg-[#E2EBE5] disabled:text-[#0B3D2E]/35 disabled:shadow-none sm:w-auto sm:min-w-[240px] sm:px-8"
        >
          Продолжить
          <span className="transition-transform group-hover/btn:translate-x-1 motion-reduce:transition-none">
            →
          </span>
        </button>
      </div>
    </section>
  );
}