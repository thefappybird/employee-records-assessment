import Modal from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isConfirming?: boolean;
}

// Generic confirm dialog built on Modal — used for delete confirmation (wired up by orchestrator).
export default function ConfirmDialog({
  isOpen,
  message,
  onConfirm,
  onCancel,
  isConfirming = false,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title="Please confirm">
      <p className="mb-6 text-dark-slate">{message}</p>
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isConfirming}
          className="rounded-btn border border-slate-blue/40 bg-white px-4 py-2 text-dark-slate hover:bg-soft-gray disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={isConfirming}
          className="rounded-btn bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
        >
          {isConfirming ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </Modal>
  );
}
