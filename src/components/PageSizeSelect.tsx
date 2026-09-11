import { useEmployeeUIStore } from '../store/employeeUIStore';
import { PAGE_SIZE_OPTIONS } from '../utils/helpers';

// Compact row-limit control — sits beside the "Showing X–Y of Z" range text in Pagination.
// Lets a smaller dataset still visibly exercise virtualization (e.g. a limit of 50).
export default function PageSizeSelect() {
  const pageSize = useEmployeeUIStore((state) => state.pageSize);
  const setPageSize = useEmployeeUIStore((state) => state.setPageSize);

  return (
    <div className="relative inline-flex items-center">
      <select
        id="page-size"
        aria-label="Rows per page"
        value={pageSize}
        onChange={(event) => setPageSize(Number(event.target.value))}
        className="appearance-none rounded-btn border border-slate-blue/40 bg-white py-1.5 pl-3 pr-7 text-sm font-medium text-dark-slate focus:border-primary-teal focus:outline-none"
      >
        {PAGE_SIZE_OPTIONS.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      <span aria-hidden="true" className="pointer-events-none absolute right-2.5 text-xs text-slate-blue">
        ▾
      </span>
    </div>
  );
}
