'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface LogEntry {
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
}

export default function LogsTab({ logs }: { logs: LogEntry[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Training Logs</CardTitle>
        <CardDescription>Real-time training output</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-xs h-96 overflow-y-auto">
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <div key={index} className="mb-1">
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
            <div className="text-gray-500">No logs yet. Start training to see output.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}