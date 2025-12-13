/**
 * Sweet Card Component
 */

import React from 'react';
import { ShoppingCart, Edit, Trash2, Package } from 'lucide-react';
import { Sweet } from '../../types/sweet.types';
import Button from '../common/Button';

interface SweetCardProps {
  sweet: Sweet;
  isAdmin: boolean;
  onPurchase: (sweet: Sweet) => void;
  onEdit?: (sweet: Sweet) => void;
  onDelete?: (sweet: Sweet) => void;
  onRestock?: (sweet: Sweet) => void;
}

/**
 * Card component displaying sweet information with actions
 */
const SweetCard: React.FC<SweetCardProps> = ({
  sweet,
  isAdmin,
  onPurchase,
  onEdit,
  onDelete,
  onRestock,
}) => {
  const isOutOfStock = sweet.quantity === 0;
  const isLowStock = sweet.quantity > 0 && sweet.quantity < 10;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Header with image or gradient fallback */}
      <div className="h-48 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center overflow-hidden">
        {sweet.image_url ? (
          <img
            src={sweet.image_url}
            alt={sweet.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to emoji if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              if (target.parentElement) {
                target.parentElement.innerHTML = '<div class="text-6xl">🍬</div>';
              }
            }}
          />
        ) : (
          <div className="text-6xl">🍬</div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title & Category */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-800 mb-1">{sweet.name}</h3>
          <span className="inline-block bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full">
            {sweet.category}
          </span>
        </div>

        {/* Description */}
        {sweet.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{sweet.description}</p>
        )}

        {/* Price */}
        <div className="flex items-baseline space-x-1 mb-4">
          <span className="text-3xl font-bold text-purple-600">₹{(Number(sweet.price) || 0).toFixed(2)}</span>
          <span className="text-gray-500 text-sm">per piece</span>
        </div>

        {/* Stock Status */}
        <div className="mb-4">
          {isOutOfStock ? (
            <span className="inline-flex items-center space-x-1 text-red-600 bg-red-50 px-3 py-1 rounded-full text-sm font-medium">
              <Package size={16} />
              <span>Out of Stock</span>
            </span>
          ) : isLowStock ? (
            <span className="inline-flex items-center space-x-1 text-orange-600 bg-orange-50 px-3 py-1 rounded-full text-sm font-medium">
              <Package size={16} />
              <span>Low Stock: {sweet.quantity} left</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm font-medium">
              <Package size={16} />
              <span>In Stock: {sweet.quantity}</span>
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2">
          {/* Purchase Button (for all users) */}
          <Button
            fullWidth
            onClick={() => onPurchase(sweet)}
            disabled={isOutOfStock}
            variant="primary"
          >
            <div className="flex items-center justify-center space-x-2">
              <ShoppingCart size={18} />
              <span>{isOutOfStock ? 'Out of Stock' : 'Purchase'}</span>
            </div>
          </Button>

          {/* Admin Actions */}
          {isAdmin && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  fullWidth
                  onClick={() => onEdit && onEdit(sweet)}
                  variant="secondary"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <Edit size={16} />
                    <span>Edit</span>
                  </div>
                </Button>

                <Button
                  fullWidth
                  onClick={() => onDelete && onDelete(sweet)}
                  variant="danger"
                >
                  <div className="flex items-center justify-center space-x-1">
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </div>
                </Button>
              </div>

              <Button
                fullWidth
                onClick={() => onRestock && onRestock(sweet)}
                variant="success"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Package size={18} />
                  <span>Restock</span>
                </div>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SweetCard;