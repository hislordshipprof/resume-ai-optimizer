import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building, 
  TrendingUp, 
  Target, 
  Zap, 
  Code, 
  DollarSign, 
  Users, 
  Briefcase,
  Star,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface IndustryProfile {
  id: string;
  name: string;
  icon: any;
  description: string;
  keySkills: string[];
  actionVerbs: string[];
  metrics: string[];
  averageSalary: string;
  growthRate: string;
  competitiveness: 'low' | 'medium' | 'high';
}

interface OptimizationSuggestion {
  type: 'keyword' | 'verb' | 'metric' | 'skill';
  title: string;
  description: string;
  originalText: string;
  suggestedText: string;
  impact: number;
}

interface IndustryOptimizationProps {
  currentIndustry?: string;
  className?: string;
}

const industries: IndustryProfile[] = [
  {
    id: 'technology',
    name: 'Technology',
    icon: Code,
    description: 'Software development, engineering, and tech innovation',
    keySkills: ['React', 'Python', 'AWS', 'Kubernetes', 'TypeScript', 'Machine Learning'],
    actionVerbs: ['engineered', 'architected', 'optimized', 'scaled', 'automated', 'deployed'],
    metrics: ['performance improvement', 'uptime', 'user engagement', 'code coverage', 'load time'],
    averageSalary: '$95,000 - $150,000',
    growthRate: '+22%',
    competitiveness: 'high'
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: DollarSign,
    description: 'Banking, investment, fintech, and financial services',
    keySkills: ['Excel', 'SQL', 'Risk Management', 'Financial Modeling', 'Python', 'Tableau'],
    actionVerbs: ['analyzed', 'forecasted', 'optimized', 'managed', 'mitigated', 'evaluated'],
    metrics: ['ROI', 'cost reduction', 'revenue growth', 'risk mitigation', 'portfolio performance'],
    averageSalary: '$75,000 - $120,000',
    growthRate: '+8%',
    competitiveness: 'high'
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: Users,
    description: 'Medical, pharmaceutical, and health technology',
    keySkills: ['Clinical Research', 'Healthcare Analytics', 'EMR Systems', 'Compliance', 'Patient Care'],
    actionVerbs: ['treated', 'diagnosed', 'improved', 'implemented', 'coordinated', 'administered'],
    metrics: ['patient satisfaction', 'treatment outcomes', 'cost per case', 'efficiency gains'],
    averageSalary: '$65,000 - $110,000',
    growthRate: '+15%',
    competitiveness: 'medium'
  },
  {
    id: 'consulting',
    name: 'Consulting',
    icon: Briefcase,
    description: 'Management consulting, strategy, and business advisory',
    keySkills: ['Strategy', 'Project Management', 'Data Analysis', 'Stakeholder Management', 'Process Improvement'],
    actionVerbs: ['advised', 'strategized', 'facilitated', 'transformed', 'delivered', 'consulted'],
    metrics: ['client satisfaction', 'project delivery', 'cost savings', 'process efficiency'],
    averageSalary: '$80,000 - $130,000',
    growthRate: '+11%',
    competitiveness: 'high'
  }
];

