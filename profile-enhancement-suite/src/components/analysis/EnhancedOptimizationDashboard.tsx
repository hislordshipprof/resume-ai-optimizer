import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useResumeFlow } from "@/contexts/ResumeFlowContext";
import { useState } from "react";
import { toast } from "sonner";
import { 
  TrendingUp, 
  Target, 
  CheckCircle, 
  AlertCircle, 
  Sparkles,
  Zap,
  BarChart3,
  Eye,
  Clock,
  Loader2,
  Download,
  FileText,
  Share
} from "lucide-react";

interface OptimizationMetric {
  label: string;
  score: number;
  maxScore: number;
  status: "excellent" | "good" | "needs-improvement";
  suggestions: number;
  description: string;
}

interface OptimizationDashboardProps {
  className?: string;
}

const mockMetrics: OptimizationMetric[] = [
  {
    label: "Keyword Optimization",
    score: 85,
    maxScore: 100,
    status: "good",
    suggestions: 3,
    description: "Your resume contains most relevant keywords but could be enhanced"
  },
  {
    label: "ATS Compatibility", 
    score: 92,
    maxScore: 100,
    status: "excellent",
    suggestions: 1,
    description: "Resume format is highly compatible with ATS systems"
  },
  {
    label: "Content Structure",
    score: 78,
    maxScore: 100,
    status: "good",
    suggestions: 4,
    description: "Good structure but some sections could be reorganized"
  },
  {
    label: "Impact Statements",
    score: 68,
    maxScore: 100,
    status: "needs-improvement",
    suggestions: 6,
    description: "Many bullet points lack quantifiable achievements"
  },
  {
    label: "Skills Match",
    score: 82,
    maxScore: 100,
    status: "good",
    suggestions: 2,
    description: "Skills align well with job requirements"
  },
  {
    label: "Length & Format",
    score: 90,
    maxScore: 100,
    status: "excellent",
    suggestions: 1,
    description: "Resume length and formatting are optimal"
  }
];

const getStatusColor = (status: OptimizationMetric['status']) => {
  switch (status) {
    case 'excellent': return 'text-green-600 dark:text-green-400';
    case 'good': return 'text-blue-600 dark:text-blue-400';
    case 'needs-improvement': return 'text-orange-600 dark:text-orange-400';
    default: return 'text-muted-foreground';
  }
};

const getStatusIcon = (status: OptimizationMetric['status']) => {
  switch (status) {
    case 'excellent': return CheckCircle;
    case 'good': return Target;
    case 'needs-improvement': return AlertCircle;
    default: return Clock;
  }
};

export const EnhancedOptimizationDashboard = ({ className }: OptimizationDashboardProps) => {
  const { markStepCompleted, setOptimizedContent, state } = useResumeFlow();
  const [appliedOptimizations, setAppliedOptimizations] = useState<Set<string>>(new Set());
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isApplyingFix, setIsApplyingFix] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const overallScore = Math.round(mockMetrics.reduce((acc, metric) => acc + metric.score, 0) / mockMetrics.length);
  const totalSuggestions = mockMetrics.reduce((acc, metric) => acc + metric.suggestions, 0);

  const handleApplyFix = async (metricLabel: string) => {
    setIsApplyingFix(metricLabel);
    
    // Simulate optimization process
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setAppliedOptimizations(prev => new Set([...prev, metricLabel]));
    setIsApplyingFix(null);
    
    toast.success(`Applied AI fixes for ${metricLabel}`);
  };

  const handleOptimizeNow = async () => {
    setIsOptimizing(true);
    
    // Apply all remaining fixes
    const unappliedMetrics = mockMetrics.filter(metric => !appliedOptimizations.has(metric.label));
    
    for (const metric of unappliedMetrics) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setAppliedOptimizations(prev => new Set([...prev, metric.label]));
    }
    
    // Update optimized content in context
    setOptimizedContent({
      summary: "Dynamic software engineer with 5+ years of experience building scalable web applications. Led cross-functional teams to deliver 15+ high-impact projects, increasing user engagement by 40% and reducing system downtime by 60%. Expert in React, Node.js, and cloud architecture with proven track record of optimizing performance and user experience.",
      experience: [
        "Architected and implemented microservices infrastructure serving 1M+ daily users. Led team of 6 developers in agile development, increasing delivery speed by 35%. Optimized database queries resulting in 50% faster page load times."
      ],
      skills: ["React", "Node.js", "TypeScript", "AWS", "Docker", "PostgreSQL", "GraphQL", "Agile/Scrum"]
    });
    
    // Mark step as completed and show preview
    markStepCompleted(4);
    setShowPreview(true);
    setIsOptimizing(false);
    
    toast.success("Resume optimization completed! Review your optimized resume below.");
  };

  const handleDownload = (format: string) => {
    toast.success(`Downloading resume as ${format.toUpperCase()}...`);
    // In a real app, this would trigger the actual download
  };

  const allOptimizationsApplied = mockMetrics.every(metric => appliedOptimizations.has(metric.label));

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Resume Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Optimized Resume Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {state.optimizedContent && (
            <div className="bg-white dark:bg-gray-900 border rounded-lg p-6 space-y-4">
              {/* Summary */}
              {state.optimizedContent.summary && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Professional Summary</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {Array.isArray(state.optimizedContent.summary) 
                      ? state.optimizedContent.summary.join(' ') 
                      : state.optimizedContent.summary}
                  </p>
                </div>
              )}

              {/* Experience */}
              {state.optimizedContent.experience && state.optimizedContent.experience.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Professional Experience</h3>
                  {state.optimizedContent.experience.map((exp, index) => (
                    <div key={index} className="mb-4">
                      <p className="text-gray-700 dark:text-gray-300">{exp}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              {state.optimizedContent.skills && state.optimizedContent.skills.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Key Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {state.optimizedContent.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {state.optimizedContent.projects && state.optimizedContent.projects.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg mb-2">Projects</h3>
                  {state.optimizedContent.projects.map((project, index) => (
                    <div key={index} className="mb-4">
                      <p className="text-gray-700 dark:text-gray-300">{project}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Download Options */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-4">Download Your Optimized Resume</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => handleDownload('pdf')}
              >
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => handleDownload('docx')}
              >
                <Download className="w-4 h-4" />
                Download DOCX
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={() => handleDownload('txt')}
              >
                <Download className="w-4 h-4" />
                Download TXT
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};