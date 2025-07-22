"""Industry-Specific Analysis Service for Resume Optimization"""
from typing import Dict, List, Optional, Tuple
from enum import Enum
from pydantic import BaseModel

class IndustryType(str, Enum):
    """Supported industry types"""
    TECHNOLOGY = "technology"
    FINANCE = "finance"
    HEALTHCARE = "healthcare"
    CONSULTING = "consulting"
    MARKETING = "marketing"
    SALES = "sales"
    MANUFACTURING = "manufacturing"
    EDUCATION = "education"
    NONPROFIT = "nonprofit"
    RETAIL = "retail"
    MEDIA = "media"
    GOVERNMENT = "government"
    STARTUP = "startup"
    ENTERPRISE = "enterprise"
    GENERAL = "general"

class IndustryProfile(BaseModel):
    """Industry-specific profile for optimization"""
    industry: IndustryType
    key_skills: List[str]
    technical_skills: List[str]
    soft_skills: List[str]
    preferred_action_verbs: List[str]
    metric_types: List[str]
    content_style: str
    section_priorities: List[str]
    keyword_weights: Dict[str, float]
    achievement_focus: List[str]

class IndustryAnalyzerService:
    """Service for industry-specific resume optimization"""
    
    def __init__(self):
        self.industry_profiles = self._load_industry_profiles()
        self.role_patterns = self._load_role_patterns()
    
    def _load_industry_profiles(self) -> Dict[IndustryType, IndustryProfile]:
        """Load comprehensive industry profiles"""
        
        profiles = {}
        
        # Technology Industry
        profiles[IndustryType.TECHNOLOGY] = IndustryProfile(
            industry=IndustryType.TECHNOLOGY,
            key_skills=[
                "software development", "programming", "system design", "cloud computing",
                "devops", "agile", "api development", "database management",
                "machine learning", "artificial intelligence", "cybersecurity"
            ],
            technical_skills=[
                "python", "javascript", "react", "node.js", "aws", "kubernetes",
                "docker", "postgresql", "mongodb", "redis", "elasticsearch",
                "terraform", "jenkins", "git", "linux", "microservices"
            ],
            soft_skills=[
                "problem solving", "analytical thinking", "collaboration",
                "continuous learning", "innovation", "technical communication"
            ],
            preferred_action_verbs=[
                "developed", "architected", "implemented", "optimized", "automated",
                "deployed", "engineered", "built", "designed", "scaled",
                "integrated", "migrated", "modernized", "refactored"
            ],
            metric_types=[
                "performance improvement", "system uptime", "user growth",
                "code coverage", "deployment frequency", "bug reduction",
                "response time", "scalability", "cost savings"
            ],
            content_style="technical_detailed",
            section_priorities=[
                "technical_skills", "experience", "projects", "certifications", "education"
            ],
            keyword_weights={
                "technical_skills": 0.9,
                "programming_languages": 0.8,
                "frameworks": 0.7,
                "cloud_platforms": 0.8,
                "methodologies": 0.6,
                "soft_skills": 0.4
            },
            achievement_focus=[
                "system performance", "scalability", "automation", "innovation",
                "technical leadership", "code quality"
            ]
        )
        
        # Finance Industry
        profiles[IndustryType.FINANCE] = IndustryProfile(
            industry=IndustryType.FINANCE,
            key_skills=[
                "financial analysis", "risk management", "compliance", "auditing",
                "financial modeling", "investment analysis", "portfolio management",
                "regulatory knowledge", "quantitative analysis"
            ],
            technical_skills=[
                "excel", "python", "r", "sql", "tableau", "power bi",
                "bloomberg terminal", "matlab", "sas", "risk systems",
                "trading platforms", "financial databases"
            ],
            soft_skills=[
                "attention to detail", "analytical thinking", "regulatory compliance",
                "client relationship management", "ethical standards", "decision making"
            ],
            preferred_action_verbs=[
                "analyzed", "evaluated", "assessed", "managed", "optimized",
                "monitored", "forecasted", "calculated", "validated", "audited",
                "recommended", "structured", "quantified", "modeled"
            ],
            metric_types=[
                "revenue growth", "cost reduction", "roi", "risk mitigation",
                "compliance rate", "portfolio performance", "accuracy rate",
                "process efficiency", "client satisfaction"
            ],
            content_style="conservative_professional",
            section_priorities=[
                "experience", "education", "certifications", "skills", "projects"
            ],
            keyword_weights={
                "financial_skills": 0.9,
                "regulatory_knowledge": 0.8,
                "analytical_skills": 0.7,
                "technical_skills": 0.6,
                "certifications": 0.8,
                "soft_skills": 0.5
            },
            achievement_focus=[
                "financial performance", "risk reduction", "compliance",
                "process improvement", "client results", "accuracy"
            ]
        )
        
        # Healthcare Industry
        profiles[IndustryType.HEALTHCARE] = IndustryProfile(
            industry=IndustryType.HEALTHCARE,
            key_skills=[
                "patient care", "clinical expertise", "medical knowledge",
                "healthcare regulations", "quality assurance", "safety protocols",
                "electronic health records", "medical documentation"
            ],
            technical_skills=[
                "ehr systems", "medical devices", "healthcare software",
                "clinical databases", "telemedicine", "medical imaging",
                "laboratory systems", "healthcare analytics"
            ],
            soft_skills=[
                "empathy", "communication", "teamwork", "attention to detail",
                "critical thinking", "stress management", "cultural sensitivity"
            ],
            preferred_action_verbs=[
                "treated", "diagnosed", "administered", "monitored", "assessed",
                "coordinated", "educated", "implemented", "improved", "maintained",
                "documented", "collaborated", "supervised", "trained"
            ],
            metric_types=[
                "patient outcomes", "safety metrics", "quality scores",
                "efficiency improvement", "patient satisfaction", "compliance rate",
                "cost reduction", "readmission rates"
            ],
            content_style="professional_caring",
            section_priorities=[
                "experience", "education", "certifications", "skills", "achievements"
            ],
            keyword_weights={
                "clinical_skills": 0.9,
                "patient_care": 0.8,
                "regulatory_compliance": 0.7,
                "technical_skills": 0.6,
                "certifications": 0.8,
                "soft_skills": 0.7
            },
            achievement_focus=[
                "patient outcomes", "quality improvement", "safety",
                "efficiency", "team collaboration", "education"
            ]
        )
        
        # Add more industries as needed
        profiles[IndustryType.GENERAL] = IndustryProfile(
            industry=IndustryType.GENERAL,
            key_skills=[
                "leadership", "project management", "communication", "problem solving",
                "teamwork", "analytical skills", "customer service", "adaptability"
            ],
            technical_skills=[
                "microsoft office", "project management tools", "crm systems",
                "data analysis", "presentation software", "collaboration tools"
            ],
            soft_skills=[
                "communication", "leadership", "teamwork", "adaptability",
                "problem solving", "time management", "critical thinking"
            ],
            preferred_action_verbs=[
                "managed", "led", "developed", "implemented", "improved",
                "coordinated", "achieved", "delivered", "executed", "optimized"
            ],
            metric_types=[
                "performance improvement", "cost savings", "efficiency gains",
                "team productivity", "customer satisfaction", "revenue growth"
            ],
            content_style="professional_balanced",
            section_priorities=[
                "experience", "skills", "education", "achievements", "projects"
            ],
            keyword_weights={
                "core_skills": 0.7,
                "technical_skills": 0.6,
                "soft_skills": 0.6,
                "achievements": 0.7,
                "experience": 0.8
            },
            achievement_focus=[
                "results", "leadership", "efficiency", "teamwork", "innovation"
            ]
        )
        
        return profiles
    
    def _load_role_patterns(self) -> Dict[str, Dict]:
        """Load role-specific patterns and priorities"""
        
        return {
            "software_engineer": {
                "keywords": ["programming", "coding", "development", "software", "systems"],
                "skills_weight": 0.9,
                "experience_weight": 0.8,
                "projects_weight": 0.9
            },
            "data_scientist": {
                "keywords": ["data", "analytics", "machine learning", "statistics", "python"],
                "skills_weight": 0.8,
                "experience_weight": 0.7,
                "projects_weight": 0.9
            },
            "product_manager": {
                "keywords": ["product", "strategy", "roadmap", "stakeholder", "user"],
                "skills_weight": 0.6,
                "experience_weight": 0.9,
                "projects_weight": 0.7
            },
            "marketing_manager": {
                "keywords": ["marketing", "campaigns", "brand", "digital", "analytics"],
                "skills_weight": 0.7,
                "experience_weight": 0.8,
                "projects_weight": 0.6
            },
            "sales_representative": {
                "keywords": ["sales", "revenue", "client", "relationship", "targets"],
                "skills_weight": 0.6,
                "experience_weight": 0.9,
                "projects_weight": 0.5
            }
        }
    
    def detect_industry(self, job_description: str, company_info: str = "") -> Tuple[IndustryType, float]:
        """Detect industry from job description and company information"""
        
        text = f"{job_description} {company_info}".lower()
        
        # Industry keyword patterns
        industry_keywords = {
            IndustryType.TECHNOLOGY: [
                "software", "programming", "developer", "engineer", "tech", "startup",
                "cloud", "api", "database", "devops", "agile", "scrum"
            ],
            IndustryType.FINANCE: [
                "finance", "financial", "banking", "investment", "trading", "risk",
                "compliance", "audit", "portfolio", "capital", "regulatory"
            ],
            IndustryType.HEALTHCARE: [
                "healthcare", "medical", "hospital", "clinical", "patient", "nurse",
                "doctor", "physician", "health", "pharmaceutical", "biotech"
            ],
            IndustryType.CONSULTING: [
                "consulting", "consultant", "advisory", "strategy", "transformation",
                "implementation", "client", "stakeholder", "analysis"
            ],
            IndustryType.MARKETING: [
                "marketing", "advertising", "brand", "campaign", "digital", "social media",
                "content", "seo", "ppc", "analytics", "creative"
            ]
        }
        
        # Score each industry
        industry_scores = {}
        for industry, keywords in industry_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text)
            industry_scores[industry] = score / len(keywords)
        
        # Find best match
        best_industry = max(industry_scores, key=industry_scores.get)
        confidence = industry_scores[best_industry]
        
        # Default to general if confidence is too low
        if confidence < 0.1:
            return IndustryType.GENERAL, 0.5
        
        return best_industry, confidence
    
    def get_industry_profile(self, industry: IndustryType) -> IndustryProfile:
        """Get industry profile for optimization"""
        return self.industry_profiles.get(industry, self.industry_profiles[IndustryType.GENERAL])
    
    def calculate_skill_weights(self, skills: List[str], industry: IndustryType) -> Dict[str, float]:
        """Calculate weighted importance of skills for specific industry"""
        
        profile = self.get_industry_profile(industry)
        skill_weights = {}
        
        for skill in skills:
            skill_lower = skill.lower()
            weight = 0.5  # Default weight
            
            # Check against industry-specific skills
            if skill_lower in [s.lower() for s in profile.key_skills]:
                weight = 0.9
            elif skill_lower in [s.lower() for s in profile.technical_skills]:
                weight = 0.8
            elif skill_lower in [s.lower() for s in profile.soft_skills]:
                weight = 0.6
            
            skill_weights[skill] = weight
        
        return skill_weights
    
    def get_optimization_strategy(self, industry: IndustryType, role: str) -> Dict:
        """Get optimization strategy for specific industry and role"""
        
        profile = self.get_industry_profile(industry)
        
        return {
            "content_style": profile.content_style,
            "section_priorities": profile.section_priorities,
            "preferred_action_verbs": profile.preferred_action_verbs,
            "metric_types": profile.metric_types,
            "achievement_focus": profile.achievement_focus,
            "keyword_weights": profile.keyword_weights,
            "industry_profile": profile
        }
    
    def enhance_content_for_industry(self, content: str, industry: IndustryType) -> str:
        """Enhance content based on industry-specific best practices"""
        
        profile = self.get_industry_profile(industry)
        
        # This would integrate with the AI optimization to provide industry context
        # For now, return the original content
        return content