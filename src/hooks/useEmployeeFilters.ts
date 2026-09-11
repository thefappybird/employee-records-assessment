import { useMemo } from 'react';
import type { Employee } from '../types/employee';
import { useEmployeeUIStore } from '../store/employeeUIStore';
import { getFullName } from '../utils/helpers';

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
  const pageSize = useEmployeeUIStore((state) => state.pageSize);

  const filteredAll = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    return employees
      .filter((employee) => {
        const matchesSearch =
          term.length === 0 ||
          getFullName(employee).toLowerCase().includes(term) ||
          employee.email.toLowerCase().includes(term) ||
          employee.role.toLowerCase().includes(term);

        const matchesDepartment =
          selectedDepartments.length === 0 || selectedDepartments.includes(employee.department);

        return matchesSearch && matchesDepartment;
      })
      // Newest first, so a just-created employee lands on page 1 instead of the end of the list.
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [employees, searchTerm, selectedDepartments]);

  const totalCount = filteredAll.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  const pageItems = useMemo(() => {
    const safePage = Math.min(currentPage, totalPages);
    const start = (safePage - 1) * pageSize;
    return filteredAll.slice(start, start + pageSize);
  }, [filteredAll, currentPage, totalPages, pageSize]);

  return { pageItems, filteredAll, totalCount, totalPages };
}
