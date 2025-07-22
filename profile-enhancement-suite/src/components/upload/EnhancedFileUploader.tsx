import { useState, useCallback, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Upload, 
  FileText, 
  File, 
  CheckCircle, 
  AlertCircle, 
  X,
  Eye,
  Download,
  Trash2,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useResumeFlow, ParsedResumeData } from "@/contexts/ResumeFlowContext";
import { apiService } from "@/services/apiService";
import { toast } from "@/hooks/use-toast";

interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: string;
  type: string;
  status: 'uploading' | 'parsing' | 'completed' | 'error';
  progress: number;
  parsedData?: {
    personalInfo: any;
    experience: any[];
    skills: string[];
    education: any[];
    confidence: number;
  };
  errorMessage?: string;
  backendId?: number;
}

interface ParsedSection {
  section: string;
  content: string;
  confidence: number;
  issues: string[];
}

export function EnhancedFileUploader() {
  const { setResumeData, setCurrentStep, markStepCompleted } = useResumeFlow();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const processFileUpload = async (fileId: string, file: File) => {
    try {
      // Update status to uploading
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'uploading', progress: 10 }
          : f
      ));

      // Upload file to backend
      const uploadResponse = await apiService.uploadResume(file);
      
      // Update progress to show upload complete, parsing starting
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'parsing', progress: 60 }
          : f
      ));

      // Get detailed resume information (includes parsed data)
      const resumeDetail = await apiService.getResumeDetail(uploadResponse.id);
      
      // Transform backend data to match frontend structure
      const parsedData: ParsedResumeData = {
        personalInfo: {
          name: resumeDetail.full_name || "Unknown",
          email: resumeDetail.email || "",
          phone: resumeDetail.phone || "",
          linkedin: resumeDetail.linkedin_url || "",
          location: (resumeDetail.parsed_data && resumeDetail.parsed_data.location) || ""
        },
        experience: (resumeDetail.parsed_data && resumeDetail.parsed_data.experience) || [],
        skills: (resumeDetail.parsed_data && resumeDetail.parsed_data.skills) || [],
        education: (resumeDetail.parsed_data && resumeDetail.parsed_data.education) || [],
        projects: (resumeDetail.parsed_data && resumeDetail.parsed_data.projects) || [],
        summary: (resumeDetail.parsed_data && resumeDetail.parsed_data.summary) || "",
        backendId: uploadResponse.id
      };

      // Update file status to completed
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { 
              ...f, 
              status: 'completed', 
              progress: 100,
              parsedData: {
                personalInfo: parsedData.personalInfo,
                experience: parsedData.experience,
                skills: parsedData.skills,
                education: parsedData.education,
                confidence: resumeDetail.confidence_score || 85
              },
              backendId: uploadResponse.id // Store backend resume ID
            }
            : f
      ));

      // Update resume flow context
      setResumeData(parsedData);
      markStepCompleted(1);

      toast({
        title: "Resume Uploaded Successfully",
        description: `${file.name} has been processed and is ready for optimization.`,
      });

    } catch (error) {
      console.error('File upload error:', error);
      
      // Update file status to error
      setFiles(prev => prev.map(f => 
        f.id === fileId 
          ? { ...f, status: 'error', progress: 0, errorMessage: error instanceof Error ? error.message : "Upload failed" }
          : f
      ));

      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = useCallback((selectedFiles: FileList) => {
    Array.from(selectedFiles).forEach(file => {
      if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'].includes(file.type)) {
        return;
      }

      const fileId = `file-${Date.now()}-${Math.random()}`;
      const uploadedFile: UploadedFile = {
        id: fileId,
        file,
        name: file.name,
        size: formatFileSize(file.size),
        type: file.type,
        status: 'uploading',
        progress: 0
      };

      setFiles(prev => [...prev, uploadedFile]);
      processFileUpload(fileId, file);
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    if (selectedFile === fileId) {
      setSelectedFile(null);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return FileText;
    if (type.includes('word')) return File;
    return File;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'error': return 'text-destructive';
      case 'uploading':
      case 'parsing': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'error': return AlertCircle;
      default: return Upload;
    }
  };

  const selectedFileData = files.find(f => f.id === selectedFile);

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <Card className="professional-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Resume Upload
          </CardTitle>
          <CardDescription>
            Upload your resume in PDF, DOCX, or TXT format for AI-powered analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center transition-all",
              isDragOver 
                ? "border-primary bg-primary/5 scale-105" 
                : "border-border hover:border-primary/50"
            )}
          >
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-primary/10">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Drop your resume here or click to browse
                </h3>
                <p className="text-muted-foreground mb-4">
                  Support for PDF, DOCX, and TXT files up to 10MB
                </p>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="ai-button"
                >
                  Choose File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                  className="hidden"
                  multiple
                />
              </div>
              <div className="flex justify-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  PDF
                </div>
                <div className="flex items-center gap-1">
                  <File className="h-4 w-4" />
                  DOCX
                </div>
                <div className="flex items-center gap-1">
                  <File className="h-4 w-4" />
                  TXT
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <Card className="professional-card">
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
            <CardDescription>Track upload progress and view parsing results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((file) => {
                const FileIcon = getFileIcon(file.type);
                const StatusIcon = getStatusIcon(file.status);
                
                return (
                  <div 
                    key={file.id}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg border smooth-transition",
                      selectedFile === file.id ? "border-primary bg-primary/5" : "border-border"
                    )}
                  >
                    <div className="p-2 rounded-lg bg-muted">
                      <FileIcon className="h-5 w-5" />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{file.name}</h4>
                        <div className="flex items-center gap-2">
                          <StatusIcon className={cn("h-4 w-4", getStatusColor(file.status))} />
                          <Badge variant="outline" className="text-xs">
                            {file.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{file.size}</span>
                        {file.parsedData && (
                          <span className="text-success">
                            Confidence: {file.parsedData.confidence}%
                          </span>
                        )}
                      </div>
                      
                      {(file.status === 'uploading' || file.status === 'parsing') && (
                        <Progress value={file.progress} className="h-2" />
                      )}
                      
                      {file.errorMessage && (
                        <Alert className="bg-destructive/10 border-destructive/20">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>{file.errorMessage}</AlertDescription>
                        </Alert>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {file.status === 'completed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedFile(file.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Preview
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeFile(file.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Parsing Preview */}
      {selectedFileData?.parsedData && (
        <Card className="ai-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Parsing Results: {selectedFileData.name}
            </CardTitle>
            <CardDescription>
              AI extracted information with {selectedFileData.parsedData.confidence}% confidence
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div>
              <h4 className="font-semibold mb-3">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-background/80">
                <div>
                  <span className="text-sm font-medium">Name:</span>
                  <p className="text-sm text-muted-foreground">{selectedFileData.parsedData.personalInfo.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Email:</span>
                  <p className="text-sm text-muted-foreground">{selectedFileData.parsedData.personalInfo.email}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Phone:</span>
                  <p className="text-sm text-muted-foreground">{selectedFileData.parsedData.personalInfo.phone}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Location:</span>
                  <p className="text-sm text-muted-foreground">{selectedFileData.parsedData.personalInfo.location}</p>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div>
              <h4 className="font-semibold mb-3">Extracted Skills</h4>
              <div className="flex flex-wrap gap-2">
                {selectedFileData.parsedData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <h4 className="font-semibold mb-3">Work Experience</h4>
              <div className="space-y-3">
                {selectedFileData.parsedData.experience.map((exp, index) => (
                  <div key={index} className="p-4 rounded-lg bg-background/80">
                    <h5 className="font-medium">{exp.title}</h5>
                    <p className="text-sm text-muted-foreground">{exp.company} • {exp.duration}</p>
                    <p className="text-sm mt-2">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <Button 
                className="ai-button"
                onClick={() => setCurrentStep(2)}
              >
                <ChevronRight className="h-4 w-4 mr-2" />
                Continue to Job Analysis
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}