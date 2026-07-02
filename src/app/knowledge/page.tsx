'use client';
/* eslint-disable */

import { useState, useMemo, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';
import { useAppState } from '@/context/app-state-context';
import { useToast } from '@/components/ui/toast';
import { useRole } from '@/context/role-context';
import CreateDocumentModal from '@/components/modals/create-document-modal';
import { ConfirmDeleteModal } from '@/components/modals/modal-wrapper';
import { PageHeader } from '@/components/ui/page-header';
import {
  BookOpen,
  Search,
  Plus,
  Grid,
  List,
  Eye,
  Bookmark,
  BookMarked,
  Clock,
  MoreHorizontal,
  FileText,
  ChevronRight,
  Star,
  Filter,
  Trash2,
} from 'lucide-react';

/* ─── Static Data ─────────────────────────────────────────── */

const categories = ['All', 'Engineering', 'Design', 'Marketing', 'Company', 'Onboarding'];

/* ─── Main Component ──────────────────────────────────────── */

export default function KnowledgePage() {
  const { documents, activities, deleteDocument } = useAppState();
  const { currentRole } = useRole();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set(['d4', 'd2']));
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [docToDelete, setDocToDelete] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    deleteDocument(id);
    setDocToDelete(null);
    addToast({
      title: 'Document Deleted',
      message: 'The document has been removed from the knowledge base.',
      type: 'success'
    });
  };

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchesCategory = activeCategory === 'All' || doc.category === activeCategory;
      const matchesSearch =
        !searchQuery ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.author.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="space-y-6 pb-8 px-10">
      {/* ── Header ───────────────────────────────────────── */}
      <PageHeader 
        title="Knowledge Hub" 
        subtitle="Everything your team needs to move fast" 
        actions={
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-apple-subtle)]" />
              <input
                type="text"
                placeholder="Search documents…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 rounded-full border border-black/[0.08] bg-white text-[13px] text-[var(--color-apple-text)] placeholder:text-[var(--color-apple-subtle)] outline-none focus:ring-2 focus:ring-[var(--color-apple-blue)]/20 w-52 transition-shadow"
              />
            </div>
            <div className="flex items-center bg-black/[0.05] rounded-[10px] p-0.5 mx-2">
              <button
                onClick={() => setViewMode('grid')}
                className={cn('p-1.5 rounded-[8px] transition-colors', viewMode === 'grid' ? 'bg-white shadow-sm text-[var(--color-apple-text)]' : 'text-[var(--color-apple-subtle)] hover:text-[var(--color-apple-text)]')}
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn('p-1.5 rounded-[8px] transition-colors', viewMode === 'list' ? 'bg-white shadow-sm text-[var(--color-apple-text)]' : 'text-[var(--color-apple-subtle)] hover:text-[var(--color-apple-text)]')}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-[var(--color-apple-blue)] text-white px-4 py-1.5 rounded-full text-[13px] font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              New Document
            </button>
          </>
        }
      />

      {/* ── Categories Bar ───────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all',
              activeCategory === cat
                ? 'bg-[var(--color-apple-blue)] text-white shadow-sm'
                : 'bg-black/[0.05] text-[var(--color-apple-subtle)] hover:bg-black/[0.08] dark:bg-white/[0.05] dark:hover:bg-white/[0.08]'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── Documents ────────────────────────────────────── */}
      {filteredDocs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <FileText className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-sm text-[var(--color-apple-subtle)]">No documents found</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* ── Grid View ───────────────────────────────────── */
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className={cn(
                'group relative apple-card p-5 transition-all duration-200 cursor-pointer',
                'hover:shadow-md hover:-translate-y-0.5'
              )}
            >
              {/* Top row: emoji + actions */}
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl leading-none">{doc.emoji}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleBookmark(doc.id);
                    }}
                    className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                  >
                    {bookmarked.has(doc.id) ? (
                      <BookMarked className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Bookmark className="w-4 h-4 text-[var(--color-apple-subtle)]" />
                    )}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === doc.id ? null : doc.id); }}
                    className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                  >
                    <MoreHorizontal className="w-4 h-4 text-[var(--color-apple-subtle)]" />
                  </button>
                  {menuOpenId === doc.id && currentRole === 'Manager' && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setMenuOpenId(null); }} />
                      <div className="absolute right-0 top-full mt-1 w-32 rounded-lg border border-gray-100 dark:border-white/10 bg-white dark:bg-[#1a1a28] shadow-lg z-20 py-1">
                        <button
                          onClick={(e) => { e.stopPropagation(); setMenuOpenId(null); setDocToDelete(doc.id); }}
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-sm font-semibold text-[var(--color-apple-text)] mb-2 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {doc.title}
              </h3>

              {/* Type badge */}
              <span
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium mb-3',
                  doc.typeColor
                )}
              >
                {doc.type}
              </span>

              {/* Author */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className={cn(
                    'flex items-center justify-center w-6 h-6 rounded-full text-white text-[11.5px] font-semibold bg-gradient-to-br',
                    doc.authorGradient
                  )}
                >
                  {doc.authorInitials}
                </div>
                <span className="text-xs text-[var(--color-apple-subtle)] truncate">
                  {doc.author}
                </span>
              </div>

              {/* Footer: updated + views */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/5">
                <span className="text-xs text-[var(--color-apple-subtle)]">{doc.updated}</span>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3 text-[var(--color-apple-subtle)]" />
                  <span className="text-xs text-[var(--color-apple-subtle)]">{doc.views}</span>
                </div>
              </div>

              {/* Bookmark indicator (always visible when bookmarked) */}
              {bookmarked.has(doc.id) && (
                <div className="absolute top-0 right-4">
                  <div className="w-5 h-7 bg-gradient-to-b from-amber-400 to-amber-500 rounded-b-sm shadow-sm" />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* ── List View ───────────────────────────────────── */
        <div
          className={cn(
            'apple-card overflow-hidden'
          )}
        >
          {/* List header */}
          <div className="grid grid-cols-[1fr_100px_140px_80px_80px_40px] items-center gap-4 px-5 py-3 border-b border-black/[0.06] dark:border-white/[0.06]">
            <span className="text-xs font-medium text-[var(--color-apple-subtle)] uppercase tracking-wider">
              Document
            </span>
            <span className="text-xs font-medium text-[var(--color-apple-subtle)] uppercase tracking-wider">
              Type
            </span>
            <span className="text-xs font-medium text-[var(--color-apple-subtle)] uppercase tracking-wider">
              Author
            </span>
            <span className="text-xs font-medium text-[var(--color-apple-subtle)] uppercase tracking-wider">
              Updated
            </span>
            <span className="text-xs font-medium text-[var(--color-apple-subtle)] uppercase tracking-wider text-right">
              Views
            </span>
            <span />
          </div>
          {filteredDocs.map((doc, idx) => (
            <div
              key={doc.id}
              className={cn(
                'group grid grid-cols-[1fr_100px_140px_80px_80px_40px] items-center gap-4 px-5 py-3.5 transition-colors cursor-pointer',
                'hover:bg-black/[0.02] dark:hover:bg-white/[0.02]',
                idx < filteredDocs.length - 1 && 'border-b border-black/[0.06] dark:border-white/[0.06]'
              )}
            >
              {/* Document name */}
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-lg flex-shrink-0">{doc.emoji}</span>
                <span className="text-sm font-medium text-[var(--color-apple-text)] truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {doc.title}
                </span>
                {bookmarked.has(doc.id) && (
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />
                )}
              </div>
              {/* Type */}
              <span
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium w-fit',
                  doc.typeColor
                )}
              >
                {doc.type}
              </span>
              {/* Author */}
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={cn(
                    'flex items-center justify-center w-5 h-5 rounded-full text-white text-[10.5px] font-semibold bg-gradient-to-br flex-shrink-0',
                    doc.authorGradient
                  )}
                >
                  {doc.authorInitials}
                </div>
                <span className="text-xs text-[var(--color-apple-subtle)] truncate">
                  {doc.author}
                </span>
              </div>
              {/* Updated */}
              <span className="text-xs text-[var(--color-apple-subtle)] truncate">
                {doc.updated.replace('Updated ', '')}
              </span>
              {/* Views */}
              <div className="flex items-center gap-1 justify-end">
                <Eye className="w-3 h-3 text-[var(--color-apple-subtle)]" />
                <span className="text-xs text-[var(--color-apple-subtle)]">{doc.views}</span>
              </div>
              {/* Actions */}
              <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(doc.id);
                  }}
                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  {bookmarked.has(doc.id) ? (
                    <BookMarked className="w-3.5 h-3.5 text-amber-500" />
                  ) : (
                    <Bookmark className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === doc.id ? null : doc.id); }}
                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  <MoreHorizontal className="w-3.5 h-3.5 text-gray-400" />
                </button>
                {menuOpenId === doc.id && currentRole === 'Manager' && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setMenuOpenId(null); }} />
                    <div className="absolute right-0 top-full mt-1 w-32 rounded-lg border border-gray-100 dark:border-white/10 bg-white dark:bg-[#1a1a28] shadow-lg z-20 py-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); setMenuOpenId(null); setDocToDelete(doc.id); }}
                        className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Recent Activity Section ──────────────────────── */}
      <div
        className={cn(
          'apple-card p-6'
        )}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-500" />
            <h3 className="text-base font-semibold text-[var(--color-apple-text)]">
              Recent Activity
            </h3>
          </div>
          <button className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[15px] top-3 bottom-3 w-px bg-gray-100 dark:bg-white/5" />

          <div className="space-y-0">
            {activities.map((activity, idx) => (
              <div
                key={activity.id}
                className={cn(
                  'relative flex items-start gap-4 py-3 pl-0 group transition-colors rounded-lg',
                )}
              >
                {/* Timeline dot with avatar */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={cn(
                      'flex items-center justify-center w-8 h-8 rounded-full text-white text-[11.5px] font-semibold bg-gradient-to-br ring-4 ring-white dark:ring-[#12121a]',
                      activity.userGradient
                    )}
                  >
                    {activity.userInitials}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-sm text-[var(--color-apple-text)]">
                    <span className="font-semibold text-[var(--color-apple-text)]">
                      {activity.user}
                    </span>{' '}
                    <span className={cn(
                      'inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium mx-0.5',
                      activity.action === 'created'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                        : 'bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                    )}>
                      {activity.action}
                    </span>{' '}
                    <span className="font-medium text-[var(--color-apple-text)]">
                      {activity.target}
                    </span>
                  </p>
                </div>

                {/* Time */}
                <span className="flex-shrink-0 text-xs text-[var(--color-apple-subtle)] pt-1.5">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <CreateDocumentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <ConfirmDeleteModal
        isOpen={!!docToDelete}
        onClose={() => setDocToDelete(null)}
        onConfirm={() => docToDelete && handleDelete(docToDelete)}
        title="Delete Document"
        message="Are you sure you want to delete this document? This action cannot be undone."
      />
    </div>
  );
}
