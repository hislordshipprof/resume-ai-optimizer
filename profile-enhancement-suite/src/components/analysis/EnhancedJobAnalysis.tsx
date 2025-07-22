import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Target,
  Briefcase,
  TrendingUp,
  Users,
  MapPin,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  Zap,
  Lightbulb,
  BarChart3,
  ChevronRight
} from "lucide-react";
import { useResumeFlow, JobAnalysisData, GapAnalysisData } from "@/contexts/ResumeFlowContext";
import { apiService } from "@/services/apiService";
import { toast } from "@/hooks/use-toast";

interface JobAnalysis {
  overview: {
    title: string;
    company: string;
    location: string;
    type: string;
    experience: string;
    salary?: string;
  };
  requirements: {
    technical: string[];
    soft: string[];
    education: string[];
    experience: string[];
  };
  keywords: {
    term: string;
    frequency: number;
    importance: 'high' | 'medium' | 'low';
  }[];
  insights: {
    competitionLevel: number;
    marketDemand: number;
    salaryRange: string;
    growthPotential: number;
    cultureIndicators: string[];
  };
  gapAnalysis: {
    matchingSkills: string[];
    missingSkills: string[];
    experienceGap: {
      required: string;
      current: string;
      gap: string;
    };
    overallMatch: number;
    recommendations: {
      type: 'skill' | 'experience' | 'education' | 'project';
      title: string;
      description: string;
      priority: 'high' | 'medium' | 'low';
    }[];
  };
}

