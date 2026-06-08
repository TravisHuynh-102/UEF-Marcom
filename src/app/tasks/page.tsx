'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';
import { useAppState } from '@/context/app-state-context';
import { useToast } from '@/components/ui/toast';
import CreateTaskModal from '@/components/modals/create-task-modal';
import { ConfirmDeleteModal } from '@/components/modals/modal-wrapper';
import { Task, TaskPriority } from '@/types';
import {
  CheckCircle2,
  Circle,
  Flag,
  Calendar,
  Search,
  Plus,
  Filter,
  ListTodo,
  LayoutGrid,
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Clock,
  AlertCircle,
  Trash2,
  Copy,
} from 'lucide-react';
import { useRole } from '@/context/role-context';

/* ────────────────────────── constants ────────────────────────── */

type FilterPill = 'All' | 'Today' | 'Upcoming' | 'Overdue' | 'Completed';
type ViewMode = 'list' | 'board' | 'table';
type TaskScope = 'my' | 'team' | 'all';
type BoardColumn = 'To Do' | 'In Progress' | 'Review' | 'Completed';

const FILTERS: FilterPill[] = ['All', 'Today', 'Upcoming', 'Overdue', 'Completed'];

const PRIORITY_CONFIG: Record<TaskPriority, { color: string; dot: string }> = {
  Critical: { color: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300', dot: 'bg-red-500' },
  High:     { color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300', dot: 'bg-orange-500' },
  Medium:   { color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300', dot: 'bg-blue-500' },
  Low:      { color: 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300', dot: 'bg-slate-400' },
};

const BOARD_COLUMNS: BoardColumn[] = ['To Do', 'In Progress', 'Review', 'Completed'];

/* ────────────────────────── helpers ────────────────────────── */

function classifyDate(dateStr: string): 'Overdue' | 'Today' | 'Tomorrow' | 'This Week' | 'Later' {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const d = new Date(dateStr);
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  if (diff < 0) return 'Overdue';
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff <= 7) return 'This Week';
  return 'Later';
}

/* ────────────────────────── sub-components ────────────────────── */

function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const c = PRIORITY_CONFIG[priority];
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold', c.color)}>
      <Flag className="w-3 h-3" />
      {priority}
    </span>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] min-w-0">
      <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', color)}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold text-[var(--text-primary)] leading-none">{value}</p>
        <p className="text-[11px] text-[var(--text-muted)] mt-0.5 truncate">{label}</p>
      </div>
    </div>
  );
}

/* ────────── Task Row ────────── */

