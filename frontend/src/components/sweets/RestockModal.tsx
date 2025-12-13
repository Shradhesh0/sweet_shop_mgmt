/**
 * Restock Modal Component
 */

import React, { useState, useEffect } from 'react';
import { Package } from 'lucide-react';
import { Sweet } from '../../types/sweet.types';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { restockSweet } from '../../services/sweet.service';

interface RestockModalProps {
  sweet: Sweet | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Modal for restocking sweets (Admin only)
 */
const RestockModal: React.FC<RestockModalProps> = ({
  sweet,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [quantity, setQuantity] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (sweet && isOpen) {
      setQuantity(10);
      setError(null);
      setSuccess(false);
    }
  }, [sweet, isOpen]);

  const handleClose = () => {
    setQuantity(10);
    setError(null);
    setSuccess(false);
    onClose();
  };

  const handleRestock = async () => {
    if (!sweet) return;

    if (quantity <= 0) {
      setError('Please enter a valid quantity greater than 0');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await restockSweet(sweet.id, { quantity });
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to restock sweet');
    } finally {
      setLoading(false);
    }
  };

  if (!sweet) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Restock Sweet">
      {success ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">Restock Successful!</h3>
          <p className="text-gray-600">
            {quantity} units have been added to {sweet.name}
          </p>
        </div>
      ) : (
        <>
          {/* Sweet Info */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden flex items-center justify-center">
                {sweet.image_url ? (
                  <img
                    src={sweet.image_url}
                    alt={sweet.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      if (target.parentElement) {
                        target.parentElement.innerHTML = '<div class="text-3xl">🍬</div>';
                      }
                    }}
                  />
                ) : (
                  <div className="text-3xl">🍬</div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800">{sweet.name}</h3>
                <p className="text-gray-600">{sweet.category}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Current Stock: <span className="font-semibold">{sweet.quantity}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Quantity Input */}
          <Input
            label="Quantity to Add"
            type="number"
            value={quantity}
            onChange={(e) => {
              setQuantity(parseInt(e.target.value) || 0);
              setError(null);
            }}
            min={1}
            required
          />

          <p className="text-sm text-gray-600 mb-4">
            After restocking, total stock will be: <span className="font-semibold">{Number(sweet.quantity) + quantity}</span>
          </p>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={handleClose} fullWidth disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleRestock} fullWidth disabled={loading} variant="success">
              <div className="flex items-center justify-center space-x-2">
                <Package size={18} />
                <span>{loading ? 'Processing...' : 'Confirm Restock'}</span>
              </div>
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default RestockModal;

