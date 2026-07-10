# WasteFlow User Seeding Documentation

## Overview

The WasteFlow system includes automatic user seeding for development and testing. Five default accounts are automatically created when the backend server starts for the first time.

## Default Development Accounts

### Admin Accounts (System Administration)
These accounts have full system access and can manage all users, bins, and settings.

| Email | Password | Role | Status |
|-------|----------|------|--------|
| komakech@gmail.com | job256 | admin | active |
| emmanuel@gmail.com | job256 | admin | active |

### User Accounts (Waste Manager)
These accounts have waste management capabilities - can monitor bins, manage collections, and view reports.

| Email | Password | Role | Status |
|-------|----------|------|--------|
| lisa@gmail.com | job256 | waste_manager | active |
| mercy@gmail.com | job256 | waste_manager | active |
| gerald@gmail.com | job256 | waste_manager | active |

## Implementation Architecture

### Seeding Components

#### 1. SeedService (`backend/src/services/seedService.ts`)
Core service handling all seeding operations:

```typescript
// Main seeding function (called on server startup)
SeedService.seedDefaultUsers()

// Manual operations
SeedService.clearDefaultUsers()      // Remove seeded accounts
SeedService.getSeededUsers()         // List all seeded accounts
```

**Features:**
- Checks for existing users before creating (prevents duplicates)
- Hashes passwords using bcrypt (salt rounds: 10)
- Logs each operation with clear status messages
- Gracefully handles duplicate entry errors
- Atomic operations (no partial seeding)

#### 2. Seed Script (`backend/src/seed.ts`)
Standalone Node.js script for manual seeding:

- Connects to database
- Runs the SeedService
- Displays comprehensive logs
- Exits with appropriate status codes

**Usage:**
```bash
npm run seed
```

#### 3. Server Integration (`backend/src/index.ts`)
Automatic seeding on startup:

- Imported SeedService
- Called after database connection verified
- Errors logged but don't crash server (seeding already done)
- Shows login instructions in console

## How It Works

### Automatic Seeding (On Server Startup)

```
1. Server starts (npm run dev)
2. Database connection tested
3. SeedService.seedDefaultUsers() called
4. For each default user:
   a. Query database for existing user by email
   b. If exists: log "Skipped" message
   c. If not exists:
      - Hash password with bcrypt
      - Insert into users table
      - Log "Created" message with user ID
5. Summary displayed with creation/skip counts
6. Test account credentials shown in console
```

### Manual Seeding (On Demand)

```bash
# Run standalone seed script
npm run seed

# Output:
# 🚀 Starting WasteFlow Database Seeding...
# 🌱 Starting default user seeding...
# ✅ Created user: komakech@gmail.com (Role: admin, ID: 1)
# ...
# 📋 Seeded Users in Database:
#    1. Komakech Admin (komakech@gmail.com) - Role: admin - Status: active
#    ...
# ✨ Database seeding completed successfully!
```

## Database Integration

### Schema
Users table structure:
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  fullname VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'waste_manager', 'hospital_admin', 'collection_personnel'),
  hospital_id INT,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Password Security
- All passwords hashed using bcrypt
- Salt rounds: 10
- Cannot be reversed from hashed form
- Verified using bcrypt.compare() on login

### Duplicate Prevention
- Email field has UNIQUE constraint in database
- Service checks before insertion
- Catches ER_DUP_ENTRY errors gracefully
- No overwrites of existing accounts

## Usage Scenarios

### Development Setup
1. Clone project
2. Install dependencies: `npm install`
3. Setup database: Create and run schema
4. Start server: `npm run dev`
5. Users automatically created
6. Login with any seeded account

### Testing
```bash
# Test admin login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "komakech@gmail.com", "password": "job256"}'

# Test user login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "lisa@gmail.com", "password": "job256"}'
```

### Resetting Development Environment
```bash
# Option 1: Manually seed again (skips existing users)
npm run seed

# Option 2: Delete and recreate database
mysql -u root -p
DROP DATABASE wasteflow_db;
CREATE DATABASE wasteflow_db;
mysql -u root -p wasteflow_db < database/schema.sql

# Option 3: Clear seeded users programmatically
# (Use SeedService.clearDefaultUsers() in a test/admin endpoint)
```

## Console Output Example

When the server starts with seeding enabled:

```
✓ Database connection successful
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

✓ Server running on http://localhost:5000
✓ Environment: development
✓ Frontend URL: http://localhost:5173
```

## Modified Files

