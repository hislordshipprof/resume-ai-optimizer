import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUploader } from "@/components/upload/FileUploader";

import { SuggestionPanel } from "@/components/suggestions/SuggestionPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, BarChart3, Lightbulb, Zap } from "lucide-react";

export const DemoSection = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Experience AI-Powered 
            <span className="block text-primary">Resume Optimization</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how our AI analyzes your resume in real-time, providing instant feedback 
            and optimization suggestions tailored to your industry and target role.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="upload" className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-card shadow-soft">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">Upload</span>
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Analysis</span>
              </TabsTrigger>
              <TabsTrigger value="suggestions" className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                <span className="hidden sm:inline">Suggestions</span>
              </TabsTrigger>
              <TabsTrigger value="optimize" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">Optimize</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle>Step 1: Upload Your Resume</CardTitle>
                  <p className="text-muted-foreground">
                    Drag and drop your resume or click to browse. We support PDF, DOC, DOCX, and TXT formats.
                  </p>
                </CardHeader>
                <CardContent>
                  <FileUploader />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analysis" className="space-y-6">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle>Step 2: AI Analysis Dashboard</CardTitle>
                  <p className="text-muted-foreground">
                    Our AI analyzes your resume across multiple dimensions and provides detailed scoring.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-card border rounded-lg">
                        <div className="text-2xl font-bold text-primary">85%</div>
                        <div className="text-sm text-muted-foreground">ATS Score</div>
                      </div>
                      <div className="p-4 bg-card border rounded-lg">
                        <div className="text-2xl font-bold text-warning">12</div>
                        <div className="text-sm text-muted-foreground">Issues Found</div>
                      </div>
                      <div className="p-4 bg-card border rounded-lg">
                        <div className="text-2xl font-bold text-success">8</div>
                        <div className="text-sm text-muted-foreground">Strengths</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-6">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle>Step 3: Smart Suggestions</CardTitle>
                  <p className="text-muted-foreground">
                    Get personalized, AI-powered suggestions to improve your resume's impact and ATS compatibility.
                  </p>
                </CardHeader>
                <CardContent>
                  <SuggestionPanel />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="optimize" className="space-y-6">
              <Card className="bg-gradient-card border-0 shadow-strong">
                <CardHeader className="text-center">
                  <CardTitle className="flex items-center justify-center gap-2">
                    <Zap className="w-6 h-6 text-primary" />
                    Step 4: Optimized Resume
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Your resume is now optimized for ATS systems and tailored to your target industry.
                  </p>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-success">96%</div>
                      <div className="text-sm text-muted-foreground">ATS Compatibility</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-primary">24</div>
                      <div className="text-sm text-muted-foreground">Improvements Applied</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-warning">3.2x</div>
                      <div className="text-sm text-muted-foreground">Higher Interview Rate</div>
                    </div>
                  </div>
                  
                  <div className="bg-primary/10 p-6 rounded-lg border border-primary/20">
                    <h3 className="font-semibold text-foreground mb-2">
                      🎉 Congratulations! Your resume is now optimized
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Download your improved resume in multiple formats or continue optimizing for specific job descriptions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
};