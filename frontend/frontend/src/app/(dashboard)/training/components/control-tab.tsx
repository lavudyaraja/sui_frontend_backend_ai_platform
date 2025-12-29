'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Square,
  Upload, 
  AlertCircle,
  CheckCircle2,
  Hash,
  Download,
  RefreshCw
} from 'lucide-react';
import { toast } from '@/lib/hooks/use-toast';

interface DatasetInfo {
  cid: string;
  filename: string;
  size: number;
  validation: {
    isValid: boolean;
    rowCount?: number;
    columnCount?: number;
    dataType?: string;
    errors?: string[];
  };
}

interface ProgressInfo {
  epoch: number;
  batch: number;
  totalBatches: number;
  loss: number;
  accuracy?: number;
  percentage: number;
  timeElapsed: number;
  estimatedTimeRemaining: number;
}

interface Config {
  modelType: 'mlp' | 'cnn' | 'rnn' | 'transformer';
  epochs: number;
  batchSize: number;
  learningRate: number;
}

// Define the correct type for startTraining
interface StartTrainingOptions {
  modelType: 'mlp' | 'cnn' | 'rnn' | 'transformer';
  epochs: number;
  batchSize: number;
  learningRate: number;
  datasetCID?: string;
  onProgress?: (progress: any) => void;
  onLog?: (log: any) => void;
  onEpochComplete?: (metrics: any) => void;
}

export default function ControlTab({ 
  datasetInfo,
  isTraining,
  isPaused,
  progress,
  result,
  walrusCID,
  config,
  startTraining,
  pauseTraining,
  resumeTraining,
  stopTraining,
  handleUpload
}: { 
  datasetInfo: DatasetInfo | null;
  isTraining: boolean;
  isPaused: boolean;
  progress: ProgressInfo | null;
  result: any;
  walrusCID: string | null;
  config: Config;
  startTraining: (options: StartTrainingOptions) => Promise<any>;
  pauseTraining: () => void;
  resumeTraining: () => void;
  stopTraining: () => Promise<void>;
  handleUpload: () => Promise<void>;
}) {
  // Format time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Training Control</CardTitle>
        <CardDescription>
          Manage your local training session
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dataset Status */}
        {!datasetInfo ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No dataset uploaded. Please upload a dataset in the Dataset tab before starting training.
            </AlertDescription>
          </Alert>
        ) : !datasetInfo.validation.isValid ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Dataset validation failed. Please check the Dataset tab for errors.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-green-500">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-900 dark:text-green-100">
              Dataset ready: {datasetInfo.filename} ({formatFileSize(datasetInfo.size)})
            </AlertDescription>
          </Alert>
        )}
        
        {/* Control Buttons */}
        <div className="flex flex-wrap gap-3">
          {!isTraining ? (
            <Button 
              onClick={() => startTraining({
                modelType: config.modelType,
                epochs: config.epochs,
                batchSize: config.batchSize,
                learningRate: config.learningRate,
                datasetCID: datasetInfo?.cid
              })} 
              disabled={!datasetInfo || !datasetInfo.validation.isValid}
              size="lg"
              className="min-w-[150px]"
            >
              <Play className="mr-2 h-4 w-4" />
              Start Training
            </Button>
          ) : isPaused ? (
            <Button onClick={resumeTraining} size="lg" className="min-w-[150px]">
              <Play className="mr-2 h-4 w-4" />
              Resume Training
            </Button>
          ) : (
            <Button onClick={pauseTraining} variant="secondary" size="lg" className="min-w-[150px]">
              <Pause className="mr-2 h-4 w-4" />
              Pause Training
            </Button>
          )}
          
          <Button 
            variant="outline"
            onClick={stopTraining}
            disabled={!isTraining}
            size="lg"
          >
            <Square className="mr-2 h-4 w-4" />
            Stop
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => {
              // Reset training logic would go here
            }}
            disabled={isTraining}
            size="lg"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
        
        {/* Progress Section */}
        {progress && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Current Epoch</p>
                <p className="text-lg font-semibold">{progress.epoch} / {config.epochs}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Batch Progress</p>
                <p className="text-lg font-semibold">{progress.batch} / {progress.totalBatches}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Current Loss</p>
                <p className="text-lg font-semibold">{progress.loss.toFixed(4)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <p className="text-lg font-semibold">
                  {progress.accuracy ? `${(progress.accuracy * 100).toFixed(2)}%` : 'N/A'}
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{Math.round(progress.percentage)}%</span>
              </div>
              <Progress value={progress.percentage} className="h-3" />
            </div>
            
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Time Elapsed: {formatTime(progress.timeElapsed)}</span>
              <span>Est. Remaining: {formatTime(progress.estimatedTimeRemaining)}</span>
            </div>
          </div>
        )}
        
        {/* Upload Section */}
        {result && !walrusCID && (
          <div className="pt-4 border-t">
            <Button onClick={handleUpload} size="lg" className="w-full md:w-auto">
              <Upload className="mr-2 h-4 w-4" />
              Upload Gradients to Walrus
            </Button>
          </div>
        )}
        
        {/* Walrus CID */}
        {walrusCID && (
          <Alert>
            <Hash className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>Gradients CID: {walrusCID}</span>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  navigator.clipboard.writeText(walrusCID);
                  toast({
                    title: "CID copied to clipboard"
                  });
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}