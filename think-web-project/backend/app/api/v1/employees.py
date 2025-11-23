"""
Employee management endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date

from app.database.connection import get_db
from app.database.models import Employee, Department, Position
from app.core.security import get_current_user, require_role
from app.database.models import User

router = APIRouter()

class EmployeeCreate(BaseModel):
    employee_id: str
    first_name: str
    last_name: str
    middle_name: Optional[str] = None
    email: EmailStr
    phone: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    department_id: int
    position_id: int
    hire_date: date
    employment_type: str = "permanent"
    salary: Optional[float] = None
    sss_number: Optional[str] = None
    philhealth_number: Optional[str] = None
    pagibig_number: Optional[str] = None
    tin_number: Optional[str] = None

class EmployeeUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    middle_name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    department_id: Optional[int] = None
    position_id: Optional[int] = None
    status: Optional[str] = None
    salary: Optional[float] = None

class EmployeeResponse(BaseModel):
    id: int
    employee_id: str
    first_name: str
    last_name: str
    middle_name: Optional[str]
    email: str
    phone: Optional[str]
    department_id: Optional[int]
    position_id: Optional[int]
    hire_date: date
    employment_type: str
    status: str
    salary: Optional[float]
    
    class Config:
        from_attributes = True

@router.get("/", response_model=List[EmployeeResponse])
async def get_employees(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: Optional[str] = None,
    department_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get list of employees"""
    query = db.query(Employee)
    
    if search:
        search_filter = or_(
            Employee.first_name.ilike(f"%{search}%"),
            Employee.last_name.ilike(f"%{search}%"),
            Employee.employee_id.ilike(f"%{search}%"),
            Employee.email.ilike(f"%{search}%")
        )
        query = query.filter(search_filter)
    
    if department_id:
        query = query.filter(Employee.department_id == department_id)
    
    if status:
        query = query.filter(Employee.status == status)
    
    employees = query.offset(skip).limit(limit).all()
    return employees

@router.get("/{employee_id}", response_model=EmployeeResponse)
async def get_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get employee by ID"""
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@router.post("/", response_model=EmployeeResponse)
async def create_employee(
    employee_data: EmployeeCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["super_admin", "hr_admin"]))
):
    """Create new employee"""
    # Check if employee_id already exists
    if db.query(Employee).filter(Employee.employee_id == employee_data.employee_id).first():
        raise HTTPException(status_code=400, detail="Employee ID already exists")
    
    # Check if email already exists
    if db.query(Employee).filter(Employee.email == employee_data.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")
    
    # Verify department exists
    department = db.query(Department).filter(Department.id == employee_data.department_id).first()
    if not department:
        raise HTTPException(status_code=404, detail="Department not found")
    
    # Verify position exists
    position = db.query(Position).filter(Position.id == employee_data.position_id).first()
    if not position:
        raise HTTPException(status_code=404, detail="Position not found")
    
    employee = Employee(**employee_data.dict())
    db.add(employee)
    db.commit()
    db.refresh(employee)
    
    return employee

@router.put("/{employee_id}", response_model=EmployeeResponse)
async def update_employee(
    employee_id: int,
    employee_data: EmployeeUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["super_admin", "hr_admin"]))
):
    """Update employee"""
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    update_data = employee_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(employee, field, value)
    
    db.commit()
    db.refresh(employee)
    
    return employee

@router.delete("/{employee_id}")
async def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["super_admin"]))
):
    """Delete employee (soft delete by setting status to terminated)"""
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    employee.status = "terminated"
    db.commit()
    
    return {"message": "Employee deleted successfully"}





