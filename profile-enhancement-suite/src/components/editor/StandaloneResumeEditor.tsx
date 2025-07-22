import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bot,
  Lightbulb,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
  Target,
  Trophy,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AISuggestion {
  id: string;
  type: 'improvement' | 'keyword' | 'metric';
  text: string;
  reason: string;
}

interface SectionContent {
  text: string;
  suggestions: AISuggestion[];
}

export function StandaloneResumeEditor() {
  const [activeSection, setActiveSection] = useState("summary");
  const [isGenerating, setIsGenerating] = useState(false);
  const [sections, setSections] = useState<Record<string, SectionContent>>({
    summary: { text: "", suggestions: [] },
    experience: { text: "", suggestions: [] },
    skills: { text: "", suggestions: [] },
    projects: { text: "", suggestions: [] }
  });

  const generateSuggestions = useCallback(async (section: string, content: string) => {
    if (!content.trim()) return;

    setIsGenerating(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockSuggestions: AISuggestion[] = [
      {
        id: '1',
        type: 'improvement',
        text: content.replace(/\b(managed|worked|did|made)\b/gi, (match) => {
          const replacements = { managed: 'led', worked: 'collaborated', did: 'executed', made: 'developed' };
          return replacements[match.toLowerCase() as keyof typeof replacements] || match;
        }),
        reason: "Use stronger action verbs"
      },
      {
        id: '2',
        type: 'metric',
        text: content + " resulting in 25% improved efficiency",
        reason: "Add quantifiable results"
      },
      {
        id: '3',
        type: 'keyword',
        text: content.replace(/\bsoftware\b/gi, 'enterprise software solutions'),
        reason: "Include industry keywords"
      }
    ];

    setSections(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        suggestions: mockSuggestions
      }
    }));
    
    setIsGenerating(false);
  }, []);

  const handleContentChange = (section: string, content: string) => {
    setSections(prev => ({
      ...prev,
      [section]: { ...prev[section], text: content }
    }));

    // Generate suggestions after user stops typing
    const timeoutId = setTimeout(() => {
      generateSuggestions(section, content);
    }, 1000);

    return () => clearTimeout(timeoutId);
  };

  const applySuggestion = (section: string, suggestion: AISuggestion) => {
    setSections(prev => ({
      ...prev,
      [section]: { ...prev[section], text: suggestion.text }
    }));
  };

  const sectionConfig = {
    summary: {
      title: "Professional Summary",
      icon: Trophy,
      placeholder: "Write a compelling professional summary highlighting your key achievements and expertise..."
    },
    experience: {
      title: "Work Experience",
      icon: Zap,
      placeholder: "Describe your work experience with bullet points highlighting your achievements and responsibilities..."
    },
    skills: {
      title: "Skills",
      icon: Target,
      placeholder: "List your technical and professional skills, organized by category or relevance..."
    },
    projects: {
      title: "Projects",
      icon: Sparkles,
      placeholder: "Describe your key projects with details about technologies used and outcomes achieved..."
    }
  };

  return (
    <div className="h-full flex gap-6">
      {/* Main Editor */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center gap-3">
          <Bot className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">AI Resume Editor</h1>
            <p className="text-muted-foreground">
              Write and improve your resume with AI-powered suggestions
            </p>
          </div>
        </div>

        <Tabs value={activeSection} onValueChange={setActiveSection}>
          <TabsList className="grid w-full grid-cols-4">
            {Object.entries(sectionConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{config.title}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.entries(sectionConfig).map(([sectionKey, config]) => (
            <TabsContent key={sectionKey} value={sectionKey} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <config.icon className="h-5 w-5" />
                    {config.title}
                  </CardTitle>
                  <CardDescription>
                    Write your content below and get AI-powered suggestions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder={config.placeholder}
                    value={sections[sectionKey].text}
                    onChange={(e) => handleContentChange(sectionKey, e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                  
                  {sections[sectionKey].text && (
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Bot className="h-4 w-4" />
                        {isGenerating ? "Generating suggestions..." : "AI suggestions ready"}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generateSuggestions(sectionKey, sections[sectionKey].text)}
                        disabled={isGenerating}
                      >
                        <RefreshCw className={cn("h-4 w-4 mr-2", isGenerating && "animate-spin")} />
                        Refresh Suggestions
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* AI Suggestions Sidebar */}
      <Card className="w-80 h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-primary" />
            AI Suggestions
          </CardTitle>
          <CardDescription>
            Improve your {sectionConfig[activeSection as keyof typeof sectionConfig].title.toLowerCase()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {sections[activeSection].suggestions.length > 0 ? (
              <div className="space-y-3">
                {sections[activeSection].suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="space-y-2 p-3 rounded-lg border bg-card">
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={suggestion.type === 'improvement' ? 'default' : 
                               suggestion.type === 'metric' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {suggestion.type}
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => applySuggestion(activeSection, suggestion)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm">{suggestion.text}</p>
                    <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Start writing to get AI suggestions</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}