import { User, Project, Task, AIInsight, TeamMetrics, ContentItem, WorkTrip, CreativeTask, Document, ActivityItem } from '@/types';

// ─── Team Members ───────────────────────────────────────────────────────────
export const mockUsers: User[] = [
  { id: 'u1', name: 'Sarah Chen', email: 'sarah@teamos.ai', role: 'Manager', avatar: '', department: 'Executive', capacity: 72, teamId: 'all' },
  { id: 'u2', name: 'Marcus Rodriguez', email: 'marcus@teamos.ai', role: 'Leader', avatar: '', department: 'Engineering', capacity: 88, teamId: 'engineering' },
  { id: 'u3', name: 'Aisha Patel', email: 'aisha@teamos.ai', role: 'Leader', avatar: '', department: 'Design', capacity: 95, teamId: 'design' },
  { id: 'u4', name: 'James Okonkwo', email: 'james@teamos.ai', role: 'Staff', avatar: '', department: 'Engineering', capacity: 65, teamId: 'engineering' },
  { id: 'u5', name: 'Elena Vasquez', email: 'elena@teamos.ai', role: 'Leader', avatar: '', department: 'Marketing', capacity: 91, teamId: 'marketing' },
  { id: 'u6', name: 'David Kim', email: 'david@teamos.ai', role: 'Staff', avatar: '', department: 'Engineering', capacity: 78, teamId: 'engineering' },
  { id: 'u7', name: 'Priya Sharma', email: 'priya@teamos.ai', role: 'Staff', avatar: '', department: 'Design', capacity: 42, teamId: 'design' },
  { id: 'u8', name: 'Alex Thompson', email: 'alex@teamos.ai', role: 'Staff', avatar: '', department: 'Marketing', capacity: 85, teamId: 'marketing' },
  { id: 'u9', name: 'Minh Tran', email: 'minh@teamos.ai', role: 'Staff', avatar: '', department: 'Design', capacity: 90, teamId: 'design' },
  { id: 'u10', name: 'Linh Nguyen', email: 'linh@teamos.ai', role: 'Staff', avatar: '', department: 'Marketing', capacity: 68, teamId: 'marketing' },
];

// ─── Projects ───────────────────────────────────────────────────────────────
export const mockProjects: Project[] = [
  { id: 'p1', name: 'Global Pass', status: 'In Progress', progress: 62, risk: 'At Risk', lead: mockUsers[1], members: [mockUsers[1], mockUsers[3], mockUsers[5], mockUsers[2]], dueDate: '2026-07-15', description: 'International access pass platform — branding, content, and launch' },
  { id: 'p2', name: 'Livestream', status: 'In Progress', progress: 78, risk: 'Safe', lead: mockUsers[4], members: [mockUsers[4], mockUsers[7], mockUsers[9]], dueDate: '2026-06-30', description: 'Weekly livestream series — scripting, production, distribution' },
  { id: 'p3', name: 'Page Cư dân UEF', status: 'In Progress', progress: 45, risk: 'At Risk', lead: mockUsers[2], members: [mockUsers[2], mockUsers[6], mockUsers[8]], dueDate: '2026-08-01', description: 'UEF community page — content strategy and engagement' },
  { id: 'p4', name: 'Content Calendar System', status: 'Planned', progress: 20, risk: 'Safe', lead: mockUsers[4], members: [mockUsers[4], mockUsers[7]], dueDate: '2026-08-15', description: 'Internal content scheduling tool' },
  { id: 'p5', name: 'Brand Refresh Q3', status: 'Review', progress: 88, risk: 'Safe', lead: mockUsers[2], members: [mockUsers[2], mockUsers[6]], dueDate: '2026-06-20', description: 'Refreshed brand guidelines and visual identity' },
  { id: 'p6', name: 'Social Media Automation', status: 'Backlog', progress: 5, risk: 'Safe', lead: mockUsers[5], members: [mockUsers[5], mockUsers[3]], dueDate: '2026-09-01', description: 'Automated posting and analytics' },
];

