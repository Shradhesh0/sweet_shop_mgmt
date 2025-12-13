import React, { useState } from 'react';
import { Sweet } from '../types/sweet.types';
import { useSweets } from '../hooks/useSweets';
import { deleteSweet } from '../services/sweet.service';
import SearchBar from '../components/sweets/SearchBar';
import SweetsList from '../components/sweets/SweetsList';
import AddSweetForm from '../components/sweets/AddSweetForm';
import EditSweetForm from '../components/sweets/EditSweetForm';
import PurchaseModal from '../components/sweets/PurchaseModal';
import RestockModal from '../components/sweets/RestockModal';
import DeleteConfirmationModal from '../components/sweets/DeleteConfirmationModal';

const AdminPanel: React.FC = () => {
  const { sweets, loading, searchSweets, fetchSweets } = useSweets();
  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null);
  const [purchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleEdit = (sweet: Sweet) => {
    setSelectedSweet(sweet);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (sweet: Sweet) => {
    setSelectedSweet(sweet);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSweet) return;

    setDeleteLoading(true);
    try {
      await deleteSweet(selectedSweet.id);
      fetchSweets();
      setDeleteModalOpen(false);
      setSelectedSweet(null);
    } catch (error: any) {
      alert(error.message || 'Failed to delete sweet');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleRestock = (sweet: Sweet) => {
    setSelectedSweet(sweet);
    setRestockModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage your sweet inventory</p>
        </div>

        {/* Add New Sweet Form */}
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
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onRestock={handleRestock}
          />
        </div>

        {/* Modals */}
        <PurchaseModal
          sweet={selectedSweet}
          isOpen={purchaseModalOpen}
          onClose={() => {
            setPurchaseModalOpen(false);
            setSelectedSweet(null);
          }}
          onSuccess={fetchSweets}
        />

        <EditSweetForm
          sweet={selectedSweet}
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedSweet(null);
          }}
          onSuccess={fetchSweets}
        />

        <RestockModal
          sweet={selectedSweet}
          isOpen={restockModalOpen}
          onClose={() => {
            setRestockModalOpen(false);
            setSelectedSweet(null);
          }}
          onSuccess={fetchSweets}
        />

        <DeleteConfirmationModal
          sweet={selectedSweet}
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setSelectedSweet(null);
          }}
          onConfirm={handleDeleteConfirm}
          loading={deleteLoading}
        />
      </div>
    </div>
  );
};

export default AdminPanel;