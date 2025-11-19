'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Cpu, 
  Database, 
  Users,
  TrendingUp,
  Clock,
  Filter,
  Download,
  Search,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Award,
  GitBranch,
  RefreshCw,
  ChevronDown,
  Calendar
} from 'lucide-react';

// Define types for our activity data
interface ActivityType {
  id: number;
  title: string;
  description: string;
  time: string;
  timestamp: number;
  type: string;
  user: string;
  priority: string;
  status: string;
}

interface ActivityConfig {
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  textColor: string;
  label: string;
}

interface Stats {
  total: number;
  today: number;
  model: number;
  training: number;
  community: number;
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<ActivityType[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(10);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    today: 0,
    model: 0,
    training: 0,
    community: 0
  });

  // Activity types configuration
  const activityTypes: Record<string, ActivityConfig> = {
    model: {
      icon: Database,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
      label: 'Model'
    },
    training: {
      icon: Cpu,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
      label: 'Training'
    },
    community: {
      icon: Users,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600',
      label: 'Community'
    },
    achievement: {
      icon: Award,
      color: 'yellow',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600',
      label: 'Achievement'
    },
    system: {
      icon: Zap,
      color: 'orange',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600',
      label: 'System'
    },
    milestone: {
      icon: TrendingUp,
      color: 'pink',
      bgColor: 'bg-pink-100',
      textColor: 'text-pink-600',
      label: 'Milestone'
    }
  };

  // Generate realistic activity data
  const generateActivities = (count = 50): ActivityType[] => {
    const activityTemplates = [
      { title: 'Model Update Published', description: 'Version {version} released with improved accuracy', type: 'model', user: 'System', priority: 'high' },
      { title: 'Training Session Completed', description: 'Successfully contributed gradients to model v{version}', type: 'training', user: 'You', priority: 'normal' },
      { title: 'New Contributor Joined', description: 'Welcome to @{username} who joined the network', type: 'community', user: 'Network', priority: 'low' },
      { title: 'Gradient Submission', description: '@{username} submitted gradients for model v{version}', type: 'training', user: '@{username}', priority: 'normal' },
      { title: 'Model Accuracy Improved', description: 'Model v{version} accuracy increased to {accuracy}%', type: 'model', user: 'System', priority: 'high' },
      { title: 'Leaderboard Update', description: 'You moved up to #{rank} in contributor rankings', type: 'achievement', user: 'System', priority: 'normal' },
      { title: 'Network Milestone Reached', description: '{milestone} gradients processed across the network', type: 'milestone', user: 'Network', priority: 'high' },
      { title: 'System Optimization Deployed', description: 'Performance improvements deployed to training infrastructure', type: 'system', user: 'System', priority: 'normal' },
      { title: 'Peer Review Completed', description: '@{username} reviewed your gradient submission', type: 'community', user: '@{username}', priority: 'low' },
      { title: 'Training Reward Received', description: 'Earned {tokens} tokens for contributing to model v{version}', type: 'achievement', user: 'System', priority: 'normal' },
      { title: 'Model Branch Created', description: 'Experimental branch {branch} created for testing', type: 'model', user: 'System', priority: 'low' },
      { title: 'Consensus Achieved', description: 'Network reached consensus on model v{version} parameters', type: 'system', user: 'Network', priority: 'high' },
      { title: 'Contributor Verification', description: '@{username} completed identity verification', type: 'community', user: 'Network', priority: 'low' },
      { title: 'Data Quality Check', description: 'Your training data passed quality validation', type: 'training', user: 'System', priority: 'normal' },
      { title: 'Network Capacity Expanded', description: 'Training capacity increased by {percent}%', type: 'system', user: 'System', priority: 'normal' }
    ];

    const usernames = ['ai_researcher', 'ml_enthusiast', 'data_scientist', 'neural_net_pro', 'deep_learner', 'gradient_master'];
    const versions = ['3.1', '3.2', '3.3', '3.4', '3.5', '4.0'];
    const branches = ['alpha', 'beta', 'gamma', 'delta', 'experimental'];
    
    return Array.from({ length: count }, (_, i) => {
      const template = activityTemplates[Math.floor(Math.random() * activityTemplates.length)];
      const hoursAgo = Math.random() * 168; // Up to 7 days
      const timestamp = Date.now() - (hoursAgo * 3600000);
      
      let description = template.description
        .replace('{version}', versions[Math.floor(Math.random() * versions.length)])
        .replace('{username}', usernames[Math.floor(Math.random() * usernames.length)])
        .replace('{accuracy}', (92 + Math.random() * 6).toFixed(1))
        .replace('{rank}', (Math.floor(Math.random() * 100) + 1).toString())
        .replace('{milestone}', ['1M', '5M', '10M', '50M'][Math.floor(Math.random() * 4)])
        .replace('{tokens}', (Math.floor(Math.random() * 500) + 50).toString())
        .replace('{branch}', branches[Math.floor(Math.random() * branches.length)])
        .replace('{percent}', (Math.floor(Math.random() * 30) + 10).toString());

      let user = template.user
        .replace('{username}', usernames[Math.floor(Math.random() * usernames.length)]);

      return {
        id: timestamp + i,
        title: template.title,
        description,
        time: formatTimeAgo(hoursAgo),
        timestamp,
        type: template.type,
        user,
        priority: template.priority,
        status: ['completed', 'success', 'active', 'pending'][Math.floor(Math.random() * 4)]
      };
    }).sort((a, b) => b.timestamp - a.timestamp);
  };

  const formatTimeAgo = (hours: number): string => {
    if (hours < 0.016) return 'Just now';
    if (hours < 1) return `${Math.floor(hours * 60)} minutes ago`;
    if (hours < 24) return `${Math.floor(hours)} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  // Initialize activities
  useEffect(() => {
    const initialActivities = generateActivities(50);
    setActivities(initialActivities);
    updateStats(initialActivities);
  }, []);

  // Update stats
  const updateStats = (activitiesList: ActivityType[]) => {
    const now = Date.now();
    const oneDayAgo = now - (24 * 3600000);
    
    setStats({
      total: activitiesList.length,
      today: activitiesList.filter((a: ActivityType) => a.timestamp > oneDayAgo).length,
      model: activitiesList.filter((a: ActivityType) => a.type === 'model').length,
      training: activitiesList.filter((a: ActivityType) => a.type === 'training').length,
      community: activitiesList.filter((a: ActivityType) => a.type === 'community').length
    });
  };

  // Filter and search
  useEffect(() => {
    let filtered = activities;

    // Apply type filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(a => a.type === selectedFilter);
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.user.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredActivities(filtered);
  }, [activities, selectedFilter, searchQuery]);

  // Real-time updates - add new activity every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivity = generateActivities(1)[0];
      setActivities(prev => [newActivity, ...prev]);
      setFilteredActivities(prev => [newActivity, ...prev]);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    const newActivities = generateActivities(50);
    setActivities(newActivities);
    updateStats(newActivities);
    setDisplayCount(10);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleExport = () => {
    const data = {
      activities: filteredActivities,
      stats,
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-feed-${Date.now()}.json`;
    a.click();
  };

  const loadMore = () => {
    setDisplayCount(prev => prev + 10);
  };

  const displayedActivities = filteredActivities.slice(0, displayCount);

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Activity Feed
          </h1>
          <p className="text-slate-600 mt-1">
            Real-time events and updates from your decentralized AI network
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="animate-pulse">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            Live Updates
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
            <div className="text-xs text-slate-500 mt-1">Total Activities</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.today}</div>
            <div className="text-xs text-slate-500 mt-1">Today</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">{stats.model}</div>
            <div className="text-xs text-slate-500 mt-1">Model Updates</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">{stats.training}</div>
            <div className="text-xs text-slate-500 mt-1">Training Events</div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">{stats.community}</div>
            <div className="text-xs text-slate-500 mt-1">Community</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
              </button>
            )}
          </div>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('all')}
            className="whitespace-nowrap"
          >
            All Activities
          </Button>
          {Object.entries(activityTypes).map(([key, config]) => (
            <Button
              key={key}
              variant={selectedFilter === key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedFilter(key)}
              className="whitespace-nowrap"
            >
              {config.label}
            </Button>
          ))}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="bg-white"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
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

      {/* Activity Feed */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Recent Activity
            <Badge variant="secondary" className="ml-2">
              {filteredActivities.length} items
            </Badge>
          </CardTitle>
          <CardDescription>
            {selectedFilter === 'all' 
              ? 'All events and updates from your network' 
              : `Showing ${activityTypes[selectedFilter].label.toLowerCase()} activities`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <Activity className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No activities found</p>
              <p className="text-sm text-slate-400 mt-2">Try adjusting your filters or search query</p>
            </div>
          ) : (
            <div className="space-y-4">
              {displayedActivities.map((activity: ActivityType, index: number) => {
                const config = activityTypes[activity.type];
                const Icon = config.icon;
                
                return (
                  <div 
                    key={activity.id}
                    className="flex gap-4 p-4 bg-gradient-to-r from-white to-slate-50 rounded-lg hover:shadow-md transition-all border border-slate-200 animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="flex-shrink-0 mt-1">
                      <div className={`p-3 rounded-full ${config.bgColor} ${config.textColor}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-slate-900">{activity.title}</h3>
                            {activity.priority === 'high' && (
                              <Badge variant="destructive" className="text-xs">High Priority</Badge>
                            )}
                          </div>
                          <p className="text-sm text-slate-600 mt-1">
                            {activity.description}
                          </p>
                        </div>
                        <Badge variant="secondary" className="whitespace-nowrap">
                          {activity.user}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-1 text-slate-500">
                          <Clock className="h-3 w-3" />
                          <span className="text-xs">{activity.time}</span>
                        </div>
                        <Badge 
                          variant={activity.status === 'success' || activity.status === 'completed' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {activity.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Load More */}
      {displayCount < filteredActivities.length && (
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={loadMore}
            className="bg-white shadow-lg"
          >
            <ChevronDown className="h-4 w-4 mr-2" />
            Load More ({filteredActivities.length - displayCount} remaining)
          </Button>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}