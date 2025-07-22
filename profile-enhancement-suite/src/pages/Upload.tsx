import { Header } from "@/components/navigation/Header";
import { ResumeOptimizationWizard } from "@/components/flow/ResumeOptimizationWizard";
import { ResumeFlowProvider } from "@/contexts/ResumeFlowContext";

export default function Upload() {
  return (
    <ResumeFlowProvider>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-20 pb-12">
          <ResumeOptimizationWizard />
        </main>
      </div>
    </ResumeFlowProvider>
  );
}