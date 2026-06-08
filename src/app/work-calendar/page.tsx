'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';
import { useRole } from '@/context/role-context';
import { useAppState } from '@/context/app-state-context';
import { useToast } from '@/components/ui/toast';
import CreateWorkTripModal from '@/components/modals/create-worktrip-modal';
import { WorkTrip, WorkTripType } from '@/types';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Plus,
  Clock,
  Plane,
  Home,
  GraduationCap,
  TreePalm,
  Check,
  X,
  MapPin,
  CalendarClock,
  Users,
} from 'lucide-react';

/* ════════════════════════════ Constants ════════════════════════════ */

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

const TYPE_CONFIG: Record<WorkTripType, {
  label: string;
  color: string;
  pillBg: string;
  pillText: string;
  dot: string;
  icon: React.ReactNode;
}> = {
  BusinessTrip: {
    label: 'Business Trip',
    color: 'blue',
    pillBg: 'bg-blue-500/15 dark:bg-blue-500/20',
    pillText: 'text-blue-700 dark:text-blue-300',
    dot: 'bg-blue-500',
    icon: <Plane className="w-3 h-3" />,
  },
  WFH: {
    label: 'WFH',
    color: 'teal',
    pillBg: 'bg-emerald-500/15 dark:bg-emerald-500/20',
    pillText: 'text-emerald-700 dark:text-emerald-300',
    dot: 'bg-emerald-500',
    icon: <Home className="w-3 h-3" />,
  },
  Leave: {
    label: 'Leave',
    color: 'amber',
    pillBg: 'bg-amber-500/15 dark:bg-amber-500/20',
    pillText: 'text-amber-700 dark:text-amber-300',
    dot: 'bg-amber-500',
    icon: <TreePalm className="w-3 h-3" />,
  },
  Training: {
    label: 'Training',
    color: 'purple',
    pillBg: 'bg-violet-500/15 dark:bg-violet-500/20',
    pillText: 'text-violet-700 dark:text-violet-300',
    dot: 'bg-violet-500',
    icon: <GraduationCap className="w-3 h-3" />,
  },
};

const STATUS_INDICATOR: Record<WorkTrip['status'], { icon: string; color: string }> = {
  Pending: { icon: '⏳', color: 'text-amber-500' },
  ApprovedByLeader: { icon: '◐', color: 'text-blue-400' },
  Approved: { icon: '✅', color: 'text-emerald-500' },
  Rejected: { icon: '❌', color: 'text-red-500' },
};

const FILTER_TYPES: { value: 'All' | WorkTripType; label: string }[] = [
  { value: 'All', label: 'All Types' },
  { value: 'BusinessTrip', label: 'Business Trip' },
  { value: 'WFH', label: 'WFH' },
  { value: 'Leave', label: 'Leave' },
  { value: 'Training', label: 'Training' },
];

/* ════════════════════════════ Helpers ════════════════════════════ */

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  // Monday = 0, Sunday = 6 (ISO style)
  let startDow = firstDay.getDay() - 1;
  if (startDow < 0) startDow = 6;
  const totalDays = lastDay.getDate();
  const cells: (number | null)[] = [];
  // Leading blanks
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);
  // Trailing blanks to fill 5 or 6 rows
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function isDateInRange(dateStr: string, startStr: string, endStr: string) {
  const d = new Date(dateStr).getTime();
  const s = new Date(startStr).getTime();
  const e = new Date(endStr).getTime();
  return d >= s && d <= e;
}

function formatDateRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  if (start === end) return s.toLocaleDateString('en-US', opts);
  return `${s.toLocaleDateString('en-US', opts)} – ${e.toLocaleDateString('en-US', opts)}`;
}

function diffDays(start: string, end: string) {
  const s = new Date(start).getTime();
  const e = new Date(end).getTime();
  return Math.ceil((e - s) / (1000 * 60 * 60 * 24)) + 1;
}

/* ════════════════════════════ Sub-Components ════════════════════════════ */

