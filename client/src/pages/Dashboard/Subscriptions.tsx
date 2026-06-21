import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Check, Loader2, CreditCard, ShieldCheck } from 'lucide-react';

const PLANS = [
  {
    id: 'FREE',
    name: 'Free Starter',
    price: '₹0',
    frequency: 'forever',
    features: [
      'List 1 Local Business Profile',
      'Receive Standard Customer Leads',
      'Basic Working Hours Editor',
      '1 Category Listing'
    ],
    buttonText: 'Current Plan',
    color: 'border-slate-200'
  },
  {
    id: 'BASIC',
    name: 'Basic Growth',
    price: '₹499',
    frequency: 'month',
    features: [
      'List 1 Local Business Profile',
      'Receive Priority Customer Leads',
      'Detailed Description Editor',
      'AI Lead Scorer (Basic Analysis)',
      'WhatsApp Integration Quick-link'
    ],
    buttonText: 'Upgrade to Basic',
    color: 'border-slate-200'
  },
  {
    id: 'PRO',
    name: 'Pro Marketplace',
    price: '₹999',
    frequency: 'month',
    features: [
      'List Up to 3 Business Profiles',
      'Instant Hot/Cold AI Lead Scoring',
      'AI Description & SEO Copy Generators',
      'Verified Profile Status Badge',
      'Priority Support Ticketing'
    ],
    buttonText: 'Upgrade to Pro',
    color: 'border-brand-500 shadow-glass shadow-brand-500/5'
  },
  {
    id: 'PREMIUM',
    name: 'Premium Enterprise',
    price: '₹1,999',
    frequency: 'month',
    features: [
      'List Unlimited Business Profiles',
      'Dedicated SMS & WhatsApp Lead Alerts',
      'Full SEO Analytics & Page Rank Tracker',
      'Featured Top placement in Search Results',
      '24/7 Phone Technical Support'
    ],
    buttonText: 'Upgrade to Premium',
    color: 'border-slate-200'
  }
];

export const Subscriptions: React.FC = () => {
  const { token, user, updateUser } = useAuth();
  
  const [selectedPlan, setSelectedPlan] = useState<any | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [paymentForm, setPaymentForm] = useState({
    cardNumber: '4111 2222 3333 4444',
    expiry: '12/29',
    cvv: '123'
  });

  const activePlan = user?.subscription?.plan || 'FREE';

  const handleUpgradeClick = (plan: any) => {
    if (plan.id === activePlan) return;
    setSelectedPlan(plan);
    setCheckoutOpen(true);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const res = await fetch('/api/subscriptions/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan: selectedPlan.id })
      });
      const data = await res.json();
      
      if (res.ok) {
        // Upgrade locally in context
        if (user) {
          updateUser({
            ...user,
            subscription: data.subscription
          });
        }
        setCheckoutOpen(false);
        alert(`Plan successfully upgraded to ${selectedPlan.name}!`);
      } else {
        alert(data.error || 'Failed to upgrade plan');
      }
    } catch (err) {
      console.error(err);
      alert('Checkout error. Try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">SaaS Subscriptions</h1>
        <p className="text-xs text-slate-500 mt-1">Upgrade your subscription plan to unlock priority leads and AI generators.</p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">
        {PLANS.map((plan) => {
          const isActive = plan.id === activePlan;
          
          return (
            <div key={plan.id} className={`rounded-2xl glass-panel border p-5 flex flex-col justify-between space-y-6 ${plan.color} relative`}>
              {isActive && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 border border-brand-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-md">
                  ACTIVE PLAN
                </span>
              )}

              {/* Header */}
              <div className="space-y-2 text-center pt-2">
                <h3 className="font-bold text-slate-800 text-md">{plan.name}</h3>
                <div className="flex justify-center items-baseline space-x-1 text-slate-900">
                  <span className="text-2xl md:text-3xl font-extrabold">{plan.price}</span>
                  <span className="text-xs text-slate-500">/ {plan.frequency}</span>
                </div>
              </div>

              <hr className="border-slate-150" />

              {/* Features List */}
              <ul className="space-y-2 flex-grow">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-2 text-slate-650 text-xs leading-normal">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Upgrade Trigger */}
              <button
                onClick={() => handleUpgradeClick(plan)}
                disabled={isActive}
                className={`w-full py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-default' 
                    : plan.id === 'PRO'
                    ? 'bg-brand-600 hover:bg-brand-500 text-white hover:shadow-lg hover:shadow-brand-500/10'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-750 border border-slate-200'
                }`}
              >
                {isActive ? 'Current Plan' : plan.buttonText}
              </button>
            </div>
          );
        })}
      </div>

      {/* Checkout Simulator Modal */}
      {checkoutOpen && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setCheckoutOpen(false)}></div>

          <div className="relative w-full max-w-md bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xl z-10 space-y-4 text-slate-900">
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-brand-500" />
              <span>Checkout Simulator</span>
            </h2>
            <p className="text-xs text-slate-500">
              Upgrade to <b>{selectedPlan.name}</b>. Recurring charge of <b>{selectedPlan.price}/month</b>.
            </p>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div>
                <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Dummy Card Number</label>
                <input
                  type="text"
                  required
                  value={paymentForm.cardNumber}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, cardNumber: e.target.value }))}
                  className="w-full rounded-lg px-3 py-2 text-xs glass-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Expiration Date</label>
                  <input
                    type="text"
                    required
                    value={paymentForm.expiry}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, expiry: e.target.value }))}
                    className="w-full rounded-lg px-3 py-2 text-xs glass-input"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-semibold uppercase tracking-wider text-slate-500 mb-1">CVV Code</label>
                  <input
                    type="password"
                    required
                    value={paymentForm.cvv}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, cvv: e.target.value }))}
                    className="w-full rounded-lg px-3 py-2 text-xs glass-input"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 p-2 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-lg text-2xs leading-normal">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Sandbox payment active. Press submit to upgrade instantly.</span>
              </div>

              <div className="flex justify-end space-x-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setCheckoutOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-semibold rounded-lg text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center space-x-1 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-xs font-semibold rounded-lg text-white"
                >
                  {processing ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
                  <span>Submit Payment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default Subscriptions;
