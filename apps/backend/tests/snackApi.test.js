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
app.use('/api/menuitems', menuRoutes);

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

  describe('GET /api/menuitems', () => {
    test('should return all menuitems', async () => {
      const mockMenuItems = [
        { id: 1, name: 'Spam Musubi', price: 4.99, description: 'Hawaiian classic' },
        { id: 2, name: 'Poke Bowl', price: 12.99, description: 'Fresh ahi tuna' },
      ];

      mockPrisma.menu.findMany.mockResolvedValue(mockMenuItems);

      const response = await request(app).get('/api/menuitems');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('count', mockMenuItems.length);
      expect(response.body).toHaveProperty('data', mockMenuItems);
      expect(mockPrisma.menu.findMany).toHaveBeenCalled();
    });

    test('should handle database errors', async () => {
      mockPrisma.menu.findMany.mockRejectedValue(new Error('Database connection failed'));

      const response = await request(app).get('/api/menuitems');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('GET /api/menuitems/:id', () => {
    test('should return a single menuitem by id', async () => {
      const mockMenuItem = { id: 1, name: 'Spam Musubi', price: 4.99 };

      mockPrisma.menu.findUnique.mockResolvedValue(mockMenuItem);

      const response = await request(app).get('/api/menuitems/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMenuItem);
    });

    test('should return 404 if menuitem not found', async () => {
      mockPrisma.menu.findUnique.mockResolvedValue(null);

      const response = await request(app).get('/api/menuitems/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'MenuItem not found');
    });
  });

  describe('POST /api/menuitems', () => {
    test('should create a new menuitem', async () => {
      const newMenuItem = {
        name: 'Malasada',
        description: 'Portuguese-style fried dough',
        price: 3.50,
        category: 'dessert',
      };

      const createdMenuItem = { id: 3, ...newMenuItem, created_at: new Date() };

      mockPrisma.menu.create.mockResolvedValue(createdMenuItem);

      const response = await request(app)
        .post('/api/menuitems')
        .send(newMenuItem);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newMenuItem.name);
    });

    test('should handle validation errors', async () => {
      mockPrisma.menu.create.mockRejectedValue(new Error('Validation failed'));

      const response = await request(app)
        .post('/api/menuitems')
        .send({ name: 'Invalid' });

      expect(response.status).toBe(500);
    });
  });

  describe('PUT /api/menuitems/:id', () => {
    test('should update an existing menuitem', async () => {
      const updatedData = { name: 'Updated Musubi', price: 5.99 };
      const updatedMenuItem = { id: 1, ...updatedData };

      mockPrisma.menu.update.mockResolvedValue(updatedMenuItem);

      const response = await request(app)
        .put('/api/menuitems/1')
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updatedData.name);
    });

    test('should return 404 if menuitem to update not found', async () => {
      mockPrisma.menu.update.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/menuitems/999')
        .send({ name: 'Non-existent' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/menuitems/:id', () => {
    test('should delete a menuitem', async () => {
      mockPrisma.menu.delete.mockResolvedValue({ id: 1 });

      const response = await request(app).delete('/api/menuitems/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'MenuItem deleted');
    });

    test('should return 404 if menuitem to delete not found', async () => {
      mockPrisma.menu.delete.mockRejectedValue({ code: 'P2025' });

      const response = await request(app).delete('/api/menuitems/999');

      expect(response.status).toBe(404);
    });
  });
});