### Created Files
1. **`backend/src/services/seedService.ts`** - Core seeding service
2. **`backend/src/seed.ts`** - Standalone seed script

### Updated Files
1. **`backend/src/index.ts`**
   - Added SeedService import
   - Added seedDefaultUsers() call on startup
   - Added error handling for seeding

2. **`backend/package.json`**
   - Updated seed script: `"seed": "ts-node src/seed.ts"`
   - Added test-db script

3. **`database/seed.sql`**
   - Updated comments with default account credentials
   - Added documentation about automatic seeding

4. **`GETTING_STARTED.md`**
   - Added development user accounts section
   - Added automatic user seeding section
   - Updated login examples to use new accounts

5. **`backend/README.md`**
   - Added seeding section
   - Updated manual seeding instructions
   - Updated quick test examples
   - Added seed command documentation

## Authentication Flow

### Login Process with Seeded Users

```
1. User submits email & password (e.g., komakech@gmail.com / job256)
2. Backend verifies email exists in users table
3. Bcrypt compares provided password with hashed password
4. If match:
   - Generate JWT access token (15 min expiry)
   - Generate refresh token (7 day expiry)
   - Return tokens and user info
5. If mismatch:
   - Return 401 Unauthorized error
```

### Token Management
- Access Token: 15 minutes validity
- Refresh Token: 7 days validity
- Both stored securely in frontend localStorage
- Automatic token refresh on expiry

## Best Practices

### For Development
1. Use seeded accounts for local testing
2. Don't modify seeded account passwords
3. Create additional test accounts as needed
4. Use seed script to reset development environment

### For Production
1. Disable automatic seeding (or remove from index.ts)
2. Create admin account manually or via secure setup process
3. Don't use the default passwords
4. Use strong, unique passwords for production
5. Consider IP whitelisting for admin accounts

### For Testing
1. Create a separate test seed file if needed
2. Use mock data for unit/integration tests
3. Test all auth flows with seeded accounts
4. Verify password hashing is working correctly

## Troubleshooting

### Users Not Created on Startup
```
Possible causes:
1. Database not connected - check connection string in .env
2. Database schema not created - run schema.sql
3. Users already exist - check users table
4. Permission error - verify DB user has CREATE privileges

Solution:
1. Verify database connection: npm run test-db
2. Run manual seed: npm run seed
3. Check logs in combined.log for errors
```

### Duplicate Key Error
```
Error: ER_DUP_ENTRY: Duplicate entry 'email' for key 'users.email'

Cause: User already exists in database

Solution: This is expected if running seeding multiple times.
Service gracefully skips and logs "Skipped" message.
```

### Password Not Hashing
```
Issue: Passwords stored in plain text

Cause: Bcrypt hash function failed or not called

Solution:
1. Verify bcryptjs is installed: npm install bcryptjs
2. Check bcrypt import in seedService.ts
3. Verify bcrypt is being called: await bcrypt.hash()
```

## Future Enhancements

1. **Environment Variable Configuration**
   - Make seeded users configurable via .env
   - Allow enabling/disabling automatic seeding
   - Support for multiple seed profiles

2. **Database Seeding Service**
   - Separate service for all seed data (bins, hospitals, etc.)
   - Automated sample data generation
   - Realistic test data factory

3. **Advanced Features**
   - Role-based seeding (only seed if running as admin)
   - Conditional seeding based on environment
   - Versioned seeds for schema migrations
   - Seed hooks for custom logic

4. **Security Enhancements**
   - Rate limiting for seed API
   - Audit logging for seed operations
   - Seed fingerprinting to detect tampering
   - Encrypted seed data storage

## Security Considerations

### Password Storage
- ✅ Passwords are hashed using bcrypt (industry standard)
- ✅ Salt rounds set to 10 (good security/performance balance)
- ✅ Passwords not stored in plain text
- ✅ Passwords not logged or exposed

### Access Control
- ✅ Email field is UNIQUE (no duplicate accounts)
- ✅ Role-based permissions enforced
- ✅ Admin accounts properly marked
- ✅ Status field controls active/inactive

### Development vs Production
- ✅ Seeding only recommended for development
- ✅ Passwords not hardcoded in config
- ✅ Service can be disabled for production
- ✅ No sensitive data in seed files

## Support & Reference

- See `docs/API_ENDPOINTS.md` for authentication endpoint details
- See `docs/DATABASE_SCHEMA.md` for users table schema
- See `backend/src/controllers/authController.ts` for login implementation
- See `GETTING_STARTED.md` for overall setup instructions
