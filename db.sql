-- Simba Luxury Booking Database Setup

CREATE DATABASE IF NOT EXISTS simba_luxury_db;
USE simba_luxury_db;

-- Table for user bookings
CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pickup_date DATE NOT NULL,
    pickup_time TIME NOT NULL,
    pickup_location VARCHAR(255) NOT NULL,
    dropoff_location VARCHAR(255) NOT NULL,
    transfer_type ENUM('One Way', 'Return') DEFAULT 'One Way',
    return_date DATE,
    return_time TIME,
    extra_waiting VARCHAR(50),
    distance VARCHAR(50),
    duration VARCHAR(50),
    passengers INT DEFAULT 1,
    bags INT DEFAULT 1,
    vehicle_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    flight_number VARCHAR(20),
    comments TEXT,
    status ENUM('Pending', 'Confirmed', 'Cancelled') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for cars/fleet
CREATE TABLE IF NOT EXISTS cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    image_url TEXT,
    passengers INT NOT NULL,
    bags INT NOT NULL,
    price_per_km DECIMAL(10, 2) NOT NULL,
    base_price DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some default cars
INSERT INTO cars (name, image_url, passengers, bags, price_per_km, base_price)
VALUES 
('Business suv', 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf', 6, 6, 5.50, 150.00),
('Luxury SUV', 'https://images.unsplash.com/photo-1503376780353-7e6692767b70', 6, 6, 7.20, 200.00);

-- Table for admin users
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin
INSERT INTO admins (name, email, password) 
VALUES ('Admin', 'admin@gmail.com', 'admin123@');
