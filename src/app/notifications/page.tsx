'use client';

import React from 'react';
import { useAppState } from '@/context/app-state-context';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadNotificationCount } = useAppState();
  const router = useRouter();

  function getTimeAgo(timestamp: string): string {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  }

  const iconMap = {
    success: { icon: 'check_circle', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    error: { icon: 'error', color: 'text-red-400', bg: 'bg-red-400/10' },
    warning: { icon: 'warning', color: 'text-amber-400', bg: 'bg-amber-400/10' },
    info: { icon: 'info', color: 'text-blue-400', bg: 'bg-blue-400/10' },
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 pt-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-[var(--text-main)] mb-2 tracking-tight">Trung tâm thông báo</h1>
          <p className="text-[var(--text-muted)] text-sm font-medium">
            Bạn có <span className="text-white font-bold">{unreadNotificationCount}</span> thông báo chưa đọc.
          </p>
        </div>
        {unreadNotificationCount > 0 && (
          <button 
            onClick={markAllNotificationsRead}
            className="self-start sm:self-auto px-4 py-2 rounded-lg bg-[var(--bg-hover)] text-[var(--text-main)] text-sm font-medium hover:bg-white/10 transition-colors flex items-center gap-2 border border-white/5"
          >
            <span className="material-symbols-outlined text-[18px]">done_all</span>
            Đánh dấu đã đọc tất cả
          </button>
        )}
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
        {notifications.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-[var(--bg-hover)] flex items-center justify-center mb-4 border border-white/5 shadow-inner">
              <span className="material-symbols-outlined text-3xl text-[var(--text-muted)]">notifications_off</span>
            </div>
            <h3 className="text-lg font-medium text-[var(--text-main)] mb-1">Không có thông báo nào</h3>
            <p className="text-sm text-[var(--text-muted)]">Bạn đã cập nhật toàn bộ tin tức mới nhất.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {notifications.map((notif) => {
              const style = iconMap[notif.type];
              return (
                <div 
                  key={notif.id}
                  onClick={() => {
                    markNotificationRead(notif.id);
                    if (notif.link) router.push(notif.link);
                  }}
                  className={cn(
                    "flex flex-col sm:flex-row sm:items-start gap-4 p-5 hover:bg-white/[0.04] transition-colors cursor-pointer relative group",
                    !notif.read ? "bg-white/[0.03]" : ""
                  )}
                >
                  {/* Unread dot indicator */}
                  {!notif.read && (
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]"></div>
                  )}

                  <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 hidden sm:flex border border-white/5", style.bg, style.color)}>
                    <span className="material-symbols-outlined text-[20px]">{style.icon}</span>
                  </div>

                  <div className="flex-1 min-w-0 pr-4 pl-2 sm:pl-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={cn("text-base truncate", !notif.read ? "font-semibold text-white" : "font-medium text-[var(--text-main)]")}>
                        {notif.title}
                      </h4>
                      {!notif.read && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 ml-2 border border-blue-500/30">Mới</span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--text-muted)] mb-2 line-clamp-2">
                      {notif.message}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {getTimeAgo(notif.timestamp)}
                    </p>
                  </div>

                  {notif.link && (
                    <div className="hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity self-center shrink-0">
                      <span className="w-8 h-8 rounded-full bg-[var(--bg-hover)] flex items-center justify-center text-[var(--text-muted)] group-hover:text-white border border-white/5">
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
