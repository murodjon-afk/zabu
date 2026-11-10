import type { ReactElement } from "react";
import type { LangId } from "./constants";

const artProps = {
  viewBox: "0 0 396 188",
  preserveAspectRatio: "xMidYMid slice",
  "aria-hidden": true,
  className: "block h-full w-full",
} as const;

export function TajikArt() {
  return (
    <svg {...artProps} viewBox="0 0 396 188">
      {/* Background */}
      <rect width="396" height="188" fill="#F3ECDD" />

      {/* Sun */}
      <circle cx="320" cy="38" r="19" fill="none" stroke="#C9A24B" strokeWidth="1.2" />

      {/* Distant mountains */}
      <path
        d="M0 112 L35 88 L62 96 L105 58 L130 77 L166 35 L195 68 L225 47 L260 82 L292 57 L335 91 L365 65 L396 100 V188 H0Z"
        fill="#E5D5B6"
      />
      <path
        d="M105 58 L119 67 L130 77 L166 35 L153 65 L166 56 L180 75 L195 68 L225 47 L212 72 L230 65 L260 82 L292 57 L278 85 L310 91 L335 91 L365 65 L350 98 L396 100 V188 H0Z"
        fill="#D7C49E"
        opacity=".65"
      />

      {/* Mountain snow */}
      <path d="M153 65 L166 35 L180 55 L172 52 L166 61 L160 55Z" fill="#FAF6EA" />

      {/* Background trees */}
      <path d="M0 157 Q10 135 20 157 Q30 125 42 157 Q55 132 66 157 V188 H0Z" fill="#C9B17F" />
      <path d="M340 160 Q350 130 361 160 Q375 125 386 160 L396 145 V188 H340Z" fill="#C9B17F" />

      {/* Registan - left madrasa */}
      <g stroke="#A98A4C" strokeWidth=".7">
        <rect x="22" y="103" width="105" height="70" fill="#D8BE8E" />
        <rect x="29" y="93" width="91" height="80" fill="#E6D2A9" />

        {/* Left portal */}
        <rect x="45" y="91" width="47" height="82" fill="#C6A66D" />
        <path d="M50 173 V123 Q68 88 87 123 V173Z" fill="#8E7045" />
        <path d="M53 173 V125 Q68 98 84 125 V173" fill="none" stroke="#E9D6AA" strokeWidth="2" />

        {/* Left decorative panels */}
        <rect x="31" y="101" width="11" height="60" fill="none" stroke="#B89B62" />
        <rect x="96" y="101" width="12" height="60" fill="none" stroke="#B89B62" />
        <path
          d="M33 112 L38 107 L41 112 L38 117Z M98 112 L102 107 L106 112 L102 117Z"
          fill="none"
          stroke="#B89B62"
        />

        {/* Left minaret */}
        <path d="M13 173 L17 58 L34 58 L38 173Z" fill="#D1B47C" />
        <path d="M14 65 Q25 55 36 65 L32 57 L18 57Z" fill="#A98A4C" />
        <path d="M17 78 H35 M16 91 H35 M16 108 H35 M15 130 H36" stroke="#A98A4C" strokeWidth="2" />
      </g>

      {/* Registan - right madrasa */}
      <g stroke="#A98A4C" strokeWidth=".7">
        <rect x="269" y="103" width="105" height="70" fill="#D8BE8E" />
        <rect x="277" y="93" width="91" height="80" fill="#E6D2A9" />

        {/* Right portal */}
        <rect x="299" y="91" width="47" height="82" fill="#C6A66D" />
        <path d="M304 173 V123 Q322 88 341 123 V173Z" fill="#8E7045" />
        <path d="M307 173 V125 Q322 98 338 125 V173" fill="none" stroke="#E9D6AA" strokeWidth="2" />

        {/* Right panels */}
        <rect x="280" y="101" width="12" height="60" fill="none" stroke="#B89B62" />
        <rect x="352" y="101" width="12" height="60" fill="none" stroke="#B89B62" />

        {/* Right minaret */}
        <path d="M358 173 L362 58 L379 58 L383 173Z" fill="#D1B47C" />
        <path d="M359 65 Q370 55 381 65 L377 57 L363 57Z" fill="#A98A4C" />
        <path d="M361 78 H380 M361 91 H381 M360 108 H382 M360 130 H382" stroke="#A98A4C" strokeWidth="2" />
      </g>

      {/* Central madrasa */}
      <g stroke="#A98A4C" strokeWidth=".7">
        <rect x="119" y="105" width="158" height="68" fill="#D9BF90" />
        <rect x="132" y="95" width="132" height="78" fill="#E9D6AC" />

        {/* Central dome */}
        <path d="M169 96 Q198 49 227 96Z" fill="#A4A98C" />
        <path d="M169 96 Q198 49 227 96" fill="none" stroke="#8F9678" strokeWidth="1.5" />
        <path d="M198 54 V95 M184 66 L190 95 M212 66 L206 95" stroke="#899276" strokeWidth=".8" fill="none" />

        {/* Main portal */}
        <rect x="163" y="98" width="70" height="75" fill="#C5A36C" />
        <path d="M171 173 V125 Q198 83 225 125 V173Z" fill="#896A43" />
        <path d="M177 173 V127 Q198 98 219 127 V173" fill="none" stroke="#E9D6AA" strokeWidth="2" />

        {/* Decorative columns */}
        <rect x="139" y="106" width="13" height="60" fill="none" stroke="#B89B62" />
        <rect x="244" y="106" width="13" height="60" fill="none" stroke="#B89B62" />

        {/* Geometric ornaments */}
        <path
          d="M145 112 L151 118 L145 124 L139 118Z
             M250 112 L256 118 L250 124 L244 118Z
             M198 106 L205 113 L198 120 L191 113Z"
          fill="none"
          stroke="#B89B62"
          strokeWidth="1.2"
        />

        {/* Side windows */}
        <path
          d="M122 173 V139 Q137 119 151 139 V173
             M245 173 V139 Q260 119 274 139 V173"
          fill="#A98A5A"
          stroke="#D9BF90"
        />
      </g>

      {/* Foreground ground */}
      <path d="M0 173 Q100 169 198 173 Q300 169 396 173 V188 H0Z" fill="#D9C59E" />

      {/* Decorative border */}
      <defs>
        <pattern id="dm" width="16" height="10" patternUnits="userSpaceOnUse">
          <path d="M8 1 L13 5 L8 9 L3 5Z" fill="none" stroke="#B89B62" strokeWidth=".8" />
        </pattern>
      </defs>
      <rect y="178" width="396" height="10" fill="url(#dm)" />

      {/* Greeting */}
      <text x="18" y="40" fontFamily="var(--f-noto)" fontStyle="italic" fontSize="25" fill="#A98A4C" opacity=".85">
        Салом
      </text>
    </svg>
  );
}

