from typing import Dict, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from app.core.database import get_database
from app.models.resume import Resume
from app.models.job_analysis import JobAnalysis
from app.models.user import User
from app.api.auth import get_current_user
from app.services.gap_analyzer import GapAnalyzerService, GapAnalysisResult

router = APIRouter()

class GapAnalysisRequest(BaseModel):
    resume_id: int
    job_analysis_id: int

class GapAnalysisResponse(BaseModel):
    resume_id: int
    job_analysis_id: int
    overall_match_score: float
    matching_skills: List[str]
    missing_required_skills: List[str]
    missing_preferred_skills: List[str]
    experience_gap: int | None = None
    experience_level_match: bool
    matching_technologies: List[str]
    missing_technologies: List[str]
    matching_languages: List[str]
    missing_languages: List[str]
    matching_frameworks: List[str]
    missing_frameworks: List[str]
    matching_databases: List[str]
    missing_databases: List[str]
    matching_cloud_platforms: List[str]
    missing_cloud_platforms: List[str]
    recommendations: List[str]
    improvement_priority: List[Dict]

@router.post("/analyze", response_model=GapAnalysisResponse)
async def analyze_gap(
    request: GapAnalysisRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_database)
):
    """Analyze gaps between a resume and job requirements"""
    
    # Get resume
    resume_result = await db.execute(
        select(Resume).where(
            Resume.id == request.resume_id,
            Resume.user_id == current_user.id
        )
    )
    resume = resume_result.scalar_one_or_none()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    if not resume.is_processed:
        raise HTTPException(status_code=400, detail="Resume is not yet processed")
    
    # Get job analysis
    job_result = await db.execute(
        select(JobAnalysis).where(
            JobAnalysis.id == request.job_analysis_id,
            JobAnalysis.user_id == current_user.id
        )
    )
    job_analysis = job_result.scalar_one_or_none()
    
    if not job_analysis:
        raise HTTPException(status_code=404, detail="Job analysis not found")
    
    if not job_analysis.is_processed:
        raise HTTPException(status_code=400, detail="Job analysis is not yet processed")
    
    # Perform gap analysis
    analyzer = GapAnalyzerService()
    
    try:
        resume_data = {
            'parsed_data': resume.parsed_data,
            'raw_text': resume.raw_text
        }
        
        gap_result = analyzer.analyze_gap(resume_data, job_analysis.extracted_requirements)
        
        return GapAnalysisResponse(
            resume_id=request.resume_id,
            job_analysis_id=request.job_analysis_id,
            overall_match_score=gap_result.overall_match_score,
            matching_skills=gap_result.matching_skills,
            missing_required_skills=gap_result.missing_required_skills,
            missing_preferred_skills=gap_result.missing_preferred_skills,
            experience_gap=gap_result.experience_gap,
            experience_level_match=gap_result.experience_level_match,
            matching_technologies=gap_result.matching_technologies,
            missing_technologies=gap_result.missing_technologies,
            matching_languages=gap_result.matching_languages,
            missing_languages=gap_result.missing_languages,
            matching_frameworks=gap_result.matching_frameworks,
            missing_frameworks=gap_result.missing_frameworks,
            matching_databases=gap_result.matching_databases,
            missing_databases=gap_result.missing_databases,
            matching_cloud_platforms=gap_result.matching_cloud_platforms,
            missing_cloud_platforms=gap_result.missing_cloud_platforms,
            recommendations=gap_result.recommendations,
            improvement_priority=gap_result.improvement_priority
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Error performing gap analysis: {str(e)}"
        )

@router.get("/resume/{resume_id}/jobs", response_model=List[Dict])
async def get_compatible_jobs(
    resume_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_database)
):
    """Get job analyses that are compatible for gap analysis with a specific resume"""
    
    # Verify resume exists and belongs to user
    resume_result = await db.execute(
        select(Resume).where(
            Resume.id == resume_id,
            Resume.user_id == current_user.id
        )
    )
    resume = resume_result.scalar_one_or_none()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    # Get all processed job analyses for the user
    job_result = await db.execute(
        select(JobAnalysis).where(
            JobAnalysis.user_id == current_user.id,
            JobAnalysis.is_processed == True
        ).order_by(JobAnalysis.created_at.desc())
    )
    job_analyses = job_result.scalars().all()
    
    # Return basic info for selection
    return [
        {
            'id': job.id,
            'job_title': job.job_title,
            'company_name': job.company_name,
            'confidence_score': job.confidence_score,
            'created_at': job.created_at.isoformat()
        }
        for job in job_analyses
    ]

@router.get("/quick-match/{resume_id}/{job_analysis_id}")
async def get_quick_match_score(
    resume_id: int,
    job_analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_database)
):
    """Get a quick match score without full gap analysis"""
    
    # Get resume and job analysis
    resume_result = await db.execute(
        select(Resume).where(
            Resume.id == resume_id,
            Resume.user_id == current_user.id
        )
    )
    resume = resume_result.scalar_one_or_none()
    
    job_result = await db.execute(
        select(JobAnalysis).where(
            JobAnalysis.id == job_analysis_id,
            JobAnalysis.user_id == current_user.id
        )
    )
    job_analysis = job_result.scalar_one_or_none()
    
    if not resume or not job_analysis:
        raise HTTPException(status_code=404, detail="Resume or job analysis not found")
    
    # Quick analysis
    analyzer = GapAnalyzerService()
    
    try:
        resume_data = {
            'parsed_data': resume.parsed_data,
            'raw_text': resume.raw_text
        }
        
        gap_result = analyzer.analyze_gap(resume_data, job_analysis.extracted_requirements)
        
        return {
            'match_score': gap_result.overall_match_score,
            'matching_skills_count': len(gap_result.matching_skills),
            'missing_required_count': len(gap_result.missing_required_skills),
            'experience_level_match': gap_result.experience_level_match,
            'summary': f"{gap_result.overall_match_score:.1%} match - {len(gap_result.missing_required_skills)} critical gaps"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error calculating match score: {str(e)}"
        )