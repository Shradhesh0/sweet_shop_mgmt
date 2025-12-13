/**
 * Sweets List Component
 */

import React from 'react';
import { Sweet } from '../../types/sweet.types';
import SweetCard from './SweetCard';
import Loading from '../common/Loading';

interface SweetsListProps {
  sweets: Sweet[];
  loading: boolean;
  isAdmin: boolean;
  onPurchase: (sweet: Sweet) => void;
  onEdit?: (sweet: Sweet) => void;
  onDelete?: (sweet: Sweet) => void;
  onRestock?: (sweet: Sweet) => void;
}

/**
 * Grid display of sweet cards
 */
const SweetsList: React.FC<SweetsListProps> = ({
  sweets,
  loading,
  isAdmin,
  onPurchase,
  onEdit,
  onDelete,
  onRestock,
}) => {
  if (loading) {
    return <Loading size="lg" text="Loading sweets..." />;
  }

  if (sweets.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🍭</div>
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">No sweets found</h3>
        <p className="text-gray-500">Try adjusting your search filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sweets.map((sweet) => (
        <SweetCard
          key={sweet.id}
          sweet={sweet}
          isAdmin={isAdmin}
          onPurchase={onPurchase}
          onEdit={onEdit}
          onDelete={onDelete}
          onRestock={onRestock}
        />
      ))}
    </div>
  );
};

export default SweetsList;