# WasteFlow - Getting Started Guide

## Quick Overview

WasteFlow is a complete full-stack healthcare waste management system with:
- ✅ Real-time bin monitoring with ultrasonic sensors
- ✅ Professional healthcare SaaS dashboard
- ✅ Role-based access control
- ✅ Automated notifications
- ✅ Analytics and reporting
- ✅ Arduino/ESP8266 integration

## Project Structure

```
GROUP 30 PROJECT/
├── backend/                    # Express.js + TypeScript API
│   ├── src/                   # Source code
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example           # Environment template
│   └── Dockerfile
├── frontend/                   # React + Vite SPA
│   ├── src/                   # Source code
│   ├── package.json
│   ├── vite.config.ts
│   └── Dockerfile
├── database/
│   ├── schema.sql             # Database schema
│   └── seed.sql               # Sample data
├── docs/                       # Documentation
│   ├── ARCHITECTURE.md        # System architecture
│   ├── API_ENDPOINTS.md       # API documentation
│   └── DATABASE_SCHEMA.md     # Database schema docs
├── docker-compose.yml         # Docker orchestration
└── README.md                  # Main documentation
```

## Installation Steps

### 1. Clone/Extract Project
```bash
cd "GROUP 30 PROJECT"
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your database credentials
# Example:
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=yourpassword
# DB_NAME=wasteflow_db
```

### 3. Database Setup

```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE wasteflow_db;
EXIT;

# Run schema
mysql -u root -p wasteflow_db < ../database/schema.sql

# Seed sample data (optional)
mysql -u root -p wasteflow_db < ../database/seed.sql
```

### 4. Start Backend

```bash
# From backend directory
npm run dev

# Server will start on http://localhost:5000
# Check health: curl http://localhost:5000/health
```

### 5. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
```

### 6. Start Frontend

```bash
# From frontend directory
npm run dev

# App will start on http://localhost:5173
```

### 7. Development User Accounts

The system automatically creates these development/testing accounts on first startup:

**Admin Accounts (Full System Access):**
- Email: `komakech@gmail.com` / Password: `job256`
- Email: `emmanuel@gmail.com` / Password: `job256`

**User Accounts (Waste Manager):**
- Email: `lisa@gmail.com` / Password: `job256`
- Email: `mercy@gmail.com` / Password: `job256`
- Email: `gerald@gmail.com` / Password: `job256`

### 8. Login

Open `http://localhost:5173` and login with any of the development accounts above:

**Quick Start (Admin Account):**
- Email: `komakech@gmail.com`
- Password: `job256`

## Using Docker (Alternative)

Instead of manual setup, use Docker:

```bash
# From project root
docker-compose up --build

# Services will start:
# - MySQL: localhost:3306
# - Backend: http://localhost:5000
# - Frontend: http://localhost:5173
```

## Automatic User Seeding

When the backend server starts, it automatically creates the default development users if they don't already exist. You'll see logs like:

```
🌱 Starting default user seeding...
✅ Created user: komakech@gmail.com (Role: admin, ID: 1)
✅ Created user: emmanuel@gmail.com (Role: admin, ID: 2)
✅ Created user: lisa@gmail.com (Role: waste_manager, ID: 3)
✅ Created user: mercy@gmail.com (Role: waste_manager, ID: 4)
✅ Created user: gerald@gmail.com (Role: waste_manager, ID: 5)
🎉 User seeding completed! Created: 5, Skipped: 0

📝 Default Test Accounts:
   Admin Accounts:
   • komakech@gmail.com / job256
   • emmanuel@gmail.com / job256
   User Accounts:
   • lisa@gmail.com / job256
   • mercy@gmail.com / job256
   • gerald@gmail.com / job256
```

### Manual User Seeding

To manually seed users at any time, run:

```bash
cd backend
npm run seed
```

This will:
1. Check if users already exist (prevents duplicates)
2. Create missing users with bcrypt-hashed passwords
3. Display a log of created/skipped accounts
4. Show all seeded users in the database

## Key Features Walkthrough

### Dashboard
- **View Statistics**: Total bins, available, nearly full, full bins
- **Monitor Trends**: 7-day capacity trend chart
- **Daily Reports**: Bar chart of bin status distribution
- **Map View**: Locations of all bins (placeholder)

### Bins Monitoring
- **Real-time Status**: Current fill level with color indicators
- **Filtering**: Search by bin code, location, or status
- **Details**: Last updated timestamp and exact percentage

### Notifications
- **Smart Alerts**: Automatic when bins reach thresholds
  - 70% = Nearly Full (Orange)
  - 90%+ = Full (Red, High Priority)
- **Mark Read**: Track notification status
- **Delete**: Remove old notifications

### Reports
- **Daily/Weekly/Monthly**: Collection history
- **Export CSV**: Download reports
- **Collection Records**: View waste collection logs

### Settings
- **Account**: Manage profile and email
- **Notifications**: Preferences for alerts
- **Security**: Change password option

## API Integration with Arduino

To send bin data from Arduino/ESP8266:

