import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Link, Sparkles, FileText, Loader, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobAnalysisFormProps {
  onAnalysisComplete?: (analysis: any) => void;
  className?: string;
}

export const JobAnalysisForm = ({ onAnalysisComplete, className }: JobAnalysisFormProps) => {
  const [activeTab, setActiveTab] = useState("url");
  const [jobUrl, setJobUrl] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'analyzing' | 'complete'>('idle');

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisStatus('analyzing');
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockAnalysis = {
      jobTitle: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      requirements: {
        technical: ["React", "TypeScript", "Node.js", "AWS"],
        experience: "5+ years",
        education: "Bachelor's degree",
        soft: ["Leadership", "Communication", "Problem-solving"]
      },
      keywords: ["React", "TypeScript", "Frontend", "JavaScript", "API"],
      salaryRange: "$90,000 - $130,000",
      industry: "Technology",
      compatibility: 78
    };
    
    setAnalysisStatus('complete');
    setIsAnalyzing(false);
    onAnalysisComplete?.(mockAnalysis);
  };

  const getStatusIcon = () => {
    switch (analysisStatus) {
      case 'analyzing':
        return <Loader className="w-5 h-5 animate-spin text-primary" />;
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-success" />;
      default:
        return <Sparkles className="w-5 h-5 text-primary" />;
    }
  };

  const getStatusText = () => {
    switch (analysisStatus) {
      case 'analyzing':
        return 'Analyzing job posting with AI...';
      case 'complete':
        return 'Analysis complete! View results below.';
      default:
        return 'Add a job posting to get started';
    }
  };

  return (
    <Card className={cn("w-full max-w-4xl mx-auto", className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <div>
            <CardTitle>Job Analysis</CardTitle>
            <CardDescription>{getStatusText()}</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url" className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              Job URL
            </TabsTrigger>
            <TabsTrigger value="paste" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Copy & Paste
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jobUrl">Job Posting URL</Label>
              <Input
                id="jobUrl"
                type="url"
                placeholder="https://company.com/jobs/frontend-developer"
                value={jobUrl}
                onChange={(e) => setJobUrl(e.target.value)}
                disabled={isAnalyzing}
              />
              <p className="text-sm text-muted-foreground">
                Paste a link from LinkedIn, Indeed, company websites, or other job boards
              </p>
            </div>
            
            <div className="flex gap-2">
              <Badge variant="secondary">LinkedIn</Badge>
              <Badge variant="secondary">Indeed</Badge>
              <Badge variant="secondary">AngelList</Badge>
              <Badge variant="secondary">Company Sites</Badge>
            </div>
          </TabsContent>
          
          <TabsContent value="paste" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="jobDescription">Job Description</Label>
              <Textarea
                id="jobDescription"
                placeholder="Paste the complete job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[200px]"
                disabled={isAnalyzing}
              />
              <p className="text-sm text-muted-foreground">
                Include the full job posting: title, requirements, responsibilities, qualifications
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-center">
          <Button
            onClick={handleAnalyze}
            variant="ai"
            size="lg"
            disabled={isAnalyzing || (!jobUrl && !jobDescription)}
            className="min-w-[200px]"
          >
            {isAnalyzing ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Analyze Job Posting
              </>
            )}
          </Button>
        </div>
        
        {analysisStatus === 'analyzing' && (
          <div className="space-y-4 p-6 bg-muted/50 rounded-lg">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                Extracting job requirements and qualifications
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse animation-delay-200" />
                Identifying key skills and technologies
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse animation-delay-400" />
                Analyzing company culture and values
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse animation-delay-600" />
                Generating optimization recommendations
              </div>
            </div>
          </div>
        )}
        
        {analysisStatus === 'complete' && (
          <div className="space-y-4 p-6 bg-success/10 border border-success/20 rounded-lg">
            <div className="flex items-center gap-2 text-success">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Job analysis completed successfully!</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your resume has been analyzed against this job posting. Check the Gap Analysis section for detailed insights.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};