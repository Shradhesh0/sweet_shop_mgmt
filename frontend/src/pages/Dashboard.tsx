import React, { useState } from 'react';
import { Sweet } from '../types/sweet.types';
import { useAuth } from '../hooks/useAuth';
import { useSweets } from '../hooks/useSweets';
import SearchBar from '../components/sweets/SearchBar';
import SweetsList from '../components/sweets/SweetsList';
import PurchaseModal from '../components/sweets/PurchaseModal';

const Dashboard: React.FC = () => {
  const { isAdmin } = useAuth();
  const { sweets, loading, searchSweets, fetchSweets } = useSweets();
  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);

  const handleSearch = (params: any) => {
    searchSweets(params);
  };

  const handleReset = () => {
    fetchSweets();
  };

  const handlePurchase = (sweet: Sweet) => {
    setSelectedSweet(sweet);
    setPurchaseModalOpen(true);
  };

  const handlePurchaseSuccess = () => {
    fetchSweets();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Sweet Dashboard</h1>
          <p className="text-gray-600">Explore and purchase delicious sweets</p>
        </div>

        <SearchBar onSearch={handleSearch} onReset={handleReset} />
        
        <SweetsList
          sweets={sweets}
          loading={loading}
          isAdmin={isAdmin}
          onPurchase={handlePurchase}
        />

        <PurchaseModal
          sweet={selectedSweet}
          isOpen={purchaseModalOpen}
          onClose={() => setPurchaseModalOpen(false)}
          onSuccess={handlePurchaseSuccess}
        />
      </div>
    </div>
  );
};

export default Dashboard;