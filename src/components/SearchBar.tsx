import { useEffect, useState } from 'react';
import { useEmployeeUIStore } from '../store/employeeUIStore';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

// Local raw input for instant echo; only the debounced value hits the store/re-render tree.
export default function SearchBar() {
  const setSearchTerm = useEmployeeUIStore((state) => state.setSearchTerm);
  const [rawValue, setRawValue] = useState('');
  const debouncedValue = useDebouncedValue(rawValue, 300);

  useEffect(() => {
    setSearchTerm(debouncedValue);
  }, [debouncedValue, setSearchTerm]);

  return (
    <div className="w-full sm:max-w-xs">
      <label htmlFor="employee-search" className="sr-only">
        Search employees
      </label>
      <input
        id="employee-search"
        type="text"
        value={rawValue}
        onChange={(event) => setRawValue(event.target.value)}
        placeholder="Search by name, email, or role…"
        className="w-full rounded-btn border border-slate-blue/40 bg-white px-3 py-2 text-dark-slate placeholder:text-slate-blue/70 focus:border-primary-teal focus:outline-none focus:ring-1 focus:ring-primary-teal"
      />
    </div>
  );
}
