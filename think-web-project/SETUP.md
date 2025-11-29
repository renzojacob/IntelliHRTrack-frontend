# Think Web - Setup Guide

Complete setup instructions for Think Web Employee Management System.

## Prerequisites

Before starting, ensure you have:

- **Python 3.11+** - [Download Python](https://www.python.org/downloads/)
- **Node.js 18+** - [Download Node.js](https://nodejs.org/)
- **PostgreSQL 14+** - [Download PostgreSQL](https://www.postgresql.org/download/)
- **Git** (optional) - [Download Git](https://git-scm.com/)

## Step 1: Database Setup

### Install PostgreSQL

1. Download and install PostgreSQL from the official website
2. During installation, remember the password you set for the `postgres` user
3. Verify installation:
```bash
psql --version
```

### Create Database

1. Open PostgreSQL command line or pgAdmin
2. Create the database:
```sql
CREATE DATABASE thinkweb;
```

Or using command line:
```bash
createdb thinkweb
```

### (Optional) Run Database Schema

If you have the `database_schema.sql` file:
```bash
psql thinkweb < database_schema.sql
```

## Step 2: Backend Setup

### Navigate to Backend Directory

```bash
cd think-web-project/backend
```

### Create Virtual Environment

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**Mac/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Configure Environment

1. Create `.env` file in the `backend` directory:
```bash
# Windows
copy .env.example .env

# Mac/Linux
cp .env.example .env
```

2. Edit `.env` file with your settings:
```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/thinkweb
SECRET_KEY=your-secret-key-change-this-to-random-string-min-32-chars
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

**Important:** Change `YOUR_PASSWORD` to your PostgreSQL password and `SECRET_KEY` to a random string.

### Initialize Database Tables

The application will create tables automatically on first run. Alternatively, you can use Alembic for migrations (recommended for production).

### Run Backend Server

```bash
uvicorn app.main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Application startup complete.
```

Backend is now running at `http://localhost:8000`
API documentation at `http://localhost:8000/api/docs`

## Step 3: Frontend Setup

### Navigate to Frontend Directory

Open a **new terminal window** (keep backend running):

```bash
cd think-web-project/frontend
```

### Install Dependencies

```bash
npm install
```

This may take a few minutes.

### Configure Environment (Optional)

Create `.env` file in the `frontend` directory:
```env
VITE_API_BASE_URL=http://localhost:8000
```

### Run Frontend Development Server

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

Frontend is now running at `http://localhost:3000`

## Step 4: Create First User

### Option 1: Using API (Recommended)

1. Open API docs: `http://localhost:8000/api/docs`
2. Find the `/api/v1/auth/register` endpoint
3. Click "Try it out"
4. Enter user data:
```json
{
  "username": "admin",
  "email": "admin@thinkweb.com",
  "password": "admin123",
  "employee_id": 1,
  "role": "super_admin"
}
```

**Note:** You'll need to create an employee first (see Option 2).

### Option 2: Using Database Directly

1. Connect to PostgreSQL:
```bash
psql thinkweb
```

2. Insert employee:
```sql
INSERT INTO departments (name, code) VALUES ('IT', 'IT') ON CONFLICT DO NOTHING;
INSERT INTO positions (title, department_id) VALUES ('Admin', 1) ON CONFLICT DO NOTHING;
INSERT INTO employees (employee_id, first_name, last_name, email, department_id, position_id, hire_date)
VALUES ('EMP001', 'Admin', 'User', 'admin@thinkweb.com', 1, 1, CURRENT_DATE);
```

3. Insert user:
```sql
-- Password hash for "admin123" (you should use the actual hash from the app)
INSERT INTO users (employee_id, username, email, password_hash, role)
VALUES (1, 'admin', 'admin@thinkweb.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqB5J5K5K2', 'super_admin');
```

**Note:** The password hash above is for "admin123". In production, use the `get_password_hash` function from the app.

## Step 5: Access the Application

1. Open browser: `http://localhost:3000`
2. Login with credentials:
   - Username: `admin`
   - Password: `admin123` (or whatever you set)

## Troubleshooting

### Backend Issues

**Database Connection Error:**
- Check PostgreSQL is running: `pg_isready`
- Verify database exists: `psql -l | grep thinkweb`
- Check `.env` file has correct `DATABASE_URL`

**Port Already in Use:**
- Change port in `.env`: `PORT=8001`
- Or kill process using port 8000

**Module Not Found:**
- Ensure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`

### Frontend Issues

**Cannot Connect to API:**
- Verify backend is running on port 8000
- Check `.env` file has correct `VITE_API_BASE_URL`
- Check browser console for CORS errors

**npm install Fails:**
- Clear cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then reinstall
- Try using `yarn` instead: `yarn install`

**Port 3000 Already in Use:**
- Change port in `vite.config.ts`
- Or kill process using port 3000

### Database Issues

**Tables Not Created:**
- Check database connection in `.env`
- Manually run: `python -c "from app.database.models import Base; from app.database.connection import engine; Base.metadata.create_all(bind=engine)"`

**Permission Denied:**
- Ensure PostgreSQL user has proper permissions
- Check `pg_hba.conf` for authentication settings

## Next Steps

1. **Create More Users:** Use the admin panel or API to create employees and users
2. **Enroll Biometrics:** Use the biometrics page to enroll face templates
3. **Set Up Schedules:** Create shifts and assign schedules
4. **Configure Payroll:** Set up payroll periods and calculations
5. **Customize:** Modify UI, add features, integrate real biometric hardware

## Development Tips

1. **Backend Logs:** Check terminal where `uvicorn` is running
2. **Frontend Logs:** Check browser console (F12)
3. **API Testing:** Use Swagger UI at `/api/docs`
4. **Database:** Use pgAdmin or `psql` to inspect data
5. **Hot Reload:** Both frontend and backend support hot reload during development

## Production Deployment

For production deployment, refer to:
- `THINK_WEB_RECOMMENDATIONS.md` - Deployment section
- `README_DEVELOPMENT.md` - Production considerations

## Support

If you encounter issues:
1. Check error messages in console/logs
2. Verify all prerequisites are installed
3. Ensure database is running and accessible
4. Check environment variables are set correctly
5. Review the documentation files for detailed information

---

**Happy Coding! 🚀**













