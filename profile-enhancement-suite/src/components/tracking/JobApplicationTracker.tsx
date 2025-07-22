import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Plus,
  Briefcase,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Phone,
  Mail,
  FileText,
  ExternalLink,
  Filter,
  Search,
  MoreHorizontal,
  Bell,
  Star,
  Target,
  BarChart3
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Application {
  id: string;
  company: string;
  position: string;
  location: string;
  salary?: string;
  applicationDate: string;
  status: 'applied' | 'screening' | 'interview' | 'offer' | 'rejected' | 'withdrawn';
  source: string;
  jobUrl?: string;
  notes: string;
  contacts: Contact[];
  timeline: TimelineEvent[];
  priority: 'high' | 'medium' | 'low';
  tags: string[];
}

interface Contact {
  id: string;
  name: string;
  role: string;
  email?: string;
  phone?: string;
  linkedin?: string;
}

interface TimelineEvent {
  id: string;
  date: string;
  type: 'applied' | 'response' | 'interview' | 'follow-up' | 'offer' | 'rejection';
  description: string;
  nextAction?: string;
  dueDate?: string;
}

const mockApplications: Application[] = [
  {
    id: '1',
    company: 'Google',
    position: 'Senior Software Engineer',
    location: 'Mountain View, CA',
    salary: '$150,000 - $200,000',
    applicationDate: '2024-01-15',
    status: 'interview',
    source: 'LinkedIn',
    jobUrl: 'https://google.com/careers',
    notes: 'Strong technical fit, team lead position available',
    priority: 'high',
    tags: ['Remote-friendly', 'Growth opportunity'],
    contacts: [
      {
        id: 'c1',
        name: 'Sarah Johnson',
        role: 'Technical Recruiter',
        email: 'sarah@google.com',
        linkedin: 'linkedin.com/in/sarahjohnson'
      }
    ],
    timeline: [
      {
        id: 't1',
        date: '2024-01-15',
        type: 'applied',
        description: 'Applied through LinkedIn'
      },
      {
        id: 't2',
        date: '2024-01-18',
        type: 'response',
        description: 'Recruiter screening scheduled'
      },
      {
        id: 't3',
        date: '2024-01-22',
        type: 'interview',
        description: 'Technical interview with team lead',
        nextAction: 'System design interview',
        dueDate: '2024-01-25'
      }
    ]
  },
  {
    id: '2',
    company: 'Meta',
    position: 'Product Manager',
    location: 'Menlo Park, CA',
    salary: '$140,000 - $180,000',
    applicationDate: '2024-01-12',
    status: 'screening',
    source: 'Company Website',
    priority: 'high',
    tags: ['Product Strategy', 'AI/ML'],
    contacts: [],
    timeline: [
      {
        id: 't4',
        date: '2024-01-12',
        type: 'applied',
        description: 'Applied directly on Meta careers page'
      },
      {
        id: 't5',
        date: '2024-01-20',
        type: 'response',
        description: 'Initial screening call scheduled',
        nextAction: 'Prepare for PM case study',
        dueDate: '2024-01-24'
      }
    ],
    notes: 'Focus on AI/ML product experience'
  },
  {
    id: '3',
    company: 'Stripe',
    position: 'Full-Stack Engineer',
    location: 'San Francisco, CA',
    salary: '$130,000 - $170,000',
    applicationDate: '2024-01-10',
    status: 'rejected',
    source: 'Referral',
    priority: 'medium',
    tags: ['Fintech', 'Scalability'],
    contacts: [],
    timeline: [
      {
        id: 't6',
        date: '2024-01-10',
        type: 'applied',
        description: 'Applied through employee referral'
      },
      {
        id: 't7',
        date: '2024-01-19',
        type: 'rejection',
        description: 'Position filled internally'
      }
    ],
    notes: 'Good feedback on technical skills, consider for future openings'
  }
];

