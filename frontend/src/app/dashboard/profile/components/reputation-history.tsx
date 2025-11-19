'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Star,
  Database,
  Brain,
  Users,
  Target
} from 'lucide-react';

export default function ReputationHistory() {
  const history = [
    { 
      date: '2024-11-15', 
      action: 'Completed AI Training Session', 
      change: '+12', 
      total: '156',
      type: 'training',
      icon: Brain,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    { 
      date: '2024-11-14', 
      action: 'Data Marketplace Sale', 
      change: '+8', 
      total: '144',
      type: 'marketplace',
      icon: Database,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    { 
      date: '2024-11-12', 
      action: 'Model Validation Success', 
      change: '+15', 
      total: '136',
      type: 'validation',
      icon: CheckCircle2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    },
    { 
      date: '2024-11-10', 
      action: 'Peer Review Contribution', 
      change: '+5', 
      total: '121',
      type: 'peer',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30'
    },
    { 
      date: '2024-11-08', 
      action: 'Quality Dataset Submission', 
      change: '+10', 
      total: '116',
      type: 'data',
      icon: Database,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    { 
      date: '2024-11-05', 
      action: 'Milestone Achievement', 
      change: '+20', 
      total: '106',
      type: 'milestone',
      icon: Target,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100 dark:bg-pink-900/30'
    },
    { 
      date: '2024-11-01', 
      action: 'Training Session Completed', 
      change: '+8', 
      total: '86',
      type: 'training',
      icon: Brain,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    { 
      date: '2024-10-28', 
      action: 'Community Contribution', 
      change: '+6', 
      total: '78',
      type: 'community',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30'
    },
  ];

  const reputationBreakdown = [
    { category: 'Training Sessions', points: 68, percentage: 44, color: 'bg-blue-500' },
    { category: 'Data Marketplace', points: 42, percentage: 27, color: 'bg-green-500' },
    { category: 'Peer Reviews', points: 28, percentage: 18, color: 'bg-purple-500' },
    { category: 'Milestones', points: 18, percentage: 11, color: 'bg-pink-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Main Card */}
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                Reputation History
              </CardTitle>
              <CardDescription className="mt-1">
                Track your reputation growth and contributions
              </CardDescription>
            </div>
            <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-500/30 text-lg px-4 py-2">
              <Award className="w-4 h-4 mr-1" />
              156 Points
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {history.map((item, index) => {
              const Icon = item.icon;
              return (
                <div 
                  key={index} 
                  className="group relative flex items-center justify-between p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-3 ${item.bgColor} rounded-xl shadow-sm`}>
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {item.action}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-2">
                        {item.date}
                        <Badge className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px]">
                          {item.type}
                        </Badge>
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {item.change}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Total: <span className="font-semibold">{item.total}</span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Reputation Breakdown */}
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-slate-200 dark:border-slate-800">
          <CardTitle className="text-xl flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            Reputation Breakdown
          </CardTitle>
          <CardDescription>
            How you earned your reputation points
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {reputationBreakdown.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 ${item.color} rounded-full`} />
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.points}
                    </span>
                    <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs">
                      {item.percentage}%
                    </Badge>
                  </div>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`${item.color} h-2 rounded-full transition-all duration-500`} 
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                    Top 10% Contributor
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    You're in the top 10% of contributors on DeepSurge! Keep up the excellent work 
                    to maintain your status and unlock exclusive benefits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}