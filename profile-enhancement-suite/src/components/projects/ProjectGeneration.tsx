import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Lightbulb, 
  Target, 
  Code, 
  GitBranch, 
  Clock, 
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Zap,
  Brain,
  Sparkles,
  Plus,
  Eye,
  Download,
  Share2,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SkillGap {
  skill: string;
  importance: 'critical' | 'high' | 'medium' | 'low';
  currentLevel: number;
  targetLevel: number;
  jobFrequency: number;
}

interface ProjectIdea {
  id: string;
  title: string;
  category: 'web' | 'mobile' | 'backend' | 'data' | 'devops' | 'ai-ml';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  description: string;
  skillsAddressed: string[];
  techStack: string[];
  keyFeatures: string[];
  learningOutcomes: string[];
  implementationSteps: {
    phase: string;
    duration: string;
    tasks: string[];
    deliverables: string[];
  }[];
  portfolioImpact: number;
  jobRelevance: number;
  trendingScore: number;
}

interface IndustryTemplate {
  id: string;
  name: string;
  description: string;
  commonProjects: string[];
  keyTechnologies: string[];
  projectTypes: string[];
}

export function ProjectGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [targetRole, setTargetRole] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("intermediate");
  const [timeCommitment, setTimeCommitment] = useState("4-6 weeks");
  const [generatedProjects, setGeneratedProjects] = useState<ProjectIdea[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  // Mock skill gaps from job analysis
  const skillGaps: SkillGap[] = [
    {
      skill: "TypeScript",
      importance: "critical",
      currentLevel: 2,
      targetLevel: 8,
      jobFrequency: 85
    },
    {
      skill: "GraphQL",
      importance: "high", 
      currentLevel: 0,
      targetLevel: 7,
      jobFrequency: 65
    },
    {
      skill: "Docker",
      importance: "high",
      currentLevel: 1,
      targetLevel: 6,
      jobFrequency: 70
    },
    {
      skill: "AWS",
      importance: "medium",
      currentLevel: 3,
      targetLevel: 7,
      jobFrequency: 60
    },
    {
      skill: "Next.js",
      importance: "medium",
      currentLevel: 4,
      targetLevel: 8,
      jobFrequency: 55
    }
  ];

  const industryTemplates: IndustryTemplate[] = [
    {
      id: "fintech",
      name: "FinTech",
      description: "Financial technology projects",
      commonProjects: ["Payment Gateway", "Trading Dashboard", "Personal Finance App"],
      keyTechnologies: ["React", "Node.js", "MongoDB", "Stripe API", "Chart.js"],
      projectTypes: ["Payment Processing", "Data Visualization", "Security Implementation"]
    },
    {
      id: "ecommerce",
      name: "E-Commerce",
      description: "Online retail and marketplace projects",
      commonProjects: ["Online Store", "Inventory Management", "Customer Analytics"],
      keyTechnologies: ["Next.js", "PostgreSQL", "Redis", "Payment APIs", "Analytics"],
      projectTypes: ["Shopping Cart", "Product Catalog", "Order Management"]
    },
    {
      id: "healthcare",
      name: "Healthcare",
      description: "Health and medical technology projects",
      commonProjects: ["Patient Portal", "Telemedicine App", "Health Analytics"],
      keyTechnologies: ["React", "FHIR", "HL7", "Encryption", "Real-time Communication"],
      projectTypes: ["Patient Management", "Data Compliance", "Real-time Monitoring"]
    }
  ];

  const generateProjects = useCallback(async () => {
    setIsGenerating(true);
    
    // Simulate AI project generation
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockProjects: ProjectIdea[] = [
      {
        id: "1",
        title: "E-Commerce Analytics Dashboard",
        category: "web",
        difficulty: "intermediate",
        duration: "4-6 weeks",
        description: "Build a comprehensive analytics dashboard for e-commerce businesses with real-time data visualization, sales tracking, and customer insights using TypeScript and GraphQL.",
        skillsAddressed: ["TypeScript", "GraphQL", "Next.js"],
        techStack: ["Next.js", "TypeScript", "GraphQL", "Apollo Client", "Chart.js", "Tailwind CSS"],
        keyFeatures: [
          "Real-time sales analytics",
          "Customer behavior tracking", 
          "Interactive data visualizations",
          "Revenue forecasting",
          "Mobile-responsive design"
        ],
        learningOutcomes: [
          "Master TypeScript with React",
          "Implement GraphQL queries and mutations",
          "Build responsive data visualizations",
          "Handle real-time data updates",
          "Create professional UI/UX"
        ],
        implementationSteps: [
          {
            phase: "Setup & Planning",
            duration: "3-5 days",
            tasks: [
              "Initialize Next.js project with TypeScript",
              "Set up GraphQL server with mock data",
              "Design dashboard wireframes and UI mockups",
              "Configure development environment"
            ],
            deliverables: ["Project structure", "GraphQL schema", "UI designs"]
          },
          {
            phase: "Core Development",
            duration: "2-3 weeks",
            tasks: [
              "Implement data fetching with Apollo Client",
              "Build reusable chart components",
              "Create responsive dashboard layout",
              "Add filtering and date range selection"
            ],
            deliverables: ["Working dashboard", "Chart components", "Data layer"]
          },
          {
            phase: "Advanced Features",
            duration: "1-2 weeks",
            tasks: [
              "Add real-time data updates",
              "Implement export functionality", 
              "Add user authentication",
              "Optimize performance and loading"
            ],
            deliverables: ["Real-time features", "Export system", "Auth system"]
          }
        ],
        portfolioImpact: 90,
        jobRelevance: 95,
        trendingScore: 88
      },
      {
        id: "2", 
        title: "Microservices Task Management API",
        category: "backend",
        difficulty: "advanced", 
        duration: "6-8 weeks",
        description: "Develop a scalable microservices architecture for task management with Docker containerization, GraphQL federation, and AWS deployment.",
        skillsAddressed: ["Docker", "GraphQL", "AWS", "TypeScript"],
        techStack: ["Node.js", "TypeScript", "GraphQL", "Docker", "AWS", "PostgreSQL", "Redis"],
        keyFeatures: [
          "Microservices architecture",
          "GraphQL federation",
          "Docker containerization",
          "AWS cloud deployment",
          "Real-time notifications"
        ],
        learningOutcomes: [
          "Design microservices architecture",
          "Implement GraphQL federation",
          "Master Docker containerization",
          "Deploy to AWS with best practices",
          "Handle inter-service communication"
        ],
        implementationSteps: [
          {
            phase: "Architecture Design",
            duration: "1 week",
            tasks: [
              "Design microservices architecture",
              "Define service boundaries and APIs",
              "Set up GraphQL schema federation",
              "Plan database design for each service"
            ],
            deliverables: ["Architecture diagram", "API specifications", "Database schemas"]
          },
          {
            phase: "Service Development",
            duration: "3-4 weeks", 
            tasks: [
              "Build user service with authentication",
              "Develop task service with CRUD operations",
              "Create notification service",
              "Implement GraphQL resolvers for each service"
            ],
            deliverables: ["User service", "Task service", "Notification service"]
          },
          {
            phase: "Containerization & Deployment", 
            duration: "2-3 weeks",
            tasks: [
              "Create Dockerfiles for each service",
              "Set up Docker Compose for local development",
              "Configure AWS infrastructure with Terraform",
              "Deploy services to AWS ECS/EKS"
            ],
            deliverables: ["Docker containers", "AWS infrastructure", "Deployed application"]
          }
        ],
        portfolioImpact: 95,
        jobRelevance: 92,
        trendingScore: 90
      },
      {
        id: "3",
        title: "Real-time Chat Application",
        category: "web",
        difficulty: "intermediate",
        duration: "3-4 weeks", 
        description: "Create a modern real-time chat application with TypeScript, Next.js, and WebSocket integration featuring rooms, file sharing, and user presence.",
        skillsAddressed: ["TypeScript", "Next.js", "WebSocket"],
        techStack: ["Next.js", "TypeScript", "Socket.io", "PostgreSQL", "Prisma", "Tailwind CSS"],
        keyFeatures: [
          "Real-time messaging",
          "Chat rooms and direct messages",
          "File and image sharing",
          "User presence indicators",
          "Message history and search"
        ],
        learningOutcomes: [
          "Implement real-time communication",
          "Handle WebSocket connections",
          "Build responsive chat UI",
          "Manage application state",
          "Optimize for performance"
        ],
        implementationSteps: [
          {
            phase: "Foundation",
            duration: "1 week",
            tasks: [
              "Set up Next.js with TypeScript",
              "Configure database with Prisma",
              "Implement user authentication",
              "Design chat interface components"
            ],
            deliverables: ["Project setup", "Database schema", "Auth system", "UI components"]
          },
          {
            phase: "Real-time Features",
            duration: "2 weeks", 
            tasks: [
              "Integrate Socket.io for real-time messaging",
              "Build chat rooms and direct messaging",
              "Add user presence and typing indicators",
              "Implement message history and pagination"
            ],
            deliverables: ["Real-time messaging", "Chat rooms", "Message history"]
          },
          {
            phase: "Advanced Features",
            duration: "1 week",
            tasks: [
              "Add file upload and sharing",
              "Implement message search",
              "Add emoji reactions and mentions",
              "Optimize performance and add caching"
            ],
            deliverables: ["File sharing", "Search functionality", "Performance optimizations"]
          }
        ],
        portfolioImpact: 85,
        jobRelevance: 88,
        trendingScore: 92
      }
    ];
    
    setGeneratedProjects(mockProjects);
    setIsGenerating(false);
  }, [selectedSkills, targetRole, experienceLevel, timeCommitment]);

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-primary text-primary-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-success/10 text-success';
      case 'intermediate': return 'bg-warning/10 text-warning';
      case 'advanced': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'web': return Code;
      case 'backend': return GitBranch;
      case 'mobile': return Code;
      case 'data': return TrendingUp;
      case 'devops': return Target;
      case 'ai-ml': return Brain;
      default: return Code;
    }
  };

  const selectedProjectData = generatedProjects.find(p => p.id === selectedProject);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="ai-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            AI Project Generator
          </CardTitle>
          <CardDescription>
            Generate personalized project ideas to fill your skill gaps and boost your portfolio
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generator">Project Generator</TabsTrigger>
          <TabsTrigger value="gaps">Skill Gaps</TabsTrigger>
          <TabsTrigger value="templates">Industry Templates</TabsTrigger>
          <TabsTrigger value="library">Project Library</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          {/* Configuration */}
          <Card className="professional-card">
            <CardHeader>
              <CardTitle>Project Requirements</CardTitle>
              <CardDescription>Configure your project preferences for personalized recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Role</label>
                  <Input
                    placeholder="e.g., Senior Frontend Developer"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Experience Level</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                  >
                    <option value="beginner">Beginner (0-2 years)</option>
                    <option value="intermediate">Intermediate (2-5 years)</option>
                    <option value="advanced">Advanced (5+ years)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Commitment</label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={timeCommitment}
                    onChange={(e) => setTimeCommitment(e.target.value)}
                  >
                    <option value="1-2 weeks">1-2 weeks (Quick projects)</option>
                    <option value="4-6 weeks">4-6 weeks (Standard projects)</option>
                    <option value="8-12 weeks">8-12 weeks (Comprehensive projects)</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Focus Skills</label>
                  <div className="flex flex-wrap gap-2 p-2 border rounded-md min-h-10">
                    {skillGaps.slice(0, 3).map(gap => (
                      <Badge key={gap.skill} className={getImportanceColor(gap.importance)}>
                        {gap.skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Button 
                onClick={generateProjects}
                disabled={isGenerating}
                className="ai-button w-full"
              >
                {isGenerating ? (
                  <>
                    <Brain className="h-4 w-4 mr-2 animate-pulse" />
                    Generating AI Projects...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Projects
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Projects */}
          {generatedProjects.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Project List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Generated Projects</h3>
                {generatedProjects.map(project => {
                  const CategoryIcon = getCategoryIcon(project.category);
                  return (
                    <Card 
                      key={project.id}
                      className={cn(
                        "professional-card cursor-pointer smooth-transition",
                        selectedProject === project.id ? "border-primary bg-primary/5" : ""
                      )}
                      onClick={() => setSelectedProject(project.id)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <CategoryIcon className="h-5 w-5 text-primary" />
                              <h4 className="font-semibold">{project.title}</h4>
                            </div>
                            <Badge className={getDifficultyColor(project.difficulty)}>
                              {project.difficulty}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {project.description}
                          </p>
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {project.duration}
                            </div>
                            <div className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              {project.skillsAddressed.length} skills
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-center">
                              <div className="font-semibold text-primary">{project.portfolioImpact}%</div>
                              <div className="text-muted-foreground">Portfolio Impact</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-success">{project.jobRelevance}%</div>
                              <div className="text-muted-foreground">Job Relevance</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-accent">{project.trendingScore}%</div>
                              <div className="text-muted-foreground">Trending</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Project Details */}
              {selectedProjectData && (
                <Card className="ai-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Project Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{selectedProjectData.title}</h3>
                      <p className="text-sm text-muted-foreground">{selectedProjectData.description}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Skills You'll Learn</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedProjectData.skillsAddressed.map(skill => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Tech Stack</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedProjectData.techStack.map(tech => (
                          <Badge key={tech} className="bg-secondary/10 text-secondary text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Key Features</h4>
                      <ul className="space-y-1">
                        {selectedProjectData.keyFeatures.map((feature, index) => (
                          <li key={index} className="text-sm flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-success mt-0.5" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Implementation Roadmap</h4>
                      <div className="space-y-3">
                        {selectedProjectData.implementationSteps.map((step, index) => (
                          <div key={index} className="border rounded-lg p-3 bg-background/50">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium text-sm">Phase {index + 1}: {step.phase}</h5>
                              <Badge variant="outline" className="text-xs">{step.duration}</Badge>
                            </div>
                            <ul className="space-y-1">
                              {step.tasks.slice(0, 2).map((task, taskIndex) => (
                                <li key={taskIndex} className="text-xs text-muted-foreground flex items-start gap-1">
                                  <div className="w-1 h-1 rounded-full bg-primary mt-1.5" />
                                  {task}
                                </li>
                              ))}
                              {step.tasks.length > 2 && (
                                <li className="text-xs text-muted-foreground">
                                  +{step.tasks.length - 2} more tasks...
                                </li>
                              )}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button className="ai-button flex-1">
                        <Plus className="h-4 w-4 mr-2" />
                        Add to Portfolio
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="gaps" className="space-y-6">
          <Card className="professional-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Current Skill Gaps
              </CardTitle>
              <CardDescription>
                Skills identified from job analysis that need improvement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {skillGaps.map(gap => (
                  <div key={gap.skill} className="p-4 rounded-lg border bg-muted/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{gap.skill}</h4>
                        <Badge className={getImportanceColor(gap.importance)}>
                          {gap.importance}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {gap.jobFrequency}% of jobs require this
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Level</span>
                        <span>{gap.currentLevel}/10</span>
                      </div>
                      <Progress value={gap.currentLevel * 10} className="h-2" />
                      
                      <div className="flex justify-between text-sm">
                        <span>Target Level</span>
                        <span>{gap.targetLevel}/10</span>
                      </div>
                      <Progress value={gap.targetLevel * 10} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industryTemplates.map(template => (
              <Card key={template.id} className="professional-card">
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Common Projects</h4>
                    <ul className="space-y-1">
                      {template.commonProjects.map((project, index) => (
                        <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-success mt-0.5" />
                          {project}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Key Technologies</h4>
                    <div className="flex flex-wrap gap-1">
                      {template.keyTechnologies.map(tech => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="w-full ai-button">
                    Generate {template.name} Projects
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="library" className="space-y-6">
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              Your generated projects will appear here. Start by generating some projects in the main tab!
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}