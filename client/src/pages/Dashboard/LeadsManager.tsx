import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Phone, Sparkles, RefreshCw, HelpCircle } from 'lucide-react';

const COLUMNS = [
  { id: 'NEW', title: 'New Interest 🆕', color: 'border-t-brand-500 bg-brand-500/5' },
  { id: 'CONTACTED', title: 'Talking / Called 🗣️', color: 'border-t-amber-500 bg-amber-500/5' },
  { id: 'CONVERTED', title: 'Deal Done! 🎉', color: 'border-t-emerald-500 bg-emerald-500/5' },
  { id: 'CLOSED', title: 'Not Interested ❌', color: 'border-t-slate-400 bg-slate-100/40' }
];

export const LeadsManager: React.FC = () => {
  const { token } = useAuth();
  
  const [business, setBusiness] = useState<any | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rescoringId, setRescoringId] = useState<string | null>(null);
  
  // Tooltip helper
  const [hoveredReasonId, setHoveredReasonId] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const fetchLeadsData = async () => {
    if (!token) return;
    try {
      const resBiz = await fetch('/api/businesses/my-listings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resBiz.ok) {
        const bizList = await resBiz.json();
        if (bizList.length > 0) {
          const myBiz = bizList[0];
          setBusiness(myBiz);

          // Fetch leads
          const resLeads = await fetch(`/api/leads/business/${myBiz.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (resLeads.ok) {
            const data = await resLeads.json();
            setLeads(data);
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeadsData();
  }, [token]);

  // Update lead status
  const moveLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/leads/${leadId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        // Optimistically update status locally
        setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Re-run AI scorer manually
  const rescoreLead = async (leadId: string) => {
    setRescoringId(leadId);
    try {
      const res = await fetch(`/api/leads/${leadId}/rescore`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const updated = await res.json();
        // Update locally
        setLeads(prev => prev.map(l => l.id === leadId ? updated : l));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRescoringId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="text-slate-450 text-sm">Loading lead pipeline...</span>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="p-8 text-center rounded-none border border-slate-200 glass-panel">
        <p className="text-slate-500 text-sm">Please create your business listing first to manage leads.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
            <span>Lead CRM Pipeline</span>
            <Sparkles className="w-5 h-5 text-violet-500" />
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Qualify incoming customer requirements. Drag or transition leads across boards to convert them.
          </p>
        </div>
        <button
          onClick={fetchLeadsData}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold rounded-none text-slate-700 self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Leads</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 bg-slate-50/50 border border-slate-200 rounded-none">
        <div className="flex-1">
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Search by Name or Phone 🔍</label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type name, phone number, or requirements..."
            className="w-full rounded-none px-3 py-2 text-xs glass-input font-bold"
          />
        </div>
        <div className="w-full sm:w-48">
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Filter by Interest 🔍</label>
          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full rounded-none px-3 py-2 text-xs glass-input font-bold appearance-none bg-white pr-8"
            >
              <option value="ALL">Show All</option>
              <option value="HOT">Urgent Customers 🔥</option>
              <option value="WARM">Interested Customers 👍</option>
              <option value="COLD">Just Looking 🔍</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              ▼
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
        {COLUMNS.map((col) => {
          const colLeads = leads
            .filter(lead => {
              const matchesSearch = 
                lead.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                lead.phone.includes(searchQuery);
              const matchesPriority = priorityFilter === 'ALL' || lead.score === priorityFilter;
              return matchesSearch && matchesPriority;
            })
            .filter(l => l.status === col.id);

          return (
            <div key={col.id} className={`rounded-none border-t-4 border-slate-200 p-4 min-h-[480px] space-y-4 shadow-sm ${col.color}`}>
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="font-bold text-slate-800 text-sm">{col.title}</span>
                <span className="text-xs font-bold bg-slate-200/60 text-slate-600 px-2 py-0.5 rounded-none">
                  {colLeads.length}
                </span>
              </div>

              {/* Cards list */}
              <div className="space-y-3">
                {colLeads.length > 0 ? (
                  colLeads.map((lead) => (
                    <div key={lead.id} className="rounded-none border border-slate-200/85 bg-white p-4 shadow-glass-sm space-y-3 relative group">
                      
                      {/* Badge / AI score */}
                      <div className="flex items-center justify-between">
                        <div className="relative">
                          <span
                            onMouseEnter={() => setHoveredReasonId(lead.id)}
                            onMouseLeave={() => setHoveredReasonId(null)}
                            className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-none text-[9px] font-extrabold cursor-help ${
                              lead.score === 'HOT' 
                                ? 'bg-rose-50 text-rose-600 border border-rose-200 shadow-[0_0_8px_rgba(244,63,94,0.05)] animate-pulse' 
                                : lead.score === 'WARM'
                                ? 'bg-amber-50 text-amber-655 border border-amber-200'
                                : 'bg-slate-100 text-slate-600 border border-slate-200'
                            }`}
                          >
                            <span>
                              {lead.score === 'HOT' ? 'Urgent Need! 🔥' : lead.score === 'WARM' ? 'Interested 👍' : 'Just Looking 🔍'}
                            </span>
                            <HelpCircle className="w-3 h-3 text-[10px]" />
                          </span>

                          {/* Tooltip reason */}
                          {hoveredReasonId === lead.id && lead.scoreReason && (
                            <div className="absolute left-0 bottom-6 w-56 bg-white border border-slate-200 text-[10px] text-slate-700 p-2 rounded-none shadow-xl z-20 leading-relaxed">
                              <span className="font-bold text-slate-900 block mb-1">Interest Level Explanation:</span>
                              {lead.scoreReason}
                            </div>
                          )}
                        </div>

                        {/* Scorer reload */}
                        <button
                          onClick={() => rescoreLead(lead.id)}
                          disabled={rescoringId === lead.id}
                          title="Re-score message using AI"
                          className="text-slate-400 hover:text-slate-700 transition-colors"
                        >
                          <RefreshCw className={`w-3 h-3 ${rescoringId === lead.id ? 'animate-spin' : ''}`} />
                        </button>
                      </div>

                      {/* Registered User Profile Badges */}
                      <div className="flex flex-wrap gap-1">
                        {lead.registeredUser ? (
                          <>
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-none text-[8px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                              Member Buyer 👤
                            </span>
                            {lead.registeredUser.role !== 'CUSTOMER' && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-none text-[8px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                                Role: {lead.registeredUser.role}
                              </span>
                            )}
                            {lead.registeredUser.plan && lead.registeredUser.plan !== 'FREE' && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-none text-[8px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-250 animate-pulse">
                                {lead.registeredUser.plan} Member
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-none text-[8px] font-black uppercase tracking-wider bg-slate-100 text-slate-550 border border-slate-200">
                            Guest Visitor 👤
                          </span>
                        )}
                      </div>

                      {/* Requirement message */}
                      <div>
                        <p className="text-xs font-semibold text-slate-850 line-clamp-3 leading-relaxed">
                          "{lead.message}"
                        </p>
                      </div>

                      <hr className="border-slate-100" />

                       {/* Customer Info */}
                      <div className="space-y-1.5">
                        <div className="text-[10px] uppercase font-bold text-slate-500">Contact Information 👤</div>
                        <div className="text-xs font-bold text-slate-800">{lead.customerName}</div>
                        <div className="flex items-center space-x-1.5 text-2xs text-slate-600">
                          <Phone className="w-3 h-3 shrink-0" />
                          <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                        </div>

                        {/* Trust Star Assessment */}
                        <div className="flex items-center justify-between text-[9px] pt-1">
                          <span className="text-slate-450 font-semibold">Buyer Rating ⭐:</span>
                          {lead.registeredUser ? (
                            <span className="font-extrabold text-emerald-600 uppercase tracking-wider">
                              {lead.registeredUser.reviewsCount > 0 || lead.registeredUser.rfqsCount > 0 ? '⭐⭐⭐ High' : '⭐⭐ Medium'}
                            </span>
                          ) : (
                            <span className="font-extrabold text-slate-450 uppercase tracking-wider">
                              ⭐ Standard (Guest)
                            </span>
                          )}
                        </div>

                        {/* Buyer Intent Activity Metrics if registered */}
                        {lead.registeredUser && (
                          <div className="bg-slate-50 border border-slate-100 p-1.5 rounded-none text-[8.5px] space-y-0.5">
                            <div className="text-slate-450 font-extrabold uppercase tracking-wider">Buyer Activity 📈</div>
                            <div className="flex justify-between font-bold text-slate-700">
                              <span>RFQ Posts: {lead.registeredUser.rfqsCount}</span>
                              <span>Reviews: {lead.registeredUser.reviewsCount}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="text-[9px] text-slate-500">
                        Received: {new Date(lead.createdAt).toLocaleDateString()}
                      </div>

                      {/* CRM stage quick moving buttons */}
                      <div className="flex items-center space-x-1 pt-1.5">
                        {col.id !== 'NEW' && (
                          <button
                            onClick={() => moveLeadStatus(lead.id, col.id === 'CLOSED' ? 'CONVERTED' : col.id === 'CONVERTED' ? 'CONTACTED' : 'NEW')}
                            className="flex-1 py-1 rounded-none bg-slate-100 hover:bg-slate-200 text-[9px] font-bold text-slate-700"
                          >
                            ◄ Back
                          </button>
                        )}
                        {col.id !== 'CLOSED' && (
                          <button
                            onClick={() => moveLeadStatus(lead.id, col.id === 'NEW' ? 'CONTACTED' : col.id === 'CONTACTED' ? 'CONVERTED' : 'CLOSED')}
                            className="flex-1 py-1 rounded-none bg-brand-600 hover:bg-brand-500 text-[9px] font-bold text-white"
                          >
                            Next ►
                          </button>
                        )}
                      </div>

                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 border border-dashed border-slate-250 rounded-none text-slate-500 text-xs">
                    No leads in this stage.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default LeadsManager;
