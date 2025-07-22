"""Resume optimization and export API endpoints"""
from typing import List, Dict, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from app.core.database import get_database
from app.models.user import User
from app.models.resume import Resume
from app.models.job_analysis import JobAnalysis
from app.models.generated_project import GeneratedProject
from app.api.auth import get_current_user
from app.services.resume_optimizer import ResumeOptimizerService, ResumeOptimizationRequest, OptimizedResumeData
from app.services.latex_generator import LaTeXGeneratorService, LaTeXResumeRequest

router = APIRouter()

class OptimizeResumeRequest(BaseModel):
    """Request model for resume optimization"""
    resume_id: int
    job_analysis_id: int
    target_job_title: str
    target_company: Optional[str] = None
    target_industry: Optional[str] = None
    optimization_focus: str = "ats"  # ats, creative, executive, technical
    include_projects: bool = True
    max_pages: int = 2
    format_style: str = "professional"

class OptimizedResumeResponse(BaseModel):
    """Response model for optimized resume"""
    personal_info: Dict
    professional_summary: str
    skills_section: Dict
    experience_section: List[Dict]
    education_section: List[Dict]
    projects_section: List[Dict]
    section_order: List[str]
    formatting_style: str
    ats_score: float
    keyword_density: Dict[str, int]
    optimization_notes: List[str]
    improvements_made: List[str]

class ExportResumeRequest(BaseModel):
    """Request model for resume export"""
    resume_id: int
    job_analysis_id: int
    optimization_request: OptimizeResumeRequest
    latex_request: LaTeXResumeRequest

@router.post("/optimize", response_model=OptimizedResumeResponse)
async def optimize_resume(
    request: OptimizeResumeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_database)
):
    """Optimize a resume for a specific job"""
    
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
    
    try:
        # Get generated projects for this resume and job
        projects_result = await db.execute(
            select(GeneratedProject).where(
                GeneratedProject.resume_id == request.resume_id,
                GeneratedProject.job_analysis_id == request.job_analysis_id,
                GeneratedProject.user_id == current_user.id,
                GeneratedProject.is_approved == True
            )
        )
        generated_projects = projects_result.scalars().all()
        
        # Convert to dict format
        projects_data = []
        for project in generated_projects:
            projects_data.append({
                "title": project.title,
                "description": project.description,
                "technologies_used": project.technologies_used,
                "deliverables": project.deliverables
            })
        
        # Create optimization request
        optimization_request = ResumeOptimizationRequest(
            target_job_title=request.target_job_title,
            target_company=request.target_company,
            target_industry=request.target_industry,
            optimization_focus=request.optimization_focus,
            include_projects=request.include_projects,
            max_pages=request.max_pages,
            format_style=request.format_style
        )
        
        # Optimize resume
        optimizer = ResumeOptimizerService()
        optimized_resume = optimizer.optimize_resume(
            resume_data=resume.parsed_data,
            job_requirements=job_analysis.extracted_requirements,
            request=optimization_request,
            generated_projects=projects_data
        )
        
        return OptimizedResumeResponse(
            personal_info=optimized_resume.personal_info,
            professional_summary=optimized_resume.professional_summary,
            skills_section=optimized_resume.skills_section,
            experience_section=optimized_resume.experience_section,
            education_section=optimized_resume.education_section,
            projects_section=optimized_resume.projects_section,
            section_order=optimized_resume.section_order,
            formatting_style=optimized_resume.formatting_style,
            ats_score=optimized_resume.ats_score,
            keyword_density=optimized_resume.keyword_density,
            optimization_notes=optimized_resume.optimization_notes,
            improvements_made=optimized_resume.improvements_made
        )
        
    except Exception as e:
        import traceback
        print(f"Resume optimization error: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Error optimizing resume: {str(e)}"
        )

@router.post("/export/latex")
async def export_resume_latex(
    request: ExportResumeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_database)
):
    """Export optimized resume as LaTeX code"""
    
    try:
        # First optimize the resume
        optimized_response = await optimize_resume(request.optimization_request, current_user, db)
        
        # Convert response to OptimizedResumeData
        optimized_resume = OptimizedResumeData(
            personal_info=optimized_response.personal_info,
            professional_summary=optimized_response.professional_summary,
            skills_section=optimized_response.skills_section,
            experience_section=optimized_response.experience_section,
            education_section=optimized_response.education_section,
            projects_section=optimized_response.projects_section,
            section_order=optimized_response.section_order,
            formatting_style=optimized_response.formatting_style,
            ats_score=optimized_response.ats_score,
            keyword_density=optimized_response.keyword_density,
            optimization_notes=optimized_response.optimization_notes,
            improvements_made=optimized_response.improvements_made
        )
        
        # Generate LaTeX
        latex_generator = LaTeXGeneratorService()
        latex_code = latex_generator.generate_latex_resume(
            optimized_resume, 
            request.latex_request
        )
        
        return Response(
            content=latex_code,
            media_type="text/plain",
            headers={
                "Content-Disposition": "attachment; filename=resume.tex"
            }
        )
        
    except Exception as e:
        import traceback
        print(f"LaTeX export error: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Error exporting LaTeX resume: {str(e)}"
        )

