'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, TrendingUp, ChevronRight, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ModelHistoryItem {
  id: string;
  version: string;
  accuracy: number;
  date: string;
  contributors: number;
  changes: string;
  improvements?: string[];
  walrusCID?: string;
}

interface ModelHistoryListProps {
  history: ModelHistoryItem[];
  loading?: boolean;
  onViewDetails?: (item: ModelHistoryItem) => void;
}

export function ModelHistoryList({ 
  history, 
  loading = false,
  onViewDetails 
}: ModelHistoryListProps) {
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set());

  const toggleExpanded = (version: string) => {
    setExpandedVersions(prev => {
      const next = new Set(prev);
      if (next.has(version)) {
        next.delete(version);
      } else {
        next.add(version);
      }
      return next;
    });
  };

  const getAccuracyChange = (index: number): number | null => {
    if (index >= history.length - 1) return null;
    return history[index].accuracy - history[index + 1].accuracy;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Model History</CardTitle>
          <CardDescription>Loading version history...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Model History</CardTitle>
          <CardDescription>No version history available</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8 text-gray-500">
          <p>Version history will appear here once models are updated</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Model History</CardTitle>
        <CardDescription>
          Version history and improvements ({history.length} versions)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((item, index) => {
            const accuracyChange = getAccuracyChange(index);
            const isExpanded = expandedVersions.has(item.version);
            const isLatest = index === 0;

            return (
              <div 
                key={item.id || index} 
                className="group transition-all duration-200"
              >
                {/* Version Node */}
                <div className="flex gap-4">
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 ${
                        isLatest
                          ? 'bg-indigo-600 text-white shadow-lg'
                          : 'bg-indigo-100 text-indigo-800 group-hover:bg-indigo-200'
                      }`}
                    >
                      {item.version}
                    </div>
                    {index < history.length - 1 && (
                      <div className="h-full w-0.5 bg-gradient-to-b from-gray-300 to-transparent my-2"></div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 pb-4">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge 
                        variant="outline"
                        className={isLatest ? 'bg-indigo-100 text-indigo-800 border-indigo-200' : ''}
                      >
                        v{item.version}
                      </Badge>
                      
                      {isLatest && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          Latest
                        </Badge>
                      )}
                      
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-600">
                          {item.accuracy}%
                        </span>
                        {accuracyChange !== null && accuracyChange > 0 && (
                          <span className="text-xs text-green-600 font-medium">
                            (+{accuracyChange.toFixed(1)}%)
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 ml-auto">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(item.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </div>
                    </div>
                    
                    {/* Changes Description */}
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.changes}
                    </p>

                    {/* Improvements List (Expandable) */}
                    {item.improvements && item.improvements.length > 0 && (
                      <div className="mb-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpanded(item.version)}
                          className="h-auto p-1 text-xs text-gray-600 hover:text-gray-900"
                        >
                          <ChevronRight 
                            className={`h-3 w-3 mr-1 transition-transform duration-200 ${
                              isExpanded ? 'rotate-90' : ''
                            }`} 
                          />
                          {isExpanded ? 'Hide' : 'Show'} improvements ({item.improvements.length})
                        </Button>
                        
                        {isExpanded && (
                          <ul className="mt-2 space-y-1 pl-4 animate-in slide-in-from-top-2 duration-200">
                            {item.improvements.map((improvement, idx) => (
                              <li 
                                key={idx}
                                className="text-xs text-gray-600 flex items-start gap-2"
                              >
                                <span className="text-indigo-600 mt-1">•</span>
                                <span>{improvement}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{item.contributors.toLocaleString()} contributors</span>
                      </div>
                      
                      {onViewDetails && (
                        <Button 
                          variant="link" 
                          className="p-0 h-auto text-indigo-600 hover:text-indigo-700"
                          onClick={() => onViewDetails(item)}
                        >
                          View details
                        </Button>
                      )}
                    </div>

                    {/* Walrus CID */}
                    {item.walrusCID && (
                      <div className="mt-2 text-xs text-gray-500 font-mono">
                        CID: {item.walrusCID.substring(0, 12)}...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}