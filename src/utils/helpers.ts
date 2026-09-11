// Shared small helpers — pagination constant and derived-field getters.

export const PAGE_SIZE = 10;

// Derived "Name" column — never store this, always compute from firstName/lastName.
export function getFullName(employee: { firstName: string; lastName: string }): string {
  return `${employee.firstName} ${employee.lastName}`.replace(/\s+/g, ' ').trim();
}
