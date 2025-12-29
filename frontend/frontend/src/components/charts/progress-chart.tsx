'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// Mock data - in a real app this would come from an API
const progressData = [
  { epoch: 1, accuracy: 65.2, loss: 0.85 },
  { epoch: 2, accuracy: 72.1, loss: 0.72 },
  { epoch: 3, accuracy: 76.8, loss: 0.65 },
  { epoch: 4, accuracy: 80.3, loss: 0.58 },
  { epoch: 5, accuracy: 82.7, loss: 0.52 },
  { epoch: 6, accuracy: 84.5, loss: 0.47 },
  { epoch: 7, accuracy: 86.1, loss: 0.43 },
  { epoch: 8, accuracy: 87.4, loss: 0.39 },
  { epoch: 9, accuracy: 88.6, loss: 0.36 },
  { epoch: 10, accuracy: 89.7, loss: 0.33 },
  { epoch: 11, accuracy: 90.5, loss: 0.30 },
  { epoch: 12, accuracy: 91.2, loss: 0.28 },
  { epoch: 13, accuracy: 91.8, loss: 0.26 },
  { epoch: 14, accuracy: 92.1, loss: 0.24 },
  { epoch: 15, accuracy: 92.4, loss: 0.22 },
];

export function ProgressChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Training Progress</CardTitle>
        <CardDescription>
          Model accuracy and loss over training epochs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={progressData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="epoch" 
                label={{ value: 'Epoch', position: 'insideBottom', offset: -5 }} 
              />
              <YAxis yAxisId="left" domain={[60, 100]} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 1]} />
              <Tooltip />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="accuracy"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                name="Accuracy (%)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="loss"
                stroke="#82ca9d"
                name="Loss"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}