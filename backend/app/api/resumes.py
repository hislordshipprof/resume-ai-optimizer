import os
import tempfile
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from app.core.database import get_database
from app.models.resume import Resume, ResumeSection
from app.models.user import User
from app.api.auth import get_current_user
from app.services.resume_parser import ResumeParserService, ParsedResumeData

router = APIRouter()

class ResumeResponse(BaseModel):
    id: int
    filename: str
    file_type: str
    file_size: int
    is_processed: bool
    full_name: str | None = None
    email: str | None = None
    phone: str | None = None
    linkedin_url: str | None = None
    processing_error: str | None = None

class ResumeDetailResponse(ResumeResponse):
    raw_text: str | None = None
    parsed_data: dict | None = None

@router.post("/upload", response_model=ResumeResponse)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_database)
):
    """Upload and parse a resume file"""
    
    # Validate file
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    # Check file extension
    allowed_extensions = {'.pdf', '.docx', '.txt'}
    file_extension = os.path.splitext(file.filename)[1].lower()
    if file_extension not in allowed_extensions:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file type. Allowed: {', '.join(allowed_extensions)}"
        )
    
    # Read file content
    try:
        file_content = await file.read()
        file_size = len(file_content)
        
        # Check file size (10MB limit)
        max_size = 10 * 1024 * 1024
        if file_size > max_size:
            raise HTTPException(
                status_code=400, 
                detail=f"File too large. Maximum size: {max_size / (1024*1024):.1f}MB"
            )
        
        # Save file temporarily for processing
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_extension) as tmp_file:
            tmp_file.write(file_content)
            tmp_file_path = tmp_file.name
        
        # Create resume record
        resume = Resume(
            user_id=current_user.id,
            filename=file.filename,
            file_type=file_extension[1:],  # Remove the dot
            file_size=file_size,
            is_processed=False
        )
        
        db.add(resume)
        await db.commit()
        await db.refresh(resume)
        
        # Parse resume in background
        parser = ResumeParserService()
        try:
            parsed_data = parser.parse_resume(tmp_file_path, file_size)
            
            # Update resume with parsed data
            resume.raw_text = parser.extract_text(tmp_file_path)
            resume.parsed_data = parsed_data.model_dump()
            resume.full_name = parsed_data.personal_info.get("name")
            resume.email = parsed_data.personal_info.get("email")
            resume.phone = parsed_data.personal_info.get("phone")
            resume.linkedin_url = parsed_data.personal_info.get("linkedin")
            resume.is_processed = True
            
            # Create resume sections
            section_types = ["experience", "education", "skills", "projects", "certifications"]
            for i, section_type in enumerate(section_types):
                section_data = getattr(parsed_data, section_type, [])
                if section_data:
                    section = ResumeSection(
                        resume_id=resume.id,
                        section_type=section_type,
                        section_title=section_type.title(),
                        content=str(section_data),
                        parsed_data=section_data if isinstance(section_data, (list, dict)) else [],
                        order_index=i
                    )
                    db.add(section)
            
            await db.commit()
            await db.refresh(resume)
            
        except Exception as e:
            # Update resume with error
            resume.processing_error = str(e)
            resume.is_processed = True
            await db.commit()
            await db.refresh(resume)
        
        finally:
            # Clean up temporary file
            try:
                os.unlink(tmp_file_path)
                parser.cleanup()
            except Exception:
                pass
        
        return ResumeResponse(
            id=resume.id,
            filename=resume.filename,
            file_type=resume.file_type,
            file_size=resume.file_size,
            is_processed=resume.is_processed,
            full_name=resume.full_name,
            email=resume.email,
            phone=resume.phone,
            linkedin_url=resume.linkedin_url,
            processing_error=resume.processing_error
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@router.get("/", response_model=List[ResumeResponse])
async def get_user_resumes(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_database)
):
    """Get all resumes for the current user"""
    
    result = await db.execute(
        select(Resume).where(Resume.user_id == current_user.id).order_by(Resume.created_at.desc())
    )
    resumes = result.scalars().all()
    
    return [
        ResumeResponse(
            id=resume.id,
            filename=resume.filename,
            file_type=resume.file_type,
            file_size=resume.file_size,
            is_processed=resume.is_processed,
            full_name=resume.full_name,
            email=resume.email,
            phone=resume.phone,
            linkedin_url=resume.linkedin_url,
            processing_error=resume.processing_error
        )
        for resume in resumes
    ]

@router.get("/{resume_id}", response_model=ResumeDetailResponse)
async def get_resume_detail(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_database)
):
    """Get detailed resume information"""
    
    result = await db.execute(
        select(Resume).where(
            Resume.id == resume_id,
            Resume.user_id == current_user.id
        )
    )
    resume = result.scalar_one_or_none()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    return ResumeDetailResponse(
        id=resume.id,
        filename=resume.filename,
        file_type=resume.file_type,
        file_size=resume.file_size,
        is_processed=resume.is_processed,
        full_name=resume.full_name,
        email=resume.email,
        phone=resume.phone,
        linkedin_url=resume.linkedin_url,
        processing_error=resume.processing_error,
        raw_text=resume.raw_text,
        parsed_data=resume.parsed_data
    )

@router.delete("/{resume_id}")
async def delete_resume(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_database)
):
    """Delete a resume"""
    
    result = await db.execute(
        select(Resume).where(
            Resume.id == resume_id,
            Resume.user_id == current_user.id
        )
    )
    resume = result.scalar_one_or_none()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    await db.delete(resume)
    await db.commit()
    
    return {"message": "Resume deleted successfully"}