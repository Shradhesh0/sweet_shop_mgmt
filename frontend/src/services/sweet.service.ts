/**
 * Sweet management service for API calls
 */

import api from './api';
import {
  Sweet,
  CreateSweetData,
  UpdateSweetData,
  SearchParams,
  PurchaseRequest,
  RestockRequest,
} from '../types/sweet.types';

/**
 * Normalize sweet data to ensure proper types
 */
const normalizeSweet = (sweet: any): Sweet => ({
  ...sweet,
  price: typeof sweet.price === 'string' ? parseFloat(sweet.price) : Number(sweet.price),
  quantity: typeof sweet.quantity === 'string' ? parseInt(sweet.quantity, 10) : Number(sweet.quantity),
  id: typeof sweet.id === 'string' ? parseInt(sweet.id, 10) : Number(sweet.id),
  image_url: sweet.image_url || undefined,
});

/**
 * Get all sweets
 */
export const getAllSweets = async (): Promise<Sweet[]> => {
  const response = await api.get<{ sweets: Sweet[] }>('/sweets');
  return response.data.sweets.map(normalizeSweet);
};

/**
 * Search sweets with filters
 */
export const searchSweets = async (params: SearchParams): Promise<Sweet[]> => {
  const queryParams = new URLSearchParams();
  
  if (params.name) queryParams.append('name', params.name);
  if (params.category) queryParams.append('category', params.category);
  if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString());
  if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString());

  const response = await api.get<{ sweets: Sweet[] }>(`/sweets/search?${queryParams.toString()}`);
  return response.data.sweets.map(normalizeSweet);
};

/**
 * Create a new sweet
 */
export const createSweet = async (data: CreateSweetData): Promise<Sweet> => {
  const response = await api.post<{ sweet: Sweet }>('/sweets', data);
  return normalizeSweet(response.data.sweet);
};

/**
 * Update an existing sweet
 */
export const updateSweet = async (id: number, data: UpdateSweetData): Promise<Sweet> => {
  const response = await api.put<{ sweet: Sweet }>(`/sweets/${id}`, data);
  return normalizeSweet(response.data.sweet);
};

/**
 * Delete a sweet
 */
export const deleteSweet = async (id: number): Promise<void> => {
  await api.delete(`/sweets/${id}`);
};

/**
 * Purchase a sweet
 */
export const purchaseSweet = async (id: number, data: PurchaseRequest): Promise<any> => {
  const response = await api.post(`/sweets/${id}/purchase`, data);
  return response.data;
};

/**
 * Restock a sweet (admin only)
 */
export const restockSweet = async (id: number, data: RestockRequest): Promise<any> => {
  const response = await api.post(`/sweets/${id}/restock`, data);
  return response.data;
};