'use client';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import type { ModalConfig } from '../types';

export function useModalToast() {
  const [modal, setModal] = useState<ModalConfig>({ isOpen: false });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const triggerToast = useCallback((msg: string) => {
    if (timer.current) clearTimeout(timer.current);
    setToastMessage(msg);
    timer.current = setTimeout(() => setToastMessage(null), 2500);
  }, []);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const openModal = useCallback(
    (title: string, content: ReactNode) => setModal({ isOpen: true, title, content }),
    []
  );
  const closeModal = useCallback(() => setModal({ isOpen: false }), []);

  return { modal, openModal, closeModal, toastMessage, triggerToast };
}