// ─── Tasks ──────────────────────────────────────────────────────────────────
export const mockTasks: Task[] = [
  { id: 't1', title: 'Design Global Pass landing page', projectId: 'p1', projectName: 'Global Pass', assignee: mockUsers[2], priority: 'High', dueDate: '2026-06-05', completed: false, description: '' },
  { id: 't2', title: 'Edit livestream replay — Ep.12', projectId: 'p2', projectName: 'Livestream', assignee: mockUsers[8], priority: 'Critical', dueDate: '2026-06-04', completed: false, description: '' },
  { id: 't3', title: 'Write UEF community post — June', projectId: 'p3', projectName: 'Page Cư dân UEF', assignee: mockUsers[9], priority: 'Medium', dueDate: '2026-06-06', completed: false, description: '' },
  { id: 't4', title: 'Review Global Pass video script', projectId: 'p1', projectName: 'Global Pass', assignee: mockUsers[4], priority: 'High', dueDate: '2026-06-04', completed: true, description: '' },
  { id: 't5', title: 'Prepare livestream thumbnail set', projectId: 'p2', projectName: 'Livestream', assignee: mockUsers[6], priority: 'Medium', dueDate: '2026-06-07', completed: false, description: '' },
  { id: 't6', title: 'Create UEF infographic — campus', projectId: 'p3', projectName: 'Page Cư dân UEF', assignee: mockUsers[8], priority: 'High', dueDate: '2026-06-05', completed: false, description: '' },
  { id: 't7', title: 'Design social media template pack', projectId: 'p5', projectName: 'Brand Refresh Q3', assignee: mockUsers[6], priority: 'Low', dueDate: '2026-06-08', completed: false, description: '' },
  { id: 't8', title: 'Script livestream Ep.13', projectId: 'p2', projectName: 'Livestream', assignee: mockUsers[7], priority: 'High', dueDate: '2026-06-06', completed: false, description: '' },
  { id: 't9', title: 'Update brand guidelines doc', projectId: 'p5', projectName: 'Brand Refresh Q3', assignee: mockUsers[2], priority: 'Low', dueDate: '2026-06-09', completed: false, description: '' },
  { id: 't10', title: 'Global Pass promo video — final', projectId: 'p1', projectName: 'Global Pass', assignee: mockUsers[8], priority: 'Critical', dueDate: '2026-06-06', completed: false, description: '' },
];

// ─── AI Insights ────────────────────────────────────────────────────────────
export const mockInsights: AIInsight[] = [
  { id: 'i1', type: 'Risk', title: 'Global Pass behind schedule', description: 'Design team stretched across Global Pass and Page Cư dân UEF. Landing page missed 2 deadlines.', timestamp: '2026-06-04T08:00:00Z', relatedProject: 'Global Pass', severity: 'critical', actionRequired: true },
  { id: 'i2', type: 'Optimization', title: 'Video team nearing burnout', description: 'Minh Tran at 90% capacity with 5 video edits this week. Burnout risk increases 3x.', timestamp: '2026-06-04T07:30:00Z', severity: 'warning', actionRequired: true },
  { id: 'i3', type: 'Risk', title: 'Livestream Ep.12 replay overdue', description: 'Replay edit for Episode 12 is 2 days overdue. Blocks this week content calendar.', timestamp: '2026-06-04T07:00:00Z', relatedProject: 'Livestream', severity: 'critical', actionRequired: true },
  { id: 'i4', type: 'Kudos', title: 'Brand Refresh ahead of schedule', description: 'At 88% completion, 5 days ahead. Aisha and Priya exceptionally productive.', timestamp: '2026-06-04T06:00:00Z', relatedProject: 'Brand Refresh Q3', severity: 'success', actionRequired: false },
  { id: 'i5', type: 'Summary', title: 'Content performance — last 7 days', description: '8 posts across 3 platforms. Facebook reach +22%. TikTok engagement 4.8%.', timestamp: '2026-06-04T09:15:00Z', severity: 'info', actionRequired: false },
  { id: 'i6', type: 'Optimization', title: 'UEF page needs design support', description: '3 pending design tasks with no assignee. Priya has 58% free capacity.', timestamp: '2026-06-04T06:30:00Z', severity: 'warning', actionRequired: true },
];

