'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Trash2, 
  Shield, 
  AlertTriangle,
  Database,
  FileText,
  Archive,
  RefreshCw,
  Lock,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

export default function AccountManagement() {
  const [exportingItem, setExportingItem] = useState<string | null>(null);
  const [clearingItem, setClearingItem] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleExport = (type: string) => {
    setExportingItem(type);
    setTimeout(() => {
      setExportingItem(null);
      const element = document.createElement('a');
      const file = new Blob([`${type} data`], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${type.toLowerCase().replace(/\s+/g, '-')}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 2000);
  };

  const handleClear = (type: string) => {
    if (!confirm(`Are you sure you want to clear ${type}? This action cannot be undone.`)) {
      return;
    }
    setClearingItem(type);
    setTimeout(() => {
      setClearingItem(null);
    }, 1500);
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you absolutely sure? Type "DELETE" to confirm.')) {
      alert('Account deletion initiated. You will be logged out.');
    }
    setShowDeleteConfirm(false);
  };

  const dataStats = [
    { label: 'Training Sessions', value: '42', icon: TrendingUp, color: 'blue' },
    { label: 'Model Checkpoints', value: '18', icon: Archive, color: 'purple' },
    { label: 'Data Objects', value: '142', icon: FileText, color: 'green' },
    { label: 'Storage Used', value: '2.4 GB', icon: Database, color: 'orange' },
  ];

  const exportOptions = [
    { label: 'Training Data', format: 'JSON', icon: Database },
    { label: 'Model Checkpoints', format: 'ZIP', icon: Archive },
    { label: 'Contribution History', format: 'CSV', icon: FileText },
    { label: 'Complete Backup', format: '~2.4 GB', icon: Archive },
  ];

  const clearOptions = [
    { label: 'Local Cache', size: '~245 MB' },
    { label: 'Training State', size: '42 sessions' },
    { label: 'Temporary Files', size: '~128 MB' },
  ];

  return (
    <div className="space-y-6">
      {/* Data Overview */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-gray-700" />
                Data Overview
              </CardTitle>
              <CardDescription className="mt-1 text-sm text-gray-500">
                Your stored data and training artifacts
              </CardDescription>
            </div>
            <Badge className="bg-green-50 text-green-700 border border-green-200 font-medium">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Synced
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {dataStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <p className="text-2xl font-semibold text-gray-900 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-600 font-medium">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout for Data Management and Export */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Management */}
        <Card className="border border-gray-200">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-gray-700" />
              Data Management
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Clear cached data and training state
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2">
              {clearOptions.map((option, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  className="w-full justify-between border-gray-200 hover:bg-gray-50 text-gray-700 h-auto py-3"
                  onClick={() => handleClear(option.label)}
                  disabled={clearingItem !== null}
                >
                  <div className="flex items-center gap-2">
                    {clearingItem === option.label ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <Badge className="bg-gray-100 text-gray-600 border-0">
                    {option.size}
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
              
        {/* Data Export */}
        <Card className="border border-gray-200">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Download className="w-5 h-5 text-gray-700" />
              Data Export
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              Download data for backup or portability
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2">
              {exportOptions.map((option, index) => (
                <Button 
                  key={index}
                  variant="outline" 
                  className="w-full justify-between border-gray-200 hover:bg-gray-50 text-gray-700 h-auto py-3"
                  onClick={() => handleExport(option.label)}
                  disabled={exportingItem !== null}
                >
                  <div className="flex items-center gap-2">
                    {exportingItem === option.label ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <option.icon className="h-4 w-4" />
                    )}
                    <span className="font-medium">{option.label}</span>
                  </div>
                  <Badge className="bg-blue-50 text-blue-700 border border-blue-200">
                    {option.format}
                  </Badge>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Privacy & Security */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Shield className="w-5 h-5 text-gray-700" />
            Privacy & Security
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Your data protection and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Encryption Info */}
            <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-blue-600 rounded-lg flex-shrink-0">
                  <Lock className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 text-base">
                      Data Encryption
                    </h4>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-xs font-medium text-green-700">Active</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    All your data is encrypted using Seal protocol with end-to-end encryption. 
                    Your training data is stored securely on Walrus decentralized storage.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="justify-start border-gray-200 hover:bg-gray-50 text-gray-700 h-11"
              >
                <Shield className="mr-2 h-4 w-4" />
                View Privacy Policy
              </Button>

              <Button 
                variant="outline" 
                className="justify-start border-gray-200 hover:bg-gray-50 text-gray-700 h-11"
              >
                <FileText className="mr-2 h-4 w-4" />
                Data Access Logs
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-2 border-red-200 bg-red-50/30">
        <CardHeader className="border-b border-red-200 pb-4">
          <CardTitle className="text-xl font-semibold text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Danger Zone
          </CardTitle>
          <CardDescription className="text-red-600 font-medium">
            Irreversible actions that will permanently affect your account
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="bg-white rounded-lg p-5 border border-red-200">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2 text-base">
                  Delete Account
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Permanently delete your account and all associated data. This action cannot be undone. 
                  All your training data, model checkpoints, and reputation will be lost forever.
                </p>
              </div>
            </div>
            <Button 
              variant="destructive" 
              className="w-full bg-red-600 hover:bg-red-700 text-white h-11 font-medium"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Account Permanently
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full border border-gray-200 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Confirm Account Deletion</h3>
            </div>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              This will permanently delete your account, all training data, model checkpoints, and reputation. 
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1 border-gray-200 h-11"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1 bg-red-600 hover:bg-red-700 h-11 font-medium"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}