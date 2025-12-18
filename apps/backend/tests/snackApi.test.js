const request = require('supertest');
const express = require('express');
const snackRoutes = require('../src/routes/snackRoutes');

// Mock the database
jest.mock('../src/config/database');
const db = require('../src/config/database');

// Create an Express app for testing
const app = express();
app.use(express.json());
app.use('/api/snacks', snackRoutes);

describe('Snacks API Endpoints', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('GET /api/snacks', () => {
    test('should return all snacks', async () => {
      const mockSnacks = [
        { id: 1, name: 'Spam Musubi', price: 4.99, description: 'Hawaiian classic' },
        { id: 2, name: 'Poke Bowl', price: 12.99, description: 'Fresh ahi tuna' },
      ];

      db.query.mockResolvedValue({ rows: mockSnacks });

      const response = await request(app).get('/api/snacks');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSnacks);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM snacks ORDER BY id');
    });

    test('should handle database errors', async () => {
      db.query.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app).get('/api/snacks');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/snacks/:id', () => {
    test('should return a single snack by id', async () => {
      const mockSnack = { id: 1, name: 'Spam Musubi', price: 4.99 };

      db.query.mockResolvedValue({ rows: [mockSnack] });

      const response = await request(app).get('/api/snacks/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSnack);
    });

    test('should return 404 if snack not found', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const response = await request(app).get('/api/snacks/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Snack not found');
    });
  });

  describe('POST /api/snacks', () => {
    test('should create a new snack', async () => {
      const newSnack = {
        name: 'Malasada',
        description: 'Portuguese-style fried dough',
        price: 3.50,
        category: 'dessert',
      };

      const createdSnack = { id: 3, ...newSnack, created_at: new Date() };

      db.query.mockResolvedValue({ rows: [createdSnack] });

      const response = await request(app)
        .post('/api/snacks')
        .send(newSnack);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newSnack.name);
    });

    test('should handle validation errors', async () => {
      db.query.mockRejectedValue(new Error('Validation failed'));

      const response = await request(app)
        .post('/api/snacks')
        .send({ name: 'Invalid' }); // Missing required fields

      expect(response.status).toBe(500);
    });
  });

  describe('PUT /api/snacks/:id', () => {
    test('should update an existing snack', async () => {
      const updatedData = { name: 'Updated Musubi', price: 5.99 };
      const updatedSnack = { id: 1, ...updatedData };

      db.query.mockResolvedValue({ rows: [updatedSnack] });

      const response = await request(app)
        .put('/api/snacks/1')
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updatedData.name);
    });

    test('should return 404 if snack to update not found', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .put('/api/snacks/999')
        .send({ name: 'Non-existent' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/snacks/:id', () => {
    test('should delete a snack', async () => {
      db.query.mockResolvedValue({ rows: [{ id: 1 }] });

      const response = await request(app).delete('/api/snacks/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Snack deleted');
    });

    test('should return 404 if snack to delete not found', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const response = await request(app).delete('/api/snacks/999');

      expect(response.status).toBe(404);
    });
  });
});
