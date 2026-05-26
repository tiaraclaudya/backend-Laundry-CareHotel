-- =============================================
-- UTS BACKEND - DATABASE SCHEMA
-- Jalankan file ini di MySQL dulu sebelum start server
-- =============================================

CREATE DATABASE IF NOT EXISTS uts_backend;
USE uts_backend;

-- =============================================
-- TABEL USERS (untuk auth)
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- TABEL CATEGORIES (relasi ke products)
-- =============================================
CREATE TABLE IF NOT EXISTS categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- TABEL PRODUCTS (relasi ke categories & users)
-- =============================================
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price DECIMAL(15, 2) NOT NULL DEFAULT 0,
  stock INT NOT NULL DEFAULT 0,
  category_id INT NOT NULL,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- DATA SAMPLE
-- =============================================
INSERT INTO categories (name, description) VALUES
  ('Elektronik', 'Produk elektronik dan gadget'),
  ('Pakaian', 'Pakaian pria dan wanita'),
  ('Makanan', 'Produk makanan dan minuman');
