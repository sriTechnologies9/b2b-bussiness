import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, 
  CheckCircle, 
  Send, 
  MessageSquare, 
  IndianRupee, 
  Loader2, 
  X, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone,
  HelpCircle,
  Utensils,
  Zap,
  Droplet,
  Camera,
  Activity,
  Scissors,
  Home as HomeIcon,
  ShoppingBag,
  Heart,
  Trash2
} from 'lucide-react';

export const UserRfqs: React.FC = () => {
  const { token } = useAuth();
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPostOpen, setIsPostOpen] = useState(false);

  // Form State
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [budget, setBudget] = useState('');
  const [city, setCity] = useState('');
  const [postError, setPostError] = useState('');
  const [submittingPost, setSubmittingPost] = useState(false);
  const [expandedRfq, setExpandedRfq] = useState<string | null>(null);

  const fetchRfqs = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/rfqs/my-rfqs', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRfqs(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/businesses/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRfqs();
    fetchCategories();
  }, [token]);

  const handlePostRfq = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostError('');
    setSubmittingPost(true);

    try {
      const res = await fetch('/api/rfqs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          categoryId,
          title,
          message,
          budget: budget ? parseFloat(budget) : null,
          city
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to post RFQ');
      }

      setIsPostOpen(false);
      setCategoryId('');
      setTitle('');
      setMessage('');
      setBudget('');
      setCity('');
      fetchRfqs();
    } catch (err: any) {
      setPostError(err.message);
    } finally {
      setSubmittingPost(false);
    }
  };

  const handleDeleteRfq = async (rfqId: string) => {
    if (!window.confirm('Are you sure you want to delete this RFQ? This action cannot be undone and will delete all received proposals.')) return;
    try {
      const res = await fetch(`/api/rfqs/${rfqId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setRfqs(rfqs.filter(r => r.id !== rfqId));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete RFQ');
      }
    } catch (err) {
      console.error(err);
      alert('Error occurred while deleting RFQ');
    }
  };

  const handleAcceptProposal = async (proposalId: string) => {
    if (!window.confirm('Are you sure you want to accept this quote? This will close the RFQ and decline all other quotes.')) return;
    try {
      const res = await fetch(`/api/rfqs/proposals/${proposalId}/accept`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        fetchRfqs();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to accept proposal');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Helper to map category slugs to Lucide icons dynamically
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'restaurants':
        return { icon: Utensils, color: 'bg-amber-50 text-amber-600 border-amber-200' };
      case 'electricians':
        return { icon: Zap, color: 'bg-indigo-50 text-indigo-600 border-indigo-200' };
      case 'plumbers':
        return { icon: Droplet, color: 'bg-cyan-50 text-cyan-600 border-cyan-200' };
      case 'clinics':
        return { icon: Activity, color: 'bg-red-50 text-red-600 border-red-200' };
      case 'gyms':
        return { icon: Heart, color: 'bg-rose-50 text-rose-600 border-rose-200' };
      case 'salons':
        return { icon: Scissors, color: 'bg-pink-50 text-pink-600 border-pink-200' };
      case 'cctv-shops':
        return { icon: Camera, color: 'bg-purple-50 text-purple-600 border-purple-200' };
      case 'real-estate':
        return { icon: HomeIcon, color: 'bg-blue-50 text-blue-600 border-blue-200' };
      case 'retail-stores':
        return { icon: ShoppingBag, color: 'bg-emerald-50 text-emerald-600 border-emerald-200' };
      default:
        return { icon: HelpCircle, color: 'bg-slate-100 text-slate-600 border-slate-200' };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-650 font-extrabold text-[10px] uppercase tracking-widest mb-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Procurement RFQs & Quotes</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My RFQs & Bids</h1>
          <p className="text-xs text-slate-500 mt-1">Submit general service requirements and receive competitive proposal bids from matching local dealers.</p>
        </div>

        <button
          onClick={() => {
            setPostError('');
            setIsPostOpen(true);
          }}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-500/10 shadow-md shadow-brand-600/10 transition-all shrink-0"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Post New RFQ</span>
        </button>
      </div>

      <div className="space-y-6">
        {rfqs.length > 0 ? (
          rfqs.map((rfq) => {
            const hasBids = rfq.proposals && rfq.proposals.length > 0;
            const isClosed = rfq.status === 'CLOSED';
            const catStyle = getCategoryIcon(rfq.category?.slug || '');
            const IconComponent = catStyle.icon;

            return (
              <div key={rfq.id} className="rounded-3xl bg-white border border-slate-200 p-5 md:p-6 space-y-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-3.5">
                    {/* Category Icon */}
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-300 ${catStyle.color}`}>
                      <IconComponent className="w-5.5 h-5.5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm sm:text-md tracking-tight">
                        {rfq.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-1 items-center text-[10px] text-slate-400 font-medium">
                        <span className="bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-md font-semibold text-slate-500 uppercase tracking-wide">
                          {rfq.category?.name}
                        </span>
                        <span>•</span>
                        <span className="flex items-center">
                          <MapPin className="w-3.5 h-3.5 mr-0.5 text-slate-400" />
                          City: <b className="text-slate-700 ml-0.5">{rfq.city}</b>
                        </span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-0.5 text-slate-400" />
                          Posted {new Date(rfq.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto justify-end">
                    {/* Budget Badge */}
                    {rfq.budget && (
                      <span className="text-[10px] sm:text-xs font-black bg-amber-50/70 border border-amber-200 text-amber-650 px-3 py-1.5 rounded-xl flex items-center shadow-2xs">
                        <IndianRupee className="w-3.5 h-3.5 mr-0.5" /> Est. Budget: {rfq.budget.toLocaleString()}
                      </span>
                    )}

                    {/* Status Pill */}
                    <span className={`text-[10px] sm:text-xs font-extrabold px-3 py-1.5 rounded-xl border tracking-wide uppercase ${
                      isClosed 
                        ? 'bg-slate-50 border-slate-200 text-slate-400' 
                        : 'bg-indigo-50 border-indigo-200 text-indigo-650'
                    }`}>
                      {rfq.status}
                    </span>

                    {/* Delete button */}
                    <button
                      onClick={() => handleDeleteRfq(rfq.id)}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-slate-200 hover:border-rose-200 transition-colors shadow-2xs bg-white"
                      title="Delete RFQ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Step Tracker */}
                <div className="py-3 bg-slate-50/50 rounded-2xl border border-slate-100 p-4 max-w-xl mx-auto">
                  <div className="relative flex justify-between items-center max-w-md mx-auto">
                    {/* Progress Background Bar */}
                    <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 bg-slate-200/60 h-1 rounded-full z-0">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 bg-brand-500`}
                        style={{ 
                          width: isClosed ? '100%' : hasBids ? '50%' : '0%' 
                        }}
                      ></div>
                    </div>

                    {/* Step 1: Posted */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center text-[10px] font-bold shadow-sm border-2 border-white ring-2 ring-brand-100/50">
                        ✓
                      </div>
                      <span className="text-[9px] font-extrabold text-slate-700 mt-1.5 uppercase tracking-wider">Posted</span>
                    </div>

                    {/* Step 2: Bids Received */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm border-2 border-white transition-all ${
                        hasBids || isClosed ? 'bg-brand-600 text-white ring-2 ring-brand-100/50' : 'bg-white border border-slate-300 text-slate-400'
                      }`}>
                        {hasBids || isClosed ? '✓' : '2'}
                      </div>
                      <span className={`text-[9px] font-extrabold mt-1.5 uppercase tracking-wider ${
                        hasBids || isClosed ? 'text-slate-700' : 'text-slate-455'
                      }`}>Bids Open</span>
                    </div>

                    {/* Step 3: Accepted */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm border-2 border-white transition-all ${
                        isClosed ? 'bg-brand-600 text-white ring-2 ring-brand-100/50' : 'bg-white border border-slate-300 text-slate-400'
                      }`}>
                        {isClosed ? '✓' : '3'}
                      </div>
                      <span className={`text-[9px] font-extrabold mt-1.5 uppercase tracking-wider ${
                        isClosed ? 'text-slate-700' : 'text-slate-455'
                      }`}>Accepted</span>
                    </div>
                  </div>
                </div>

                {/* Description details */}
                <div className="space-y-1.5 bg-slate-50 border border-slate-150 rounded-2xl p-4">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Requirement Details</span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium italic">"{rfq.message}"</p>
                </div>

                {/* Toggle Quotes Action Button */}
                <div className="pt-1">
                  <button
                    onClick={() => setExpandedRfq(expandedRfq === rfq.id ? null : rfq.id)}
                    className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-750 transition-colors bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl shadow-2xs"
                  >
                    <MessageSquare className="w-4 h-4 mr-0.5" />
                    <span>{rfq.proposals?.length || 0} Quotes Received {expandedRfq === rfq.id ? '▲' : '▼'}</span>
                  </button>

                  {/* Expanded Bids Section */}
                  {expandedRfq === rfq.id && (
                    <div className="mt-4 pt-5 border-t border-slate-100 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200 text-left">
                      {/* Financial Bid Analytics */}
                      {rfq.proposals && rfq.proposals.length > 0 && (
                        <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 border border-slate-150 rounded-2xl">
                          <div className="text-center p-3 rounded-xl bg-white border border-slate-200/60 shadow-2xs">
                            <div className="text-[8px] sm:text-[9px] uppercase font-extrabold text-slate-400 tracking-wider">Lowest Quote</div>
                            <div className="text-xs sm:text-sm font-black text-emerald-650 mt-1 flex items-center justify-center">
                              <IndianRupee className="w-3.5 h-3.5 mr-0.5 shrink-0 text-emerald-555" />
                              <span>{Math.min(...rfq.proposals.map((p: any) => p.price)).toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="text-center p-3 rounded-xl bg-white border border-slate-200/60 shadow-2xs">
                            <div className="text-[8px] sm:text-[9px] uppercase font-extrabold text-slate-400 tracking-wider">Average Quote</div>
                            <div className="text-xs sm:text-sm font-black text-indigo-655 mt-1 flex items-center justify-center">
                              <IndianRupee className="w-3.5 h-3.5 mr-0.5 shrink-0 text-indigo-555" />
                              <span>{Math.round(rfq.proposals.reduce((sum: number, p: any) => sum + p.price, 0) / rfq.proposals.length).toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="text-center p-3 rounded-xl bg-white border border-slate-200/60 shadow-2xs">
                            <div className="text-[8px] sm:text-[9px] uppercase font-extrabold text-slate-400 tracking-wider">Total Bids</div>
                            <div className="text-xs sm:text-sm font-black text-slate-700 mt-1">
                              {rfq.proposals.length}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Proposals List */}
                      <div className="space-y-4">
                        {rfq.proposals && rfq.proposals.length > 0 ? (
                          rfq.proposals.map((prop: any) => (
                            <div key={prop.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/15 space-y-4 text-left transition-all hover:bg-slate-50/35 duration-200 relative overflow-hidden">
                              {prop.status === 'ACCEPTED' && (
                                <div className="absolute top-0 right-0 bg-emerald-500 text-white font-extrabold text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-bl-xl shadow-xs">
                                  Selected Offer
                                </div>
                              )}
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-slate-100/80">
                                <div>
                                  <h4 className="font-bold text-slate-900 text-sm">{prop.business?.name}</h4>
                                  <span className="text-[10px] text-slate-400 mt-0.5 block">Bid submitted: {new Date(prop.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center space-x-2.5 shrink-0">
                                  <span className="text-sm sm:text-md font-black text-slate-850 flex items-center">
                                    <IndianRupee className="w-3.5 h-3.5 mr-0.5 text-slate-500" /> {prop.price.toLocaleString()}
                                  </span>
                                  {prop.status === 'ACCEPTED' ? (
                                    <span className="inline-flex items-center text-[10px] font-extrabold text-emerald-650 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                                      <CheckCircle className="w-3.5 h-3.5 mr-1" /> Accepted
                                    </span>
                                  ) : rfq.status === 'OPEN' ? (
                                    <button
                                      onClick={() => handleAcceptProposal(prop.id)}
                                      className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-bold shadow-md shadow-brand-600/10 transition-all"
                                    >
                                      Accept Quote
                                    </button>
                                  ) : (
                                    <span className="text-2xs font-bold text-slate-400 bg-slate-105 px-2 py-0.5 rounded-md border border-slate-200/50 uppercase">
                                      {prop.status}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="space-y-1">
                                <span className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider">Dealer Proposal Pitch</span>
                                <p className="text-xs text-slate-600 leading-relaxed italic">"{prop.message}"</p>
                              </div>

                              {/* Accepted details card */}
                              {prop.status === 'ACCEPTED' && (
                                <div className="p-4 bg-gradient-to-br from-amber-500/[0.04] via-yellow-500/[0.02] to-amber-600/[0.04] border border-amber-200 rounded-2xl space-y-3 text-xs text-slate-750 relative overflow-hidden shadow-sm">
                                  <div className="absolute -right-3 -bottom-3 w-16 h-16 bg-amber-500/10 rounded-full blur-[10px] pointer-events-none"></div>
                                  <div className="font-extrabold text-amber-900 flex items-center space-x-1.5 uppercase tracking-wider text-[10px] border-b border-amber-200/50 pb-1.5">
                                    <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                                    <span>Verified Partner Contact Information</span>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                                    <div className="bg-white p-3 rounded-xl border border-slate-150 text-left flex items-center space-x-2.5">
                                      <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                                      <div className="min-w-0">
                                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Email Address</span>
                                        <a href={`mailto:${prop.business?.email}`} className="font-extrabold text-indigo-655 hover:underline text-xs truncate block">{prop.business?.email}</a>
                                      </div>
                                    </div>
                                    <div className="bg-white p-3 rounded-xl border border-slate-150 text-left flex items-center space-x-2.5">
                                      <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                                      <div className="min-w-0">
                                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Phone / WhatsApp</span>
                                        <a href={`https://wa.me/${prop.business?.phone?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="font-extrabold text-emerald-650 hover:underline text-xs truncate block">
                                          {prop.business?.phone}
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-slate-400 text-xs italic bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
                            No bids received yet. Registered local dealers matching your category will review requirements and submit quotes shortly.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 border border-dashed border-slate-200 rounded-3xl text-slate-500 text-sm bg-white shadow-sm flex flex-col items-center justify-center p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800">No Posted Requirements</h3>
              <p className="text-xs text-slate-500">You have not posted any RFQ bids yet. Click "Post New RFQ" to receive competitive quotes.</p>
            </div>
          </div>
        )}
      </div>

      {/* Post RFQ Dialog Overlay */}
      {isPostOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsPostOpen(false)}></div>

          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl z-10 overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-200 text-left">
            <div className="absolute top-0 right-0 p-4">
              <button onClick={() => setIsPostOpen(false)} className="text-slate-400 hover:text-slate-655 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">Post General Requirement</h2>
            <p className="text-xs text-slate-500 mb-6 font-medium">
              Post an RFQ to get matched with and receive quotes from all relevant local businesses in your target city.
            </p>

            {postError && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-650 text-xs font-semibold">
                {postError}
              </div>
            )}

            <form onSubmit={handlePostRfq} className="space-y-4">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-450 mb-1.5">Service Category</label>
                <div className="relative">
                  <select
                    required
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full rounded-xl px-3.5 py-2.5 text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white font-bold appearance-none cursor-pointer"
                  >
                    <option value="">Select Category...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-400">
                    ▼
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-450 mb-1.5">Target City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Hyderabad"
                    className="w-full rounded-xl px-3.5 py-2.5 text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-450 mb-1.5">Estimated Budget (Optional)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g. 15000"
                    className="w-full rounded-xl px-3.5 py-2.5 text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-450 mb-1.5">Requirement Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Need CCTV installation for retail store"
                  className="w-full rounded-xl px-3.5 py-2.5 text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-450 mb-1.5">Detailed Description</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Describe your requirements (brands preferred, dimensions, urgency)..."
                  className="w-full rounded-xl px-3.5 py-2.5 text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none font-medium"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPostOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-xs font-bold rounded-xl text-slate-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingPost}
                  className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/10 transition-all disabled:opacity-55"
                >
                  {submittingPost ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Send className="w-4 h-4 mr-1.5" />}
                  <span>Post RFQ Requirement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default UserRfqs;
