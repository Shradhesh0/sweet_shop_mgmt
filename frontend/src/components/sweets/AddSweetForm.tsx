import React, { useState, useRef } from 'react';
import { Plus, Upload, X, Image as ImageIcon } from 'lucide-react';
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
    image_url: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(null); // Clear any previous errors
      
      // Create preview and base64 data
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
      };
      reader.onerror = () => {
        setError('Failed to read image file');
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
      // Get image URL: use uploaded file base64, or URL input, or undefined
      let imageUrl: string | undefined = undefined;
      
      if (imageFile && imagePreview) {
        // Use base64 data from uploaded file
        imageUrl = imagePreview;
      } else if (formData.image_url.trim()) {
        // Use URL from input
        imageUrl = formData.image_url.trim();
      }

      // Convert to numbers for API
      await createSweet({
        name: formData.name,
        category: formData.category,
        price: priceNum,
        quantity: quantityNum,
        description: formData.description || undefined,
        image_url: imageUrl,
      });
      setFormData({ name: '', category: '', price: '', quantity: '', description: '', image_url: '' });
      setImagePreview(null);
      setImageFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
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

        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Adding...' : 'Add Sweet'}
        </Button>
      </form>
    </div>
  );
};

export default AddSweetForm;