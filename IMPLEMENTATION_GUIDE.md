# Think Web - Quick Implementation Guide
## Code Examples for Critical Components

### 1. FastAPI Backend Setup

#### main.py
```python
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import uvicorn

from app.database.connection import get_db
from app.api.v1 import auth, employees, attendance, biometrics, payroll
from app.core.security import verify_token

app = FastAPI(
    title="Think Web API",
    description="Employee Management & Payroll System with Biometrics",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(employees.router, prefix="/api/v1/employees", tags=["Employees"])
app.include_router(attendance.router, prefix="/api/v1/attendance", tags=["Attendance"])
app.include_router(biometrics.router, prefix="/api/v1/biometrics", tags=["Biometrics"])
app.include_router(payroll.router, prefix="/api/v1/payroll", tags=["Payroll"])

@app.get("/")
async def root():
    return {"message": "Think Web API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
```

#### app/database/models.py
```python
from sqlalchemy import Column, Integer, String, DateTime, Decimal, Boolean, ForeignKey, Text, LargeBinary, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Employee(Base):
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String(50), unique=True, nullable=False, index=True)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"))
    position_id = Column(Integer, ForeignKey("positions.id"))
    hire_date = Column(DateTime)
    employment_type = Column(String(50))  # permanent, contractual, part-time
    status = Column(String(50), default="active")  # active, on_leave, terminated
    salary = Column(Decimal(12, 2))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    department = relationship("Department", back_populates="employees")
    attendance_records = relationship("AttendanceRecord", back_populates="employee")
    biometric_templates = relationship("BiometricTemplate", back_populates="employee")

class BiometricTemplate(Base):
    __tablename__ = "biometric_templates"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    template_type = Column(String(20), nullable=False)  # 'face' or 'fingerprint'
    encrypted_template = Column(LargeBinary, nullable=False)  # AES-256 encrypted
    template_hash = Column(String(64), nullable=False, index=True)  # SHA-256 for duplicate detection
    device_id = Column(Integer, ForeignKey("devices.id"))
    confidence_score = Column(Decimal(5, 2))
    enrolled_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    employee = relationship("Employee", back_populates="biometric_templates")
    device = relationship("Device", back_populates="templates")

class AttendanceRecord(Base):
    __tablename__ = "attendance_records"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    check_in_time = Column(DateTime, nullable=False, index=True)
    check_out_time = Column(DateTime)
    method = Column(String(20), nullable=False)  # 'face', 'fingerprint', 'manual'
    device_id = Column(Integer, ForeignKey("devices.id"))
    location_lat = Column(Decimal(10, 8))
    location_lng = Column(Decimal(11, 8))
    confidence_score = Column(Decimal(5, 2))
    liveness_score = Column(Decimal(5, 2))
    status = Column(String(20))  # 'on_time', 'late', 'early_departure'
    minutes_late = Column(Integer, default=0)
    is_override = Column(Boolean, default=False)
    override_reason = Column(Text)
    override_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    employee = relationship("Employee", back_populates="attendance_records")
    device = relationship("Device", back_populates="attendance_records")

class PayrollRecord(Base):
    __tablename__ = "payroll_records"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    period_start = Column(DateTime, nullable=False)
    period_end = Column(DateTime, nullable=False)
    gross_pay = Column(Decimal(12, 2))
    basic_salary = Column(Decimal(12, 2))
    overtime_hours = Column(Decimal(5, 2), default=0)
    overtime_pay = Column(Decimal(12, 2), default=0)
    allowances = Column(Decimal(12, 2), default=0)
    bonuses = Column(Decimal(12, 2), default=0)
    tax = Column(Decimal(12, 2), default=0)
    sss_contribution = Column(Decimal(12, 2), default=0)
    philhealth_contribution = Column(Decimal(12, 2), default=0)
    pagibig_contribution = Column(Decimal(12, 2), default=0)
    other_deductions = Column(Decimal(12, 2), default=0)
    net_pay = Column(Decimal(12, 2))
    status = Column(String(20), default="draft")  # 'draft', 'approved', 'paid'
    generated_at = Column(DateTime, default=datetime.utcnow)
    paid_at = Column(DateTime)
    
    # Relationships
    employee = relationship("Employee")

class Department(Base):
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    code = Column(String(20), unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    employees = relationship("Employee", back_populates="department")

class Device(Base):
    __tablename__ = "devices"
    
    id = Column(Integer, primary_key=True, index=True)
    device_name = Column(String(100), nullable=False)
    device_type = Column(String(50), nullable=False)  # 'camera', 'fingerprint_scanner', 'hybrid'
    location = Column(String(255))
    ip_address = Column(String(45))
    mac_address = Column(String(17))
    status = Column(String(20), default="offline")  # 'online', 'offline', 'maintenance'
    last_seen = Column(DateTime)
    firmware_version = Column(String(50))
    registered_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    templates = relationship("BiometricTemplate", back_populates="device")
    attendance_records = relationship("AttendanceRecord", back_populates="device")
```

