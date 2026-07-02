'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';
import { useRole } from '@/context/role-context';
import { useLanguage } from '@/context/language-context';
import { useAppState } from '@/context/app-state-context';
import { useToast } from '@/components/ui/toast';
import CreateContentModal from '@/components/modals/create-content-modal';
import { ContentItem, ContentType, Platform, ApprovalStatus } from '@/types';
import {
  CalendarDays,
  CalendarRange,
  List,
  Plus,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Video,
  FileText,
  Share2,
  Radio,
  Clock,
  CheckCircle2,
  Eye,
  Send,
  Sparkles,
  BarChart3,
  AlertCircle,
  Check,
  X,
  Edit3,
  Globe,
  Play,
  Hash,
  ThumbsUp,
} from 'lucide-react';

/* ══════════════════════════ CONSTANTS ══════════════════════════ */

const CONTENT_TYPE_COLORS: Record<ContentType, { bg: string; text: string; dot: string }> = {
  Video:      { bg: 'bg-violet-100 dark:bg-violet-900/40', text: 'text-violet-700 dark:text-violet-300', dot: 'bg-violet-500' },
  Article:    { bg: 'bg-blue-100 dark:bg-blue-900/40',     text: 'text-blue-700 dark:text-blue-300',     dot: 'bg-blue-500' },
  SocialPost: { bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
  Livestream: { bg: 'bg-rose-100 dark:bg-rose-900/40',     text: 'text-rose-700 dark:text-rose-300',     dot: 'bg-rose-500' },
};

const STATUS_COLORS: Record<ApprovalStatus, { bg: string; text: string }> = {
  Draft:           { bg: 'bg-slate-100 dark:bg-slate-800/60', text: 'text-slate-600 dark:text-slate-300' },
  PendingReview:   { bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-300' },
  ApprovedByLeader:{ bg: 'bg-teal-100 dark:bg-teal-900/40',  text: 'text-teal-700 dark:text-teal-300' },
  Approved:        { bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-300' },
  Scheduled:       { bg: 'bg-blue-100 dark:bg-blue-900/40',  text: 'text-blue-700 dark:text-blue-300' },
  Published:       { bg: 'bg-green-100 dark:bg-green-900/40', text: 'text-green-700 dark:text-green-300' },
  Rejected:        { bg: 'bg-red-100 dark:bg-red-900/40',    text: 'text-red-700 dark:text-red-300' },
};

const STATUS_LABELS: Record<ApprovalStatus, string> = {
  Draft: 'Draft',
  PendingReview: 'Pending Review',
  ApprovedByLeader: 'Leader Approved',
  Approved: 'Approved',
  Scheduled: 'Scheduled',
  Published: 'Published',
  Rejected: 'Rejected',
};

const CONTENT_TYPE_ICONS: Record<ContentType, React.ReactNode> = {
  Video:      <Video className="w-3.5 h-3.5" />,
  Article:    <FileText className="w-3.5 h-3.5" />,
  SocialPost: <Share2 className="w-3.5 h-3.5" />,
  Livestream: <Radio className="w-3.5 h-3.5" />,
};

const PLATFORM_ICONS: Record<Platform, React.ReactNode> = {
  Facebook:  <ThumbsUp className="w-3.5 h-3.5" />,
  TikTok:    <Play className="w-3.5 h-3.5" />,
  YouTube:   <Play className="w-3.5 h-3.5" />,
  Instagram: <Hash className="w-3.5 h-3.5" />,
  Website:   <Globe className="w-3.5 h-3.5" />,
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 15 }, (_, i) => i + 8); // 8AM to 10PM

/* ══════════════════════════ HELPERS ══════════════════════════ */

function getMonthCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();

  // Monday = 0, Sunday = 6
  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;

  const cells: { day: number; inMonth: boolean; date: string }[] = [];

  // Previous month padding
  const prevMonthLast = new Date(year, month, 0).getDate();
  for (let i = startDow - 1; i >= 0; i--) {
    const d = prevMonthLast - i;
    const m = month === 0 ? 12 : month;
    const y = month === 0 ? year - 1 : year;
    cells.push({ day: d, inMonth: false, date: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}` });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, inMonth: true, date: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}` });
  }

  // Next month padding
  const remaining = 7 - (cells.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      const m = month + 2 > 12 ? 1 : month + 2;
      const y = month + 2 > 12 ? year + 1 : year;
      cells.push({ day: d, inMonth: false, date: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}` });
    }
  }

  return cells;
}

function getWeekDates(baseDate: Date): Date[] {
  const d = new Date(baseDate);
  const dayOfWeek = d.getDay();
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Monday
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date;
  });
}

function formatDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function isToday(dateStr: string): boolean {
  const today = new Date();
  return dateStr === formatDateStr(today);
}

/* ══════════════════════════ SUB-COMPONENTS ══════════════════════════ */

/* ── Dropdown ── */
function Dropdown({
  label,
  value,
  options,
  onChange,
  icon,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  icon?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-medium text-[var(--text-secondary)] hover:border-indigo-500/40 transition-all"
      >
        {icon}
        {value === 'All' ? label : value}
        <ChevronDown className="w-3 h-3" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 left-0 z-50 w-44 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-xl shadow-black/10 py-1">
            {options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={cn(
                  'w-full text-left px-3 py-2 text-xs hover:bg-[var(--bg-tertiary)] transition-colors',
                  value === opt.value ? 'text-indigo-500 font-semibold' : 'text-[var(--text-secondary)]'
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Stat Card ── */
function StatCard({
  label,
  value,
  sub,
  icon,
  color,
}: {
  label: string;
  value: number | string;
  sub?: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="relative rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 overflow-hidden group hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
      <div className={cn('absolute top-0 right-0 w-20 h-20 rounded-bl-[40px] opacity-[0.07]', color)} />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[12.5px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-bold text-[var(--text-primary)] tabular-nums">{value}</p>
          {sub && <p className="text-[12.5px] text-[var(--text-muted)] mt-0.5">{sub}</p>}
        </div>
        <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', color, 'text-white')}>
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ── Status Badge ── */
function StatusBadge({ status }: { status: ApprovalStatus }) {
  const sc = STATUS_COLORS[status];
  return (
    <span className={cn('inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap', sc.bg, sc.text)}>
      {STATUS_LABELS[status]}
    </span>
  );
}

/* ── Content Type Badge ── */
function TypeBadge({ type }: { type: ContentType }) {
  const tc = CONTENT_TYPE_COLORS[type];
  return (
    <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold', tc.bg, tc.text)}>
      {CONTENT_TYPE_ICONS[type]}
      {type}
    </span>
  );
}

/* ══════════════════════════ MONTHLY VIEW ══════════════════════════ */

function MonthView({
  items,
  year,
  month,
  selectedDate,
  onSelectDate,
}: {
  items: ContentItem[];
  year: number;
  month: number;
  selectedDate: string | null;
  onSelectDate: (d: string) => void;
}) {
  const cells = useMemo(() => getMonthCalendarDays(year, month), [year, month]);
  const itemsByDate = useMemo(() => {
    const map: Record<string, ContentItem[]> = {};
    items.forEach((item) => {
      if (!map[item.scheduledDate]) map[item.scheduledDate] = [];
      map[item.scheduledDate].push(item);
    });
    return map;
  }, [items]);

  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-[var(--card-border)]">
        {DAYS.map((day) => (
          <div
            key={day}
            className="py-2.5 text-center text-[12.5px] font-semibold uppercase tracking-wider text-[var(--text-muted)]"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {cells.map((cell, i) => {
          const dayItems = itemsByDate[cell.date] || [];
          const today = isToday(cell.date);
          const selected = selectedDate === cell.date;

          return (
            <button
              key={i}
              onClick={() => onSelectDate(cell.date)}
              className={cn(
                'relative min-h-[120px] p-2 border-b border-r border-[var(--card-border)] text-left transition-all duration-150',
                'hover:bg-[var(--bg-tertiary)]',
                !cell.inMonth && 'opacity-40',
                selected && 'bg-indigo-500/[0.06] dark:bg-indigo-500/[0.08]',
                today && 'ring-2 ring-inset ring-indigo-500/50'
              )}
            >
              {/* Day number */}
              <span
                className={cn(
                  'inline-flex items-center justify-center w-6 h-6 rounded-lg text-xs font-semibold mb-1',
                  today
                    ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white'
                    : 'text-[var(--text-secondary)]'
                )}
              >
                {cell.day}
              </span>

              {/* Content pills */}
              <div className="flex flex-col gap-0.5">
                {dayItems.slice(0, 3).map((item) => {
                  const tc = CONTENT_TYPE_COLORS[item.type];
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        'px-2 py-1 rounded-md text-[12.5px] font-medium truncate',
                        tc.bg, tc.text
                      )}
                      title={item.title}
                    >
                      {item.title}
                    </div>
                  );
                })}
                {dayItems.length > 3 && (
                  <span className="text-[10.5px] text-[var(--text-muted)] pl-1">
                    +{dayItems.length - 3} more
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════ WEEKLY VIEW ══════════════════════════ */

function WeekView({
  items,
  weekDates,
}: {
  items: ContentItem[];
  weekDates: Date[];
}) {
  const itemsByDate = useMemo(() => {
    const map: Record<string, ContentItem[]> = {};
    items.forEach((item) => {
      if (!map[item.scheduledDate]) map[item.scheduledDate] = [];
      map[item.scheduledDate].push(item);
    });
    return map;
  }, [items]);

  return (
    <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-[60px_repeat(7,1fr)] border-b border-[var(--card-border)]">
        <div className="py-3 border-r border-[var(--card-border)]" />
        {weekDates.map((date, i) => {
          const dateStr = formatDateStr(date);
          const today = isToday(dateStr);
          return (
            <div
              key={i}
              className={cn(
                'py-3 text-center border-r border-[var(--card-border)] last:border-r-0',
                today && 'bg-indigo-500/[0.06]'
              )}
            >
              <p className="text-[12.5px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                {DAYS[i]}
              </p>
              <p
                className={cn(
                  'text-lg font-bold mt-0.5',
                  today ? 'text-indigo-500' : 'text-[var(--text-primary)]'
                )}
              >
                {date.getDate()}
              </p>
            </div>
          );
        })}
      </div>

      {/* Time grid */}
      <div className="max-h-[520px] overflow-y-auto">
        {HOURS.map((hour) => (
          <div
            key={hour}
            className="grid grid-cols-[60px_repeat(7,1fr)] min-h-[80px] border-b border-[var(--card-border)] last:border-b-0"
          >
            {/* Hour label */}
            <div className="flex items-start justify-end pr-2 pt-1.5 border-r border-[var(--card-border)]">
              <span className="text-[12.5px] font-medium text-[var(--text-muted)] tabular-nums">
                {hour > 12 ? `${hour - 12}PM` : hour === 12 ? '12PM' : `${hour}AM`}
              </span>
            </div>

            {/* Day columns */}
            {weekDates.map((date, dayIdx) => {
              const dateStr = formatDateStr(date);
              const dayItems = (itemsByDate[dateStr] || []).filter((item) => {
                const h = parseInt(item.scheduledTime.split(':')[0], 10);
                return h === hour;
              });
              const today = isToday(dateStr);

              return (
                <div
                  key={dayIdx}
                  className={cn(
                    'border-r border-[var(--card-border)] last:border-r-0 p-0.5',
                    today && 'bg-indigo-500/[0.03]'
                  )}
                >
                  {dayItems.map((item) => {
                    const tc = CONTENT_TYPE_COLORS[item.type];
                    return (
                      <div
                        key={item.id}
                        className={cn(
                          'rounded-lg p-2.5 mb-1 cursor-pointer hover:scale-[1.02] transition-all border',
                          tc.bg,
                          'border-transparent hover:border-indigo-500/30'
                        )}
                      >
                        <p className={cn('text-[12px] font-semibold truncate', tc.text)}>
                          {item.title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[12.5px] font-medium text-[var(--text-muted)]">{item.scheduledTime}</span>
                          <span className={cn('w-1.5 h-1.5 rounded-full', tc.dot)} />
                          <span className="text-[12.5px] font-medium text-[var(--text-muted)]">{item.platform}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center bg-[var(--card-bg)] text-[10.5px] font-bold shadow-sm">
                            {getInitials(item.assignee.name)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function ListView({
  items,
  canApprove,
  canEditAll,
  canEditOwn,
  canSubmitIdea,
  currentUserId,
  currentRole,
  onApprove,
  onReject,
  onSubmit,
}: {
  items: ContentItem[];
  canApprove: boolean;
  canEditAll: boolean;
  canEditOwn: boolean;
  canSubmitIdea: boolean;
  currentUserId: string;
  currentRole: string;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onSubmit: (id: string) => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Table header */}
      <div className="grid grid-cols-[140px_2fr_120px_110px_150px_140px_130px_140px] gap-3 px-4 py-3 text-[13px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
        <span>Series</span>
        <span>Title</span>
        <span>Type</span>
        <span>Platform</span>
        <span>Scheduled</span>
        <span>Assignee</span>
        <span>Status</span>
        <span className="text-right">Actions</span>
      </div>

      {/* Rows */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-2.5 pb-4 px-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="group grid grid-cols-[140px_2fr_120px_110px_150px_140px_130px_140px] gap-3 items-center px-4 py-4 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] hover:shadow-md hover:border-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            {/* Series */}
            <div className="flex items-center min-w-0 pr-2">
              {item.series ? (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-[11px] font-medium bg-indigo-500/10 text-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-300 truncate max-w-full" title={item.series}>
                  #{item.series}
                </span>
              ) : (
                <span className="text-[12px] text-[var(--text-muted)] italic opacity-60">-</span>
              )}
            </div>

            {/* Title */}
            <div className="flex items-center gap-3 min-w-0">
              <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', CONTENT_TYPE_COLORS[item.type].bg, CONTENT_TYPE_COLORS[item.type].text)}>
                {CONTENT_TYPE_ICONS[item.type]}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[15px] font-semibold text-[var(--text-primary)] truncate group-hover:text-indigo-500 transition-colors">
                  {item.title}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-[var(--text-muted)] truncate">
                    ID: {item.id.split('-')[0]}
                  </span>
                </div>
              </div>
            </div>

            {/* Type */}
            <div>
              <TypeBadge type={item.type} />
            </div>

            {/* Platform */}
            <div className="flex items-center gap-1.5 text-[13px] font-medium text-[var(--text-secondary)]">
              {PLATFORM_ICONS[item.platform]}
              {item.platform}
            </div>

            {/* Scheduled */}
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg border border-[var(--card-border)] bg-[var(--bg-tertiary)] flex flex-col items-center justify-center shrink-0">
                <span className="text-[11.5px] font-semibold text-[var(--text-muted)] uppercase leading-none mb-0.5">
                  {new Date(item.scheduledDate).toLocaleDateString('en-US', { month: 'short' })}
                </span>
                <span className="text-sm font-bold text-[var(--text-primary)] leading-none">
                  {new Date(item.scheduledDate).getDate()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-medium text-[var(--text-secondary)]">
                  {new Date(item.scheduledDate).toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className="text-xs text-[var(--text-muted)] mt-0.5">
                  {item.scheduledTime}
                </span>
              </div>
            </div>

            {/* Assignee */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-sm ring-2 ring-[var(--card-bg)]">
                {getInitials(item.assignee.name)}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[13px] font-medium text-[var(--text-secondary)] truncate">
                  {item.assignee.name}
                </span>
              </div>
            </div>

            {/* Status */}
            <div>
              <StatusBadge status={item.status} />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 justify-end opacity-60 group-hover:opacity-100 transition-opacity">
              {canApprove && item.status === 'PendingReview' && (
                <>
                  <button
                    onClick={() => onApprove(item.id)}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600 hover:bg-emerald-500 hover:text-white dark:bg-emerald-500/20 dark:text-emerald-400 dark:hover:bg-emerald-500 dark:hover:text-white transition-all shadow-sm"
                    title="Approve"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onReject(item.id)}
                    className="w-8 h-8 rounded-full flex items-center justify-center bg-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white dark:bg-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500 dark:hover:text-white transition-all shadow-sm"
                    title="Reject"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              )}
              {(canEditAll || (canEditOwn && item.assignee.id === currentUserId && (item.status === 'Draft' || item.status === 'PendingReview'))) && (
                  <button
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-all"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
              )}
              {canSubmitIdea && item.status === 'Draft' &&
                (currentRole !== 'Staff' || item.assignee.id === currentUserId) && (
                <button
                  onClick={() => onSubmit(item.id)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-indigo-500 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-500/20 transition-all shadow-sm"
                  title={currentRole === 'Leader' ? 'Submit to Manager' : 'Submit to Leader'}
                >
                  <Send className="w-4 h-4 -ml-0.5" />
                </button>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-[var(--card-border)] rounded-2xl bg-[var(--card-bg)] text-sm text-[var(--text-muted)] mt-4">
            <List className="w-8 h-8 mb-3 text-[var(--text-muted)] opacity-50" />
            <p>No content items match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════ RIGHT SIDEBAR ══════════════════════════ */

function Sidebar({
  items,
  selectedDateItems,
  canApprove,
  pendingCount,
}: {
  items: ContentItem[];
  selectedDateItems: ContentItem[];
  canApprove: boolean;
  pendingCount: number;
}) {
  // Upcoming deadlines — next 3 scheduled items sorted by date
  const upcoming = useMemo(() => {
    const today = formatDateStr(new Date());
    return [...items]
      .filter((item) => item.scheduledDate >= today && item.status !== 'Published')
      .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate) || a.scheduledTime.localeCompare(b.scheduledTime))
      .slice(0, 3);
  }, [items]);

  const publishedCount = items.filter((i) => i.status === 'Published').length;
  const draftCount = items.filter((i) => i.status === 'Draft').length;

  return (
    <div className="w-72 shrink-0 flex flex-col gap-4">
      {/* Selected day detail */}
      {selectedDateItems.length > 0 && (
        <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
          <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
            Selected Day
          </h3>
          <div className="flex flex-col gap-2">
            {selectedDateItems.map((item) => {
              const tc = CONTENT_TYPE_COLORS[item.type];
              return (
                <div
                  key={item.id}
                  className={cn(
                    'rounded-lg p-2.5 border transition-all hover:scale-[1.01]',
                    tc.bg, 'border-transparent'
                  )}
                >
                  <p className={cn('text-xs font-semibold', tc.text)}>{item.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11.5px] text-[var(--text-muted)]">{item.scheduledTime}</span>
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Content Stats */}
      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
        <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
          Content Stats
        </h3>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-secondary)]">Published</span>
            <span className="text-xs font-bold text-emerald-500">{publishedCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-secondary)]">Drafts</span>
            <span className="text-xs font-bold text-slate-400">{draftCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-secondary)]">Total</span>
            <span className="text-xs font-bold text-[var(--text-primary)]">{items.length}</span>
          </div>
        </div>
      </div>

      {/* Upcoming deadlines */}
      <div className="rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
        <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
          Upcoming Deadlines
        </h3>
        <div className="flex flex-col gap-2">
          {upcoming.map((item) => (
            <div key={item.id} className="flex items-start gap-2.5">
              <div className={cn('w-1.5 h-1.5 rounded-full mt-1.5 shrink-0', CONTENT_TYPE_COLORS[item.type].dot)} />
              <div className="min-w-0">
                <p className="text-xs font-medium text-[var(--text-primary)] truncate">{item.title}</p>
                <p className="text-[11.5px] text-[var(--text-muted)]">
                  {new Date(item.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {item.scheduledTime}
                </p>
              </div>
            </div>
          ))}
          {upcoming.length === 0 && (
            <p className="text-xs text-[var(--text-muted)]">No upcoming deadlines</p>
          )}
        </div>
      </div>

      {/* AI Suggestion */}
      <div className="rounded-xl backdrop-blur-xl bg-gradient-to-br from-violet-500/[0.08] to-indigo-500/[0.08] border border-violet-500/20 p-4 ai-breathe">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-xs font-semibold text-[var(--text-primary)]">AI Suggestion</span>
        </div>
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          Best posting time: <span className="font-semibold text-violet-400">7 PM</span> for higher engagement. 
          TikTok videos posted between 6-8 PM get <span className="font-semibold text-emerald-400">32% more views</span> this month.
        </p>
        <div className="mt-3 pt-3 border-t border-violet-500/10">
          <p className="text-[11.5px] text-[var(--text-muted)]">
            💡 Consider scheduling the Global Pass BTS video for 7 PM instead of 6 PM.
          </p>
        </div>
      </div>

      {/* Pending approvals */}
      {canApprove && pendingCount > 0 && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-semibold text-amber-500">Pending Approvals</span>
          </div>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{pendingCount}</p>
          <p className="text-[11.5px] text-[var(--text-muted)] mt-1">items waiting for your review</p>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════ MAIN PAGE ══════════════════════════ */

export default function ContentCalendarPage() {
  const { currentRole, currentUser, hasPermission } = useRole();
  const { t } = useLanguage();
  const { contentItems, updateContentItem, addNotification } = useAppState();
  const { addToast } = useToast();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [view, setView] = useState<'month' | 'week' | 'list' | 'list-week'>('month');
  const [typeFilter, setTypeFilter] = useState('All');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [seriesFilter, setSeriesFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Current month/week navigation
  const [currentMonth, setCurrentMonth] = useState(5); // June = 5 (0-indexed)
  const [currentYear, setCurrentYear] = useState(2026);
  const [weekBase, setWeekBase] = useState(new Date(2026, 5, 4)); // June 4, 2026

  const weekDates = useMemo(() => getWeekDates(weekBase), [weekBase]);

  // Permissions
  const canApprove = hasPermission('content.approve');
  const canCreateCalendar = hasPermission('content.create_calendar');
  const canSubmitIdea = hasPermission('content.submit_idea');
  const canEditAll = hasPermission('content.edit_all');
  const canEditOwn = hasPermission('content.edit_own');
  const canViewAll = hasPermission('content.view_all');
  const canViewTeam = hasPermission('content.view_team');

  // ─── Handlers ─────────────────────────────────────────────────────────
  const handleApprove = (id: string) => {
    const item = contentItems.find(c => c.id === id);
    if (!item) return;
    const newStatus = currentRole === 'Manager' ? 'Scheduled' : 'ApprovedByLeader';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateContentItem(id, { status: newStatus as any, approvedBy: currentUser });
    addNotification({ title: 'Content Approved', message: `"${item.title}" has been approved`, type: 'success', link: '/content-calendar' });
    addToast({ title: 'Content Approved', message: item.title, type: 'success' });
  };

  const handleReject = (id: string) => {
    const item = contentItems.find(c => c.id === id);
    if (!item) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateContentItem(id, { status: 'Rejected' as any });
    addToast({ title: 'Content Rejected', message: item.title, type: 'warning' });
  };

  const handleSubmitForReview = (id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateContentItem(id, { status: 'PendingReview' as any });
    addToast({ title: 'Submitted for Review', type: 'info' });
  };

  // Filter items by role
  const roleFilteredItems = useMemo(() => {
    if (canViewAll) return contentItems;
    if (canViewTeam) {
      // Leader sees team items (same teamId)
      return contentItems.filter(
        (item) => item.assignee.teamId === currentUser.teamId
      );
    }
    // Staff sees only their own
    return contentItems.filter((item) => item.assignee.id === currentUser.id);
  }, [canViewAll, canViewTeam, currentUser, contentItems]);

  // Apply filters
  const filteredItems = useMemo(() => {
    let list = [...roleFilteredItems];
    if (typeFilter !== 'All') list = list.filter((i) => i.type === typeFilter);
    if (platformFilter !== 'All') list = list.filter((i) => i.platform === platformFilter);
    if (statusFilter !== 'All') list = list.filter((i) => i.status === statusFilter);
    if (seriesFilter !== 'All') list = list.filter((i) => i.series === seriesFilter);
    return list.sort((a, b) => {
      const cmp = a.scheduledDate.localeCompare(b.scheduledDate) || a.scheduledTime.localeCompare(b.scheduledTime);
      return sortOrder === 'asc' ? cmp : -cmp;
    });
  }, [roleFilteredItems, typeFilter, platformFilter, statusFilter, seriesFilter, sortOrder]);

  // Unique series for dropdown
  const uniqueSeries = useMemo(() => {
    const set = new Set<string>();
    contentItems.forEach(i => { if (i.series) set.add(i.series); });
    return Array.from(set).sort();
  }, [contentItems]);

  // List week items (filtered by week dates)
  const listWeekItems = useMemo(() => {
    if (view !== 'list-week') return filteredItems;
    const weekStrings = weekDates.map(d => {
       const yyyy = d.getFullYear();
       const mm = String(d.getMonth() + 1).padStart(2, '0');
       const dd = String(d.getDate()).padStart(2, '0');
       return `${yyyy}-${mm}-${dd}`;
    });
    return filteredItems.filter(i => weekStrings.includes(i.scheduledDate));
  }, [view, filteredItems, weekDates]);

  // Stats
  const totalThisMonth = roleFilteredItems.filter((i) => {
    const d = new Date(i.scheduledDate);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).length;
  const publishedCount = roleFilteredItems.filter((i) => i.status === 'Published').length;
  const pendingCount = roleFilteredItems.filter((i) => i.status === 'PendingReview').length;
  const scheduledCount = roleFilteredItems.filter((i) => i.status === 'Scheduled').length;
  const publishedPct = totalThisMonth > 0 ? Math.round((publishedCount / totalThisMonth) * 100) : 0;

  // Selected date items
  const selectedDateItems = useMemo(() => {
    if (!selectedDate) return [];
    return filteredItems.filter((i) => i.scheduledDate === selectedDate);
  }, [selectedDate, filteredItems]);

  // Month name
  const monthName = new Date(currentYear, currentMonth).toLocaleString('en-US', { month: 'long', year: 'numeric' });

  // Week range label
  const weekLabel = `${weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  return (
    <div className="flex flex-col h-full">
      {/* ────────── Header ────────── */}
      <div className="shrink-0 px-6 pt-6 pb-4 space-y-4">
        {/* Title row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">{t('content.title')}</h1>
              <p className="text-xs text-[var(--text-muted)]">
                {roleFilteredItems.length} content items · {monthName}
              </p>
            </div>
          </div>

          {/* Primary action (role-based) */}
          <div className="flex items-center gap-2">
            {canApprove && pendingCount > 0 && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-amber-500/30 bg-amber-500/[0.08] text-sm font-semibold text-amber-500">
                <AlertCircle className="w-4 h-4" />
                {pendingCount} Pending
              </div>
            )}
            {canCreateCalendar && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all active:scale-[0.97]"
              >
                <Plus className="w-4 h-4" />
                {t('content.createSchedule')}
              </button>
            )}
            {canSubmitIdea && !canCreateCalendar && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all active:scale-[0.97]"
              >
                <Plus className="w-4 h-4" />
                {t('content.suggestIdea')}
              </button>
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* View toggle */}
          <div className="flex items-center rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-0.5">
            {[
              { key: 'month' as const, icon: <CalendarDays className="w-3.5 h-3.5" />, label: 'Month' },
              { key: 'week' as const, icon: <CalendarRange className="w-3.5 h-3.5" />, label: 'Week' },
              { key: 'list-week' as const, icon: <List className="w-3.5 h-3.5" />, label: 'List (Week)' },
              { key: 'list' as const, icon: <List className="w-3.5 h-3.5" />, label: 'List (All)' },
            ].map((v) => (
              <button
                key={v.key}
                onClick={() => setView(v.key)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  view === v.key
                    ? 'bg-indigo-500 text-white shadow-sm'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                )}
              >
                {v.icon}
                {v.label}
              </button>
            ))}
          </div>

          {/* Date navigation */}
          {view !== 'list' && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  if (view === 'month') {
                    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
                    else setCurrentMonth((m) => m - 1);
                  } else {
                    setWeekBase((d) => { const n = new Date(d); n.setDate(n.getDate() - 7); return n; });
                  }
                }}
                className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-semibold text-[var(--text-primary)] min-w-[140px] text-center">
                {view === 'month' ? monthName : weekLabel}
              </span>
              <button
                onClick={() => {
                  if (view === 'month') {
                    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
                    else setCurrentMonth((m) => m + 1);
                  } else {
                    setWeekBase((d) => { const n = new Date(d); n.setDate(n.getDate() + 7); return n; });
                  }
                }}
                className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Filters */}
          <Dropdown
            label="Sort"
            value={sortOrder}
            icon={<ArrowUpDown className="w-3.5 h-3.5" />}
            options={[
              { value: 'asc', label: 'Oldest' },
              { value: 'desc', label: 'Newest' },
            ]}
            onChange={setSortOrder as any}
          />
          {uniqueSeries.length > 0 && (
            <Dropdown
              label="Series"
              value={seriesFilter}
              options={[
                { value: 'All', label: 'All Series' },
                ...uniqueSeries.map(s => ({ value: s, label: s }))
              ]}
              onChange={setSeriesFilter}
            />
          )}
          <Dropdown
            label="Type"
            value={typeFilter}
            icon={<Filter className="w-3.5 h-3.5" />}
            options={[
              { value: 'All', label: 'All Types' },
              { value: 'Video', label: 'Video' },
              { value: 'Article', label: 'Article' },
              { value: 'SocialPost', label: 'Social Post' },
              { value: 'Livestream', label: 'Livestream' },
            ]}
            onChange={setTypeFilter}
          />
          <Dropdown
            label="Platform"
            value={platformFilter}
            options={[
              { value: 'All', label: 'All Platforms' },
              { value: 'Facebook', label: 'Facebook' },
              { value: 'TikTok', label: 'TikTok' },
              { value: 'YouTube', label: 'YouTube' },
              { value: 'Instagram', label: 'Instagram' },
              { value: 'Website', label: 'Website' },
            ]}
            onChange={setPlatformFilter}
          />
          <Dropdown
            label="Status"
            value={statusFilter}
            options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'Draft', label: 'Draft' },
              { value: 'PendingReview', label: 'Pending Review' },
              { value: 'Approved', label: 'Approved' },
              { value: 'Scheduled', label: 'Scheduled' },
              { value: 'Published', label: 'Published' },
              { value: 'Rejected', label: 'Rejected' },
            ]}
            onChange={setStatusFilter}
          />
        </div>
      </div>

      {/* ────────── Stats Bar ────────── */}
      <div className="shrink-0 px-6 pb-4">
        <div className="grid grid-cols-4 gap-4">
          <StatCard
            label="Total This Month"
            value={totalThisMonth}
            icon={<BarChart3 className="w-4 h-4" />}
            color="bg-indigo-500"
          />
          <StatCard
            label="Published"
            value={publishedCount}
            sub={`${publishedPct}% of total`}
            icon={<CheckCircle2 className="w-4 h-4" />}
            color="bg-emerald-500"
          />
          <StatCard
            label="Pending Review"
            value={pendingCount}
            icon={<Eye className="w-4 h-4" />}
            color="bg-amber-500"
          />
          <StatCard
            label="Scheduled"
            value={scheduledCount}
            icon={<Clock className="w-4 h-4" />}
            color="bg-blue-500"
          />
        </div>
      </div>

      {/* ────────── Body ────────── */}
      <div className="flex-1 overflow-hidden px-6 pb-6">
        {view === 'list' || view === 'list-week' ? (
          <div className="h-full overflow-y-auto">
            <ListView
              items={view === 'list-week' ? listWeekItems : filteredItems}
              canApprove={canApprove}
              canEditAll={canEditAll}
              canEditOwn={canEditOwn}
              canSubmitIdea={canSubmitIdea}
              currentUserId={currentUser.id}
              currentRole={currentRole}
              onApprove={handleApprove}
              onReject={handleReject}
              onSubmit={handleSubmitForReview}
            />
          </div>
        ) : (
          <div className="flex gap-4 h-full overflow-y-auto">
            {/* Calendar */}
            <div className="flex-1 min-w-0">
              {view === 'month' ? (
                <MonthView
                  items={filteredItems}
                  year={currentYear}
                  month={currentMonth}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                />
              ) : (
                <WeekView
                  items={filteredItems}
                  weekDates={weekDates}
                />
              )}
            </div>

            {/* Right Sidebar */}
            <Sidebar
              items={filteredItems}
              selectedDateItems={selectedDateItems}
              canApprove={canApprove}
              pendingCount={pendingCount}
            />
          </div>
        )}
      </div>

      {/* Create Content Modal */}
      <CreateContentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        defaultDate={selectedDate || undefined}
      />
    </div>
  );
}
