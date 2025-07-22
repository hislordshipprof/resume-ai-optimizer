import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Lightbulb, 
  CheckCircle, 
  X, 
  Target, 
  TrendingUp, 
  Sparkles,
  Clock,
  AlertTriangle
} from "lucide-react";

interface Suggestion {
  id: string;
  type: 'content' | 'structure' | 'keyword' | 'achievement';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  originalText: string;
  suggestedText: string;
  impact: number;
  reasoning: string;
}

const mockSuggestions: Suggestion[] = [
  {
    id: '1',
    type: 'achievement',
    priority: 'high',
    title: 'Quantify Your Impact',
    description: 'Add specific metrics to demonstrate the scope of your work',
    originalText: 'Managed a team of developers',
    suggestedText: 'Led a cross-functional team of 8 developers, delivering 15+ features that increased user engagement by 32%',
    impact: 85,
    reasoning: 'Quantified achievements are 3x more likely to catch recruiter attention'
  },
  {
    id: '2',
    type: 'keyword',
    priority: 'high',
    title: 'Add Missing Keywords',
    description: 'Include key technologies mentioned in the job description',
    originalText: 'Built web applications',
    suggestedText: 'Built responsive web applications using React, TypeScript, and Node.js',
    impact: 78,
    reasoning: 'These keywords appear in 90% of similar job postings'
  },
  {
    id: '3',
    type: 'content',
    priority: 'medium',
    title: 'Strengthen Action Verbs',
    description: 'Replace passive language with strong action verbs',
    originalText: 'Was responsible for developing features',
    suggestedText: 'Architected and implemented scalable features',
    impact: 65,
    reasoning: 'Strong action verbs increase perceived leadership and initiative'
  },
  {
    id: '4',
    type: 'structure',
    priority: 'low',
    title: 'Improve Formatting',
    description: 'Optimize spacing and bullet point consistency',
    originalText: 'Current formatting',
    suggestedText: 'ATS-optimized formatting',
    impact: 45,
    reasoning: 'Consistent formatting improves ATS parsing by 23%'
  }
];

export const SuggestionPanel = () => {
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<string>>(new Set());

  const applySuggestion = (id: string) => {
    setAppliedSuggestions(prev => new Set([...prev, id]));
  };

  const dismissSuggestion = (id: string) => {
    setDismissedSuggestions(prev => new Set([...prev, id]));
  };

  const getPriorityColor = (priority: Suggestion['priority']) => {
    switch (priority) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
    }
  };

  const getTypeIcon = (type: Suggestion['type']) => {
    switch (type) {
      case 'achievement': return <TrendingUp className="w-4 h-4" />;
      case 'keyword': return <Target className="w-4 h-4" />;
      case 'content': return <Lightbulb className="w-4 h-4" />;
      case 'structure': return <Sparkles className="w-4 h-4" />;
    }
  };

  const activeSuggestions = mockSuggestions.filter(
    s => !appliedSuggestions.has(s.id) && !dismissedSuggestions.has(s.id)
  );

  const groupedSuggestions = {
    high: activeSuggestions.filter(s => s.priority === 'high'),
    medium: activeSuggestions.filter(s => s.priority === 'medium'),
    low: activeSuggestions.filter(s => s.priority === 'low')
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Suggestions
            <Badge variant="secondary" className="ml-2">
              {activeSuggestions.length} active
            </Badge>
          </CardTitle>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            Real-time analysis
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All ({activeSuggestions.length})</TabsTrigger>
            <TabsTrigger value="high" className="text-destructive">
              High ({groupedSuggestions.high.length})
            </TabsTrigger>
            <TabsTrigger value="medium" className="text-warning">
              Medium ({groupedSuggestions.medium.length})
            </TabsTrigger>
            <TabsTrigger value="low">
              Low ({groupedSuggestions.low.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {activeSuggestions.map((suggestion) => (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                onApply={applySuggestion}
                onDismiss={dismissSuggestion}
                getPriorityColor={getPriorityColor}
                getTypeIcon={getTypeIcon}
              />
            ))}
          </TabsContent>

          <TabsContent value="high" className="space-y-4">
            {groupedSuggestions.high.map((suggestion) => (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                onApply={applySuggestion}
                onDismiss={dismissSuggestion}
                getPriorityColor={getPriorityColor}
                getTypeIcon={getTypeIcon}
              />
            ))}
          </TabsContent>

          <TabsContent value="medium" className="space-y-4">
            {groupedSuggestions.medium.map((suggestion) => (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                onApply={applySuggestion}
                onDismiss={dismissSuggestion}
                getPriorityColor={getPriorityColor}
                getTypeIcon={getTypeIcon}
              />
            ))}
          </TabsContent>

          <TabsContent value="low" className="space-y-4">
            {groupedSuggestions.low.map((suggestion) => (
              <SuggestionCard
                key={suggestion.id}
                suggestion={suggestion}
                onApply={applySuggestion}
                onDismiss={dismissSuggestion}
                getPriorityColor={getPriorityColor}
                getTypeIcon={getTypeIcon}
              />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

interface SuggestionCardProps {
  suggestion: Suggestion;
  onApply: (id: string) => void;
  onDismiss: (id: string) => void;
  getPriorityColor: (priority: Suggestion['priority']) => string;
  getTypeIcon: (type: Suggestion['type']) => JSX.Element;
}

const SuggestionCard = ({ 
  suggestion, 
  onApply, 
  onDismiss, 
  getPriorityColor, 
  getTypeIcon 
}: SuggestionCardProps) => (
  <Card className="border-l-4 border-l-primary hover:shadow-medium transition-shadow duration-300">
    <CardContent className="p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="text-primary">
              {getTypeIcon(suggestion.type)}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{suggestion.title}</h3>
                <Badge className={getPriorityColor(suggestion.priority)} variant="secondary">
                  {suggestion.priority}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{suggestion.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-sm font-medium text-primary">
            <TrendingUp className="w-3 h-3" />
            +{suggestion.impact}% impact
          </div>
        </div>

        <div className="grid gap-3">
          <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
            <p className="text-sm font-medium text-destructive mb-1">Current:</p>
            <p className="text-sm text-foreground">{suggestion.originalText}</p>
          </div>
          
          <div className="p-3 bg-success/10 rounded-lg border border-success/20">
            <p className="text-sm font-medium text-success mb-1">Suggested:</p>
            <p className="text-sm text-foreground">{suggestion.suggestedText}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <AlertTriangle className="w-3 h-3" />
          <span>{suggestion.reasoning}</span>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button 
            variant="ai" 
            size="sm"
            onClick={() => onApply(suggestion.id)}
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            Apply Suggestion
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onDismiss(suggestion.id)}
          >
            <X className="w-3 h-3 mr-1" />
            Dismiss
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);