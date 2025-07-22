import re
from typing import Dict, List, Optional
from pydantic import BaseModel
from openai import OpenAI
import google.generativeai as genai
from app.core.config import settings

class JobRequirements(BaseModel):
    """Structured job requirements data model"""
    required_skills: List[str] = []
    preferred_skills: List[str] = []
    required_experience_years: Optional[int] = None
    experience_level: str = "entry"  # entry, mid, senior, executive
    technologies: List[str] = []
    programming_languages: List[str] = []
    frameworks: List[str] = []
    databases: List[str] = []
    cloud_platforms: List[str] = []
    tools: List[str] = []
    certifications: List[str] = []
    education_requirements: List[str] = []
    responsibilities: List[str] = []
    company_size: Optional[str] = None
    industry: Optional[str] = None
    work_location: Optional[str] = None  # remote, hybrid, onsite
    salary_range: Optional[str] = None

class JobAnalyzerService:
    """Service for analyzing job descriptions and extracting requirements"""
    
    def __init__(self):
        # Initialize OpenAI
        if settings.OPENAI_API_KEY:
            self.openai_client = OpenAI(api_key=settings.OPENAI_API_KEY)
            self.openai_enabled = True
        else:
            self.openai_client = None
            self.openai_enabled = False
        
        # Initialize Gemini
        if settings.GEMINI_API_KEY:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self.gemini_model = genai.GenerativeModel('gemini-1.5-flash')
            self.gemini_enabled = True
        else:
            self.gemini_model = None
            self.gemini_enabled = False
    
    def clean_job_description(self, job_description: str) -> str:
        """Clean and normalize job description text"""
        # Remove excessive whitespace
        cleaned = re.sub(r'\s+', ' ', job_description.strip())
        
        # Remove common irrelevant sections
        patterns_to_remove = [
            r'apply now.*?$',
            r'submit.*?resume.*?$',
            r'equal opportunity employer.*?$',
            r'we are an equal.*?$'
        ]
        
        for pattern in patterns_to_remove:
            cleaned = re.sub(pattern, '', cleaned, flags=re.IGNORECASE | re.MULTILINE)
        
        return cleaned.strip()
    
    def extract_basic_requirements(self, job_description: str) -> JobRequirements:
        """Extract basic requirements using rule-based parsing"""
        requirements = JobRequirements()
        text = job_description.lower()
        
        # Extract experience level
        if any(term in text for term in ['senior', 'sr.', 'lead', 'principal']):
            requirements.experience_level = "senior"
        elif any(term in text for term in ['mid-level', 'intermediate', '3+ years', '4+ years']):
            requirements.experience_level = "mid"
        elif any(term in text for term in ['entry', 'junior', 'new grad', 'recent graduate']):
            requirements.experience_level = "entry"
        
        # Extract years of experience
        exp_patterns = [
            r'(\d+)\+?\s*years?\s*(?:of\s*)?experience',
            r'(\d+)\+?\s*years?\s*(?:in|with)',
            r'minimum\s*(\d+)\s*years?',
            r'(\d+)\+\s*years?'
        ]
        for pattern in exp_patterns:
            match = re.search(pattern, text)
            if match:
                requirements.required_experience_years = int(match.group(1))
                break
        
        # Extract programming languages
        prog_languages = [
            'python', 'javascript', 'java', 'c++', 'c#', 'php', 'ruby', 'go', 'rust',
            'typescript', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'sql'
        ]
        for lang in prog_languages:
            if lang in text:
                requirements.programming_languages.append(lang.title())
        
        # Extract frameworks
        frameworks = [
            'react', 'angular', 'vue', 'nodejs', 'express', 'django', 'flask',
            'spring', 'rails', 'laravel', 'fastapi', 'nextjs', 'nuxt'
        ]
        for framework in frameworks:
            if framework in text or framework.replace('js', '.js') in text:
                requirements.frameworks.append(framework.title())
        
        # Extract databases
        databases = [
            'postgresql', 'mysql', 'mongodb', 'redis', 'sqlite', 'oracle',
            'cassandra', 'elasticsearch', 'dynamodb'
        ]
        for db in databases:
            if db in text:
                requirements.databases.append(db.title())
        
        # Extract cloud platforms
        cloud_platforms = ['aws', 'azure', 'gcp', 'google cloud', 'heroku', 'digitalocean']
        for platform in cloud_platforms:
            if platform in text:
                requirements.cloud_platforms.append(platform.upper() if platform in ['aws', 'gcp'] else platform.title())
        
        # Extract tools
        tools = [
            'git', 'docker', 'kubernetes', 'jenkins', 'terraform', 'ansible',
            'jira', 'confluence', 'slack', 'figma', 'postman'
        ]
        for tool in tools:
            if tool in text:
                requirements.tools.append(tool.title())
        
        # Extract work location
        if any(term in text for term in ['remote', 'work from home', 'wfh']):
            requirements.work_location = "remote"
        elif any(term in text for term in ['hybrid', 'flexible']):
            requirements.work_location = "hybrid"
        elif any(term in text for term in ['on-site', 'onsite', 'office']):
            requirements.work_location = "onsite"
        
        return requirements
    
    def analyze_with_openai(self, job_description: str) -> JobRequirements:
        """Analyze job description using OpenAI API"""
        if not self.openai_enabled:
            raise ValueError("OpenAI API key not configured")
        
        prompt = f"""
        Analyze the following job description and extract structured information. Return the data in JSON format with the following structure:

        {{
            "required_skills": ["skill1", "skill2", ...],
            "preferred_skills": ["skill1", "skill2", ...],
            "required_experience_years": number or null,
            "experience_level": "entry|mid|senior|executive",
            "technologies": ["tech1", "tech2", ...],
            "programming_languages": ["lang1", "lang2", ...],
            "frameworks": ["framework1", "framework2", ...],
            "databases": ["db1", "db2", ...],
            "cloud_platforms": ["platform1", "platform2", ...],
            "tools": ["tool1", "tool2", ...],
            "certifications": ["cert1", "cert2", ...],
            "education_requirements": ["requirement1", "requirement2", ...],
            "responsibilities": ["responsibility1", "responsibility2", ...],
            "company_size": "startup|small|medium|large|enterprise" or null,
            "industry": "industry name" or null,
            "work_location": "remote|hybrid|onsite" or null,
            "salary_range": "salary range" or null
        }}

        Focus on extracting:
        1. Technical skills (required vs preferred)
        2. Programming languages and frameworks
        3. Years of experience and seniority level
        4. Education requirements
        5. Key responsibilities
        6. Company and role context

        Job Description:
        {job_description}
        """
        
        try:
            response = self.openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are an expert at analyzing job descriptions and extracting structured requirements data. Always return valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                max_tokens=2000
            )
            
            # Parse the JSON response
            import json
            result_text = response.choices[0].message.content.strip()
            
            # Remove any markdown formatting
            if result_text.startswith('```json'):
                result_text = result_text[7:]
            if result_text.endswith('```'):
                result_text = result_text[:-3]
            
            result_data = json.loads(result_text)
            return JobRequirements(**result_data)
            
        except Exception as e:
            print(f"OpenAI analysis failed: {e}")
            raise e  # Re-raise to trigger Gemini fallback
    
    def analyze_with_gemini(self, job_description: str) -> JobRequirements:
        """Analyze job description using Gemini API"""
        if not self.gemini_enabled:
            raise ValueError("Gemini API key not configured")
        
        prompt = f"""
        Analyze the following job description and extract structured information. Return the data in JSON format with the following structure:

        {{
            "required_skills": ["skill1", "skill2", ...],
            "preferred_skills": ["skill1", "skill2", ...],
            "required_experience_years": number or null,
            "experience_level": "entry|mid|senior|executive",
            "technologies": ["tech1", "tech2", ...],
            "programming_languages": ["lang1", "lang2", ...],
            "frameworks": ["framework1", "framework2", ...],
            "databases": ["db1", "db2", ...],
            "cloud_platforms": ["platform1", "platform2", ...],
            "tools": ["tool1", "tool2", ...],
            "certifications": ["cert1", "cert2", ...],
            "education_requirements": ["requirement1", "requirement2", ...],
            "responsibilities": ["responsibility1", "responsibility2", ...],
            "company_size": "startup|small|medium|large|enterprise" or null,
            "industry": "industry name" or null,
            "work_location": "remote|hybrid|onsite" or null,
            "salary_range": "salary range" or null
        }}

        Focus on extracting:
        1. Technical skills (required vs preferred)
        2. Programming languages and frameworks
        3. Years of experience and seniority level
        4. Education requirements
        5. Key responsibilities
        6. Company and role context

        Job Description:
        {job_description}
        """
        
        try:
            response = self.gemini_model.generate_content(prompt)
            
            # Parse the JSON response
            import json
            result_text = response.text.strip()
            
            # Clean any Unicode characters that might cause issues
            result_text = result_text.encode('ascii', 'ignore').decode('ascii')
            
            # Remove any markdown formatting
            if result_text.startswith('```json'):
                result_text = result_text[7:]
            if result_text.endswith('```'):
                result_text = result_text[:-3]
            
            result_data = json.loads(result_text)
            return JobRequirements(**result_data)
            
        except Exception as e:
            print(f"Gemini analysis failed: {e}")
            raise e  # Re-raise to trigger rule-based fallback
    
    def validate_requirements(self, requirements: JobRequirements) -> JobRequirements:
        """Validate and clean extracted requirements"""
        # Remove duplicates
        requirements.required_skills = list(set(requirements.required_skills))
        requirements.preferred_skills = list(set(requirements.preferred_skills))
        requirements.technologies = list(set(requirements.technologies))
        requirements.programming_languages = list(set(requirements.programming_languages))
        requirements.frameworks = list(set(requirements.frameworks))
        requirements.databases = list(set(requirements.databases))
        requirements.cloud_platforms = list(set(requirements.cloud_platforms))
        requirements.tools = list(set(requirements.tools))
        
        # Validate experience level
        if requirements.experience_level not in ["entry", "mid", "senior", "executive"]:
            requirements.experience_level = "entry"
        
        # Validate experience years
        if requirements.required_experience_years and requirements.required_experience_years < 0:
            requirements.required_experience_years = None
        
        return requirements
    
    def analyze_job_description(self, job_description: str) -> JobRequirements:
        """Main method to analyze job description and return structured requirements"""
        if not job_description or not job_description.strip():
            raise ValueError("Job description cannot be empty")
        
        # Clean the job description
        cleaned_description = self.clean_job_description(job_description)
        
        # Try AI analysis with fallback chain: OpenAI -> Gemini -> Rule-based
        try:
            if self.openai_enabled:
                print("Attempting OpenAI analysis...")
                requirements = self.analyze_with_openai(cleaned_description)
                print("SUCCESS: OpenAI analysis successful")
            elif self.gemini_enabled:
                print("Attempting Gemini analysis...")
                requirements = self.analyze_with_gemini(cleaned_description)
                print("SUCCESS: Gemini analysis successful")
            else:
                print("Using rule-based analysis...")
                requirements = self.extract_basic_requirements(cleaned_description)
        except Exception as openai_error:
            print(f"OpenAI failed: {openai_error}")
            try:
                if self.gemini_enabled:
                    print("Falling back to Gemini analysis...")
                    requirements = self.analyze_with_gemini(cleaned_description)
                    print("SUCCESS: Gemini fallback successful")
                else:
                    print("Falling back to rule-based analysis...")
                    requirements = self.extract_basic_requirements(cleaned_description)
            except Exception as gemini_error:
                print(f"Gemini failed: {gemini_error}")
                print("Using rule-based analysis as final fallback...")
                requirements = self.extract_basic_requirements(cleaned_description)
        
        # Validate and clean results
        requirements = self.validate_requirements(requirements)
        
        return requirements
    
    def get_confidence_score(self, requirements: JobRequirements) -> float:
        """Calculate confidence score for extracted requirements"""
        score = 0.0
        max_score = 10.0
        
        # Score based on completeness
        if requirements.required_skills:
            score += 1.0
        if requirements.programming_languages:
            score += 1.0
        if requirements.experience_level != "entry":
            score += 1.0
        if requirements.required_experience_years:
            score += 1.0
        if requirements.technologies:
            score += 1.0
        if requirements.frameworks:
            score += 1.0
        if requirements.responsibilities:
            score += 2.0
        if requirements.education_requirements:
            score += 1.0
        if requirements.work_location:
            score += 1.0
        
        return min(score / max_score, 1.0)