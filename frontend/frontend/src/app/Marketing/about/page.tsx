'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Users, Globe, Lock, Zap, Database, LinkIcon, BarChart3, Shield, CheckCircle2, Target } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200">
              <Zap className="h-3.5 w-3.5 mr-2" />
              Walrus Haulout Hackathon
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">About Sui-DAT</h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Revolutionizing AI development through decentralized training on the Sui blockchain
            </p>
          </div>

          {/* What Sui-DAT is */}
          <Card className="mb-12 border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Brain className="h-6 w-6 text-indigo-600 mr-3" />
                What is Sui-DAT?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 leading-relaxed">
                Sui-DAT (Sui Distributed AI Trainer) is a decentralized machine learning platform that 
                enables collaborative, privacy-preserving AI training on the Sui blockchain. Our platform 
                allows contributors to participate in training cutting-edge AI models without sharing their 
                raw data, leveraging the power of distributed computing.
              </p>
              <p className="text-slate-700 leading-relaxed">
                Built specifically for the Walrus Haulout Hackathon, Sui-DAT demonstrates how Web3 
                technologies can transform the landscape of artificial intelligence development by 
                creating a trustless, transparent, and inclusive ecosystem for AI research.
              </p>
            </CardContent>
          </Card>

          {/* Why Decentralized AI Training is Important */}
          <Card className="mb-12 border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Globe className="h-6 w-6 text-indigo-600 mr-3" />
                Why Decentralized AI Training Matters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                Traditional AI development suffers from centralization issues that limit innovation and 
                create barriers to entry. Data monopolization by large corporations, lack of incentives for 
                individual contributors, and opaque model development processes hinder the advancement of 
                AI for the benefit of all humanity.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="p-2 rounded-lg bg-emerald-100 shrink-0">
                    <Lock className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Privacy Preservation</h4>
                    <p className="text-sm text-slate-600">Contributors never share raw data</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="p-2 rounded-lg bg-blue-100 shrink-0">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Global Participation</h4>
                    <p className="text-sm text-slate-600">Anyone can contribute regardless of location</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="p-2 rounded-lg bg-purple-100 shrink-0">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Transparent Development</h4>
                    <p className="text-sm text-slate-600">All contributions are verifiable on-chain</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="p-2 rounded-lg bg-indigo-100 shrink-0">
                    <Zap className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-1">Incentivized Collaboration</h4>
                    <p className="text-sm text-slate-600">Contributors earn rewards for valuable work</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How Walrus, Seal, and Sui are Used */}
          <Card className="mb-12 border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Database className="h-6 w-6 text-indigo-600 mr-3" />
                Web3 Technology Stack
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 rounded-xl bg-gradient-to-br from-indigo-50 to-white border border-indigo-100">
                <h3 className="text-lg font-semibold flex items-center mb-3 text-slate-900">
                  <LinkIcon className="h-5 w-5 text-indigo-600 mr-2" />
                  Sui Blockchain
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Sui provides the orchestration layer for our decentralized AI training network. 
                  Its parallel execution capabilities enable real-time coordination of training sessions, 
                  reputation tracking, and model versioning. Smart contracts validate contributions and 
                  distribute rewards automatically.
                </p>
              </div>
              
              <div className="p-6 rounded-xl bg-gradient-to-br from-purple-50 to-white border border-purple-100">
                <h3 className="text-lg font-semibold flex items-center mb-3 text-slate-900">
                  <Database className="h-5 w-5 text-purple-600 mr-2" />
                  Walrus Storage
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Walrus serves as our decentralized storage solution for model weights, training 
                  configurations, and aggregated gradients. Its scalable architecture ensures that 
                  large AI models can be stored and retrieved efficiently without central points of failure.
                </p>
              </div>
              
              <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-white border border-blue-100">
                <h3 className="text-lg font-semibold flex items-center mb-3 text-slate-900">
                  <Shield className="h-5 w-5 text-blue-600 mr-2" />
                  Seal Integration
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  Seal provides the cryptographic foundation for our privacy-preserving training 
                  mechanism. It enables secure gradient computation and verification, ensuring that 
                  contributors can participate in model training without exposing sensitive data.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Inspiration and Problem Solving */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Zap className="h-6 w-6 text-indigo-600 mr-2" />
                  Inspiration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed">
                  Sui-DAT was inspired by the need to democratize AI development and address the 
                  centralization challenges in current machine learning approaches. We believe that 
                  the future of AI should be collaborative, transparent, and privacy-preserving, 
                  enabling contributions from individuals and organizations worldwide.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Target className="h-6 w-6 text-indigo-600 mr-2" />
                  Problem Solved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 leading-relaxed">
                  Our platform solves the critical issues of data monopolization, lack of contributor 
                  incentives, and opaque model development. By leveraging blockchain and decentralized 
                  storage, we create a trustless environment where anyone can contribute to AI advancement 
                  while maintaining control over their data.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* AI x Data Track Fit */}
          <Card className="mb-12 border-indigo-200 shadow-sm bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Database className="h-6 w-6 text-indigo-600 mr-3" />
                Perfect Fit for AI x Data Track
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-slate-700 leading-relaxed">
                Sui-DAT exemplifies the intersection of AI and decentralized data management. Our 
                project demonstrates how Web3 technologies can revolutionize data usage in AI development:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Decentralized data ownership without compromising utility for AI training</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Privacy-preserving computation that maintains model performance</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Transparent, verifiable data lineage for AI model auditing</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                  <span className="text-slate-700">Incentivized data contribution models for community-driven AI</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Vision and Mission */}
          <Card className="mb-12 border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Globe className="h-6 w-6 text-indigo-600 mr-3" />
                Vision and Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Our Vision</h3>
                  <p className="text-slate-700 leading-relaxed">
                    We envision a future where AI development is truly decentralized, with contributions 
                    from individuals and organizations worldwide, creating models that serve humanity's 
                    best interests while respecting individual privacy and data ownership.
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="text-lg font-semibold mb-3 text-slate-900">Our Mission</h3>
                  <p className="text-slate-700 leading-relaxed">
                    To democratize AI development by creating a trustless, transparent, and inclusive 
                    platform that enables privacy-preserving collaborative machine learning, breaking 
                    down barriers to innovation and ensuring AI benefits everyone.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA Section */}
          <div className="text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Join Our Movement</h2>
            <p className="text-slate-700 text-lg max-w-2xl mx-auto leading-relaxed">
              Become part of the movement to democratize AI development. Whether you're a researcher, 
              developer, or enthusiast, there's a place for you in our community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="h-12 px-8 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-sm">
                <Link href="/join">Join the Training Network</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-8 border-slate-300 hover:bg-slate-50">
                <Link href="/pricing">View Contribution Tiers</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}