import { UserRole } from '@/types';

// ─── Permission Definitions ────────────────────────────────────────────────
export type Permission =
  // Projects
  | 'project.create' | 'project.edit' | 'project.delete' | 'project.assign_lead'
  | 'project.view_all' | 'project.view_own'
  // Content Calendar (UPDATED)
  | 'content.create_calendar' | 'content.submit_idea' | 'content.edit_all' | 'content.edit_own'
  | 'content.approve' | 'content.schedule' | 'content.view_all' | 'content.view_team'
  // Work Calendar
  | 'work_calendar.create_for_team' | 'work_calendar.approve' | 'work_calendar.view_all'
  | 'work_calendar.request' | 'work_calendar.view_team'
  // Performance
  | 'performance.view_all' | 'performance.view_team' | 'performance.view_self'
  | 'performance.export' | 'performance.rate_quality'
  // Settings
  | 'settings.team' | 'settings.billing' | 'settings.integrations'
  | 'settings.appearance' | 'settings.profile' | 'settings.notifications'
  // Knowledge Hub
  | 'knowledge.create' | 'knowledge.edit_all' | 'knowledge.edit_own' | 'knowledge.delete'
  // Chat
  | 'chat.manage_channels'
  // AI
  | 'ai.full_access' | 'ai.team_insights' | 'ai.personal_insights';

// ─── Role → Permission Mapping ─────────────────────────────────────────────
const MANAGER_PERMISSIONS: Permission[] = [
  'project.create', 'project.edit', 'project.delete', 'project.assign_lead', 'project.view_all', 'project.view_own',
  'content.create_calendar', 'content.submit_idea', 'content.edit_all', 'content.approve', 'content.view_all', 'content.schedule',
  'work_calendar.create_for_team', 'work_calendar.approve', 'work_calendar.view_all', 'work_calendar.request', 'work_calendar.view_team',
  'performance.view_all', 'performance.view_team', 'performance.view_self', 'performance.export', 'performance.rate_quality',
  'settings.team', 'settings.billing', 'settings.integrations', 'settings.appearance', 'settings.profile', 'settings.notifications',
  'knowledge.create', 'knowledge.edit_all', 'knowledge.edit_own', 'knowledge.delete',
  'chat.manage_channels',
  'ai.full_access', 'ai.team_insights', 'ai.personal_insights',
];

const LEADER_PERMISSIONS: Permission[] = [
  'project.edit', 'project.view_all', 'project.view_own',
  'content.create_calendar', 'content.submit_idea', 'content.edit_all', 'content.approve', 'content.view_team', 'content.schedule',
  'work_calendar.create_for_team', 'work_calendar.view_team', 'work_calendar.request',
  'performance.view_team', 'performance.view_self', 'performance.rate_quality',
  'settings.appearance', 'settings.profile', 'settings.notifications',
  'knowledge.create', 'knowledge.edit_own',
  'ai.team_insights', 'ai.personal_insights',
];

const STAFF_PERMISSIONS: Permission[] = [
  'project.view_own',
  'content.submit_idea', 'content.edit_own', 'content.view_team',
  'work_calendar.request',
  'performance.view_self',
  'settings.profile', 'settings.notifications',
  'knowledge.edit_own',
  'ai.personal_insights',
];

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  Manager: MANAGER_PERMISSIONS,
  Leader: LEADER_PERMISSIONS,
  Staff: STAFF_PERMISSIONS,
};

// ─── Permission Check Utility ───────────────────────────────────────────────
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function getPermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] ?? [];
}

// ─── Settings Tab Visibility ────────────────────────────────────────────────
export type SettingsTab = 'profile' | 'team' | 'notifications' | 'integrations' | 'appearance' | 'security' | 'billing';

const SETTINGS_TABS_BY_ROLE: Record<UserRole, SettingsTab[]> = {
  Manager: ['profile', 'team', 'notifications', 'integrations', 'appearance', 'security', 'billing'],
  Leader: ['profile', 'notifications', 'appearance'],
  Staff: ['profile', 'notifications'],
};

export function getSettingsTabs(role: UserRole): SettingsTab[] {
  return SETTINGS_TABS_BY_ROLE[role];
}

// ─── Sidebar Visibility ────────────────────────────────────────────────────
export function canAccessRoute(role: UserRole, route: string): boolean {
  // Team Performance is only for Manager & Leader
  if (route === '/performance' && role === 'Staff') return false;
  // All other routes are accessible to all roles (with different scopes)
  return true;
}
