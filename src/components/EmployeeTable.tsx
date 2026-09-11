import { memo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { Department, EmployeeStatus, Employee, Role } from '../types/employee';
import { useEmployeeUIStore } from '../store/employeeUIStore';
import { getFullName, statusPillClass } from '../utils/helpers';
import TableSkeleton from './TableSkeleton';
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
// Keep the action track fixed: an `auto` track is narrower for the header label than for
// the row's Edit/Delete controls, which makes the fractional column widths diverge.
const GRID_COLUMNS = 'grid-cols-[60px_1.5fr_2fr_1fr_1.3fr_1fr_94px]';

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
      className={`grid ${GRID_COLUMNS} items-center justify-items-start gap-3 border-b border-slate-blue/15 px-4 text-left text-sm text-dark-slate`}
      style={{ height: ROW_HEIGHT }}
    >
      <span>{id}</span>
      <span className="truncate">{getFullName({ firstName, lastName })}</span>
      <span className="truncate">{email}</span>
      <span className="truncate">{department}</span>
      <span className="truncate">{role}</span>
      <span>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusPillClass(status)}`}>
          {status}
        </span>
      </span>
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

// Mobile equivalent of EmployeeRow — same primitive props, card layout with department/role/status as pills.
const EmployeeCard = memo(function EmployeeCard({
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
    <div className="rounded-none border border-slate-blue/15 bg-white p-3 text-sm text-dark-slate">
      <div className="mb-1 flex items-start justify-between gap-2">
        <span className="font-medium">{getFullName({ firstName, lastName })}</span>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusPillClass(status)}`}>
          {status}
        </span>
      </div>
      <p className="mb-2 truncate text-slate-blue">{email}</p>
      <div className="mb-3 flex flex-wrap gap-1.5">
        <span className="rounded-full border border-slate-blue/30 bg-soft-gray px-2 py-0.5 text-xs text-dark-slate">
          {department}
        </span>
        <span className="rounded-full border border-slate-blue/30 bg-soft-gray px-2 py-0.5 text-xs text-dark-slate">
          {role}
        </span>
        <span className="rounded-full border border-slate-blue/30 bg-soft-gray px-2 py-0.5 text-xs text-dark-slate">
          ID #{id}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => openEditModal(id)}
          className="rounded-btn bg-slate-blue px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => requestDelete(id)}
          className="rounded-btn bg-dark-slate px-3 py-1.5 text-xs font-medium text-white hover:opacity-90"
        >
          Delete
        </button>
      </div>
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

  // Virtualized per Section 9 requirement. Dynamic sizing (measureElement) since the desktop
  // row and mobile card render at different heights from the same virtualizer instance.
  const virtualizer = useVirtualizer({
    count: employees.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  });

  if (isLoading) {
    return <TableSkeleton />;
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
      {/* Header lives inside the same scroll container as the rows (not a sibling) so both share
          the exact same content width — a header outside the scrollbar's width would drift out of
          alignment with the rows the further right a column sits. */}
      <div ref={scrollRef} className="max-h-[520px] overflow-auto">
        <div className="min-[769px]:min-w-[1120px]">
          <div
            className={`sticky top-0 z-10 hidden ${GRID_COLUMNS} items-center justify-items-start gap-3 border-b border-slate-blue/30 bg-soft-gray px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-blue min-[769px]:grid`}
          >
            <span>ID</span>
            <span>Name</span>
            <span>Email</span>
            <span>Department</span>
            <span>Role</span>
            <span>Status</span>
            <span>Actions</span>
          </div>
          <div className="relative w-full" style={{ height: virtualizer.getTotalSize() }}>
          {virtualItems.map((virtualRow) => {
            const employee = employees[virtualRow.index];
            return (
              <div
                key={employee.id}
                ref={virtualizer.measureElement}
                data-index={virtualRow.index}
                className="absolute left-0 top-0 w-full"
                style={{ transform: `translateY(${virtualRow.start}px)` }}
              >
                <div className="hidden min-[769px]:block">
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
                <div className="p-2 min-[769px]:hidden">
                  <EmployeeCard
                    id={employee.id}
                    firstName={employee.firstName}
                    lastName={employee.lastName}
                    email={employee.email}
                    department={employee.department}
                    role={employee.role}
                    status={employee.status}
                  />
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </div>
  );
}
