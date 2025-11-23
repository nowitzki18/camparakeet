'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CampaignWizardData } from '@/types';

interface CampaignWizardContextType {
  wizardData: CampaignWizardData;
  updateWizardData: (data: Partial<CampaignWizardData>) => void;
  resetWizardData: () => void;
}

const defaultWizardData: CampaignWizardData = {
  campaignName: '',
  businessName: '',
  businessType: '',
  goal: '',
  location: '',
  radius: '10km',
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

  return (
    <CampaignWizardContext.Provider value={{ wizardData, updateWizardData, resetWizardData }}>
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

