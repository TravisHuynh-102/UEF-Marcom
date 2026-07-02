export type UserRole = 'Manager' | 'Leader' | 'Staff';
export type ProjectStatus = 'Backlog' | 'Planned' | 'In Progress' | 'Review' | 'Blocked' | 'Completed';
export type TaskPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type InsightType = 'Risk' | 'Optimization' | 'Summary' | 'Kudos';
export type RiskLevel = 'Safe' | 'At Risk' | 'Blocked';
export type ApprovalStatus = 'Draft' | 'PendingReview' | 'ApprovedByLeader' | 'Approved' | 'Rejected' | 'Scheduled' | 'Published';
export type ContentType = 'Video' | 'Article' | 'SocialPost' | 'Livestream';
export type Platform = 'Facebook' | 'TikTok' | 'YouTube' | 'Instagram' | 'Website';
export type WorkTripType = 'BusinessTrip' | 'WFH' | 'Leave' | 'Training';
export type CreativeTaskType = 'Design' | 'VideoEdit';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  department: string;
  capacity: number;
  teamId?: string; // Which team/group they belong to
}

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  progress: number;
  risk: RiskLevel;
  lead: User;
  members: User[];
  dueDate: string;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  assignee: User;
  priority: TaskPriority;
  dueDate: string;
  completed: boolean;
  description: string;
}

export interface AIInsight {
  id: string;
  type: InsightType;
  title: string;
  description: string;
  timestamp: string;
  relatedProject?: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  actionRequired: boolean;
}

export interface TeamMetrics {
  healthScore: number;
  healthTrend: 'up' | 'down' | 'stable';
  activeProjects: number;
  overdueTasks: number;
  productivityTrend: number[];
}

// ─── Content Calendar Types ─────────────────────────────────────────────────
export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  platform: Platform;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  status: ApprovalStatus;
  assignee: User;
  approvedBy?: User;
  description: string;
  projectId?: string;
  projectName?: string;
  series?: string;
}

// ─── Work Calendar Types ────────────────────────────────────────────────────
export interface WorkTrip {
  id: string;
  employee: User;
  type: WorkTripType;
  startDate: string;
  endDate: string;
  location: string;
  purpose: string;
  status: 'Pending' | 'ApprovedByLeader' | 'Approved' | 'Rejected';
  approvedBy?: User;
  notes?: string;
}

// ─── Creative Performance Types ─────────────────────────────────────────────
export interface CreativeTask {
  id: string;
  title: string;
  type: CreativeTaskType;
  assignee: User;
  requestedBy: User;
  projectId: string;
  projectName: string;
  receivedDate: string;
  deliveredDate?: string;
  dueDate: string;
  revisions: number;
  qualityScore?: number; // 1-5
  turnaroundDays?: number;
  status: 'Pending' | 'InProgress' | 'Review' | 'Completed' | 'Revision';
  videoLength?: string; // e.g., "2:30" — for video type
  videoType?: 'Reels' | 'LongForm' | 'LivestreamReplay'; // for video type
}

// ─── Knowledge Base Types ───────────────────────────────────────────────────
export interface Document {
  id: string;
  emoji: string;
  title: string;
  type: string;
  typeColor: string;
  category: string;
  author: string;
  authorInitials: string;
  authorGradient: string;
  updated: string;
  views: number;
}

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  userInitials: string;
  userGradient: string;
}
