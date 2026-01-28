'use client';

import { useState, useEffect } from 'react';
import { CreditCard, Plus, Clock, CheckCircle, Receipt, Zap, Loader2, Coins, DollarSign, Crown, Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { AutoRechargeSettings } from './auto-recharge';

interface CreditPackage {
  id: number;
  name: string;
  credits: number;
  priceUsd: string;
  isPopular: boolean;
  description: string | null;
}

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
  creditsMonthly: number | null;
  creditsYearly: number | null;
  isPopular: boolean;
  isActive: boolean;
  sortOrder: number;
  buttonText: string;
  buttonVariant: string;
}

interface Transaction {
  id: string;
  type: string;
  amount: number;
  description: string | null;
  createdAt: string;
}

interface SubscriptionStatus {
  hasSubscription: boolean;
  planId: number | null;
  planName: string | null;
  autoRenew: boolean | null;
  subscriptionStatus: string | null;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean | null;
}

interface CreditsClientProps {
  accountId: string;
  userId: string;
  accessToken: string;
}

export function CreditsClient({ accountId, userId, accessToken }: CreditsClientProps) {
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);
  const [purchasingPackageId, setPurchasingPackageId] = useState<number | null>(null);
  const [creditBalance, setCreditBalance] = useState(0);
  const [usedThisMonth, setUsedThisMonth] = useState(0);
  const [totalPurchased, setTotalPurchased] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoadingCredits, setIsLoadingCredits] = useState(true);
  const [customCredits, setCustomCredits] = useState<string>('');
  const [isPurchasingCustom, setIsPurchasingCustom] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const [subscribingPlanId, setSubscribingPlanId] = useState<number | null>(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true);
  const [isTogglingAutoRenew, setIsTogglingAutoRenew] = useState(false);

  // Fetch credit packages
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoadingPackages(true);
        const response = await fetch('/api/payments/credit-packages');
        const data = await response.json();
        if (data.status === 200 && data.packages) {
          setPackages(data.packages);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setIsLoadingPackages(false);
      }
    };

    fetchPackages();
  }, []);

  // Fetch subscription plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setIsLoadingPlans(true);
        const response = await fetch('/api/payments/plans');
        const data = await response.json();
        if (data.status === 200 && data.plans) {
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

  // Fetch subscription status
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      if (!accountId) return;
      try {
        setIsLoadingSubscription(true);
        const response = await fetch(`/api/payments/subscription/status/${accountId}`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        const data = await response.json();
        if (data.status === 200) {
          setSubscriptionStatus(data);
        }
      } catch (error) {
        console.error('Error fetching subscription status:', error);
      } finally {
        setIsLoadingSubscription(false);
      }
    };

    fetchSubscriptionStatus();
  }, [accountId, accessToken]);

  // Fetch account credits and transactions
  useEffect(() => {
    const fetchCredits = async () => {
      if (!accountId) return;
      try {
        setIsLoadingCredits(true);
        const [creditsRes, transactionsRes] = await Promise.all([
          fetch(`/api/payments/credits/${accountId}`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          }),
          fetch(`/api/payments/transactions/${accountId}?limit=5`, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          })
        ]);

        const creditsData = await creditsRes.json();
        const transactionsData = await transactionsRes.json();

        if (creditsData.status === 200) {
          setCreditBalance(creditsData.credits || 0);
        }

        if (transactionsData.status === 200) {
          setTransactions(transactionsData.transactions || []);
          // Calculate totals from transactions
          const purchaseTransactions = transactionsData.transactions?.filter((t: Transaction) => t.type === 'purchase') || [];
          const total = purchaseTransactions.reduce((sum: number, t: Transaction) => sum + t.amount, 0);
          setTotalPurchased(total);

          // Calculate used this month
          const now = new Date();
          const thisMonth = transactionsData.transactions?.filter((t: Transaction) => {
            const txDate = new Date(t.createdAt);
            return t.type === 'consumption' &&
                   txDate.getMonth() === now.getMonth() &&
                   txDate.getFullYear() === now.getFullYear();
          }) || [];
          const used = thisMonth.reduce((sum: number, t: Transaction) => sum + Math.abs(t.amount), 0);
          setUsedThisMonth(used);
        }
      } catch (error) {
        console.error('Error fetching credits:', error);
      } finally {
        setIsLoadingCredits(false);
      }
    };

    fetchCredits();
  }, [accountId, accessToken]);

  // Handle purchase package
  const handlePurchase = async (packageId: number) => {
    if (!accountId || !userId) return;

    setPurchasingPackageId(packageId);
    try {
      const response = await fetch('/api/payments/create-credit-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          accountId,
          userId,
          packageId,
          successUrl: `${window.location.origin}/dashboard/credits?success=true`,
          cancelUrl: `${window.location.origin}/dashboard/credits?canceled=true`,
        }),
      });

      const data = await response.json();
      if (data.status === 200 && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.message || 'Error creating checkout session');
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('Error processing purchase');
    } finally {
      setPurchasingPackageId(null);
    }
  };

  // Handle custom credit purchase
  const handleCustomPurchase = async () => {
    const credits = parseInt(customCredits);
    if (!credits || credits < 10 || !accountId || !userId) {
      alert('Please enter at least 10 credits');
      return;
    }

    setIsPurchasingCustom(true);
    try {
      const response = await fetch('/api/payments/create-custom-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          accountId,
          userId,
          credits,
          successUrl: `${window.location.origin}/dashboard/credits?success=true`,
          cancelUrl: `${window.location.origin}/dashboard/credits?canceled=true`,
        }),
      });

      const data = await response.json();
      if (data.status === 200 && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.message || 'Error creating checkout session');
      }
    } catch (error) {
      console.error('Error creating custom checkout:', error);
      alert('Error processing purchase');
    } finally {
      setIsPurchasingCustom(false);
    }
  };

  // Handle toggle auto-renew
  const handleToggleAutoRenew = async (autoRenew: boolean) => {
    if (!accountId) return;

    setIsTogglingAutoRenew(true);
    try {
      const response = await fetch('/api/payments/subscription/toggle-auto-renew', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ accountId, autoRenew }),
      });

      const data = await response.json();
      if (data.status === 200) {
        setSubscriptionStatus(prev => prev ? { ...prev, autoRenew, cancelAtPeriodEnd: !autoRenew } : null);
      } else {
        alert(data.message || 'Error updating auto-renew setting');
      }
    } catch (error) {
      console.error('Error toggling auto-renew:', error);
      alert('Error updating auto-renew setting');
    } finally {
      setIsTogglingAutoRenew(false);
    }
  };

  // Handle plan subscription
  const handleSubscribe = async (plan: Plan) => {
    if (!accountId || !userId) return;

    // Free plan - just show message or handle differently
    if (parseFloat(plan.monthlyPrice) === 0) {
      alert('You are already on the Free plan!');
      return;
    }

    setSubscribingPlanId(plan.id);
    try {
      const isYearly = billingPeriod === 'yearly';
      const response = await fetch('/api/payments/create-plan-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          accountId,
          userId,
          planId: plan.id,
          billingPeriod,
          successUrl: `${window.location.origin}/dashboard/credits?success=true&plan=${plan.slug}`,
          cancelUrl: `${window.location.origin}/dashboard/credits?canceled=true`,
        }),
      });

      const data = await response.json();
      if (data.status === 200 && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.message || 'Error creating subscription');
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      alert('Error processing subscription');
    } finally {
      setSubscribingPlanId(null);
    }
  };

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
            {isLoadingCredits ? (
              <Loader2 className="h-8 w-8 animate-spin mt-2" />
            ) : (
              <p className="text-4xl font-bold mt-2">{creditBalance.toLocaleString()}</p>
            )}
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

      {/* Subscription Status */}
      {!isLoadingSubscription && subscriptionStatus?.hasSubscription && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Your Subscription</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Current Plan */}
            <div className="bg-purple-50 rounded-lg p-4">
              <p className="text-xs text-purple-600 font-medium mb-1">Current Plan</p>
              <p className="text-xl font-bold text-purple-700">{subscriptionStatus.planName || 'Unknown'}</p>
              <p className="text-xs text-purple-500 mt-1 capitalize">{subscriptionStatus.subscriptionStatus}</p>
            </div>

            {/* Next Billing Date */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-3.5 w-3.5 text-gray-500" />
                <p className="text-xs text-gray-600 font-medium">
                  {subscriptionStatus.cancelAtPeriodEnd ? 'Subscription Ends' : 'Next Billing Date'}
                </p>
              </div>
              <p className="text-xl font-bold text-gray-900">
                {subscriptionStatus.currentPeriodEnd
                  ? new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })
                  : 'N/A'}
              </p>
              {subscriptionStatus.cancelAtPeriodEnd && (
                <p className="text-xs text-orange-600 mt-1">Will not renew</p>
              )}
            </div>

            {/* Auto-Renew Toggle */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <RefreshCw className="h-3.5 w-3.5 text-gray-500" />
                <p className="text-xs text-gray-600 font-medium">Auto-Renew</p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm text-gray-700">
                  {subscriptionStatus.autoRenew
                    ? 'Subscription will automatically renew'
                    : 'Subscription will not renew'}
                </p>
                <Switch
                  checked={subscriptionStatus.autoRenew || false}
                  onChange={handleToggleAutoRenew}
                  disabled={isTogglingAutoRenew}
                />
              </div>
              {isTogglingAutoRenew && (
                <div className="flex items-center gap-2 mt-2">
                  <Loader2 className="h-3 w-3 animate-spin text-purple-600" />
                  <span className="text-xs text-gray-500">Updating...</span>
                </div>
              )}
            </div>
          </div>

          {subscriptionStatus.cancelAtPeriodEnd && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-start gap-3">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-800">Subscription ending soon</p>
                <p className="text-xs text-orange-600 mt-0.5">
                  Your subscription will end on {subscriptionStatus.currentPeriodEnd
                    ? new Date(subscriptionStatus.currentPeriodEnd).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })
                    : 'the next billing date'}. Enable auto-renew to keep your benefits.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Credit Packages */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Coins className="h-5 w-5 text-purple-600" />
          <h2 className="text-lg font-semibold text-gray-900">Buy Credit Packages</h2>
        </div>

        {isLoadingPackages ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
          </div>
        ) : packages.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-gray-200">
            <Coins className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No credit packages available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {packages.map((pkg) => {
              const price = parseFloat(pkg.priceUsd);
              const isPopular = pkg.isPopular;
              const isPurchasing = purchasingPackageId === pkg.id;

              return (
                <div
                  key={pkg.id}
                  className={`relative rounded-2xl ${
                    isPopular ? 'border-2 border-purple-500 shadow-lg shadow-purple-500/10' : 'border border-gray-200'
                  } bg-white p-5 transition-all hover:shadow-xl flex flex-col`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="mb-3 mt-1">
                    <h3 className="text-lg font-semibold text-gray-900">{pkg.name}</h3>
                    {pkg.description && (
                      <p className="text-xs text-gray-500 mt-1">{pkg.description}</p>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-bold text-purple-600">{pkg.credits}</span>
                    <span className="text-gray-500 text-sm">credits</span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-xl font-semibold text-gray-900">${price.toFixed(2)}</span>
                    <span className="text-gray-400 text-xs">USD</span>
                  </div>
                  <div className="mt-auto">
                    <Button
                      onClick={() => handlePurchase(pkg.id)}
                      disabled={isPurchasing}
                      className={`w-full h-10 rounded-lg text-sm font-medium ${
                        isPopular
                          ? 'bg-purple-600 hover:bg-purple-700 text-white'
                          : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                      variant={isPopular ? 'default' : 'outline'}
                    >
                      {isPurchasing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Buy Now'
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Custom Credit Purchase */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">Buy Custom Amount</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Need a specific amount? Enter how many credits you want (1 credit = $1 USD)
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <Input
                type="number"
                min="10"
                placeholder="Enter credits (min. 10)"
                value={customCredits}
                onChange={(e) => setCustomCredits(e.target.value)}
                className="pr-20"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                credits
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {customCredits && parseInt(customCredits) >= 10 && (
              <span className="text-lg font-semibold text-gray-900">
                ${parseInt(customCredits).toFixed(2)} USD
              </span>
            )}
            <Button
              onClick={handleCustomPurchase}
              disabled={isPurchasingCustom || !customCredits || parseInt(customCredits) < 10}
              className="bg-green-600 hover:bg-green-700 text-white whitespace-nowrap"
            >
              {isPurchasingCustom ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Buy Now'
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Subscription Plans */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Subscription Plans</h2>
          </div>
          <div className="flex items-center bg-gray-100 rounded-lg p-1 self-start sm:self-auto">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-md transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-3 sm:px-4 py-2 text-sm font-medium rounded-md transition-all ${
                billingPeriod === 'yearly'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Yearly
              <span className="ml-1 text-xs text-purple-600 font-semibold hidden sm:inline">Save up to 20%</span>
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
              const displayCredits = isYearly
                ? (plan.creditsYearly || plan.pagesPerMonth || 0)
                : (plan.creditsMonthly || plan.pagesPerMonth || 0);

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
                    <p className="text-xs text-gray-500 mb-2">
                      or ${monthlyPrice}/month billed monthly
                    </p>
                  )}
                  {displayPrice > 0 && !isYearly && (
                    <p className="text-xs text-gray-500 mb-2">
                      or ${yearlyPrice}/year (save {plan.yearlyDiscount}%)
                    </p>
                  )}
                  {displayPrice === 0 && <div className="mb-2" />}
                  {/* Credits included badge */}
                  <div className="bg-purple-50 rounded-lg px-3 py-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-semibold text-purple-700">
                        {displayCredits > 0 ? `${displayCredits.toLocaleString()} credits` : 'No credits included'}
                      </span>
                      <span className="text-xs text-purple-500">
                        /{isYearly ? 'year' : 'month'}
                      </span>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600 flex-1 mb-6">
                    {plan.benefits.map((benefit: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto">
                    <Button
                      onClick={() => handleSubscribe(plan)}
                      disabled={subscribingPlanId === plan.id}
                      className={`w-full h-11 rounded-lg text-sm font-medium ${
                        isPrimary
                          ? 'bg-purple-600 hover:bg-purple-700 text-white'
                          : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                      variant={isPrimary ? 'default' : 'outline'}
                    >
                      {subscribingPlanId === plan.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        plan.buttonText
                      )}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pricing Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Receipt className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Image-based Pages</h3>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            1 credit<span className="text-base sm:text-lg font-normal text-gray-500"> / page</span>
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">Scanned documents, images, PDFs requiring OCR</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <div className="flex items-center gap-3 mb-3 sm:mb-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Text-based Pages</h3>
          </div>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            2 credits<span className="text-base sm:text-lg font-normal text-gray-500"> / page</span>
          </p>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">Digital PDFs and documents with text layers</p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-4 sm:px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900 text-sm sm:text-base">Transaction History</h2>
          <Button variant="ghost" size="sm" className="text-xs sm:text-sm">View All</Button>
        </div>
        <div className="divide-y divide-gray-100">
          {isLoadingCredits ? (
            <div className="px-5 py-8 flex justify-center">
              <Loader2 className="h-6 w-6 text-purple-600 animate-spin" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="px-5 py-8 text-center text-gray-500">
              <p>No transactions yet</p>
            </div>
          ) : (
            transactions.map((tx) => (
              <div key={tx.id} className="px-4 sm:px-5 py-3 sm:py-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    tx.type === 'purchase' ? 'bg-green-50' : 'bg-gray-100'
                  }`}>
                    {tx.type === 'purchase' ? (
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                      {tx.type === 'purchase' ? `Purchased ${tx.amount} credits` : tx.description || `Used ${Math.abs(tx.amount)} credits`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-xs sm:text-sm font-semibold ${
                    tx.type === 'purchase' ? 'text-green-600' : 'text-gray-900'
                  }`}>
                    {tx.type === 'purchase' ? `+${tx.amount}` : `-${Math.abs(tx.amount)}`}
                  </p>
                  <div className="hidden sm:flex items-center gap-1 justify-end">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-gray-500">Completed</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
