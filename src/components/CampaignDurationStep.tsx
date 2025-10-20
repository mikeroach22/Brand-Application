'use client';

import { useState } from 'react';
import { Calendar, TrendingUp, DollarSign } from 'lucide-react';

interface Machine {
  id: string;
  name: string;
  price6Months: number;
}

interface CampaignDurationStepProps {
  machines: Machine[];
  duration?: number;
  onNext: (duration: number) => void;
  onBack: () => void;
}

export default function CampaignDurationStep({ machines, duration, onNext, onBack }: CampaignDurationStepProps) {
  const [selectedDuration, setSelectedDuration] = useState<number>(duration || 6);
  
  // Calculate pricing based on duration
  const calculateCost = (months: number) => {
    const baseCost = machines.reduce((sum, m) => sum + m.price6Months, 0);
    
    // Pricing formula: base is for 6 months
    if (months === 1) return Math.round(baseCost * 0.25); // 25% of 6-month price
    if (months === 3) return Math.round(baseCost * 0.60); // 60% of 6-month price
    if (months === 6) return baseCost; // Base price
    if (months === 12) return Math.round(baseCost * 1.75); // 175% (15% discount vs 2×6mo)
    return baseCost;
  };
  
  const options = [
    {
      months: 1,
      name: '1 Month Trial',
      description: 'Test your products in physical retail',
      recommended: false,
      discount: null,
    },
    {
      months: 3,
      name: '3 Months',
      description: 'Gather meaningful sales data',
      recommended: false,
      discount: null,
    },
    {
      months: 6,
      name: '6 Months',
      description: 'Most popular - full campaign cycle',
      recommended: true,
      discount: null,
    },
    {
      months: 12,
      name: '12 Months',
      description: 'Best value - full year presence',
      recommended: false,
      discount: '15% off',
    },
  ];
  
  const selectedCost = calculateCost(selectedDuration);
  const costPerMachine = Math.round(selectedCost / machines.length);
  const costPerMonth = Math.round(selectedCost / selectedDuration);
  
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Choose Campaign Duration</h2>
        <p className="mt-2 text-gray-600">
          How long do you want your products in {machines.length} machines?
        </p>
      </div>
      
      {/* Duration Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {options.map((option) => {
          const cost = calculateCost(option.months);
          const isSelected = selectedDuration === option.months;
          
          return (
            <div
              key={option.months}
              onClick={() => setSelectedDuration(option.months)}
              className={`
                relative p-6 rounded-lg border-2 cursor-pointer transition-all
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-md' 
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
                }
              `}
            >
              {/* Recommended Badge */}
              {option.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}
              
              {/* Discount Badge */}
              {option.discount && (
                <div className="absolute -top-3 right-4">
                  <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                    {option.discount}
                  </span>
                </div>
              )}
              
              {/* Radio */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{option.name}</h3>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                  ${isSelected ? 'border-blue-500' : 'border-gray-300'}
                `}>
                  {isSelected && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
                </div>
              </div>
              
              {/* Pricing */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-gray-600">Total campaign cost:</span>
                  <span className="text-2xl font-bold text-gray-900">£{cost.toLocaleString()}</span>
                </div>
                <div className="flex items-baseline justify-between text-sm text-gray-600">
                  <span>Per machine:</span>
                  <span className="font-medium">£{Math.round(cost / machines.length)} for {option.months} month{option.months !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-baseline justify-between text-sm text-gray-600">
                  <span>Per month:</span>
                  <span className="font-medium">£{Math.round(cost / option.months)}/mo</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Selected Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Campaign Summary</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Calendar className="w-4 h-4 text-blue-600" />
              <p className="text-sm text-blue-700">Duration</p>
            </div>
            <p className="text-xl font-bold text-blue-900">{selectedDuration} month{selectedDuration !== 1 ? 's' : ''}</p>
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <p className="text-sm text-blue-700">Machines</p>
            </div>
            <p className="text-xl font-bold text-blue-900">{machines.length}</p>
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <p className="text-sm text-blue-700">Total Cost</p>
            </div>
            <p className="text-xl font-bold text-blue-900">£{selectedCost.toLocaleString()}</p>
          </div>
          
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <DollarSign className="w-4 h-4 text-blue-600" />
              <p className="text-sm text-blue-700">Per Month</p>
            </div>
            <p className="text-xl font-bold text-blue-900">£{costPerMonth.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-white rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>What happens after {selectedDuration} month{selectedDuration !== 1 ? 's' : ''}?</strong>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            You'll receive performance data and have the option to renew, expand to more machines, or end the campaign.
          </p>
        </div>
      </div>
      
      {/* Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">💡 Campaign Flexibility</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Change product mix during campaign</li>
            <li>• Add more machines anytime</li>
            <li>• Real-time performance analytics</li>
            <li>• Monthly restock as needed</li>
          </ul>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">📊 What You'll Learn</h4>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Best-performing locations</li>
            <li>• Top-selling products</li>
            <li>• Peak purchase times</li>
            <li>• Customer demographics</li>
          </ul>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
        >
          Back
        </button>
        
        <button
          onClick={() => onNext(selectedDuration)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700"
        >
          Continue with {selectedDuration} month{selectedDuration !== 1 ? 's' : ''}
        </button>
      </div>
    </div>
  );
}

