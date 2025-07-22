"""Resume Optimization Service for enhancing and formatting resumes"""
import re
import json
from typing import Dict, List, Optional, Tuple
from datetime import datetime
from pydantic import BaseModel
from openai import OpenAI
import google.generativeai as genai

from app.core.config import settings
from app.services.gap_analyzer import GapAnalysisResult
from app.services.industry_analyzer import IndustryAnalyzerService, IndustryType

class ResumeOptimizationRequest(BaseModel):
    """Request model for resume optimization"""
    target_job_title: str
    target_company: Optional[str] = None
    target_industry: Optional[str] = None
    optimization_focus: str = "ats"  # ats, creative, executive, technical
    include_projects: bool = True
    max_pages: int = 2
    format_style: str = "professional"  # professional, modern, classic

class OptimizedResumeData(BaseModel):
    """Optimized resume data model"""
    # Personal Information
    personal_info: Dict
    
    # Core Sections
    professional_summary: str
    skills_section: Dict
    experience_section: List[Dict]
    education_section: List[Dict]
    projects_section: List[Dict] = []
    
    # Formatting
    section_order: List[str]
    formatting_style: str
    
    # Optimization metadata
    ats_score: float
    keyword_density: Dict[str, int]
    optimization_notes: List[str]
    improvements_made: List[str]

