"""Test suite for Gap Analysis Engine"""
import pytest
from unittest.mock import Mock, patch
from app.services.gap_analyzer import GapAnalyzerService, GapAnalysisResult


class TestGapAnalyzerService:
    """Test suite for Gap Analysis Engine"""
    
    @pytest.fixture
    def analyzer_service(self):
        """Create gap analyzer service instance"""
        return GapAnalyzerService()
    
    @pytest.fixture
    def sample_resume_data(self):
        """Create sample resume data"""
        return {
            'parsed_data': {
                'programming_languages': ['Python', 'JavaScript', 'Java'],
                'skills': ['React', 'Django', 'PostgreSQL', 'Git', 'Docker'],
                'experience': [
                    {
                        'title': 'Software Engineer',
                        'company': 'TechCorp',
                        'content': 'Developed web applications using React and Django. Worked with PostgreSQL databases and deployed using Docker on AWS.'
                    },
                    {
                        'title': 'Junior Developer',
                        'company': 'StartupXYZ',
                        'content': 'Built REST APIs using FastAPI and worked with MongoDB. Used Git for version control.'
                    }
                ]
            }
        }
    
    @pytest.fixture
    def sample_job_requirements(self):
        """Create sample job requirements"""
        return {
            'required_skills': ['Python', 'JavaScript', 'React', 'AWS'],
            'preferred_skills': ['TypeScript', 'GraphQL', 'Redis'],
            'programming_languages': ['Python', 'JavaScript', 'TypeScript'],
            'frameworks': ['React', 'Node.js', 'FastAPI'],
            'databases': ['PostgreSQL', 'MongoDB', 'Redis'],
            'cloud_platforms': ['AWS', 'Azure'],
            'tools': ['Docker', 'Kubernetes', 'Git'],
            'required_experience_years': 3,
            'experience_level': 'mid'
        }
    
    def test_normalize_skill(self, analyzer_service):
        """Test skill normalization"""
        test_cases = [
            ('JavaScript', 'javascript'),
            ('Node.js', 'nodejs'),
            ('React.js', 'reactjs'),
            ('C++', 'c++'),
            ('C#', 'c#'),
            ('  Python  ', 'python'),
            ('AWS (Amazon Web Services)', 'aws amazon web services'),
            ('CI/CD', 'ci/cd')
        ]
        
        for input_skill, expected in test_cases:
            result = analyzer_service.normalize_skill(input_skill)
            assert result == expected
    
    def test_find_skill_matches(self, analyzer_service):
        """Test skill matching functionality"""
        resume_skills = ['Python', 'JavaScript', 'React', 'Django', 'PostgreSQL']
        job_skills = ['Python', 'JavaScript', 'React', 'TypeScript', 'MongoDB']
        
        matching, missing = analyzer_service.find_skill_matches(resume_skills, job_skills)
        
        assert 'python' in matching
        assert 'javascript' in matching
        assert 'react' in matching
        assert 'typescript' in missing
        assert 'mongodb' in missing
    
    def test_are_skills_similar(self, analyzer_service):
        """Test skill similarity detection"""
        # Direct matches
        assert analyzer_service.are_skills_similar('Python', 'Python')
        assert analyzer_service.are_skills_similar('JavaScript', 'javascript')
        
        # Synonym matches
        assert analyzer_service.are_skills_similar('JavaScript', 'JS')
        assert analyzer_service.are_skills_similar('Node.js', 'NodeJS')
        assert analyzer_service.are_skills_similar('PostgreSQL', 'Postgres')
        
        # Fuzzy matches
        assert analyzer_service.are_skills_similar('React', 'React.js')
        assert analyzer_service.are_skills_similar('Express', 'Express.js')
        
        # Non-matches
        assert not analyzer_service.are_skills_similar('Python', 'Java')
        assert not analyzer_service.are_skills_similar('React', 'Angular')
    
    def test_extract_skills_from_resume(self, analyzer_service, sample_resume_data):
        """Test skill extraction from resume data"""
        skills = analyzer_service.extract_skills_from_resume(sample_resume_data)
        
        # Should include programming languages
        assert 'Python' in skills
        assert 'JavaScript' in skills
        assert 'Java' in skills
        
        # Should include skills from skills section
        assert 'React' in skills
        assert 'Django' in skills
        assert 'PostgreSQL' in skills
        
        # Should include technologies extracted from experience text
        assert 'aws' in skills
        assert 'fastapi' in skills
        assert 'mongodb' in skills
        
        # Should not have duplicates
        assert len(skills) == len(set(skills))
    
    def test_extract_skills_from_resume_empty_data(self, analyzer_service):
        """Test skill extraction with empty resume data"""
        empty_data = {}
        skills = analyzer_service.extract_skills_from_resume(empty_data)
        assert skills == []
        
        minimal_data = {'parsed_data': {}}
        skills = analyzer_service.extract_skills_from_resume(minimal_data)
        assert skills == []
    
    def test_extract_technologies_from_text(self, analyzer_service):
        """Test technology extraction from text"""
        text = """
        Developed web applications using React and Django framework. 
        Worked with PostgreSQL databases and deployed using Docker on AWS.
        Used Git for version control and Jenkins for CI/CD.
        """
        
        technologies = analyzer_service.extract_technologies_from_text(text)
        
        assert 'react' in technologies
        assert 'django' in technologies
        assert 'postgresql' in technologies
        assert 'docker' in technologies
        assert 'aws' in technologies
        assert 'git' in technologies
        assert 'jenkins' in technologies
    
    def test_extract_technologies_from_empty_text(self, analyzer_service):
        """Test technology extraction from empty text"""
        assert analyzer_service.extract_technologies_from_text('') == []
        assert analyzer_service.extract_technologies_from_text(None) == []
    
    def test_calculate_experience_gap(self, analyzer_service):
        """Test experience gap calculation"""
        # Test with specific experience
        gap = analyzer_service.calculate_experience_gap(2, {'required_experience_years': 5})
        assert gap == 3  # 5 - 2 = 3 years gap
        
        # Test with no gap (meets requirement)
        gap = analyzer_service.calculate_experience_gap(7, {'required_experience_years': 5})
        assert gap == 0  # No gap, exceeds requirement
        
        # Test with no requirement
        gap = analyzer_service.calculate_experience_gap(3, {})
        assert gap is None
        
        # Test with no resume experience (uses default)
        gap = analyzer_service.calculate_experience_gap(None, {'required_experience_years': 5})
        assert gap == 3  # 5 - 2 (default) = 3
    
    def test_check_experience_level_match(self, analyzer_service):
        """Test experience level matching"""
        # Exact matches
        assert analyzer_service.check_experience_level_match('senior', 'senior')
        assert analyzer_service.check_experience_level_match('mid', 'mid')
        
        # Higher level matches lower requirement
        assert analyzer_service.check_experience_level_match('senior', 'mid')
        assert analyzer_service.check_experience_level_match('lead', 'senior')
        
        # Lower level doesn't match higher requirement
        assert not analyzer_service.check_experience_level_match('entry', 'senior')
        assert not analyzer_service.check_experience_level_match('mid', 'lead')
        
        # Case insensitive
        assert analyzer_service.check_experience_level_match('SENIOR', 'senior')
    
    def test_generate_recommendations(self, analyzer_service):
        """Test recommendation generation"""
        gap_result = GapAnalysisResult(
            experience_gap=2,
            experience_level_match=False,
            missing_required_skills=['TypeScript', 'GraphQL'],
            missing_languages=['Go', 'Rust'],
            missing_frameworks=['Vue.js'],
            missing_databases=['MongoDB'],
            missing_cloud_platforms=['Azure']
        )
        
        recommendations = analyzer_service.generate_recommendations(gap_result)
        
        # Should have recommendations for each gap type
        assert any('2 more years' in rec for rec in recommendations)
        assert any('senior responsibilities' in rec for rec in recommendations)
        assert any('TypeScript' in rec for rec in recommendations)
        assert any('Go' in rec for rec in recommendations)
        assert any('Vue.js' in rec for rec in recommendations)
        assert any('MongoDB' in rec for rec in recommendations)
        assert any('Azure' in rec for rec in recommendations)
    
    def test_calculate_priority_scores(self, analyzer_service):
        """Test priority score calculation"""
        gap_result = GapAnalysisResult(
            missing_required_skills=['TypeScript'],
            missing_languages=['Go'],
            missing_frameworks=['Vue.js'],
            missing_databases=['MongoDB'],
            missing_cloud_platforms=['Azure'],
            missing_preferred_skills=['GraphQL']
        )
        
        priorities = analyzer_service.calculate_priority_scores(gap_result)
        
        # Should be sorted by priority score
        assert priorities[0]['priority_score'] >= priorities[-1]['priority_score']
        
        # Required skills should have highest priority
        required_skill_items = [p for p in priorities if p['category'] == 'Required Skill']
        assert len(required_skill_items) == 1
        assert required_skill_items[0]['priority_score'] == 10
        assert required_skill_items[0]['urgency'] == 'Critical'
        
        # Programming languages should have high priority
        lang_items = [p for p in priorities if p['category'] == 'Programming Language']
        assert len(lang_items) == 1
        assert lang_items[0]['priority_score'] == 8
        
        # Preferred skills should have lowest priority
        preferred_items = [p for p in priorities if p['category'] == 'Preferred Skill']
        assert len(preferred_items) == 1
        assert preferred_items[0]['priority_score'] == 4
        assert preferred_items[0]['urgency'] == 'Low'
    
    def test_analyze_gap_comprehensive(self, analyzer_service, sample_resume_data, sample_job_requirements):
        """Test comprehensive gap analysis"""
        result = analyzer_service.analyze_gap(sample_resume_data, sample_job_requirements)
        
        assert isinstance(result, GapAnalysisResult)
        
        # Check overall match score
        assert 0.0 <= result.overall_match_score <= 1.0
        
        # Check matching skills
        assert len(result.matching_skills) > 0
        assert 'python' in result.matching_skills
        assert 'javascript' in result.matching_skills
        assert 'react' in result.matching_skills
        
        # Check missing skills
        assert 'aws' in result.missing_required_skills or 'aws' in result.matching_skills
        
        # Check technology analysis
        assert len(result.matching_languages) > 0
        assert 'python' in result.matching_languages
        assert 'javascript' in result.matching_languages
        
        # Check that TypeScript is missing
        assert 'typescript' in result.missing_languages
        
        # Check framework analysis
        assert 'react' in result.matching_frameworks
        assert 'nodejs' in result.missing_frameworks
        
        # Check database analysis
        assert 'postgresql' in result.matching_databases
        assert 'redis' in result.missing_databases
        
        # Check cloud platform analysis
        assert 'aws' in result.matching_cloud_platforms or 'aws' in result.missing_cloud_platforms
        
        # Check recommendations are generated
        assert len(result.recommendations) > 0
        
        # Check priorities are calculated
        assert len(result.improvement_priority) > 0
    
    def test_analyze_gap_empty_requirements(self, analyzer_service, sample_resume_data):
        """Test gap analysis with empty job requirements"""
        empty_requirements = {}
        result = analyzer_service.analyze_gap(sample_resume_data, empty_requirements)
        
        assert isinstance(result, GapAnalysisResult)
        assert result.overall_match_score == 0.0
        assert len(result.matching_skills) == 0
        assert len(result.missing_required_skills) == 0
        assert len(result.recommendations) == 0
    
    def test_analyze_gap_empty_resume(self, analyzer_service, sample_job_requirements):
        """Test gap analysis with empty resume data"""
        empty_resume = {}
        result = analyzer_service.analyze_gap(empty_resume, sample_job_requirements)
        
        assert isinstance(result, GapAnalysisResult)
        assert result.overall_match_score == 0.0
        assert len(result.matching_skills) == 0
        assert len(result.missing_required_skills) > 0
        assert len(result.recommendations) > 0
    
    def test_skill_synonyms_matching(self, analyzer_service):
        """Test that skill synonyms are properly matched"""
        resume_skills = ['JS', 'Node.js', 'Postgres', 'Mongo']
        job_skills = ['JavaScript', 'NodeJS', 'PostgreSQL', 'MongoDB']
        
        matching, missing = analyzer_service.find_skill_matches(resume_skills, job_skills)
        
        # All should match due to synonyms
        assert len(matching) == 4
        assert len(missing) == 0
    
    def test_fuzzy_matching_threshold(self, analyzer_service):
        """Test fuzzy matching with different thresholds"""
        # Test with high threshold - should not match
        assert not analyzer_service.are_skills_similar('Python', 'Java', threshold=0.9)
        
        # Test with low threshold - should match similar strings
        assert analyzer_service.are_skills_similar('React', 'ReactJS', threshold=0.6)
        
        # Test exact match always works regardless of threshold
        assert analyzer_service.are_skills_similar('Python', 'Python', threshold=0.99)
    
    def test_skill_extraction_deduplication(self, analyzer_service):
        """Test that duplicate skills are removed"""
        resume_data = {
            'parsed_data': {
                'programming_languages': ['Python', 'Python', 'JavaScript'],
                'skills': ['Python', 'React', 'React'],
                'experience': [
                    {
                        'content': 'Used Python and React to build applications with Python backend.'
                    }
                ]
            }
        }
        
        skills = analyzer_service.extract_skills_from_resume(resume_data)
        
        # Should have unique skills only
        assert len(skills) == len(set(skills))
        assert skills.count('Python') <= 1  # At most one occurrence
        assert skills.count('React') <= 1
    
    def test_match_score_calculation(self, analyzer_service):
        """Test overall match score calculation"""
        resume_data = {
            'parsed_data': {
                'programming_languages': ['Python', 'JavaScript'],
                'skills': ['React']
            }
        }
        
        job_requirements = {
            'required_skills': ['Python', 'JavaScript'],
            'programming_languages': ['Python', 'JavaScript'],
            'frameworks': ['React']
        }
        
        result = analyzer_service.analyze_gap(resume_data, job_requirements)
        
        # Should have high match score since most requirements are met
        assert result.overall_match_score >= 0.8
    
    def test_experience_level_hierarchy(self, analyzer_service):
        """Test experience level hierarchy matching"""
        # Test all levels in hierarchy
        levels = ['entry', 'junior', 'mid', 'intermediate', 'senior', 'lead', 'principal', 'executive']
        
        for i, level in enumerate(levels):
            # Should match same level
            assert analyzer_service.check_experience_level_match(level, level)
            
            # Should match lower levels
            for j in range(i):
                assert analyzer_service.check_experience_level_match(level, levels[j])
            
            # Should not match higher levels
            for j in range(i + 1, len(levels)):
                if levels[j] not in ['junior', 'intermediate']:  # These map to same rank
                    assert not analyzer_service.check_experience_level_match(level, levels[j])
    
    def test_technology_categorization(self, analyzer_service, sample_resume_data, sample_job_requirements):
        """Test that technologies are properly categorized"""
        result = analyzer_service.analyze_gap(sample_resume_data, sample_job_requirements)
        
        # Programming languages should be separate from frameworks
        all_languages = result.matching_languages + result.missing_languages
        all_frameworks = result.matching_frameworks + result.missing_frameworks
        
        # Should have some languages
        assert len(all_languages) > 0
        # Should have some frameworks
        assert len(all_frameworks) > 0
        
        # Common languages should be in languages, not frameworks
        common_languages = ['python', 'javascript', 'typescript', 'java', 'go']
        for lang in common_languages:
            if lang in all_languages:
                assert lang not in all_frameworks
    
    def test_recommendation_generation_completeness(self, analyzer_service):
        """Test that recommendations cover all gap types"""
        # Create comprehensive gap
        gap_result = GapAnalysisResult(
            experience_gap=3,
            experience_level_match=False,
            missing_required_skills=['Skill1', 'Skill2', 'Skill3', 'Skill4'],
            missing_languages=['Language1', 'Language2', 'Language3'],
            missing_frameworks=['Framework1', 'Framework2', 'Framework3'],
            missing_databases=['Database1', 'Database2'],
            missing_cloud_platforms=['Cloud1', 'Cloud2']
        )
        
        recommendations = analyzer_service.generate_recommendations(gap_result)
        
        # Should have recommendations for each category
        recommendation_text = ' '.join(recommendations)
        assert 'experience' in recommendation_text.lower()
        assert 'senior' in recommendation_text.lower()
        assert 'skill1' in recommendation_text.lower()
        assert 'language1' in recommendation_text.lower()
        assert 'framework1' in recommendation_text.lower()
        assert 'database1' in recommendation_text.lower()
        assert 'cloud1' in recommendation_text.lower()
    
    def teardown_method(self):
        """Cleanup after each test"""
        # Reset any global state if needed
        pass