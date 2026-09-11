// In-memory mock REST backend, wired in as a custom axios adapter (no MSW/json-server — dependency hygiene).
import type { AxiosAdapter, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import type { Employee, NewEmployeeInput, UpdateEmployeeInput } from '../types/employee';

// Seed data: 60 records, deterministic (no faker), spread over the past year.
const seedEmployees: Employee[] = [
  { id: 1, firstName: 'Linda', lastName: 'Wilson', email: 'linda.wilson1@suadeo-corp.com', department: 'HR', role: 'HR Coordinator', status: 'Active', createdAt: '2026-09-05T00:00:00.000Z' },
  { id: 2, firstName: 'Joseph', lastName: 'Clark', email: 'joseph.clark2@suadeo-corp.com', department: 'Operations', role: 'Operations Lead', status: 'Active', createdAt: '2026-08-30T00:00:00.000Z' },
  { id: 3, firstName: 'Nancy', lastName: 'Flores', email: 'nancy.flores3@suadeo-corp.com', department: 'Marketing', role: 'Marketing Specialist', status: 'Inactive', createdAt: '2026-08-24T00:00:00.000Z' },
  { id: 4, firstName: 'Mark', lastName: 'Evans', email: 'mark.evans4@suadeo-corp.com', department: 'Support', role: 'Support Specialist', status: 'On Leave', createdAt: '2026-08-18T00:00:00.000Z' },
  { id: 5, firstName: 'Emily', lastName: 'Garcia', email: 'emily.garcia5@suadeo-corp.com', department: 'Sales', role: 'Account Manager', status: 'Active', createdAt: '2026-08-12T00:00:00.000Z' },
  { id: 6, firstName: 'Kevin', lastName: 'Jackson', email: 'kevin.jackson6@suadeo-corp.com', department: 'Finance', role: 'Financial Analyst', status: 'Active', createdAt: '2026-08-06T00:00:00.000Z' },
  { id: 7, firstName: 'Stephanie', lastName: 'Young', email: 'stephanie.young7@suadeo-corp.com', department: 'Engineering', role: 'Engineering Manager', status: 'Active', createdAt: '2026-07-31T00:00:00.000Z' },
  { id: 8, firstName: 'Jeffrey', lastName: 'Hall', email: 'jeffrey.hall8@suadeo-corp.com', department: 'HR', role: 'HR Coordinator', status: 'Inactive', createdAt: '2026-07-25T00:00:00.000Z' },
  { id: 9, firstName: 'Patricia', lastName: 'Edwards', email: 'patricia.edwards9@suadeo-corp.com', department: 'Operations', role: 'Operations Lead', status: 'On Leave', createdAt: '2026-07-19T00:00:00.000Z' },
  { id: 10, firstName: 'William', lastName: 'Hernandez', email: 'william.hernandez10@suadeo-corp.com', department: 'Marketing', role: 'Marketing Specialist', status: 'Active', createdAt: '2026-07-13T00:00:00.000Z' },
  { id: 11, firstName: 'Sarah', lastName: 'White', email: 'sarah.white11@suadeo-corp.com', department: 'Support', role: 'Support Specialist', status: 'Active', createdAt: '2026-07-07T00:00:00.000Z' },
  { id: 12, firstName: 'Matthew', lastName: 'Torres', email: 'matthew.torres12@suadeo-corp.com', department: 'Sales', role: 'Sales Executive', status: 'Active', createdAt: '2026-07-01T00:00:00.000Z' },
  { id: 13, firstName: 'Ashley', lastName: 'Roberts', email: 'ashley.roberts13@suadeo-corp.com', department: 'Finance', role: 'Financial Analyst', status: 'Inactive', createdAt: '2026-06-25T00:00:00.000Z' },
  { id: 14, firstName: 'Joshua', lastName: 'Williams', email: 'joshua.williams14@suadeo-corp.com', department: 'Engineering', role: 'Senior Engineer', status: 'On Leave', createdAt: '2026-06-19T00:00:00.000Z' },
  { id: 15, firstName: 'Melissa', lastName: 'Thomas', email: 'melissa.thomas15@suadeo-corp.com', department: 'HR', role: 'HR Coordinator', status: 'Active', createdAt: '2026-06-13T00:00:00.000Z' },
  { id: 16, firstName: 'Edward', lastName: 'Lewis', email: 'edward.lewis16@suadeo-corp.com', department: 'Operations', role: 'Operations Lead', status: 'Active', createdAt: '2026-06-07T00:00:00.000Z' },
  { id: 17, firstName: 'Kathleen', lastName: 'Adams', email: 'kathleen.adams17@suadeo-corp.com', department: 'Marketing', role: 'Marketing Specialist', status: 'Active', createdAt: '2026-06-01T00:00:00.000Z' },
  { id: 18, firstName: 'Michael', lastName: 'Diaz', email: 'michael.diaz18@suadeo-corp.com', department: 'Support', role: 'Support Specialist', status: 'Inactive', createdAt: '2026-05-26T00:00:00.000Z' },
  { id: 19, firstName: 'Susan', lastName: 'Davis', email: 'susan.davis19@suadeo-corp.com', department: 'Sales', role: 'Account Manager', status: 'On Leave', createdAt: '2026-05-20T00:00:00.000Z' },
  { id: 20, firstName: 'Christopher', lastName: 'Lee', email: 'christopher.lee20@suadeo-corp.com', department: 'Finance', role: 'Financial Analyst', status: 'Active', createdAt: '2026-05-14T00:00:00.000Z' },
  { id: 21, firstName: 'Margaret', lastName: 'King', email: 'margaret.king21@suadeo-corp.com', department: 'Engineering', role: 'Software Engineer', status: 'Active', createdAt: '2026-05-08T00:00:00.000Z' },
  { id: 22, firstName: 'Andrew', lastName: 'Campbell', email: 'andrew.campbell22@suadeo-corp.com', department: 'HR', role: 'HR Coordinator', status: 'Active', createdAt: '2026-05-02T00:00:00.000Z' },
  { id: 23, firstName: 'Carol', lastName: 'Reyes', email: 'carol.reyes23@suadeo-corp.com', department: 'Operations', role: 'Operations Lead', status: 'Inactive', createdAt: '2026-04-26T00:00:00.000Z' },
  { id: 24, firstName: 'Timothy', lastName: 'Gonzalez', email: 'timothy.gonzalez24@suadeo-corp.com', department: 'Marketing', role: 'Marketing Specialist', status: 'On Leave', createdAt: '2026-04-20T00:00:00.000Z' },
  { id: 25, firstName: 'Laura', lastName: 'Sanchez', email: 'laura.sanchez25@suadeo-corp.com', department: 'Support', role: 'Support Specialist', status: 'Active', createdAt: '2026-04-14T00:00:00.000Z' },
  { id: 26, firstName: 'Robert', lastName: 'Hill', email: 'robert.hill26@suadeo-corp.com', department: 'Sales', role: 'Sales Executive', status: 'Active', createdAt: '2026-04-08T00:00:00.000Z' },
  { id: 27, firstName: 'Elizabeth', lastName: 'Phillips', email: 'elizabeth.phillips27@suadeo-corp.com', department: 'Finance', role: 'Financial Analyst', status: 'Active', createdAt: '2026-04-02T00:00:00.000Z' },
  { id: 28, firstName: 'Thomas', lastName: 'Jones', email: 'thomas.jones28@suadeo-corp.com', department: 'Engineering', role: 'Engineering Manager', status: 'Inactive', createdAt: '2026-03-27T00:00:00.000Z' },
  { id: 29, firstName: 'Lisa', lastName: 'Moore', email: 'lisa.moore29@suadeo-corp.com', department: 'HR', role: 'HR Coordinator', status: 'On Leave', createdAt: '2026-03-21T00:00:00.000Z' },
  { id: 30, firstName: 'Donald', lastName: 'Walker', email: 'donald.walker30@suadeo-corp.com', department: 'Operations', role: 'Operations Lead', status: 'Active', createdAt: '2026-03-15T00:00:00.000Z' },
  { id: 31, firstName: 'Donna', lastName: 'Baker', email: 'donna.baker31@suadeo-corp.com', department: 'Marketing', role: 'Marketing Specialist', status: 'Active', createdAt: '2026-03-09T00:00:00.000Z' },
  { id: 32, firstName: 'Brian', lastName: 'Cruz', email: 'brian.cruz32@suadeo-corp.com', department: 'Support', role: 'Support Specialist', status: 'Active', createdAt: '2026-03-03T00:00:00.000Z' },
  { id: 33, firstName: 'Rebecca', lastName: 'Martinez', email: 'rebecca.martinez33@suadeo-corp.com', department: 'Sales', role: 'Account Manager', status: 'Inactive', createdAt: '2026-02-25T00:00:00.000Z' },
  { id: 34, firstName: 'Ryan', lastName: 'Thompson', email: 'ryan.thompson34@suadeo-corp.com', department: 'Finance', role: 'Financial Analyst', status: 'On Leave', createdAt: '2026-02-19T00:00:00.000Z' },
  { id: 35, firstName: 'Jennifer', lastName: 'Scott', email: 'jennifer.scott35@suadeo-corp.com', department: 'Engineering', role: 'Senior Engineer', status: 'Active', createdAt: '2026-02-13T00:00:00.000Z' },
  { id: 36, firstName: 'Richard', lastName: 'Carter', email: 'richard.carter36@suadeo-corp.com', department: 'HR', role: 'HR Coordinator', status: 'Active', createdAt: '2026-02-07T00:00:00.000Z' },
  { id: 37, firstName: 'Karen', lastName: 'Johnson', email: 'karen.johnson37@suadeo-corp.com', department: 'Operations', role: 'Operations Lead', status: 'Active', createdAt: '2026-02-01T00:00:00.000Z' },
  { id: 38, firstName: 'Anthony', lastName: 'Anderson', email: 'anthony.anderson38@suadeo-corp.com', department: 'Marketing', role: 'Marketing Specialist', status: 'Inactive', createdAt: '2026-01-26T00:00:00.000Z' },
  { id: 39, firstName: 'Kimberly', lastName: 'Ramirez', email: 'kimberly.ramirez39@suadeo-corp.com', department: 'Support', role: 'Support Specialist', status: 'On Leave', createdAt: '2026-01-20T00:00:00.000Z' },
  { id: 40, firstName: 'Kenneth', lastName: 'Green', email: 'kenneth.green40@suadeo-corp.com', department: 'Sales', role: 'Sales Executive', status: 'Active', createdAt: '2026-01-14T00:00:00.000Z' },
  { id: 41, firstName: 'Deborah', lastName: 'Turner', email: 'deborah.turner41@suadeo-corp.com', department: 'Finance', role: 'Financial Analyst', status: 'Active', createdAt: '2026-01-08T00:00:00.000Z' },
  { id: 42, firstName: 'Jason', lastName: 'Miller', email: 'jason.miller42@suadeo-corp.com', department: 'Engineering', role: 'Software Engineer', status: 'Active', createdAt: '2026-01-02T00:00:00.000Z' },
  { id: 43, firstName: 'Mary', lastName: 'Martin', email: 'mary.martin43@suadeo-corp.com', department: 'HR', role: 'HR Coordinator', status: 'Inactive', createdAt: '2025-12-27T00:00:00.000Z' },
  { id: 44, firstName: 'David', lastName: 'Allen', email: 'david.allen44@suadeo-corp.com', department: 'Operations', role: 'Operations Lead', status: 'On Leave', createdAt: '2025-12-21T00:00:00.000Z' },
  { id: 45, firstName: 'Jessica', lastName: 'Rivera', email: 'jessica.rivera45@suadeo-corp.com', department: 'Marketing', role: 'Marketing Specialist', status: 'Active', createdAt: '2025-12-15T00:00:00.000Z' },
  { id: 46, firstName: 'Daniel', lastName: 'Collins', email: 'daniel.collins46@suadeo-corp.com', department: 'Support', role: 'Support Specialist', status: 'Active', createdAt: '2025-12-09T00:00:00.000Z' },
  { id: 47, firstName: 'Sandra', lastName: 'Lopez', email: 'sandra.lopez47@suadeo-corp.com', department: 'Sales', role: 'Account Manager', status: 'Active', createdAt: '2025-12-03T00:00:00.000Z' },
  { id: 48, firstName: 'Paul', lastName: 'Harris', email: 'paul.harris48@suadeo-corp.com', department: 'Finance', role: 'Financial Analyst', status: 'Inactive', createdAt: '2025-11-27T00:00:00.000Z' },
  { id: 49, firstName: 'Amanda', lastName: 'Nguyen', email: 'amanda.nguyen49@suadeo-corp.com', department: 'Engineering', role: 'Engineering Manager', status: 'On Leave', createdAt: '2025-11-21T00:00:00.000Z' },
  { id: 50, firstName: 'Ronald', lastName: 'Gomez', email: 'ronald.gomez50@suadeo-corp.com', department: 'HR', role: 'HR Coordinator', status: 'Active', createdAt: '2025-11-15T00:00:00.000Z' },
  { id: 51, firstName: 'Cynthia', lastName: 'Brown', email: 'cynthia.brown51@suadeo-corp.com', department: 'Operations', role: 'Operations Lead', status: 'Active', createdAt: '2025-11-09T00:00:00.000Z' },
  { id: 52, firstName: 'John', lastName: 'Taylor', email: 'john.taylor52@suadeo-corp.com', department: 'Marketing', role: 'Marketing Specialist', status: 'Active', createdAt: '2025-11-03T00:00:00.000Z' },
  { id: 53, firstName: 'Barbara', lastName: 'Robinson', email: 'barbara.robinson53@suadeo-corp.com', department: 'Support', role: 'Support Specialist', status: 'Inactive', createdAt: '2025-10-28T00:00:00.000Z' },
  { id: 54, firstName: 'Charles', lastName: 'Nelson', email: 'charles.nelson54@suadeo-corp.com', department: 'Sales', role: 'Sales Executive', status: 'On Leave', createdAt: '2025-10-22T00:00:00.000Z' },
  { id: 55, firstName: 'Betty', lastName: 'Parker', email: 'betty.parker55@suadeo-corp.com', department: 'Finance', role: 'Financial Analyst', status: 'Active', createdAt: '2025-10-16T00:00:00.000Z' },
  { id: 56, firstName: 'Steven', lastName: 'Rodriguez', email: 'steven.rodriguez56@suadeo-corp.com', department: 'Engineering', role: 'Senior Engineer', status: 'Active', createdAt: '2025-10-10T00:00:00.000Z' },
  { id: 57, firstName: 'Michelle', lastName: 'Perez', email: 'michelle.perez57@suadeo-corp.com', department: 'HR', role: 'HR Coordinator', status: 'Active', createdAt: '2025-10-04T00:00:00.000Z' },
  { id: 58, firstName: 'George', lastName: 'Wright', email: 'george.wright58@suadeo-corp.com', department: 'Operations', role: 'Operations Lead', status: 'Inactive', createdAt: '2025-09-28T00:00:00.000Z' },
  { id: 59, firstName: 'Sharon', lastName: 'Mitchell', email: 'sharon.mitchell59@suadeo-corp.com', department: 'Marketing', role: 'Marketing Specialist', status: 'On Leave', createdAt: '2025-09-22T00:00:00.000Z' },
  { id: 60, firstName: 'James', lastName: 'Smith', email: 'james.smith60@suadeo-corp.com', department: 'Support', role: 'Support Specialist', status: 'Active', createdAt: '2025-09-16T00:00:00.000Z' },
];

// Module-level mutable store — mutated by create/update/delete so changes persist for the session.
let employees: Employee[] = seedEmployees;

const EMPLOYEES_PATH = /^\/employees\/?$/;
const EMPLOYEE_ID_PATH = /^\/employees\/(\d+)\/?$/;

function stripBase(url: string): string {
  // baseURL is '/api'; adapter sees the url already resolved against it in config.url in most axios versions,
  // so tolerate either an already-relative path or one still prefixed with /api.
  return url.replace(/^\/api/, '');
}

// axios's default transformRequest JSON.stringifies request bodies before the adapter runs.
function parseBody<T>(data: unknown): T {
  return (typeof data === 'string' ? JSON.parse(data) : data) as T;
}

function makeResponse<T>(config: InternalAxiosRequestConfig, data: T, status: number): AxiosResponse<T> {
  const statusTextMap: Record<number, string> = { 200: 'OK', 201: 'Created' };
  return {
    data,
    status,
    statusText: statusTextMap[status] ?? 'OK',
    headers: {},
    config,
  };
}

function makeError(config: InternalAxiosRequestConfig, status: number, message: string): Error {
  return Object.assign(new Error(message), {
    response: { status, data: { message } },
    isAxiosError: true,
    config,
  });
}

// Simulated REST handler backed by the in-memory array above.
export const fakeAdapter: AxiosAdapter = async (config) => {
  await new Promise((resolve) => setTimeout(resolve, 150 + Math.random() * 150));

  const method = (config.method ?? 'get').toLowerCase();
  const path = stripBase(config.url ?? '');

  if (method === 'get' && EMPLOYEES_PATH.test(path)) {
    return makeResponse(config, employees, 200);
  }

  if (method === 'post' && EMPLOYEES_PATH.test(path)) {
    const input = parseBody<NewEmployeeInput>(config.data);
    const emailTaken = employees.some((e) => e.email.toLowerCase() === input.email.toLowerCase());
    if (emailTaken) {
      throw makeError(config, 409, `An employee with email "${input.email}" already exists.`);
    }
    const nextId = employees.reduce((max, e) => Math.max(max, e.id), 0) + 1;
    const created: Employee = { ...input, id: nextId, createdAt: new Date().toISOString() };
    employees = [...employees, created];
    return makeResponse(config, created, 201);
  }

  const idMatch = EMPLOYEE_ID_PATH.exec(path);
  if (method === 'patch' && idMatch) {
    const id = Number(idMatch[1]);
    const existing = employees.find((e) => e.id === id);
    if (!existing) {
      throw makeError(config, 404, `Employee ${id} not found.`);
    }
    const updates = parseBody<UpdateEmployeeInput>(config.data);
    const updated: Employee = { ...existing, ...updates };
    employees = employees.map((e) => (e.id === id ? updated : e));
    return makeResponse(config, updated, 200);
  }

  if (method === 'delete' && idMatch) {
    const id = Number(idMatch[1]);
    const existing = employees.find((e) => e.id === id);
    if (!existing) {
      throw makeError(config, 404, `Employee ${id} not found.`);
    }
    employees = employees.filter((e) => e.id !== id);
    return makeResponse(config, { id }, 200);
  }

  throw makeError(config, 404, `No mock route for ${method.toUpperCase()} ${path}`);
};
