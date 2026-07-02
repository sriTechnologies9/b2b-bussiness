import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ClipboardList, TrendingUp, Sparkles, AlertCircle, Plus, ChevronRight, MessageSquare, Phone, Users } from 'lucide-react';

export const Overview: React.FC = () => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [business, setBusiness] = useState<any | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!token) return;
      try {
        // Fetch owner's listings
        const resListings = await fetch('/api/businesses/my-listings', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resListings.ok) {
          const listings = await resListings.json();
          if (listings.length > 0) {
            const myBiz = listings[0];
            setBusiness(myBiz);

            // Fetch leads for this listing
            const resLeads = await fetch(`/api/leads/business/${myBiz.id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (resLeads.ok) {
              const leadData = await resLeads.json();
              setLeads(leadData);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="text-slate-400 text-sm">Loading dashboard summary...</span>
      </div>
    );
  }

  // Case: User does not own a business listing yet
  if (!business) {
    return (
      <div className="rounded-2xl glass-panel border border-slate-200 p-8 text-center space-y-6">
        <div className="w-16 h-16 bg-brand-500/10 border border-brand-500/25 rounded-full flex items-center justify-center mx-auto text-brand-400">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-sm mx-auto">
          <h2 className="text-xl font-bold text-slate-900">No Business Profile Listed</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            In order to view analytics, receive leads, and access AI tools, you must first publish your business details to the LocalConnect marketplace.
          </p>
        </div>
        <button
          onClick={() => navigate('/dealersuser/profile')}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-brand-600 hover:bg-brand-500 rounded-lg text-sm font-semibold text-white transition-all shadow-md shadow-brand-600/10"
        >
          <Plus className="w-4 h-4" />
          <span>Add Your Business Profile</span>
        </button>
      </div>
    );
  }

  // Metrics details
  const isViewLead = (msg: string) => msg.includes('opened your shop page') || msg.includes('Visited business storefront');
  const isWhatsappLead = (msg: string) => msg.includes('chat with you on WhatsApp') || msg.includes('Clicked Chat on WhatsApp');
  const isPhoneLead = (msg: string) => msg.includes('see your phone number') || msg.includes('Clicked Call/Phone');

  const customInquiriesCount = leads.filter(l => !isViewLead(l.message) && !isWhatsappLead(l.message) && !isPhoneLead(l.message)).length;
  const hotLeads = leads.filter(l => l.score === 'HOT' && !isViewLead(l.message) && !isWhatsappLead(l.message) && !isPhoneLead(l.message)).length;
  const whatsappClicksCount = leads.filter(l => isWhatsappLead(l.message)).length;
  const phoneClicksCount = leads.filter(l => isPhoneLead(l.message)).length;
  const profileViewsCount = leads.filter(l => isViewLead(l.message)).length;
  let parsedHours: any = {};
  try {
    parsedHours = typeof business?.hours === 'string' ? JSON.parse(business.hours) : (business?.hours || {});
  } catch (e) {}
  const followersCount = (parsedHours.followersList && Array.isArray(parsedHours.followersList)) 
    ? parsedHours.followersList.length 
    : 0;
  const plan = user?.subscription?.plan || 'FREE';

  return (
    <div className="space-y-6">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200/60 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Welcome back, {user?.name}!</h1>
          <p className="text-xs text-slate-500 mt-1">Managing profile for <span className="font-semibold text-slate-800">{business.name}</span></p>
        </div>
        <div className="mt-2 md:mt-0 flex items-center space-x-2">
          <span className="inline-flex items-center space-x-1.5 px-3 py-1 bg-slate-100 border border-slate-200/60 rounded-full text-xs font-semibold text-slate-655">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Listing</span>
          </span>
          <span className="px-3 py-1 bg-amber-50 border border-amber-250 rounded-full text-xs font-bold text-amber-650">
            {plan} Plan
          </span>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Direct Inquiries */}
        <Link to="/dealersuser/leads?filter=message" className="rounded-2xl glass-panel border border-slate-200 p-5 space-y-3 hover:border-indigo-400 hover:shadow-md transition-all duration-300 block text-left group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-550 group-hover:text-indigo-600 transition-colors">Customer Messages ✉️</span>
            <ClipboardList className="w-5 h-5 text-indigo-550 transition-transform group-hover:scale-105" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{customInquiriesCount}</span>
            {hotLeads > 0 && (
              <span className="text-2xs font-bold bg-rose-50 text-rose-600 border border-rose-200 px-1.5 py-0.5 rounded">
                {hotLeads} Hot
              </span>
            )}
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500">
            <span>Form requirement submissions</span>
            <span className="text-[9px] font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">View Details →</span>
          </div>
        </Link>

        {/* Profile Views */}
        <Link to="/dealersuser/leads?filter=view" className="rounded-2xl glass-panel border border-slate-200 p-5 space-y-3 hover:border-indigo-400 hover:shadow-md transition-all duration-300 block text-left group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-555 group-hover:text-indigo-600 transition-colors">Shop Views 👁️</span>
            <TrendingUp className="w-5 h-5 text-cyan-600 transition-transform group-hover:scale-105" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-extrabold text-slate-900">{profileViewsCount}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500">
            <span>Automated page visit logs</span>
            <span className="text-[9px] font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">View Details →</span>
          </div>
        </Link>

        {/* WhatsApp Clicks */}
        <Link to="/dealersuser/leads?filter=whatsapp" className="rounded-2xl glass-panel border border-slate-200 p-5 space-y-3 hover:border-indigo-400 hover:shadow-md transition-all duration-300 block text-left group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-555 group-hover:text-indigo-600 transition-colors">WhatsApp Chats 💬</span>
            <MessageSquare className="w-5 h-5 text-emerald-605 transition-transform group-hover:scale-105" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{whatsappClicksCount}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500">
            <span>Direct WhatsApp chats initiated</span>
            <span className="text-[9px] font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">View Details →</span>
          </div>
        </Link>

        {/* Phone Clicks */}
        <Link to="/dealersuser/leads?filter=phone" className="rounded-2xl glass-panel border border-slate-200 p-5 space-y-3 hover:border-indigo-400 hover:shadow-md transition-all duration-300 block text-left group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-555 group-hover:text-indigo-600 transition-colors">Phone Clicks 📞</span>
            <Phone className="w-5 h-5 text-brand-600 transition-transform group-hover:scale-105" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-extrabold text-slate-900">{phoneClicksCount}</span>
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500">
            <span>Contact number reveal clicks</span>
            <span className="text-[9px] font-bold text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">View Details →</span>
          </div>
        </Link>

        {/* Store Followers */}
        <div className="rounded-2xl glass-panel border border-slate-200 p-5 space-y-3 bg-white/80 select-none text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-555">Store Followers 👥</span>
            <Users className="w-5 h-5 text-[#4f46e5]" />
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-extrabold text-slate-900">{followersCount}</span>
          </div>
          <div className="text-[10px] text-slate-500">
            Active member bookmarks
          </div>
        </div>
      </div>

      {/* Bottom Layout - Recent Leads & Quick shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Leads List */}
        <div className="lg:col-span-8 rounded-2xl glass-panel border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-md">Recent Incoming Leads</h3>
            <Link to="/dealersuser/leads" className="inline-flex items-center space-x-1 text-xs text-brand-600 hover:text-brand-700 font-semibold">
              <span>View Pipeline</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {leads.filter(l => !isViewLead(l.message) && !isWhatsappLead(l.message) && !isPhoneLead(l.message)).length > 0 ? (
              leads
                .filter(l => !isViewLead(l.message) && !isWhatsappLead(l.message) && !isPhoneLead(l.message))
                .slice(0, 3)
                .map((lead) => (
                  <div key={lead.id} className="p-4 rounded-xl border border-slate-200 bg-white/40 hover:bg-white/95 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div className="space-y-1.5 max-w-md">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-800 text-sm">{lead.customerName}</span>
                        <span className="text-[10px] text-slate-500">{new Date(lead.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-1 italic">"{lead.message}"</p>
                    </div>
                    
                    {/* Lead Score */}
                    <div className="flex items-center space-x-3 shrink-0">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        lead.score === 'HOT' 
                          ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                          : lead.score === 'WARM'
                          ? 'bg-amber-50 text-amber-655 border border-amber-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {lead.score} LEAD
                      </span>
                      <span className="text-xs font-semibold text-slate-650 bg-slate-100 px-2 py-1 rounded-md">
                        {lead.status}
                      </span>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-10 border border-dashed border-slate-300 rounded-xl text-slate-500 text-xs">
                No customer requirements received yet.
              </div>
            )}
          </div>
        </div>

        {/* Shortcuts */}
        <div className="lg:col-span-4 space-y-4">
          {/* Visual Lead Stats Chart */}
          <div className="rounded-2xl glass-panel border border-slate-200 p-6 space-y-4 shadow-glass">
            <h3 className="font-bold text-slate-900 text-md flex items-center space-x-1.5">
              <TrendingUp className="w-4.5 h-4.5 text-indigo-600" />
              <span>Lead Distribution</span>
            </h3>

            {/* Priority Breakdown */}
            <div className="space-y-3">
              <div className="text-2xs font-extrabold uppercase tracking-wider text-slate-400">By AI Priority</div>
              
              {/* Hot */}
              <div className="space-y-1 text-left">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">Hot Priority</span>
                  <span className="font-bold text-slate-800">{leads.filter(l => l.score === 'HOT').length} leads</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-rose-500" 
                    style={{ width: `${leads.length ? (leads.filter(l => l.score === 'HOT').length / leads.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Warm */}
              <div className="space-y-1 text-left">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">Warm Priority</span>
                  <span className="font-bold text-slate-800">{leads.filter(l => l.score === 'WARM').length} leads</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-amber-500" 
                    style={{ width: `${leads.length ? (leads.filter(l => l.score === 'WARM').length / leads.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Cold */}
              <div className="space-y-1 text-left">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">Cold Priority</span>
                  <span className="font-bold text-slate-800">{leads.filter(l => l.score === 'COLD').length} leads</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-slate-400" 
                    style={{ width: `${leads.length ? (leads.filter(l => l.score === 'COLD').length / leads.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Status Breakdown */}
            <div className="space-y-3">
              <div className="text-2xs font-extrabold uppercase tracking-wider text-slate-400">By CRM Status</div>
              
              {/* Converted */}
              <div className="space-y-1 text-left">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">Converted</span>
                  <span className="font-bold text-slate-800">{leads.filter(l => l.status === 'CONVERTED').length} leads</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-emerald-500" 
                    style={{ width: `${leads.length ? (leads.filter(l => l.status === 'CONVERTED').length / leads.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Contacted */}
              <div className="space-y-1 text-left">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-700">Contacted</span>
                  <span className="font-bold text-slate-800">{leads.filter(l => l.status === 'CONTACTED').length} leads</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-indigo-500" 
                    style={{ width: `${leads.length ? (leads.filter(l => l.status === 'CONTACTED').length / leads.length) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl glass-panel border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-md">AI SaaS Utilities</h3>
            <div className="space-y-3">
              <Link to="/dealersuser/profile" className="block p-3 rounded-xl border border-slate-200 bg-white/40 hover:border-brand-500/40 hover:bg-white/80 transition-colors">
                <h4 className="text-xs font-bold text-slate-800 mb-0.5 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                  <span>AI Copy Generator</span>
                </h4>
                <p className="text-[10px] text-slate-600 leading-normal">Instantly create professional SEO metadata and business summaries.</p>
              </Link>
              <Link to="/dealersuser/profile" className="block p-3 rounded-xl border border-slate-200 bg-white/40 hover:border-brand-500/40 hover:bg-white/80 transition-colors">
                <h4 className="text-xs font-bold text-slate-800 mb-0.5 flex items-center space-x-1">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Verify Credentials</span>
                </h4>
                <p className="text-[10px] text-slate-600 leading-normal">Submit GST credentials to receive a verified profile badge.</p>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default Overview;
