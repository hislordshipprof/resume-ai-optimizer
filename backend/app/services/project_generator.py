"""Project Generator Service for creating realistic projects to fill skill gaps"""
import json
import re
from typing import Dict, List, Optional, Tuple
from datetime import datetime
from pydantic import BaseModel
from openai import OpenAI
import google.generativeai as genai

from app.core.config import settings
from app.services.gap_analyzer import GapAnalysisResult

class ProjectGenerationRequest(BaseModel):
    """Request model for project generation"""
    target_skills: List[str]
    missing_technologies: List[str] = []
    experience_level: str = "mid"  # entry, mid, senior
    industry: Optional[str] = None
    time_commitment_weeks: int = 4
    project_type: Optional[str] = None  # web, mobile, data, ai, etc.

class GeneratedProjectData(BaseModel):
    """Generated project data model"""
    title: str
    description: str
    duration_weeks: int
    difficulty_level: str
    
    # Skills and technologies
    target_skills: List[str]
    technologies_used: List[str]
    frameworks: List[str] = []
    databases: List[str] = []
    
    # Project structure
    project_phases: List[Dict]
    deliverables: List[str]
    learning_objectives: List[str]
    
    # Scoring
    relevance_score: float
    feasibility_score: float
    impact_score: float
    
    # Generation metadata
    generation_method: str
    ai_model_used: Optional[str] = None
    template_id: Optional[str] = None

