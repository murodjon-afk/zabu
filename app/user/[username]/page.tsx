
'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Suspense } from "react";


import { Profile } from '../../components/dashboard/section/Profile';

import { DashboardErrorState } from '../../components/dashboard/DashboardErrorState';
import { Header } from '../../components/dashboard/Header';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { Modal } from '../../components/dashboard/Modal';
import { Toast } from '../../components/dashboard/Toast';
import { ProfileModalContent } from '../../components/dashboard/ProfileModalContent';
import { navItems, type TabId } from '../../components/dashboard/constants';
import type { DashboardCtx } from '../../components/dashboard/types';

import { useDashboardProfile } from '../../components/dashboard/hooks/useDashboardProfile';
import { useHashTab } from '../../components/dashboard/hooks/useHashTab';
import { useModalToast } from '../../components/dashboard/hooks/useModalToast';

import { OverviewSection } from '../../components/dashboard/section/OverviewSection';
import { LessonsSection } from '../../components/dashboard/section/overview/LessonsSection';
import PracticeSection  from '../../components/dashboard/section/overview/PracticeSection';
import { DictionarySection } from '../../components/dashboard/section/overview/DictionarySection';
import { SettingsSection } from '../../components/dashboard/section/overview/SettingsSection';
const SECTIONS: Record<TabId, React.ComponentType<{ ctx: DashboardCtx }>> = {
  overview: OverviewSection,
  profile: Profile,
  lessons: LessonsSection,
  practice: PracticeSection,
  dictionary: DictionarySection,
  settings: SettingsSection,
};
function ZabuDashboardContent() {  const params = useParams<{ username: string }>();
  const username = decodeURIComponent(params.username || '');

  const {
    p,
    users,
    ranked,
    rank,
    currentUser,
    loading,
    error,
  } = useDashboardProfile();

  const { tab, goTo: goToTab, ready } = useHashTab();

  const {
    modal,
    openModal,
    closeModal,
    toastMessage,
    triggerToast,
  } = useModalToast();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const goTo = useCallback(
    (id: TabId) => {
      goToTab(id);
      setSidebarOpen(false);
    },
    [goToTab],
  );

  const copyInvite = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin);
      triggerToast('Ссылка скопирована 🔗');
    } catch {
      triggerToast('Не удалось скопировать ссылку');
    }
  }, [triggerToast]);

  useEffect(() => {
    document.documentElement.style.scrollbarGutter = 'stable';

    return () => {
      document.documentElement.style.scrollbarGutter = '';
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow =
      modal.isOpen || sidebarOpen ? 'hidden' : '';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
        setSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [modal.isOpen, sidebarOpen, closeModal]);

  const ctx: DashboardCtx = {
    p,
    users,
    ranked,
    rank,
    currentUser,
    loading,
    goTo,
    openModal,
    closeModal,
    triggerToast,
    copyInvite,
  };

  const Active = SECTIONS[tab];

  return (
    <div
      className="min-h-screen bg-slate-50 font-sans text-slate-800 selection:bg-emerald-500 selection:text-white"
      data-username={username}
    >
      <Header
        p={p}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onLogo={() => goTo('overview')}
        onBell={() => triggerToast('У вас нет новых уведомлений')}
        onProfile={() =>
          goTo('profile')
        }
      />

      <Sidebar
        activeTab={tab}
        open={sidebarOpen}
        onSelect={goTo}
        onClose={() => setSidebarOpen(false)}
      />


<main
  className="
    min-h-screen
    min-w-0
    w-full
    pt-16
    min-[900px]:pl-[72px]
    min-[1280px]:pl-64
  "
>
  <div className="
    mx-auto
    w-full
    min-w-0
    max-w-[1440px]
    px-4
    py-5
    sm:px-6
    lg:px-8
    2xl:px-10
  ">
    {error ? (
      <DashboardErrorState />
    ) : (
      ready && Active && <Active ctx={ctx} />
    )}
  </div>
</main>


      <Modal modal={modal} onClose={closeModal} />

      <Toast message={toastMessage} />
    </div>
  );
}


export default function ZabuDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F6F9F7]" />}>
      <ZabuDashboardContent />
    </Suspense>
  );
}