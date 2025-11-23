'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CampaignWizardData, Channel, LocationTarget } from '@/types';

// Helper to generate unique IDs
function generateId(): string {
  return `loc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

interface CampaignWizardContextType {
  wizardData: CampaignWizardData;
  updateWizardData: (data: Partial<CampaignWizardData>) => void;
  resetWizardData: () => void;
  toggleChannel: (channel: Channel) => void;
  addLocation: () => void;
  updateLocation: (id: string, updates: Partial<LocationTarget>) => void;
  removeLocation: (id: string) => void;
}

const defaultWizardData: CampaignWizardData = {
  campaignName: '',
  businessName: '',
  businessType: '',
  goal: '',
  channels: ['Facebook / Instagram'], // Default channel
  locations: [
    { id: generateId(), name: '', radiusKm: 10 }
  ],
  audiencePreset: '',
  customAudienceDescription: '',
  budgetType: 'Daily budget',
  budgetAmount: 0,
  startDate: new Date().toISOString().split('T')[0],
  endDate: null,
  offerDescription: '',
  selectedAdCopy: null,
  editedAdCopy: null,
  imageUrl: null,
};

const CampaignWizardContext = createContext<CampaignWizardContextType | undefined>(undefined);

export function CampaignWizardProvider({ children }: { children: ReactNode }) {
  const [wizardData, setWizardData] = useState<CampaignWizardData>(defaultWizardData);

  const updateWizardData = (data: Partial<CampaignWizardData>) => {
    setWizardData(prev => ({ ...prev, ...data }));
  };

  const resetWizardData = () => {
    setWizardData(defaultWizardData);
  };

  const toggleChannel = (channel: Channel) => {
    setWizardData(prev => {
      const currentChannels = prev.channels || [];
      const isSelected = currentChannels.includes(channel);
      
      // Prevent removing the last channel
      if (isSelected && currentChannels.length === 1) {
        return prev; // Keep at least one channel
      }
      
      const newChannels = isSelected
        ? currentChannels.filter(ch => ch !== channel)
        : [...currentChannels, channel];
      
      return { ...prev, channels: newChannels };
    });
  };

  const addLocation = () => {
    setWizardData(prev => ({
      ...prev,
      locations: [
        ...prev.locations,
        { id: generateId(), name: '', radiusKm: 10 }
      ]
    }));
  };

  const updateLocation = (id: string, updates: Partial<LocationTarget>) => {
    setWizardData(prev => ({
      ...prev,
      locations: prev.locations.map(loc =>
        loc.id === id ? { ...loc, ...updates } : loc
      )
    }));
  };

  const removeLocation = (id: string) => {
    setWizardData(prev => {
      // Prevent removing the last location
      if (prev.locations.length <= 1) {
        return prev;
      }
      return {
        ...prev,
        locations: prev.locations.filter(loc => loc.id !== id)
      };
    });
  };

  return (
    <CampaignWizardContext.Provider value={{ 
      wizardData, 
      updateWizardData, 
      resetWizardData,
      toggleChannel,
      addLocation,
      updateLocation,
      removeLocation,
    }}>
      {children}
    </CampaignWizardContext.Provider>
  );
}

export function useCampaignWizard() {
  const context = useContext(CampaignWizardContext);
  if (context === undefined) {
    throw new Error('useCampaignWizard must be used within a CampaignWizardProvider');
  }
  return context;
}