export const mockMetrics: TeamMetrics = { healthScore: 87, healthTrend: 'up', activeProjects: 6, overdueTasks: 3, productivityTrend: [72, 75, 68, 80, 85, 82, 88, 87, 91, 89, 93, 87] };
export const workloadData = [
  { name: 'Engineering', capacity: 78, fill: '#6366f1' },
  { name: 'Design', capacity: 92, fill: '#f43f5e' },
  { name: 'Marketing', capacity: 88, fill: '#f59e0b' },
  { name: 'Executive', capacity: 72, fill: '#10b981' },
];
export const productivityData = [
  { week: 'W1', value: 72 }, { week: 'W2', value: 75 }, { week: 'W3', value: 68 }, { week: 'W4', value: 80 },
  { week: 'W5', value: 85 }, { week: 'W6', value: 82 }, { week: 'W7', value: 88 }, { week: 'W8', value: 87 },
  { week: 'W9', value: 91 }, { week: 'W10', value: 89 }, { week: 'W11', value: 93 }, { week: 'W12', value: 87 },
];

// ─── Content Calendar ───────────────────────────────────────────────────────
export const mockContentItems: ContentItem[] = [
  { id: 'c1', title: 'Global Pass — Launch Teaser', type: 'Video', platform: 'TikTok', scheduledDate: '2026-06-02', scheduledTime: '19:00', status: 'Published', assignee: mockUsers[8], approvedBy: mockUsers[0], description: '30s teaser', projectName: 'Global Pass', projectId: 'p1', series: 'Global Pass Launch' },
  { id: 'c2', title: 'UEF Campus Life Photos', type: 'SocialPost', platform: 'Facebook', scheduledDate: '2026-06-03', scheduledTime: '10:00', status: 'Published', assignee: mockUsers[9], approvedBy: mockUsers[4], description: 'Photo carousel', projectName: 'Page Cư dân UEF', projectId: 'p3', series: 'Góc nhìn Sinh Viên' },
  { id: 'c3', title: 'Livestream Ep.12 — Career Talk', type: 'Livestream', platform: 'Facebook', scheduledDate: '2026-06-04', scheduledTime: '20:00', status: 'Scheduled', assignee: mockUsers[7], approvedBy: mockUsers[4], description: 'Live career session', projectName: 'Livestream', projectId: 'p2' },
  { id: 'c4', title: 'Global Pass Benefits Infographic', type: 'SocialPost', platform: 'Instagram', scheduledDate: '2026-06-05', scheduledTime: '11:30', status: 'Approved', assignee: mockUsers[6], approvedBy: mockUsers[2], description: 'Benefits infographic', projectName: 'Global Pass', projectId: 'p1', series: 'Global Pass Launch' },
  { id: 'c5', title: 'UEF Student Testimonial Video', type: 'Video', platform: 'YouTube', scheduledDate: '2026-06-05', scheduledTime: '15:00', status: 'PendingReview', assignee: mockUsers[8], description: '3-min testimonial', projectName: 'Page Cư dân UEF', projectId: 'p3' },
  { id: 'c6', title: 'Weekly Recap Blog', type: 'Article', platform: 'Website', scheduledDate: '2026-06-06', scheduledTime: '09:00', status: 'Draft', assignee: mockUsers[9], description: 'Weekly highlights', projectName: 'Page Cư dân UEF', projectId: 'p3' },
  { id: 'c7', title: 'Global Pass BTS Video', type: 'Video', platform: 'TikTok', scheduledDate: '2026-06-07', scheduledTime: '18:00', status: 'Draft', assignee: mockUsers[8], description: 'Behind-the-scenes', projectName: 'Global Pass', projectId: 'p1' },
  { id: 'c8', title: 'Livestream Ep.13 — Tech Trends', type: 'Livestream', platform: 'Facebook', scheduledDate: '2026-06-08', scheduledTime: '20:00', status: 'PendingReview', assignee: mockUsers[7], description: 'Tech trends session', projectName: 'Livestream', projectId: 'p2', series: 'Tech Talk' },
  { id: 'c9', title: 'UEF Scholarship Announcement', type: 'SocialPost', platform: 'Facebook', scheduledDate: '2026-06-09', scheduledTime: '08:00', status: 'Approved', assignee: mockUsers[9], approvedBy: mockUsers[4], description: 'Scholarship opening', projectName: 'Page Cư dân UEF', projectId: 'p3', series: 'UEF Admission' },
  { id: 'c10', title: 'Global Pass FAQ Carousel', type: 'SocialPost', platform: 'Instagram', scheduledDate: '2026-06-09', scheduledTime: '14:00', status: 'Draft', assignee: mockUsers[6], description: '10-slide FAQ', projectName: 'Global Pass', projectId: 'p1' },
  { id: 'c11', title: 'Livestream Ep.12 Replay Edit', type: 'Video', platform: 'YouTube', scheduledDate: '2026-06-10', scheduledTime: '12:00', status: 'PendingReview', assignee: mockUsers[8], description: 'Edited replay', projectName: 'Livestream', projectId: 'p2' },
  { id: 'c12', title: 'UEF Event Recap Article', type: 'Article', platform: 'Website', scheduledDate: '2026-06-11', scheduledTime: '10:00', status: 'Draft', assignee: mockUsers[9], description: 'Event recap', projectName: 'Page Cư dân UEF', projectId: 'p3' },
  { id: 'c13', title: 'Global Pass Countdown Reels', type: 'Video', platform: 'Instagram', scheduledDate: '2026-06-12', scheduledTime: '17:00', status: 'Draft', assignee: mockUsers[8], description: '15s countdown', projectName: 'Global Pass', projectId: 'p1' },
  { id: 'c14', title: 'Livestream Promo Post', type: 'SocialPost', platform: 'Facebook', scheduledDate: '2026-06-13', scheduledTime: '16:00', status: 'Draft', assignee: mockUsers[7], description: 'Ep.14 promo', projectName: 'Livestream', projectId: 'p2' },
  { id: 'c15', title: 'UEF Dorm Tour Video', type: 'Video', platform: 'TikTok', scheduledDate: '2026-06-14', scheduledTime: '19:00', status: 'Draft', assignee: mockUsers[8], description: 'Dorm tour', projectName: 'Page Cư dân UEF', projectId: 'p3' },
  { id: 'c16', title: 'Global Pass Partner Highlight', type: 'SocialPost', platform: 'Facebook', scheduledDate: '2026-06-15', scheduledTime: '11:00', status: 'Draft', assignee: mockUsers[9], description: 'Partner feature', projectName: 'Global Pass', projectId: 'p1' },
  { id: 'c17', title: 'Livestream Ep.14 — Study Abroad', type: 'Livestream', platform: 'Facebook', scheduledDate: '2026-06-15', scheduledTime: '20:00', status: 'Draft', assignee: mockUsers[7], description: 'Study abroad session', projectName: 'Livestream', projectId: 'p2' },
  { id: 'c18', title: 'Brand Before/After Post', type: 'SocialPost', platform: 'Instagram', scheduledDate: '2026-06-16', scheduledTime: '13:00', status: 'Approved', assignee: mockUsers[6], approvedBy: mockUsers[2], description: 'Brand identity comparison', projectName: 'Brand Refresh Q3', projectId: 'p5' },
  { id: 'c19', title: 'Global Pass App Guide Video', type: 'Video', platform: 'YouTube', scheduledDate: '2026-06-18', scheduledTime: '10:00', status: 'Draft', assignee: mockUsers[8], description: 'Application tutorial', projectName: 'Global Pass', projectId: 'p1' },
  { id: 'c20', title: 'UEF Weekly Newsletter', type: 'Article', platform: 'Website', scheduledDate: '2026-06-20', scheduledTime: '09:00', status: 'Draft', assignee: mockUsers[9], description: 'Weekly newsletter', projectName: 'Page Cư dân UEF', projectId: 'p3' },
];

