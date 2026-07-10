# WasteFlow User Seeding - Test & Verification Guide

## Quick Verification

### Test All Seeded Accounts

This guide helps you verify that all seeded development accounts are working correctly.

---

## Part 1: Server Startup Verification

### Step 1: Start the Backend Server

```bash
cd backend
npm run dev
```

**Expected Output:**
```
[info]: 🌱 Starting default user seeding...
[info]: ✅ Created user: komakech@gmail.com (Role: admin, ID: 1)
[info]: ✅ Created user: emmanuel@gmail.com (Role: admin, ID: 2)
[info]: ✅ Created user: lisa@gmail.com (Role: waste_manager, ID: 3)
[info]: ✅ Created user: mercy@gmail.com (Role: waste_manager, ID: 4)
[info]: ✅ Created user: gerald@gmail.com (Role: waste_manager, ID: 5)
[info]: 🎉 User seeding completed! Created: 5, Skipped: 0

[info]: 📝 Default Test Accounts:
[info]:    Admin Accounts:
[info]:    • komakech@gmail.com / job256
[info]:    • emmanuel@gmail.com / job256
[info]:    User Accounts:
[info]:    • lisa@gmail.com / job256
[info]:    • mercy@gmail.com / job256
[info]:    • gerald@gmail.com / job256

[info]: ✓ Server running on http://localhost:5000
```

✅ **Success**: Users were seeded automatically on startup.

---

## Part 2: Database Verification

### Step 2: Verify Users in Database

Connect to MySQL and verify users were created:

```bash
mysql -u root -p wasteflow_db
```

```sql
-- Check all seeded users
SELECT id, fullname, email, role, status FROM users WHERE email IN (
  'komakech@gmail.com',
  'emmanuel@gmail.com',
  'lisa@gmail.com',
  'mercy@gmail.com',
  'gerald@gmail.com'
);
```

**Expected Output:**
```
+----+-------------------+-----------------------+----------------+--------+
| id | fullname          | email                 | role           | status |
+----+-------------------+-----------------------+----------------+--------+
|  1 | Komakech Admin    | komakech@gmail.com    | admin          | active |
|  2 | Emmanuel Admin    | emmanuel@gmail.com    | admin          | active |
|  3 | Lisa User         | lisa@gmail.com        | waste_manager  | active |
|  4 | Mercy User        | mercy@gmail.com       | waste_manager  | active |
|  5 | Gerald User       | gerald@gmail.com      | waste_manager  | active |
+----+-------------------+-----------------------+----------------+--------+
```

✅ **Success**: All 5 users exist in the database with correct roles and active status.

### Step 3: Verify Password Hashing

Check that passwords are properly hashed (not plain text):

```sql
-- Check password hashing
SELECT email, password FROM users 
WHERE email IN ('komakech@gmail.com', 'lisa@gmail.com')
LIMIT 2;
```

**Expected Output:**
```
| email              | password                                             |
|--------------------+------------------------------------------------------|
| komakech@gmail.com | $2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  |
| lisa@gmail.com     | $2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  |
```

✅ **Success**: Passwords start with `$2a$10$` (bcrypt format), not plain text.

---

## Part 3: API Login Tests

### Step 4: Test Admin Login (komakech@gmail.com)

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "komakech@gmail.com",
    "password": "job256"
  }'
```

**Expected Response (200 OK):**
```json
{
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "fullname": "Komakech Admin",
    "email": "komakech@gmail.com",
    "role": "admin",
    "hospital_id": null,
    "status": "active"
  }
}
```

✅ **Success**: Admin login works correctly.

### Step 5: Test Admin Login (emmanuel@gmail.com)

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "emmanuel@gmail.com",
    "password": "job256"
  }'
```

**Expected Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 2,
    "fullname": "Emmanuel Admin",
    "email": "emmanuel@gmail.com",
    "role": "admin",
    "status": "active"
  }
  // ... tokens included
}
```

✅ **Success**: Second admin account works correctly.

### Step 6: Test User Login (lisa@gmail.com)

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "lisa@gmail.com",
    "password": "job256"
  }'
```

**Expected Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 3,
    "fullname": "Lisa User",
    "email": "lisa@gmail.com",
    "role": "waste_manager",
    "status": "active"
  }
  // ... tokens included
}
```

✅ **Success**: User login works correctly.

### Step 7: Test User Login (mercy@gmail.com)

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mercy@gmail.com",
    "password": "job256"
  }'
```

✅ **Success**: Second user account works correctly.

### Step 8: Test User Login (gerald@gmail.com)

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "gerald@gmail.com",
    "password": "job256"
  }'