export function EnhancedJobAnalysis() {
  const { state, setJobAnalysis, setGapAnalysis, setCurrentStep, markStepCompleted } = useResumeFlow();
  const [jobUrl, setJobUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<JobAnalysis | null>(null);

  const handleAnalyze = async () => {
    if (!jobDescription.trim() && !jobUrl.trim()) return;
    
    setIsAnalyzing(true);
    
    try {
      // Call backend API to analyze job description
      const jobAnalysisResponse = await apiService.analyzeJobDescription({
        job_description: jobDescription,
        job_title: jobUrl ? "Job from URL" : undefined,
        company_name: jobUrl ? "Company" : undefined
      });

      // Transform backend response to frontend format
      const backendAnalysis = jobAnalysisResponse;
      
      // Create analysis object for UI display
      const mockAnalysis: JobAnalysis = {
        overview: {
          title: backendAnalysis.job_title || "Job Position",
          company: backendAnalysis.company_name || "Company",
          location: backendAnalysis.location || "Remote",
          type: backendAnalysis.job_type || "Full-time",
          experience: backendAnalysis.experience_level || "Entry Level",
          salary: backendAnalysis.salary_range || "Competitive"
        },
        requirements: {
          technical: backendAnalysis.required_skills || [],
          soft: backendAnalysis.soft_skills || [],
          education: backendAnalysis.education_requirements || [],
          experience: backendAnalysis.experience_requirements || []
        },
        keywords: (backendAnalysis.keywords || []).map((keyword: any, index: number) => ({
          term: keyword.term || keyword,
          frequency: keyword.frequency || Math.floor(Math.random() * 10) + 1,
          importance: index < 3 ? 'high' : index < 6 ? 'medium' : 'low'
        })),
        insights: {
          competitionLevel: backendAnalysis.competition_level || 75,
          marketDemand: backendAnalysis.market_demand || 85,
          salaryRange: backendAnalysis.salary_range || "Competitive",
          growthPotential: backendAnalysis.growth_potential || 90,
          cultureIndicators: backendAnalysis.culture_indicators || ["Professional", "Collaborative"]
        },
        gapAnalysis: {
          matchingSkills: [],
          missingSkills: [],
          experienceGap: {
            required: backendAnalysis.experience_level || "Entry Level",
            current: "Current level",
            gap: "To be determined"
          },
          overallMatch: 0,
          recommendations: []
        }
      };

      // If we have resume data, perform gap analysis
      if (state.resumeData) {
        const userSkills = state.resumeData.skills;
        const requiredSkills = backendAnalysis.required_skills || [];
        const missingSkills = requiredSkills.filter(skill => !userSkills.some(userSkill => 
          userSkill.toLowerCase().includes(skill.toLowerCase())
        ));
        const matchingSkills = requiredSkills.filter(skill => userSkills.some(userSkill => 
          userSkill.toLowerCase().includes(skill.toLowerCase())
        ));

        const overallMatch = requiredSkills.length > 0 ? 
          Math.round((matchingSkills.length / requiredSkills.length) * 100) : 0;

        mockAnalysis.gapAnalysis = {
          matchingSkills,
          missingSkills,
          experienceGap: {
            required: backendAnalysis.experience_level || "Entry Level",
            current: "Current level",
            gap: "Experience gap to be assessed"
          },
          overallMatch,
          recommendations: [
            {
              type: 'skill',
              title: `Learn ${missingSkills.slice(0, 3).join(', ')}`,
              description: `Focus on these key missing skills: ${missingSkills.slice(0, 3).join(', ')}`,
              priority: 'high'
            },
            {
              type: 'project',
              title: "Build relevant projects",
              description: "Create projects that demonstrate the missing skills",
              priority: 'medium'
            },
            {
              type: 'experience',
              title: "Highlight relevant experience",
              description: "Emphasize experience that matches job requirements",
              priority: 'high'
            }
          ].filter(rec => rec.title !== 'Learn ')
        };

        // Save gap analysis to context
        const gapData: GapAnalysisData = {
          overallScore: overallMatch,
          missingSkills,
          matchingSkills,
          recommendations: mockAnalysis.gapAnalysis.recommendations,
          experienceGap: mockAnalysis.gapAnalysis.experienceGap,
          industryFit: 85,
          atsCompatibility: 92
        };
        setGapAnalysis(gapData);
      }
      
      setAnalysis(mockAnalysis);

      // Save job analysis to context
      const jobAnalysisData: JobAnalysisData = {
        title: backendAnalysis.job_title || "Job Position",
        company: backendAnalysis.company_name || "Company",
        description: jobDescription,
        requiredSkills: backendAnalysis.required_skills || [],
        preferredSkills: backendAnalysis.preferred_skills || [],
        experienceLevel: backendAnalysis.experience_level || "Entry Level",
        responsibilities: backendAnalysis.responsibilities || [],
        backendId: backendAnalysis.id || jobAnalysisResponse.id
      };
      setJobAnalysis(jobAnalysisData);
      markStepCompleted(2);

      toast({
        title: "Job Analysis Complete",
        description: "Successfully analyzed job requirements and generated insights.",
      });

    } catch (error) {
      console.error('Job analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Failed to analyze job description. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="professional-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Job Description Analysis
          </CardTitle>
          <CardDescription>
            Paste a job posting URL or description for AI-powered requirement analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Job Posting URL (Optional)</label>
            <Input
              placeholder="https://company.com/jobs/senior-frontend-developer"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Job Description</label>
            <Textarea
              placeholder="Paste the complete job description here..."
              className="min-h-32"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={handleAnalyze}
            disabled={isAnalyzing || (!jobDescription.trim() && !jobUrl.trim())}
            className="ai-button w-full"
          >
            {isAnalyzing ? (
              <>
                <Zap className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Job Requirements...
              </>
            ) : (
              <>
                <BarChart3 className="h-4 w-4 mr-2" />
                Analyze Job
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysis && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="insights">Market Insights</TabsTrigger>
            <TabsTrigger value="gap">Gap Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Job Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold">{analysis.overview.title}</h3>
                      <p className="text-lg text-muted-foreground">{analysis.overview.company}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{analysis.overview.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{analysis.overview.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{analysis.overview.experience}</span>
                      </div>
                      {analysis.overview.salary && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{analysis.overview.salary}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Card className="bg-muted/30">
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-3">Top Keywords</h4>
                      <div className="space-y-2">
                        {analysis.keywords.slice(0, 5).map((keyword, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm">{keyword.term}</span>
                            <div className="flex items-center gap-2">
                              <Badge className={getImportanceColor(keyword.importance)}>
                                {keyword.importance}
                              </Badge>
                              <span className="text-xs text-muted-foreground">
                                {keyword.frequency}x
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="professional-card">
                <CardHeader>
                  <CardTitle>Technical Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.requirements.technical.map((skill, index) => (
                      <Badge key={index} variant="outline">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="professional-card">
                <CardHeader>
                  <CardTitle>Soft Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.requirements.soft.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="professional-card">
                <CardHeader>
                  <CardTitle>Education Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.requirements.education.map((req, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="professional-card">
                <CardHeader>
                  <CardTitle>Experience Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.requirements.experience.map((req, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-success mt-0.5" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="professional-card">
                <CardHeader>
                  <CardTitle>Market Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Competition Level</span>
                      <span className="score-fair">{analysis.insights.competitionLevel}%</span>
                    </div>
                    <Progress value={analysis.insights.competitionLevel} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Market Demand</span>
                      <span className="score-excellent">{analysis.insights.marketDemand}%</span>
                    </div>
                    <Progress value={analysis.insights.marketDemand} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Growth Potential</span>
                      <span className="score-excellent">{analysis.insights.growthPotential}%</span>
                    </div>
                    <Progress value={analysis.insights.growthPotential} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="professional-card">
                <CardHeader>
                  <CardTitle>Company Culture</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.insights.cultureIndicators.map((indicator, index) => (
                      <Badge key={index} variant="outline" className="bg-primary/5">
                        {indicator}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="gap" className="space-y-6">
            <Alert className="bg-primary/5 border-primary/20">
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                <strong>Overall Match: {analysis.gapAnalysis.overallMatch}%</strong> - 
                You have a good foundation for this role with some areas for improvement.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="professional-card">
                <CardHeader>
                  <CardTitle className="text-success">Matching Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.gapAnalysis.matchingSkills.map((skill, index) => (
                      <Badge key={index} className="bg-success/10 text-success">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="professional-card">
                <CardHeader>
                  <CardTitle className="text-warning">Missing Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.gapAnalysis.missingSkills.map((skill, index) => (
                      <Badge key={index} className="bg-warning/10 text-warning">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="ai-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  AI Recommendations
                </CardTitle>
                <CardDescription>
                  Personalized action items to improve your match for this role
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analysis.gapAnalysis.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-lg bg-background/80">
                      <div className="p-2 rounded-full bg-ai-primary/10">
                        <Lightbulb className="h-4 w-4 text-ai-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{rec.title}</h4>
                          <Badge className={`text-xs ${getPriorityColor(rec.priority)}`}>
                            {rec.priority} priority
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-4 mt-6">
                  <Button 
                    className="ai-button"
                    onClick={() => setCurrentStep(3)}
                  >
                    <ChevronRight className="h-4 w-4 mr-2" />
                    Continue to Gap Analysis
                  </Button>
                  <Button variant="outline">
                    Generate Projects
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}