
export  function GreetingBannerSkeleton() {
  return (
    <div
      className="relative mb-5 w-full h-[120px] md:h-[136px] overflow-hidden rounded-[28px] border-2 border-gray-200 bg-gray-100 p-4 md:px-6 flex items-center animate-pulse"
      aria-label="Загрузка баннера"
      role="status"
    >
      <div className="flex items-center justify-between w-full gap-4">
        {/* Текст */}
        <div className="flex-1 space-y-3">
          <div className="h-6 md:h-8 w-40 md:w-56 rounded-lg bg-gray-300" />

          <div className="h-3 w-28 md:w-36 rounded-full bg-gray-300" />

          <div className="h-8 w-24 rounded-full bg-gray-300" />
        </div>

        {/* Круглая иллюстрация */}
        <div className="shrink-0 w-[84px] h-[84px] md:w-[100px] md:h-[100px] rounded-full border-2 border-gray-300 bg-gray-200 flex items-center justify-center">
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-gray-300" />
        </div>
      </div>
    </div>
  );
}





export function HomeCardsSkeleton() {
  const gray = "bg-gray-300";
  const light = "bg-gray-200";

  const card =
    "group relative flex min-h-[155px] w-full flex-col justify-between overflow-hidden rounded-[24px] border border-gray-200 bg-gray-100 p-4 shadow-[0_4px_0_rgba(0,0,0,0.04),0_8px_20px_rgba(0,0,0,0.03)] md:min-h-[170px] md:p-5 animate-pulse";

  return (
    <section className="space-y-4 md:space-y-5">

      {/* ЗАГОЛОВОК — точная структура */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="h-7 w-24 rounded-lg bg-gray-300 md:h-8 md:w-28" />
          <div className="mt-2 h-3 w-44 rounded-full bg-gray-200" />
        </div>

        <div className="h-7 w-[58px] rounded-full bg-gray-200" />
      </div>

      {/* КАРТОЧКИ */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 xl:gap-5">

        {/* 1. ДОМАШНИЕ ЗАДАНИЯ */}
        <div className={`${card} border-gray-200`}>
          {/* Фоновый круг как в оригинале */}
          <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full border-[16px] border-gray-200" />

          <div className="relative z-10 flex items-start justify-between gap-2">
            <div className="min-w-0">
              {/* Заголовок */}
              <div className="h-3 w-28 rounded-full bg-gray-300" />

              {/* Количество заданий */}
              <div className="mt-2 h-6 w-24 rounded-lg bg-gray-300 md:h-7" />
            </div>

            {/* Иконка */}
            <div className="h-9 w-9 shrink-0 rounded-xl border border-gray-300 bg-gray-200" />
          </div>

          {/* Нижняя подпись */}
          <div className="relative z-10 mt-4 flex items-center justify-between gap-2">
            <div className="h-3 w-28 rounded-full bg-gray-300" />
            <div className="h-1.5 w-7 rounded-full bg-gray-300" />
          </div>
        </div>

        {/* 2. МОНЕТЫ */}
        <div className={card}>
          <div>
            <div className="flex items-center justify-between gap-2">
              {/* Заголовок */}
              <div className="h-3 w-14 rounded-full bg-gray-300" />

              {/* Иконка монет */}
              <div className="h-9 w-9 shrink-0 rounded-xl border border-gray-300 bg-gray-200" />
            </div>

            {/* Баланс + изображение монеты */}
            <div className="mt-3 flex items-center gap-1.5">
              <div className="h-8 w-20 rounded-lg bg-gray-300 md:w-24" />
              <div className="h-9 w-9 shrink-0 rounded-full bg-gray-200" />
            </div>
          </div>

          {/* Ваш баланс */}
          <div className="mt-3 h-6 w-24 self-start rounded-full bg-gray-200" />
        </div>

        {/* 3. УРОКИ */}
        <div className={card}>
          <div>
            <div className="flex items-center justify-between gap-2">
              {/* Заголовок */}
              <div className="h-3 w-28 rounded-full bg-gray-300" />

              {/* Иконка образования */}
              <div className="h-9 w-9 shrink-0 rounded-xl border border-gray-300 bg-gray-200" />
            </div>

            {/* Пройденные уроки */}
            <div className="mt-3 h-8 w-24 rounded-lg bg-gray-300 md:h-9" />
          </div>

          {/* Прогресс курса */}
          <div className="mt-3">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <div className="h-3 w-24 rounded-full bg-gray-300" />
              <div className="h-3 w-8 rounded-full bg-gray-300" />
            </div>

            {/* Полоса прогресса */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div className="h-full w-1/3 rounded-full bg-gray-300" />
            </div>
          </div>
        </div>

        {/* 4. XP / БАЛЛЫ */}
        <div className={card}>
          <div>
            <div className="flex items-center justify-between gap-2">
              {/* Заголовок */}
              <div className="h-3 w-24 rounded-full bg-gray-300" />

              {/* Иконка звезды */}
              <div className="h-9 w-9 shrink-0 rounded-xl border border-gray-300 bg-gray-200" />
            </div>

            {/* XP + изображение */}
            <div className="mt-3 flex items-center gap-1.5">
              <div className="h-8 w-24 rounded-lg bg-gray-300" />
              <div className="h-9 w-9 shrink-0 rounded-full bg-gray-200" />
            </div>
          </div>

          {/* XP · Опыт */}
          <div className="mt-3 h-6 w-20 self-start rounded-full bg-gray-200" />
        </div>

      </div>
    </section>
  );
}




export function LibraryCardsSkeleton() {
  const card =
    "group relative isolate flex flex-col justify-between overflow-hidden rounded-[26px] border-2 border-gray-300 bg-gray-100 p-4 md:p-6 min-h-[150px] md:min-h-[170px] animate-pulse";

  return (
    <section className="space-y-4">
      {/* ЗАГОЛОВОК */}
      <div className="h-7 w-36 rounded-lg bg-gray-300 animate-pulse" />

      {/* BENTO GRID */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5">

        {/* 1. ПОДКАСТЫ */}
        <div className={`${card} col-span-2 md:col-span-1`}>
          {/* Декоративные круги */}
          <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full border-[18px] border-gray-200" />

          <div className="pointer-events-none absolute -bottom-16 left-1/3 h-36 w-36 rounded-full bg-gray-200/60" />

          {/* Большая фоновая иконка */}
          <div className="pointer-events-none absolute -bottom-5 -right-5 h-28 w-28 rounded-full bg-gray-200/60 md:h-32 md:w-32" />

          <div className="relative z-10">
            <div className="mb-2 flex items-start justify-between gap-2">
              {/* Название */}
              <div className="h-6 w-28 rounded-lg bg-gray-300 md:w-32" />

              {/* Иконка */}
              <div className="h-10 w-10 shrink-0 rounded-2xl border-2 border-gray-300 bg-gray-200" />
            </div>

            {/* Описание */}
            <div className="max-w-[95%] space-y-2">
              <div className="h-3 w-52 max-w-full rounded-full bg-gray-300" />
              <div className="h-3 w-40 max-w-full rounded-full bg-gray-300" />
            </div>
          </div>

          {/* CTA */}
          <div className="relative z-10 mt-5 h-9 w-28 rounded-full bg-gray-300" />
        </div>

        {/* 2. ВИДЕО */}
        <div className={`${card} col-span-1`}>
          <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full border-[18px] border-gray-200" />

          <div className="pointer-events-none absolute -bottom-16 left-1/3 h-36 w-36 rounded-full bg-gray-200/60" />

          <div className="pointer-events-none absolute -bottom-5 -right-5 h-28 w-28 rounded-full bg-gray-200/60 md:h-32 md:w-32" />

          <div className="relative z-10">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="h-6 w-16 rounded-lg bg-gray-300" />

              <div className="h-10 w-10 shrink-0 rounded-2xl border-2 border-gray-300 bg-gray-200" />
            </div>

            <div className="max-w-[95%] space-y-2">
              <div className="h-3 w-full rounded-full bg-gray-300" />
              <div className="h-3 w-3/4 rounded-full bg-gray-300" />
            </div>
          </div>

          <div className="relative z-10 mt-5 h-9 w-28 rounded-full bg-gray-300" />
        </div>

        {/* 3. КНИГИ */}
        <div className={`${card} col-span-1`}>
          <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full border-[18px] border-gray-200" />

          <div className="pointer-events-none absolute -bottom-16 left-1/3 h-36 w-36 rounded-full bg-gray-200/60" />

          <div className="pointer-events-none absolute -bottom-5 -right-5 h-28 w-28 rounded-full bg-gray-200/60 md:h-32 md:w-32" />

          <div className="relative z-10">
            <div className="mb-2 flex items-start justify-between gap-2">
              <div className="h-6 w-16 rounded-lg bg-gray-300" />

              <div className="h-10 w-10 shrink-0 rounded-2xl border-2 border-gray-300 bg-gray-200" />
            </div>

            <div className="max-w-[95%] space-y-2">
              <div className="h-3 w-full rounded-full bg-gray-300" />
              <div className="h-3 w-3/4 rounded-full bg-gray-300" />
            </div>
          </div>

          <div className="relative z-10 mt-5 h-9 w-24 rounded-full bg-gray-300" />
        </div>

      </div>
    </section>
  );
}




export function QuickTilesSkeleton() {
  const ITEM =
    "snap-start shrink-0 w-[44%] min-[480px]:w-[32%] md:w-auto md:shrink";

  const CARD =
    "relative flex min-h-[120px] h-full w-full flex-col justify-between overflow-hidden rounded-[24px] border border-gray-200 bg-gray-100 p-4 shadow-[0_4px_0_rgba(0,0,0,0.04),0_8px_20px_rgba(0,0,0,0.03)] animate-pulse md:p-5";

  const LABEL = "h-3 rounded-full bg-gray-300";

  const ICON =
    "grid h-8 w-8 md:h-9 md:w-9 shrink-0 place-items-center rounded-xl border border-gray-300 bg-gray-200";

  return (
    <div className="relative">

      {/* КАРТОЧКИ */}
      <div
        className="
          flex gap-3 overflow-x-auto snap-x snap-mandatory
          -mx-4 px-4 scroll-px-4 pb-2 overscroll-x-contain
          [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
          md:mx-0 md:px-0 md:pb-0 md:overflow-visible
          md:grid md:grid-cols-5 md:gap-4 xl:gap-5
        "
      >

        {/* 1. РЕЙТИНГ */}
        <div className={ITEM}>
          <div className={CARD}>
            <div className="flex items-center justify-between gap-2">
              <div className={`${LABEL} w-16`} />
              <div className={ICON} />
            </div>

            <div>
              <div className="h-8 w-14 rounded-lg bg-gray-300 md:h-9" />

              <div className="mt-1.5 h-3 w-24 rounded-full bg-gray-200" />
            </div>
          </div>
        </div>

        {/* 2. ДОБАВИТЬ ДРУГА */}
        <div className={ITEM}>
          <div className={`${CARD} border-gray-300`}>
            {/* Декоративный круг */}
            <div className="pointer-events-none absolute -right-8 -top-9 h-28 w-28 rounded-full border-[15px] border-gray-200" />

            <div className="relative z-10 flex items-center justify-between gap-2">
              <div className="h-3 w-16 rounded-full bg-gray-300" />

              <div className={ICON} />
            </div>

            <div className="relative z-10 mt-3 flex items-end justify-between gap-2">
              <div className="h-5 w-28 max-w-[85%] rounded-lg bg-gray-300" />

              <div className="h-5 w-5 shrink-0 rounded bg-gray-200" />
            </div>
          </div>
        </div>

        {/* 3. УРОВЕНЬ */}
        <div className={ITEM}>
          <div className={CARD}>
            <div className="flex items-center justify-between gap-2">
              <div className={`${LABEL} w-16`} />
              <div className={ICON} />
            </div>

            <div className="h-7 w-24 max-w-full rounded-lg bg-gray-300" />
          </div>
        </div>

        {/* 4. ЯЗЫК ОБУЧЕНИЯ */}
        <div className={ITEM}>
          <div className={CARD}>
            <div className="flex items-center justify-between gap-2">
              <div className={`${LABEL} w-14`} />
              <div className={ICON} />
            </div>

            <div className="h-7 w-28 max-w-full rounded-lg bg-gray-300" />
          </div>
        </div>

        {/* 5. ПЕРЕВОДЧИК */}
        <div className={ITEM}>
          <div className={CARD}>
            <div className="flex items-center justify-between gap-2">
              <div className={`${LABEL} w-24`} />
              <div className={ICON} />
            </div>

            <div className="h-7 w-28 max-w-full rounded-lg bg-gray-300" />
          </div>
        </div>

      </div>

      {/* ИНДИКАТОР ПРОКРУТКИ */}
      <div
        className="md:hidden mt-2 mx-auto h-1 w-16 rounded-full bg-gray-200 overflow-hidden animate-pulse"
        aria-hidden="true"
      >
        <div className="h-full w-1/2 rounded-full bg-gray-300" />
      </div>

      {/* ПРАВАЯ ПОДСКАЗКА */}
      <div
        className="md:hidden pointer-events-none absolute right-0 top-0 bottom-3 w-5 bg-white/60"
        aria-hidden="true"
      />
    </div>
  );
}




export function VocabularyBlockSkeleton() {
  const greenCard =
    "relative isolate flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[26px] border-2 border-gray-300 bg-gray-100 p-6 text-left shadow-[0_7px_0_#D1D5DB,0_13px_22px_rgba(0,0,0,0.04)] animate-pulse md:p-8";

  const orangeCard =
    "relative isolate flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[26px] border-2 border-gray-300 bg-gray-100 p-6 text-left shadow-[0_7px_0_#D1D5DB,0_13px_22px_rgba(0,0,0,0.04)] animate-pulse md:p-8";

  const gray = "bg-gray-300";
  const light = "bg-gray-200";

  return (
    <section className="space-y-4">

      {/* ЗАГОЛОВОК */}
      <div className="h-7 w-24 rounded-lg bg-gray-300 animate-pulse" />

      <div className="grid grid-cols-1 gap-4 md:gap-5 lg:grid-cols-12">

        {/* 1. ВЫУЧЕННЫЕ СЛОВА */}
        <div className={`${greenCard} lg:col-span-7`}>

          {/* Декоративные круги */}
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full border-2 border-gray-200" />

          <div className="pointer-events-none absolute -right-7 -top-10 h-44 w-44 rounded-full border-2 border-gray-200" />

          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-gray-200/60" />

          {/* Верхняя часть */}
          <div className="relative z-10 flex items-center justify-between gap-3">

            {/* Learned words */}
            <div className="inline-flex h-7 items-center gap-2 rounded-full border border-gray-300 bg-gray-200 px-3">
              <div className="h-3.5 w-3.5 rounded bg-gray-300" />
              <div className="h-2.5 w-24 rounded-full bg-gray-300" />
            </div>

            {/* Иконка */}
            <div className="h-10 w-10 shrink-0 rounded-2xl border border-gray-300 bg-gray-200" />
          </div>

          {/* Прогресс */}
          <div className="relative z-10 my-5 flex items-center justify-between gap-4">

            {/* Числа */}
            <div className="min-w-0 space-y-2">
              <div className="h-11 w-32 max-w-full rounded-lg bg-gray-300 md:h-14 md:w-40" />

              <div className="h-3 w-24 rounded-full bg-gray-300" />

              <div className="mt-1 h-2.5 w-32 rounded-full bg-gray-200" />
            </div>

            {/* Круговой прогресс */}
            <div className="relative h-24 w-24 shrink-0 rounded-full border-[4px] border-gray-300 md:h-28 md:w-28">
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <div className="h-5 w-5 rounded bg-gray-300" />
                <div className="h-3 w-8 rounded-full bg-gray-300" />
              </div>
            </div>

          </div>

          {/* Нижняя часть */}
          <div className="relative z-10 flex items-center justify-between gap-2">

            <div className="flex min-w-0 items-center gap-1">
              <div className="h-3 w-40 max-w-full rounded-full bg-gray-300" />
              <div className="h-3 w-3 shrink-0 rounded bg-gray-200" />
            </div>

            <div className="h-7 w-20 shrink-0 rounded-full bg-gray-300" />

          </div>
        </div>

        {/* 2. ИГРОВЫЕ ТРЕНАЖЁРЫ */}
        <div className={`${orangeCard} lg:col-span-5`}>

          {/* Декоративные элементы */}
          <div className="pointer-events-none absolute -right-12 -top-14 h-56 w-56 rounded-full border-2 border-gray-200" />

          <div className="pointer-events-none absolute -right-5 -top-7 h-40 w-40 rounded-full border-2 border-gray-200" />

          {/* Большая фоновая иконка */}
          <div className="pointer-events-none absolute -bottom-5 -right-5 h-36 w-36 rounded-[30px] bg-gray-200/60" />

          {/* Заголовок */}
          <div className="relative z-10">

            {/* Верхний бейдж */}
            <div className="flex items-center justify-between gap-2">

              <div className="inline-flex h-7 items-center gap-2 rounded-full border border-gray-300 bg-gray-200 px-3">
                <div className="h-3.5 w-3.5 rounded bg-gray-300" />
                <div className="h-2.5 w-28 rounded-full bg-gray-300" />
              </div>

              {/* Иконка игры */}
              <div className="h-10 w-10 shrink-0 rounded-2xl border-2 border-gray-300 bg-gray-200" />

            </div>

            {/* Название — две строки */}
            <div className="mt-5 space-y-2">
              <div className="h-8 w-32 rounded-lg bg-gray-300 md:h-9 md:w-40" />
              <div className="h-8 w-36 rounded-lg bg-gray-300 md:h-9 md:w-44" />
            </div>

            {/* Описание */}
            <div className="mt-3 max-w-xs space-y-2">
              <div className="h-3 w-full rounded-full bg-gray-300" />
              <div className="h-3 w-4/5 rounded-full bg-gray-300" />
            </div>

          </div>

          {/* Кнопка */}
          <div className="relative z-10 mt-6 inline-flex h-10 w-36 items-center justify-center gap-2 self-start rounded-full border-2 border-gray-300 bg-gray-200 px-5">
            <div className="h-3 w-20 rounded-full bg-gray-300" />
            <div className="h-3.5 w-3.5 rounded bg-gray-300" />
          </div>

        </div>
      </div>
    </section>
  );
}


export function LessonsSectionSkeleton() {
  return (
    <div
      className="space-y-6 animate-pulse"
      aria-busy="true"
      aria-label="Загрузка уроков"
    >
      {/* HEADER */}
      <div>
        <div className="mb-3 h-7 w-48 rounded-full bg-gray-200" />
        <div className="h-9 w-36 rounded-lg bg-gray-300" />
        <div className="mt-2 h-4 w-64 max-w-full rounded-full bg-gray-200" />
      </div>

      {/* PROGRESS */}
      <div className="rounded-[28px] border-2 border-gray-300 bg-gray-100 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="h-3 w-28 rounded-full bg-gray-300" />
            <div className="mt-2 h-9 w-20 rounded-lg bg-gray-300" />
            <div className="mt-2 h-4 w-40 max-w-full rounded-full bg-gray-200" />
          </div>

          <div className="h-16 w-16 shrink-0 rounded-2xl bg-gray-300" />
        </div>

        <div className="mt-5 h-4 rounded-full bg-gray-200" />
      </div>

      {/* MAP */}
      <div className="rounded-[32px] border-2 border-gray-200 bg-[#EAF6F0] px-3 py-8 sm:px-6">
        <div className="mx-auto mb-6 h-8 w-48 rounded-full bg-white" />

        <div className="mx-auto flex w-full max-w-[420px] flex-col gap-10">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`flex flex-col items-center gap-3 ${
                i % 2 === 0
                  ? 'self-center'
                  : i === 1
                    ? 'self-end pr-6'
                    : 'self-start pl-6'
              }`}
            >
              <div className="h-20 w-20 rounded-[28px] bg-gray-200" />
              <div className="h-3 w-24 rounded-full bg-gray-300" />
              <div className="h-2.5 w-14 rounded-full bg-gray-200" />
            </div>
          ))}
        </div>

        {/* FINISH */}
        <div className="mx-auto mt-10 h-12 w-40 rounded-full bg-gray-200" />
      </div>
    </div>
  );
}





export function ProfileSkeleton() {
  const card =
    "rounded-[28px] border-2 border-gray-200 bg-white p-5 shadow-[0_8px_0_rgba(11,61,46,0.05)] sm:p-6";

  const line = "rounded-full bg-gray-200";
  const block = "rounded-xl bg-gray-300";

  return (
    <div
      className="space-y-6 animate-pulse sm:space-y-8"
      role="status"
      aria-busy="true"
      aria-label="Загрузка профиля"
    >
      {/* HERO */}
      <section className="relative overflow-hidden rounded-[28px] border-2 border-gray-300 bg-gray-100 p-5 sm:rounded-[48px] sm:p-8">
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">

          <div className="flex min-w-0 items-center gap-4 sm:gap-6">
            {/* AVATAR */}
            <div className="h-20 w-20 shrink-0 rounded-full border-2 border-gray-300 bg-gray-200 sm:h-28 sm:w-28" />

            {/* NAME + EMAIL */}
            <div className="min-w-0 flex-1 space-y-3">
              <div className="h-7 w-40 max-w-full rounded-lg bg-gray-300 sm:h-10 sm:w-56" />
              <div className="h-4 w-44 max-w-full rounded-full bg-gray-200 sm:w-52" />
            </div>
          </div>

          {/* EDIT BUTTON */}
          <div className="h-11 w-full rounded-full bg-gray-300 sm:w-36" />
        </div>
      </section>

      {/* STATISTICS */}
      <section className={card}>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="flex items-center gap-3">

              <div className="h-11 w-11 shrink-0 rounded-xl bg-gray-200" />

              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-7 w-16 max-w-full rounded-lg bg-gray-300" />
                <div className="h-3 w-16 max-w-full rounded-full bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* MY COURSE */}
      <section className={card}>
        <div className="mb-4 h-7 w-32 rounded-lg bg-gray-300" />

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex min-w-0 items-center gap-4">
            {/* LANGUAGE LOGO */}
            <div className="h-[60px] w-[60px] shrink-0 rounded-full bg-gray-200" />

            {/* LANGUAGE + LEVEL */}
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-6 w-32 max-w-full rounded-lg bg-gray-300" />
              <div className="h-4 w-16 rounded-full bg-gray-200" />
            </div>
          </div>

          {/* CONTINUE BUTTON */}
          <div className="h-12 w-full rounded-full bg-gray-300 sm:w-36" />
        </div>
      </section>

      {/* ACHIEVEMENTS */}
      <section className={card}>
        <div className="mb-4 h-7 w-36 rounded-lg bg-gray-300" />

        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {[0, 1, 2, 3, 4, 5].map((item) => (
            <li
              key={item}
              className="flex flex-col items-center gap-2 rounded-2xl border-2 border-gray-200 bg-gray-100 px-2 py-4"
            >
              {/* ACHIEVEMENT ICON */}
              <div className="h-11 w-11 rounded-xl bg-gray-300" />

              {/* ACHIEVEMENT NAME */}
              <div className="h-3 w-14 max-w-full rounded-full bg-gray-200" />
            </li>
          ))}
        </ul>
      </section>

      {/* ACCOUNT */}
      <section className={card}>
        <div className="mb-4 h-7 w-28 rounded-lg bg-gray-300" />

        <div>
          {['email', 'status', 'native', 'target', 'script'].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between gap-4 border-b-2 border-gray-100 py-4 last:border-b-0"
            >
              {/* FIELD NAME */}
              <div className="h-3 w-24 rounded-full bg-gray-200" />

              {/* FIELD VALUE */}
              <div className="h-4 w-28 max-w-[50%] rounded-full bg-gray-300" />
            </div>
          ))}
        </div>
      </section>

      <span className="sr-only">Загрузка профиля...</span>
    </div>
  );
}

