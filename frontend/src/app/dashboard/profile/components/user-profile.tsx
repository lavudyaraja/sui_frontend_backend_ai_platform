'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Wallet, 
  Award, 
  Mail, 
  Shield, 
  TrendingUp,
  Save,
  Camera,
  CheckCircle2,
  Star
} from 'lucide-react';

export default function UserProfile() {
  // Mock data since we don't have the actual store
  const [userAddress] = useState("0x1a2b3c4d5e6f7890abcdef1234567890abcdef12");
  const [userReputation] = useState(156);
  const [displayName, setDisplayName] = useState("AI Researcher");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdate = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Profile updated successfully!');
    }, 1500);
  };

  const profileStats = [
    { label: 'Reputation Score', value: userReputation, icon: Award, color: 'text-purple-600', trend: '+12%' },
    { label: 'Training Sessions', value: '42', icon: TrendingUp, color: 'text-blue-600', trend: '+8' },
    { label: 'Rank', value: '#245', icon: Star, color: 'text-orange-600', trend: '+15' },
    { label: 'Contributions', value: '18', icon: CheckCircle2, color: 'text-green-600', trend: '+3' },
  ];

  const achievements = [
    { name: 'Early Adopter', desc: 'Joined the platform', icon: Shield, color: 'bg-blue-500' },
    { name: 'Data Provider', desc: 'Shared quality datasets', icon: TrendingUp, color: 'bg-green-500' },
    { name: 'Top Trainer', desc: 'Completed 50+ sessions', icon: Award, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 relative">
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative flex items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-800 shadow-xl flex items-center justify-center border-4 border-white">
                <User className="w-12 h-12 text-slate-600 dark:text-slate-400" />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 transition-colors opacity-0 group-hover:opacity-100">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-white mb-1">{displayName || 'Anonymous User'}</h2>
              <p className="text-blue-100 mb-3">DeepSurge Platform Member</p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  Verified
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  Active Contributor
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                  Level 5
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Grid */}
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {profileStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm ${stat.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs">
                      {stat.trend}
                    </Badge>
                  </div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Information */}
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-slate-200 dark:border-slate-800">
            <CardTitle className="text-xl flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your profile details
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Wallet className="w-4 h-4 text-blue-600" />
                Wallet Address
              </Label>
              <Input 
                value={userAddress} 
                readOnly 
                className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700 font-mono text-sm"
              />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Your connected Sui wallet address
              </p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Award className="w-4 h-4 text-purple-600" />
                Reputation Score
              </Label>
              <div className="flex items-center gap-2">
                <Input 
                  value={userReputation}
                  readOnly 
                  className="bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700"
                />
                <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                  Top 10%
                </Badge>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Based on your contributions and training quality
              </p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-600" />
                Email
              </Label>
              <Input 
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-slate-300 dark:border-slate-700"
              />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Receive important notifications and updates
              </p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <User className="w-4 h-4 text-orange-600" />
                Display Name
              </Label>
              <Input 
                placeholder="Enter your display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="border-slate-300 dark:border-slate-700"
              />
              <p className="text-xs text-slate-600 dark:text-slate-400">
                How others see you on the platform
              </p>
            </div>
            
            <div className="pt-4">
              <Button 
                onClick={handleUpdate}
                disabled={isSaving}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isSaving ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Profile
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-b border-slate-200 dark:border-slate-800">
            <CardTitle className="text-xl flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Achievements
            </CardTitle>
            <CardDescription>
              Your earned badges and milestones
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <div 
                  key={index}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800/30 dark:to-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all"
                >
                  <div className={`p-3 ${achievement.color} rounded-xl shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {achievement.name}
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {achievement.desc}
                    </p>
                  </div>
                </div>
              );
            })}

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Next Milestone
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  Complete 8 more training sessions to unlock "Master Trainer" badge
                </p>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all" 
                    style={{ width: '65%' }}
                  />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  65% Complete (42/50 sessions)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}