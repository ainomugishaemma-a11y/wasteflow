# WasteFlow Backend README

## Setup Instructions

### Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your database credentials and JWT secret.

3. **Database Setup**
   ```bash
   # Create database
   mysql -u root -p
   CREATE DATABASE wasteflow_db;
   
   # Run schema
   mysql -u root -p wasteflow_db < ../database/schema.sql
   
   # Seed sample data (optional)
   mysql -u root -p wasteflow_db < ../database/seed.sql
   ```

### Development

```bash
npm run dev
```

Server will start on `http://localhost:5000`

When the server starts, it automatically seeds default development users:
- Admin: `komakech@gmail.com / job256`
- Admin: `emmanuel@gmail.com / job256`
- User: `lisa@gmail.com / job256`
- User: `mercy@gmail.com / job256`
- User: `gerald@gmail.com / job256`

### Manual User Seeding

To manually create development users:

```bash
npm run seed
```

This will:
1. Connect to the database
2. Check for existing users (prevents duplicates)
3. Create missing users with bcrypt-hashed passwords
4. Display a log showing created/skipped accounts
5. List all seeded users in the database

### Production Build

```bash
npm run build
npm start
```

## Environment Variables

See `.env.example` for all required variables.

Key variables:
- `DB_*`: Database connection
- `JWT_SECRET`: Secret key for JWT tokens
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)

## API Documentation

See `/docs/API_ENDPOINTS.md` for detailed API documentation.

### Quick Test

Test the health endpoint:
```bash
curl http://localhost:5000/health
```

Login with a seeded development account:
```bash
# Admin account
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "komakech@gmail.com",
    "password": "job256"
  }'

# User account
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "lisa@gmail.com",
    "password": "job256"
  }'
```
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Middleware functions
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Helper functions
│   └── index.ts         # App entry point
├── package.json
├── tsconfig.json
├── .env.example
└── Dockerfile
```

## Database Tables

- **users**: User accounts
- **hospitals**: Healthcare facilities
- **bins**: Waste bins
- **notifications**: System notifications
- **collection_records**: Collection history
- **activity_logs**: Audit trail
- **bin_history**: Historical data

See `/docs/DATABASE_SCHEMA.md` for detailed schema.

## Authentication

All protected endpoints require JWT token:
```
Authorization: Bearer <access_token>
```

Token expires in 15 minutes. Use refresh token to get a new one.

## Error Handling

All errors return consistent format:
```json
{
  "error": "Error message",
  "details": null,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Logging

Logs are written to:
- `combined.log`: All logs
- `error.log`: Error logs only

## Docker

Build and run with Docker:
```bash
docker build -t wasteflow-backend .
docker run -p 5000:5000 --env-file .env wasteflow-backend
```

## Development Tips

1. Use TypeScript strict mode for type safety
2. Check logs for debugging: `tail -f combined.log`
3. Test endpoints with curl or Postman
4. Database indexes are auto-created from schema
5. Use parameterized queries to prevent SQL injection

## Testing

TODO: Add test suite with Jest

## Support

For issues, check:
1. Logs in `combined.log` and `error.log`
2. Database connection: `npm run test-db`
3. API health: `curl http://localhost:5000/health`