// ─── Work Calendar ──────────────────────────────────────────────────────────
export const mockWorkTrips: WorkTrip[] = [
  { id: 'w1', employee: mockUsers[7], type: 'BusinessTrip', startDate: '2026-06-02', endDate: '2026-06-04', location: 'Đà Nẵng', purpose: 'Gặp đối tác Global Pass', status: 'Approved', approvedBy: mockUsers[0] },
  { id: 'w2', employee: mockUsers[3], type: 'WFH', startDate: '2026-06-04', endDate: '2026-06-04', location: 'Remote', purpose: 'Làm việc từ xa', status: 'Approved', approvedBy: mockUsers[1] },
  { id: 'w3', employee: mockUsers[6], type: 'Leave', startDate: '2026-06-06', endDate: '2026-06-07', location: 'N/A', purpose: 'Nghỉ phép cá nhân', status: 'Approved', approvedBy: mockUsers[2] },
  { id: 'w4', employee: mockUsers[8], type: 'BusinessTrip', startDate: '2026-06-09', endDate: '2026-06-11', location: 'Hà Nội', purpose: 'Quay video cho Global Pass', status: 'ApprovedByLeader', approvedBy: mockUsers[2] },
  { id: 'w5', employee: mockUsers[9], type: 'Training', startDate: '2026-06-10', endDate: '2026-06-12', location: 'Online', purpose: 'Khóa Content Marketing nâng cao', status: 'Pending' },
  { id: 'w6', employee: mockUsers[5], type: 'WFH', startDate: '2026-06-05', endDate: '2026-06-06', location: 'Remote', purpose: 'Bảo trì hệ thống', status: 'Approved', approvedBy: mockUsers[1] },
  { id: 'w7', employee: mockUsers[4], type: 'BusinessTrip', startDate: '2026-06-15', endDate: '2026-06-17', location: 'HCM', purpose: 'Hội nghị Marketing Q3', status: 'Pending' },
  { id: 'w8', employee: mockUsers[7], type: 'Leave', startDate: '2026-06-20', endDate: '2026-06-22', location: 'N/A', purpose: 'Nghỉ phép gia đình', status: 'Pending' },
  { id: 'w9', employee: mockUsers[3], type: 'Training', startDate: '2026-06-18', endDate: '2026-06-19', location: 'UEF Campus', purpose: 'Workshop DevOps', status: 'ApprovedByLeader', approvedBy: mockUsers[1] },
  { id: 'w10', employee: mockUsers[8], type: 'WFH', startDate: '2026-06-25', endDate: '2026-06-26', location: 'Remote', purpose: 'Edit video tại nhà', status: 'Pending' },
];

