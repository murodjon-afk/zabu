
'use client';

import { useCallback, useEffect, useState } from 'react';
import type { TabId } from '../constants';

const DEFAULT_TAB: TabId = 'overview';

const VALID_TABS = new Set<TabId>([
  'overview',
  'profile',
  'lessons',
  'practice',
  'dictionary',
  'settings',
]);

function getTabFromHash(): TabId {
  try {
    const hash = decodeURIComponent(
      window.location.hash.replace(/^#/, '').trim()
    );

    return VALID_TABS.has(hash as TabId)
      ? (hash as TabId)
      : DEFAULT_TAB;
  } catch {
    return DEFAULT_TAB;
  }
}

export function useHashTab() {
  const [tab, setTab] = useState<TabId>(DEFAULT_TAB);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Восстанавливаем вкладку из URL при открытии страницы
    const syncTab = () => {
      setTab(getTabFromHash());
    };

    syncTab();
    setReady(true);

    // Следим за изменениями URL
    window.addEventListener('hashchange', syncTab);
    window.addEventListener('popstate', syncTab);

    return () => {
      window.removeEventListener('hashchange', syncTab);
      window.removeEventListener('popstate', syncTab);
    };
  }, []);

  const goTo = useCallback((id: TabId) => {
    setTab(id);

    const hash = `#${id}`;

    if (window.location.hash !== hash) {
      window.history.pushState(
        { tab: id },
        '',
        `${window.location.pathname}${window.location.search}${hash}`
      );
    }
  }, []);

  return {
    tab,
    goTo,
    ready,
  };
}
