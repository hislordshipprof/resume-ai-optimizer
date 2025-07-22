"""Test suite for Project Generator Service"""
import pytest
import json
from unittest.mock import Mock, patch, MagicMock
from app.services.project_generator import (
    ProjectGeneratorService, 
    ProjectGenerationRequest, 
    GeneratedProjectData
)
from app.services.gap_analyzer import GapAnalysisResult


class TestProjectGeneratorService:
    """Test suite for Project Generator Service"""
    
    @pytest.fixture
    def generator_service(self):
        """Create project generator service instance"""
        return ProjectGeneratorService()
    
    @pytest.fixture
    def sample_gap_result(self):
        """Create sample gap analysis result"""
        return GapAnalysisResult(
            overall_match_score=0.6,
            matching_skills=['Python', 'JavaScript', 'React'],
            missing_required_skills=['TypeScript', 'Node.js', 'GraphQL'],
            missing_technologies=['TypeScript', 'Node.js', 'GraphQL', 'PostgreSQL'],
            missing_languages=['TypeScript', 'Go'],
            missing_frameworks=['Node.js', 'Express'],
            missing_databases=['PostgreSQL', 'MongoDB'],
            missing_cloud_platforms=['AWS', 'Azure']
        )
    
    @pytest.fixture
    def sample_project_request(self):
        """Create sample project generation request"""
        return ProjectGenerationRequest(
            target_skills=['TypeScript', 'Node.js', 'GraphQL'],
            missing_technologies=['TypeScript', 'Node.js', 'GraphQL', 'PostgreSQL'],
            experience_level='mid',
            industry='technology',
            time_commitment_weeks=6,
            project_type='web'
        )
    
    @pytest.fixture
    def mock_openai_response(self):
        """Mock OpenAI response for project generation"""
        return {
            "title": "Full-Stack Task Management System",
            "description": "Build a comprehensive task management system with real-time collaboration features using TypeScript, Node.js, and GraphQL.",
            "duration_weeks": 6,
            "difficulty_level": "mid",
            "target_skills": ["TypeScript", "Node.js", "GraphQL"],
            "technologies_used": ["TypeScript", "Node.js", "GraphQL", "PostgreSQL"],
            "frameworks": ["Express", "Apollo GraphQL"],
            "databases": ["PostgreSQL"],
            "project_phases": [
                {
                    "phase_number": 1,
                    "name": "Backend Setup",
                    "description": "Set up Node.js backend with TypeScript and GraphQL",
                    "estimated_hours": 40,
                    "tasks": ["Setup TypeScript project", "Configure GraphQL server", "Database modeling"],
                    "skills_practiced": ["TypeScript", "Node.js", "GraphQL"],
                    "deliverables": ["Working GraphQL API", "Database schema", "Authentication system"]
                },
                {
                    "phase_number": 2,
                    "name": "Frontend Development",
                    "description": "Create React frontend with TypeScript",
                    "estimated_hours": 60,
                    "tasks": ["Setup React TypeScript project", "GraphQL client integration", "UI components"],
                    "skills_practiced": ["React", "TypeScript", "GraphQL"],
                    "deliverables": ["Responsive UI", "GraphQL integration", "Task management features"]
                }
            ],
            "deliverables": ["Complete task management system", "Deployed application", "Technical documentation"],
            "learning_objectives": ["Master TypeScript", "Learn GraphQL", "Build full-stack applications"],
            "relevance_score": 0.9,
            "feasibility_score": 0.8,
            "impact_score": 0.85
        }
    
    @pytest.fixture
    def mock_gemini_response(self):
        """Mock Gemini response for project generation"""
        return {
            "title": "E-commerce API with GraphQL",
            "description": "Develop a modern e-commerce API using Node.js, TypeScript, and GraphQL with PostgreSQL database.",
            "duration_weeks": 6,
            "difficulty_level": "mid",
            "target_skills": ["TypeScript", "Node.js", "GraphQL"],
            "technologies_used": ["TypeScript", "Node.js", "GraphQL", "PostgreSQL"],
            "frameworks": ["Express", "Apollo Server"],
            "databases": ["PostgreSQL"],
            "project_phases": [
                {
                    "phase_number": 1,
                    "name": "API Foundation",
                    "description": "Build core API infrastructure",
                    "estimated_hours": 45,
                    "tasks": ["Project setup", "Database design", "Authentication"],
                    "skills_practiced": ["TypeScript", "Node.js"],
                    "deliverables": ["API structure", "Database schema", "Auth system"]
                }
            ],
            "deliverables": ["Complete e-commerce API", "Documentation", "Test suite"],
            "learning_objectives": ["Master TypeScript", "Learn GraphQL", "Database design"],
            "relevance_score": 0.85,
            "feasibility_score": 0.9,
            "impact_score": 0.8
        }
    
    def test_load_project_templates(self, generator_service):
        """Test that project templates are loaded correctly"""
        templates = generator_service.project_templates
        
        assert isinstance(templates, dict)
        assert 'web_development' in templates
        assert 'data_science' in templates
        assert 'mobile_development' in templates
        assert 'devops' in templates
        
        # Check web development templates
        web_templates = templates['web_development']
        assert 'fullstack_ecommerce' in web_templates
        assert 'portfolio_website' in web_templates
        
        # Check template structure
        ecommerce_template = web_templates['fullstack_ecommerce']
        assert 'title' in ecommerce_template
        assert 'description' in ecommerce_template
        assert 'phases' in ecommerce_template
        assert 'target_skills' in ecommerce_template
        assert 'difficulty' in ecommerce_template
    
    def test_determine_project_category(self, generator_service):
        """Test project category determination"""
        # Test web development
        web_skills = ['React', 'JavaScript', 'TypeScript']
        assert generator_service._determine_project_category(web_skills) == 'web_development'
        
        # Test data science
        data_skills = ['Python', 'pandas', 'data analysis']
        assert generator_service._determine_project_category(data_skills) == 'data_science'
        
        # Test mobile development
        mobile_skills = ['React Native', 'mobile', 'iOS']
        assert generator_service._determine_project_category(mobile_skills) == 'mobile_development'
        
        # Test devops
        devops_skills = ['Docker', 'Kubernetes', 'CI/CD']
        assert generator_service._determine_project_category(devops_skills) == 'devops'
        
        # Test default fallback
        unknown_skills = ['Unknown skill', 'Random tech']
        assert generator_service._determine_project_category(unknown_skills) == 'web_development'
    
    def test_select_best_template(self, generator_service, sample_project_request):
        """Test template selection"""
        # Test with valid category
        template = generator_service._select_best_template('web_development', sample_project_request)
        assert isinstance(template, dict)
        assert 'title' in template
        assert 'description' in template
        assert 'phases' in template
        
        # Test with invalid category (should fallback to web development)
        template = generator_service._select_best_template('invalid_category', sample_project_request)
        assert isinstance(template, dict)
        assert 'title' in template
    
    def test_customize_template(self, generator_service, sample_project_request):
        """Test template customization"""
        template = {
            'title': 'E-commerce Platform with {technologies}',
            'description': 'Build a complete e-commerce platform',
            'phases': [
                {'name': 'Backend Development', 'duration_weeks': 2, 'skills': ['API design']},
                {'name': 'Frontend Development', 'duration_weeks': 2, 'skills': ['React']}
            ],
            'target_skills': ['web development'],
            'difficulty': 'intermediate'
        }
        
        project = generator_service._customize_template(template, sample_project_request)
        
        assert isinstance(project, GeneratedProjectData)
        assert project.title == 'E-commerce Platform with TypeScript, Node.js, GraphQL'
        assert project.description == 'Build a complete e-commerce platform'
        assert project.duration_weeks == 6
        assert project.difficulty_level == 'mid'
        assert project.target_skills == ['TypeScript', 'Node.js', 'GraphQL']
        assert project.generation_method == 'template'
        assert len(project.project_phases) == 2
        assert len(project.deliverables) > 0
        assert len(project.learning_objectives) > 0
    
    def test_build_phases_from_template(self, generator_service):
        """Test building phases from template"""
        template_phases = [
            {'name': 'Planning', 'duration_weeks': 1, 'skills': ['project planning']},
            {'name': 'Implementation', 'duration_weeks': 3, 'skills': ['coding', 'testing']},
            {'name': 'Deployment', 'duration_weeks': 1, 'skills': ['deployment']}
        ]
        
        phases = generator_service._build_phases_from_template(template_phases)
        
        assert len(phases) == 3
        
        # Check first phase
        first_phase = phases[0]
        assert first_phase['phase_number'] == 1
        assert first_phase['name'] == 'Planning'
        assert first_phase['estimated_hours'] == 20  # 1 week * 20 hours
        assert 'tasks' in first_phase
        assert 'skills_practiced' in first_phase
        assert 'deliverables' in first_phase
        
        # Check second phase
        second_phase = phases[1]
        assert second_phase['phase_number'] == 2
        assert second_phase['estimated_hours'] == 60  # 3 weeks * 20 hours
        assert 'coding' in second_phase['skills_practiced']
        assert 'testing' in second_phase['skills_practiced']
    
    def test_create_project_generation_prompt(self, generator_service, sample_gap_result, sample_project_request):
        """Test AI prompt creation"""
        prompt = generator_service._create_project_generation_prompt(sample_gap_result, sample_project_request)
        
        assert isinstance(prompt, str)
        assert 'TypeScript' in prompt
        assert 'Node.js' in prompt
        assert 'GraphQL' in prompt
        assert 'mid' in prompt
        assert '6 weeks' in prompt
        assert 'technology' in prompt
        assert 'JSON' in prompt
        assert 'project_phases' in prompt
        assert 'deliverables' in prompt
    
    @patch('app.services.project_generator.OpenAI')
    def test_generate_with_openai_success(self, mock_openai_class, generator_service, sample_project_request, mock_openai_response):
        """Test successful OpenAI project generation"""
        # Mock OpenAI response
        mock_client = Mock()
        mock_response = Mock()
        mock_choice = Mock()
        mock_message = Mock()
        mock_message.content = json.dumps(mock_openai_response)
        mock_choice.message = mock_message
        mock_response.choices = [mock_choice]
        mock_client.chat.completions.create.return_value = mock_response
        mock_openai_class.return_value = mock_client
        
        # Set up service
        generator_service.openai_client = mock_client
        generator_service.openai_enabled = True
        
        # Test generation
        prompt = "Generate a project..."
        project = generator_service._generate_with_openai(prompt, sample_project_request)
        
        assert isinstance(project, GeneratedProjectData)
        assert project.title == "Full-Stack Task Management System"
        assert project.generation_method == 'ai'
        assert project.ai_model_used == 'openai'
        assert len(project.project_phases) == 2
        assert len(project.target_skills) == 3
    
    @patch('app.services.project_generator.genai')
    def test_generate_with_gemini_success(self, mock_genai, generator_service, sample_project_request, mock_gemini_response):
        """Test successful Gemini project generation"""
        # Mock Gemini response
        mock_model = Mock()
        mock_response = Mock()
        mock_response.text = json.dumps(mock_gemini_response)
        mock_model.generate_content.return_value = mock_response
        mock_genai.GenerativeModel.return_value = mock_model
        
        # Set up service
        generator_service.gemini_model = mock_model
        generator_service.gemini_enabled = True
        
        # Test generation
        prompt = "Generate a project..."
        project = generator_service._generate_with_gemini(prompt, sample_project_request)
        
        assert isinstance(project, GeneratedProjectData)
        assert project.title == "E-commerce API with GraphQL"
        assert project.generation_method == 'ai'
        assert project.ai_model_used == 'gemini'
        assert len(project.project_phases) == 1
        assert len(project.target_skills) == 3
    
    @patch('app.services.project_generator.OpenAI')
    def test_generate_with_openai_json_parsing_error(self, mock_openai_class, generator_service, sample_project_request):
        """Test OpenAI generation with JSON parsing error"""
        # Mock OpenAI response with invalid JSON
        mock_client = Mock()
        mock_response = Mock()
        mock_choice = Mock()
        mock_message = Mock()
        mock_message.content = "Invalid JSON response"
        mock_choice.message = mock_message
        mock_response.choices = [mock_choice]
        mock_client.chat.completions.create.return_value = mock_response
        mock_openai_class.return_value = mock_client
        
        generator_service.openai_client = mock_client
        generator_service.openai_enabled = True
        
        with pytest.raises(json.JSONDecodeError):
            generator_service._generate_with_openai("test prompt", sample_project_request)
    
    def test_generate_template_project(self, generator_service, sample_gap_result, sample_project_request):
        """Test template-based project generation"""
        project = generator_service._generate_template_project(sample_gap_result, sample_project_request)
        
        assert isinstance(project, GeneratedProjectData)
        assert project.generation_method == 'template'
        assert project.ai_model_used is None
        assert len(project.title) > 0
        assert len(project.description) > 0
        assert project.duration_weeks == 6
        assert project.difficulty_level == 'mid'
        assert len(project.project_phases) > 0
        assert len(project.deliverables) > 0
        assert len(project.learning_objectives) > 0
    
    def test_generate_project_from_gaps_with_ai(self, generator_service, sample_gap_result, sample_project_request):
        """Test main project generation method with AI enabled"""
        # Mock AI enabled but disable to test fallback
        generator_service.openai_enabled = False
        generator_service.gemini_enabled = False
        
        project = generator_service.generate_project_from_gaps(sample_gap_result, sample_project_request)
        
        assert isinstance(project, GeneratedProjectData)
        assert project.generation_method == 'template'
        assert len(project.target_skills) > 0
    
    @patch('app.services.project_generator.OpenAI')
    def test_generate_project_with_ai_fallback_to_template(self, mock_openai_class, generator_service, sample_gap_result, sample_project_request):
        """Test AI generation with fallback to template"""
        # Mock OpenAI to fail
        mock_client = Mock()
        mock_client.chat.completions.create.side_effect = Exception("API Error")
        mock_openai_class.return_value = mock_client
        
        generator_service.openai_client = mock_client
        generator_service.openai_enabled = True
        generator_service.gemini_enabled = False
        
        project = generator_service.generate_project_from_gaps(sample_gap_result, sample_project_request)
        
        assert isinstance(project, GeneratedProjectData)
        assert project.generation_method == 'template'  # Should fallback to template
    
    def test_validate_project_success(self, generator_service):
        """Test project validation with valid project"""
        valid_project = GeneratedProjectData(
            title="Full-Stack Web Application",
            description="Build a comprehensive web application with modern technologies and best practices",
            duration_weeks=6,
            difficulty_level="mid",
            target_skills=["TypeScript", "Node.js", "React"],
            technologies_used=["TypeScript", "Node.js", "React", "PostgreSQL"],
            frameworks=["Express", "React"],
            databases=["PostgreSQL"],
            project_phases=[
                {
                    "phase_number": 1,
                    "name": "Backend Setup",
                    "description": "Set up backend infrastructure",
                    "estimated_hours": 40,
                    "tasks": ["Setup project", "Configure database"],
                    "skills_practiced": ["Node.js", "TypeScript"],
                    "deliverables": ["Working API", "Database schema"]
                }
            ],
            deliverables=["Complete application", "Documentation"],
            learning_objectives=["Master TypeScript", "Learn Node.js"],
            relevance_score=0.9,
            feasibility_score=0.8,
            impact_score=0.85,
            generation_method="ai",
            ai_model_used="openai"
        )
        
        is_valid, issues = generator_service.validate_project(valid_project)
        
        assert is_valid is True
        assert len(issues) == 0
    
    def test_validate_project_failures(self, generator_service):
        """Test project validation with invalid project"""
        invalid_project = GeneratedProjectData(
            title="Short",  # Too short
            description="Brief",  # Too short
            duration_weeks=15,  # Too long
            difficulty_level="mid",
            target_skills=[],  # Empty
            technologies_used=["TypeScript"],
            frameworks=[],
            databases=[],
            project_phases=[],  # Empty
            deliverables=["Something"],
            learning_objectives=["Learn"],
            relevance_score=1.5,  # Invalid
            feasibility_score=-0.1,  # Invalid
            impact_score=0.5,
            generation_method="ai"
        )
        
        is_valid, issues = generator_service.validate_project(invalid_project)
        
        assert is_valid is False
        assert len(issues) > 0
        assert any("Title too short" in issue for issue in issues)
        assert any("Description too short" in issue for issue in issues)
        assert any("Duration should be" in issue for issue in issues)
        assert any("No target skills" in issue for issue in issues)
        assert any("No project phases" in issue for issue in issues)
        assert any("relevance score" in issue for issue in issues)
        assert any("feasibility score" in issue for issue in issues)
    
    def test_project_generation_request_validation(self):
        """Test ProjectGenerationRequest model validation"""
        # Valid request
        valid_request = ProjectGenerationRequest(
            target_skills=["TypeScript", "Node.js"],
            missing_technologies=["GraphQL"],
            experience_level="mid",
            industry="technology",
            time_commitment_weeks=4,
            project_type="web"
        )
        
        assert valid_request.target_skills == ["TypeScript", "Node.js"]
        assert valid_request.experience_level == "mid"
        assert valid_request.time_commitment_weeks == 4
        
        # Test with minimal required fields
        minimal_request = ProjectGenerationRequest(
            target_skills=["Python"]
        )
        
        assert minimal_request.target_skills == ["Python"]
        assert minimal_request.experience_level == "mid"  # Default
        assert minimal_request.time_commitment_weeks == 4  # Default
        assert minimal_request.missing_technologies == []  # Default
    
    def test_generated_project_data_validation(self):
        """Test GeneratedProjectData model validation"""
        # Test with minimal required fields
        project_data = GeneratedProjectData(
            title="Test Project",
            description="A test project for validation",
            duration_weeks=4,
            difficulty_level="mid",
            target_skills=["Python"],
            technologies_used=["Python"],
            project_phases=[],
            deliverables=["Working app"],
            learning_objectives=["Learn Python"],
            relevance_score=0.8,
            feasibility_score=0.9,
            impact_score=0.7,
            generation_method="template"
        )
        
        assert project_data.title == "Test Project"
        assert project_data.frameworks == []  # Default
        assert project_data.databases == []  # Default
        assert project_data.ai_model_used is None  # Default
        assert project_data.template_id is None  # Default
    
    def test_skill_based_template_selection(self, generator_service):
        """Test that templates are selected based on skills"""
        # Test web development skills
        web_request = ProjectGenerationRequest(
            target_skills=["React", "JavaScript", "TypeScript"],
            experience_level="mid"
        )
        category = generator_service._determine_project_category(web_request.target_skills)
        assert category == "web_development"
        
        # Test data science skills
        data_request = ProjectGenerationRequest(
            target_skills=["Python", "pandas", "machine learning"],
            experience_level="mid"
        )
        category = generator_service._determine_project_category(data_request.target_skills)
        assert category == "data_science"
        
        # Test mobile development skills
        mobile_request = ProjectGenerationRequest(
            target_skills=["Flutter", "mobile development", "Android"],
            experience_level="mid"
        )
        category = generator_service._determine_project_category(mobile_request.target_skills)
        assert category == "mobile_development"
    
    def test_phase_estimation_consistency(self, generator_service):
        """Test that phase time estimations are consistent"""
        template_phases = [
            {'name': 'Phase 1', 'duration_weeks': 2, 'skills': ['skill1']},
            {'name': 'Phase 2', 'duration_weeks': 3, 'skills': ['skill2']},
            {'name': 'Phase 3', 'duration_weeks': 1, 'skills': ['skill3']}
        ]
        
        phases = generator_service._build_phases_from_template(template_phases)
        
        # Check that estimated hours match duration weeks
        assert phases[0]['estimated_hours'] == 40  # 2 weeks * 20 hours
        assert phases[1]['estimated_hours'] == 60  # 3 weeks * 20 hours
        assert phases[2]['estimated_hours'] == 20  # 1 week * 20 hours
        
        # Check that total estimated hours make sense
        total_hours = sum(phase['estimated_hours'] for phase in phases)
        assert total_hours == 120  # 6 weeks * 20 hours
    
    def test_project_customization_edge_cases(self, generator_service):
        """Test template customization with edge cases"""
        # Test with empty technologies
        request = ProjectGenerationRequest(
            target_skills=["Python"],
            missing_technologies=[],
            experience_level="entry"
        )
        
        template = {
            'title': 'Project with {technologies}',
            'description': 'Test project',
            'phases': [{'name': 'Phase 1', 'duration_weeks': 1, 'skills': ['Python']}],
            'target_skills': ['Python'],
            'difficulty': 'beginner'
        }
        
        project = generator_service._customize_template(template, request)
        
        # Should handle empty technologies gracefully
        assert '{technologies}' not in project.title
        assert project.technologies_used == []
    
    def teardown_method(self):
        """Cleanup after each test"""
        # Reset any global state if needed
        pass