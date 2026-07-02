import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Send, IndianRupee, Loader2, X, Sparkles } from 'lucide-react';
import { apiClient } from '../../api/client';

export const RfqMarket: React.FC = () => {
  const { token } = useAuth();
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [cityFilter, setCityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Proposal Submission States
  const [selectedRfq, setSelectedRfq] = useState<any | null>(null);
  const [businessId, setBusinessId] = useState('');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchMarketRfqs = async (pageNum = 1) => {
    if (!token) return;
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const data = await apiClient.get(`/rfqs/market?page=${pageNum}&limit=20`);
      if (pageNum === 1) {
        setRfqs(data);
      } else {
        setRfqs(prev => [...prev, ...data]);
      }
      setHasMore(data.length === 20);
    } catch (err) {
      console.error(err);
    } finally {
      if (pageNum === 1) setLoading(false);
      else setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMarketRfqs(nextPage);
  };

  const fetchMyBusinesses = async () => {
    if (!token) return;
    try {
      const data = await apiClient.get('/businesses/my-listings');
      setBusinesses(data);
      if (data.length > 0) {
        setBusinessId(data[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await apiClient.get('/businesses/categories');
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchMarketRfqs(1);
    fetchMyBusinesses();
    fetchCategories();
  }, [token]);

  useEffect(() => {
    if (selectedRfq && businesses.length > 0) {
      const matching = businesses.find(b => b.categoryId === selectedRfq.categoryId);
      if (matching) {
        setBusinessId(matching.id);
      }
    }
  }, [selectedRfq, businesses]);

  const generateAIPitch = () => {
    if (!businessId) {
      alert("Please select a listing to quote from first.");
      return;
    }
    const currentBiz = businesses.find(b => b.id === businessId);
    const bizName = currentBiz ? currentBiz.name : "our business";
    
    const templates = [
      `We at ${bizName} would love to assist with your requirement. We have extensive experience in this domain and can execute it promptly in ${selectedRfq?.city || 'your city'} within your expectations.`,
      `Hello! ${bizName} is ready to handle your plumbing/installation request. We use high-quality PVC and brand fittings, offer a 1-year service warranty, and can schedule the visit as soon as you accept.`,
      `Greetings, we can provide high-definition security setups for your CCTV requirement. ${bizName} is a verified provider in ${selectedRfq?.city || 'your city'} with a 5-star service record.`
    ];
    
    // Pick template based on category name
    let pitch = templates[0];
    const catName = selectedRfq?.category?.name?.toLowerCase() || '';
    if (catName.includes('plumb') || catName.includes('wrench')) {
      pitch = templates[1];
    } else if (catName.includes('cctv') || catName.includes('camera') || catName.includes('security')) {
      pitch = templates[2];
    }
    
    setMessage(pitch);
  };

  const handleProposalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);

    try {
      await apiClient.post(`/rfqs/${selectedRfq.id}/proposals`, {
        businessId,
        price: parseFloat(price),
        message
      });

      // Refresh list, close modal, clean form
      setSelectedRfq(null);
      setPrice('');
      setMessage('');
      setPage(1);
      fetchMarketRfqs(1);
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">RFQ Leads Marketplace</h1>
        <p className="text-xs text-slate-500 mt-1">Review public RFQ postings from customers matching your business categories and submit bids.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-slate-50/50 border border-slate-200 rounded-2xl">
        <div className="flex-1">
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Filter by Target City</label>
          <input
            type="text"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            placeholder="Search city... (e.g. Hyderabad)"
            className="w-full rounded-xl px-3 py-2 text-xs glass-input font-bold"
          />
        </div>
        <div className="w-full sm:w-48">
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Filter by Category</label>
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full rounded-xl px-3 py-2 text-xs glass-input font-bold appearance-none bg-white pr-8"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              ▼
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {rfqs.filter(rfq => {
          const matchesCity = cityFilter === '' || rfq.city.toLowerCase().includes(cityFilter.toLowerCase());
          const matchesCategory = categoryFilter === 'ALL' || rfq.categoryId === categoryFilter;
          return matchesCity && matchesCategory;
        }).length > 0 ? (
          rfqs
            .filter(rfq => {
              const matchesCity = cityFilter === '' || rfq.city.toLowerCase().includes(cityFilter.toLowerCase());
              const matchesCategory = categoryFilter === 'ALL' || rfq.categoryId === categoryFilter;
              return matchesCity && matchesCategory;
            })
            .map((rfq) => {
            const hasBid = rfq.proposals && rfq.proposals.length > 0;
            const myBid = hasBid ? rfq.proposals[0] : null;

            return (
              <div key={rfq.id} className="rounded-2xl glass-panel border border-slate-200 p-5 space-y-4 relative overflow-hidden">
                {hasBid && (
                  <div className="absolute top-0 right-0 bg-brand-50 border-b border-l border-brand-100 text-brand-700 text-[9px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                    Quote Submitted
                  </div>
                )}

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-900 text-md">
                      {rfq.title}
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1 items-center text-[10px] text-slate-500">
                      <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium text-slate-600 uppercase">{rfq.category?.name}</span>
                      <span>•</span>
                      <span>Target City: <b>{rfq.city}</b></span>
                      <span>•</span>
                      <span>Posted by: {rfq.customer?.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0 pt-2 md:pt-0">
                    {rfq.budget && (
                      <span className="text-xs font-bold bg-amber-50 border border-amber-200 text-amber-650 px-2.5 py-1 rounded-md flex items-center">
                        <IndianRupee className="w-3.5 h-3.5 mr-0.5" /> Budget: {rfq.budget.toLocaleString()}
                      </span>
                    )}

                    {!hasBid ? (
                      <button
                        onClick={() => {
                          setSubmitError('');
                          setSelectedRfq(rfq);
                        }}
                        className="inline-flex items-center space-x-1 px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 transition-all shadow-md shadow-brand-600/10"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Quote</span>
                      </button>
                    ) : (
                      <span className="text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-650 px-2.5 py-1 rounded-md">
                        Your Bid: ₹{myBid.price.toLocaleString()} ({myBid.status})
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 font-sans">Customer Requirement Description</span>
                  <p className="text-sm text-slate-650 leading-relaxed font-medium">"{rfq.message}"</p>
                </div>

                {hasBid && myBid && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1 text-xs text-slate-600">
                    <span className="text-[9px] uppercase font-bold text-slate-400">Your Quote Pitch Message</span>
                    <p className="italic leading-normal text-slate-650 font-medium">"{myBid.message}"</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 border border-dashed border-slate-300 rounded-2xl text-slate-500 text-sm">
            No active RFQ leads match your business category in the market currently. Ensure your category tags are updated!
          </div>
        )}
        
        {hasMore && (
          <div className="flex justify-center pt-4">
            <button
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="inline-flex items-center px-6 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-sm font-bold text-slate-700 shadow-sm transition-colors disabled:opacity-50"
            >
              {loadingMore && <Loader2 className="w-4 h-4 mr-2 animate-spin text-slate-400" />}
              Load More RFQs
            </button>
          </div>
        )}
      </div>

      {/* Quote Submission Modal Overlay */}
      {selectedRfq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedRfq(null)}></div>

          <div className="relative w-full max-w-lg bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xl z-10 overflow-hidden text-slate-900">
            <div className="absolute top-0 right-0 p-4">
              <button onClick={() => setSelectedRfq(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-1">Submit B2B Quotation</h2>
            <p className="text-sm text-slate-500 mb-6">
              Pitch your service and price estimation to <b>{selectedRfq.customer?.name}</b> for their requirement.
            </p>

            {submitError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-650 text-xs">
                {submitError}
              </div>
            )}

            {selectedRfq && selectedRfq.budget && (
              <div className="mb-4 p-3 bg-violet-50/50 border border-violet-200/80 rounded-xl space-y-1 text-xs text-slate-700 text-left">
                <div className="font-extrabold text-violet-900 flex items-center space-x-1.5 uppercase tracking-wide text-[9px]">
                  <Sparkles className="w-3.5 h-3.5 text-violet-600 animate-pulse animate-duration-1000" />
                  <span>AI Bidding Assistant Recommendation</span>
                </div>
                <p className="text-2xs text-slate-500 leading-normal">
                  Based on the customer's budget of <span className="font-bold text-slate-800">₹{selectedRfq.budget.toLocaleString()}</span>, we recommend bidding between <span className="font-bold text-emerald-600">₹{Math.round(selectedRfq.budget * 0.85).toLocaleString()}</span> and <span className="font-bold text-emerald-650">₹{Math.round(selectedRfq.budget * 0.95).toLocaleString()}</span> to maximize your conversion score!
                </p>
              </div>
            )}

            <form onSubmit={handleProposalSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-550 mb-1">Quote from Listing</label>
                  <select
                    required
                    value={businessId}
                    onChange={(e) => setBusinessId(e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-sm glass-input appearance-none"
                  >
                    {businesses
                      .filter(b => b.categoryId === selectedRfq.categoryId)
                      .map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-550 mb-1">Est. Price Bid (₹)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 28000"
                    className="w-full rounded-lg px-3 py-2 text-sm glass-input"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-550">Pitch Message (Proposal)</label>
                  <button
                    type="button"
                    onClick={generateAIPitch}
                    className="inline-flex items-center space-x-1 text-2xs font-bold text-violet-600 hover:text-violet-750"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                    <span>Auto-Write Pitch</span>
                  </button>
                </div>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your solution, availability, warranties, and why the customer should choose your business..."
                  className="w-full rounded-lg px-3 py-2 text-sm glass-input resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedRfq(null)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-sm font-semibold rounded-lg text-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-sm font-semibold rounded-lg text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-600/10 transition-all disabled:opacity-55"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4" />}
                  <span>Submit Proposal Bid</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default RfqMarket;
