"""Project generation API endpoints"""
from typing import List, Dict
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from app.core.database import get_database
from app.models.user import User
from app.models.resume import Resume
from app.models.job_analysis import JobAnalysis
from app.models.generated_project import GeneratedProject, ProjectPhase
from app.api.auth import get_current_user
from app.services.project_generator import ProjectGeneratorService, ProjectGenerationRequest, GeneratedProjectData
from app.services.gap_analyzer import GapAnalyzerService

router = APIRouter()

class GenerateProjectRequest(BaseModel):
    """Request model for generating a project"""
    resume_id: int
    job_analysis_id: int
    target_skills: List[str]
    missing_technologies: List[str] = []
    time_commitment_weeks: int = 4
    project_type: str = None
    industry: str = None

class ProjectResponse(BaseModel):
    """Response model for generated project"""
    id: int
    title: str
    description: str
    duration_weeks: int
    difficulty_level: str
    target_skills: List[str]
    technologies_used: List[str]
    frameworks: List[str]
    databases: List[str]
    project_phases: List[Dict]
    deliverables: List[str]
    learning_objectives: List[str]
    relevance_score: float
    feasibility_score: float
    impact_score: float
    generation_method: str
    ai_model_used: str = None
    is_approved: bool
    created_at: str

@router.post("/generate", response_model=ProjectResponse)
async def generate_project(
    request: GenerateProjectRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_database)
):
    """Generate a new project based on gap analysis"""
    
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
        # First, get gap analysis for context
        gap_analyzer = GapAnalyzerService()
        resume_data = {
            'parsed_data': resume.parsed_data,
            'raw_text': resume.raw_text
        }
        gap_result = gap_analyzer.analyze_gap(resume_data, job_analysis.extracted_requirements)
        
        # Create project generation request
        generation_request = ProjectGenerationRequest(
            target_skills=request.target_skills,
            missing_technologies=request.missing_technologies,
            experience_level=job_analysis.extracted_requirements.get('experience_level', 'mid'),
            industry=request.industry,
            time_commitment_weeks=request.time_commitment_weeks,
            project_type=request.project_type
        )
        
        # Generate project
        generator = ProjectGeneratorService()
        generated_project = generator.generate_project_from_gaps(gap_result, generation_request)
        
        # Validate project
        is_valid, issues = generator.validate_project(generated_project)
        if not is_valid:
            raise HTTPException(
                status_code=400,
                detail=f"Generated project validation failed: {', '.join(issues)}"
            )
        
        # Save to database
        db_project = GeneratedProject(
            user_id=current_user.id,
            resume_id=request.resume_id,
            job_analysis_id=request.job_analysis_id,
            title=generated_project.title,
            description=generated_project.description,
            duration_weeks=generated_project.duration_weeks,
            difficulty_level=generated_project.difficulty_level,
            target_skills=generated_project.target_skills,
            technologies_used=generated_project.technologies_used,
            frameworks=generated_project.frameworks,
            databases=generated_project.databases,
            project_phases=generated_project.project_phases,
            deliverables=generated_project.deliverables,
            learning_objectives=generated_project.learning_objectives,
            relevance_score=generated_project.relevance_score,
            feasibility_score=generated_project.feasibility_score,
            impact_score=generated_project.impact_score,
            generation_method=generated_project.generation_method,
            ai_model_used=generated_project.ai_model_used,
            template_id=generated_project.template_id
        )
        
        db.add(db_project)
        await db.commit()
        await db.refresh(db_project)
        
        return ProjectResponse(
            id=db_project.id,
            title=db_project.title,
            description=db_project.description,
            duration_weeks=db_project.duration_weeks,
            difficulty_level=db_project.difficulty_level,
            target_skills=db_project.target_skills,
            technologies_used=db_project.technologies_used,
            frameworks=db_project.frameworks,
            databases=db_project.databases,
            project_phases=db_project.project_phases,
            deliverables=db_project.deliverables,
            learning_objectives=db_project.learning_objectives,
            relevance_score=db_project.relevance_score,
            feasibility_score=db_project.feasibility_score,
            impact_score=db_project.impact_score,
            generation_method=db_project.generation_method,
            ai_model_used=db_project.ai_model_used,
            is_approved=db_project.is_approved,
            created_at=db_project.created_at.isoformat()
        )
        
    except Exception as e:
        import traceback
        print(f"Project generation error: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Error generating project: {str(e)}"
        )

