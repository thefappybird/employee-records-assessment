import { useEmployeeUIStore } from '../store/employeeUIStore';
import { PAGE_SIZE_OPTIONS } from '../utils/helpers';

// Row-limit control — lets a smaller dataset still visibly exercise virtualization (e.g. limit 50).
export default function PageSizeSelect() {
  const pageSize = useEmployeeUIStore((state) => state.pageSize);
  const setPageSize = useEmployeeUIStore((state) => state.setPageSize);

  return (
    <div className="flex items-center gap-2 rounded-none border border-slate-blue/40 bg-white px-3 py-2 text-sm text-dark-slate">
      <label htmlFor="page-size" className="text-slate-blue">
        Show
      </label>
      <select
        id="page-size"
        value={pageSize}
        onChange={(event) => setPageSize(Number(event.target.value))}
        className="bg-white text-dark-slate focus:outline-none"
      >
        {PAGE_SIZE_OPTIONS.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      <span className="text-slate-blue">per page</span>
    </div>
  );
}
