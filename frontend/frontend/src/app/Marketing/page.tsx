'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Users, Shield, Zap, Cloud, LinkIcon, BarChart3, Rocket, ArrowRight, CheckCircle2, Database, Lock } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 md:py-28">
        <div className="flex flex-col items-center text-center">
          <Badge className="mb-6 px-4 py-2  text-indigo-700 border border-indigo-200 hover:border-indigo-300 transition-colors">
            <Rocket className="h-3.5 w-3.5 mr-2" />
            Built for Walrus Haulout Hackathon
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 tracking-tight">
            Sui-DAT: <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent">Distributed AI Trainer</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mb-12 leading-relaxed">
            Revolutionizing AI development through decentralized training on the Sui blockchain. 
            Contribute to cutting-edge models without sharing your data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="h-12 px-8 text-base bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-sm">
              <Link href="/join">
                Join the Network
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base border-slate-300 hover:bg-slate-50">
              <Link href="/about">Learn How It Works</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Hackathon Project Explanation */}
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto border-slate-200 shadow-sm">
          <CardContent className="p-8 md:p-10">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-2 rounded-lg bg-indigo-100">
                <Database className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-3">Walrus Haulout Hackathon Project</h2>
                <p className="text-slate-700 mb-4 leading-relaxed">
                  Sui-DAT is a decentralized AI training platform built for the Walrus Haulout Hackathon, 
                  demonstrating how Web3 technologies can revolutionize machine learning. Our project showcases 
                  the power of combining Sui's high-performance blockchain with Walrus's decentralized storage 
                  to create a privacy-preserving, collaborative AI training network.
                </p>
                <div className="flex flex-wrap gap-2 mt-5">
                  <Badge variant="secondary" className="px-3 py-1">AI x Data Track</Badge>
                  <Badge variant="secondary" className="px-3 py-1">Web3</Badge>
                  <Badge variant="secondary" className="px-3 py-1">Decentralized Storage</Badge>
                  <Badge variant="secondary" className="px-3 py-1">Privacy-First</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Highlights */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Powered by Web3 Innovation</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Leveraging cutting-edge blockchain and decentralized storage technologies
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border-slate-200 hover:border-indigo-200 transition-all duration-300 hover:shadow-md group">
            <CardContent className="p-8">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 w-fit mb-5 group-hover:scale-110 transition-transform">
                <Brain className="h-7 w-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">Decentralized Training</h3>
              <p className="text-slate-600 leading-relaxed">
                Train AI models collaboratively without centralizing data. Each participant contributes 
                gradients while keeping their raw data private and secure.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-slate-200 hover:border-indigo-200 transition-all duration-300 hover:shadow-md group">
            <CardContent className="p-8">
              <div className="p-3 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 w-fit mb-5 group-hover:scale-110 transition-transform">
                <Cloud className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">Walrus Storage</h3>
              <p className="text-slate-600 leading-relaxed">
                Utilizing Walrus for decentralized, scalable storage of model weights and training data, 
                ensuring data availability without central points of failure.
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-slate-200 hover:border-indigo-200 transition-all duration-300 hover:shadow-md group">
            <CardContent className="p-8">
              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 w-fit mb-5 group-hover:scale-110 transition-transform">
                <LinkIcon className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">Sui Orchestration</h3>
              <p className="text-slate-600 leading-relaxed">
                Leveraging Sui's parallel execution for real-time coordination of training sessions, 
                reputation tracking, and model versioning on-chain.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-br from-slate-50 to-indigo-50 rounded-3xl p-8 md:p-16 border border-slate-200">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How Sui-DAT Works</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              A seamless 4-step process to democratize AI development
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="bg-white border-2 border-indigo-200 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-5 shadow-sm">
                <span className="text-3xl font-bold text-indigo-600">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-slate-900">Connect Wallet</h3>
              <p className="text-slate-600 leading-relaxed">
                Connect your Sui wallet to join the decentralized training network
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-white border-2 border-indigo-200 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-5 shadow-sm">
                <span className="text-3xl font-bold text-indigo-600">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-slate-900">Select Model</h3>
              <p className="text-slate-600 leading-relaxed">
                Choose from available AI models to contribute your computing power
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-white border-2 border-indigo-200 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-5 shadow-sm">
                <span className="text-3xl font-bold text-indigo-600">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-slate-900">Train Locally</h3>
              <p className="text-slate-600 leading-relaxed">
                Run training iterations on your device and submit encrypted gradients
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-white border-2 border-indigo-200 rounded-2xl w-20 h-20 flex items-center justify-center mx-auto mb-5 shadow-sm">
                <span className="text-3xl font-bold text-indigo-600">4</span>
              </div>
              <h3 className="text-lg font-semibold mb-3 text-slate-900">Earn Rewards</h3>
              <p className="text-slate-600 leading-relaxed">
                Gain reputation points and SUI tokens for valuable contributions
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Choose Sui-DAT?</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Built on proven Web3 infrastructure for security, scalability, and transparency
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4 p-6 rounded-xl bg-white border border-slate-200">
              <div className="p-2 rounded-lg bg-emerald-100 shrink-0">
                <Lock className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Privacy-Preserving</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Your data never leaves your device. Only encrypted gradients are shared, ensuring complete privacy.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-6 rounded-xl bg-white border border-slate-200">
              <div className="p-2 rounded-lg bg-blue-100 shrink-0">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Community-Driven</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Join a global network of AI enthusiasts contributing to open-source machine learning models.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-6 rounded-xl bg-white border border-slate-200">
              <div className="p-2 rounded-lg bg-purple-100 shrink-0">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Transparent & Verifiable</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  All contributions are recorded on-chain, creating an immutable audit trail for model development.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-6 rounded-xl bg-white border border-slate-200">
              <div className="p-2 rounded-lg bg-indigo-100 shrink-0">
                <Zap className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Earn While Contributing</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Receive SUI tokens and reputation points for your contributions to AI model training.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}

       <div className="container mx-auto px-4 py-20">
      <div className="relative bg-slate-900 rounded-3xl p-10 md:p-16 text-center shadow-xl overflow-hidden">
        
        {/* Content */}
        <div className="relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Democratize AI?
          </h2>
          <p className="text-slate-300 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Join the movement to make AI development more accessible, privacy-preserving, and collaborative.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="h-12 px-8 bg-blue-600 text-white hover:bg-blue-700 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <Link href="/Marketing/join">
                Join the Training Network
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="secondary" className="h-12 px-8 bg-slate-700 text-white hover:bg-slate-600 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
              <Link href="/pricing">View Contribution Tiers</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center mb-4">
                <Brain className="h-8 w-8 text-indigo-600 mr-2" />
                <span className="text-xl font-bold text-slate-900">Sui-DAT</span>
              </div>
              <p className="text-slate-600 mb-5 leading-relaxed">
                Decentralized AI training on the Sui blockchain.
              </p>
              <Badge variant="secondary" className="px-3 py-1">Walrus Haulout Hackathon</Badge>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 mb-5">Product</h3>
              <ul className="space-y-3">
                <li><Link href="/dashboard" className="text-slate-600 hover:text-indigo-600 transition-colors">Dashboard</Link></li>
                <li><Link href="/about" className="text-slate-600 hover:text-indigo-600 transition-colors">How It Works</Link></li>
                <li><Link href="/pricing" className="text-slate-600 hover:text-indigo-600 transition-colors">Contribution Tiers</Link></li>
                <li><Link href="/join" className="text-slate-600 hover:text-indigo-600 transition-colors">Join Network</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 mb-5">Resources</h3>
              <ul className="space-y-3">
                <li><Link href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">Documentation</Link></li>
                <li><Link href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">GitHub</Link></li>
                <li><Link href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">Whitepaper</Link></li>
                <li><Link href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">API Reference</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-slate-900 mb-5">Connect</h3>
              <ul className="space-y-3">
                <li><Link href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">Twitter</Link></li>
                <li><Link href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">Discord</Link></li>
                <li><Link href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">Telegram</Link></li>
                <li><Link href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">Community Forum</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-sm">
              Built with ❤️ for the Walrus Haulout Hackathon
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-slate-600 hover:text-indigo-600 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}