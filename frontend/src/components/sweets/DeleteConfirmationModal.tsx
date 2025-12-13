/**
 * Delete Confirmation Modal Component
 */

import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Sweet } from '../../types/sweet.types';
import Modal from '../common/Modal';
import Button from '../common/Button';

interface DeleteConfirmationModalProps {
  sweet: Sweet | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

/**
 * Confirmation modal for deleting sweets (Admin only)
 */
const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  sweet,
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}) => {
  if (!sweet) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Sweet">
      <div className="text-center">
        {/* Warning Icon */}
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
          <AlertTriangle className="h-8 w-8 text-red-600" />
        </div>

        {/* Warning Message */}
        <h3 className="text-xl font-bold text-gray-900 mb-2">Are you sure?</h3>
        <p className="text-gray-600 mb-6">
          You are about to delete <span className="font-semibold text-gray-900">"{sweet.name}"</span>.
          This action cannot be undone.
        </p>

        {/* Sweet Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 flex-shrink-0 bg-white rounded-lg overflow-hidden flex items-center justify-center">
              {sweet.image_url ? (
                <img
                  src={sweet.image_url}
                  alt={sweet.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      target.parentElement.innerHTML = '<div class="text-2xl">🍬</div>';
                    }
                  }}
                />
              ) : (
                <div className="text-2xl">🍬</div>
              )}
            </div>
            <div>
              <p className="font-medium text-gray-800">{sweet.name}</p>
              <p className="text-sm text-gray-500">{sweet.category}</p>
              <p className="text-sm text-gray-500">
                Stock: {sweet.quantity} • Price: ${(Number(sweet.price) || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <Button
            variant="secondary"
            onClick={onClose}
            fullWidth
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            fullWidth
            disabled={loading}
          >
            <div className="flex items-center justify-center space-x-2">
              <Trash2 size={18} />
              <span>{loading ? 'Deleting...' : 'Delete Sweet'}</span>
            </div>
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;

