import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { useAppState } from '@/context/app-state-context';
import { useToast } from '@/components/ui/toast';
import ModalWrapper, { FormField, FormInput, FormSelect, ModalActions } from './modal-wrapper';
import { useRole } from '@/context/role-context';
import { getInitials } from '@/lib/utils';

interface CreateDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = ['Engineering', 'Design', 'Marketing', 'Company', 'Onboarding'];
const TYPES = ['Guide', 'Reference', 'Strategy', 'Technical', 'Template', 'Report', 'Playbook'];
const EMOJIS = ['📘', '🎨', '📊', '💻', '📝', '🔄', '🎯', '💼', '🚀', '💡'];

const TYPE_COLORS: Record<string, string> = {
  Guide: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
  Reference: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
  Strategy: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  Technical: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
  Template: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  Report: 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300',
  Playbook: 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300',
};

export default function CreateDocumentModal({ isOpen, onClose }: CreateDocumentModalProps) {
  const { addDocument, users, addActivity } = useAppState();
  const { currentRole } = useRole();
  const { addToast } = useToast();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [type, setType] = useState(TYPES[0]);
  const [emoji, setEmoji] = useState(EMOJIS[0]);

  // Simulate current user
  const currentUser = users[0]; // Sarah Chen

  const handleSubmit = () => {

    addDocument({
      title,
      category,
      type,
      emoji,
      typeColor: TYPE_COLORS[type] || TYPE_COLORS.Guide,
      author: currentUser.name,
      authorInitials: getInitials(currentUser.name),
      authorGradient: 'from-indigo-500 to-violet-500',
      updated: 'Updated just now',
      views: 0,
    });

    addActivity({
      user: currentUser.name,
      action: 'created',
      target: title,
      time: 'Just now',
      userInitials: getInitials(currentUser.name),
      userGradient: 'from-indigo-500 to-violet-500',
    });

    addToast({
      title: 'Document Created',
      message: `"${title}" has been added to the knowledge base.`,
      type: 'success',
    });

    // Reset and close
    setTitle('');
    setCategory(CATEGORIES[0]);
    setType(TYPES[0]);
    setEmoji(EMOJIS[0]);
    onClose();
  };

  const isFormValid = title.trim() !== '';

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Create Document"
    >
      <div className="space-y-4 py-2">
        <FormField label="Document Title">
          <FormInput
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Engineering Onboarding Guide"
            autoFocus
          />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Category">
            <FormSelect
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </FormSelect>
          </FormField>
          <FormField label="Document Type">
            <FormSelect
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              {TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </FormSelect>
          </FormField>
        </div>

        <FormField label="Icon (Emoji)">
          <div className="grid grid-cols-5 gap-2">
            {EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEmoji(e)}
                className={`p-2 text-2xl rounded-lg border transition-all ${
                  emoji === e
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                    : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </FormField>
      </div>
      <ModalActions onCancel={onClose} onSubmit={handleSubmit} submitLabel="Create Document" disabled={!isFormValid} />
    </ModalWrapper>
  );
}
