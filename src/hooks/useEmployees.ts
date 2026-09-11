import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import type { Employee, NewEmployeeInput, UpdateEmployeeInput } from '../types/employee';
import { createEmployee, deleteEmployee, fetchEmployees, updateEmployee } from '../services/employeeApi';

export const employeeKeys = {
  all: ['employees'] as const,
  list: () => [...employeeKeys.all, 'list'] as const,
};

export function useEmployeesQuery(): UseQueryResult<Employee[], Error> {
  return useQuery({
    queryKey: employeeKeys.list(),
    queryFn: fetchEmployees,
    // Mutations are the only source of truth change (cache is updated directly on success), so no refetch needed.
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

export function useCreateEmployeeMutation(): UseMutationResult<Employee, Error, NewEmployeeInput> {
  const queryClient = useQueryClient();
  return useMutation<Employee, Error, NewEmployeeInput>({
    mutationFn: createEmployee,
    onSuccess: (created) => {
      const previous = queryClient.getQueryData<Employee[]>(employeeKeys.list());
      if (previous === undefined) {
        void queryClient.invalidateQueries({ queryKey: employeeKeys.list() });
        return;
      }
      queryClient.setQueryData<Employee[]>(employeeKeys.list(), [...previous, created]);
    },
  });
}

export function useUpdateEmployeeMutation(): UseMutationResult<
  Employee,
  Error,
  { id: number; input: UpdateEmployeeInput }
> {
  const queryClient = useQueryClient();
  return useMutation<Employee, Error, { id: number; input: UpdateEmployeeInput }>({
    mutationFn: ({ id, input }) => updateEmployee(id, input),
    onSuccess: (updated) => {
      const previous = queryClient.getQueryData<Employee[]>(employeeKeys.list());
      if (previous === undefined) {
        void queryClient.invalidateQueries({ queryKey: employeeKeys.list() });
        return;
      }
      queryClient.setQueryData<Employee[]>(
        employeeKeys.list(),
        previous.map((e) => (e.id === updated.id ? updated : e)),
      );
    },
  });
}

export function useDeleteEmployeeMutation(): UseMutationResult<{ id: number }, Error, number> {
  const queryClient = useQueryClient();
  return useMutation<{ id: number }, Error, number>({
    mutationFn: deleteEmployee,
    onSuccess: ({ id }) => {
      const previous = queryClient.getQueryData<Employee[]>(employeeKeys.list());
      if (previous === undefined) {
        void queryClient.invalidateQueries({ queryKey: employeeKeys.list() });
        return;
      }
      queryClient.setQueryData<Employee[]>(
        employeeKeys.list(),
        previous.filter((e) => e.id !== id),
      );
    },
  });
}