### 2. Face Recognition Service

#### app/core/biometrics/face_recognition.py
```python
import cv2
import numpy as np
from insightface import app as face_app, FaceAnalysis
from typing import Optional, Tuple
import base64
from io import BytesIO
from PIL import Image

class FaceRecognitionService:
    def __init__(self):
        self.model = FaceAnalysis(name='buffalo_l', providers=['CPUExecutionProvider'])
        self.model.prepare(ctx_id=0, det_size=(640, 640))
    
    def extract_embedding(self, image_bytes: bytes) -> Optional[np.ndarray]:
        """Extract face embedding from image"""
        try:
            # Convert bytes to numpy array
            nparr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            if img is None:
                return None
            
            # Detect and extract face
            faces = self.model.get(img)
            
            if len(faces) == 0:
                return None
            
            if len(faces) > 1:
                # Multiple faces detected - security concern
                return None
            
            # Return 512-dimensional embedding
            return faces[0].embedding
            
        except Exception as e:
            print(f"Error extracting face embedding: {e}")
            return None
    
    def compare_faces(self, embedding1: np.ndarray, embedding2: np.ndarray, threshold: float = 0.6) -> Tuple[bool, float]:
        """Compare two face embeddings using cosine similarity"""
        # Normalize embeddings
        embedding1 = embedding1 / np.linalg.norm(embedding1)
        embedding2 = embedding2 / np.linalg.norm(embedding2)
        
        # Calculate cosine similarity
        similarity = np.dot(embedding1, embedding2)
        
        # Return match result and confidence
        is_match = similarity >= threshold
        return is_match, float(similarity)
    
    def detect_liveness(self, image_bytes: bytes) -> Tuple[bool, float]:
        """Detect if face is live (not a photo)"""
        # Simplified liveness detection
        # In production, use more sophisticated methods
        
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        if img is None:
            return False, 0.0
        
        # Basic checks:
        # 1. Blink detection (eye aspect ratio)
        # 2. Head pose estimation
        # 3. Texture analysis
        
        # Placeholder - implement actual liveness detection
        liveness_score = 0.85  # Mock score
        
        return liveness_score > 0.7, liveness_score

# Singleton instance
face_service = FaceRecognitionService()
```

### 3. Biometric API Endpoints

