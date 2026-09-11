// Shared contract — frozen before subagent dispatch, do not edit without updating all consumers.

export const DEPARTMENTS = [
  'Engineering',
  'Sales',
  'Marketing',
  'HR',
  'Finance',
  'Support',
  'Operations',
] as const;
export type Department = (typeof DEPARTMENTS)[number];

export const ROLES = [
  'Software Engineer',
  'Senior Engineer',
  'Engineering Manager',
  'Product Manager',
  'Sales Executive',
  'Account Manager',
  'Marketing Specialist',
  'HR Coordinator',
  'Financial Analyst',
  'Support Specialist',
  'Operations Lead',
] as const;
export type Role = (typeof ROLES)[number];

export const EMPLOYEE_STATUSES = ['Active', 'Inactive', 'On Leave'] as const;
export type EmployeeStatus = (typeof EMPLOYEE_STATUSES)[number];

// firstName/lastName are the source of truth; "Name" columns are derived (see utils/helpers.ts).
export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: Department;
  role: Role;
  status: EmployeeStatus;
  createdAt: string;
}

export type NewEmployeeInput = Omit<Employee, 'id' | 'createdAt'>;
export type UpdateEmployeeInput = Partial<NewEmployeeInput>;
