'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Plus, Clock, CheckCircle, Receipt, Zap, Loader2, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AutoRechargeSettings } from './auto-recharge';

interface Plan {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  monthlyPrice: string;
  yearlyPrice: string;
  yearlyDiscount: number;
  benefits: string[];
  pagesPerMonth: number | null;
  isPopular: boolean;
  isActive: boolean;
  sortOrder: number;
  buttonText: string;
  buttonVariant: string;
}

export default function TranslatorCreditsPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');

  const creditBalance = 1250;
  const usedThisMonth = 350;
  const totalPurchased = 5000;

  const recentTransactions = [
    { id: 1, type: 'purchase', credits: 500, date: '2024-01-10' },
    { id: 2, type: 'usage', credits: -8, description: 'Order ORD-002 (4 pages, text)', date: '2024-01-15' },
    { id: 3, type: 'usage', credits: -2, description: 'Order ORD-001 (2 pages, image)', date: '2024-01-15' },
    { id: 4, type: 'usage', credits: -6, description: 'Order ORD-006 (3 pages, text)', date: '2024-01-13' },
    { id: 5, type: 'purchase', credits: 1000, date: '2023-12-20' },
  ];

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoadingPlans(true);
        const response = await fetch('/api/payments/plans');
        const data = await response.json();
        if (data.status === 200 && data.plans) {
          // Only show active plans
          setPlans(data.plans.filter((p: Plan) => p.isActive));
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setIsLoadingPlans(false);
      }
    };

    fetchPlans();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Credits</h1>
        <p className="text-gray-500 mt-1">Manage your credits and billing</p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-purple-600 to-purple-500 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-purple-200 text-sm">Available Balance</p>
            <p className="text-4xl font-bold mt-2">{creditBalance.toLocaleString()}</p>
            <p className="text-purple-200 text-sm mt-1">credits (1 credit = $1 USD)</p>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <CreditCard className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/20 grid grid-cols-2 gap-4">
          <div><p className="text-purple-200 text-xs">Used This Month</p><p className="text-xl font-semibold mt-1">{usedThisMonth}</p></div>
          <div><p className="text-purple-200 text-xs">Total Purchased</p><p className="text-xl font-semibold mt-1">{totalPurchased.toLocaleString()}</p></div>
        </div>
      </div>

      {/* Auto-Recharge */}
      <AutoRechargeSettings />

      {/* Subscription Plans */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Subscription Plans</h2>
          </div>
          {/* Billing Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                billingPeriod === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Yearly
              <span className="ml-1 text-xs text-purple-600 font-semibold">Save up to 20%</span>
            </button>
          </div>
        </div>

        {isLoadingPlans ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-gray-200">
            <Crown className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No subscription plans available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const isPopular = plan.isPopular;
              const isPrimary = plan.buttonVariant === 'primary';
              const yearlyPrice = Math.round(parseFloat(plan.yearlyPrice));
              const monthlyPrice = Math.round(parseFloat(plan.monthlyPrice));
              const isYearly = billingPeriod === 'yearly';
              const displayPrice = isYearly ? yearlyPrice : monthlyPrice;

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl ${
                    isPopular ? 'border-2 border-purple-500 shadow-lg shadow-purple-500/10' : 'border border-gray-200'
                  } bg-white p-6 transition-all hover:shadow-xl flex flex-col h-full`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="mb-4 mt-1">
                    <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-gray-900">${displayPrice}</span>
                    {displayPrice > 0 && (
                      <>
                        <span className="text-gray-500 text-sm">/{isYearly ? 'year' : 'month'}</span>
                        {isYearly && plan.yearlyDiscount > 0 && (
                          <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-0.5 rounded-full">
                            -{plan.yearlyDiscount}%
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  {displayPrice > 0 && isYearly && (
                    <p className="text-xs text-gray-500 mb-4">
                      or ${monthlyPrice}/month billed monthly
                    </p>
                  )}
                  {displayPrice > 0 && !isYearly && (
                    <p className="text-xs text-gray-500 mb-4">
                      or ${yearlyPrice}/year (save {plan.yearlyDiscount}%)
                    </p>
                  )}
                  {displayPrice === 0 && <div className="mb-4" />}
                  <ul className="space-y-2 text-sm text-gray-600 flex-1 mb-6">
                    {plan.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    <Button
                      className={`w-full h-11 rounded-lg text-sm font-medium ${
                        isPrimary
                          ? 'bg-purple-600 hover:bg-purple-700 text-white'
                          : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                      variant={isPrimary ? 'default' : 'outline'}
                    >
                      {plan.buttonText}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pricing Info - CORRECTED per scope: image=1, text=2 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center"><Receipt className="h-5 w-5 text-blue-600" /></div>
            <h3 className="font-semibold text-gray-900">Image-based Pages</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">1 credit<span className="text-lg font-normal text-gray-500"> / page</span></p>
          <p className="text-sm text-gray-500 mt-2">Scanned documents, images, PDFs requiring OCR</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center"><Zap className="h-5 w-5 text-purple-600" /></div>
            <h3 className="font-semibold text-gray-900">Text-based Pages</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">2 credits<span className="text-lg font-normal text-gray-500"> / page</span></p>
          <p className="text-sm text-gray-500 mt-2">Digital PDFs and documents with text layers</p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Transaction History</h2>
          <Button variant="ghost" size="sm">View All</Button>
        </div>
        <div className="divide-y divide-gray-100">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${tx.type === 'purchase' ? 'bg-green-50' : 'bg-gray-100'}`}>
                  {tx.type === 'purchase' ? <Plus className="h-5 w-5 text-green-600" /> : <Clock className="h-5 w-5 text-gray-500" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{tx.type === 'purchase' ? `Purchased ${tx.credits} credits` : tx.description}</p>
                  <p className="text-xs text-gray-500">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${tx.type === 'purchase' ? 'text-green-600' : 'text-gray-900'}`}>
                  {tx.type === 'purchase' ? `+${tx.credits}` : tx.credits} credits
                </p>
                <div className="flex items-center gap-1 justify-end"><CheckCircle className="h-3 w-3 text-green-500" /><span className="text-xs text-gray-500">Completed</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