const Sk = ({ className = '' }: { className?: string }) => (
  <div aria-hidden className={`st-sk bg-[#E3EBE5] ${className}`} />
);


 export function SettingsSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Загрузка настроек"
      className="mx-auto max-w-2xl space-y-5 pb-24"
    >
      <style>{`
        @keyframes st-sk { 0%,100% { opacity: 1 } 50% { opacity: .45 } }
        .st-sk { animation: st-sk 1.4s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .st-sk { animation: none; } }
      `}</style>

      {/* заголовок */}
      <div className="space-y-3">
        <Sk className="h-11 w-48 rounded-2xl sm:h-14" />
        <Sk className="h-4 w-72 max-w-full rounded-full" />
      </div>

 

      {/* имя */}
      <div className="rounded-[28px] border-2 border-[#0B3D2E]/10 bg-white p-5 shadow-[0_8px_0_rgba(11,61,46,0.08)] sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <Sk className="h-10 w-10 rounded-xl" />
          <Sk className="h-5 w-20 rounded-full" />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Sk className="h-12 flex-1 rounded-2xl" />
          <Sk className="h-12 w-full rounded-full sm:w-36" />
        </div>
      </div>

      {/* языки */}
      <div className="rounded-[28px] border-2 border-[#0B3D2E]/10 bg-white p-5 shadow-[0_8px_0_rgba(11,61,46,0.08)] sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <Sk className="h-10 w-10 rounded-xl" />
          <Sk className="h-5 w-24 rounded-full" />
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <Sk className="h-32 rounded-3xl" />
          <Sk className="h-32 rounded-3xl" />
          <Sk className="h-32 rounded-3xl" />
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          <Sk className="h-11 w-28 rounded-full" />
          <Sk className="h-11 w-32 rounded-full" />
          <Sk className="h-11 w-28 rounded-full" />
        </div>
      </div>

      {/* письменность */}
      <div className="rounded-[28px] border-2 border-[#0B3D2E]/10 bg-white p-5 shadow-[0_8px_0_rgba(11,61,46,0.08)] sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <Sk className="h-10 w-10 rounded-xl" />
          <Sk className="h-5 w-32 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Sk className="h-24 rounded-3xl" />
          <Sk className="h-24 rounded-3xl" />
        </div>
      </div>

      <span className="sr-only">Загрузка…</span>
    </div>
  );
}
