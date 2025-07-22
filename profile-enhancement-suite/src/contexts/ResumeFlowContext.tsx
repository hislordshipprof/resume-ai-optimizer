import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ParsedResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    linkedin?: string;
    location?: string;
  };
  summary: string;
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
  backendId?: number;
}

export interface JobAnalysisData {
  title: string;
  company: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  experienceLevel: string;
  responsibilities: string[];
  backendId?: number;
}

export interface GapAnalysisData {
  overallScore: number;
  missingSkills: string[];
  matchingSkills: string[];
  recommendations: Array<{
    type: 'skill' | 'project' | 'experience';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
  }>;
  experienceGap: {
    required: string;
    current: string;
    gap: string;
  };
  industryFit: number;
  atsCompatibility: number;
}

export interface GeneratedProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  achievements: string[];
  targetSkills: string[];
}

export interface ResumeFlowState {
  currentStep: number;
  resumeData: ParsedResumeData | null;
  jobAnalysis: JobAnalysisData | null;
  gapAnalysis: GapAnalysisData | null;
  generatedProjects: GeneratedProject[];
  optimizedContent: {
    summary?: string | string[];
    experience?: string[];
    skills?: string[];
    projects?: string[];
  };
  isStepCompleted: boolean[];
}

interface ResumeFlowContextType {
  state: ResumeFlowState;
  setCurrentStep: (step: number) => void;
  setResumeData: (data: ParsedResumeData) => void;
  setJobAnalysis: (data: JobAnalysisData) => void;
  setGapAnalysis: (data: GapAnalysisData) => void;
  setGeneratedProjects: (projects: GeneratedProject[]) => void;
  setOptimizedContent: (content: ResumeFlowState['optimizedContent']) => void;
  markStepCompleted: (step: number) => void;
  canProceedToStep: (step: number) => boolean;
  resetFlow: () => void;
}

const initialState: ResumeFlowState = {
  currentStep: 1,
  resumeData: null,
  jobAnalysis: null,
  gapAnalysis: null,
  generatedProjects: [],
  optimizedContent: {},
  isStepCompleted: [false, false, false, false, false, false],
};

const ResumeFlowContext = createContext<ResumeFlowContextType | undefined>(undefined);

export function ResumeFlowProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ResumeFlowState>(() => {
    const saved = localStorage.getItem('resumeFlowState');
    return saved ? JSON.parse(saved) : initialState;
  });

  useEffect(() => {
    localStorage.setItem('resumeFlowState', JSON.stringify(state));
  }, [state]);

  const setCurrentStep = (step: number) => {
    setState(prev => ({ ...prev, currentStep: step }));
  };

  const setResumeData = (data: ParsedResumeData) => {
    setState(prev => ({ ...prev, resumeData: data }));
    markStepCompleted(1);
  };

  const setJobAnalysis = (data: JobAnalysisData) => {
    setState(prev => ({ ...prev, jobAnalysis: data }));
    markStepCompleted(2);
  };

  const setGapAnalysis = (data: GapAnalysisData) => {
    setState(prev => ({ ...prev, gapAnalysis: data }));
    markStepCompleted(3);
  };

  const setGeneratedProjects = (projects: GeneratedProject[]) => {
    setState(prev => ({ ...prev, generatedProjects: projects }));
    markStepCompleted(5);
  };

  const setOptimizedContent = (content: ResumeFlowState['optimizedContent']) => {
    setState(prev => ({ ...prev, optimizedContent: { ...prev.optimizedContent, ...content } }));
    markStepCompleted(4);
  };

  const markStepCompleted = (step: number) => {
    setState(prev => {
      const newCompleted = [...prev.isStepCompleted];
      newCompleted[step - 1] = true;
      return { ...prev, isStepCompleted: newCompleted };
    });
  };

  const canProceedToStep = (step: number) => {
    if (step === 1) return true;
    return state.isStepCompleted[step - 2];
  };

  const resetFlow = () => {
    setState(initialState);
    localStorage.removeItem('resumeFlowState');
  };

  return (
    <ResumeFlowContext.Provider
      value={{
        state,
        setCurrentStep,
        setResumeData,
        setJobAnalysis,
        setGapAnalysis,
        setGeneratedProjects,
        setOptimizedContent,
        markStepCompleted,
        canProceedToStep,
        resetFlow,
      }}
    >
      {children}
    </ResumeFlowContext.Provider>
  );
}

export function useResumeFlow() {
  const context = useContext(ResumeFlowContext);
  if (context === undefined) {
    throw new Error('useResumeFlow must be used within a ResumeFlowProvider');
  }
  return context;
}