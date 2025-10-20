'use client';

import { useState } from 'react';
import { Building2, Mail, Phone, Globe } from 'lucide-react';

interface CompanyInfo {
  email: string;
  companyName: string;
  shopifyUrl: string;
  phone: string;
  companyReg?: string;
}

interface CompanyInfoStepProps {
  initialData: CompanyInfo | null;
  onNext: (data: CompanyInfo) => void;
}

export default function CompanyInfoStep({ initialData, onNext }: CompanyInfoStepProps) {
  const [formData, setFormData] = useState<CompanyInfo>(initialData || {
    email: '',
    companyName: '',
    shopifyUrl: '',
    phone: '',
    companyReg: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.companyName) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.shopifyUrl) {
      newErrors.shopifyUrl = 'Shopify store URL is required';
    } else if (!formData.shopifyUrl.includes('.myshopify.com') && !formData.shopifyUrl.includes('shopify.com')) {
      newErrors.shopifyUrl = 'Please enter a valid Shopify URL (e.g., yourstore.myshopify.com)';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext(formData);
    }
  };
  
  const updateField = (field: keyof CompanyInfo, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };
  
  return (
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Create Your Brand Account</h2>
        <p className="mt-2 text-gray-600">
          Let's start with some basic information about your company
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="sarah@fitfuel.com"
              className={`
                w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.email ? 'border-red-300' : 'border-gray-300'}
              `}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        
        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Name *
          </label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => updateField('companyName', e.target.value)}
              placeholder="FitFuel Ltd."
              className={`
                w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.companyName ? 'border-red-300' : 'border-gray-300'}
              `}
            />
          </div>
          {errors.companyName && (
            <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
          )}
        </div>
        
        {/* Shopify URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shopify Store URL *
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={formData.shopifyUrl}
              onChange={(e) => updateField('shopifyUrl', e.target.value)}
              placeholder="fitfuel.myshopify.com"
              className={`
                w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.shopifyUrl ? 'border-red-300' : 'border-gray-300'}
              `}
            />
          </div>
          {errors.shopifyUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.shopifyUrl}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Enter your Shopify store URL (e.g., yourstore.myshopify.com)
          </p>
        </div>
        
        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="+44 7700 123456"
              className={`
                w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
                ${errors.phone ? 'border-red-300' : 'border-gray-300'}
              `}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
        
        {/* Company Registration (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Registration Number (Optional)
          </label>
          <input
            type="text"
            value={formData.companyReg}
            onChange={(e) => updateField('companyReg', e.target.value)}
            placeholder="12345678"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="mt-1 text-xs text-gray-500">
            UK company registration number (if applicable)
          </p>
        </div>
        
        {/* Submit */}
        <div className="pt-6 border-t">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </form>
      
      {/* Info Box */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">Why do we need this?</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Shopify URL</strong>: We'll connect to your store to sync products</li>
          <li>• <strong>Contact Info</strong>: For application updates and support</li>
          <li>• <strong>Company Details</strong>: Required for contract and payment processing</li>
        </ul>
      </div>
    </div>
  );
}

