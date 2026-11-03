import React, { useState } from 'react';
import { Header } from '../components/Header';
import { KanbanBoard } from '../components/KanbanBoard';
import { TaskModal } from '../components/TaskModal';
import { useTasks } from '../context/TaskContext';
import { Task } from '../types/task';

export const ListPage: React.FC = () => {
  const { createTask } = useTasks();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateTask = (
    data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    createTask(data);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header điều hướng chính */}
      <Header onOpenCreateModal={() => setIsCreateModalOpen(true)} />

      {/* Nội dung bảng Kanban */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <KanbanBoard />
      </main>

      {/* Modal tạo nhanh từ Header */}
      <TaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTask}
        defaultStatus="todo"
      />
    </div>
  );
};
