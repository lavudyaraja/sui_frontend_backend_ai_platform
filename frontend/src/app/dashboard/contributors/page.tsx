'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, Trophy } from 'lucide-react';

interface Contributor {
  id: string;
  address: string;
  reputation: number;
  contributions: number;
  rank: number;
  joinedAt: string;
  tier: 'Basic' | 'Power' | 'Elite';
  avatar?: string;
}

const getTierBadge = (tier: string) => {
  switch (tier) {
    case 'Elite':
      return <Badge className="bg-purple-500">Elite</Badge>;
    case 'Power':
      return <Badge className="bg-blue-500">Power</Badge>;
    default:
      return <Badge variant="secondary">Basic</Badge>;
  }
};

const getRankBadge = (rank: number) => {
  if (rank === 1) {
    return <Badge className="bg-yellow-500 text-yellow-900">1st</Badge>;
  } else if (rank === 2) {
    return <Badge className="bg-gray-300 text-gray-900">2nd</Badge>;
  } else if (rank === 3) {
    return <Badge className="bg-amber-800 text-amber-100">3rd</Badge>;
  }
  return rank;
};

export default function ContributorsPage() {
  // Mock data - in a real app this would come from an API
  const [contributors] = useState<Contributor[]>([
    {
      id: '1',
      address: '0x1a2b3c4d5e6f7890abcdef1234567890abcdef12',
      reputation: 2450,
      contributions: 87,
      rank: 1,
      joinedAt: '2024-01-15T10:30:00Z',
      tier: 'Elite',
    },
    {
      id: '2',
      address: '0x2b3c4d5e6f7890abcdef1234567890abcdef123',
      reputation: 2100,
      contributions: 76,
      rank: 2,
      joinedAt: '2024-01-10T14:22:00Z',
      tier: 'Elite',
    },
    {
      id: '3',
      address: '0x3c4d5e6f7890abcdef1234567890abcdef12345',
      reputation: 1950,
      contributions: 68,
      rank: 3,
      joinedAt: '2024-01-08T09:15:00Z',
      tier: 'Elite',
    },
    {
      id: '4',
      address: '0x4d5e6f7890abcdef1234567890abcdef1234567',
      reputation: 1800,
      contributions: 62,
      rank: 4,
      joinedAt: '2024-01-12T16:45:00Z',
      tier: 'Power',
    },
    {
      id: '5',
      address: '0x5e6f7890abcdef1234567890abcdef123456789',
      reputation: 1650,
      contributions: 54,
      rank: 5,
      joinedAt: '2024-01-05T11:30:00Z',
      tier: 'Power',
    },
    {
      id: '6',
      address: '0x6f7890abcdef1234567890abcdef1234567890a',
      reputation: 1500,
      contributions: 48,
      rank: 6,
      joinedAt: '2024-01-03T13:20:00Z',
      tier: 'Power',
    },
    {
      id: '7',
      address: '0x7890abcdef1234567890abcdef1234567890abc',
      reputation: 1350,
      contributions: 42,
      rank: 7,
      joinedAt: '2024-01-07T15:10:00Z',
      tier: 'Basic',
    },
    {
      id: '8',
      address: '0x890abcdef1234567890abcdef1234567890abcd',
      reputation: 1200,
      contributions: 36,
      rank: 8,
      joinedAt: '2024-01-09T17:05:00Z',
      tier: 'Basic',
    },
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contributors Leaderboard</h1>
        <p className="text-muted-foreground">
          Top contributors to decentralized AI training
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Global Rankings</CardTitle>
              <CardDescription>
                Top contributors across all models
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Rank</TableHead>
                    <TableHead>Contributor</TableHead>
                    <TableHead className="text-right">Reputation</TableHead>
                    <TableHead className="text-right">Contributions</TableHead>
                    <TableHead>Tier</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contributors.map((contributor) => (
                    <TableRow key={contributor.id}>
                      <TableCell className="font-medium">
                        {getRankBadge(contributor.rank)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Avatar className="h-9 w-9 mr-3">
                            <AvatarFallback>
                              {contributor.address.substring(0, 6)}...{contributor.address.substring(contributor.address.length - 4)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {contributor.address.substring(0, 6)}...{contributor.address.substring(contributor.address.length - 4)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Joined {new Date(contributor.joinedAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {contributor.reputation.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {contributor.contributions}
                      </TableCell>
                      <TableCell>
                        {getTierBadge(contributor.tier)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Leaderboard Info
              </CardTitle>
              <CardDescription>
                How the ranking system works
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">Ranking Criteria</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Reputation points for quality contributions</li>
                  <li>• Total gradients submitted</li>
                  <li>• Model accuracy improvements</li>
                  <li>• Community engagement</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Contribution Tiers</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Basic</Badge>
                    <span className="text-sm">0-1000 pts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-blue-500">Power</Badge>
                    <span className="text-sm">1001-2000 pts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-purple-500">Elite</Badge>
                    <span className="text-sm">2001+ pts</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button className="w-full">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter Rankings
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
              <CardDescription>
                Download leaderboard information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Export as CSV
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  Export as JSON
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}