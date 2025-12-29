'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from '@/store/useAuthStore';
import { Wallet, Zap, Brain, Users, CheckCircle, ExternalLink, TrendingUp, Activity, Award } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { JSX } from 'react';

// Mock fetch function - replace with actual API call
const fetchTopContributors = async (limit: number = 5) => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { id: '1', address: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12', contributions: 145, reputation: 2450 },
    { id: '2', address: '0x9f8e7d6c5b4a3c2b1a0f9e8d7c6b5a4f3c2b1a0f', contributions: 132, reputation: 2180 },
    { id: '3', address: '0x4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b', contributions: 98, reputation: 1650 },
    { id: '4', address: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c', contributions: 87, reputation: 1420 },
    { id: '5', address: '0x5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d', contributions: 76, reputation: 1280 },
  ];
};

export default function JoinNetworkPage(): JSX.Element {
  const { isAuthenticated, userAddress, connecting, connectWallet } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Format address for display
  const shortAddress = userAddress 
    ? `${userAddress.substring(0, 6)}...${userAddress.substring(userAddress.length - 4)}`
    : '';

  // Fetch leaderboard data
  const { data: contributors = [], isLoading } = useQuery({
    queryKey: ['contributors', 'leaderboard'],
    queryFn: () => fetchTopContributors(5),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please connect your wallet first');
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setName('');
      setEmail('');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200">
              <Zap className="h-3.5 w-3.5 mr-2" />
              Join Our Network
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Join the Training Network</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Start contributing to decentralized AI today and work your way up through our contribution tiers.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Join Form */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Wallet className="h-5 w-5 text-indigo-600 mr-2" />
                  Connect to Start Contributing
                </CardTitle>
                <CardDescription>
                  Connect your Sui wallet to join the decentralized training network
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isAuthenticated ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="p-4 rounded-full bg-indigo-50 mb-6">
                      <Wallet className="h-12 w-12 text-indigo-600" />
                    </div>
                    <p className="text-slate-600 mb-6 text-center leading-relaxed max-w-md">
                      Connect your Sui wallet to begin contributing to decentralized AI models. 
                      You'll be able to participate in training sessions and earn reputation points.
                    </p>
                    <Button 
                      onClick={connectWallet}
                      disabled={connecting}
                      className="h-11 px-6 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      {connecting ? 'Connecting...' : 'Connect Wallet'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="h-5 w-5 text-emerald-600 mr-2" />
                        <span className="font-semibold text-emerald-800">Wallet Connected</span>
                      </div>
                      <p className="text-sm text-emerald-700">
                        Your wallet <span className="font-mono">{shortAddress}</span> is connected and ready to contribute.
                      </p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                        <Input 
                          id="name" 
                          placeholder="Enter your full name" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          className="h-11 border-slate-300"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="Enter your email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-11 border-slate-300"
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full h-11 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800"
                        disabled={isSubmitting || isSubmitted}
                      >
                        {isSubmitting ? (
                          <>
                            <Activity className="mr-2 h-4 w-4 animate-spin" />
                            Joining Network...
                          </>
                        ) : isSubmitted ? (
                          <>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Successfully Joined!
                          </>
                        ) : (
                          'Join the Training Network'
                        )}
                      </Button>
                    </form>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col items-center border-t pt-6">
                <p className="text-sm text-slate-500 text-center leading-relaxed">
                  By joining, you agree to our terms of service and privacy policy.
                </p>
              </CardFooter>
            </Card>

            {/* Network Stats */}
            <div className="space-y-6">
              <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Brain className="h-5 w-5 text-indigo-600 mr-2" />
                    Network Statistics
                  </CardTitle>
                  <CardDescription>
                    Real-time stats from our decentralized AI training network
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4 text-indigo-600" />
                        <p className="text-xs font-medium text-slate-600">Active Contributors</p>
                      </div>
                      <p className="text-3xl font-bold text-indigo-600">1,248</p>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="h-4 w-4 text-purple-600" />
                        <p className="text-xs font-medium text-slate-600">AI Models</p>
                      </div>
                      <p className="text-3xl font-bold text-purple-600">24</p>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-4 w-4 text-blue-600" />
                        <p className="text-xs font-medium text-slate-600">Training Sessions</p>
                      </div>
                      <p className="text-3xl font-bold text-blue-600">876</p>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-emerald-600" />
                        <p className="text-xs font-medium text-slate-600">Gradients Processed</p>
                      </div>
                      <p className="text-3xl font-bold text-emerald-600">1.2M</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Contributors */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl">
                    <Award className="h-5 w-5 text-indigo-600 mr-2" />
                    Top Contributors
                  </CardTitle>
                  <CardDescription>
                    Leading participants in our decentralized training network
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Activity className="h-6 w-6 animate-spin text-indigo-600" />
                    </div>
                  ) : contributors.length > 0 ? (
                    <div className="space-y-3">
                      {contributors.map((contributor: any, index: number) => (
                        <div key={contributor.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white ${
                              index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                              index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-500' :
                              index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                              'bg-gradient-to-br from-indigo-400 to-indigo-600'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-mono font-medium text-sm text-slate-900">
                                {contributor.address.substring(0, 6)}...{contributor.address.substring(contributor.address.length - 4)}
                              </p>
                              <p className="text-xs text-slate-500">
                                {contributor.contributions} contributions
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="px-3 py-1">
                            {contributor.reputation} pts
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-600 text-center py-8">No contributors data available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Getting Started Steps */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-2xl">How to Get Started</CardTitle>
              <CardDescription>
                Begin your journey as a decentralized AI contributor in three simple steps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-slate-900">Connect Wallet</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Connect your Sui wallet to authenticate and track your contributions.
                  </p>
                </div>
                
                <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-slate-900">Install Client</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Download and install our training client to begin contributing compute.
                  </p>
                </div>
                
                <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-slate-900">Start Training</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Select models to train and begin earning reputation points.
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-center gap-4 border-t pt-6">
              <Button asChild className="w-full md:w-auto h-11 px-8 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800">
                <Link href="/dashboard">
                  Go to Dashboard
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <p className="text-sm text-slate-500">
                Already have the client installed? Go directly to your dashboard.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}