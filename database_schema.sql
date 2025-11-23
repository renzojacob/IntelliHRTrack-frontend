-- Think Web Database Schema
-- PostgreSQL Database Schema for Employee Management & Payroll System

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Departments Table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Positions Table
CREATE TABLE positions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    department_id INTEGER REFERENCES departments(id),
    level VARCHAR(50), -- junior, mid, senior, manager, director
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employees Table
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    date_of_birth DATE,
    gender VARCHAR(20),
    department_id INTEGER REFERENCES departments(id),
    position_id INTEGER REFERENCES positions(id),
    hire_date DATE NOT NULL,
    employment_type VARCHAR(50) DEFAULT 'permanent', -- permanent, contractual, part-time, intern
    status VARCHAR(50) DEFAULT 'active', -- active, on_leave, suspended, terminated
    salary DECIMAL(12,2),
    bank_account_number VARCHAR(50),
    bank_name VARCHAR(100),
    sss_number VARCHAR(20),
    philhealth_number VARCHAR(20),
    pagibig_number VARCHAR(20),
    tin_number VARCHAR(20),
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Table (for authentication)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(id) UNIQUE,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'employee', -- super_admin, hr_admin, payroll_admin, manager, employee
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Devices Table (Biometric Hardware)
CREATE TABLE devices (
    id SERIAL PRIMARY KEY,
    device_name VARCHAR(100) NOT NULL,
    device_type VARCHAR(50) NOT NULL, -- camera, fingerprint_scanner, hybrid
    location VARCHAR(255),
    ip_address VARCHAR(45),
    mac_address VARCHAR(17),
    status VARCHAR(20) DEFAULT 'offline', -- online, offline, maintenance
    last_seen TIMESTAMP,
    firmware_version VARCHAR(50),
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Biometric Templates Table (Encrypted Storage)
CREATE TABLE biometric_templates (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    template_type VARCHAR(20) NOT NULL, -- face, fingerprint
    encrypted_template BYTEA NOT NULL, -- AES-256 encrypted
    template_hash VARCHAR(64) NOT NULL, -- SHA-256 for duplicate detection
    device_id INTEGER REFERENCES devices(id),
    confidence_score DECIMAL(5,2),
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shifts Table
CREATE TABLE shifts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    break_duration_minutes INTEGER DEFAULT 60,
    department_id INTEGER REFERENCES departments(id),
    is_flexible BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Schedules Table
CREATE TABLE schedules (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    shift_id INTEGER REFERENCES shifts(id),
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    break_duration_minutes INTEGER DEFAULT 60,
    is_holiday BOOLEAN DEFAULT FALSE,
    is_rest_day BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, date)
);

-- Attendance Records Table
CREATE TABLE attendance_records (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    check_in_time TIMESTAMP NOT NULL,
    check_out_time TIMESTAMP,
    method VARCHAR(20) NOT NULL, -- face, fingerprint, manual, card
    device_id INTEGER REFERENCES devices(id),
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8),
    confidence_score DECIMAL(5,2),
    liveness_score DECIMAL(5,2),
    status VARCHAR(20), -- on_time, late, early_departure, absent
    minutes_late INTEGER DEFAULT 0,
    minutes_early INTEGER DEFAULT 0,
    work_duration_minutes INTEGER,
    is_override BOOLEAN DEFAULT FALSE,
    override_reason TEXT,
    override_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leave Types Table
CREATE TABLE leave_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(20) UNIQUE,
    max_days_per_year INTEGER,
    is_paid BOOLEAN DEFAULT TRUE,
    requires_approval BOOLEAN DEFAULT TRUE,
    carry_over_allowed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leave Balances Table
CREATE TABLE leave_balances (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id INTEGER NOT NULL REFERENCES leave_types(id),
    balance DECIMAL(4,2) NOT NULL DEFAULT 0,
    accrued DECIMAL(4,2) DEFAULT 0,
    used DECIMAL(4,2) DEFAULT 0,
    year INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, leave_type_id, year)
);

