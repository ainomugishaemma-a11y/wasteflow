-- WasteFlow Smart Bin Monitoring System Database Schema

-- Create Hospitals table
CREATE TABLE IF NOT EXISTS hospitals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Users table
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fullname VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'waste_manager', 'hospital_admin', 'collection_personnel') NOT NULL,
  hospital_id INT,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE SET NULL,
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_status (status)
);

-- Create Bins table
CREATE TABLE IF NOT EXISTS bins (
  id INT PRIMARY KEY AUTO_INCREMENT,
  bin_code VARCHAR(50) UNIQUE NOT NULL,
  location VARCHAR(255) NOT NULL,
  hospital_id INT NOT NULL,
  capacity_percentage INT DEFAULT 0 CHECK (capacity_percentage >= 0 AND capacity_percentage <= 100),
  status ENUM('available', 'nearly_full', 'full') DEFAULT 'available',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
  INDEX idx_bin_code (bin_code),
  INDEX idx_status (status),
  INDEX idx_hospital_id (hospital_id)
);

-- Create Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  bin_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  notification_type ENUM('nearly_full', 'full', 'not_emptied') NOT NULL,
  read_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (bin_id) REFERENCES bins(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_read_status (read_status),
  INDEX idx_created_at (created_at)
);

-- Create Collection Records table
CREATE TABLE IF NOT EXISTS collection_records (
  id INT PRIMARY KEY AUTO_INCREMENT,
  bin_id INT NOT NULL,
  collected_by INT NOT NULL,
  collection_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  remarks TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (bin_id) REFERENCES bins(id) ON DELETE CASCADE,
  FOREIGN KEY (collected_by) REFERENCES users(id) ON DELETE RESTRICT,
  INDEX idx_bin_id (bin_id),
  INDEX idx_collection_date (collection_date)
);

-- Create Activity Logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  action VARCHAR(255) NOT NULL,
  description TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_action (action),
  INDEX idx_timestamp (timestamp)
);

-- Create Bin History table (for analytics)
CREATE TABLE IF NOT EXISTS bin_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  bin_id INT NOT NULL,
  capacity_percentage INT CHECK (capacity_percentage >= 0 AND capacity_percentage <= 100),
  status VARCHAR(50),
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bin_id) REFERENCES bins(id) ON DELETE CASCADE,
  INDEX idx_bin_id (bin_id),
  INDEX idx_recorded_at (recorded_at)
);

-- Create index for bin fill percentage searches
CREATE INDEX idx_capacity_percentage ON bins(capacity_percentage);

-- Create a view for easy dashboard statistics
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT
  COUNT(*) as total_bins,
  SUM(CASE WHEN status = 'available' THEN 1 ELSE 0 END) as available_bins,
  SUM(CASE WHEN status = 'nearly_full' THEN 1 ELSE 0 END) as nearly_full_bins,
  SUM(CASE WHEN status = 'full' THEN 1 ELSE 0 END) as full_bins,
  AVG(capacity_percentage) as avg_capacity,
  MAX(capacity_percentage) as max_capacity
FROM bins
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 1 DAY);