export const IndustryOptimization = ({ currentIndustry = 'technology', className }: IndustryOptimizationProps) => {
  const [selectedIndustry, setSelectedIndustry] = useState(currentIndustry);
  const [optimizationScore, setOptimizationScore] = useState(72);
  const [isOptimizing, setIsOptimizing] = useState(false);

  const industry = industries.find(i => i.id === selectedIndustry) || industries[0];

  const mockSuggestions: OptimizationSuggestion[] = [
    {
      type: 'verb',
      title: 'Use Industry-Specific Action Verbs',
      description: 'Replace generic verbs with industry-preferred terminology',
      originalText: 'Built web applications',
      suggestedText: 'Engineered scalable web applications',
      impact: 85
    },
    {
      type: 'metric',
      title: 'Add Performance Metrics',
      description: 'Include specific metrics that matter in your industry',
      originalText: 'Improved system performance',
      suggestedText: 'Improved system performance by 40%, reducing API response time from 200ms to 120ms',
      impact: 92
    },
    {
      type: 'keyword',
      title: 'Include Trending Technologies',
      description: 'Add current industry keywords to improve relevance',
      originalText: 'Frontend development experience',
      suggestedText: 'Frontend development experience with React, TypeScript, and modern CI/CD pipelines',
      impact: 78
    }
  ];

  const handleOptimize = async () => {
    setIsOptimizing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setOptimizationScore(Math.min(100, optimizationScore + Math.floor(Math.random() * 20) + 10));
    setIsOptimizing(false);
  };

  const getCompetitivenessColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Industry Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Industry Optimization
          </CardTitle>
          <CardDescription>
            Optimize your resume for specific industry requirements and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Industry</label>
              <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your target industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map(industry => (
                    <SelectItem key={industry.id} value={industry.id}>
                      <div className="flex items-center gap-2">
                        <industry.icon className="w-4 h-4" />
                        {industry.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <h3 className="font-semibold">Current Optimization Score</h3>
                <p className="text-sm text-muted-foreground">
                  How well your resume matches {industry.name} industry standards
                </p>
              </div>
              <div className="text-center">
                <div className={cn("text-2xl font-bold", getScoreColor(optimizationScore))}>
                  {optimizationScore}%
                </div>
                <Progress value={optimizationScore} className="w-20 h-2 mt-1" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Industry Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <industry.icon className="w-5 h-5" />
            {industry.name} Industry Profile
          </CardTitle>
          <CardDescription>{industry.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <DollarSign className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="text-sm font-medium">Average Salary</p>
              <p className="text-xs text-muted-foreground">{industry.averageSalary}</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <TrendingUp className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="text-sm font-medium">Growth Rate</p>
              <p className="text-xs text-success">{industry.growthRate}</p>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Target className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="text-sm font-medium">Competition</p>
              <p className={cn("text-xs font-medium capitalize", getCompetitivenessColor(industry.competitiveness))}>
                {industry.competitiveness}
              </p>
            </div>
          </div>

          <Tabs defaultValue="skills" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="skills">Key Skills</TabsTrigger>
              <TabsTrigger value="verbs">Action Verbs</TabsTrigger>
              <TabsTrigger value="metrics">Metrics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="skills" className="space-y-3">
              <h4 className="font-semibold">In-Demand Skills</h4>
              <div className="flex flex-wrap gap-2">
                {industry.keySkills.map(skill => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="verbs" className="space-y-3">
              <h4 className="font-semibold">Preferred Action Verbs</h4>
              <div className="flex flex-wrap gap-2">
                {industry.actionVerbs.map(verb => (
                  <Badge key={verb} variant="outline">
                    {verb}
                  </Badge>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="metrics" className="space-y-3">
              <h4 className="font-semibold">Important Metrics</h4>
              <div className="flex flex-wrap gap-2">
                {industry.metrics.map(metric => (
                  <Badge key={metric} variant="secondary" className="bg-primary/10 text-primary">
                    {metric}
                  </Badge>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Optimization Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Industry-Specific Suggestions
          </CardTitle>
          <CardDescription>
            AI-powered recommendations to align your resume with {industry.name} standards
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockSuggestions.map((suggestion, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{suggestion.title}</h4>
                    <Badge variant="outline">
                      +{suggestion.impact}% impact
                    </Badge>
                    <Badge variant="secondary" className="capitalize">
                      {suggestion.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {suggestion.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Current:</span>
                      <p className="text-destructive/80">"{suggestion.originalText}"</p>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Optimized:</span>
                      <p className="text-success">"{suggestion.suggestedText}"</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="ai" size="sm" className="flex-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Apply Suggestion
                </Button>
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </div>
            </div>
          ))}
          
          <div className="flex justify-center pt-4">
            <Button 
              onClick={handleOptimize}
              variant="ai" 
              size="lg"
              disabled={isOptimizing}
              className="min-w-[200px]"
            >
              {isOptimizing ? (
                <>
                  <Zap className="w-4 h-4 mr-2 animate-pulse" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Auto-Optimize for {industry.name}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};