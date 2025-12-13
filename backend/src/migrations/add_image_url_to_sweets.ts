/**
 * Migration: Add image_url column to sweets table
 * Run this migration to add image_url support
 */

import { query } from '../config/database';

export const addImageUrlToSweets = async (): Promise<void> => {
  try {
    // First check if sweets table exists
    const checkTable = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'sweets';
    `;
    
    const tableResult = await query(checkTable);
    
    if (tableResult.rows.length === 0) {
      console.log('⚠️  sweets table does not exist, skipping image_url migration');
      return;
    }

    // Check if column already exists
    const checkColumn = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='sweets' AND column_name='image_url';
    `;
    
    const result = await query(checkColumn);
    
    if (result.rows.length === 0) {
      // Add image_url column if it doesn't exist
      await query(`
        ALTER TABLE sweets 
        ADD COLUMN image_url TEXT;
      `);
      console.log('✅ Added image_url column to sweets table');
    } else {
      console.log('✅ image_url column already exists in sweets table');
    }
  } catch (error) {
    console.error('❌ Error adding image_url column:', error);
    // Don't throw - allow server to continue even if migration fails
    // This prevents server crash on first run before tables are created
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  addImageUrlToSweets()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