class ResumeOptimizerService:
    """Service for optimizing and enhancing resumes with industry-specific intelligence"""
    
    def __init__(self):
        # Initialize AI clients
        self.openai_client = None
        self.gemini_model = None
        self.openai_enabled = False
        self.gemini_enabled = False
        
        # Initialize industry analyzer
        self.industry_analyzer = IndustryAnalyzerService()
        
        if settings.OPENAI_API_KEY:
            self.openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)
            self.openai_enabled = True
            
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.gemini_model = genai.GenerativeModel('gemini-1.5-flash')
            self.gemini_enabled = True
        
        # ATS keywords and optimization rules
        self.ats_keywords = self._load_ats_keywords()
        self.optimization_rules = self._load_optimization_rules()
    
    def _load_ats_keywords(self) -> Dict[str, List[str]]:
        """Load ATS-friendly keywords by category"""
        return {
            "action_verbs": [
                "achieved", "managed", "developed", "implemented", "created", "designed",
                "optimized", "improved", "increased", "reduced", "streamlined", "enhanced",
                "coordinated", "executed", "delivered", "launched", "built", "established",
                "analyzed", "collaborated", "mentored", "trained", "supervised", "directed"
            ],
            "technical_skills": [
                "programming", "development", "software", "database", "cloud", "security",
                "analytics", "automation", "testing", "deployment", "integration", "architecture"
            ],
            "soft_skills": [
                "leadership", "communication", "teamwork", "problem-solving", "analytical",
                "strategic", "innovative", "adaptable", "detail-oriented", "results-driven"
            ],
            "industry_terms": {
                "technology": ["agile", "scrum", "devops", "api", "microservices", "scalability"],
                "finance": ["compliance", "risk management", "financial modeling", "portfolio"],
                "healthcare": ["patient care", "clinical", "regulatory", "healthcare systems"],
                "marketing": ["brand management", "digital marketing", "seo", "analytics", "campaigns"]
            }
        }
    
    def _load_optimization_rules(self) -> Dict[str, Dict]:
        """Load resume optimization rules"""
        return {
            "ats": {
                "max_pages": 2,
                "font_preferences": ["Arial", "Calibri", "Times New Roman"],
                "section_headers": ["Experience", "Education", "Skills", "Summary"],
                "avoid_elements": ["tables", "graphics", "headers", "footers"],
                "keyword_density_target": 0.02,  # 2% of content
                "bullet_point_max": 6,
                "quantify_achievements": True
            },
            "creative": {
                "max_pages": 2,
                "allow_graphics": True,
                "section_flexibility": True,
                "color_usage": "accent",
                "modern_formatting": True
            },
            "executive": {
                "max_pages": 3,
                "executive_summary": True,
                "board_experience": True,
                "strategic_focus": True,
                "leadership_emphasis": True
            },
            "technical": {
                "max_pages": 2,
                "technical_skills_prominent": True,
                "project_portfolio": True,
                "certifications_emphasis": True,
                "github_links": True
            }
        }
    
    def optimize_resume(
        self, 
        resume_data: Dict, 
        job_requirements: Dict, 
        request: ResumeOptimizationRequest,
        generated_projects: List[Dict] = None
    ) -> OptimizedResumeData:
        """Main method to optimize resume with industry-specific intelligence"""
        
        print(f"Optimizing resume for: {request.target_job_title}")
        print(f"Focus: {request.optimization_focus}")
        
        # Detect industry and get optimization strategy
        job_description = job_requirements.get('job_description', '')
        company_info = f"{request.target_company} {request.target_industry}"
        
        industry, confidence = self.industry_analyzer.detect_industry(job_description, company_info)
        optimization_strategy = self.industry_analyzer.get_optimization_strategy(industry, request.target_job_title)
        
        print(f"Detected industry: {industry} (confidence: {confidence:.2f})")
        print(f"Optimization strategy: {optimization_strategy['content_style']}")
        
        # Extract and enhance each section with industry context
        optimized_data = {
            "personal_info": self._optimize_personal_info(resume_data.get('personal_info', {})),
            "professional_summary": self._create_professional_summary(resume_data, job_requirements, request, industry),
            "skills_section": self._optimize_skills_section(resume_data, job_requirements, industry),
            "experience_section": self._optimize_experience_section(resume_data, job_requirements, request, industry),
            "education_section": self._optimize_education_section(resume_data.get('education', [])),
            "projects_section": self._integrate_projects_section(resume_data, generated_projects, request),
            "section_order": self._determine_section_order(request, optimization_strategy),
            "formatting_style": request.format_style,
            "industry_detected": industry,
            "industry_confidence": confidence,
            "optimization_strategy": optimization_strategy
        }
        
        # Calculate optimization metrics
        ats_score = self._calculate_ats_score(optimized_data, job_requirements)
        keyword_density = self._calculate_keyword_density(optimized_data, job_requirements)
        optimization_notes = self._generate_optimization_notes(optimized_data, request)
        improvements_made = self._track_improvements(resume_data, optimized_data)
        
        return OptimizedResumeData(
            **optimized_data,
            ats_score=ats_score,
            keyword_density=keyword_density,
            optimization_notes=optimization_notes,
            improvements_made=improvements_made
        )
    
    def _optimize_personal_info(self, personal_info: Dict) -> Dict:
        """Optimize personal information section"""
        optimized = personal_info.copy()
        
        # Ensure professional email format
        if 'email' in optimized:
            email = optimized['email']
            if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email):
                optimized['email_note'] = "Consider using a professional email address"
        
        # Format phone number consistently
        if 'phone' in optimized:
            phone = re.sub(r'[^\d]', '', optimized['phone'])
            if len(phone) == 10:
                optimized['phone'] = f"({phone[:3]}) {phone[3:6]}-{phone[6:]}"
        
        # Ensure LinkedIn URL is professional
        if 'linkedin' in optimized:
            linkedin = optimized['linkedin']
            if linkedin and not linkedin.startswith('https://linkedin.com/in/'):
                optimized['linkedin'] = f"https://linkedin.com/in/{linkedin.split('/')[-1]}"
        
        return optimized
    
    def _create_professional_summary(
        self, 
        resume_data: Dict, 
        job_requirements: Dict, 
        request: ResumeOptimizationRequest,
        industry: IndustryType = IndustryType.GENERAL
    ) -> str:
        """Create an optimized professional summary"""
        
        # Try AI-powered summary first
        if self.openai_enabled or self.gemini_enabled:
            try:
                return self._create_ai_summary(resume_data, job_requirements, request, industry)
            except Exception as e:
                print(f"AI summary failed: {e}")
        
        # Fallback to template-based summary
        return self._create_template_summary(resume_data, job_requirements, request, industry)
    
    def _create_ai_summary(
        self, 
        resume_data: Dict, 
        job_requirements: Dict, 
        request: ResumeOptimizationRequest,
        industry: IndustryType = IndustryType.GENERAL
    ) -> str:
        """Create professional summary using AI"""
        
        # Extract key information
        experience = resume_data.get('experience', [])
        skills = resume_data.get('skills', [])
        education = resume_data.get('education', [])
        
        # Get industry-specific context
        industry_profile = self.industry_analyzer.get_industry_profile(industry)
        
        prompt = f"""
        Create a professional summary for a resume targeting this role:
        
        TARGET ROLE: {request.target_job_title}
        COMPANY: {request.target_company or 'N/A'}
        INDUSTRY: {industry.value.title()} ({request.target_industry or 'N/A'})
        
        INDUSTRY CONTEXT:
        - Content Style: {industry_profile.content_style}
        - Key Focus Areas: {', '.join(industry_profile.achievement_focus[:5])}
        - Preferred Action Verbs: {', '.join(industry_profile.preferred_action_verbs[:8])}
        - Important Metrics: {', '.join(industry_profile.metric_types[:5])}
        
        CANDIDATE EXPERIENCE:
        {json.dumps(experience[:3], indent=2)}
        
        CANDIDATE SKILLS:
        {', '.join(skills[:10])}
        
        JOB REQUIREMENTS:
        Required Skills: {', '.join(job_requirements.get('required_skills', []))}
        Experience Level: {job_requirements.get('experience_level', 'N/A')}
        
        Create a compelling 3-4 sentence professional summary that:
        1. Highlights relevant experience and achievements using industry-appropriate language
        2. Matches the job requirements and keywords naturally
        3. Shows value proposition for the target role and industry
        4. Uses action-oriented language preferred in {industry.value} industry
        5. Is ATS-friendly with relevant keywords
        6. Reflects the {industry_profile.content_style} style appropriate for this industry
        7. Emphasizes {', '.join(industry_profile.achievement_focus[:3])} as key strengths
        
        Return only the professional summary text, no formatting or extra text.
        """
        
        try:
            if self.openai_enabled:
                response = self.openai_client.chat.completions.create(
                    model="gpt-4o",
                    messages=[
                        {"role": "system", "content": "You are an expert resume writer who creates compelling professional summaries that are both ATS-friendly and engaging to hiring managers."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=200
                )
                return response.choices[0].message.content.strip()
            
            elif self.gemini_enabled:
                response = self.gemini_model.generate_content(prompt)
                return response.text.strip()
                
        except Exception as e:
            print(f"AI summary generation failed: {e}")
            raise e
    
    def _create_template_summary(
        self, 
        resume_data: Dict, 
        job_requirements: Dict, 
        request: ResumeOptimizationRequest,
        industry: IndustryType = IndustryType.GENERAL
    ) -> str:
        """Create professional summary using templates"""
        
        experience = resume_data.get('experience', [])
        skills = resume_data.get('skills', [])
        
        # Calculate years of experience
        years_experience = len(experience)
        
        # Get relevant skills
        required_skills = job_requirements.get('required_skills', [])
        matching_skills = [skill for skill in skills if skill.lower() in [rs.lower() for rs in required_skills]]
        
        # Template summary
        experience_level = "Experienced" if years_experience >= 5 else "Results-driven"
        
        summary = f"{experience_level} {request.target_job_title} with {years_experience}+ years of experience in "
        
        if matching_skills:
            summary += f"{', '.join(matching_skills[:3])}. "
        else:
            summary += f"{', '.join(skills[:3])}. "
        
        summary += f"Proven track record of delivering high-quality solutions and driving business results. "
        summary += f"Seeking to leverage expertise in {request.target_industry or 'technology'} to contribute to {request.target_company or 'a dynamic organization'}."
        
        return summary
    
    def _optimize_skills_section(self, resume_data: Dict, job_requirements: Dict, industry: IndustryType = IndustryType.GENERAL) -> Dict:
        """Optimize skills section for ATS and relevance"""
        
        current_skills = resume_data.get('skills', [])
        required_skills = job_requirements.get('required_skills', [])
        preferred_skills = job_requirements.get('preferred_skills', [])
        
        # Categorize skills
        technical_skills = []
        soft_skills = []
        tools_frameworks = []
        
        for skill in current_skills:
            skill_lower = skill.lower()
            if any(tech in skill_lower for tech in ['python', 'java', 'javascript', 'sql', 'html', 'css']):
                technical_skills.append(skill)
            elif any(tool in skill_lower for tool in ['git', 'docker', 'kubernetes', 'aws', 'azure']):
                tools_frameworks.append(skill)
            else:
                soft_skills.append(skill)
        
        # Prioritize job-relevant skills
        prioritized_technical = self._prioritize_skills(technical_skills, required_skills + preferred_skills, industry)
        prioritized_tools = self._prioritize_skills(tools_frameworks, required_skills + preferred_skills, industry)
        
        return {
            "technical_skills": prioritized_technical[:8],
            "tools_frameworks": prioritized_tools[:6],
            "soft_skills": soft_skills[:4],
            "all_skills": current_skills  # Keep original for reference
        }
    
    def _prioritize_skills(self, skills: List[str], target_skills: List[str], industry: IndustryType = IndustryType.GENERAL) -> List[str]:
        """Prioritize skills based on job requirements and industry context"""
        
        # Get industry-specific skill weights
        industry_weights = self.industry_analyzer.calculate_skill_weights(skills, industry)
        
        # Create priority scores
        skill_scores = {}
        for skill in skills:
            score = 0
            skill_lower = skill.lower()
            
            # Higher score for exact matches
            for target in target_skills:
                if skill_lower == target.lower():
                    score += 10
                elif target.lower() in skill_lower or skill_lower in target.lower():
                    score += 5
            
            # Apply industry-specific weighting
            industry_weight = industry_weights.get(skill, 0.5)
            score *= industry_weight
            
            skill_scores[skill] = score
        
        # Sort by score, then alphabetically
        return sorted(skills, key=lambda x: (-skill_scores.get(x, 0), x))
    
    def _optimize_experience_section(
        self, 
        resume_data: Dict, 
        job_requirements: Dict, 
        request: ResumeOptimizationRequest,
        industry: IndustryType = IndustryType.GENERAL
    ) -> List[Dict]:
        """Optimize work experience section with AI-powered enhancement"""
        
        experience = resume_data.get('experience', [])
        optimized_experience = []
        
        for exp in experience:
            original_content = exp.get('content', '')
            
            # AI-optimize the job description with industry context
            optimized_description = self._optimize_job_description(original_content, job_requirements, industry)
            
            # Extract achievements
            achievements = self._extract_achievements(original_content)
            
            # Track keywords added during optimization
            keywords_added = self._identify_added_keywords(
                original_content, 
                optimized_description, 
                job_requirements
            )
            
            optimized_exp = {
                "company": exp.get('company', ''),
                "title": exp.get('title', ''),
                "dates": exp.get('dates', ''),
                "location": exp.get('location', ''),
                "description": optimized_description,
                "achievements": achievements,
                "keywords_added": keywords_added,
                "original_content": original_content,  # Keep for comparison
                "optimization_applied": True
            }
            
            optimized_experience.append(optimized_exp)
        
        return optimized_experience
    
    def _identify_added_keywords(self, original: str, optimized: List[str], job_requirements: Dict) -> List[str]:
        """Identify keywords that were added during optimization"""
        
        # Get all job requirement keywords
        all_job_keywords = []
        for key in ['required_skills', 'preferred_skills', 'technologies', 'tools']:
            all_job_keywords.extend(job_requirements.get(key, []))
        
        # Convert to lowercase for comparison
        job_keywords_lower = [kw.lower() for kw in all_job_keywords]
        original_lower = original.lower()
        optimized_text = ' '.join(optimized).lower()
        
        # Find keywords that appear in optimized version but not in original
        added_keywords = []
        for keyword in job_keywords_lower:
            if keyword in optimized_text and keyword not in original_lower:
                # Find the original casing from job_requirements
                original_keyword = next((kw for kw in all_job_keywords if kw.lower() == keyword), keyword)
                added_keywords.append(original_keyword)
        
        return added_keywords[:10]  # Limit to top 10
    
    def _optimize_job_description(self, description: str, job_requirements: Dict, industry: IndustryType = IndustryType.GENERAL) -> List[str]:
        """Optimize job description with AI-powered bullet point rewriting"""
        
        if not description:
            return []
        
        # Try AI-powered optimization first
        try:
            if self.openai_enabled or self.gemini_enabled:
                return self._ai_optimize_job_description(description, job_requirements, industry)
        except Exception as e:
            print(f"AI job description optimization failed: {e}")
        
        # Fallback to template-based optimization
        return self._template_optimize_job_description(description, job_requirements, industry)
    
    def _ai_optimize_job_description(self, description: str, job_requirements: Dict, industry: IndustryType = IndustryType.GENERAL) -> List[str]:
        """Use AI to intelligently rewrite job description bullet points"""
        
        # Extract key job requirements for context
        required_skills = job_requirements.get('required_skills', [])
        preferred_skills = job_requirements.get('preferred_skills', [])
        technologies = job_requirements.get('technologies', [])
        responsibilities = job_requirements.get('responsibilities', [])
        
        # Get industry-specific context
        industry_profile = self.industry_analyzer.get_industry_profile(industry)
        
        prompt = f"""
        Rewrite the following job experience description into 4-6 compelling bullet points that are optimized for the target job requirements and {industry.value} industry standards.

        ORIGINAL EXPERIENCE:
        {description}

        TARGET JOB REQUIREMENTS:
        - Required Skills: {', '.join(required_skills[:8])}
        - Preferred Skills: {', '.join(preferred_skills[:5])}
        - Technologies: {', '.join(technologies[:8])}
        - Key Responsibilities: {', '.join(responsibilities[:5])}

        INDUSTRY CONTEXT ({industry.value.upper()}):
        - Content Style: {industry_profile.content_style}
        - Preferred Action Verbs: {', '.join(industry_profile.preferred_action_verbs[:10])}
        - Key Achievement Areas: {', '.join(industry_profile.achievement_focus[:5])}
        - Typical Metrics: {', '.join(industry_profile.metric_types[:5])}

        REWRITING GUIDELINES:
        1. Start each bullet with strong action verbs preferred in {industry.value} industry
        2. Include relevant keywords from the job requirements naturally
        3. Quantify achievements using metrics typical for {industry.value} industry
        4. Focus on {', '.join(industry_profile.achievement_focus[:3])} as key value drivers
        5. Make each bullet point concise but impactful (1-2 lines max)
        6. Ensure bullets are ATS-friendly and readable
        7. Maintain truthfulness - enhance but don't fabricate
        8. Use {industry_profile.content_style} tone appropriate for this industry

        EXAMPLE FORMAT:
        • Developed scalable web applications using React and Node.js, improving user experience for 10,000+ users
        • Led cross-functional team of 5 engineers to deliver features 30% faster than previous sprints
        • Implemented automated testing frameworks, reducing bug reports by 45%

        Return only the bullet points, one per line, starting with •
        """
        
        try:
            if self.openai_enabled:
                response = self.openai_client.chat.completions.create(
                    model="gpt-4o",
                    messages=[
                        {"role": "system", "content": "You are an expert resume writer who specializes in creating compelling, ATS-optimized bullet points that highlight achievements and match job requirements."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=400
                )
                result = response.choices[0].message.content.strip()
                
            elif self.gemini_enabled:
                response = self.gemini_model.generate_content(prompt)
                result = response.text.strip()
            
            # Parse the AI response into bullet points
            bullet_points = []
            for line in result.split('\n'):
                line = line.strip()
                if line and (line.startswith('•') or line.startswith('-') or line.startswith('*')):
                    # Remove bullet character and clean up
                    cleaned_line = line.lstrip('•-*').strip()
                    if cleaned_line:
                        bullet_points.append(cleaned_line)
            
            return bullet_points[:6]  # Limit to 6 bullet points
            
        except Exception as e:
            print(f"AI job description optimization failed: {e}")
            raise e
    
    def _template_optimize_job_description(self, description: str, job_requirements: Dict, industry: IndustryType = IndustryType.GENERAL) -> List[str]:
        """Fallback template-based job description optimization"""
        
        # Split into sentences and clean
        sentences = [s.strip() for s in description.split('.') if s.strip()]
        
        # Get industry-specific context
        industry_profile = self.industry_analyzer.get_industry_profile(industry)
        
        # Convert to bullet points with industry-appropriate action verbs
        bullet_points = []
        action_verbs = industry_profile.preferred_action_verbs + self.ats_keywords["action_verbs"]
        required_skills = job_requirements.get('required_skills', [])
        
        for sentence in sentences[:6]:  # Limit to 6 bullet points
            # Ensure starts with action verb
            words = sentence.split()
            if words and words[0].lower() not in [av.lower() for av in action_verbs]:
                # Try to add an industry-appropriate action verb
                if any(verb in sentence.lower() for verb in ["manage", "develop", "create", "lead"]):
                    # Sentence already has action verb, just rephrase
                    pass
                else:
                    # Add action verb based on context and industry
                    if any(skill.lower() in sentence.lower() for skill in required_skills):
                        # Use industry-appropriate verb
                        preferred_verb = industry_profile.preferred_action_verbs[0] if industry_profile.preferred_action_verbs else "Utilized"
                        sentence = f"{preferred_verb} {sentence.lower()}"
                    else:
                        sentence = f"Contributed to {sentence.lower()}"
            
            bullet_points.append(sentence)
        
        return bullet_points
    
    def _extract_achievements(self, description: str) -> List[str]:
        """Extract and enhance quantifiable achievements from description"""
        
        if not description:
            return []
        
        # Try AI-powered achievement extraction first
        try:
            if self.openai_enabled or self.gemini_enabled:
                return self._ai_extract_achievements(description)
        except Exception as e:
            print(f"AI achievement extraction failed: {e}")
        
        # Fallback to pattern-based extraction
        return self._pattern_extract_achievements(description)
    
    def _ai_extract_achievements(self, description: str) -> List[str]:
        """Use AI to identify and enhance achievements"""
        
        prompt = f"""
        Analyze the following job experience description and identify the top 3 most impactful achievements. 
        If achievements have numbers, keep them. If not, suggest realistic quantifications based on the role.

        EXPERIENCE DESCRIPTION:
        {description}

        GUIDELINES:
        1. Focus on measurable results and impact
        2. If no numbers exist, suggest realistic estimates (e.g., "led team of 5", "improved efficiency by 20%")
        3. Prioritize business impact over tasks
        4. Keep each achievement concise (1 line)
        5. Use strong action verbs

        EXAMPLES:
        - Reduced system downtime by 40% through proactive monitoring
        - Led team of 8 developers to deliver project 2 weeks ahead of schedule
        - Increased user engagement by 25% through UI/UX improvements

        Return only the top 3 achievements, one per line, without bullet points.
        """
        
        try:
            if self.openai_enabled:
                response = self.openai_client.chat.completions.create(
                    model="gpt-4o",
                    messages=[
                        {"role": "system", "content": "You are an expert resume writer who specializes in identifying and quantifying professional achievements."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.6,
                    max_tokens=200
                )
                result = response.choices[0].message.content.strip()
                
            elif self.gemini_enabled:
                response = self.gemini_model.generate_content(prompt)
                result = response.text.strip()
            
            # Parse achievements from AI response
            achievements = []
            for line in result.split('\n'):
                line = line.strip()
                if line and not line.startswith('-') and not line.startswith('•'):
                    achievements.append(line)
            
            return achievements[:3]
            
        except Exception as e:
            print(f"AI achievement extraction failed: {e}")
            raise e
    
    def _pattern_extract_achievements(self, description: str) -> List[str]:
        """Fallback pattern-based achievement extraction"""
        
        achievements = []
        
        # Look for numbers and percentages
        number_patterns = [
            r'\d+%',  # Percentages
            r'\$\d+[KMB]?',  # Dollar amounts
            r'\d+\+?\s*(users?|customers?|clients?)',  # User counts
            r'\d+\+?\s*(projects?|applications?|systems?)',  # Project counts
            r'reduced?\s+.*?by\s+\d+%?',  # Reductions
            r'increased?\s+.*?by\s+\d+%?',  # Increases
            r'improved?\s+.*?by\s+\d+%?'  # Improvements
        ]
        
        for pattern in number_patterns:
            matches = re.findall(pattern, description, re.IGNORECASE)
            achievements.extend(matches)
        
        return achievements[:3]  # Limit to top 3
    
    def _optimize_education_section(self, education: List[Dict]) -> List[Dict]:
        """Optimize education section"""
        
        optimized_education = []
        
        for edu in education:
            optimized_edu = {
                "degree": edu.get('degree', ''),
                "school": edu.get('school', ''),
                "year": edu.get('year', ''),
                "gpa": edu.get('gpa', '') if self._safe_float(edu.get('gpa', 0)) >= 3.5 else '',  # Only show good GPAs
                "relevant_coursework": edu.get('relevant_coursework', []),
                "honors": edu.get('honors', [])
            }
            
            optimized_education.append(optimized_edu)
        
        return optimized_education
    
    def _integrate_projects_section(
        self, 
        resume_data: Dict, 
        generated_projects: List[Dict], 
        request: ResumeOptimizationRequest
    ) -> List[Dict]:
        """Integrate generated projects into resume"""
        
        if not request.include_projects:
            return []
        
        projects_section = []
        
        # Add existing projects
        existing_projects = resume_data.get('projects', [])
        for project in existing_projects[:2]:  # Limit existing projects
            projects_section.append({
                "name": project.get('name', ''),
                "description": project.get('description', ''),
                "technologies": project.get('technologies', []),
                "source": "existing"
            })
        
        # Add generated projects
        if generated_projects:
            for project in generated_projects[:2]:  # Limit generated projects
                projects_section.append({
                    "name": project.get('title', ''),
                    "description": project.get('description', ''),
                    "technologies": project.get('technologies_used', []),
                    "key_features": project.get('deliverables', [])[:3],
                    "source": "generated"
                })
        
        return projects_section
    
    def _determine_section_order(self, request: ResumeOptimizationRequest, optimization_strategy: Dict = None) -> List[str]:
        """Determine optimal section order based on optimization focus"""
        
        base_order = ["personal_info", "professional_summary"]
        
        # Use industry-specific section priorities if available
        if optimization_strategy and 'section_priorities' in optimization_strategy:
            industry_priorities = optimization_strategy['section_priorities']
            # Map industry sections to our section names
            section_mapping = {
                'technical_skills': 'skills_section',
                'experience': 'experience_section',
                'projects': 'projects_section',
                'certifications': 'education_section',
                'education': 'education_section',
                'skills': 'skills_section',
                'achievements': 'experience_section'
            }
            
            # Add sections based on industry priorities
            for priority in industry_priorities:
                if priority in section_mapping:
                    mapped_section = section_mapping[priority]
                    if mapped_section not in base_order:
                        base_order.append(mapped_section)
            
            # Add any remaining sections
            all_sections = ["experience_section", "skills_section", "education_section", "projects_section"]
            for section in all_sections:
                if section not in base_order:
                    base_order.append(section)
        else:
            # Fallback to optimization focus-based ordering
            if request.optimization_focus == "technical":
                base_order.extend(["skills_section", "projects_section", "experience_section", "education_section"])
            elif request.optimization_focus == "executive":
                base_order.extend(["experience_section", "education_section", "skills_section"])
            else:  # ats, creative
                base_order.extend(["experience_section", "skills_section", "education_section", "projects_section"])
        
        return base_order
    
    def _calculate_ats_score(self, optimized_data: Dict, job_requirements: Dict) -> float:
        """Calculate ATS compatibility score"""
        
        score = 0.0
        max_score = 100.0
        
        # Check for required keywords
        required_skills = job_requirements.get('required_skills', [])
        skills_text = ' '.join(optimized_data.get('skills_section', {}).get('all_skills', []))
        
        keyword_matches = 0
        for skill in required_skills:
            if skill.lower() in skills_text.lower():
                keyword_matches += 1
        
        if required_skills:
            score += (keyword_matches / len(required_skills)) * 40  # 40% for keyword matching
        
        # Check for action verbs in experience
        experience_text = ''
        for exp in optimized_data.get('experience_section', []):
            experience_text += ' '.join(exp.get('description', []))
        
        action_verb_count = 0
        for verb in self.ats_keywords["action_verbs"][:10]:
            if verb.lower() in experience_text.lower():
                action_verb_count += 1
        
        score += min(action_verb_count * 3, 30)  # 30% for action verbs
        
        # Check for quantified achievements
        if any('achievements' in exp and exp['achievements'] for exp in optimized_data.get('experience_section', [])):
            score += 20  # 20% for quantified achievements
        
        # Check section structure
        if optimized_data.get('professional_summary'):
            score += 10  # 10% for professional summary
        
        return min(score, max_score) / max_score
    
    def _calculate_keyword_density(self, optimized_data: Dict, job_requirements: Dict) -> Dict[str, int]:
        """Calculate keyword density for job requirements"""
        
        # Combine all text content
        all_text = ''
        all_text += optimized_data.get('professional_summary', '') + ' '
        
        for exp in optimized_data.get('experience_section', []):
            all_text += ' '.join(exp.get('description', [])) + ' '
        
        all_text += ' '.join(optimized_data.get('skills_section', {}).get('all_skills', []))
        
        all_text = all_text.lower()
        
        # Count keywords
        keyword_counts = {}
        required_skills = job_requirements.get('required_skills', [])
        
        for skill in required_skills:
            count = all_text.count(skill.lower())
            if count > 0:
                keyword_counts[skill] = count
        
        return keyword_counts
    
    def _generate_optimization_notes(self, optimized_data: Dict, request: ResumeOptimizationRequest) -> List[str]:
        """Generate optimization notes and suggestions"""
        
        notes = []
        
        # Check professional summary
        summary = optimized_data.get('professional_summary', '')
        if len(summary) < 100:
            notes.append("Consider expanding professional summary to 3-4 sentences")
        
        # Check experience bullet points
        for exp in optimized_data.get('experience_section', []):
            if len(exp.get('description', [])) < 3:
                notes.append(f"Add more bullet points for {exp.get('title', 'position')}")
        
        # Check skills organization
        skills = optimized_data.get('skills_section', {})
        if len(skills.get('technical_skills', [])) < 5:
            notes.append("Consider adding more technical skills relevant to the role")
        
        # ATS optimization notes
        if request.optimization_focus == "ats":
            notes.append("Resume optimized for ATS systems - avoid fancy formatting when submitting")
            notes.append("Ensure to save as PDF with text-selectable format")
        
        return notes
    
    def _track_improvements(self, original_data: Dict, optimized_data: Dict) -> List[str]:
        """Track what improvements were made during optimization"""
        
        improvements = []
        
        # Check if professional summary was added/improved
        if not original_data.get('summary') and optimized_data.get('professional_summary'):
            improvements.append("Generated AI-powered professional summary tailored to job requirements")
        elif original_data.get('summary') != optimized_data.get('professional_summary'):
            improvements.append("Enhanced professional summary with job-relevant keywords")
        
        # Check if skills were reorganized
        original_skills = len(original_data.get('skills', []))
        optimized_skills = len(optimized_data.get('skills_section', {}).get('all_skills', []))
        if optimized_skills != original_skills:
            improvements.append("Reorganized skills section by relevance to job requirements")
        
        # Check experience improvements
        experience_section = optimized_data.get('experience_section', [])
        total_keywords_added = 0
        ai_optimized_count = 0
        
        for exp in experience_section:
            if exp.get('optimization_applied'):
                ai_optimized_count += 1
            total_keywords_added += len(exp.get('keywords_added', []))
        
        if ai_optimized_count > 0:
            improvements.append(f"AI-rewritten {ai_optimized_count} experience sections with stronger action verbs and impact focus")
        
        if total_keywords_added > 0:
            improvements.append(f"Added {total_keywords_added} job-relevant keywords throughout experience descriptions")
        
        # Check for quantified achievements
        achievements_count = sum(len(exp.get('achievements', [])) for exp in experience_section)
        if achievements_count > 0:
            improvements.append(f"Identified and highlighted {achievements_count} quantifiable achievements")
        
        # Check for projects integration
        projects_section = optimized_data.get('projects_section', [])
        if projects_section:
            improvements.append(f"Integrated {len(projects_section)} relevant projects to demonstrate missing skills")
        
        # Always add ATS optimization
        improvements.append("Optimized content for ATS compatibility and keyword density")
        
        # Check section ordering
        section_order = optimized_data.get('section_order', [])
        if section_order:
            improvements.append("Reordered resume sections for maximum impact")
        
        return improvements
    
    def _safe_float(self, value) -> float:
        """Safely convert value to float"""
        try:
            return float(value) if value else 0.0
        except (ValueError, TypeError):
            return 0.0