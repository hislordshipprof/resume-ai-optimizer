import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useResumeFlow } from "@/contexts/ResumeFlowContext";
import { 
  Edit3, 
  Brain, 
  Target, 
  Zap, 
  CheckCircle, 
  X, 
  BarChart3, 
  Sparkles,
  Eye,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  ChevronRight,
  Lightbulb,
  TrendingUp,
  Award,
  Loader,
  Download
} from "lucide-react";
import { cn } from "@/lib/utils";

interface OptimizationSuggestion {
  id: string;
  type: 'keyword' | 'impact' | 'structure' | 'content';
  section: string;
  original: string;
  suggested: string;
  reason: string;
  impact: 'high' | 'medium' | 'low';
  applied?: boolean;
}

interface AIOptimizedContent {
  original: string;
  optimized: string;
  improvements: string[];
  score: number;
}

interface ResumeComparison {
  summary: AIOptimizedContent;
  experience: AIOptimizedContent[];
  skills: AIOptimizedContent;
  education: AIOptimizedContent[];
  projects: AIOptimizedContent[];
}

interface RealTimeAnalysis {
  overallScore: number;
  atsScore: number;
  keywordMatch: number;
  impactScore: number;
  readabilityScore: number;
  suggestions: OptimizationSuggestion[];
  keywords: {
    found: string[];
    missing: string[];
    density: number;
  };
}

interface RealTimeEditorProps {
  className?: string;
}

