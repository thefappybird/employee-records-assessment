import { create } from 'zustand';
import type { Department } from '../types/employee';
import { DEFAULT_PAGE_SIZE } from '../utils/helpers';

// UI-only state: search/filter/pagination/modal state. Never mutates server data directly.
interface EmployeeUIState {
  searchTerm: string;
  selectedDepartments: Department[];
  currentPage: number;
  pageSize: number;
  isFormModalOpen: boolean;
  editingEmployeeId: number | null;
  deleteConfirmId: number | null;

  setSearchTerm: (term: string) => void;
  toggleDepartment: (dept: Department) => void;
  clearDepartmentFilter: () => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  openCreateModal: () => void;
  openEditModal: (id: number) => void;
  closeFormModal: () => void;
  requestDelete: (id: number) => void;
  cancelDelete: () => void;
}

// Stable empty-array reference so it never breaks a useMemo dependency check.
const EMPTY_DEPARTMENTS: Department[] = [];

export const useEmployeeUIStore = create<EmployeeUIState>((set) => ({
  searchTerm: '',
  selectedDepartments: EMPTY_DEPARTMENTS,
  currentPage: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  isFormModalOpen: false,
  editingEmployeeId: null,
  deleteConfirmId: null,

  setSearchTerm: (term) => set({ searchTerm: term, currentPage: 1 }),
  toggleDepartment: (dept) =>
    set((state) => ({
      selectedDepartments: state.selectedDepartments.includes(dept)
        ? state.selectedDepartments.filter((d) => d !== dept)
        : [...state.selectedDepartments, dept],
      currentPage: 1,
    })),
  clearDepartmentFilter: () => set({ selectedDepartments: EMPTY_DEPARTMENTS, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size, currentPage: 1 }),
  openCreateModal: () => set({ isFormModalOpen: true, editingEmployeeId: null }),
  openEditModal: (id) => set({ isFormModalOpen: true, editingEmployeeId: id }),
  closeFormModal: () => set({ isFormModalOpen: false, editingEmployeeId: null }),
  requestDelete: (id) => set({ deleteConfirmId: id }),
  cancelDelete: () => set({ deleteConfirmId: null }),
}));
