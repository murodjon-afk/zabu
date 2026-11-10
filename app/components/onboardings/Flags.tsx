const flag2to1 = "block h-4 w-8 sm:h-6 sm:w-12 lg:h-9 lg:w-[72px]";

export function TajikFlag() {
  return (
    <svg viewBox="0 0 56 28" aria-hidden="true" className={flag2to1}>
      <rect width="56" height="28" fill="#fff" />
      <rect width="56" height="8" fill="#CC0000" />
      <rect y="20" width="56" height="8" fill="#006600" />
      <path d="M24.5 17.5L25 13.8L26.7 15L28 12.5L29.3 15L31 13.8L31.5 17.5Z" fill="#F8C300" />
      <g fill="#F8C300">
        {[
          [20.8, 15.6],
          [22.3, 12.7],
          [24.8, 10.7],
          [28, 10],
          [31.2, 10.7],
          [33.7, 12.7],
          [35.2, 15.6],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r=".8" />
        ))}
      </g>
    </svg>
  );
}

export function UKFlag() {
  return (
    <svg viewBox="0 0 60 30" aria-hidden="true" className={flag2to1}>
      <clipPath id="uk">
        <path d="M30 15h30v15zv15h-30zh-30v-15zv-15h30z" />
      </clipPath>
      <path d="M0 0v30h60V0z" fill="#012169" />
      <path d="M0 0L60 30M60 0L0 30" stroke="#fff" strokeWidth="6" />
      <path d="M0 0L60 30M60 0L0 30" clipPath="url(#uk)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
      <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

export function UzbekFlag() {
  const stars: [number, number][] = [
    [12.5, 2.4], [14.7, 2.4], [16.9, 2.4],
    [11.4, 4.6], [13.6, 4.6], [15.8, 4.6], [18, 4.6],
    [10.3, 6.8], [12.5, 6.8], [14.7, 6.8], [16.9, 6.8], [19.1, 6.8],
  ];
  return (
    <svg viewBox="0 0 56 28" aria-hidden="true" className={flag2to1}>
      <rect width="56" height="28" fill="#fff" />
      <rect width="56" height="9" fill="#0099B5" />
      <rect y="9" width="56" height="1" fill="#CE1126" />
      <rect y="18" width="56" height="1" fill="#CE1126" />
      <rect y="19" width="56" height="9" fill="#1EB53A" />
      <circle cx="6.5" cy="4.5" r="3" fill="#fff" />
      <circle cx="7.8" cy="4.5" r="2.6" fill="#0099B5" />
      <g fill="#fff">
        {stars.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r=".55" />
        ))}
      </g>
    </svg>
  );
}

export function RussianFlag() {
  return (
    <svg viewBox="0 0 54 36" aria-hidden="true" className="block h-4 w-6 sm:h-6 sm:w-9 lg:h-9 lg:w-[54px]">
      <rect width="54" height="36" fill="#fff" />
      <rect y="12" width="54" height="12" fill="#0039A6" />
      <rect y="24" width="54" height="12" fill="#D52B1E" />
    </svg>
  );
}

export function IranFlag() {
  return (
    <svg viewBox="0 0 56 28" aria-hidden="true" className={flag2to1}>
      {/* Green, white and red stripes */}
      <rect width="56" height="28" fill="#FFFFFF" />
      <rect width="56" height="9.33" fill="#239F40" />
      <rect y="18.67" width="56" height="9.33" fill="#DA0000" />

      {/* Central emblem - stylized Allah */}
      <g fill="none" stroke="#DA0000" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round">
        <path
          d="M28 10.1
          C26.9 11.3 26.1 12.4 26.1 13.7
          C26.1 15.2 27 16.1 28 17.2
          C29 16.1 29.9 15.2 29.9 13.7
          C29.9 12.4 29.1 11.3 28 10.1Z"
        />

        <path
          d="M25.2 11.8
          C23.7 12.7 23.5 14.6 24.4 15.7
          L26.1 17.4"
        />

        <path
          d="M30.8 11.8
          C32.3 12.7 32.5 14.6 31.6 15.7
          L29.9 17.4"
        />

        <path
          d="M25.2 17.4
          Q28 19.2 30.8 17.4"
        />

        <path d="M28 9.5V8.9" />
      </g>

      {/* Allahu Akbar decorative Kufic-style borders */}
      <g fill="#FFFFFF">
        {Array.from({ length: 11 }, (_, i) => (
          <g key={i} transform={`translate(${2.5 + i * 5.1}, 0)`}>
            {/* Top border */}
            <path d="M0 9.33V10.1H.8V9.33H1.4V10.1H2.2V9.33H2.8" />
            {/* Bottom border */}
            <path d="M0 18.67V17.9H.8V18.67H1.4V17.9H2.2V18.67H2.8" />
          </g>
        ))}
      </g>
    </svg>
  );
}

/** Пятиконечная звезда для флага Китая. */
function starPoints(cx: number, cy: number, r: number, rotateDeg = -90) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const rad = ((rotateDeg + i * 36) * Math.PI) / 180;
    const rr = i % 2 === 0 ? r : r * 0.382;
    pts.push(`${(cx + rr * Math.cos(rad)).toFixed(2)},${(cy + rr * Math.sin(rad)).toFixed(2)}`);
  }
  return pts.join(" ");
}

export function ChineseFlag() {
  const small: [number, number, number][] = [
    [18.5, 3.5, 20],
    [21.5, 7, 45],
    [21.5, 11.5, 10],
    [18.5, 15, 35],
  ];
  return (
    <svg viewBox="0 0 56 28" aria-hidden="true" className={flag2to1}>
      <rect width="56" height="28" fill="#DE2910" />
      <polygon points={starPoints(9.3, 9.3, 5.2)} fill="#FFDE00" />
      {small.map(([cx, cy, rot]) => (
        <polygon key={`${cx}-${cy}`} points={starPoints(cx, cy, 1.7, rot - 90)} fill="#FFDE00" />
      ))}
    </svg>
  );
}


