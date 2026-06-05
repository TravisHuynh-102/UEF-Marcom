'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  Project, Task, ContentItem, WorkTrip, CreativeTask, User, Document, ActivityItem,
  ProjectStatus, TaskPriority, ApprovalStatus, ContentType, Platform, WorkTripType, RiskLevel,
} from '@/types';
import {
  mockProjects, mockTasks, mockContentItems, mockWorkTrips, mockCreativeTasks, mockUsers, mockDocuments, mockActivity,
} from '@/lib/mock-data';

// ─── Notification Types ─────────────────────────────────────────────────────
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  link?: string;
}

// ─── Context Type ───────────────────────────────────────────────────────────
interface AppStateContextType {
  // Data
  projects: Project[];
  tasks: Task[];
  contentItems: ContentItem[];
  workTrips: WorkTrip[];
  creativeTasks: CreativeTask[];
  documents: Document[];
  activities: ActivityItem[];
  users: User[];
  notifications: AppNotification[];

  // Project CRUD
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Task CRUD
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  // Content CRUD
  addContentItem: (item: Omit<ContentItem, 'id'>) => void;
  updateContentItem: (id: string, updates: Partial<ContentItem>) => void;
  deleteContentItem: (id: string) => void;

  // Work Trip CRUD
  addWorkTrip: (trip: Omit<WorkTrip, 'id'>) => void;
  updateWorkTrip: (id: string, updates: Partial<WorkTrip>) => void;
  deleteWorkTrip: (id: string) => void;

  // Creative Task CRUD
  updateCreativeTask: (id: string, updates: Partial<CreativeTask>) => void;

  // Document CRUD
  addDocument: (doc: Omit<Document, 'id'>) => void;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  deleteDocument: (id: string) => void;

  // Activities
  addActivity: (activity: Omit<ActivityItem, 'id'>) => void;

  // Notifications
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadNotificationCount: number;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

// ─── ID Generator ───────────────────────────────────────────────────────────
let idCounter = 100;
function generateId(prefix: string): string {
  return `${prefix}${++idCounter}`;
}

// ─── Initial Notifications ──────────────────────────────────────────────────
const initialNotifications: AppNotification[] = [
  {
    id: 'n1',
    title: 'Content Approved',
    message: 'Sarah Chen approved "Global Pass Benefits Infographic"',
    type: 'success',
    timestamp: '2026-06-05T07:30:00Z',
    read: false,
    link: '/content-calendar',
  },
  {
    id: 'n2',
    title: 'New Task Assigned',
    message: 'You have been assigned "Design Global Pass landing page"',
    type: 'info',
    timestamp: '2026-06-05T06:45:00Z',
    read: false,
    link: '/tasks',
  },
  {
    id: 'n3',
    title: 'WFH Request Approved',
    message: 'Marcus Rodriguez approved your WFH request for Jun 5-6',
    type: 'success',
    timestamp: '2026-06-04T17:00:00Z',
    read: false,
    link: '/work-calendar',
  },
  {
    id: 'n4',
    title: 'Project At Risk',
    message: 'Global Pass project is behind schedule — 2 tasks overdue',
    type: 'warning',
    timestamp: '2026-06-04T10:00:00Z',
    read: true,
    link: '/projects',
  },
  {
    id: 'n5',
    title: 'Content Pending Review',
    message: '"UEF Student Testimonial Video" submitted for review',
    type: 'info',
    timestamp: '2026-06-04T09:00:00Z',
    read: true,
    link: '/content-calendar',
  },
];

// ─── Provider ───────────────────────────────────────────────────────────────
export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [contentItems, setContentItems] = useState<ContentItem[]>(mockContentItems);
  const [workTrips, setWorkTrips] = useState<WorkTrip[]>(mockWorkTrips);
  const [creativeTasks, setCreativeTasks] = useState<CreativeTask[]>(mockCreativeTasks);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivity);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);

  // ─── Project CRUD ───────────────────────────────────────────────────────
  const addProject = useCallback((project: Omit<Project, 'id'>) => {
    const newProject: Project = { ...project, id: generateId('p') };
    setProjects(prev => [newProject, ...prev]);
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  }, []);

  // ─── Task CRUD ──────────────────────────────────────────────────────────
  const addTask = useCallback((task: Omit<Task, 'id'>) => {
    const newTask: Task = { ...task, id: generateId('t') };
    setTasks(prev => [newTask, ...prev]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  // ─── Content CRUD ───────────────────────────────────────────────────────
  const addContentItem = useCallback((item: Omit<ContentItem, 'id'>) => {
    const newItem: ContentItem = { ...item, id: generateId('c') };
    setContentItems(prev => [newItem, ...prev]);
  }, []);

  const updateContentItem = useCallback((id: string, updates: Partial<ContentItem>) => {
    setContentItems(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const deleteContentItem = useCallback((id: string) => {
    setContentItems(prev => prev.filter(c => c.id !== id));
  }, []);

  // ─── Work Trip CRUD ─────────────────────────────────────────────────────
  const addWorkTrip = useCallback((trip: Omit<WorkTrip, 'id'>) => {
    const newTrip: WorkTrip = { ...trip, id: generateId('w') };
    setWorkTrips(prev => [newTrip, ...prev]);
  }, []);

  const updateWorkTrip = useCallback((id: string, updates: Partial<WorkTrip>) => {
    setWorkTrips(prev => prev.map(w => w.id === id ? { ...w, ...updates } : w));
  }, []);

  const deleteWorkTrip = useCallback((id: string) => {
    setWorkTrips(prev => prev.filter(w => w.id !== id));
  }, []);

  // ─── Creative Task CRUD ─────────────────────────────────────────────────
  const updateCreativeTask = useCallback((id: string, updates: Partial<CreativeTask>) => {
    setCreativeTasks(prev => prev.map(ct => ct.id === id ? { ...ct, ...updates } : ct));
  }, []);

  // ─── Document CRUD ──────────────────────────────────────────────────────
  const addDocument = useCallback((doc: Omit<Document, 'id'>) => {
    const newDoc: Document = { ...doc, id: generateId('d') };
    setDocuments(prev => [newDoc, ...prev]);
  }, []);

  const updateDocument = useCallback((id: string, updates: Partial<Document>) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
  }, []);

  const deleteDocument = useCallback((id: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
  }, []);

  // ─── Activity CRUD ──────────────────────────────────────────────────────
  const addActivity = useCallback((activity: Omit<ActivityItem, 'id'>) => {
    const newActivity: ActivityItem = { ...activity, id: generateId('a') };
    setActivities(prev => [newActivity, ...prev]);
  }, []);

  // ─── Notification CRUD ──────────────────────────────────────────────────
  const addNotification = useCallback((notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: AppNotification = {
      ...notification,
      id: generateId('n'),
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  return (
    <AppStateContext.Provider
      value={{
        projects, tasks, contentItems, workTrips, creativeTasks, documents, activities,
        users: mockUsers, notifications,
        addProject, updateProject, deleteProject,
        addTask, updateTask, deleteTask,
        addContentItem, updateContentItem, deleteContentItem,
        addWorkTrip, updateWorkTrip, deleteWorkTrip,
        updateCreativeTask,
        addDocument, updateDocument, deleteDocument,
        addActivity,
        addNotification, markNotificationRead, markAllNotificationsRead, unreadNotificationCount,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────
export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
