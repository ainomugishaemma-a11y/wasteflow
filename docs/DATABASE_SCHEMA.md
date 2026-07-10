# WasteFlow Database Schema Documentation

## Database: wasteflow_db

### Tables Overview

```
hospitals (1) ──────┐
                    ├──→ users (Many)
                    │
                    └──→ bins (Many)
                            │
                            ├──→ notifications (Many)
                            ├──→ collection_records (Many)
                            └──→ bin_history (Many)

activity_logs ──→ users (Many-to-One)
collection_records ──→ users (Many-to-One, collected_by)
```

---

## Table Details

### 1. hospitals
Stores healthcare facility information.

```sql
CREATE TABLE hospitals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  contact_person VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Example Data:**
```json
{
  "id": 1,
  "name": "City Central Hospital",
  "location": "123 Main St",
  "contact_person": "John Smith",
  "email": "contact@cityhospital.com",
  "phone": "+1-555-0001"
}
```

---

### 2. users
System users with role-based access control.

```sql
CREATE TABLE users (
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
```

**Roles:**
- `admin`: Full system access
- `waste_manager`: Bin monitoring, notifications
- `hospital_admin`: Hospital-level management
- `collection_personnel`: Collection operations

**Example Data:**
```json
{
  "id": 1,
  "fullname": "Admin User",
  "email": "admin@wasteflow.com",
  "password": "$2a$10$...(hashed)",
  "role": "admin",
  "hospital_id": null,
  "status": "active"
}
```

---

### 3. bins
Waste bin inventory with location and status tracking.

```sql
CREATE TABLE bins (
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
```

**Status Rules:**
- `available`: 0-69% fill level (Green LED on Arduino)
- `nearly_full`: 70-89% fill level (Orange indicator)
- `full`: 90-100% fill level (Red LED + Buzzer on Arduino)

**Example Data:**
```json
{
  "id": 1,
  "bin_code": "BIN001",
  "location": "Emergency Department",
  "hospital_id": 1,
  "capacity_percentage": 45,
  "status": "available",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "last_update": "2024-01-15T10:30:00Z"
}
```

---

### 4. notifications
System notifications for bins and users.

```sql
CREATE TABLE notifications (
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
```

**Notification Types:**
- `nearly_full`: Bin reached 70% capacity
- `full`: Bin reached 90%+ capacity
- `not_emptied`: Bin hasn't been collected for 24+ hours

**Example Data:**
```json
{
  "id": 1,
  "user_id": 2,
  "bin_id": 3,
  "title": "Bin Full - Urgent",
  "message": "Bin BIN003 at Radiology Department is full and needs immediate collection",
  "notification_type": "full",
  "read_status": false,
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### 5. collection_records
Records of bin collection and emptying.

```sql
CREATE TABLE collection_records (
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
```

**Example Data:**
```json
{
  "id": 1,
  "bin_id": 1,
  "collected_by": 4,
  "collection_date": "2024-01-14T14:00:00Z",
  "remarks": "Emptied and cleaned"
}
```

---

### 6. activity_logs
Audit trail for user actions and system events.

```sql
CREATE TABLE activity_logs (
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
```

**Common Actions:**
- `USER_LOGIN`: User logged in
- `USER_LOGOUT`: User logged out
- `BIN_CREATED`: New bin created
- `BIN_UPDATED`: Bin details updated
- `NOTIFICATION_READ`: Notification marked as read
- `COLLECTION_COMPLETED`: Collection recorded

**Example Data:**
```json
{
  "id": 1,
  "user_id": 2,
  "action": "USER_LOGIN",
  "description": "User logged in",
  "timestamp": "2024-01-15T09:00:00Z"
}
```

---

### 7. bin_history
Historical data for analytics and trend analysis.

```sql
CREATE TABLE bin_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  bin_id INT NOT NULL,
  capacity_percentage INT CHECK (capacity_percentage >= 0 AND capacity_percentage <= 100),
  status VARCHAR(50),
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bin_id) REFERENCES bins(id) ON DELETE CASCADE,
  INDEX idx_bin_id (bin_id),
  INDEX idx_recorded_at (recorded_at)
);
```

**Purpose:** Track bin capacity changes over time for analytics and reporting.

**Example Data:**
```json
{
  "id": 1,
  "bin_id": 1,
  "capacity_percentage": 10,
  "status": "available",
  "recorded_at": "2024-01-08T00:00:00Z"
}
```

---

### 8. dashboard_stats (VIEW)
Pre-calculated statistics for dashboard performance.

```sql
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
```

---

## Indexes for Performance

| Table | Column | Type | Purpose |
|-------|--------|------|---------|
| users | email | Index | Fast user lookup |
| users | role | Index | Filter by role |
| bins | bin_code | Index | Unique bin identification |
| bins | status | Index | Filter by status |
| notifications | user_id | Index | Get user notifications |
| notifications | read_status | Index | Filter unread |
| bin_history | bin_id | Index | Get history for bin |
| bin_history | recorded_at | Index | Time-range queries |

---

## Data Relationships

### 1-to-Many: Hospital → Users
One hospital can have many users (waste managers, admin staff)

### 1-to-Many: Hospital → Bins
One hospital can have multiple waste bins in different locations

### 1-to-Many: Bin → Notifications
One bin can trigger multiple notifications as fill level changes

### 1-to-Many: Bin → Collection Records
One bin has many collection records over time

### 1-to-Many: Bin → History
One bin has historical capacity records for analytics

### 1-to-Many: User → Activity Logs
One user can have many logged actions

---

## Query Examples

### Get all bins for a hospital with fill status
```sql
SELECT bin_code, location, capacity_percentage, status
FROM bins
WHERE hospital_id = 1
ORDER BY capacity_percentage DESC;
```

### Get unread notifications for a user
```sql
SELECT n.id, n.title, n.message, b.bin_code, n.created_at
FROM notifications n
JOIN bins b ON n.bin_id = b.id
WHERE n.user_id = 2 AND n.read_status = FALSE
ORDER BY n.created_at DESC;
```

### Get bins filled in last 7 days
```sql
SELECT b.bin_code, b.location, COUNT(*) as fill_count
FROM bin_history bh
JOIN bins b ON bh.bin_id = b.id
WHERE bh.recorded_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
GROUP BY b.id
ORDER BY fill_count DESC;
```

### Get collection efficiency
```sql
SELECT 
  b.bin_code,
  COUNT(cr.id) as times_collected,
  AVG(TIMESTAMPDIFF(DAY, cr.collection_date, NOW())) as days_since_last
FROM bins b
LEFT JOIN collection_records cr ON b.id = cr.bin_id
GROUP BY b.id;
```