export function ItalianFlag() {
  return (
    <svg viewBox="0 0 56 28" aria-hidden="true" className={flag2to1}>
      <rect width="56" height="28" fill="#FFFFFF" />
      <rect width="18.67" height="28" fill="#009246" />
      <rect x="37.33" width="18.67" height="28" fill="#CE2B37" />
    </svg>
  );
}







// Флаги только для Header (переключатель языка).
// Все одного размера 2:1. Старый Flags.tsx не трогаем.
const flag =
  "block h-5 w-10 shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/10";

export function RuFlag() {
  return (
    <svg viewBox="0 0 60 30" aria-hidden="true" className={flag}>
      <rect width="60" height="30" fill="#FFFFFF" />
      <rect y="10" width="60" height="10" fill="#0039A6" />
      <rect y="20" width="60" height="10" fill="#D52B1E" />
    </svg>
  );
}

export function TjFlag() {
  return (
    <svg viewBox="0 0 60 30" aria-hidden="true" className={flag}>
      <rect width="60" height="30" fill="#FFFFFF" />
      <rect width="60" height="9" fill="#CC0000" />
      <rect y="21" width="60" height="9" fill="#006600" />
      {/* корона */}
      <path
        d="M25.5 18.2 L26 13.8 L28 15.6 L30 12.6 L32 15.6 L34 13.8 L34.5 18.2 Z"
        fill="#F8C300"
      />
      {/* семь звёзд */}
      <g fill="#F8C300">
        {[
          [21.5, 16.4],
          [23, 13.2],
          [25.8, 10.9],
          [30, 10.2],
          [34.2, 10.9],
          [37, 13.2],
          [38.5, 16.4],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.9" />
        ))}
      </g>
    </svg>
  );
}

export function UzFlag() {
  const stars: [number, number][] = [
    [14, 2.6], [16.2, 2.6], [18.4, 2.6],
    [12.9, 4.8], [15.1, 4.8], [17.3, 4.8], [19.5, 4.8],
    [11.8, 7], [14, 7], [16.2, 7], [18.4, 7], [20.6, 7],
  ];
  return (
    <svg viewBox="0 0 60 30" aria-hidden="true" className={flag}>
      <rect width="60" height="30" fill="#FFFFFF" />
      <rect width="60" height="9.6" fill="#0099B5" />
      <rect y="9.6" width="60" height="1" fill="#CE1126" />
      <rect y="19.4" width="60" height="1" fill="#CE1126" />
      <rect y="20.4" width="60" height="9.6" fill="#1EB53A" />
      <circle cx="7" cy="4.8" r="3.2" fill="#FFFFFF" />
      <circle cx="8.4" cy="4.8" r="2.8" fill="#0099B5" />
      <g fill="#FFFFFF">
        {stars.map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="0.6" />
        ))}
      </g>
    </svg>
  );
}

export function IrFlag() {
  return (
    <svg viewBox="0 0 60 30" aria-hidden="true" className={flag}>
      <rect width="60" height="30" fill="#FFFFFF" />
      <rect width="60" height="10" fill="#239F40" />
      <rect y="20" width="60" height="10" fill="#DA0000" />

      {/* эмблема */}
      <g
        fill="none"
        stroke="#DA0000"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M30 11 C28.9 12.2 28.1 13.3 28.1 14.6 C28.1 16.1 29 17 30 18.1 C31 17 31.9 16.1 31.9 14.6 C31.9 13.3 31.1 12.2 30 11Z" />
        <path d="M27.2 12.7 C25.7 13.6 25.5 15.5 26.4 16.6 L28.1 18.3" />
        <path d="M32.8 12.7 C34.3 13.6 34.5 15.5 33.6 16.6 L31.9 18.3" />
        <path d="M27.2 18.3 Q30 20.1 32.8 18.3" />
      </g>

      {/* кайма */}
      <g fill="#FFFFFF">
        {Array.from({ length: 11 }, (_, i) => (
          <g key={i} transform={`translate(${3 + i * 5.2}, 0)`}>
            <path d="M0 10V10.8H.8V10H1.4V10.8H2.2V10H2.8" />
            <path d="M0 20V19.2H.8V20H1.4V19.2H2.2V20H2.8" />
          </g>
        ))}
      </g>
    </svg>
  );
}

export function ItFlag() {
  return (
    <svg viewBox="0 0 60 30" aria-hidden="true" className={flag}>
      <rect width="60" height="30" fill="#FFFFFF" />
      <rect width="20" height="30" fill="#009246" />
      <rect x="40" width="20" height="30" fill="#CE2B37" />
    </svg>
  );
}


export function IsFlag() {
  return (
    <svg viewBox="0 0 60 30" aria-hidden="true" className={flag}>
      <rect width="60" height="30" fill="#FFFFFF" />
      {/* две синие полосы */}
      <rect y="2.8" width="60" height="4.7" fill="#0038B8" />
      <rect y="22.5" width="60" height="4.7" fill="#0038B8" />
      {/* звезда Давида */}
      <g
        fill="none"
        stroke="#0038B8"
        strokeWidth="1"
        strokeLinejoin="miter"
      >
        <path d="M30 8 L36.06 18.5 L23.94 18.5 Z" />
        <path d="M30 22 L23.94 11.5 L36.06 11.5 Z" />
      </g>
    </svg>
  );
}