-- Database initialization script for Taste of Aloha
-- This script creates the initial schema and tables

-- Create snacks table
CREATE TABLE IF NOT EXISTS snacks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    category VARCHAR(100),
    available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_snacks_updated_at 
    BEFORE UPDATE ON snacks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO snacks (name, description, price, category) VALUES
    ('Spam Musubi', 'Hawaiian classic with grilled spam on rice wrapped in nori', 4.99, 'snack'),
    ('Poke Bowl', 'Fresh ahi tuna with rice, seaweed, and vegetables', 12.99, 'meal'),
    ('Malasada', 'Portuguese-style fried dough rolled in sugar', 3.50, 'dessert'),
    ('Haupia', 'Traditional coconut milk-based Hawaiian dessert', 5.99, 'dessert'),
    ('Loco Moco', 'Rice, hamburger patty, fried egg, and brown gravy', 11.99, 'meal')
ON CONFLICT (name) DO NOTHING;
