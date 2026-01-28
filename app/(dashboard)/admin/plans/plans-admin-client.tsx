'use client';

import { useState, useEffect } from 'react';
import { Crown, Edit2, Save, X, Loader2, Check, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

interface PlansAdminClientProps {
    accessToken: string;
}

export default function PlansAdminClient({ accessToken }: PlansAdminClientProps) {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingPlan, setEditingPlan] = useState<number | null>(null);
    const [editData, setEditData] = useState<Partial<Plan>>({});
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState<number | null>(null);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/payments/plans?includeInactive=true');
            const data = await response.json();
            if (data.status === 200 && data.plans) {
                setPlans(data.plans);
            }
        } catch (error) {
            console.error('Error fetching plans:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const startEditing = (plan: Plan) => {
        setEditingPlan(plan.id);
        setEditData({
            name: plan.name,
            description: plan.description || '',
            monthlyPrice: plan.monthlyPrice,
            yearlyPrice: plan.yearlyPrice,
            yearlyDiscount: plan.yearlyDiscount,
            creditsMonthly: plan.creditsMonthly || 0,
            creditsYearly: plan.creditsYearly || 0,
            pagesPerMonth: plan.pagesPerMonth || 0,
            isActive: plan.isActive,
            isPopular: plan.isPopular,
            buttonText: plan.buttonText,
        });
    };

    const cancelEditing = () => {
        setEditingPlan(null);
        setEditData({});
    };

    const savePlan = async (planId: number) => {
        setIsSaving(true);
        try {
            const response = await fetch(`/api/payments/plans/${planId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(editData),
            });

            const data = await response.json();
            if (data.status === 200) {
                // Update local state
                setPlans(plans.map(p => p.id === planId ? { ...p, ...editData } as Plan : p));
                setEditingPlan(null);
                setEditData({});
                setSaveSuccess(planId);
                setTimeout(() => setSaveSuccess(null), 2000);
            } else {
                alert(data.message || 'Error saving plan');
            }
        } catch (error) {
            console.error('Error saving plan:', error);
            alert('Error saving plan');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Plans Management</h1>
                    <p className="text-gray-500 mt-1">Configure subscription plans and credits</p>
                </div>
            </div>

            <div className="grid gap-6">
                {plans.map((plan) => {
                    const isEditing = editingPlan === plan.id;
                    const showSuccess = saveSuccess === plan.id;

                    return (
                        <div
                            key={plan.id}
                            className={`bg-white rounded-xl border ${isEditing ? 'border-purple-300 ring-2 ring-purple-100' : 'border-gray-200'} p-6`}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${plan.isPopular ? 'bg-purple-100' : 'bg-gray-100'}`}>
                                        <Crown className={`h-5 w-5 ${plan.isPopular ? 'text-purple-600' : 'text-gray-500'}`} />
                                    </div>
                                    <div>
                                        {isEditing ? (
                                            <Input
                                                value={editData.name || ''}
                                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                                className="font-semibold text-lg h-8 w-48"
                                            />
                                        ) : (
                                            <h3 className="font-semibold text-lg text-gray-900">{plan.name}</h3>
                                        )}
                                        <p className="text-sm text-gray-500">Slug: {plan.slug}</p>
                                    </div>
                                    {plan.isPopular && (
                                        <span className="bg-purple-100 text-purple-700 text-xs font-medium px-2 py-1 rounded-full">
                                            Popular
                                        </span>
                                    )}
                                    {!plan.isActive && (
                                        <span className="bg-gray-100 text-gray-500 text-xs font-medium px-2 py-1 rounded-full">
                                            Inactive
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {showSuccess && (
                                        <span className="flex items-center gap-1 text-green-600 text-sm">
                                            <Check className="h-4 w-4" /> Saved
                                        </span>
                                    )}
                                    {isEditing ? (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={cancelEditing}
                                                disabled={isSaving}
                                            >
                                                <X className="h-4 w-4 mr-1" /> Cancel
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => savePlan(plan.id)}
                                                disabled={isSaving}
                                                className="bg-purple-600 hover:bg-purple-700"
                                            >
                                                {isSaving ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Save className="h-4 w-4 mr-1" /> Save
                                                    </>
                                                )}
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => startEditing(plan)}
                                        >
                                            <Edit2 className="h-4 w-4 mr-1" /> Edit
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {/* Monthly Price */}
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase">Monthly Price</label>
                                    {isEditing ? (
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                            <Input
                                                type="number"
                                                value={editData.monthlyPrice || ''}
                                                onChange={(e) => setEditData({ ...editData, monthlyPrice: e.target.value })}
                                                className="pl-7 h-9"
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-lg font-semibold text-gray-900">${plan.monthlyPrice}</p>
                                    )}
                                </div>

                                {/* Yearly Price */}
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase">Yearly Price</label>
                                    {isEditing ? (
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                            <Input
                                                type="number"
                                                value={editData.yearlyPrice || ''}
                                                onChange={(e) => setEditData({ ...editData, yearlyPrice: e.target.value })}
                                                className="pl-7 h-9"
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-lg font-semibold text-gray-900">${plan.yearlyPrice}</p>
                                    )}
                                </div>

                                {/* Monthly Credits */}
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase flex items-center gap-1">
                                        <Coins className="h-3 w-3" /> Credits/Month
                                    </label>
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            value={editData.creditsMonthly || 0}
                                            onChange={(e) => setEditData({ ...editData, creditsMonthly: parseInt(e.target.value) || 0 })}
                                            className="h-9"
                                        />
                                    ) : (
                                        <p className="text-lg font-semibold text-purple-600">
                                            {(plan.creditsMonthly || plan.pagesPerMonth || 0).toLocaleString()}
                                        </p>
                                    )}
                                </div>

                                {/* Yearly Credits */}
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase flex items-center gap-1">
                                        <Coins className="h-3 w-3" /> Credits/Year
                                    </label>
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            value={editData.creditsYearly || 0}
                                            onChange={(e) => setEditData({ ...editData, creditsYearly: parseInt(e.target.value) || 0 })}
                                            className="h-9"
                                        />
                                    ) : (
                                        <p className="text-lg font-semibold text-purple-600">
                                            {(plan.creditsYearly || 0).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Additional fields when editing */}
                            {isEditing && (
                                <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase">Yearly Discount %</label>
                                        <Input
                                            type="number"
                                            value={editData.yearlyDiscount || 0}
                                            onChange={(e) => setEditData({ ...editData, yearlyDiscount: parseInt(e.target.value) || 0 })}
                                            className="h-9"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase">Button Text</label>
                                        <Input
                                            value={editData.buttonText || ''}
                                            onChange={(e) => setEditData({ ...editData, buttonText: e.target.value })}
                                            className="h-9"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase">Popular</label>
                                        <select
                                            value={editData.isPopular ? 'true' : 'false'}
                                            onChange={(e) => setEditData({ ...editData, isPopular: e.target.value === 'true' })}
                                            className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm"
                                        >
                                            <option value="false">No</option>
                                            <option value="true">Yes</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase">Active</label>
                                        <select
                                            value={editData.isActive ? 'true' : 'false'}
                                            onChange={(e) => setEditData({ ...editData, isActive: e.target.value === 'true' })}
                                            className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm"
                                        >
                                            <option value="false">Inactive</option>
                                            <option value="true">Active</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            {isEditing && (
                                <div className="mt-4 space-y-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase">Description</label>
                                    <Input
                                        value={editData.description || ''}
                                        onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                                        className="h-9"
                                        placeholder="Plan description..."
                                    />
                                </div>
                            )}

                            {/* Benefits preview */}
                            {!isEditing && plan.benefits && plan.benefits.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-xs font-medium text-gray-500 uppercase mb-2">Benefits</p>
                                    <div className="flex flex-wrap gap-2">
                                        {plan.benefits.slice(0, 4).map((benefit, idx) => (
                                            <span key={idx} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                                {benefit}
                                            </span>
                                        ))}
                                        {plan.benefits.length > 4 && (
                                            <span className="text-xs text-gray-400">+{plan.benefits.length - 4} more</span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
