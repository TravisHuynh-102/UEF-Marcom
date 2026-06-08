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

const STATUS_COLORS: Record<ProjectStatus, { bg: string; text: string; border: string; colBg: string; line: string }> = {
  Backlog:       { bg: 'bg-[#121212]', text: 'text-[#A4A4A4]', border: 'border-[#2C2C2C]', colBg: 'bg-[#191919]', line: 'border-t-[#A4A4A4]' },
  Planned:       { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/20', colBg: 'bg-[#191919]', line: 'border-t-sky-400' },
  'In Progress': { bg: 'bg-[#9D5DFF]/10', text: 'text-[#9D5DFF]', border: 'border-[#9D5DFF]/20', colBg: 'bg-[#191919]', line: 'border-t-[#9D5DFF]' },
  Review:        { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', colBg: 'bg-[#191919]', line: 'border-t-amber-400' },
  Completed:     { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', colBg: 'bg-[#191919]', line: 'border-t-emerald-400' },
  Blocked:       { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', colBg: 'bg-[#191919]', line: 'border-t-red-400' },
};

const RISK_CONFIG: Record<RiskLevel, { icon: React.ReactNode; color: string }> = {
  Safe:      { icon: <Shield className="w-3 h-3" />, color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
  'At Risk': { icon: <AlertTriangle className="w-3 h-3" />, color: 'bg-amber-500/10 text-amber-400 border border-amber-500/20' },
  Blocked:   { icon: <XCircle className="w-3 h-3" />, color: 'bg-red-500/10 text-red-400 border border-red-500/20' },
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
          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border border-[#202020] bg-[#121212] text-white"
        >
          {getInitials(m.name)}
        </div>
      ))}
      {overflow > 0 && (
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border border-[#202020] bg-[#121212] text-[#A4A4A4]">
          +{overflow}
        </div>
      )}
    </div>
  );
}

function RiskBadge({ risk }: { risk: RiskLevel }) {
  const c = RISK_CONFIG[risk];
  return (
    <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium', c.color)}>
      {c.icon}
      {risk}
    </span>
  );
}

function ProgressBar({ value }: { value: number }) {
  const color =
    value >= 80
      ? 'bg-emerald-400'
      : value >= 50
      ? 'bg-[#9D5DFF]'
      : value >= 25
      ? 'bg-amber-400'
      : 'bg-red-400';
  return (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 h-1.5 rounded-full bg-[#121212] border border-[#2C2C2C] overflow-hidden">
        <div className={cn('h-full rounded-full transition-all duration-500', color)} style={{ width: `${value}%` }} />
      </div>
      <span className="text-[11px] font-medium text-[#A4A4A4] tabular-nums w-8 text-right">{value}%</span>
    </div>
  );
}

/* ────────── Expanded Detail Panel ────────── */

function ProjectExpandedDetail({ project }: { project: Project }) {
  return (
    <div className="mt-3 pt-3 border-t border-[#2C2C2C] space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
      {/* Description */}
      {project.description && (
        <div>
          <p className="text-[11px] font-semibold text-[#A4A4A4] uppercase tracking-wider mb-1">Description</p>
          <p className="text-xs text-[#A4A4A4] leading-relaxed">{project.description}</p>
        </div>
      )}

      {/* Due Date */}
      <div className="flex items-center gap-2">
        <Clock className="w-3.5 h-3.5 text-[#A4A4A4]" />
        <span className="text-xs text-[#A4A4A4]">
          Due: {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      {/* Progress Bar */}
      <div>
        <p className="text-[11px] font-semibold text-[#A4A4A4] uppercase tracking-wider mb-1.5">Progress</p>
        <ProgressBar value={project.progress} />
      </div>

      {/* Members */}
      <div>
        <p className="text-[11px] font-semibold text-[#A4A4A4] uppercase tracking-wider mb-1.5 flex items-center gap-1">
          <Users className="w-3 h-3" />
          Team ({project.members.length})
        </p>
        <div className="flex flex-wrap gap-1.5">
          {project.members.map((m) => (
            <span
              key={m.id}
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#121212] border border-[#2C2C2C] text-[11px] font-medium text-white"
            >
              <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold bg-[#202020] text-white">
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
        'group relative rounded-xl p-4 border transition-colors cursor-pointer',
        'hover:border-[#9D5DFF]',
        'bg-[#202020] border-[#2C2C2C]',
        isBlocked && 'border-red-500/50',
        isExpanded && 'border-[#9D5DFF]'
      )}
      onClick={onToggleExpand}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-sm font-semibold text-white leading-snug pr-2 line-clamp-2">
          {project.name}
        </h4>
        <div className="flex items-center gap-0.5">
          {isManager && onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-red-500/10 hover:text-red-500 text-[#A4A4A4]"
              title="Delete project"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:text-white text-[#A4A4A4]"
          >
            {isExpanded
              ? <ChevronUp className="w-4 h-4" />
              : <MoreHorizontal className="w-4 h-4" />
            }
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-[#A4A4A4] mb-3 truncate">{project.description}</p>

      {/* Progress */}
      <div className="mb-3">
        <ProgressBar value={project.progress} />
      </div>

      {/* Risk + Due */}
      <div className="flex items-center justify-between mb-3">
        <RiskBadge risk={project.risk} />
        <span className="inline-flex items-center gap-1 text-[11px] text-[#A4A4A4]">
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
    <div className={cn('min-w-[320px] max-w-[320px] rounded-xl flex flex-col h-[calc(100vh-160px)] border border-[#2C2C2C]', sc.colBg)}>
      {/* Column header */}
      <div className={cn("p-4 border-b border-[#2C2C2C] flex items-center justify-between sticky top-0 z-10 rounded-t-xl", sc.colBg, "border-t-[3px]", sc.line)}>
        <div className="flex items-center gap-2">
          <span className="font-headline-md text-headline-md text-white">{status}</span>
          <span
            className={cn(
              'font-label-sm px-2 py-0.5 rounded-full border',
              sc.bg,
              sc.text,
              sc.border
            )}
          >
            {projects.length}
          </span>
        </div>
        <button className="text-[#A4A4A4] hover:text-white transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Cards */}
      <div className="p-3 flex flex-col gap-3 flex-1 overflow-y-auto custom-scrollbar">
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
        <button className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl border border-dashed border-[#2C2C2C] text-xs font-medium text-[#A4A4A4] hover:text-white hover:border-[#A4A4A4] transition-colors mt-2">
          <Plus className="w-3.5 h-3.5" />
          Add Project
        </button>
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
    <div className="border-b border-[#2C2C2C]">
      <div
        onClick={onToggleExpand}
        className={cn(
          'group grid grid-cols-[2fr_120px_160px_100px_120px_100px_80px] gap-4 items-center px-5 py-3.5 hover:bg-[#202020] transition-colors cursor-pointer',
          isExpanded && 'bg-[#202020]'
        )}
      >
        {/* Name */}
        <div className="flex items-center gap-3 min-w-0">
          <FolderKanban className="w-4 h-4 text-[#9D5DFF] shrink-0" />
          <span className="text-sm font-medium text-white truncate">{project.name}</span>
          {isExpanded
            ? <ChevronUp className="w-3.5 h-3.5 text-[#A4A4A4] shrink-0" />
            : <ChevronDown className="w-3.5 h-3.5 text-[#A4A4A4] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          }
        </div>
        {/* Status */}
        <span className={cn('inline-flex items-center justify-center px-2 py-1 rounded text-[11px] font-semibold border', sc.bg, sc.text, sc.border)}>
          {project.status}
        </span>
        {/* Progress */}
        <ProgressBar value={project.progress} />
        {/* Risk */}
        <RiskBadge risk={project.risk} />
        {/* Lead */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold bg-[#121212] border border-[#202020] text-white">
            {getInitials(project.lead.name)}
          </div>
          <span className="text-xs text-[#A4A4A4] truncate">{project.lead.name.split(' ')[0]}</span>
        </div>
        {/* Due */}
        <span className="text-xs text-[#A4A4A4] flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
        {/* Members + Actions */}
        <div className="flex items-center justify-center gap-1">
          <span className="text-xs text-[#A4A4A4]">{project.members.length}</span>
          {isManager && onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-red-500/10 hover:text-red-500 text-[#A4A4A4]"
              title="Delete project"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Expanded detail */}
      {isExpanded && (
        <div className="px-5 pb-4 bg-[#191919]">
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
      <div className="flex items-center justify-between shrink-0 mb-6 mt-2">
        <div className="flex items-center gap-4">
          {/* View toggle */}
          <div className="flex items-center bg-[#121212] rounded-lg p-1 border border-[#2C2C2C]">
            <button
              onClick={() => setView('board')}
              className={cn(
                'px-3 py-1.5 rounded-md font-label-md text-label-md transition-colors',
                view === 'board'
                  ? 'bg-[#202020] text-white shadow-sm'
                  : 'text-[#A4A4A4] hover:text-white'
              )}
            >
              Board
            </button>
            <button
              onClick={() => setView('list')}
              className={cn(
                'px-3 py-1.5 rounded-md font-label-md text-label-md transition-colors',
                view === 'list'
                  ? 'bg-[#202020] text-white shadow-sm'
                  : 'text-[#A4A4A4] hover:text-white'
              )}
            >
              List
            </button>
          </div>
          
          <div className="h-6 w-px bg-[#2C2C2C]"></div>

          {/* Status filter */}
          <div className="relative">
            <button
              onClick={() => { setShowStatusDropdown((v) => !v); setShowSortDropdown(false); }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#2C2C2C] text-[#A4A4A4] hover:text-white hover:bg-[#202020] transition-colors font-label-md text-label-md"
            >
              <Filter className="w-[18px] h-[18px]" />
              {statusFilter === 'All' ? 'Status' : statusFilter}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showStatusDropdown && (
              <div className="absolute top-full mt-1 left-0 z-50 w-44 rounded-xl border border-[#2C2C2C] bg-[#191919] shadow-xl py-1 animate-in fade-in slide-in-from-top-1">
                {(['All', ...STATUSES, 'Blocked'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => { setStatusFilter(s as typeof statusFilter); setShowStatusDropdown(false); }}
                    className={cn(
                      'w-full text-left px-3 py-2 text-xs hover:bg-[#202020] transition-colors',
                      statusFilter === s ? 'text-[#9D5DFF] font-semibold' : 'text-[#A4A4A4]'
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
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#2C2C2C] text-[#A4A4A4] hover:text-white hover:bg-[#202020] transition-colors font-label-md text-label-md"
            >
              Sort: {sortBy}
              <ChevronDown className="w-3 h-3" />
            </button>
            {showSortDropdown && (
              <div className="absolute top-full mt-1 left-0 z-50 w-36 rounded-xl border border-[#2C2C2C] bg-[#191919] shadow-xl py-1 animate-in fade-in slide-in-from-top-1">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setSortBy(opt); setShowSortDropdown(false); }}
                    className={cn(
                      'w-full text-left px-3 py-2 text-xs hover:bg-[#202020] transition-colors',
                      sortBy === opt ? 'text-[#9D5DFF] font-semibold' : 'text-[#A4A4A4]'
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <div className="relative max-w-xs ml-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A4A4A4]" />
            <input
              type="text"
              placeholder="Search projects…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-[#2C2C2C] bg-transparent text-sm text-white placeholder:text-[#A4A4A4] focus:outline-none focus:ring-1 focus:ring-[#9D5DFF] transition-all"
            />
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 bg-[#9D5DFF] text-white px-4 py-2 rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity"
        >
          <span className="material-symbols-outlined text-[18px]">add</span> New Project
        </button>
      </div>

      {/* ────────── Body ────────── */}
      <div className="flex-1 overflow-hidden pb-6">
        {view === 'board' ? (
          /* ═══ Board View ═══ */
          <div className="flex gap-gutter h-full overflow-x-auto pb-4 custom-scrollbar">
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
          <div className="rounded-xl border border-[#2C2C2C] bg-[#191919] overflow-hidden h-full flex flex-col">
            {/* Table header */}
            <div className="grid grid-cols-[2fr_120px_160px_100px_120px_100px_80px] gap-4 px-5 py-3 border-b border-[#2C2C2C] bg-[#121212] text-[11px] font-semibold uppercase tracking-wider text-[#A4A4A4]">
              <span>Project</span>
              <span>Status</span>
              <span>Progress</span>
              <span>Risk</span>
              <span>Lead</span>
              <span>Due</span>
              <span className="text-center">Team</span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
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
                <div className="flex items-center justify-center h-40 text-sm text-[#A4A4A4]">
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
