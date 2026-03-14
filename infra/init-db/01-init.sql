-- Database initialization script for Taste of Aloha
-- This script creates the initial schema and tables

-- Create Menu table (matches Prisma model)
CREATE TABLE IF NOT EXISTS "Menu" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    image VARCHAR(500),
    category VARCHAR(100) NOT NULL,
    "isAvailable" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_menu_updated_at
    BEFORE UPDATE ON "Menu"
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO "Menu" (name, description, price, category) VALUES
    ('Spam Musubi', 'Hawaiian classic with grilled spam on rice wrapped in nori', 4.99, 'menuitem'),
    ('Poke Bowl', 'Fresh ahi tuna with rice, seaweed, and vegetables', 12.99, 'meal'),
    ('Malasada', 'Portuguese-style fried dough rolled in sugar', 3.50, 'dessert'),
    ('Haupia', 'Traditional coconut milk-based Hawaiian dessert', 5.99, 'dessert'),
    ('Loco Moco', 'Rice, hamburger patty, fried egg, and brown gravy', 11.99, 'meal')
ON CONFLICT (name) DO NOTHING;
