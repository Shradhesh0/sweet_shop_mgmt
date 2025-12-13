import { Request, Response } from 'express';
import { SweetModel } from '../models/Sweet';
import { validatePrice, validateQuantity } from '../utils/validation';

export const createSweet = async (req: Request, res: Response) => {
  try {
    const { name, category, price, quantity, description, image_url } = req.body;

    // Validation
    if (!name || !category || price === undefined || quantity === undefined) {
      return res.status(400).json({ 
        error: 'Name, category, price, and quantity are required' 
      });
    }

    if (!validatePrice(price)) {
      return res.status(400).json({ error: 'Invalid price value' });
    }

    if (!validateQuantity(quantity)) {
      return res.status(400).json({ error: 'Invalid quantity value' });
    }

    const sweet = await SweetModel.create({
      name,
      category,
      price,
      quantity,
      description,
      image_url
    });

    res.status(201).json({
      message: 'Sweet created successfully',
      sweet
    });
  } catch (error) {
    console.error('Create sweet error:', error);
    res.status(500).json({ error: 'Failed to create sweet' });
  }
};

export const getAllSweets = async (req: Request, res: Response) => {
  try {
    const sweets = await SweetModel.findAll();
    res.json({ sweets });
  } catch (error) {
    console.error('Get sweets error:', error);
    res.status(500).json({ error: 'Failed to retrieve sweets' });
  }
};

export const searchSweets = async (req: Request, res: Response) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    const searchParams: any = {};
    
    if (name) searchParams.name = name as string;
    if (category) searchParams.category = category as string;
    if (minPrice) searchParams.minPrice = parseFloat(minPrice as string);
    if (maxPrice) searchParams.maxPrice = parseFloat(maxPrice as string);

    const sweets = await SweetModel.search(searchParams);
    
    res.json({ 
      count: sweets.length,
      sweets 
    });
  } catch (error) {
    console.error('Search sweets error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
};

export const updateSweet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No update data provided' });
    }

    // Validate price if provided
    if (updateData.price !== undefined && !validatePrice(updateData.price)) {
      return res.status(400).json({ error: 'Invalid price value' });
    }

    // Validate quantity if provided
    if (updateData.quantity !== undefined && !validateQuantity(updateData.quantity)) {
      return res.status(400).json({ error: 'Invalid quantity value' });
    }

    const sweet = await SweetModel.update(parseInt(id), updateData);

    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    res.json({
      message: 'Sweet updated successfully',
      sweet
    });
  } catch (error) {
    console.error('Update sweet error:', error);
    res.status(500).json({ error: 'Failed to update sweet' });
  }
};

export const deleteSweet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await SweetModel.delete(parseInt(id));

    if (!deleted) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    res.json({ message: 'Sweet deleted successfully' });
  } catch (error) {
    console.error('Delete sweet error:', error);
    res.status(500).json({ error: 'Failed to delete sweet' });
  }
};