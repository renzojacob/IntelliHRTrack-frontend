"""
Leave management endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import date

from app.database.connection import get_db
from app.database.models import LeaveRequest, LeaveType, Employee, User
from app.core.security import get_current_user, require_role

router = APIRouter()

class LeaveRequestCreate(BaseModel):
    leave_type_id: int
    start_date: date
    end_date: date
    reason: Optional[str] = None

class LeaveRequestResponse(BaseModel):
    id: int
    employee_id: int
    leave_type_id: int
    start_date: date
    end_date: date
    days_requested: float
    status: str
    
    class Config:
        from_attributes = True

@router.get("/", response_model=List[LeaveRequestResponse])
async def get_leave_requests(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get leave requests"""
    query = db.query(LeaveRequest)
    
    # If employee, only show their own requests
    if current_user.role == "employee" and current_user.employee:
        query = query.filter(LeaveRequest.employee_id == current_user.employee.id)
    
    requests = query.order_by(LeaveRequest.created_at.desc()).all()
    return requests

@router.post("/", response_model=LeaveRequestResponse)
async def create_leave_request(
    data: LeaveRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create leave request"""
    if not current_user.employee:
        raise HTTPException(status_code=404, detail="Employee record not found")
    
    # Calculate days requested
    days = (data.end_date - data.start_date).days + 1
    
    leave_request = LeaveRequest(
        employee_id=current_user.employee.id,
        leave_type_id=data.leave_type_id,
        start_date=data.start_date,
        end_date=data.end_date,
        days_requested=days,
        reason=data.reason
    )
    
    db.add(leave_request)
    db.commit()
    db.refresh(leave_request)
    
    return leave_request





