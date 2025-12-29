'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Database,
  FileText,
  Eye,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  Hash,
  Download,
  Rocket,
  Info,
  Shield,
  Zap,
  TrendingUp
} from 'lucide-react';

interface DatasetInfo {
  cid: string;
  filename: string;
  size: number;
  validation: {
    isValid: boolean;
    rowCount?: number;
    columnCount?: number;
    dataType?: string;
    quality?: number;
    errors?: string[];
  };
}

interface DatasetTabProps {
  dataset: File | null;
  setDataset: (file: File | null) => void;
  datasetInfo: DatasetInfo | null;
  setDatasetInfo: (info: DatasetInfo | null) => void;
  isUploading: boolean;
  setIsUploading: (uploading: boolean) => void;
  isTraining: boolean;
  isDirectTraining: boolean;
  setIsDirectTraining: (directTraining: boolean) => void;
  handleUploadDataset: () => Promise<void>;
  handleDirectTraining: () => Promise<void>;
  handleClearDataset: () => void;
}

export default function EnhancedDatasetTab({
  dataset,
  setDataset,
  datasetInfo,
  setDatasetInfo,
  isUploading,
  setIsUploading,
  isTraining,
  isDirectTraining,
  setIsDirectTraining,
  handleUploadDataset,
  handleDirectTraining,
  handleClearDataset
}: DatasetTabProps) {
  const [datasetPreview, setDatasetPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Handle dataset file selection
  const handleDatasetSelect = useCallback(async (file: File) => {
    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('File size exceeds 50MB limit');
      return;
    }
    
    // Validate file type
    const validTypes = ['.csv', '.json', '.txt', '.tsv', '.data'];
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!validTypes.includes(fileExt)) {
      alert('Invalid file type. Supported: CSV, JSON, TXT, TSV');
      return;
    }
    
    setDataset(file);
    setDatasetInfo(null);
    setDatasetPreview(null);
    
    // Generate preview
    try {
      const text = await file.text();
      const lines = text.split('\n').slice(0, 20); // First 20 lines
      const preview = lines.join('\n');
      setDatasetPreview(preview);
    } catch (error) {
      console.error('Failed to preview dataset:', error);
    }
  }, [setDataset, setDatasetInfo]);

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleDatasetSelect(file);
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleDatasetSelect(e.dataTransfer.files[0]);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Get quality badge
  const getQualityBadge = (quality?: number) => {
    if (!quality) return null;
    
    if (quality >= 90) return <Badge className="bg-green-500">Excellent</Badge>;
    if (quality >= 70) return <Badge className="bg-blue-500">Good</Badge>;
    if (quality >= 50) return <Badge className="bg-yellow-500">Fair</Badge>;
    return <Badge className="bg-red-500">Poor</Badge>;
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg border-t-4 border-blue-500">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6 text-blue-600" />
            Dataset Management
          </CardTitle>
          <CardDescription>
            Upload your training dataset to Walrus decentralized storage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* Upload Zone */}
          {!dataset && !datasetInfo && (
            <div
              className={`relative border-3 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer ${
                dragActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105'
                  : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('dataset-file-input')?.click()}
            >
              <input
                id="dataset-file-input"
                type="file"
                accept=".csv,.json,.txt,.data,.tsv"
                onChange={handleFileInputChange}
                className="hidden"
                disabled={isUploading || isTraining}
              />
              
              <Database className="mx-auto h-20 w-20 text-blue-500 mb-6" />
              
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
                {dragActive ? 'Drop your dataset here' : 'Upload Training Dataset'}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Drag and drop your dataset file or click to browse. 
                Your data will be securely stored on Walrus decentralized storage.
              </p>
              
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-4">
                <Shield className="h-4 w-4" />
                <span>Encrypted & Decentralized Storage</span>
              </div>
              
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline">CSV</Badge>
                <Badge variant="outline">JSON</Badge>
                <Badge variant="outline">TXT</Badge>
                <Badge variant="outline">TSV</Badge>
                <Badge variant="outline">Max 50MB</Badge>
              </div>
            </div>
          )}
          
          {/* Selected File (Not Yet Uploaded) */}
          {dataset && !datasetInfo && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-500 rounded-lg p-3">
                      <FileText className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                        {dataset.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {formatFileSize(dataset.size)} • {dataset.type || 'Unknown type'}
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleClearDataset}
                    variant="ghost"
                    size="sm"
                    disabled={isUploading || isDirectTraining}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                {isUploading && (
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Uploading to Walrus...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button
                    onClick={handleUploadDataset}
                    disabled={isUploading || isDirectTraining}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    size="lg"
                  >
                    <Upload className="h-5 w-5 mr-2" />
                    {isUploading ? 'Validating & Uploading...' : 'Upload & Validate'}
                  </Button>
                  
                  <Button
                    onClick={handleDirectTraining}
                    disabled={isUploading || isTraining || isDirectTraining}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                    size="lg"
                  >
                    <Rocket className="h-5 w-5 mr-2" />
                    {isDirectTraining ? 'Starting Training...' : 'Upload & Train Now'}
                  </Button>
                </div>
              </div>
              
              {/* Dataset Preview */}
              {datasetPreview && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Eye className="h-5 w-5" />
                      Dataset Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto max-h-96 overflow-y-auto font-mono">
                      {datasetPreview}
                      {datasetPreview.split('\n').length >= 20 && '\n... (showing first 20 lines)'}
                    </pre>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          
          {/* Uploaded Dataset Info */}
          {datasetInfo && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-500 rounded-full p-2">
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-green-900 dark:text-green-100">
                        Dataset Ready for Training
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Successfully uploaded to Walrus storage
                      </p>
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleClearDataset}
                    variant="ghost"
                    size="sm"
                    disabled={isTraining}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
                
                {/* Dataset Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Filename</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 truncate" title={datasetInfo.filename}>
                      {datasetInfo.filename}
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Size</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {formatFileSize(datasetInfo.size)}
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Records</p>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {datasetInfo.validation.rowCount?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Quality</p>
                    <div className="flex items-center gap-2">
                      {getQualityBadge(datasetInfo.validation.quality)}
                      <span className="text-sm font-medium">
                        {datasetInfo.validation.quality || 0}%
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Additional Info */}
                {datasetInfo.validation.columnCount && (
                  <div className="mb-4 flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-gray-700 dark:text-gray-300">
                        <strong>{datasetInfo.validation.columnCount}</strong> features/columns
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        Type: <strong className="uppercase">{datasetInfo.validation.dataType || 'Unknown'}</strong>
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Validation Errors */}
                {datasetInfo.validation.errors && datasetInfo.validation.errors.length > 0 && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <p className="font-semibold mb-2">Validation Warnings:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {datasetInfo.validation.errors.map((err, idx) => (
                          <li key={idx}>{err}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}
                
                {/* Walrus CID */}
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Hash className="h-5 w-5 text-gray-500 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Walrus CID:
                      </span>
                      <code className="text-sm bg-gray-100 dark:bg-gray-900 px-3 py-1 rounded font-mono truncate flex-1">
                        {datasetInfo.cid}
                      </code>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(datasetInfo.cid);
                      }}
                      className="flex-shrink-0"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Info Alert */}
              <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-gray-700 dark:text-gray-300">
                  <strong>Decentralized Storage:</strong> Your dataset is now stored on Walrus, 
                  a decentralized storage network. This ensures data persistence, availability, 
                  and censorship resistance for the AI training process.
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Educational Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-blue-500">
          <CardContent className="pt-6">
            <Shield className="h-8 w-8 text-blue-500 mb-3" />
            <h4 className="font-semibold mb-2">Secure Storage</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Data encrypted and distributed across Walrus network nodes
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-green-500">
          <CardContent className="pt-6">
            <Database className="h-8 w-8 text-green-500 mb-3" />
            <h4 className="font-semibold mb-2">Permanent Access</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your dataset remains accessible for future training sessions
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-purple-500">
          <CardContent className="pt-6">
            <Rocket className="h-8 w-8 text-purple-500 mb-3" />
            <h4 className="font-semibold mb-2">Fast Training</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Optimized data retrieval for efficient model training
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}