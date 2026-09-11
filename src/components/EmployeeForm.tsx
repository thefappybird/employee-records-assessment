import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import type { Employee, NewEmployeeInput } from '../types/employee';
import { DEPARTMENTS, ROLES, EMPLOYEE_STATUSES } from '../types/employee';
import { sanitizeText, validateEmployeeInput, isDuplicateEmail } from '../utils/sanitize';
import { useDebouncedValue } from '../hooks/useDebouncedValue';

interface EmployeeFormProps {
  mode: 'create' | 'edit';
  employee?: Employee;
  existingEmails: string[];
  onSubmit: (input: NewEmployeeInput) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitError?: string | null;
}

type FieldName = keyof NewEmployeeInput;
type TouchedFields = Partial<Record<FieldName, boolean>>;

// Fake "checking availability" delay for the duplicate-email lookup — the check itself is a synchronous
// array scan against already-fetched data, but the delay + spinner demonstrate the async pattern.
const EMAIL_CHECK_DELAY_MS = 250;

const inputClass =
  'w-full rounded-btn border border-slate-blue/40 bg-white px-3 py-2 text-dark-slate focus:border-primary-teal focus:outline-none focus:ring-1 focus:ring-primary-teal';
const inputErrorClass = 'border-red-400 bg-red-50 focus:border-red-500 focus:ring-red-400';
const inputSuccessClass = 'border-green-400 bg-green-50 focus:border-green-500 focus:ring-green-400';
const labelClass = 'mb-1 block text-sm font-medium text-dark-slate';
const errorClass = 'mt-1 text-sm text-red-600';
const successClass = 'mt-1 text-sm text-green-600';
const requiredMark = <span className="text-red-600"> *</span>;

// Create/edit form: local per-field state, errors derived (not duplicated), validated before onSubmit.
export default function EmployeeForm({
  mode,
  employee,
  existingEmails,
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
  const [touched, setTouched] = useState<TouchedFields>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Debounced so the duplicate-email check only "runs" once the user pauses — the delay is what the
  // right-aligned spinner in the input reflects.
  const debouncedEmail = useDebouncedValue(email, EMAIL_CHECK_DELAY_MS);
  const sanitizedEmail = sanitizeText(email);
  const sanitizedDebouncedEmail = sanitizeText(debouncedEmail);

  const candidate: NewEmployeeInput = useMemo(
    () => ({
      firstName: sanitizeText(firstName),
      lastName: sanitizeText(lastName),
      email: sanitizedEmail,
      department,
      role,
      status,
    }),
    [firstName, lastName, sanitizedEmail, department, role, status],
  );

  // Only "search" for a duplicate once format is valid and the debounce has caught up to the latest value.
  const isCheckingEmail =
    sanitizedEmail.length > 0 && sanitizedDebouncedEmail !== sanitizedEmail && !validateEmployeeInput(candidate).email;
  const isEmailTaken = !isCheckingEmail && isDuplicateEmail(sanitizedDebouncedEmail, existingEmails);

  // Derived, not stored — recomputes on every keystroke; `touched`/`submitAttempted` gate what's shown.
  const fieldErrors = useMemo(() => {
    const errors = validateEmployeeInput(candidate);
    if (!errors.email && isEmailTaken) {
      errors.email = 'An employee with this email already exists.';
    }
    return errors;
  }, [candidate, isEmailTaken]);

  // A field counts as "touched" from its first keystroke, not just on blur — errors and the email
  // success message must react in real time while typing, not only once the user leaves the field.
  const shouldShow = (field: FieldName) => Boolean((touched[field] || submitAttempted) && fieldErrors[field]);
  const showEmailSuccess = Boolean(
    (touched.email || submitAttempted) && sanitizedEmail.length > 0 && !isCheckingEmail && !fieldErrors.email,
  );
  const touchField = (field: FieldName) => setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));

  // Diff against the original record in edit mode — no point re-submitting an unchanged (or
  // reverted-back-to-original) record, so the Save button stays disabled until something differs.
  const isUnchanged =
    mode === 'edit' &&
    Boolean(employee) &&
    employee!.firstName === candidate.firstName &&
    employee!.lastName === candidate.lastName &&
    employee!.email === candidate.email &&
    employee!.department === candidate.department &&
    employee!.role === candidate.role &&
    employee!.status === candidate.status;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);

    if (isCheckingEmail || isUnchanged || Object.keys(fieldErrors).length > 0) {
      return;
    }

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
          First Name{requiredMark}
        </label>
        <input
          id="firstName"
          type="text"
          value={firstName}
          onChange={(event) => {
            setFirstName(event.target.value);
            touchField('firstName');
          }}
          onBlur={() => touchField('firstName')}
          aria-invalid={shouldShow('firstName')}
          className={`${inputClass} ${shouldShow('firstName') ? inputErrorClass : ''}`}
        />
        {shouldShow('firstName') && <p className={errorClass}>{fieldErrors.firstName}</p>}
      </div>

      <div className="mb-3">
        <label htmlFor="lastName" className={labelClass}>
          Last Name{requiredMark}
        </label>
        <input
          id="lastName"
          type="text"
          value={lastName}
          onChange={(event) => {
            setLastName(event.target.value);
            touchField('lastName');
          }}
          onBlur={() => touchField('lastName')}
          aria-invalid={shouldShow('lastName')}
          className={`${inputClass} ${shouldShow('lastName') ? inputErrorClass : ''}`}
        />
        {shouldShow('lastName') && <p className={errorClass}>{fieldErrors.lastName}</p>}
      </div>

      <div className="mb-3">
        <label htmlFor="email" className={labelClass}>
          Email{requiredMark}
        </label>
        <div className="relative">
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              touchField('email');
            }}
            onBlur={() => touchField('email')}
            aria-invalid={shouldShow('email')}
            className={`${inputClass} pr-9 ${
              shouldShow('email') ? inputErrorClass : showEmailSuccess ? inputSuccessClass : ''
            }`}
          />
          {isCheckingEmail && (
            <span
              aria-hidden="true"
              className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-slate-blue border-t-transparent"
            />
          )}
        </div>
        {shouldShow('email') && <p className={errorClass}>{fieldErrors.email}</p>}
        {showEmailSuccess && <p className={successClass}>This email is available.</p>}
      </div>

      <div className="mb-3">
        <label htmlFor="department" className={labelClass}>
          Department{requiredMark}
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
          Role{requiredMark}
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
          Status{requiredMark}
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
          className="rounded-btn border border-slate-blue/40 bg-white px-4 py-2 text-dark-slate hover:bg-soft-gray disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || isCheckingEmail || isUnchanged}
          className="rounded-btn bg-primary-teal px-4 py-2 text-white hover:bg-primary-teal/90 disabled:cursor-not-allowed disabled:opacity-50"
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
