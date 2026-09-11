import { useEffect, useRef, useState } from 'react';
import { DEPARTMENTS } from '../types/employee';
import { useEmployeeUIStore } from '../store/employeeUIStore';

// Multi-select department filter as a button + popup (sharp edges), self-contained against the UI store.
export default function FilterPanel() {
  const selectedDepartments = useEmployeeUIStore((state) => state.selectedDepartments);
  const toggleDepartment = useEmployeeUIStore((state) => state.toggleDepartment);
  const clearDepartmentFilter = useEmployeeUIStore((state) => state.clearDepartmentFilter);

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click — only listens while the popup is actually open.
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const activeCount = selectedDepartments.length;

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className="flex items-center gap-2 rounded-btn border border-slate-blue/40 bg-white px-3 py-2 text-sm text-dark-slate hover:bg-soft-gray"
      >
        Department
        {activeCount > 0 && (
          <span className="rounded-full bg-primary-teal px-1.5 py-0.5 text-xs font-medium text-white">
            {activeCount}
          </span>
        )}
        <span aria-hidden="true" className="text-xs text-slate-blue">
          ▾
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-20 mt-1 w-56 rounded-none border border-slate-blue/30 bg-white p-3 shadow-lg">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-dark-slate">Filter by department</span>
            <button
              type="button"
              onClick={clearDepartmentFilter}
              disabled={activeCount === 0}
              className="rounded-btn px-2 py-1 text-xs font-medium text-slate-blue hover:text-primary-teal disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-slate-blue"
            >
              Clear
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {DEPARTMENTS.map((department) => (
              <label
                key={department}
                className="flex cursor-pointer items-center gap-2 text-sm text-dark-slate"
              >
                <input
                  type="checkbox"
                  checked={selectedDepartments.includes(department)}
                  onChange={() => toggleDepartment(department)}
                  className="h-4 w-4 accent-primary-teal"
                />
                {department}
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
