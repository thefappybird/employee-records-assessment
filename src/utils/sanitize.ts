import type { NewEmployeeInput } from '../types/employee';

// Input validation/normalization on the way in — NOT an HTML sanitizer (React escapes render output already).

// Trim, collapse internal whitespace runs, strip control characters.
export function sanitizeText(input: string): string {
  return input
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1f\x7f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Real email-format check, not a loose ".+@.+".
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

// Letters, spaces, hyphens, and apostrophes only — no digits or other special characters,
// and no leading/trailing space/hyphen/apostrophe.
const NAME_REGEX = /^[A-Za-z](?:[A-Za-z' -]*[A-Za-z])?$/;

export function isValidName(name: string): boolean {
  return NAME_REGEX.test(name);
}

// Case-insensitive membership check against already-fetched employees — no extra network round trip.
export function isDuplicateEmail(email: string, existingEmails: string[]): boolean {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;
  return existingEmails.some((existing) => existing.trim().toLowerCase() === normalized);
}

// Field -> error message map; empty object means valid.
export function validateEmployeeInput(
  input: NewEmployeeInput
): Partial<Record<keyof NewEmployeeInput, string>> {
  const errors: Partial<Record<keyof NewEmployeeInput, string>> = {};

  const firstName = sanitizeText(input.firstName);
  const lastName = sanitizeText(input.lastName);
  const email = sanitizeText(input.email);

  if (!firstName) {
    errors.firstName = 'First name is required.';
  } else if (!isValidName(firstName)) {
    errors.firstName = 'Only letters, spaces, hyphens, and apostrophes are allowed.';
  }

  if (!lastName) {
    errors.lastName = 'Last name is required.';
  } else if (!isValidName(lastName)) {
    errors.lastName = 'Only letters, spaces, hyphens, and apostrophes are allowed.';
  }

  if (!email) {
    errors.email = 'Email is required.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Enter a valid email address.';
  }

  // department/role/status are closed <select> enums — presence check only, no format validation.
  if (!input.department) errors.department = 'Department is required.';
  if (!input.role) errors.role = 'Role is required.';
  if (!input.status) errors.status = 'Status is required.';

  return errors;
}
