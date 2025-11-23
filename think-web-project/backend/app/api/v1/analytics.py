"""
Analytics endpoints
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta

from app.database.connection import get_db
from app.database.models import AttendanceRecord, Employee, User
from app.core.security import get_current_user, require_role

router = APIRouter()

@router.get("/dashboard")
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["super_admin", "hr_admin", "manager"]))
):
    """Get dashboard statistics"""
    today = date.today()
    
    # Total employees
    total_employees = db.query(Employee).filter(Employee.status == "active").count()
    
    # Today's attendance
    today_checked_in = db.query(AttendanceRecord).filter(
        func.date(AttendanceRecord.check_in_time) == today
    ).count()
    
    # Late arrivals today
    late_today = db.query(AttendanceRecord).filter(
        func.date(AttendanceRecord.check_in_time) == today,
        AttendanceRecord.status == "late"
    ).count()
    
    # On leave (mock - would need leave requests table)
    on_leave = 0
    
    # Absent
    absent = total_employees - today_checked_in - on_leave
    
    return {
        "total_employees": total_employees,
        "present": today_checked_in,
        "late": late_today,
        "on_leave": on_leave,
        "absent": absent
    }





