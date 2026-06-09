'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';
import { useAppState } from '@/context/app-state-context';
import { useRole } from '@/context/role-context';
import { useToast } from '@/components/ui/toast';
import { PageHeader } from '@/components/ui/page-header';
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
  Backlog:       { bg: 'bg-black/[0.04]', text: 'text-[var(--color-apple-subtle)]', dot: 'bg-gray-400' },
  Planned:       { bg: 'bg-sky-50', text: 'text-sky-600', dot: 'bg-sky-500' },
  'In Progress': { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-500' },
  Review:        { bg: 'bg-purple-50', text: 'text-purple-600', dot: 'bg-purple-500' },
  Completed:     { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' },
  Blocked:       { bg: 'bg-red-50', text: 'text-red-600', dot: 'bg-red-500' },
};

const RISK_CONFIG: Record<RiskLevel, { icon: React.ReactNode; color: string }> = {
  Safe:      { icon: <Shield className="w-3 h-3" />, color: 'text-emerald-600 bg-emerald-50' },
  'At Risk': { icon: <AlertTriangle className="w-3 h-3" />, color: 'text-amber-600 bg-amber-50' },
  Blocked:   { icon: <XCircle className="w-3 h-3" />, color: 'text-red-600 bg-red-50' },
};

const SORT_OPTIONS = ['Name', 'Due Date', 'Progress', 'Risk'] as const;

/* ────────── Gradient banners for project cards ────────── */
const CARD_GRADIENTS = [
  'from-blue-400/80 to-indigo-500/80',
  'from-purple-400/80 to-pink-500/80',
  'from-emerald-400/80 to-teal-500/80',
  'from-orange-400/80 to-rose-500/80',
  'from-cyan-400/80 to-blue-500/80',
  'from-pink-400/80 to-violet-500/80',
];

function getGradient(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return CARD_GRADIENTS[Math.abs(hash) % CARD_GRADIENTS.length];
}

/* Avatar color from name */
function avatarHsl(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return `hsl(${Math.abs(h) % 360}, 60%, 72%)`;
}

/* ────────────────────────── sub-components ────────────────────── */

function AvatarStack({ members, max = 3 }: { members: Project['members']; max?: number }) {
  const visible = members.slice(0, max);
  const overflow = members.length - max;
  return (
    <div className="flex -space-x-1.5">
      {visible.map((m) => (
        <div
          key={m.id}
          title={m.name}
          className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold text-white border-[1.5px] border-white"
          style={{ backgroundColor: avatarHsl(m.name) }}
        >
          {getInitials(m.name)}
        </div>
      ))}
      {overflow > 0 && (
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold bg-black/[0.06] text-[var(--color-apple-subtle)] border-[1.5px] border-white">
          +{overflow}
        </div>
      )}
    </div>
  );
}

function RiskBadge({ risk }: { risk: RiskLevel }) {
  const c = RISK_CONFIG[risk];
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium', c.color)}>
      {c.icon}
      {risk}
    </span>
  );
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-[3px] rounded-full bg-black/[0.06] overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--color-apple-green)] transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-[11px] font-medium text-[var(--color-apple-subtle)] tabular-nums w-8 text-right">{value}%</span>
    </div>
  );
}

/* ────────── Expanded Detail Panel ────────── */

