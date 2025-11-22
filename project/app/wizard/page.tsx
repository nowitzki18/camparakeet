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
import { BusinessType, CampaignGoal, AudiencePreset, BudgetType, AdCopySuggestion } from '@/types';

export default function WizardPage() {
  const router = useRouter();
  const { wizardData, updateWizardData } = useCampaignWizard();
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
      </div>
    </div>
  );

  // Step 2: Audience
  const renderStep2 = () => (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Audience</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              value={wizardData.location}
              onChange={(e) => updateWizardData({ location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="City or region"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Radius *
            </label>
            <select
              value={wizardData.radius}
              onChange={(e) => updateWizardData({ radius: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="5km">5km</option>
              <option value="10km">10km</option>
              <option value="25km">25km</option>
              <option value="nationwide">Nationwide</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Audience Preset *
            </label>
            <select
              value={wizardData.audiencePreset}
              onChange={(e) => updateWizardData({ audiencePreset: e.target.value as AudiencePreset })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Describe your ideal customer
              </label>
              <textarea
                value={wizardData.customAudienceDescription}
                onChange={(e) => updateWizardData({ customAudienceDescription: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows={4}
                placeholder="e.g., Small business owners, ages 30-50, interested in productivity tools..."
              />
            </div>
          )}
        </div>

        <div>
          <AudienceSummaryCard
            location={wizardData.location}
            radius={wizardData.radius}
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
              <div>
                <button
                  onClick={() => {
                    const placeholderUrl = 'https://via.placeholder.com/400x300/E5E7EB/9CA3AF?text=Ad+Preview';
                    setImagePreview(placeholderUrl);
                    updateWizardData({ imageUrl: placeholderUrl });
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Use Stock Placeholder Image
                </button>
              </div>
            </div>
          </div>

          {displayAdCopy && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
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
            </div>
          </div>

          {/* Audience */}
          <div className="border-b border-gray-200 pb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience</h3>
            <AudienceSummaryCard
              location={wizardData.location}
              radius={wizardData.radius}
              preset={wizardData.audiencePreset}
              customDescription={wizardData.customAudienceDescription}
            />
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

