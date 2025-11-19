'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Moon, 
  Sun, 
  Zap, 
  Database,
  Brain,
  Lock,
  Globe,
  CheckCircle2
} from 'lucide-react';

export default function PreferencesSettings() {
  const [settings, setSettings] = useState({
    training: {
      autoStart: false,
      notifications: true,
      privacyMode: false,
      dataSharing: true
    },
    theme: 'dark' as 'light' | 'dark',
    performance: {
      gpuAcceleration: true,
      autoOptimize: true
    },
    security: {
      twoFactor: true,
      encryption: true
    }
  });
  
  const handleTrainingModeChange = (mode: 'manual' | 'auto') => {
    setSettings({
      ...settings,
      training: {
        ...settings.training,
        autoStart: mode === 'auto'
      }
    });
  };

  const handleNotificationChange = (checked: boolean) => {
    setSettings({
      ...settings,
      training: {
        ...settings.training,
        notifications: checked
      }
    });
  };

  const handleThemeChange = (theme: 'light' | 'dark') => {
    setSettings({ ...settings, theme });
    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark');
  };

  const handlePrivacyModeChange = (checked: boolean) => {
    setSettings({
      ...settings,
      training: {
        ...settings.training,
        privacyMode: checked
      }
    });
  };

  const handleDataSharingChange = (checked: boolean) => {
    setSettings({
      ...settings,
      training: {
        ...settings.training,
        dataSharing: checked
      }
    });
  };

  const handleGPUChange = (checked: boolean) => {
    setSettings({
      ...settings,
      performance: {
        ...settings.performance,
        gpuAcceleration: checked
      }
    });
  };

  const handleAutoOptimizeChange = (checked: boolean) => {
    setSettings({
      ...settings,
      performance: {
        ...settings.performance,
        autoOptimize: checked
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Training Preferences */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Brain className="w-5 h-5 text-gray-700" />
            AI Training Preferences
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Configure how your AI training sessions operate
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* Training Mode */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-900">Training Mode</Label>
                <p className="text-xs text-gray-600 mt-0.5">
                  Choose how training sessions are initiated
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={settings.training.autoStart ? 'outline' : 'default'}
                size="sm"
                onClick={() => handleTrainingModeChange('manual')}
                className={settings.training.autoStart ? 'border-gray-200' : 'bg-gray-900 hover:bg-gray-800'}
              >
                Manual
              </Button>
              <Button 
                variant={settings.training.autoStart ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleTrainingModeChange('auto')}
                className={settings.training.autoStart ? 'bg-gray-900 hover:bg-gray-800' : 'border-gray-200'}
              >
                Auto
              </Button>
            </div>
          </div>
          
          {/* Notifications */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Bell className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-900">Training Notifications</Label>
                <p className="text-xs text-gray-600 mt-0.5">
                  Receive updates about training progress and completion
                </p>
              </div>
            </div>
            <Switch 
              checked={settings.training.notifications}
              onCheckedChange={handleNotificationChange}
            />
          </div>

          {/* Privacy Mode */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Lock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-900">Privacy Mode</Label>
                <p className="text-xs text-gray-600 mt-0.5">
                  Enhanced privacy for sensitive training data
                </p>
              </div>
            </div>
            <Switch 
              checked={settings.training.privacyMode}
              onCheckedChange={handlePrivacyModeChange}
            />
          </div>

          {/* Data Sharing */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Database className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-900">Data Marketplace Sharing</Label>
                <p className="text-xs text-gray-600 mt-0.5">
                  Allow your anonymized training data in the marketplace
                </p>
              </div>
            </div>
            <Switch 
              checked={settings.training.dataSharing}
              onCheckedChange={handleDataSharingChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            {settings.theme === 'dark' ? (
              <Moon className="w-5 h-5 text-gray-700" />
            ) : (
              <Sun className="w-5 h-5 text-gray-700" />
            )}
            Appearance
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Customize the look and feel of your interface
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                {settings.theme === 'dark' ? (
                  <Moon className="w-5 h-5 text-indigo-600" />
                ) : (
                  <Sun className="w-5 h-5 text-indigo-600" />
                )}
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-900">Theme</Label>
                <p className="text-xs text-gray-600 mt-0.5">
                  Select the application theme
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant={settings.theme === 'light' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleThemeChange('light')}
                className={settings.theme === 'light' ? 'bg-gray-900 hover:bg-gray-800' : 'border-gray-200'}
              >
                <Sun className="w-4 h-4 mr-2" />
                Light
              </Button>
              <Button 
                variant={settings.theme === 'dark' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleThemeChange('dark')}
                className={settings.theme === 'dark' ? 'bg-gray-900 hover:bg-gray-800' : 'border-gray-200'}
              >
                <Moon className="w-4 h-4 mr-2" />
                Dark
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-gray-700" />
            Performance
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Optimize system performance for training
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-900">GPU Acceleration</Label>
                <p className="text-xs text-gray-600 mt-0.5">
                  Use GPU for faster model training
                </p>
              </div>
            </div>
            <Switch 
              checked={settings.performance.gpuAcceleration}
              onCheckedChange={handleGPUChange}
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <Label className="text-sm font-semibold text-gray-900">Auto-Optimize</Label>
                <p className="text-xs text-gray-600 mt-0.5">
                  Automatically optimize training parameters
                </p>
              </div>
            </div>
            <Switch 
              checked={settings.performance.autoOptimize}
              onCheckedChange={handleAutoOptimizeChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Hackathon Features */}
      <Card className="bg-blue-50 border border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-600 rounded-lg flex-shrink-0">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-base text-gray-900 mb-2">
                Haulout Hackathon Features Active
              </h3>
              <p className="text-sm text-gray-700 mb-3">
                Your preferences are optimized for decentralized AI training with full Walrus integration, 
                Seal security protocols, and Nautilus AI orchestration.
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-white text-gray-700 border border-gray-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Decentralized Training
                </Badge>
                <Badge className="bg-white text-gray-700 border border-gray-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Data Marketplace Ready
                </Badge>
                <Badge className="bg-white text-gray-700 border border-gray-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Provably Authentic
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Summary */}
      <Card className="border border-gray-200 bg-gray-50">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Current Configuration</h4>
              <p className="text-xs text-gray-600">
                {settings.training.autoStart ? 'Auto' : 'Manual'} training • {settings.theme === 'dark' ? 'Dark' : 'Light'} theme • 
                {settings.performance.gpuAcceleration ? ' GPU enabled' : ' GPU disabled'}
              </p>
            </div>
            <Badge className="bg-green-50 text-green-700 border border-green-200">
              All Systems Active
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}