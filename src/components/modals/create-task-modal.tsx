'use client';

import React, { useState } from 'react';
import ModalWrapper, { FormField, FormInput, FormSelect, FormTextarea, ModalActions } from './modal-wrapper';
import { useAppState } from '@/context/app-state-context';
import { useRole } from '@/context/role-context';
import { useToast } from '@/components/ui/toast';
import { TaskPriority } from '@/types';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectId?: string;
}

export default function CreateTaskModal({ isOpen, onClose, defaultProjectId }: CreateTaskModalProps) {
  const { addTask, projects, users } = useAppState();
  const { currentUser } = useRole();
  const { addToast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [assigneeId, setAssigneeId] = useState('');
  const [projectId, setProjectId] = useState(defaultProjectId || '');
  const [dueDate, setDueDate] = useState('');

  const filteredUsers = React.useMemo(() => {
    if (currentUser.role === 'Manager') return users;
    // Leader sees only their department members + themselves
    return users.filter(u => u.department === currentUser.department || u.id === currentUser.id);
  }, [users, currentUser]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('Medium');
    setAssigneeId('');
    setProjectId(defaultProjectId || '');
    setDueDate('');
  };

  const handleSubmit = () => {
    if (!title.trim() || !projectId || !assigneeId || !dueDate) return;

    const assignee = users.find(u => u.id === assigneeId)!;
    const project = projects.find(p => p.id === projectId);

    addTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      assignee,
      projectId,
      projectName: project?.name || '',
      dueDate,
      completed: false,
    });

    addToast({ title: 'Task Created', message: `"${title}" has been added`, type: 'success' });
    resetForm();
    onClose();
  };

  const isValid = title.trim() && projectId && assigneeId && dueDate;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Create Task" subtitle="Add a new task to your board">
      <div className="space-y-4">
        <FormField label="Title" required>
          <FormInput
            placeholder="e.g., Design banner for campaign..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
          />
        </FormField>

        <FormField label="Description">
          <FormTextarea
            placeholder="Describe the task details..."
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Priority" required>
            <FormSelect value={priority} onChange={e => setPriority(e.target.value as TaskPriority)}>
              <option value="Critical">🔴 Critical</option>
              <option value="High">🟠 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">🟢 Low</option>
            </FormSelect>
          </FormField>

          <FormField label="Due Date" required>
            <FormInput
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </FormField>
        </div>

        <FormField label="Project" required>
          <FormSelect value={projectId} onChange={e => setProjectId(e.target.value)}>
            <option value="">Select project...</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </FormSelect>
        </FormField>

        <FormField label="Assignee" required>
          <FormSelect value={assigneeId} onChange={e => setAssigneeId(e.target.value)}>
            <option value="">Select assignee...</option>
            {filteredUsers.map(u => (
              <option key={u.id} value={u.id}>{u.name} — {u.department}</option>
            ))}
          </FormSelect>
        </FormField>

        <ModalActions
          onCancel={onClose}
          onSubmit={handleSubmit}
          submitLabel="Create Task"
          disabled={!isValid}
        />
      </div>
    </ModalWrapper>
  );
}
