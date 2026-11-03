import React, { useState, useRef } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Task, TaskStatus, ColumnDef } from '../types/task';
import { useTasks } from '../context/TaskContext';
import { useToast } from '../context/ToastContext';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import { ConfirmDialog } from './ConfirmDialog';

const COLUMNS: ColumnDef[] = [
  {
    id: 'todo',
    title: 'Cần làm (To Do)',
    description: 'Nhiệm vụ mới tiếp nhận và lên kế hoạch',
    badgeColor: 'bg-slate-400',
  },
  {
    id: 'in-progress',
    title: 'Đang làm (In Progress)',
    description: 'Đang trong quá trình triển khai mã nguồn',
    badgeColor: 'bg-emerald-500',
  },
  {
    id: 'review',
    title: 'Chờ duyệt (Review)',
    description: 'Chờ kiểm thử và Code Review',
    badgeColor: 'bg-amber-500',
  },
  {
    id: 'done',
    title: 'Hoàn thành (Done)',
    description: 'Đã nghiệm thu và triển khai sản phẩm',
    badgeColor: 'bg-emerald-700',
  },
];

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'Cần làm (To Do)',
  'in-progress': 'Đang làm (In Progress)',
  review: 'Chờ duyệt (Review)',
  done: 'Hoàn thành (Done)',
};

export const KanbanBoard: React.FC = () => {
  const {
    filteredTasks,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTasksInColumn,
  } = useTasks();

  const { showToast } = useToast();

  // Mobile active tab view (< 640px)
  const [activeMobileColumn, setActiveMobileColumn] = useState<TaskStatus>('todo');

  // Drag and drop state
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const dragInitialStatus = useRef<TaskStatus | null>(null);

  // Modal create/edit state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [targetColumnStatus, setTargetColumnStatus] = useState<TaskStatus>('todo');

  // Confirm delete dialog state
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Cấu hình Sensor mượt mà cho dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4, // Ngưỡng kích hoạt mượt mà
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = filteredTasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
      dragInitialStatus.current = task.status;
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveTask) return;

    const currentTask = filteredTasks.find((t) => t.id === activeId);
    if (!currentTask) return;

    // Kéo vào một Cột rỗng
    if (isOverColumn) {
      const targetColStatus = over.data.current?.status as TaskStatus;
      if (currentTask.status !== targetColStatus) {
        moveTask(activeId, targetColStatus);
      }
      return;
    }

    // Kéo vào một Thẻ khác ở cột khác
    if (isOverTask) {
      const overTask = filteredTasks.find((t) => t.id === overId);
      if (overTask && currentTask.status !== overTask.status) {
        moveTask(activeId, overTask.status);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const currentActiveTask = activeTask;
    setActiveTask(null);

    if (!over || !currentActiveTask) return;

    const activeId = String(active.id);
    const overId = String(over.id);

    const currentTask = filteredTasks.find((t) => t.id === activeId);
    const overTask = filteredTasks.find((t) => t.id === overId);

    // Sắp xếp lại thứ tự trong cùng một cột
    if (currentTask && overTask && currentTask.status === overTask.status) {
      const columnTasks = filteredTasks.filter((t) => t.status === currentTask.status);
      const oldIndex = columnTasks.findIndex((t) => t.id === activeId);
      const newIndex = columnTasks.findIndex((t) => t.id === overId);

      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        reorderTasksInColumn(currentTask.status, oldIndex, newIndex);
      }
    }

    // Chỉ bắn đúng 1 thông báo nhẹ nhàng khi thẻ thực sự được chuyển sang cột khác sau khi thả chuột
    if (
      currentTask &&
      dragInitialStatus.current &&
      currentTask.status !== dragInitialStatus.current
    ) {
      showToast(
        'success',
        'Đã chuyển trạng thái',
        `Chuyển sang ${STATUS_LABELS[currentTask.status]}`,
        1800
      );
    }

    dragInitialStatus.current = null;
  };

  // Mở modal tạo mới
  const handleOpenCreateModal = (status: TaskStatus = 'todo') => {
    setEditingTask(null);
    setTargetColumnStatus(status);
    setIsModalOpen(true);
  };

  // Mở modal chỉnh sửa
  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setTargetColumnStatus(task.status);
    setIsModalOpen(true);
  };

  // Xử lý submit modal
  const handleModalSubmit = (
    data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    if (editingTask) {
      updateTask(editingTask.id, data);
    } else {
      createTask(data);
    }
  };

  // Xử lý xác nhận xóa
  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete);
      setTaskToDelete(null);
    }
  };

  return (
    <div className="w-full">
      {/* Mobile Tab Navigation (< 640px): 1 Cột chuẩn responsive */}
      <div className="sm:hidden mb-4 bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex">
        {COLUMNS.map((col) => {
          const count = filteredTasks.filter((t) => t.status === col.id).length;
          const isActive = activeMobileColumn === col.id;
          return (
            <button
              key={col.id}
              type="button"
              onClick={() => setActiveMobileColumn(col.id)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex flex-col items-center justify-center gap-0.5 ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{col.title.split(' ')[0]}</span>
              <span
                className={`text-[10px] px-1.5 rounded-full ${
                  isActive
                    ? 'bg-emerald-700 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* Responsive Layout:
            < 640px: hiển thị cột active (1 cột)
            640px - 1024px: tablet (grid-cols-2)
            > 1024px: desktop (grid-cols-4)
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 items-start">
          {COLUMNS.map((column) => {
            const columnTasks = filteredTasks.filter((t) => t.status === column.id);
            const isHiddenOnMobile = activeMobileColumn !== column.id;

            return (
              <div
                key={column.id}
                className={`${isHiddenOnMobile ? 'hidden sm:block' : 'block'} transition-opacity duration-200`}
              >
                <KanbanColumn
                  id={column.id}
                  title={column.title}
                  description={column.description}
                  badgeColor={column.badgeColor}
                  tasks={columnTasks}
                  onAddTask={handleOpenCreateModal}
                  onEditTask={handleOpenEditModal}
                  onDeleteTask={(id) => setTaskToDelete(id)}
                />
              </div>
            );
          })}
        </div>

        {/* Drag Overlay mượt mà và trực quan */}
        <DragOverlay dropAnimation={{ duration: 180, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
          {activeTask ? (
            <div className="w-72 sm:w-80 shadow-2xl rounded-xl ring-2 ring-emerald-500 scale-105 rotate-1 opacity-95 pointer-events-none cursor-grabbing">
              <TaskCard
                task={activeTask}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Modal Tạo/Sửa Task */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialTask={editingTask}
        defaultStatus={targetColumnStatus}
      />

      {/* Hộp thoại xác nhận xóa */}
      <ConfirmDialog
        isOpen={Boolean(taskToDelete)}
        title="Xóa công việc"
        message="Bạn có chắc chắn muốn xóa công việc này khỏi bảng Kanban không? Thao tác này không thể hoàn tác."
        confirmLabel="Xóa vĩnh viễn"
        cancelLabel="Hủy"
        onConfirm={handleConfirmDelete}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  );
};
