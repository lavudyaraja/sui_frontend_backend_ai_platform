'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Hash, Download, TrendingUp, Users, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface ModelVersion {
  id: string;
  version: string;
  walrusCID: string;
  dateCreated: string;
  accuracy?: number;
  contributors?: number;
  status?: 'active' | 'archived' | 'training';
  size?: string;
  parameters?: string;
}

interface ModelVersionCardProps {
  model: ModelVersion;
  onDownload?: (model: ModelVersion) => void;
  onViewDetails?: (model: ModelVersion) => void;
  showActions?: boolean;
}

export function ModelVersionCard({ 
  model, 
  onDownload,
  onViewDetails,
  showActions = true 
}: ModelVersionCardProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!onDownload) return;
    
    setDownloading(true);
    try {
      await onDownload(model);
    } finally {
      setDownloading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'training': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'archived': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="transition-all duration-200 hover:shadow-md hover:border-gray-300">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <CardTitle className="text-lg">Version {model.version}</CardTitle>
              {model.status && (
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getStatusColor(model.status)}`}
                >
                  {model.status}
                </Badge>
              )}
            </div>
            <CardDescription className="flex items-center text-sm">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(model.dateCreated).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </CardDescription>
          </div>
          {showActions && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDownload}
              disabled={downloading}
              className="transition-all duration-200 hover:bg-gray-100"
            >
              {downloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Walrus CID */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-3 transition-colors duration-200">
          <div className="flex items-start gap-2">
            <Hash className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-mono text-gray-600 break-all">
                {model.walrusCID.substring(0, 16)}...{model.walrusCID.substring(model.walrusCID.length - 8)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Walrus CID
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2">
          {model.accuracy !== undefined && (
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 transition-all duration-200 hover:shadow-sm">
              <div className="flex items-center gap-1 text-green-700 mb-1">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs font-medium">Accuracy</span>
              </div>
              <div className="text-xl font-bold text-green-700">
                {model.accuracy}%
              </div>
            </div>
          )}
          
          {model.contributors !== undefined && (
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 transition-all duration-200 hover:shadow-sm">
              <div className="flex items-center gap-1 text-blue-700 mb-1">
                <Users className="h-3 w-3" />
                <span className="text-xs font-medium">Contributors</span>
              </div>
              <div className="text-xl font-bold text-blue-700">
                {model.contributors.toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {/* Additional Info */}
        {(model.size || model.parameters) && (
          <div className="grid grid-cols-2 gap-2 pt-2 border-t">
            {model.size && (
              <div>
                <div className="text-xs text-gray-500">Size</div>
                <div className="text-sm font-medium text-gray-700">{model.size}</div>
              </div>
            )}
            {model.parameters && (
              <div>
                <div className="text-xs text-gray-500">Parameters</div>
                <div className="text-sm font-medium text-gray-700">{model.parameters}</div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {showActions && onViewDetails && (
          <div className="pt-2">
            <Button 
              variant="outline" 
              className="w-full transition-all duration-200 hover:bg-gray-100"
              onClick={() => onViewDetails(model)}
            >
              View Details
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}