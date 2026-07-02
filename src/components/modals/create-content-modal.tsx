'use client';

import React, { useState } from 'react';
import ModalWrapper, { FormField, FormInput, FormSelect, FormTextarea, ModalActions } from './modal-wrapper';
import { useAppState } from '@/context/app-state-context';
import { useRole } from '@/context/role-context';
import { useToast } from '@/components/ui/toast';
import { ContentType, Platform, ApprovalStatus } from '@/types';

interface CreateContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
}

export default function CreateContentModal({ isOpen, onClose, defaultDate }: CreateContentModalProps) {
  const { addContentItem, projects, users } = useAppState();
  const { currentRole, currentUser } = useRole();
  const { addToast } = useToast();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ContentType>('SocialPost');
  const [platform, setPlatform] = useState<Platform>('Facebook');
  const [scheduledDate, setScheduledDate] = useState(defaultDate || '');
  const [scheduledTime, setScheduledTime] = useState('10:00');
  const [assigneeId, setAssigneeId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [series, setSeries] = useState('');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setType('SocialPost');
    setPlatform('Facebook');
    setScheduledDate(defaultDate || '');
    setScheduledTime('10:00');
    setAssigneeId('');
    setProjectId('');
    setSeries('');
  };

  const handleSubmit = () => {
    if (!title.trim() || !scheduledDate || !assigneeId) return;

    const assignee = users.find(u => u.id === assigneeId) || currentUser;
    const project = projects.find(p => p.id === projectId);

    // Staff creates as Draft, Leader creates as PendingReview
    const initialStatus: ApprovalStatus = currentRole === 'Manager' ? 'Approved' : currentRole === 'Leader' ? 'PendingReview' : 'Draft';

    addContentItem({
      title: title.trim(),
      description: description.trim(),
      type,
      platform,
      scheduledDate,
      scheduledTime,
      status: initialStatus,
      assignee,
      projectId: projectId || undefined,
      projectName: project?.name || undefined,
      series: series.trim() || undefined,
    });

    addToast({
      title: 'Content Created',
      message: `"${title}" created as ${initialStatus}`,
      type: 'success',
    });
    resetForm();
    onClose();
  };

  const isValid = title.trim() && scheduledDate && assigneeId;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Create Content" subtitle="Schedule new content for publishing">
      <div className="space-y-4">
        <FormField label="Title" required>
          <FormInput
            placeholder="e.g., Summer Campaign Reel..."
            value={title}
            onChange={e => setTitle(e.target.value)}
            autoFocus
          />
        </FormField>

        <FormField label="Description">
          <FormTextarea
            placeholder="Brief description of the content..."
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Content Type" required>
            <FormSelect value={type} onChange={e => setType(e.target.value as ContentType)}>
              <option value="Video">🎬 Video</option>
              <option value="Article">📝 Article</option>
              <option value="SocialPost">📱 Social Post</option>
              <option value="Livestream">🔴 Livestream</option>
            </FormSelect>
          </FormField>

          <FormField label="Platform" required>
            <FormSelect value={platform} onChange={e => setPlatform(e.target.value as Platform)}>
              <option value="Facebook">Facebook</option>
              <option value="TikTok">TikTok</option>
              <option value="YouTube">YouTube</option>
              <option value="Instagram">Instagram</option>
              <option value="Website">Website</option>
            </FormSelect>
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Scheduled Date" required>
            <FormInput
              type="date"
              value={scheduledDate}
              onChange={e => setScheduledDate(e.target.value)}
            />
          </FormField>

          <FormField label="Scheduled Time" required>
            <FormInput
              type="time"
              value={scheduledTime}
              onChange={e => setScheduledTime(e.target.value)}
            />
          </FormField>
        </div>

        <FormField label="Project">
          <FormSelect value={projectId} onChange={e => setProjectId(e.target.value)}>
            <option value="">No project</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </FormSelect>
        </FormField>

        <FormField label="Series (Optional)">
          <FormInput
            placeholder="e.g., Summer Campaign, Tech Talk..."
            value={series}
            onChange={e => setSeries(e.target.value)}
          />
        </FormField>

        <FormField label="Assignee" required>
          <FormSelect value={assigneeId} onChange={e => setAssigneeId(e.target.value)}>
            <option value="">Select assignee...</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name} — {u.department}</option>
            ))}
          </FormSelect>
        </FormField>

        <ModalActions
          onCancel={onClose}
          onSubmit={handleSubmit}
          submitLabel={currentRole === 'Manager' ? 'Create & Approve' : currentRole === 'Leader' ? 'Create & Submit' : 'Create Draft'}
          disabled={!isValid}
        />
      </div>
    </ModalWrapper>
  );
}
