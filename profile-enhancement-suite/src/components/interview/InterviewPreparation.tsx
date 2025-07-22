import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  MessageCircle,
  Play,
  Clock,
  Target,
  Trophy,
  BookOpen,
  Mic,
  Video,
  CheckCircle2,
  AlertCircle,
  Star,
  Users,
  Brain,
  Lightbulb,
  ArrowRight,
  RefreshCcw,
  Download,
  Calendar
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Question {
  id: string;
  text: string;
  category: 'behavioral' | 'technical' | 'situational' | 'company-specific';
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  commonIn: string[];
  tips: string[];
  sampleAnswer?: string;
  followUpQuestions?: string[];
}

interface MockInterview {
  id: string;
  title: string;
  company: string;
  role: string;
  duration: number;
  questionCount: number;
  difficulty: string;
  categories: string[];
  description: string;
}

interface PrepSession {
  id: string;
  type: 'practice' | 'mock' | 'ai-feedback';
  date: string;
  duration: number;
  score: number;
  questionsAnswered: number;
  strengths: string[];
  improvements: string[];
}

const mockQuestions: Question[] = [
  {
    id: '1',
    text: 'Tell me about a time when you had to work with a difficult team member.',
    category: 'behavioral',
    difficulty: 'medium',
    timeLimit: 3,
    commonIn: ['Google', 'Microsoft', 'Amazon'],
    tips: [
      'Use the STAR method (Situation, Task, Action, Result)',
      'Focus on your actions and the positive outcome',
      'Show emotional intelligence and conflict resolution skills'
    ],
    sampleAnswer: 'In my previous role, I worked with a colleague who was resistant to our new development process...',
    followUpQuestions: [
      'How did you handle the communication challenges?',
      'What would you do differently if faced with a similar situation?'
    ]
  },
  {
    id: '2',
    text: 'Explain how you would design a URL shortening service like bit.ly.',
    category: 'technical',
    difficulty: 'hard',
    timeLimit: 15,
    commonIn: ['Meta', 'Google', 'Uber'],
    tips: [
      'Start with requirements gathering',
      'Discuss scalability considerations',
      'Consider database design and caching strategies'
    ]
  },
  {
    id: '3',
    text: 'How do you prioritize features when you have competing deadlines?',
    category: 'situational',
    difficulty: 'medium',
    timeLimit: 4,
    commonIn: ['Product Manager roles', 'Startup environments'],
    tips: [
      'Mention frameworks like MoSCoW or RICE',
      'Discuss stakeholder communication',
      'Show data-driven decision making'
    ]
  }
];

const mockInterviews: MockInterview[] = [
  {
    id: '1',
    title: 'FAANG Technical Interview',
    company: 'Google',
    role: 'Senior Software Engineer',
    duration: 45,
    questionCount: 8,
    difficulty: 'Hard',
    categories: ['Technical', 'System Design', 'Behavioral'],
    description: 'Comprehensive technical interview simulation for senior engineering roles'
  },
  {
    id: '2',
    title: 'Product Manager Interview',
    company: 'Meta',
    role: 'Product Manager',
    duration: 60,
    questionCount: 12,
    difficulty: 'Medium',
    categories: ['Product Sense', 'Analytical', 'Leadership'],
    description: 'Product strategy and analytical thinking assessment'
  },
  {
    id: '3',
    title: 'Startup Technical Interview',
    company: 'Startup',
    role: 'Full-Stack Developer',
    duration: 30,
    questionCount: 6,
    difficulty: 'Medium',
    categories: ['Technical', 'Cultural Fit', 'Problem Solving'],
    description: 'Fast-paced technical assessment for startup environments'
  }
];

const mockSessions: PrepSession[] = [
  {
    id: '1',
    type: 'mock',
    date: '2024-01-20',
    duration: 45,
    score: 85,
    questionsAnswered: 8,
    strengths: ['Technical knowledge', 'Clear communication', 'Problem-solving approach'],
    improvements: ['Time management', 'Follow-up questions', 'Storytelling in behavioral questions']
  },
  {
    id: '2',
    type: 'practice',
    date: '2024-01-18',
    duration: 30,
    score: 78,
    questionsAnswered: 6,
    strengths: ['System design thinking', 'Code quality'],
    improvements: ['Scalability considerations', 'Edge case handling']
  }
];

