import React, { useState, useEffect, useRef } from 'react';
import { Task, TaskStatus, TaskPriority } from '../types/task';
import { validateEmail, formatCurrency } from '../utils';
import { XIcon, CheckIcon, AlertCircleIcon } from './Icons';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialTask?: Task | null;
  defaultStatus?: TaskStatus;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
  defaultStatus = 'todo',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(defaultStatus);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [budget, setBudget] = useState<number>(5000000);
  const [assigneeName, setAssigneeName] = useState('Nguyễn Trường Vũ');
  const [assigneeEmail, setAssigneeEmail] = useState('truongvu.nguyen@company.com');
  const [assigneeAvatar, setAssigneeAvatar] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
  );
  const [tagsInput, setTagsInput] = useState('Frontend, UI/UX');

  // Lỗi form
  const [errors, setErrors] = useState<{
    title?: string;
    email?: string;
    budget?: string;
  }>({});

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description);
      setStatus(initialTask.status);
      setPriority(initialTask.priority);
      setDueDate(initialTask.dueDate);
      setBudget(initialTask.budget);
      setAssigneeName(initialTask.assignee.name);
      setAssigneeEmail(initialTask.assignee.email);
      setAssigneeAvatar(initialTask.assignee.avatar);
      setTagsInput(initialTask.tags.join(', '));
    } else {
      setTitle('');
      setDescription('');
      setStatus(defaultStatus);
      setPriority('medium');
      setDueDate(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
      setBudget(8000000);
      setAssigneeName('Nguyễn Trường Vũ');
      setAssigneeEmail('truongvu.nguyen@company.com');
      setAssigneeAvatar(
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
      );
      setTagsInput('Frontend, Feature');
    }
    setErrors({});
  }, [initialTask, defaultStatus, isOpen]);

  // Xử lý đóng phím ESC và Focus Trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    firstInputRef.current?.focus();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { title?: string; email?: string; budget?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Vui lòng nhập tiêu đề công việc';
    }

    if (!assigneeEmail.trim() || !validateEmail(assigneeEmail)) {
      newErrors.email = 'Email người phụ trách không đúng định dạng';
    }

    if (isNaN(budget) || budget < 0) {
      newErrors.budget = 'Ngân sách phải là số lớn hơn hoặc bằng 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      budget,
      assignee: {
        name: assigneeName.trim() || 'Thành viên',
        avatar: assigneeAvatar,
        email: assigneeEmail.trim(),
      },
      tags: tags.length > 0 ? tags : ['Chung'],
    });

    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 my-8 overflow-hidden transform transition-all"
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-emerald-50/50">
          <div>
            <h3
              id="task-modal-title"
              className="text-lg font-bold text-slate-900"
            >
              {initialTask ? 'Chỉnh sửa công việc' : 'Tạo mới công việc'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Cập nhật thông tin chi tiết trên bảng Kanban
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ"
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1.5 hover:bg-slate-200/60 transition-colors"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Tiêu đề */}
          <div>
            <label
              htmlFor="task-title"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
            >
              Tiêu đề công việc <span className="text-rose-500">*</span>
            </label>
            <input
              ref={firstInputRef}
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Cài đặt thư viện kéo thả dnd-kit..."
              className={`w-full px-3.5 py-2 text-sm rounded-lg border ${
                errors.title
                  ? 'border-rose-400 focus:ring-rose-500'
                  : 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-600'
              } focus:outline-none focus:ring-1`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                <AlertCircleIcon className="w-3.5 h-3.5" /> {errors.title}
              </p>
            )}
          </div>

          {/* Mô tả */}
          <div>
            <label
              htmlFor="task-description"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
            >
              Mô tả chi tiết
            </label>
            <textarea
              id="task-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả mục tiêu, yêu cầu nghiệm thu của công việc..."
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Trạng thái & Độ ưu tiên */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="task-status"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
              >
                Cột trạng thái
              </label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="todo">Cần làm (To Do)</option>
                <option value="in-progress">Đang làm (In Progress)</option>
                <option value="review">Chờ duyệt (Review)</option>
                <option value="done">Hoàn thành (Done)</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="task-priority"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
              >
                Mức độ ưu tiên
              </label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="low">Thấp (Low)</option>
                <option value="medium">Bình thường (Medium)</option>
                <option value="high">Cao (High)</option>
                <option value="urgent">Khẩn cấp (Urgent)</option>
              </select>
            </div>
          </div>

          {/* Hạn chót & Ngân sách */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="task-due-date"
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
              >
                Hạn chót hoàn thành
              </label>
              <input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="task-budget"
                  className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
                >
                  Ngân sách (VNĐ)
                </label>
                <span className="text-xs text-emerald-700 font-semibold">
                  {formatCurrency(budget || 0)}
                </span>
              </div>
              <input
                id="task-budget"
                type="number"
                step="500000"
                min="0"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
              />
              {errors.budget && (
                <p className="mt-1 text-xs text-rose-600">{errors.budget}</p>
              )}
            </div>
          </div>

          {/* Người phụ trách */}
          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Thông tin người phụ trách
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="assignee-name"
                  className="block text-xs text-slate-600 mb-1"
                >
                  Họ tên
                </label>
                <input
                  id="assignee-name"
                  type="text"
                  value={assigneeName}
                  onChange={(e) => setAssigneeName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="assignee-email"
                  className="block text-xs text-slate-600 mb-1"
                >
                  Email liên hệ
                </label>
                <input
                  id="assignee-email"
                  type="email"
                  value={assigneeEmail}
                  onChange={(e) => setAssigneeEmail(e.target.value)}
                  className={`w-full px-3.5 py-2 text-sm rounded-lg border ${
                    errors.email
                      ? 'border-rose-400 focus:ring-rose-500'
                      : 'border-slate-300 focus:border-emerald-600 focus:ring-emerald-600'
                  } focus:outline-none focus:ring-1`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
                    <AlertCircleIcon className="w-3.5 h-3.5" /> {errors.email}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label
              htmlFor="task-tags"
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1"
            >
              Nhãn / Phân loại (phân tách bằng dấu phẩy)
            </label>
            <input
              id="task-tags"
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="VD: Frontend, UI/UX, dnd-kit"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
            />
          </div>

          {/* Nút hành động */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors focus:ring-2 focus:ring-slate-400 focus:outline-none"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors flex items-center gap-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <CheckIcon className="w-4 h-4" />
              {initialTask ? 'Lưu thay đổi' : 'Tạo công việc'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
