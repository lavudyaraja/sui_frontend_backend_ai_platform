'use client';

import { useState, useEffect } from 'react';

export interface LiveUpdate {
  id: string;
  type: 'training' | 'upload' | 'contribution' | 'model_update';
  message: string;
  timestamp: Date;
  modelId?: string;
  contributorAddress?: string;
}

export function useLiveUpdates() {
  const [updates, setUpdates] = useState<LiveUpdate[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Simulate live updates
  useEffect(() => {
    setIsConnected(true);
    
    const generateUpdate = () => {
      const types: LiveUpdate['type'][] = ['training', 'upload', 'contribution', 'model_update'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      const messages = {
        training: 'New training session started',
        upload: 'Gradients uploaded to Walrus',
        contribution: 'New contribution received',
        model_update: 'Model accuracy improved by 0.2%',
      };
      
      const newUpdate: LiveUpdate = {
        id: `update_${Date.now()}`,
        type,
        message: messages[type],
        timestamp: new Date(),
      };
      
      setUpdates(prev => [newUpdate, ...prev.slice(0, 19)]); // Keep only last 20 updates
    };
    
    // Generate a new update every 5-10 seconds
    const interval = setInterval(generateUpdate, 5000 + Math.random() * 5000);
    
    // Generate initial updates
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        generateUpdate();
      }, i * 1000);
    }
    
    return () => {
      clearInterval(interval);
      setIsConnected(false);
    };
  }, []);

  const addUpdate = (update: Omit<LiveUpdate, 'id' | 'timestamp'>) => {
    const newUpdate: LiveUpdate = {
      id: `update_${Date.now()}`,
      timestamp: new Date(),
      ...update,
    };
    
    setUpdates(prev => [newUpdate, ...prev.slice(0, 19)]);
  };

  return {
    updates,
    isConnected,
    addUpdate,
  };
}