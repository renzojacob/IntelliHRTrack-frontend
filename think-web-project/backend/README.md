# Think Web Backend

FastAPI backend for Think Web Employee Management & Payroll System.

## Setup

1. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Set up database:**
```bash
# Create PostgreSQL database
createdb thinkweb

# Or using SQL:
# CREATE DATABASE thinkweb;
```

4. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

5. **Run migrations (if using Alembic):**
```bash
# TODO: Set up Alembic migrations
# alembic init migrations
# alembic revision --autogenerate -m "Initial migration"
# alembic upgrade head
```

6. **Run the server:**
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`
API documentation at `http://localhost:8000/api/docs`

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   └── v1/          # API endpoints
│   ├── core/            # Core utilities (config, security)
│   ├── database/        # Database models and connection
│   └── main.py          # FastAPI application
├── requirements.txt
└── .env                 # Environment variables (not in git)
```

## API Endpoints

- `/api/v1/auth` - Authentication
- `/api/v1/employees` - Employee management
- `/api/v1/attendance` - Attendance tracking
- `/api/v1/biometrics` - Biometric enrollment/verification
- `/api/v1/payroll` - Payroll management
- `/api/v1/leaves` - Leave management
- `/api/v1/schedules` - Schedule management
- `/api/v1/analytics` - Analytics and reports





