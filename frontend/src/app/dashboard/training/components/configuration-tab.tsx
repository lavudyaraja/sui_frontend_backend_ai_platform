'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

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

export default function ConfigurationTab({ 
  config, 
  setConfig,
  datasetInfo
}: { 
  config: any;
  setConfig: (config: any) => void;
  datasetInfo: DatasetInfo | null;
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Training Configuration</CardTitle>
        <CardDescription>
          Configure your training parameters
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="modelType">Model Type</Label>
            <Select
              value={config.modelType}
              onValueChange={(value: any) => setConfig({ ...config, modelType: value })}
            >
              <SelectTrigger id="modelType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mlp">Multi-Layer Perceptron (MLP)</SelectItem>
                <SelectItem value="cnn">Convolutional Neural Network (CNN)</SelectItem>
                <SelectItem value="rnn">Recurrent Neural Network (RNN)</SelectItem>
                <SelectItem value="transformer">Transformer</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {config.modelType === 'mlp' && 'Best for tabular data and simple patterns'}
              {config.modelType === 'cnn' && 'Best for image and spatial data'}
              {config.modelType === 'rnn' && 'Best for sequential and time-series data'}
              {config.modelType === 'transformer' && 'Best for complex sequences and NLP tasks'}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="epochs">Epochs: {config.epochs}</Label>
            <Slider
              id="epochs"
              min={1}
              max={50}
              step={1}
              value={[config.epochs]}
              onValueChange={([value]) => setConfig({ ...config, epochs: value })}
            />
            <p className="text-xs text-muted-foreground">
              Number of complete passes through the dataset
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="batchSize">Batch Size: {config.batchSize}</Label>
            <Slider
              id="batchSize"
              min={8}
              max={128}
              step={8}
              value={[config.batchSize]}
              onValueChange={([value]) => setConfig({ ...config, batchSize: value })}
            />
            <p className="text-xs text-muted-foreground">
              Number of samples processed before updating model
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="learningRate">Learning Rate</Label>
            <Input
              id="learningRate"
              type="number"
              step="0.0001"
              min="0.0001"
              max="1"
              value={config.learningRate}
              onChange={(e) => setConfig({ ...config, learningRate: parseFloat(e.target.value) })}
            />
            <p className="text-xs text-muted-foreground">
              Step size for weight updates (typically 0.0001 - 0.01)
            </p>
          </div>
        </div>
        
        <div className="p-4 bg-muted/50 rounded-lg space-y-2">
          <h4 className="font-medium">Estimated Training Time</h4>
          <p className="text-sm text-muted-foreground">
            {datasetInfo && datasetInfo.validation.rowCount ? (
              <>
                With {datasetInfo.validation.rowCount} samples, {config.epochs} epochs, and batch size {config.batchSize}:
                <br />
                Approximately {Math.ceil((datasetInfo.validation.rowCount / config.batchSize) * config.epochs * 0.05 / 60)} minutes
              </>
            ) : (
              'Upload a dataset to see time estimate'
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}