"""
Attendance management endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date, timedelta

from app.database.connection import get_db
from app.database.models import AttendanceRecord, Employee, Schedule, User
from app.core.security import get_current_user, require_role

router = APIRouter()

class AttendanceCheckIn(BaseModel):
    employee_id: int
    method: str = "face"  # face, fingerprint, manual
    device_id: Optional[int] = None
    location_lat: Optional[float] = None
    location_lng: Optional[float] = None

class AttendanceCheckOut(BaseModel):
    employee_id: int
    attendance_id: Optional[int] = None
    method: str = "face"

class AttendanceResponse(BaseModel):
    id: int
    employee_id: int
    check_in_time: datetime
    check_out_time: Optional[datetime]
    method: str
    status: Optional[str]
    minutes_late: int
    work_duration_minutes: Optional[int]
    
    class Config:
        from_attributes = True

@router.post("/check-in", response_model=AttendanceResponse)
async def check_in(
    employee_id: int = Form(...),
    method: str = Form("face"),
    device_id: Optional[int] = Form(None),
    location_lat: Optional[float] = Form(None),
    location_lng: Optional[float] = Form(None),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Record employee check-in"""
    # Verify employee exists
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Check if already checked in today
    today = date.today()
    existing = db.query(AttendanceRecord).filter(
        and_(
            AttendanceRecord.employee_id == employee_id,
            func.date(AttendanceRecord.check_in_time) == today,
            AttendanceRecord.check_out_time.is_(None)
        )
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Already checked in today")
    
    # TODO: Verify biometric if method is face or fingerprint
    confidence_score = None
    liveness_score = None
    
    if method == "face" and image:
        # In production, call face verification service
        confidence_score = 0.95  # Mock
        liveness_score = 0.90  # Mock
    
    # Get today's schedule
    schedule = db.query(Schedule).filter(
        and_(
            Schedule.employee_id == employee_id,
            Schedule.date == today
        )
    ).first()
    
    # Determine status
    check_in_time = datetime.utcnow()
    status = "on_time"
    minutes_late = 0
    
    if schedule and schedule.start_time:
        scheduled_start = datetime.combine(today, schedule.start_time)
        if check_in_time > scheduled_start:
            minutes_late = int((check_in_time - scheduled_start).total_seconds() / 60)
            status = "late" if minutes_late > 5 else "on_time"
    
    # Create attendance record
    attendance = AttendanceRecord(
        employee_id=employee_id,
        check_in_time=check_in_time,
        method=method,
        device_id=device_id,
        location_lat=location_lat,
        location_lng=location_lng,
        confidence_score=confidence_score,
        liveness_score=liveness_score,
        status=status,
        minutes_late=minutes_late
    )
    
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    
    return attendance

@router.post("/check-out", response_model=AttendanceResponse)
async def check_out(
    employee_id: int = Form(...),
    attendance_id: Optional[int] = Form(None),
    method: str = Form("face"),
    image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Record employee check-out"""
    # Find attendance record
    if attendance_id:
        attendance = db.query(AttendanceRecord).filter(
            and_(
                AttendanceRecord.id == attendance_id,
                AttendanceRecord.employee_id == employee_id
            )
        ).first()
    else:
        # Find today's check-in
        today = date.today()
        attendance = db.query(AttendanceRecord).filter(
            and_(
                AttendanceRecord.employee_id == employee_id,
                func.date(AttendanceRecord.check_in_time) == today,
                AttendanceRecord.check_out_time.is_(None)
            )
        ).first()
    
    if not attendance:
        raise HTTPException(status_code=404, detail="No active check-in found")
    
    # Update attendance record
    attendance.check_out_time = datetime.utcnow()
    
    # Calculate work duration
    if attendance.check_in_time and attendance.check_out_time:
        duration = attendance.check_out_time - attendance.check_in_time
        attendance.work_duration_minutes = int(duration.total_seconds() / 60)
    
    db.commit()
    db.refresh(attendance)
    
    return attendance

@router.get("/", response_model=List[AttendanceResponse])
async def get_attendance(
    employee_id: Optional[int] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get attendance records"""
    query = db.query(AttendanceRecord)
    
    if employee_id:
        query = query.filter(AttendanceRecord.employee_id == employee_id)
    
    if start_date:
        query = query.filter(func.date(AttendanceRecord.check_in_time) >= start_date)
    
    if end_date:
        query = query.filter(func.date(AttendanceRecord.check_in_time) <= end_date)
    
    records = query.order_by(AttendanceRecord.check_in_time.desc()).offset(skip).limit(limit).all()
    return records

@router.get("/today")
async def get_today_attendance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get today's attendance summary"""
    today = date.today()
    
    # Get current user's employee record
    if not current_user.employee:
        raise HTTPException(status_code=404, detail="Employee record not found")
    
    employee_id = current_user.employee.id
    
    # Get today's attendance
    attendance = db.query(AttendanceRecord).filter(
        and_(
            AttendanceRecord.employee_id == employee_id,
            func.date(AttendanceRecord.check_in_time) == today
        )
    ).first()
    
    if not attendance:
        return {
            "checked_in": False,
            "checked_out": False,
            "attendance": None
        }
    
    return {
        "checked_in": True,
        "checked_out": attendance.check_out_time is not None,
        "attendance": {
            "id": attendance.id,
            "check_in_time": attendance.check_in_time,
            "check_out_time": attendance.check_out_time,
            "status": attendance.status,
            "minutes_late": attendance.minutes_late,
            "work_duration_minutes": attendance.work_duration_minutes
        }
    }













