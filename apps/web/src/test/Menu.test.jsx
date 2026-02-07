import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import snackReducer, { fetchSnacks, createSnack } from '../store/slices/snackSlice';
import Menu from '../pages/Menu';

// Mock the snackService
vi.mock('../services/snackService', () => ({
  snackService: {
    getAllSnacks: vi.fn(),
    createSnack: vi.fn(),
  },
}));

import { snackService } from '../services/snackService';

describe('Menu Component', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        menuitems: snackReducer,
      },
    });
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    snackService.getAllSnacks.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(
      <Provider store={store}>
        <Menu />
      </Provider>
    );

    expect(screen.getByText(/Loading menuitems/i)).toBeInTheDocument();
  });

  it('should display menuitems when loaded', async () => {
    const mockSnacks = [
      { id: 1, name: 'Spam Musubi', price: 4.99, description: 'Hawaiian classic' },
      { id: 2, name: 'Poke Bowl', price: 12.99, description: 'Fresh ahi tuna' },
    ];

    snackService.getAllSnacks.mockResolvedValue(mockSnacks);

    render(
      <Provider store={store}>
        <Menu />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Spam Musubi')).toBeInTheDocument();
      expect(screen.getByText('Poke Bowl')).toBeInTheDocument();
    });
  });

  it('should display error message when fetch fails', async () => {
    snackService.getAllSnacks.mockRejectedValue(new Error('Network error'));

    render(
      <Provider store={store}>
        <Menu />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error/i)).toBeInTheDocument();
    });
  });

  it('should display message when no menuitems available', async () => {
    snackService.getAllSnacks.mockResolvedValue([]);

    render(
      <Provider store={store}>
        <Menu />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/No menuitems available/i)).toBeInTheDocument();
    });
  });
});

describe('MenuItem Slice Redux', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        menuitems: snackReducer,
      },
    });
    vi.clearAllMocks();
  });

  it('should handle fetchSnacks pending state', () => {
    store.dispatch(fetchSnacks.pending());
    const state = store.getState().menuitems;
    expect(state.loading).toBe(true);
    expect(state.error).toBe(null);
  });

  it('should handle fetchSnacks fulfilled state', () => {
    const mockSnacks = [
      { id: 1, name: 'Spam Musubi', price: 4.99 },
    ];
    store.dispatch(fetchSnacks.fulfilled(mockSnacks));
    const state = store.getState().menuitems;
    expect(state.loading).toBe(false);
    expect(state.menuitems).toEqual(mockSnacks);
  });

  it('should handle createSnack and add to state', async () => {
    const newSnack = {
      name: 'Malasada',
      price: 3.50,
      description: 'Portuguese-style fried dough',
    };

    const createdSnack = { id: 3, ...newSnack };
    snackService.createSnack.mockResolvedValue(createdSnack);

    await store.dispatch(createSnack(newSnack));
    const state = store.getState().menuitems;

    expect(state.menuitems).toContainEqual(createdSnack);
  });
});
