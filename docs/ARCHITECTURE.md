# WasteFlow Architecture Documentation

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │    React Frontend (Vite + TypeScript + Tailwind)       │ │
│  │    • Dashboard | Bins | Notifications | Reports       │ │
│  │    • Real-time UI Updates                              │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API (HTTP/HTTPS)
                           │
┌──────────────────────────┴──────────────────────────────────┐
│                 APPLICATION LAYER                          │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Express.js Backend (Node.js + TypeScript)              │ │
│  │                                                         │ │
│  │ Routes Layer:                                          │ │
│  │  • /api/auth - Authentication                         │ │
│  │  • /api/bins - Bin management                         │ │
│  │  • /api/notifications - Notifications                │ │
│  │  • /api/dashboard - Analytics                        │ │
│  │  • /api/reports - Reporting                          │ │
│  │                                                        │ │
│  │ Middleware:                                           │ │
│  │  • JWT Authentication                                 │ │
│  │  • Error Handling                                     │ │
│  │  • CORS, Rate Limiting                               │ │
│  │                                                        │ │
│  │ Controllers:                                          │ │
│  │  • AuthController - User management                   │ │
│  │  • BinController - Bin operations                    │ │
│  │  • NotificationController - Notifications            │ │
│  │  • DashboardController - Analytics                   │ │
│  │  • ReportController - Report generation              │ │
│  │                                                        │ │
│  │ Services:                                             │ │
│  │  • Notification Service                              │ │
│  │  • Analytics Service                                 │ │
│  │  • Report Generation Service                         │ │
│  └────────────────────────────────────────────────────────┘ │
└────────────────────────┬─────────────────────────────────────┘
                         │ SQL Queries
                         │
┌────────────────────────┴─────────────────────────────────────┐
│                    DATA LAYER                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │           MySQL Database (InnoDB)                      │ │
│  │                                                         │ │
│  │  Core Tables:                                         │ │
│  │  • hospitals - Healthcare facilities                 │ │
│  │  • users - System users                              │ │
│  │  • bins - Waste bins                                 │ │
│  │  • notifications - System notifications             │ │
│  │  • collection_records - Collection history          │ │
│  │  • activity_logs - Audit trail                      │ │
│  │  • bin_history - Historical data                    │ │
│  │                                                        │ │
│  │  Views:                                              │ │
│  │  • dashboard_stats - Real-time statistics           │ │
│  │                                                        │ │
│  │  Indexes:                                            │ │
│  │  • Performance optimization                         │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
        ▲                                    ▲
        │                                    │
   Arduino/ESP8266                    Email/SMS Gateway
   (IoT Devices)                      (Notification Channel)
```

---

## Authentication Flow

```
User Input (email, password)
         ↓
    Login Form
         ↓
POST /api/auth/login
         ↓
Validate Credentials (bcrypt compare)
         ↓
Generate JWT Tokens (access + refresh)
         ↓
Store in localStorage
         ↓
Redirect to Dashboard
         ↓
Authenticated Request Header:
Authorization: Bearer <access_token>
         ↓
JWT Middleware Validation
         ↓
Grant/Deny Access
```

---

## Bin Monitoring Flow

```
Arduino/ESP8266 Device
(Ultrasonic Sensor)
         ↓
Measure Distance
         ↓
Calculate Fill %
         ↓
POST /api/bins/update
{
  "bin_code": "BIN001",
  "capacity_percentage": 92,
  "status": "FULL"
}
         ↓
Backend Processing:
1. Find Bin by Code
2. Update bin record
3. Record in bin_history
4. Check Status Change
         ↓
If Status Changed:
- Create Notification
- Alert Waste Managers
- Log Activity
         ↓
Update Dashboard
Real-time UI Refresh
```

---

## Notification Generation Logic

```
Bin Status Update
         ↓
Check Previous Status vs New Status
         ↓
Status Change Detected?
         │
         ├─ No → End
         │
         └─ Yes
            ↓
         Status = "nearly_full" (70-89%)?
            ↓
         Create Notification:
         • Type: "nearly_full"
         • Send to Waste Managers
         • Send to Hospital Admin
            ↓
         Status = "full" (90-100%)?
            ↓
         Create Notification:
         • Type: "full"
         • Priority: HIGH
         • Sound Alert: YES
         • Send to All Waste Managers
```

---

## Request/Response Cycle

### Example: Get Dashboard Stats

```
Frontend Request:
GET /api/dashboard/stats?hospital_id=1
Authorization: Bearer eyJhbGc...

↓

Backend Processing:
1. Extract token from header
2. Verify JWT signature
3. Get user from token
4. Check permissions
5. Query bins by hospital
6. Calculate statistics
7. Return JSON response

↓

Frontend Response:
{
  "totalBins": 8,
  "availableBins": 3,
  "nearlyFullBins": 2,
  "fullBins": 1
}

↓

Frontend:
1. Parse response
2. Update React state
3. Re-render components
4. Display updated UI
```

---

## Data Flow: Bin to Dashboard

```
Arduino Device Updates Bin
         ↓
POST /api/bins/update
         ↓
