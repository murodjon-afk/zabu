
'use client';

import { useEffect, useState } from 'react';
import {
  WifiOff,
  AlertCircle,
  RefreshCw,
  BookOpen,
} from 'lucide-react';

export function DashboardErrorState() {
  const [isOnline, setIsOnline] = useState(true);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    const updateNetwork = () => {
      setIsOnline(navigator.onLine);
    };

    updateNetwork();

    window.addEventListener('online', updateNetwork);
    window.addEventListener('offline', updateNetwork);

    return () => {
      window.removeEventListener('online', updateNetwork);
      window.removeEventListener('offline', updateNetwork);
    };
  }, []);

  const handleRetry = () => {
    if (!navigator.onLine) {
      setIsOnline(false);
      return;
    }

    setRetrying(true);
    window.location.reload();
  };

  return (
    <section className="relative flex min-h-[65vh] w-full items-center justify-center overflow-hidden px-4 py-10">

      {/* Декоративный фон */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#EAF6F0]/70 blur-3xl" />

      {/* Основной контент */}
      <div className="relative z-10 mx-auto flex w-full max-w-md flex-col items-center text-center">

        {/* Иконка */}
        <div className="relative mb-7 flex h-24 w-24 items-center justify-center rounded-[28px] border-2 border-[#0B3D2E]/10 bg-white shadow-[0_6px_0_rgba(11,61,46,0.08)]">

          <div className="absolute inset-2 rounded-[20px] bg-[#EAF6F0]" />

          {isOnline ? (
            <AlertCircle
              size={42}
              strokeWidth={1.8}
              className="relative z-10 text-[#158F66]"
            />
          ) : (
            <WifiOff
              size={42}
              strokeWidth={1.8}
              className="relative z-10 text-[#158F66]"
            />
          )}
        </div>

        {/* Статус */}
        <span className="mb-3 rounded-full border border-[#158F66]/15 bg-[#EAF6F0] px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-[#158F66]">
          {isOnline ? 'ZABU · SYSTEM' : 'ZABU · OFFLINE'}
        </span>

        {/* Заголовок */}
        <h2 className="text-2xl font-black tracking-tight text-[#0B3D2E] md:text-3xl">
          {isOnline
            ? 'К сожалению, не удалось загрузить данные'
            : 'Нет сети'}
          <span className="text-[#158F66]">.</span>
        </h2>

        {/* Описание */}
        <p className="mt-4 max-w-sm text-sm font-medium leading-relaxed text-[#0B3D2E]/55 md:text-base">
          {isOnline
            ? 'Что-то пошло не так при загрузке вашего профиля. Пожалуйста, попробуйте позже или повторите попытку.'
            : 'Похоже, подключение к интернету отсутствует. Проверьте свою сеть и попробуйте снова.'}
        </p>

        {/* Кнопка */}
        <button
          type="button"
          onClick={handleRetry}
          disabled={retrying}
          className="mt-7 inline-flex h-12 items-center justify-center gap-2.5 rounded-full border-2 border-[#0B3D2E] bg-[#158F66] px-7 text-sm font-black text-white shadow-[0_5px_0_#0B3D2E] transition-all hover:-translate-y-0.5 hover:bg-[#0B3D2E] active:translate-y-1 active:shadow-none disabled:cursor-wait disabled:opacity-70"
        >
          <RefreshCw
            size={17}
            className={retrying ? 'animate-spin' : ''}
          />
          {retrying ? 'Загрузка...' : 'Попробовать снова'}
        </button>

        {/* Нижняя подпись */}
        <div className="mt-10 flex items-center gap-2 text-xs font-bold text-[#0B3D2E]/30">
          <BookOpen size={15} />
          Продолжайте изучать языки с ZABU
        </div>
      </div>
    </section>
  );
}
