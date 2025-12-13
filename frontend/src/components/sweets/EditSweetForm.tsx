/**
 * Edit Sweet Form Component
 */

import React, { useState, useEffect } from 'react';
import { Edit, X } from 'lucide-react';
import { Sweet, UpdateSweetData } from '../../types/sweet.types';
import Input from '../common/Input';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { updateSweet } from '../../services/sweet.service';

interface EditSweetFormProps {
  sweet: Sweet | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

/**
 * Modal form for editing existing sweets (Admin only)
 */
const EditSweetForm: React.FC<EditSweetFormProps> = ({
  sweet,
  isOpen,
  onClose,
  onSuccess,
}) => {
  // Use string values for form inputs (number inputs need strings)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate form when sweet changes
  useEffect(() => {
    if (sweet) {
      setFormData({
        name: sweet.name,
        category: sweet.category,
        price: String(Number(sweet.price)),
        quantity: String(Number(sweet.quantity)),
        description: sweet.description || '',
      });
      setError(null);
    }
  }, [sweet]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClose = () => {
    setError(null);
    setLoading(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sweet) return;

    setLoading(true);
    setError(null);

    // Validate numeric fields if they have values
    const priceNum = formData.price === '' ? undefined : parseFloat(formData.price);
    const quantityNum = formData.quantity === '' ? undefined : parseInt(formData.quantity, 10);

    if (formData.price !== '' && (isNaN(priceNum!) || priceNum! < 0)) {
      setError('Please enter a valid price');
      setLoading(false);
      return;
    }

    if (formData.quantity !== '' && (isNaN(quantityNum!) || quantityNum! < 0)) {
      setError('Please enter a valid quantity');
      setLoading(false);
      return;
    }

    try {
      // Only send fields that have been changed
      const updateData: UpdateSweetData = {};
      if (formData.name !== sweet.name) updateData.name = formData.name;
      if (formData.category !== sweet.category) updateData.category = formData.category;
      
      // Compare parsed numbers
      if (priceNum !== undefined) {
        const currentPrice = Number(sweet.price);
        if (priceNum !== currentPrice) {
          updateData.price = priceNum;
        }
      }
      
      if (quantityNum !== undefined) {
        const currentQuantity = Number(sweet.quantity);
        if (quantityNum !== currentQuantity) {
          updateData.quantity = quantityNum;
        }
      }
      
      if (formData.description !== (sweet.description || '')) {
        updateData.description = formData.description;
      }

      if (Object.keys(updateData).length === 0) {
        setError('No changes detected');
        setLoading(false);
        return;
      }

      await updateSweet(sweet.id, updateData);
      onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update sweet');
    } finally {
      setLoading(false);
    }
  };

  if (!sweet) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Sweet">
      <div className="flex items-center space-x-2 mb-6">
        <Edit className="text-purple-600" size={24} />
        <h3 className="text-xl font-bold text-gray-800">Update Sweet Details</h3>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Sweet Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            label="Category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <Input
            label="Price"
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min={0}
            step={0.01}
            required
          />
          <Input
            label="Quantity"
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            min={0}
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows={3}
          />
        </div>

        <div className="flex space-x-3">
          <Button type="button" variant="secondary" onClick={handleClose} fullWidth disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Updating...' : 'Update Sweet'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditSweetForm;

