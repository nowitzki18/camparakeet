'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCampaignWizard } from '@/context/CampaignWizardContext';
import StepLayout from '@/components/StepLayout';
import AudienceSummaryCard from '@/components/AudienceSummaryCard';
import AudiencePersonaCard from '@/components/AudiencePersonaCard';
import BudgetProjectionCard from '@/components/BudgetProjectionCard';
import AdPreviewCard from '@/components/AdPreviewCard';
import { generateAdCopy, getAudiencePersona, generateAIImage } from '@/lib/aiMock';
import { saveCampaign } from '@/lib/campaignStore';
import { BusinessType, CampaignGoal, AudiencePreset, BudgetType, AdCopySuggestion, Channel, AudiencePersona } from '@/types';

export default function WizardPage() {
  const router = useRouter();
  const { wizardData, updateWizardData, toggleChannel, addLocation, updateLocation, removeLocation } = useCampaignWizard();
  
  // State declarations
  const [currentStep, setCurrentStep] = useState(1);
  const [adCopySuggestions, setAdCopySuggestions] = useState<AdCopySuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(wizardData.imageUrl);
  const [audiencePersona, setAudiencePersona] = useState<AudiencePersona | null>(null);
  const [isGeneratingPersona, setIsGeneratingPersona] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

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
    // Simulate API delay
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

  const handleSuggestAudience = () => {
    if (!wizardData.businessType || !wizardData.goal) {
      alert('Please fill in business type and goal first.');
      return;
    }

    setIsGeneratingPersona(true);
    setTimeout(() => {
      const persona = getAudiencePersona({
        businessType: wizardData.businessType,
        goal: wizardData.goal,
        description: wizardData.customAudienceDescription,
      });
      setAudiencePersona(persona);
      setIsGeneratingPersona(false);
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
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Goal & Business Info</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Campaign Name *
          </label>
          <input
            type="text"
            value={wizardData.campaignName}
            onChange={(e) => updateWizardData({ campaignName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="e.g., Summer Sale 2024"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Name *
          </label>
          <input
            type="text"
            value={wizardData.businessName}
            onChange={(e) => updateWizardData({ businessName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Your business name"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Type *
          </label>
          <select
            value={wizardData.businessType}
            onChange={(e) => updateWizardData({ businessType: e.target.value as BusinessType })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Primary Goal *
          </label>
          <div className="space-y-3">
            {(['Website visits', 'Calls / enquiries', 'Store visits', 'Online sales'] as CampaignGoal[]).map((goal) => (
              <label key={goal} className="flex items-center">
                <input
                  type="radio"
                  name="goal"
                  value={goal}
                  checked={wizardData.goal === goal}
                  onChange={(e) => updateWizardData({ goal: e.target.value as CampaignGoal })}
                  className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-700">{goal}</span>
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
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Audience</h2>
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

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Describe your ideal customer <span className="text-gray-500 font-normal">(Optional)</span>
              </label>
              <button
                type="button"
                onClick={handleSuggestAudience}
                disabled={isGeneratingPersona || !wizardData.businessType || !wizardData.goal}
                className="text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                {isGeneratingPersona ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    Suggest Ideal Audience
                  </>
                )}
              </button>
            </div>
            <textarea
              value={wizardData.customAudienceDescription}
              onChange={(e) => updateWizardData({ customAudienceDescription: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-300 bg-white shadow-soft"
              rows={4}
              placeholder="e.g., Small business owners, ages 30-50, interested in productivity tools..."
            />
          </div>

          {audiencePersona && (
            <div className="mt-4">
              <AudiencePersonaCard persona={audiencePersona} />
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
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Budget & Schedule</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Budget Type *
          </label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="budgetType"
                value="Daily budget"
                checked={wizardData.budgetType === 'Daily budget'}
                onChange={(e) => updateWizardData({ budgetType: e.target.value as BudgetType })}
                className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-gray-700">Daily budget</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="budgetType"
                value="Total budget"
                checked={wizardData.budgetType === 'Total budget'}
                onChange={(e) => updateWizardData({ budgetType: e.target.value as BudgetType })}
                className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-gray-700">Total budget</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget Amount ({wizardData.budgetType === 'Daily budget' ? '$/day' : 'Total'}) *
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={wizardData.budgetAmount || ''}
            onChange={(e) => updateWizardData({ budgetAmount: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="0.00"
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date *
            </label>
            <input
              type="date"
              value={wizardData.startDate}
              onChange={(e) => updateWizardData({ startDate: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <div className="space-y-3">
              <input
                type="date"
                value={wizardData.endDate || ''}
                onChange={(e) => updateWizardData({ endDate: e.target.value || null })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                min={wizardData.startDate}
              />
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={wizardData.endDate === null}
                  onChange={(e) => updateWizardData({ endDate: e.target.checked ? null : '' })}
                  className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Run continuously</span>
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
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Creative & AI Copy</h2>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe your offer or promotion *
            </label>
            <textarea
              value={wizardData.offerDescription}
              onChange={(e) => updateWizardData({ offerDescription: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={4}
              placeholder="e.g., 20% off all products this weekend. Free shipping on orders over $50."
              required
            />
          </div>

          <div>
            <button
              onClick={handleGenerateAdCopy}
              disabled={isGenerating || !wizardData.offerDescription}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating...' : 'Generate AI Ad Copy'}
            </button>
          </div>

          {adCopySuggestions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Suggestions</h3>
              <div className="space-y-4">
                {adCopySuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      wizardData.selectedAdCopy === suggestion
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-primary-300'
                    }`}
                    onClick={() => handleSelectAdCopy(suggestion)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{suggestion.headline}</h4>
                      {wizardData.selectedAdCopy === suggestion && (
                        <span className="text-primary-600 text-sm font-medium">Selected</span>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm mb-2">{suggestion.primaryText}</p>
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {suggestion.ctaLabel}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {displayAdCopy && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Your Ad Copy</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Headline</label>
                  <input
                    type="text"
                    value={displayAdCopy.headline}
                    onChange={(e) => handleEditAdCopy('headline', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Text</label>
                  <textarea
                    value={displayAdCopy.primaryText}
                    onChange={(e) => handleEditAdCopy('primaryText', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Call-to-Action</label>
                  <input
                    type="text"
                    value={displayAdCopy.ctaLabel}
                    onChange={(e) => handleEditAdCopy('ctaLabel', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ad Image</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const placeholderUrl = 'https://via.placeholder.com/400x300/E5E7EB/9CA3AF?text=Ad+Preview';
                    setImagePreview(placeholderUrl);
                    updateWizardData({ imageUrl: placeholderUrl });
                  }}
                  className="px-4 py-2 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:border-primary-400 hover:bg-primary-50 transition-all duration-300"
                >
                  Use Stock Placeholder Image
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!wizardData.businessName || !wizardData.offerDescription || !wizardData.goal) {
                      alert('Please fill in business name, offer description, and goal first.');
                      return;
                    }
                    setIsGeneratingImage(true);
                    try {
                      const imageUrl = await generateAIImage({
                        businessName: wizardData.businessName,
                        offer: wizardData.offerDescription,
                        goal: wizardData.goal as CampaignGoal,
                        businessType: wizardData.businessType,
                      });
                      setImagePreview(imageUrl);
                      updateWizardData({ imageUrl });
                    } catch (error) {
                      alert('Failed to generate image. Please try again.');
                    } finally {
                      setIsGeneratingImage(false);
                    }
                  }}
                  disabled={isGeneratingImage || !wizardData.businessName || !wizardData.offerDescription || !wizardData.goal}
                  className="px-6 py-2.5 bg-gradient-primary text-white rounded-xl font-semibold hover:shadow-glow transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center gap-2 min-w-[180px] justify-center"
                >
                  {isGeneratingImage ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span>Generate AI Image</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {displayAdCopy && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
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
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Confirm</h2>
        <div className="space-y-6">
          {/* Goal & Business Info */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Goal & Business Info</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Campaign Name:</span>
                <span className="ml-2 text-gray-600">{wizardData.campaignName}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Business Name:</span>
                <span className="ml-2 text-gray-600">{wizardData.businessName}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Business Type:</span>
                <span className="ml-2 text-gray-600">{wizardData.businessType}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Primary Goal:</span>
                <span className="ml-2 text-gray-600">{wizardData.goal}</span>
              </div>
              <div className="md:col-span-2">
                <span className="font-medium text-gray-700">Channels:</span>
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

          {/* Audience */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience</h3>
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

          {/* Budget & Schedule */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Budget & Schedule</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Budget Type:</span>
                <span className="ml-2 text-gray-600">{wizardData.budgetType}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Budget Amount:</span>
                <span className="ml-2 text-gray-600">${wizardData.budgetAmount.toFixed(2)}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Start Date:</span>
                <span className="ml-2 text-gray-600">{wizardData.startDate}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">End Date:</span>
                <span className="ml-2 text-gray-600">
                  {wizardData.endDate || 'Run continuously'}
                </span>
              </div>
            </div>
          </div>

          {/* Ad Creative */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ad Creative</h3>
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

