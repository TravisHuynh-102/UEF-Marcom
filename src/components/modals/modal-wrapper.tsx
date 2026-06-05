'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/theme-context';

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export default function ModalWrapper({ isOpen, onClose, title, subtitle, children, size = 'md' }: ModalWrapperProps) {
  const { theme } = useTheme();
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className={cn(
          'relative z-10 w-full rounded-2xl border shadow-2xl',
          'animate-in zoom-in-95 fade-in duration-200',
          sizeClasses[size],
          theme === 'dark'
            ? 'bg-[#16161f] border-white/[0.08]'
            : 'bg-white border-gray-200'
        )}
      >
        {/* Header */}
        <div className={cn(
          'flex items-center justify-between border-b px-6 py-4',
          theme === 'dark' ? 'border-white/[0.06]' : 'border-gray-100'
        )}>
          <div>
            <h2 className={cn(
              'text-lg font-bold',
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {title}
            </h2>
            {subtitle && (
              <p className={cn(
                'text-xs mt-0.5',
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              )}>
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-lg transition-all hover:scale-105',
              theme === 'dark'
                ? 'text-gray-500 hover:bg-white/[0.06] hover:text-white'
                : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'
            )}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Reusable Form Field ────────────────────────────────────────────────────
interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}

export function FormField({ label, required, children }: FormFieldProps) {
  const { theme } = useTheme();
  return (
    <div className="space-y-1.5">
      <label className={cn(
        'block text-sm font-medium',
        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
      )}>
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

// ─── Reusable Input ─────────────────────────────────────────────────────────
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export function FormInput(props: FormInputProps) {
  const { theme } = useTheme();
  return (
    <input
      {...props}
      className={cn(
        'h-10 w-full rounded-xl border px-3 text-sm outline-none transition-all',
        theme === 'dark'
          ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-gray-600 focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20'
          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-violet-300 focus:ring-1 focus:ring-violet-200',
        props.className
      )}
    />
  );
}

// ─── Reusable Select ────────────────────────────────────────────────────────
interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export function FormSelect(props: FormSelectProps) {
  const { theme } = useTheme();
  const { children, ...rest } = props;
  return (
    <select
      {...rest}
      className={cn(
        'h-10 w-full rounded-xl border px-3 text-sm outline-none transition-all appearance-none cursor-pointer',
        theme === 'dark'
          ? 'bg-white/[0.04] border-white/[0.08] text-white focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20'
          : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-violet-300 focus:ring-1 focus:ring-violet-200',
        rest.className
      )}
    >
      {children}
    </select>
  );
}

// ─── Reusable Textarea ──────────────────────────────────────────────────────
interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function FormTextarea(props: FormTextareaProps) {
  const { theme } = useTheme();
  return (
    <textarea
      {...props}
      className={cn(
        'w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition-all resize-none',
        theme === 'dark'
          ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder:text-gray-600 focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20'
          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-violet-300 focus:ring-1 focus:ring-violet-200',
        props.className
      )}
    />
  );
}

// ─── Action Buttons ─────────────────────────────────────────────────────────
interface ModalActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  submitLabel?: string;
  submitVariant?: 'primary' | 'danger';
  disabled?: boolean;
}

export function ModalActions({ onCancel, onSubmit, submitLabel = 'Create', submitVariant = 'primary', disabled }: ModalActionsProps) {
  const { theme } = useTheme();
  return (
    <div className={cn(
      'flex items-center justify-end gap-3 border-t pt-5 mt-5',
      theme === 'dark' ? 'border-white/[0.06]' : 'border-gray-100'
    )}>
      <button
        onClick={onCancel}
        className={cn(
          'h-10 px-5 rounded-xl text-sm font-medium transition-all hover:scale-105 active:scale-95',
          theme === 'dark'
            ? 'text-gray-400 hover:bg-white/[0.06] hover:text-white'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        )}
      >
        Cancel
      </button>
      <button
        onClick={onSubmit}
        disabled={disabled}
        className={cn(
          'h-10 px-6 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
          submitVariant === 'danger'
            ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-red-600/20 hover:shadow-red-600/30'
            : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-violet-600/20 hover:shadow-violet-600/30'
        )}
      >
        {submitLabel}
      </button>
    </div>
  );
}

// ─── Confirm Delete Modal ───────────────────────────────────────────────────
interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
}

export function ConfirmDeleteModal({ isOpen, onClose, onConfirm, title = 'Confirm Delete', message, itemName }: ConfirmDeleteModalProps) {
  const { theme } = useTheme();
  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
            <span className="text-2xl">🗑️</span>
          </div>
          <div>
            <p className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
              {message || `Are you sure you want to delete${itemName ? ` "${itemName}"` : ' this item'}? This action cannot be undone.`}
            </p>
          </div>
        </div>
        <ModalActions
          onCancel={onClose}
          onSubmit={onConfirm}
          submitLabel="Delete"
          submitVariant="danger"
        />
      </div>
    </ModalWrapper>
  );
}
