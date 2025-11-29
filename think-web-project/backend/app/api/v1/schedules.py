"""
Schedule management endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import date

from app.database.connection import get_db
from app.database.models import Schedule, Shift, Employee, User
from app.core.security import get_current_user

router = APIRouter()

class ScheduleResponse(BaseModel):
    id: int
    employee_id: int
    date: date
    start_time: Optional[str]
    end_time: Optional[str]
    
    class Config:
        from_attributes = True

@router.get("/", response_model=List[ScheduleResponse])
async def get_schedules(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get schedules"""
    query = db.query(Schedule)
    
    # If employee, only show their own schedule
    if current_user.role == "employee" and current_user.employee:
        query = query.filter(Schedule.employee_id == current_user.employee.id)
    
    if start_date:
        query = query.filter(Schedule.date >= start_date)
    
    if end_date:
        query = query.filter(Schedule.date <= end_date)
    
    schedules = query.order_by(Schedule.date).all()
    return schedules













