// ===== AUTHENTICATION TYPES =====

export interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  full_name: string;
}

export interface AuthToken {
  access_token: string;
  token_type: string;
}

// ===== RESUME TYPES =====

export interface Resume {
  id: number;
  filename: string;
  file_type: string;
  file_size: number;
  is_processed: boolean;
  full_name?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  processing_error?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ResumeDetail extends Resume {
  raw_text?: string;
  parsed_data?: ParsedResumeData;
}

export interface ParsedResumeData {
  personal_info: {
    name?: string;
    email?: string;
    phone?: string;
    linkedin?: string;
    location?: string;
  };
  summary?: string;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    school: string;
    year: string;
    gpa?: string;
  }>;
  skills: string[];
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
  }>;
}

// ===== JOB ANALYSIS TYPES =====

export interface JobAnalysisRequest {
  job_title?: string;
  company_name?: string;
  job_description: string;
}

export interface JobAnalysis {
  id: number;
  job_title?: string;
  company_name?: string;
  is_processed: boolean;
  confidence_score?: number;
  processing_error?: string;
  extracted_requirements?: JobRequirements;
  created_at?: string;
}

export interface JobRequirements {
  required_skills: string[];
  preferred_skills: string[];
  experience_level: string;
  education_requirements: string[];
  responsibilities: string[];
  technologies: string[];
  certifications: string[];
  soft_skills: string[];
  industry_keywords: string[];
  job_level: string;
  salary_range?: string;
  benefits?: string[];
}

// ===== GAP ANALYSIS TYPES =====

export interface GapAnalysisRequest {
  resume_id: number;
  job_analysis_id: number;
}

export interface GapAnalysis {
  id: number;
  resume_id: number;
  job_analysis_id: number;
  overall_match_score: number;
  is_processed: boolean;
  confidence_score?: number;
  processing_error?: string;
  analysis_results?: GapAnalysisResults;
  created_at?: string;
}

export interface GapAnalysisResults {
  overall_match_score: number;
  skills_analysis: {
    matching_skills: string[];
    missing_required_skills: string[];
    missing_preferred_skills: string[];
    additional_skills: string[];
    skills_match_score: number;
  };
  experience_analysis: {
    experience_match_score: number;
    relevant_experience: string[];
    missing_experience: string[];
    experience_gap_years: number;
  };
  education_analysis: {
    education_match_score: number;
    matching_education: string[];
    missing_education: string[];
  };
  keyword_analysis: {
    keyword_match_score: number;
    matching_keywords: string[];
    missing_keywords: string[];
    keyword_density: number;
  };
  recommendations: Array<{
    type: 'skill' | 'project' | 'experience' | 'education' | 'keyword';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    implementation_effort: 'low' | 'medium' | 'high';
  }>;
  ats_compatibility_score: number;
  improvement_suggestions: string[];
}

// ===== PROJECT GENERATION TYPES =====

export interface ProjectGenerationRequest {
  resume_id: number;
  job_analysis_id: number;
  target_skills: string[];
  missing_technologies: string[];
  time_commitment_weeks: number;
  project_type: string;
  industry: string;
}

export interface GeneratedProject {
  id: number;
  resume_id: number;
  job_analysis_id: number;
  project_title: string;
  project_description: string;
  target_skills: string[];
  technologies_used: string[];
  time_commitment_weeks: number;
  project_type: string;
  industry: string;
  is_approved: boolean;
  is_processed: boolean;
  confidence_score?: number;
  processing_error?: string;
  project_details?: ProjectDetails;
  created_at?: string;
}

export interface ProjectDetails {
  overview: string;
  objectives: string[];
  phases: Array<{
    phase_name: string;
    duration_weeks: number;
    deliverables: string[];
    skills_developed: string[];
    key_activities: string[];
  }>;
  technologies: Array<{
    technology: string;
    purpose: string;
    learning_curve: 'easy' | 'medium' | 'hard';
  }>;
  final_deliverables: string[];
  learning_outcomes: string[];
  portfolio_value: string;
  real_world_application: string;
  success_metrics: string[];
}

// ===== RESUME OPTIMIZATION TYPES =====

export interface ResumeOptimizationRequest {
  resume_id: number;
  job_analysis_id: number;
  target_job_title: string;
  optimization_focus: string[];
  include_projects: boolean;
  max_pages: number;
  format_style: string;
}

export interface OptimizedResume {
  id: number;
  resume_id: number;
  job_analysis_id: number;
  target_job_title: string;
  is_processed: boolean;
  ats_score?: number;
  confidence_score?: number;
  processing_error?: string;
  optimized_content?: OptimizedContent;
  created_at?: string;
}

export interface OptimizedContent {
  personal_info: {
    name: string;
    email: string;
    phone: string;
    linkedin?: string;
    location?: string;
  };
  professional_summary: string;
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    bullets: string[];
    keywords_added: string[];
    improvements_made: string[];
  }>;
  skills: {
    technical_skills: string[];
    soft_skills: string[];
    tools_technologies: string[];
    certifications: string[];
  };
  education: Array<{
    degree: string;
    school: string;
    year: string;
    relevant_coursework?: string[];
    achievements?: string[];
  }>;
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
    achievements: string[];
    is_generated: boolean;
  }>;
  improvements_summary: {
    total_improvements: number;
    keywords_added: number;
    bullets_enhanced: number;
    sections_optimized: string[];
    ats_score_improvement: number;
  };
}

// ===== REAL-TIME OPTIMIZATION TYPES =====

export interface RealtimeAnalysisRequest {
  resume_id: number;
  job_analysis_id: number;
  section: string;
  field: string;
  old_value: string;
  new_value: string;
  cursor_position: number;
}

export interface OptimizationSuggestion {
  id: string;
  type: 'keyword' | 'impact' | 'structure' | 'content' | 'grammar';
  section: string;
  field: string;
  original_text: string;
  suggested_text: string;
  reason: string;
  impact: 'high' | 'medium' | 'low';
  confidence_score: number;
  keywords_added?: string[];
  improvements: string[];
  position: {
    start: number;
    end: number;
  };
}

export interface OptimizationInsights {
  overall_score: number;
  ats_compatibility: number;
  keyword_density: number;
  sections_analysis: {
    [key: string]: {
      score: number;
      suggestions_count: number;
      improvements_needed: string[];
      strengths: string[];
    };
  };
  top_recommendations: Array<{
    type: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    effort: 'low' | 'medium' | 'high';
  }>;
  keyword_analysis: {
    matching_keywords: string[];
    missing_keywords: string[];
    overused_keywords: string[];
    suggested_keywords: string[];
  };
  industry_insights: {
    industry_match: number;
    trending_skills: string[];
    recommended_certifications: string[];
  };
}

// ===== EXPORT TYPES =====

export interface ExportOptions {
  format: 'latex' | 'pdf';
  template: string;
  style: string;
  include_projects: boolean;
  max_pages: number;
  font_size: number;
  margins: string;
  color_scheme: string;
}

// ===== API RESPONSE WRAPPERS =====

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// ===== ERROR TYPES =====

export interface ApiError {
  detail: string;
  status_code: number;
  error_type?: string;
}

// ===== HEALTH CHECK =====

export interface HealthResponse {
  status: string;
  timestamp: number;
  version: string;
}