export function PersianArt() {
  // Персеполь: колонны Апададаны, лестница с рельефом, Фаравахар в небе
  const full = [153, 198, 243];
  const fluting = (x: number, top: number) => (
    <>
      <path d={`M${x - 3} ${top}V145M${x + 3} ${top}V145`} stroke="#8FB59C" strokeWidth=".7" />
    </>
  );
  return (
    <svg {...artProps}>
      <rect width="396" height="188" fill="#E6EFE8" />

      {/* горы Загроса */}
      <path d="M0 136L60 98L104 124L170 82L238 126L296 92L350 122L396 100V150H0Z" fill="#D6E6DB" />
      <path d="M0 146L80 118L140 140L220 108L300 140L360 124L396 138V150H0Z" fill="#C6DBCD" />

      {/* Фаравахар — крылатый диск */}
      <g fill="none" stroke="#6E9A7A" strokeWidth="1.1" strokeLinecap="round" opacity=".9">
        <circle cx="338" cy="50" r="5" />
        <circle cx="338" cy="50" r="2" fill="#6E9A7A" />
        <path d="M333 50Q322 44 308 48M333 52Q322 50 311 55M333 54Q324 55 315 61" />
        <path d="M343 50Q354 44 368 48M343 52Q354 50 365 55M343 54Q352 55 361 61" />
        <path d="M338 55V64M334 64L338 60L342 64" />
      </g>

      {/* платформа и лестница */}
      <rect y="150" width="396" height="38" fill="#C6DBCD" />
      <path d="M0 150H396" stroke="#8FB59C" strokeWidth="1" />
      <path d="M70 188L92 150H304L326 188Z" fill="#D3E4D8" stroke="#8FB59C" strokeWidth=".8" />
      <path d="M80 170H316M75 179H321" stroke="#9DBFA8" strokeWidth=".7" />
      <path d="M86 160H310" stroke="#9DBFA8" strokeWidth=".7" />
      {/* рельеф: процессия фигур на фасаде лестницы */}
      <g fill="#9DBFA8">
        {Array.from({ length: 14 }).map((_, i) => (
          <g key={i} transform={`translate(${104 + i * 14} 0)`}>
            <rect x="0" y="162" width="3" height="7" rx="1" />
            <circle cx="1.5" cy="159.6" r="1.6" />
            <path d="M3 163L7 160" stroke="#9DBFA8" strokeWidth=".8" />
          </g>
        ))}
      </g>

      {/* разрушенные крайние колонны */}
      {[108, 288].map((x, i) => (
        <g key={x}>
          <rect x={x - 11} y="145" width="22" height="5" fill="#BDD6C5" stroke="#6E9A7A" strokeWidth=".7" />
          <path
            d={
              i === 0
                ? `M${x - 7} 145V104L${x - 2} 108L${x + 2} 101L${x + 7} 106V145Z`
                : `M${x - 7} 145V108L${x - 3} 102L${x + 3} 107L${x + 7} 100V145Z`
            }
            fill="#D3E4D8"
            stroke="#8FB59C"
            strokeWidth=".9"
          />
          {fluting(x, 110)}
        </g>
      ))}

      {/* целые колонны с капителями «двойной бык» */}
      {full.map((x) => (
        <g key={x}>
          <rect x={x - 11} y="145" width="22" height="5" fill="#BDD6C5" stroke="#6E9A7A" strokeWidth=".7" />
          <rect x={x - 7} y="76" width="14" height="69" fill="#D3E4D8" stroke="#8FB59C" strokeWidth=".9" />
          {fluting(x, 78)}
          {/* шейка и волюты */}
          <rect x={x - 9} y="70" width="18" height="6" fill="#BDD6C5" stroke="#6E9A7A" strokeWidth=".7" />
          <circle cx={x - 9} cy="64" r="4.5" fill="#D3E4D8" stroke="#6E9A7A" strokeWidth=".8" />
          <circle cx={x + 9} cy="64" r="4.5" fill="#D3E4D8" stroke="#6E9A7A" strokeWidth=".8" />
          <circle cx={x - 9} cy="64" r="1.5" fill="none" stroke="#6E9A7A" strokeWidth=".6" />
          <circle cx={x + 9} cy="64" r="1.5" fill="none" stroke="#6E9A7A" strokeWidth=".6" />
          <rect x={x - 12} y="56" width="24" height="8" fill="#BDD6C5" stroke="#6E9A7A" strokeWidth=".8" />
          {/* быки: два силуэта, обращённые наружу */}
          <path
            d={`M${x - 12} 56Q${x - 18} 52 ${x - 14} 47L${x - 9} 50L${x - 3} 49L${x - 1} 56Z`}
            fill="#BDD6C5"
            stroke="#6E9A7A"
            strokeWidth=".7"
          />
          <path
            d={`M${x + 12} 56Q${x + 18} 52 ${x + 14} 47L${x + 9} 50L${x + 3} 49L${x + 1} 56Z`}
            fill="#BDD6C5"
            stroke="#6E9A7A"
            strokeWidth=".7"
          />
        </g>
      ))}

      {/* архитрав */}
      <rect x="138" y="40" width="120" height="8" fill="#D3E4D8" stroke="#6E9A7A" strokeWidth=".9" />
      <path d="M138 44H258" stroke="#9DBFA8" strokeWidth=".6" strokeDasharray="3 2" />

      {/* узор у основания */}
      <defs>
        <pattern id="fap" width="18" height="18" patternUnits="userSpaceOnUse">
          <path d="M9 1L17 9L9 17L1 9Z" fill="none" stroke="#9DBFA8" strokeWidth=".8" />
        </pattern>
      </defs>
      <rect y="182" width="396" height="6" fill="url(#fap)" />

      <text x="24" y="58" fontFamily="var(--f-fa)" fontSize="34" fill="#6E9A7A" opacity=".85" direction="rtl">
        سلام
      </text>
    </svg>
  );
}

