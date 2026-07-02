'use client';
/* eslint-disable */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  Project, Task, ContentItem, WorkTrip, CreativeTask, User, Document, ActivityItem,
  ProjectStatus, TaskPriority, ApprovalStatus, ContentType, Platform, WorkTripType, RiskLevel,
} from '@/types';
import {
  mockProjects, mockTasks, mockContentItems, mockWorkTrips, mockCreativeTasks, mockUsers, mockDocuments, mockActivity,
} from '@/lib/mock-data';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/toast';

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
  deleteUser: (id: string) => void;
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
  const { addToast } = useToast();

  const addNotification = useCallback((notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: AppNotification = {
      ...notification,
      id: generateId('n'),
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
    
    addToast({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      duration: 5000,
    });
  }, [addToast]);

  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [workTrips, setWorkTrips] = useState<WorkTrip[]>(mockWorkTrips);
  const [creativeTasks, setCreativeTasks] = useState<CreativeTask[]>(mockCreativeTasks);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [activities, setActivities] = useState<ActivityItem[]>(mockActivity);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);

  // ─── Fetch Supabase Data & Realtime Subscriptions ────────────────────────────────────────────────
  useEffect(() => {
    const fetchContent = async () => {
      const { data, error } = await supabase.from('content_items').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching content:', error);
      } else if (data) {
        const mappedData: ContentItem[] = data.map(d => ({
          id: d.id,
          title: d.title,
          type: d.type as ContentType,
          platform: d.platform as Platform,
          status: d.status as ApprovalStatus,
          scheduledDate: d.scheduled_date,
          scheduledTime: d.scheduled_time,
          series: d.series || undefined,
          assignee: d.assignee,
          approvedBy: d.approved_by,
        }));
        setContentItems(mappedData);
      }
    };
    fetchContent();

    // Supabase Realtime Subscription for content_items
    const channel = supabase.channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'content_items' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newItem = payload.new as any;
            addNotification({
              title: 'Lịch Nội Dung Mới',
              message: `Đã thêm "${newItem.title}" vào lịch xuất bản.`,
              type: 'info',
              link: '/content-calendar'
            });
            setContentItems(prev => {
               if (prev.some(c => c.id === newItem.id)) return prev;
               return [{
                 id: newItem.id,
                 title: newItem.title,
                 type: newItem.type,
                 platform: newItem.platform,
                 status: newItem.status,
                 scheduledDate: newItem.scheduled_date,
                 scheduledTime: newItem.scheduled_time,
                 series: newItem.series,
                 assignee: newItem.assignee,
                 approvedBy: newItem.approved_by,
               }, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedItem = payload.new as any;
            addNotification({
              title: 'Cập nhật Nội Dung',
              message: `Nội dung "${updatedItem.title}" vừa được cập nhật trạng thái.`,
              type: 'success',
              link: '/content-calendar'
            });
            setContentItems(prev => prev.map(c => c.id === updatedItem.id ? {
              ...c,
              title: updatedItem.title,
              type: updatedItem.type,
              platform: updatedItem.platform,
              status: updatedItem.status,
              scheduledDate: updatedItem.scheduled_date,
              scheduledTime: updatedItem.scheduled_time,
              series: updatedItem.series,
              assignee: updatedItem.assignee,
              approvedBy: updatedItem.approved_by,
            } : c));
          } else if (payload.eventType === 'DELETE') {
            const deletedItem = payload.old as any;
            addNotification({
              title: 'Đã xoá Nội Dung',
              message: `Một nội dung đã bị gỡ khỏi lịch.`,
              type: 'warning',
              link: '/content-calendar'
            });
            setContentItems(prev => prev.filter(c => c.id !== deletedItem.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [addNotification]);

  // ─── Project CRUD ───────────────────────────────────────────────────────
  const addProject = useCallback((project: Omit<Project, 'id'>) => {
    const newProject: Project = { ...project, id: generateId('p') };
    setProjects(prev => [newProject, ...prev]);
    addNotification({
      title: 'Dự án mới',
      message: `Dự án "${project.name}" đã được khởi tạo thành công.`,
      type: 'success',
      link: '/projects'
    });
  }, [addNotification]);

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
    addNotification({
      title: 'Công việc mới được giao',
      message: `Task "${task.title}" đã được tạo.`,
      type: 'info',
      link: '/tasks'
    });
  }, [addNotification]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    if (updates.status === 'Completed') {
      addNotification({
        title: 'Hoàn thành công việc',
        message: `Tuyệt vời! Một công việc vừa được đánh dấu hoàn thành.`,
        type: 'success',
        link: '/tasks'
      });
    }
  }, [addNotification]);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  // ─── Content CRUD (Supabase) ────────────────────────────────────────────
  const addContentItem = useCallback(async (item: Omit<ContentItem, 'id'>) => {
    const tempId = generateId('temp');
    const newItem: ContentItem = { ...item, id: tempId };
    setContentItems(prev => [newItem, ...prev]);

    const insertData = {
      title: item.title,
      type: item.type,
      platform: item.platform,
      status: item.status,
      scheduled_date: item.scheduledDate,
      scheduled_time: item.scheduledTime,
      series: item.series,
      assignee: item.assignee,
      approved_by: item.approvedBy,
    };
    
    const { data, error } = await supabase.from('content_items').insert(insertData).select().single();
    if (error) {
      console.error('Error adding content to Supabase:', error);
    } else if (data) {
      setContentItems(prev => prev.map(c => c.id === tempId ? { ...c, id: data.id } : c));
    }
  }, []);

  const updateContentItem = useCallback(async (id: string, updates: Partial<ContentItem>) => {
    setContentItems(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    
    if (id.startsWith('c') && !id.includes('-')) return; // Ignore updates on local mock data if any left
    
    const updateData: any = {};
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.type !== undefined) updateData.type = updates.type;
    if (updates.platform !== undefined) updateData.platform = updates.platform;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.scheduledDate !== undefined) updateData.scheduled_date = updates.scheduledDate;
    if (updates.scheduledTime !== undefined) updateData.scheduled_time = updates.scheduledTime;
    if (updates.series !== undefined) updateData.series = updates.series;
    if (updates.assignee !== undefined) updateData.assignee = updates.assignee;
    if (updates.approvedBy !== undefined) updateData.approved_by = updates.approvedBy;

    const { error } = await supabase.from('content_items').update(updateData).eq('id', id);
    if (error) console.error('Error updating content on Supabase:', error);
  }, []);

  const deleteContentItem = useCallback(async (id: string) => {
    setContentItems(prev => prev.filter(c => c.id !== id));
    if (id.startsWith('c') && !id.includes('-')) return;
    const { error } = await supabase.from('content_items').delete().eq('id', id);
    if (error) console.error('Error deleting content on Supabase:', error);
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

  // ─── User CRUD ──────────────────────────────────────────────────────────
  const deleteUser = useCallback((id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  }, []);

  // ─── Notification CRUD ──────────────────────────────────────────────────
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
        users, notifications,
        addProject, updateProject, deleteProject,
        addTask, updateTask, deleteTask,
        addContentItem, updateContentItem, deleteContentItem,
        addWorkTrip, updateWorkTrip, deleteWorkTrip,
        updateCreativeTask,
        addDocument, updateDocument, deleteDocument,
        addActivity, deleteUser,
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
