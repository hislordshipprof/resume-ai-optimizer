import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  Eye,
  FileText,
  Clock,
  Shield,
  BarChart3,
  Lightbulb,
  AlertTriangle,
  ChevronRight,
  Download,
  RefreshCcw
} from 'lucide-react';

interface ATSMetric {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  status: 'excellent' | 'good' | 'needs-improvement' | 'critical';
  description: string;
  suggestions: string[];
  impact: 'high' | 'medium' | 'low';
}

interface ATSAnalysis {
  overallScore: number;
  previousScore?: number;
  metrics: ATSMetric[];
  lastUpdated: string;
  estimatedParsingTime: number;
  compatibilityLevel: 'high' | 'medium' | 'low';
}

const mockATSAnalysis: ATSAnalysis = {
  overallScore: 87,
  previousScore: 82,
  lastUpdated: '2024-01-20T10:30:00Z',
  estimatedParsingTime: 2.3,
  compatibilityLevel: 'high',
  metrics: [
    {
      id: '1',
      name: 'Keyword Optimization',
      score: 92,
      maxScore: 100,
      status: 'excellent',
      description: 'Keywords match job requirements effectively',
      suggestions: [
        'Add more technical keywords from job description',
        'Include industry-specific terminology',
        'Optimize keyword density in experience section'
      ],
      impact: 'high'
    },
    {
      id: '2',
      name: 'Format Compatibility',
      score: 95,
      maxScore: 100,
      status: 'excellent',
      description: 'Resume format is ATS-friendly',
      suggestions: [
        'Maintain consistent formatting',
        'Avoid complex tables or graphics'
      ],
      impact: 'high'
    },
    {
      id: '3',
      name: 'Section Structure',
      score: 88,
      maxScore: 100,
      status: 'good',
      description: 'Well-organized sections with clear headers',
      suggestions: [
        'Add a dedicated skills section',
        'Use more standard section headers',
        'Reorganize experience bullets for clarity'
      ],
      impact: 'medium'
    },
    {
      id: '4',
      name: 'Contact Information',
      score: 100,
      maxScore: 100,
      status: 'excellent',
      description: 'Complete and properly formatted contact details',
      suggestions: [],
      impact: 'high'
    },
    {
      id: '5',
      name: 'Skills Matching',
      score: 75,
      maxScore: 100,
      status: 'needs-improvement',
      description: 'Skills section needs better alignment with requirements',
      suggestions: [
        'Add missing required skills',
        'Reorganize skills by relevance',
        'Include specific tools and technologies',
        'Add certification information'
      ],
      impact: 'high'
    },
    {
      id: '6',
      name: 'Experience Relevance',
      score: 82,
      maxScore: 100,
      status: 'good',
      description: 'Experience aligns well with target role',
      suggestions: [
        'Quantify achievements with metrics',
        'Add more relevant project details',
        'Highlight leadership experience'
      ],
      impact: 'medium'
    }
  ]
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
    case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'needs-improvement': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'critical': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'excellent': return <CheckCircle2 className="h-4 w-4" />;
    case 'good': return <CheckCircle2 className="h-4 w-4" />;
    case 'needs-improvement': return <AlertTriangle className="h-4 w-4" />;
    case 'critical': return <AlertCircle className="h-4 w-4" />;
    default: return <AlertCircle className="h-4 w-4" />;
  }
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'high': return 'bg-red-100 text-red-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export function ATSOptimizationDashboard() {
  const [selectedMetric, setSelectedMetric] = useState<ATSMetric | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleReanalyze = async () => {
    setIsAnalyzing(true);
    // Simulate analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 3000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-green-600';
    if (score >= 75) return 'bg-blue-600';
    if (score >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">ATS Optimization</h2>
          <p className="text-muted-foreground">
            Optimize your resume for Applicant Tracking Systems
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleReanalyze} disabled={isAnalyzing}>
            <RefreshCcw className={`h-4 w-4 mr-2 ${isAnalyzing ? 'animate-spin' : ''}`} />
            {isAnalyzing ? 'Analyzing...' : 'Re-analyze'}
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overall Score Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Overall ATS Score</CardTitle>
              <CardDescription>
                Based on {mockATSAnalysis.metrics.length} key metrics
              </CardDescription>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${getScoreColor(mockATSAnalysis.overallScore)}`}>
                {mockATSAnalysis.overallScore}%
              </div>
              {mockATSAnalysis.previousScore && (
                <div className="flex items-center text-sm text-muted-foreground">
                  {mockATSAnalysis.overallScore > mockATSAnalysis.previousScore ? (
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  {Math.abs(mockATSAnalysis.overallScore - mockATSAnalysis.previousScore)}% from last check
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Progress 
              value={mockATSAnalysis.overallScore} 
              className="h-3"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Parsing Time: {mockATSAnalysis.estimatedParsingTime}s
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Compatibility: {mockATSAnalysis.compatibilityLevel}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Last updated: {new Date(mockATSAnalysis.lastUpdated).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="metrics">Detailed Metrics</TabsTrigger>
          <TabsTrigger value="suggestions">Optimization Tips</TabsTrigger>
          <TabsTrigger value="trends">Score Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mockATSAnalysis.metrics.map((metric) => (
              <Card 
                key={metric.id} 
                className={`cursor-pointer transition-all ${
                  selectedMetric?.id === metric.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
                }`}
                onClick={() => setSelectedMetric(metric)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded ${getStatusColor(metric.status)}`}>
                        {getStatusIcon(metric.status)}
                      </div>
                      <CardTitle className="text-base">{metric.name}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getImpactColor(metric.impact)} variant="outline">
                        {metric.impact} impact
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Score</span>
                      <span className={`font-semibold ${getScoreColor(metric.score)}`}>
                        {metric.score}/{metric.maxScore}
                      </span>
                    </div>
                    <Progress value={(metric.score / metric.maxScore) * 100} className="h-2" />
                    <p className="text-sm text-muted-foreground">{metric.description}</p>
                    {metric.suggestions.length > 0 && (
                      <div className="text-sm">
                        <span className="font-medium">Top suggestion:</span>
                        <p className="text-muted-foreground mt-1">{metric.suggestions[0]}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedMetric && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>{selectedMetric.name} - Detailed Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Current Status</h4>
                    <div className={`p-3 rounded-lg ${getStatusColor(selectedMetric.status)}`}>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(selectedMetric.status)}
                        <span className="font-medium capitalize">{selectedMetric.status.replace('-', ' ')}</span>
                      </div>
                      <p className="text-sm mt-1">{selectedMetric.description}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Score Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Current Score:</span>
                        <span className="font-medium">{selectedMetric.score}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Maximum Score:</span>
                        <span className="font-medium">{selectedMetric.maxScore}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Improvement Potential:</span>
                        <span className="font-medium text-green-600">
                          +{selectedMetric.maxScore - selectedMetric.score} points
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Optimization Suggestions
                  </h4>
                  <div className="space-y-2">
                    {selectedMetric.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-start space-x-2 p-2 bg-muted/50 rounded">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                          <span className="text-xs font-medium text-primary">{index + 1}</span>
                        </div>
                        <span className="text-sm">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm">
                      <Zap className="h-4 w-4 mr-1" />
                      Apply AI Suggestions
                    </Button>
                    <Button size="sm" variant="outline">
                      View Examples
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* High Impact Suggestions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                  High Impact Fixes
                </CardTitle>
                <CardDescription>
                  Address these for the biggest score improvement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockATSAnalysis.metrics
                  .filter(m => m.impact === 'high' && m.status !== 'excellent')
                  .map(metric => (
                    <div key={metric.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{metric.name}</span>
                        <Badge className={getImpactColor(metric.impact)} variant="outline">
                          +{metric.maxScore - metric.score} pts
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {metric.suggestions[0]}
                      </p>
                      <Button size="sm" variant="outline" className="w-full">
                        Fix Now
                      </Button>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Quick Wins */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-green-500" />
                  Quick Wins
                </CardTitle>
                <CardDescription>
                  Easy improvements you can make right now
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "Add missing contact information",
                  "Include LinkedIn profile URL",
                  "Use consistent date formatting",
                  "Add job-relevant keywords",
                  "Remove special characters from headers"
                ].map((suggestion, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{suggestion}</span>
                      <Button size="sm" variant="ghost">
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* AI Recommendations Alert */}
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              Our AI has identified 3 critical improvements that could boost your ATS score by up to 15 points. 
              <Button variant="link" className="p-0 ml-1 h-auto">
                View detailed recommendations →
              </Button>
            </AlertDescription>
          </Alert>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Score History
              </CardTitle>
              <CardDescription>
                Track your ATS optimization progress over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Score trend chart would appear here</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">87%</div>
                  <div className="text-sm text-muted-foreground">Current</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">82%</div>
                  <div className="text-sm text-muted-foreground">Last Week</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">78%</div>
                  <div className="text-sm text-muted-foreground">Last Month</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">+9%</div>
                  <div className="text-sm text-muted-foreground">Total Growth</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}