'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface Settings {
  theme: 'light' | 'dark';
  training: {
    autoStart: boolean;
    maxConcurrent: number;
    notifications: boolean;
  };
  notifications: {
    email: boolean;
    push: boolean;
    trainingUpdates: boolean;
    modelUpdates: boolean;
  };
  wallet: {
    autoConnect: boolean;
    preferredNetwork: 'testnet' | 'mainnet' | 'devnet';
  };
}

interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const defaultSettings: Settings = {
  theme: 'light',
  training: {
    autoStart: false,
    maxConcurrent: 1,
    notifications: true,
  },
  notifications: {
    email: true,
    push: true,
    trainingUpdates: true,
    modelUpdates: true,
  },
  wallet: {
    autoConnect: true,
    preferredNetwork: 'testnet',
  },
};

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Failed to parse settings', e);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return context;
}