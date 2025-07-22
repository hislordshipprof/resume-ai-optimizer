import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  FileText, 
  Eye, 
  Zap,
  TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ATSIssue {
  id: string;
  type: 'critical' | 'warning' | 'suggestion';
  category: 'formatting' | 'content' | 'structure' | 'keywords';
  title: string;
  description: string;
  impact: string;
  solution: string;
}

interface ATSScoreData {
  overallScore: number;
  categories: {
    formatting: number;
    content: number;
    structure: number;
    keywords: number;
  };
  issues: ATSIssue[];
  passedChecks: string[];
  recommendations: string[];
}

interface ATSCompatibilityScoreProps {
  data?: ATSScoreData;
  className?: string;
}

const mockData: ATSScoreData = {
  overallScore: 78,
  categories: {
    formatting: 85,
    content: 75,
    structure: 80,
    keywords: 72
  },
  issues: [
    {
      id: '1',
      type: 'critical',
      category: 'formatting',
      title: 'Non-standard section headers',
      description: 'Some section headers may not be recognized by ATS systems',
      impact: 'High - May cause sections to be missed',
      solution: 'Use standard headers like "Work Experience", "Education", "Skills"'
    },
    {
      id: '2',
      type: 'warning',
      category: 'keywords',
      title: 'Low keyword density',
      description: 'Resume lacks important keywords from the job description',
      impact: 'Medium - May reduce matching score',
      solution: 'Add relevant technical keywords and industry terms'
    },
    {
      id: '3',
      type: 'suggestion',
      category: 'content',
      title: 'Missing contact information',
      description: 'LinkedIn profile URL would improve ATS parsing',
      impact: 'Low - Minor improvement opportunity',
      solution: 'Add LinkedIn profile and portfolio links'
    }
  ],
  passedChecks: [
    'Standard file format (PDF/DOCX)',
    'Readable fonts and sizing',
    'Proper date formatting',
    'Clear contact information',
    'Consistent formatting'
  ],
  recommendations: [
    'Use standard section headers (Experience, Education, Skills)',
    'Include relevant keywords from job descriptions',
    'Maintain consistent date formatting (MM/YYYY)',
    'Use bullet points for better scanning',
    'Keep formatting simple and clean'
  ]
};

export const ATSCompatibilityScore = ({ data = mockData, className }: ATSCompatibilityScoreProps) => {
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

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'critical': return <XCircle className="w-4 h-4 text-destructive" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'suggestion': return <Eye className="w-4 h-4 text-primary" />;
      default: return <CheckCircle className="w-4 h-4 text-success" />;
    }
  };

  const getIssueBadgeVariant = (type: string) => {
    switch (type) {
      case 'critical': return 'destructive';
      case 'warning': return 'secondary';
      case 'suggestion': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Overall Score */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                ATS Compatibility Score
              </CardTitle>
              <CardDescription>
                How well your resume will perform with Applicant Tracking Systems
              </CardDescription>
            </div>
            <div className="text-center">
              <div className={cn("text-3xl font-bold", getScoreColor(data.overallScore))}>
                {data.overallScore}%
              </div>
              <p className="text-sm text-muted-foreground">ATS Score</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Formatting</span>
                <span className={cn("text-sm font-bold", getScoreColor(data.categories.formatting))}>
                  {data.categories.formatting}%
                </span>
              </div>
              <Progress value={data.categories.formatting} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Content</span>
                <span className={cn("text-sm font-bold", getScoreColor(data.categories.content))}>
                  {data.categories.content}%
                </span>
              </div>
              <Progress value={data.categories.content} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Structure</span>
                <span className={cn("text-sm font-bold", getScoreColor(data.categories.structure))}>
                  {data.categories.structure}%
                </span>
              </div>
              <Progress value={data.categories.structure} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Keywords</span>
                <span className={cn("text-sm font-bold", getScoreColor(data.categories.keywords))}>
                  {data.categories.keywords}%
                </span>
              </div>
              <Progress value={data.categories.keywords} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <Tabs defaultValue="issues" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="passed">Passed Checks</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Issues Found ({data.issues.length})</CardTitle>
              <CardDescription>
                ATS compatibility issues that should be addressed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.issues.map((issue) => (
                <div key={issue.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getIssueIcon(issue.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{issue.title}</h4>
                          <Badge variant={getIssueBadgeVariant(issue.type) as any}>
                            {issue.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {issue.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {issue.description}
                        </p>
                        <div className="space-y-1">
                          <div className="text-xs">
                            <span className="font-medium">Impact:</span> {issue.impact}
                          </div>
                          <div className="text-xs">
                            <span className="font-medium">Solution:</span> {issue.solution}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Fix Issue
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="passed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                Passed Checks ({data.passedChecks.length})
              </CardTitle>
              <CardDescription>
                ATS requirements your resume already meets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.passedChecks.map((check, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-success/5 rounded">
                    <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                    <span className="text-sm">{check}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                ATS Optimization Tips
              </CardTitle>
              <CardDescription>
                Best practices to improve your ATS compatibility score
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Zap className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{recommendation}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Pro Tips:</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Save your resume as both PDF and Word formats</li>
                  <li>• Use keywords from the job description naturally in your content</li>
                  <li>• Avoid headers, footers, and complex formatting</li>
                  <li>• Test your resume with different ATS systems when possible</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Ready to optimize?</h4>
              <p className="text-sm text-muted-foreground">
                Apply AI-powered fixes to improve your ATS score
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                Download Report
              </Button>
              <Button variant="ai">
                <Zap className="w-4 h-4 mr-2" />
                Auto-Fix Issues
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};