#### app/api/v1/biometrics.py
```python
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
import hashlib
from cryptography.fernet import Fernet
import base64

from app.database.connection import get_db
from app.database.models import BiometricTemplate, Employee, Device
from app.core.biometrics.face_recognition import face_service
from app.core.security import get_current_user
from app.schemas.biometrics import FaceEnrollRequest, FaceVerifyRequest, BiometricTemplateResponse

router = APIRouter()

# Encryption key (store in environment variable in production)
ENCRYPTION_KEY = Fernet.generate_key()  # Use env variable
cipher = Fernet(ENCRYPTION_KEY)

@router.post("/face/enroll")
async def enroll_face(
    employee_id: int,
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Enroll employee face for biometric authentication"""
    
    # Verify employee exists
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Read image bytes
    image_bytes = await image.read()
    
    # Extract face embedding
    embedding = face_service.extract_embedding(image_bytes)
    if embedding is None:
        raise HTTPException(status_code=400, detail="No face detected or multiple faces detected")
    
    # Check liveness
    is_live, liveness_score = face_service.detect_liveness(image_bytes)
    if not is_live:
        raise HTTPException(status_code=400, detail="Liveness check failed")
    
    # Convert embedding to bytes
    embedding_bytes = embedding.tobytes()
    
    # Encrypt template
    encrypted_template = cipher.encrypt(embedding_bytes)
    
    # Generate hash for duplicate detection
    template_hash = hashlib.sha256(embedding_bytes).hexdigest()
    
    # Check for duplicates
    existing = db.query(BiometricTemplate).filter(
        BiometricTemplate.template_hash == template_hash,
        BiometricTemplate.employee_id != employee_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Duplicate biometric template detected")
    
    # Deactivate old templates
    db.query(BiometricTemplate).filter(
        BiometricTemplate.employee_id == employee_id,
        BiometricTemplate.template_type == "face"
    ).update({"is_active": False})
    
    # Create new template
    template = BiometricTemplate(
        employee_id=employee_id,
        template_type="face",
        encrypted_template=encrypted_template,
        template_hash=template_hash,
        confidence_score=liveness_score,
        is_active=True
    )
    
    db.add(template)
    db.commit()
    db.refresh(template)
    
    return {
        "message": "Face enrolled successfully",
        "template_id": template.id,
        "liveness_score": float(liveness_score)
    }

@router.post("/face/verify")
async def verify_face(
    employee_id: int,
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Verify employee identity using face recognition"""
    
    # Get employee's enrolled templates
    templates = db.query(BiometricTemplate).filter(
        BiometricTemplate.employee_id == employee_id,
        BiometricTemplate.template_type == "face",
        BiometricTemplate.is_active == True
    ).all()
    
    if not templates:
        raise HTTPException(status_code=404, detail="No face template enrolled for this employee")
    
    # Read image bytes
    image_bytes = await image.read()
    
    # Extract face embedding from input
    input_embedding = face_service.extract_embedding(image_bytes)
    if input_embedding is None:
        raise HTTPException(status_code=400, detail="No face detected")
    
    # Check liveness
    is_live, liveness_score = face_service.detect_liveness(image_bytes)
    if not is_live:
        raise HTTPException(status_code=400, detail="Liveness check failed")
    
    # Compare with stored templates
    best_match = None
    best_score = 0.0
    
    for template in templates:
        # Decrypt template
        decrypted_bytes = cipher.decrypt(template.encrypted_template)
        stored_embedding = np.frombuffer(decrypted_bytes, dtype=np.float32)
        
        # Compare
        is_match, similarity = face_service.compare_faces(input_embedding, stored_embedding)
        
        if similarity > best_score:
            best_score = similarity
            best_match = is_match
    
    if not best_match or best_score < 0.6:
        raise HTTPException(status_code=401, detail="Face verification failed")
    
    return {
        "verified": True,
        "confidence": float(best_score),
        "liveness_score": float(liveness_score)
    }

@router.get("/{employee_id}/templates")
async def get_templates(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get all biometric templates for an employee"""
    
    templates = db.query(BiometricTemplate).filter(
        BiometricTemplate.employee_id == employee_id
    ).all()
    
    return [
        {
            "id": t.id,
            "template_type": t.template_type,
            "enrolled_at": t.enrolled_at,
            "is_active": t.is_active,
            "confidence_score": float(t.confidence_score) if t.confidence_score else None
        }
        for t in templates
    ]

@router.delete("/templates/{template_id}")
async def delete_template(
    template_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Delete a biometric template"""
    
    template = db.query(BiometricTemplate).filter(
        BiometricTemplate.id == template_id
    ).first()
    
    if not template:
        raise HTTPException(status_code=404, detail="Template not found")
    
    db.delete(template)
    db.commit()
    
    return {"message": "Template deleted successfully"}
```

### 4. Attendance API

