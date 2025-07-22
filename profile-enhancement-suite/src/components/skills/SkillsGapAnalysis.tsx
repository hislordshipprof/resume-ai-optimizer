import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  TrendingUp,
  Target,
  BookOpen,
  Award,
  Clock,
  Users,
  Brain,
  Zap,
  Plus,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Search,
  Filter,
  Star,
  ArrowRight,
  Calendar,
  PlayCircle
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Skill {
  id: string;
  name: string;
  category: string;
  currentLevel: number;
  requiredLevel: number;
  priority: 'high' | 'medium' | 'low';
  marketDemand: number;
  learningResources: LearningResource[];
  timeToLearn: string;
  relatedSkills: string[];
}

interface LearningResource {
  id: string;
  title: string;
  type: 'course' | 'certification' | 'book' | 'tutorial' | 'bootcamp';
  provider: string;
  duration: string;
  cost: 'free' | 'paid' | 'premium';
  rating: number;
  url: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  skills: string[];
  duration: string;
  difficulty: string;
  popularity: number;
}

const mockSkills: Skill[] = [
  {
    id: '1',
    name: 'React',
    category: 'Frontend Development',
    currentLevel: 7,
    requiredLevel: 9,
    priority: 'high',
    marketDemand: 95,
    timeToLearn: '2-3 months',
    relatedSkills: ['JavaScript', 'TypeScript', 'Redux'],
    learningResources: [
      {
        id: 'r1',
        title: 'Advanced React Patterns',
        type: 'course',
        provider: 'Frontend Masters',
        duration: '8 hours',
        cost: 'paid',
        rating: 4.8,
        url: '#',
        difficulty: 'advanced'
      },
      {
        id: 'r2',
        title: 'React Official Documentation',
        type: 'tutorial',
        provider: 'React Team',
        duration: 'Self-paced',
        cost: 'free',
        rating: 4.9,
        url: '#',
        difficulty: 'intermediate'
      }
    ]
  },
  {
    id: '2',
    name: 'AWS Cloud Services',
    category: 'Cloud Computing',
    currentLevel: 3,
    requiredLevel: 8,
    priority: 'high',
    marketDemand: 88,
    timeToLearn: '4-6 months',
    relatedSkills: ['DevOps', 'Docker', 'Kubernetes'],
    learningResources: [
      {
        id: 'a1',
        title: 'AWS Solutions Architect',
        type: 'certification',
        provider: 'Amazon',
        duration: '3 months',
        cost: 'paid',
        rating: 4.7,
        url: '#',
        difficulty: 'intermediate'
      }
    ]
  },
  {
    id: '3',
    name: 'Machine Learning',
    category: 'Data Science',
    currentLevel: 2,
    requiredLevel: 7,
    priority: 'medium',
    marketDemand: 92,
    timeToLearn: '6-8 months',
    relatedSkills: ['Python', 'Statistics', 'TensorFlow'],
    learningResources: [
      {
        id: 'm1',
        title: 'Machine Learning Specialization',
        type: 'course',
        provider: 'Coursera',
        duration: '6 months',
        cost: 'paid',
        rating: 4.9,
        url: '#',
        difficulty: 'intermediate'
      }
    ]
  },
  {
    id: '4',
    name: 'TypeScript',
    category: 'Programming Languages',
    currentLevel: 6,
    requiredLevel: 8,
    priority: 'medium',
    marketDemand: 85,
    timeToLearn: '1-2 months',
    relatedSkills: ['JavaScript', 'React', 'Node.js'],
    learningResources: []
  },
  {
    id: '5',
    name: 'System Design',
    category: 'Architecture',
    currentLevel: 4,
    requiredLevel: 9,
    priority: 'high',
    marketDemand: 90,
    timeToLearn: '3-4 months',
    relatedSkills: ['Databases', 'Microservices', 'Load Balancing'],
    learningResources: []
  }
];

const mockLearningPaths: LearningPath[] = [
  {
    id: '1',
    title: 'Full-Stack Engineer Path',
    description: 'Complete path from frontend to backend development',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'System Design'],
    duration: '8-12 months',
    difficulty: 'intermediate',
    popularity: 87
  },
  {
    id: '2',
    title: 'Cloud Solutions Architect',
    description: 'Master cloud architecture and DevOps practices',
    skills: ['AWS Cloud Services', 'Docker', 'Kubernetes', 'System Design'],
    duration: '6-9 months',
    difficulty: 'advanced',
    popularity: 82
  },
  {
    id: '3',
    title: 'AI/ML Engineer Track',
    description: 'From basics to advanced machine learning applications',
    skills: ['Python', 'Machine Learning', 'Deep Learning', 'MLOps'],
    duration: '10-14 months',
    difficulty: 'advanced',
    popularity: 79
  }
];

