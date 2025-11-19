'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Users, 
  Activity, 
  TrendingUp, 
  Clock, 
  Award, 
  Zap,
  Play,
  Pause,
  Square,
  ExternalLink
} from 'lucide-react';
import { ProgressChart } from '@/components/charts/progress-chart';
import { AccuracyChart } from '@/components/charts/accuracy-chart';
import { ContributorsChart } from '@/components/charts/contributors-chart';
import { useTrainingStore } from '@/store/useTrainingStore';
import { useModelStore } from '@/store/useModelStore';
import Link from 'next/link';

// Mock data for stats
const statsData = [
  { title: 'Active Models', value: '24', change: '+3', icon: Brain, color: 'text-blue-500' },
  { title: 'Contributors', value: '1,248', change: '+12%', icon: Users, color: 'text-green-500' },
  { title: 'Training Sessions', value: '876', change: '+8%', icon: Activity, color: 'text-purple-500' },
  { title: 'Avg. Accuracy', value: '92.4%', change: '+1.2%', icon: TrendingUp, color: 'text-indigo-500' },
];

// Mock recent activity data
const recentActivity = [
  { id: 1, user: '0x1a2b...cdef', action: 'completed training session', model: 'Vision Transformer v3.2', time: '2 min ago' },
  { id: 2, user: '0x9f8e...2a3b', action: 'submitted gradients', model: 'NLP Transformer v1.5', time: '15 min ago' },
  { id: 3, user: '0x4a5b...3c4d', action: 'joined network', model: '-', time: '1 hour ago' },
  { id: 4, user: '0x2b3c...0b1c', action: 'validated model', model: 'Vision Transformer v3.1', time: '3 hours ago' },
];

export default function Dashboard() {
  const { currentSession, getActiveSession } = useTrainingStore();
  const { currentModel } = useModelStore();
  const [timeElapsed, setTimeElapsed] = useState(0);

  // Calculate elapsed time for active session
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (currentSession?.startTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = now.getTime() - new Date(currentSession.startTime).getTime();
        setTimeElapsed(Math.floor(diff / 1000)); // seconds
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentSession?.startTime]);

  // Format time for display
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get active session
  const activeSession = getActiveSession() || currentSession;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your AI training.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/training">
              <Play className="mr-2 h-4 w-4" />
              Start Training
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/model">
              View Models
              <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-500">↑</span> {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Training Session */}
      {activeSession ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Active Training Session</span>
              <Badge 
                variant={
                  activeSession.status === 'training' ? 'default' : 
                  activeSession.status === 'paused' ? 'secondary' : 
                  activeSession.status === 'failed' ? 'destructive' : 'outline'
                }
              >
                {activeSession.status.charAt(0).toUpperCase() + activeSession.status.slice(1)}
              </Badge>
            </CardTitle>
            <CardDescription>
              {activeSession.modelType} model training in progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Epoch {activeSession.currentEpoch} of {activeSession.totalEpochs}</p>
                <p className="text-sm text-muted-foreground">
                  Session ID: {activeSession.id.substring(0, 8)}...
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatTime(timeElapsed)}</p>
                <p className="text-sm text-muted-foreground">Time elapsed</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{activeSession.progress.toFixed(1)}%</span>
              </div>
              <Progress value={activeSession.progress} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  Accuracy
                </div>
                <p className="text-lg font-semibold">{activeSession.accuracy.toFixed(2)}%</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="h-4 w-4" />
                  Loss
                </div>
                <p className="text-lg font-semibold">{activeSession.loss.toFixed(4)}</p>
              </div>
            </div>
            
            <div className="flex gap-2 pt-2">
              <Button size="sm" disabled={activeSession.status !== 'paused'}>
                <Play className="mr-2 h-4 w-4" />
                Resume
              </Button>
              <Button size="sm" variant="secondary" disabled={activeSession.status !== 'training'}>
                <Pause className="mr-2 h-4 w-4" />
                Pause
              </Button>
              <Button size="sm" variant="destructive">
                <Square className="mr-2 h-4 w-4" />
                Stop
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Active Training Session</CardTitle>
            <CardDescription>
              Start a new training session to begin contributing to decentralized AI models.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/training">
                <Play className="mr-2 h-4 w-4" />
                Start Training
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressChart />
        <AccuracyChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest contributions to the network
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="bg-muted rounded-full p-2 mt-0.5">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{activity.user}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.action} {activity.model !== '-' && `on ${activity.model}`}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <ContributorsChart />
      </div>
    </div>
  );
}