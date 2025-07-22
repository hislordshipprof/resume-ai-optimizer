import { TopNavBar } from "@/components/layout/TopNavBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  FileText,
  Target,
  TrendingUp,
  Calendar,
  Award,
  Upload,
  Share,
  Edit,
  Download,
  Eye
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  // Helper function to get user initials
  const getUserInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground">Your career dashboard and resume portfolio</p>
        </div>

        <div className="grid gap-6">
          {/* Profile Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=face" />
                  <AvatarFallback>{user ? getUserInitials(user.full_name) : 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold">{user?.full_name || 'User Name'}</h3>
                  <p className="text-muted-foreground">{user?.email || 'No email provided'}</p>
                  <p className="text-sm text-muted-foreground mt-1">Status: {user?.is_active ? 'Active' : 'Inactive'}</p>
                  <div className="flex gap-2 mt-3">
                    <Badge variant="secondary">Technology</Badge>
                    <Badge variant="outline">Remote</Badge>
                    <Badge variant="outline">$120k - $160k</Badge>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share className="w-4 h-4 mr-2" />
                      Share Profile
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="dashboard" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="resumes">My Resumes</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">ATS Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">87%</div>
                    <p className="text-xs text-muted-foreground">+5% from last week</p>
                    <Progress value={87} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Resumes Created</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <p className="text-xs text-muted-foreground">3 optimized this month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Job Applications</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">28</div>
                    <p className="text-xs text-muted-foreground">8 pending responses</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Career Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Profile Completeness</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Skills Assessment</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Resume Optimization</span>
                        <span>78%</span>
                      </div>
                      <Progress value={78} />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-4 h-4" />
                      Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="p-2">
                        <Target className="w-4 h-4" />
                      </Badge>
                      <div>
                        <p className="font-medium">ATS Optimizer</p>
                        <p className="text-sm text-muted-foreground">Achieved 80%+ ATS score</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="p-2">
                        <FileText className="w-4 h-4" />
                      </Badge>
                      <div>
                        <p className="font-medium">Resume Master</p>
                        <p className="text-sm text-muted-foreground">Created 10+ resumes</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="p-2">
                        <TrendingUp className="w-4 h-4" />
                      </Badge>
                      <div>
                        <p className="font-medium">Early Adopter</p>
                        <p className="text-sm text-muted-foreground">Using AI optimization</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Resumes Tab */}
            <TabsContent value="resumes" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Your Resume Portfolio</h3>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New Resume
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Senior Developer Resume</CardTitle>
                    <CardDescription>Technology • Updated 2 days ago</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>ATS Score:</span>
                        <Badge variant="default">87%</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Product Manager Resume</CardTitle>
                    <CardDescription>Technology • Updated 1 week ago</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>ATS Score:</span>
                        <Badge variant="secondary">74%</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Frontend Engineer Resume</CardTitle>
                    <CardDescription>Technology • Updated 2 weeks ago</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>ATS Score:</span>
                        <Badge variant="outline">92%</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium">Resume optimization completed</p>
                        <p className="text-sm text-muted-foreground">Your "Senior Developer Resume" ATS score improved to 87%</p>
                        <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium">New job application submitted</p>
                        <p className="text-sm text-muted-foreground">Applied to Senior Software Engineer at TechCorp</p>
                        <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium">Profile updated</p>
                        <p className="text-sm text-muted-foreground">Added new skills: React, TypeScript, Node.js</p>
                        <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2"></div>
                      <div className="flex-1">
                        <p className="font-medium">Achievement unlocked</p>
                        <p className="text-sm text-muted-foreground">Earned "ATS Optimizer" badge for 80%+ score</p>
                        <p className="text-xs text-muted-foreground mt-1">1 week ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Career Preferences</CardTitle>
                  <CardDescription>
                    These preferences help us provide better job recommendations and optimize your resumes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Current Role</h4>
                      <p className="text-sm text-muted-foreground">Senior Software Engineer</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Target Industry</h4>
                      <p className="text-sm text-muted-foreground">Technology</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Experience Level</h4>
                      <p className="text-sm text-muted-foreground">Senior Level (5+ years)</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Salary Range</h4>
                      <p className="text-sm text-muted-foreground">$120k - $160k</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Work Type</h4>
                      <p className="text-sm text-muted-foreground">Remote, Hybrid</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Location</h4>
                      <p className="text-sm text-muted-foreground">San Francisco Bay Area</p>
                    </div>
                  </div>
                  <Button>Update Preferences</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}