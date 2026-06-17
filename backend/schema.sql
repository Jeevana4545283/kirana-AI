-- Supabase Database Schema for KiranaAI

-- Enable UUID extension if needed (optional)
-- create extension if not exists "uuid-ossp";

-- Products Table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    unit_price DECIMAL(10, 2) NOT NULL
);

-- Inventory Table
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    current_stock INTEGER NOT NULL,
    reorder_level INTEGER NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sales Table
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity_sold INTEGER NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    sale_date DATE NOT NULL
);

-- Suppliers Table
CREATE TABLE suppliers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    product_id INTEGER REFERENCES products(id),
    price DECIMAL(10, 2) NOT NULL,
    delivery_time_days INTEGER NOT NULL,
    reliability_score DECIMAL(3, 2) NOT NULL
);

-- Purchase Orders Table
CREATE TABLE purchase_orders (
    id SERIAL PRIMARY KEY,
    supplier_id INTEGER REFERENCES suppliers(id),
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    total_cost DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    order_date DATE DEFAULT CURRENT_DATE
);

-- Predictions Table
CREATE TABLE predictions (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    target_date DATE NOT NULL,
    predicted_demand INTEGER NOT NULL
);

-- Initial Data Seeding (Matches CSV files)

-- Insert Products
INSERT INTO products (id, name, category, unit_price) VALUES
(101, 'Aashirvaad Atta 5kg', 'Staples', 200.00),
(102, 'Fortune Oil 1L', 'Staples', 150.00),
(103, 'Maggi 70g', 'Snacks', 14.00);

-- Insert Inventory
INSERT INTO inventory (product_id, current_stock, reorder_level) VALUES
(101, 8, 15),
(102, 5, 10),
(103, 150, 50);

-- Insert Sales
INSERT INTO sales (product_id, quantity_sold, total_price, sale_date) VALUES
(101, 12, 2400.00, '2023-10-01'),
(101, 15, 3000.00, '2023-10-02'),
(101, 20, 4000.00, '2023-10-03'),
(102, 5, 750.00, '2023-10-01'),
(102, 8, 1200.00, '2023-10-02'),
(102, 6, 900.00, '2023-10-03'),
(103, 50, 700.00, '2023-10-01'),
(103, 60, 840.00, '2023-10-02'),
(103, 45, 630.00, '2023-10-03');

-- Insert Suppliers
INSERT INTO suppliers (id, name, product_id, price, delivery_time_days, reliability_score) VALUES
(1, 'Raju Wholesale', 101, 190.00, 1, 0.95),
(2, 'Metro Cash & Carry', 101, 185.00, 2, 0.99),
(3, 'Super Mart', 102, 145.00, 1, 0.90),
(4, 'City Distributors', 102, 140.00, 3, 0.98),
(5, 'Local Vendor', 103, 12.00, 1, 0.85);

-- Reset Sequences to avoid id conflicts
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));
SELECT setval('suppliers_id_seq', (SELECT MAX(id) FROM suppliers));