function TaskRow({
  task,
  onToggle,
  onDelete,
  onDuplicate,
}: {
  task: Task & { _completed: boolean };
  onToggle: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const done = task._completed;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  return (
    <div
      className={cn(
        'group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-150 cursor-pointer',
        'hover:bg-[var(--card-hover)]',
        done && 'opacity-50'
      )}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className="shrink-0 transition-transform active:scale-90"
      >
        {done ? (
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
        ) : (
          <Circle className="w-5 h-5 text-[var(--text-muted)] hover:text-indigo-500 transition-colors" />
        )}
      </button>

      {/* Title */}
      <span
        className={cn(
          'flex-1 text-sm font-medium text-[var(--text-primary)] truncate',
          done && 'line-through text-[var(--text-muted)]'
        )}
      >
        {task.title}
      </span>

      {/* Priority */}
      <PriorityBadge priority={task.priority} />

      {/* Project badge */}
      <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-[var(--bg-tertiary)] text-[var(--text-muted)] truncate max-w-[120px]">
        {task.projectName}
      </span>

      {/* Assignee */}
      <div
        title={task.assignee.name}
        className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold bg-gradient-to-br from-indigo-500 to-violet-500 text-white shrink-0"
      >
        {getInitials(task.assignee.name)}
      </div>

      {/* Due */}
      <span className="hidden md:inline-flex items-center gap-1 text-[11px] text-[var(--text-muted)] shrink-0 w-20">
        <Calendar className="w-3 h-3" />
        {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
      </span>

      {/* Menu */}
      <div className="relative shrink-0" ref={menuRef}>
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-[var(--bg-tertiary)] transition-all"
        >
          <MoreHorizontal className="w-4 h-4 text-[var(--text-muted)]" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-8 z-50 min-w-[140px] rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-xl py-1 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDuplicate(); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              Duplicate
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete(); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ────────── Board Mini Card ────────── */

function BoardMiniCard({
  task,
  onToggle,
  onDelete,
  onDuplicate,
  onDragStart,
}: {
  task: Task & { _completed: boolean };
  onToggle: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onDragStart: (e: React.DragEvent) => void;
}) {
  const done = task._completed;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  return (
    <div
      draggable="true"
      onDragStart={onDragStart}
      className={cn(
        'p-3 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] cursor-grab active:cursor-grabbing',
        'hover:-translate-y-0.5 hover:shadow-md hover:shadow-indigo-500/5 transition-all duration-200',
        done && 'opacity-50'
      )}
    >
      <div className="flex items-start gap-2 mb-2">
        <button onClick={onToggle} className="shrink-0 mt-0.5">
          {done ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Circle className="w-4 h-4 text-[var(--text-muted)]" />}
        </button>
        <span className={cn('text-sm font-medium text-[var(--text-primary)] line-clamp-2 flex-1', done && 'line-through text-[var(--text-muted)]')}>
          {task.title}
        </span>
        <div className="relative shrink-0" ref={menuRef}>
          <button
            onClick={(e) => { e.stopPropagation(); setMenuOpen((v) => !v); }}
            className="p-0.5 rounded-md hover:bg-[var(--bg-tertiary)] transition-all opacity-0 group-hover/card:opacity-100"
          >
            <MoreHorizontal className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-6 z-50 min-w-[120px] rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-xl py-1 animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDuplicate(); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                Duplicate
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete(); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between">
        <PriorityBadge priority={task.priority} />
        <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>
    </div>
  );
}

/* ══════════════════════════ MAIN PAGE ══════════════════════════ */

export default function TasksPage() {
  const { tasks, updateTask, deleteTask, addTask } = useAppState();
  const { currentRole, currentUser } = useRole();
  const { addToast } = useToast();

  const [activeFilter, setActiveFilter] = useState<FilterPill>('All');
  const [taskScope, setTaskScope] = useState<TaskScope>('my');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [completedExpanded, setCompletedExpanded] = useState(false);

  // Create Task modal
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  // Drag-and-drop state
  const [dragOverColumn, setDragOverColumn] = useState<BoardColumn | null>(null);
  const [taskColumns, setTaskColumns] = useState<Record<string, BoardColumn>>({});

  // Initialize / sync taskColumns whenever tasks change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTaskColumns((prev) => {
      const next = { ...prev };
      tasks.forEach((t) => {
        if (!next[t.id]) {
          // Assign initial column based on task state
          if (t.completed) {
            next[t.id] = 'Completed';
          } else if (classifyDate(t.dueDate) === 'Overdue') {
            next[t.id] = 'In Progress';
          } else {
            next[t.id] = 'To Do';
          }
        }
      });
      // Remove stale entries for deleted tasks
      const taskIds = new Set(tasks.map((t) => t.id));
      Object.keys(next).forEach((id) => {
        if (!taskIds.has(id)) delete next[id];
      });
      return next;
    });
  }, [tasks]);

  // Toggle completion via AppState
  const toggle = useCallback((id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const newCompleted = !task.completed;
    updateTask(id, { completed: newCompleted });
    setTaskColumns((prev) => ({
      ...prev,
      [id]: newCompleted ? 'Completed' : 'To Do',
    }));
  }, [tasks, updateTask]);

  // Delete handler
  const handleConfirmDelete = useCallback(() => {
    if (!deleteTarget) return;
    deleteTask(deleteTarget.id);
    addToast({ title: 'Task Deleted', message: `"${deleteTarget.title}" has been removed`, type: 'success' });
    setDeleteTarget(null);
  }, [deleteTarget, deleteTask, addToast]);

  // Duplicate handler
  const handleDuplicate = useCallback((taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const newTask = { ...task, title: `${task.title} (Copy)`, completed: false };
    addTask(newTask);
    addToast({ title: 'Task Duplicated', message: `Copied "${task.title}"`, type: 'success' });
  }, [tasks, addTask, addToast]);

  // Drag & Drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, column: BoardColumn) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverColumn(column);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, column: BoardColumn) => {
    e.preventDefault();
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId) return;
    // Update completed state based on column
    updateTask(taskId, { completed: column === 'Completed' });
    setTaskColumns((prev) => ({ ...prev, [taskId]: column }));
  }, [updateTask]);

  /* ---- enrich tasks ---- */
  const enriched = useMemo(() => {
    return tasks
      .filter((t) => {
        if (taskScope === 'my') return t.assignee.id === currentUser.id;
        if (taskScope === 'team') return t.assignee.department === currentUser.department;
        return true; // 'all'
      })
      .map((t) => ({ ...t, _completed: t.completed }));
  }, [tasks, taskScope, currentUser]);

  /* ---- filter ---- */
  const filtered = useMemo(() => {
    let list = enriched;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(q) || t.projectName.toLowerCase().includes(q));
    }
    switch (activeFilter) {
      case 'Today':
        return list.filter((t) => !t._completed && classifyDate(t.dueDate) === 'Today');
      case 'Upcoming':
        return list.filter((t) => !t._completed && ['Tomorrow', 'This Week', 'Later'].includes(classifyDate(t.dueDate)));
      case 'Overdue':
        return list.filter((t) => !t._completed && classifyDate(t.dueDate) === 'Overdue');
      case 'Completed':
        return list.filter((t) => t._completed);
      default:
        return list;
    }
  }, [enriched, activeFilter, search]);

  /* ---- stats ---- */
  const stats = useMemo(() => {
    const total = enriched.length;
    const completed = enriched.filter((t) => t._completed).length;
    const inProgress = enriched.filter((t) => !t._completed && classifyDate(t.dueDate) !== 'Overdue').length;
    const overdue = enriched.filter((t) => !t._completed && classifyDate(t.dueDate) === 'Overdue').length;
    return { total, completed, inProgress, overdue };
  }, [enriched]);

  /* ---- grouped sections ---- */
  const { activeTasks, completedTasks } = useMemo(() => {
    const active = filtered.filter((t) => !t._completed);
    const completed = filtered.filter((t) => t._completed);
    return { activeTasks: active, completedTasks: completed };
  }, [filtered]);

  const groupedActive = useMemo(() => {
    const groups: Record<string, typeof activeTasks> = {};
    const sectionOrder = ['Overdue', 'Today', 'Tomorrow', 'This Week', 'Later'];
    activeTasks.forEach((t) => {
      const section = classifyDate(t.dueDate);
      if (!groups[section]) groups[section] = [];
      groups[section].push(t);
    });
    return sectionOrder.filter((s) => groups[s]?.length).map((s) => ({ section: s, tasks: groups[s] }));
  }, [activeTasks]);

  /* ---- board columns (driven by taskColumns state) ---- */
  const boardData = useMemo(() => {
    const result: Record<BoardColumn, typeof filtered> = {
      'To Do': [],
      'In Progress': [],
      'Review': [],
      'Completed': [],
    };
    filtered.forEach((t) => {
      const col = taskColumns[t.id] || (t._completed ? 'Completed' : 'To Do');
      result[col].push(t);
    });
    return result;
  }, [filtered, taskColumns]);

  return (
    <div className="flex flex-col h-full">
      {/* ────────── Header ────────── */}
      <div className="shrink-0 px-6 pt-6 pb-4 space-y-4">
        {/* Title row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
              <ListTodo className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">My Tasks</h1>
              <p className="text-xs text-[var(--text-muted)]">{stats.total} total tasks</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:from-violet-600 hover:to-fuchsia-700 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all active:scale-[0.97]"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Scope toggle (if not Staff) */}
          {currentRole !== 'Staff' && (
            <div className="flex items-center rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-0.5">
              {(['my', 'team', currentRole === 'Manager' ? 'all' : null].filter(Boolean) as TaskScope[]).map(scope => (
                <button
                  key={scope}
                  onClick={() => setTaskScope(scope)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize',
                    taskScope === scope
                      ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                  )}
                >
                  {scope} Tasks
                </button>
              ))}
            </div>
          )}

          {/* View toggle */}
          <div className="flex items-center rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-0.5">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                viewMode === 'list'
                  ? 'bg-violet-500 text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              )}
            >
              <ListTodo className="w-3.5 h-3.5" />
              List
            </button>
            <button
              onClick={() => setViewMode('board')}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                viewMode === 'board'
                  ? 'bg-violet-500 text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Board
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                viewMode === 'table'
                  ? 'bg-violet-500 text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              )}
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
              Table
            </button>
          </div>

          {/* Filter pills */}
          <div className="flex items-center gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                  activeFilter === f
                    ? 'bg-violet-500/10 text-violet-600 dark:text-violet-400 ring-1 ring-violet-500/20'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]'
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-xs ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search tasks…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* ────────── Stats Bar ────────── */}
      <div className="shrink-0 px-6 pb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="Total"
            value={stats.total}
            icon={<ListTodo className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
            color="bg-indigo-100 dark:bg-indigo-900/40"
          />
          <StatCard
            label="Completed"
            value={stats.completed}
            icon={<CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
            color="bg-emerald-100 dark:bg-emerald-900/40"
          />
          <StatCard
            label="In Progress"
            value={stats.inProgress}
            icon={<Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
            color="bg-amber-100 dark:bg-amber-900/40"
          />
          <StatCard
            label="Overdue"
            value={stats.overdue}
            icon={<AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />}
            color="bg-red-100 dark:bg-red-900/40"
          />
        </div>
      </div>

      {/* ────────── Body ────────── */}
      <div className="flex-1 overflow-hidden px-6 pb-6">
        {viewMode === 'list' ? (
          /* ═══ List View ═══ */
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden h-full flex flex-col">
            <div className="flex-1 overflow-y-auto p-2">
              {/* Active task groups */}
              {groupedActive.map(({ section, tasks }) => (
                <div key={section} className="mb-2">
                  {/* Section header */}
                  <div className="flex items-center gap-2 px-4 py-2">
                    <span
                      className={cn(
                        'text-xs font-bold uppercase tracking-wider',
                        section === 'Overdue'
                          ? 'text-red-500'
                          : section === 'Today'
                          ? 'text-indigo-500'
                          : 'text-[var(--text-muted)]'
                      )}
                    >
                      {section}
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] font-medium">({tasks.length})</span>
                    <div className="flex-1 h-px bg-[var(--card-border)]" />
                  </div>
                  {tasks.map((t) => (
                    <TaskRow 
                      key={t.id} 
                      task={t} 
                      onToggle={() => toggle(t.id)} 
                      onDelete={() => setDeleteTarget({ id: t.id, title: t.title })} 
                      onDuplicate={() => handleDuplicate(t.id)}
                    />
                  ))}
                </div>
              ))}

              {/* Empty state */}
              {groupedActive.length === 0 && completedTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-sm text-[var(--text-muted)]">
                  <ListTodo className="w-8 h-8 mb-2 opacity-40" />
                  No tasks match your filters.
                </div>
              )}

              {/* Completed section */}
              {completedTasks.length > 0 && (
                <div className="mt-2">
                  <button
                    onClick={() => setCompletedExpanded((v) => !v)}
                    className="flex items-center gap-2 px-4 py-2 w-full text-left group/comp"
                  >
                    {completedExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                    )}
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                      Completed
                    </span>
                    <span className="text-[10px] text-[var(--text-muted)] font-medium">({completedTasks.length})</span>
                    <div className="flex-1 h-px bg-[var(--card-border)]" />
                  </button>
                  {completedExpanded &&
                    completedTasks.map((t) => (
                      <TaskRow 
                        key={t.id} 
                        task={t} 
                        onToggle={() => toggle(t.id)} 
                        onDelete={() => setDeleteTarget({ id: t.id, title: t.title })} 
                        onDuplicate={() => handleDuplicate(t.id)}
                      />
                    ))}
                </div>
              )}
            </div>
          </div>
        ) : viewMode === 'table' ? (
          /* ═══ Table View ═══ */
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden h-full flex flex-col">
            <div className="flex-1 overflow-x-auto overflow-y-auto">
              <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
                <thead className="sticky top-0 bg-[var(--bg-tertiary)] z-10 shadow-sm">
                  <tr>
                    <th className="w-10 px-4 py-3 font-semibold text-[var(--text-muted)]"></th>
                    <th className="px-4 py-3 font-semibold text-[var(--text-muted)]">Task Name</th>
                    <th className="px-4 py-3 font-semibold text-[var(--text-muted)]">Priority</th>
                    <th className="px-4 py-3 font-semibold text-[var(--text-muted)]">Project</th>
                    <th className="px-4 py-3 font-semibold text-[var(--text-muted)]">Assignee</th>
                    <th className="px-4 py-3 font-semibold text-[var(--text-muted)]">Due Date</th>
                    <th className="w-10 px-4 py-3 font-semibold text-[var(--text-muted)]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--card-border)]">
                  {filtered.map(t => {
                    const done = t._completed;
                    return (
                      <tr key={t.id} className={cn("hover:bg-[var(--card-hover)] transition-colors group/row", done && "opacity-50")}>
                        <td className="px-4 py-3 text-center">
                          <button onClick={() => toggle(t.id)} className="transition-transform active:scale-90 align-middle">
                            {done ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Circle className="w-4 h-4 text-[var(--text-muted)] hover:text-indigo-500" />}
                          </button>
                        </td>
                        <td className={cn("px-4 py-3 font-medium", done ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]')}>
                          {t.title}
                        </td>
                        <td className="px-4 py-3">
                          <PriorityBadge priority={t.priority} />
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded bg-[var(--bg-tertiary)] text-[var(--text-muted)] text-[11px] font-medium">
                            {t.projectName}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-[9px] text-white font-bold">
                              {getInitials(t.assignee.name)}
                            </div>
                            <span className="text-[var(--text-secondary)]">{t.assignee.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[var(--text-secondary)]">
                          {new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2 opacity-0 group-hover/row:opacity-100 transition-opacity">
                            <button onClick={() => handleDuplicate(t.id)} className="p-1 hover:bg-[var(--bg-tertiary)] rounded text-[var(--text-muted)]" title="Duplicate">
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setDeleteTarget({ id: t.id, title: t.title })} className="p-1 hover:bg-rose-500/10 rounded text-rose-500" title="Delete">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center h-40 text-[var(--text-muted)] text-sm">
                  <ListTodo className="w-8 h-8 opacity-30 mb-2" />
                  No tasks to display
                </div>
              )}
            </div>
          </div>
        ) : (
          /* ═══ Board View ═══ */
          <div className="flex gap-4 h-full overflow-x-auto pb-2">
            {BOARD_COLUMNS.map((col) => {
              const colTasks = boardData[col] ?? [];
              const colColor =
                col === 'To Do'
                  ? 'bg-slate-50/50 dark:bg-slate-900/30'
                  : col === 'In Progress'
                  ? 'bg-amber-50/40 dark:bg-amber-950/20'
                  : col === 'Review'
                  ? 'bg-blue-50/40 dark:bg-blue-950/20'
                  : 'bg-emerald-50/40 dark:bg-emerald-950/20';
              const headerColor =
                col === 'To Do'
                  ? 'text-slate-600 dark:text-slate-300'
                  : col === 'In Progress'
                  ? 'text-amber-600 dark:text-amber-300'
                  : col === 'Review'
                  ? 'text-blue-600 dark:text-blue-300'
                  : 'text-emerald-600 dark:text-emerald-300';
              const isDragOver = dragOverColumn === col;
              return (
                <div
                  key={col}
                  onDragOver={(e) => handleDragOver(e, col)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, col)}
                  className={cn(
                    'flex flex-col min-w-[260px] max-w-[300px] rounded-2xl p-3 transition-all duration-200',
                    colColor,
                    isDragOver && 'ring-2 ring-violet-500/50 bg-violet-500/5'
                  )}
                >
                  <div className="flex items-center gap-2 mb-4 px-1">
                    <span className={cn('text-sm font-semibold', headerColor)}>{col}</span>
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-md text-[11px] font-bold bg-[var(--bg-tertiary)] text-[var(--text-muted)]">
                      {colTasks.length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1">
                    {colTasks.map((t) => (
                      <div
                        key={t.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, t.id)}
                      >
                        <BoardMiniCard 
                          task={t} 
                          onToggle={() => toggle(t.id)} 
                          onDelete={() => setDeleteTarget({ id: t.id, title: t.title })} 
                          onDuplicate={() => handleDuplicate(t.id)}
                          onDragStart={(e) => handleDragStart(e, t.id)} 
                        />
                      </div>
                    ))}
                    {colTasks.length === 0 && (
                      <div className="flex items-center justify-center h-20 rounded-xl border-2 border-dashed border-[var(--card-border)] text-xs text-[var(--text-muted)]">
                        Drop tasks here
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ────────── Modals ────────── */}
      <CreateTaskModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        itemName={deleteTarget?.title}
      />
    </div>
  );
}
