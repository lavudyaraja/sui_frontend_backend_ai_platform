'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CheckCircle, Star, Users, Zap, Award, Crown, Server, BarChart3, Trophy, Lock } from 'lucide-react';
import Link from 'next/link';

export default function ContributionTiersPage() {
  const tiers = [
    {
      name: "Basic Contributor",
      description: "Perfect for individuals getting started",
      icon: <Users className="h-6 w-6" />,
      reputation: "1-100 pts",
      features: [
        "Contribute to public models",
        "Basic reputation tracking",
        "Community support",
        "5GB storage on Walrus",
        "Standard training sessions",
        "Basic leaderboard visibility"
      ],
      badge: "Bronze",
      badgeColor: "bg-amber-600",
      cta: "Join Network",
    },
    {
      name: "Power Trainer",
      description: "For serious contributors and researchers",
      icon: <Zap className="h-6 w-6" />,
      reputation: "101-1000 pts",
      features: [
        "Priority access to new models",
        "Advanced reputation analytics",
        "Priority support",
        "50GB storage on Walrus",
        "Enhanced training sessions",
        "Premium leaderboard visibility",
        "Early access to model updates",
        "Contribution performance insights"
      ],
      badge: "Silver",
      badgeColor: "bg-gray-400",
      cta: "Upgrade Contribution",
      popular: true,
    },
    {
      name: "Elite Node",
      description: "For universities and organizations",
      icon: <Crown className="h-6 w-6" />,
      reputation: "1001+ pts",
      features: [
        "Unlimited model access",
        "Dedicated support channel",
        "Unlimited Walrus storage",
        "High-performance training sessions",
        "Top leaderboard placement",
        "Exclusive model previews",
        "Custom model development",
        "Team management dashboard",
        "Contribution impact analytics"
      ],
      badge: "Gold",
      badgeColor: "bg-yellow-500",
      cta: "Become Elite",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-indigo-100 text-indigo-800">
            <Star className="h-4 w-4 mr-1" />
            Contribution-Based Tiers
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contribution Tiers</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Earn reputation points and unlock benefits based on your contributions to decentralized AI training
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {tiers.map((tier) => (
            <Card 
              key={tier.name} 
              className={`relative ${tier.popular ? 'border-indigo-500 ring-2 ring-indigo-500' : ''}`}
            >
              {tier.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <Badge className="bg-indigo-500">
                    <Zap className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className={`p-3 rounded-full ${tier.popular ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                    {tier.icon}
                  </div>
                </div>
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="mb-6 text-center">
                  <div className="flex justify-center mb-2">
                    <Badge className={tier.badgeColor}>
                      {tier.badge} Tier
                    </Badge>
                  </div>
                  <span className="text-2xl font-bold text-indigo-600">{tier.reputation}</span>
                  <span className="text-gray-600 block">Reputation Points</span>
                </div>
                
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  asChild
                  className="w-full" 
                  variant={tier.popular ? "default" : "outline"}
                >
                  <Link href="/join">{tier.cta}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Comparison Grid */}
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-6xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Tier Comparison</h2>
            <p className="text-gray-600">Detailed breakdown of benefits across contribution tiers</p>
          </div>
          
          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
              <TabsTrigger value="access">Access</TabsTrigger>
            </TabsList>
            
            <TabsContent value="features">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-4">Feature</th>
                      {tiers.map(tier => (
                        <th key={tier.name} className="text-center pb-4 px-2">
                          <div className="flex flex-col items-center">
                            <span className="font-semibold">{tier.name}</span>
                            <Badge className={tier.badgeColor} variant="secondary">
                              {tier.badge}
                            </Badge>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-4 font-medium">Model Access</td>
                      <td className="text-center py-4">Public Only</td>
                      <td className="text-center py-4">Priority Access</td>
                      <td className="text-center py-4">Unlimited Access</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 font-medium">Storage</td>
                      <td className="text-center py-4">5GB Walrus</td>
                      <td className="text-center py-4">50GB Walrus</td>
                      <td className="text-center py-4">Unlimited</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 font-medium">Training Sessions</td>
                      <td className="text-center py-4">Standard</td>
                      <td className="text-center py-4">Enhanced</td>
                      <td className="text-center py-4">High-Performance</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 font-medium">Support</td>
                      <td className="text-center py-4">Community</td>
                      <td className="text-center py-4">Priority</td>
                      <td className="text-center py-4">Dedicated</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-4 font-medium">Leaderboard</td>
                      <td className="text-center py-4">Basic</td>
                      <td className="text-center py-4">Premium</td>
                      <td className="text-center py-4">Top Placement</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>
            
            <TabsContent value="rewards">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="h-5 w-5 text-amber-600 mr-2" />
                      Bronze Tier Rewards
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Base reputation points</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Community recognition</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Basic training certificates</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Trophy className="h-5 w-5 text-gray-400 mr-2" />
                      Silver Tier Rewards
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Enhanced reputation multipliers</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Exclusive contributor badges</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Early access to new features</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Performance analytics</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Crown className="h-5 w-5 text-yellow-500 mr-2" />
                      Gold Tier Rewards
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Maximum reputation multipliers</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Elite contributor status</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Custom model development rights</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Impact analytics dashboard</span>
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>Team management tools</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="access">
              <Card>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                      <h3 className="font-semibold text-lg mb-4 flex items-center">
                        <Lock className="h-5 w-5 text-indigo-600 mr-2" />
                        Public Access
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Basic models</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Standard documentation</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Community forums</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-4 flex items-center">
                        <Server className="h-5 w-5 text-indigo-600 mr-2" />
                        Priority Access
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Advanced models</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Extended documentation</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Priority support</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Beta features</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-4 flex items-center">
                        <BarChart3 className="h-5 w-5 text-indigo-600 mr-2" />
                        Elite Access
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>All models + custom</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Complete documentation</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Dedicated support</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Exclusive features</span>
                        </li>
                        <li className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          <span>Research collaboration</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Join the Training Network?
          </h2>
          <p className="text-indigo-100 text-xl mb-8 max-w-2xl mx-auto">
            Start contributing to decentralized AI today and work your way up through our contribution tiers.
          </p>
          <Button asChild size="lg" className="bg-white text-indigo-600 hover:bg-gray-100">
            <Link href="/join">Join the Training Network</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}