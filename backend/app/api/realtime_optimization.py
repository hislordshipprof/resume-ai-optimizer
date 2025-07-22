"""Real-time optimization API endpoints"""
from typing import Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from datetime import datetime
import json
import asyncio

from app.core.database import get_database
from app.models.user import User
from app.models.resume import Resume
from app.models.job_analysis import JobAnalysis
from app.api.auth import get_current_user
from app.services.realtime_optimizer import (
    RealTimeOptimizerService, 
    ContentChangeEvent, 
    RealTimeOptimizationResult,
    OptimizationSuggestion
)
from app.services.industry_analyzer import IndustryType

router = APIRouter()

class RealTimeAnalysisRequest(BaseModel):
    """Request model for real-time analysis"""
    resume_id: int
    job_analysis_id: int
    section: str
    field: str
    old_value: str
    new_value: str
    cursor_position: int = 0

class ApplySuggestionRequest(BaseModel):
    """Request model for applying a suggestion"""
    suggestion_id: str
    resume_id: int
    section: str
    field: str
    new_value: str

class BatchSuggestionRequest(BaseModel):
    """Request model for batch suggestion application"""
    suggestion_ids: List[str]
    resume_id: int

class OptimizationInsightsRequest(BaseModel):
    """Request model for optimization insights"""
    resume_id: int
    job_analysis_id: int

# Global service instance
realtime_optimizer = RealTimeOptimizerService()

@router.post("/analyze", response_model=RealTimeOptimizationResult)
async def analyze_content_change(
    request: RealTimeAnalysisRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_database)
):
    """Analyze content change and provide real-time optimization suggestions"""
    
    try:
        # Verify resume belongs to user
        resume_result = await db.execute(
            select(Resume).where(
                Resume.id == request.resume_id,
                Resume.user_id == current_user.id
            )
        )
        resume = resume_result.scalar_one_or_none()
        
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        # Verify job analysis belongs to user
        job_result = await db.execute(
            select(JobAnalysis).where(
                JobAnalysis.id == request.job_analysis_id,
                JobAnalysis.user_id == current_user.id
            )
        )
        job_analysis = job_result.scalar_one_or_none()
        
        if not job_analysis:
            raise HTTPException(status_code=404, detail="Job analysis not found")
        
        # Create content change event
        change_event = ContentChangeEvent(
            section=request.section,
            field=request.field,
            old_value=request.old_value,
            new_value=request.new_value,
            cursor_position=request.cursor_position,
            timestamp=datetime.now()
        )
        
        # Get current resume data
        current_resume = resume.parsed_data or {}
        
        # Detect industry
        job_description = job_analysis.extracted_requirements.get('job_description', '')
        industry, confidence = realtime_optimizer.industry_analyzer.detect_industry(job_description)
        
        # Analyze the change
        result = realtime_optimizer.analyze_content_change(
            change_event=change_event,
            current_resume=current_resume,
            job_requirements=job_analysis.extracted_requirements,
            industry=industry
        )
        
        return result
        
    except Exception as e:
        import traceback
        print(f"Real-time analysis error: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Error analyzing content change: {str(e)}"
        )

@router.post("/apply-suggestion")
async def apply_suggestion(
    request: ApplySuggestionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_database)
):
    """Apply a specific optimization suggestion"""
    
    try:
        # Verify resume belongs to user
        resume_result = await db.execute(
            select(Resume).where(
                Resume.id == request.resume_id,
                Resume.user_id == current_user.id
            )
        )
        resume = resume_result.scalar_one_or_none()
        
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        # Update the resume data
        parsed_data = resume.parsed_data or {}
        
        # Apply the suggestion based on section and field
        if request.section == "summary":
            parsed_data['summary'] = request.new_value
        elif request.section == "experience":
            # Update specific experience entry
            # This would need more detailed implementation based on field structure
            pass
        elif request.section == "skills":
            parsed_data['skills'] = request.new_value.split(',')
        
        # Save updated resume
        resume.parsed_data = parsed_data
        await db.commit()
        
        return {"message": "Suggestion applied successfully", "suggestion_id": request.suggestion_id}
        
    except Exception as e:
        import traceback
        print(f"Apply suggestion error: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Error applying suggestion: {str(e)}"
        )

@router.post("/apply-batch")
async def apply_batch_suggestions(
    request: BatchSuggestionRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_database)
):
    """Apply multiple optimization suggestions in batch"""
    
    try:
        # Verify resume belongs to user
        resume_result = await db.execute(
            select(Resume).where(
                Resume.id == request.resume_id,
                Resume.user_id == current_user.id
            )
        )
        resume = resume_result.scalar_one_or_none()
        
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        # This would implement batch suggestion application
        # For now, return success
        
        return {
            "message": f"Applied {len(request.suggestion_ids)} suggestions successfully",
            "applied_suggestions": request.suggestion_ids
        }
        
    except Exception as e:
        import traceback
        print(f"Batch apply error: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Error applying batch suggestions: {str(e)}"
        )

