"""Test suite for Resume Parser Service"""
import pytest
import tempfile
import os
from pathlib import Path

from app.services.resume_parser import ResumeParserService, ParsedResumeData


class TestResumeParserService:
    """Test suite for Resume Parser Service"""
    
    @pytest.fixture
    def parser_service(self):
        """Create resume parser service instance"""
        return ResumeParserService()
    
    @pytest.fixture
    def sample_text_resume(self):
        """Create a sample text resume file"""
        content = """
        John Doe
        Software Engineer
        Email: john.doe@email.com
        Phone: (555) 123-4567
        
        EXPERIENCE
        Senior Software Engineer | TechCorp | 2020-2024
        - Developed web applications using Python and React
        - Led team of 5 developers on major projects
        - Improved system performance by 40%
        
        Software Developer | StartupXYZ | 2018-2020
        - Built REST APIs using FastAPI
        - Worked with PostgreSQL databases
        
        EDUCATION
        Bachelor of Science in Computer Science
        University of Technology | 2014-2018
        GPA: 3.8
        
        SKILLS
        Python, JavaScript, React, PostgreSQL, Docker, AWS
        """
        
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
            f.write(content)
            return f.name
    
    def test_parse_text_resume_success(self, parser_service, sample_text_resume):
        """Test successful parsing of text resume"""
        file_size = os.path.getsize(sample_text_resume)
        
        result = parser_service.parse_resume(sample_text_resume, file_size)
        
        # Cleanup
        os.unlink(sample_text_resume)
        
        # Assertions
        assert isinstance(result, ParsedResumeData)
        assert result.personal_info['name'] == 'John Doe'
        assert result.personal_info['email'] == 'john.doe@email.com'
        assert len(result.experience) == 2
        assert len(result.skills) > 0
        assert 'Python' in result.skills
        assert 'React' in result.skills
    
    def test_parse_nonexistent_file(self, parser_service):
        """Test parsing non-existent file raises error"""
        with pytest.raises(FileNotFoundError):
            parser_service.parse_resume('/nonexistent/file.txt', 100)
    
    def test_parse_empty_file(self, parser_service):
        """Test parsing empty file"""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
            f.write('')
            empty_file = f.name
        
        file_size = os.path.getsize(empty_file)
        
        with pytest.raises(ValueError, match="Resume file is empty"):
            parser_service.parse_resume(empty_file, file_size)
        
        # Cleanup
        os.unlink(empty_file)
    
    def test_parse_oversized_file(self, parser_service):
        """Test parsing file that exceeds size limit"""
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as f:
            f.write('content')
            oversized_file = f.name
        
        # Simulate oversized file
        oversized_size = 50 * 1024 * 1024  # 50MB
        
        with pytest.raises(ValueError, match="File size exceeds maximum"):
            parser_service.parse_resume(oversized_file, oversized_size)
        
        # Cleanup
        os.unlink(oversized_file)
    
    def test_extract_personal_info(self, parser_service):
        """Test personal information extraction"""
        text = """
        Jane Smith
        Senior Developer
        jane.smith@example.com
        +1 (555) 987-6543
        LinkedIn: linkedin.com/in/janesmith
        """
        
        personal_info = parser_service.extract_personal_info(text)
        
        assert personal_info['name'] == 'Jane Smith'
        assert personal_info['email'] == 'jane.smith@example.com'
        assert personal_info['phone'] == '+1 (555) 987-6543'
        assert 'linkedin.com/in/janesmith' in personal_info['linkedin']
    
    def test_extract_skills(self, parser_service):
        """Test skills extraction"""
        text = """
        TECHNICAL SKILLS
        Programming Languages: Python, JavaScript, Java, C++
        Frameworks: React, Django, FastAPI, Spring Boot
        Databases: PostgreSQL, MongoDB, Redis
        Cloud: AWS, Azure, Docker, Kubernetes
        """
        
        skills = parser_service.extract_skills(text)
        
        assert 'Python' in skills
        assert 'JavaScript' in skills
        assert 'React' in skills
        assert 'PostgreSQL' in skills
        assert 'AWS' in skills
        assert len(skills) >= 10
    
    def test_extract_experience(self, parser_service):
        """Test experience extraction"""
        text = """
        PROFESSIONAL EXPERIENCE
        
        Senior Software Engineer | Google | San Francisco, CA | 2021-2024
        • Led development of microservices architecture
        • Mentored junior developers
        • Improved API performance by 50%
        
        Software Engineer | Microsoft | Seattle, WA | 2019-2021
        • Developed cloud-native applications
        • Collaborated with cross-functional teams
        """
        
        experience = parser_service.extract_experience(text)
        
        assert len(experience) == 2
        assert experience[0]['company'] == 'Google'
        assert experience[0]['title'] == 'Senior Software Engineer'
        assert 'microservices' in experience[0]['content']
        assert experience[1]['company'] == 'Microsoft'
    
    def test_extract_education(self, parser_service):
        """Test education extraction"""
        text = """
        EDUCATION
        
        Master of Science in Computer Science
        Stanford University | Stanford, CA | 2017-2019
        GPA: 3.9/4.0
        
        Bachelor of Science in Software Engineering
        UC Berkeley | Berkeley, CA | 2013-2017
        Magna Cum Laude
        """
        
        education = parser_service.extract_education(text)
        
        assert len(education) == 2
        assert education[0]['degree'] == 'Master of Science in Computer Science'
        assert education[0]['school'] == 'Stanford University'
        assert education[1]['degree'] == 'Bachelor of Science in Software Engineering'
        assert education[1]['school'] == 'UC Berkeley'
    
    def test_calculate_confidence_score(self, parser_service):
        """Test confidence score calculation"""
        parsed_data = ParsedResumeData(
            personal_info={'name': 'John Doe', 'email': 'john@example.com'},
            experience=[{'company': 'TechCorp', 'title': 'Engineer'}],
            education=[{'degree': 'BS Computer Science', 'school': 'University'}],
            skills=['Python', 'JavaScript'],
            projects=[],
            programming_languages=['Python'],
            raw_text="Sample resume text"
        )
        
        confidence = parser_service.calculate_confidence_score(parsed_data)
        
        assert 0.0 <= confidence <= 1.0
        assert confidence > 0.5  # Should be reasonably confident with this data
    
    def test_validate_parsed_data(self, parser_service):
        """Test parsed data validation"""
        # Valid data
        valid_data = ParsedResumeData(
            personal_info={'name': 'John Doe', 'email': 'john@example.com'},
            experience=[{'company': 'TechCorp'}],
            education=[],
            skills=['Python'],
            projects=[],
            programming_languages=[],
            raw_text="Sample text"
        )
        
        is_valid, issues = parser_service.validate_parsed_data(valid_data)
        assert is_valid is True
        assert len(issues) == 0
        
        # Invalid data - missing name
        invalid_data = ParsedResumeData(
            personal_info={'email': 'john@example.com'},
            experience=[],
            education=[],
            skills=[],
            projects=[],
            programming_languages=[],
            raw_text=""
        )
        
        is_valid, issues = parser_service.validate_parsed_data(invalid_data)
        assert is_valid is False
        assert len(issues) > 0
    
    def test_supported_file_types(self, parser_service):
        """Test that all supported file types are recognized"""
        supported_types = ['.pdf', '.doc', '.docx', '.txt']
        
        for file_type in supported_types:
            with tempfile.NamedTemporaryFile(suffix=file_type, delete=False) as f:
                # Just test that the file type doesn't raise an error
                try:
                    # This would fail on content, but we're just testing type recognition
                    parser_service.parse_resume(f.name, 100)
                except (ValueError, Exception) as e:
                    # We expect content-related errors, not file type errors
                    assert "Unsupported file type" not in str(e)
                finally:
                    os.unlink(f.name)
    
    def test_performance_metrics(self, parser_service, sample_text_resume):
        """Test parsing performance is within acceptable limits"""
        import time
        
        file_size = os.path.getsize(sample_text_resume)
        
        start_time = time.time()
        result = parser_service.parse_resume(sample_text_resume, file_size)
        end_time = time.time()
        
        parsing_time = end_time - start_time
        
        # Cleanup
        os.unlink(sample_text_resume)
        
        # Parsing should complete within 5 seconds for a simple resume
        assert parsing_time < 5.0
        assert result is not None
    
    def teardown_method(self):
        """Cleanup after each test"""
        # Remove any temporary files that might have been created
        import glob
        temp_files = glob.glob('/tmp/tmp*')
        for temp_file in temp_files:
            try:
                if os.path.exists(temp_file):
                    os.unlink(temp_file)
            except:
                pass  # Ignore cleanup errors