'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCampaignWizard } from '@/context/CampaignWizardContext';
import StepLayout from '@/components/StepLayout';
import AudienceSummaryCard from '@/components/AudienceSummaryCard';
import BudgetProjectionCard from '@/components/BudgetProjectionCard';
import AdPreviewCard from '@/components/AdPreviewCard';
import { generateAdCopy } from '@/lib/aiMock';
import { saveCampaign } from '@/lib/campaignStore';
import { BusinessType, CampaignGoal, AudiencePreset, BudgetType, AdCopySuggestion, Channel } from '@/types';

export default function WizardPage() {
  const router = useRouter();
  const { wizardData, updateWizardData, toggleChannel, addLocation, updateLocation, removeLocation } = useCampaignWizard();
  const [currentStep, setCurrentStep] = useState(1);
  const [adCopySuggestions, setAdCopySuggestions] = useState<AdCopySuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(wizardData.imageUrl);

  const totalSteps = 5;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setImagePreview(dataUrl);
        updateWizardData({ imageUrl: dataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAdCopy = () => {
    if (!wizardData.businessName || !wizardData.offerDescription || !wizardData.goal) {
      alert('Please fill in business name, offer description, and goal first.');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const suggestions = generateAdCopy({
        businessName: wizardData.businessName,
        offer: wizardData.offerDescription,
        goal: wizardData.goal as CampaignGoal,
        businessType: wizardData.businessType,
      });
      setAdCopySuggestions(suggestions);
      setIsGenerating(false);
    }, 1000);
  };

  const handleSelectAdCopy = (suggestion: AdCopySuggestion) => {
    updateWizardData({ selectedAdCopy: suggestion, editedAdCopy: suggestion });
  };

  const handleEditAdCopy = (field: keyof AdCopySuggestion, value: string) => {
    const current = wizardData.editedAdCopy || wizardData.selectedAdCopy;
    if (current) {
      updateWizardData({
        editedAdCopy: { ...current, [field]: value },
      });
    }
  };

  const handleLaunchCampaign = () => {
    if (!wizardData.editedAdCopy && !wizardData.selectedAdCopy) {
      alert('Please select or create ad copy before launching.');
      return;
    }

    const campaign = saveCampaign({
      ...wizardData,
      editedAdCopy: wizardData.editedAdCopy || wizardData.selectedAdCopy,
      status: 'Active',
    });

    router.push(`/dashboard?campaign=${campaign.id}`);
  };

  // Step 1: Goal & Business Info
  const renderStep1 = () => (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-medium">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Goal & Business Info</h2>
          <p className="text-gray-600 mt-1">Tell us about your business and campaign goals</p>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Campaign Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={wizardData.campaignName}
            onChange={(e) => updateWizardData({ campaignName: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white shadow-soft"
            placeholder="e.g., Summer Sale 2024"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Business Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={wizardData.businessName}
            onChange={(e) => updateWizardData({ businessName: e.target.value })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white shadow-soft"
            placeholder="Your business name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Business Type <span className="text-red-500">*</span>
          </label>
          <select
            value={wizardData.businessType}
            onChange={(e) => updateWizardData({ businessType: e.target.value as BusinessType })}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white shadow-soft appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTUgNy41TDEwIDEyLjVMMTUgNy41IiBzdHJva2U9IiM2QjcyODAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=')] bg-[length:20px_20px] bg-[right_1rem_center] bg-no-repeat"
            required
          >
            <option value="">Select business type</option>
            <option value="Retail / D2C">Retail / D2C</option>
            <option value="Local Service">Local Service</option>
            <option value="Online SaaS">Online SaaS</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            Primary Goal <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(['Website visits', 'Calls / enquiries', 'Store visits', 'Online sales'] as CampaignGoal[]).map((goal) => (
              <label
                key={goal}
                className={`relative flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                  wizardData.goal === goal
                    ? 'border-primary-500 bg-primary-50 shadow-medium'
                    : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="goal"
                  value={goal}
                  checked={wizardData.goal === goal}
                  onChange={(e) => updateWizardData({ goal: e.target.value as CampaignGoal })}
                  className="sr-only"
                />
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  wizardData.goal === goal ? 'border-primary-500' : 'border-gray-300'
                }`}>
                  {wizardData.goal === goal && (
                    <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  )}
                </div>
                <span className="font-medium text-gray-900">{goal}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Channels <span className="text-red-500">*</span>
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Choose where you want this campaign to run. At least one channel is required.
          </p>
          <div className="space-y-3">
            {(['Google Search', 'Facebook / Instagram', 'Email'] as Channel[]).map((channel) => {
              const isSelected = wizardData.channels?.includes(channel) || false;
              const isLastChannel = wizardData.channels?.length === 1 && isSelected;
              return (
                <label
                  key={channel}
                  className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'border-primary-500 bg-primary-50 shadow-medium'
                      : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                    checked={isSelected}
                    onChange={() => {
                      if (!isLastChannel) {
                        toggleChannel(channel);
                      }
                    }}
                    disabled={isLastChannel}
                  />
                  <span className="font-medium text-gray-900 flex-1">{channel}</span>
                  {isLastChannel && (
                    <span className="text-xs text-gray-500">(At least one required)</span>
                  )}
                </label>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  // Step 2: Audience
  const renderStep2 = () => (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-medium">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.196-2.137M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.196-2.137M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Audience</h2>
          <p className="text-gray-600 mt-1">Define who will see your campaign</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Target locations</h3>
            <button
              type="button"
              onClick={addLocation}
              className="text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add location
            </button>
          </div>

          <div className="space-y-4">
            {wizardData.locations?.map((loc, idx) => (
              <div key={loc.id} className="flex gap-3 items-start p-4 border-2 border-gray-200 rounded-xl bg-white">
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Location {idx + 1} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="City, area or pin"
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
                      value={loc.name}
                      onChange={(e) => updateLocation(loc.id, { name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Radius</label>
                    <select
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all text-sm"
                      value={loc.radiusKm}
                      onChange={(e) => updateLocation(loc.id, { radiusKm: Number(e.target.value) })}
                    >
                      <option value={5}>5 km</option>
                      <option value={10}>10 km</option>
                      <option value={25}>25 km</option>
                      <option value={50}>50 km</option>
                    </select>
                  </div>
                </div>
                {wizardData.locations && wizardData.locations.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLocation(loc.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    title="Remove location"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Audience Preset <span className="text-red-500">*</span>
            </label>
            <select
              value={wizardData.audiencePreset}
              onChange={(e) => updateWizardData({ audiencePreset: e.target.value as AudiencePreset })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white shadow-soft"
              required
            >
              <option value="">Select preset</option>
              <option value="Broad – all adults">Broad – all adults</option>
              <option value="Local families">Local families</option>
              <option value="Young professionals">Young professionals</option>
              <option value="Custom description">Custom description</option>
            </select>
          </div>

          {wizardData.audiencePreset === 'Custom description' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Describe your ideal customer
              </label>
              <textarea
                value={wizardData.customAudienceDescription}
                onChange={(e) => updateWizardData({ customAudienceDescription: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white shadow-soft"
                rows={4}
                placeholder="e.g., Small business owners, ages 30-50, interested in productivity tools..."
              />
            </div>
          )}
        </div>

        <div>
          <AudienceSummaryCard
            locations={wizardData.locations || []}
            preset={wizardData.audiencePreset}
            customDescription={wizardData.customAudienceDescription}
          />
        </div>
      </div>
    </div>
  );

  // Step 3: Budget & Schedule
  const renderStep3 = () => (
    <div className="animate-fade-in">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-medium">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Budget & Schedule</h2>
          <p className="text-gray-600 mt-1">Set your budget and campaign duration</p>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-4">
            Budget Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
              wizardData.budgetType === 'Daily budget'
                ? 'border-primary-500 bg-primary-50 shadow-medium'
                : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
            }`}>
              <input
                type="radio"
                name="budgetType"
                value="Daily budget"
                checked={wizardData.budgetType === 'Daily budget'}
                onChange={(e) => updateWizardData({ budgetType: e.target.value as BudgetType })}
                className="sr-only"
              />
              <span className="font-medium text-gray-900">Daily budget</span>
            </label>
            <label className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
              wizardData.budgetType === 'Total budget'
                ? 'border-primary-500 bg-primary-50 shadow-medium'
                : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
            }`}>
              <input
                type="radio"
                name="budgetType"
                value="Total budget"
                checked={wizardData.budgetType === 'Total budget'}
                onChange={(e) => updateWizardData({ budgetType: e.target.value as BudgetType })}
                className="sr-only"
              />
              <span className="font-medium text-gray-900">Total budget</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Budget Amount ({wizardData.budgetType === 'Daily budget' ? '$/day' : 'Total'}) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">$</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={wizardData.budgetAmount || ''}
              onChange={(e) => updateWizardData({ budgetAmount: parseFloat(e.target.value) || 0 })}
              className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white shadow-soft"
              placeholder="0.00"
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Start Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={wizardData.startDate}
              onChange={(e) => updateWizardData({ startDate: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white shadow-soft"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              End Date
            </label>
            <div className="space-y-3">
              <input
                type="date"
                value={wizardData.endDate || ''}
                onChange={(e) => updateWizardData({ endDate: e.target.value || null })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white shadow-soft"
                min={wizardData.startDate}
                disabled={wizardData.endDate === null}
              />
              <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl hover:border-primary-300 hover:bg-gray-50 transition-all cursor-pointer">
                <input
                  type="checkbox"
                  checked={wizardData.endDate === null}
                  onChange={(e) => updateWizardData({ endDate: e.target.checked ? null : '' })}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-gray-700">Run continuously</span>
              </label>
            </div>
          </div>
        </div>

        <BudgetProjectionCard
          budgetType={wizardData.budgetType}
          budgetAmount={wizardData.budgetAmount}
          startDate={wizardData.startDate}
          endDate={wizardData.endDate}
        />
      </div>
    </div>
  );

  // Step 4: Creative & AI Copy
  const renderStep4 = () => {
    const displayAdCopy = wizardData.editedAdCopy || wizardData.selectedAdCopy;

    return (
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center shadow-medium">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Creative & AI Copy</h2>
            <p className="text-gray-600 mt-1">Generate and customize your ad content</p>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Describe your offer or promotion <span className="text-red-500">*</span>
            </label>
            <textarea
              value={wizardData.offerDescription}
              onChange={(e) => updateWizardData({ offerDescription: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white shadow-soft"
              rows={4}
              placeholder="e.g., 20% off all products this weekend. Free shipping on orders over $50."
              required
            />
          </div>

          <div>
            <button
              onClick={handleGenerateAdCopy}
              disabled={isGenerating || !wizardData.offerDescription}
              className="group px-6 py-3 bg-gradient-primary text-white rounded-xl font-semibold hover:shadow-glow transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Generate AI Ad Copy
                </>
              )}
            </button>
          </div>

          {adCopySuggestions.length > 0 && (
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">AI Suggestions</h3>
              <div className="space-y-4">
                {adCopySuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-xl p-5 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                      wizardData.selectedAdCopy === suggestion
                        ? 'border-primary-500 bg-primary-50 shadow-medium'
                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                    }`}
                    onClick={() => handleSelectAdCopy(suggestion)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold text-gray-900 text-lg">{suggestion.headline}</h4>
                      {wizardData.selectedAdCopy === suggestion && (
                        <span className="px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">Selected</span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm mb-3 leading-relaxed">{suggestion.primaryText}</p>
                    <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg">
                      {suggestion.ctaLabel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {displayAdCopy && (
            <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Your Ad Copy</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Headline</label>
                  <input
                    type="text"
                    value={displayAdCopy.headline}
                    onChange={(e) => handleEditAdCopy('headline', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white shadow-soft"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Text</label>
                  <textarea
                    value={displayAdCopy.primaryText}
                    onChange={(e) => handleEditAdCopy('primaryText', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white shadow-soft"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Call-to-Action</label>
                  <input
                    type="text"
                    value={displayAdCopy.ctaLabel}
                    onChange={(e) => handleEditAdCopy('ctaLabel', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white shadow-soft"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Ad Image</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white shadow-soft file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
              </div>
              <button
                onClick={() => {
                  const placeholderUrl = 'https://via.placeholder.com/400x300/E5E7EB/9CA3AF?text=Ad+Preview';
                  setImagePreview(placeholderUrl);
                  updateWizardData({ imageUrl: placeholderUrl });
                }}
                className="px-4 py-2 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:border-primary-400 hover:bg-primary-50 transition-all duration-300"
              >
                Use Stock Placeholder Image
              </button>
            </div>
          </div>

          {displayAdCopy && (
            <div className="mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Live Preview</h3>
              <div className="mb-4 flex flex-wrap gap-2">
                {wizardData.channels?.map((channel) => (
                  <span
                    key={channel}
                    className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700"
                  >
                    {channel}
                  </span>
                ))}
              </div>
              <AdPreviewCard
                adCopy={displayAdCopy}
                imageUrl={imagePreview}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  // Step 5: Review & Confirm
  const renderStep5 = () => {
    const finalAdCopy = wizardData.editedAdCopy || wizardData.selectedAdCopy;

    return (
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-medium">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Review & Confirm</h2>
            <p className="text-gray-600 mt-1">Review your campaign details before launching</p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              Goal & Business Info
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-xl">
              <div>
                <span className="font-semibold text-gray-700">Campaign Name:</span>
                <span className="ml-2 text-gray-900">{wizardData.campaignName}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Business Name:</span>
                <span className="ml-2 text-gray-900">{wizardData.businessName}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Business Type:</span>
                <span className="ml-2 text-gray-900">{wizardData.businessType}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Primary Goal:</span>
                <span className="ml-2 text-gray-900">{wizardData.goal}</span>
              </div>
              <div className="md:col-span-2">
                <span className="font-semibold text-gray-700">Channels:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {wizardData.channels?.map((channel) => (
                    <span
                      key={channel}
                      className="inline-flex items-center rounded-full bg-primary-100 px-3 py-1 text-xs font-semibold text-primary-700"
                    >
                      {channel}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Audience</h3>
            <AudienceSummaryCard
              locations={wizardData.locations || []}
              preset={wizardData.audiencePreset}
              customDescription={wizardData.customAudienceDescription}
            />
            {wizardData.locations && wizardData.locations.filter(loc => loc.name.trim()).length > 0 && (
              <div className="mt-4 bg-gray-50 p-4 rounded-xl">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Locations:</p>
                <ul className="space-y-1">
                  {wizardData.locations.filter(loc => loc.name.trim()).map((loc, idx) => (
                    <li key={loc.id} className="text-sm text-gray-700">
                      – {loc.name} ({loc.radiusKm} km)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Budget & Schedule</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm bg-gray-50 p-4 rounded-xl">
              <div>
                <span className="font-semibold text-gray-700">Budget Type:</span>
                <span className="ml-2 text-gray-900">{wizardData.budgetType}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Budget Amount:</span>
                <span className="ml-2 text-gray-900">${wizardData.budgetAmount.toFixed(2)}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">Start Date:</span>
                <span className="ml-2 text-gray-900">{wizardData.startDate}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">End Date:</span>
                <span className="ml-2 text-gray-900">
                  {wizardData.endDate || 'Run continuously'}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Ad Creative</h3>
            {finalAdCopy && (
              <div className="mb-4">
                <AdPreviewCard adCopy={finalAdCopy} imageUrl={wizardData.imageUrl} />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
        return null;
    }
  };

  return (
    <StepLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      onBack={currentStep > 1 ? handleBack : undefined}
      onNext={
        currentStep < totalSteps
          ? handleNext
          : currentStep === totalSteps
          ? handleLaunchCampaign
          : undefined
      }
      nextLabel={currentStep === totalSteps ? 'Launch Campaign' : 'Next'}
      showBack={currentStep > 1}
      showNext={true}
    >
      {renderCurrentStep()}
    </StepLayout>
  );
}


