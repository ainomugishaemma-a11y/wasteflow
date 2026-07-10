# WasteFlow API Endpoints Documentation

## Base URL
`http://localhost:5000/api`

## Authentication
All endpoints (except login/register) require JWT token in header:
```
Authorization: Bearer <access_token>
```

---

## Authentication Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "securepass123",
  "role": "collection_personnel",
  "hospital_id": 1
}

Response: 201 Created
{
  "message": "User registered successfully",
  "userId": 1
}
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepass123"
}

Response: 200 OK
{
  "message": "Login successful",
  "accessToken": "jwt_token_here",
  "refreshToken": "refresh_token_here",
  "user": {
    "id": 1,
    "fullname": "John Doe",
    "email": "john@example.com",
    "role": "collection_personnel",
    "hospital_id": 1
  }
}
```

### Refresh Token
```
POST /auth/refresh-token
Content-Type: application/json

{
  "refreshToken": "refresh_token_here"
}

Response: 200 OK
{
  "accessToken": "new_jwt_token"
}
```

### Logout
```
POST /auth/logout
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Logout successful"
}
```

---

## Bin Endpoints

### Get All Bins
```
GET /bins?hospital_id=1&status=available&limit=10&offset=0
Authorization: Bearer <token>

Response: 200 OK
{
  "total": 8,
  "bins": [
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
  ]
}
```

### Get Bin by ID
```
GET /bins/1
Authorization: Bearer <token>

Response: 200 OK
{
  "id": 1,
  "bin_code": "BIN001",
  "location": "Emergency Department",
  "capacity_percentage": 45,
  "status": "available",
  "last_update": "2024-01-15T10:30:00Z"
}
```

### Create Bin (Admin only)
```
POST /bins
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "bin_code": "BIN009",
  "location": "New Department",
  "hospital_id": 1,
  "latitude": 40.7150,
  "longitude": -74.0080
}

Response: 201 Created
{
  "message": "Bin created successfully",
  "binId": 9
}
```

### Update Bin from Arduino/ESP8266
```
POST /bins/update
Content-Type: application/json

{
  "bin_code": "BIN001",
  "capacity_percentage": 78,
  "status": "nearly_full"
}

Response: 200 OK
{
  "message": "Bin data updated successfully",
  "bin_id": 1
}
```

### Get Bin History
```
GET /bins/1/history?days=7
Authorization: Bearer <token>

Response: 200 OK
{
  "bin_id": 1,
  "bin_code": "BIN001",
  "days": 7,
  "history": [
    {
      "capacity_percentage": 10,
      "status": "available",
      "recorded_at": "2024-01-08T00:00:00Z"
    },
    {
      "capacity_percentage": 45,
      "status": "available",
      "recorded_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

---

## Notification Endpoints

### Get Notifications
```
GET /notifications?limit=10&offset=0
Authorization: Bearer <token>

Response: 200 OK
{
  "total": 3,
  "unreadCount": 2,
  "notifications": [
    {
      "id": 1,
      "user_id": 2,
      "bin_id": 3,
      "title": "Bin Full - Urgent",
      "message": "Bin BIN003 is full and needs immediate collection",
      "notification_type": "full",
      "read_status": false,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Mark Notification as Read
```
PUT /notifications/1/read
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Notification marked as read"
}
```

### Get Unread Count
```
GET /notifications/unread-count
Authorization: Bearer <token>

Response: 200 OK
{
  "unreadCount": 2
}
```

---

## Dashboard Endpoints

### Get Dashboard Statistics
```
GET /dashboard/stats?hospital_id=1
Authorization: Bearer <token>

Response: 200 OK
{
  "totalBins": 8,
  "availableBins": 3,
  "nearlyFullBins": 2,
  "fullBins": 1
}
```

### Get Capacity Trend
```
GET /dashboard/analytics/capacity-trend?bin_id=1&days=7
Authorization: Bearer <token>

Response: 200 OK
{
  "bin_id": 1,
  "days": 7,
  "trend": [
    {
      "date": "01/08/2024",
      "capacity": 10,
      "status": "available"
    },
    {
      "date": "01/15/2024",
      "capacity": 45,
      "status": "available"
    }
  ]
}
```

### Get Daily Report
```
GET /dashboard/analytics/daily-report?hospital_id=1
Authorization: Bearer <token>

Response: 200 OK
{
  "date": "01/15/2024",
  "totalBins": 8,
  "byCategoryCount": {
    "available": 3,
    "nearlyFull": 2,
    "full": 1
  },
  "byCapacity": {
    "low": 3,
    "medium": 3,
    "high": 2
  }
}
```

---

## Report Endpoints

### Get Daily Report
```
GET /reports/daily?date=2024-01-15&hospital_id=1
Authorization: Bearer <token>

Response: 200 OK
{
  "reportType": "daily",
  "date": "01/15/2024",
  "totalCollections": 3,
  "records": [...]
}
```

### Get Weekly Report
```
GET /reports/weekly?hospital_id=1
Authorization: Bearer <token>

Response: 200 OK
{
  "reportType": "weekly",
  "startDate": "01/08/2024",
  "endDate": "01/15/2024",
  "totalCollections": 10,
  "records": [...]
}
```

### Get Collection History
```
GET /reports/collection-history?bin_id=1&limit=50
Authorization: Bearer <token>

Response: 200 OK
{
  "bin_id": 1,
  "total": 5,
  "records": [
    {
      "id": 1,
      "bin_id": 1,
      "collected_by": 4,
      "collection_date": "2024-01-14T14:00:00Z",
      "remarks": "Emptied and cleaned"
    }
  ]
}
```

---

## Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **409**: Conflict
- **500**: Server Error

## Error Response Format

```json
{
  "error": "Error message",
  "details": null,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```
