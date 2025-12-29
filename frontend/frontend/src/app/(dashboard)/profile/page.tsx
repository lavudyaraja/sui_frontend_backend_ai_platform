'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  TrendingUp, 
  Award,
  Zap,
  Shield
} from 'lucide-react';

// Import components (these would be separate files in your project)
import UserProfile from './components/user-profile';
import ReputationHistory from './components/reputation-history';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-10 blur-3xl" />
          <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Your Profile
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    View and manage your DeepSurge profile and reputation
                  </p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 px-4 py-2 text-sm">
                <Zap className="w-4 h-4 mr-1" />
                Level 5 Contributor
              </Badge>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Reputation</span>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">156</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12 this week
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Training</span>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">42</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Sessions completed</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 rounded-xl p-4 border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">Rank</span>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">#245</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +15 positions
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 mb-1">
                  <Shield className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-medium text-orange-600 dark:text-orange-400">Verified</span>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">Yes</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Active member</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* User Profile Section - Takes 2 columns */}
          <div className="xl:col-span-2">
            <UserProfile />
          </div>

          {/* Reputation History Section - Takes 1 column */}
          <div className="xl:col-span-1">
            <ReputationHistory />
          </div>
        </div>

        {/* Hackathon Integration Banner */}
        <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 border-0 shadow-2xl rounded-2xl overflow-hidden">
          <div className="p-6 relative">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative flex items-start gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">
                  Walrus Haulout Hackathon Participant
                </h3>
                <p className="text-blue-100 mb-4">
                  Your profile is optimized for the hackathon with full integration of Walrus storage, 
                  Seal security, and Nautilus AI orchestration. Track your contributions and compete for prizes!
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    Data Marketplaces
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    AI x Data
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    Provably Authentic
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                    Data Security
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}