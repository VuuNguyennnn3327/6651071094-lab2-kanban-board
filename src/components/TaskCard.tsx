import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Link } from 'react-router-dom';
import { Task, TaskPriority } from '../types/task';
import { formatCurrency, truncateText } from '../utils';
import {
  GripVerticalIcon,
  CalendarIcon,
  DollarSignIcon,
  EditIcon,
  TrashIcon,
  ArrowUpRightIcon,
} from './Icons';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 200ms cubic-bezier(0.2, 0, 0, 1)',
  };

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'urgent':
        return {
          label: 'Khẩn cấp',
          className: 'bg-rose-100 text-rose-700 border-rose-200',
        };
      case 'high':
        return {
          label: 'Cao',
          className: 'bg-amber-100 text-amber-700 border-amber-200',
        };
      case 'medium':
        return {
          label: 'Trung bình',
          className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        };
      case 'low':
      default:
        return {
          label: 'Thấp',
          className: 'bg-slate-100 text-slate-700 border-slate-200',
        };
    }
  };

  const priorityBadge = getPriorityBadge(task.priority);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-white rounded-xl p-3.5 shadow-sm hover:shadow-md hover:border-emerald-300 border border-slate-200/90 transition-all duration-150 ${
        isDragging ? 'opacity-30 shadow-2xl border-emerald-500 scale-95 ring-2 ring-emerald-400' : ''
      }`}
    >
      {/* Top bar: Grip + ID + Priority + Actions */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <button
            type="button"
            {...attributes}
            {...listeners}
            aria-label={`Kéo thả sắp xếp công việc ${task.id}`}
            className="text-slate-400 hover:text-emerald-700 cursor-grab active:cursor-grabbing p-0.5 rounded hover:bg-emerald-50 transition-colors"
          >
            <GripVerticalIcon className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono font-semibold text-slate-500">
            {task.id}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${priorityBadge.className}`}
          >
            {priorityBadge.label}
          </span>

          <button
            type="button"
            onClick={() => onEdit(task)}
            aria-label={`Chỉnh sửa công việc ${task.title}`}
            className="p-1 text-slate-400 hover:text-emerald-600 rounded hover:bg-slate-100 transition-colors"
          >
            <EditIcon className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onDelete(task.id)}
            aria-label={`Xóa công việc ${task.title}`}
            className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-100 transition-colors"
          >
            <TrashIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Title & Link to detail */}
      <Link
        to={`/item/${task.id}`}
        className="block group/link"
      >
        <h4 className="text-sm font-semibold text-slate-900 group-hover/link:text-emerald-700 transition-colors flex items-start justify-between gap-1 leading-snug">
          <span>{task.title}</span>
          <ArrowUpRightIcon className="w-3.5 h-3.5 opacity-0 group-hover/link:opacity-100 transition-opacity flex-shrink-0 mt-0.5 text-emerald-600" />
        </h4>
      </Link>

      {/* Description */}
      <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
        {truncateText(task.description, 80)}
      </p>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2.5">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom Info: Budget + Date + Assignee */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-1 font-medium text-emerald-800"
            title="Ngân sách dự kiến"
          >
            <DollarSignIcon className="w-3.5 h-3.5 text-emerald-700" />
            <span>{formatCurrency(task.budget)}</span>
          </div>

          <div
            className="flex items-center gap-1 text-[11px]"
            title={`Hạn chót: ${task.dueDate}`}
          >
            <CalendarIcon className="w-3 h-3 text-slate-400" />
            <span>{task.dueDate}</span>
          </div>
        </div>

        <div className="flex items-center" title={`Phụ trách: ${task.assignee.name}`}>
          <img
            src={task.assignee.avatar}
            alt={`Ảnh đại diện của ${task.assignee.name}`}
            className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};
