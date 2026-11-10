import { Check } from "lucide-react";
import { LEARNING_LANGUAGES, h1Class, subClass, primaryBtn } from "./constants";
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
      Ровно на высоту экрана минус шапка (88px на телефоне, 112px от sm),
      поэтому страница не скроллится. Всё внутри сжимается через flex/clamp.
      min-h — защита от совсем низких окон (там скролл всё же появится).
    */
    <section className="mx-auto flex h-[calc(100dvh-88px)] min-h-[470px] w-full max-w-[1100px] flex-col px-3 sm:h-[calc(100dvh-112px)] sm:px-0">
      {/* ЗАГОЛОВОК */}
      <header className="shrink-0 pt-1 text-center sm:pt-3">
        <h1
          className={`${h1Class} !text-[length:clamp(24px,4.6vh,46px)] !leading-[1.1]`}
        >
          Какой <em className="italic text-[#16865B]">язык</em> вы хотите
          <br />
          изучать?
        </h1>
        <div className="hidden [@media(min-height:680px)]:block">
          <p className={subClass}>Выберите язык, который хотите изучать.</p>
        </div>
      </header>

      {/* КАРТОЧКИ: на телефоне три строки, от sm — три колонки */}
      <fieldset className="flex min-h-0 min-w-0 flex-1 items-center border-0 p-0 py-3 sm:py-4">
        <legend className="sr-only">Выберите язык, который хотите изучать</legend>

        <div className="grid h-full max-h-[520px] w-full grid-cols-1 grid-rows-[repeat(3,minmax(0,1fr))] gap-3 pb-2 sm:grid-cols-3 sm:grid-rows-1 sm:gap-5 lg:gap-7">
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
                  className="group relative block min-h-0 min-w-0 cursor-pointer"
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
                    className={`flex h-full min-h-0 flex-row overflow-hidden rounded-3xl border-2 transition duration-300 motion-reduce:transform-none motion-reduce:transition-none peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-4 peer-focus-visible:outline-[#2EB67D] sm:flex-col ${
                      active
                        ? "border-[#0B3D2E] bg-[#158F66] text-white shadow-[0_8px_0_#0B3D2E] sm:rotate-0 sm:scale-[1.03]"
                        : `border-[#E6E4DA] bg-white text-[#0B3D2E] shadow-[0_6px_0_rgba(11,61,46,0.12)] group-hover:-translate-y-1 group-hover:border-[#9FCDB7] ${
                            TILT[index % TILT.length]
                          }`
                    }`}
                  >
                    {/* ИЛЛЮСТРАЦИЯ */}
                    <span className="relative w-[40%] shrink-0 overflow-hidden sm:min-h-0 sm:w-auto sm:flex-1">
                      {Art && (
                        <span className="absolute inset-0 block [&>*]:h-full [&>*]:w-full">
                          <Art />
                        </span>
                      )}

                      {/* пузырь с приветствием */}
                      {welcome && (
                        <span
                          dir={dir}
                          className={`absolute left-3 top-3 z-10 hidden rounded-2xl rounded-bl-md px-3 py-1.5 text-xs font-black shadow-[0_3px_0_rgba(11,61,46,0.25)] transition duration-300 sm:block ${
                            active
                              ? "scale-110 bg-[#D9F36B] text-[#0B3D2E]"
                              : "bg-white/95 text-[#158F66]"
                          }`}
                        >
                          {welcome}
                        </span>
                      )}

                      {/* флаг-стикер */}
                      <span className="absolute bottom-2 left-2 z-10 overflow-hidden rounded-md border-2 border-white leading-[0] shadow-[0_3px_8px_-2px_rgba(20,35,28,0.45)] sm:bottom-3 sm:left-3 sm:rounded-lg sm:border-[3px]">
                        <Flag />
                      </span>
                    </span>

                    {/* ТЕКСТ */}
                    <span className="flex min-w-0 flex-1 flex-col justify-center gap-1 py-2 pl-4 pr-12 sm:flex-none sm:gap-2 sm:px-5 sm:py-4 lg:px-6">
                      <span
                        lang={lang}
                        dir={dir}
                        className={`block break-words text-[length:clamp(22px,3.6vh,40px)] leading-tight tracking-[-0.01em] ${
                          dir === "rtl" ? "text-right" : "text-left"
                        } ${nativeClass}`}
                      >
                        {native}
                      </span>

                      <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <span
                          className={`text-xs font-bold sm:text-sm ${
                            active ? "text-white/85" : "text-[#55625A]"
                          }`}
                        >
                          {english}
                        </span>
                        <span
                          className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-[10px] font-bold transition sm:text-xs ${
                            active
                              ? "bg-white/20 text-white"
                              : "bg-[#EAF6F0] text-[#158F66]"
                          }`}
                        >
                          <span className="lg:hidden">{scriptShort}</span>
                          <span className="hidden lg:inline">{script}</span>
                        </span>
                      </span>
                    </span>

                    {/* ГАЛОЧКА */}
                    <span
                      className={`absolute right-3 top-3 z-20 grid h-8 w-8 place-items-center rounded-full border-2 transition duration-300 sm:h-9 sm:w-9 ${
                        active
                          ? "scale-100 border-[#0B3D2E] bg-[#D9F36B] text-[#0B3D2E]"
                          : "scale-90 border-[#0B3D2E]/15 bg-white/80 text-transparent group-hover:border-[#158F66]"
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

      {/* КНОПКА */}
      <div className="shrink-0 pb-3 pt-1 text-center sm:pb-5">
        <button type="button" onClick={onContinue} className={primaryBtn}>
          Продолжить
          <span className="transition-transform group-hover/btn:translate-x-1">
            →
          </span>
        </button>
      </div>
    </section>
  );
}