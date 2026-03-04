const request = require('supertest');
const express = require('express');
const menuRoutes = require('../src/routes/menuRoutes');

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    menu: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma),
  };
});

const { PrismaClient } = require('@prisma/client');
const mockPrisma = new PrismaClient();

// Create an Express app for testing
const app = express();
app.use(express.json());
app.use('/api/menu', menuRoutes);

describe('Snacks API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/menu?category=Snack', () => {
    test('should return only snack category items', async () => {
      const mockSnacks = [
        { id: 1, name: 'Spam Musubi', price: 4.99, category: 'Snack', description: 'Hawaiian classic' },
        { id: 2, name: 'Poke Bowl', price: 12.99, category: 'Entree', description: 'Fresh ahi tuna' },
        { id: 3, name: 'Coconut Chips', price: 3.99, category: 'Snack', description: 'Crunchy coconut snack' },
      ];

      mockPrisma.menu.findMany.mockResolvedValue(mockSnacks);

      const response = await request(app).get('/api/menu?category=Snack');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        mockSnacks[0],
        mockSnacks[2],
      ]);
      expect(mockPrisma.menu.findMany).toHaveBeenCalled();
    });

    test('should handle database errors', async () => {
      mockPrisma.menu.findMany.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app).get('/api/menu?category=Snack');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/menu/:id', () => {
    test('should return a single snack by id', async () => {
      const mockSnack = { id: 1, name: 'Spam Musubi', price: 4.99, category: 'Snack' };

      mockPrisma.menu.findUnique.mockResolvedValue(mockSnack);

      const response = await request(app).get('/api/menu/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSnack);
    });

    test('should return 404 if snack not found', async () => {
      mockPrisma.menu.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/menu/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Menu item not found');
    });
  });

  describe('POST /api/menu', () => {
    test('should create a new snack', async () => {
      const newSnack = {
        name: 'Malasada',
        description: 'Portuguese-style fried dough',
        price: 3.50,
        category: 'Snack',
      };

      const createdSnack = { id: 3, ...newSnack, created_at: new Date() };

      mockPrisma.menu.create.mockResolvedValue(createdSnack);

      const response = await request(app)
        .post('/api/menu')
        .send(newSnack);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newSnack.name);
    });

    test('should handle validation errors', async () => {
      mockPrisma.menu.create.mockRejectedValue(new Error('Validation failed'));

      const response = await request(app)
        .post('/api/menu')
        .send({ name: 'Invalid' });

      expect(response.status).toBe(500);
    });
  });

  describe('PUT /api/menu/:id', () => {
    test('should update an existing snack', async () => {
      const updatedData = { name: 'Updated Musubi', price: 5.99 };
      const updatedSnack = { id: 1, ...updatedData };

      mockPrisma.menu.findUnique.mockResolvedValue({ id: 1, name: 'Old Musubi', category: 'Snack' });

      mockPrisma.menu.update.mockResolvedValue(updatedSnack);

      const response = await request(app)
        .put('/api/menu/1')
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updatedData.name);
    });

    test('should return 404 if snack to update not found', async () => {
      mockPrisma.menu.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/menu/999')
        .send({ name: 'Non-existent' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/menu/:id', () => {
    test('should delete a snack', async () => {
      mockPrisma.menu.findUnique.mockResolvedValue({ id: 1, name: 'Spam Musubi', category: 'Snack' });
      mockPrisma.menu.delete.mockResolvedValue({ id: 1 });

      const response = await request(app).delete('/api/menu/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Menu item deleted');
    });

    test('should return 404 if snack to delete not found', async () => {
      mockPrisma.menu.findUnique.mockResolvedValue(null);

      const response = await request(app).delete('/api/menu/999');

      expect(response.status).toBe(404);
    });
  });
});

