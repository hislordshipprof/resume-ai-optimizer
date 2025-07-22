"""Real-Time Resume Optimization Service for live feedback and suggestions"""
import re
import json
from typing import Dict, List, Optional, Tuple, Any
from datetime import datetime
from pydantic import BaseModel
from openai import OpenAI
import google.generativeai as genai

from app.core.config import settings
from app.services.industry_analyzer import IndustryAnalyzerService, IndustryType
from app.services.resume_optimizer import ResumeOptimizerService

class OptimizationSuggestion(BaseModel):
    """Individual optimization suggestion"""
    id: str
    type: str  # "content", "structure", "keyword", "achievement", "style"
    priority: str  # "high", "medium", "low"
    title: str
    description: str
    original_text: str
    suggested_text: str
    explanation: str
    impact_score: float  # 0.0 to 1.0
    section: str  # "summary", "experience", "skills", "education"
    auto_apply: bool = False

class RealTimeOptimizationResult(BaseModel):
    """Real-time optimization result"""
    suggestions: List[OptimizationSuggestion]
    overall_score: float
    ats_score: float
    keyword_density: Dict[str, int]
    industry_alignment: float
    improvement_areas: List[str]
    strengths: List[str]
    quick_wins: List[str]
    processing_time_ms: int

class ContentChangeEvent(BaseModel):
    """Content change event for real-time analysis"""
    section: str
    field: str
    old_value: str
    new_value: str
    cursor_position: int
    timestamp: datetime

