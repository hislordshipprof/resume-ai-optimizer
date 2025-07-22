import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopNavBar } from "@/components/layout/TopNavBar";
import { MainDashboard } from "@/components/dashboard/MainDashboard";
import { useAuth, withAuth } from "@/contexts/AuthContext";

import { SuggestionPanel } from "@/components/suggestions/SuggestionPanel";
import { StandaloneResumeEditor } from "@/components/editor/StandaloneResumeEditor";
import { ATSCompatibilityScore } from "@/components/scoring/ATSCompatibilityScore";
import { IndustryOptimization } from "@/components/industry/IndustryOptimization";
import { SkillsGapAnalysis } from "@/components/skills/SkillsGapAnalysis";
import { InterviewPreparation } from "@/components/interview/InterviewPreparation";
import { JobApplicationTracker } from "@/components/tracking/JobApplicationTracker";
import { PerformanceAnalytics } from "@/components/analytics/PerformanceAnalytics";
import { ResumeLibrary } from "@/components/library/ResumeLibrary";
import ProjectSuggestions from "@/pages/ProjectSuggestions";
import { ExportDownloadCenter } from "@/components/export/ExportDownloadCenter";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";

function Dashboard() {
  const location = useLocation();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Check if this is the user's first time (you'd implement proper logic here)
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('hasSeenOnboarding', 'true');
  };

  const DashboardRoutes = () => (
    <Routes>
      <Route index element={<MainDashboard />} />
      <Route path="editor" element={<StandaloneResumeEditor />} />
      
      <Route path="suggestions" element={<SuggestionPanel />} />
      <Route path="ats" element={<ATSCompatibilityScore />} />
      <Route path="industry" element={<IndustryOptimization />} />
      <Route path="skills" element={<SkillsGapAnalysis />} />
      <Route path="interview" element={<InterviewPreparation />} />
      <Route path="tracking" element={<JobApplicationTracker />} />
      <Route path="analytics" element={<PerformanceAnalytics />} />
      <Route path="library" element={<ResumeLibrary />} />
      <Route path="projects" element={<ProjectSuggestions />} />
      <Route path="export" element={<ExportDownloadCenter />} />
    </Routes>
  );

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <TopNavBar />
          <main className="p-6">
            <DashboardRoutes />
          </main>
        </SidebarInset>
      </div>
      
      <OnboardingWizard 
        isOpen={showOnboarding} 
        onClose={handleOnboardingComplete}
      />
    </SidebarProvider>
  );
}

// Export with authentication protection
export default withAuth(Dashboard);