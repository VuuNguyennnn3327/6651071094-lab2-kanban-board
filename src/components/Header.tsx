import React, { useState, useMemo, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { debounce } from '../utils';
import {
  KanbanIcon,
  SearchIcon,
  PlusIcon,
  RotateCcwIcon,
  FilterIcon,
  CheckCircleIcon,
  XIcon,
} from './Icons';

interface HeaderProps {
  onOpenCreateModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCreateModal }) => {
  const {
    tasks,
    searchQuery,
    setSearchQuery,
    selectedPriority,
    setSelectedPriority,
    selectedTag,
    setSelectedTag,
    allTags,
    resetToDefault,
  } = useTasks();

  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Áp dụng debounce cho ô tìm kiếm theo đúng mục tiêu của hàm debounce trong utils
  const debouncedSetSearch = useMemo(
    () =>
      debounce((val: string) => {
        setSearchQuery(val);
      }, 300),
    [setSearchQuery]
  );

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalSearch(val);
    debouncedSetSearch(val);
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    setSearchQuery('');
  };

  const completedCount = tasks.filter((t) => t.status === 'done').length;
  const progressPercent =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        {/* Top row: Brand + Student ID + Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center">
              <KanbanIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  Kanban Flow
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  v2.0
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Quản lý công việc cá nhân hóa •{' '}
                <span className="text-emerald-700 font-semibold">
                  Nguyễn Trường Vũ (6651071094)
                </span>
              </p>
            </div>
          </div>

          {/* Quick stats & action buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Tiến độ tổng thể */}
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
              <CheckCircleIcon className="w-4 h-4 text-emerald-600" />
              <div>
                <span className="text-slate-500">Tiến độ:</span>{' '}
                <span className="font-bold text-slate-800">
                  {completedCount}/{tasks.length} ({progressPercent}%)
                </span>
              </div>
            </div>

            {/* Nút khôi phục dữ liệu mẫu */}
            <button
              type="button"
              onClick={resetToDefault}
              title="Khôi phục lại danh sách 24 công việc mẫu ban đầu"
              aria-label="Khôi phục 24 công việc mẫu"
              className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <RotateCcwIcon className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Khôi phục 24 thẻ</span>
            </button>

            {/* Nút tạo mới công việc */}
            {onOpenCreateModal && (
              <button
                type="button"
                onClick={onOpenCreateModal}
                aria-label="Tạo mới công việc"
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all flex items-center gap-1.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Thêm công việc</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter bar: Search + Priority + Tag */}
        <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Ô tìm kiếm có debounce 300ms */}
          <div className="relative flex-1 max-w-md">
            <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={handleSearchChange}
              placeholder="Tìm kiếm công việc theo tiêu đề, mô tả hoặc người làm..."
              className="w-full pl-9 pr-8 py-1.5 text-xs rounded-lg border border-slate-200 bg-slate-50/60 focus:bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 focus:outline-none transition-colors"
            />
            {localSearch && (
              <button
                type="button"
                onClick={handleClearSearch}
                aria-label="Xóa nội dung tìm kiếm"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <XIcon className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Bộ lọc Dropdowns */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <FilterIcon className="w-3.5 h-3.5" />
              <span>Lọc:</span>
            </div>

            {/* Lọc theo mức ưu tiên */}
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              aria-label="Lọc theo mức độ ưu tiên"
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:border-emerald-600 focus:outline-none"
            >
              <option value="all">Tất cả ưu tiên</option>
              <option value="urgent">Khẩn cấp</option>
              <option value="high">Cao</option>
              <option value="medium">Bình thường</option>
              <option value="low">Thấp</option>
            </select>

            {/* Lọc theo nhãn Tag */}
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              aria-label="Lọc theo nhãn tag"
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:border-emerald-600 focus:outline-none max-w-[150px] truncate"
            >
              <option value="all">Tất cả nhãn ({allTags.length})</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  #{tag}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
