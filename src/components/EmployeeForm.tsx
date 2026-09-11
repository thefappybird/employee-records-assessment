import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Employee, NewEmployeeInput } from '../types/employee';
import { DEPARTMENTS, ROLES, EMPLOYEE_STATUSES } from '../types/employee';
import { sanitizeText, validateEmployeeInput } from '../utils/sanitize';

interface EmployeeFormProps {
  mode: 'create' | 'edit';
  employee?: Employee;
  onSubmit: (input: NewEmployeeInput) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitError?: string | null;
}

type FieldErrors = Partial<Record<keyof NewEmployeeInput, string>>;

const inputClass =
  'w-full rounded-btn border border-slate-blue/40 bg-white px-3 py-2 text-dark-slate focus:border-primary-teal focus:outline-none focus:ring-1 focus:ring-primary-teal';
const labelClass = 'mb-1 block text-sm font-medium text-dark-slate';
const errorClass = 'mt-1 text-sm text-red-600';

// Create/edit form: local per-field state, client-side validation before calling onSubmit.
export default function EmployeeForm({
  mode,
  employee,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitError = null,
}: EmployeeFormProps) {
  const [firstName, setFirstName] = useState(employee?.firstName ?? '');
  const [lastName, setLastName] = useState(employee?.lastName ?? '');
  const [email, setEmail] = useState(employee?.email ?? '');
  const [department, setDepartment] = useState(employee?.department ?? DEPARTMENTS[0]);
  const [role, setRole] = useState(employee?.role ?? ROLES[0]);
  const [status, setStatus] = useState(employee?.status ?? EMPLOYEE_STATUSES[0]);
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const candidate: NewEmployeeInput = {
      firstName: sanitizeText(firstName),
      lastName: sanitizeText(lastName),
      email: sanitizeText(email),
      department,
      role,
      status,
    };

    const fieldErrors = validateEmployeeInput(candidate);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    onSubmit(candidate);
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {submitError && (
        <div className="mb-4 border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </div>
      )}

      <div className="mb-3">
        <label htmlFor="firstName" className={labelClass}>
          First Name
        </label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          className={inputClass}
        />
        {errors.firstName && <p className={errorClass}>{errors.firstName}</p>}
      </div>

      <div className="mb-3">
        <label htmlFor="lastName" className={labelClass}>
          Last Name
        </label>
        <input
          id="lastName"
          type="text"
          value={lastName}
          onChange={(event) => setLastName(event.target.value)}
          className={inputClass}
        />
        {errors.lastName && <p className={errorClass}>{errors.lastName}</p>}
      </div>

      <div className="mb-3">
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClass}
        />
        {errors.email && <p className={errorClass}>{errors.email}</p>}
      </div>

      <div className="mb-3">
        <label htmlFor="department" className={labelClass}>
          Department
        </label>
        <select
          id="department"
          value={department}
          onChange={(event) => setDepartment(event.target.value as typeof department)}
          className={inputClass}
        >
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="role" className={labelClass}>
          Role
        </label>
        <select
          id="role"
          value={role}
          onChange={(event) => setRole(event.target.value as typeof role)}
          className={inputClass}
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-5">
        <label htmlFor="status" className={labelClass}>
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(event) => setStatus(event.target.value as typeof status)}
          className={inputClass}
        >
          {EMPLOYEE_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-btn border border-slate-blue/40 bg-white px-4 py-2 text-dark-slate hover:bg-soft-gray disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-btn bg-primary-teal px-4 py-2 text-white hover:bg-primary-teal/90 disabled:opacity-50"
        >
          {isSubmitting
            ? mode === 'create'
              ? 'Creating…'
              : 'Saving…'
            : mode === 'create'
              ? 'Create Employee'
              : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