```

✅ **Success**: Third user account works correctly.

### Step 9: Test Wrong Password

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "komakech@gmail.com",
    "password": "wrongpassword"
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "error": "Invalid email or password",
  "details": null,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

✅ **Success**: Wrong password properly rejected.

### Step 10: Test Non-existent Email

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nonexistent@gmail.com",
    "password": "job256"
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "error": "Invalid email or password",
  "details": null,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

✅ **Success**: Non-existent user properly rejected.

---

## Part 4: Frontend UI Tests

### Step 11: Test Frontend Login UI

1. **Start Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Navigate to Login**
   - Open http://localhost:5173
   - Should see login form

3. **Test Admin Login**
   - Email: `komakech@gmail.com`
   - Password: `job256`
   - Click "Login"
   - Should redirect to Dashboard

4. **Verify Dashboard**
   - Should see "Welcome" message with fullname
   - Should see statistics cards
   - Should see navigation menu

✅ **Success**: Frontend login flow works end-to-end.

### Step 12: Test Role-Based Access

1. **Login as Admin**
   - Email: `komakech@gmail.com`
   - Should have access to all pages

2. **Logout and Login as User**
   - Email: `lisa@gmail.com`
   - Should have limited access based on role

✅ **Success**: Role-based access control working correctly.

---

## Part 5: Duplicate User Prevention Test

### Step 13: Verify Duplicate Prevention

Start the server again while users already exist:

```bash
npm run dev
```

**Expected Output:**
```
[info]: 🌱 Starting default user seeding...
[info]: ⏭️  Skipped user: komakech@gmail.com (already exists)
[info]: ⏭️  Skipped user: emmanuel@gmail.com (already exists)
[info]: ⏭️  Skipped user: lisa@gmail.com (already exists)
[info]: ⏭️  Skipped user: mercy@gmail.com (already exists)
[info]: ⏭️  Skipped user: gerald@gmail.com (already exists)
[info]: 🎉 User seeding completed! Created: 0, Skipped: 5
```

✅ **Success**: Duplicate prevention working - existing users are skipped.

### Step 14: Manual Seed Command Test

```bash
cd backend
npm run seed
```

**Expected Output (when users already exist):**
```
🚀 Starting WasteFlow Database Seeding...
🌱 Starting default user seeding...
⏭️  Skipped user: komakech@gmail.com (already exists)
⏭️  Skipped user: emmanuel@gmail.com (already exists)
⏭️  Skipped user: lisa@gmail.com (already exists)
⏭️  Skipped user: mercy@gmail.com (already exists)
⏭️  Skipped user: gerald@gmail.com (already exists)
🎉 User seeding completed! Created: 0, Skipped: 5

📋 Seeded Users in Database:
   1. Komakech Admin (komakech@gmail.com) - Role: admin - Status: active
   2. Emmanuel Admin (emmanuel@gmail.com) - Role: admin - Status: active
   3. Lisa User (lisa@gmail.com) - Role: waste_manager - Status: active
   4. Mercy User (mercy@gmail.com) - Role: waste_manager - Status: active
   5. Gerald User (gerald@gmail.com) - Role: waste_manager - Status: active

✨ Database seeding completed successfully!
```

✅ **Success**: Manual seed command works correctly.

---

## Part 6: Token Refresh Test

### Step 15: Test Token Refresh

1. **Login to get tokens**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "komakech@gmail.com", "password": "job256"}'
   ```
   
   Save the `refreshToken` from response.

2. **Use refresh token to get new access token**
   ```bash
   curl -X POST http://localhost:5000/api/auth/refresh-token \
     -H "Content-Type: application/json" \
     -d '{"refreshToken": "<SAVED_REFRESH_TOKEN>"}'
   ```

**Expected Response (200 OK):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

✅ **Success**: Token refresh works correctly.

---

## Part 7: Protected Endpoint Test

### Step 16: Test Protected Endpoint with Token

1. **Login to get access token**
   ```bash
   curl -X POST http://localhost:5000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email": "komakech@gmail.com", "password": "job256"}' \
     | jq -r '.accessToken' > token.txt
   ```

2. **Access protected endpoint**
   ```bash
   TOKEN=$(cat token.txt)
   curl -X GET http://localhost:5000/api/dashboard/stats \
     -H "Authorization: Bearer $TOKEN"
   ```

**Expected Response (200 OK):**
```json
{
  "totalBins": 8,
  "availableBins": 3,
  "nearlyFullBins": 2,
  "fullBins": 1
}
```

✅ **Success**: Protected endpoint works with valid token.

### Step 17: Test Without Token

```bash
curl -X GET http://localhost:5000/api/dashboard/stats
```

**Expected Response (401 Unauthorized):**
```json
{
  "error": "Unauthorized: Missing token",
  "details": null,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

✅ **Success**: Protected endpoints require valid token.

---

## Summary Checklist

- ✅ Users created on server startup
- ✅ All 5 users exist in database
- ✅ Passwords are bcrypt hashed
- ✅ Admin logins work (komakech, emmanuel)
- ✅ User logins work (lisa, mercy, gerald)
- ✅ Wrong password rejected
- ✅ Non-existent user rejected
- ✅ Frontend login UI works
- ✅ Dashboard accessible after login
- ✅ Role-based access control working
- ✅ Duplicate prevention working
- ✅ Manual seed command works
- ✅ Token generation working
- ✅ Token refresh working
- ✅ Protected endpoints require token
- ✅ Unauthorized request rejected

---

## Troubleshooting

### Problem: Users not created on startup

**Solution:**
1. Check database connection: `npm run test-db`
2. Check logs in `combined.log`
3. Verify schema exists: `SHOW TABLES FROM wasteflow_db;`
4. Run manual seed: `npm run seed`

### Problem: Login fails with correct password

**Solution:**
1. Verify user exists: `SELECT * FROM users WHERE email = '...';`
2. Check password is hashed (starts with $2a$10$)
3. Clear browser cache and cookies
4. Check token expiration in JWT_SECRET

### Problem: Seeding takes too long

**Solution:**
1. Normal for first run (~3-5 seconds for bcrypt hashing)
2. Subsequent runs are instant (users already exist)
3. Check for database locks: `SHOW PROCESSLIST;`

### Problem: "Duplicate entry" error

**Solution:**
1. This is expected behavior (service handles gracefully)
2. Users already exist in database
3. Try deleting and recreating database

---

## Contact

For issues or questions about user seeding:
1. Check `docs/USER_SEEDING.md` for detailed documentation
2. Review `backend/src/services/seedService.ts` for implementation
3. Check logs in `combined.log` for debugging
4. Verify database schema: `DESCRIBE users;`
