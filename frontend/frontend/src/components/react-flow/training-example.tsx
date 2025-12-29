'use client';

import React from 'react';
import TrainingWorkflow from './training-workflow';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const TrainingFlowExample = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Training Workflow Visualization</CardTitle>
        <CardDescription>
          Visualize the AI training process flow with React Flow
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            This diagram shows the typical workflow of the AI training process in this application:
          </p>
          <ul className="list-disc list-inside mt-2 text-sm text-muted-foreground">
            <li>Dataset is uploaded to Walrus storage</li>
            <li>Model training begins using the uploaded dataset</li>
            <li>Training gradients are stored back to Walrus</li>
          </ul>
        </div>
        <TrainingWorkflow />
      </CardContent>
    </Card>
  );
};

export default TrainingFlowExample;