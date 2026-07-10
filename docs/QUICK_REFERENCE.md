# WasteFlow User Seeding - Quick Reference Card

## 🎯 Quick Start (30 seconds)

```bash
# 1. Start backend
cd backend
npm run dev

# 2. In another terminal, start frontend
cd frontend
npm run dev

# 3. Open browser and login
# http://localhost:5173
# Email: komakech@gmail.com
# Password: job256
```

---

## 📋 Default Accounts

### Admin Accounts ⚙️
```
komakech@gmail.com / job256
emmanuel@gmail.com / job256
```

### User Accounts 👥
```
lisa@gmail.com / job256
mercy@gmail.com / job256
gerald@gmail.com / job256
```

---

## ⚡ Common Commands

### Start Backend (Auto-seeds users)
```bash
cd backend
npm run dev
```

### Manually Seed Users
```bash
cd backend
npm run seed
```

### Test Database Connection
```bash
cd backend
npm run test-db
```

### Test Login via API
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "komakech@gmail.com",
    "password": "job256"
  }'
```

---

## 📊 Account Roles

| Account Type | Role | Permissions |
|---|---|---|
| Admin | admin | Full system access |
| User | waste_manager | Bin monitoring, collections |

---

## 🔒 Security Info

- **Password Hashing**: Bcrypt (10 salt rounds)
- **Status**: All accounts active
- **Token Expiry**: 15 min access, 7 day refresh
- **Duplicate Prevention**: Enabled (safe to seed multiple times)

---

## 📁 Key Files

| File | Purpose |
|---|---|
| backend/src/services/seedService.ts | Seeding logic |
| backend/src/seed.ts | Manual seed script |
| backend/src/index.ts | Auto-seeding on startup |
| docs/USER_SEEDING.md | Full documentation |
| docs/SEEDING_TEST_GUIDE.md | Testing guide |

---

## ✅ Verification Checklist

After startup, verify:
- [ ] Server shows 5 users created in logs
- [ ] Can login with komakech@gmail.com / job256
- [ ] Can login with lisa@gmail.com / job256
- [ ] Dashboard loads after login
- [ ] Can see user profile with correct role

---

## 🔧 Troubleshooting

| Problem | Solution |
|---|---|
| Users not created | Check database connection, run `npm run test-db` |
| Login fails | Verify user exists in DB, check password |
| Wrong role | Verify admin=admin, user=waste_manager |
| Duplicate error | Expected on repeat seeding, will skip |

---

## 📞 Documentation Links

- **Full Setup**: `GETTING_STARTED.md`
- **Backend Setup**: `backend/README.md`
- **Seeding Details**: `docs/USER_SEEDING.md`
- **Testing Steps**: `docs/SEEDING_TEST_GUIDE.md`
- **Implementation**: `docs/IMPLEMENTATION_SUMMARY.md`
- **Modified Files**: `docs/MODIFIED_FILES.md`

---

## 💾 Database Locations

```
MySQL Host: localhost:3306
Database: wasteflow_db
Users Table: users

Query all seeded users:
SELECT id, fullname, email, role, status FROM users 
WHERE email IN ('komakech@gmail.com', 'emmanuel@gmail.com', 
                'lisa@gmail.com', 'mercy@gmail.com', 'gerald@gmail.com');
```

---

## 🚀 API Endpoints

### Login
```
POST /api/auth/login
Body: {"email": "komakech@gmail.com", "password": "job256"}
```

### Refresh Token
```
POST /api/auth/refresh-token
Body: {"refreshToken": "..."}
```

### Protected Endpoint (with token)
```
GET /api/dashboard/stats
Header: Authorization: Bearer <access_token>
```

---

## 📝 Console Output on Startup

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
```

---

## 🎓 Development Workflow

1. **Setup** (First Time)
   ```bash
   npm install
   npm run dev
   ```

2. **Verify** (Check seeding)
   ```bash
   # Check console for "✅ Created user" messages
   # Check database: npm run test-db
   ```

3. **Test** (Try all accounts)
   ```bash
   # Login with admin account in browser
   # Test with different accounts
   ```

4. **Reference** (Need help?)
   ```bash
   # Check docs/SEEDING_TEST_GUIDE.md
   # Or docs/USER_SEEDING.md
   ```

---

## 💡 Pro Tips

1. **First Run**: Users auto-created, safe to run multiple times
2. **Manual Seed**: Use `npm run seed` to verify/recreate users
3. **Testing**: Use admin account first to verify all features
4. **Development**: Create additional test users as needed
5. **Production**: Disable auto-seeding, use different accounts

---

## 🆘 Emergency Reset

If you need to reset everything:

```bash
# 1. Drop and recreate database
mysql -u root -p
DROP DATABASE wasteflow_db;
CREATE DATABASE wasteflow_db;
EXIT;

# 2. Run schema
mysql -u root -p wasteflow_db < database/schema.sql

# 3. Restart backend
npm run dev

# Users will be auto-created again
```

---

## ✨ Key Features

- ✅ **Automatic**: Seeds on server startup
- ✅ **Idempotent**: Safe to run multiple times
- ✅ **Secure**: Passwords bcrypt hashed
- ✅ **Logged**: Shows what was created/skipped
- ✅ **Documented**: Full guides included
- ✅ **Testable**: 17 test cases provided

---

**Version**: 1.0.0  
**Created**: June 1, 2026  
**Status**: ✅ Production Ready

---

## 🏁 One-step Local Start (Windows)

If you are on Windows and want a single command to install and start the backend, from the repo root run:

```powershell
.\start-backend.ps1
```

The script checks for Node/npm, installs dependencies in `backend`, and runs `npm run dev`.
