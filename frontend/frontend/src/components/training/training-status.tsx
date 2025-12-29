'use client';

import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Play, 
  Upload, 
  CheckCircle, 
  Pause 
} from 'lucide-react';

interface TrainingStatusProps {
  status: 'idle' | 'preparing' | 'training' | 'uploading' | 'completed';
}

export function TrainingStatus({ status }: TrainingStatusProps) {
  const getStatusInfo = () => {
    switch (status) {
      case 'idle':
        return {
          icon: <Clock className="h-4 w-4" />,
          text: 'Ready to start',
          variant: 'secondary'
        };
      case 'preparing':
        return {
          icon: <Play className="h-4 w-4" />,
          text: 'Preparing training environment',
          variant: 'default'
        };
      case 'training':
        return {
          icon: <Play className="h-4 w-4" />,
          text: 'Training in progress',
          variant: 'default'
        };
      case 'uploading':
        return {
          icon: <Upload className="h-4 w-4" />,
          text: 'Uploading gradients',
          variant: 'default'
        };
      case 'completed':
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          text: 'Training completed',
          variant: 'secondary'
        };
      default:
        return {
          icon: <Pause className="h-4 w-4" />,
          text: 'Paused',
          variant: 'secondary'
        };
    }
  };

  const { icon, text, variant } = getStatusInfo();

  return (
    <div className="flex items-center">
      <Badge variant={variant as any} className="flex items-center gap-2">
        {icon}
        {text}
      </Badge>
    </div>
  );
}