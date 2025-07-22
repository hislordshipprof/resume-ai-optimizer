import { useState } from "react";
import { Header } from "@/components/navigation/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileUploader } from "@/components/upload/FileUploader";
import { toast } from "sonner";
import { 
  Lightbulb, 
  Target, 
  Code, 
  Briefcase, 
  Clock,
  ArrowRight,
  CheckCircle,
  Loader2,
  Github,
  ExternalLink
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  skills: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  timeEstimate: string;
  impact: "High" | "Medium" | "Low";
  technologies: string[];
  deliverables: string[];
}

const mockProjects: Project[] = [
  {
    id: "1",
    title: "E-commerce Analytics Dashboard",
    description: "Build a comprehensive analytics dashboard for an e-commerce platform with real-time sales tracking, customer insights, and inventory management.",
    skills: ["React", "D3.js", "Node.js", "PostgreSQL"],
    difficulty: "Intermediate",
    timeEstimate: "4-6 weeks",
    impact: "High",
    technologies: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Chart.js"],
    deliverables: ["Interactive dashboard", "API endpoints", "Database schema", "Documentation"]
  },
  {
    id: "2", 
    title: "AI-Powered Code Review Tool",
    description: "Develop an AI-powered tool that automatically reviews code for best practices, security vulnerabilities, and performance optimizations.",
    skills: ["Python", "Machine Learning", "NLP", "Git API"],
    difficulty: "Advanced",
    timeEstimate: "6-8 weeks",
    impact: "High",
    technologies: ["Python", "TensorFlow", "FastAPI", "Docker", "GitHub API"],
    deliverables: ["ML model", "Web application", "Browser extension", "CI/CD integration"]
  },
  {
    id: "3",
    title: "Mobile Task Management App",
    description: "Create a cross-platform mobile app for team task management with real-time collaboration, file sharing, and progress tracking.",
    skills: ["React Native", "Firebase", "Mobile UI/UX"],
    difficulty: "Intermediate",
    timeEstimate: "5-7 weeks",
    impact: "Medium",
    technologies: ["React Native", "Expo", "Firebase", "Redux", "Push Notifications"],
    deliverables: ["iOS/Android apps", "Backend services", "Admin panel", "User testing"]
  }
];

export default function ProjectSuggestions() {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      toast.error("Please upload your resume and provide a job description");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate analysis progress
    const progressSteps = [
      { step: 20, message: "Parsing resume content..." },
      { step: 40, message: "Analyzing job requirements..." },
      { step: 60, message: "Identifying skill gaps..." },
      { step: 80, message: "Generating project suggestions..." },
      { step: 100, message: "Analysis complete!" }
    ];

    for (const { step, message } of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAnalysisProgress(step);
      if (step < 100) {
        toast.loading(message, { id: "analysis-progress" });
      }
    }

    toast.success("Project suggestions generated!", { id: "analysis-progress" });
    setIsAnalyzing(false);
    setShowSuggestions(true);
  };

  const getDifficultyColor = (difficulty: Project['difficulty']) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    }
  };

  const getImpactColor = (impact: Project['impact']) => {
    switch (impact) {
      case "High": return "border-green-500 bg-green-50 dark:bg-green-950";
      case "Medium": return "border-yellow-500 bg-yellow-50 dark:bg-yellow-950";
      case "Low": return "border-gray-500 bg-gray-50 dark:bg-gray-950";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              AI Project Suggestions
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Upload your resume and job description to get personalized project recommendations 
              that will help you bridge skill gaps and stand out to employers.
            </p>
          </div>

          {!showSuggestions ? (
            /* Input Section */
            <div className="max-w-4xl mx-auto space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Upload Your Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Resume Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Upload Your Resume
                    </label>
                    <FileUploader
                      onFileUpload={(file) => setResumeFile(file)}
                    />
                  </div>

                  {/* Job Description */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Target Job Description
                    </label>
                    <Textarea
                      placeholder="Paste the complete job description here. Include required skills, responsibilities, and qualifications..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      rows={8}
                      className="w-full"
                    />
                  </div>

                  {/* Analysis Button */}
                  <div className="text-center">
                    {isAnalyzing && (
                      <div className="mb-4 space-y-2">
                        <Progress value={analysisProgress} className="w-full" />
                        <p className="text-sm text-muted-foreground">
                          Analyzing your profile and generating suggestions...
                        </p>
                      </div>
                    )}
                    
                    <Button 
                      size="lg" 
                      onClick={handleAnalyze}
                      disabled={isAnalyzing || !resumeFile || !jobDescription.trim()}
                      className="px-8"
                    >
                      {isAnalyzing ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Lightbulb className="w-4 h-4 mr-2" />
                      )}
                      {isAnalyzing ? 'Analyzing...' : 'Generate Project Suggestions'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Results Section */
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Results Header */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div>
                      <h2 className="text-2xl font-bold">Analysis Complete!</h2>
                      <p className="text-muted-foreground">
                        Based on your resume and target job, here are {mockProjects.length} personalized project suggestions
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setShowSuggestions(false)}
                    className="mt-4"
                  >
                    Analyze Different Job
                  </Button>
                </CardContent>
              </Card>

              {/* Project Suggestions */}
              <div className="grid gap-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Code className="w-6 h-6" />
                  Recommended Projects
                </h2>
                
                {mockProjects.map((project) => (
                  <Card key={project.id} className={`${getImpactColor(project.impact)} border-l-4`}>
                    <CardContent className="p-6">
                      <div className="grid md:grid-cols-3 gap-6">
                        {/* Project Info */}
                        <div className="md:col-span-2 space-y-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold">{project.title}</h3>
                              <Badge className={getDifficultyColor(project.difficulty)}>
                                {project.difficulty}
                              </Badge>
                              <Badge variant="outline">
                                {project.impact} Impact
                              </Badge>
                            </div>
                            <p className="text-muted-foreground">{project.description}</p>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Skills You'll Gain:</h4>
                            <div className="flex flex-wrap gap-2">
                              {project.skills.map((skill) => (
                                <Badge key={skill} variant="secondary">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Technologies:</h4>
                            <div className="flex flex-wrap gap-2">
                              {project.technologies.map((tech) => (
                                <Badge key={tech} variant="outline">
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Project Details */}
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4" />
                            <span>{project.timeEstimate}</span>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2">Deliverables:</h4>
                            <ul className="text-sm space-y-1">
                              {project.deliverables.map((deliverable, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <CheckCircle className="w-3 h-3 text-green-600" />
                                  {deliverable}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-2">
                            <Button variant="default" className="w-full">
                              <Github className="w-4 h-4 mr-2" />
                              Start Project
                            </Button>
                            <Button variant="outline" className="w-full">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}