function ProjectExpandedDetail({ project }: { project: Project }) {
  return (
    <div className="mt-3 pt-3 border-t border-black/[0.06] space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
      {/* Description */}
      {project.description && (
        <div>
          <p className="text-[11px] font-semibold text-[var(--color-apple-subtle)] uppercase tracking-wider mb-1">Description</p>
          <p className="text-[13px] text-[var(--color-apple-text)] leading-relaxed">{project.description}</p>
        </div>
      )}

      {/* Due Date */}
      <div className="flex items-center gap-2">
        <Clock className="w-3.5 h-3.5 text-[var(--color-apple-subtle)]" />
        <span className="text-[13px] text-[var(--color-apple-text)]">
          Due: {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      {/* Progress Bar */}
      <div>
        <p className="text-[11px] font-semibold text-[var(--color-apple-subtle)] uppercase tracking-wider mb-1.5">Progress</p>
        <ProgressBar value={project.progress} />
      </div>

      {/* Members */}
      <div>
        <p className="text-[11px] font-semibold text-[var(--color-apple-subtle)] uppercase tracking-wider mb-1.5 flex items-center gap-1">
          <Users className="w-3 h-3" />
          Team ({project.members.length})
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.members.map((m) => (
            <span
              key={m.id}
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-black/[0.03] text-[12px] font-medium text-[var(--color-apple-text)]"
            >
              <span
                className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                style={{ backgroundColor: avatarHsl(m.name) }}
              >
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
        'group relative apple-card overflow-hidden cursor-pointer transition-all duration-200',
        'hover:-translate-y-0.5 hover:shadow-md',
        isExpanded && 'ring-1 ring-[var(--color-apple-blue)]/30'
      )}
      onClick={onToggleExpand}
    >
      {/* Gradient Banner */}
      <div className={cn('h-20 bg-gradient-to-br', getGradient(project.name))} />

      {/* Card Body */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-semibold text-[15px] text-[var(--color-apple-text)] leading-snug pr-2">
            {project.name}
          </h4>
          <div className="flex items-center gap-0.5">
            {isManager && onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-[8px] hover:bg-red-500/10 hover:text-red-500 text-[var(--color-apple-subtle)]"
                title="Delete project"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-[8px] hover:bg-black/[0.04] text-[var(--color-apple-subtle)]"
            >
              {isExpanded
                ? <ChevronUp className="w-4 h-4" />
                : <MoreHorizontal className="w-4 h-4" />
              }
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-[13px] text-[var(--color-apple-subtle)] mb-3 line-clamp-2 leading-relaxed">{project.description}</p>

        {/* Progress */}
        <div className="mb-3">
          <ProgressBar value={project.progress} />
        </div>

        {/* Risk + Due */}
        <div className="flex items-center justify-between mb-3">
          <RiskBadge risk={project.risk} />
          <span className="inline-flex items-center gap-1 text-[11px] text-[var(--color-apple-subtle)]">
            <Calendar className="w-3 h-3" />
            {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* Bottom: avatars */}
        <AvatarStack members={project.members} />

        {/* Expanded detail */}
        {isExpanded && <ProjectExpandedDetail project={project} />}
      </div>
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
  return (
    <div className="w-[280px] shrink-0 flex flex-col">
      {/* Column header */}
      <div className="flex items-center gap-2 mb-4 px-1">
        <span className="text-[13px] font-semibold text-[var(--color-apple-subtle)] uppercase tracking-wider">
          {status}
        </span>
        <span className="text-[12px] font-medium text-[var(--color-apple-subtle)]/60 bg-black/[0.04] rounded-full px-2 py-0.5">
          {projects.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1 space-y-3">
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
        <div className="h-9 hover:bg-black/[0.02] rounded-[10px] border border-dashed border-black/[0.08] transition-colors flex items-center justify-center cursor-pointer text-[13px] text-[var(--color-apple-subtle)] opacity-0 hover:opacity-100">
          <Plus className="w-3.5 h-3.5 mr-1" /> New
        </div>
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
    <div className="border-b border-black/[0.05]">
      <div
        onClick={onToggleExpand}
        className={cn(
          'group grid grid-cols-[2fr_120px_160px_100px_120px_100px_80px] gap-4 items-center px-5 py-3 hover:bg-black/[0.02] transition-colors cursor-pointer text-[13.5px]',
          isExpanded && 'bg-black/[0.02]'
        )}
      >
        {/* Name */}
        <div className="flex items-center gap-3 min-w-0">
          <FolderKanban className="w-4 h-4 text-[var(--color-apple-blue)] shrink-0" />
          <span className="font-medium text-[var(--color-apple-text)] truncate">{project.name}</span>
        </div>
        {/* Status */}
        <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[12px] font-medium', sc.bg, sc.text)}>
          {project.status}
        </span>
        {/* Progress */}
        <ProgressBar value={project.progress} />
        {/* Risk */}
        <RiskBadge risk={project.risk} />
        {/* Lead */}
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold text-white"
            style={{ backgroundColor: avatarHsl(project.lead.name) }}
          >
            {getInitials(project.lead.name)}
          </div>
          <span className="text-[13px] text-[var(--color-apple-subtle)] truncate">{project.lead.name.split(' ')[0]}</span>
        </div>
        {/* Due */}
        <span className="text-[13px] text-[var(--color-apple-subtle)] flex items-center gap-1">
          {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        {/* Members + Actions */}
        <div className="flex items-center justify-between gap-1">
          <span className="text-[13px] text-[var(--color-apple-subtle)]">{project.members.length}</span>
          <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
            {isManager && onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="p-1 rounded-[8px] hover:bg-red-500/10 hover:text-red-500 text-[var(--color-apple-subtle)]"
                title="Delete project"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            {isExpanded
              ? <ChevronUp className="w-4 h-4 text-[var(--color-apple-subtle)] shrink-0" />
              : <ChevronDown className="w-4 h-4 text-[var(--color-apple-subtle)] shrink-0" />
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
    <div className="flex flex-col h-full">
      {/* ────── Apple Page Header ────── */}
      <PageHeader
        title="Projects"
        subtitle={`${projects.length} project${projects.length !== 1 ? 's' : ''} across your workspace`}
        actions={
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--color-apple-subtle)]" />
              <input
                type="text"
                placeholder="Search projects…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-4 py-1.5 rounded-full border border-black/[0.08] bg-white text-[13px] text-[var(--color-apple-text)] placeholder:text-[var(--color-apple-subtle)] outline-none focus:ring-2 focus:ring-[var(--color-apple-blue)]/20 w-52 transition-shadow"
              />
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[var(--color-apple-blue)] text-white px-4 py-1.5 rounded-full text-[13px] font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              New project
            </button>
          </>
        }
      />

      {/* ────── Toolbar ────── */}
      <div className="flex justify-between items-center px-10 py-4">
        <div className="flex items-center gap-2 relative">
          {/* View toggle – segmented control */}
          <div className="flex items-center bg-black/[0.05] rounded-[10px] p-0.5 mr-3">
            <button
              onClick={() => setView('board')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded-[8px] text-[13px] font-medium transition-all',
                view === 'board'
                  ? 'bg-white shadow-sm text-[var(--color-apple-text)]'
                  : 'text-[var(--color-apple-subtle)] hover:text-[var(--color-apple-text)]'
              )}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Board
            </button>
            <button
              onClick={() => setView('list')}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded-[8px] text-[13px] font-medium transition-all',
                view === 'list'
                  ? 'bg-white shadow-sm text-[var(--color-apple-text)]'
                  : 'text-[var(--color-apple-subtle)] hover:text-[var(--color-apple-text)]'
              )}
            >
              <List className="w-3.5 h-3.5" />
              List
            </button>
          </div>

          {/* Status filter */}
          <button
            onClick={() => { setShowStatusDropdown((v) => !v); setShowSortDropdown(false); }}
            className="hover:bg-black/[0.04] px-3 py-1.5 rounded-[8px] transition-colors flex items-center gap-1.5 text-[13px] text-[var(--color-apple-subtle)]"
          >
            <Filter className="w-3.5 h-3.5" />
            {statusFilter === 'All' ? 'Filter' : statusFilter}
            <ChevronDown className="w-3 h-3" />
          </button>
          {showStatusDropdown && (
            <div className="absolute top-full mt-1 left-[140px] z-50 w-44 rounded-[10px] border border-black/[0.06] bg-white shadow-lg py-1 backdrop-blur-xl">
              {(['All', ...STATUSES, 'Blocked'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s as typeof statusFilter); setShowStatusDropdown(false); }}
                  className={cn(
                    'w-full text-left px-3 py-1.5 text-[13px] hover:bg-black/[0.04] transition-colors',
                    statusFilter === s ? 'text-[var(--color-apple-blue)] font-medium' : 'text-[var(--color-apple-text)]'
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
            className="hover:bg-black/[0.04] px-3 py-1.5 rounded-[8px] transition-colors flex items-center gap-1.5 text-[13px] text-[var(--color-apple-subtle)]"
          >
            Sort
            <ChevronDown className="w-3 h-3" />
          </button>
          {showSortDropdown && (
            <div className="absolute top-full mt-1 left-[230px] z-50 w-36 rounded-[10px] border border-black/[0.06] bg-white shadow-lg py-1 backdrop-blur-xl">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  onClick={() => { setSortBy(opt); setShowSortDropdown(false); }}
                  className={cn(
                    'w-full text-left px-3 py-1.5 text-[13px] hover:bg-black/[0.04] transition-colors',
                    sortBy === opt ? 'text-[var(--color-apple-blue)] font-medium' : 'text-[var(--color-apple-text)]'
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ────────── Body ────────── */}
      <div className="flex-1 overflow-hidden px-10 py-2 pb-6">
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
          <div className="apple-card overflow-hidden flex flex-col h-full">
            {/* Table header */}
            <div className="grid grid-cols-[2fr_120px_160px_100px_120px_100px_80px] gap-4 px-5 py-3 border-b border-black/[0.06] text-[12px] font-medium text-[var(--color-apple-subtle)] uppercase tracking-wider">
              <span>Name</span>
              <span>Status</span>
              <span>Progress</span>
              <span>Risk</span>
              <span>Lead</span>
              <span>Due</span>
              <span>Team</span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-black/[0.05]">
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
                <div className="flex items-center justify-center h-40 text-[13.5px] text-[var(--color-apple-subtle)]">
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
