import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, FileText, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onFileUpload?: (file: File) => void;
  className?: string;
}

export const FileUploader = ({ onFileUpload, className }: FileUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    
    if (file && (file.type === 'application/pdf' || file.type.includes('document') || file.type === 'text/plain')) {
      handleFileUpload(file);
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  }, []);

  const handleFileUpload = useCallback((file: File) => {
    setUploadedFile(file);
    setUploadStatus('uploading');
    
    // Simulate upload process
    setTimeout(() => {
      setUploadStatus('success');
      onFileUpload?.(file);
    }, 2000);
  }, [onFileUpload]);

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <Loader className="w-6 h-6 animate-spin text-primary" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-success" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-destructive" />;
      default:
        return <Upload className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Analyzing your resume...';
      case 'success':
        return `Successfully uploaded ${uploadedFile?.name}`;
      case 'error':
        return 'Upload failed. Please try again.';
      default:
        return 'Drag & drop your resume here or click to browse';
    }
  };

  return (
    <Card className={cn("w-full max-w-2xl mx-auto", className)}>
      <CardContent className="p-8">
        <div
          className={cn(
            "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300",
            isDragOver ? "border-primary bg-primary/5 scale-[1.02]" : "border-muted",
            uploadStatus === 'success' ? "border-success bg-success/5" : "",
            uploadStatus === 'error' ? "border-destructive bg-destructive/5" : ""
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploadStatus === 'uploading'}
          />
          
          <div className="space-y-4">
            <div className="flex justify-center">
              {getStatusIcon()}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                {uploadStatus === 'idle' ? 'Upload Your Resume' : 'Processing...'}
              </h3>
              <p className="text-muted-foreground">
                {getStatusText()}
              </p>
            </div>
            
            {uploadStatus === 'idle' && (
              <div className="space-y-4">
                <Button variant="ai" size="lg" className="pointer-events-none">
                  <FileText className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
                
                <div className="text-sm text-muted-foreground">
                  Supports PDF, DOC, DOCX, and TXT files up to 10MB
                </div>
              </div>
            )}
            
            {uploadStatus === 'uploading' && (
              <div className="space-y-4">
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  AI is analyzing your resume structure, skills, and experience...
                </p>
              </div>
            )}
            
            {uploadStatus === 'success' && (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-success">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Ready for optimization!</span>
                </div>
                
                <Button variant="success" size="lg">
                  Start AI Analysis
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};