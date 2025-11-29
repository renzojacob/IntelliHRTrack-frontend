"""
Payroll management endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import date

from app.database.connection import get_db
from app.database.models import PayrollRecord, PayrollPeriod, Employee, User
from app.core.security import get_current_user, require_role

router = APIRouter()

class PayrollRecordResponse(BaseModel):
    id: int
    employee_id: int
    period_start: date
    period_end: date
    gross_pay: float
    net_pay: float
    status: str
    
    class Config:
        from_attributes = True

@router.get("/", response_model=List[PayrollRecordResponse])
async def get_payroll_records(
    employee_id: Optional[int] = Query(None),
    period_start: Optional[date] = Query(None),
    period_end: Optional[date] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get payroll records"""
    query = db.query(PayrollRecord)
    
    # If employee, only show their own records
    if current_user.role == "employee" and current_user.employee:
        query = query.filter(PayrollRecord.employee_id == current_user.employee.id)
    elif employee_id:
        query = query.filter(PayrollRecord.employee_id == employee_id)
    
    if period_start:
        query = query.filter(PayrollRecord.period_start >= period_start)
    
    if period_end:
        query = query.filter(PayrollRecord.period_end <= period_end)
    
    records = query.order_by(PayrollRecord.period_start.desc()).offset(skip).limit(limit).all()
    return records

@router.get("/{payroll_id}", response_model=PayrollRecordResponse)
async def get_payroll_record(
    payroll_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get payroll record by ID"""
    payroll = db.query(PayrollRecord).filter(PayrollRecord.id == payroll_id).first()
    if not payroll:
        raise HTTPException(status_code=404, detail="Payroll record not found")
    
    # Check access
    if current_user.role == "employee" and current_user.employee:
        if payroll.employee_id != current_user.employee.id:
            raise HTTPException(status_code=403, detail="Access denied")
    
    return payroll













