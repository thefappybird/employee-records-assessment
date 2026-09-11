import { useMemo } from 'react';
import type { Employee } from '../types/employee';
import { useEmployeeUIStore } from '../store/employeeUIStore';
import { PAGE_SIZE, getFullName } from '../utils/helpers';

interface EmployeeFiltersResult {
  pageItems: Employee[];
  filteredAll: Employee[];
  totalCount: number;
  totalPages: number;
}

// Single derivation point: search+department filter, then paginate. No duplicated state.
export function useEmployeeFilters(employees: Employee[]): EmployeeFiltersResult {
  const searchTerm = useEmployeeUIStore((state) => state.searchTerm);
  const selectedDepartments = useEmployeeUIStore((state) => state.selectedDepartments);
  const currentPage = useEmployeeUIStore((state) => state.currentPage);

  const filteredAll = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return employees.filter((employee) => {
      const matchesSearch =
        term.length === 0 ||
        getFullName(employee).toLowerCase().includes(term) ||
        employee.email.toLowerCase().includes(term) ||
        employee.role.toLowerCase().includes(term);

      const matchesDepartment =
        selectedDepartments.length === 0 || selectedDepartments.includes(employee.department);

      return matchesSearch && matchesDepartment;
    });
  }, [employees, searchTerm, selectedDepartments]);

  const totalCount = filteredAll.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const pageItems = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * PAGE_SIZE;
    return filteredAll.slice(start, start + PAGE_SIZE);
  }, [filteredAll, currentPage, totalPages]);

  return { pageItems, filteredAll, totalCount, totalPages };
}
