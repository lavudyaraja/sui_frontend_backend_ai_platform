'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface TrainingProgressProps {
  progress: number;
}

export function TrainingProgress({ progress }: TrainingProgressProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Training Progress</CardTitle>
        <CardDescription>
          Monitor your local model training session
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Epoch 15/20</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold">87.5%</div>
            <div className="text-xs text-gray-500">Accuracy</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold">0.024</div>
            <div className="text-xs text-gray-500">Loss</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-2xl font-bold">32</div>
            <div className="text-xs text-gray-500">Batch Size</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}