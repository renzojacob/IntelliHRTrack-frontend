"""
Initialize SQLite database with tables and sample data
Uses SQLAlchemy models to ensure consistency with backend
"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent))

from sqlalchemy.orm import Session
from app.database.connection import engine
from app.database import models
from app.core.security import get_password_hash
from datetime import date, time

# Database path
DB_PATH = Path(__file__).parent / "thinkweb.db"

def init_database():
    """Initialize SQLite database with all tables using SQLAlchemy"""
    # Create all tables
    print("Creating tables...")
    models.Base.metadata.create_all(bind=engine)
    
    # Create session
    db = Session(engine)
    
    try:
        # Check if data already exists
        existing_user = db.query(models.User).filter(models.User.username == "admin").first()
        if existing_user:
            print("Database already initialized. Skipping sample data.")
            return
        
        print("Inserting sample data...")
        
        # Departments
        dept1 = models.Department(name="IT", code="IT", description="Information Technology")
        dept2 = models.Department(name="Sales", code="SALES", description="Sales and Marketing")
        dept3 = models.Department(name="HR", code="HR", description="Human Resources")
        dept4 = models.Department(name="Finance", code="FIN", description="Finance and Accounting")
        dept5 = models.Department(name="Operations", code="OPS", description="Operations")
        db.add_all([dept1, dept2, dept3, dept4, dept5])
        db.flush()
        
        # Positions
        pos1 = models.Position(title="Software Engineer", department_id=dept1.id, level="senior")
        pos2 = models.Position(title="Sales Manager", department_id=dept2.id, level="manager")
        pos3 = models.Position(title="HR Specialist", department_id=dept3.id, level="mid")
        pos4 = models.Position(title="Accountant", department_id=dept4.id, level="mid")
        pos5 = models.Position(title="Operations Manager", department_id=dept5.id, level="manager")
        db.add_all([pos1, pos2, pos3, pos4, pos5])
        db.flush()
        
        # Employees
        emp1 = models.Employee(
            employee_id="EMP001", first_name="John", last_name="Doe",
            email="john.doe@example.com", phone="1234567890",
            department_id=dept1.id, position_id=pos1.id,
            hire_date=date(2020, 1, 15), status="active", salary=50000.00
        )
        emp2 = models.Employee(
            employee_id="EMP002", first_name="Jane", last_name="Smith",
            email="jane.smith@example.com", phone="0987654321",
            department_id=dept2.id, position_id=pos2.id,
            hire_date=date(2019, 3, 10), status="active", salary=60000.00
        )
        emp3 = models.Employee(
            employee_id="EMP003", first_name="Bob", last_name="Johnson",
            email="bob.johnson@example.com", phone="5551234567",
            department_id=dept3.id, position_id=pos3.id,
            hire_date=date(2021, 6, 1), status="active", salary=45000.00
        )
        db.add_all([emp1, emp2, emp3])
        db.flush()
        
        # Admin User
        admin_user = models.User(
            username="admin",
            email="admin@example.com",
            password_hash=get_password_hash("admin123"),
            role="super_admin",
            is_active=True
        )
        db.add(admin_user)
        db.flush()
        
        # Devices
        dev1 = models.Device(
            device_name="Kiosk-01", device_type="camera",
            location="Main Office - Floor 1", ip_address="192.168.1.100",
            mac_address="00:11:22:33:44:55", status="online"
        )
        dev2 = models.Device(
            device_name="Fingerprint Scanner A", device_type="fingerprint_scanner",
            location="Main Office - Floor 2", ip_address="192.168.1.101",
            mac_address="00:11:22:33:44:56", status="online"
        )
        db.add_all([dev1, dev2])
        db.flush()
        
        # Leave Types
        lt1 = models.LeaveType(name="Vacation Leave", code="VL", max_days_per_year=15, is_paid=True, requires_approval=True, carry_over_allowed=True)
        lt2 = models.LeaveType(name="Sick Leave", code="SL", max_days_per_year=10, is_paid=True, requires_approval=True, carry_over_allowed=False)
        lt3 = models.LeaveType(name="Emergency Leave", code="EL", max_days_per_year=5, is_paid=True, requires_approval=True, carry_over_allowed=False)
        db.add_all([lt1, lt2, lt3])
        db.flush()
        
        # Shifts
        shift1 = models.Shift(name="Day Shift", start_time=time(8, 0), end_time=time(17, 0), break_duration_minutes=60, department_id=dept1.id)
        shift2 = models.Shift(name="Night Shift", start_time=time(22, 0), end_time=time(7, 0), break_duration_minutes=60, department_id=dept1.id)
        db.add_all([shift1, shift2])
        
        db.commit()
        print(f"Database initialized successfully at {DB_PATH}")
        print("Default admin credentials:")
        print("  Username: admin")
        print("  Password: admin123")
    except Exception as e:
        db.rollback()
        print(f"Error initializing database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    init_database()

