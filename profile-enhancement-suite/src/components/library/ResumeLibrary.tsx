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
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { 
  Copy, 
  Download, 
  Edit, 
  Eye, 
  FileText, 
  History, 
  MoreHorizontal, 
  Plus, 
  Search, 
  Star, 
  Trash2,
  Calendar,
  GitBranch,
  Target,
  TrendingUp,
  Users,
  Award,
  Clock,
  Zap
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Resume {
  id: string;
  name: string;
  description: string;
  industry: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  versions: number;
  atsScore: number;
  status: 'draft' | 'active' | 'archived';
  isFavorite: boolean;
  tags: string[];
  template: string;
  jobTarget?: string;
}

interface Version {
  id: string;
  resumeId: string;
  version: string;
  name: string;
  createdAt: string;
  changes: string[];
  atsScore: number;
  isActive: boolean;
}

const mockResumes: Resume[] = [
  {
    id: '1',
    name: 'Software Engineer Resume',
    description: 'Tailored for full-stack development positions',
    industry: 'Technology',
    role: 'Software Engineer',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    versions: 5,
    atsScore: 92,
    status: 'active',
    isFavorite: true,
    tags: ['React', 'Node.js', 'Full-Stack'],
    template: 'Modern Tech',
    jobTarget: 'Senior Frontend Developer at Google'
  },
  {
    id: '2',
    name: 'Product Manager Resume',
    description: 'Focused on B2B SaaS product management',
    industry: 'SaaS',
    role: 'Product Manager',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18',
    versions: 3,
    atsScore: 88,
    status: 'draft',
    isFavorite: false,
    tags: ['Product Strategy', 'Analytics', 'B2B'],
    template: 'Executive',
    jobTarget: 'Senior PM at Stripe'
  },
  {
    id: '3',
    name: 'Data Science Resume',
    description: 'Optimized for machine learning and AI roles',
    industry: 'AI/ML',
    role: 'Data Scientist',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-12',
    versions: 7,
    atsScore: 95,
    status: 'active',
    isFavorite: true,
    tags: ['Python', 'ML', 'Statistics'],
    template: 'Academic',
    jobTarget: 'ML Engineer at OpenAI'
  }
];

const mockVersions: Version[] = [
  {
    id: 'v1',
    resumeId: '1',
    version: '1.5',
    name: 'Google Application',
    createdAt: '2024-01-20',
    changes: ['Updated skills section', 'Added new project', 'Optimized for ATS'],
    atsScore: 92,
    isActive: true
  },
  {
    id: 'v2',
    resumeId: '1',
    version: '1.4',
    name: 'Meta Application',
    createdAt: '2024-01-18',
    changes: ['Emphasized React experience', 'Added leadership examples'],
    atsScore: 89,
    isActive: false
  },
  {
    id: 'v3',
    resumeId: '1',
    version: '1.3',
    name: 'General Tech',
    createdAt: '2024-01-16',
    changes: ['Initial optimization', 'Added metrics'],
    atsScore: 85,
    isActive: false
  }
];

const templates = [
  { id: 'modern-tech', name: 'Modern Tech', description: 'Clean, technical focus', category: 'Technology' },
  { id: 'executive', name: 'Executive', description: 'Professional, leadership-oriented', category: 'Management' },
  { id: 'creative', name: 'Creative', description: 'Visual, portfolio-friendly', category: 'Design' },
  { id: 'academic', name: 'Academic', description: 'Research and publication focus', category: 'Research' },
  { id: 'startup', name: 'Startup', description: 'Dynamic, growth-focused', category: 'Startup' }
];

export function ResumeLibrary() {
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newResumeName, setNewResumeName] = useState('');
  const [newResumeDescription, setNewResumeDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const filteredResumes = mockResumes.filter(resume => {
    const matchesSearch = resume.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resume.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || resume.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-700 border-green-500/20';
      case 'draft': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'archived': return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Resume Library</h2>
            <p className="text-muted-foreground">Manage your resume versions and templates</p>
          </div>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Resume
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Resume</DialogTitle>
                <DialogDescription>
                  Start with a template or create from scratch
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Resume Name</Label>
                  <Input
                    id="name"
                    value={newResumeName}
                    onChange={(e) => setNewResumeName(e.target.value)}
                    placeholder="e.g., Software Engineer Resume"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newResumeDescription}
                    onChange={(e) => setNewResumeDescription(e.target.value)}
                    placeholder="Brief description of this resume's purpose"
                  />
                </div>
                <div>
                  <Label htmlFor="template">Template</Label>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a template" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          <div className="flex flex-col">
                            <span>{template.name}</span>
                            <span className="text-sm text-muted-foreground">{template.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
                <Button onClick={() => setShowCreateDialog(false)}>Create Resume</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resumes, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((resume) => (
              <Card key={resume.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-primary" />
                      {resume.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setShowVersionHistory(true)}>
                          <History className="h-4 w-4 mr-2" />
                          Version History
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{resume.name}</CardTitle>
                    <CardDescription className="mt-1">{resume.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">ATS Score</span>
                    <span className={`font-semibold ${getScoreColor(resume.atsScore)}`}>
                      {resume.atsScore}%
                    </span>
                  </div>
                  <Progress value={resume.atsScore} className="h-2" />
                  
                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="outline" className={getStatusColor(resume.status)}>
                      {resume.status}
                    </Badge>
                    <span className="text-muted-foreground flex items-center">
                      <GitBranch className="h-3 w-3 mr-1" />
                      {resume.versions} versions
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {resume.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {resume.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{resume.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  {resume.jobTarget && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Target: </span>
                      <span className="font-medium">{resume.jobTarget}</span>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <div className="space-y-2">
            {filteredResumes.map((resume) => (
              <Card key={resume.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-primary" />
                        {resume.isFavorite && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                      </div>
                      <div>
                        <h3 className="font-semibold">{resume.name}</h3>
                        <p className="text-sm text-muted-foreground">{resume.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline" className={getStatusColor(resume.status)}>
                        {resume.status}
                      </Badge>
                      <div className="text-sm">
                        <span className={`font-semibold ${getScoreColor(resume.atsScore)}`}>
                          {resume.atsScore}%
                        </span>
                        <span className="text-muted-foreground ml-1">ATS</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {resume.versions} versions
                      </div>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Award className="h-6 w-6 text-primary" />
                    <Badge variant="outline">{template.category}</Badge>
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-32 bg-muted rounded-md flex items-center justify-center">
                      <span className="text-muted-foreground">Template Preview</span>
                    </div>
                    <Button className="w-full">
                      <Plus className="h-4 w-4 mr-1" />
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Version History Dialog */}
      <Dialog open={showVersionHistory} onOpenChange={setShowVersionHistory}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
            <DialogDescription>
              View and manage different versions of your resume
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {mockVersions.map((version) => (
              <div key={version.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge variant={version.isActive ? "default" : "outline"}>
                      v{version.version}
                    </Badge>
                    <span className="font-medium">{version.name}</span>
                    {version.isActive && (
                      <Badge variant="secondary" className="text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-semibold ${getScoreColor(version.atsScore)}`}>
                      {version.atsScore}%
                    </span>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground mb-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {version.createdAt}
                </div>
                <div className="space-y-1">
                  {version.changes.map((change, index) => (
                    <div key={index} className="text-sm bg-muted/50 rounded px-2 py-1">
                      • {change}
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2 mt-3">
                  <Button size="sm" variant="outline">
                    Restore
                  </Button>
                  <Button size="sm" variant="outline">
                    Compare
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}