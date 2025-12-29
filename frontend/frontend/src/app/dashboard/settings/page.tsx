'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useThemeContext } from '@/context/theme-provider';
import { useSettingsContext } from '@/context/settings-provider';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/shared/page-header';
import { Save, Monitor, Bell, Wallet, Cpu } from 'lucide-react';

export default function SettingsPage() {
  const { theme, toggleTheme } = useThemeContext();
  const { settings, updateSettings, resetSettings } = useSettingsContext();
  
  // Local state for form inputs
  const [formData, setFormData] = useState(settings);

  // Update form data when settings change
  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  // Update theme when settings change
  useEffect(() => {
    if (formData.theme !== theme) {
      toggleTheme();
    }
  }, [formData.theme, theme, toggleTheme]);

  const handleSaveSettings = () => {
    updateSettings(formData);
    alert('Settings saved successfully!');
  };

  const handleResetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      resetSettings();
      alert('Settings reset to default!');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Settings" 
        description="Manage your account preferences and application settings" 
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize the look and feel of the application
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-mode">Dark Mode</Label>
              <Switch
                id="theme-mode"
                checked={formData.theme === 'dark'}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ 
                    ...prev, 
                    theme: checked ? 'dark' : 'light' 
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Training Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="h-5 w-5" />
              Training Preferences
            </CardTitle>
            <CardDescription>
              Configure how training sessions are handled
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-start">Auto-start Training</Label>
              <Switch
                id="auto-start"
                checked={formData.training.autoStart}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ 
                    ...prev, 
                    training: { ...prev.training, autoStart: checked }
                  }))
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="max-concurrent">Max Concurrent Sessions</Label>
              <Select
                value={formData.training.maxConcurrent.toString()}
                onValueChange={(value) => 
                  setFormData(prev => ({ 
                    ...prev, 
                    training: { ...prev.training, maxConcurrent: parseInt(value) }
                  }))
                }
              >
                <SelectTrigger id="max-concurrent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Session</SelectItem>
                  <SelectItem value="2">2 Sessions</SelectItem>
                  <SelectItem value="3">3 Sessions</SelectItem>
                  <SelectItem value="4">4 Sessions</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Choose which notifications you want to receive
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <Switch
                id="email-notifications"
                checked={formData.notifications.email}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ 
                    ...prev, 
                    notifications: { ...prev.notifications, email: checked }
                  }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <Switch
                id="push-notifications"
                checked={formData.notifications.push}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ 
                    ...prev, 
                    notifications: { ...prev.notifications, push: checked }
                  }))
                }
              />
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <Label htmlFor="training-updates">Training Updates</Label>
              <Switch
                id="training-updates"
                checked={formData.notifications.trainingUpdates}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ 
                    ...prev, 
                    notifications: { ...prev.notifications, trainingUpdates: checked }
                  }))
                }
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="model-updates">Model Updates</Label>
              <Switch
                id="model-updates"
                checked={formData.notifications.modelUpdates}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ 
                    ...prev, 
                    notifications: { ...prev.notifications, modelUpdates: checked }
                  }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Wallet Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet Connection
            </CardTitle>
            <CardDescription>
              Manage your wallet connection preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-connect">Auto-connect Wallet</Label>
              <Switch
                id="auto-connect"
                checked={formData.wallet.autoConnect}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ 
                    ...prev, 
                    wallet: { ...prev.wallet, autoConnect: checked }
                  }))
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="preferred-network">Preferred Network</Label>
              <Select
                value={formData.wallet.preferredNetwork}
                onValueChange={(value) => 
                  setFormData(prev => ({ 
                    ...prev, 
                    wallet: { ...prev.wallet, preferredNetwork: value as 'testnet' | 'mainnet' | 'devnet' }
                  }))
                }
              >
                <SelectTrigger id="preferred-network">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="testnet">Testnet</SelectItem>
                  <SelectItem value="mainnet">Mainnet</SelectItem>
                  <SelectItem value="devnet">Devnet</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={handleResetSettings}>
          Reset to Default
        </Button>
        <Button onClick={handleSaveSettings} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}