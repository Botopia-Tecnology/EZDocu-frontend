'use client';

import { useState } from 'react';
import { RefreshCw, CreditCard, ChevronDown } from 'lucide-react';

const thresholdOptions = [10, 20, 50, 100, 200];
const rechargeAmounts = [50, 100, 200, 500];

export function AutoRechargeSettings() {
  const [enabled, setEnabled] = useState(false);
  const [threshold, setThreshold] = useState(20);
  const [rechargeAmount, setRechargeAmount] = useState(100);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${enabled ? 'bg-green-50' : 'bg-gray-100'}`}>
            <RefreshCw className={`h-5 w-5 ${enabled ? 'text-green-600' : 'text-gray-400'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Auto-Recharge</h3>
            <p className="text-sm text-gray-500">Automatically add credits when balance is low</p>
          </div>
        </div>
        <button onClick={() => setEnabled(!enabled)} className={`relative w-14 h-7 rounded-full transition-colors ${enabled ? 'bg-green-500' : 'bg-gray-300'}`}>
          <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'left-8' : 'left-1'}`} />
        </button>
      </div>

      {enabled && (
        <div className="mt-5 pt-5 border-t border-gray-100">
          <button onClick={() => setShowSettings(!showSettings)} className="flex items-center gap-2 text-sm text-purple-600 font-medium mb-4">
            Configure settings <ChevronDown className={`h-4 w-4 transition-transform ${showSettings ? 'rotate-180' : ''}`} />
          </button>

          {showSettings && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recharge when balance falls below</label>
                <div className="flex flex-wrap gap-2">
                  {thresholdOptions.map(opt => (
                    <button key={opt} onClick={() => setThreshold(opt)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${threshold === opt ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      {opt} credits
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Recharge amount</label>
                <div className="flex flex-wrap gap-2">
                  {rechargeAmounts.map(amt => (
                    <button key={amt} onClick={() => setRechargeAmount(amt)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${rechargeAmount === amt ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                      {amt} credits
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-purple-800">
                When balance drops below <strong>{threshold} credits</strong>, automatically purchase <strong>{rechargeAmount} credits</strong> (${rechargeAmount})
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
