'use client';

import { useState } from 'react';

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
}

interface ProductConfig {
  productId: string;
  quantity: number;
  row: number;
}

interface ProductConfigStepProps {
  products: Product[];
  machines: Machine[];
  config: ProductConfig[];
  onNext: (config: ProductConfig[]) => void;
  onBack: () => void;
}

export default function ProductConfigStep({ products, machines, config, onNext, onBack }: ProductConfigStepProps) {
  // Default config: spread products evenly with realistic capacity
  const defaultConfig: ProductConfig[] = products.map((product, index) => ({
    productId: product.id,
    quantity: index === 0 ? 40 : 30, // First product gets 40, others get 30 (typical vending machine capacity)
    row: index + 1,
  }));
  
  const [productConfig, setProductConfig] = useState<ProductConfig[]>(config.length > 0 ? config : defaultConfig);
  const [useCustom, setUseCustom] = useState(false);
  
  const totalUnits = productConfig.reduce((sum, pc) => sum + pc.quantity, 0);
  const totalUnitsAllMachines = totalUnits * machines.length;
  const totalCost = products.reduce((sum, product) => {
    const configItem = productConfig.find(pc => pc.productId === product.id);
    const quantity = configItem ? configItem.quantity : 0;
    return sum + (product.wholesaleCost * quantity);
  }, 0);
  const totalCostAllMachines = totalCost * machines.length;
  
  const updateQuantity = (productId: string, quantity: number) => {
    setProductConfig(productConfig.map(pc => 
      pc.productId === productId ? { ...pc, quantity: Math.max(0, quantity) } : pc
    ));
  };
  
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Configure Product Layout</h2>
        <p className="mt-2 text-gray-600">
          How should we stock your {machines.length} machines?
        </p>
      </div>
      
      {/* Layout Options */}
      <div className="mb-8 space-y-4">
        <div
          onClick={() => setUseCustom(false)}
          className={`
            p-4 rounded-lg border-2 cursor-pointer transition-all
            ${!useCustom ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
          `}
        >
          <div className="flex items-start">
            <div className={`
              w-5 h-5 rounded-full border-2 mt-1 flex-shrink-0 flex items-center justify-center
              ${!useCustom ? 'border-blue-500' : 'border-gray-300'}
            `}>
              {!useCustom && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
            </div>
            <div className="ml-3 flex-1">
              <p className="font-medium text-gray-900">Use same layout for all machines (Recommended)</p>
              <p className="text-sm text-gray-600 mt-1">All {machines.length} machines will be stocked identically</p>
            </div>
          </div>
        </div>
        
        <div
          onClick={() => setUseCustom(true)}
          className={`
            p-4 rounded-lg border-2 cursor-pointer transition-all
            ${useCustom ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}
          `}
        >
          <div className="flex items-start">
            <div className={`
              w-5 h-5 rounded-full border-2 mt-1 flex-shrink-0 flex items-center justify-center
              ${useCustom ? 'border-blue-500' : 'border-gray-300'}
            `}>
              {useCustom && <div className="w-3 h-3 rounded-full bg-blue-500"></div>}
            </div>
            <div className="ml-3 flex-1">
              <p className="font-medium text-gray-900">Customize per location</p>
              <p className="text-sm text-gray-600 mt-1">Different layouts for different machines (available after approval)</p>
            </div>
          </div>
        </div>
      </div>
      
      {!useCustom && (
        <>
          {/* Default Layout Configuration */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Default Layout</h3>
            
            <div className="space-y-4">
              {products.map((product, index) => {
                const configItem = productConfig.find(pc => pc.productId === product.id);
                const quantity = configItem ? configItem.quantity : 0;
                
                return (
                  <div key={product.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{product.image}</span>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-600">Row {index + 1}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-xs text-gray-600">Units per machine</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <button
                              onClick={() => updateQuantity(product.id, quantity - 1)}
                              className="w-8 h-8 rounded-lg border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              value={quantity}
                              onChange={(e) => updateQuantity(product.id, parseInt(e.target.value) || 0)}
                              className="w-16 text-center py-1 border border-gray-300 rounded-lg"
                            />
                            <button
                              onClick={() => updateQuantity(product.id, quantity + 1)}
                              className="w-8 h-8 rounded-lg border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-xs text-gray-600">Cost per machine</p>
                          <p className="text-sm font-semibold text-gray-900 mt-1">
                            £{(product.wholesaleCost * quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Summary */}
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Initial Inventory to Ship</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800">Units per machine:</span>
                <span className="font-semibold text-blue-900">{totalUnits} units</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800">Total machines:</span>
                <span className="font-semibold text-blue-900">{machines.length} machines</span>
              </div>
              
              <div className="pt-3 border-t border-blue-200 flex items-center justify-between">
                <span className="text-sm text-blue-800">Total units to ship:</span>
                <span className="text-lg font-bold text-blue-900">{totalUnitsAllMachines} units</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-800">Your wholesale cost (est.):</span>
                <span className="text-sm text-blue-700">£{totalCostAllMachines.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white rounded-lg">
              <p className="text-xs text-gray-600">
                <strong>Note:</strong> You ship your own products to our warehouse at your cost. No charge from Bright.Blue for inventory.
              </p>
            </div>
          </div>
        </>
      )}
      
      {useCustom && (
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-700">
            Custom layouts will be available after your application is approved. 
            You'll be able to configure different product mixes for different locations through your dashboard.
          </p>
        </div>
      )}
      
      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t mt-8">
        <button
          onClick={onBack}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
        >
          Back
        </button>
        
        <button
          onClick={() => onNext(productConfig)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700"
        >
          Continue
        </button>
      </div>
    </div>
  );
}