```cpp
#include <HTTPClient.h>

void updateBinStatus() {
  HTTPClient http;
  String serverName = "http://192.168.1.100:5000/api/bins/update";
  
  // Create JSON payload
  String payload = "{\"bin_code\":\"BIN001\",\"capacity_percentage\":75,\"status\":\"nearly_full\"}";
  
  http.begin(serverName);
  http.addHeader("Content-Type", "application/json");
  
  int httpCode = http.POST(payload);
  
  if (httpCode == 200) {
    Serial.println("Bin updated successfully");
  }
  
  http.end();
}
```

## User Roles & Permissions

### System Administrator
- Full system access
- User management
- Create/edit/delete bins
- View all reports
- System settings

### Waste Manager
- Monitor all bins
- Manage notifications
- Assign collections
- View reports
- Cannot delete users

### Hospital Administrator
- Hospital-level access
- Manage hospital users
- View hospital bins
- View hospital reports
- Cannot access other hospitals

### Collection Personnel
- View assigned bins
- Mark collection as complete
- View personal notifications
- Cannot edit or delete

## Authentication

- **JWT Tokens**: 15-minute access tokens + 7-day refresh tokens
- **Password Hashing**: Bcrypt with salt
- **Session Management**: Token stored in localStorage
- **Auto Refresh**: Automatic token refresh on expiry

## Database Tables

| Table | Purpose |
|-------|---------|
| hospitals | Healthcare facilities |
| users | System users with roles |
| bins | Waste bin inventory |
| notifications | System/bin alerts |
| collection_records | Waste collection history |
| activity_logs | User action audit trail |
| bin_history | Historical fill data for analytics |

## Common Tasks

### Add New User
1. Go to Settings → Users (admin only)
2. Click "Add User"
3. Fill in details and select role
4. Save

### Create New Bin
1. Admin panel
2. Click "Add Bin"
3. Enter bin code, location, hospital
4. Set GPS coordinates (optional)
5. Save

### Export Report
1. Go to Reports
2. Select report type
3. Choose date range (if applicable)
4. Click "Export Report (CSV)"

### View Collection History
1. Go to Bins
2. Click on a bin card
3. View collection history
4. See last collected date and remarks

## Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify database credentials in .env
- Check if MySQL is running
- Review logs in `combined.log`

### Frontend won't load
- Check if backend is running
- Verify API URL (should be localhost:5000)
- Clear browser cache
- Check browser console for errors

### Database connection fails
- Verify MySQL is running
- Check credentials in .env
- Ensure database exists: `CREATE DATABASE wasteflow_db;`
- Run schema: `mysql -u root -p wasteflow_db < database/schema.sql`

### Login fails
- Verify using correct email/password
- Check if user exists in database
- Ensure user status is "active"
- Try with demo credentials first

## Development Tips

### Adding New API Endpoint
1. Create controller method in `backend/src/controllers/`
2. Add route in `backend/src/routes/`
3. Add TypeScript types
4. Test with curl or Postman
5. Add frontend service call

### Adding New React Component
1. Create `.tsx` file in appropriate folder
2. Define TypeScript interfaces
3. Import and use Tailwind classes
4. Test responsive behavior

### Database Queries
- Use parameterized queries for safety
- Add indexes for frequently queried columns
- Archive old bin_history periodically
- Monitor query performance

## Security Considerations

- ✅ JWT authentication with refresh tokens
- ✅ Password hashing with bcrypt
- ✅ SQL injection prevention
- ✅ XSS protection via React
- ✅ CORS configured
- ✅ Rate limiting on auth endpoints
- ✅ Role-based access control
- ✅ Activity logging for audit trail

## Performance Optimization

- Database indexes on key fields
- Pagination for large result sets
- Response compression with gzip
- Frontend code splitting with Vite
- Chart data caching
- Efficient React re-rendering

## Deployment Checklist

- [ ] Set strong JWT_SECRET in production
- [ ] Use HTTPS for all connections
- [ ] Configure CORS for production domain
- [ ] Set NODE_ENV=production
- [ ] Enable database backups
- [ ] Set up monitoring/logging
- [ ] Configure rate limiting properly
- [ ] Test with production data
- [ ] Set up CI/CD pipeline
- [ ] Document environment variables

## Next Steps

1. **Explore Codebase**: Review structure and understand flow
2. **Run Locally**: Get system running on your machine
3. **Create Test Data**: Use seed.sql or add manually
4. **Make Modifications**: Add custom features
5. **Deploy**: Use Docker or your preferred host

## Support Files

- `README.md` - Main project documentation
- `backend/README.md` - Backend-specific setup
- `frontend/README.md` - Frontend-specific setup
- `docs/ARCHITECTURE.md` - System architecture diagram
- `docs/API_ENDPOINTS.md` - Complete API reference
- `docs/DATABASE_SCHEMA.md` - Database documentation

## Contact & Support

For questions or issues with Group 30 WasteFlow project, refer to documentation files or review code comments for implementation details.

---

**Version**: 1.0.0  
**Last Updated**: January 2024  
**Group**: 30