// ─── Creative Tasks ─────────────────────────────────────────────────────────
export const mockCreativeTasks: CreativeTask[] = [
  { id: 'ct1', title: 'Global Pass Landing Page', type: 'Design', assignee: mockUsers[2], requestedBy: mockUsers[0], projectId: 'p1', projectName: 'Global Pass', receivedDate: '2026-05-28', dueDate: '2026-06-05', deliveredDate: '2026-06-04', revisions: 2, qualityScore: 4, turnaroundDays: 7, status: 'Completed' },
  { id: 'ct2', title: 'UEF Campus Infographic', type: 'Design', assignee: mockUsers[8], requestedBy: mockUsers[4], projectId: 'p3', projectName: 'Page Cư dân UEF', receivedDate: '2026-06-01', dueDate: '2026-06-06', revisions: 1, status: 'InProgress' },
  { id: 'ct3', title: 'Livestream Thumbnail Pack', type: 'Design', assignee: mockUsers[6], requestedBy: mockUsers[4], projectId: 'p2', projectName: 'Livestream', receivedDate: '2026-06-02', dueDate: '2026-06-07', revisions: 0, status: 'InProgress' },
  { id: 'ct4', title: 'Social Media Template Pack', type: 'Design', assignee: mockUsers[6], requestedBy: mockUsers[2], projectId: 'p5', projectName: 'Brand Refresh Q3', receivedDate: '2026-05-25', dueDate: '2026-06-03', deliveredDate: '2026-06-02', revisions: 3, qualityScore: 3, turnaroundDays: 8, status: 'Completed' },
  { id: 'ct5', title: 'FAQ Carousel Design', type: 'Design', assignee: mockUsers[6], requestedBy: mockUsers[4], projectId: 'p1', projectName: 'Global Pass', receivedDate: '2026-06-03', dueDate: '2026-06-09', revisions: 0, status: 'Pending' },
  { id: 'ct6', title: 'Brand Icon Set', type: 'Design', assignee: mockUsers[2], requestedBy: mockUsers[0], projectId: 'p5', projectName: 'Brand Refresh Q3', receivedDate: '2026-05-20', dueDate: '2026-05-30', deliveredDate: '2026-05-28', revisions: 1, qualityScore: 5, turnaroundDays: 8, status: 'Completed' },
  { id: 'ct7', title: 'UEF Scholarship Post', type: 'Design', assignee: mockUsers[8], requestedBy: mockUsers[4], projectId: 'p3', projectName: 'Page Cư dân UEF', receivedDate: '2026-06-04', dueDate: '2026-06-08', revisions: 0, status: 'Pending' },
  { id: 'ct8', title: 'Global Pass Teaser (30s)', type: 'VideoEdit', assignee: mockUsers[8], requestedBy: mockUsers[0], projectId: 'p1', projectName: 'Global Pass', receivedDate: '2026-05-30', dueDate: '2026-06-03', deliveredDate: '2026-06-02', revisions: 1, qualityScore: 5, turnaroundDays: 3, status: 'Completed', videoLength: '0:30', videoType: 'Reels' },
  { id: 'ct9', title: 'Livestream Ep.12 Replay', type: 'VideoEdit', assignee: mockUsers[8], requestedBy: mockUsers[4], projectId: 'p2', projectName: 'Livestream', receivedDate: '2026-06-02', dueDate: '2026-06-05', revisions: 0, status: 'InProgress', videoLength: '45:00', videoType: 'LivestreamReplay' },
  { id: 'ct10', title: 'UEF Student Testimonial', type: 'VideoEdit', assignee: mockUsers[8], requestedBy: mockUsers[2], projectId: 'p3', projectName: 'Page Cư dân UEF', receivedDate: '2026-06-01', dueDate: '2026-06-05', revisions: 2, status: 'Revision', videoLength: '3:00', videoType: 'LongForm' },
  { id: 'ct11', title: 'Global Pass BTS', type: 'VideoEdit', assignee: mockUsers[8], requestedBy: mockUsers[0], projectId: 'p1', projectName: 'Global Pass', receivedDate: '2026-06-04', dueDate: '2026-06-08', revisions: 0, status: 'Pending', videoLength: '1:00', videoType: 'Reels' },
  { id: 'ct12', title: 'UEF Dorm Tour', type: 'VideoEdit', assignee: mockUsers[8], requestedBy: mockUsers[2], projectId: 'p3', projectName: 'Page Cư dân UEF', receivedDate: '2026-06-05', dueDate: '2026-06-12', revisions: 0, status: 'Pending', videoLength: '2:00', videoType: 'Reels' },
  { id: 'ct13', title: 'Global Pass App Guide', type: 'VideoEdit', assignee: mockUsers[8], requestedBy: mockUsers[0], projectId: 'p1', projectName: 'Global Pass', receivedDate: '2026-06-06', dueDate: '2026-06-15', revisions: 0, status: 'Pending', videoLength: '5:00', videoType: 'LongForm' },
  { id: 'ct14', title: 'Brand Reveal Video', type: 'VideoEdit', assignee: mockUsers[8], requestedBy: mockUsers[2], projectId: 'p5', projectName: 'Brand Refresh Q3', receivedDate: '2026-05-22', dueDate: '2026-05-28', deliveredDate: '2026-05-27', revisions: 2, qualityScore: 4, turnaroundDays: 5, status: 'Completed', videoLength: '1:30', videoType: 'Reels' },
  { id: 'ct15', title: 'Ep.13 Promo Clip', type: 'VideoEdit', assignee: mockUsers[8], requestedBy: mockUsers[4], projectId: 'p2', projectName: 'Livestream', receivedDate: '2026-06-05', dueDate: '2026-06-07', revisions: 0, status: 'Pending', videoLength: '0:15', videoType: 'Reels' },
];

