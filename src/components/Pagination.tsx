import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useEmployeeUIStore } from '../store/employeeUIStore';
import PageSizeSelect from './PageSizeSelect';

interface PaginationProps {
  totalCount: number;
  totalPages: number;
}

// Next/prev/jump controls; page state (including page size) lives in the UI store, not here.
export default function Pagination({ totalCount, totalPages }: PaginationProps) {
  const currentPage = useEmployeeUIStore((state) => state.currentPage);
  const pageSize = useEmployeeUIStore((state) => state.pageSize);
  const setCurrentPage = useEmployeeUIStore((state) => state.setCurrentPage);
  const [jumpValue, setJumpValue] = useState('');

  // Clamp so a stale page (e.g. after deleting the last item on a page) never renders blank.
  const safePage = Math.min(Math.max(currentPage, 1), totalPages);
  useEffect(() => {
    if (currentPage !== safePage) {
      setCurrentPage(safePage);
    }
  }, [currentPage, safePage, setCurrentPage]);

  const rangeStart = totalCount === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const rangeEnd = Math.min(safePage * pageSize, totalCount);

  const handleJump = (event: FormEvent) => {
    event.preventDefault();
    const parsed = Number(jumpValue);
    if (Number.isInteger(parsed) && parsed >= 1 && parsed <= totalPages) {
      setCurrentPage(parsed);
    }
    setJumpValue('');
  };

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-blue/20 pt-3 sm:flex-row">
      <div className="flex items-center gap-2">
        <PageSizeSelect />
        <p className="text-sm text-slate-blue">
          Showing {rangeStart}–{rangeEnd} of {totalCount}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setCurrentPage(safePage - 1)}
          disabled={safePage <= 1}
          className="rounded-btn border border-slate-blue/40 px-3 py-1.5 text-sm text-dark-slate hover:bg-soft-gray disabled:cursor-not-allowed disabled:opacity-40"
        >
          Prev
        </button>
        <span className="text-sm text-dark-slate">
          Page {safePage} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => setCurrentPage(safePage + 1)}
          disabled={safePage >= totalPages}
          className="rounded-btn border border-slate-blue/40 px-3 py-1.5 text-sm text-dark-slate hover:bg-soft-gray disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
        <form onSubmit={handleJump} className="flex items-center gap-1">
          <label htmlFor="page-jump" className="sr-only">
            Jump to page
          </label>
          <input
            id="page-jump"
            type="number"
            min={1}
            max={totalPages}
            value={jumpValue}
            onChange={(event) => setJumpValue(event.target.value)}
            placeholder="Go to…"
            className="w-20 rounded-btn border border-slate-blue/40 px-2 py-1.5 text-sm text-dark-slate focus:border-primary-teal focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-btn bg-primary-teal px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
          >
            Go
          </button>
        </form>
      </div>
    </div>
  );
}
