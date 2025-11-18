'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Play, 
  Pause, 
  Square,
  Upload, 
  Hash,
  TrendingUp,
  Activity,
  Clock,
  Zap,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Info,
  Download,
  RefreshCw,
  Settings,
  BarChart3,
  FileText,
  Eye,
  Trash2,
  Database,
  Rocket,
  Award,
  Users,
  Globe
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import MetricsTab from './components/metrics-tab';

// Enhanced interfaces
interface DatasetInfo {
  cid: string;
  filename: string;
  size: number;
  uploadTime: Date;
  validation: {
    isValid: boolean;
    rowCount?: number;
    columnCount?: number;
    dataType?: string;
    errors?: string[];
    quality?: number; // 0-100 quality score
  };
}

interface TrainingProgress {
  epoch: number;
  batch: number;
  totalBatches: number;
  loss: number;
  accuracy?: number;
  percentage: number;
  timeElapsed: number;
  estimatedTimeRemaining: number;
  samplesProcessed?: number;
  learningRate?: number;
}

interface EpochMetric {
  epoch: number;
  loss: number;
  accuracy: number;
  validationLoss?: number;
  validationAccuracy?: number;
  timestamp: Date;
}

interface TrainingConfig {
  modelType: 'mlp' | 'cnn' | 'rnn' | 'transformer';
  epochs: number;
  batchSize: number;
  learningRate: number;
  optimizer?: 'adam' | 'sgd' | 'rmsprop';
  useValidation?: boolean;
  validationSplit?: number;
}