export function JobApplicationTracker() {
  const [applications, setApplications] = useState(mockApplications);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // New application form state
  const [newApp, setNewApp] = useState({
    company: '',
    position: '',
    location: '',
    salary: '',
    source: '',
    jobUrl: '',
    notes: '',
    priority: 'medium' as 'high' | 'medium' | 'low'
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'applied': return 'bg-blue-100 text-blue-800';
      case 'screening': return 'bg-purple-100 text-purple-800';
      case 'interview': return 'bg-orange-100 text-orange-800';
      case 'offer': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'withdrawn': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'applied': return <Clock className="h-4 w-4" />;
      case 'screening': return <Phone className="h-4 w-4" />;
      case 'interview': return <Users className="h-4 w-4" />;
      case 'offer': return <CheckCircle2 className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'withdrawn': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesSearch = app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.position.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusCounts = {
    total: applications.length,
    applied: applications.filter(a => a.status === 'applied').length,
    screening: applications.filter(a => a.status === 'screening').length,
    interview: applications.filter(a => a.status === 'interview').length,
    offer: applications.filter(a => a.status === 'offer').length,
    rejected: applications.filter(a => a.status === 'rejected').length
  };

  const responseRate = statusCounts.total > 0 ? 
    Math.round(((statusCounts.total - statusCounts.applied) / statusCounts.total) * 100) : 0;

  const handleAddApplication = () => {
    const application: Application = {
      id: Date.now().toString(),
      ...newApp,
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'applied',
      contacts: [],
      timeline: [
        {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          type: 'applied',
          description: `Applied through ${newApp.source || 'direct application'}`
        }
      ],
      tags: []
    };
    
    setApplications([...applications, application]);
    setNewApp({
      company: '',
      position: '',
      location: '',
      salary: '',
      source: '',
      jobUrl: '',
      notes: '',
      priority: 'medium'
    });
    setShowAddDialog(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Job Application Tracker</h2>
          <p className="text-muted-foreground">
            Track and manage your job applications in one place
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Application
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add New Application</DialogTitle>
              <DialogDescription>
                Track a new job application
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={newApp.company}
                    onChange={(e) => setNewApp({...newApp, company: e.target.value})}
                    placeholder="Google, Meta, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input
                    id="position"
                    value={newApp.position}
                    onChange={(e) => setNewApp({...newApp, position: e.target.value})}
                    placeholder="Software Engineer"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={newApp.location}
                    onChange={(e) => setNewApp({...newApp, location: e.target.value})}
                    placeholder="San Francisco, CA"
                  />
                </div>
                <div>
                  <Label htmlFor="salary">Salary Range</Label>
                  <Input
                    id="salary"
                    value={newApp.salary}
                    onChange={(e) => setNewApp({...newApp, salary: e.target.value})}
                    placeholder="$120,000 - $150,000"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="source">Application Source</Label>
                  <Select value={newApp.source} onValueChange={(value) => setNewApp({...newApp, source: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="How did you apply?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                      <SelectItem value="Company Website">Company Website</SelectItem>
                      <SelectItem value="Referral">Employee Referral</SelectItem>
                      <SelectItem value="Job Board">Job Board</SelectItem>
                      <SelectItem value="Recruiter">Recruiter Contact</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={newApp.priority} onValueChange={(value: 'high' | 'medium' | 'low') => setNewApp({...newApp, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="jobUrl">Job Posting URL</Label>
                <Input
                  id="jobUrl"
                  value={newApp.jobUrl}
                  onChange={(e) => setNewApp({...newApp, jobUrl: e.target.value})}
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newApp.notes}
                  onChange={(e) => setNewApp({...newApp, notes: e.target.value})}
                  placeholder="Any additional notes about this application..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              <Button onClick={handleAddApplication}>Add Application</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusCounts.total}</div>
            <div className="text-xs text-muted-foreground">This month</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{responseRate}%</div>
            <div className="text-xs text-muted-foreground">Companies responded</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Interviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{statusCounts.interview}</div>
            <div className="text-xs text-muted-foreground">In progress</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Offers Received</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statusCounts.offer}</div>
            <div className="text-xs text-muted-foreground">Pending decision</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.5</div>
            <div className="text-xs text-muted-foreground">Days</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Interview Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">42%</div>
            <div className="text-xs text-muted-foreground">Of applications</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="applications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies, positions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="screening">Screening</SelectItem>
                <SelectItem value="interview">Interview</SelectItem>
                <SelectItem value="offer">Offer</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Applications List */}
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <Card key={app.id} className={`border-l-4 ${getPriorityColor(app.priority)} hover:shadow-md transition-shadow`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Briefcase className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle className="text-lg">{app.position}</CardTitle>
                        <CardDescription className="flex items-center space-x-2">
                          <span>{app.company}</span>
                          {app.location && (
                            <>
                              <span>•</span>
                              <span className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {app.location}
                              </span>
                            </>
                          )}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(app.status)} variant="outline">
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(app.status)}
                          <span>{app.status}</span>
                        </div>
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedApplication(app)}>
                            <FileText className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Bell className="h-4 w-4 mr-2" />
                            Set Reminder
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Star className="h-4 w-4 mr-2" />
                            Mark as Priority
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <XCircle className="h-4 w-4 mr-2" />
                            Withdraw
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>Applied {new Date(app.applicationDate).toLocaleDateString()}</span>
                    </div>
                    {app.salary && (
                      <div className="flex items-center text-sm">
                        <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{app.salary}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm">
                      <span className="text-muted-foreground mr-2">Source:</span>
                      <span>{app.source}</span>
                    </div>
                    {app.jobUrl && (
                      <div className="flex items-center text-sm">
                        <ExternalLink className="h-4 w-4 mr-2 text-muted-foreground" />
                        <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          View Job Posting
                        </a>
                      </div>
                    )}
                  </div>
                  
                  {app.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {app.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {app.notes && (
                    <div className="mt-3 p-2 bg-muted/50 rounded text-sm">
                      {app.notes}
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-muted-foreground">
                      Last update: {app.timeline.length > 0 ? new Date(app.timeline[app.timeline.length - 1].date).toLocaleDateString() : 'N/A'}
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setSelectedApplication(app)}>
                      View Timeline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries({
              'Applied': applications.filter(a => a.status === 'applied'),
              'Screening': applications.filter(a => a.status === 'screening'),
              'Interview': applications.filter(a => a.status === 'interview'),
              'Offer': applications.filter(a => a.status === 'offer'),
              'Rejected': applications.filter(a => a.status === 'rejected'),
              'Withdrawn': applications.filter(a => a.status === 'withdrawn')
            }).map(([status, apps]) => (
              <Card key={status}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    {status}
                    <Badge variant="outline">{apps.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {apps.slice(0, 3).map((app) => (
                    <div key={app.id} className="p-2 border rounded text-sm">
                      <div className="font-medium">{app.company}</div>
                      <div className="text-muted-foreground text-xs">{app.position}</div>
                    </div>
                  ))}
                  {apps.length > 3 && (
                    <div className="text-xs text-muted-foreground text-center py-1">
                      +{apps.length - 3} more
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Application Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground">Application trends chart would appear here</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Success Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Response Rate</span>
                    <span className="font-medium">{responseRate}%</span>
                  </div>
                  <Progress value={responseRate} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Interview Rate</span>
                    <span className="font-medium">42%</span>
                  </div>
                  <Progress value={42} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Offer Rate</span>
                    <span className="font-medium">15%</span>
                  </div>
                  <Progress value={15} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-muted/20 rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Calendar view would appear here</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Application Details Dialog */}
      {selectedApplication && (
        <Dialog open={!!selectedApplication} onOpenChange={() => setSelectedApplication(null)}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5" />
                <span>{selectedApplication.position} at {selectedApplication.company}</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Status:</span>
                  <Badge className={getStatusColor(selectedApplication.status)} variant="outline">
                    {selectedApplication.status}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Priority:</span>
                  <Badge className={selectedApplication.priority === 'high' ? 'bg-red-100 text-red-800' : 
                                   selectedApplication.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                                   'bg-green-100 text-green-800'} variant="outline">
                    {selectedApplication.priority}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Timeline</h4>
                <div className="space-y-2">
                  {selectedApplication.timeline.map((event) => (
                    <div key={event.id} className="flex items-start space-x-3 border-l-2 border-muted pl-3">
                      <div className="text-sm">
                        <div className="font-medium">{event.description}</div>
                        <div className="text-muted-foreground">{new Date(event.date).toLocaleDateString()}</div>
                        {event.nextAction && (
                          <div className="mt-1 text-orange-600">
                            Next: {event.nextAction}
                            {event.dueDate && ` (Due: ${new Date(event.dueDate).toLocaleDateString()})`}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedApplication.contacts.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Contacts</h4>
                  <div className="space-y-2">
                    {selectedApplication.contacts.map((contact) => (
                      <div key={contact.id} className="border rounded p-2">
                        <div className="font-medium">{contact.name}</div>
                        <div className="text-sm text-muted-foreground">{contact.role}</div>
                        {contact.email && (
                          <div className="text-sm">
                            <Mail className="h-3 w-3 inline mr-1" />
                            {contact.email}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}