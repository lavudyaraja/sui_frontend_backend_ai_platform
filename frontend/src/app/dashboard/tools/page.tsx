'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wrench,
  Code,
  Terminal,
  Database,
  Shield,
  Download,
  Upload,
  Bug,
  FileText,
  Cpu,
  Lock,
  Eye,
  Server,
  GitBranch,
  Package,
  Zap,
  CheckCircle2,
  Copy,
  ExternalLink
} from 'lucide-react';

export default function DeveloperToolsPage() {
  const [copiedCode, setCopiedCode] = useState('');

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const integrationTools = [
    {
      title: "Walrus Storage SDK",
      description: "Upload and retrieve data from Walrus decentralized storage",
      icon: Database,
      track: "Data Marketplaces",
      status: "Ready",
      color: "blue",
      docs: "https://docs.wal.app/"
    },
    {
      title: "Seal Encryption Toolkit",
      description: "End-to-end encryption for sensitive data and privacy",
      icon: Lock,
      track: "Data Security",
      status: "Ready",
      color: "purple",
      docs: "https://docs.sui.io"
    },
    {
      title: "Nautilus AI Orchestrator",
      description: "Distributed AI training and model deployment",
      icon: Cpu,
      track: "AI x Data",
      status: "Ready",
      color: "orange",
      docs: "https://docs.sui.io"
    },
    {
      title: "Truth Engine Verifier",
      description: "Verify data provenance and authenticity onchain",
      icon: Shield,
      track: "Provably Authentic",
      status: "Ready",
      color: "green",
      docs: "https://docs.sui.io"
    }
  ];

  const quickStartTools = [
    {
      title: "Data Upload Manager",
      description: "Upload datasets to Walrus with automatic chunking",
      icon: Upload,
      action: "Upload Data"
    },
    {
      title: "Storage Explorer",
      description: "Browse and manage your Walrus storage objects",
      icon: Database,
      action: "Open Explorer"
    },
    {
      title: "Encryption Console",
      description: "Encrypt/decrypt data using Seal protocol",
      icon: Lock,
      action: "Launch Console"
    },
    {
      title: "Model Registry",
      description: "Register and version your AI models",
      icon: Package,
      action: "View Registry"
    },
    {
      title: "API Playground",
      description: "Test Sui blockchain and storage APIs",
      icon: Terminal,
      action: "Open Playground"
    },
    {
      title: "Event Monitor",
      description: "Real-time blockchain event streaming",
      icon: Eye,
      action: "Start Monitoring"
    }
  ];

  const codeSnippets = [
    {
      title: "Upload to Walrus",
      language: "JavaScript",
      code: `// Upload data to Walrus
import { WalrusClient } from '@walrus/sdk';

const client = new WalrusClient({
  network: 'testnet'
});

const data = new Blob(['Your data here']);
const result = await client.upload(data);
console.log('Blob ID:', result.blobId);`
    },
    {
      title: "Encrypt with Seal",
      language: "JavaScript",
      code: `// Encrypt data with Seal
import { SealEncryptor } from '@seal/sdk';

const encryptor = new SealEncryptor();
const encrypted = await encryptor.encrypt(
  data,
  { algorithm: 'AES-256-GCM' }
);`
    },
    {
      title: "Deploy AI Model",
      language: "JavaScript",
      code: `// Deploy model with Nautilus
import { NautilusClient } from '@nautilus/sdk';

const nautilus = new NautilusClient();
const deployment = await nautilus.deployModel({
  modelId: 'your-model-id',
  compute: 'distributed'
});`
    }
  ];

  const cliCommands = [
    {
      command: "walrus upload",
      description: "Upload files to Walrus storage",
      example: "walrus upload ./dataset.json --epochs 200"
    },
    {
      command: "seal encrypt",
      description: "Encrypt data using Seal protocol",
      example: "seal encrypt ./private-data.csv --output encrypted.dat"
    },
    {
      command: "nautilus train",
      description: "Start distributed AI training",
      example: "nautilus train --model gpt --nodes 10 --data walrus://blob-id"
    },
    {
      command: "sui deploy",
      description: "Deploy smart contracts to Sui",
      example: "sui deploy ./contracts --network testnet"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Developer Tools</h1>
            <p className="text-gray-600 text-sm mb-4">
              Complete toolkit for building on Walrus, Seal, and Nautilus for the Haulout Hackathon
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-50 text-blue-700 border border-blue-200">
                <Database className="w-3 h-3 mr-1" />
                Walrus Ready
              </Badge>
              <Badge className="bg-purple-50 text-purple-700 border border-purple-200">
                <Lock className="w-3 h-3 mr-1" />
                Seal Integrated
              </Badge>
              <Badge className="bg-orange-50 text-orange-700 border border-orange-200">
                <Cpu className="w-3 h-3 mr-1" />
                Nautilus Enabled
              </Badge>
            </div>
          </div>
          <Badge className="bg-green-50 text-green-700 border border-green-200 font-medium">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            All Systems Ready
          </Badge>
        </div>
      </div>

      {/* Integration Tools */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-gray-700" />
            Hackathon Integration SDKs
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Official SDKs for Walrus Haulout Hackathon tracks
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrationTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <div 
                  key={index}
                  className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-white rounded-lg border border-gray-200">
                      <Icon className="w-5 h-5 text-gray-700" />
                    </div>
                    <Badge className="bg-green-50 text-green-700 border border-green-200 text-xs">
                      {tool.status}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{tool.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge className={`bg-${tool.color}-50 text-${tool.color}-700 border border-${tool.color}-200 text-xs`}>
                      {tool.track}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => window.open(tool.docs, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Docs
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Start Tools */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-gray-700" />
            Quick Start Tools
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Ready-to-use utilities for rapid development
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickStartTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  <Icon className="w-5 h-5 text-gray-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">{tool.title}</h3>
                  <p className="text-xs text-gray-600 mb-3">{tool.description}</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full h-9 text-xs font-medium"
                  >
                    {tool.action}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Code Examples */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Code className="w-5 h-5 text-gray-700" />
            Code Examples
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Copy-paste integration snippets for quick setup
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {codeSnippets.map((snippet, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-gray-600" />
                    <span className="font-semibold text-sm text-gray-900">{snippet.title}</span>
                    <Badge className="bg-gray-100 text-gray-600 border-0 text-xs">
                      {snippet.language}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7"
                    onClick={() => handleCopy(snippet.code, `snippet-${index}`)}
                  >
                    {copiedCode === `snippet-${index}` ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <pre className="bg-gray-900 text-gray-100 p-4 text-xs overflow-x-auto">
                  <code>{snippet.code}</code>
                </pre>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CLI Commands */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-gray-700" />
            Command Line Interface
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Terminal commands for advanced workflows
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {cliCommands.map((cmd, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="font-mono font-semibold text-sm text-gray-900">
                        {cmd.command}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => handleCopy(cmd.example, `cmd-${index}`)}
                      >
                        {copiedCode === `cmd-${index}` ? (
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{cmd.description}</p>
                    <div className="bg-gray-900 rounded px-3 py-2">
                      <code className="text-xs text-green-400 font-mono">$ {cmd.example}</code>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card className="border border-gray-200">
        <CardHeader className="border-b border-gray-100 pb-4">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-700" />
            Hackathon Resources
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Official documentation and community support
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="justify-start h-auto py-3"
              onClick={() => window.open('https://docs.walrus.site', '_blank')}
            >
              <Database className="mr-2 h-4 w-4" />
              <div className="text-left">
                <div className="font-medium text-sm">Walrus Documentation</div>
                <div className="text-xs text-gray-500">Storage APIs and examples</div>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              className="justify-start h-auto py-3"
              onClick={() => window.open('https://docs.sui.io', '_blank')}
            >
              <Shield className="mr-2 h-4 w-4" />
              <div className="text-left">
                <div className="font-medium text-sm">Seal & Nautilus Docs</div>
                <div className="text-xs text-gray-500">Security and AI integration</div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="justify-start h-auto py-3"
            >
              <FileText className="mr-2 h-4 w-4" />
              <div className="text-left">
                <div className="font-medium text-sm">Hackathon Handbook</div>
                <div className="text-xs text-gray-500">Rules, tracks, and prizes</div>
              </div>
            </Button>

            <Button 
              variant="outline" 
              className="justify-start h-auto py-3"
            >
              <GitBranch className="mr-2 h-4 w-4" />
              <div className="text-left">
                <div className="font-medium text-sm">Example Projects</div>
                <div className="text-xs text-gray-500">GitHub repositories</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}