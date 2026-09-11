import { DEPARTMENTS } from '../types/employee';
import { useEmployeeUIStore } from '../store/employeeUIStore';

// Multi-select department filter, self-contained against the UI store.
export default function FilterPanel() {
  const selectedDepartments = useEmployeeUIStore((state) => state.selectedDepartments);
  const toggleDepartment = useEmployeeUIStore((state) => state.toggleDepartment);
  const clearDepartmentFilter = useEmployeeUIStore((state) => state.clearDepartmentFilter);

  return (
    <div className="rounded-none border border-slate-blue/30 bg-white p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-dark-slate">Department</span>
        <button
          type="button"
          onClick={clearDepartmentFilter}
          disabled={selectedDepartments.length === 0}
          className="rounded-btn px-2 py-1 text-xs font-medium text-slate-blue hover:text-primary-teal disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-slate-blue"
        >
          Clear filters
        </button>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
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
  );
}