-- Leave Requests Table
CREATE TABLE leave_requests (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    leave_type_id INTEGER NOT NULL REFERENCES leave_types(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_requested DECIMAL(4,2) NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, cancelled
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payroll Periods Table
CREATE TABLE payroll_periods (
    id SERIAL PRIMARY KEY,
    period_name VARCHAR(100) NOT NULL,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    pay_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'draft', -- draft, processing, approved, paid
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    paid_at TIMESTAMP
);

-- Payroll Records Table
CREATE TABLE payroll_records (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    payroll_period_id INTEGER NOT NULL REFERENCES payroll_periods(id),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    gross_pay DECIMAL(12,2) NOT NULL,
    basic_salary DECIMAL(12,2) NOT NULL,
    overtime_hours DECIMAL(5,2) DEFAULT 0,
    overtime_pay DECIMAL(12,2) DEFAULT 0,
    allowances DECIMAL(12,2) DEFAULT 0,
    bonuses DECIMAL(12,2) DEFAULT 0,
    tax DECIMAL(12,2) DEFAULT 0,
    sss_contribution DECIMAL(12,2) DEFAULT 0,
    philhealth_contribution DECIMAL(12,2) DEFAULT 0,
    pagibig_contribution DECIMAL(12,2) DEFAULT 0,
    other_deductions DECIMAL(12,2) DEFAULT 0,
    net_pay DECIMAL(12,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'draft', -- draft, approved, paid, disputed
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    paid_at TIMESTAMP,
    notes TEXT
);

-- Payroll Disputes Table
CREATE TABLE payroll_disputes (
    id SERIAL PRIMARY KEY,
    payroll_record_id INTEGER NOT NULL REFERENCES payroll_records(id) ON DELETE CASCADE,
    employee_id INTEGER NOT NULL REFERENCES employees(id),
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, under_review, resolved, rejected
    resolved_by INTEGER REFERENCES users(id),
    resolved_at TIMESTAMP,
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shift Swap Requests Table
CREATE TABLE shift_swap_requests (
    id SERIAL PRIMARY KEY,
    requester_id INTEGER NOT NULL REFERENCES employees(id),
    target_employee_id INTEGER NOT NULL REFERENCES employees(id),
    requester_shift_id INTEGER NOT NULL REFERENCES schedules(id),
    target_shift_id INTEGER NOT NULL REFERENCES schedules(id),
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications Table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50), -- info, warning, error, success
    is_read BOOLEAN DEFAULT FALSE,
    link VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs Table
CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50), -- employee, attendance, payroll, etc.
    entity_id INTEGER,
    details JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- System Settings Table
CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    updated_by INTEGER REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Holidays Table
CREATE TABLE holidays (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    type VARCHAR(50), -- regular, special, local
    is_recurring BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(date)
);

-- Geofences Table (for location-based attendance)
CREATE TABLE geofences (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    center_lat DECIMAL(10,8) NOT NULL,
    center_lng DECIMAL(11,8) NOT NULL,
    radius_meters INTEGER NOT NULL,
    department_id INTEGER REFERENCES departments(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Employee Geofence Assignments
CREATE TABLE employee_geofences (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    geofence_id INTEGER NOT NULL REFERENCES geofences(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, geofence_id)
);

-- Authentication Policies Table
CREATE TABLE auth_policies (
    id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES departments(id),
    name VARCHAR(100) NOT NULL,
    required_methods JSONB NOT NULL, -- ['face', 'fingerprint', 'hybrid']
    fallback_method VARCHAR(20), -- manual, card
    grace_period_minutes INTEGER DEFAULT 5,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Anomaly Detections Table
CREATE TABLE anomaly_detections (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- duplicate_checkin, impossible_travel, cross_device, etc.
    employee_id INTEGER REFERENCES employees(id),
    attendance_record_id INTEGER REFERENCES attendance_records(id),
    severity VARCHAR(20), -- low, medium, high, critical
    description TEXT,
    status VARCHAR(20) DEFAULT 'pending', -- pending, reviewed, resolved, false_positive
    reviewed_by INTEGER REFERENCES users(id),
    reviewed_at TIMESTAMP,
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance
CREATE INDEX idx_employees_department ON employees(department_id);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_employees_employee_id ON employees(employee_id);

CREATE INDEX idx_attendance_employee_date ON attendance_records(employee_id, DATE(check_in_time));
CREATE INDEX idx_attendance_check_in_time ON attendance_records(check_in_time);
CREATE INDEX idx_attendance_method ON attendance_records(method);
CREATE INDEX idx_attendance_status ON attendance_records(status);

CREATE INDEX idx_biometric_employee_type ON biometric_templates(employee_id, template_type);
CREATE INDEX idx_biometric_hash ON biometric_templates(template_hash);
CREATE INDEX idx_biometric_active ON biometric_templates(is_active);

CREATE INDEX idx_payroll_employee_period ON payroll_records(employee_id, period_start, period_end);
CREATE INDEX idx_payroll_period ON payroll_records(payroll_period_id);
CREATE INDEX idx_payroll_status ON payroll_records(status);

CREATE INDEX idx_leave_employee_status ON leave_requests(employee_id, status);
CREATE INDEX idx_leave_dates ON leave_requests(start_date, end_date);
CREATE INDEX idx_leave_status ON leave_requests(status);

CREATE INDEX idx_schedule_employee_date ON schedules(employee_id, date);
CREATE INDEX idx_schedule_date ON schedules(date);

CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devices_updated_at BEFORE UPDATE ON devices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leave_balances_updated_at BEFORE UPDATE ON leave_balances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leave_requests_updated_at BEFORE UPDATE ON leave_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default data
INSERT INTO departments (name, code) VALUES
    ('Human Resources', 'HR'),
    ('Information Technology', 'IT'),
    ('Finance', 'FIN'),
    ('Operations', 'OPS'),
    ('Sales', 'SALES'),
    ('Marketing', 'MKTG');

INSERT INTO leave_types (name, code, max_days_per_year, is_paid, requires_approval) VALUES
    ('Vacation Leave', 'VL', 15, TRUE, TRUE),
    ('Sick Leave', 'SL', 15, TRUE, TRUE),
    ('Emergency Leave', 'EL', 5, TRUE, TRUE),
    ('Official Business', 'OB', 0, TRUE, TRUE),
    ('Maternity Leave', 'ML', 105, TRUE, TRUE),
    ('Paternity Leave', 'PL', 7, TRUE, TRUE),
    ('Bereavement Leave', 'BL', 5, TRUE, TRUE);

INSERT INTO system_settings (key, value, description) VALUES
    ('company_name', 'Think Web', 'Company name'),
    ('attendance_grace_period_minutes', '5', 'Grace period for late arrivals in minutes'),
    ('overtime_rate_multiplier', '1.25', 'Overtime pay rate multiplier'),
    ('payroll_cutoff_day', '15', 'Payroll cutoff day of month'),
    ('tax_year', '2024', 'Current tax year');
