import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle, Target, TrendingUp, BookOpen, Briefcase, Star, ChevronRight, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useResumeFlow } from "@/contexts/ResumeFlowContext";
import { apiService } from "@/services/apiService";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

interface GapAnalysisData {
  overallScore: number;
  missingSkills: string[];
  matchingSkills: string[];
  recommendations: Array<{
    type: 'skill' | 'experience' | 'project';
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

interface GapAnalysisResultsProps {
  data?: GapAnalysisData;
  className?: string;
}

const mockData: GapAnalysisData = {
  overallScore: 78,
  missingSkills: ["AWS", "Docker", "Kubernetes", "GraphQL"],
  matchingSkills: ["React", "TypeScript", "Node.js", "JavaScript", "CSS"],
  recommendations: [
    {
      type: 'skill',
      title: 'Learn AWS Cloud Services',
      description: 'Add AWS experience through certification or hands-on projects',
      priority: 'high'
    },
    {
      type: 'project',
      title: 'Build a Microservices Project',
      description: 'Create a project showcasing Docker and Kubernetes',
      priority: 'high'
    },
    {
      type: 'experience',
      title: 'Highlight Leadership Experience',
      description: 'Emphasize team lead and mentoring experiences',
      priority: 'medium'
    }
  ],
  experienceGap: {
    required: "5+ years",
    current: "3 years",
    gap: "2 years"
  },
  industryFit: 85,
  atsCompatibility: 72
};

export const GapAnalysisResults = ({ data, className }: GapAnalysisResultsProps) => {
  const { state, setCurrentStep, markStepCompleted } = useResumeFlow();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<GapAnalysisData | null>(data || null);

  // Use data from context if available, otherwise use provided data or mock data
  const gapData = analysisData || state.gapAnalysis || mockData;

  // Perform gap analysis if we have resume and job data but no gap analysis yet
  useEffect(() => {
    if (
      state.resumeData &&
      state.jobAnalysis &&
      !state.gapAnalysis &&
      !analysisData &&
      !isAnalyzing
    ) {
      handleGapAnalysis();
    }
  }, [state.resumeData, state.jobAnalysis, state.gapAnalysis, analysisData, isAnalyzing]);

  const handleGapAnalysis = async () => {
    if (!state.resumeData || !state.jobAnalysis) {
      toast({
        title: "Missing Data",
        description: "Please complete resume upload and job analysis first.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Call the backend gap analysis API
      const response = await apiService.analyzeGap({
        resume_id: state.resumeData.backendId || 1, // Use stored backend ID
        job_analysis_id: state.jobAnalysis.backendId || 1 // Use stored backend ID
      });

      // Transform backend response to frontend format
      const gapAnalysisData: GapAnalysisData = {
        overallScore: response.overall_score || 0,
        missingSkills: response.missing_skills || [],
        matchingSkills: response.matching_skills || [],
        recommendations: (response.recommendations || []).map((rec: any) => ({
          type: rec.type || 'skill',
          title: rec.title || 'Recommendation',
          description: rec.description || 'No description available',
          priority: rec.priority || 'medium'
        })),
        experienceGap: {
          required: response.experience_gap?.required || 'Not specified',
          current: response.experience_gap?.current || 'Not specified',
          gap: response.experience_gap?.gap || 'Not specified'
        },
        industryFit: response.industry_fit || 85,
        atsCompatibility: response.ats_compatibility || 90
      };

      setAnalysisData(gapAnalysisData);
      markStepCompleted(3);

      toast({
        title: "Gap Analysis Complete",
        description: "Successfully analyzed the gap between your resume and job requirements.",
      });

    } catch (error) {
      console.error('Gap analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze gap. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRefreshAnalysis = () => {
    setAnalysisData(null);
    handleGapAnalysis();
  };
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-success";
    if (score >= 60) return "bg-warning";
    return "bg-destructive";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'warning';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  // Show loading state while analyzing
  if (isAnalyzing) {
    return (
      <div className={cn("space-y-6", className)}>
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
              <h3 className="text-lg font-semibold">Analyzing Gap...</h3>
              <p className="text-muted-foreground">
                Comparing your resume with job requirements to identify gaps and opportunities.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Gap Analysis Results
              </CardTitle>
              <CardDescription>
                Analysis of your resume against the job requirements
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefreshAnalysis}
                disabled={isAnalyzing}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            <div className="text-center">
              <div className={cn("text-3xl font-bold", getScoreColor(gapData.overallScore))}>
                {gapData.overallScore}%
              </div>
              <p className="text-sm text-muted-foreground">Overall Match</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Industry Fit</span>
                <span className={cn("text-sm font-bold", getScoreColor(gapData.industryFit))}>
                  {gapData.industryFit}%
                </span>
              </div>
              <Progress value={gapData.industryFit} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">ATS Compatibility</span>
                <span className={cn("text-sm font-bold", getScoreColor(gapData.atsCompatibility))}>
                  {gapData.atsCompatibility}%
                </span>
              </div>
              <Progress value={gapData.atsCompatibility} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Overall Score</span>
                <span className={cn("text-sm font-bold", getScoreColor(gapData.overallScore))}>
                  {gapData.overallScore}%
                </span>
              </div>
              <Progress value={gapData.overallScore} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Analysis */}
      <Tabs defaultValue="skills" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>
        
        <TabsContent value="skills" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  Matching Skills ({gapData.matchingSkills.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {gapData.matchingSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-success/10 text-success border-success/20">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-warning" />
                  Missing Skills ({gapData.missingSkills.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {gapData.missingSkills.map((skill) => (
                    <Badge key={skill} variant="destructive" className="bg-destructive/10 text-destructive">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="experience" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Experience Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Required</p>
                  <p className="text-lg font-semibold">{gapData.experienceGap.required}</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Your Experience</p>
                  <p className="text-lg font-semibold">{gapData.experienceGap.current}</p>
                </div>
                <div className="text-center p-4 bg-warning/10 rounded-lg border border-warning/20">
                  <p className="text-sm text-muted-foreground">Gap</p>
                  <p className="text-lg font-semibold text-warning">{gapData.experienceGap.gap}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-4">
          <div className="space-y-4">
            {gapData.recommendations.map((rec, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {rec.type === 'skill' && <BookOpen className="w-4 h-4" />}
                        {rec.type === 'project' && <Star className="w-4 h-4" />}
                        {rec.type === 'experience' && <TrendingUp className="w-4 h-4" />}
                        <h4 className="font-semibold">{rec.title}</h4>
                        <Badge variant={getPriorityColor(rec.priority) as any}>
                          {rec.priority} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Suggested Projects
              </CardTitle>
              <CardDescription>
                AI-generated project ideas to fill skill gaps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">
                  Generate custom project recommendations based on your gap analysis
                </p>
                <Button variant="ai">
                  Generate Project Ideas
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-6 border-t">
        <Button variant="outline" onClick={() => setCurrentStep(2)}>
          Back to Job Analysis
        </Button>
        <Button 
          onClick={() => setCurrentStep(4)}
          className="flex items-center gap-2"
          disabled={!gapData || isAnalyzing}
        >
          Continue to Optimization
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};