class ProjectGeneratorService:
    """Service for generating realistic projects based on skill gaps"""
    
    def __init__(self):
        # Initialize AI clients
        self.openai_client = None
        self.gemini_model = None
        self.openai_enabled = False
        self.gemini_enabled = False
        
        if settings.OPENAI_API_KEY:
            self.openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)
            self.openai_enabled = True
            
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.gemini_model = genai.GenerativeModel('gemini-2.0-flash')
            self.gemini_enabled = True
        
        # Load project templates
        self.project_templates = self._load_project_templates()
    
    def _load_project_templates(self) -> Dict:
        """Load predefined project templates"""
        return {
            "web_development": {
                "fullstack_ecommerce": {
                    "title": "E-commerce Platform with {technologies}",
                    "description": "Build a complete e-commerce platform with user authentication, product catalog, shopping cart, and payment processing",
                    "phases": [
                        {"name": "Backend API Development", "skills": ["API design", "database modeling"], "duration_weeks": 2},
                        {"name": "Frontend Development", "skills": ["UI/UX", "state management"], "duration_weeks": 2},
                        {"name": "Payment Integration", "skills": ["payment processing", "security"], "duration_weeks": 1},
                        {"name": "Testing & Deployment", "skills": ["testing", "deployment"], "duration_weeks": 1}
                    ],
                    "target_skills": ["web development", "full-stack", "API development"],
                    "difficulty": "intermediate"
                },
                "portfolio_website": {
                    "title": "Professional Portfolio Website",
                    "description": "Create a responsive portfolio website showcasing your projects and skills",
                    "phases": [
                        {"name": "Design & Planning", "skills": ["UI design", "planning"], "duration_weeks": 1},
                        {"name": "Frontend Development", "skills": ["HTML/CSS", "responsive design"], "duration_weeks": 2},
                        {"name": "CMS Integration", "skills": ["content management", "dynamic content"], "duration_weeks": 1}
                    ],
                    "target_skills": ["frontend development", "web design"],
                    "difficulty": "beginner"
                }
            },
            "data_science": {
                "sales_analytics": {
                    "title": "Sales Performance Analytics Dashboard",
                    "description": "Build a comprehensive analytics dashboard to track and visualize sales performance metrics",
                    "phases": [
                        {"name": "Data Collection & Cleaning", "skills": ["data cleaning", "ETL"], "duration_weeks": 1},
                        {"name": "Analysis & Modeling", "skills": ["statistical analysis", "predictive modeling"], "duration_weeks": 2},
                        {"name": "Dashboard Development", "skills": ["data visualization", "dashboard design"], "duration_weeks": 2}
                    ],
                    "target_skills": ["data analysis", "python", "data visualization"],
                    "difficulty": "intermediate"
                }
            },
            "mobile_development": {
                "task_manager_app": {
                    "title": "Cross-Platform Task Management App",
                    "description": "Develop a mobile app for task management with offline support and cloud sync",
                    "phases": [
                        {"name": "App Architecture", "skills": ["mobile architecture", "state management"], "duration_weeks": 1},
                        {"name": "Core Features", "skills": ["mobile UI", "local storage"], "duration_weeks": 2},
                        {"name": "Cloud Integration", "skills": ["API integration", "sync mechanisms"], "duration_weeks": 1}
                    ],
                    "target_skills": ["mobile development", "cross-platform"],
                    "difficulty": "intermediate"
                }
            },
            "devops": {
                "ci_cd_pipeline": {
                    "title": "Complete CI/CD Pipeline with {technologies}",
                    "description": "Set up automated CI/CD pipeline with testing, building, and deployment",
                    "phases": [
                        {"name": "Pipeline Setup", "skills": ["CI/CD", "automation"], "duration_weeks": 1},
                        {"name": "Testing Integration", "skills": ["automated testing", "quality gates"], "duration_weeks": 1},
                        {"name": "Deployment Automation", "skills": ["deployment", "monitoring"], "duration_weeks": 1}
                    ],
                    "target_skills": ["devops", "automation", "deployment"],
                    "difficulty": "advanced"
                }
            }
        }
    
    def generate_project_from_gaps(self, gap_result: GapAnalysisResult, request: ProjectGenerationRequest) -> GeneratedProjectData:
        """Main method to generate a project based on gap analysis"""
        
        print(f"Generating project for skills: {request.target_skills}")
        
        # Determine project generation strategy
        if self.openai_enabled or self.gemini_enabled:
            return self._generate_ai_project(gap_result, request)
        else:
            return self._generate_template_project(gap_result, request)
    
    def _generate_ai_project(self, gap_result: GapAnalysisResult, request: ProjectGenerationRequest) -> GeneratedProjectData:
        """Generate project using AI"""
        
        prompt = self._create_project_generation_prompt(gap_result, request)
        
        try:
            if self.openai_enabled:
                print("Generating project with OpenAI...")
                return self._generate_with_openai(prompt, request)
            elif self.gemini_enabled:
                print("Generating project with Gemini...")
                return self._generate_with_gemini(prompt, request)
        except Exception as e:
            print(f"AI generation failed: {e}")
            return self._generate_template_project(gap_result, request)
    
    def _create_project_generation_prompt(self, gap_result: GapAnalysisResult, request: ProjectGenerationRequest) -> str:
        """Create AI prompt for project generation"""
        
        prompt = f"""
        Generate a realistic, industry-relevant project that will help fill these skill gaps:

        MISSING SKILLS: {', '.join(request.target_skills)}
        MISSING TECHNOLOGIES: {', '.join(request.missing_technologies)}
        EXPERIENCE LEVEL: {request.experience_level}
        INDUSTRY: {request.industry or 'General'}
        TIME COMMITMENT: {request.time_commitment_weeks} weeks
        PROJECT TYPE: {request.project_type or 'Any'}

        CURRENT SKILLS: {', '.join(gap_result.matching_skills)}

        Generate a project that:
        1. Teaches the missing skills effectively
        2. Uses the missing technologies
        3. Is appropriate for {request.experience_level} level
        4. Can be completed in {request.time_commitment_weeks} weeks
        5. Results in a portfolio-worthy deliverable

        Return JSON with this exact structure:
        {{
            "title": "Project title",
            "description": "Detailed project description (2-3 sentences)",
            "duration_weeks": {request.time_commitment_weeks},
            "difficulty_level": "{request.experience_level}",
            "target_skills": ["skill1", "skill2", ...],
            "technologies_used": ["tech1", "tech2", ...],
            "frameworks": ["framework1", "framework2", ...],
            "databases": ["db1", "db2", ...],
            "project_phases": [
                {{
                    "phase_number": 1,
                    "name": "Phase name",
                    "description": "What to do in this phase",
                    "estimated_hours": 20,
                    "tasks": ["task1", "task2", ...],
                    "skills_practiced": ["skill1", "skill2", ...],
                    "deliverables": ["deliverable1", "deliverable2", ...]
                }}
            ],
            "deliverables": ["final deliverable1", "final deliverable2", ...],
            "learning_objectives": ["objective1", "objective2", ...],
            "relevance_score": 0.9,
            "feasibility_score": 0.8,
            "impact_score": 0.85
        }}

        Make the project realistic, practical, and valuable for a resume.
        """
        
        return prompt
    
    def _generate_with_openai(self, prompt: str, request: ProjectGenerationRequest) -> GeneratedProjectData:
        """Generate project using OpenAI"""
        
        response = self.openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an expert project manager and career advisor who creates realistic, valuable projects for skill development. Always return valid JSON."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=3000
        )
        
        result_text = response.choices[0].message.content.strip()
        
        # Clean and parse JSON
        if result_text.startswith('```json'):
            result_text = result_text[7:]
        if result_text.endswith('```'):
            result_text = result_text[:-3]
        
        project_data = json.loads(result_text)
        project_data['generation_method'] = 'ai'
        project_data['ai_model_used'] = 'openai'
        
        return GeneratedProjectData(**project_data)
    
    def _generate_with_gemini(self, prompt: str, request: ProjectGenerationRequest) -> GeneratedProjectData:
        """Generate project using Gemini"""
        
        response = self.gemini_model.generate_content(prompt)
        result_text = response.text.strip()
        
        # Clean and parse JSON
        if result_text.startswith('```json'):
            result_text = result_text[7:]
        if result_text.endswith('```'):
            result_text = result_text[:-3]
        
        project_data = json.loads(result_text)
        project_data['generation_method'] = 'ai'
        project_data['ai_model_used'] = 'gemini'
        
        return GeneratedProjectData(**project_data)
    
    def _generate_template_project(self, gap_result: GapAnalysisResult, request: ProjectGenerationRequest) -> GeneratedProjectData:
        """Generate project using templates as fallback"""
        
        print("Using template-based project generation...")
        
        # Determine best template category
        category = self._determine_project_category(request.target_skills)
        
        # Get template
        template = self._select_best_template(category, request)
        
        # Customize template
        return self._customize_template(template, request)
    
    def _determine_project_category(self, skills: List[str]) -> str:
        """Determine project category based on skills"""
        
        skills_lower = [skill.lower() for skill in skills]
        
        if any(skill in skills_lower for skill in ['react', 'vue', 'angular', 'javascript', 'typescript', 'web']):
            return 'web_development'
        elif any(skill in skills_lower for skill in ['python', 'data', 'analytics', 'pandas', 'numpy']):
            return 'data_science'
        elif any(skill in skills_lower for skill in ['mobile', 'android', 'ios', 'flutter', 'react native']):
            return 'mobile_development'
        elif any(skill in skills_lower for skill in ['docker', 'kubernetes', 'devops', 'ci/cd', 'deployment']):
            return 'devops'
        else:
            return 'web_development'  # Default
    
    def _select_best_template(self, category: str, request: ProjectGenerationRequest) -> Dict:
        """Select best template from category"""
        
        templates = self.project_templates.get(category, {})
        
        if not templates:
            # Fallback to web development
            templates = self.project_templates['web_development']
        
        # Simple selection - take first available
        # In production, this would be more sophisticated
        template_key = list(templates.keys())[0]
        return templates[template_key]
    
    def _customize_template(self, template: Dict, request: ProjectGenerationRequest) -> GeneratedProjectData:
        """Customize template based on request"""
        
        # Customize title
        title = template['title']
        if '{technologies}' in title:
            techs = ', '.join(request.missing_technologies[:3])
            title = title.replace('{technologies}', techs)
        
        # Build project data
        project_data = {
            'title': title,
            'description': template['description'],
            'duration_weeks': request.time_commitment_weeks,
            'difficulty_level': request.experience_level,
            'target_skills': request.target_skills,
            'technologies_used': request.missing_technologies,
            'frameworks': [],
            'databases': [],
            'project_phases': self._build_phases_from_template(template['phases']),
            'deliverables': [
                'Complete project repository with documentation',
                'Deployed application with live demo',
                'Technical presentation of solution'
            ],
            'learning_objectives': [
                f'Master {skill}' for skill in request.target_skills[:3]
            ],
            'relevance_score': 0.8,
            'feasibility_score': 0.9,
            'impact_score': 0.7,
            'generation_method': 'template',
            'template_id': template.get('id', 'default')
        }
        
        return GeneratedProjectData(**project_data)
    
    def _build_phases_from_template(self, template_phases: List[Dict]) -> List[Dict]:
        """Convert template phases to full phase structure"""
        
        phases = []
        for i, phase in enumerate(template_phases, 1):
            phases.append({
                'phase_number': i,
                'name': phase['name'],
                'description': f"Complete {phase['name'].lower()} including all required functionality",
                'estimated_hours': phase.get('duration_weeks', 1) * 20,  # 20 hours per week
                'tasks': [
                    'Planning and research',
                    'Implementation',
                    'Testing and refinement',
                    'Documentation'
                ],
                'skills_practiced': phase.get('skills', []),
                'deliverables': [
                    f'{phase["name"]} completed',
                    'Documentation updated',
                    'Code reviewed and tested'
                ]
            })
        
        return phases
    
    def validate_project(self, project: GeneratedProjectData) -> Tuple[bool, List[str]]:
        """Validate generated project quality"""
        
        issues = []
        
        # Check required fields
        if not project.title or len(project.title) < 10:
            issues.append("Title too short or missing")
        
        if not project.description or len(project.description) < 50:
            issues.append("Description too short or missing")
        
        if not project.target_skills:
            issues.append("No target skills specified")
        
        if not project.project_phases:
            issues.append("No project phases defined")
        
        if project.duration_weeks < 1 or project.duration_weeks > 12:
            issues.append("Duration should be 1-12 weeks")
        
        # Check scores
        if not (0 <= project.relevance_score <= 1):
            issues.append("Invalid relevance score")
        
        if not (0 <= project.feasibility_score <= 1):
            issues.append("Invalid feasibility score")
        
        if not (0 <= project.impact_score <= 1):
            issues.append("Invalid impact score")
        
        return len(issues) == 0, issues