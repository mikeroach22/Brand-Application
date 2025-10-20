'use client';

import { useState } from 'react';
import { Building2, Package, MapPin, CreditCard, CheckCircle, Calendar } from 'lucide-react';
import CompanyInfoStep from '@/components/CompanyInfoStep';
import ProductSelectionStep from '@/components/ProductSelectionStep';
import MachineSelectionStep from '@/components/MachineSelectionStep';
import CampaignDurationStep from '@/components/CampaignDurationStep';
import ProductConfigStep from '@/components/ProductConfigStep';
import CampaignSummaryStep from '@/components/CampaignSummaryStep';

type ApplicationStep = 'company' | 'products' | 'machines' | 'duration' | 'config' | 'summary';

interface CompanyInfo {
  email: string;
  companyName: string;
  shopifyUrl: string;
  phone: string;
  companyReg?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  wholesaleCost: number;
  image?: string;
  category: string;
}

interface Machine {
  id: string;
  name: string;
  location: string;
  lat: number;
  lng: number;
  tier: 'low' | 'medium' | 'high';
  footTraffic: number;
  avgSales: number;
  price6Months: number;
  locationType: string;
}

interface ProductConfig {
  productId: string;
  quantity: number;
  row: number;
}

export default function BrandApplicationPage() {
  const [currentStep, setCurrentStep] = useState<ApplicationStep>('company');
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [selectedMachines, setSelectedMachines] = useState<Machine[]>([]);
  const [campaignDuration, setCampaignDuration] = useState<number>(6);
  const [productConfig, setProductConfig] = useState<ProductConfig[]>([]);

  const steps = [
    { id: 'company' as ApplicationStep, name: 'Company Info', icon: Building2 },
    { id: 'products' as ApplicationStep, name: 'Select Products', icon: Package },
    { id: 'machines' as ApplicationStep, name: 'Choose Machines', icon: MapPin },
    { id: 'duration' as ApplicationStep, name: 'Duration', icon: Calendar },
    { id: 'config' as ApplicationStep, name: 'Configure', icon: Package },
    { id: 'summary' as ApplicationStep, name: 'Review & Submit', icon: CreditCard },
  ];

  const getCurrentStepIndex = () => steps.findIndex(s => s.id === currentStep);

  const handleNext = (data?: any) => {
    const currentIndex = getCurrentStepIndex();
    
    // Save data based on current step
    if (currentStep === 'company' && data) {
      setCompanyInfo(data);
    } else if (currentStep === 'products' && data) {
      setSelectedProducts(data);
    } else if (currentStep === 'machines' && data) {
      setSelectedMachines(data);
    } else if (currentStep === 'duration' && data) {
      setCampaignDuration(data);
    } else if (currentStep === 'config' && data) {
      setProductConfig(data);
    }
    
    // Move to next step
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const handleBack = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const totalCost = selectedMachines.reduce((sum, machine) => sum + machine.price6Months, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Apply for Physical Retail Placement</h1>
          <p className="mt-2 text-gray-600">Get your Shopify products into vending machines at premium locations</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav aria-label="Progress">
          <ol className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCurrent = step.id === currentStep;
              const isCompleted = getCurrentStepIndex() > index;
              
              return (
                <li key={step.id} className="relative flex-1">
                  {/* Line */}
                  {index !== steps.length - 1 && (
                    <div className="absolute top-4 left-1/2 w-full h-0.5 bg-gray-200">
                      <div 
                        className={`h-full transition-all duration-300 ${
                          isCompleted ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                        style={{ width: isCompleted ? '100%' : '0%' }}
                      />
                    </div>
                  )}
                  
                  {/* Step */}
                  <div className="relative flex flex-col items-center group">
                    <div className={`
                      flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                      ${isCurrent ? 'border-blue-600 bg-blue-600 text-white' : ''}
                      ${isCompleted ? 'border-blue-600 bg-blue-600 text-white' : ''}
                      ${!isCurrent && !isCompleted ? 'border-gray-300 bg-white text-gray-500' : ''}
                    `}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </div>
                    <span className={`
                      mt-2 text-xs font-medium text-center
                      ${isCurrent ? 'text-blue-600' : ''}
                      ${isCompleted ? 'text-gray-900' : ''}
                      ${!isCurrent && !isCompleted ? 'text-gray-500' : ''}
                    `}>
                      {step.name}
                    </span>
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>

        {/* Selected Summary Bar */}
        {(selectedProducts.length > 0 || selectedMachines.length > 0) && (
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                {selectedProducts.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      {selectedProducts.length} product{selectedProducts.length !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                )}
                {selectedMachines.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">
                      {selectedMachines.length} machine{selectedMachines.length !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                )}
              </div>
              {totalCost > 0 && (
                <div className="text-right">
                  <p className="text-xs text-blue-700">Total Campaign Cost</p>
                  <p className="text-2xl font-bold text-blue-900">£{totalCost.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Step Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="bg-white rounded-lg shadow-sm border">
          {currentStep === 'company' && (
            <CompanyInfoStep 
              initialData={companyInfo}
              onNext={handleNext}
            />
          )}
          
          {currentStep === 'products' && (
            <ProductSelectionStep
              shopifyUrl={companyInfo?.shopifyUrl || ''}
              selectedProducts={selectedProducts}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          
          {currentStep === 'machines' && (
            <MachineSelectionStep
              selectedMachines={selectedMachines}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          
          {currentStep === 'duration' && (
            <CampaignDurationStep
              machines={selectedMachines}
              duration={campaignDuration}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          
          {currentStep === 'config' && (
            <ProductConfigStep
              products={selectedProducts}
              machines={selectedMachines}
              config={productConfig}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          
          {currentStep === 'summary' && (
            <CampaignSummaryStep
              companyInfo={companyInfo!}
              products={selectedProducts}
              machines={selectedMachines}
              config={productConfig}
              onBack={handleBack}
            />
          )}
        </div>
      </div>
    </div>
  );
}

