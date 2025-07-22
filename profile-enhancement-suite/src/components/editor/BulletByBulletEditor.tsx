import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useResumeFlow } from "@/contexts/ResumeFlowContext";
import { 
  Edit3, 
  Brain, 
  Target, 
  Zap, 
  CheckCircle, 
  X, 
  BarChart3, 
  Sparkles,
  Eye,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  ChevronRight,
  Lightbulb,
  TrendingUp,
  Award,
  Loader,
  Download,
  ArrowRight,
  Edit
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BulletSuggestion {
  id: string;
  text: string;
  keywords: string[];
  score: number;
  reason: string;
}

interface BulletPoint {
  original: string;
  suggestions: BulletSuggestion[];
  selected?: string;
  customEdit?: string;
}

interface SectionData {
  title: string;
  bullets: BulletPoint[];
}

interface RealTimeEditorProps {
  className?: string;
}

export function RealTimeEditor({ className }: RealTimeEditorProps) {
  const resumeFlowState = useResumeFlow();
  
  // Handle case when component is used outside ResumeFlowProvider
  if (!resumeFlowState) {
    return (
      <div className="text-center py-12 space-y-4">
        <Brain className="h-12 w-12 text-muted-foreground mx-auto" />
        <div>
          <h3 className="text-lg font-semibold">Resume Editor</h3>
          <p className="text-muted-foreground">
            Please start from the Upload page to use the AI Resume Editor
          </p>
        </div>
        <Button onClick={() => window.location.href = '/upload'}>
          Go to Upload
        </Button>
      </div>
    );
  }
  
  const { state, setOptimizedContent, setCurrentStep, markStepCompleted } = resumeFlowState;
  const { resumeData, jobAnalysis } = state;
  
  const [activeSection, setActiveSection] = useState("summary");
  const [isGenerating, setIsGenerating] = useState(false);
  const [sectionsData, setSectionsData] = useState<Record<string, SectionData>>({});
  const [editingBullet, setEditingBullet] = useState<{section: string, index: number} | null>(null);
  const [editText, setEditText] = useState("");
  
  // Generate AI suggestions for a bullet point
  const generateSuggestions = useCallback((original: string): BulletSuggestion[] => {
    return [
      {
        id: '1',
        text: original.replace(/\b(developed|built|created|made)\b/gi, 'architected and delivered'),
        keywords: ['architected', 'delivered'],
        score: 92,
        reason: "Uses stronger action verbs that show technical leadership"
      },
      {
        id: '2', 
        text: original + " resulting in 40% improved performance and serving 50K+ users",
        keywords: ['performance', 'users', 'scalability'],
        score: 88,
        reason: "Adds quantifiable metrics showing business impact"
      },
      {
        id: '3',
        text: original.replace(/\bweb applications?\b/gi, 'enterprise-grade web applications using React, TypeScript, and microservices'),
        keywords: ['enterprise', 'React', 'TypeScript', 'microservices'],
        score: 95,
        reason: "Includes job-relevant technologies and keywords"
      },
      {
        id: '4',
        text: original.replace(/\bteam\b/gi, 'cross-functional agile team of 8+ engineers'),
        keywords: ['cross-functional', 'agile', 'engineers'],
        score: 85,
        reason: "Demonstrates collaboration and scale of responsibility"
      }
    ].sort((a, b) => b.score - a.score);
  }, []);

  // Initialize sections data when component loads
  useEffect(() => {
    if (!resumeData || Object.keys(sectionsData).length > 0) return;
    
    setIsGenerating(true);
    
    // Simulate processing time
    setTimeout(() => {
      const newSectionsData: Record<string, SectionData> = {};
      
      // Summary section
      if (resumeData.summary) {
        newSectionsData.summary = {
          title: "Professional Summary",
          bullets: [{
            original: resumeData.summary,
            suggestions: generateSuggestions(resumeData.summary)
          }]
        };
      }
      
      // Experience section
      if (resumeData.experience && resumeData.experience.length > 0) {
        const experienceBullets: BulletPoint[] = [];
        resumeData.experience.forEach(exp => {
          if (exp.description) {
            // Split description into bullet points
            const bullets = exp.description.split('\n').filter(bullet => bullet.trim());
            bullets.forEach(bullet => {
              experienceBullets.push({
                original: bullet.replace(/^[•\-\*]\s*/, ''), // Remove bullet markers
                suggestions: generateSuggestions(bullet)
              });
            });
          }
        });
        newSectionsData.experience = {
          title: "Work Experience",
          bullets: experienceBullets
        };
      }
      
      // Skills section
      if (resumeData.skills && resumeData.skills.length > 0) {
        const skillsText = resumeData.skills.join(', ');
        newSectionsData.skills = {
          title: "Skills",
          bullets: [{
            original: skillsText,
            suggestions: generateSuggestions(skillsText)
          }]
        };
      }
      
      // Projects section
      if (resumeData.projects && resumeData.projects.length > 0) {
        const projectBullets: BulletPoint[] = [];
        resumeData.projects.forEach(project => {
          if (project.description) {
            projectBullets.push({
              original: project.description,
              suggestions: generateSuggestions(project.description)
            });
          }
        });
        newSectionsData.projects = {
          title: "Projects",
          bullets: projectBullets
        };
      }
      
      setSectionsData(newSectionsData);
      setIsGenerating(false);
    }, 2000);
  }, [resumeData, generateSuggestions]);

  const handleBulletSelection = (section: string, bulletIndex: number, suggestionId: string) => {
    setSectionsData(prev => {
      const newData = { ...prev };
      const suggestion = newData[section].bullets[bulletIndex].suggestions.find(s => s.id === suggestionId);
      if (suggestion) {
        newData[section].bullets[bulletIndex].selected = suggestion.id;
      }
      return newData;
    });
  };

  const handleEditBullet = (section: string, bulletIndex: number) => {
    const bullet = sectionsData[section]?.bullets[bulletIndex];
    if (bullet) {
      setEditingBullet({ section, index: bulletIndex });
      setEditText(bullet.selected || bullet.original);
    }
  };

  const saveEditedBullet = () => {
    if (editingBullet) {
      setSectionsData(prev => {
        const newData = { ...prev };
        newData[editingBullet.section].bullets[editingBullet.index].customEdit = editText;
        return newData;
      });
      setEditingBullet(null);
      setEditText("");
    }
  };

  const handleProceedToPreview = () => {
    // Compile all optimized content
    const optimizedContent: any = {};
    
    Object.entries(sectionsData).forEach(([section, data]) => {
      optimizedContent[section] = data.bullets.map(bullet => {
        if (bullet.customEdit) return bullet.customEdit;
        if (bullet.selected) {
          const suggestion = bullet.suggestions.find(s => s.id === bullet.selected);
          return suggestion ? suggestion.text : bullet.original;
        }
        return bullet.original;
      });
    });
    
    setOptimizedContent(optimizedContent);
    markStepCompleted(4);
    setCurrentStep(5);
  };

  const getCompletionProgress = () => {
    const totalBullets = Object.values(sectionsData).reduce((sum, section) => sum + section.bullets.length, 0);
    const completedBullets = Object.values(sectionsData).reduce((sum, section) => 
      sum + section.bullets.filter(bullet => bullet.selected || bullet.customEdit).length, 0
    );
    return totalBullets > 0 ? (completedBullets / totalBullets) * 100 : 0;
  };

  if (isGenerating) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <Loader className="h-8 w-8 animate-spin mx-auto text-primary" />
          <h3 className="text-lg font-semibold">AI is analyzing your resume...</h3>
          <p className="text-muted-foreground">Generating optimized suggestions for each section</p>
        </div>
      </div>
    );
  }

  const currentSectionData = sectionsData[activeSection];

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            AI Resume Optimization
          </h2>
          <p className="text-muted-foreground">
            Select the best AI-optimized version for each bullet point
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground mb-1">
            Progress: {Math.round(getCompletionProgress())}%
          </div>
          <Progress value={getCompletionProgress()} className="w-40" />
        </div>
      </div>

      {/* Section Tabs */}
      <Tabs value={activeSection} onValueChange={setActiveSection}>
        <TabsList className="grid w-full grid-cols-4">
          {Object.entries(sectionsData).map(([key, section]) => (
            <TabsTrigger key={key} value={key} className="relative">
              {section.title}
              <Badge 
                variant="outline" 
                className="ml-2 h-5 w-5 p-0 text-xs"
              >
                {section.bullets.filter(b => b.selected || b.customEdit).length}/{section.bullets.length}
              </Badge>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Section Content */}
        {Object.entries(sectionsData).map(([sectionKey, sectionData]) => (
          <TabsContent key={sectionKey} value={sectionKey} className="space-y-6">
            {sectionData.bullets.map((bullet, bulletIndex) => (
              <Card key={bulletIndex} className="border-l-4 border-l-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      Bullet Point {bulletIndex + 1}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {(bullet.selected || bullet.customEdit) && (
                        <Badge variant="default" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Optimized
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditBullet(sectionKey, bulletIndex)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Original Text */}
                  <div className="p-3 bg-muted/30 rounded-lg border-l-2 border-l-gray-400">
                    <div className="text-sm text-muted-foreground mb-1">Original:</div>
                    <p className="text-sm">{bullet.original}</p>
                  </div>

                  {/* Custom Edit */}
                  {bullet.customEdit && (
                    <div className="p-3 bg-green-50 rounded-lg border-l-2 border-l-green-500">
                      <div className="text-sm text-green-700 mb-1">Your Custom Version:</div>
                      <p className="text-sm">{bullet.customEdit}</p>
                    </div>
                  )}

                  {/* AI Suggestions */}
                  <div className="space-y-3">
                    <h4 className="font-medium flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      AI Suggestions
                    </h4>
                    <RadioGroup 
                      value={bullet.selected || ""} 
                      onValueChange={(value) => handleBulletSelection(sectionKey, bulletIndex, value)}
                    >
                      {bullet.suggestions.map((suggestion) => (
                        <div key={suggestion.id} className="space-y-2">
                          <div className="flex items-start space-x-2">
                            <RadioGroupItem value={suggestion.id} id={suggestion.id} className="mt-1" />
                            <Label htmlFor={suggestion.id} className="flex-1 cursor-pointer">
                              <div className="p-3 rounded-lg border hover:bg-accent transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                  <Badge variant="outline" className="text-xs">
                                    Score: {suggestion.score}%
                                  </Badge>
                                  <div className="flex gap-1">
                                    {suggestion.keywords.slice(0, 3).map((keyword, i) => (
                                      <Badge key={i} variant="secondary" className="text-xs">
                                        {keyword}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <p className="text-sm mb-2">{suggestion.text}</p>
                                <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
                              </div>
                            </Label>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>

      {/* Edit Dialog */}
      {editingBullet && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle>Edit Bullet Point</CardTitle>
              <CardDescription>
                Customize the selected suggestion to match your experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Edit your bullet point..."
                className="min-h-[100px]"
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingBullet(null)}>
                  Cancel
                </Button>
                <Button onClick={saveEditedBullet}>
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end pt-6 border-t">
        <Button 
          onClick={handleProceedToPreview}
          disabled={getCompletionProgress() === 0}
          className="flex items-center gap-2"
        >
          Proceed to Preview
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}