import type { Employee } from '../types/employee';

const CSV_HEADERS: (keyof Employee)[] = [
  'id',
  'firstName',
  'lastName',
  'email',
  'department',
  'role',
  'status',
  'createdAt',
];

const FORMULA_TRIGGER_CHARS = ['=', '+', '-', '@'];

// CSV-injection neutralization: prepend a literal ' to formula-triggering cells, then CSV-escape.
function toCsvCell(value: unknown): string {
  let cell = String(value);

  if (FORMULA_TRIGGER_CHARS.some((char) => cell.startsWith(char))) {
    cell = `'${cell}`;
  }

  if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
    cell = `"${cell.replace(/"/g, '""')}"`;
  }

  return cell;
}

function buildCsv(employees: Employee[]): string {
  const rows = [CSV_HEADERS.join(',')];

  for (const employee of employees) {
    const row = CSV_HEADERS.map((field) => toCsvCell(employee[field]));
    rows.push(row.join(','));
  }

  return rows.join('\r\n');
}

// Trigger a browser download from a Blob via a temporary anchor.
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function exportToCSV(employees: Employee[], filename = 'employees.csv'): void {
  const csv = buildCsv(employees);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
}

export function exportToJSON(employees: Employee[], filename = 'employees.json'): void {
  const json = JSON.stringify(employees, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  downloadBlob(blob, filename);
}
