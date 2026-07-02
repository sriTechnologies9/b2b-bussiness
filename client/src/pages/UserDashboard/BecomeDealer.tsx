import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../api/client';
import { Store, Send, CheckCircle, Clock, AlertTriangle, Copy, Check, Loader2, Lock } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface DealerRequest {
  id: string;
  businessName: string;
  categoryName: string;
  contactEmail: string;
  contactPhone: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  generatedEmail?: string;
  generatedPass?: string;
  createdAt: string;
}

export const BecomeDealer: React.FC = () => {
  const { token } = useAuth();
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [request, setRequest] = useState<DealerRequest | null>(null);
  
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [bizName, setBizName] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // Copy feedback states
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);

  const fetchRequestStatus = async () => {
    if (!token) return;
    try {
      const data = await apiClient.get('/auth/dealer-request');
      if (data && data.success) {
        setRequest(data.request);
      }
    } catch (err) {
      console.error('Failed to load request status:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const data = await apiClient.get('/businesses/categories');
      if (data) {
        setCategories(data);
        if (data.length > 0) {
          setSelectedCat(data[0].name);
        }
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    } finally {
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestStatus();
    fetchCategories();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setSubmitting(true);

    if (!bizName || !selectedCat || !contactEmail || !contactPhone) {
      setError('All fields are required.');
      setSubmitting(false);
      return;
    }

    try {
      const data = await apiClient.post('/auth/become-dealer', {
        businessName: bizName,
        categoryName: selectedCat,
        contactEmail,
        contactPhone
      });

      setSuccessMsg('Your dealer onboarding request has been submitted successfully.');
      setRequest(data.request);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetRequest = () => {
    setRequest(null);
    setBizName('');
    setContactEmail('');
    setContactPhone('');
    setError('');
    setSuccessMsg('');
  };

  const copyToClipboard = (text: string, type: 'email' | 'pass') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4 text-left">
        <Loader2 className="w-10 h-10 animate-spin text-brand-600" />
        <p className="text-sm text-slate-500 font-semibold">Checking onboarding status...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left max-w-4xl">
      <div className="text-left">
        <h1 className="text-2xl font-extrabold text-slate-900">Become a B2B Merchant</h1>
        <p className="text-xs text-slate-500 mt-1">Upgrade to a dealer account to list services, manage catalogs, score client leads, and view the RFQ bidding board.</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-655 text-xs font-semibold">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-250 text-emerald-705 text-xs font-semibold">
          {successMsg}
        </div>
      )}

      {/* Case 1: Active Pending Request */}
      {request && request.status === 'PENDING' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 space-y-6 shadow-glass-sm text-left">
          <div className="flex items-center space-x-3.5 border-b border-slate-100 pb-4">
            <div className="w-12 h-12 bg-amber-50 border border-amber-205 rounded-xl flex items-center justify-center text-amber-550 shrink-0">
              <Clock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Request Pending Approval</h3>
              <p className="text-2xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Admin Review in progress</p>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            Your request to become a dealer for <b className="text-slate-800">"{request.businessName}"</b> is currently under review by our administration. Once approved, your login ID and password will be generated here.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Target Category</span>
              <p className="text-xs font-extrabold text-slate-700">{request.categoryName}</p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Contact Number</span>
              <p className="text-xs font-extrabold text-slate-700">{request.contactPhone}</p>
            </div>
          </div>
        </div>
      )}

      {/* Case 2: Request Approved & Credentials Issued */}
      {request && request.status === 'APPROVED' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 space-y-6 shadow-glass-sm text-left">
          <div className="flex items-center space-x-3.5 border-b border-slate-100 pb-4">
            <div className="w-12 h-12 bg-emerald-50 border border-emerald-250 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Onboarding Approved!</h3>
              <p className="text-2xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Merchant Portal Access Active</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Congratulations! Your request has been approved. A new secure Business Owner account has been generated for you with our dealer domain.
            </p>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-inner space-y-4 max-w-lg">
              <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-brand-600" />
                <span>Dealer Login Credentials</span>
              </h4>

              <div className="space-y-3.5">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Generated Login Email</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={request.generatedEmail || ''}
                      className="flex-1 bg-white border border-slate-250 px-3 py-1.5 text-xs font-bold text-slate-700 rounded-lg focus:outline-none"
                    />
                    <button
                      onClick={() => copyToClipboard(request.generatedEmail || '', 'email')}
                      className="p-2 border border-slate-250 bg-white hover:bg-slate-50 text-slate-500 rounded-lg transition-colors"
                      title="Copy Email"
                    >
                      {copiedEmail ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Assigned Password</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={request.generatedPass || ''}
                      className="flex-1 bg-white border border-slate-250 px-3 py-1.5 text-xs font-bold text-slate-700 rounded-lg focus:outline-none"
                    />
                    <button
                      onClick={() => copyToClipboard(request.generatedPass || '', 'pass')}
                      className="p-2 border border-slate-250 bg-white hover:bg-slate-50 text-slate-500 rounded-lg transition-colors"
                      title="Copy Password"
                    >
                      {copiedPass ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-indigo-50/50 border border-indigo-150 p-4 rounded-xl space-y-2 text-xs text-indigo-805 leading-relaxed font-semibold">
              <span className="font-extrabold uppercase text-[10px] tracking-wider text-indigo-650 block">Next Steps:</span>
              <p>
                1. Copy your generated login email and password above.<br />
                2. Log out of your current Customer profile.<br />
                3. Go to the **Seller Login** page and authenticate using these credentials to manage your store.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Case 3: Request Rejected */}
      {request && request.status === 'REJECTED' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 space-y-6 shadow-glass-sm text-left">
          <div className="flex items-center space-x-3.5 border-b border-slate-100 pb-4">
            <div className="w-12 h-12 bg-red-50 border border-red-200 rounded-xl flex items-center justify-center text-red-500 shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Request Disapproved</h3>
              <p className="text-2xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Dealer validation failed</p>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed font-semibold">
            We regret to inform you that your request to become a dealer for <b className="text-slate-800">"{request.businessName}"</b> was not approved. This can happen if the business details provided did not meet our verification standards.
          </p>

          <button
            onClick={handleResetRequest}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white rounded-xl shadow-md transition-colors"
          >
            <span>Submit a New Request</span>
          </button>
        </div>
      )}

      {/* Case 4: No Request - Show Form */}
      {!request && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-glass-sm text-left">
          <div className="flex items-center space-x-3 border-b border-slate-100 pb-4 mb-6">
            <div className="w-10 h-10 bg-brand-50 border border-brand-200 rounded-xl flex items-center justify-center text-brand-600 shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Merchant Application Form</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-1.5">Business Name</label>
                <input
                  type="text"
                  required
                  value={bizName}
                  onChange={(e) => setBizName(e.target.value)}
                  placeholder="e.g. RK Electricians"
                  className="w-full rounded-xl px-3 py-2 text-xs border border-slate-250 bg-slate-50/30 font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-455 mb-1.5">Directory Category</label>
                {categoriesLoading ? (
                  <div className="w-full h-8 flex items-center px-3 border border-slate-200 bg-slate-50 text-xs text-slate-405 font-bold rounded-xl animate-pulse">
                    Loading directory categories...
                  </div>
                ) : (
                  <>
                    <input
                      list="categories-datalist"
                      type="text"
                      required
                      value={selectedCat}
                      onChange={(e) => setSelectedCat(e.target.value)}
                      placeholder="e.g. Electricians, Cleaning..."
                      className="w-full rounded-xl px-3 py-2 text-xs border border-slate-250 bg-white font-bold focus:outline-none"
                    />
                    <datalist id="categories-datalist">
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name} />
                      ))}
                    </datalist>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-1.5">Contact Email</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="e.g. contact@business.com"
                  className="w-full rounded-xl px-3 py-2 text-xs border border-slate-250 bg-slate-50/30 font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-450 mb-1.5">Contact Phone / WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full rounded-xl px-3 py-2 text-xs border border-slate-250 bg-slate-50/30 font-bold focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={submitting || categoriesLoading}
                className="inline-flex items-center space-x-1.5 px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white rounded-xl shadow-md transition-colors disabled:opacity-55"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Submit Merchant Application</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
