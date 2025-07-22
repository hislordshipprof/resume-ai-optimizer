import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { TrendingUp, FileText, Target, Zap, Users, Calendar, BarChart3, Brain, Upload, Lightbulb, Download, Clock } from "lucide-react";
interface DashboardMetric {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ElementType;
  color: 'primary' | 'secondary' | 'accent' | 'success';
}
interface RecentActivity {
  id: string;
  type: 'upload' | 'optimization' | 'download' | 'analysis';
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'processing' | 'failed';
}
interface AIInsight {
  id: string;
  type: 'skill' | 'market' | 'optimization' | 'trend';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
}
export function MainDashboard() {
  const metrics: DashboardMetric[] = [{
    id: 'response-rate',
    title: 'Response Rate',
    value: '24%',
    change: '+4.5%',
    trend: 'up',
    icon: TrendingUp,
    color: 'success'
  }, {
    id: 'optimizations',
    title: 'Optimizations',
    value: '12',
    change: '+3',
    trend: 'up',
    icon: Zap,
    color: 'primary'
  }, {
    id: 'ats-score',
    title: 'Average ATS Score',
    value: '87%',
    change: '+12%',
    trend: 'up',
    icon: Target,
    color: 'accent'
  }, {
    id: 'applications',
    title: 'Applications Sent',
    value: '34',
    change: '+8',
    trend: 'up',
    icon: FileText,
    color: 'secondary'
  }];
  const recentActivities: RecentActivity[] = [{
    id: '1',
    type: 'optimization',
    title: 'Software Engineer Resume Optimized',
    description: 'Enhanced for React Developer position at TechCorp',
    timestamp: '2 hours ago',
    status: 'completed'
  }, {
    id: '2',
    type: 'download',
    title: 'Resume Downloaded',
    description: 'PDF format with LaTeX styling',
    timestamp: '4 hours ago',
    status: 'completed'
  }, {
    id: '3',
    type: 'analysis',
    title: 'Job Requirements Analyzed',
    description: 'Frontend Developer at StartupXYZ',
    timestamp: '1 day ago',
    status: 'completed'
  }, {
    id: '4',
    type: 'upload',
    title: 'New Resume Uploaded',
    description: 'Original resume parsed successfully',
    timestamp: '2 days ago',
    status: 'completed'
  }];
  const aiInsights: AIInsight[] = [{
    id: '1',
    type: 'skill',
    title: 'Add TypeScript Skills',
    description: 'TypeScript is mentioned in 85% of React developer jobs',
    priority: 'high',
    actionable: true
  }, {
    id: '2',
    type: 'market',
    title: 'Remote Work Trending',
    description: 'Remote positions increased 40% in your industry',
    priority: 'medium',
    actionable: false
  }, {
    id: '3',
    type: 'optimization',
    title: 'Quantify Achievements',
    description: 'Add metrics to your project descriptions for better impact',
    priority: 'high',
    actionable: true
  }, {
    id: '4',
    type: 'trend',
    title: 'AI/ML Skills in Demand',
    description: 'Consider adding AI-related projects to stay competitive',
    priority: 'medium',
    actionable: true
  }];
  const getMetricColor = (color: string) => {
    switch (color) {
      case 'primary':
        return 'text-primary';
      case 'secondary':
        return 'text-secondary';
      case 'accent':
        return 'text-accent';
      case 'success':
        return 'text-success';
      default:
        return 'text-primary';
    }
  };
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'upload':
        return Upload;
      case 'optimization':
        return Zap;
      case 'download':
        return Download;
      case 'analysis':
        return BarChart3;
      default:
        return FileText;
    }
  };
  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'skill':
        return Lightbulb;
      case 'market':
        return TrendingUp;
      case 'optimization':
        return Target;
      case 'trend':
        return BarChart3;
      default:
        return Brain;
    }
  };
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive text-destructive-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'low':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };
  return <div className="space-y-8">
      {/* Welcome Section */}
      <div className="hero-gradient rounded-2xl p-8 text-white">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">Welcome back! 👋</h1>
          <p className="text-xl opacity-90 mb-6">
            Your AI-powered resume optimization is performing great. Here's your latest insights.
          </p>
          <div className="flex gap-4">
            <Link to="/upload">
              <Button className="bg-white/20 hover:bg-white/30 text-white border-white/20">
                Start New Optimization
              </Button>
            </Link>
            <Button variant="outline" className="border-white/20 text-white bg-purple-600 hover:bg-purple-500">
              View Resume Library
            </Button>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Performance Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map(metric => {
          const IconComponent = metric.icon;
          return <Card key={metric.id} className="metric-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {metric.title}
                  </CardTitle>
                  <IconComponent className={`h-5 w-5 ${getMetricColor(metric.color)}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold mb-2">{metric.value}</div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {metric.change}
                    </Badge>
                    <span className="text-xs text-muted-foreground">vs last month</span>
                  </div>
                </CardContent>
              </Card>;
        })}
        </div>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="activity" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="activity" className="space-y-6">
          <Card className="professional-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your latest resume optimization activities and downloads
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map(activity => {
                const IconComponent = getActivityIcon(activity.type);
                return <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg border bg-muted/30">
                      <div className="p-2 rounded-full bg-primary/10">
                        <IconComponent className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <h4 className="font-medium">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {activity.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                        </div>
                      </div>
                    </div>;
              })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card className="ai-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                AI-Powered Insights
              </CardTitle>
              <CardDescription className="text-stone-50">
                Personalized recommendations to improve your job search success
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aiInsights.map(insight => {
                const IconComponent = getInsightIcon(insight.type);
                return <div key={insight.id} className="flex items-start gap-4 p-4 rounded-lg border bg-background/80">
                      <div className="p-2 rounded-full bg-ai-primary/10">
                        <IconComponent className="h-4 w-4 text-ai-primary" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{insight.title}</h4>
                          <Badge className={getPriorityColor(insight.priority)}>
                            {insight.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{insight.description}</p>
                        {insight.actionable && <Button size="sm" variant="outline" className="text-xs">
                            Take Action
                          </Button>}
                      </div>
                    </div>;
              })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="professional-card">
              <CardHeader>
                <CardTitle>Optimization Progress</CardTitle>
                <CardDescription>Your resume improvement journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>ATS Compatibility</span>
                    <span className="score-excellent">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Keyword Optimization</span>
                    <span className="score-good">72%</span>
                  </div>
                  <Progress value={72} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Content Quality</span>
                    <span className="score-excellent">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Industry Alignment</span>
                    <span className="score-fair">68%</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="professional-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link to="/upload">
                  <Button className="w-full justify-start" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload New Resume
                  </Button>
                </Link>
                <Button className="w-full justify-start" variant="outline">
                  <Target className="h-4 w-4 mr-2" />
                  Analyze Job Description
                </Button>
                <Link to="/upload">
                  <Button className="w-full justify-start" variant="outline">
                    <Zap className="h-4 w-4 mr-2" />
                    Start Optimization
                  </Button>
                </Link>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Resume
                </Button>
                <Link to="/project-suggestions">
                  <Button className="w-full justify-start" variant="outline">
                    <Lightbulb className="h-4 w-4 mr-2" />
                    Project Suggestions
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>;
}