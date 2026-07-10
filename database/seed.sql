-- WasteFlow Sample Data

-- Insert Hospitals
INSERT INTO hospitals (name, location, contact_person, email, phone) VALUES
('City Central Hospital', '123 Main St', 'John Smith', 'contact@cityhospital.com', '+1-555-0001'),
('Green Valley Medical Center', '456 Oak Ave', 'Sarah Johnson', 'info@greenvalley.com', '+1-555-0002'),
('Riverside Healthcare', '789 River Rd', 'Mike Davis', 'admin@riverside.com', '+1-555-0003');

-- Insert Users
-- NOTE: Development users are seeded automatically via seedService on server startup
-- or can be seeded with: npm run seed

-- Default development users (created automatically):
-- Admin Accounts:
--   1. komakech@gmail.com / password: job256 / role: admin
--   2. emmanuel@gmail.com / password: job256 / role: admin
-- User Accounts (waste_manager role):
--   3. lisa@gmail.com / password: job256 / role: waste_manager
--   4. mercy@gmail.com / password: job256 / role: waste_manager
--   5. gerald@gmail.com / password: job256 / role: waste_manager

-- Sample users for demonstration purposes
INSERT INTO users (fullname, email, password, role, hospital_id, status) VALUES
('Admin User', 'admin@wasteflow.com', '$2a$10$zzz...', 'admin', NULL, 'active'),
('Waste Manager One', 'waste.manager@cityhospital.com', '$2a$10$zzz...', 'waste_manager', 1, 'active'),
('Hospital Admin', 'hospital.admin@cityhospital.com', '$2a$10$zzz...', 'hospital_admin', 1, 'active'),
('Collection Staff One', 'collector@cityhospital.com', '$2a$10$zzz...', 'collection_personnel', 1, 'active'),
('Waste Manager Two', 'waste.manager@greenvalley.com', '$2a$10$zzz...', 'waste_manager', 2, 'active'),
('Hospital Admin Two', 'hospital.admin@greenvalley.com', '$2a$10$zzz...', 'hospital_admin', 2, 'active');

-- Insert Bins
INSERT INTO bins (bin_code, location, hospital_id, capacity_percentage, status, latitude, longitude) VALUES
('BIN001', 'Emergency Department', 1, 45, 'available', 40.7128, -74.0060),
('BIN002', 'Operating Theater', 1, 78, 'nearly_full', 40.7130, -74.0062),
('BIN003', 'Radiology Department', 1, 92, 'full', 40.7132, -74.0064),
('BIN004', 'ICU Ward', 1, 23, 'available', 40.7134, -74.0066),
('BIN005', 'Pathology Lab', 2, 65, 'available', 40.7500, -74.0100),
('BIN006', 'General Ward', 2, 88, 'nearly_full', 40.7502, -74.0102),
('BIN007', 'Pharmacy', 3, 34, 'available', 40.7600, -74.0200),
('BIN008', 'Surgical Suite', 3, 100, 'full', 40.7602, -74.0202);

-- Insert Notifications (Sample)
INSERT INTO notifications (user_id, bin_id, title, message, notification_type, read_status) VALUES
(2, 3, 'Bin Full - Urgent', 'Bin BIN003 at Radiology Department is full and needs immediate collection', 'full', FALSE),
(2, 2, 'Bin Nearly Full', 'Bin BIN002 at Operating Theater is nearly full (78%)', 'nearly_full', FALSE),
(5, 6, 'Bin Nearly Full', 'Bin BIN006 at General Ward is nearly full (88%)', 'nearly_full', TRUE);

-- Insert Collection Records (Sample)
INSERT INTO collection_records (bin_id, collected_by, collection_date, remarks) VALUES
(1, 4, DATE_SUB(NOW(), INTERVAL 2 DAY), 'Emptied and cleaned'),
(2, 4, DATE_SUB(NOW(), INTERVAL 1 DAY), 'Regular collection'),
(4, 4, NOW(), 'Standard collection');

-- Insert Activity Logs (Sample)
INSERT INTO activity_logs (user_id, action, description) VALUES
(2, 'USER_LOGIN', 'User logged in'),
(1, 'BIN_CREATED', 'Created bin BIN001'),
(4, 'COLLECTION_COMPLETED', 'Collection completed for BIN001'),
(2, 'NOTIFICATION_READ', 'Read notification 1');

-- Insert Bin History (Sample data for last 7 days)
INSERT INTO bin_history (bin_id, capacity_percentage, status, recorded_at) VALUES
(1, 10, 'available', DATE_SUB(NOW(), INTERVAL 7 DAY)),
(1, 15, 'available', DATE_SUB(NOW(), INTERVAL 6 DAY)),
(1, 25, 'available', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(1, 35, 'available', DATE_SUB(NOW(), INTERVAL 4 DAY)),
(1, 40, 'available', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(1, 42, 'available', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(1, 45, 'available', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, 45, 'available', NOW()),
(3, 50, 'available', DATE_SUB(NOW(), INTERVAL 7 DAY)),
(3, 65, 'available', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(3, 75, 'nearly_full', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(3, 88, 'nearly_full', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(3, 92, 'full', NOW());
