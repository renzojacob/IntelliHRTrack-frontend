# Think Web - Employee Management & Payroll System

A comprehensive employee management and payroll system with biometric attendance (Face Recognition & Fingerprint) built with FastAPI and React.

## 🚀 Quick Start

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up database:
```bash
# Create PostgreSQL database
createdb thinkweb

# Or using SQL:
# CREATE DATABASE thinkweb;
```

5. Configure environment:
```bash
# Copy .env.example to .env and edit with your settings
cp .env.example .env
```

6. Run the server:
```bash
uvicorn app.main:app --reload
```

Backend will be available at `http://localhost:8000`
API docs at `http://localhost:8000/api/docs`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file (optional):
```bash
# Create .env file with:
# VITE_API_BASE_URL=http://localhost:8000
```

4. Run development server:
```bash
npm run dev
```

Frontend will be available at `http://localhost:3000`

## 📁 Project Structure

```
think-web-project/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/v1/      # API endpoints
│   │   ├── core/        # Core utilities
│   │   ├── database/    # Database models
│   │   └── main.py      # FastAPI app
│   └── requirements.txt
├── frontend/            # React frontend
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── layouts/     # Layout components
│   │   ├── services/    # API services
│   │   └── store/       # State management
│   └── package.json
└── README.md
```

## 🔑 Features

### Implemented
- ✅ User authentication (JWT)
- ✅ Role-based access control
- ✅ Employee management (CRUD)
- ✅ Attendance tracking (check-in/out)
- ✅ Face recognition enrollment/verification (skeleton)
- ✅ Payroll management (basic)
- ✅ Leave management (basic)
- ✅ Schedule management (basic)
- ✅ Analytics dashboard
- ✅ Responsive UI with Tailwind CSS

### To Be Implemented
- ⏳ Real face recognition integration (InsightFace/ArcFace)
- ⏳ Fingerprint scanner integration
- ⏳ Advanced payroll calculations
- ⏳ Predictive analytics
- ⏳ Real-time WebSocket updates
- ⏳ File uploads and document management
- ⏳ Email notifications
- ⏳ Mobile app

## 🔐 Default Credentials

After setting up the database, you'll need to create a user. You can use the register endpoint or create one directly in the database.

## 📚 API Documentation

Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/api/docs`
- ReDoc: `http://localhost:8000/api/redoc`

## 🛠️ Development

### Backend
- Uses FastAPI for async API development
- SQLAlchemy for ORM
- PostgreSQL for database
- JWT for authentication

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Query for data fetching
- Zustand for state management
- React Router for routing

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/thinkweb
SECRET_KEY=your-secret-key-here
CORS_ORIGINS=http://localhost:3000
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000
```

## 🧪 Testing

### Backend
```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest
```

### Frontend
```bash
# Run tests (when configured)
npm test
```

## 📦 Deployment

### Backend
1. Set `ENVIRONMENT=production` in .env
2. Use a production ASGI server (e.g., Gunicorn with Uvicorn workers)
3. Set up proper database connection pooling
4. Configure CORS for production domain

### Frontend
1. Build for production: `npm run build`
2. Serve the `dist` folder with a web server (Nginx, etc.)
3. Configure API proxy if needed

## 🤝 Contributing

This is a development project. Feel free to extend and improve!

## 📄 License

This project is for development purposes.

## 🆘 Support

For issues and questions, refer to the documentation files:
- `THINK_WEB_RECOMMENDATIONS.md` - Comprehensive recommendations
- `IMPLEMENTATION_GUIDE.md` - Code examples and patterns
- `README_DEVELOPMENT.md` - Development guide





