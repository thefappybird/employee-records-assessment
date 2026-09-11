import { memo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Department, EmployeeStatus, Employee, Role } from '../types/employee';
import { useEmployeeUIStore } from '../store/employeeUIStore';
import { getFullName } from '../utils/helpers';
import Loading from './Loading';
import EmptyState from './EmptyState';

interface EmployeeTableProps {
  employees: Employee[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  emptyMessage?: string;
}

interface EmployeeRowProps {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: Department;
  role: Role;
  status: EmployeeStatus;
}

const ROW_HEIGHT = 56;

// Primitive props only, so React.memo's shallow comparison actually skips re-renders.
const EmployeeRow = memo(function EmployeeRow({
  id,
  firstName,
  lastName,
  email,
  department,
  role,
  status,
}: EmployeeRowProps) {
  const openEditModal = useEmployeeUIStore((state) => state.openEditModal);
  const requestDelete = useEmployeeUIStore((state) => state.requestDelete);

  return (
    <div
      className="grid grid-cols-[60px_1.5fr_2fr_1fr_1.3fr_1fr_auto] items-center gap-3 border-b border-slate-blue/15 px-4 text-sm text-dark-slate"
      style={{ height: ROW_HEIGHT }}
    >
      <span>{id}</span>
      <span className="truncate">{getFullName({ firstName, lastName })}</span>
      <span className="truncate">{email}</span>
      <span className="truncate">{department}</span>
      <span className="truncate">{role}</span>
      <span>{status}</span>
      <span className="flex gap-2">
        <button
          type="button"
          onClick={() => openEditModal(id)}
          className="rounded-btn bg-slate-blue px-2.5 py-1 text-xs font-medium text-white hover:opacity-90"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => requestDelete(id)}
          className="rounded-btn bg-dark-slate px-2.5 py-1 text-xs font-medium text-white hover:opacity-90"
        >
          Delete
        </button>
      </span>
    </div>
  );
});

export default function EmployeeTable({
  employees,
  isLoading,
  isError,
  errorMessage,
  emptyMessage = 'No employees found.',
}: EmployeeTableProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Virtualized per Section 9 requirement — wired for correctness even at ~10 rows/page.
  const virtualizer = useVirtualizer({
    count: employees.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  });

  if (isLoading) {
    return <Loading message="Loading employees…" />;
  }

  if (isError) {
    return (
      <div className="rounded-none border border-dark-slate/30 bg-white px-4 py-6 text-sm text-dark-slate">
        {errorMessage ?? 'Something went wrong while loading employees.'}
      </div>
    );
  }

  if (employees.length === 0) {
    return <EmptyState message={emptyMessage} />;
  }

  const virtualItems = virtualizer.getVirtualItems();

  return (
    <div className="overflow-hidden rounded-none border border-slate-blue/20 bg-white">
      <div className="grid grid-cols-[60px_1.5fr_2fr_1fr_1.3fr_1fr_auto] gap-3 border-b border-slate-blue/30 bg-soft-gray px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-blue">
        <span>ID</span>
        <span>Name</span>
        <span>Email</span>
        <span>Department</span>
        <span>Role</span>
        <span>Status</span>
        <span>Actions</span>
      </div>
      <div ref={scrollRef} className="max-h-[520px] overflow-y-auto">
        <div className="relative w-full" style={{ height: virtualizer.getTotalSize() }}>
          {virtualItems.map((virtualRow) => {
            const employee = employees[virtualRow.index];
            return (
              <div
                key={employee.id}
                className="absolute left-0 top-0 w-full"
                style={{ transform: `translateY(${virtualRow.start}px)` }}
              >
                <EmployeeRow
                  id={employee.id}
                  firstName={employee.firstName}
                  lastName={employee.lastName}
                  email={employee.email}
                  department={employee.department}
                  role={employee.role}
                  status={employee.status}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
