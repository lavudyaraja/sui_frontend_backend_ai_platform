'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Server, Database, Shield, Cpu, HardDrive, Clock, CheckCircle2, Lock } from 'lucide-react';

export default function SystemInformation() {
  const systemStats = [
    { 
      label: 'Platform Version', 
      value: 'v1.2.4', 
      icon: Server,
      status: 'stable'
    },
    { 
      label: 'Walrus Storage', 
      value: 'Connected', 
      icon: Database,
      status: 'active',
      badge: 'Testnet'
    },
    { 
      label: 'Seal Security', 
      value: 'Enabled', 
      icon: Shield,
      status: 'protected'
    },
    { 
      label: 'Nautilus AI', 
      value: 'Ready', 
      icon: Cpu,
      status: 'ready'
    },
  ];

  const accountInfo = [
    { label: 'Account Created', value: 'Jan 15, 2024', icon: Clock },
    { label: 'Last Login', value: '2 hours ago', icon: CheckCircle2 },
    { label: 'Storage Used', value: '2.4 GB of 5 GB', icon: HardDrive },
    { label: 'Data Objects', value: '142 files', icon: Database },
  ];

  const networkMetrics = [
    { label: 'Network Latency', value: '12ms', status: 'good' },
    { label: 'Sync Status', value: '100%', status: 'good' },
    { label: 'Node Health', value: 'Optimal', status: 'good' },
    { label: 'Uptime', value: '99.9%', status: 'good' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Core Infrastructure */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Server className="w-5 h-5 text-gray-700" />
                Core Infrastructure
              </CardTitle>
              <CardDescription className="mt-1 text-sm text-gray-500">
                Platform integrations and service status
              </CardDescription>
            </div>
            <Badge className="bg-green-50 text-green-700 border border-green-200 font-medium">
              All Systems Operational
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systemStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-xs text-gray-600 font-medium">
                          {stat.label}
                        </p>
                        <p className="text-lg font-semibold text-gray-900 mt-0.5">
                          {stat.value}
                        </p>
                      </div>
                    </div>
                    {stat.badge && (
                      <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-xs">
                        {stat.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-xs text-gray-600 capitalize">{stat.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-700" />
            Account Information
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Your account details and usage statistics
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {accountInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div 
                  key={index}
                  className="flex items-center justify-between bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600 font-medium">
                      {info.label}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {info.value}
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Network Metrics */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-gray-700" />
            Network Metrics
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Real-time network performance indicators
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {networkMetrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <p className="text-2xl font-semibold text-gray-900">
                    {metric.value}
                  </p>
                  <p className="text-xs text-gray-600 mt-1 font-medium">
                    {metric.label}
                  </p>
                  <div className="mt-2 flex justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hackathon Integration Info */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-700" />
            Hackathon Integration
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Optimized for Walrus Haulout Hackathon
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-600 rounded-lg flex-shrink-0">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                  Haulout Hackathon Integration
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Your platform is optimized for the Walrus Haulout Hackathon with full support for:
                </p>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-blue-50 text-blue-700 border border-blue-200">
                    Data Marketplaces
                  </Badge>
                  <Badge className="bg-green-50 text-green-700 border border-green-200">
                    AI x Data
                  </Badge>
                  <Badge className="bg-purple-50 text-purple-700 border border-purple-200">
                    Provably Authentic
                  </Badge>
                  <Badge className="bg-orange-50 text-orange-700 border border-orange-200">
                    Data Security
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}