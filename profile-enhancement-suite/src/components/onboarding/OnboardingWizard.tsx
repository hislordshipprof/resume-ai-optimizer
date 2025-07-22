import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Target,
  Upload,
  Settings,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  User,
  Briefcase,
  FileUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OnboardingWizard({ isOpen, onClose }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Welcome & Goals
    firstName: "",
    lastName: "",
    careerLevel: "",
    industry: "",
    primaryGoal: "",
    
    // Step 2: Upload Resume
    resumeFile: null as File | null,
    hasResume: true,
    
    // Step 3: Preferences
    notificationsEnabled: true,
    optimizationLevel: "balanced",
    templatePreference: "professional"
  });

  const navigate = useNavigate();
  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      onClose();
      navigate('/dashboard');
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData({ ...formData, resumeFile: file });
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-primary-foreground" />
        </div>
        <h3 className="text-2xl font-bold">Welcome to ResumeAI!</h3>
        <p className="text-muted-foreground">Let's set up your profile and career goals</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="John"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="Doe"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="careerLevel">Career Level</Label>
        <Select value={formData.careerLevel} onValueChange={(value) => setFormData({ ...formData, careerLevel: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select your career level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="entry">Entry Level (0-2 years)</SelectItem>
            <SelectItem value="mid">Mid Level (3-7 years)</SelectItem>
            <SelectItem value="senior">Senior Level (8-15 years)</SelectItem>
            <SelectItem value="executive">Executive (15+ years)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry">Target Industry</Label>
        <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select your industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="finance">Finance & Banking</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="retail">Retail & E-commerce</SelectItem>
            <SelectItem value="consulting">Consulting</SelectItem>
            <SelectItem value="marketing">Marketing & Advertising</SelectItem>
            <SelectItem value="manufacturing">Manufacturing</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="primaryGoal">Primary Goal</Label>
        <Select value={formData.primaryGoal} onValueChange={(value) => setFormData({ ...formData, primaryGoal: value })}>
          <SelectTrigger>
            <SelectValue placeholder="What's your main objective?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="job-search">Find a new job</SelectItem>
            <SelectItem value="career-change">Change careers</SelectItem>
            <SelectItem value="promotion">Get promoted</SelectItem>
            <SelectItem value="freelance">Start freelancing</SelectItem>
            <SelectItem value="optimize">Optimize existing resume</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
          <FileUp className="w-8 h-8 text-secondary-foreground" />
        </div>
        <h3 className="text-2xl font-bold">Upload Your Resume</h3>
        <p className="text-muted-foreground">Upload your current resume or start from scratch</p>
      </div>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center space-y-4 hover:border-primary/50 transition-colors">
          <Upload className="w-12 h-12 text-muted-foreground mx-auto" />
          <div>
            <p className="text-lg font-medium">Drop your resume here</p>
            <p className="text-sm text-muted-foreground">Supports PDF, DOCX, and TXT files</p>
          </div>
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileUpload}
            className="hidden"
            id="resume-upload"
          />
          <label htmlFor="resume-upload">
            <Button variant="outline" className="cursor-pointer">
              Browse Files
            </Button>
          </label>
          {formData.resumeFile && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <span className="text-sm font-medium">{formData.resumeFile.name}</span>
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Don't have a resume yet?</p>
          <Button 
            variant="ghost" 
            onClick={() => setFormData({ ...formData, hasResume: false })}
            className="text-primary hover:text-primary/80"
          >
            Start from scratch
          </Button>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
          <Settings className="w-8 h-8 text-accent-foreground" />
        </div>
        <h3 className="text-2xl font-bold">Customize Your Experience</h3>
        <p className="text-muted-foreground">Set your preferences for AI optimization</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Optimization Level</Label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={formData.optimizationLevel === "conservative" ? "default" : "outline"}
              onClick={() => setFormData({ ...formData, optimizationLevel: "conservative" })}
              className="h-auto p-4 flex-col space-y-2"
            >
              <div className="font-medium">Conservative</div>
              <div className="text-xs text-center">Minimal changes, preserve your style</div>
            </Button>
            <Button
              variant={formData.optimizationLevel === "balanced" ? "default" : "outline"}
              onClick={() => setFormData({ ...formData, optimizationLevel: "balanced" })}
              className="h-auto p-4 flex-col space-y-2"
            >
              <div className="font-medium">Balanced</div>
              <div className="text-xs text-center">Moderate improvements</div>
            </Button>
            <Button
              variant={formData.optimizationLevel === "aggressive" ? "default" : "outline"}
              onClick={() => setFormData({ ...formData, optimizationLevel: "aggressive" })}
              className="h-auto p-4 flex-col space-y-2"
            >
              <div className="font-medium">Aggressive</div>
              <div className="text-xs text-center">Maximum optimization</div>
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Preferred Template Style</Label>
          <Select 
            value={formData.templatePreference} 
            onValueChange={(value) => setFormData({ ...formData, templatePreference: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
              <SelectItem value="minimalist">Minimalist</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="bg-muted/50 p-4 rounded-lg space-y-3">
          <h4 className="font-medium">Quick Setup Complete!</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>Profile information saved</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>Resume {formData.resumeFile ? 'uploaded' : 'template prepared'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>Preferences configured</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            You can always change these settings later in your dashboard.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Getting Started</DialogTitle>
              <DialogDescription>
                Step {currentStep} of {totalSteps}
              </DialogDescription>
            </div>
            <Badge variant="outline">{Math.round(progress)}% Complete</Badge>
          </div>
          <Progress value={progress} className="mt-2" />
        </DialogHeader>

        <div className="py-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <Button onClick={handleNext}>
            {currentStep === totalSteps ? (
              <>
                Complete Setup
                <CheckCircle className="w-4 h-4 ml-2" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}