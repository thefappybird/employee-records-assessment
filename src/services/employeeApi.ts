// Single shared axios instance + typed service functions — the only place HTTP happens.
import axios from 'axios';
import { fakeAdapter } from './mockBackend';
import type { Employee, NewEmployeeInput, UpdateEmployeeInput } from '../types/employee';

const api = axios.create({ baseURL: '/api', adapter: fakeAdapter });

export async function fetchEmployees(): Promise<Employee[]> {
  const { data } = await api.get<Employee[]>('/employees');
  return data;
}

export async function createEmployee(input: NewEmployeeInput): Promise<Employee> {
  const { data } = await api.post<Employee>('/employees', input);
  return data;
}

export async function updateEmployee(id: number, input: UpdateEmployeeInput): Promise<Employee> {
  const { data } = await api.patch<Employee>(`/employees/${id}`, input);
  return data;
}

export async function deleteEmployee(id: number): Promise<{ id: number }> {
  const { data } = await api.delete<{ id: number }>(`/employees/${id}`);
  return data;
}
