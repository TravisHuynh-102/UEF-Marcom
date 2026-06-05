'use client';

import React, { useState } from 'react';
import ModalWrapper, { FormField, FormInput, FormSelect, FormTextarea, ModalActions } from './modal-wrapper';
import { useAppState } from '@/context/app-state-context';
import { useToast } from '@/components/ui/toast';
import { ProjectStatus, RiskLevel } from '@/types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const { addProject, users } = useAppState();
  const { addToast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('Planned');
  const [risk, setRisk] = useState<RiskLevel>('Safe');
  const [leadId, setLeadId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [memberIds, setMemberIds] = useState<string[]>([]);

  const leaders = users.filter(u => u.role === 'Manager' || u.role === 'Leader');

  const resetForm = () => {
    setName('');
    setDescription('');
    setStatus('Planned');
    setRisk('Safe');
    setLeadId('');
    setDueDate('');
    setMemberIds([]);
  };

  const toggleMember = (id: string) => {
    setMemberIds(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const handleSubmit = () => {
    if (!name.trim() || !leadId || !dueDate) return;

    const lead = users.find(u => u.id === leadId)!;
    const members = users.filter(u => memberIds.includes(u.id));

    addProject({
      name: name.trim(),
      description: description.trim(),
      status,
      risk,
      progress: 0,
      lead,
      members: [lead, ...members.filter(m => m.id !== leadId)],
      dueDate,
    });

    addToast({ title: 'Project Created', message: `"${name}" has been added`, type: 'success' });
    resetForm();
    onClose();
  };

  const isValid = name.trim() && leadId && dueDate;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Create Project" subtitle="Start a new project" size="lg">
      <div className="space-y-4">
        <FormField label="Project Name" required>
          <FormInput
            placeholder="e.g., Brand Campaign Q3..."
            value={name}
            onChange={e => setName(e.target.value)}
            autoFocus
          />
        </FormField>

        <FormField label="Description">
          <FormTextarea
            placeholder="Describe the project scope and goals..."
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </FormField>

        <div className="grid grid-cols-3 gap-4">
          <FormField label="Status" required>
            <FormSelect value={status} onChange={e => setStatus(e.target.value as ProjectStatus)}>
              <option value="Backlog">📋 Backlog</option>
              <option value="Planned">📅 Planned</option>
              <option value="In Progress">🚀 In Progress</option>
              <option value="Review">🔍 Review</option>
            </FormSelect>
          </FormField>

          <FormField label="Risk Level">
            <FormSelect value={risk} onChange={e => setRisk(e.target.value as RiskLevel)}>
              <option value="Safe">🟢 Safe</option>
              <option value="At Risk">🟡 At Risk</option>
              <option value="Blocked">🔴 Blocked</option>
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

        <FormField label="Project Lead" required>
          <FormSelect value={leadId} onChange={e => setLeadId(e.target.value)}>
            <option value="">Select lead...</option>
            {leaders.map(u => (
              <option key={u.id} value={u.id}>{u.name} — {u.role}</option>
            ))}
          </FormSelect>
        </FormField>

        <FormField label="Team Members">
          <div className="flex flex-wrap gap-2 mt-1">
            {users.filter(u => u.id !== leadId).map(u => (
              <button
                key={u.id}
                type="button"
                onClick={() => toggleMember(u.id)}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                  memberIds.includes(u.id)
                    ? 'border-violet-500/40 bg-violet-500/10 text-violet-400'
                    : 'border-white/[0.08] bg-white/[0.02] text-gray-400 hover:bg-white/[0.06]'
                }`}
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-[9px] font-bold text-white">
                  {u.name.split(' ').map(n => n[0]).join('')}
                </span>
                {u.name}
              </button>
            ))}
          </div>
        </FormField>

        <ModalActions
          onCancel={onClose}
          onSubmit={handleSubmit}
          submitLabel="Create Project"
          disabled={!isValid}
        />
      </div>
    </ModalWrapper>
  );
}
