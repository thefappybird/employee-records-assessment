// Shared small helpers — pagination constants and derived-field getters.
import type { EmployeeStatus } from '../types/employee';

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 30, 50] as const;

// Derived "Name" column — never store this, always compute from firstName/lastName.
export function getFullName(employee: { firstName: string; lastName: string }): string {
  return `${employee.firstName} ${employee.lastName}`.replace(/\s+/g, ' ').trim();
}

// Status -> pill classes, built only from the 5-color palette (no new hues introduced).
export function statusPillClass(status: EmployeeStatus): string {
  switch (status) {
    case 'Active':
      return 'bg-primary-teal/10 text-primary-teal';
    case 'On Leave':
      return 'bg-slate-blue/10 text-slate-blue';
    case 'Inactive':
      return 'bg-dark-slate/10 text-dark-slate';
  }
}