export function SkillsGapAnalysis() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const categories = [...new Set(mockSkills.map(skill => skill.category))];
  
  const filteredSkills = mockSkills.filter(skill => {
    const matchesCategory = selectedCategory === 'all' || skill.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || skill.priority === selectedPriority;
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesPriority && matchesSearch;
  });

  const getGapSize = (skill: Skill) => skill.requiredLevel - skill.currentLevel;
  const getGapSeverity = (gap: number) => {
    if (gap >= 5) return { color: 'text-red-600', bg: 'bg-red-50', label: 'Critical' };
    if (gap >= 3) return { color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Moderate' };
    return { color: 'text-green-600', bg: 'bg-green-50', label: 'Minor' };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCostColor = (cost: string) => {
    switch (cost) {
      case 'free': return 'text-green-600';
      case 'paid': return 'text-blue-600';
      case 'premium': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Skills Gap Analysis</h2>
          <p className="text-muted-foreground">
            Identify and bridge skill gaps for your target roles
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Skill
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSkills.length}</div>
            <div className="text-xs text-muted-foreground">Across {categories.length} categories</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical Gaps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {mockSkills.filter(s => getGapSize(s) >= 5).length}
            </div>
            <div className="text-xs text-muted-foreground">Require immediate attention</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Learning Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12-18</div>
            <div className="text-xs text-muted-foreground">Months estimated</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Market Demand</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">89%</div>
            <div className="text-xs text-muted-foreground">Average across skills</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="gaps" className="space-y-4">
        <TabsList>
          <TabsTrigger value="gaps">Skill Gaps</TabsTrigger>
          <TabsTrigger value="paths">Learning Paths</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="gaps" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredSkills.map((skill) => {
              const gap = getGapSize(skill);
              const gapSeverity = getGapSeverity(gap);
              
              return (
                <Card 
                  key={skill.id} 
                  className={`cursor-pointer transition-all ${
                    selectedSkill?.id === skill.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedSkill(skill)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Brain className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">{skill.name}</CardTitle>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(skill.priority)} variant="outline">
                          {skill.priority}
                        </Badge>
                        <Badge className={`${gapSeverity.color} ${gapSeverity.bg}`} variant="outline">
                          {gapSeverity.label}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>{skill.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Current Level</span>
                        <span className="font-semibold">{skill.currentLevel}/10</span>
                      </div>
                      <Progress value={skill.currentLevel * 10} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Required Level</span>
                        <span className="font-semibold">{skill.requiredLevel}/10</span>
                      </div>
                      <Progress value={skill.requiredLevel * 10} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Gap to close:</span>
                      <span className={`font-semibold ${gapSeverity.color}`}>
                        {gap} levels
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Market Demand:</span>
                      <span className="font-semibold text-green-600">{skill.marketDemand}%</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Time to learn:</span>
                      <span className="font-semibold">{skill.timeToLearn}</span>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" className="flex-1">
                        <BookOpen className="h-4 w-4 mr-1" />
                        Learn Now
                      </Button>
                      <Button size="sm" variant="outline">
                        <Target className="h-4 w-4 mr-1" />
                        Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Detailed Skill View */}
          {selectedSkill && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>{selectedSkill.name} - Learning Resources</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Skill Overview</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <span className="font-medium">{selectedSkill.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Priority:</span>
                        <Badge className={getPriorityColor(selectedSkill.priority)} variant="outline">
                          {selectedSkill.priority}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Market Demand:</span>
                        <span className="font-medium text-green-600">{selectedSkill.marketDemand}%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Related Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {selectedSkill.relatedSkills.map((relatedSkill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {relatedSkill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Recommended Learning Resources
                  </h4>
                  {selectedSkill.learningResources.length > 0 ? (
                    <div className="space-y-3">
                      {selectedSkill.learningResources.map((resource) => (
                        <div key={resource.id} className="border rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h5 className="font-medium">{resource.title}</h5>
                              <p className="text-sm text-muted-foreground">{resource.provider}</p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className={getCostColor(resource.cost)}>
                                {resource.cost}
                              </Badge>
                              <div className="flex items-center text-sm">
                                <Star className="h-3 w-3 text-yellow-500 mr-1" />
                                {resource.rating}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                              {resource.duration} • {resource.difficulty}
                            </div>
                            <Button size="sm" variant="outline">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        No specific resources found. Our AI will recommend personalized learning materials.
                        <Button variant="link" className="p-0 ml-1 h-auto">
                          Get AI Recommendations →
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="paths" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockLearningPaths.map((path) => (
              <Card key={path.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Award className="h-6 w-6 text-primary" />
                    <Badge variant="outline">{path.difficulty}</Badge>
                  </div>
                  <CardTitle className="text-lg">{path.title}</CardTitle>
                  <CardDescription>{path.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">{path.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Popularity:</span>
                    <span className="font-medium text-green-600">{path.popularity}%</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Skills Covered:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {path.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {path.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{path.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button className="w-full">
                    <PlayCircle className="h-4 w-4 mr-1" />
                    Start Learning Path
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                  Priority Skills This Month
                </CardTitle>
                <CardDescription>
                  Focus on these high-impact skills for maximum career growth
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockSkills
                  .filter(s => s.priority === 'high')
                  .slice(0, 3)
                  .map((skill, index) => (
                    <div key={skill.id} className="flex items-center justify-between border rounded-lg p-3">
                      <div>
                        <span className="font-medium">{skill.name}</span>
                        <p className="text-sm text-muted-foreground">{skill.category}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-green-600">
                          {skill.marketDemand}% demand
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {skill.timeToLearn}
                        </div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                  Trending Skills
                </CardTitle>
                <CardDescription>
                  Skills gaining popularity in your industry
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'AI/ML Integration', growth: '+45%', demand: 94 },
                  { name: 'Cloud Security', growth: '+38%', demand: 89 },
                  { name: 'GraphQL', growth: '+28%', demand: 76 }
                ].map((skill, index) => (
                  <div key={index} className="flex items-center justify-between border rounded-lg p-3">
                    <div>
                      <span className="font-medium">{skill.name}</span>
                      <p className="text-sm text-green-600">{skill.growth} growth</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {skill.demand}% demand
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Alert>
            <Brain className="h-4 w-4" />
            <AlertDescription>
              Our AI recommends focusing on <strong>AWS Cloud Services</strong> first, as it has the highest impact on your target roles and can be learned in 4-6 months.
              <Button variant="link" className="p-0 ml-1 h-auto">
                View detailed plan →
              </Button>
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  );
}