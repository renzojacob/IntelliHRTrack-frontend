"""
Biometric endpoints (Face Recognition & Fingerprint)
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
import hashlib
from cryptography.fernet import Fernet
import numpy as np

from app.database.connection import get_db
from app.database.models import BiometricTemplate, Employee, Device, User
from app.core.security import get_current_user, require_role
from app.core.config import settings

router = APIRouter()

# Initialize encryption (in production, load from secure key management)
try:
    cipher = Fernet(settings.BIOMETRIC_ENCRYPTION_KEY.encode()[:44].ljust(44, b'0'))
except:
    # Generate key if not set (for development only)
    key = Fernet.generate_key()
    cipher = Fernet(key)

class BiometricEnrollResponse(BaseModel):
    message: str
    template_id: int
    liveness_score: Optional[float] = None

class BiometricVerifyResponse(BaseModel):
    verified: bool
    confidence: float
    liveness_score: Optional[float] = None

class BiometricTemplateResponse(BaseModel):
    id: int
    template_type: str
    enrolled_at: str
    is_active: bool
    confidence_score: Optional[float] = None

@router.post("/face/enroll", response_model=BiometricEnrollResponse)
async def enroll_face(
    employee_id: int = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["super_admin", "hr_admin"]))
):
    """Enroll employee face for biometric authentication"""
    # Verify employee exists
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    # Read image bytes
    image_bytes = await image.read()
    
    # TODO: Extract face embedding using face recognition service
    # For now, we'll create a mock embedding
    # In production, use: embedding = face_service.extract_embedding(image_bytes)
    embedding = np.random.rand(512).astype(np.float32)  # Mock embedding
    
    if embedding is None:
        raise HTTPException(status_code=400, detail="No face detected or multiple faces detected")
    
    # TODO: Check liveness
    # is_live, liveness_score = face_service.detect_liveness(image_bytes)
    liveness_score = 0.90  # Mock
    is_live = True  # Mock
    
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

@router.post("/face/verify", response_model=BiometricVerifyResponse)
async def verify_face(
    employee_id: int = Form(...),
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
    
    # TODO: Extract face embedding from input
    # input_embedding = face_service.extract_embedding(image_bytes)
    input_embedding = np.random.rand(512).astype(np.float32)  # Mock
    
    if input_embedding is None:
        raise HTTPException(status_code=400, detail="No face detected")
    
    # TODO: Check liveness
    liveness_score = 0.90  # Mock
    is_live = True  # Mock
    
    if not is_live:
        raise HTTPException(status_code=400, detail="Liveness check failed")
    
    # Compare with stored templates
    best_match = False
    best_score = 0.0
    
    for template in templates:
        # Decrypt template
        decrypted_bytes = cipher.decrypt(template.encrypted_template)
        stored_embedding = np.frombuffer(decrypted_bytes, dtype=np.float32)
        
        # TODO: Compare embeddings using cosine similarity
        # For now, mock comparison
        similarity = 0.85  # Mock similarity score
        
        if similarity > best_score:
            best_score = similarity
            best_match = similarity >= settings.FACE_MATCH_THRESHOLD
    
    if not best_match or best_score < settings.FACE_MATCH_THRESHOLD:
        raise HTTPException(status_code=401, detail="Face verification failed")
    
    return {
        "verified": True,
        "confidence": float(best_score),
        "liveness_score": float(liveness_score)
    }

@router.get("/{employee_id}/templates", response_model=List[BiometricTemplateResponse])
async def get_templates(
    employee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all biometric templates for an employee"""
    templates = db.query(BiometricTemplate).filter(
        BiometricTemplate.employee_id == employee_id
    ).all()
    
    return [
        {
            "id": t.id,
            "template_type": t.template_type,
            "enrolled_at": t.enrolled_at.isoformat(),
            "is_active": t.is_active,
            "confidence_score": float(t.confidence_score) if t.confidence_score else None
        }
        for t in templates
    ]

@router.delete("/templates/{template_id}")
async def delete_template(
    template_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["super_admin", "hr_admin"]))
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





