import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { TaskStatus, TaskPriority, Task } from '../types/task';
import { formatCurrency } from '../utils';
import { TaskModal } from '../components/TaskModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import {
  ArrowLeftIcon,
  CalendarIcon,
  DollarSignIcon,
  UserIcon,
  MailIcon,
  TagIcon,
  ClockIcon,
  EditIcon,
  TrashIcon,
  AlertCircleIcon,
} from '../components/Icons';

export const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTaskById, updateTask, deleteTask } = useTasks();

  const task = id ? getTaskById(id) : undefined;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (!task) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircleIcon className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Không tìm thấy công việc</h2>
          <p className="text-sm text-slate-600 mt-2">
            Mã công việc <span className="font-mono font-semibold text-slate-800">{id}</span> không tồn tại hoặc đã bị xóa.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>Quay lại bảng Kanban</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'urgent':
        return { label: 'Khẩn cấp', className: 'bg-rose-100 text-rose-700 border-rose-200' };
      case 'high':
        return { label: 'Cao', className: 'bg-amber-100 text-amber-700 border-amber-200' };
      case 'medium':
        return { label: 'Trung bình', className: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'low':
      default:
        return { label: 'Thấp', className: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const getStatusBadge = (s: TaskStatus) => {
    switch (s) {
      case 'done':
        return { label: 'Hoàn thành (Done)', className: 'bg-emerald-600 text-white' };
      case 'review':
        return { label: 'Chờ duyệt (Review)', className: 'bg-amber-500 text-white' };
      case 'in-progress':
        return { label: 'Đang làm (In Progress)', className: 'bg-emerald-500 text-white' };
      case 'todo':
      default:
        return { label: 'Cần làm (To Do)', className: 'bg-slate-500 text-white' };
    }
  };

  const priorityBadge = getPriorityBadge(task.priority);
  const statusBadge = getStatusBadge(task.status);

  const handleStatusChange = (newStatus: TaskStatus) => {
    updateTask(task.id, { status: newStatus });
  };

  const handleEditSubmit = (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    updateTask(task.id, data);
  };

  const handleDeleteConfirm = () => {
    deleteTask(task.id);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 hover:text-emerald-800 transition-colors bg-white px-3.5 py-1.5 rounded-lg border border-slate-200 shadow-sm"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Quay lại Bảng Kanban</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              aria-label="Chỉnh sửa chi tiết công việc"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg shadow-sm transition-colors"
            >
              <EditIcon className="w-3.5 h-3.5 text-emerald-600" />
              <span>Chỉnh sửa</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDeleteDialogOpen(true)}
              aria-label="Xóa công việc này"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 bg-white border border-slate-200 hover:bg-rose-50 rounded-lg shadow-sm transition-colors"
            >
              <TrashIcon className="w-3.5 h-3.5" />
              <span>Xóa</span>
            </button>
          </div>
        </div>

        {/* Main Task Card */}
        <article className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-slate-100 bg-emerald-50/30">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="font-mono text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                {task.id}
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${priorityBadge.className}`}
              >
                Ưu tiên: {priorityBadge.label}
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusBadge.className}`}
              >
                {statusBadge.label}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {task.title}
            </h1>

            {/* Quick status selector */}
            <div className="mt-5 pt-4 border-t border-emerald-100/60 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-medium text-slate-600">
                Chuyển nhanh trạng thái:
              </span>
              {(['todo', 'in-progress', 'review', 'done'] as TaskStatus[]).map(
                (st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleStatusChange(st)}
                    className={`text-xs px-2.5 py-1 rounded-md transition-colors font-medium ${
                      task.status === st
                        ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {st === 'todo' && 'Cần làm'}
                    {st === 'in-progress' && 'Đang làm'}
                    {st === 'review' && 'Chờ duyệt'}
                    {st === 'done' && 'Hoàn thành'}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Mô tả công việc
              </h3>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                {task.description || 'Chưa có mô tả chi tiết cho công việc này.'}
              </div>
            </div>

            {/* Grid Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Ngân sách */}
              <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100 flex items-start gap-3">
                <div className="p-2.5 bg-emerald-600 text-white rounded-lg">
                  <DollarSignIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium">Ngân sách dự kiến</span>
                  <p className="text-lg font-bold text-emerald-900 mt-0.5">
                    {formatCurrency(task.budget)}
                  </p>
                </div>
              </div>

              {/* Hạn chót */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 flex items-start gap-3">
                <div className="p-2.5 bg-slate-700 text-white rounded-lg">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 font-medium">Hạn hoàn thành (Deadline)</span>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">
                    {task.dueDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Assignee Information */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Người phụ trách
              </h3>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <img
                  src={task.assignee.avatar}
                  alt={`Ảnh chân dung của ${task.assignee.name}`}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/30"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <UserIcon className="w-4 h-4 text-emerald-600" />
                    <span>{task.assignee.name}</span>
                  </h4>
                  <a
                    href={`mailto:${task.assignee.email}`}
                    className="text-xs text-slate-500 hover:text-emerald-700 transition-colors flex items-center gap-1.5 mt-0.5"
                  >
                    <MailIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>{task.assignee.email}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Nhãn phân loại (Tags)
              </h3>
              <div className="flex items-center gap-2 flex-wrap">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-xs font-medium bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200"
                  >
                    <TagIcon className="w-3 h-3" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Metadata Timestamps */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-400 gap-2">
              <div className="flex items-center gap-1">
                <ClockIcon className="w-3.5 h-3.5" />
                <span>
                  Ngày tạo: {new Date(task.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>
              <div>
                Cập nhật lần cuối:{' '}
                {new Date(task.updatedAt).toLocaleString('vi-VN')}
              </div>
            </div>
          </div>
        </article>
      </div>

      {/* Edit Modal */}
      <TaskModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        initialTask={task}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Xóa công việc"
        message={`Bạn có chắc chắn muốn xóa "${task.title}" không?`}
        confirmLabel="Xóa công việc"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsDeleteDialogOpen(false)}
      />
    </div>
  );
};
