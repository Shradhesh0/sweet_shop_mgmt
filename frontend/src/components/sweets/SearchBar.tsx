/**
 * Search Bar Component for filtering sweets
 */

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import { SearchParams } from '../../types/sweet.types';

interface SearchBarProps {
  onSearch: (params: SearchParams) => void;
  onReset: () => void;
}

/**
 * Search bar with multiple filter options
 */
const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onReset }) => {
  const [filters, setFilters] = useState<SearchParams>({
    name: '',
    category: '',
    minPrice: undefined,
    maxPrice: undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value === '' ? undefined : name.includes('Price') ? parseFloat(value) : value,
    }));
  };

  const handleSearch = () => {
    const cleanFilters: SearchParams = {};
    if (filters.name) cleanFilters.name = filters.name;
    if (filters.category) cleanFilters.category = filters.category;
    if (filters.minPrice !== undefined) cleanFilters.minPrice = filters.minPrice;
    if (filters.maxPrice !== undefined) cleanFilters.maxPrice = filters.maxPrice;
    
    onSearch(cleanFilters);
  };

  const handleReset = () => {
    setFilters({
      name: '',
      category: '',
      minPrice: undefined,
      maxPrice: undefined,
    });
    onReset();
  };

  const hasFilters = filters.name || filters.category || filters.minPrice !== undefined || filters.maxPrice !== undefined;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <Search className="text-purple-600" size={24} />
        <h3 className="text-xl font-semibold text-gray-800">Search & Filter</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Input
          name="name"
          value={filters.name || ''}
          onChange={handleChange}
          placeholder="Search by name..."
        />

        <Input
          name="category"
          value={filters.category || ''}
          onChange={handleChange}
          placeholder="Filter by category..."
        />

        <Input
          name="minPrice"
          type="number"
          value={filters.minPrice ?? ''}
          onChange={handleChange}
          placeholder="Min price"
          min={0}
          step={0.01}
        />

        <Input
          name="maxPrice"
          type="number"
          value={filters.maxPrice ?? ''}
          onChange={handleChange}
          placeholder="Max price"
          min={0}
          step={0.01}
        />
      </div>

      <div className="flex justify-end space-x-3 mt-4">
        {hasFilters && (
          <Button variant="secondary" onClick={handleReset}>
            <div className="flex items-center space-x-1">
              <X size={18} />
              <span>Clear</span>
            </div>
          </Button>
        )}
        <Button onClick={handleSearch}>
          <div className="flex items-center space-x-1">
            <Search size={18} />
            <span>Search</span>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;