class RealTimeOptimizerService:
    """Service for real-time resume optimization and suggestions"""
    
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
        
        # Initialize other services
        self.industry_analyzer = IndustryAnalyzerService()
        self.resume_optimizer = ResumeOptimizerService()
        
        # Cache for optimization results
        self.suggestion_cache = {}
        
    def analyze_content_change(
        self, 
        change_event: ContentChangeEvent,
        current_resume: Dict,
        job_requirements: Dict,
        industry: IndustryType = IndustryType.GENERAL
    ) -> RealTimeOptimizationResult:
        """Analyze content change and provide real-time suggestions"""
        
        start_time = datetime.now()
        
        # Generate cache key
        cache_key = self._generate_cache_key(change_event, current_resume, job_requirements)
        
        # Check cache first
        if cache_key in self.suggestion_cache:
            cached_result = self.suggestion_cache[cache_key]
            cached_result.processing_time_ms = 50  # Cache hit time
            return cached_result
        
        suggestions = []
        
        # Analyze the specific change
        if change_event.section == "summary":
            suggestions.extend(self._analyze_summary_change(change_event, job_requirements, industry))
        elif change_event.section == "experience":
            suggestions.extend(self._analyze_experience_change(change_event, job_requirements, industry))
        elif change_event.section == "skills":
            suggestions.extend(self._analyze_skills_change(change_event, job_requirements, industry))
        
        # Generate contextual suggestions
        suggestions.extend(self._generate_contextual_suggestions(current_resume, job_requirements, industry))
        
        # Calculate scores
        overall_score = self._calculate_overall_score(current_resume, job_requirements, industry)
        ats_score = self._calculate_ats_score(current_resume, job_requirements)
        keyword_density = self._calculate_keyword_density(current_resume, job_requirements)
        industry_alignment = self._calculate_industry_alignment(current_resume, industry)
        
        # Generate improvement insights
        improvement_areas = self._identify_improvement_areas(current_resume, job_requirements, industry)
        strengths = self._identify_strengths(current_resume, job_requirements, industry)
        quick_wins = self._identify_quick_wins(suggestions)
        
        # Sort suggestions by priority and impact
        suggestions.sort(key=lambda x: (x.priority == "high", x.impact_score), reverse=True)
        
        result = RealTimeOptimizationResult(
            suggestions=suggestions[:10],  # Limit to top 10
            overall_score=overall_score,
            ats_score=ats_score,
            keyword_density=keyword_density,
            industry_alignment=industry_alignment,
            improvement_areas=improvement_areas,
            strengths=strengths,
            quick_wins=quick_wins,
            processing_time_ms=int((datetime.now() - start_time).total_seconds() * 1000)
        )
        
        # Cache the result
        self.suggestion_cache[cache_key] = result
        
        return result
    
    def _analyze_summary_change(
        self, 
        change_event: ContentChangeEvent,
        job_requirements: Dict,
        industry: IndustryType
    ) -> List[OptimizationSuggestion]:
        """Analyze changes to professional summary"""
        
        suggestions = []
        new_text = change_event.new_value
        
        # Check length
        if len(new_text) < 100:
            suggestions.append(OptimizationSuggestion(
                id=f"summary_length_{datetime.now().timestamp()}",
                type="content",
                priority="medium",
                title="Expand Professional Summary",
                description="Professional summary should be 3-4 sentences (150-200 words)",
                original_text=new_text,
                suggested_text=f"{new_text} [Add more details about your experience and achievements]",
                explanation="A comprehensive summary helps ATS systems and recruiters quickly understand your value proposition",
                impact_score=0.6,
                section="summary",
                auto_apply=False
            ))
        
        # Check for industry-specific keywords
        industry_profile = self.industry_analyzer.get_industry_profile(industry)
        missing_keywords = []
        
        for keyword in industry_profile.key_skills[:5]:
            if keyword.lower() not in new_text.lower():
                missing_keywords.append(keyword)
        
        if missing_keywords:
            suggestions.append(OptimizationSuggestion(
                id=f"summary_keywords_{datetime.now().timestamp()}",
                type="keyword",
                priority="high",
                title="Add Industry Keywords",
                description=f"Include relevant {industry.value} industry keywords",
                original_text=new_text,
                suggested_text=f"{new_text} [Consider adding: {', '.join(missing_keywords[:3])}]",
                explanation=f"These keywords are important for {industry.value} roles and will improve ATS compatibility",
                impact_score=0.8,
                section="summary",
                auto_apply=False
            ))
        
        # Check for quantified achievements
        if not re.search(r'\d+', new_text):
            suggestions.append(OptimizationSuggestion(
                id=f"summary_quantify_{datetime.now().timestamp()}",
                type="achievement",
                priority="high",
                title="Add Quantified Achievements",
                description="Include specific numbers and metrics in your summary",
                original_text=new_text,
                suggested_text=f"{new_text} [Add specific numbers like: 'X years experience', 'Y% improvement', 'Z projects completed']",
                explanation="Quantified achievements make your summary more compelling and memorable",
                impact_score=0.7,
                section="summary",
                auto_apply=False
            ))
        
        return suggestions
    
    def _analyze_experience_change(
        self, 
        change_event: ContentChangeEvent,
        job_requirements: Dict,
        industry: IndustryType
    ) -> List[OptimizationSuggestion]:
        """Analyze changes to experience section"""
        
        suggestions = []
        new_text = change_event.new_value
        
        # Check for action verbs
        industry_profile = self.industry_analyzer.get_industry_profile(industry)
        preferred_verbs = industry_profile.preferred_action_verbs
        
        sentences = new_text.split('.')
        weak_starts = []
        
        for sentence in sentences:
            sentence = sentence.strip()
            if sentence:
                words = sentence.split()
                if words and words[0].lower() not in [verb.lower() for verb in preferred_verbs]:
                    weak_starts.append(sentence)
        
        if weak_starts:
            suggestions.append(OptimizationSuggestion(
                id=f"experience_verbs_{datetime.now().timestamp()}",
                type="content",
                priority="high",
                title="Use Strong Action Verbs",
                description=f"Start bullet points with strong action verbs preferred in {industry.value}",
                original_text=new_text,
                suggested_text=f"Consider starting sentences with: {', '.join(preferred_verbs[:5])}",
                explanation=f"Strong action verbs are crucial for {industry.value} resumes and demonstrate proactive leadership",
                impact_score=0.8,
                section="experience",
                auto_apply=False
            ))
        
        # Check bullet point count
        bullet_count = len([line for line in new_text.split('\n') if line.strip().startswith('•') or line.strip().startswith('-')])
        if bullet_count < 3:
            suggestions.append(OptimizationSuggestion(
                id=f"experience_bullets_{datetime.now().timestamp()}",
                type="structure",
                priority="medium",
                title="Add More Bullet Points",
                description="Each role should have 3-5 bullet points highlighting key achievements",
                original_text=new_text,
                suggested_text=f"{new_text}\n• [Add another achievement or responsibility]",
                explanation="More bullet points provide better coverage of your experience and impact",
                impact_score=0.6,
                section="experience",
                auto_apply=False
            ))
        
        return suggestions
    
    def _analyze_skills_change(
        self, 
        change_event: ContentChangeEvent,
        job_requirements: Dict,
        industry: IndustryType
    ) -> List[OptimizationSuggestion]:
        """Analyze changes to skills section"""
        
        suggestions = []
        new_text = change_event.new_value
        
        # Extract current skills
        current_skills = [skill.strip() for skill in new_text.split(',')]
        
        # Check for missing required skills
        required_skills = job_requirements.get('required_skills', [])
        missing_skills = []
        
        for required_skill in required_skills:
            if not any(required_skill.lower() in skill.lower() for skill in current_skills):
                missing_skills.append(required_skill)
        
        if missing_skills:
            suggestions.append(OptimizationSuggestion(
                id=f"skills_missing_{datetime.now().timestamp()}",
                type="keyword",
                priority="high",
                title="Add Required Skills",
                description="Include skills that are specifically required for this role",
                original_text=new_text,
                suggested_text=f"{new_text}, {', '.join(missing_skills[:3])}",
                explanation="Adding required skills improves your match percentage and ATS compatibility",
                impact_score=0.9,
                section="skills",
                auto_apply=True
            ))
        
        # Check skill organization
        if ',' in new_text and not any(category in new_text.lower() for category in ['technical', 'programming', 'frameworks']):
            suggestions.append(OptimizationSuggestion(
                id=f"skills_organize_{datetime.now().timestamp()}",
                type="structure",
                priority="medium",
                title="Organize Skills by Category",
                description="Group skills into categories (Technical, Programming, Frameworks, etc.)",
                original_text=new_text,
                suggested_text="Technical Skills: [programming languages]\nFrameworks: [frameworks]\nTools: [tools]",
                explanation="Organized skills are easier to scan and more professional",
                impact_score=0.5,
                section="skills",
                auto_apply=False
            ))
        
        return suggestions
    
    def _generate_contextual_suggestions(
        self,
        current_resume: Dict,
        job_requirements: Dict,
        industry: IndustryType
    ) -> List[OptimizationSuggestion]:
        """Generate contextual suggestions based on overall resume analysis"""
        
        suggestions = []
        
        # Check overall keyword density
        all_text = str(current_resume).lower()
        required_keywords = job_requirements.get('required_skills', [])
        
        low_density_keywords = []
        for keyword in required_keywords:
            if all_text.count(keyword.lower()) < 2:
                low_density_keywords.append(keyword)
        
        if low_density_keywords:
            suggestions.append(OptimizationSuggestion(
                id=f"context_keywords_{datetime.now().timestamp()}",
                type="keyword",
                priority="high",
                title="Increase Keyword Density",
                description="Some required keywords appear infrequently in your resume",
                original_text="",
                suggested_text=f"Consider mentioning these keywords more: {', '.join(low_density_keywords[:3])}",
                explanation="Higher keyword density improves ATS ranking and shows deeper expertise",
                impact_score=0.7,
                section="overall",
                auto_apply=False
            ))
        
        return suggestions
    
    def _calculate_overall_score(
        self,
        current_resume: Dict,
        job_requirements: Dict,
        industry: IndustryType
    ) -> float:
        """Calculate overall resume optimization score"""
        
        score = 0.0
        
        # Keyword matching (40%)
        all_text = str(current_resume).lower()
        required_keywords = job_requirements.get('required_skills', [])
        
        if required_keywords:
            matched_keywords = sum(1 for keyword in required_keywords if keyword.lower() in all_text)
            keyword_score = matched_keywords / len(required_keywords)
            score += keyword_score * 0.4
        
        # Content quality (30%)
        content_score = 0.7  # Base score, would be calculated based on content analysis
        score += content_score * 0.3
        
        # Industry alignment (20%)
        industry_score = self._calculate_industry_alignment(current_resume, industry)
        score += industry_score * 0.2
        
        # Structure and formatting (10%)
        structure_score = 0.8  # Base score, would be calculated based on structure analysis
        score += structure_score * 0.1
        
        return min(score, 1.0)
    
    def _calculate_ats_score(self, current_resume: Dict, job_requirements: Dict) -> float:
        """Calculate ATS compatibility score"""
        
        score = 0.0
        
        # Keyword presence
        all_text = str(current_resume).lower()
        required_keywords = job_requirements.get('required_skills', [])
        
        if required_keywords:
            matched_keywords = sum(1 for keyword in required_keywords if keyword.lower() in all_text)
            score += (matched_keywords / len(required_keywords)) * 0.6
        
        # Structure elements
        has_summary = bool(current_resume.get('summary') or current_resume.get('professional_summary'))
        has_experience = bool(current_resume.get('experience'))
        has_skills = bool(current_resume.get('skills'))
        
        structure_score = sum([has_summary, has_experience, has_skills]) / 3
        score += structure_score * 0.4
        
        return min(score, 1.0)
    
    def _calculate_keyword_density(self, current_resume: Dict, job_requirements: Dict) -> Dict[str, int]:
        """Calculate keyword density for job requirements"""
        
        all_text = str(current_resume).lower()
        required_keywords = job_requirements.get('required_skills', [])
        
        keyword_density = {}
        for keyword in required_keywords:
            count = all_text.count(keyword.lower())
            if count > 0:
                keyword_density[keyword] = count
        
        return keyword_density
    
    def _calculate_industry_alignment(self, current_resume: Dict, industry: IndustryType) -> float:
        """Calculate industry alignment score"""
        
        if industry == IndustryType.GENERAL:
            return 0.7  # Neutral score for general industry
        
        industry_profile = self.industry_analyzer.get_industry_profile(industry)
        all_text = str(current_resume).lower()
        
        # Check for industry-specific keywords
        industry_keywords = industry_profile.key_skills + industry_profile.technical_skills
        matched_keywords = sum(1 for keyword in industry_keywords if keyword.lower() in all_text)
        
        if industry_keywords:
            return min(matched_keywords / len(industry_keywords), 1.0)
        
        return 0.5
    
    def _identify_improvement_areas(
        self,
        current_resume: Dict,
        job_requirements: Dict,
        industry: IndustryType
    ) -> List[str]:
        """Identify key areas for improvement"""
        
        areas = []
        
        # Check keyword coverage
        all_text = str(current_resume).lower()
        required_keywords = job_requirements.get('required_skills', [])
        
        if required_keywords:
            matched_keywords = sum(1 for keyword in required_keywords if keyword.lower() in all_text)
            if matched_keywords / len(required_keywords) < 0.7:
                areas.append("Keyword optimization")
        
        # Check quantified achievements
        if not re.search(r'\d+', str(current_resume)):
            areas.append("Quantified achievements")
        
        # Check industry alignment
        if self._calculate_industry_alignment(current_resume, industry) < 0.6:
            areas.append("Industry-specific content")
        
        return areas
    
    def _identify_strengths(
        self,
        current_resume: Dict,
        job_requirements: Dict,
        industry: IndustryType
    ) -> List[str]:
        """Identify resume strengths"""
        
        strengths = []
        
        # Check for comprehensive sections
        if current_resume.get('summary') or current_resume.get('professional_summary'):
            strengths.append("Professional summary")
        
        if current_resume.get('experience'):
            strengths.append("Experience section")
        
        if current_resume.get('skills'):
            strengths.append("Skills section")
        
        # Check for quantified content
        if re.search(r'\d+', str(current_resume)):
            strengths.append("Quantified achievements")
        
        return strengths
    
    def _identify_quick_wins(self, suggestions: List[OptimizationSuggestion]) -> List[str]:
        """Identify quick wins from suggestions"""
        
        quick_wins = []
        
        for suggestion in suggestions:
            if suggestion.auto_apply or (suggestion.impact_score > 0.7 and suggestion.priority == "high"):
                quick_wins.append(suggestion.title)
        
        return quick_wins[:5]  # Limit to top 5
    
    def _generate_cache_key(
        self,
        change_event: ContentChangeEvent,
        current_resume: Dict,
        job_requirements: Dict
    ) -> str:
        """Generate cache key for optimization results"""
        
        key_data = {
            'section': change_event.section,
            'field': change_event.field,
            'new_value_hash': hash(change_event.new_value),
            'resume_hash': hash(str(current_resume)),
            'job_hash': hash(str(job_requirements))
        }
        
        return f"rt_opt_{hash(str(key_data))}"
    
    def clear_cache(self):
        """Clear suggestion cache"""
        self.suggestion_cache.clear()
    
    def get_cache_stats(self) -> Dict:
        """Get cache statistics"""
        return {
            'cache_size': len(self.suggestion_cache),
            'memory_usage': sum(len(str(result)) for result in self.suggestion_cache.values())
        }