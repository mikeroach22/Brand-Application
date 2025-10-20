'use client';

import { useState } from 'react';
import { Check, Building2, Package, MapPin, CreditCard, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  tier: 'low' | 'medium' | 'high';
  price6Months: number;
}

interface ProductConfig {
  productId: string;
  quantity: number;
  row: number;
}

interface CampaignSummaryStepProps {
  companyInfo: CompanyInfo;
  products: Product[];
  machines: Machine[];
  config: ProductConfig[];
  onBack: () => void;
}

export default function CampaignSummaryStep({ 
  companyInfo, 
  products, 
  machines, 
  config, 
  onBack 
}: CampaignSummaryStepProps) {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const placementFee = machines.reduce((sum, m) => sum + m.price6Months, 0);
  const avgPricePerMachine = placementFee / machines.length;
  
  const totalUnitsPerMachine = config.reduce((sum, c) => sum + c.quantity, 0);
  const totalUnits = totalUnitsPerMachine * machines.length;
  const inventoryCost = products.reduce((sum, p) => {
    const configItem = config.find(c => c.productId === p.id);
    const quantity = configItem ? configItem.quantity * machines.length : 0;
    return sum + (p.wholesaleCost * quantity);
  }, 0);
  
  const tierCounts = {
    low: machines.filter(m => m.tier === 'low').length,
    medium: machines.filter(m => m.tier === 'medium').length,
    high: machines.filter(m => m.tier === 'high').length,
  };
  
  const handleSubmit = async () => {
    if (!agreed) return;
    
    setSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In real app, would submit to API here
    const applicationData = {
      companyInfo,
      products,
      machines,
      config,
      placementFee,
      submittedAt: new Date().toISOString(),
    };
    
    console.log('Application submitted:', applicationData);
    
    // Redirect to confirmation page
    router.push('/app/brands/application-submitted');
  };
  
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Campaign Summary & Pricing</h2>
        <p className="mt-2 text-gray-600">
          Review your application before submitting
        </p>
      </div>
      
      {/* Company Info */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Building2 className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Company:</span>
            <span className="text-sm font-medium text-gray-900">{companyInfo.companyName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Email:</span>
            <span className="text-sm font-medium text-gray-900">{companyInfo.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Shopify Store:</span>
            <span className="text-sm font-medium text-gray-900">{companyInfo.shopifyUrl}</span>
          </div>
        </div>
      </div>
      
      {/* Products */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <Package className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Products ({products.length} SKUs)</h3>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          {products.map((product, index) => (
            <div key={product.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{product.image}</span>
                <span className="text-sm font-medium text-gray-900">{product.name}</span>
              </div>
              <span className="text-sm text-gray-600">£{product.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Machines */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-3">
          <MapPin className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Machines ({machines.length} locations)</h3>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-3 gap-4 mb-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{tierCounts.low}</p>
              <p className="text-xs text-gray-600">Low Traffic</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{tierCounts.medium}</p>
              <p className="text-xs text-gray-600">Medium Traffic</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{tierCounts.high}</p>
              <p className="text-xs text-gray-600">High Traffic</p>
            </div>
          </div>
          <div className="pt-3 border-t border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Avg price per machine:</span>
              <span className="font-medium text-gray-900">£{Math.round(avgPricePerMachine)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pricing Breakdown */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-3">
          <CreditCard className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Pricing Breakdown</h3>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-6">
          <div className="space-y-4">
            {/* Placement Fee */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">Placement Fee (6 months)</span>
                <span className="text-2xl font-bold text-blue-900">£{placementFee.toLocaleString()}</span>
              </div>
              <p className="text-xs text-blue-700">
                {machines.length} machines × avg £{Math.round(avgPricePerMachine)} × 6 months
              </p>
            </div>
            
            {/* Revenue Share */}
            <div className="p-3 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900">Revenue Share</span>
                <span className="text-lg font-bold text-gray-900">30% of sales</span>
              </div>
              <p className="text-xs text-gray-600">You keep 70% of all sales revenue</p>
            </div>
            
            {/* Inventory to Ship */}
            <div className="p-3 bg-white rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900">Inventory You'll Ship</span>
                <span className="text-lg font-bold text-gray-900">{totalUnits} units</span>
              </div>
              <p className="text-xs text-gray-600">
                {totalUnitsPerMachine} per machine × {machines.length} machines
              </p>
              <p className="text-xs text-gray-500 mt-1">
                (Your cost: ~£{inventoryCost.toLocaleString()} at wholesale)
              </p>
            </div>
            
            {/* Total Upfront */}
            <div className="pt-4 border-t-2 border-blue-300">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-blue-900">TOTAL PLACEMENT FEE</span>
                <span className="text-3xl font-bold text-blue-900">£{placementFee.toLocaleString()}</span>
              </div>
              <p className="text-xs text-blue-700 mt-1">Paid to Bright.Blue. You ship your own inventory separately.</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* What Happens Next */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">What happens next?</h3>
        <ol className="space-y-2">
          <li className="flex items-start space-x-2 text-sm text-gray-700">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">1</span>
            <span>We review your application (1-3 business days)</span>
          </li>
          <li className="flex items-start space-x-2 text-sm text-gray-700">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">2</span>
            <span>If approved, you'll receive contract via email</span>
          </li>
          <li className="flex items-start space-x-2 text-sm text-gray-700">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">3</span>
            <span>Sign contract & make payment</span>
          </li>
          <li className="flex items-start space-x-2 text-sm text-gray-700">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">4</span>
            <span>Install Shopify app and sync products</span>
          </li>
          <li className="flex items-start space-x-2 text-sm text-gray-700">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">5</span>
            <span>Ship products to our warehouse</span>
          </li>
          <li className="flex items-start space-x-2 text-sm text-gray-700">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">6</span>
            <span>Go live in ~14 days!</span>
          </li>
        </ol>
      </div>
      
      {/* Terms Agreement */}
      <div className="mb-8">
        <label className="flex items-start space-x-3 cursor-pointer">
          <div className={`
            mt-1 w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 cursor-pointer
            ${agreed ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}
          `}>
            {agreed && <Check className="w-3 h-3 text-white" />}
          </div>
          <span className="text-sm text-gray-700">
            I agree to Bright.Blue's{' '}
            <a href="/terms" className="text-blue-600 hover:underline" target="_blank">Terms & Conditions</a>
            {' '}and understand that this application is subject to approval. The placement fee will be required upon approval.
          </span>
        </label>
        
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="sr-only"
        />
      </div>
      
      {/* Warning */}
      {!agreed && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-yellow-800">
            Please agree to the terms and conditions to submit your application.
          </p>
        </div>
      )}
      
      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t">
        <button
          onClick={onBack}
          disabled={submitting}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
        >
          Back
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={!agreed || submitting}
          className={`
            px-8 py-3 rounded-lg font-semibold flex items-center space-x-2
            ${agreed && !submitting
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              <Check className="w-5 h-5" />
              <span>Submit Application</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

