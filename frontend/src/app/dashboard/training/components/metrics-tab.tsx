'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';

export default function MetricsTab({ 
  chartData,
  statistics
}: { 
  chartData: any[];
  statistics: any;
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

  // Ensure chartData is properly formatted
  const formattedChartData = Array.isArray(chartData) ? chartData.map((data, index) => ({
    ...data,
    epoch: data.epoch || index + 1,
    loss: typeof data.loss === 'number' ? data.loss : 0,
    accuracy: typeof data.accuracy === 'number' ? data.accuracy : 0
  })) : [];

  return (
    <>
      {formattedChartData && formattedChartData.length > 0 ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Loss Over Epochs</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formattedChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="epoch" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="loss" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Accuracy Over Epochs</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={formattedChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="epoch" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="accuracy" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          {statistics && (
            <Card>
              <CardHeader>
                <CardTitle>Training Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Final Loss</p>
                    <p className="text-xl font-semibold">{statistics.finalLoss?.toFixed(4) || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Final Accuracy</p>
                    <p className="text-xl font-semibold">
                      {statistics.finalAccuracy ? (statistics.finalAccuracy * 100).toFixed(2) + '%' : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Best Loss</p>
                    <p className="text-xl font-semibold">{statistics.bestLoss?.toFixed(4) || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Best Accuracy</p>
                    <p className="text-xl font-semibold">
                      {statistics.bestAccuracy ? (statistics.bestAccuracy * 100).toFixed(2) + '%' : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Duration</p>
                    <p className="text-xl font-semibold">
                      {statistics.totalDuration ? formatTime(Math.floor(statistics.totalDuration / 1000)) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Model Type</p>
                    <p className="text-xl font-semibold uppercase">{statistics.modelType || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BarChart3 className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No metrics available yet</p>
            <p className="text-sm text-muted-foreground">Start training to see charts</p>
          </CardContent>
        </Card>
      )}
    </>
  );
}