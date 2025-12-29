'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

// Mock data - in a real app this would come from an API
const accuracyData = [
  { model: 'Vision Transformer v2.8', accuracy: 89.2, contributors: 942 },
  { model: 'Vision Transformer v3.0', accuracy: 90.5, contributors: 1089 },
  { model: 'Vision Transformer v3.1', accuracy: 91.8, contributors: 1156 },
  { model: 'Vision Transformer v3.2', accuracy: 92.4, contributors: 1248 },
];

export function AccuracyChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Accuracy Comparison</CardTitle>
        <CardDescription>
          Accuracy improvements across model versions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={accuracyData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 60,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="model" 
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis domain={[85, 95]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="accuracy" name="Accuracy (%)" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}