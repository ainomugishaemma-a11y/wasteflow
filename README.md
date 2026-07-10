# WasteFlow Smart Bin Monitoring System

## Project Overview

WasteFlow is a comprehensive healthcare waste management platform that monitors the fill level of healthcare waste bins using ultrasonic sensors. The system provides real-time monitoring, notifications, analytics, and reporting capabilities.

## Quick Start

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your database credentials
npm run dev
```

Server will run on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

### Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE wasteflow_db;
```

2. Run schema:
```bash
mysql -u root -p wasteflow_db < database/schema.sql
```

3. Seed sample data (optional):
```bash
mysql -u root -p wasteflow_db < database/seed.sql
```

## Project Structure

### Backend (`/backend`)
- **src/config**: Database and environment configuration
- **src/controllers**: Request handlers for routes
- **src/models**: Database models and queries
- **src/routes**: API endpoint definitions
- **src/middleware**: Authentication, error handling
- **src/utils**: JWT, validation, logging
- **src/index.ts**: Express server entry point

### Frontend (`/frontend`)
- **src/pages**: Full page components
- **src/components**: Reusable UI components
- **src/context**: React context for state management
- **src/services**: API service clients
- **src/types**: TypeScript type definitions
- **src/styles**: Global CSS with Tailwind

### Database (`/database`)
- **schema.sql**: Complete database schema
- **seed.sql**: Sample data for testing

## Key Features

### 1. Real-time Bin Monitoring
- Monitor bin fill levels (0-100%)
- Status indicators: Available, Nearly Full, Full
- Last updated timestamp
- Location tracking with GPS coordinates

### 2. Notifications System
- Automatic alerts when bins reach 70% capacity (Nearly Full)
- Urgent alerts at 90%+ (Full)
- Notifications for bins not emptied for 24+ hours
- In-app notification center with read/unread status
- Email integration ready

### 3. Dashboard Analytics
- Total bins count
- Available/Nearly Full/Full bins breakdown
- Bin capacity trends (7/30 days)
- Daily fill level reports
- Weekly collection reports
- Interactive charts and statistics

### 4. Role-Based Access Control
- **System Administrator**: Full system access
- **Waste Manager**: Bin monitoring, notifications, collection
- **Hospital Administrator**: Hospital-level overview, user management
- **Collection Personnel**: View assigned bins, mark collected

### 5. Reports & History
- Daily waste reports
- Weekly collection reports
- Monthly reports
- Collection history per bin
- Export to CSV functionality
- Historical data for analytics

### 6. User Management
- User registration and authentication
- JWT-based secure authentication
- Password hashing with bcrypt
- Role assignment and permissions
- User status management (active/inactive)

### 7. Activity Logging
- Log all user actions
- Track system events
- Audit trail for compliance

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/forgot-password` - Password reset request

### Bins
- `GET /api/bins` - Get all bins (paginated)
- `GET /api/bins/:id` - Get bin details
- `POST /api/bins` - Create new bin (admin only)
- `PUT /api/bins/:id` - Update bin
- `DELETE /api/bins/:id` - Delete bin (admin only)
- `POST /api/bins/update` - Arduino/ESP8266 updates bin data
- `GET /api/bins/:id/history` - Get bin fill history

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/:id` - Delete notification

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/analytics/capacity-trend` - Capacity trend data
- `GET /api/dashboard/analytics/daily-report` - Daily report
- `GET /api/dashboard/analytics/collection-report` - Collection report

### Reports
- `GET /api/reports/daily` - Daily report
- `GET /api/reports/weekly` - Weekly report
- `GET /api/reports/monthly` - Monthly report
- `GET /api/reports/collection-history` - Collection history

## Arduino Integration

The system is designed to work with Arduino/ESP8266 devices. To send bin data:

```bash
POST /api/bins/update
Content-Type: application/json

{
  "bin_code": "BIN001",
  "capacity_percentage": 92,
  "status": "FULL"
}
```

The backend will:
1. Update bin status in database
2. Record history for analytics
3. Create notifications if status changed
4. Alert waste managers if bin is full

## Database Schema

### Tables
- **users**: User accounts with roles and permissions
- **hospitals**: Healthcare facility information
- **bins**: Waste bin inventory with locations
- **notifications**: System notifications
- **collection_records**: Waste collection history
- **activity_logs**: User action audit trail
- **bin_history**: Historical capacity data for analytics

## Technology Stack

**Backend:**
- Express.js
- TypeScript
- MySQL 8.0
- JWT Authentication
- Bcrypt for password hashing
- Winston for logging

**Frontend:**
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Recharts for analytics
- Lucide React for icons

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=wasteflow_db
JWT_SECRET=your_secret_key
JWT_EXPIRE=15m
REFRESH_TOKEN_SECRET=refresh_secret
REFRESH_TOKEN_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## Security Features

- ✅ JWT token-based authentication
- ✅ Password hashing with bcrypt
- ✅ CORS configuration
- ✅ Rate limiting on auth endpoints
- ✅ SQL injection prevention
- ✅ XSS protection via React
- ✅ Role-based access control
- ✅ HTTPS ready (with environment config)

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow camelCase for variables/functions
- Use PascalCase for components/classes
- Add meaningful comments for complex logic
- Keep components small and focused

### Commit Messages
- Use conventional commits: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`
- Example: `feat: add bin status notification system`

### Testing
- Write tests for critical paths
- Mock API responses in frontend tests
- Test database queries in backend tests

## Deployment

### Backend Deployment
```bash
npm run build
npm start
```

### Frontend Deployment
```bash
npm run build
# Deploy dist/ folder to your hosting
```

## Support & Contact

For issues or questions, contact Group 30 project team.

## License

MIT License - Group 30 Project 2024