export default function EnhancedTrainingPage() {
  // State management
  const [status, setStatus] = useState<'idle' | 'preparing' | 'training' | 'paused' | 'completed' | 'failed' | 'uploading'>('idle');
  const [progress, setProgress] = useState<TrainingProgress | null>(null);
  const [logs, setLogs] = useState<Array<{timestamp: Date, level: string, message: string}>>([]);
  const [epochMetrics, setEpochMetrics] = useState<EpochMetric[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [walrusCID, setWalrusCID] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  // Training configuration
  const [config, setConfig] = useState<TrainingConfig>({
    modelType: 'mlp',
    epochs: 10,
    batchSize: 32,
    learningRate: 0.001,
    optimizer: 'adam',
    useValidation: true,
    validationSplit: 0.2
  });
  
  // Dataset state
  const [dataset, setDataset] = useState<File | null>(null);
  const [datasetInfo, setDatasetInfo] = useState<DatasetInfo | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [datasetPreview, setDatasetPreview] = useState<string | null>(null);
  
  // Statistics
  const [totalSessionsCompleted, setTotalSessionsCompleted] = useState(0);
  const [totalTrainingTime, setTotalTrainingTime] = useState(0);
  const [contributionScore, setContributionScore] = useState(0);
  
  // Handle dataset file selection with validation
  const handleDatasetSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      setError('File size exceeds 50MB limit');
      return;
    }
    
    // Validate file type
    const validTypes = ['.csv', '.json', '.txt', '.tsv', '.data'];
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!validTypes.includes(fileExt)) {
      setError('Invalid file type. Supported: CSV, JSON, TXT, TSV');
      return;
    }
    
    setDataset(file);
    setDatasetInfo(null);
    setError(null);
    
    // Generate preview
    try {
      const text = await file.text();
      const preview = text.slice(0, 1000);
      setDatasetPreview(preview);
      
      // Log selection
      addLog('info', `Dataset selected: ${file.name} (${formatFileSize(file.size)})`);
    } catch (error) {
      console.error('Failed to preview dataset:', error);
      setError('Failed to read dataset file');
    }
  }, []);
  
  // Upload and validate dataset
  const handleUploadDataset = useCallback(async () => {
    if (!dataset) {
      setError('No dataset selected');
      return;
    }
    
    setIsUploading(true);
    setError(null);
    addLog('info', 'Starting dataset upload and validation...');
    
    try {
      const formData = new FormData();
      formData.append('file', dataset);
      
      // Validate dataset
      addLog('info', 'Validating dataset structure...');
      const validationResponse = await fetch('/api/dataset/validate', {
        method: 'POST',
        body: formData
      });
      
      if (!validationResponse.ok) {
        const errorData = await validationResponse.json();
        throw new Error(errorData.detail || 'Validation failed');
      }
      
      const validationResult = await validationResponse.json();
      
      if (!validationResult.validation.isValid) {
        throw new Error(`Validation errors: ${validationResult.validation.errors.join(', ')}`);
      }
      
      addLog('success', 'Dataset validation successful');
      
      // Upload to Walrus
      addLog('info', 'Uploading to Walrus decentralized storage...');
      const uploadFormData = new FormData();
      uploadFormData.append('file', dataset);
      
      const response = await fetch('/api/dataset/upload', {
        method: 'POST',
        body: uploadFormData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Upload failed');
      }
      
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }
      
      const newDatasetInfo: DatasetInfo = {
        cid: result.cid,
        filename: result.filename,
        size: result.size,
        uploadTime: new Date(),
        validation: {
          ...result.validation,
          quality: calculateDataQuality(result.validation)
        }
      };
      
      setDatasetInfo(newDatasetInfo);
      addLog('success', `Dataset uploaded to Walrus with CID: ${result.cid}`);
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Upload failed';
      setError(errorMsg);
      addLog('error', errorMsg);
    } finally {
      setIsUploading(false);
    }
  }, [dataset]);
  
  // Direct training (upload + train)
  const handleDirectTraining = useCallback(async () => {
    if (!dataset) {
      setError('No dataset selected');
      return;
    }
    
    setStatus('preparing');
    setError(null);
    addLog('info', 'Starting direct training workflow...');
    
    try {
      const formData = new FormData();
      formData.append('file', dataset);
      formData.append('model_type', config.modelType);
      formData.append('epochs', config.epochs.toString());
      formData.append('batch_size', config.batchSize.toString());
      formData.append('learning_rate', config.learningRate.toString());
      
      if (config.optimizer) {
        formData.append('optimizer', config.optimizer);
      }
      
      if (config.useValidation) {
        formData.append('validation_split', config.validationSplit?.toString() || '0.2');
      }
      
      const response = await fetch('/api/training/start-with-dataset', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to start training');
      }
      
      const result = await response.json();
      
      setSessionId(result.session_id);
      setStatus('training');
      
      // Set dataset info
      setDatasetInfo({
        cid: result.dataset_cid,
        filename: dataset.name,
        size: dataset.size,
        uploadTime: new Date(),
        validation: {
          isValid: true,
          dataType: dataset.type,
          quality: 85
        }
      });
      
      addLog('success', `Training session started: ${result.session_id}`);
      
      // Start polling for progress
      startProgressPolling(result.session_id);
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Training failed';
      setError(errorMsg);
      setStatus('failed');
      addLog('error', errorMsg);
    }
  }, [dataset, config]);
  
  // Start training with uploaded dataset
  const handleStartTraining = useCallback(async () => {
    if (!datasetInfo) {
      setError('No dataset uploaded');
      return;
    }
    
    if (!datasetInfo.validation.isValid) {
      setError('Dataset validation failed');
      return;
    }
    
    setStatus('preparing');
    setError(null);
    addLog('info', 'Starting training session...');
    
    try {
      const response = await fetch('/api/training/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model_type: config.modelType,
          epochs: config.epochs,
          batch_size: config.batchSize,
          learning_rate: config.learningRate,
          dataset_cid: datasetInfo.cid,
          optimizer: config.optimizer,
          validation_split: config.useValidation ? config.validationSplit : undefined
        })
      });
      
      if (!response.ok) {
        // Try to extract error message from response
        let errorMessage = 'Failed to start training';
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorData.error || errorData.message || errorMessage;
        } catch {
          // If JSON parsing fails, use status text
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      
      if (!result.success) {
        const errorMsg = result.detail || result.error || 'Failed to start training';
        throw new Error(errorMsg);
      }
      
      setSessionId(result.session_id);
      setStatus('training');
      
      addLog('success', `Training started: ${result.session_id}`);
      startProgressPolling(result.session_id);
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Training failed';
      setError(errorMsg);
      setStatus('failed');
      addLog('error', errorMsg);
      console.error('Training start error:', error);
    }
  }, [datasetInfo, config]);
  
  // Progress polling
  const startProgressPolling = useCallback((sessionId: string) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/training/status/${sessionId}`);
        const data = await response.json();
        
        if (data && data.success) {
          // Use data directly since it's no longer wrapped in a session property
          const session = data;
          
          // Update progress
          if (session.progress) {
            setProgress(session.progress);
          }
          
          // Update epoch metrics
          if (session.epochMetrics && Array.isArray(session.epochMetrics)) {
            setEpochMetrics(session.epochMetrics.map((metric: any) => ({
              ...metric,
              timestamp: new Date(metric.timestamp)
            })));
          }
          
          // Update status
          if (session.status === 'completed') {
            setStatus('completed');
            setTotalSessionsCompleted(prev => prev + 1);
            setContributionScore(prev => prev + 100);
            addLog('success', 'Training completed successfully!');
            clearInterval(interval);
            
            // Auto-upload to Walrus
            if (session.result) {
              handleUploadGradients(session.result);
            }
          } else if (session.status === 'failed') {
            setStatus('failed');
            setError(session.error || 'Training failed');
            clearInterval(interval);
          }
        } else if (data && data.session_not_found) {
          // Handle case where session is not found (completed/removed)
          setStatus('completed');
          setTotalSessionsCompleted(prev => prev + 1);
          setContributionScore(prev => prev + 100);
          addLog('success', 'Training completed successfully!');
          clearInterval(interval);
        }
      } catch (error) {
        console.error('Progress polling error:', error);
      }
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Upload gradients to Walrus
  const handleUploadGradients = useCallback(async (result: any) => {
    setStatus('uploading');
    addLog('info', 'Uploading gradients to Walrus...');
    
    try {
      const response = await fetch('/api/walrus/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gradients: result })
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload gradients');
      }
      
      const data = await response.json();
      setWalrusCID(data.cid);
      setStatus('completed');
      
      addLog('success', `Gradients uploaded to Walrus: ${data.cid}`);
      setContributionScore(prev => prev + 50);
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Upload failed';
      addLog('error', errorMsg);
    }
  }, []);
  
  // Control functions
  const pauseTraining = useCallback(() => {
    if (sessionId) {
      fetch(`/api/training/pause/${sessionId}`, {
        method: 'POST'
      });
      setStatus('paused');
      addLog('info', 'Training paused');
    }
  }, [sessionId]);
  
  const resumeTraining = useCallback(() => {
    if (sessionId) {
      fetch(`/api/training/resume/${sessionId}`, {
        method: 'POST'
      });
      setStatus('training');
      addLog('info', 'Training resumed');
    }
  }, [sessionId]);
  
  const stopTraining = useCallback(() => {
    if (sessionId) {
      fetch(`/api/training/stop/${sessionId}`, {
        method: 'POST'
      });
      setStatus('idle');
      addLog('warning', 'Training stopped by user');
    }
  }, [sessionId]);
  
  const resetTraining = useCallback(() => {
    setStatus('idle');
    setProgress(null);
    setEpochMetrics([]);
    setError(null);
    setWalrusCID(null);
    setSessionId(null);
    addLog('info', 'Training reset');
  }, []);
  
  // Utility functions
  const addLog = (level: string, message: string) => {
    setLogs(prev => [...prev, { timestamp: new Date(), level, message }]);
  };
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
  };
  
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };
  
  const calculateDataQuality = (validation: any) => {
    let quality = 100;
    if (validation.errors?.length > 0) quality -= validation.errors.length * 10;
    if (!validation.rowCount || validation.rowCount < 100) quality -= 20;
    return Math.max(0, Math.min(100, quality));
  };
  
  const getStatusBadge = () => {
    const badges = {
      idle: { icon: Info, text: 'Idle', color: 'bg-gray-500' },
      preparing: { icon: Settings, text: 'Preparing', color: 'bg-yellow-500' },
      training: { icon: Activity, text: 'Training', color: 'bg-blue-500' },
      paused: { icon: Pause, text: 'Paused', color: 'bg-orange-500' },
      uploading: { icon: Upload, text: 'Uploading', color: 'bg-purple-500' },
      completed: { icon: CheckCircle2, text: 'Completed', color: 'bg-green-500' },
      failed: { icon: XCircle, text: 'Failed', color: 'bg-red-500' }
    };
    
    const { icon: Icon, text, color } = badges[status];
    return (
      <Badge className={color}>
        <Icon className="h-3 w-3 mr-1" />
        {text}
      </Badge>
    );
  };
  
  // Chart data
  const chartData = epochMetrics.map((metric, index) => ({
    epoch: index + 1,
    loss: parseFloat(metric.loss.toFixed(4)),
    accuracy: parseFloat((metric.accuracy * 100).toFixed(2)),
    valLoss: metric.validationLoss ? parseFloat(metric.validationLoss.toFixed(4)) : undefined,
    valAccuracy: metric.validationAccuracy ? parseFloat((metric.validationAccuracy * 100).toFixed(2)) : undefined
  }));
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Decentralized AI Training Platform
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Contribute to decentralized AI by training models on your local machine and storing gradients on Walrus
              </p>
              <div className="flex gap-2 mt-3">
                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900">
                  <Globe className="h-3 w-3 mr-1" />
                  Walrus Haulout Hackathon
                </Badge>
                <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900">
                  AI x Data Track
                </Badge>
              </div>
            </div>
            <Rocket className="h-16 w-16 text-blue-500" />
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-t-4 border-blue-500 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Sessions Completed</p>
                  <p className="text-3xl font-bold text-blue-600">{totalSessionsCompleted}</p>
                </div>
                <Activity className="h-10 w-10 text-blue-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-green-500 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Training Time</p>
                  <p className="text-3xl font-bold text-green-600">
                    {formatTime(Math.floor(totalTrainingTime / 1000))}
                  </p>
                </div>
                <Clock className="h-10 w-10 text-green-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-purple-500 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Contribution Score</p>
                  <p className="text-3xl font-bold text-purple-600">{contributionScore}</p>
                </div>
                <Award className="h-10 w-10 text-purple-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-t-4 border-orange-500 hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                  <div className="mt-2">{getStatusBadge()}</div>
                </div>
                <Zap className="h-10 w-10 text-orange-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="shadow-lg">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Main Tabs */}
        <Tabs defaultValue="dataset" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 bg-white dark:bg-gray-800 shadow-md">
            <TabsTrigger value="dataset">Dataset</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="control">Control</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
            <TabsTrigger value="rewards">Rewards</TabsTrigger>
          </TabsList>
          
          {/* Dataset Tab */}
          <TabsContent value="dataset">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700">
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-blue-600" />
                  Dataset Management
                </CardTitle>
                <CardDescription>
                  Upload your training dataset to Walrus decentralized storage
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    accept=".csv,.json,.txt,.tsv,.data"
                    onChange={handleDatasetSelect}
                    disabled={isUploading || status === 'training'}
                    className="hidden"
                    id="dataset-upload"
                  />
                  <label htmlFor="dataset-upload" className="cursor-pointer">
                    <Database className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {dataset ? dataset.name : 'Click to upload dataset'}
                    </p>
                    <p className="text-sm text-gray-500">
                      Supported: CSV, JSON, TXT, TSV (max 50MB)
                    </p>
                  </label>
                </div>
                
                {dataset && !datasetInfo && (
                  <div className="flex gap-3">
                    <Button
                      onClick={handleUploadDataset}
                      disabled={isUploading}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      size="lg"
                    >
                      {isUploading ? 'Uploading...' : 'Upload & Validate'}
                    </Button>
                    <Button
                      onClick={handleDirectTraining}
                      disabled={isUploading || status === 'training'}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      <Rocket className="h-4 w-4 mr-2" />
                      Upload & Train Now
                    </Button>
                  </div>
                )}
                
                {datasetInfo && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                      <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">
                        Dataset Ready for Training
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Filename</p>
                        <p className="font-medium">{datasetInfo.filename}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Size</p>
                        <p className="font-medium">{formatFileSize(datasetInfo.size)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Rows</p>
                        <p className="font-medium">{datasetInfo.validation.rowCount?.toLocaleString() || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Quality</p>
                        <div className="flex items-center gap-2">
                          <Progress value={datasetInfo.validation.quality || 0} className="flex-1" />
                          <span className="text-sm font-medium">{datasetInfo.validation.quality}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center gap-2">
                      <Hash className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Walrus CID:</span>
                      <code className="text-sm bg-white dark:bg-gray-800 px-3 py-1 rounded border">
                        {datasetInfo.cid}
                      </code>
                    </div>
                  </div>
                )}
                
                {datasetPreview && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Dataset Preview
                    </h4>
                    <pre className="text-xs overflow-x-auto max-h-48 overflow-y-auto font-mono bg-white dark:bg-gray-900 p-4 rounded border">
                      {datasetPreview}
                      {datasetPreview.length >= 1000 && '\n...(truncated)'}
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Configuration Tab */}
          <TabsContent value="config">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-600" />
                  Training Configuration
                </CardTitle>
                <CardDescription>
                  Fine-tune your model training parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Model Architecture</label>
                    <select
                      value={config.modelType}
                      onChange={(e) => setConfig({...config, modelType: e.target.value as any})}
                      className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500"
                      disabled={status === 'training'}
                    >
                      <option value="mlp">Multi-Layer Perceptron (MLP)</option>
                      <option value="cnn">Convolutional Neural Network (CNN)</option>
                      <option value="rnn">Recurrent Neural Network (RNN)</option>
                      <option value="transformer">Transformer</option>
                    </select>
                    <p className="text-xs text-gray-500">
                      {config.modelType === 'mlp' && '✓ Best for tabular data and simple patterns'}
                      {config.modelType === 'cnn' && '✓ Best for image and spatial data'}
                      {config.modelType === 'rnn' && '✓ Best for sequential and time-series data'}
                      {config.modelType === 'transformer' && '✓ Best for complex sequences and NLP'}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Optimizer</label>
                    <select
                      value={config.optimizer}
                      onChange={(e) => setConfig({...config, optimizer: e.target.value as any})}
                      className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500"
                      disabled={status === 'training'}
                    >
                      <option value="adam">Adam (Recommended)</option>
                      <option value="sgd">SGD with Momentum</option>
                      <option value="rmsprop">RMSprop</option>
                    </select>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Epochs: {config.epochs}</label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={config.epochs}
                      onChange={(e) => setConfig({...config, epochs: parseInt(e.target.value)})}
                      className="w-full"
                      disabled={status === 'training'}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>1</span>
                      <span>50</span>
                      <span>100</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Batch Size: {config.batchSize}</label>
                    <input
                      type="range"
                      min="8"
                      max="256"
                      step="8"
                      value={config.batchSize}
                      onChange={(e) => setConfig({...config, batchSize: parseInt(e.target.value)})}
                      className="w-full"
                      disabled={status === 'training'}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>8</span>
                      <span>128</span>
                      <span>256</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Learning Rate: {config.learningRate}</label>
                    <input
                      type="number"
                      step="0.0001"
                      min="0.0001"
                      max="1"
                      value={config.learningRate}
                      onChange={(e) => setConfig({...config, learningRate: parseFloat(e.target.value)})}
                      className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-purple-500"
                      disabled={status === 'training'}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.useValidation}
                        onChange={(e) => setConfig({...config, useValidation: e.target.checked})}
                        disabled={status === 'training'}
                        className="w-4 h-4"
                      />
                      Use Validation Split
                    </label>
                    {config.useValidation && (
                      <input
                        type="number"
                        step="0.05"
                        min="0.1"
                        max="0.5"
                        value={config.validationSplit}
                        onChange={(e) => setConfig({...config, validationSplit: parseFloat(e.target.value)})}
                        className="w-full p-3 border rounded-lg bg-white dark:bg-gray-800"
                        disabled={status === 'training'}
                      />
                    )}
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Estimated Training Time
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {datasetInfo?.validation.rowCount ? (
                      <>
                        With <span className="font-bold">{datasetInfo.validation.rowCount.toLocaleString()}</span> samples, 
                        <span className="font-bold"> {config.epochs}</span> epochs, and batch size 
                        <span className="font-bold"> {config.batchSize}</span>:
                        <br />
                        <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2 block">
                          ≈ {Math.ceil((datasetInfo.validation.rowCount / config.batchSize) * config.epochs * 0.05 / 60)} minutes
                        </span>
                      </>
                    ) : (
                      'Upload a dataset to see time estimate'
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Control Tab */}
          <TabsContent value="control">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Training Control Center
                </CardTitle>
                <CardDescription>
                  Start, pause, or stop your training session
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {!datasetInfo ? (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Upload a dataset in the Dataset tab before starting training
                    </AlertDescription>
                  </Alert>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-3">
                      {status === 'idle' || status === 'completed' || status === 'failed' ? (
                        <Button
                          onClick={handleStartTraining}
                          size="lg"
                          className="flex-1 min-w-[200px] bg-green-600 hover:bg-green-700 text-lg"
                        >
                          <Play className="mr-2 h-5 w-5" />
                          Start Training
                        </Button>
                      ) : status === 'paused' ? (
                        <Button
                          onClick={resumeTraining}
                          size="lg"
                          className="flex-1 min-w-[200px] bg-blue-600 hover:bg-blue-700 text-lg"
                        >
                          <Play className="mr-2 h-5 w-5" />
                          Resume Training
                        </Button>
                      ) : (
                        <Button
                          onClick={pauseTraining}
                          size="lg"
                          variant="secondary"
                          className="flex-1 min-w-[200px] text-lg"
                        >
                          <Pause className="mr-2 h-5 w-5" />
                          Pause Training
                        </Button>
                      )}
                      
                      <Button
                        onClick={stopTraining}
                        disabled={status === 'idle'}
                        variant="outline"
                        size="lg"
                        className="min-w-[150px]"
                      >
                        <Square className="mr-2 h-4 w-4" />
                        Stop
                      </Button>
                      
                      <Button
                        onClick={resetTraining}
                        disabled={status === 'training'}
                        variant="outline"
                        size="lg"
                        className="min-w-[150px]"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reset
                      </Button>
                    </div>
                    
                    {progress && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Epoch</p>
                            <p className="text-2xl font-bold text-blue-600">{progress.epoch}/{config.epochs}</p>
                          </div>
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Batch</p>
                            <p className="text-2xl font-bold text-green-600">{progress.batch}/{progress.totalBatches}</p>
                          </div>
                          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Loss</p>
                            <p className="text-2xl font-bold text-purple-600">
                              {progress.accuracy !== undefined
                                ? `${(progress.accuracy * 100).toFixed(2)}%`
                                : "N/A"}
                            </p>
                          </div>
                          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Accuracy</p>
                            <p className="text-2xl font-bold text-purple-600">
                              {progress.accuracy ? `${(progress.accuracy * 100).toFixed(2)}%` : 'N/A'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm font-medium">
                            <span>Overall Progress</span>
                            <span>{Math.round(progress.percentage)}%</span>
                          </div>
                          <Progress value={progress.percentage} className="h-4" />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>⏱️ Elapsed: {formatTime(progress.timeElapsed)}</span>
                            <span>⏳ Remaining: {formatTime(progress.estimatedTimeRemaining)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {walrusCID && (
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 border-2 border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 className="h-6 w-6 text-green-600" />
                          <h4 className="font-semibold text-lg">Gradients Uploaded Successfully!</h4>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Hash className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">Walrus CID:</span>
                          <code className="bg-white dark:bg-gray-800 px-3 py-1 rounded border flex-1 min-w-[200px]">
                            {walrusCID}
                          </code>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(walrusCID);
                              addLog('info', 'CID copied to clipboard');
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Metrics Tab */}
          <TabsContent value="metrics">
            <MetricsTab 
              chartData={chartData} 
              statistics={{
                finalLoss: chartData.length > 0 ? chartData[chartData.length - 1].loss : 0,
                finalAccuracy: chartData.length > 0 ? chartData[chartData.length - 1].accuracy / 100 : 0,
                bestLoss: chartData.length > 0 ? Math.min(...chartData.map(d => d.loss)) : 0,
                bestAccuracy: chartData.length > 0 ? Math.max(...chartData.map(d => d.accuracy)) / 100 : 0,
                totalDuration: progress?.timeElapsed || 0,
                modelType: config.modelType
              }} 
            />
          </TabsContent>
          
          {/* Logs Tab */}
          <TabsContent value="logs">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-900 to-gray-800">
                <CardTitle className="flex items-center gap-2 text-white">
                  <FileText className="h-5 w-5" />
                  Training Logs
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="bg-gray-900 text-green-400 p-6 font-mono text-sm h-[500px] overflow-y-auto">
                  {logs.length > 0 ? (
                    logs.map((log, index) => (
                      <div key={index} className="mb-1 hover:bg-gray-800 px-2 py-1 rounded">
                        <span className="text-gray-500">[{log.timestamp.toLocaleTimeString()}]</span>
                        <span className={`ml-2 ${
                          log.level === 'error' ? 'text-red-400' :
                          log.level === 'warning' ? 'text-yellow-400' :
                          log.level === 'success' ? 'text-green-400' :
                          'text-blue-400'
                        }`}>
                          [{log.level.toUpperCase()}]
                        </span>
                        <span className="ml-2">{log.message}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-600 text-center py-12">
                      No logs yet. Training output will appear here.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Network Tab */}
          <TabsContent value="network">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-indigo-600" />
                  Decentralized Network Status
                </CardTitle>
                <CardDescription>
                  Your contribution to the AI training network
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 border-2 border-blue-200 dark:border-blue-800">
                    <Users className="h-8 w-8 text-blue-600 mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Nodes</p>
                    <p className="text-3xl font-bold text-blue-600">500</p>
                    <p className="text-xs text-gray-500 mt-2">Contributing to network</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 border-2 border-green-200 dark:border-green-800">
                    <Database className="h-8 w-8 text-green-600 mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Gradients</p>
                    <p className="text-3xl font-bold text-green-600">20K</p>
                    <p className="text-xs text-gray-500 mt-2">Stored on Walrus</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg p-6 border-2 border-purple-200 dark:border-purple-800">
                    <Activity className="h-8 w-8 text-purple-600 mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Network Health</p>
                    <p className="text-3xl font-bold text-purple-600">95.5%</p>
                    <p className="text-xs text-gray-500 mt-2">Uptime this month</p>
                  </div>
                </div>
                
                <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200">
                  <Info className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-gray-700 dark:text-gray-300">
                    <strong>Walrus Haulout Hackathon</strong> - You're contributing to democratized AI training! 
                    Every training session helps build a truly decentralized AI infrastructure.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Rewards Tab */}
          <TabsContent value="rewards">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-700">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  Rewards & Contributions
                </CardTitle>
                <CardDescription>
                  Track your contribution to the network
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="text-center py-8">
                  <Award className="h-20 w-20 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-4xl font-bold text-yellow-600 mb-2">{contributionScore}</h3>
                  <p className="text-gray-600 dark:text-gray-400">Total Contribution Points</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Training Sessions</p>
                    <p className="text-2xl font-bold text-green-600">{totalSessionsCompleted}</p>
                    <p className="text-xs text-gray-500 mt-1">+100 points each</p>
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Gradients Uploaded</p>
                    <p className="text-2xl font-bold text-purple-600">{walrusCID ? '1' : '0'}</p>
                    <p className="text-xs text-gray-500 mt-1">+50 points each</p>
                  </div>
                </div>
                
                <Alert className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200">
                  <Rocket className="h-4 w-4 text-yellow-600" />
                  <AlertDescription>
                    <strong>Keep Training!</strong> Higher contribution scores unlock future rewards and governance rights in the decentralized AI network.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}