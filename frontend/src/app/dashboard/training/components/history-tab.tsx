'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface TrainingSession {
  id: string;
  startTime: string;
  endTime?: string;
  status: 'completed' | 'failed' | 'in-progress';
  modelType: string;
  accuracy: number;
  loss: number;
  totalEpochs: number;
}

export default function HistoryTab({ recentSessions }: { recentSessions: TrainingSession[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Training Sessions</CardTitle>
        <CardDescription>Your training history</CardDescription>
      </CardHeader>
      <CardContent>
        {recentSessions.length > 0 ? (
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <div key={session.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                      {session.status}
                    </Badge>
                    <span className="text-sm font-medium uppercase">{session.modelType}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(session.startTime).toLocaleString()}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Accuracy</p>
                    <p className="font-semibold">{(session.accuracy * 100).toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Loss</p>
                    <p className="font-semibold">{session.loss.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Epochs</p>
                    <p className="font-semibold">{session.totalEpochs}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <Clock className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No training history yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}