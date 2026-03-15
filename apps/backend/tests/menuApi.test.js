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

let consoleErrorSpy;

// Create an Express app for testing
const app = express();
app.use(express.json());
app.use('/api/menu', menuRoutes);

describe('MenuItems API Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    if (consoleErrorSpy) {
      consoleErrorSpy.mockRestore();
      consoleErrorSpy = null;
    }
  });

  describe('GET /api/menu', () => {
    test('should return all menu items', async () => {
      const mockMenuItems = [
        { id: 1, name: 'Spam Musubi', price: 4.99, category: 'Snack', description: 'Hawaiian classic' },
        { id: 2, name: 'Poke Bowl', price: 12.99, category: 'Entree', description: 'Fresh ahi tuna' },
      ];

      mockPrisma.menu.findMany.mockResolvedValue(mockMenuItems);

      const response = await request(app).get('/api/menu');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMenuItems);
      expect(mockPrisma.menu.findMany).toHaveBeenCalled();
    });

    test('should handle database errors', async () => {
      mockPrisma.menu.findMany.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app).get('/api/menu');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/menu/:id', () => {
    test('should return a single item by id', async () => {
      const mockItem = { id: 1, name: 'Spam Musubi', price: 4.99, category: 'Snack' };

      mockPrisma.menu.findUnique.mockResolvedValue(mockItem);

      const response = await request(app).get('/api/menu/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockItem);
    });

    test('should return 404 if item not found', async () => {
      mockPrisma.menu.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/menu/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Menu item not found');
    });
  });

  describe('POST /api/menu', () => {
    test('should create a new menu item', async () => {
      const newItem = {
        name: 'Malasada',
        description: 'Portuguese-style fried dough',
        price: 3.50,
        category: 'Snack',
      };

      const createdItem = { id: 3, ...newItem, created_at: new Date() };

      mockPrisma.menu.create.mockResolvedValue(createdItem);

      const response = await request(app)
        .post('/api/menu')
        .send(newItem);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newItem.name);
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
    test('should update an existing item', async () => {
      const updatedData = { name: 'Updated Musubi', price: 5.99 };
      const updatedItem = { id: 1, ...updatedData, category: 'Snack' };

      mockPrisma.menu.findUnique.mockResolvedValue({ id: 1, name: 'Old Musubi', category: 'Snack' });
      mockPrisma.menu.update.mockResolvedValue(updatedItem);

      const response = await request(app)
        .put('/api/menu/1')
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updatedData.name);
    });

    test('should return 404 if item to update not found', async () => {
      mockPrisma.menu.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/menu/999')
        .send({ name: 'Non-existent' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/menu/:id', () => {
    test('should delete an item', async () => {
      mockPrisma.menu.findUnique.mockResolvedValue({ id: 1, name: 'Spam Musubi', category: 'Snack' });
      mockPrisma.menu.delete.mockResolvedValue({ id: 1 });

      const response = await request(app).delete('/api/menu/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Menu item deleted');
    });

    test('should return 404 if item to delete not found', async () => {
      mockPrisma.menu.findUnique.mockResolvedValue(null);

      const response = await request(app).delete('/api/menu/999');

      expect(response.status).toBe(404);
    });
  });
});

