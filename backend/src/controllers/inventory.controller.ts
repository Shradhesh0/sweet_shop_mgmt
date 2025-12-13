import { Request, Response } from 'express';
import { SweetModel } from '../models/Sweet';
import { validateQuantity } from '../utils/validation';

export const purchaseSweet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || !validateQuantity(quantity) || quantity <= 0) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }

    // Check if sweet exists and has enough stock
    const sweet = await SweetModel.findById(parseInt(id));
    
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    if (sweet.quantity < quantity) {
      return res.status(400).json({ 
        error: 'Insufficient stock',
        available: sweet.quantity,
        requested: quantity
      });
    }

    // Update quantity (decrease)
    const updatedSweet = await SweetModel.updateQuantity(parseInt(id), -quantity);

    if (!updatedSweet) {
      return res.status(400).json({ error: 'Purchase failed' });
    }

    res.json({
      message: 'Purchase successful',
      sweet: updatedSweet,
      purchased: quantity,
      totalPrice: sweet.price * quantity
    });
  } catch (error) {
    console.error('Purchase error:', error);
    res.status(500).json({ error: 'Purchase failed' });
  }
};

export const restockSweet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || !validateQuantity(quantity) || quantity <= 0) {
      return res.status(400).json({ error: 'Valid quantity is required' });
    }

    // Check if sweet exists
    const sweet = await SweetModel.findById(parseInt(id));
    
    if (!sweet) {
      return res.status(404).json({ error: 'Sweet not found' });
    }

    // Update quantity (increase)
    const updatedSweet = await SweetModel.updateQuantity(parseInt(id), quantity);

    if (!updatedSweet) {
      return res.status(400).json({ error: 'Restock failed' });
    }

    res.json({
      message: 'Restock successful',
      sweet: updatedSweet,
      restocked: quantity
    });
  } catch (error) {
    console.error('Restock error:', error);
    res.status(500).json({ error: 'Restock failed' });
  }
};