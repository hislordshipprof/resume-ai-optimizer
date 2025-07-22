import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Target,
  Eye,
  Download,
  Calendar,
  Clock,
  Users,
  Award,
  Zap,
  Brain,
  Star,
  Activity,
  FileText,
  MessageCircle,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Filter,
  Share,
  RefreshCcw
} from 'lucide-react';

interface Metric {
  id: string;
  name: string;
  value: number;
  previousValue: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  category: 'applications' | 'resume' | 'interview' | 'skills';
  description: string;
}

interface GoalProgress {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  priority: 'high' | 'medium' | 'low';
  status: 'on-track' | 'behind' | 'ahead' | 'completed';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  type: 'milestone' | 'streak' | 'improvement' | 'completion';
  unlockedDate: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
}

const mockMetrics: Metric[] = [
  {
    id: '1',
    name: 'Applications Sent',
    value: 24,
    previousValue: 18,
    unit: 'applications',
    trend: 'up',
    category: 'applications',
    description: 'Total job applications submitted this month'
  },
  {
    id: '2',
    name: 'Response Rate',
    value: 42,
    previousValue: 38,
    unit: '%',
    trend: 'up',
    category: 'applications',
    description: 'Percentage of applications that received responses'
  },
  {
    id: '3',
    name: 'ATS Score',
    value: 87,
    previousValue: 82,
    unit: '%',
    trend: 'up',
    category: 'resume',
    description: 'Average ATS compatibility score across resumes'
  },
  {
    id: '4',
    name: 'Interview Success',
    value: 76,
    previousValue: 81,
    unit: '%',
    trend: 'down',
    category: 'interview',
    description: 'Percentage of interviews that led to next rounds'
  },
  {
    id: '5',
    name: 'Skills Improved',
    value: 8,
    previousValue: 5,
    unit: 'skills',
    trend: 'up',
    category: 'skills',
    description: 'Number of skills where proficiency level increased'
  },
  {
    id: '6',
    name: 'Practice Sessions',
    value: 15,
    previousValue: 12,
    unit: 'sessions',
    trend: 'up',
    category: 'interview',
    description: 'Interview practice sessions completed this month'
  }
];

const mockGoals: GoalProgress[] = [
  {
    id: '1',
    title: 'Land a Senior Role',
    target: 1,
    current: 0,
    unit: 'offer',
    deadline: '2024-03-31',
    priority: 'high',
    status: 'on-track'
  },
  {
    id: '2',
    title: 'Increase ATS Score',
    target: 90,
    current: 87,
    unit: '%',
    deadline: '2024-02-15',
    priority: 'medium',
    status: 'on-track'
  },
  {
    id: '3',
    title: 'Complete 50 Applications',
    target: 50,
    current: 24,
    unit: 'applications',
    deadline: '2024-02-29',
    priority: 'medium',
    status: 'behind'
  },
  {
    id: '4',
    title: 'Master System Design',
    target: 10,
    current: 7,
    unit: 'topics',
    deadline: '2024-02-20',
    priority: 'high',
    status: 'ahead'
  }
];

const mockAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Response',
    description: 'Received your first response from a job application',
    type: 'milestone',
    unlockedDate: '2024-01-15',
    icon: '🎉',
    rarity: 'common'
  },
  {
    id: '2',
    title: 'Interview Streak',
    description: 'Completed 5 interviews in a row',
    type: 'streak',
    unlockedDate: '2024-01-20',
    icon: '🔥',
    rarity: 'uncommon'
  },
  {
    id: '3',
    title: 'ATS Master',
    description: 'Achieved 90%+ ATS score',
    type: 'improvement',
    unlockedDate: '2024-01-22',
    icon: '⚡',
    rarity: 'rare'
  },
  {
    id: '4',
    title: 'Skill Collector',
    description: 'Added 10 new skills to your profile',
    type: 'completion',
    unlockedDate: '2024-01-18',
    icon: '🌟',
    rarity: 'legendary'
  }
];