Backend:
- Updates bins table
- Inserts bin_history record
- Creates notification if needed
- Returns response
         ↓
Frontend Poll/Request:
GET /api/dashboard/stats
         ↓
Backend:
- Queries dashboard_stats view
- Returns aggregated data
         ↓
Frontend:
- Updates DashboardCards component
- Updates Charts component
- Re-renders UI with new data
         ↓
User sees real-time bin status
```

---

## Role-Based Access Control (RBAC)

```
Login
  ↓
Get User Role from JWT
  ↓
Route Protection:
  ├─ Admin Role
  │  ├─ Full dashboard access
  │  ├─ User management
  │  ├─ Bin creation/deletion
  │  └─ All reports
  │
  ├─ Waste Manager Role
  │  ├─ Bin monitoring
  │  ├─ Notifications
  │  ├─ Collection management
  │  └─ View reports
  │
  ├─ Hospital Admin Role
  │  ├─ Hospital-level dashboard
  │  ├─ User management (hospital)
  │  ├─ View bins
  │  └─ View reports
  │
  └─ Collection Personnel Role
     ├─ View assigned bins
     ├─ Mark collection
     └─ View notifications
```

---

## Error Handling Architecture

```
Request Processing Error
         ↓
Try-Catch Block
         ↓
Error Type Check
         ↓
├─ Validation Error (400)
│  └─ Return validation details
│
├─ Authentication Error (401)
│  └─ Return "Unauthorized"
│
├─ Permission Error (403)
│  └─ Return "Forbidden"
│
├─ Not Found Error (404)
│  └─ Return "Resource not found"
│
└─ Server Error (500)
   └─ Log error
   └─ Return generic message
         ↓
Error Response:
{
  "error": "Error message",
  "details": {...},
  "timestamp": "ISO timestamp"
}
         ↓
Frontend:
Display error to user
Log to console
Retry or redirect
```

---

## Real-Time Updates Strategy

```
Frontend Strategy (Current):
┌─ Periodic Polling
│  └─ setInterval(() => fetchNotifications(), 30s)
│
└─ On-Demand Fetching
   └─ Fetch when user navigates

Future Enhancement:
┌─ WebSocket Connection
│  └─ Real-time push notifications
│
└─ Server-Sent Events (SSE)
   └─ Efficient one-way communication
```

---

## Scalability Considerations

### Database
- Partition bin_history by time (yearly)
- Archive old activity logs
- Add read replicas for analytics queries

### Backend
- Horizontal scaling with load balancer
- Redis caching for frequent queries
- Message queue for notifications (RabbitMQ)
- Async job processing for reports

### Frontend
- Code splitting and lazy loading
- Service Worker for offline support
- CDN for static assets
- Image optimization

---

## Security Architecture

```
Layers of Security:

1. Transport Layer (HTTPS)
   └─ TLS/SSL encryption

2. Application Layer
   ├─ CORS configuration
   ├─ Rate limiting
   ├─ Input validation
   └─ SQL injection prevention

3. Authentication Layer
   ├─ JWT tokens
   ├─ Refresh token rotation
   └─ Secure password hashing

4. Authorization Layer
   ├─ Role-based access control
   ├─ Permission checks
   └─ Resource ownership validation

5. Data Layer
   ├─ Parameterized queries
   ├─ Database access control
   └─ Encryption at rest (optional)

6. Audit Layer
   ├─ Activity logging
   ├─ Error logging
   └─ Security event tracking
```

---

## Deployment Architecture

```
Development
└─ Local Machine
   ├─ Node.js Backend (port 5000)
   ├─ React Frontend (port 5173)
   └─ MySQL Database (local)

Staging
└─ Docker Containers
   ├─ Backend Container
   ├─ Frontend Container
   └─ MySQL Container

Production
└─ Cloud Deployment
   ├─ Backend (AWS EC2/Google Cloud Run)
   ├─ Frontend (AWS S3 + CloudFront)
   ├─ Database (AWS RDS MySQL)
   ├─ Load Balancer
   └─ Monitoring (CloudWatch/Stackdriver)
```

---

## Performance Optimization

### Frontend
- React.memo for component memoization
- Code splitting with React.lazy
- Image optimization with lazy loading
- Tailwind CSS production build
- Minification and compression

### Backend
- Database query optimization with indexes
- Caching with Redis
- Connection pooling
- Async operations
- Load balancing

### Database
- Proper indexing strategy
- Query optimization
- Partitioning large tables
- Regular maintenance and cleanup

---

## Integration Points

1. **Arduino/ESP8266**
   - HTTP POST to `/api/bins/update`
   - Sends bin fill data
   - Receives acknowledgment

2. **Email Service** (Future)
   - Nodemailer or SendGrid
   - Send notification emails
   - Password reset emails

3. **SMS Service** (Future)
   - Twilio or AWS SNS
   - Send urgent alerts
   - Two-factor authentication

4. **Map Service** (Future)
   - Google Maps API
   - Display bin locations
   - Route optimization

5. **Analytics** (Future)
   - Google Analytics
   - User behavior tracking
   - Performance monitoring
