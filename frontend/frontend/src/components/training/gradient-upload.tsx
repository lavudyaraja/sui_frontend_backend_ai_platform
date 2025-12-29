'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export function GradientUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploaded, setUploaded] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    setProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploaded(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gradient Upload</CardTitle>
        <CardDescription>
          Upload your computed gradients to the decentralized network
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed rounded-lg p-6 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-sm text-gray-600 mb-4">
            {uploaded 
              ? "Gradients successfully uploaded to Walrus storage" 
              : "Drag and drop your gradient file or click to browse"}
          </p>
          
          {uploaded ? (
            <div className="flex items-center justify-center text-green-600">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Upload complete!</span>
            </div>
          ) : (
            <Button 
              onClick={handleUpload}
              disabled={isUploading}
              variant="outline"
            >
              <Upload className="mr-2 h-4 w-4" />
              {isUploading ? 'Uploading...' : 'Select File'}
            </Button>
          )}
        </div>
        
        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading to Walrus...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}
        
        <div className="text-xs text-gray-500">
          <p>File format: .grad (JSON)</p>
          <p>Maximum size: 100MB</p>
        </div>
      </CardContent>
    </Card>
  );
}