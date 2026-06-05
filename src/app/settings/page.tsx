'use client';

import { useState } from 'react';
import { cn, getInitials } from '@/lib/utils';
import { mockUsers } from '@/lib/mock-data';
import { useTheme } from '@/context/theme-context';
import {
  User,
  Users,
  Bell,
  Puzzle,
  Palette,
  Shield,
  CreditCard,
  Camera,
  Mail,
  Phone,
  Globe,
  Edit,
  Trash2,
  Plus,
  Check,
  X,
  Monitor,
  Moon,
  Sun,
  Lock,
  Smartphone,
  Globe2,
  Key,
  ExternalLink,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
type TabId =
  | 'profile'
  | 'team'
  | 'notifications'
  | 'integrations'
  | 'appearance'
  | 'security'
  | 'billing';

interface TabDef {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

const tabs: TabDef[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'integrations', label: 'Integrations', icon: Puzzle },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

// ─── Reusable toggle switch ──────────────────────────────────────────────────
function ToggleSwitch({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
        enabled
          ? 'bg-gradient-to-r from-indigo-500 to-violet-500'
          : 'bg-[var(--bg-tertiary)]'
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
          enabled ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </button>
  );
}

// ─── Section wrapper ─────────────────────────────────────────────────────────
function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-xl border p-6"
      style={{
        background: 'var(--card-bg)',
        borderColor: 'var(--card-border)',
      }}
    >
      <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h3>
      {description && (
        <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
          {description}
        </p>
      )}
      <div className="mt-5">{children}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PROFILE TAB
// ═══════════════════════════════════════════════════════════════════════════════
function ProfileTab() {
  const fields = [
    { label: 'Full Name', value: 'Sarah Chen', icon: User },
    { label: 'Email', value: 'sarah@teamos.ai', icon: Mail },
    { label: 'Role', value: 'Owner / CEO', icon: Shield },
    { label: 'Department', value: 'Executive', icon: Users },
    { label: 'Phone', value: '+1 (555) 123-4567', icon: Phone },
    { label: 'Timezone', value: 'Pacific Time (UTC-8)', icon: Globe },
  ];

  return (
    <div className="space-y-6">
      {/* Photo + Header */}
      <Section title="Profile Information" description="Manage your personal details and preferences.">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-3xl font-bold text-white shadow-lg shadow-indigo-500/25">
              SC
            </div>
            <button
              className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md transition-transform hover:scale-110"
              style={{ borderColor: 'var(--card-bg)' }}
            >
              <Camera size={14} />
            </button>
          </div>
          <div>
            <h4 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Sarah Chen
            </h4>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Owner / CEO · Executive
            </p>
            <button className="mt-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-1.5 text-xs font-medium text-white shadow-md shadow-indigo-500/20 transition hover:shadow-lg hover:shadow-indigo-500/30">
              Change Photo
            </button>
          </div>
        </div>
      </Section>

      {/* Form fields */}
      <Section title="Personal Details">
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.label}
                className="group flex items-center gap-3 rounded-lg border p-4 transition-colors"
                style={{
                  borderColor: 'var(--card-border)',
                  background: 'var(--bg-tertiary)',
                }}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    {f.label}
                  </p>
                  <p className="truncate text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {f.value}
                  </p>
                </div>
                <button className="opacity-0 transition-opacity group-hover:opacity-100">
                  <Edit size={14} style={{ color: 'var(--text-muted)' }} />
                </button>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Bio */}
      <Section title="Bio">
        <div
          className="rounded-lg border p-4 text-sm leading-relaxed"
          style={{
            borderColor: 'var(--card-border)',
            background: 'var(--bg-tertiary)',
            color: 'var(--text-secondary)',
          }}
        >
          Leading product strategy and team operations at TeamOS.
        </div>
      </Section>

      {/* Action buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:shadow-lg hover:shadow-indigo-500/30">
          Save Changes
        </button>
        <button
          className="rounded-xl border px-6 py-2.5 text-sm font-semibold transition-colors hover:opacity-80"
          style={{
            borderColor: 'var(--card-border)',
            color: 'var(--text-secondary)',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TEAM TAB
// ═══════════════════════════════════════════════════════════════════════════════
function TeamTab() {
  const roleBadgeStyles: Record<string, string> = {
    Owner: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
    Manager: 'bg-blue-500/15 text-blue-400 border-blue-500/25',
    Lead: 'bg-teal-500/15 text-teal-400 border-teal-500/25',
    Member: 'bg-gray-500/15 text-gray-400 border-gray-500/25',
  };

  return (
    <div className="space-y-6">
      <Section
        title="Team Members"
        description={`${mockUsers.length} members across your organization.`}
      >
        {/* Invite button */}
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Manage roles, permissions, and team access.
          </p>
          <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:shadow-lg hover:shadow-indigo-500/30">
            <Plus size={16} />
            Invite Member
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--card-border)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--bg-tertiary)' }}>
                {['Member', 'Email', 'Role', 'Department', 'Status', 'Actions'].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--card-border)' }}>
              {mockUsers.map((u, idx) => (
                <tr
                  key={u.id}
                  className="transition-colors"
                  style={{
                    borderColor: 'var(--card-border)',
                    background: idx % 2 === 0 ? 'transparent' : 'var(--bg-tertiary)',
                  }}
                >
                  {/* Avatar + Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-bold text-white">
                        {getInitials(u.name)}
                      </div>
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {u.name}
                      </span>
                    </div>
                  </td>
                  {/* Email */}
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>
                    {u.email}
                  </td>
                  {/* Role */}
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium',
                        roleBadgeStyles[u.role]
                      )}
                    >
                      {u.role}
                    </span>
                  </td>
                  {/* Department */}
                  <td className="px-4 py-3" style={{ color: 'var(--text-secondary)' }}>
                    {u.department}
                  </td>
                  {/* Status */}
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                      <span
                        className={cn(
                          'h-2 w-2 rounded-full',
                          idx < 7 ? 'bg-emerald-400' : 'bg-amber-400'
                        )}
                      />
                      <span style={{ color: 'var(--text-secondary)' }}>
                        {idx < 7 ? 'Active' : 'Invited'}
                      </span>
                    </span>
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="rounded-lg p-1.5 transition-colors hover:bg-indigo-500/10">
                        <Edit size={14} className="text-indigo-400" />
                      </button>
                      <button className="rounded-lg p-1.5 transition-colors hover:bg-rose-500/10">
                        <Trash2 size={14} className="text-rose-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// NOTIFICATIONS TAB
// ═══════════════════════════════════════════════════════════════════════════════
function NotificationsTab() {
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    'AI Insights & Recommendations': true,
    'Task Assignments': true,
    'Project Updates': true,
    'Team Messages': true,
    'Weekly Reports': false,
    'Meeting Reminders': true,
    'Deadline Alerts': true,
    'Performance Updates': false,
  });

  const descriptions: Record<string, string> = {
    'AI Insights & Recommendations':
      'Get notified when AI detects risks, opportunities, or team patterns.',
    'Task Assignments': 'Receive alerts when tasks are assigned to you or your team.',
    'Project Updates': 'Stay informed about milestones, status changes, and blockers.',
    'Team Messages': 'Notifications for direct messages and team channel activity.',
    'Weekly Reports': 'Receive a weekly digest of team performance and metrics.',
    'Meeting Reminders': 'Get reminded 15 minutes before scheduled meetings.',
    'Deadline Alerts': 'Alerts for upcoming and overdue deadlines across projects.',
    'Performance Updates': 'Monthly performance summaries and capacity insights.',
  };

  type Channel = 'email' | 'push' | 'inApp';
  const [channels, setChannels] = useState<Record<Channel, boolean>>({
    email: true,
    push: true,
    inApp: true,
  });

  return (
    <div className="space-y-6">
      {/* Delivery channels */}
      <Section title="Delivery Channels" description="Choose how you receive notifications.">
        <div className="flex flex-wrap gap-4">
          {(
            [
              { key: 'email' as Channel, label: 'Email', icon: Mail },
              { key: 'push' as Channel, label: 'Push', icon: Smartphone },
              { key: 'inApp' as Channel, label: 'In-App', icon: Bell },
            ] as const
          ).map((ch) => {
            const Icon = ch.icon;
            return (
              <button
                key={ch.key}
                onClick={() =>
                  setChannels((prev) => ({ ...prev, [ch.key]: !prev[ch.key] }))
                }
                className={cn(
                  'flex items-center gap-2 rounded-xl border px-5 py-3 text-sm font-medium transition-all',
                  channels[ch.key]
                    ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400'
                    : 'hover:border-[var(--card-hover)]'
                )}
                style={{
                  borderColor: channels[ch.key] ? undefined : 'var(--card-border)',
                  color: channels[ch.key] ? undefined : 'var(--text-secondary)',
                }}
              >
                <Icon size={16} />
                {ch.label}
                {channels[ch.key] && <Check size={14} className="text-indigo-400" />}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Notification categories */}
      <Section title="Notification Preferences" description="Toggle individual notification types on or off.">
        <div className="divide-y" style={{ borderColor: 'var(--card-border)' }}>
          {Object.entries(notifications).map(([name, enabled]) => (
            <div key={name} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
              <div className="pr-4">
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {name}
                </p>
                <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                  {descriptions[name]}
                </p>
              </div>
              <ToggleSwitch
                enabled={enabled}
                onChange={(v) => setNotifications((prev) => ({ ...prev, [name]: v }))}
              />
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// INTEGRATIONS TAB
// ═══════════════════════════════════════════════════════════════════════════════
function IntegrationsTab() {
  const integrations = [
    { name: 'Slack', color: '#E01E5A', connected: true, desc: 'Team messaging and channel notifications.' },
    { name: 'GitHub', color: '#6e40c9', connected: true, desc: 'Code repos, PRs, and CI/CD pipeline.' },
    { name: 'Jira', color: '#0052CC', connected: false, desc: 'Issue tracking and agile boards.' },
    { name: 'Google Calendar', color: '#34A853', connected: true, desc: 'Meeting scheduling and availability.' },
    { name: 'Figma', color: '#A259FF', connected: false, desc: 'Design files, prototypes, and handoff.' },
    { name: 'Notion', color: '#999', connected: true, desc: 'Wiki, docs, and knowledge base.' },
    { name: 'Linear', color: '#5E6AD2', connected: false, desc: 'Issue tracking and project management.' },
    { name: 'Zoom', color: '#2D8CFF', connected: true, desc: 'Video meetings and webinars.' },
  ];

  const [connected, setConnected] = useState<Record<string, boolean>>(
    Object.fromEntries(integrations.map((i) => [i.name, i.connected]))
  );

  return (
    <div className="space-y-6">
      <Section title="Connected Apps" description="Manage your third-party integrations and API connections.">
        <div className="grid gap-4 sm:grid-cols-2">
          {integrations.map((ig) => (
            <div
              key={ig.name}
              className="group flex flex-col rounded-xl border p-5 transition-colors"
              style={{
                borderColor: 'var(--card-border)',
                background: 'var(--bg-tertiary)',
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {/* Logo circle */}
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white"
                    style={{ backgroundColor: ig.color }}
                  >
                    {ig.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {ig.name}
                    </p>
                    {connected[ig.name] && (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Connected
                      </span>
                    )}
                  </div>
                </div>
                <ExternalLink
                  size={14}
                  className="mt-1 opacity-0 transition-opacity group-hover:opacity-60"
                  style={{ color: 'var(--text-muted)' }}
                />
              </div>
              <p className="mt-3 flex-1 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {ig.desc}
              </p>
              <button
                onClick={() =>
                  setConnected((prev) => ({ ...prev, [ig.name]: !prev[ig.name] }))
                }
                className={cn(
                  'mt-4 w-full rounded-lg py-2 text-xs font-semibold transition-all',
                  connected[ig.name]
                    ? 'border text-rose-400 hover:bg-rose-500/10'
                    : 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-sm shadow-indigo-500/20 hover:shadow-md hover:shadow-indigo-500/30'
                )}
                style={
                  connected[ig.name]
                    ? { borderColor: 'var(--card-border)' }
                    : undefined
                }
              >
                {connected[ig.name] ? 'Disconnect' : 'Connect'}
              </button>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// APPEARANCE TAB
// ═══════════════════════════════════════════════════════════════════════════════
function AppearanceTab() {
  const { theme, setTheme } = useTheme();
  const [accent, setAccent] = useState('Indigo');
  const [sidebar, setSidebar] = useState<'expanded' | 'collapsed'>('expanded');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  const themeModes = [
    { id: 'light' as const, label: 'Light', icon: Sun, preview: 'bg-white border-gray-200' },
    { id: 'dark' as const, label: 'Dark', icon: Moon, preview: 'bg-gray-900 border-gray-700' },
    { id: 'system' as const, label: 'System', icon: Monitor, preview: 'bg-gradient-to-r from-white to-gray-900 border-gray-400' },
  ];

  const accentColors = [
    { name: 'Indigo', color: '#6366f1' },
    { name: 'Violet', color: '#8b5cf6' },
    { name: 'Rose', color: '#f43f5e' },
    { name: 'Amber', color: '#f59e0b' },
    { name: 'Emerald', color: '#10b981' },
    { name: 'Sky', color: '#0ea5e9' },
  ];

  return (
    <div className="space-y-6">
      {/* Theme Mode */}
      <Section title="Theme" description="Choose your preferred appearance.">
        <div className="grid grid-cols-3 gap-4">
          {themeModes.map((m) => {
            const Icon = m.icon;
            const isActive =
              m.id === 'system'
                ? false
                : theme === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setTheme(m.id as any)}
                className={cn(
                  'flex flex-col items-center gap-3 rounded-xl border p-5 transition-all',
                  isActive
                    ? 'border-indigo-500/50 bg-indigo-500/10 ring-1 ring-indigo-500/30'
                    : 'hover:border-[var(--card-hover)]'
                )}
                style={{
                  borderColor: isActive ? undefined : 'var(--card-border)',
                }}
              >
                <div className={cn('h-16 w-full rounded-lg border', m.preview)} />
                <div className="flex items-center gap-2">
                  <Icon size={14} className={isActive ? 'text-indigo-400' : ''} style={isActive ? undefined : { color: 'var(--text-muted)' }} />
                  <span
                    className="text-sm font-medium"
                    style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}
                  >
                    {m.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </Section>

      {/* Accent Color */}
      <Section title="Accent Color" description="Personalize the accent color across the app.">
        <div className="flex flex-wrap gap-4">
          {accentColors.map((c) => (
            <button
              key={c.name}
              onClick={() => setAccent(c.name)}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border p-4 transition-all',
                accent === c.name
                  ? 'ring-1'
                  : 'hover:border-[var(--card-hover)]'
              )}
              style={{
                borderColor:
                  accent === c.name ? c.color + '80' : 'var(--card-border)',
                background: accent === c.name ? c.color + '15' : undefined,
                ...(accent === c.name ? { ringColor: c.color + '50' } : {}),
              }}
            >
              <div
                className={cn(
                  'h-8 w-8 rounded-full shadow-md transition-transform',
                  accent === c.name && 'scale-110 ring-2 ring-white/20'
                )}
                style={{ backgroundColor: c.color }}
              >
                {accent === c.name && (
                  <Check size={16} className="mx-auto mt-1.5 text-white" />
                )}
              </div>
              <span
                className="text-xs font-medium"
                style={{ color: accent === c.name ? c.color : 'var(--text-muted)' }}
              >
                {c.name}
              </span>
            </button>
          ))}
        </div>
      </Section>

      {/* Sidebar & Density & Font Size */}
      <Section title="Layout" description="Adjust layout density and sidebar behaviour.">
        <div className="space-y-5">
          {/* Sidebar */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Default Sidebar
            </p>
            <div className="flex gap-3">
              {(['expanded', 'collapsed'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSidebar(s)}
                  className={cn(
                    'rounded-lg border px-5 py-2 text-sm font-medium capitalize transition-all',
                    sidebar === s
                      ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400'
                      : ''
                  )}
                  style={{
                    borderColor: sidebar === s ? undefined : 'var(--card-border)',
                    color: sidebar === s ? undefined : 'var(--text-secondary)',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Density */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Density
            </p>
            <div className="flex gap-3">
              {(['comfortable', 'compact'] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDensity(d)}
                  className={cn(
                    'rounded-lg border px-5 py-2 text-sm font-medium capitalize transition-all',
                    density === d
                      ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400'
                      : ''
                  )}
                  style={{
                    borderColor: density === d ? undefined : 'var(--card-border)',
                    color: density === d ? undefined : 'var(--text-secondary)',
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Font Size */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              Font Size
            </p>
            <div className="flex gap-3">
              {(['small', 'medium', 'large'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFontSize(f)}
                  className={cn(
                    'rounded-lg border px-5 py-2 text-sm font-medium capitalize transition-all',
                    fontSize === f
                      ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400'
                      : ''
                  )}
                  style={{
                    borderColor: fontSize === f ? undefined : 'var(--card-border)',
                    color: fontSize === f ? undefined : 'var(--text-secondary)',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECURITY TAB
// ═══════════════════════════════════════════════════════════════════════════════
function SecurityTab() {
  const [twoFactor, setTwoFactor] = useState(false);

  const sessions = [
    { browser: 'Chrome', device: 'MacBook Pro', location: 'San Francisco, US', lastActive: 'Active now', icon: Globe2, current: true },
    { browser: 'Safari', device: 'iPhone 15 Pro', location: 'San Francisco, US', lastActive: '2 hours ago', icon: Smartphone, current: false },
    { browser: 'Firefox', device: 'Windows PC', location: 'New York, US', lastActive: '5 days ago', icon: Globe, current: false },
  ];

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Section title="Change Password" description="Update your password to keep your account secure.">
        <div className="max-w-md space-y-4">
          {['Current Password', 'New Password', 'Confirm New Password'].map((label) => (
            <div key={label}>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                {label}
              </label>
              <div className="relative">
                <Lock
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: 'var(--text-muted)' }}
                />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border py-2.5 pl-9 pr-4 text-sm outline-none transition-colors focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
                  style={{
                    borderColor: 'var(--card-border)',
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>
            </div>
          ))}
          <button className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:shadow-lg hover:shadow-indigo-500/30">
            Update Password
          </button>
        </div>
      </Section>

      {/* 2FA */}
      <Section title="Two-Factor Authentication" description="Add an extra layer of security to your account.">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <Key size={22} />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {twoFactor ? 'Two-Factor is enabled' : 'Two-Factor is disabled'}
              </p>
              <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                {twoFactor
                  ? 'Your account is protected with an authenticator app.'
                  : 'Protect your account with TOTP-based 2FA.'}
              </p>
            </div>
          </div>
          <ToggleSwitch enabled={twoFactor} onChange={setTwoFactor} />
        </div>

        {twoFactor && (
          <div className="mt-5 flex items-center gap-5 rounded-lg border p-4" style={{ borderColor: 'var(--card-border)', background: 'var(--bg-tertiary)' }}>
            {/* QR code placeholder */}
            <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-lg border-2 border-dashed" style={{ borderColor: 'var(--card-border)' }}>
              <div className="text-center">
                <Key size={24} style={{ color: 'var(--text-muted)' }} className="mx-auto" />
                <p className="mt-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>QR Code</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Scan with your authenticator app</p>
              <p className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                Use Google Authenticator, Authy, or 1Password to scan the QR code.
              </p>
              <div className="mt-3 flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-xs" style={{ borderColor: 'var(--card-border)', color: 'var(--text-secondary)' }}>
                XXXX-XXXX-XXXX-XXXX
              </div>
            </div>
          </div>
        )}
      </Section>

      {/* Active Sessions */}
      <Section title="Active Sessions" description="Manage devices that are currently signed in.">
        <div className="space-y-3">
          {sessions.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border p-4 transition-colors"
                style={{
                  borderColor: 'var(--card-border)',
                  background: 'var(--bg-tertiary)',
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {s.browser} · {s.device}
                      {s.current && (
                        <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          Current
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                      {s.location} · {s.lastActive}
                    </p>
                  </div>
                </div>
                {!s.current && (
                  <button
                    className="rounded-lg border px-3 py-1.5 text-xs font-medium text-rose-400 transition-colors hover:bg-rose-500/10"
                    style={{ borderColor: 'var(--card-border)' }}
                  >
                    Revoke
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BILLING TAB
// ═══════════════════════════════════════════════════════════════════════════════
function BillingTab() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      features: ['3 team members', '5 GB storage', 'Basic analytics', 'Email support'],
      current: false,
    },
    {
      name: 'Pro',
      price: '$29',
      features: ['10 team members', '100 GB storage', 'AI insights', 'Priority support', 'Custom integrations'],
      current: true,
    },
    {
      name: 'Enterprise',
      price: '$99',
      features: ['Unlimited members', '1 TB storage', 'Advanced AI', 'Dedicated support', 'SSO & SAML', 'Audit logs'],
      current: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Current Plan */}
      <Section title="Current Plan" description="You are on the Pro plan.">
        <div className="flex items-center justify-between rounded-xl border-2 border-indigo-500/30 bg-gradient-to-r from-indigo-500/5 to-violet-500/5 p-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-indigo-400">Pro Plan</span>
              <span className="rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-xs font-semibold text-indigo-400">
                Active
              </span>
            </div>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
              $29/month · 10 team members included
            </p>
          </div>
          <button className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:shadow-lg hover:shadow-indigo-500/30">
            Upgrade Plan
          </button>
        </div>
      </Section>

      {/* Usage */}
      <Section title="Usage" description="Current billing period usage overview.">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Members */}
          <div className="rounded-lg border p-4" style={{ borderColor: 'var(--card-border)', background: 'var(--bg-tertiary)' }}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Team Members
              </p>
              <span className="text-sm font-bold text-indigo-400">8 / 10</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full" style={{ background: 'var(--card-border)' }}>
              <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: '80%' }} />
            </div>
          </div>
          {/* Storage */}
          <div className="rounded-lg border p-4" style={{ borderColor: 'var(--card-border)', background: 'var(--bg-tertiary)' }}>
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Storage
              </p>
              <span className="text-sm font-bold text-violet-400">45 GB / 100 GB</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full" style={{ background: 'var(--card-border)' }}>
              <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" style={{ width: '45%' }} />
            </div>
          </div>
        </div>
      </Section>

      {/* Plan Comparison */}
      <Section title="Compare Plans">
        <div className="grid gap-4 sm:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={cn(
                'flex flex-col rounded-xl border p-5 transition-all',
                p.current
                  ? 'border-indigo-500/40 bg-indigo-500/5 ring-1 ring-indigo-500/20'
                  : ''
              )}
              style={{
                borderColor: p.current ? undefined : 'var(--card-border)',
                background: p.current ? undefined : 'var(--bg-tertiary)',
              }}
            >
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {p.name}
              </p>
              <p className="mt-1">
                <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {p.price}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  /month
                </span>
              </p>
              <ul className="mt-4 flex-1 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <Check size={12} className="shrink-0 text-emerald-400" />
                    {f}
                  </li>
                ))}
              </ul>
              {p.current ? (
                <div className="mt-4 rounded-lg border py-2 text-center text-xs font-semibold text-indigo-400" style={{ borderColor: 'var(--card-border)' }}>
                  Current Plan
                </div>
              ) : (
                <button
                  className="mt-4 rounded-lg border py-2 text-xs font-semibold transition-colors hover:bg-indigo-500/10 hover:text-indigo-400"
                  style={{ borderColor: 'var(--card-border)', color: 'var(--text-secondary)' }}
                >
                  {p.name === 'Free' ? 'Downgrade' : 'Upgrade'}
                </button>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Payment Method */}
      <Section title="Payment Method" description="Manage your billing and payment details.">
        <div className="flex items-center justify-between rounded-lg border p-4" style={{ borderColor: 'var(--card-border)', background: 'var(--bg-tertiary)' }}>
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <CreditCard size={18} />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                Visa ending in 4242
              </p>
              <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                Next billing date: June 15, 2026
              </p>
            </div>
          </div>
          <button
            className="rounded-lg border px-4 py-2 text-xs font-semibold transition-colors hover:bg-indigo-500/10 hover:text-indigo-400"
            style={{ borderColor: 'var(--card-border)', color: 'var(--text-secondary)' }}
          >
            Update
          </button>
        </div>
      </Section>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SETTINGS PAGE (default export)
// ═══════════════════════════════════════════════════════════════════════════════
export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('profile');

  const renderTab = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTab />;
      case 'team':
        return <TeamTab />;
      case 'notifications':
        return <NotificationsTab />;
      case 'integrations':
        return <IntegrationsTab />;
      case 'appearance':
        return <AppearanceTab />;
      case 'security':
        return <SecurityTab />;
      case 'billing':
        return <BillingTab />;
    }
  };

  return (
    <div className="min-h-screen p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
          Settings
        </h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>
          Manage your account, team, and application preferences.
        </p>
      </div>

      {/* Layout: sidebar tabs + content */}
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Sidebar */}
        <nav
          className="shrink-0 rounded-xl border p-2 lg:w-56"
          style={{
            background: 'var(--card-bg)',
            borderColor: 'var(--card-border)',
          }}
        >
          <ul className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <li key={t.id}>
                  <button
                    onClick={() => setActiveTab(t.id)}
                    className={cn(
                      'flex w-full items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                      isActive
                        ? 'bg-gradient-to-r from-indigo-500/15 to-violet-500/10 text-indigo-400'
                        : 'hover:bg-[var(--bg-tertiary)]'
                    )}
                    style={{
                      color: isActive ? undefined : 'var(--text-secondary)',
                    }}
                  >
                    <Icon
                      size={18}
                      className={cn(
                        'shrink-0',
                        isActive ? 'text-indigo-400' : ''
                      )}
                      style={isActive ? undefined : { color: 'var(--text-muted)' }}
                    />
                    {t.label}
                    {isActive && (
                      <span className="ml-auto hidden h-1.5 w-1.5 rounded-full bg-indigo-400 lg:block" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Content */}
        <div className="min-w-0 flex-1">{renderTab()}</div>
      </div>
    </div>
  );
}
