import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { CreateSweetData } from '../../types/sweet.types';
import Input from '../common/Input';
import Button from '../common/Button';
import { createSweet } from '../../services/sweet.service';

interface AddSweetFormProps {
  onSuccess: () => void;
}

const AddSweetForm: React.FC<AddSweetFormProps> = ({ onSuccess }) => {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate numeric fields
    const priceNum = parseFloat(formData.price);
    const quantityNum = parseInt(formData.quantity, 10);

    if (isNaN(priceNum) || priceNum < 0) {
      setError('Please enter a valid price');
      setLoading(false);
      return;
    }

    if (isNaN(quantityNum) || quantityNum < 0) {
      setError('Please enter a valid quantity');
      setLoading(false);
      return;
    }

    try {
      // Convert to numbers for API
      await createSweet({
        name: formData.name,
        category: formData.category,
        price: priceNum,
        quantity: quantityNum,
        description: formData.description,
      });
      setFormData({ name: '', category: '', price: '', quantity: '', description: '' });
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to add sweet');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Plus className="text-purple-600" size={24} />
        <h3 className="text-2xl font-bold text-gray-800">Add New Sweet</h3>
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

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Adding...' : 'Add Sweet'}
        </Button>
      </form>
    </div>
  );
};

export default AddSweetForm;