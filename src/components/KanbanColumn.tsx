import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task, TaskStatus } from '../types/task';
import { TaskCard } from './TaskCard';
import { PlusIcon } from './Icons';

interface KanbanColumnProps {
  id: TaskStatus;
  title: string;
  description: string;
  badgeColor: string;
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  id,
  title,
  description,
  badgeColor,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      type: 'Column',
      status: id,
    },
  });

  const taskIds = tasks.map((t) => t.id);

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col bg-slate-100/80 rounded-2xl p-3 sm:p-4 border border-slate-200/80 min-h-[550px] transition-colors ${
        isOver ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-300' : ''
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${badgeColor}`} />
            <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white text-slate-600 shadow-sm border border-slate-200">
              {tasks.length}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">{description}</p>
        </div>

        <button
          type="button"
          onClick={() => onAddTask(id)}
          aria-label={`Thêm công việc vào cột ${title}`}
          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200 shadow-sm"
        >
          <PlusIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Task List (Sortable Droppable) */}
      <div className="flex-1 flex flex-col gap-3 py-3 overflow-y-auto">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl text-center">
            <p className="text-xs text-slate-400">Không có công việc nào</p>
            <button
              type="button"
              onClick={() => onAddTask(id)}
              className="mt-2 text-xs font-medium text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              + Tạo công việc mới
            </button>
          </div>
        )}
      </div>

      {/* Bottom quick add button */}
      <button
        type="button"
        onClick={() => onAddTask(id)}
        className="w-full py-2 px-3 border border-dashed border-slate-300 rounded-xl text-xs font-medium text-slate-500 hover:text-emerald-700 hover:border-emerald-500 hover:bg-white/80 transition-all flex items-center justify-center gap-1.5 mt-2 shadow-sm"
      >
        <PlusIcon className="w-3.5 h-3.5" />
        <span>Thêm thẻ</span>
      </button>
    </div>
  );
};