#### app/api/v1/attendance.py
```python
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from datetime import datetime, date
from typing import List, Optional

from app.database.connection import get_db
from app.database.models import AttendanceRecord, Employee, Schedule
from app.core.security import get_current_user
from app.schemas.attendance import AttendanceCheckIn, AttendanceCheckOut, AttendanceResponse

router = APIRouter()

@router.post("/check-in")
async def check_in(
    employee_id: int,
    image: Optional[UploadFile] = File(None),
    method: str = "face",  # 'face', 'fingerprint', 'manual'
    device_id: Optional[int] = None,
    location_lat: Optional[float] = None,
    location_lng: Optional[float] = None,
    db: Session = Depends(get_db)
):
    """Record employee check-in"""
    
    # Verify employee exists
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Check if already checked in today
    today = date.today()
    existing = db.query(AttendanceRecord).filter(
        AttendanceRecord.employee_id == employee_id,
        AttendanceRecord.check_in_time >= datetime.combine(today, datetime.min.time()),
        AttendanceRecord.check_out_time.is_(None)
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Already checked in today")
    
    # Verify biometric if method is face or fingerprint
    confidence_score = None
    liveness_score = None
    
    if method == "face" and image:
        from app.api.v1.biometrics import verify_face
        # Verify face (simplified - in production, call the service directly)
        # verification_result = await verify_face(employee_id, image, db)
        # confidence_score = verification_result["confidence"]
        # liveness_score = verification_result["liveness_score"]
        confidence_score = 0.95  # Mock
        liveness_score = 0.90  # Mock
    
    # Get today's schedule
    schedule = db.query(Schedule).filter(
        Schedule.employee_id == employee_id,
        Schedule.date == today
    ).first()
    
    # Determine status (on_time, late)
    check_in_time = datetime.now()
    status = "on_time"
    minutes_late = 0
    
    if schedule:
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
    
    return {
        "message": "Checked in successfully",
        "attendance_id": attendance.id,
        "check_in_time": attendance.check_in_time,
        "status": attendance.status,
        "minutes_late": attendance.minutes_late
    }

@router.post("/check-out")
async def check_out(
    employee_id: int,
    attendance_id: Optional[int] = None,
    image: Optional[UploadFile] = File(None),
    method: str = "face",
    db: Session = Depends(get_db)
):
    """Record employee check-out"""
    
    # Find attendance record
    if attendance_id:
        attendance = db.query(AttendanceRecord).filter(
            AttendanceRecord.id == attendance_id,
            AttendanceRecord.employee_id == employee_id
        ).first()
    else:
        # Find today's check-in
        today = date.today()
        attendance = db.query(AttendanceRecord).filter(
            AttendanceRecord.employee_id == employee_id,
            AttendanceRecord.check_in_time >= datetime.combine(today, datetime.min.time()),
            AttendanceRecord.check_out_time.is_(None)
        ).first()
    
    if not attendance:
        raise HTTPException(status_code=404, detail="No active check-in found")
    
    # Verify biometric if needed
    if method == "face" and image:
        # Verify face
        confidence_score = 0.95  # Mock
        liveness_score = 0.90  # Mock
    
    # Update attendance record
    attendance.check_out_time = datetime.now()
    db.commit()
    db.refresh(attendance)
    
    # Calculate work duration
    duration = attendance.check_out_time - attendance.check_in_time
    hours_worked = duration.total_seconds() / 3600
    
    return {
        "message": "Checked out successfully",
        "attendance_id": attendance.id,
        "check_out_time": attendance.check_out_time,
        "hours_worked": round(hours_worked, 2)
    }

@router.get("/")
async def get_attendance(
    employee_id: Optional[int] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get attendance records"""
    
    query = db.query(AttendanceRecord)
    
    if employee_id:
        query = query.filter(AttendanceRecord.employee_id == employee_id)
    
    if start_date:
        query = query.filter(AttendanceRecord.check_in_time >= datetime.combine(start_date, datetime.min.time()))
    
    if end_date:
        query = query.filter(AttendanceRecord.check_in_time <= datetime.combine(end_date, datetime.max.time()))
    
    records = query.order_by(AttendanceRecord.check_in_time.desc()).limit(limit).all()
    
    return [
        {
            "id": r.id,
            "employee_id": r.employee_id,
            "check_in_time": r.check_in_time,
            "check_out_time": r.check_out_time,
            "method": r.method,
            "status": r.status,
            "minutes_late": r.minutes_late
        }
        for r in records
    ]
```

### 5. React Component Example