@router.post("/export/pdf")
async def export_resume_pdf(
    request: ExportResumeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_database)
):
    """Export optimized resume as PDF"""
    
    try:
        # First optimize the resume
        optimized_response = await optimize_resume(request.optimization_request, current_user, db)
        
        # Convert response to OptimizedResumeData
        optimized_resume = OptimizedResumeData(
            personal_info=optimized_response.personal_info,
            professional_summary=optimized_response.professional_summary,
            skills_section=optimized_response.skills_section,
            experience_section=optimized_response.experience_section,
            education_section=optimized_response.education_section,
            projects_section=optimized_response.projects_section,
            section_order=optimized_response.section_order,
            formatting_style=optimized_response.formatting_style,
            ats_score=optimized_response.ats_score,
            keyword_density=optimized_response.keyword_density,
            optimization_notes=optimized_response.optimization_notes,
            improvements_made=optimized_response.improvements_made
        )
        
        # Generate LaTeX and compile to PDF
        latex_generator = LaTeXGeneratorService()
        pdf_content = latex_generator.generate_pdf_resume(
            optimized_resume, 
            request.latex_request
        )
        
        return Response(
            content=pdf_content,
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=resume.pdf"
            }
        )
        
    except Exception as e:
        import traceback
        print(f"PDF export error: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Error exporting PDF resume: {str(e)}"
        )

@router.get("/latex/instructions")
async def get_latex_instructions():
    """Get instructions for compiling LaTeX resume"""
    
    latex_generator = LaTeXGeneratorService()
    instructions = latex_generator.generate_pdf_compile_instructions()
    
    return {"instructions": instructions}

@router.post("/preview")
async def preview_optimization(
    request: OptimizeResumeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_database)
):
    """Preview optimization changes without saving"""
    
    # This is the same as optimize but could be extended to show diffs
    return await optimize_resume(request, current_user, db)

@router.get("/templates")
async def get_resume_templates():
    """Get available resume templates and styles"""
    
    return {
        "optimization_focus": [
            {"value": "ats", "label": "ATS-Optimized", "description": "Optimized for Applicant Tracking Systems"},
            {"value": "creative", "label": "Creative", "description": "Visually appealing with modern design"},
            {"value": "executive", "label": "Executive", "description": "Professional format for senior roles"},
            {"value": "technical", "label": "Technical", "description": "Emphasizes technical skills and projects"}
        ],
        "latex_templates": [
            {"value": "professional", "label": "Professional", "description": "Clean, traditional format using ModernCV"},
            {"value": "modern", "label": "Modern", "description": "Contemporary design with color accents"},
            {"value": "academic", "label": "Academic", "description": "Research-focused format for academic positions"}
        ],
        "color_schemes": [
            {"value": "blue", "label": "Blue", "hex": "#0064C8"},
            {"value": "black", "label": "Black", "hex": "#000000"},
            {"value": "green", "label": "Green", "hex": "#009600"},
            {"value": "navy", "label": "Navy", "hex": "#003264"},
            {"value": "burgundy", "label": "Burgundy", "hex": "#800000"}
        ],
        "font_sizes": [10, 11, 12],
        "margins": [
            {"value": "tight", "label": "Tight (0.5 inch)"},
            {"value": "normal", "label": "Normal (0.75 inch)"},
            {"value": "wide", "label": "Wide (1.0 inch)"}
        ]
    }

@router.get("/ats-keywords/{industry}")
async def get_ats_keywords(industry: str):
    """Get ATS keywords for specific industry"""
    
    optimizer = ResumeOptimizerService()
    keywords = optimizer.ats_keywords.get("industry_terms", {}).get(industry.lower(), [])
    
    return {
        "industry": industry,
        "keywords": keywords,
        "action_verbs": optimizer.ats_keywords["action_verbs"][:20],
        "technical_skills": optimizer.ats_keywords["technical_skills"][:15],
        "soft_skills": optimizer.ats_keywords["soft_skills"][:10]
    }

@router.post("/score")
async def calculate_resume_score(
    request: OptimizeResumeRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_database)
):
    """Calculate resume score without full optimization"""
    
    # Verify resume and job analysis
    resume_result = await db.execute(
        select(Resume).where(
            Resume.id == request.resume_id,
            Resume.user_id == current_user.id
        )
    )
    resume = resume_result.scalar_one_or_none()
    
    if not resume:
        raise HTTPException(status_code=404, detail="Resume not found")
    
    job_result = await db.execute(
        select(JobAnalysis).where(
            JobAnalysis.id == request.job_analysis_id,
            JobAnalysis.user_id == current_user.id
        )
    )
    job_analysis = job_result.scalar_one_or_none()
    
    if not job_analysis:
        raise HTTPException(status_code=404, detail="Job analysis not found")
    
    try:
        optimizer = ResumeOptimizerService()
        
        # Create a minimal optimized data structure for scoring
        minimal_optimized = {
            "skills_section": {"all_skills": resume.parsed_data.get("skills", [])},
            "experience_section": [
                {"description": [exp.get("content", "")]} 
                for exp in resume.parsed_data.get("experience", [])
            ],
            "professional_summary": resume.parsed_data.get("summary", "")
        }
        
        ats_score = optimizer._calculate_ats_score(minimal_optimized, job_analysis.extracted_requirements)
        keyword_density = optimizer._calculate_keyword_density(minimal_optimized, job_analysis.extracted_requirements)
        
        return {
            "ats_score": ats_score,
            "keyword_density": keyword_density,
            "score_breakdown": {
                "keyword_matching": min(len(keyword_density) * 10, 40),
                "action_verbs": 20,  # Would need to calculate
                "quantified_achievements": 20,  # Would need to calculate  
                "structure": 20
            }
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error calculating resume score: {str(e)}"
        )