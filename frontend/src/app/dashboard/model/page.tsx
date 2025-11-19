'use client';

import { useState, useEffect } from 'react';
import { 
  Download, RefreshCw, Activity, Users, Database, TrendingUp, Clock, 
  GitCompare, FileText, Loader2, CheckCircle2, AlertCircle, Hash, 
  PlusCircle, Shield, DollarSign, Zap, Eye, Award, Lock, Globe,
  BarChart3, TrendingDown, Star, Verified, AlertTriangle, Brain,
  Server, Network, Coins, ShoppingCart, Badge as BadgeIcon
} from 'lucide-react';

// Mock comprehensive data for hackathon demo
const MOCK_MODELS = [
  {
    id: "model_3.2",
    version: "3.2",
    name: "DecentralVision v3.2",
    walrusCID: "b749de6c8e9a1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b",
    dateCreated: new Date(Date.now() - 86400000).toISOString(),
    accuracy: 92.4,
    contributors: 1248,
    status: 'active',
    price: 25.50,
    marketCap: "$31,824",
    sales: 1247,
    trustScore: 98,
    privacyLevel: "High",
    trainingDataSources: 5,
    verifiedProvenance: true,
    federatedLearning: true,
    differentialPrivacy: true,
    storageRedundancy: 10,
    predictionAccuracy: 94.2,
  },
  {
    id: "model_3.1",
    version: "3.1",
    name: "DecentralVision v3.1",
    walrusCID: "a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5",
    dateCreated: new Date(Date.now() - 172800000).toISOString(),
    accuracy: 91.8,
    contributors: 1156,
    status: 'marketplace',
    price: 22.00,
    marketCap: "$25,432",
    sales: 1156,
    trustScore: 96,
    privacyLevel: "High",
    trainingDataSources: 4,
    verifiedProvenance: true,
    federatedLearning: true,
    differentialPrivacy: true,
    storageRedundancy: 10,
    predictionAccuracy: 92.8,
  },
  {
    id: "model_3.0",
    version: "3.0",
    name: "DecentralVision v3.0",
    walrusCID: "c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4a3b2c1d0e9f8a7b6c5d4",
    dateCreated: new Date(Date.now() - 259200000).toISOString(),
    accuracy: 90.5,
    contributors: 1089,
    status: 'archived',
    price: 18.00,
    marketCap: "$19,602",
    sales: 1089,
    trustScore: 94,
    privacyLevel: "Medium",
    trainingDataSources: 3,
    verifiedProvenance: true,
    federatedLearning: false,
    differentialPrivacy: true,
    storageRedundancy: 8,
    predictionAccuracy: 91.2,
  }
];

const TRAINING_DATA_SOURCES = [
  { name: "ImageNet Subset", quality: 98, verified: true, size: "1.2 TB" },
  { name: "OpenImages", quality: 95, verified: true, size: "800 GB" },
  { name: "Community Dataset", quality: 92, verified: true, size: "450 GB" },
  { name: "Synthetic Data", quality: 89, verified: true, size: "320 GB" },
  { name: "Custom Dataset", quality: 94, verified: false, size: "180 GB" },
];

const CONTRIBUTORS = [
  { id: 1, address: "0x1a2b...3c4d", contributions: 145, rewards: 12.45, reputation: 98 },
  { id: 2, address: "0x5e6f...7g8h", contributions: 132, rewards: 11.20, reputation: 96 },
  { id: 3, address: "0x9i0j...1k2l", contributions: 128, rewards: 10.85, reputation: 95 },
  { id: 4, address: "0x3m4n...5o6p", contributions: 121, rewards: 10.30, reputation: 94 },
  { id: 5, address: "0x7q8r...9s0t", contributions: 115, rewards: 9.75, reputation: 93 },
];