export function InterviewPreparation() {
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [currentCategory, setCurrentCategory] = useState('all');
  const [currentDifficulty, setCurrentDifficulty] = useState('all');
  const [isRecording, setIsRecording] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const categories = ['all', 'behavioral', 'technical', 'situational', 'company-specific'];
  const difficulties = ['all', 'easy', 'medium', 'hard'];

  const filteredQuestions = mockQuestions.filter(q => {
    const matchesCategory = currentCategory === 'all' || q.category === currentCategory;
    const matchesDifficulty = currentDifficulty === 'all' || q.difficulty === currentDifficulty;
    return matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'behavioral': return 'bg-blue-100 text-blue-800';
      case 'technical': return 'bg-purple-100 text-purple-800';
      case 'situational': return 'bg-orange-100 text-orange-800';
      case 'company-specific': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Interview Preparation</h2>
          <p className="text-muted-foreground">
            Practice and master your interview skills with AI-powered feedback
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Mock Interview
          </Button>
          <Button>
            <Play className="h-4 w-4 mr-2" />
            Start Practice Session
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Practice Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <div className="text-xs text-muted-foreground">This month</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">82%</div>
            <div className="text-xs text-muted-foreground">+5% from last month</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Questions Practiced</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <div className="text-xs text-muted-foreground">Across all categories</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">76%</div>
            <div className="text-xs text-muted-foreground">Mock interviews passed</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="practice" className="space-y-4">
        <TabsList>
          <TabsTrigger value="practice">Question Practice</TabsTrigger>
          <TabsTrigger value="mock">Mock Interviews</TabsTrigger>
          <TabsTrigger value="feedback">AI Feedback</TabsTrigger>
          <TabsTrigger value="progress">Progress Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="practice" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <Select value={currentCategory} onValueChange={setCurrentCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={currentDifficulty} onValueChange={setCurrentDifficulty}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map(difficulty => (
                  <SelectItem key={difficulty} value={difficulty}>
                    {difficulty === 'all' ? 'All Levels' : difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Questions List */}
            <div className="space-y-4">
              <h3 className="font-semibold">Interview Questions</h3>
              {filteredQuestions.map((question) => (
                <Card 
                  key={question.id} 
                  className={`cursor-pointer transition-all ${
                    selectedQuestion?.id === question.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
                  }`}
                  onClick={() => setSelectedQuestion(question)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="h-4 w-4 text-primary" />
                        <Badge className={getCategoryColor(question.category)} variant="outline">
                          {question.category}
                        </Badge>
                        <Badge className={getDifficultyColor(question.difficulty)} variant="outline">
                          {question.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        {question.timeLimit}min
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-3">{question.text}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        Common in: {question.commonIn.join(', ')}
                      </div>
                      <Button size="sm" variant="outline">
                        Practice
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Question Practice Area */}
            <div className="space-y-4">
              {selectedQuestion ? (
                <>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Practice Question</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowTips(!showTips)}
                          >
                            <Lightbulb className="h-4 w-4 mr-1" />
                            Tips
                          </Button>
                          <Button
                            variant={isRecording ? "destructive" : "outline"}
                            size="sm"
                            onClick={() => setIsRecording(!isRecording)}
                          >
                            {isRecording ? (
                              <>
                                <RefreshCcw className="h-4 w-4 mr-1 animate-spin" />
                                Recording...
                              </>
                            ) : (
                              <>
                                <Mic className="h-4 w-4 mr-1" />
                                Record Answer
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="font-medium mb-2">{selectedQuestion.text}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Category: {selectedQuestion.category}</span>
                          <span>Difficulty: {selectedQuestion.difficulty}</span>
                          <span>Time limit: {selectedQuestion.timeLimit} minutes</span>
                        </div>
                      </div>

                      {showTips && (
                        <Alert>
                          <Lightbulb className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Tips for this question:</strong>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                              {selectedQuestion.tips.map((tip, index) => (
                                <li key={index} className="text-sm">{tip}</li>
                              ))}
                            </ul>
                          </AlertDescription>
                        </Alert>
                      )}

                      <div>
                        <label className="text-sm font-medium mb-2 block">Your Answer</label>
                        <Textarea
                          placeholder="Type your answer here or use voice recording..."
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          className="min-h-32"
                        />
                      </div>

                      <div className="flex space-x-2">
                        <Button className="flex-1">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Get AI Feedback
                        </Button>
                        <Button variant="outline">
                          <ArrowRight className="h-4 w-4 mr-1" />
                          Next Question
                        </Button>
                      </div>

                      {selectedQuestion.sampleAnswer && (
                        <details className="border rounded-lg p-3">
                          <summary className="cursor-pointer font-medium">
                            View Sample Answer
                          </summary>
                          <div className="mt-2 text-sm text-muted-foreground">
                            {selectedQuestion.sampleAnswer}
                          </div>
                        </details>
                      )}
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="h-96 flex items-center justify-center">
                  <div className="text-center">
                    <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Select a question to start practicing</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="mock" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockInterviews.map((interview) => (
              <Card key={interview.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Video className="h-6 w-6 text-primary" />
                    <Badge className={getDifficultyColor(interview.difficulty.toLowerCase())} variant="outline">
                      {interview.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{interview.title}</CardTitle>
                  <CardDescription>{interview.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Company:</span>
                      <span className="font-medium">{interview.company}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Role:</span>
                      <span className="font-medium">{interview.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{interview.duration} minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Questions:</span>
                      <span className="font-medium">{interview.questionCount}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-medium">Categories:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {interview.categories.map((category, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-1" />
                    Start Mock Interview
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                AI-Powered Interview Analysis
              </CardTitle>
              <CardDescription>
                Get personalized feedback on your interview performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Latest Feedback</h4>
                  <div className="space-y-3">
                    {['Communication clarity', 'Technical accuracy', 'Problem-solving approach', 'Confidence level'].map((metric, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{metric}</span>
                          <span className="font-medium">{85 - index * 3}%</span>
                        </div>
                        <Progress value={85 - index * 3} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-3">Improvement Areas</h4>
                  <div className="space-y-2">
                    {[
                      'Practice more system design questions',
                      'Improve storytelling in behavioral answers',
                      'Work on time management during coding problems',
                      'Add more specific examples from experience'
                    ].map((improvement, index) => (
                      <div key={index} className="flex items-start space-x-2 p-2 bg-muted/50 rounded">
                        <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
                        <span className="text-sm">{improvement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-3">Personalized Recommendations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-3">
                    <h5 className="font-medium mb-2">Focus Areas</h5>
                    <ul className="text-sm space-y-1">
                      <li>• System design fundamentals</li>
                      <li>• STAR method for behavioral questions</li>
                      <li>• Code optimization techniques</li>
                    </ul>
                  </div>
                  <div className="border rounded-lg p-3">
                    <h5 className="font-medium mb-2">Strengths to Leverage</h5>
                    <ul className="text-sm space-y-1">
                      <li>• Strong technical knowledge</li>
                      <li>• Clear communication style</li>
                      <li>• Good problem decomposition</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="h-5 w-5 mr-2" />
                  Practice History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSessions.map((session) => (
                    <div key={session.id} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className={`p-1 rounded ${
                            session.type === 'mock' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                          }`}>
                            {session.type === 'mock' ? <Video className="h-3 w-3" /> : <BookOpen className="h-3 w-3" />}
                          </div>
                          <span className="font-medium capitalize">{session.type} Session</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{session.score}%</span>
                          <Badge variant="outline">{session.questionsAnswered} questions</Badge>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground mb-2">
                        {new Date(session.date).toLocaleDateString()} • {session.duration} minutes
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs font-medium text-green-600">Strengths:</div>
                        <div className="text-xs">{session.strengths.join(', ')}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Performance Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-muted-foreground">Performance chart would appear here</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">+12%</div>
                    <div className="text-sm text-muted-foreground">Score Improvement</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">4.2</div>
                    <div className="text-sm text-muted-foreground">Avg Rating</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}