export function RealTimeEditor({ className }: RealTimeEditorProps) {
  const resumeFlowState = useResumeFlow();
  
  // Handle case when component is used outside ResumeFlowProvider (like direct /dashboard/editor access)
  if (!resumeFlowState) {
    return (
      <div className="text-center py-12 space-y-4">
        <Brain className="h-12 w-12 text-muted-foreground mx-auto" />
        <div>
          <h3 className="text-lg font-semibold">Resume Editor</h3>
          <p className="text-muted-foreground">
            Please start from the Upload page to use the AI Resume Editor
          </p>
        </div>
        <Button onClick={() => window.location.href = '/upload'}>
          Go to Upload
        </Button>
      </div>
    );
  }
  
  const { state, setOptimizedContent, setCurrentStep, markStepCompleted } = resumeFlowState;
  const { resumeData, jobAnalysis, gapAnalysis } = state;
  
  const [activeSection, setActiveSection] = useState("summary");
  const [isGeneratingOptimizations, setIsGeneratingOptimizations] = useState(false);
  const [showComparison, setShowComparison] = useState(true);
  const [analysis, setAnalysis] = useState<RealTimeAnalysis | null>(null);
  const [optimizedComparison, setOptimizedComparison] = useState<ResumeComparison | null>(null);
  const [currentContent, setCurrentContent] = useState<any>(null);
  const [liveTypingContent, setLiveTypingContent] = useState<string>("");
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  // Initialize AI optimizations when component loads
  useEffect(() => {
    if (resumeData && jobAnalysis && !optimizedComparison) {
      generateAIOptimizations();
    }
  }, [resumeData, jobAnalysis]);

  const generateAIOptimizations = async () => {
    if (!resumeData || !jobAnalysis) return;
    
    setIsGeneratingOptimizations(true);
    
    // Simulate AI bulk optimization
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockOptimizedComparison: ResumeComparison = {
      summary: {
        original: resumeData.summary || "Experienced software engineer with background in development.",
        optimized: "Results-driven Senior Software Engineer with 5+ years of experience building scalable web applications using React, Node.js, and cloud technologies. Proven track record of leading cross-functional teams and delivering projects 30% ahead of schedule while maintaining 99.9% uptime.",
        improvements: [
          "Added specific years of experience",
          "Included relevant technologies matching job requirements",
          "Added quantifiable achievements",
          "Used strong action words"
        ],
        score: 89
      },
      experience: resumeData.experience?.map((exp, index) => ({
        original: exp.description || "Worked on software development projects",
        optimized: index === 0 
          ? "• Architected and developed 15+ responsive web applications using React, Node.js, and PostgreSQL, serving 10,000+ daily users\n• Optimized database performance through advanced SQL queries and indexing, reducing load times by 45%\n• Led agile development team of 6 engineers on cross-functional projects, delivering features 30% ahead of schedule"
          : "• Built and maintained mission-critical applications using modern JavaScript frameworks\n• Collaborated with product teams to implement user-centered features, improving user engagement by 25%",
        improvements: [
          "Added specific metrics and numbers",
          "Included relevant technologies",
          "Used strong action verbs",
          "Quantified impact and results"
        ],
        score: 92
      })) || [],
      skills: {
        original: resumeData.skills?.join(", ") || "JavaScript, React, Node.js",
        optimized: "Technical Skills:\n• Programming Languages: JavaScript (ES6+), TypeScript, Python, SQL\n• Frontend: React.js, Redux, HTML5, CSS3, Responsive Design\n• Backend: Node.js, Express.js, RESTful APIs, GraphQL\n• Databases: PostgreSQL, MongoDB, Redis\n• Cloud & DevOps: AWS, Docker, Git, CI/CD",
        improvements: [
          "Organized skills by category",
          "Added missing job requirements",
          "Included specific versions and frameworks",
          "Added cloud and DevOps skills"
        ],
        score: 88
      },
      education: resumeData.education?.map(edu => ({
        original: `${edu.degree}, ${edu.school}`,
        optimized: `${edu.degree}\n${edu.school} | ${edu.year}\nRelevant Coursework: Data Structures, Algorithms, Software Engineering, Database Systems`,
        improvements: [
          "Added graduation year",
          "Included relevant coursework",
          "Better formatting"
        ],
        score: 85
      })) || [],
      projects: resumeData.projects?.map(project => ({
        original: project.description,
        optimized: `${project.title}\n• Built scalable ${project.description} using ${project.technologies.join(", ")}\n• Implemented responsive design serving 5,000+ monthly users\n• Integrated third-party APIs and payment processing\n• Technologies: ${project.technologies.join(", ")}, Docker, AWS`,
        improvements: [
          "Added specific metrics",
          "Included deployment technologies",
          "Better technical details",
          "Quantified user impact"
        ],
        score: 90
      })) || []
    };
    
    setOptimizedComparison(mockOptimizedComparison);
    setCurrentContent(mockOptimizedComparison);
    
    // Generate analysis based on job requirements
    const mockAnalysis: RealTimeAnalysis = {
      overallScore: 89,
      atsScore: 92,
      keywordMatch: 85,
      impactScore: 88,
      readabilityScore: 91,
      keywords: {
        found: ["React", "Node.js", "JavaScript", "SQL", "AWS"],
        missing: ["Docker", "GraphQL", "TypeScript"],
        density: 3.2
      },
      suggestions: [
        {
          id: "1",
          type: "keyword",
          section: "skills",
          original: "JavaScript",
          suggested: "JavaScript (ES6+), TypeScript",
          reason: "Job requires TypeScript experience",
          impact: "high"
        },
        {
          id: "2", 
          type: "content",
          section: "experience",
          original: "Led team projects",
          suggested: "Led cross-functional development team of 6 engineers",
          reason: "Add specific team size and context",
          impact: "medium"
        }
      ]
    };
    
    setAnalysis(mockAnalysis);
    setIsGeneratingOptimizations(false);
  };

  const handleContentChange = useCallback((section: string, content: string) => {
    setLiveTypingContent(content);
    
    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // Set new timeout for live AI suggestions
    const newTimeout = setTimeout(() => {
      generateLiveSuggestions(section, content);
    }, 1000);
    
    setTypingTimeout(newTimeout);
    
    // Update current content immediately
    setCurrentContent((prev: any) => ({
      ...prev,
      [section]: {
        ...prev?.[section],
        optimized: content
      }
    }));
  }, [typingTimeout]);

  const generateLiveSuggestions = async (section: string, content: string) => {
    // Simulate real-time AI analysis
    const newSuggestions: OptimizationSuggestion[] = [
      {
        id: Date.now().toString(),
        type: "impact",
        section,
        original: content.slice(0, 50) + "...",
        suggested: content + " resulting in 25% improved efficiency",
        reason: "Add quantifiable impact to strengthen the statement",
        impact: "high"
      }
    ];
    
    setAnalysis(prev => prev ? {
      ...prev,
      suggestions: [...prev.suggestions, ...newSuggestions]
    } : null);
  };

  const applySuggestion = useCallback((suggestionId: string) => {
    if (!analysis) return;
    
    const suggestion = analysis.suggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;

    // Apply the suggestion to current content
    setCurrentContent((prev: any) => {
      const section = prev?.[suggestion.section];
      if (!section) return prev;
      
      return {
        ...prev,
        [suggestion.section]: {
          ...section,
          optimized: section.optimized.replace(suggestion.original, suggestion.suggested)
        }
      };
    });

    // Mark suggestion as applied and update score
    setAnalysis(prev => prev ? {
      ...prev,
      overallScore: Math.min(100, prev.overallScore + 2),
      suggestions: prev.suggestions.map(s => 
        s.id === suggestionId ? { ...s, applied: true } : s
      )
    } : null);
  }, [analysis]);

  const rejectSuggestion = useCallback((suggestionId: string) => {
    setAnalysis(prev => prev ? {
      ...prev,
      suggestions: prev.suggestions.filter(s => s.id !== suggestionId)
    } : null);
  }, []);

  const handleProceedToExport = () => {
    if (currentContent) {
      setOptimizedContent(currentContent);
      markStepCompleted(4);
      setCurrentStep(5);
    }
  };

  if (!resumeData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Please upload your resume first to continue.</p>
      </div>
    );
  }

  if (isGeneratingOptimizations) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="flex justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/10">
              <Brain className="h-8 w-8 text-primary animate-pulse" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">AI is Optimizing Your Resume</h3>
          <p className="text-muted-foreground mb-6">
            Analyzing your content against job requirements and generating improvements...
          </p>
          <div className="space-y-3 max-w-md mx-auto">
            <div className="flex items-center gap-3 text-sm">
              <Loader className="h-4 w-4 animate-spin text-primary" />
              Enhancing professional summary with job keywords
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Loader className="h-4 w-4 animate-spin text-primary" />
              Strengthening work experience with impact metrics
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Loader className="h-4 w-4 animate-spin text-primary" />
              Optimizing skills section for ATS compatibility
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Loader className="h-4 w-4 animate-spin text-primary" />
              Refining project descriptions with technical details
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("max-w-7xl mx-auto space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            AI Resume Optimization
          </h2>
          <p className="text-muted-foreground mt-1">
            Review AI improvements and refine your optimized resume
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setShowComparison(!showComparison)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {showComparison ? 'Hide' : 'Show'} Comparison
          </Button>
          {analysis && (
            <div className="flex items-center gap-2 text-sm">
              <Award className="h-4 w-4 text-primary" />
              <span className="font-medium">Score: {analysis.overallScore}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Real-Time Analysis Dashboard */}
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="ai-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overall Score</p>
                  <p className="text-2xl font-bold text-primary">{analysis.overallScore}%</p>
                </div>
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <Progress value={analysis.overallScore} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="professional-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">ATS Score</p>
                  <p className="text-2xl font-bold text-foreground">{analysis.atsScore}%</p>
                </div>
                <Target className="h-8 w-8 text-foreground" />
              </div>
              <Progress value={analysis.atsScore} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="professional-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Job Match</p>
                  <p className="text-2xl font-bold text-foreground">{analysis.keywordMatch}%</p>
                </div>
                <Zap className="h-8 w-8 text-foreground" />
              </div>
              <Progress value={analysis.keywordMatch} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="professional-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Impact Score</p>
                  <p className="text-2xl font-bold text-foreground">{analysis.impactScore}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-foreground" />
              </div>
              <Progress value={analysis.impactScore} className="mt-2 h-2" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content Editor */}
        <div className="lg:col-span-2 space-y-6">
          {optimizedComparison && showComparison && (
            <Card className="ai-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  AI Optimization Results
                </CardTitle>
                <CardDescription>
                  Review the AI improvements. Click on any section to edit the optimized version.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeSection} onValueChange={setActiveSection}>
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="experience">Experience</TabsTrigger>
                    <TabsTrigger value="skills">Skills</TabsTrigger>
                    <TabsTrigger value="education">Education</TabsTrigger>
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="summary" className="mt-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">Original</Badge>
                          </div>
                          <div className="p-4 bg-muted/50 rounded-lg text-sm">
                            {optimizedComparison.summary.original}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="default">AI Optimized</Badge>
                            <Badge variant="secondary">{optimizedComparison.summary.score}%</Badge>
                          </div>
                          <Textarea
                            value={currentContent?.summary?.optimized || optimizedComparison.summary.optimized}
                            onChange={(e) => handleContentChange('summary', e.target.value)}
                            className="min-h-[120px] text-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Improvements Made:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {optimizedComparison.summary.improvements.map((improvement, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                              {improvement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="experience" className="mt-6">
                    <div className="space-y-6">
                      {optimizedComparison.experience.map((exp, index) => (
                        <div key={index} className="space-y-4">
                          <h4 className="font-medium">Experience {index + 1}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">Original</Badge>
                              </div>
                              <div className="p-4 bg-muted/50 rounded-lg text-sm whitespace-pre-line">
                                {exp.original}
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="default">AI Optimized</Badge>
                                <Badge variant="secondary">{exp.score}%</Badge>
                              </div>
                              <Textarea
                                value={currentContent?.experience?.[index]?.optimized || exp.optimized}
                                onChange={(e) => handleContentChange(`experience-${index}`, e.target.value)}
                                className="min-h-[120px] text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="skills" className="mt-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">Original</Badge>
                          </div>
                          <div className="p-4 bg-muted/50 rounded-lg text-sm">
                            {optimizedComparison.skills.original}
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="default">AI Optimized</Badge>
                            <Badge variant="secondary">{optimizedComparison.skills.score}%</Badge>
                          </div>
                          <Textarea
                            value={currentContent?.skills?.optimized || optimizedComparison.skills.optimized}
                            onChange={(e) => handleContentChange('skills', e.target.value)}
                            className="min-h-[120px] text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="projects" className="mt-6">
                    <div className="space-y-6">
                      {optimizedComparison.projects.map((project, index) => (
                        <div key={index} className="space-y-4">
                          <h4 className="font-medium">Project {index + 1}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">Original</Badge>
                              </div>
                              <div className="p-4 bg-muted/50 rounded-lg text-sm whitespace-pre-line">
                                {project.original}
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="default">AI Optimized</Badge>
                                <Badge variant="secondary">{project.score}%</Badge>
                              </div>
                              <Textarea
                                value={currentContent?.projects?.[index]?.optimized || project.optimized}
                                onChange={(e) => handleContentChange(`projects-${index}`, e.target.value)}
                                className="min-h-[120px] text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="education" className="mt-6">
                    <div className="space-y-6">
                      {optimizedComparison.education.map((edu, index) => (
                        <div key={index} className="space-y-4">
                          <h4 className="font-medium">Education {index + 1}</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">Original</Badge>
                              </div>
                              <div className="p-4 bg-muted/50 rounded-lg text-sm">
                                {edu.original}
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="default">AI Optimized</Badge>
                                <Badge variant="secondary">{edu.score}%</Badge>
                              </div>
                              <Textarea
                                value={currentContent?.education?.[index]?.optimized || edu.optimized}
                                onChange={(e) => handleContentChange(`education-${index}`, e.target.value)}
                                className="min-h-[120px] text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        {/* AI Suggestions Sidebar */}
        <div className="space-y-6">
          {analysis && (
            <Card className="ai-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Live AI Suggestions
                  <Badge variant="secondary" className="ml-auto">
                    {analysis.suggestions.filter(s => !s.applied).length}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Real-time AI suggestions as you edit your optimized resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {analysis.suggestions.filter(s => !s.applied).map((suggestion) => (
                      <div 
                        key={suggestion.id}
                        className="p-4 rounded-lg border border-border bg-background/80 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={suggestion.impact === 'high' ? 'default' : suggestion.impact === 'medium' ? 'secondary' : 'outline'}
                              className="text-xs"
                            >
                              {suggestion.impact} impact
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {suggestion.section}
                            </Badge>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-xs",
                              suggestion.type === 'keyword' && "border-blue-200 text-blue-700",
                              suggestion.type === 'impact' && "border-green-200 text-green-700",
                              suggestion.type === 'structure' && "border-purple-200 text-purple-700",
                              suggestion.type === 'content' && "border-orange-200 text-orange-700"
                            )}
                          >
                            {suggestion.type}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground mb-1">Current:</p>
                            <p className="text-sm p-2 bg-muted/50 rounded text-muted-foreground">
                              {suggestion.original}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-foreground mb-1">Suggested:</p>
                            <p className="text-sm p-2 bg-primary/5 border border-primary/20 rounded">
                              {suggestion.suggested}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground flex items-start gap-2">
                            <Lightbulb className="h-3 w-3 mt-0.5 flex-shrink-0" />
                            {suggestion.reason}
                          </p>
                          
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => applySuggestion(suggestion.id)}
                              className="flex items-center gap-1 text-xs"
                            >
                              <ThumbsUp className="h-3 w-3" />
                              Apply
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => rejectSuggestion(suggestion.id)}
                              className="flex items-center gap-1 text-xs"
                            >
                              <ThumbsDown className="h-3 w-3" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {analysis.suggestions.filter(s => !s.applied).length === 0 && (
                      <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                        <p className="font-medium text-foreground">Excellent!</p>
                        <p className="text-sm text-muted-foreground">
                          Your resume is well optimized. Continue editing for more suggestions.
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          {/* Keywords Panel */}
          {analysis?.keywords && (
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Job Keywords Match
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2 text-green-600">Found Keywords</h4>
                  <div className="flex flex-wrap gap-1">
                    {analysis.keywords.found.map((keyword, index) => (
                      <Badge key={index} className="text-xs bg-green-100 text-green-800 border-green-200">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2 text-orange-600">Missing Keywords</h4>
                  <div className="flex flex-wrap gap-1">
                    {analysis.keywords.missing.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-xs border-orange-200 text-orange-700">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Consider adding these keywords naturally to improve job match
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Job Information Summary */}
          {jobAnalysis && (
            <Card className="professional-card">
              <CardHeader>
                <CardTitle className="text-sm">Target Job</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm font-medium">Senior Frontend Developer</p>
                  <p className="text-xs text-muted-foreground">TechCorp Inc.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    78% Match
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button variant="outline" onClick={() => setCurrentStep(3)}>
          Back to Gap Analysis
        </Button>
        <div className="flex gap-4">
          <Button 
            variant="outline"
            onClick={() => window.print()}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Preview Resume
          </Button>
          <Button 
            onClick={handleProceedToExport}
            className="flex items-center gap-2"
          >
            <ChevronRight className="h-4 w-4" />
            Proceed to Export
          </Button>
        </div>
      </div>
    </div>
  );
}