// ─── Knowledge Base ─────────────────────────────────────────────────────────
export const mockDocuments: Document[] = [
  { id: 'd1', emoji: '📘', title: 'Engineering Onboarding Guide', type: 'Guide', typeColor: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300', category: 'Engineering', author: 'Marcus Rodriguez', authorInitials: 'MR', authorGradient: 'from-emerald-500 to-teal-500', updated: 'Updated 2 days ago', views: 12 },
  { id: 'd2', emoji: '🎨', title: 'Brand Guidelines v3.0', type: 'Reference', typeColor: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300', category: 'Design', author: 'Aisha Patel', authorInitials: 'AP', authorGradient: 'from-rose-500 to-pink-500', updated: 'Updated 1 week ago', views: 45 },
  { id: 'd3', emoji: '📊', title: 'Q3 Marketing Strategy', type: 'Strategy', typeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300', category: 'Marketing', author: 'Elena Vasquez', authorInitials: 'EV', authorGradient: 'from-amber-500 to-orange-500', updated: 'Updated 3 days ago', views: 28 },
  { id: 'd4', emoji: '💻', title: 'API Documentation', type: 'Technical', typeColor: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300', category: 'Engineering', author: 'David Kim', authorInitials: 'DK', authorGradient: 'from-sky-500 to-blue-500', updated: 'Updated today', views: 67 },
  { id: 'd5', emoji: '📝', title: 'Meeting Notes Template', type: 'Template', typeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300', category: 'Company', author: 'Sarah Chen', authorInitials: 'SC', authorGradient: 'from-indigo-500 to-violet-500', updated: 'Updated 5 days ago', views: 15 },
  { id: 'd6', emoji: '🔄', title: 'Sprint Retrospective Q2', type: 'Report', typeColor: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300', category: 'Engineering', author: 'Marcus Rodriguez', authorInitials: 'MR', authorGradient: 'from-emerald-500 to-teal-500', updated: 'Updated 1 week ago', views: 22 },
  { id: 'd7', emoji: '🎯', title: 'Design System Components', type: 'Reference', typeColor: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300', category: 'Design', author: 'Priya Sharma', authorInitials: 'PS', authorGradient: 'from-fuchsia-500 to-purple-500', updated: 'Updated 4 days ago', views: 38 },
  { id: 'd8', emoji: '💼', title: 'Sales Playbook 2026', type: 'Playbook', typeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300', category: 'Marketing', author: 'Alex Thompson', authorInitials: 'AT', authorGradient: 'from-cyan-500 to-teal-500', updated: 'Updated 2 weeks ago', views: 9 },
];

export const mockActivity: ActivityItem[] = [
  { id: 'a1', user: 'David Kim', action: 'updated', target: 'API Documentation', time: '2 hours ago', userInitials: 'DK', userGradient: 'from-sky-500 to-blue-500' },
  { id: 'a2', user: 'Elena Vasquez', action: 'created', target: 'Q3 Marketing Strategy', time: '3 days ago', userInitials: 'EV', userGradient: 'from-amber-500 to-orange-500' },
  { id: 'a3', user: 'Priya Sharma', action: 'updated', target: 'Design System Components', time: '4 days ago', userInitials: 'PS', userGradient: 'from-fuchsia-500 to-purple-500' },
  { id: 'a4', user: 'Marcus Rodriguez', action: 'updated', target: 'Engineering Onboarding Guide', time: '2 days ago', userInitials: 'MR', userGradient: 'from-emerald-500 to-teal-500' },
  { id: 'a5', user: 'Sarah Chen', action: 'updated', target: 'Meeting Notes Template', time: '5 days ago', userInitials: 'SC', userGradient: 'from-indigo-500 to-violet-500' },
];
