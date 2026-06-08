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

const STATUS_COLORS: Record<ProjectStatus, { bg: string; text: string; dot: string }> = {
  Backlog:       { bg: 'bg-[var(--bg-hover)]', text: 'text-[var(--text-muted)]', dot: 'bg-gray-400' },
  Planned:       { bg: 'bg-sky-100 dark:bg-sky-900/30', text: 'text-sky-700 dark:text-sky-400', dot: 'bg-sky-500' },
  'In Progress': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', dot: 'bg-blue-500' },
  Review:        { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-400', dot: 'bg-purple-500' },
  Completed:     { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400', dot: 'bg-emerald-500' },
  Blocked:       { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400', dot: 'bg-red-500' },
};

const RISK_CONFIG: Record<RiskLevel, { icon: React.ReactNode; color: string }> = {
  Safe:      { icon: <Shield className="w-3 h-3" />, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' },
  'At Risk': { icon: <AlertTriangle className="w-3 h-3" />, color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400' },
  Blocked:   { icon: <XCircle className="w-3 h-3" />, color: 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400' },
};

const SORT_OPTIONS = ['Name', 'Due Date', 'Progress', 'Risk'] as const;

/* ────────────────────────── sub-components ────────────────────── */

function AvatarStack({ members, max = 3 }: { members: Project['members']; max?: number }) {
  const visible = members.slice(0, max);
  const overflow = members.length - max;
  return (
    <div className="flex -space-x-1">
      {visible.map((m) => (
        <div
          key={m.id}
          title={m.name}
          className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-medium border border-[var(--bg-main)] bg-[var(--border-light)] text-[var(--text-main)]"
        >
          {getInitials(m.name)}
        </div>
      ))}
      {overflow > 0 && (
        <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-medium border border-[var(--bg-main)] bg-[var(--border-light)] text-[var(--text-muted)]">
          +{overflow}
        </div>
      )}
    </div>
  );
}

function RiskBadge({ risk }: { risk: RiskLevel }) {
  const c = RISK_CONFIG[risk];
  return (
    <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium', c.color)}>
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
      ? 'bg-blue-500'
      : value >= 25
      ? 'bg-amber-500'
      : 'bg-red-500';
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1.5 rounded-full bg-[var(--border-light)] overflow-hidden">
        <div className={cn('h-full rounded-full transition-all duration-500', color)} style={{ width: `${value}%` }} />
      </div>
      <span className="text-[11px] font-medium text-[var(--text-muted)] tabular-nums w-8 text-right">{value}%</span>
    </div>
  );
}

/* ────────── Expanded Detail Panel ────────── */

function ProjectExpandedDetail({ project }: { project: Project }) {
  return (
    <div className="mt-3 pt-3 border-t border-[var(--border-light)] space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
      {/* Description */}
      {project.description && (
        <div>
          <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-1">Description</p>
          <p className="text-[13px] text-[var(--text-main)] leading-relaxed">{project.description}</p>
        </div>
      )}

      {/* Due Date */}
      <div className="flex items-center gap-2">
        <Clock className="w-3.5 h-3.5 text-[var(--text-muted)]" />
        <span className="text-[13px] text-[var(--text-main)]">
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
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[var(--bg-hover)] border border-[var(--border-light)] text-[12px] font-medium text-[var(--text-main)]"
            >
              <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold bg-[var(--border-light)]">
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
  return (
    <div
      className={cn(
        'group relative rounded shadow-sm p-3 border transition-colors cursor-pointer bg-[var(--bg-main)] text-[14px]',
        'hover:bg-[var(--bg-hover)] border-[var(--border-light)]',
        isExpanded && 'border-[var(--accent-primary)]'
      )}
      onClick={onToggleExpand}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-medium text-[var(--text-main)] leading-snug pr-2">
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
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:text-[var(--text-main)] text-[var(--text-muted)]"
          >
            {isExpanded
              ? <ChevronUp className="w-4 h-4" />
              : <MoreHorizontal className="w-4 h-4" />
            }
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-[12px] text-[var(--text-muted)] mb-3 line-clamp-2 leading-relaxed">{project.description}</p>

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
    <div className="w-[260px] shrink-0 flex flex-col">
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3 px-1 text-[14px] font-medium text-[var(--text-main)]">
        <span className={cn('w-4 h-4 rounded-[3px] flex items-center justify-center text-[10px]', sc.bg, sc.text)}>•</span>
        {status}
        <span className="text-[var(--text-muted)] font-normal text-[12px] ml-1">{projects.length}</span>
        <span className="ml-auto text-[var(--text-muted)] hover:bg-[var(--bg-hover)] w-6 h-6 flex items-center justify-center rounded cursor-pointer">+</span>
      </div>

      {/* Cards */}
      <div className="flex-1 space-y-2">
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
        {/* Add button */}
        <div className="h-8 hover:bg-[var(--bg-hover)] rounded-[4px] border border-transparent transition-colors flex items-center px-3 cursor-pointer text-[14px] text-[var(--text-muted)] opacity-0 hover:opacity-100">+ New</div>
      </div>
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
    <div className="border-b border-[var(--border-light)]">
      <div
        onClick={onToggleExpand}
        className={cn(
          'group grid grid-cols-[2fr_120px_160px_100px_120px_100px_80px] gap-4 items-center px-4 py-3 hover:bg-[var(--bg-hover)] transition-colors cursor-pointer text-[14px]',
          isExpanded && 'bg-[var(--bg-hover)]'
        )}
      >
        {/* Name */}
        <div className="flex items-center gap-3 min-w-0">
          <FolderKanban className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
          <span className="font-medium text-[var(--text-main)] truncate">{project.name}</span>
        </div>
        {/* Status */}
        <span className={cn('inline-flex items-center px-1.5 py-0.5 rounded text-[12px]', sc.bg, sc.text)}>
          {project.status}
        </span>
        {/* Progress */}
        <ProgressBar value={project.progress} />
        {/* Risk */}
        <RiskBadge risk={project.risk} />
        {/* Lead */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-medium bg-[var(--border-light)] text-[var(--text-main)]">
            {getInitials(project.lead.name)}
          </div>
          <span className="text-[13px] text-[var(--text-muted)] truncate">{project.lead.name.split(' ')[0]}</span>
        </div>
        {/* Due */}
        <span className="text-[13px] text-[var(--text-muted)] flex items-center gap-1">
          {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        {/* Members + Actions */}
        <div className="flex items-center justify-between gap-1">
          <span className="text-[13px] text-[var(--text-muted)]">{project.members.length} members</span>
          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            {isManager && onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="p-1 rounded hover:bg-red-500/10 hover:text-red-500 text-[var(--text-muted)]"
                title="Delete project"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            {isExpanded
              ? <ChevronUp className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
              : <ChevronDown className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
            }
          </div>
        </div>
      </div>

      {/* Expanded detail */}
      {isExpanded && (
        <div className="px-10 pb-4 pt-2">
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
    <div className="flex flex-col h-full mt-4">
      {/* Notion Database Header (Title & Views) */}
      <div className="mb-6">
        <h1 className="text-[32px] font-bold text-[var(--text-main)] mb-6 tracking-tight flex items-center gap-2">
          <span className="text-[32px] select-none">📁</span> Projects
        </h1>
        
        {/* View Tabs */}
        <div className="flex items-center border-b border-[var(--border-light)] gap-4 px-2">
          <div 
            onClick={() => setView('board')}
            className={cn("text-[14px] pb-2 cursor-pointer transition-colors", view === 'board' ? "font-medium border-b-2 border-[var(--text-main)] text-[var(--text-main)]" : "text-[var(--text-muted)] hover:text-[var(--text-main)]")}
          >
            Board View
          </div>
          <div 
            onClick={() => setView('list')}
            className={cn("text-[14px] pb-2 cursor-pointer transition-colors", view === 'list' ? "font-medium border-b-2 border-[var(--text-main)] text-[var(--text-main)]" : "text-[var(--text-muted)] hover:text-[var(--text-main)]")}
          >
            Table View
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-6 text-[14px]">
        <div className="flex items-center gap-3 text-[var(--text-muted)] relative">
          
          {/* Status filter */}
          <button
            onClick={() => { setShowStatusDropdown((v) => !v); setShowSortDropdown(false); }}
            className="hover:bg-[var(--bg-hover)] px-2 py-1 rounded transition-colors flex items-center gap-1"
          >
            <Filter className="w-3.5 h-3.5" />
            {statusFilter === 'All' ? 'Filter' : statusFilter}
            <ChevronDown className="w-3 h-3" />
          </button>
          {showStatusDropdown && (
            <div className="absolute top-full mt-1 left-0 z-50 w-44 rounded border border-[var(--border-light)] bg-[var(--bg-main)] shadow-lg py-1">
              {(['All', ...STATUSES, 'Blocked'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s as typeof statusFilter); setShowStatusDropdown(false); }}
                  className={cn(
                    'w-full text-left px-3 py-1.5 text-[13px] hover:bg-[var(--bg-hover)] transition-colors',
                    statusFilter === s ? 'text-[var(--accent-primary)] font-medium' : 'text-[var(--text-main)]'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Sort */}
          <button
            onClick={() => { setShowSortDropdown((v) => !v); setShowStatusDropdown(false); }}
            className="hover:bg-[var(--bg-hover)] px-2 py-1 rounded transition-colors flex items-center gap-1"
          >
            Sort
            <ChevronDown className="w-3 h-3" />
          </button>
          {showSortDropdown && (
            <div className="absolute top-full mt-1 left-[70px] z-50 w-36 rounded border border-[var(--border-light)] bg-[var(--bg-main)] shadow-lg py-1">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setSortBy(opt); setShowSortDropdown(false); }}
                  className={cn(
                    'w-full text-left px-3 py-1.5 text-[13px] hover:bg-[var(--bg-hover)] transition-colors',
                    sortBy === opt ? 'text-[var(--accent-primary)] font-medium' : 'text-[var(--text-main)]'
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}

          {/* Search */}
          <div className="flex items-center ml-2 border-l border-[var(--border-light)] pl-2">
            <Search className="w-4 h-4 text-[var(--text-muted)] mr-2" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-none outline-none text-[14px] w-40 text-[var(--text-main)] placeholder:text-[var(--text-muted)]"
            />
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[var(--accent-primary)] text-white px-3 py-1.5 rounded font-medium hover:opacity-90 transition-opacity flex items-center gap-1"
        >
          New
        </button>
      </div>

      {/* ────────── Body ────────── */}
      <div className="flex-1 overflow-hidden pb-6">
        {view === 'board' ? (
          /* ═══ Board View ═══ */
          <div className="flex gap-6 h-full overflow-x-auto pb-4">
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
          /* ═══ List View (Table) ═══ */
          <div className="border border-[var(--border-light)] rounded overflow-hidden flex flex-col h-full bg-[var(--bg-main)]">
            {/* Table header */}
            <div className="grid grid-cols-[2fr_120px_160px_100px_120px_100px_80px] gap-4 px-4 py-2 border-b border-[var(--border-light)] bg-[var(--bg-sidebar)] text-[12px] font-medium text-[var(--text-muted)]">
              <span>Name</span>
              <span>Status</span>
              <span>Progress</span>
              <span>Risk</span>
              <span>Lead</span>
              <span>Due</span>
              <span>Team</span>
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
                <div className="flex items-center justify-center h-40 text-[14px] text-[var(--text-muted)]">
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
