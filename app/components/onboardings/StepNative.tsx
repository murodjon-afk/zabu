
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { getNativeOptions } from "./constants";

type Props = {
  learning: string;
  selected: string | null;
  onSelect: (id: string) => void;
  onBack: () => void;
  onContinue: () => void;
};

export function StepNative({
  learning,
  selected,
  onSelect,
  onBack,
  onContinue,
}: Props) {
  const options = getNativeOptions(learning);

  return (
    <section
      aria-labelledby="native-title"
      className="mx-auto flex h-[calc(100dvh-88px)] min-h-[470px] w-full max-w-[880px] flex-col px-3 sm:h-[calc(100dvh-112px)] sm:px-0"
    >
   <header className="shrink-0 text-center">
  <h1
    id="native-title"
    className="text-[length:clamp(26px,4.6vh,42px)] max-[600px]:text-[30px] font-black leading-[1.1] tracking-[-0.03em] text-[#0B3D2E]"
  >
    Выберите язык, на котором{" "}
    <mark className="inline-block -rotate-2 rounded-xl bg-[#D9F36B] px-2.5 pb-0.5 text-inherit shadow-[3px_3px_0_#0B3D2E] sm:px-3 sm:shadow-[4px_4px_0_#0B3D2E]">
      объяснять
    </mark>
    <span className="text-[#158F66]">?</span>
  </h1>
</header>

      <fieldset className="min-h-0 min-w-0 flex-1 border-0 p-0">
        <legend className="sr-only">Выберите язык объяснений</legend>

        <ul className="flex h-full flex-col justify-center gap-2.5 py-3 sm:gap-3.5 lg:gap-4">
          {options.map((option) => {
            const {
              id,
              english,
              native,
              lang,
              dir,
              font,
              tint,
              glyph,
              glyphFont,
              glyphColor,
              Flag,
            } = option;

            const active = selected === id;

            return (
              <li key={id} className="min-h-[52px] max-h-[104px] min-w-0 flex-1">
                <label className="group block h-full cursor-pointer">
                  <input
                    type="radio"
                    name="native-language"
                    value={id}
                    checked={active}
                    onChange={() => onSelect(id)}
                    className="peer sr-only"
                  />

                  <span
                    style={{ backgroundColor: active ? "#158F66" : tint }}
                    className={`relative flex h-full items-center gap-3 overflow-hidden rounded-2xl border-2 px-3.5 transition duration-300 motion-reduce:transition-none peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#2EB67D] sm:gap-4 sm:rounded-3xl sm:px-5 lg:gap-6 lg:px-8 ${
                      active
                        ? "border-[#0B3D2E] text-white shadow-[0_6px_0_#0B3D2E] sm:scale-[1.015]"
                        : "border-[#E3EBE5] text-[#0B3D2E] shadow-[0_5px_0_rgba(11,61,46,0.1)] group-hover:-translate-y-0.5 group-hover:border-[#9FCDB7]"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      style={{ color: active ? "#fff" : glyphColor }}
                      className={`pointer-events-none absolute -bottom-3 right-14 select-none text-[56px] leading-none opacity-30 sm:-bottom-4 sm:right-20 sm:text-[80px] lg:-bottom-6 lg:right-28 lg:text-[120px] ${glyphFont} ${
                        active ? "opacity-20" : ""
                      }`}
                    >
                      {glyph}
                    </span>

                    <span className="relative flex w-9 shrink-0 justify-center overflow-hidden rounded-md border-2 border-white leading-[0] shadow-[0_3px_8px_-2px_rgba(20,35,28,0.45)] sm:w-12 sm:rounded-lg sm:border-[3px] lg:w-[72px]">
                      <Flag />
                    </span>

                    <span className="relative flex min-w-0 flex-1 flex-col justify-center text-left">
                      <span
                        lang={lang}
                        dir={dir}
                        className={`break-words text-[length:clamp(18px,3.4vh,34px)] leading-[1.15] tracking-[-0.01em] ${font}`}
                      >
                        {native}
                      </span>

                      <small
                        className={`mt-0.5 text-[11px] font-bold sm:text-[13px] lg:text-[15px] ${
                          active ? "text-white/80" : "text-[#55625A]"
                        }`}
                      >
                        {english}
                      </small>
                    </span>

                    <span
                      aria-hidden="true"
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
              </li>
            );
          })}
        </ul>
      </fieldset>

      <footer className="flex shrink-0 items-center justify-center gap-3 pb-3 pt-1 sm:pb-5">
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
      </footer>
    </section>
  );
}
