'use client';

import { useState, useEffect } from 'react';
import { Package, Check, DollarSign, Tag } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  wholesaleCost: number;
  image?: string;
  category: string;
}

interface ProductSelectionStepProps {
  shopifyUrl: string;
  selectedProducts: Product[];
  onNext: (products: Product[]) => void;
  onBack: () => void;
}

// Demo products (in real app, fetch from Shopify API)
const demoProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'FitFuel Original',
    price: 2.50,
    wholesaleCost: 1.20,
    category: 'Energy Drinks',
    image: '🥤',
  },
  {
    id: 'prod-2',
    name: 'FitFuel Berry Blast',
    price: 2.50,
    wholesaleCost: 1.20,
    category: 'Energy Drinks',
    image: '🍓',
  },
  {
    id: 'prod-3',
    name: 'FitFuel Citrus Surge',
    price: 2.50,
    wholesaleCost: 1.20,
    category: 'Energy Drinks',
    image: '🍊',
  },
  {
    id: 'prod-4',
    name: 'FitFuel Starter Pack (3-pack)',
    price: 6.50,
    wholesaleCost: 3.30,
    category: 'Bundles',
    image: '📦',
  },
  {
    id: 'prod-5',
    name: 'FitFuel Protein Bar - Chocolate',
    price: 3.00,
    wholesaleCost: 1.50,
    category: 'Protein Bars',
    image: '🍫',
  },
  {
    id: 'prod-6',
    name: 'FitFuel Protein Bar - Vanilla',
    price: 3.00,
    wholesaleCost: 1.50,
    category: 'Protein Bars',
    image: '🥛',
  },
];

export default function ProductSelectionStep({ 
  shopifyUrl, 
  selectedProducts,
  onNext, 
  onBack 
}: ProductSelectionStepProps) {
  const [selected, setSelected] = useState<Product[]>(selectedProducts);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    // Simulate loading products from Shopify
    setTimeout(() => {
      setProducts(demoProducts);
      setLoading(false);
    }, 500);
  }, []);
  
  const toggleProduct = (product: Product) => {
    if (selected.find(p => p.id === product.id)) {
      setSelected(selected.filter(p => p.id !== product.id));
    } else {
      setSelected([...selected, product]);
    }
  };
  
  const categories = Array.from(new Set(products.map(p => p.category)));
  
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Choose Products to Distribute</h2>
        <p className="mt-2 text-gray-600">
          Select which products from your Shopify store you want in vending machines
        </p>
        <p className="mt-1 text-sm text-blue-600">
          Connected to: <strong>{shopifyUrl}</strong>
        </p>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Selection Summary */}
          {selected.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    {selected.length} product{selected.length !== 1 ? 's' : ''} selected
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Total wholesale cost: £{(selected.reduce((sum, p) => sum + p.wholesaleCost, 0)).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => setSelected([])}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
          
          {/* Products by Category */}
          {categories.map(category => (
            <div key={category} className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{category}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.filter(p => p.category === category).map(product => {
                  const isSelected = selected.find(p => p.id === product.id);
                  const margin = product.price - product.wholesaleCost;
                  const marginPercent = (margin / product.price) * 100;
                  
                  return (
                    <div
                      key={product.id}
                      onClick={() => toggleProduct(product)}
                      className={`
                        p-4 rounded-lg border-2 cursor-pointer transition-all
                        ${isSelected 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                        }
                      `}
                    >
                      <div className="flex items-start justify-between">
                        {/* Product Info */}
                        <div className="flex items-start space-x-3 flex-1">
                          {/* Emoji Icon */}
                          <div className="text-4xl">{product.image}</div>
                          
                          {/* Details */}
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{product.name}</h4>
                            
                            {/* Pricing */}
                            <div className="mt-2 space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 flex items-center">
                                  <Tag className="w-3 h-3 mr-1" />
                                  Retail Price
                                </span>
                                <span className="font-medium text-gray-900">£{product.price.toFixed(2)}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 flex items-center">
                                  <DollarSign className="w-3 h-3 mr-1" />
                                  Wholesale Cost
                                </span>
                                <span className="font-medium text-gray-900">£{product.wholesaleCost.toFixed(2)}</span>
                              </div>
                              <div className="pt-1 border-t border-gray-200 flex items-center justify-between text-sm">
                                <span className="text-green-700 font-medium">Your Margin</span>
                                <span className="font-bold text-green-700">
                                  £{margin.toFixed(2)} ({marginPercent.toFixed(0)}%)
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Checkbox */}
                        <div className={`
                          w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                          ${isSelected 
                            ? 'border-blue-500 bg-blue-500' 
                            : 'border-gray-300'
                          }
                        `}>
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          
          {/* Revenue Share Info */}
          <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">💡 How Revenue Share Works</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p>• <strong>You set the retail price</strong> (what customers pay)</p>
              <p>• <strong>Bright.Blue takes 30%</strong> of the retail price for operations</p>
              <p>• <strong>You keep 70%</strong> of the retail price minus your wholesale cost</p>
              <p>• Example: £2.50 retail → You get £1.75 → Minus £1.20 cost = £0.55 profit per unit</p>
            </div>
          </div>
        </>
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
          onClick={() => onNext(selected)}
          disabled={selected.length === 0}
          className={`
            px-6 py-2 rounded-lg font-medium
            ${selected.length > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          Continue with {selected.length} product{selected.length !== 1 ? 's' : ''}
        </button>
      </div>
    </div>
  );
}