@router.get("/list", response_model=List[ProjectResponse])
async def list_user_projects(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_database)
):
    """Get all projects generated for the current user"""
    
    try:
        result = await db.execute(
            select(GeneratedProject).where(
                GeneratedProject.user_id == current_user.id
            ).order_by(GeneratedProject.created_at.desc())
        )
        projects = result.scalars().all()
        
        return [
            ProjectResponse(
                id=project.id,
                title=project.title,
                description=project.description,
                duration_weeks=project.duration_weeks,
                difficulty_level=project.difficulty_level,
                target_skills=project.target_skills,
                technologies_used=project.technologies_used,
                frameworks=project.frameworks,
                databases=project.databases,
                project_phases=project.project_phases,
                deliverables=project.deliverables,
                learning_objectives=project.learning_objectives,
                relevance_score=project.relevance_score,
                feasibility_score=project.feasibility_score,
                impact_score=project.impact_score,
                generation_method=project.generation_method,
                ai_model_used=project.ai_model_used,
                is_approved=project.is_approved,
                created_at=project.created_at.isoformat()
            )
            for project in projects
        ]
    except Exception as e:
        import traceback
        print(f"Project list error: {str(e)}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching projects: {str(e)}"
        )

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_database)
):
    """Get a specific project by ID"""
    
    result = await db.execute(
        select(GeneratedProject).where(
            GeneratedProject.id == project_id,
            GeneratedProject.user_id == current_user.id
        )
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return ProjectResponse(
        id=project.id,
        title=project.title,
        description=project.description,
        duration_weeks=project.duration_weeks,
        difficulty_level=project.difficulty_level,
        target_skills=project.target_skills,
        technologies_used=project.technologies_used,
        frameworks=project.frameworks,
        databases=project.databases,
        project_phases=project.project_phases,
        deliverables=project.deliverables,
        learning_objectives=project.learning_objectives,
        relevance_score=project.relevance_score,
        feasibility_score=project.feasibility_score,
        impact_score=project.impact_score,
        generation_method=project.generation_method,
        ai_model_used=project.ai_model_used,
        is_approved=project.is_approved,
        created_at=project.created_at.isoformat()
    )

@router.post("/{project_id}/approve")
async def approve_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_database)
):
    """Approve a generated project"""
    
    result = await db.execute(
        select(GeneratedProject).where(
            GeneratedProject.id == project_id,
            GeneratedProject.user_id == current_user.id
        )
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    project.is_approved = True
    await db.commit()
    
    return {"message": "Project approved successfully"}

@router.delete("/{project_id}")
async def delete_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_database)
):
    """Delete a generated project"""
    
    result = await db.execute(
        select(GeneratedProject).where(
            GeneratedProject.id == project_id,
            GeneratedProject.user_id == current_user.id
        )
    )
    project = result.scalar_one_or_none()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    await db.delete(project)
    await db.commit()
    
    return {"message": "Project deleted successfully"}

@router.post("/regenerate/{project_id}", response_model=ProjectResponse)
async def regenerate_project(
    project_id: int,
    request: GenerateProjectRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_database)
):
    """Regenerate a project with different parameters"""
    
    # First delete the old project
    result = await db.execute(
        select(GeneratedProject).where(
            GeneratedProject.id == project_id,
            GeneratedProject.user_id == current_user.id
        )
    )
    old_project = result.scalar_one_or_none()
    
    if not old_project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    await db.delete(old_project)
    await db.commit()
    
    # Generate new project
    return await generate_project(request, current_user, db)