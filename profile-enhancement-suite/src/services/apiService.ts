import { toast } from "@/hooks/use-toast";

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  // Set authentication token
  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  // Clear authentication token
  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Get authorization headers
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Handle API response
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      if (response.status === 401) {
        this.clearToken();
        window.location.href = '/auth';
        throw new Error('Authentication required');
      }

      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.detail || errorData.message || `HTTP ${response.status}`;
      
      toast({
        title: "API Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  }

  // Generic HTTP methods
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
      mode: 'cors',
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse<T>(response);
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // ===== AUTHENTICATION ENDPOINTS =====

  async register(userData: {
    email: string;
    password: string;
    full_name: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: {
    email: string;
    password: string;
  }) {
    const response = await this.request<{access_token: string; token_type: string}>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.access_token) {
      this.setToken(response.access_token);
    }
    
    return response;
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  async logout() {
    this.clearToken();
  }

  // ===== RESUME ENDPOINTS =====

  async uploadResume(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const url = `${this.baseURL}/resumes/upload`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      body: formData,
    });

    return this.handleResponse(response);
  }

  async getResumes() {
    return this.request('/resumes/');
  }

  async getResumeDetail(resumeId: number) {
    return this.request(`/resumes/${resumeId}`);
  }

  async deleteResume(resumeId: number) {
    return this.request(`/resumes/${resumeId}`, {
      method: 'DELETE',
    });
  }

  // ===== JOB ANALYSIS ENDPOINTS =====

  async analyzeJobDescription(jobData: {
    job_title?: string;
    company_name?: string;
    job_description: string;
  }) {
    return this.request('/job-analysis/analyze', {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  }

  async getJobAnalyses() {
    return this.request('/job-analysis/');
  }

  async getJobAnalysisDetail(analysisId: number) {
    return this.request(`/job-analysis/${analysisId}`);
  }

  async deleteJobAnalysis(analysisId: number) {
    return this.request(`/job-analysis/${analysisId}`, {
      method: 'DELETE',
    });
  }

  // ===== GAP ANALYSIS ENDPOINTS =====

  async analyzeGap(data: {
    resume_id: number;
    job_analysis_id: number;
  }) {
    return this.request('/gap-analysis/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCompatibleJobs(resumeId: number) {
    return this.request(`/gap-analysis/resume/${resumeId}/jobs`);
  }

  async getQuickMatch(resumeId: number, jobAnalysisId: number) {
    return this.request(`/gap-analysis/quick-match/${resumeId}/${jobAnalysisId}`);
  }

  // ===== PROJECT GENERATION ENDPOINTS =====

  async generateProject(data: {
    resume_id: number;
    job_analysis_id: number;
    target_skills: string[];
    missing_technologies: string[];
    time_commitment_weeks: number;
    project_type: string;
    industry: string;
  }) {
    return this.request('/projects/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getGeneratedProjects() {
    return this.request('/projects/list');
  }

  async getProjectDetail(projectId: number) {
    return this.request(`/projects/${projectId}`);
  }

  async approveProject(projectId: number) {
    return this.request(`/projects/${projectId}/approve`, {
      method: 'POST',
    });
  }

  async deleteProject(projectId: number) {
    return this.request(`/projects/${projectId}`, {
      method: 'DELETE',
    });
  }

  async regenerateProject(projectId: number, data: any) {
    return this.request(`/projects/regenerate/${projectId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // ===== RESUME OPTIMIZATION ENDPOINTS =====

  async optimizeResume(data: {
    resume_id: number;
    job_analysis_id: number;
    target_job_title: string;
    optimization_focus: string[];
    include_projects: boolean;
    max_pages: number;
    format_style: string;
  }) {
    return this.request('/resume-optimization/optimize', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async exportResumeLatex(data: any) {
    const response = await fetch(`${this.baseURL}/resume-optimization/export/latex`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to export LaTeX');
    }

    return response.blob();
  }

  async exportResumePdf(data: any) {
    const response = await fetch(`${this.baseURL}/resume-optimization/export/pdf`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to export PDF');
    }

    return response.blob();
  }

  async previewOptimization(data: any) {
    return this.request('/resume-optimization/preview', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getResumeScore(data: any) {
    return this.request('/resume-optimization/score', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getTemplates() {
    return this.request('/resume-optimization/templates');
  }

  async getATSKeywords(industry: string) {
    return this.request(`/resume-optimization/ats-keywords/${industry}`);
  }

  async getLatexInstructions() {
    return this.request('/resume-optimization/latex/instructions');
  }

  // ===== REAL-TIME OPTIMIZATION ENDPOINTS =====

  async analyzeRealtime(data: {
    resume_id: number;
    job_analysis_id: number;
    section: string;
    field: string;
    old_value: string;
    new_value: string;
    cursor_position: number;
  }) {
    return this.request('/realtime/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async applySuggestion(data: {
    suggestion_id: string;
    resume_id: number;
    section: string;
    field: string;
    new_value: string;
  }) {
    return this.request('/realtime/apply-suggestion', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async applyBatchSuggestions(data: {
    suggestion_ids: string[];
    resume_id: number;
  }) {
    return this.request('/realtime/apply-batch', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOptimizationInsights(resumeId: number, jobAnalysisId: number) {
    return this.request(`/realtime/insights/${resumeId}/${jobAnalysisId}`);
  }

  // Server-Sent Events for real-time suggestions
  createOptimizationStream(resumeId: number, jobAnalysisId: number): EventSource {
    const url = `${this.baseURL}/realtime/stream/${resumeId}/${jobAnalysisId}`;
    const eventSource = new EventSource(url);
    
    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      toast({
        title: "Connection Error",
        description: "Lost connection to real-time optimization service",
        variant: "destructive",
      });
    };

    return eventSource;
  }

  async clearOptimizationCache() {
    return this.request('/realtime/cache/clear', {
      method: 'POST',
    });
  }

  async getCacheStats() {
    return this.request('/realtime/cache/stats');
  }

  // ===== HEALTH CHECK =====

  async checkHealth() {
    return this.request('/health');
  }

  // ===== TEST CONNECTION =====
  async testConnection() {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Connection test failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;