import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileText, File, Palette, Settings, Eye, History, Share2, Copy, CheckCircle, Clock, Zap } from "lucide-react";
interface ResumeTemplate {
  id: string;
  name: string;
  category: 'professional' | 'creative' | 'modern' | 'classic';
  preview: string;
  description: string;
  atsCompatible: boolean;
  features: string[];
}
interface ExportFormat {
  id: string;
  name: string;
  extension: string;
  description: string;
  icon: React.ElementType;
  recommended: boolean;
  atsCompatible: boolean;
}
interface ExportHistory {
  id: string;
  format: string;
  template: string;
  timestamp: string;
  version: string;
  downloadCount: number;
}
export function ExportDownloadCenter() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("professional-1");
  const [selectedFormat, setSelectedFormat] = useState<string>("pdf-latex");
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const templates: ResumeTemplate[] = [{
    id: "professional-1",
    name: "Professional Classic",
    category: "professional",
    preview: "/api/placeholder/200/280",
    description: "Clean, ATS-friendly design perfect for corporate roles",
    atsCompatible: true,
    features: ["Clean typography", "ATS optimized", "Industry standard"]
  }, {
    id: "modern-1",
    name: "Modern Tech",
    category: "modern",
    preview: "/api/placeholder/200/280",
    description: "Contemporary design with subtle tech-inspired elements",
    atsCompatible: true,
    features: ["Modern layout", "Tech-focused", "Visual hierarchy"]
  }, {
    id: "creative-1",
    name: "Creative Portfolio",
    category: "creative",
    preview: "/api/placeholder/200/280",
    description: "Eye-catching design for creative professionals",
    atsCompatible: false,
    features: ["Visual impact", "Creative elements", "Portfolio ready"]
  }, {
    id: "classic-1",
    name: "Executive Classic",
    category: "classic",
    preview: "/api/placeholder/200/280",
    description: "Traditional format for senior executive positions",
    atsCompatible: true,
    features: ["Executive style", "Conservative design", "Leadership focused"]
  }];
  const exportFormats: ExportFormat[] = [{
    id: "pdf-latex",
    name: "PDF (LaTeX)",
    extension: "pdf",
    description: "Professional LaTeX-generated PDF with perfect formatting",
    icon: FileText,
    recommended: true,
    atsCompatible: true
  }, {
    id: "pdf-standard",
    name: "PDF (Standard)",
    extension: "pdf",
    description: "High-quality PDF optimized for printing and sharing",
    icon: FileText,
    recommended: false,
    atsCompatible: true
  }, {
    id: "docx",
    name: "Word Document",
    extension: "docx",
    description: "Editable Microsoft Word format",
    icon: File,
    recommended: false,
    atsCompatible: true
  }, {
    id: "txt",
    name: "Plain Text",
    extension: "txt",
    description: "ATS-safe plain text format",
    icon: File,
    recommended: false,
    atsCompatible: true
  }];
  const exportHistory: ExportHistory[] = [{
    id: "1",
    format: "PDF (LaTeX)",
    template: "Professional Classic",
    timestamp: "2 hours ago",
    version: "v2.1",
    downloadCount: 3
  }, {
    id: "2",
    format: "Word Document",
    template: "Modern Tech",
    timestamp: "1 day ago",
    version: "v2.0",
    downloadCount: 1
  }, {
    id: "3",
    format: "PDF (LaTeX)",
    template: "Professional Classic",
    timestamp: "3 days ago",
    version: "v1.8",
    downloadCount: 5
  }];
  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setExportProgress(i);
    }
    setIsExporting(false);
    setExportProgress(0);
  };
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'professional':
        return 'bg-primary/10 text-primary';
      case 'modern':
        return 'bg-secondary/10 text-secondary';
      case 'creative':
        return 'bg-accent/10 text-accent';
      case 'classic':
        return 'bg-muted/50 text-muted-foreground';
      default:
        return 'bg-muted/50 text-muted-foreground';
    }
  };
  return <div className="space-y-6">
      {/* Header */}
      <Card className="ai-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export & Download Center
          </CardTitle>
          <CardDescription>
            Generate professional resumes in multiple formats with customizable templates
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="export" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="export">Export Resume</TabsTrigger>
          
          <TabsTrigger value="history">Export History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="export" className="space-y-6">
          {/* Format Selection */}
          <Card className="professional-card">
            <CardHeader>
              <CardTitle>Export Format</CardTitle>
              <CardDescription>Choose your preferred file format</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exportFormats.map(format => {
                const IconComponent = format.icon;
                return <div key={format.id} className={`p-4 rounded-lg border cursor-pointer smooth-transition ${selectedFormat === format.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`} onClick={() => setSelectedFormat(format.id)}>
                      <div className="flex items-start gap-3">
                        <IconComponent className="h-5 w-5 text-primary mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{format.name}</h4>
                            {format.recommended && <Badge className="bg-success/10 text-success text-xs">
                                Recommended
                              </Badge>}
                            {format.atsCompatible && <Badge variant="outline" className="text-xs">
                                ATS Safe
                              </Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{format.description}</p>
                        </div>
                      </div>
                    </div>;
              })}
              </div>
            </CardContent>
          </Card>

          {/* Export Actions */}
          <Card className="professional-card">
            <CardHeader>
              <CardTitle>Export Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Ready to Export</h4>
                  <p className="text-sm text-muted-foreground">
                    Format: {exportFormats.find(f => f.id === selectedFormat)?.name} • 
                    Template: {templates.find(t => t.id === selectedTemplate)?.name}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                  <Button className="ai-button flex items-center gap-2" onClick={handleExport} disabled={isExporting}>
                    {isExporting ? <>
                        <Zap className="h-4 w-4 animate-spin" />
                        Exporting...
                      </> : <>
                        <Download className="h-4 w-4" />
                        Export Resume
                      </>}
                  </Button>
                </div>
              </div>

              {isExporting && <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Generating your resume...</span>
                    <span>{exportProgress}%</span>
                  </div>
                  <Progress value={exportProgress} className="h-2" />
                </div>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map(template => <Card key={template.id} className="professional-card">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="aspect-[3/4] bg-muted rounded border overflow-hidden">
                      <img src={template.preview} alt={template.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{template.name}</h3>
                        <Badge className={getCategoryColor(template.category)}>
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {template.features.map((feature, index) => <Badge key={index} variant="outline" className="text-xs">
                              {feature}
                            </Badge>)}
                        </div>
                        {template.atsCompatible && <div className="flex items-center gap-1 text-success text-xs">
                            <CheckCircle className="h-3 w-3" />
                            ATS Compatible
                          </div>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card className="professional-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Export History
              </CardTitle>
              <CardDescription>Your recent downloads and exports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {exportHistory.map(export_ => <div key={export_.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{export_.format}</h4>
                        <p className="text-sm text-muted-foreground">
                          {export_.template} • {export_.version} • {export_.timestamp}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right text-sm">
                        <div className="font-medium">{export_.downloadCount} downloads</div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="professional-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Export Settings
              </CardTitle>
              <CardDescription>Customize your export preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Default Export Format</label>
                  <Select defaultValue="pdf-latex">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {exportFormats.map(format => <SelectItem key={format.id} value={format.id}>
                          {format.name}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Default Template</label>
                  <Select defaultValue="professional-1">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map(template => <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">File Naming Convention</label>
                  <Select defaultValue="name-date">
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name-date">John_Doe_Resume_2024</SelectItem>
                      <SelectItem value="name-role">John_Doe_Software_Engineer</SelectItem>
                      <SelectItem value="custom">Custom Format</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="ai-button">Save Settings</Button>
                <Button variant="outline">Reset to Default</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>;
}