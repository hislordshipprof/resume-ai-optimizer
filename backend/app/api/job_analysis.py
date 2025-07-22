from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from app.core.database import get_database
from app.models.job_analysis import JobAnalysis
from app.models.user import User
from app.api.auth import get_current_user
from app.services.job_analyzer import JobAnalyzerService, JobRequirements

router = APIRouter()

class JobAnalysisRequest(BaseModel):
    job_title: str | None = None
    company_name: str | None = None
    job_description: str

class JobAnalysisResponse(BaseModel):
    id: int
    job_title: str | None = None
    company_name: str | None = None
    is_processed: bool
    confidence_score: float | None = None
    processing_error: str | None = None
    extracted_requirements: dict | None = None

@router.post("/analyze", response_model=JobAnalysisResponse)
async def analyze_job_description(
    request: JobAnalysisRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_database)
):
    """Analyze a job description and extract requirements"""
    
    if not request.job_description or not request.job_description.strip():
        raise HTTPException(
            status_code=400, 
            detail="Job description cannot be empty"
        )
    
    # Create job analysis record
    job_analysis = JobAnalysis(
        user_id=current_user.id,
        job_title=request.job_title,
        company_name=request.company_name,
        job_description=request.job_description,
        is_processed=False
    )
    
    db.add(job_analysis)
    await db.commit()
    await db.refresh(job_analysis)
    
    # Analyze job description
    analyzer = JobAnalyzerService()
    try:
        requirements = analyzer.analyze_job_description(request.job_description)
        confidence_score = analyzer.get_confidence_score(requirements)
        
        # Update job analysis with results
        job_analysis.extracted_requirements = requirements.model_dump()
        job_analysis.confidence_score = confidence_score
        job_analysis.is_processed = True
        
        await db.commit()
        await db.refresh(job_analysis)
        
    except Exception as e:
        # Update job analysis with error
        job_analysis.processing_error = str(e)
        job_analysis.is_processed = True
        await db.commit()
        await db.refresh(job_analysis)
    
    return JobAnalysisResponse(
        id=job_analysis.id,
        job_title=job_analysis.job_title,
        company_name=job_analysis.company_name,
        is_processed=job_analysis.is_processed,
        confidence_score=job_analysis.confidence_score,
        processing_error=job_analysis.processing_error,
        extracted_requirements=job_analysis.extracted_requirements
    )

@router.get("/", response_model=List[JobAnalysisResponse])
async def get_user_job_analyses(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_database)
):
    """Get all job analyses for the current user"""
    
    result = await db.execute(
        select(JobAnalysis).where(
            JobAnalysis.user_id == current_user.id
        ).order_by(JobAnalysis.created_at.desc())
    )
    job_analyses = result.scalars().all()
    
    return [
        JobAnalysisResponse(
            id=analysis.id,
            job_title=analysis.job_title,
            company_name=analysis.company_name,
            is_processed=analysis.is_processed,
            confidence_score=analysis.confidence_score,
            processing_error=analysis.processing_error,
            extracted_requirements=analysis.extracted_requirements
        )
        for analysis in job_analyses
    ]

@router.get("/{analysis_id}", response_model=JobAnalysisResponse)
async def get_job_analysis_detail(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_database)
):
    """Get detailed job analysis information"""
    
    result = await db.execute(
        select(JobAnalysis).where(
            JobAnalysis.id == analysis_id,
            JobAnalysis.user_id == current_user.id
        )
    )
    analysis = result.scalar_one_or_none()
    
    if not analysis:
        raise HTTPException(status_code=404, detail="Job analysis not found")
    
    return JobAnalysisResponse(
        id=analysis.id,
        job_title=analysis.job_title,
        company_name=analysis.company_name,
        is_processed=analysis.is_processed,
        confidence_score=analysis.confidence_score,
        processing_error=analysis.processing_error,
        extracted_requirements=analysis.extracted_requirements
    )

@router.delete("/{analysis_id}")
async def delete_job_analysis(
    analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_database)
):
    """Delete a job analysis"""
    
    result = await db.execute(
        select(JobAnalysis).where(
            JobAnalysis.id == analysis_id,
            JobAnalysis.user_id == current_user.id
        )
    )
    analysis = result.scalar_one_or_none()
    
    if not analysis:
        raise HTTPException(status_code=404, detail="Job analysis not found")
    
    await db.delete(analysis)
    await db.commit()
    
    return {"message": "Job analysis deleted successfully"}