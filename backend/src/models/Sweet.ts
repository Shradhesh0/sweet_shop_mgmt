import { query } from '../config/database';

export interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
  image_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface SweetInput {
  name: string;
  category: string;
  price: number;
  quantity: number;
  description?: string;
  image_url?: string;
}

export interface SearchParams {
  name?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export class SweetModel {
  static async create(sweetData: SweetInput): Promise<Sweet> {
    const text = `
      INSERT INTO sweets (name, category, price, quantity, description, image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      sweetData.name,
      sweetData.category,
      sweetData.price,
      sweetData.quantity,
      sweetData.description || null,
      sweetData.image_url || null
    ];
    
    const result = await query(text, values);
    return result.rows[0];
  }

  static async findAll(): Promise<Sweet[]> {
    const text = 'SELECT * FROM sweets ORDER BY created_at DESC';
    const result = await query(text);
    return result.rows;
  }

  static async findById(id: number): Promise<Sweet | null> {
    const text = 'SELECT * FROM sweets WHERE id = $1';
    const result = await query(text, [id]);
    return result.rows[0] || null;
  }

  static async search(params: SearchParams): Promise<Sweet[]> {
    let text = 'SELECT * FROM sweets WHERE 1=1';
    const values: any[] = [];
    let paramCount = 1;

    if (params.name) {
      text += ` AND name ILIKE $${paramCount}`;
      values.push(`%${params.name}%`);
      paramCount++;
    }

    if (params.category) {
      text += ` AND category ILIKE $${paramCount}`;
      values.push(`%${params.category}%`);
      paramCount++;
    }

    if (params.minPrice !== undefined) {
      text += ` AND price >= $${paramCount}`;
      values.push(params.minPrice);
      paramCount++;
    }

    if (params.maxPrice !== undefined) {
      text += ` AND price <= $${paramCount}`;
      values.push(params.maxPrice);
      paramCount++;
    }

    text += ' ORDER BY created_at DESC';
    
    const result = await query(text, values);
    return result.rows;
  }

  static async update(id: number, sweetData: Partial<SweetInput>): Promise<Sweet | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (sweetData.name !== undefined) {
      fields.push(`name = $${paramCount}`);
      values.push(sweetData.name);
      paramCount++;
    }

    if (sweetData.category !== undefined) {
      fields.push(`category = $${paramCount}`);
      values.push(sweetData.category);
      paramCount++;
    }

    if (sweetData.price !== undefined) {
      fields.push(`price = $${paramCount}`);
      values.push(sweetData.price);
      paramCount++;
    }

    if (sweetData.quantity !== undefined) {
      fields.push(`quantity = $${paramCount}`);
      values.push(sweetData.quantity);
      paramCount++;
    }

    if (sweetData.description !== undefined) {
      fields.push(`description = $${paramCount}`);
      values.push(sweetData.description);
      paramCount++;
    }

    if (sweetData.image_url !== undefined) {
      fields.push(`image_url = $${paramCount}`);
      values.push(sweetData.image_url || null);
      paramCount++;
    }

    if (fields.length === 0) {
      return null;
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const text = `
      UPDATE sweets
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await query(text, values);
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const text = 'DELETE FROM sweets WHERE id = $1 RETURNING id';
    const result = await query(text, [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  static async updateQuantity(id: number, quantityChange: number): Promise<Sweet | null> {
    const text = `
      UPDATE sweets
      SET quantity = quantity + $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND quantity + $1 >= 0
      RETURNING *
    `;
    const result = await query(text, [quantityChange, id]);
    return result.rows[0] || null;
  }
}