/**
 * Edit Sweet Form Component
 */

import React, { useState, useEffect, useRef } from 'react';
import { Edit, X, Upload } from 'lucide-react';
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
    image_url: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
        image_url: sweet.image_url || '',
      });
      setImagePreview(sweet.image_url || null);
      setImageFile(null);
      setError(null);
    }
  }, [sweet]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // If image URL is entered, show preview
    if (name === 'image_url' && value) {
      setImagePreview(value);
      setImageFile(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      setFormData(prev => ({ ...prev, image_url: '' }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFile(null);
    setFormData(prev => ({ ...prev, image_url: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    setError(null);
    setLoading(false);
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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

      // Handle image URL: use uploaded file base64, or URL input
      let imageUrl: string | undefined = undefined;
      
      if (imageFile && imagePreview) {
        // Use base64 data from uploaded file
        imageUrl = imagePreview;
      } else if (formData.image_url.trim()) {
        // Use URL from input
        imageUrl = formData.image_url.trim();
      }
      
      // Only update if changed
      const currentImageUrl = sweet.image_url || '';
      if (imageUrl !== currentImageUrl) {
        updateData.image_url = imageUrl;
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

        {/* Image Upload Section */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Image</label>
          
          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-4 relative">
              <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Upload Options */}
          <div className="space-y-3">
            {/* File Upload */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Upload Image File</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="edit-image-upload"
              />
              <label
                htmlFor="edit-image-upload"
                className="flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 hover:bg-purple-50 transition-colors"
              >
                <Upload size={20} className="text-gray-500" />
                <span className="text-gray-700">Choose Image File</span>
              </label>
              <p className="text-xs text-gray-500 mt-1">Max size: 5MB (JPG, PNG, etc.)</p>
            </div>

            {/* OR Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            {/* Image URL Input */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">Enter Image URL</label>
              <Input
                type="url"
                name="image_url"
                value={formData.image_url}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
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