export function EnglishArt() {
  return (
    <svg {...artProps} viewBox="0 0 396 188">
      {/* Background */}
      <rect width="396" height="188" fill="#ECEEF2" />

      {/* Sky and clouds */}
      <path d="M0 72H396 M0 112H396 M0 152H396" stroke="#C9CFDA" strokeWidth=".8" />

      <path d="M220 43 Q226 31 240 37 Q250 18 269 34 Q285 24 297 43Z" fill="#F8F9FB" />
      <path d="M310 55 Q316 45 328 50 Q338 35 351 49 Q365 42 373 55Z" fill="#F8F9FB" />

      {/* London Eye */}
      <g fill="none" stroke="#AAB5C5" strokeWidth="1.3" opacity=".85">
        <circle cx="65" cy="113" r="37" />
        <circle cx="65" cy="113" r="32" />
        <path d="M65 76V150 M28 113H102 M39 87L91 139 M91 87L39 139" />
        <path d="M65 113L47 151 M65 113L83 151" />
        <path d="M65 113L65 151" />
      </g>

      {/* London Eye capsules */}
      <g fill="#AAB5C5">
        <circle cx="65" cy="76" r="2.5" />
        <circle cx="91" cy="87" r="2.5" />
        <circle cx="102" cy="113" r="2.5" />
        <circle cx="91" cy="139" r="2.5" />
        <circle cx="65" cy="150" r="2.5" />
        <circle cx="39" cy="139" r="2.5" />
        <circle cx="28" cy="113" r="2.5" />
        <circle cx="39" cy="87" r="2.5" />
      </g>

      {/* Houses of Parliament */}
      <g fill="#B9C2CE" stroke="#8795A8" strokeWidth=".7">
        <rect x="200" y="119" width="178" height="54" />
        <path d="M200 119L207 105L214 119L221 105L228 119L235 105L242 119L249 105L256 119L263 105L270 119L277 105L284 119L291 105L298 119L305 105L312 119L319 105L326 119L333 105L340 119L347 105L354 119L361 105L368 119L378 119Z" />

        {/* Windows */}
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x={205 + i * 14} y="131" width="6" height="20" rx="3" fill="#E1E5EB" />
        ))}

        {/* Towers */}
        <path d="M215 119V94L222 83L229 94V119Z" />
        <path d="M345 119V94L352 83L359 94V119Z" />
        <path d="M215 83L222 70L229 83Z" />
        <path d="M345 83L352 70L359 83Z" />
      </g>

      {/* Big Ben tower */}
      <g stroke="#8795A8" strokeWidth=".8">
        {/* Main tower */}
        <rect x="303" y="65" width="37" height="108" fill="#D4C7AF" />

        {/* Lower tower details */}
        <path d="M303 90H340 M303 115H340 M303 140H340 M303 163H340" stroke="#A99B83" strokeWidth="2" />

        {/* Clock tower upper section */}
        <rect x="299" y="58" width="45" height="34" fill="#D9CBB3" />
        <rect x="305" y="62" width="33" height="26" fill="#F0E8D8" />

        {/* Clock */}
        <circle cx="321.5" cy="75" r="10" fill="#F8F8F5" stroke="#8795A8" strokeWidth="1.2" />
        <path d="M321.5 67V75L327 79" fill="none" stroke="#68788E" strokeWidth="1.2" strokeLinecap="round" />

        {/* Clock markers */}
        <path d="M321.5 66V68 M321.5 82V84 M313 75H315 M328 75H330" stroke="#68788E" strokeWidth="1" />

        {/* Upper roof */}
        <path d="M298 59L306 43H337L345 59Z" fill="#8997AA" />
        <path d="M305 43L310 27H333L338 43Z" fill="#8997AA" />

        {/* Spire */}
        <path d="M310 27L321.5 3L333 27Z" fill="#75849A" />
        <path d="M321.5 3V0 M321.5 0V-2" stroke="#A98A4C" strokeWidth="1.5" />

        {/* Tower windows */}
        <path
          d="M310 98V108 M321 98V108 M332 98V108
             M310 121V133 M321 121V133 M332 121V133
             M310 146V158 M321 146V158 M332 146V158"
          stroke="#8D9BAE"
          strokeWidth="2"
        />
      </g>

      {/* Westminster Bridge */}
      <path
        d="M0 161 Q50 153 100 161 Q150 153 200 161 Q260 153 310 161 H396"
        fill="none"
        stroke="#AAB5C5"
        strokeWidth="4"
      />
      <path
        d="M30 163 Q65 139 100 163 M125 163 Q160 139 195 163 M220 163 Q255 139 290 163"
        fill="none"
        stroke="#AAB5C5"
        strokeWidth="2"
      />

      {/* Water */}
      <rect y="174" width="396" height="14" fill="#DCE1E9" />
      <path d="M15 180H75 M95 184H145 M230 180H280 M320 184H375" stroke="#B9C4D2" strokeWidth="1.2" strokeLinecap="round" />

      {/* Large typography */}
      <text
        x="240"
        y="150"
        textAnchor="middle"
        fontFamily="var(--f-news)"
        fontStyle="italic"
        fontSize="120"
        fill="#8A94A8"
        opacity=".25"
      >
        Aa
      </text>

      {/* Hello */}
      <text x="24" y="54" fontFamily="var(--f-news)" fontStyle="italic" fontSize="32" fill="#7B869B" opacity=".9">
        Hello
      </text>
    </svg>
  );
}

/** Иллюстрации есть только у изучаемых языков. */
export const ART: Partial<Record<LangId, () => ReactElement>> = {
  tajik: TajikArt,
  persian: PersianArt,
  english: EnglishArt,
};