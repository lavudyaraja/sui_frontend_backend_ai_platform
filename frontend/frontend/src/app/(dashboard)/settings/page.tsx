'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Wallet, Sliders, User, Shield, Database, Activity } from 'lucide-react';

// Import components (these would be separate files in your project)
import WalletSettings from './components/wallet-settings';
import PreferencesSettings from './components/preferences-settings';
import AccountManagement from './components/account-management';
import SystemInformation from './components/system-information';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'wallet', label: 'Wallet', icon: Wallet },
    { id: 'preferences', label: 'Preferences', icon: Sliders },
    { id: 'account', label: 'Account', icon: User },
  ];

  const quickStats = [
    { icon: Activity, label: 'Status', value: 'Active' },
    { icon: Database, label: 'Storage', value: '2.4/5 GB' },
    { icon: Shield, label: 'Security', value: 'High' },
    { icon: Wallet, label: 'Wallet', value: 'Connected' },
  ];

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-6 pb-0">
        <Card className="border border-gray-200">
          <CardHeader className="border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-gray-900 rounded-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
                  Settings
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-0.5">
                  Manage your DeepSurge platform settings and preferences
                </p>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {quickStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-gray-600" />
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        {stat.label}
                      </span>
                    </div>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                );
              })}
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content Area with Sidebar */}
      <div className="flex-1 overflow-hidden p-6 pt-6">
        <div className="flex gap-6 h-full">
          {/* Fixed Vertical Sidebar */}
          <div className="w-64 flex-shrink-0">
            <Card className="border border-gray-200 h-full">
              <CardContent className="p-2">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          activeTab === tab.id
                            ? 'bg-gray-900 text-white dark:bg-gray-700'
                            : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto pr-2">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <Card className="border border-gray-200">
                  <CardHeader className="border-b border-gray-100 pb-4">
                    <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                      General Settings
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500">
                      Manage your general platform settings and system information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                      <h3 className="font-semibold text-base mb-2 text-gray-900">
                        Welcome to DeepSurge Settings
                      </h3>
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        DeepSurge is a decentralized AI training platform built on Sui blockchain, utilizing Walrus for decentralized storage, 
                        Seal for data security, and Nautilus for AI orchestration.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                        <div className="bg-white rounded-md p-3 border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Network</p>
                          <p className="font-medium text-gray-900">Sui Mainnet</p>
                        </div>
                        <div className="bg-white rounded-md p-3 border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Storage</p>
                          <p className="font-medium text-gray-900">Walrus</p>
                        </div>
                        <div className="bg-white rounded-md p-3 border border-gray-200">
                          <p className="text-xs text-gray-600 mb-1">Security</p>
                          <p className="font-medium text-gray-900">Seal</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <SystemInformation />
              </div>
            )}
            
            {activeTab === 'wallet' && <WalletSettings />}
            
            {activeTab === 'preferences' && <PreferencesSettings />}
            
            {activeTab === 'account' && <AccountManagement />}
          </div>
        </div>
      </div>
    </div>
  );
}