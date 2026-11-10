'use client';
import { X } from 'lucide-react';
import type { ModalConfig } from './types';

export function Modal({ modal, onClose }: { modal: ModalConfig; onClose: () => void }) {
  if (!modal.isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-md w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl relative border border-slate-100"
      >
        <button
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        {modal.title && <h3 className="text-xl font-bold text-slate-900 mb-4 pr-10">{modal.title}</h3>}
        <div>{modal.content}</div>
      </div>
    </div>
  );
}