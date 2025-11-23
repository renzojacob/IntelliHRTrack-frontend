"""
Database Models (SQLAlchemy)
"""
from sqlalchemy import Column, Integer, String, DateTime, Decimal, Boolean, ForeignKey, Text, LargeBinary, Date, Time, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Department(Base):
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    code = Column(String(20), unique=True)
    description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    employees = relationship("Employee", back_populates="department")

class Position(Base):
    __tablename__ = "positions"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(100), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"))
    level = Column(String(50))  # junior, mid, senior, manager, director
    created_at = Column(DateTime, default=datetime.utcnow)

class Employee(Base):
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String(50), unique=True, nullable=False, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    middle_name = Column(String(100))
    email = Column(String(255), unique=True, nullable=False)
    phone = Column(String(20))
    address = Column(Text)
    date_of_birth = Column(Date)
    gender = Column(String(20))
    department_id = Column(Integer, ForeignKey("departments.id"))
    position_id = Column(Integer, ForeignKey("positions.id"))
    hire_date = Column(Date, nullable=False)
    employment_type = Column(String(50), default="permanent")
    status = Column(String(50), default="active")
    salary = Column(Decimal(12, 2))
    bank_account_number = Column(String(50))
    bank_name = Column(String(100))
    sss_number = Column(String(20))
    philhealth_number = Column(String(20))
    pagibig_number = Column(String(20))
    tin_number = Column(String(20))
    emergency_contact_name = Column(String(100))
    emergency_contact_phone = Column(String(20))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    department = relationship("Department", back_populates="employees")
    user = relationship("User", back_populates="employee", uselist=False)
    attendance_records = relationship("AttendanceRecord", back_populates="employee")
    biometric_templates = relationship("BiometricTemplate", back_populates="employee")

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), unique=True)
    username = Column(String(100), unique=True, nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="employee")  # super_admin, hr_admin, payroll_admin, manager, employee
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    employee = relationship("Employee", back_populates="user")

class Device(Base):
    __tablename__ = "devices"
    
    id = Column(Integer, primary_key=True, index=True)
    device_name = Column(String(100), nullable=False)
    device_type = Column(String(50), nullable=False)  # camera, fingerprint_scanner, hybrid
    location = Column(String(255))
    ip_address = Column(String(45))
    mac_address = Column(String(17))
    status = Column(String(20), default="offline")
    last_seen = Column(DateTime)
    firmware_version = Column(String(50))
    registered_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    templates = relationship("BiometricTemplate", back_populates="device")
    attendance_records = relationship("AttendanceRecord", back_populates="device")

class BiometricTemplate(Base):
    __tablename__ = "biometric_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    template_type = Column(String(20), nullable=False)  # face, fingerprint
    encrypted_template = Column(LargeBinary, nullable=False)
    template_hash = Column(String(64), nullable=False, index=True)
    device_id = Column(Integer, ForeignKey("devices.id"))
    confidence_score = Column(Decimal(5, 2))
    enrolled_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    employee = relationship("Employee", back_populates="biometric_templates")
    device = relationship("Device", back_populates="templates")

class Shift(Base):
    __tablename__ = "shifts"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    break_duration_minutes = Column(Integer, default=60)
    department_id = Column(Integer, ForeignKey("departments.id"))
    is_flexible = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Schedule(Base):
    __tablename__ = "schedules"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    shift_id = Column(Integer, ForeignKey("shifts.id"))
    date = Column(Date, nullable=False)
    start_time = Column(Time)
    end_time = Column(Time)
    break_duration_minutes = Column(Integer, default=60)
    is_holiday = Column(Boolean, default=False)
    is_rest_day = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class AttendanceRecord(Base):
    __tablename__ = "attendance_records"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    check_in_time = Column(DateTime, nullable=False, index=True)
    check_out_time = Column(DateTime)
    method = Column(String(20), nullable=False)  # face, fingerprint, manual
    device_id = Column(Integer, ForeignKey("devices.id"))
    location_lat = Column(Decimal(10, 8))
    location_lng = Column(Decimal(11, 8))
    confidence_score = Column(Decimal(5, 2))
    liveness_score = Column(Decimal(5, 2))
    status = Column(String(20))  # on_time, late, early_departure
    minutes_late = Column(Integer, default=0)
    minutes_early = Column(Integer, default=0)
    work_duration_minutes = Column(Integer)
    is_override = Column(Boolean, default=False)
    override_reason = Column(Text)
    override_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    employee = relationship("Employee", back_populates="attendance_records")
    device = relationship("Device", back_populates="attendance_records")

class LeaveType(Base):
    __tablename__ = "leave_types"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    code = Column(String(20), unique=True)
    max_days_per_year = Column(Integer)
    is_paid = Column(Boolean, default=True)
    requires_approval = Column(Boolean, default=True)
    carry_over_allowed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class LeaveRequest(Base):
    __tablename__ = "leave_requests"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    leave_type_id = Column(Integer, ForeignKey("leave_types.id"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    days_requested = Column(Decimal(4, 2), nullable=False)
    reason = Column(Text)
    status = Column(String(20), default="pending")
    approved_by = Column(Integer, ForeignKey("users.id"))
    approved_at = Column(DateTime)
    rejection_reason = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class PayrollPeriod(Base):
    __tablename__ = "payroll_periods"
    
    id = Column(Integer, primary_key=True, index=True)
    period_name = Column(String(100), nullable=False)
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    pay_date = Column(Date, nullable=False)
    status = Column(String(20), default="draft")
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    approved_at = Column(DateTime)
    paid_at = Column(DateTime)

class PayrollRecord(Base):
    __tablename__ = "payroll_records"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    payroll_period_id = Column(Integer, ForeignKey("payroll_periods.id"))
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    gross_pay = Column(Decimal(12, 2), nullable=False)
    basic_salary = Column(Decimal(12, 2), nullable=False)
    overtime_hours = Column(Decimal(5, 2), default=0)
    overtime_pay = Column(Decimal(12, 2), default=0)
    allowances = Column(Decimal(12, 2), default=0)
    bonuses = Column(Decimal(12, 2), default=0)
    tax = Column(Decimal(12, 2), default=0)
    sss_contribution = Column(Decimal(12, 2), default=0)
    philhealth_contribution = Column(Decimal(12, 2), default=0)
    pagibig_contribution = Column(Decimal(12, 2), default=0)
    other_deductions = Column(Decimal(12, 2), default=0)
    net_pay = Column(Decimal(12, 2), nullable=False)
    status = Column(String(20), default="draft")
    generated_at = Column(DateTime, default=datetime.utcnow)
    approved_at = Column(DateTime)
    paid_at = Column(DateTime)
    notes = Column(Text)