export default function EnhancedModelDashboard() {
  const [selectedModel, setSelectedModel] = useState(MOCK_MODELS[0]);
  const [activeTab, setActiveTab] = useState('overview');
  const [downloading, setDownloading] = useState(false);
  const [purchasing, setPurchasing] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState({
    activeTrainers: 248,
    gradientsPerSecond: 12.4,
    networkLoad: 67,
  });

  // Simulate live metrics updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        activeTrainers: prev.activeTrainers + Math.floor(Math.random() * 10 - 5),
        gradientsPerSecond: Math.max(8, Math.min(20, prev.gradientsPerSecond + (Math.random() * 2 - 1))),
        networkLoad: Math.max(40, Math.min(90, prev.networkLoad + Math.floor(Math.random() * 10 - 5))),
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleDownload = async () => {
    setDownloading(true);
    setTimeout(() => setDownloading(false), 2000);
  };

  const handlePurchase = async () => {
    setPurchasing(true);
    setTimeout(() => setPurchasing(false), 2000);
  };

  // Fix TypeScript errors by adding proper types
  const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}>
      {children}
    </div>
  );

  const Badge = ({ children, variant = "default", className = "" }: { children: React.ReactNode; variant?: string; className?: string }) => {
    const variants = {
      default: "bg-gray-100 text-gray-800",
      success: "bg-green-100 text-green-800",
      warning: "bg-yellow-100 text-yellow-800",
      error: "bg-red-100 text-red-800",
      info: "bg-blue-100 text-blue-800",
      purple: "bg-purple-100 text-purple-800",
    };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant as keyof typeof variants] || variants.default} ${className}`}>
        {children}
      </span>
    );
  };

  const Button = ({ children, variant = "primary", className = "", ...props }: { children: React.ReactNode; variant?: string; className?: string; [key: string]: any }) => {
    const variants = {
      primary: "bg-indigo-600 hover:bg-indigo-700 text-white",
      secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900",
      outline: "border border-gray-300 hover:bg-gray-50 text-gray-700",
      success: "bg-green-600 hover:bg-green-700 text-white",
    };
    return (
      <button 
        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center ${variants[variant as keyof typeof variants] || variants.primary} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Brain className="h-8 w-8 text-indigo-600" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Decentralized AI Marketplace
              </h1>
            </div>
            <p className="text-gray-600">Built on Walrus • Powered by Sui Blockchain</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="success">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Testnet Live
            </Badge>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Live Network Stats Banner */}
        <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-0">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm opacity-90">Active Trainers</div>
                  <div className="text-2xl font-bold">{liveMetrics.activeTrainers}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm opacity-90">Gradients/sec</div>
                  <div className="text-2xl font-bold">{liveMetrics.gradientsPerSecond.toFixed(1)}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Network className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm opacity-90">Network Load</div>
                  <div className="text-2xl font-bold">{liveMetrics.networkLoad}%</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Database className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm opacity-90">Storage (Walrus)</div>
                  <div className="text-2xl font-bold">2.4 TB</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Model Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Featured Model */}
            <Card className="border-2 border-indigo-500">
              <div className="p-6 space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-gray-900">{selectedModel.name}</h2>
                      <Badge variant="success">
                        <Verified className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                      {selectedModel.status === 'active' && (
                        <Badge variant="info">
                          <Activity className="h-3 w-3 mr-1" />
                          Training
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600">Version {selectedModel.version} • {selectedModel.contributors.toLocaleString()} contributors</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-indigo-600">${selectedModel.price}</div>
                    <div className="text-sm text-gray-500">Market Cap: {selectedModel.marketCap}</div>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 mb-1">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-xs font-medium">Accuracy</span>
                    </div>
                    <div className="text-2xl font-bold text-green-700">{selectedModel.accuracy}%</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700 mb-1">
                      <Shield className="h-4 w-4" />
                      <span className="text-xs font-medium">Trust Score</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-700">{selectedModel.trustScore}</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-purple-700 mb-1">
                      <ShoppingCart className="h-4 w-4" />
                      <span className="text-xs font-medium">Sales</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-700">{selectedModel.sales}</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-orange-700 mb-1">
                      <BarChart3 className="h-4 w-4" />
                      <span className="text-xs font-medium">Prediction</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-700">{selectedModel.predictionAccuracy}%</div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <div className="flex gap-6">
                    {['overview', 'provenance', 'marketplace', 'privacy'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === tab
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <Hash className="h-5 w-5 text-gray-500 mt-0.5" />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-700 mb-1">Walrus CID</div>
                          <div className="text-xs font-mono text-gray-600 break-all">{selectedModel.walrusCID}</div>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <Server className="h-3 w-3" />
                            {selectedModel.storageRedundancy}x redundancy across Walrus network
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 mb-1">Training Method</div>
                        <div className="flex items-center gap-2">
                          {selectedModel.federatedLearning ? (
                            <>
                              <Network className="h-4 w-4 text-green-600" />
                              <span className="font-medium text-gray-900">Federated Learning</span>
                            </>
                          ) : (
                            <span className="font-medium text-gray-900">Centralized</span>
                          )}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="text-sm text-gray-600 mb-1">Privacy Level</div>
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-gray-900">{selectedModel.privacyLevel}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="primary" className="flex-1" onClick={handlePurchase} disabled={purchasing}>
                        {purchasing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ShoppingCart className="h-4 w-4 mr-2" />}
                        Purchase Access
                      </Button>
                      <Button variant="outline" onClick={handleDownload} disabled={downloading}>
                        {downloading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                        Download
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === 'provenance' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-600 mb-3">
                      <Verified className="h-5 w-5" />
                      <span className="font-medium">Fully Verified Training Pipeline</span>
                    </div>
                    
                    <div className="space-y-3">
                      <h3 className="font-medium text-gray-900">Training Data Sources</h3>
                      {TRAINING_DATA_SOURCES.map((source, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <Database className="h-4 w-4 text-gray-600" />
                              <span className="font-medium text-gray-900">{source.name}</span>
                              {source.verified && (
                                <Badge variant="success">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <span className="text-sm text-gray-600">{source.size}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${source.quality}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{source.quality}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'marketplace' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg">
                        <div className="text-sm text-indigo-700 mb-1">Current Price</div>
                        <div className="text-3xl font-bold text-indigo-700">${selectedModel.price}</div>
                        <div className="text-xs text-indigo-600 mt-1">+12.5% (24h)</div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg">
                        <div className="text-sm text-purple-700 mb-1">Total Sales</div>
                        <div className="text-3xl font-bold text-purple-700">{selectedModel.sales}</div>
                        <div className="text-xs text-purple-600 mt-1">{selectedModel.marketCap} volume</div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Price History (7d)</h3>
                      <div className="h-32 flex items-end gap-2">
                        {[18, 19, 21, 23, 24, 25, 25.5].map((price, idx) => (
                          <div key={idx} className="flex-1 bg-indigo-500 rounded-t" style={{ height: `${(price / 25.5) * 100}%` }} />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium text-gray-900">Licensing Options</h3>
                      <div className="space-y-2">
                        <div className="border border-gray-200 rounded-lg p-3 hover:border-indigo-500 cursor-pointer transition-colors">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Personal Use</span>
                            <span className="text-indigo-600 font-bold">${selectedModel.price}</span>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-3 hover:border-indigo-500 cursor-pointer transition-colors">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Commercial Use</span>
                            <span className="text-indigo-600 font-bold">${(selectedModel.price * 5).toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="border border-gray-200 rounded-lg p-3 hover:border-indigo-500 cursor-pointer transition-colors">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Enterprise License</span>
                            <span className="text-indigo-600 font-bold">${(selectedModel.price * 20).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'privacy' && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-blue-600 mb-3">
                      <Shield className="h-5 w-5" />
                      <span className="font-medium">Privacy-Preserving AI Training</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="h-5 w-5 text-blue-600" />
                          <span className="font-medium text-gray-900">Differential Privacy</span>
                        </div>
                        <Badge variant={selectedModel.differentialPrivacy ? "success" : "error"}>
                          {selectedModel.differentialPrivacy ? "Enabled" : "Disabled"}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-2">
                          Epsilon: 0.5, Delta: 1e-5
                        </p>
                      </div>

                      <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Network className="h-5 w-5 text-green-600" />
                          <span className="font-medium text-gray-900">Federated Learning</span>
                        </div>
                        <Badge variant={selectedModel.federatedLearning ? "success" : "error"}>
                          {selectedModel.federatedLearning ? "Active" : "Inactive"}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-2">
                          {selectedModel.contributors} distributed nodes
                        </p>
                      </div>

                      <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-5 w-5 text-purple-600" />
                          <span className="font-medium text-gray-900">Secure Aggregation</span>
                        </div>
                        <Badge variant="success">Enabled</Badge>
                        <p className="text-sm text-gray-600 mt-2">
                          Zero-knowledge proofs verified
                        </p>
                      </div>

                      <div className="bg-orange-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Eye className="h-5 w-5 text-orange-600" />
                          <span className="font-medium text-gray-900">Data Anonymization</span>
                        </div>
                        <Badge variant="success">Active</Badge>
                        <p className="text-sm text-gray-600 mt-2">
                          PII removed, k-anonymity: 10
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Compliance & Standards</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="info">GDPR Compliant</Badge>
                        <Badge variant="info">CCPA Compliant</Badge>
                        <Badge variant="info">ISO 27001</Badge>
                        <Badge variant="info">SOC 2 Type II</Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Top Contributors */}
            <Card>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Top Contributors</h3>
                  <Badge variant="info">{selectedModel.contributors} total</Badge>
                </div>
                <div className="space-y-3">
                  {CONTRIBUTORS.map((contributor) => (
                    <div key={contributor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          #{contributor.id}
                        </div>
                        <div>
                          <div className="font-mono text-sm text-gray-900">{contributor.address}</div>
                          <div className="text-xs text-gray-500">{contributor.contributions} contributions</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm font-medium text-green-600">
                          <Coins className="h-4 w-4" />
                          {contributor.rewards} SUI
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {contributor.reputation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Model Comparison */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Version Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Version</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Accuracy</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Contributors</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Price</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Trust Score</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_MODELS.map((model, idx) => (
                        <tr 
                          key={model.id} 
                          className={`border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                            selectedModel.id === model.id ? 'bg-indigo-50' : ''
                          }`}
                          onClick={() => setSelectedModel(model)}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">v{model.version}</span>
                              {idx === 0 && <Badge variant="success">Latest</Badge>}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <span className="font-medium text-gray-900">{model.accuracy}%</span>
                              {idx > 0 && (
                                <TrendingUp className="h-3 w-3 text-green-600" />
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-700">{model.contributors.toLocaleString()}</td>
                          <td className="py-3 px-4 font-medium text-indigo-600">${model.price}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <Shield className="h-3 w-3 text-blue-600" />
                              <span className="text-gray-900">{model.trustScore}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={
                              model.status === 'active' ? 'success' : 
                              model.status === 'marketplace' ? 'info' : 
                              'default'
                            }>
                              {model.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Stats & Actions */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="primary" className="w-full justify-start">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Train New Model
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <GitCompare className="mr-2 h-4 w-4" />
                    Compare Models
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BadgeIcon className="mr-2 h-4 w-4" />
                    View Credentials
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Globe className="mr-2 h-4 w-4" />
                    Explore Marketplace
                  </Button>
                </div>
              </div>
            </Card>

            {/* Trust Oracle */}
            <Card className="border-2 border-blue-500">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Trust Oracle</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Model Integrity</span>
                    <Badge variant="success">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Training Data</span>
                    <Badge variant="success">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Contributors</span>
                    <Badge variant="success">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Smart Contract</span>
                    <Badge variant="success">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Audited
                    </Badge>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-1">{selectedModel.trustScore}</div>
                    <div className="text-sm text-gray-600">Overall Trust Score</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Prediction Market */}
            <Card className="border-2 border-purple-500">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Prediction Market</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Will reach 95% accuracy?</span>
                      <span className="font-medium text-purple-600">78% Yes</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600" style={{ width: '78%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Price over $30 by Dec?</span>
                      <span className="font-medium text-purple-600">62% Yes</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-600" style={{ width: '62%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">1000+ contributors?</span>
                      <span className="font-medium text-green-600">92% Yes</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-600" style={{ width: '92%' }} />
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Place Prediction
                </Button>
              </div>
            </Card>

            {/* Network Statistics */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Network Stats</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-sm text-gray-600">Total Models</span>
                    <span className="font-medium text-gray-900">142</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-sm text-gray-600">Total Revenue</span>
                    <span className="font-medium text-green-600">$1.2M</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-sm text-gray-600">Avg Trust Score</span>
                    <span className="font-medium text-gray-900">94.2</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-sm text-gray-600">Data Processed</span>
                    <span className="font-medium text-gray-900">12.8 TB</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Walrus Nodes</span>
                    <span className="font-medium text-indigo-600">1,247</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Security Features */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lock className="h-5 w-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Security Features</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Zero-Knowledge Proofs</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Encrypted Gradient Storage</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Byzantine Fault Tolerance</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Anomaly Detection Active</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Multi-Sig Governance</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* System Status */}
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Sui Blockchain</span>
                    <Badge variant="success">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Walrus Storage</span>
                    <Badge variant="success">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Healthy
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Nautilus Compute</span>
                    <Badge variant="success">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Oracle Network</span>
                    <Badge variant="success">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Synced
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Footer Banner */}
        <Card className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white border-0">
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Built for Walrus Haulout Hackathon</h3>
            <p className="text-white/90 mb-4">
              Decentralized AI • Data Marketplace • Provenance Tracking • Privacy-Preserving ML
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span>Walrus Storage</span>
              </div>
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4" />
                <span>Sui Blockchain</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Trust Oracle</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>Zero-Knowledge</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}