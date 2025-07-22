from typing import Dict, List, Optional, Tuple, Any
from pydantic import BaseModel
import re
from difflib import SequenceMatcher

class GapAnalysisResult(BaseModel):
    """Gap analysis result data model"""
    overall_match_score: float = 0.0
    
    # Skills analysis
    matching_skills: List[str] = []
    missing_required_skills: List[str] = []
    missing_preferred_skills: List[str] = []
    
    # Experience analysis
    experience_gap: Optional[int] = None  # Years short, negative if exceeds
    experience_level_match: bool = False
    
    # Technology analysis
    matching_technologies: List[str] = []
    missing_technologies: List[str] = []
    
    # Programming languages
    matching_languages: List[str] = []
    missing_languages: List[str] = []
    
    # Frameworks
    matching_frameworks: List[str] = []
    missing_frameworks: List[str] = []
    
    # Databases
    matching_databases: List[str] = []
    missing_databases: List[str] = []
    
    # Cloud platforms
    matching_cloud_platforms: List[str] = []
    missing_cloud_platforms: List[str] = []
    
    # Recommendations
    recommendations: List[str] = []
    improvement_priority: List[Dict[str, Any]] = []

class GapAnalyzerService:
    """Service for analyzing gaps between resume and job requirements"""
    
    def __init__(self):
        # Skill synonyms and variations
        self.skill_synonyms = {
            'javascript': ['js', 'ecmascript', 'javascript'],
            'typescript': ['ts', 'typescript'],
            'python': ['python', 'python3', 'py'],
            'java': ['java', 'openjdk'],
            'react': ['react.js', 'reactjs', 'react'],
            'node': ['node.js', 'nodejs', 'node'],
            'postgresql': ['postgres', 'postgresql', 'psql'],
            'mongodb': ['mongo', 'mongodb'],
            'aws': ['amazon web services', 'aws'],
            'gcp': ['google cloud', 'gcp', 'google cloud platform'],
            'azure': ['microsoft azure', 'azure'],
            'docker': ['docker', 'containerization'],
            'kubernetes': ['k8s', 'kubernetes'],
            'fastapi': ['fastapi', 'fast api'],
            'django': ['django'],
            'flask': ['flask'],
            'express': ['express.js', 'expressjs', 'express'],
            'redis': ['redis'],
            'git': ['git', 'version control'],
            'ci/cd': ['ci/cd', 'continuous integration', 'continuous deployment', 'devops'],
        }
    
    def normalize_skill(self, skill: str) -> str:
        """Normalize skill name for better matching"""
        skill = skill.lower().strip()
        skill = re.sub(r'[^\w\s\+\#\.]', '', skill)  # Remove special chars except +, #, .
        skill = re.sub(r'\s+', ' ', skill)  # Normalize whitespace
        return skill
    
    def find_skill_matches(self, resume_skills: List[str], job_skills: List[str]) -> Tuple[List[str], List[str]]:
        """Find matching and missing skills using fuzzy matching"""
        normalized_resume = [self.normalize_skill(skill) for skill in resume_skills]
        normalized_job = [self.normalize_skill(skill) for skill in job_skills]
        
        matching = []
        missing = []
        
        for job_skill in normalized_job:
            found_match = False
            
            # Check direct matches
            if job_skill in normalized_resume:
                matching.append(job_skill)
                found_match = True
            else:
                # Check synonyms
                for resume_skill in normalized_resume:
                    if self.are_skills_similar(job_skill, resume_skill):
                        matching.append(job_skill)
                        found_match = True
                        break
            
            if not found_match:
                missing.append(job_skill)
        
        return matching, missing
    
    def are_skills_similar(self, skill1: str, skill2: str, threshold: float = 0.8) -> bool:
        """Check if two skills are similar using various methods"""
        skill1 = self.normalize_skill(skill1)
        skill2 = self.normalize_skill(skill2)
        
        # Direct match
        if skill1 == skill2:
            return True
        
        # Check synonyms
        for canonical, synonyms in self.skill_synonyms.items():
            if skill1 in synonyms and skill2 in synonyms:
                return True
        
        # Fuzzy string matching
        similarity = SequenceMatcher(None, skill1, skill2).ratio()
        if similarity >= threshold:
            return True
        
        # Check if one skill contains the other
        if skill1 in skill2 or skill2 in skill1:
            return True
        
        return False
    
    def extract_skills_from_resume(self, resume_data: Dict) -> List[str]:
        """Extract all skills from resume data"""
        skills = []
        
        # Get skills from parsed data
        if resume_data.get('parsed_data'):
            parsed = resume_data['parsed_data']
            
            # Programming languages
            if parsed.get('programming_languages'):
                skills.extend(parsed['programming_languages'])
            
            # Skills section
            if parsed.get('skills'):
                skills.extend(parsed['skills'])
            
            # Technologies from experience
            if parsed.get('experience'):
                for exp in parsed['experience']:
                    content = exp.get('content', '')
                    # Extract technology mentions from experience text
                    tech_words = self.extract_technologies_from_text(content)
                    skills.extend(tech_words)
        
        # Clean and deduplicate
        cleaned_skills = []
        for skill in skills:
            if isinstance(skill, str) and skill.strip():
                cleaned_skills.append(skill.strip())
        
        return list(set(cleaned_skills))
    
    def extract_technologies_from_text(self, text: str) -> List[str]:
        """Extract technology mentions from text"""
        if not text:
            return []
        
        text = text.lower()
        technologies = []
        
        # Common technologies to look for
        tech_patterns = [
            'python', 'javascript', 'java', 'typescript', 'php', 'ruby', 'go', 'rust',
            'react', 'angular', 'vue', 'nodejs', 'express', 'django', 'flask', 'fastapi',
            'postgresql', 'mysql', 'mongodb', 'redis', 'sqlite', 'elasticsearch',
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins',
            'git', 'jira', 'confluence', 'slack', 'figma'
        ]
        
        for tech in tech_patterns:
            if tech in text:
                technologies.append(tech)
        
        return technologies
    
    def calculate_experience_gap(self, resume_experience: Optional[int], job_requirements: Dict) -> Optional[int]:
        """Calculate experience gap in years"""
        required_years = job_requirements.get('required_experience_years')
        
        if not required_years:
            return None
        
        if not resume_experience:
            # Estimate experience from resume data if not explicitly provided
            resume_experience = 2  # Default assumption
        
        gap = required_years - resume_experience
        return gap if gap > 0 else 0
    
    def check_experience_level_match(self, resume_level: str, job_level: str) -> bool:
        """Check if experience levels match"""
        level_hierarchy = {
            'entry': 1,
            'junior': 1,
            'mid': 2,
            'intermediate': 2,
            'senior': 3,
            'lead': 4,
            'principal': 4,
            'executive': 5
        }
        
        resume_rank = level_hierarchy.get(resume_level.lower(), 1)
        job_rank = level_hierarchy.get(job_level.lower(), 1)
        
        return resume_rank >= job_rank
    
    def generate_recommendations(self, gap_result: GapAnalysisResult) -> List[str]:
        """Generate actionable recommendations based on gap analysis"""
        recommendations = []
        
        # Experience recommendations
        if gap_result.experience_gap and gap_result.experience_gap > 0:
            recommendations.append(
                f"Gain {gap_result.experience_gap} more years of relevant experience"
            )
        
        if not gap_result.experience_level_match:
            recommendations.append(
                "Consider taking on more senior responsibilities or leadership roles"
            )
        
        # Skill recommendations
        if gap_result.missing_required_skills:
            top_missing = gap_result.missing_required_skills[:3]
            recommendations.append(
                f"Learn these critical skills: {', '.join(top_missing)}"
            )
        
        if gap_result.missing_languages:
            recommendations.append(
                f"Consider learning: {', '.join(gap_result.missing_languages[:2])}"
            )
        
        if gap_result.missing_frameworks:
            recommendations.append(
                f"Gain experience with: {', '.join(gap_result.missing_frameworks[:2])}"
            )
        
        if gap_result.missing_databases:
            recommendations.append(
                f"Learn database technologies: {', '.join(gap_result.missing_databases)}"
            )
        
        if gap_result.missing_cloud_platforms:
            recommendations.append(
                f"Get cloud platform experience: {', '.join(gap_result.missing_cloud_platforms)}"
            )
        
        return recommendations
    
    def calculate_priority_scores(self, gap_result: GapAnalysisResult) -> List[Dict[str, Any]]:
        """Calculate improvement priorities with scores"""
        priorities = []
        
        # Missing required skills (highest priority)
        for skill in gap_result.missing_required_skills:
            priorities.append({
                'category': 'Required Skill',
                'item': skill,
                'priority_score': 10,
                'urgency': 'Critical'
            })
        
        # Missing programming languages
        for lang in gap_result.missing_languages:
            priorities.append({
                'category': 'Programming Language',
                'item': lang,
                'priority_score': 8,
                'urgency': 'High'
            })
        
        # Missing frameworks
        for framework in gap_result.missing_frameworks:
            priorities.append({
                'category': 'Framework',
                'item': framework,
                'priority_score': 7,
                'urgency': 'High'
            })
        
        # Missing databases
        for db in gap_result.missing_databases:
            priorities.append({
                'category': 'Database',
                'item': db,
                'priority_score': 6,
                'urgency': 'Medium'
            })
        
        # Missing cloud platforms
        for cloud in gap_result.missing_cloud_platforms:
            priorities.append({
                'category': 'Cloud Platform',
                'item': cloud,
                'priority_score': 6,
                'urgency': 'Medium'
            })
        
        # Missing preferred skills
        for skill in gap_result.missing_preferred_skills:
            priorities.append({
                'category': 'Preferred Skill',
                'item': skill,
                'priority_score': 4,
                'urgency': 'Low'
            })
        
        # Sort by priority score
        priorities.sort(key=lambda x: x['priority_score'], reverse=True)
        
        return priorities
    
    def analyze_gap(self, resume_data: Dict, job_requirements: Dict) -> GapAnalysisResult:
        """Main method to analyze gaps between resume and job requirements"""
        
        # Extract skills from resume
        resume_skills = self.extract_skills_from_resume(resume_data)
        
        # Analyze skills gaps
        matching_required, missing_required = self.find_skill_matches(
            resume_skills, job_requirements.get('required_skills', [])
        )
        
        matching_preferred, missing_preferred = self.find_skill_matches(
            resume_skills, job_requirements.get('preferred_skills', [])
        )
        
        # Analyze technology gaps
        matching_languages, missing_languages = self.find_skill_matches(
            resume_skills, job_requirements.get('programming_languages', [])
        )
        
        matching_frameworks, missing_frameworks = self.find_skill_matches(
            resume_skills, job_requirements.get('frameworks', [])
        )
        
        matching_databases, missing_databases = self.find_skill_matches(
            resume_skills, job_requirements.get('databases', [])
        )
        
        matching_cloud, missing_cloud = self.find_skill_matches(
            resume_skills, job_requirements.get('cloud_platforms', [])
        )
        
        # Analyze experience gap
        resume_experience_years = None  # Could be extracted from resume parsing
        experience_gap = self.calculate_experience_gap(
            resume_experience_years, job_requirements
        )
        
        # Check experience level match
        experience_level_match = self.check_experience_level_match(
            'mid',  # Could be extracted from resume
            job_requirements.get('experience_level', 'entry')
        )
        
        # Calculate overall match score
        total_required = len(job_requirements.get('required_skills', [])) + \
                        len(job_requirements.get('programming_languages', [])) + \
                        len(job_requirements.get('frameworks', []))
        
        if total_required > 0:
            matched_count = len(matching_required) + len(matching_languages) + len(matching_frameworks)
            match_score = min(matched_count / total_required, 1.0)
        else:
            match_score = 0.0
        
        # Create gap analysis result
        gap_result = GapAnalysisResult(
            overall_match_score=match_score,
            matching_skills=matching_required + matching_preferred,
            missing_required_skills=missing_required,
            missing_preferred_skills=missing_preferred,
            experience_gap=experience_gap,
            experience_level_match=experience_level_match,
            matching_technologies=matching_languages + matching_frameworks,
            missing_technologies=missing_languages + missing_frameworks,
            matching_languages=matching_languages,
            missing_languages=missing_languages,
            matching_frameworks=matching_frameworks,
            missing_frameworks=missing_frameworks,
            matching_databases=matching_databases,
            missing_databases=missing_databases,
            matching_cloud_platforms=matching_cloud,
            missing_cloud_platforms=missing_cloud
        )
        
        # Generate recommendations
        gap_result.recommendations = self.generate_recommendations(gap_result)
        gap_result.improvement_priority = self.calculate_priority_scores(gap_result)
        
        return gap_result