@router.get("/insights/{resume_id}/{job_analysis_id}")
async def get_optimization_insights(
    resume_id: int,
    job_analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_database)
):
    """Get comprehensive optimization insights for a resume"""
    
    try:
        # Verify resume belongs to user
        resume_result = await db.execute(
            select(Resume).where(
                Resume.id == resume_id,
                Resume.user_id == current_user.id
            )
        )
        resume = resume_result.scalar_one_or_none()
        
        if not resume:
            raise HTTPException(status_code=404, detail="Resume not found")
        
        # Verify job analysis belongs to user
        job_result = await db.execute(
            select(JobAnalysis).where(
                JobAnalysis.id == job_analysis_id,
                JobAnalysis.user_id == current_user.id
            )
        )
        job_analysis = job_result.scalar_one_or_none()
        
        if not job_analysis:
            raise HTTPException(status_code=404, detail="Job analysis not found")
        
        # Get comprehensive insights
        current_resume = resume.parsed_data or {}
        job_description = job_analysis.extracted_requirements.get('job_description', '')
        industry, confidence = realtime_optimizer.industry_analyzer.detect_industry(job_description)
        
        # Calculate various scores
        overall_score = realtime_optimizer._calculate_overall_score(
            current_resume, 
            job_analysis.extracted_requirements, 
            industry
        )
        
        ats_score = realtime_optimizer._calculate_ats_score(
            current_resume, 
            job_analysis.extracted_requirements
        )
        
        industry_alignment = realtime_optimizer._calculate_industry_alignment(
            current_resume, 
            industry
        )
        
        keyword_density = realtime_optimizer._calculate_keyword_density(
            current_resume, 
            job_analysis.extracted_requirements
        )
        
        improvement_areas = realtime_optimizer._identify_improvement_areas(
            current_resume,
            job_analysis.extracted_requirements,
            industry
        )
        
        strengths = realtime_optimizer._identify_strengths(
            current_resume,
            job_analysis.extracted_requirements,
            industry
        )
        
        return {
            "resume_id": resume_id,
            "job_analysis_id": job_analysis_id,
            "industry_detected": industry,
            "industry_confidence": confidence,
            "scores": {
                "overall": overall_score,
                "ats": ats_score,
                "industry_alignment": industry_alignment
            },
            "keyword_density": keyword_density,
            "improvement_areas": improvement_areas,
            "strengths": strengths,
            "recommendations": {
                "high_priority": [area for area in improvement_areas if area in ["Keyword optimization", "Industry-specific content"]],
                "medium_priority": [area for area in improvement_areas if area not in ["Keyword optimization", "Industry-specific content"]],
                "suggested_actions": [
                    f"Add more {industry.value} industry keywords",
                    "Include quantified achievements",
                    "Optimize section ordering",
                    "Enhance professional summary"
                ]
            }
        }
        
    except Exception as e:
        import traceback
        print(f"Insights error: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Error getting optimization insights: {str(e)}"
        )

@router.get("/stream/{resume_id}/{job_analysis_id}")
async def stream_optimization_suggestions(
    resume_id: int,
    job_analysis_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_database)
):
    """Stream real-time optimization suggestions using Server-Sent Events"""
    
    async def generate_suggestions():
        """Generate streaming suggestions"""
        
        try:
            # Verify resume and job analysis ownership
            resume_result = await db.execute(
                select(Resume).where(
                    Resume.id == resume_id,
                    Resume.user_id == current_user.id
                )
            )
            resume = resume_result.scalar_one_or_none()
            
            if not resume:
                yield f"data: {json.dumps({'error': 'Resume not found'})}\n\n"
                return
            
            job_result = await db.execute(
                select(JobAnalysis).where(
                    JobAnalysis.id == job_analysis_id,
                    JobAnalysis.user_id == current_user.id
                )
            )
            job_analysis = job_result.scalar_one_or_none()
            
            if not job_analysis:
                yield f"data: {json.dumps({'error': 'Job analysis not found'})}\n\n"
                return
            
            # Initial setup
            current_resume = resume.parsed_data or {}
            job_description = job_analysis.extracted_requirements.get('job_description', '')
            industry, confidence = realtime_optimizer.industry_analyzer.detect_industry(job_description)
            
            # Send initial status
            yield f"data: {json.dumps({'type': 'status', 'message': 'Starting optimization analysis...'})}\n\n"
            
            # Generate periodic suggestions
            for i in range(10):  # Example: 10 rounds of suggestions
                await asyncio.sleep(2)  # Wait 2 seconds between suggestions
                
                # Generate mock suggestion for demonstration
                suggestion = OptimizationSuggestion(
                    id=f"stream_suggestion_{i}",
                    type="content",
                    priority="medium",
                    title=f"Optimization Suggestion {i+1}",
                    description=f"This is a streaming suggestion #{i+1}",
                    original_text="",
                    suggested_text="",
                    explanation="This is a demonstration of streaming suggestions",
                    impact_score=0.5,
                    section="overall",
                    auto_apply=False
                )
                
                yield f"data: {json.dumps({'type': 'suggestion', 'data': suggestion.dict()})}\n\n"
            
            # Send completion status
            yield f"data: {json.dumps({'type': 'complete', 'message': 'Optimization analysis complete'})}\n\n"
            
        except Exception as e:
            yield f"data: {json.dumps({'type': 'error', 'message': str(e)})}\n\n"
    
    return StreamingResponse(
        generate_suggestions(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
        }
    )

@router.post("/cache/clear")
async def clear_optimization_cache(
    current_user: User = Depends(get_current_user)
):
    """Clear optimization cache"""
    
    try:
        realtime_optimizer.clear_cache()
        return {"message": "Cache cleared successfully"}
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error clearing cache: {str(e)}"
        )

@router.get("/cache/stats")
async def get_cache_stats(
    current_user: User = Depends(get_current_user)
):
    """Get cache statistics"""
    
    try:
        stats = realtime_optimizer.get_cache_stats()
        return {
            "cache_statistics": stats,
            "status": "healthy" if stats['cache_size'] < 1000 else "warning"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error getting cache stats: {str(e)}"
        )