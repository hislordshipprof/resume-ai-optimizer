"""Test suite for Job Description Analyzer Service"""
import pytest
from unittest.mock import Mock, patch, MagicMock
import json

from app.services.job_analyzer import JobAnalyzerService, JobRequirements


class TestJobAnalyzerService:
    """Test suite for Job Description Analyzer Service"""
    
    @pytest.fixture
    def analyzer_service(self):
        """Create job analyzer service instance"""
        return JobAnalyzerService()
    
    @pytest.fixture
    def sample_job_description(self):
        """Create a sample job description"""
        return """
        Senior Software Engineer - Full Stack
        
        We are looking for a Senior Software Engineer to join our team.
        
        Requirements:
        - 5+ years of experience in software development
        - Strong proficiency in Python, JavaScript, and TypeScript
        - Experience with React, Node.js, and FastAPI
        - Knowledge of PostgreSQL and Redis
        - AWS cloud experience required
        - Experience with Docker and Kubernetes
        - Bachelor's degree in Computer Science or related field
        
        Responsibilities:
        - Design and develop scalable web applications
        - Lead technical decisions and mentor junior developers
        - Collaborate with cross-functional teams
        - Ensure code quality and best practices
        
        Company: TechCorp (Series B startup, 50-100 employees)
        Location: Remote/San Francisco
        Salary: $120,000 - $180,000
        """
    
    @pytest.fixture
    def mock_openai_response(self):
        """Mock OpenAI API response"""
        mock_response = Mock()
        mock_choice = Mock()
        mock_message = Mock()
        mock_message.content = json.dumps({
            "required_skills": ["Python", "JavaScript", "React"],
            "preferred_skills": ["TypeScript", "AWS"],
            "required_experience_years": 5,
            "experience_level": "senior",
            "technologies": ["Python", "JavaScript", "TypeScript"],
            "programming_languages": ["Python", "JavaScript", "TypeScript"],
            "frameworks": ["React", "Node.js", "FastAPI"],
            "databases": ["PostgreSQL", "Redis"],
            "cloud_platforms": ["AWS"],
            "tools": ["Docker", "Kubernetes"],
            "certifications": [],
            "education_requirements": ["Bachelor's degree in Computer Science"],
            "responsibilities": ["Design and develop scalable web applications", "Lead technical decisions"],
            "company_size": "startup",
            "industry": "technology",
            "work_location": "remote",
            "salary_range": "$120,000 - $180,000"
        })
        mock_choice.message = mock_message
        mock_response.choices = [mock_choice]
        return mock_response
    
    @pytest.fixture
    def mock_gemini_response(self):
        """Mock Gemini API response"""
        mock_response = Mock()
        mock_response.text = json.dumps({
            "required_skills": ["Python", "JavaScript", "React"],
            "preferred_skills": ["TypeScript", "AWS"],
            "required_experience_years": 5,
            "experience_level": "senior",
            "technologies": ["Python", "JavaScript", "TypeScript"],
            "programming_languages": ["Python", "JavaScript", "TypeScript"],
            "frameworks": ["React", "Node.js", "FastAPI"],
            "databases": ["PostgreSQL", "Redis"],
            "cloud_platforms": ["AWS"],
            "tools": ["Docker", "Kubernetes"],
            "certifications": [],
            "education_requirements": ["Bachelor's degree in Computer Science"],
            "responsibilities": ["Design and develop scalable web applications", "Lead technical decisions"],
            "company_size": "startup",
            "industry": "technology",
            "work_location": "remote",
            "salary_range": "$120,000 - $180,000"
        })
        return mock_response
    
    def test_clean_job_description(self, analyzer_service):
        """Test job description cleaning"""
        messy_description = """
        
        Job Title: Software Engineer
        
        We are looking for a software engineer.
        
        Apply now by submitting your resume to jobs@company.com
        
        We are an equal opportunity employer.
        
        """
        
        cleaned = analyzer_service.clean_job_description(messy_description)
        
        assert "Apply now" not in cleaned
        assert "equal opportunity employer" not in cleaned
        assert "Job Title: Software Engineer" in cleaned
        assert cleaned.strip() != ""
    
    def test_extract_basic_requirements(self, analyzer_service, sample_job_description):
        """Test basic requirements extraction using rule-based parsing"""
        requirements = analyzer_service.extract_basic_requirements(sample_job_description)
        
        assert isinstance(requirements, JobRequirements)
        assert requirements.experience_level == "senior"
        assert requirements.required_experience_years == 5
        assert "Python" in requirements.programming_languages
        assert "Javascript" in requirements.programming_languages
        assert "React" in requirements.frameworks
        assert "Postgresql" in requirements.databases
        assert "AWS" in requirements.cloud_platforms
        assert "Docker" in requirements.tools
        assert requirements.work_location == "remote"
    
    @patch('app.services.job_analyzer.OpenAI')
    def test_analyze_with_openai_success(self, mock_openai_class, analyzer_service, sample_job_description, mock_openai_response):
        """Test successful OpenAI analysis"""
        # Mock OpenAI client
        mock_client = Mock()
        mock_client.chat.completions.create.return_value = mock_openai_response
        mock_openai_class.return_value = mock_client
        
        # Override the client in the service
        analyzer_service.openai_client = mock_client
        analyzer_service.openai_enabled = True
        
        requirements = analyzer_service.analyze_with_openai(sample_job_description)
        
        assert isinstance(requirements, JobRequirements)
        assert requirements.experience_level == "senior"
        assert requirements.required_experience_years == 5
        assert "Python" in requirements.programming_languages
        assert "React" in requirements.frameworks
        assert requirements.work_location == "remote"
    
    @patch('app.services.job_analyzer.genai')
    def test_analyze_with_gemini_success(self, mock_genai, analyzer_service, sample_job_description, mock_gemini_response):
        """Test successful Gemini analysis"""
        # Mock Gemini model
        mock_model = Mock()
        mock_model.generate_content.return_value = mock_gemini_response
        mock_genai.GenerativeModel.return_value = mock_model
        
        # Override the model in the service
        analyzer_service.gemini_model = mock_model
        analyzer_service.gemini_enabled = True
        
        requirements = analyzer_service.analyze_with_gemini(sample_job_description)
        
        assert isinstance(requirements, JobRequirements)
        assert requirements.experience_level == "senior"
        assert requirements.required_experience_years == 5
        assert "Python" in requirements.programming_languages
        assert "React" in requirements.frameworks
        assert requirements.work_location == "remote"
    
    def test_analyze_with_openai_disabled(self, analyzer_service):
        """Test OpenAI analysis when disabled"""
        analyzer_service.openai_enabled = False
        
        with pytest.raises(ValueError, match="OpenAI API key not configured"):
            analyzer_service.analyze_with_openai("test job description")
    
    def test_analyze_with_gemini_disabled(self, analyzer_service):
        """Test Gemini analysis when disabled"""
        analyzer_service.gemini_enabled = False
        
        with pytest.raises(ValueError, match="Gemini API key not configured"):
            analyzer_service.analyze_with_gemini("test job description")
    
    def test_validate_requirements(self, analyzer_service):
        """Test requirements validation and cleaning"""
        # Create requirements with duplicates and invalid data
        requirements = JobRequirements(
            required_skills=["Python", "Python", "JavaScript"],
            preferred_skills=["React", "React", "Vue"],
            experience_level="invalid_level",
            required_experience_years=-5,
            programming_languages=["Python", "Python", "Java"],
            frameworks=["React", "React", "Angular"]
        )
        
        validated = analyzer_service.validate_requirements(requirements)
        
        # Check duplicates are removed
        assert len(validated.required_skills) == 2
        assert len(validated.preferred_skills) == 2
        assert len(validated.programming_languages) == 2
        assert len(validated.frameworks) == 2
        
        # Check invalid data is corrected
        assert validated.experience_level == "entry"  # Invalid level corrected
        assert validated.required_experience_years is None  # Negative years removed
    
    def test_analyze_job_description_empty(self, analyzer_service):
        """Test analysis with empty job description"""
        with pytest.raises(ValueError, match="Job description cannot be empty"):
            analyzer_service.analyze_job_description("")
        
        with pytest.raises(ValueError, match="Job description cannot be empty"):
            analyzer_service.analyze_job_description("   ")
    
    @patch('app.services.job_analyzer.OpenAI')
    def test_analyze_job_description_openai_success(self, mock_openai_class, analyzer_service, sample_job_description, mock_openai_response):
        """Test full analysis with OpenAI success"""
        # Mock OpenAI client
        mock_client = Mock()
        mock_client.chat.completions.create.return_value = mock_openai_response
        mock_openai_class.return_value = mock_client
        
        # Override the client in the service
        analyzer_service.openai_client = mock_client
        analyzer_service.openai_enabled = True
        
        requirements = analyzer_service.analyze_job_description(sample_job_description)
        
        assert isinstance(requirements, JobRequirements)
        assert requirements.experience_level == "senior"
        assert requirements.required_experience_years == 5
        assert "Python" in requirements.programming_languages
    
    @patch('app.services.job_analyzer.genai')
    @patch('app.services.job_analyzer.OpenAI')
    def test_analyze_job_description_fallback_to_gemini(self, mock_openai_class, mock_genai, analyzer_service, sample_job_description, mock_gemini_response):
        """Test fallback from OpenAI to Gemini"""
        # Mock OpenAI to fail
        mock_openai_client = Mock()
        mock_openai_client.chat.completions.create.side_effect = Exception("OpenAI API error")
        mock_openai_class.return_value = mock_openai_client
        
        # Mock Gemini to succeed
        mock_gemini_model = Mock()
        mock_gemini_model.generate_content.return_value = mock_gemini_response
        mock_genai.GenerativeModel.return_value = mock_gemini_model
        
        # Override the clients in the service
        analyzer_service.openai_client = mock_openai_client
        analyzer_service.openai_enabled = True
        analyzer_service.gemini_model = mock_gemini_model
        analyzer_service.gemini_enabled = True
        
        requirements = analyzer_service.analyze_job_description(sample_job_description)
        
        assert isinstance(requirements, JobRequirements)
        assert requirements.experience_level == "senior"
        assert requirements.required_experience_years == 5
    
    def test_analyze_job_description_fallback_to_rule_based(self, analyzer_service, sample_job_description):
        """Test fallback to rule-based analysis"""
        # Disable both AI services
        analyzer_service.openai_enabled = False
        analyzer_service.gemini_enabled = False
        
        requirements = analyzer_service.analyze_job_description(sample_job_description)
        
        assert isinstance(requirements, JobRequirements)
        assert requirements.experience_level == "senior"
        assert requirements.required_experience_years == 5
        assert "Python" in requirements.programming_languages
    
    def test_get_confidence_score(self, analyzer_service):
        """Test confidence score calculation"""
        # High confidence requirements
        complete_requirements = JobRequirements(
            required_skills=["Python", "JavaScript"],
            programming_languages=["Python", "JavaScript"],
            experience_level="senior",
            required_experience_years=5,
            technologies=["React", "Node.js"],
            frameworks=["React", "FastAPI"],
            responsibilities=["Develop applications", "Lead team"],
            education_requirements=["Bachelor's degree"],
            work_location="remote"
        )
        
        confidence = analyzer_service.get_confidence_score(complete_requirements)
        assert confidence > 0.8  # Should be high confidence
        
        # Low confidence requirements
        minimal_requirements = JobRequirements()
        
        confidence = analyzer_service.get_confidence_score(minimal_requirements)
        assert confidence < 0.3  # Should be low confidence
    
    def test_analyze_with_openai_json_parsing_error(self, analyzer_service):
        """Test OpenAI analysis with JSON parsing error"""
        # Mock OpenAI client with invalid JSON response
        mock_client = Mock()
        mock_response = Mock()
        mock_choice = Mock()
        mock_message = Mock()
        mock_message.content = "Invalid JSON response"
        mock_choice.message = mock_message
        mock_response.choices = [mock_choice]
        mock_client.chat.completions.create.return_value = mock_response
        
        analyzer_service.openai_client = mock_client
        analyzer_service.openai_enabled = True
        
        with pytest.raises(json.JSONDecodeError):
            analyzer_service.analyze_with_openai("test job description")
    
    def test_analyze_with_gemini_json_parsing_error(self, analyzer_service):
        """Test Gemini analysis with JSON parsing error"""
        # Mock Gemini model with invalid JSON response
        mock_model = Mock()
        mock_response = Mock()
        mock_response.text = "Invalid JSON response"
        mock_model.generate_content.return_value = mock_response
        
        analyzer_service.gemini_model = mock_model
        analyzer_service.gemini_enabled = True
        
        with pytest.raises(json.JSONDecodeError):
            analyzer_service.analyze_with_gemini("test job description")
    
    def test_experience_level_detection(self, analyzer_service):
        """Test experience level detection from job descriptions"""
        # Test different experience levels
        test_cases = [
            ("Looking for a Senior Software Engineer", "senior"),
            ("Jr. Developer position available", "entry"),
            ("Mid-level engineer with 3+ years experience", "mid"),
            ("Principal Engineer role", "senior"),
            ("Entry level position for new graduates", "entry"),
            ("Lead Developer opportunity", "senior"),
            ("Software Engineer II with 4+ years", "mid")
        ]
        
        for description, expected_level in test_cases:
            requirements = analyzer_service.extract_basic_requirements(description)
            assert requirements.experience_level == expected_level
    
    def test_programming_language_extraction(self, analyzer_service):
        """Test programming language extraction accuracy"""
        description = """
        We need experience with Python, JavaScript, TypeScript, Java, C++, C#, 
        Go, Rust, PHP, Ruby, Swift, Kotlin, and SQL.
        """
        
        requirements = analyzer_service.extract_basic_requirements(description)
        
        expected_languages = ["Python", "Javascript", "Typescript", "Java", "C++", 
                            "C#", "Go", "Rust", "Php", "Ruby", "Swift", "Kotlin", "Sql"]
        
        # Check that most languages are detected
        detected_count = sum(1 for lang in expected_languages if lang in requirements.programming_languages)
        assert detected_count >= 8  # Should detect most languages
    
    def test_framework_extraction(self, analyzer_service):
        """Test framework extraction accuracy"""
        description = """
        Experience with React, Angular, Vue.js, Node.js, Express, Django, 
        Flask, FastAPI, Spring Boot, Ruby on Rails, Laravel, Next.js required.
        """
        
        requirements = analyzer_service.extract_basic_requirements(description)
        
        expected_frameworks = ["React", "Angular", "Vue", "Nodejs", "Express", 
                             "Django", "Flask", "Fastapi", "Spring", "Rails", "Laravel", "Nextjs"]
        
        # Check that most frameworks are detected
        detected_count = sum(1 for fw in expected_frameworks if fw in requirements.frameworks)
        assert detected_count >= 6  # Should detect most frameworks
    
    def test_database_extraction(self, analyzer_service):
        """Test database extraction accuracy"""
        description = """
        Experience with PostgreSQL, MySQL, MongoDB, Redis, SQLite, Oracle, 
        Cassandra, Elasticsearch, and DynamoDB required.
        """
        
        requirements = analyzer_service.extract_basic_requirements(description)
        
        expected_databases = ["Postgresql", "Mysql", "Mongodb", "Redis", "Sqlite", 
                            "Oracle", "Cassandra", "Elasticsearch", "Dynamodb"]
        
        # Check that most databases are detected
        detected_count = sum(1 for db in expected_databases if db in requirements.databases)
        assert detected_count >= 6  # Should detect most databases
    
    def test_cloud_platform_extraction(self, analyzer_service):
        """Test cloud platform extraction accuracy"""
        description = """
        Cloud experience with AWS, Azure, Google Cloud Platform, GCP, 
        Heroku, and DigitalOcean required.
        """
        
        requirements = analyzer_service.extract_basic_requirements(description)
        
        expected_platforms = ["AWS", "Azure", "Google Cloud", "GCP", "Heroku", "Digitalocean"]
        
        # Check that most platforms are detected
        detected_count = sum(1 for platform in expected_platforms if platform in requirements.cloud_platforms)
        assert detected_count >= 4  # Should detect most platforms
    
    def test_work_location_extraction(self, analyzer_service):
        """Test work location extraction"""
        test_cases = [
            ("Remote work opportunity", "remote"),
            ("Work from home position", "remote"),
            ("Hybrid work model", "hybrid"),
            ("Flexible work arrangement", "hybrid"),
            ("On-site position in San Francisco", "onsite"),
            ("Office-based role", "onsite")
        ]
        
        for description, expected_location in test_cases:
            requirements = analyzer_service.extract_basic_requirements(description)
            assert requirements.work_location == expected_location
    
    def test_years_experience_extraction(self, analyzer_service):
        """Test years of experience extraction"""
        test_cases = [
            ("5+ years of experience", 5),
            ("Minimum 3 years experience", 3),
            ("7+ years in software development", 7),
            ("2 years of experience required", 2),
            ("10+ years experience", 10)
        ]
        
        for description, expected_years in test_cases:
            requirements = analyzer_service.extract_basic_requirements(description)
            assert requirements.required_experience_years == expected_years
    
    def teardown_method(self):
        """Cleanup after each test"""
        # Reset any global state if needed
        pass