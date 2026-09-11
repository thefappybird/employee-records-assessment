const SKELETON_ROW_COUNT = 8;

// Bone color derived from the palette (dark-slate at low opacity) — no new hues introduced.
const bone = 'animate-pulse rounded-btn bg-dark-slate/10';

// Shown in place of the table while the initial employee fetch is in flight.
export default function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-none border border-slate-blue/20 bg-white">
      {/* Desktop skeleton — mirrors the real grid layout so there's no reflow on data arrival. */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-[60px_1.5fr_2fr_1fr_1.3fr_1fr_auto] gap-3 border-b border-slate-blue/30 bg-soft-gray px-4 py-2">
          {['ID', 'Name', 'Email', 'Department', 'Role', 'Status', 'Actions'].map((label) => (
            <span key={label} className="text-xs font-semibold uppercase tracking-wide text-slate-blue">
              {label}
            </span>
          ))}
        </div>
        {Array.from({ length: SKELETON_ROW_COUNT }).map((_, index) => (
          <div
            key={index}
            className="grid h-14 grid-cols-[60px_1.5fr_2fr_1fr_1.3fr_1fr_auto] items-center gap-3 border-b border-slate-blue/15 px-4"
          >
            <span className={`${bone} h-4 w-6`} />
            <span className={`${bone} h-4 w-28`} />
            <span className={`${bone} h-4 w-36`} />
            <span className={`${bone} h-4 w-20`} />
            <span className={`${bone} h-4 w-24`} />
            <span className={`${bone} h-4 w-16`} />
            <span className="flex gap-2">
              <span className={`${bone} h-6 w-12`} />
              <span className={`${bone} h-6 w-12`} />
            </span>
          </div>
        ))}
      </div>

      {/* Mobile skeleton — mirrors the card layout. */}
      <div className="flex flex-col gap-3 p-3 sm:hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="rounded-none border border-slate-blue/15 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className={`${bone} h-4 w-32`} />
              <span className={`${bone} h-5 w-16 rounded-full`} />
            </div>
            <span className={`${bone} mb-2 block h-3 w-40`} />
            <span className={`${bone} mb-3 block h-3 w-24`} />
            <div className="flex gap-2">
              <span className={`${bone} h-6 w-14`} />
              <span className={`${bone} h-6 w-14`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
