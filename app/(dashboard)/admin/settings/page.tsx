'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Settings,
  Bell,
  Shield,
  CreditCard,
  Database,
  Key,
  Save,
  Plus,
  Trash2,
  Edit2,
  X,
  Check,
  Loader2,
  Star,
  GripVertical,
  CheckCircle,
} from 'lucide-react';

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

export default function AdminSettingsPage() {
  const [supportEmail, setSupportEmail] = useState('support@ezdocu.com');
  const [isSaving, setIsSaving] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSavingPlan, setIsSavingPlan] = useState(false);
  const [previewBillingPeriod, setPreviewBillingPeriod] = useState<'monthly' | 'yearly'>('yearly');
  const benefitsContainerRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    lowCreditAlerts: true,
    newAccountAlerts: true,
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setIsLoadingPlans(true);
      const response = await fetch('/api/payments/plans?includeInactive=true');
      const data = await response.json();
      if (data.status === 200) {
        setPlans(data.plans);
      }
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setIsLoadingPlans(false);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    // TODO: Save settings to backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan({ ...plan });
    setIsEditModalOpen(true);
  };

  const handleSavePlan = async () => {
    if (!editingPlan) return;

    setIsSavingPlan(true);
    try {
      const response = await fetch(`/api/payments/plans/${editingPlan.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingPlan.name,
          slug: editingPlan.slug,
          description: editingPlan.description,
          monthlyPrice: editingPlan.monthlyPrice,
          yearlyPrice: editingPlan.yearlyPrice,
          yearlyDiscount: editingPlan.yearlyDiscount,
          benefits: editingPlan.benefits.filter(b => b.trim() !== ''),
          pagesPerMonth: editingPlan.pagesPerMonth,
          isPopular: editingPlan.isPopular,
          isActive: editingPlan.isActive,
          sortOrder: editingPlan.sortOrder,
          buttonText: editingPlan.buttonText,
          buttonVariant: editingPlan.buttonVariant,
        }),
      });

      const data = await response.json();
      if (data.status === 200 && data.plan) {
        setPlans(plans.map(p => p.id === editingPlan.id ? data.plan : p));
        setIsEditModalOpen(false);
        setEditingPlan(null);
      } else {
        console.error('Error saving plan:', data.message);
        alert('Error saving plan: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('Error saving plan. Please try again.');
    } finally {
      setIsSavingPlan(false);
    }
  };

  const handleAddBenefit = () => {
    if (!editingPlan) return;
    setEditingPlan({
      ...editingPlan,
      benefits: [...editingPlan.benefits, ''],
    });
    // Auto-scroll to bottom after adding new benefit
    setTimeout(() => {
      if (benefitsContainerRef.current) {
        benefitsContainerRef.current.scrollTop = benefitsContainerRef.current.scrollHeight;
      }
    }, 50);
  };

  const handleRemoveBenefit = (index: number) => {
    if (!editingPlan) return;
    setEditingPlan({
      ...editingPlan,
      benefits: editingPlan.benefits.filter((_, i) => i !== index),
    });
  };

  const handleBenefitChange = (index: number, value: string) => {
    if (!editingPlan) return;
    const newBenefits = [...editingPlan.benefits];
    newBenefits[index] = value;
    setEditingPlan({ ...editingPlan, benefits: newBenefits });
  };

  const handleSeedPlans = async () => {
    try {
      const response = await fetch('/api/payments/plans/seed', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.status === 201) {
        setPlans(data.plans);
      }
    } catch (error) {
      console.error('Error seeding plans:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage platform configuration</p>
        </div>
        <Button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Settings className="h-4 w-4 text-gray-600" />
              </div>
              <h2 className="font-semibold text-gray-900">General</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm text-gray-700">Support Email</label>
                <input
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Pricing Plans */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-gray-600" />
                </div>
                <h2 className="font-semibold text-gray-900">Pricing Plans</h2>
              </div>
              {plans.length === 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSeedPlans}
                  className="text-purple-600 border-purple-200 hover:bg-purple-50"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create Default Plans
                </Button>
              )}
            </div>
            <div className="p-5">
              {isLoadingPlans ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
                </div>
              ) : plans.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No plans configured yet</p>
                  <p className="text-sm mt-1">Click "Create Default Plans" to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plans.map((plan) => {
                    const isPopular = plan.isPopular;
                    const isPrimary = plan.buttonVariant === 'primary';
                    const price = Math.round(parseFloat(plan.yearlyPrice));
                    const monthlyPrice = Math.round(parseFloat(plan.monthlyPrice));

                    return (
                      <div
                        key={plan.id}
                        className={`relative rounded-2xl ${
                          isPopular ? 'border-2 border-purple-500' : 'border border-gray-200'
                        } ${!plan.isActive ? 'opacity-50' : ''} bg-white p-5 transition-all hover:shadow-lg flex flex-col h-full`}
                      >
                        {isPopular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <span className="bg-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                              Most Popular
                            </span>
                          </div>
                        )}
                        {!plan.isActive && (
                          <div className="absolute -top-3 right-4">
                            <span className="bg-gray-400 text-white text-xs font-medium px-3 py-1 rounded-full">
                              Inactive
                            </span>
                          </div>
                        )}
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                          <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                        </div>
                        <div className="flex items-baseline gap-2 mb-4">
                          <span className="text-4xl font-bold text-gray-900">${price}</span>
                          {price > 0 && (
                            <>
                              <span className="text-gray-500 text-sm">/year</span>
                              {plan.yearlyDiscount > 0 && (
                                <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-0.5 rounded-full">
                                  -{plan.yearlyDiscount}%
                                </span>
                              )}
                            </>
                          )}
                        </div>
                        {price > 0 && (
                          <p className="text-xs text-gray-500 mb-4">
                            or ${monthlyPrice}/month billed monthly
                          </p>
                        )}
                        <ul className="space-y-2 text-sm text-gray-600 flex-1 mb-4">
                          {plan.benefits.map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                              <span className="text-xs">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-auto space-y-2">
                          <div
                            className={`w-full h-10 rounded-lg flex items-center justify-center text-sm font-medium ${
                              isPrimary
                                ? 'bg-purple-600 text-white'
                                : 'border border-gray-200 text-gray-700'
                            }`}
                          >
                            {plan.buttonText}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPlan(plan)}
                            className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                          >
                            <Edit2 className="h-4 w-4 mr-1" />
                            Edit Plan
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Bell className="h-4 w-4 text-gray-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Notifications</h2>
            </div>
            <div className="p-5 space-y-4">
              {Object.entries({
                emailNotifications: 'Email Notifications',
                lowCreditAlerts: 'Low Credit Alerts',
                newAccountAlerts: 'New Account Alerts',
              }).map(([key, label]) => (
                <div key={key} className="flex items-center justify-between">
                  <label className="text-sm text-gray-700">{label}</label>
                  <button
                    onClick={() =>
                      setNotifications((prev) => ({
                        ...prev,
                        [key]: !prev[key as keyof typeof prev],
                      }))
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications[key as keyof typeof notifications]
                        ? 'bg-purple-600'
                        : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
                        notifications[key as keyof typeof notifications]
                          ? 'translate-x-6'
                          : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* API Keys */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Key className="h-4 w-4 text-gray-600" />
              </div>
              <h2 className="font-semibold text-gray-900">API Keys</h2>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">
                  OpenAI API Key
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="password"
                    value="sk-••••••••••••••••"
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
                  />
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">
                  Stripe API Key
                </label>
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="password"
                    value="sk_live_••••••••"
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50"
                  />
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Shield className="h-4 w-4 text-gray-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Security</h2>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Two-Factor Auth</span>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  Enabled
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Session Timeout</span>
                <span className="text-sm text-gray-600">24 hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">IP Whitelist</span>
                <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                  Disabled
                </span>
              </div>
            </div>
          </div>

          {/* Database */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Database className="h-4 w-4 text-gray-600" />
              </div>
              <h2 className="font-semibold text-gray-900">Database</h2>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Status</span>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  Connected
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Size</span>
                <span className="text-sm text-gray-600">2.4 GB</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Last Backup</span>
                <span className="text-sm text-gray-600">2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Plan Modal */}
      {isEditModalOpen && editingPlan && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-50 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white rounded-t-xl z-10">
              <h3 className="text-lg font-semibold text-gray-900">Edit Plan: {editingPlan.name}</h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingPlan(null);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              {/* Left side - Edit Form */}
              <div className="space-y-5 bg-white rounded-xl p-5 border border-gray-200">
                <h4 className="font-medium text-gray-900 text-sm uppercase tracking-wider">Edit Details</h4>

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                    <input
                      type="text"
                      value={editingPlan.name}
                      onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Slug</label>
                    <input
                      type="text"
                      value={editingPlan.slug}
                      onChange={(e) => setEditingPlan({ ...editingPlan, slug: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                  <input
                    type="text"
                    value={editingPlan.description || ''}
                    onChange={(e) => setEditingPlan({ ...editingPlan, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Monthly ($)</label>
                    <input
                      type="text"
                      value={editingPlan.monthlyPrice}
                      onChange={(e) => setEditingPlan({ ...editingPlan, monthlyPrice: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Yearly ($)</label>
                    <input
                      type="text"
                      value={editingPlan.yearlyPrice}
                      onChange={(e) => setEditingPlan({ ...editingPlan, yearlyPrice: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Discount (%)</label>
                    <input
                      type="number"
                      value={editingPlan.yearlyDiscount}
                      onChange={(e) => setEditingPlan({ ...editingPlan, yearlyDiscount: parseInt(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Pages per month */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Pages/Month (empty = unlimited)</label>
                  <input
                    type="number"
                    value={editingPlan.pagesPerMonth || ''}
                    onChange={(e) => setEditingPlan({ ...editingPlan, pagesPerMonth: e.target.value ? parseInt(e.target.value) : null })}
                    placeholder="Unlimited"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Benefits */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-medium text-gray-600">Benefits</label>
                    <Button type="button" variant="outline" size="sm" onClick={handleAddBenefit} className="text-purple-600 border-purple-200 h-7 text-xs">
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                  <div ref={benefitsContainerRef} className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {editingPlan.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <GripVertical className="h-4 w-4 text-gray-300 flex-shrink-0" />
                        <input
                          type="text"
                          value={benefit}
                          onChange={(e) => handleBenefitChange(index, e.target.value)}
                          placeholder="Enter benefit..."
                          className="flex-1 px-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <button type="button" onClick={() => handleRemoveBenefit(index)} className="p-1.5 text-red-500 hover:bg-red-50 rounded flex-shrink-0">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                    {editingPlan.benefits.length === 0 && (
                      <p className="text-xs text-gray-400 text-center py-2">No benefits yet. Click "Add" to add one.</p>
                    )}
                  </div>
                </div>

                {/* Options */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Button Text</label>
                    <select
                      value={editingPlan.buttonText}
                      onChange={(e) => setEditingPlan({ ...editingPlan, buttonText: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Start for free">Start for free</option>
                      <option value="Get started">Get started</option>
                      <option value="Contact team">Contact team</option>
                      <option value="Contact sales">Contact sales</option>
                      <option value="Try for free">Try for free</option>
                      <option value="Subscribe now">Subscribe now</option>
                      <option value="Upgrade now">Upgrade now</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Button Style</label>
                    <select
                      value={editingPlan.buttonVariant}
                      onChange={(e) => setEditingPlan({ ...editingPlan, buttonVariant: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="outline">Outline (Gray border)</option>
                      <option value="primary">Primary (Purple filled)</option>
                      <option value="default">Default</option>
                    </select>
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPlan.isPopular}
                      onChange={(e) => setEditingPlan({ ...editingPlan, isPopular: e.target.checked })}
                      className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">Popular</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPlan.isActive}
                      onChange={(e) => setEditingPlan({ ...editingPlan, isActive: e.target.checked })}
                      className="w-4 h-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                </div>
              </div>

              {/* Right side - Live Preview */}
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900 text-sm uppercase tracking-wider">Live Preview</h4>
                  {/* Billing Toggle */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setPreviewBillingPeriod('monthly')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                        previewBillingPeriod === 'monthly'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Monthly
                    </button>
                    <button
                      onClick={() => setPreviewBillingPeriod('yearly')}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                        previewBillingPeriod === 'yearly'
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      Yearly
                    </button>
                  </div>
                </div>
                <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-purple-50 to-white rounded-xl p-6 border border-gray-100">
                  {(() => {
                    const yearlyPrice = Math.round(parseFloat(editingPlan.yearlyPrice) || 0);
                    const monthlyPrice = Math.round(parseFloat(editingPlan.monthlyPrice) || 0);
                    const isPrimary = editingPlan.buttonVariant === 'primary';
                    const isYearly = previewBillingPeriod === 'yearly';
                    const displayPrice = isYearly ? yearlyPrice : monthlyPrice;

                    return (
                      <div
                        className={`relative rounded-2xl ${
                          editingPlan.isPopular ? 'border-2 border-purple-500' : 'border border-gray-200'
                        } ${!editingPlan.isActive ? 'opacity-50' : ''} bg-white p-6 transition-all w-full max-w-sm flex flex-col shadow-xl min-h-[480px]`}
                      >
                        {editingPlan.isPopular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <span className="bg-purple-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                              Most Popular
                            </span>
                          </div>
                        )}
                        {!editingPlan.isActive && (
                          <div className="absolute -top-3 right-4">
                            <span className="bg-gray-400 text-white text-xs font-medium px-3 py-1 rounded-full">
                              Inactive
                            </span>
                          </div>
                        )}
                        <div className="mb-5 mt-2">
                          <h3 className="text-xl font-semibold text-gray-900">{editingPlan.name || 'Plan Name'}</h3>
                          <p className="text-sm text-gray-500 mt-1">{editingPlan.description || 'Plan description'}</p>
                        </div>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-5xl font-bold text-gray-900">${displayPrice}</span>
                          {displayPrice > 0 && (
                            <>
                              <span className="text-gray-500 text-base">/{isYearly ? 'year' : 'month'}</span>
                              {isYearly && editingPlan.yearlyDiscount > 0 && (
                                <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full">
                                  -{editingPlan.yearlyDiscount}%
                                </span>
                              )}
                            </>
                          )}
                        </div>
                        {displayPrice > 0 && isYearly && (
                          <p className="text-sm text-gray-500 mb-6">
                            or ${monthlyPrice}/month billed monthly
                          </p>
                        )}
                        {displayPrice > 0 && !isYearly && (
                          <p className="text-sm text-gray-500 mb-6">
                            or ${yearlyPrice}/year (save {editingPlan.yearlyDiscount}%)
                          </p>
                        )}
                        {displayPrice === 0 && <div className="mb-6" />}
                        <ul className="space-y-3 text-sm text-gray-600 flex-1 mb-6">
                          {editingPlan.benefits.filter(b => b.trim()).map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-3">
                              <CheckCircle className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="mt-auto">
                          <div
                            className={`w-full h-12 rounded-lg flex items-center justify-center text-base font-medium ${
                              isPrimary
                                ? 'bg-purple-600 text-white'
                                : 'border border-gray-200 text-gray-700'
                            }`}
                          >
                            {editingPlan.buttonText || 'Get started'}
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
                <p className="text-xs text-gray-500 text-center mt-3">This is how your plan will appear on the landing page</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white rounded-b-xl">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingPlan(null);
                }}
                disabled={isSavingPlan}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSavePlan}
                disabled={isSavingPlan}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {isSavingPlan ? (
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Check className="h-4 w-4 mr-1" />
                )}
                {isSavingPlan ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
