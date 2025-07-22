import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useResumeFlow } from "@/contexts/ResumeFlowContext";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { EnhancedFileUploader } from "@/components/upload/EnhancedFileUploader";
import { EnhancedJobAnalysis } from "@/components/analysis/EnhancedJobAnalysis";
import { GapAnalysisResults } from "@/components/gap/GapAnalysisResults";
import { EnhancedOptimizationDashboard } from "@/components/analysis/EnhancedOptimizationDashboard";
import { RealTimeEditor } from "@/components/editor/BulletByBulletEditor";

const steps = [
  { id: 1, title: "Upload Resume", description: "Upload and parse your resume" },
  { id: 2, title: "Job Analysis", description: "Analyze job requirements" },
  { id: 3, title: "Gap Analysis", description: "Identify skill gaps" },
  { id: 4, title: "AI Optimization", description: "Review and refine AI optimizations" },
  { id: 5, title: "Export", description: "Download your optimized resume" },
];

export function ResumeOptimizationWizard() {
  const { state, setCurrentStep, canProceedToStep } = useResumeFlow();
  const { currentStep, isStepCompleted } = state;

  const progress = (currentStep / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length && canProceedToStep(currentStep + 1)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    if (canProceedToStep(stepId)) {
      setCurrentStep(stepId);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <EnhancedFileUploader />;
      case 2:
        return <EnhancedJobAnalysis />;
      case 3:
        return state.gapAnalysis ? (
          <GapAnalysisResults data={state.gapAnalysis} />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Complete job analysis to see gap results
          </div>
        );
      case 4:
        return <RealTimeEditor />;
      case 5:
        return <EnhancedOptimizationDashboard />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Resume Optimization</h1>
          <p className="text-muted-foreground">Follow the steps to optimize your resume for your target job</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep} of {steps.length}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
          {steps.map((step) => {
            const isActive = step.id === currentStep;
            const isCompleted = isStepCompleted[step.id - 1];
            const canAccess = canProceedToStep(step.id);

            return (
              <div
                key={step.id}
                className={`
                  relative p-3 rounded-lg border cursor-pointer transition-all
                  ${isActive ? 'border-primary bg-primary/5' : ''}
                  ${isCompleted ? 'border-green-500 bg-green-50 dark:bg-green-950' : ''}
                  ${!canAccess ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary/50'}
                `}
                onClick={() => handleStepClick(step.id)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
                    ${isCompleted ? 'bg-green-500 text-white' : ''}
                    ${isActive && !isCompleted ? 'bg-primary text-primary-foreground' : ''}
                    ${!isActive && !isCompleted ? 'bg-muted text-muted-foreground' : ''}
                  `}>
                    {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  <span className={`
                    text-sm font-medium
                    ${isActive ? 'text-primary' : ''}
                    ${isCompleted ? 'text-green-600 dark:text-green-400' : ''}
                    ${!isActive && !isCompleted ? 'text-muted-foreground' : ''}
                  `}>
                    {step.title}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground hidden md:block">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Current Step Content */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                {currentStep}
              </span>
              {steps[currentStep - 1]?.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons - Only show for non-AI optimization steps */}
        {currentStep !== 4 && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={currentStep === steps.length || !canProceedToStep(currentStep + 1)}
              className="flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}