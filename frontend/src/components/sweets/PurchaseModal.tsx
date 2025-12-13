/**
 * Purchase Modal Component
 */

import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { Sweet } from '../../types/sweet.types';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { purchaseSweet } from '../../services/sweet.service';

interface PurchaseModalProps {
  sweet: Sweet | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Modal for purchasing sweets
 */
const PurchaseModal: React.FC<PurchaseModalProps> = ({
  sweet,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleClose = () => {
    setQuantity(1);
    setError(null);
    setSuccess(false);
    onClose();
  };

  const handlePurchase = async () => {
    if (!sweet) return;

    if (quantity <= 0) {
      setError('Please enter a valid quantity');
      return;
    }

    if (quantity > sweet.quantity) {
      setError(`Only ${sweet.quantity} items available in stock`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await purchaseSweet(sweet.id, { quantity });
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  if (!sweet) return null;

  const price = Number(sweet.price) || 0;
  const totalPrice = (price * quantity).toFixed(2);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Purchase Sweet">
      {success ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">✅</div>
          <h3 className="text-2xl font-bold text-green-600 mb-2">Purchase Successful!</h3>
          <p className="text-gray-600">Your order has been confirmed</p>
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
                <p className="text-2xl font-bold text-purple-600 mt-2">
                  ${(Number(sweet.price) || 0).toFixed(2)} each
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
            label="Quantity"
            type="number"
            value={quantity}
            onChange={(e) => {
              setQuantity(parseInt(e.target.value) || 1);
              setError(null);
            }}
            min={1}
            max={sweet.quantity}
            required
          />

          {/* Available Stock */}
          <p className="text-sm text-gray-600 mb-4">
            Available in stock: <span className="font-semibold">{sweet.quantity}</span>
          </p>

          {/* Total Price */}
          <div className="bg-purple-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Total Price:</span>
              <span className="text-3xl font-bold text-purple-600">${totalPrice}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <Button variant="secondary" onClick={handleClose} fullWidth disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handlePurchase} fullWidth disabled={loading}>
              <div className="flex items-center justify-center space-x-2">
                <ShoppingCart size={18} />
                <span>{loading ? 'Processing...' : 'Confirm Purchase'}</span>
              </div>
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default PurchaseModal;