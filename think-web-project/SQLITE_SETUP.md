# SQLite Database Setup Guide

This guide explains how to use SQLite for demonstration purposes. The project is configured to use SQLite by default, but can easily be switched to PostgreSQL for production.

## Database Configuration

The project is currently configured to use SQLite. The database file will be created automatically when you first run the backend.

### Current Configuration

**Backend Configuration** (`backend/app/core/config.py`):
```python
DATABASE_URL: str = "sqlite:///./thinkweb.db"
```

**Database Connection** (`backend/app/database/connection.py`):
- Uses SQLite with `StaticPool` for thread-safe operations
- Database file: `thinkweb.db` (created in the backend directory)

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd think-web-project/backend
   ```

2. Create a virtual environment (if not already created):
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - **Windows:**
     ```bash
     venv\Scripts\activate
     ```
   - **Linux/Mac:**
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. The database will be created automatically when you run the backend. No additional setup is needed!

### 2. Running the Backend

```bash
cd think-web-project/backend
python -m uvicorn app.main:app --reload
```

The database file `thinkweb.db` will be created automatically in the `backend` directory when the server starts.

### 3. Database Location

- **SQLite file location:** `think-web-project/backend/thinkweb.db`
- The database file is created automatically on first run
- All tables are created automatically via SQLAlchemy

## Switching to PostgreSQL (For Production)

When you're ready to use PostgreSQL for production:

1. Update `backend/app/core/config.py`:
   ```python
   DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/thinkweb"
   ```

2. Update `backend/app/database/connection.py`:
   - Remove the SQLite-specific `StaticPool` configuration
   - Use the standard PostgreSQL connection

3. Install PostgreSQL and create the database:
   ```sql
   CREATE DATABASE thinkweb;
   ```

4. Update your `.env` file with PostgreSQL credentials

## Database Schema

The database includes the following tables (created automatically):
- `departments` - Department information
- `positions` - Job positions
- `employees` - Employee records
- `users` - User accounts and authentication
- `devices` - Biometric devices
- `biometric_templates` - Encrypted biometric templates
- `shifts` - Shift definitions
- `schedules` - Employee schedules
- `attendance_records` - Attendance logs
- `leave_types` - Leave type definitions
- `leave_requests` - Leave requests
- `payroll_periods` - Payroll periods
- `payroll_records` - Payroll records

## Creating Initial Data

To create an initial admin user, you can use the API:

```bash
POST /api/v1/auth/register
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "admin123",
  "role": "super_admin"
}
```

Or use the existing authentication endpoints to create users through the frontend.

## Database Management

### Viewing the Database

You can use SQLite browser tools to view the database:
- **DB Browser for SQLite** (https://sqlitebrowser.org/)
- **SQLite CLI** (comes with Python)

### Backup the Database

```bash
# Copy the database file
cp thinkweb.db thinkweb_backup.db
```

### Reset the Database

Simply delete the `thinkweb.db` file and restart the backend. All tables will be recreated automatically.

## Notes

- SQLite is perfect for demonstration and development
- For production with multiple users, use PostgreSQL
- The database schema is identical for both SQLite and PostgreSQL
- All migrations are handled automatically by SQLAlchemy

## Troubleshooting

### Database locked error
- Make sure only one instance of the backend is running
- Close any database browser tools that might have the file open

### Permission errors
- Ensure the backend directory has write permissions
- On Linux/Mac, you may need to adjust file permissions

### Database not found
- The database is created automatically on first run
- Make sure you're running the backend from the correct directory



