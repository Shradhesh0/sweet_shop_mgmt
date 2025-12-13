import React, { useState } from 'react';
import { Sweet } from '../types/sweet.types';
import { useSweets } from '../hooks/useSweets';
import { deleteSweet, restockSweet } from '../services/sweet.service';
import SearchBar from '../components/sweets/SearchBar';
import SweetsList from '../components/sweets/SweetsList';
import AddSweetForm from '../components/sweets/AddSweetForm';
import PurchaseModal from '../components/sweets/PurchaseModal';

const AdminPanel: React.FC = () => {
  const { sweets, loading, searchSweets, fetchSweets } = useSweets();
  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);

  const handleDelete = async (sweet: Sweet) => {
    if (window.confirm(`Are you sure you want to delete "${sweet.name}"?`)) {
      try {
        await deleteSweet(sweet.id);
        fetchSweets();
      } catch (error: any) {
        alert(error.message || 'Failed to delete sweet');
      }
    }
  };

  const handleRestock = async (sweet: Sweet) => {
    const quantity = prompt('Enter quantity to restock:', '10');
    if (quantity) {
      try {
        await restockSweet(sweet.id, { quantity: parseInt(quantity) });
        fetchSweets();
      } catch (error: any) {
        alert(error.message || 'Failed to restock');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage your sweet inventory</p>
        </div>

        <AddSweetForm onSuccess={fetchSweets} />

        <div className="mt-8">
          <SearchBar onSearch={searchSweets} onReset={fetchSweets} />
          
          <SweetsList
            sweets={sweets}
            loading={loading}
            isAdmin={true}
            onPurchase={(sweet) => {
              setSelectedSweet(sweet);
              setPurchaseModalOpen(true);
            }}
            onDelete={handleDelete}
            onRestock={handleRestock}
          />
        </div>

        <PurchaseModal
          sweet={selectedSweet}
          isOpen={purchaseModalOpen}
          onClose={() => setPurchaseModalOpen(false)}
          onSuccess={fetchSweets}
        />
      </div>
    </div>
  );
};

export default AdminPanel;