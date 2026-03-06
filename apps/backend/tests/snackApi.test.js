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
        { id: 1, name: 'Spam Musubi', price: 4.99, description: 'Hawaiian classic' },
        { id: 2, name: 'Poke Bowl', price: 12.99, description: 'Fresh ahi tuna' },
=======
  describe('GET /api/menu?category=Snack', () => {
    test('should return only snack category items', async () => {
      const mockSnacks = [
        { id: 1, name: 'Spam Musubi', price: 4.99, category: 'Snack', description: 'Hawaiian classic' },
        { id: 2, name: 'Poke Bowl', price: 12.99, category: 'Entree', description: 'Fresh ahi tuna' },
        { id: 3, name: 'Coconut Chips', price: 3.99, category: 'Snack', description: 'Crunchy coconut snack' },
>>>>>>> main
      ];

      mockPrisma.menu.findMany.mockResolvedValue(mockMenuItems);

<<<<<<< HEAD
      const response = await request(app).get('/api/menuitems');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('count', mockMenuItems.length);
      expect(response.body).toHaveProperty('data', mockMenuItems);
=======
      const response = await request(app).get('/api/menu?category=Snack');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        mockSnacks[0],
        mockSnacks[2],
      ]);
>>>>>>> main
      expect(mockPrisma.menu.findMany).toHaveBeenCalled();
    });

    test('should handle database errors', async () => {
      mockPrisma.menu.findMany.mockRejectedValue(new Error('Database connection failed'));

<<<<<<< HEAD
      const response = await request(app).get('/api/menuitems');
=======
      const response = await request(app).get('/api/menu?category=Snack');
>>>>>>> main

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
    });
  });

<<<<<<< HEAD
  describe('GET /api/menuitems/:id', () => {
    test('should return a single menuitem by id', async () => {
      const mockMenuItem = { id: 1, name: 'Spam Musubi', price: 4.99 };
=======
  describe('GET /api/menu/:id', () => {
    test('should return a single snack by id', async () => {
      const mockSnack = { id: 1, name: 'Spam Musubi', price: 4.99, category: 'Snack' };
>>>>>>> main

      mockPrisma.menu.findUnique.mockResolvedValue(mockMenuItem);

<<<<<<< HEAD
      const response = await request(app).get('/api/menuitems/1');
=======
      const response = await request(app).get('/api/menu/1');
>>>>>>> main

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockMenuItem);
    });

    test('should return 404 if menuitem not found', async () => {
      mockPrisma.menu.findUnique.mockResolvedValue(null);

<<<<<<< HEAD
      const response = await request(app).get('/api/menuitems/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'MenuItem not found');
    });
  });

  describe('POST /api/menuitems', () => {
    test('should create a new menuitem', async () => {
      const newMenuItem = {
=======
      const response = await request(app).get('/api/menu/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Menu item not found');
    });
  });

  describe('POST /api/menu', () => {
    test('should create a new snack', async () => {
      const newSnack = {
>>>>>>> main
        name: 'Malasada',
        description: 'Portuguese-style fried dough',
        price: 3.50,
        category: 'Snack',
      };

      const createdMenuItem = { id: 3, ...newMenuItem, created_at: new Date() };

      mockPrisma.menu.create.mockResolvedValue(createdMenuItem);

      const response = await request(app)
<<<<<<< HEAD
        .post('/api/menuitems')
        .send(newMenuItem);
=======
        .post('/api/menu')
        .send(newSnack);
>>>>>>> main

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(newMenuItem.name);
    });

    test('should handle validation errors', async () => {
      mockPrisma.menu.create.mockRejectedValue(new Error('Validation failed'));

      const response = await request(app)
<<<<<<< HEAD
        .post('/api/menuitems')
=======
        .post('/api/menu')
>>>>>>> main
        .send({ name: 'Invalid' });

      expect(response.status).toBe(500);
    });
  });

<<<<<<< HEAD
  describe('PUT /api/menuitems/:id', () => {
    test('should update an existing menuitem', async () => {
=======
  describe('PUT /api/menu/:id', () => {
    test('should update an existing snack', async () => {
>>>>>>> main
      const updatedData = { name: 'Updated Musubi', price: 5.99 };
      const updatedMenuItem = { id: 1, ...updatedData };

<<<<<<< HEAD
      mockPrisma.menu.update.mockResolvedValue(updatedMenuItem);

      const response = await request(app)
        .put('/api/menuitems/1')
=======
      mockPrisma.menu.findUnique.mockResolvedValue({ id: 1, name: 'Old Musubi', category: 'Snack' });

      mockPrisma.menu.update.mockResolvedValue(updatedSnack);

      const response = await request(app)
        .put('/api/menu/1')
>>>>>>> main
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updatedData.name);
    });

<<<<<<< HEAD
    test('should return 404 if menuitem to update not found', async () => {
      mockPrisma.menu.update.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/menuitems/999')
=======
    test('should return 404 if snack to update not found', async () => {
      mockPrisma.menu.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/menu/999')
>>>>>>> main
        .send({ name: 'Non-existent' });

      expect(response.status).toBe(404);
    });
  });

<<<<<<< HEAD
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
=======
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
>>>>>>> main

      expect(response.status).toBe(404);
    });
  });
});