export function PerformanceAnalytics() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredMetrics = selectedCategory === 'all' 
    ? mockMetrics 
    : mockMetrics.filter(m => m.category === selectedCategory);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-blue-100 text-blue-800';
      case 'ahead': return 'bg-green-100 text-green-800';
      case 'behind': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'uncommon': return 'bg-green-100 text-green-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'legendary': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateProgress = (goal: GoalProgress) => {
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Performance Analytics</h2>
          <p className="text-muted-foreground">
            Track your job search progress and optimize your strategy
          </p>
        </div>
        <div className="flex space-x-2">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Share className="h-4 w-4 mr-2" />
            Share Progress
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Target className="h-4 w-4 mr-2 text-blue-600" />
              Goal Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">73%</div>
            <div className="text-xs text-muted-foreground">Average across all goals</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Award className="h-4 w-4 mr-2 text-green-600" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{mockAchievements.length}</div>
            <div className="text-xs text-muted-foreground">Unlocked this month</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-orange-50 to-amber-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="h-4 w-4 mr-2 text-orange-600" />
              Active Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">12</div>
            <div className="text-xs text-muted-foreground">Days of activity</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-r from-purple-50 to-violet-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Zap className="h-4 w-4 mr-2 text-purple-600" />
              Momentum Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">85</div>
            <div className="text-xs text-muted-foreground">Based on recent activity</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
          <TabsTrigger value="goals">Goals & Targets</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="applications">Applications</SelectItem>
                <SelectItem value="resume">Resume</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="skills">Skills</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMetrics.map((metric) => {
              const changePercent = ((metric.value - metric.previousValue) / metric.previousValue * 100).toFixed(1);
              
              return (
                <Card key={metric.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{metric.name}</CardTitle>
                      {getTrendIcon(metric.trend)}
                    </div>
                    <CardDescription>{metric.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold">
                        {metric.value}{metric.unit}
                      </div>
                      <div className={`text-sm font-medium ${getTrendColor(metric.trend)}`}>
                        {metric.trend === 'up' ? '+' : metric.trend === 'down' ? '-' : ''}
                        {Math.abs(Number(changePercent))}%
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      Previous: {metric.previousValue}{metric.unit}
                    </div>
                    
                    <Progress 
                      value={metric.category === 'applications' ? (metric.value / 50) * 100 : metric.value} 
                      className="h-2" 
                    />
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Category: {metric.category}</span>
                      <span>Updated: Just now</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Performance Trends
              </CardTitle>
              <CardDescription>
                Track your progress over time across all metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Interactive trends chart would appear here</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockGoals.map((goal) => {
              const progress = calculateProgress(goal);
              const daysLeft = getDaysUntilDeadline(goal.deadline);
              
              return (
                <Card key={goal.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{goal.title}</CardTitle>
                      <Badge className={getStatusColor(goal.status)} variant="outline">
                        {goal.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      Target: {goal.target} {goal.unit} by {new Date(goal.deadline).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold">
                        {goal.current}/{goal.target}
                      </div>
                      <div className="text-sm font-medium text-muted-foreground">
                        {progress.toFixed(0)}% complete
                      </div>
                    </div>
                    
                    <Progress value={progress} className="h-3" />
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className={`flex items-center space-x-1 ${
                        daysLeft < 7 ? 'text-red-600' : daysLeft < 14 ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        <Calendar className="h-4 w-4" />
                        <span>
                          {daysLeft > 0 ? `${daysLeft} days left` : `${Math.abs(daysLeft)} days overdue`}
                        </span>
                      </div>
                      <Badge className={
                        goal.priority === 'high' ? 'bg-red-100 text-red-800' :
                        goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      } variant="outline">
                        {goal.priority} priority
                      </Badge>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Target className="h-4 w-4 mr-1" />
                        Update Progress
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Add New Goal */}
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Target className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Set a New Goal</h3>
              <p className="text-sm text-muted-foreground mb-4 text-center">
                Define specific, measurable objectives to track your job search progress
              </p>
              <Button>
                <Target className="h-4 w-4 mr-2" />
                Create Goal
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockAchievements.map((achievement) => (
              <Card key={achievement.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div>
                        <CardTitle className="text-base">{achievement.title}</CardTitle>
                        <CardDescription className="text-xs">
                          {new Date(achievement.unlockedDate).toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getRarityColor(achievement.rarity)} variant="outline">
                      {achievement.rarity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {achievement.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {achievement.type}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Star className="h-3 w-3 mr-1" />
                      <span>Unlocked</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Achievement Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Achievement Progress
              </CardTitle>
              <CardDescription>
                Upcoming achievements you can unlock
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: 'Century Club', description: 'Send 100 applications', progress: 24, target: 100 },
                { name: 'Interview Expert', description: 'Complete 20 practice sessions', progress: 15, target: 20 },
                { name: 'Perfectionist', description: 'Achieve 95% ATS score', progress: 87, target: 95 }
              ].map((achievement, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-medium">{achievement.name}</span>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    </div>
                    <div className="text-sm font-medium">
                      {achievement.progress}/{achievement.target}
                    </div>
                  </div>
                  <Progress value={(achievement.progress / achievement.target) * 100} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  AI-Generated Insights
                </CardTitle>
                <CardDescription>
                  Personalized recommendations based on your data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    type: 'opportunity',
                    title: 'Optimize Application Timing',
                    description: 'Your response rate is 23% higher when applying on Tuesday-Thursday',
                    action: 'Schedule applications for mid-week'
                  },
                  {
                    type: 'warning',
                    title: 'Interview Preparation Gap',
                    description: 'Your technical interview success dropped 15% this month',
                    action: 'Focus on system design practice'
                  },
                  {
                    type: 'success',
                    title: 'Strong Resume Performance',
                    description: 'Your ATS score improved 6% after recent optimizations',
                    action: 'Apply this format to other resume versions'
                  }
                ].map((insight, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-start space-x-3">
                      <div className={`p-1 rounded ${
                        insight.type === 'opportunity' ? 'bg-blue-100 text-blue-600' :
                        insight.type === 'warning' ? 'bg-orange-100 text-orange-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        {insight.type === 'opportunity' ? <Target className="h-4 w-4" /> :
                         insight.type === 'warning' ? <AlertTriangle className="h-4 w-4" /> :
                         <CheckCircle2 className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                        <Button size="sm" variant="outline" className="text-xs">
                          {insight.action}
                          <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Performance Forecast
                </CardTitle>
                <CardDescription>
                  Predicted outcomes based on current trends
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { metric: 'Next Interview', prediction: '3-5 days', confidence: 85 },
                    { metric: 'Job Offer', prediction: '2-3 weeks', confidence: 72 },
                    { metric: 'ATS Score Goal', prediction: '1 week', confidence: 91 },
                    { metric: 'Skill Mastery', prediction: '4-6 weeks', confidence: 68 }
                  ].map((forecast, index) => (
                    <div key={index} className="border rounded p-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{forecast.metric}</span>
                        <span className="text-sm text-muted-foreground">{forecast.prediction}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={forecast.confidence} className="h-1 flex-1" />
                        <span className="text-xs text-muted-foreground">{forecast.confidence}% confidence</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Action Recommendations
              </CardTitle>
              <CardDescription>
                High-impact actions to accelerate your job search
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Increase Application Volume',
                    description: 'Apply to 3-5 more positions this week',
                    impact: 'High',
                    effort: 'Medium',
                    timeline: '1 week'
                  },
                  {
                    title: 'Optimize Resume Keywords',
                    description: 'Add 2-3 industry-specific keywords',
                    impact: 'Medium',
                    effort: 'Low',
                    timeline: '2 hours'
                  },
                  {
                    title: 'Practice System Design',
                    description: 'Complete 2 system design problems',
                    impact: 'High',
                    effort: 'High',
                    timeline: '1 week'
                  }
                ].map((recommendation, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <h4 className="font-medium mb-2">{recommendation.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{recommendation.description}</p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Impact:</span>
                        <Badge variant="outline" className={
                          recommendation.impact === 'High' ? 'text-green-600' : 'text-yellow-600'
                        }>
                          {recommendation.impact}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Effort:</span>
                        <span className="text-muted-foreground">{recommendation.effort}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Timeline:</span>
                        <span className="text-muted-foreground">{recommendation.timeline}</span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full mt-3">
                      Take Action
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}