/* ─── Calendar Day Cell ─── */
function DayCell({
  day,
  year,
  month,
  trips,
  isToday,
}: {
  day: number | null;
  year: number;
  month: number;
  trips: WorkTrip[];
  isToday: boolean;
}) {
  if (day === null) {
    return <div className="min-h-[100px] border-b border-r border-[var(--card-border)] bg-[var(--bg-tertiary)]/30" />;
  }

  const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const dayTrips = trips.filter((t) => isDateInRange(dateStr, t.startDate, t.endDate));

  return (
    <div
      className={cn(
        'min-h-[100px] border-b border-r border-[var(--card-border)] p-1.5 transition-colors hover:bg-[var(--card-hover)]',
        isToday && 'bg-indigo-500/[0.06] dark:bg-indigo-500/[0.08]'
      )}
    >
      {/* Day number */}
      <div className="flex items-center justify-between mb-1">
        <span
          className={cn(
            'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold',
            isToday
              ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm shadow-indigo-500/30'
              : 'text-[var(--text-secondary)]'
          )}
        >
          {day}
        </span>
      </div>
      {/* Event pills */}
      <div className="flex flex-col gap-0.5 overflow-hidden">
        {dayTrips.slice(0, 3).map((trip) => {
          const cfg = TYPE_CONFIG[trip.type];
          const st = STATUS_INDICATOR[trip.status];
          const isStart = trip.startDate === dateStr;
          return (
            <div
              key={trip.id}
              title={`${trip.employee.name} · ${cfg.label} · ${trip.location} · ${trip.status}`}
              className={cn(
                'flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-medium cursor-default truncate transition-all hover:scale-[1.02]',
                cfg.pillBg,
                cfg.pillText,
                !isStart && 'opacity-60'
              )}
            >
              {cfg.icon}
              <span className="truncate">{trip.employee.name.split(' ')[0]}</span>
              <span className={cn('ml-auto text-[9px] shrink-0', st.color)}>{st.icon}</span>
            </div>
          );
        })}
        {dayTrips.length > 3 && (
          <span className="text-[9px] text-[var(--text-muted)] pl-1">+{dayTrips.length - 3} more</span>
        )}
      </div>
    </div>
  );
}

