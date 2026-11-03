import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus } from '../types/task';
import initialTasksData from '../data/data.json';
import { useToast } from './ToastContext';

const STORAGE_KEY = 'kanban_tasks_6651071094';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPriority: string;
  setSelectedPriority: (priority: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  allTags: string[];
  getTaskById: (id: string) => Task | undefined;
  createTask: (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Task;
  updateTask: (id: string, data: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, targetStatus: TaskStatus, targetIndex?: number) => void;
  reorderTasksInColumn: (status: TaskStatus, oldIndex: number, newIndex: number) => void;
  resetToDefault: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Task[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Bỏ qua lỗi parse và dùng dữ liệu mặc định
    }
    return initialTasksData as Task[];
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  // Lưu vào localStorage mỗi khi tasks thay đổi
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
      console.error('Không thể lưu dữ liệu vào localStorage');
    }
  }, [tasks]);

  // Trích xuất toàn bộ danh sách tags duy nhất
  const allTags = React.useMemo(() => {
    const set = new Set<string>();
    tasks.forEach((t) => t.tags.forEach((tag) => set.add(tag)));
    return Array.from(set).sort();
  }, [tasks]);

  // Lọc danh sách công việc theo tìm kiếm, độ ưu tiên và nhãn
  const filteredTasks = React.useMemo(() => {
    return tasks.filter((task) => {
      const matchQuery =
        searchQuery.trim() === '' ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.assignee.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchPriority =
        selectedPriority === 'all' || task.priority === selectedPriority;

      const matchTag =
        selectedTag === 'all' || task.tags.includes(selectedTag);

      return matchQuery && matchPriority && matchTag;
    });
  }, [tasks, searchQuery, selectedPriority, selectedTag]);

  const getTaskById = useCallback(
    (id: string) => {
      return tasks.find((t) => t.id === id);
    },
    [tasks]
  );

  const createTask = useCallback(
    (data: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task => {
      const newIdNumber =
        tasks.reduce((max, t) => {
          const match = t.id.match(/\d+/);
          const num = match ? parseInt(match[0], 10) : 0;
          return num > max ? num : max;
        }, 100) + 1;

      const now = new Date().toISOString();
      const newTask: Task = {
        ...data,
        id: `TASK-${newIdNumber}`,
        createdAt: now,
        updatedAt: now,
      };

      setTasks((prev) => [newTask, ...prev]);
      showToast('success', 'Thêm thành công', `Đã tạo công việc "${newTask.title}"`);
      return newTask;
    },
    [tasks, showToast]
  );

  const updateTask = useCallback(
    (id: string, data: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === id) {
            const updated: Task = {
              ...t,
              ...data,
              updatedAt: new Date().toISOString(),
            };
            return updated;
          }
          return t;
        })
      );
      showToast('success', 'Cập nhật thành công', 'Thông tin công việc đã được lưu');
    },
    [showToast]
  );

  const deleteTask = useCallback(
    (id: string) => {
      const target = tasks.find((t) => t.id === id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      showToast('info', 'Đã xóa công việc', target ? `Đã xóa "${target.title}"` : 'Công việc đã xóa');
    },
    [tasks, showToast]
  );

  const moveTask = useCallback(
    (taskId: string, targetStatus: TaskStatus, targetIndex?: number) => {
      setTasks((prev) => {
        const taskIndex = prev.findIndex((t) => t.id === taskId);
        if (taskIndex === -1) return prev;

        const currentTask = prev[taskIndex];

        const updatedTask: Task = {
          ...currentTask,
          status: targetStatus,
          updatedAt: new Date().toISOString(),
        };

        const copy = [...prev];
        copy.splice(taskIndex, 1);

        if (typeof targetIndex === 'number' && targetIndex >= 0) {
          let count = 0;
          let insertIndex = copy.length;
          for (let i = 0; i < copy.length; i++) {
            if (copy[i].status === targetStatus) {
              if (count === targetIndex) {
                insertIndex = i;
                break;
              }
              count++;
            }
          }
          copy.splice(insertIndex, 0, updatedTask);
        } else {
          const firstInStatus = copy.findIndex((t) => t.status === targetStatus);
          if (firstInStatus >= 0) {
            copy.splice(firstInStatus, 0, updatedTask);
          } else {
            copy.push(updatedTask);
          }
        }

        return copy;
      });
    },
    []
  );

  const reorderTasksInColumn = useCallback(
    (status: TaskStatus, oldIndex: number, newIndex: number) => {
      setTasks((prev) => {
        const columnTasks = prev.filter((t) => t.status === status);
        const [moved] = columnTasks.splice(oldIndex, 1);
        if (!moved) return prev;
        columnTasks.splice(newIndex, 0, moved);

        const result: Task[] = [];
        let colIdx = 0;
        for (const t of prev) {
          if (t.status === status) {
            result.push(columnTasks[colIdx++]);
          } else {
            result.push(t);
          }
        }
        return result;
      });
    },
    []
  );

  const resetToDefault = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setTasks(initialTasksData as Task[]);
    setSearchQuery('');
    setSelectedPriority('all');
    setSelectedTag('all');
    showToast('info', 'Khôi phục mẫu', 'Đã tải lại toàn bộ 24 công việc mẫu ban đầu');
  }, [showToast]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        searchQuery,
        setSearchQuery,
        selectedPriority,
        setSelectedPriority,
        selectedTag,
        setSelectedTag,
        allTags,
        getTaskById,
        createTask,
        updateTask,
        deleteTask,
        moveTask,
        reorderTasksInColumn,
        resetToDefault,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks phải được sử dụng bên trong TaskProvider');
  }
  return context;
};
