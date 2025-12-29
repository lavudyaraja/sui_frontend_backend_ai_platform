'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Database,
  Clock,
  Target,
  Download,
  RefreshCw,
  Calendar,
  Activity,
  Cpu,
  Zap,
  Globe
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Define types for our data
interface PerformanceData {
  name: string;
  accuracy: number;
  loss: number;
  throughput: number;
}

interface ContributorData {
  name: string;
  active: number;
  new: number;
  churned: number;
}

interface ActivityLog {
  id: number;
  label: string;
  time: string;
  type: string;
  status: string;
}

interface RegionData {
  name: string;
  value: number;
  color: string;
}

interface LiveMetrics {
  totalHours: number;
  activeContributors: number;
  modelAccuracy: number;
  gradientsProcessed: number;
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState<LiveMetrics>({
    totalHours: 1248,
    activeContributors: 342,
    modelAccuracy: 94.2,
    gradientsProcessed: 8742
  });
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [contributorData, setContributorData] = useState<ContributorData[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [regionData, setRegionData] = useState<RegionData[]>([]);

  // Generate realistic data
  const generatePerformanceData = (): PerformanceData[] => {
    const days = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30;
    return Array.from({ length: days }, (_, i) => ({
      name: timeRange === '24h' ? `${i}:00` : `Day ${i + 1}`,
      accuracy: 85 + Math.random() * 10 + (i * 0.3),
      loss: 0.5 - (i * 0.015) + Math.random() * 0.1,
      throughput: 100 + Math.random() * 50 + (i * 2)
    }));
  };

  const generateContributorData = (): ContributorData[] => {
    const days = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30;
    return Array.from({ length: days }, (_, i) => ({
      name: timeRange === '24h' ? `${i}:00` : `Day ${i + 1}`,
      active: Math.floor(200 + Math.random() * 150 + (i * 5)),
      new: Math.floor(10 + Math.random() * 20),
      churned: Math.floor(5 + Math.random() * 10)
    }));
  };

  const generateActivityLog = (): ActivityLog[] => {
    const activities = [
      { type: 'model_update', label: 'Model Update', variants: ['v3.2', 'v3.3', 'v3.4', 'v3.5'] },
      { type: 'training', label: 'Training Session', variants: ['#8742', '#8743', '#8744', '#8745'] },
      { type: 'contributor', label: 'New Contributor', variants: ['joined', 'verified', 'onboarded'] },
      { type: 'milestone', label: 'Milestone Reached', variants: ['1M gradients', '500 contributors', '95% accuracy'] },
      { type: 'optimization', label: 'System Optimization', variants: ['deployed', 'completed', 'tested'] }
    ];

    return Array.from({ length: 10 }, (_, i) => {
      const activity = activities[Math.floor(Math.random() * activities.length)];
      const variant = activity.variants[Math.floor(Math.random() * activity.variants.length)];
      const timeAgo = Math.floor(Math.random() * 24);
      
      return {
        id: Date.now() + i,
        label: `${activity.label} ${variant}`,
        time: timeAgo === 0 ? 'Just now' : timeAgo < 1 ? `${Math.floor(timeAgo * 60)} minutes ago` : `${timeAgo} hours ago`,
        type: activity.type,
        status: ['Completed', 'Success', 'Active', 'Deployed'][Math.floor(Math.random() * 4)]
      };
    });
  };

  const generateRegionData = (): RegionData[] => {
    return [
      { name: 'North America', value: 45, color: '#3b82f6' },
      { name: 'Europe', value: 30, color: '#10b981' },
      { name: 'Asia', value: 18, color: '#f59e0b' },
      { name: 'Others', value: 7, color: '#6366f1' }
    ];
  };

  // Initialize data
  useEffect(() => {
    setPerformanceData(generatePerformanceData());
    setContributorData(generateContributorData());
    setActivityLog(generateActivityLog());
    setRegionData(generateRegionData());
  }, [timeRange]);

  // Real-time updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        totalHours: prev.totalHours + Math.floor(Math.random() * 5),
        activeContributors: prev.activeContributors + Math.floor(Math.random() * 3) - 1,
        modelAccuracy: Math.min(99.9, prev.modelAccuracy + (Math.random() * 0.2 - 0.1)),
        gradientsProcessed: prev.gradientsProcessed + Math.floor(Math.random() * 50)
      }));

      // Update activity log occasionally
      if (Math.random() > 0.7) {
        setActivityLog(generateActivityLog());
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setPerformanceData(generatePerformanceData());
    setContributorData(generateContributorData());
    setActivityLog(generateActivityLog());
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleExport = () => {
    const data = {
      metrics: liveMetrics,
      performance: performanceData,
      contributors: contributorData,
      activity: activityLog,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${Date.now()}.json`;
    a.click();
  };

  const metrics = [
    {
      title: "Total Training Hours",
      value: liveMetrics.totalHours.toLocaleString(),
      icon: Clock,
      change: "+12%",
      changeType: "positive",
      trend: "↑"
    },
    {
      title: "Active Contributors",
      value: liveMetrics.activeContributors.toLocaleString(),
      icon: Users,
      change: "+8%",
      changeType: "positive",
      trend: "↑"
    },
    {
      title: "Model Accuracy",
      value: `${liveMetrics.modelAccuracy.toFixed(1)}%`,
      icon: Target,
      change: "+2.1%",
      changeType: "positive",
      trend: "↑"
    },
    {
      title: "Gradients Processed",
      value: liveMetrics.gradientsProcessed.toLocaleString(),
      icon: Database,
      change: "+15%",
      changeType: "positive",
      trend: "↑"
    }
  ];

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-slate-600 mt-1">
            Real-time insights into your decentralized AI training performance
          </p>
        </div>
        
        <div className="flex gap-2">
          <div className="flex gap-1 bg-white rounded-lg p-1 shadow-sm">
            {['24h', '7d', '30d'].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setTimeRange(range)}
                className="text-xs"
              >
                {range === '24h' ? '24 Hours' : range === '7d' ? '7 Days' : '30 Days'}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-white"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="bg-white"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full -mr-16 -mt-16" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {metric.title}
                </CardTitle>
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                  <Icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{metric.value}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-green-600 text-sm font-medium">
                    {metric.trend} {metric.change}
                  </span>
                  <span className="text-xs text-slate-500">from last period</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Training Performance
            </CardTitle>
            <CardDescription>
              Model accuracy and loss metrics over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', r: 4 }}
                  name="Accuracy (%)"
                />
                <Line 
                  type="monotone" 
                  dataKey="loss" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ef4444', r: 4 }}
                  name="Loss"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Contributor Activity
            </CardTitle>
            <CardDescription>
              Active, new, and churned contributors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={contributorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="active" 
                  stackId="1"
                  stroke="#10b981" 
                  fill="#10b981"
                  fillOpacity={0.6}
                  name="Active"
                />
                <Area 
                  type="monotone" 
                  dataKey="new" 
                  stackId="1"
                  stroke="#3b82f6" 
                  fill="#3b82f6"
                  fillOpacity={0.6}
                  name="New"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-600" />
              Regional Distribution
            </CardTitle>
            <CardDescription>
              Contributors by geographic region
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={regionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {regionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-orange-600" />
              System Throughput
            </CardTitle>
            <CardDescription>
              Processing capacity and efficiency
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
                <Legend />
                <Bar 
                  dataKey="throughput" 
                  fill="#f59e0b"
                  radius={[8, 8, 0, 0]}
                  name="Throughput (ops/sec)"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity Log */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Live Activity Feed
              </CardTitle>
              <CardDescription>
                Real-time updates from your AI training network
              </CardDescription>
            </div>
            <Badge variant="secondary" className="animate-pulse">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              Live
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activityLog.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg hover:shadow-md transition-shadow border border-slate-200"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'model_update' ? 'bg-blue-500' :
                    activity.type === 'training' ? 'bg-green-500' :
                    activity.type === 'contributor' ? 'bg-purple-500' :
                    activity.type === 'milestone' ? 'bg-yellow-500' :
                    'bg-orange-500'
                  }`} />
                  <div>
                    <p className="font-medium text-slate-900">{activity.label}</p>
                    <p className="text-sm text-slate-500">{activity.time}</p>
                  </div>
                </div>
                <Badge 
                  variant={activity.status === 'Success' || activity.status === 'Completed' ? 'default' : 'secondary'}
                  className="font-medium"
                >
                  {activity.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}