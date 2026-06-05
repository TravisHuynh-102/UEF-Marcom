'use client';

import React, { useState } from 'react';
import ModalWrapper, { FormField, FormInput, FormSelect, FormTextarea, ModalActions } from './modal-wrapper';
import { useAppState } from '@/context/app-state-context';
import { useRole } from '@/context/role-context';
import { useToast } from '@/components/ui/toast';
import { WorkTripType } from '@/types';

interface CreateWorkTripModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateWorkTripModal({ isOpen, onClose }: CreateWorkTripModalProps) {
  const { addWorkTrip, users } = useAppState();
  const { currentRole, currentUser } = useRole();
  const { addToast } = useToast();
  const [employeeId, setEmployeeId] = useState('');
  const [type, setType] = useState<WorkTripType>('BusinessTrip');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [purpose, setPurpose] = useState('');
  const [notes, setNotes] = useState('');

  const resetForm = () => {
    setEmployeeId('');
    setType('BusinessTrip');
    setStartDate('');
    setEndDate('');
    setLocation('');
    setPurpose('');
    setNotes('');
  };

  const handleSubmit = () => {
    if (!employeeId || !startDate || !endDate || !purpose.trim()) return;

    const employee = users.find(u => u.id === employeeId)!;

    addWorkTrip({
      employee,
      type,
      startDate,
      endDate,
      location: location.trim() || (type === 'WFH' ? 'Remote' : type === 'Leave' ? 'N/A' : ''),
      purpose: purpose.trim(),
      status: 'Pending',
      notes: notes.trim() || undefined,
    });

    addToast({
      title: 'Request Created',
      message: `${type === 'Leave' ? 'Leave' : type === 'WFH' ? 'WFH' : type === 'Training' ? 'Training' : 'Business trip'} request submitted`,
      type: 'success',
    });
    resetForm();
    onClose();
  };

  const isValid = employeeId && startDate && endDate && purpose.trim();

  // Staff can only create for themselves
  const availableUsers = currentRole === 'Staff' ? [currentUser] : users;

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="New Schedule Request" subtitle="Submit a work calendar request">
      <div className="space-y-4">
        <FormField label="Type" required>
          <FormSelect value={type} onChange={e => setType(e.target.value as WorkTripType)}>
            <option value="BusinessTrip">🔵 Business Trip</option>
            <option value="WFH">🟢 Work From Home</option>
            <option value="Leave">🟡 Leave</option>
            <option value="Training">🟣 Training</option>
          </FormSelect>
        </FormField>

        <FormField label="Employee" required>
          <FormSelect value={employeeId} onChange={e => setEmployeeId(e.target.value)}>
            <option value="">Select employee...</option>
            {availableUsers.map(u => (
              <option key={u.id} value={u.id}>{u.name} — {u.department}</option>
            ))}
          </FormSelect>
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Start Date" required>
            <FormInput
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </FormField>

          <FormField label="End Date" required>
            <FormInput
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              min={startDate}
            />
          </FormField>
        </div>

        {(type === 'BusinessTrip' || type === 'Training') && (
          <FormField label="Location" required>
            <FormInput
              placeholder={type === 'BusinessTrip' ? 'e.g., Hà Nội' : 'e.g., Online / UEF Campus'}
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </FormField>
        )}

        <FormField label="Purpose" required>
          <FormTextarea
            placeholder="Describe the reason..."
            rows={2}
            value={purpose}
            onChange={e => setPurpose(e.target.value)}
          />
        </FormField>

        <FormField label="Notes">
          <FormTextarea
            placeholder="Additional notes (optional)..."
            rows={2}
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </FormField>

        <ModalActions
          onCancel={onClose}
          onSubmit={handleSubmit}
          submitLabel="Submit Request"
          disabled={!isValid}
        />
      </div>
    </ModalWrapper>
  );
}
