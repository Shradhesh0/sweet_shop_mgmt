import request from 'supertest';
import app from '../src/app';

describe('Inventory Management Endpoints', () => {
  let userToken: string;
  let adminToken: string;
  let sweetId: number;

  beforeEach(async () => {
    // Register users
    const userRes = await request(app).post('/api/auth/register').send({
      email: 'user@example.com',
      password: 'password123',
      name: 'Regular User'
    });
    userToken = userRes.body.token;

    const adminRes = await request(app).post('/api/auth/register').send({
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin'
    });
    adminToken = adminRes.body.token;

    // Create a test sweet
    const sweetRes = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Test Sweet',
        category: 'Test',
        price: 1.99,
        quantity: 100
      });
    sweetId = sweetRes.body.sweet.id;
  });

  describe('POST /api/sweets/:id/purchase', () => {
    it('should purchase sweet successfully', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 10 })
        .expect(200);

      expect(response.body.message).toContain('successful');
      expect(response.body.purchased).toBe(10);
      expect(response.body.sweet.quantity).toBe(90);
      expect(response.body.totalPrice).toBe(19.9);
    });

    it('should fail with insufficient stock', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 150 })
        .expect(400);

      expect(response.body.error).toContain('Insufficient stock');
      expect(response.body.available).toBe(100);
      expect(response.body.requested).toBe(150);
    });

    it('should fail with invalid quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: -5 })
        .expect(400);

      expect(response.body.error).toContain('quantity');
    });

    it('should fail with zero quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 0 })
        .expect(400);

      expect(response.body.error).toContain('quantity');
    });

    it('should fail without authentication', async () => {
      await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .send({ quantity: 10 })
        .expect(401);
    });

    it('should fail with non-existent sweet', async () => {
      await request(app)
        .post('/api/sweets/99999/purchase')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 10 })
        .expect(404);
    });

    it('should handle multiple purchases correctly', async () => {
      // First purchase
      await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 30 })
        .expect(200);

      // Second purchase
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 20 })
        .expect(200);

      expect(response.body.sweet.quantity).toBe(50);
    });
  });

  describe('POST /api/sweets/:id/restock', () => {
    it('should restock sweet as admin', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 50 })
        .expect(200);

      expect(response.body.message).toContain('successful');
      expect(response.body.restocked).toBe(50);
      expect(response.body.sweet.quantity).toBe(150);
    });

    it('should fail as regular user', async () => {
      await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 50 })
        .expect(403);
    });

    it('should fail without authentication', async () => {
      await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .send({ quantity: 50 })
        .expect(401);
    });

    it('should fail with invalid quantity', async () => {
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: -10 })
        .expect(400);

      expect(response.body.error).toContain('quantity');
    });

    it('should fail with non-existent sweet', async () => {
      await request(app)
        .post('/api/sweets/99999/restock')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 50 })
        .expect(404);
    });

    it('should handle multiple restocks correctly', async () => {
      // First restock
      await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 25 })
        .expect(200);

      // Second restock
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 25 })
        .expect(200);

      expect(response.body.sweet.quantity).toBe(150);
    });
  });

  describe('Purchase and Restock Integration', () => {
    it('should handle purchase then restock workflow', async () => {
      // Purchase
      await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 60 })
        .expect(200);

      // Check quantity
      let getRes = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`);
      
      let sweet = getRes.body.sweets.find((s: any) => s.id === sweetId);
      expect(sweet.quantity).toBe(40);

      // Restock
      await request(app)
        .post(`/api/sweets/${sweetId}/restock`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ quantity: 100 })
        .expect(200);

      // Verify final quantity
      getRes = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`);
      
      sweet = getRes.body.sweets.find((s: any) => s.id === sweetId);
      expect(sweet.quantity).toBe(140);
    });

    it('should prevent purchase when quantity would go negative', async () => {
      // Purchase most stock
      await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 95 })
        .expect(200);

      // Try to purchase more than available
      const response = await request(app)
        .post(`/api/sweets/${sweetId}/purchase`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ quantity: 10 })
        .expect(400);

      expect(response.body.error).toContain('Insufficient stock');
      expect(response.body.available).toBe(5);
    });
  });
});