'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';
import { useAppState } from '@/context/app-state-context';
import { useRole } from '@/context/role-context';
import { useToast } from '@/components/ui/toast';
import CreateProjectModal from '@/components/modals/create-project-modal';
import { ConfirmDeleteModal } from '@/components/modals/modal-wrapper';
import { Project, ProjectStatus, RiskLevel } from '@/types';
import {
  FolderKanban,
  LayoutGrid,
  List,
  Plus,
  Search,
  Filter,
  Shield,
  AlertTriangle,
  XCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Trash2,
  Users,
  Clock,
} from 'lucide-react';

/* ────────────────────────── constants ────────────────────────── */

const STATUSES: ProjectStatus[] = [
  'Backlog',
  'Planned',
  'In Progress',
  'Review',
  'Completed',
];

const STATUS_COLORS: Record<ProjectStatus, { bg: string; text: string; border: string; colBg: string }> = {
  Backlog:       { bg: 'bg-slate-100 dark:bg-slate-800/60',   text: 'text-slate-600 dark:text-slate-300',   border: 'border-slate-300 dark:border-slate-600', colBg: 'bg-slate-50/50 dark:bg-slate-900/30' },
  Planned:       { bg: 'bg-sky-100 dark:bg-sky-900/40',       text: 'text-sky-700 dark:text-sky-300',       border: 'border-sky-300 dark:border-sky-700',     colBg: 'bg-sky-50/40 dark:bg-sky-950/20' },
  'In Progress': { bg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-300 dark:border-indigo-700', colBg: 'bg-indigo-50/40 dark:bg-indigo-950/20' },
  Review:        { bg: 'bg-amber-100 dark:bg-amber-900/40',   text: 'text-amber-700 dark:text-amber-300',   border: 'border-amber-300 dark:border-amber-700', colBg: 'bg-amber-50/40 dark:bg-amber-950/20' },
  Completed:     { bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-300 dark:border-emerald-700', colBg: 'bg-emerald-50/40 dark:bg-emerald-950/20' },
  Blocked:       { bg: 'bg-red-100 dark:bg-red-900/40',       text: 'text-red-700 dark:text-red-300',       border: 'border-red-300 dark:border-red-700',     colBg: 'bg-red-50/40 dark:bg-red-950/20' },
};

const RISK_CONFIG: Record<RiskLevel, { icon: React.ReactNode; color: string }> = {
  Safe:      { icon: <Shield className="w-3 h-3" />, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' },
  'At Risk': { icon: <AlertTriangle className="w-3 h-3" />, color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300' },
  Blocked:   { icon: <XCircle className="w-3 h-3" />, color: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300' },
};

const SORT_OPTIONS = ['Name', 'Due Date', 'Progress', 'Risk'] as const;

/* ────────────────────────── sub-components ────────────────────── */

function AvatarStack({ members, max = 3 }: { members: Project['members']; max?: number }) {
  const visible = members.slice(0, max);
  const overflow = members.length - max;
  return (
    <div className="flex -space-x-2">
      {visible.map((m) => (
        <div
          key={m.id}
          title={m.name}
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold ring-2 ring-[var(--card-bg)] bg-gradient-to-br from-indigo-500 to-violet-500 text-white"
        >
          {getInitials(m.name)}
        </div>
      ))}
      {overflow > 0 && (
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium ring-2 ring-[var(--card-bg)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)]">
          +{overflow}
        </div>
      )}
    </div>
  );
}

function RiskBadge({ risk }: { risk: RiskLevel }) {
  const c = RISK_CONFIG[risk];
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold', c.color)}>
      {c.icon}
      {risk}
    </span>
  );
}

function ProgressBar({ value }: { value: number }) {
  const color =
    value >= 80
      ? 'bg-emerald-500'
      : value >= 50
      ? 'bg-indigo-500'
      : value >= 25
      ? 'bg-amber-500'
      : 'bg-red-400';
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1.5 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
        <div className={cn('h-full rounded-full transition-all duration-500', color)} style={{ width: `${value}%` }} />
      </div>
      <span className="text-[11px] font-medium text-[var(--text-muted)] tabular-nums w-8 text-right">{value}%</span>
    </div>
  );
}

/* ────────── Expanded Detail Panel ────────── */

function ProjectExpandedDetail({ project }: { project: Project }) {
  return (
    <div className="mt-3 pt-3 border-t border-[var(--card-border)] space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
      {/* Description */}
      {project.description && (
        <div>
          <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">Description</p>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{project.description}</p>
        </div>
      )}

      {/* Due Date */}
      <div className="flex items-center gap-2">
        <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
        <span className="text-xs text-[var(--text-secondary)]">
          Due: {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      {/* Progress Bar */}
      <div>
        <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5">Progress</p>
        <ProgressBar value={project.progress} />
      </div>

      {/* Members */}
      <div>
        <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1.5 flex items-center gap-1">
          <Users className="w-3 h-3" />
          Team ({project.members.length})
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.members.map((m) => (
            <span
              key={m.id}
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[var(--bg-tertiary)] text-[11px] font-medium text-[var(--text-secondary)]"
            >
              <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
                {getInitials(m.name)}
              </span>
              {m.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ────────── Project Card (Board) ────────── */

function ProjectCard({
  project,
  isExpanded,
  onToggleExpand,
  onDelete,
  isManager,
}: {
  project: Project;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onDelete?: () => void;
  isManager: boolean;
}) {
  const isBlocked = project.risk === 'Blocked';
  return (
    <div
      className={cn(
        'group relative rounded-xl p-4 border transition-all duration-200 cursor-pointer',
        'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-500/5',
        'bg-[var(--card-bg)] border-[var(--card-border)]',
        isBlocked && 'ring-1 ring-red-400/40',
        isExpanded && 'ring-1 ring-indigo-500/30 shadow-lg shadow-indigo-500/5'
      )}
      onClick={onToggleExpand}
    >
      {/* Blocked overlay */}
      {isBlocked && (
        <div className="absolute inset-0 rounded-xl bg-red-500/[0.04] pointer-events-none" />
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-sm font-semibold text-[var(--text-primary)] leading-snug pr-2 line-clamp-2">
          {project.name}
        </h4>
        <div className="flex items-center gap-0.5">
          {isManager && onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-red-500/10 hover:text-red-500 text-[var(--text-muted)]"
              title="Delete project"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-[var(--bg-tertiary)]"
          >
            {isExpanded
              ? <ChevronUp className="w-4 h-4 text-[var(--text-muted)]" />
              : <MoreHorizontal className="w-4 h-4 text-[var(--text-muted)]" />
            }
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-[var(--text-muted)] mb-3 truncate">{project.description}</p>

      {/* Progress */}
      <div className="mb-3">
        <ProgressBar value={project.progress} />
      </div>

      {/* Risk + Due */}
      <div className="flex items-center justify-between mb-3">
        <RiskBadge risk={project.risk} />
        <span className="inline-flex items-center gap-1 text-[11px] text-[var(--text-muted)]">
          <Calendar className="w-3 h-3" />
          {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* Bottom: avatars */}
      <AvatarStack members={project.members} />

      {/* Expanded detail */}
      {isExpanded && <ProjectExpandedDetail project={project} />}
    </div>
  );
}

/* ────────── Column (Board) ────────── */

function BoardColumn({
  status,
  projects,
  expandedProjectId,
  onToggleExpand,
  onDeleteProject,
  isManager,
}: {
  status: ProjectStatus;
  projects: Project[];
  expandedProjectId: string | null;
  onToggleExpand: (id: string) => void;
  onDeleteProject: (project: Project) => void;
  isManager: boolean;
}) {
  const sc = STATUS_COLORS[status];
  return (
    <div className={cn('flex flex-col min-w-[280px] max-w-[320px] rounded-2xl p-3', sc.colBg)}>
      {/* Column header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <span className={cn('text-sm font-semibold', sc.text)}>{status}</span>
          <span
            className={cn(
              'inline-flex items-center justify-center w-5 h-5 rounded-md text-[11px] font-bold',
              sc.bg,
              sc.text
            )}
          >
            {projects.length}
          </span>
        </div>
        <button className="p-1 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors">
          <MoreHorizontal className="w-4 h-4 text-[var(--text-muted)]" />
        </button>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3 flex-1 overflow-y-auto pr-1">
        {projects.map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            isExpanded={expandedProjectId === p.id}
            onToggleExpand={() => onToggleExpand(p.id)}
            onDelete={() => onDeleteProject(p)}
            isManager={isManager}
          />
        ))}
      </div>

      {/* Add button */}
      <button className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 rounded-xl border border-dashed border-[var(--card-border)] text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:border-[var(--text-muted)] hover:bg-[var(--card-bg)] transition-all">
        <Plus className="w-3.5 h-3.5" />
        Add
      </button>
    </div>
  );
}

/* ────────── List Row ────────── */

function ProjectListRow({
  project,
  isExpanded,
  onToggleExpand,
  onDelete,
  isManager,
}: {
  project: Project;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onDelete?: () => void;
  isManager: boolean;
}) {
  const sc = STATUS_COLORS[project.status];
  return (
    <div className="border-b border-[var(--card-border)]">
      <div
        onClick={onToggleExpand}
        className={cn(
          'group grid grid-cols-[2fr_120px_160px_100px_120px_100px_80px] gap-4 items-center px-5 py-3.5 hover:bg-[var(--card-hover)] transition-colors cursor-pointer',
          isExpanded && 'bg-[var(--card-hover)]'
        )}
      >
        {/* Name */}
        <div className="flex items-center gap-3 min-w-0">
          <FolderKanban className="w-4 h-4 text-indigo-500 shrink-0" />
          <span className="text-sm font-medium text-[var(--text-primary)] truncate">{project.name}</span>
          {isExpanded
            ? <ChevronUp className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
            : <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          }
        </div>
        {/* Status */}
        <span className={cn('inline-flex items-center justify-center px-2.5 py-1 rounded-full text-[11px] font-semibold', sc.bg, sc.text)}>
          {project.status}
        </span>
        {/* Progress */}
        <ProgressBar value={project.progress} />
        {/* Risk */}
        <RiskBadge risk={project.risk} />
        {/* Lead */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
            {getInitials(project.lead.name)}
          </div>
          <span className="text-xs text-[var(--text-secondary)] truncate">{project.lead.name.split(' ')[0]}</span>
        </div>
        {/* Due */}
        <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        {/* Members + Actions */}
        <div className="flex items-center justify-center gap-1">
          <span className="text-xs text-[var(--text-muted)]">{project.members.length}</span>
          {isManager && onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-red-500/10 hover:text-red-500 text-[var(--text-muted)]"
              title="Delete project"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded detail */}
      {isExpanded && (
        <div className="px-5 pb-4">
          <ProjectExpandedDetail project={project} />
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════ MAIN PAGE ══════════════════════════ */

export default function ProjectsPage() {
  const { projects, deleteProject } = useAppState();
  const { currentRole } = useRole();
  const { addToast } = useToast();
  const isManager = currentRole === 'Manager';

  const [view, setView] = useState<'board' | 'list'>('board');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ProjectStatus>('All');
  const [sortBy, setSortBy] = useState<(typeof SORT_OPTIONS)[number]>('Name');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Expand state
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);

  // Delete confirm state
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const handleToggleExpand = (id: string) => {
    setExpandedProjectId((prev) => (prev === id ? null : id));
  };

  const handleDeleteConfirm = () => {
    if (!projectToDelete) return;
    deleteProject(projectToDelete.id);
    addToast({ title: 'Project Deleted', message: `"${projectToDelete.name}" has been removed`, type: 'success' });
    if (expandedProjectId === projectToDelete.id) setExpandedProjectId(null);
    setProjectToDelete(null);
  };

  /* ---- filter & sort ---- */
  const filtered = useMemo(() => {
    let list = [...projects];
    if (statusFilter !== 'All') list = list.filter((p) => p.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      switch (sortBy) {
        case 'Due Date':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        case 'Progress':
          return b.progress - a.progress;
        case 'Risk': {
          const order: Record<RiskLevel, number> = { Blocked: 0, 'At Risk': 1, Safe: 2 };
          return order[a.risk] - order[b.risk];
        }
        default:
          return a.name.localeCompare(b.name);
      }
    });
    return list;
  }, [projects, search, statusFilter, sortBy]);

  /* ---- board columns ---- */
  const columns = useMemo(() => {
    const map: Record<ProjectStatus, Project[]> = {
      Backlog: [],
      Planned: [],
      'In Progress': [],
      Review: [],
      Completed: [],
      Blocked: [],
    };
    filtered.forEach((p) => {
      if (map[p.status]) map[p.status].push(p);
    });
    // Merge Blocked items into their own column only if any exist
    return STATUSES.map((s) => ({ status: s, projects: map[s] })).concat(
      map.Blocked.length > 0 ? [{ status: 'Blocked' as ProjectStatus, projects: map.Blocked }] : []
    );
  }, [filtered]);

  return (
    <div className="flex flex-col h-full">
      {/* ────────── Header ────────── */}
      <div className="shrink-0 px-6 pt-6 pb-4 space-y-4">
        {/* Title row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <FolderKanban className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[var(--text-primary)]">Projects</h1>
              <p className="text-xs text-[var(--text-muted)]">{projects.length} total projects</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all active:scale-[0.97]"
          >
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* View toggle */}
          <div className="flex items-center rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-0.5">
            <button
              onClick={() => setView('board')}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                view === 'board'
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Board
            </button>
            <button
              onClick={() => setView('list')}
              className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                view === 'list'
                  ? 'bg-indigo-500 text-white shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
              )}
            >
              <List className="w-3.5 h-3.5" />
              List
            </button>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search projects…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <button
              onClick={() => { setShowStatusDropdown((v) => !v); setShowSortDropdown(false); }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-medium text-[var(--text-secondary)] hover:border-indigo-500/40 transition-all"
            >
              <Filter className="w-3.5 h-3.5" />
              {statusFilter === 'All' ? 'Status' : statusFilter}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showStatusDropdown && (
              <div className="absolute top-full mt-1 left-0 z-50 w-44 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-xl shadow-black/10 py-1 animate-in fade-in slide-in-from-top-1">
                {(['All', ...STATUSES, 'Blocked'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => { setStatusFilter(s as typeof statusFilter); setShowStatusDropdown(false); }}
                    className={cn(
                      'w-full text-left px-3 py-2 text-xs hover:bg-[var(--bg-tertiary)] transition-colors',
                      statusFilter === s ? 'text-indigo-500 font-semibold' : 'text-[var(--text-secondary)]'
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => { setShowSortDropdown((v) => !v); setShowStatusDropdown(false); }}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] text-xs font-medium text-[var(--text-secondary)] hover:border-indigo-500/40 transition-all"
            >
              Sort: {sortBy}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showSortDropdown && (
              <div className="absolute top-full mt-1 right-0 z-50 w-36 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-xl shadow-black/10 py-1 animate-in fade-in slide-in-from-top-1">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setSortBy(opt); setShowSortDropdown(false); }}
                    className={cn(
                      'w-full text-left px-3 py-2 text-xs hover:bg-[var(--bg-tertiary)] transition-colors',
                      sortBy === opt ? 'text-indigo-500 font-semibold' : 'text-[var(--text-secondary)]'
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ────────── Body ────────── */}
      <div className="flex-1 overflow-hidden px-6 pb-6">
        {view === 'board' ? (
          /* ═══ Board View ═══ */
          <div className="flex gap-4 h-full overflow-x-auto pb-2 snap-x">
            {columns.map((col) => (
              <BoardColumn
                key={col.status}
                status={col.status}
                projects={col.projects}
                expandedProjectId={expandedProjectId}
                onToggleExpand={handleToggleExpand}
                onDeleteProject={setProjectToDelete}
                isManager={isManager}
              />
            ))}
          </div>
        ) : (
          /* ═══ List View ═══ */
          <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden h-full flex flex-col">
            {/* Table header */}
            <div className="grid grid-cols-[2fr_120px_160px_100px_120px_100px_80px] gap-4 px-5 py-3 border-b border-[var(--card-border)] bg-[var(--bg-tertiary)] text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              <span>Project</span>
              <span>Status</span>
              <span>Progress</span>
              <span>Risk</span>
              <span>Lead</span>
              <span>Due</span>
              <span className="text-center">Team</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filtered.map((p) => (
                <ProjectListRow
                  key={p.id}
                  project={p}
                  isExpanded={expandedProjectId === p.id}
                  onToggleExpand={() => handleToggleExpand(p.id)}
                  onDelete={() => setProjectToDelete(p)}
                  isManager={isManager}
                />
              ))}
              {filtered.length === 0 && (
                <div className="flex items-center justify-center h-40 text-sm text-[var(--text-muted)]">
                  No projects match your filters.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ────────── Modals ────────── */}
      <CreateProjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
      <ConfirmDeleteModal
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Project"
        itemName={projectToDelete?.name}
      />
    </div>
  );
}