#### src/components/employee/AttendanceCheckIn.tsx
```typescript
import React, { useRef, useState } from 'react';
import { useCamera } from '../../hooks/useCamera';
import { attendanceService } from '../../services/attendance.service';
import { biometricsService } from '../../services/biometrics.service';

export const AttendanceCheckIn: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [checkingIn, setCheckingIn] = useState(false);
  const [status, setStatus] = useState<string>('');
  const { startCamera, stopCamera, captureFrame } = useCamera(videoRef);

  const handleCheckIn = async () => {
    setCheckingIn(true);
    setStatus('Capturing face...');

    try {
      // Capture frame from video
      const imageBlob = await captureFrame(canvasRef.current!);
      
      setStatus('Verifying identity...');
      
      // Verify face
      const verification = await biometricsService.verifyFace(
        currentEmployeeId,
        imageBlob
      );

      if (!verification.verified) {
        setStatus('Verification failed. Please try again.');
        setCheckingIn(false);
        return;
      }

      setStatus('Recording attendance...');
      
      // Create FormData
      const formData = new FormData();
      formData.append('image', imageBlob, 'face.jpg');
      formData.append('method', 'face');
      
      // Get geolocation
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      formData.append('location_lat', position.coords.latitude.toString());
      formData.append('location_lng', position.coords.longitude.toString());

      // Check in
      const result = await attendanceService.checkIn(
        currentEmployeeId,
        formData
      );

      setStatus(`Checked in successfully! ${result.status === 'late' ? `(${result.minutes_late} minutes late)` : ''}`);
      
      // Stop camera after successful check-in
      stopCamera();
      
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setCheckingIn(false);
    }
  };

  React.useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4 p-6">
      <div className="relative w-full max-w-md">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full rounded-lg"
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <button
        onClick={handleCheckIn}
        disabled={checkingIn}
        className={`
          px-6 py-3 rounded-lg font-semibold
          bg-gradient-to-r from-teal-500 to-teal-600
          text-white shadow-lg
          disabled:opacity-50 disabled:cursor-not-allowed
          hover:from-teal-600 hover:to-teal-700
          transition-all
        `}
      >
        {checkingIn ? 'Processing...' : 'Check In'}
      </button>

      {status && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {status}
        </p>
      )}
    </div>
  );
};
```

### 6. React Hook for Camera

#### src/hooks/useCamera.ts
```typescript
import { useRef, useCallback } from 'react';

export const useCamera = (
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef?: React.RefObject<HTMLCanvasElement>
) => {
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      throw error;
    }
  }, [videoRef]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [videoRef]);

  const captureFrame = useCallback(async (
    canvas: HTMLCanvasElement
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!videoRef.current || !canvas) {
        reject(new Error('Video or canvas not available'));
        return;
      }

      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to capture frame'));
        }
      }, 'image/jpeg', 0.95);
    });
  }, [videoRef]);

  return {
    startCamera,
    stopCamera,
    captureFrame
  };
};
```

### 7. API Service Layer

#### src/services/attendance.service.ts
```typescript
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/attendance`,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Add auth token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const attendanceService = {
  async checkIn(employeeId: number, formData: FormData) {
    const response = await api.post(`/check-in?employee_id=${employeeId}`, formData);
    return response.data;
  },

  async checkOut(employeeId: number, attendanceId?: number, formData?: FormData) {
    const params = new URLSearchParams();
    params.append('employee_id', employeeId.toString());
    if (attendanceId) {
      params.append('attendance_id', attendanceId.toString());
    }
    
    const response = await api.post(`/check-out?${params.toString()}`, formData);
    return response.data;
  },

  async getAttendance(employeeId?: number, startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (employeeId) params.append('employee_id', employeeId.toString());
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const response = await api.get(`/?${params.toString()}`);
    return response.data;
  },
};
```

---

## Quick Setup Commands

### Backend Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-multipart
pip install insightface opencv-python pillow
pip install cryptography python-jose[cryptography] passlib[bcrypt]
pip install python-dotenv

# Run migrations
alembic init migrations
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head

# Run server
uvicorn app.main:app --reload
```

### Frontend Setup
```bash
# Create React app with TypeScript
npx create-react-app frontend --template typescript
cd frontend

# Install dependencies
npm install axios react-query zustand
npm install -D tailwindcss postcss autoprefixer
npm install @headlessui/react @heroicons/react
npm install chart.js react-chartjs-2

# Initialize Tailwind
npx tailwindcss init -p

# Run dev server
npm start
```

---

This guide provides the foundation for implementing Think Web. Start with the backend setup, then move to biometric integration, and finally connect the React frontend.













