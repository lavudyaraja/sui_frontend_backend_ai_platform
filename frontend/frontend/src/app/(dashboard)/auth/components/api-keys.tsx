'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Eye, EyeOff, Key } from 'lucide-react';

export default function ApiKeys() {
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState('sk-...xyz123');
  
  const toggleApiKeyVisibility = () => {
    setShowApiKey(!showApiKey);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(apiKey);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Keys</CardTitle>
        <CardDescription>
          Manage your API keys for external integrations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>OpenAI API Key</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input 
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                readOnly
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={toggleApiKeyVisibility}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <Button variant="outline" size="icon" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="pt-4">
          <Button>
            <Key className="mr-2 h-4 w-4" />
            Generate New Key
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}