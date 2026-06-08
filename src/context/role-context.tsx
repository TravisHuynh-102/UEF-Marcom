'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserRole, User } from '@/types';
import { hasPermission as checkPermission, Permission } from '@/lib/permissions';

// ─── Mock users per role (for demo switching) ───────────────────────────────
const ROLE_USERS: Record<UserRole, User> = {
  Manager: {
    id: 'u1',
    name: 'Sarah Chen',
    email: 'sarah@teamos.ai',
    role: 'Manager',
    avatar: '',
    department: 'Executive',
    capacity: 72,
    teamId: 'all',
  },
  Leader: {
    id: 'u3',
    name: 'Aisha Patel',
    email: 'aisha@teamos.ai',
    role: 'Leader',
    avatar: '',
    department: 'Design',
    capacity: 95,
    teamId: 'design',
  },
  Staff: {
    id: 'u7',
    name: 'Priya Sharma',
    email: 'priya@teamos.ai',
    role: 'Staff',
    avatar: '',
    department: 'Design',
    capacity: 42,
    teamId: 'design',
  },
};

// ─── Context Type ───────────────────────────────────────────────────────────
interface RoleContextType {
  currentRole: UserRole;
  currentUser: User;
  setCurrentRole: (role: UserRole) => void;
  hasPermission: (permission: Permission) => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

// ─── Provider ───────────────────────────────────────────────────────────────
export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [currentRole, setCurrentRoleState] = useState<UserRole>('Manager');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('teamos-role');
    if (saved && (saved === 'Manager' || saved === 'Leader' || saved === 'Staff')) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentRoleState(saved as UserRole);
    }
  }, []);

  const setCurrentRole = useCallback((role: UserRole) => {
    setCurrentRoleState(role);
    localStorage.setItem('teamos-role', role);
  }, []);

  const hasPermission = useCallback(
    (permission: Permission) => checkPermission(currentRole, permission),
    [currentRole]
  );

  const currentUser = ROLE_USERS[currentRole];

  return (
    <RoleContext.Provider
      value={{ currentRole, currentUser, setCurrentRole, hasPermission }}
    >
      {children}
    </RoleContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────
export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
