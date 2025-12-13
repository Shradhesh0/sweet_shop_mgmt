/**
 * Custom hook for managing sweets data
 */

import { useState, useEffect, useCallback } from 'react';
import { Sweet, SearchParams } from '../types/sweet.types';
import * as sweetService from '../services/sweet.service';

/**
 * Hook to manage sweets data and operations
 */
export const useSweets = () => {
  const [sweets, setSweets] = useState<Sweet[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all sweets
   */
  const fetchSweets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await sweetService.getAllSweets();
      setSweets(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch sweets');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Search sweets with filters
   */
  const searchSweets = useCallback(async (params: SearchParams) => {
    setLoading(true);
    setError(null);
    try {
      const data = await sweetService.searchSweets(params);
      setSweets(data);
    } catch (err: any) {
      setError(err.message || 'Failed to search sweets');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh sweets list
   */
  const refresh = useCallback(() => {
    fetchSweets();
  }, [fetchSweets]);

  // Initial fetch on mount
  useEffect(() => {
    fetchSweets();
  }, [fetchSweets]);

  return {
    sweets,
    loading,
    error,
    fetchSweets,
    searchSweets,
    refresh,
  };
};