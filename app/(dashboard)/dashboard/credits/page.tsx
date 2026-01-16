import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  CreditCard,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  Receipt,
  Zap
} from 'lucide-react';

export default async function TranslatorCreditsPage() {
  const session = await getSession();

  if (!session) {
    redirect('/sign-in');
  }

  const creditBalance = 1250;
  const usedThisMonth = 350;
  const totalPurchased = 5000;

  const creditPackages = [
    { credits: 100, price: 99, popular: false },
    { credits: 500, price: 449, popular: true, savings: '10%' },
    { credits: 1000, price: 849, popular: false, savings: '15%' },
    { credits: 2500, price: 1999, popular: false, savings: '20%' },
  ];

  const recentTransactions = [
    { id: 1, type: 'purchase', amount: 500, credits: 500, date: '2024-01-10', status: 'completed' },
    { id: 2, type: 'usage', amount: -8, description: 'Order ORD-002 (4 pages)', date: '2024-01-15', status: 'completed' },
    { id: 3, type: 'usage', amount: -4, description: 'Order ORD-001 (2 pages)', date: '2024-01-15', status: 'completed' },
    { id: 4, type: 'usage', amount: -6, description: 'Order ORD-006 (3 pages)', date: '2024-01-13', status: 'completed' },
    { id: 5, type: 'purchase', amount: 1000, credits: 1000, date: '2023-12-20', status: 'completed' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Credits</h1>
        <p className="text-gray-500 mt-1">Manage your credits and billing</p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-400 text-sm">Available Balance</p>
            <p className="text-4xl font-bold mt-2">{creditBalance.toLocaleString()}</p>
            <p className="text-gray-400 text-sm mt-1">credits</p>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
            <CreditCard className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-400 text-xs">Used This Month</p>
            <p className="text-xl font-semibold mt-1">{usedThisMonth}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Total Purchased</p>
            <p className="text-xl font-semibold mt-1">{totalPurchased.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Credit Packages */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Buy Credits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {creditPackages.map((pkg, i) => (
            <div
              key={i}
              className={`relative bg-white rounded-xl border-2 p-5 transition-all hover:border-gray-300 ${
                pkg.popular ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-medium px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{pkg.credits.toLocaleString()}</p>
                <p className="text-sm text-gray-500 mt-1">credits</p>
                <div className="mt-4">
                  <span className="text-2xl font-semibold text-gray-900">${pkg.price}</span>
                </div>
                {pkg.savings && (
                  <p className="text-xs text-green-600 font-medium mt-1">Save {pkg.savings}</p>
                )}
                <Button
                  className={`w-full mt-4 rounded-lg ${
                    pkg.popular
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  Buy Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Receipt className="h-5 w-5 text-gray-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Scanned Documents</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">2 credits<span className="text-lg font-normal text-gray-500"> / page</span></p>
          <p className="text-sm text-gray-500 mt-2">PDFs, images, and scanned files requiring OCR</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Digital Documents</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">1 credit<span className="text-lg font-normal text-gray-500"> / page</span></p>
          <p className="text-sm text-gray-500 mt-2">Digital PDFs and Word docs with text layers</p>
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
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  tx.type === 'purchase' ? 'bg-green-50' : 'bg-gray-100'
                }`}>
                  {tx.type === 'purchase' ? (
                    <Plus className="h-5 w-5 text-green-600" />
                  ) : (
                    <Clock className="h-5 w-5 text-gray-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {tx.type === 'purchase' ? `Purchased ${tx.credits} credits` : tx.description}
                  </p>
                  <p className="text-xs text-gray-500">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${
                  tx.type === 'purchase' ? 'text-green-600' : 'text-gray-900'
                }`}>
                  {tx.type === 'purchase' ? `+${tx.credits}` : tx.amount} credits
                </p>
                <div className="flex items-center gap-1 justify-end">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span className="text-xs text-gray-500">Completed</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