/* ─── Staff Status Card ─── */
function StaffStatusItem({
  name,
  status,
  location,
}: {
  name: string;
  status: 'office' | 'trip' | 'wfh' | 'leave' | 'training';
  location?: string;
}) {
  const dotColors: Record<string, string> = {
    office: 'bg-emerald-500',
    trip: 'bg-blue-500',
    wfh: 'bg-teal-500',
    leave: 'bg-amber-500',
    training: 'bg-violet-500',
  };
  const labels: Record<string, string> = {
    office: 'In Office',
    trip: 'On Trip',
    wfh: 'WFH',
    leave: 'On Leave',
    training: 'Training',
  };

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold bg-gradient-to-br from-indigo-500 to-violet-500 text-white shrink-0">
        {getInitials(name)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-[var(--text-primary)] truncate">{name}</p>
        <div className="flex items-center gap-1.5">
          <span className={cn('w-2 h-2 rounded-full shrink-0', dotColors[status])} />
          <span className="text-[10px] text-[var(--text-muted)]">{labels[status]}</span>
          {location && status !== 'office' && (
            <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-0.5 truncate">
              <MapPin className="w-2.5 h-2.5" />
              {location}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Pending Approval Card ─── */
function PendingApprovalCard({
  trip,
  onApprove,
  onReject,
}: {
  trip: WorkTrip;
  onApprove: () => void;
  onReject: () => void;
}) {
  const cfg = TYPE_CONFIG[trip.type];
  return (
    <div className="rounded-xl p-3 border border-[var(--card-border)] bg-[var(--card-bg)] space-y-2.5 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/5 transition-all">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
          {getInitials(trip.employee.name)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--text-primary)] truncate">{trip.employee.name}</p>
          <div className="flex items-center gap-1.5">
            <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold', cfg.pillBg, cfg.pillText)}>
              {cfg.icon}
              {cfg.label}
            </span>
          </div>
        </div>
      </div>
      {/* Details */}
      <div className="space-y-1">
        <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
          <CalendarClock className="w-3 h-3 text-[var(--text-muted)]" />
          {formatDateRange(trip.startDate, trip.endDate)} ({diffDays(trip.startDate, trip.endDate)}d)
        </p>
        {trip.location !== 'N/A' && (
          <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1.5">
            <MapPin className="w-3 h-3 text-[var(--text-muted)]" />
            {trip.location}
          </p>
        )}
        <p className="text-[11px] text-[var(--text-muted)] line-clamp-2">{trip.purpose}</p>
      </div>
      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={onApprove}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-sm shadow-emerald-500/20 transition-all active:scale-[0.97]"
        >
          <Check className="w-3 h-3" />
          Approve
        </button>
        <button
          onClick={onReject}
          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 border border-red-500/30 hover:bg-red-500/10 transition-all active:scale-[0.97]"
        >
          <X className="w-3 h-3" />
          Reject
        </button>
      </div>
    </div>
  );
}

/* ─── Upcoming Event Mini Card ─── */
function UpcomingEvent({ trip }: { trip: WorkTrip }) {
  const cfg = TYPE_CONFIG[trip.type];
  const start = new Date(trip.startDate);
  return (
    <div className="flex items-start gap-3 py-2.5">
      {/* Timeline dot */}
      <div className="flex flex-col items-center pt-0.5 shrink-0">
        <div className={cn('w-2.5 h-2.5 rounded-full', cfg.dot)} />
        <div className="w-px h-full bg-[var(--card-border)] mt-1" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{trip.employee.name}</p>
        <p className={cn('text-[10px] font-medium', cfg.pillText)}>{cfg.label}</p>
        <p className="text-[10px] text-[var(--text-muted)]">
          {start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {trip.location}
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════ MAIN PAGE ══════════════════════════════ */

export default function WorkCalendarPage() {
  const { currentRole, currentUser, hasPermission } = useRole();
  const { workTrips, updateWorkTrip, users, addNotification } = useAppState();
  const { addToast } = useToast();

  // Calendar state — June 2026
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(5); // 0-indexed, 5 = June
  const [typeFilter, setTypeFilter] = useState<'All' | WorkTripType>('All');
  const [personFilter, setPersonFilter] = useState<string>('All');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showPersonDropdown, setShowPersonDropdown] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Today
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const monthName = new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Navigation
  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
    else setCurrentMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
    else setCurrentMonth((m) => m + 1);
  };

  // Calendar cells
  const cells = useMemo(() => getMonthDays(currentYear, currentMonth), [currentYear, currentMonth]);

  // Role-scoped trips
  const scopedTrips = useMemo(() => {
    let trips = [...workTrips];
    if (currentRole === 'Staff') {
      // Staff sees only own trips
      trips = trips.filter((t) => t.employee.id === currentUser.id);
    } else if (currentRole === 'Leader') {
      // Leader sees team trips
      trips = trips.filter(
        (t) => t.employee.teamId === currentUser.teamId || t.employee.id === currentUser.id
      );
    }
    // Manager sees all
    return trips;
  }, [workTrips, currentRole, currentUser]);

  // Filtered trips
  const filteredTrips = useMemo(() => {
    let trips = scopedTrips;
    if (typeFilter !== 'All') trips = trips.filter((t) => t.type === typeFilter);
    if (personFilter !== 'All') trips = trips.filter((t) => t.employee.id === personFilter);
    return trips;
  }, [scopedTrips, typeFilter, personFilter]);

  // Pending approvals
  const pendingTrips = useMemo(() => {
    if (currentRole === 'Manager') {
      return workTrips.filter((t) => t.status === 'Pending' || t.status === 'ApprovedByLeader');
    }
    if (currentRole === 'Leader') {
      return workTrips.filter(
        (t) => t.status === 'Pending' && t.employee.teamId === currentUser.teamId
      );
    }
    return [];
  }, [workTrips, currentRole, currentUser]);

  // Today's status for all team members
  const todayStatuses = useMemo(() => {
    return users.map((user) => {
      const activeTrip = workTrips.find(
        (t) =>
          t.employee.id === user.id &&
          (t.status === 'Approved' || t.status === 'ApprovedByLeader') &&
          isDateInRange(todayStr, t.startDate, t.endDate)
      );
      if (!activeTrip) return { user, status: 'office' as const, location: undefined };
      const statusMap: Record<WorkTripType, 'trip' | 'wfh' | 'leave' | 'training'> = {
        BusinessTrip: 'trip',
        WFH: 'wfh',
        Leave: 'leave',
        Training: 'training',
      };
      return { user, status: statusMap[activeTrip.type], location: activeTrip.location };
    });
  }, [workTrips, todayStr]);

  // Status counts
  const statusCounts = useMemo(() => {
    const counts = { office: 0, trip: 0, wfh: 0, leave: 0, training: 0 };
    todayStatuses.forEach((s) => counts[s.status]++);
    return counts;
  }, [todayStatuses]);

  // Upcoming events (after today)
  const upcomingEvents = useMemo(() => {
    return scopedTrips
      .filter((t) => new Date(t.startDate) > today && t.status !== 'Rejected')
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      .slice(0, 3);
  }, [scopedTrips, today]);

  // People available for person filter
  const availablePeople = useMemo(() => {
    const ids = new Set(scopedTrips.map((t) => t.employee.id));
    return users.filter((u) => ids.has(u.id));
  }, [scopedTrips, users]);

  // Approval handlers
  const handleApprove = (id: string) => {
    const trip = workTrips.find(t => t.id === id);
    const newStatus = currentRole === 'Leader' ? 'ApprovedByLeader' as const : 'Approved' as const;
    updateWorkTrip(id, { status: newStatus, approvedBy: currentUser });
    if (trip) {
      addNotification({ title: 'Request Approved', message: `${trip.employee.name}'s ${trip.type} request has been approved`, type: 'success', link: '/work-calendar' });
      addToast({ title: 'Request Approved', message: `${trip.employee.name} — ${trip.type}`, type: 'success' });
    }
  };
  const handleReject = (id: string) => {
    const trip = workTrips.find(t => t.id === id);
    updateWorkTrip(id, { status: 'Rejected' as const, approvedBy: currentUser });
    if (trip) {
      addToast({ title: 'Request Rejected', message: `${trip.employee.name} — ${trip.type}`, type: 'warning' });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* ════════════════ Header ════════════════ */}
      <div className="shrink-0 px-6 pt-6 pb-4 space-y-4">
        {/* Title row */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">Work Calendar</h1>
              <p className="text-xs text-[var(--text-muted)]">
                Manage trips, WFH, leave &amp; training schedules
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Pending badge (Manager) */}
            {currentRole === 'Manager' && pendingTrips.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Clock className="w-3.5 h-3.5" />
                Pending Requests ({pendingTrips.length})
              </span>
            )}

            {/* Action button */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all active:scale-[0.97]"
            >
              <Plus className="w-4 h-4" />
              {currentRole === 'Manager' ? 'Create Schedule' : currentRole === 'Leader' ? 'Create Schedule' : 'Request Time'}
            </button>
          </div>
        </div>

        {/* Toolbar: Month nav + Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Month navigation */}
          <div className="flex items-center gap-1 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-1 py-0.5">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-[var(--text-secondary)]" />
            </button>
            <span className="px-3 text-sm font-semibold text-[var(--text-primary)] min-w-[140px] text-center">
              {monthName}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" />
            </button>
          </div>

          {/* Person filter */}
          <div className="relative">
            <button
              onClick={() => { setShowPersonDropdown((v) => !v); setShowTypeDropdown(false); }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-medium text-[var(--text-secondary)] hover:border-indigo-500/40 transition-all"
            >
              <Users className="w-3.5 h-3.5" />
              {personFilter === 'All' ? 'All People' : availablePeople.find((u) => u.id === personFilter)?.name || 'All'}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showPersonDropdown && (
              <div className="absolute top-full mt-1 left-0 z-50 w-48 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-xl shadow-black/10 py-1 max-h-60 overflow-y-auto">
                <button
                  onClick={() => { setPersonFilter('All'); setShowPersonDropdown(false); }}
                  className={cn(
                    'w-full text-left px-3 py-2 text-xs hover:bg-[var(--bg-tertiary)] transition-colors',
                    personFilter === 'All' ? 'text-indigo-500 font-semibold' : 'text-[var(--text-secondary)]'
                  )}
                >
                  All People
                </button>
                {availablePeople.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => { setPersonFilter(u.id); setShowPersonDropdown(false); }}
                    className={cn(
                      'w-full text-left px-3 py-2 text-xs hover:bg-[var(--bg-tertiary)] transition-colors',
                      personFilter === u.id ? 'text-indigo-500 font-semibold' : 'text-[var(--text-secondary)]'
                    )}
                  >
                    {u.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Type filter */}
          <div className="relative">
            <button
              onClick={() => { setShowTypeDropdown((v) => !v); setShowPersonDropdown(false); }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-medium text-[var(--text-secondary)] hover:border-indigo-500/40 transition-all"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              {typeFilter === 'All' ? 'All Types' : TYPE_CONFIG[typeFilter].label}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showTypeDropdown && (
              <div className="absolute top-full mt-1 left-0 z-50 w-44 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-xl shadow-black/10 py-1">
                {FILTER_TYPES.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => { setTypeFilter(f.value); setShowTypeDropdown(false); }}
                    className={cn(
                      'w-full text-left px-3 py-2 text-xs hover:bg-[var(--bg-tertiary)] transition-colors',
                      typeFilter === f.value ? 'text-indigo-500 font-semibold' : 'text-[var(--text-secondary)]'
                    )}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ════════════════ Body: Calendar + Right Panel ════════════════ */}
      <div className="flex-1 overflow-hidden px-6 pb-6">
        <div className="flex gap-5 h-full">
          {/* ──────── Calendar Grid (70%) ──────── */}
          <div className="flex-[7] min-w-0 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden flex flex-col">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-[var(--card-border)] bg-[var(--bg-tertiary)]">
              {DAYS.map((d) => (
                <div
                  key={d}
                  className={cn(
                    'py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider',
                    d === 'Sat' || d === 'Sun'
                      ? 'text-[var(--text-muted)]'
                      : 'text-[var(--text-secondary)]'
                  )}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-7">
                {cells.map((day, idx) => {
                  const isToday =
                    day !== null &&
                    currentYear === today.getFullYear() &&
                    currentMonth === today.getMonth() &&
                    day === today.getDate();
                  return (
                    <DayCell
                      key={idx}
                      day={day}
                      year={currentYear}
                      month={currentMonth}
                      trips={filteredTrips}
                      isToday={isToday}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* ──────── Right Panel (30%) ──────── */}
          <div className="flex-[3] min-w-[280px] max-w-[340px] flex flex-col gap-4 overflow-y-auto">
            {/* Today's Status */}
            <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
              <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Today&apos;s Status</h3>
              {/* Summary counts */}
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[var(--text-muted)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {statusCounts.office} in office
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[var(--text-muted)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  {statusCounts.trip} on trip
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[var(--text-muted)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  {statusCounts.wfh} WFH
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[var(--text-muted)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  {statusCounts.leave} on leave
                </span>
                {statusCounts.training > 0 && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[var(--text-muted)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    {statusCounts.training} training
                  </span>
                )}
              </div>
              {/* People list */}
              <div className="divide-y divide-[var(--card-border)]">
                {todayStatuses.map((s) => (
                  <StaffStatusItem
                    key={s.user.id}
                    name={s.user.name}
                    status={s.status}
                    location={s.location}
                  />
                ))}
              </div>
            </div>

            {/* Pending Approvals — Manager / Leader */}
            {hasPermission('work_calendar.approve') && pendingTrips.length > 0 && (
              <div className="rounded-2xl border border-violet-500/20 backdrop-blur-xl bg-gradient-to-r from-violet-500/[0.06] to-indigo-500/[0.06] p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                    <Clock className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">Pending Requests</h3>
                  <span className="ml-auto inline-flex items-center justify-center w-5 h-5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-500">
                    {pendingTrips.length}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {pendingTrips.map((trip) => (
                    <PendingApprovalCard
                      key={trip.id}
                      trip={trip}
                      onApprove={() => handleApprove(trip.id)}
                      onReject={() => handleReject(trip.id)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
                <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3">Upcoming</h3>
                <div className="flex flex-col">
                  {upcomingEvents.map((trip) => (
                    <UpcomingEvent key={trip.id} trip={trip} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create WorkTrip Modal */}
      <CreateWorkTripModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  );
}
