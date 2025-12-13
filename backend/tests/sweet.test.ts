import request from 'supertest';
import app from '../src/app';

describe('Sweet Management Endpoints', () => {
  let userToken: string;
  let adminToken: string;

  beforeEach(async () => {
    // register and login with user credential
    const userRes = await request(app).post('/api/auth/register').send({
      email: 'user@example.com',
      password: 'password123',
      name: 'Regular User'
    });
    userToken = userRes.body.token;

    // register and login with admin credential
    const adminRes = await request(app).post('/api/auth/register').send({
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin'
    });
    adminToken = adminRes.body.token;
  });

  describe('POST /api/sweets', () => {
    it('should create a new sweet', async () => {
      const sweetData = {
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.99,
        quantity: 100,
        description: 'Delicious chocolate bar'
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sweetData)
        .expect(201);

      expect(response.body.sweet.name).toBe(sweetData.name);
      expect(response.body.sweet.category).toBe(sweetData.category);
      expect(parseFloat(response.body.sweet.price)).toBe(sweetData.price);
      expect(parseInt(response.body.sweet.quantity)).toBe(sweetData.quantity);
      expect(response.body.sweet.description).toBe(sweetData.description);
      expect(response.body.sweet).toHaveProperty('id');
      expect(response.body.sweet).toHaveProperty('image_url');
    });

    it('should create a sweet with image_url', async () => {
      const sweetData = {
        name: 'Gulab Jamun',
        category: 'Indian',
        price: 50.00,
        quantity: 100,
        description: 'Delicious Indian sweet',
        image_url: 'https://example.com/gulab-jamun.jpg'
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sweetData)
        .expect(201);

      expect(response.body.sweet.image_url).toBe(sweetData.image_url);
    });

    it('should allow regular users to create sweets', async () => {
      const sweetData = {
        name: 'User Created Sweet',
        category: 'Test',
        price: 1.99,
        quantity: 50,
        description: 'Created by regular user'
      };

      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send(sweetData)
        .expect(201);

      expect(response.body.sweet.name).toBe(sweetData.name);
    });

    it('should fail without authentication', async () => {
      const sweetData = {
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 2.99,
        quantity: 100
      };

      await request(app)
        .post('/api/sweets')
        .send(sweetData)
        .expect(401);
    });

    it('should fail with missing required fields', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Chocolate Bar' })
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should fail with invalid price', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Chocolate Bar',
          category: 'Chocolate',
          price: -5,
          quantity: 100
        })
        .expect(400);

      expect(response.body.error).toContain('price');
    });

    it('should fail with invalid quantity', async () => {
      const response = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Chocolate Bar',
          category: 'Chocolate',
          price: 2.99,
          quantity: -10
        })
        .expect(400);

      expect(response.body.error).toContain('quantity');
    });
  });

  describe('GET /api/sweets', () => {
    beforeEach(async () => {
      // Create test sweets
      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Gummy Bears',
          category: 'Gummy',
          price: 1.99,
          quantity: 50
        });

      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Lollipop',
          category: 'Hard Candy',
          price: 0.99,
          quantity: 200
        });
    });

    it('should get all sweets', async () => {
      const response = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.sweets).toHaveLength(2);
      expect(response.body.sweets[0]).toHaveProperty('name');
      expect(response.body.sweets[0]).toHaveProperty('price');
      expect(response.body.sweets[0]).toHaveProperty('image_url');
    });

    it('should fail without authentication', async () => {
      await request(app).get('/api/sweets').expect(401);
    });
  });

  describe('GET /api/sweets/search', () => {
    beforeEach(async () => {
      // Create test sweets
      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Dark Chocolate',
          category: 'Chocolate',
          price: 3.99,
          quantity: 30
        });

      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Milk Chocolate',
          category: 'Chocolate',
          price: 2.49,
          quantity: 40
        });

      await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Sour Gummy',
          category: 'Gummy',
          price: 1.49,
          quantity: 60
        });
    });

    it('should search by name', async () => {
      const response = await request(app)
        .get('/api/sweets/search?name=chocolate')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.sweets).toHaveLength(2);
      expect(response.body.count).toBe(2);
      response.body.sweets.forEach((sweet: any) => {
        expect(sweet).toHaveProperty('image_url');
      });
    });

    it('should search by category', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=Gummy')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.sweets).toHaveLength(1);
      expect(response.body.sweets[0].category).toBe('Gummy');
      expect(response.body.sweets[0]).toHaveProperty('image_url');
    });

    it('should search by price range', async () => {
      const response = await request(app)
        .get('/api/sweets/search?minPrice=2&maxPrice=4')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.sweets).toHaveLength(2);
      response.body.sweets.forEach((sweet: any) => {
        expect(parseFloat(sweet.price)).toBeGreaterThanOrEqual(2);
        expect(parseFloat(sweet.price)).toBeLessThanOrEqual(4);
      });
    });

    it('should combine multiple search parameters', async () => {
      const response = await request(app)
        .get('/api/sweets/search?category=Chocolate&maxPrice=3')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200);

      expect(response.body.sweets).toHaveLength(1);
      expect(response.body.sweets[0].name).toBe('Milk Chocolate');
    });
  });

  describe('PUT /api/sweets/:id', () => {
    let sweetId: number;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Original Name',
          category: 'Original Category',
          price: 5.99,
          quantity: 10
        });
      sweetId = res.body.sweet.id;
    });

    it('should update sweet details', async () => {
      const updateData = {
        name: 'Updated Name',
        price: 6.99
      };

      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.sweet.name).toBe('Updated Name');
      expect(parseFloat(response.body.sweet.price)).toBe(6.99);
    });

    it('should update sweet with image_url', async () => {
      const updateData = {
        image_url: 'https://example.com/updated-image.jpg'
      };

      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.sweet.image_url).toBe(updateData.image_url);
    });

    it('should update sweet to remove image_url', async () => {
      // First add an image_url
      await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ image_url: 'https://example.com/image.jpg' })
        .expect(200);

      // Then remove it by setting to null/empty
      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ image_url: null })
        .expect(200);

      expect(response.body.sweet.image_url).toBeNull();
    });

    it('should fail with invalid sweet ID', async () => {
      await request(app)
        .put('/api/sweets/99999')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Updated Name' })
        .expect(404);
    });

    it('should allow regular users to update sweets', async () => {
      const updateData = {
        description: 'Updated by regular user'
      };

      const response = await request(app)
        .put(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.sweet.description).toBe(updateData.description);
    });

    it('should fail without authentication', async () => {
      await request(app)
        .put(`/api/sweets/${sweetId}`)
        .send({ name: 'Updated Name' })
        .expect(401);
    });
  });

  describe('DELETE /api/sweets/:id', () => {
    let sweetId: number;

    beforeEach(async () => {
      const res = await request(app)
        .post('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'To Delete',
          category: 'Test',
          price: 1.99,
          quantity: 5
        });
      sweetId = res.body.sweet.id;
    });

    it('should delete sweet as admin', async () => {
      await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      // Verify it's deleted
      const getResponse = await request(app)
        .get('/api/sweets')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(getResponse.body.sweets.find((s: any) => s.id === sweetId)).toBeUndefined();
    });

    it('should fail as regular user', async () => {
      await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });

    it('should fail without authentication', async () => {
      await request(app)
        .delete(`/api/sweets/${sweetId}`)
        .expect(401);
    });

    it('should fail with invalid sweet ID', async () => {
      await request(app)
        .delete('/api/sweets/99999')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });
  });
});