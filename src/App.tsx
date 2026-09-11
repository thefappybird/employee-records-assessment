import { lazy, Suspense, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import EmployeeTable from './components/EmployeeTable';
import Pagination from './components/Pagination';
import Modal from './components/Modal';
import ConfirmDialog from './components/ConfirmDialog';
import Loading from './components/Loading';
import { useEmployeeUIStore } from './store/employeeUIStore';
import {
  useCreateEmployeeMutation,
  useDeleteEmployeeMutation,
  useEmployeesQuery,
  useUpdateEmployeeMutation,
} from './hooks/useEmployees';
import { useEmployeeFilters } from './hooks/useEmployeeFilters';
import { exportToCSV, exportToJSON } from './utils/exportUtils';
import { PAGE_SIZE } from './utils/helpers';
import type { NewEmployeeInput } from './types/employee';

// EmployeeForm is the one clearly-justified code-split target (Section 9) — only needed once a modal opens.
const EmployeeForm = lazy(() => import('./components/EmployeeForm'));

const queryClient = new QueryClient();

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Something went wrong.';
}

function EmployeeRecordsApp() {
  const employeesQuery = useEmployeesQuery();
  const employees = useMemo(() => employeesQuery.data ?? [], [employeesQuery.data]);
  const { pageItems, filteredAll, totalCount, totalPages } = useEmployeeFilters(employees);

  const isFormModalOpen = useEmployeeUIStore((state) => state.isFormModalOpen);
  const editingEmployeeId = useEmployeeUIStore((state) => state.editingEmployeeId);
  const deleteConfirmId = useEmployeeUIStore((state) => state.deleteConfirmId);
  const openCreateModal = useEmployeeUIStore((state) => state.openCreateModal);
  const closeFormModal = useEmployeeUIStore((state) => state.closeFormModal);
  const cancelDelete = useEmployeeUIStore((state) => state.cancelDelete);

  const createMutation = useCreateEmployeeMutation();
  const updateMutation = useUpdateEmployeeMutation();
  const deleteMutation = useDeleteEmployeeMutation();

  const formMode: 'create' | 'edit' = editingEmployeeId == null ? 'create' : 'edit';
  const editingEmployee = useMemo(
    () => employees.find((employee) => employee.id === editingEmployeeId),
    [employees, editingEmployeeId],
  );
  const activeMutation = formMode === 'create' ? createMutation : updateMutation;

  const handleFormSubmit = (input: NewEmployeeInput) => {
    if (formMode === 'create') {
      createMutation.mutate(input, { onSuccess: closeFormModal });
    } else if (editingEmployeeId != null) {
      updateMutation.mutate({ id: editingEmployeeId, input }, { onSuccess: closeFormModal });
    }
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmId != null) {
      deleteMutation.mutate(deleteConfirmId, { onSuccess: cancelDelete });
    }
  };

  const noRecordsAtAll = !employeesQuery.isLoading && !employeesQuery.isError && employees.length === 0;

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-dark-slate">Employee Records</h1>
        <p className="text-sm text-slate-blue">Search, filter, and manage employee records.</p>
      </header>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <SearchBar />
          <FilterPanel />
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => exportToCSV(filteredAll)}
            disabled={filteredAll.length === 0}
            className="rounded-btn border border-slate-blue/40 bg-white px-3 py-2 text-sm text-dark-slate hover:bg-soft-gray disabled:cursor-not-allowed disabled:opacity-40"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => exportToJSON(filteredAll)}
            disabled={filteredAll.length === 0}
            className="rounded-btn border border-slate-blue/40 bg-white px-3 py-2 text-sm text-dark-slate hover:bg-soft-gray disabled:cursor-not-allowed disabled:opacity-40"
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={openCreateModal}
            className="rounded-btn bg-primary-teal px-4 py-2 text-sm font-medium text-white hover:bg-primary-teal/90"
          >
            + Add Employee
          </button>
        </div>
      </div>

      <EmployeeTable
        employees={pageItems}
        isLoading={employeesQuery.isLoading}
        isError={employeesQuery.isError}
        errorMessage={employeesQuery.error ? getErrorMessage(employeesQuery.error) : undefined}
        emptyMessage={
          noRecordsAtAll ? 'No employees yet — add one to get started.' : 'No records match your search or filters.'
        }
      />

      <div className="mt-4">
        <Pagination totalCount={totalCount} totalPages={totalPages} pageSize={PAGE_SIZE} />
      </div>

      {isFormModalOpen && (
        <Suspense fallback={<Loading message="Loading form…" />}>
          <Modal
            isOpen={isFormModalOpen}
            onClose={closeFormModal}
            title={formMode === 'create' ? 'Add Employee' : 'Edit Employee'}
          >
            <EmployeeForm
              mode={formMode}
              employee={editingEmployee}
              onSubmit={handleFormSubmit}
              onCancel={closeFormModal}
              isSubmitting={activeMutation.isPending}
              submitError={activeMutation.isError ? getErrorMessage(activeMutation.error) : null}
            />
          </Modal>
        </Suspense>
      )}

      <ConfirmDialog
        isOpen={deleteConfirmId != null}
        message="Are you sure you want to delete this employee? This cannot be undone."
        onConfirm={handleConfirmDelete}
        onCancel={cancelDelete}
        isConfirming={deleteMutation.isPending}
      />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <EmployeeRecordsApp />
    </QueryClientProvider>
  );
}
