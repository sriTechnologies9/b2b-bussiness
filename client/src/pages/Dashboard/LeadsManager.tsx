import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Phone, Sparkles, RefreshCw, HelpCircle, Loader2 } from 'lucide-react';
import { apiClient } from '../../api/client';

const COLUMNS = [
  { id: 'NEW', title: 'New Interest 🆕', color: 'border-t-brand-500 bg-brand-500/5' },
  { id: 'CONTACTED', title: 'Talking / Called 🗣️', color: 'border-t-amber-500 bg-amber-500/5' },
  { id: 'CONVERTED', title: 'Deal Done! 🎉', color: 'border-t-emerald-500 bg-emerald-500/5' },
  { id: 'CLOSED', title: 'Not Interested ❌', color: 'border-t-slate-400 bg-slate-100/40' }
];

export const LeadsManager: React.FC = () => {
  const { token } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const filterParam = searchParams.get('filter') || 'ALL';
  
  const [business, setBusiness] = useState<any | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [rescoringId, setRescoringId] = useState<string | null>(null);
  
  const [hoveredReasonId, setHoveredReasonId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchLeadsData = async (pageNum = 1) => {
    if (!token) return;
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const bizList = await apiClient.get('/businesses/my-listings');
      if (bizList.length > 0) {
        const myBiz = bizList[0];
        setBusiness(myBiz);

        // Fetch leads
        const data = await apiClient.get(`/leads/business/${myBiz.id}?page=${pageNum}&limit=50`);
        if (pageNum === 1) {
          setLeads(data);
        } else {
          setLeads(prev => [...prev, ...data]);
        }
        setHasMore(data.length === 50);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (pageNum === 1) setLoading(false);
      else setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchLeadsData(1);
  }, [token]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchLeadsData(nextPage);
  };

  // Update lead status
  const moveLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      await apiClient.put(`/leads/${leadId}/status`, { status: newStatus });
      // Optimistically update status locally
      setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    } catch (err) {
      console.error(err);
    }
  };

  // Re-run AI scorer manually
  const rescoreLead = async (leadId: string) => {
    setRescoringId(leadId);
    try {
      const updated = await apiClient.post(`/leads/${leadId}/rescore`, {});
      // Update locally
      setLeads(prev => prev.map(l => l.id === leadId ? updated : l));
    } catch (err) {
      console.error(err);
    } finally {
      setRescoringId(null);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const isView = lead.message.includes('opened your shop page') || lead.message.includes('Visited business storefront');
    const isWhatsapp = lead.message.includes('chat with you on WhatsApp') || lead.message.includes('Clicked Chat on WhatsApp');
    const isPhone = lead.message.includes('see your phone number') || lead.message.includes('Clicked Call/Phone');

    let matchesType = true;
    if (filterParam === 'message') {
      matchesType = !isView && !isWhatsapp && !isPhone;
    } else if (filterParam === 'view') {
      matchesType = isView;
    } else if (filterParam === 'whatsapp') {
      matchesType = isWhatsapp;
    } else if (filterParam === 'phone') {
      matchesType = isPhone;
    }

    const matchesSearch = 
      lead.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery);
    const matchesPriority = priorityFilter === 'ALL' || lead.score === priorityFilter;

    return matchesType && matchesSearch && matchesPriority;
  });

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

        <div className="flex items-center space-x-3 self-start md:self-auto">
          {/* View Selector */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded text-2xs font-extrabold uppercase transition-all ${
                viewMode === 'kanban' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Pipeline Board 📋
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded text-2xs font-extrabold uppercase transition-all ${
                viewMode === 'table' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              CRM Table 📊
            </button>
          </div>

          <button
            onClick={() => { setPage(1); fetchLeadsData(1); }}
            className="inline-flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold rounded-none text-slate-700"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Leads</span>
          </button>
        </div>
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

      {filterParam !== 'ALL' && (
        <div className="flex items-center space-x-2 bg-indigo-50 border border-indigo-150 px-4 py-2.5 rounded-none text-xs text-indigo-755 text-left">
          <span className="font-bold uppercase tracking-wider text-[9px] bg-indigo-650 text-white px-1.5 py-0.5 mr-1.5">
            Active Filter
          </span>
          <span>
            Showing only: <b>{
              filterParam === 'message' ? 'Customer Messages ✉️' :
              filterParam === 'view' ? 'Shop Views 👁️' :
              filterParam === 'whatsapp' ? 'WhatsApp Chats 💬' :
              filterParam === 'phone' ? 'Phone Clicks 📞' : 'All Leads'
            }</b>
          </span>
          <button
            onClick={() => setSearchParams({})}
            className="ml-auto text-2xs font-extrabold uppercase hover:underline text-rose-600 focus:outline-none"
          >
            Clear Filter ✕
          </button>
        </div>
      )}

      {/* View Mode Rendering */}
      {viewMode === 'kanban' ? (
        /* Kanban Board Grid */
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          {COLUMNS.map((col) => {
            const colLeads = filteredLeads.filter(l => l.status === col.id);

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
                    colLeads.map((lead) => {
                      const isView = lead.message.includes('Visited business storefront');
                      const isWhatsapp = lead.message.includes('Clicked Chat on WhatsApp');
                      const isPhone = lead.message.includes('Clicked Call/Phone');
                      
                      let badgeText = lead.score === 'HOT' ? 'Urgent Need! 🔥' : lead.score === 'WARM' ? 'Interested 👍' : 'Just Looking 🔍';
                      let typeLabel = '';
                      if (isView) typeLabel = 'Shop View 👁️';
                      else if (isWhatsapp) typeLabel = 'WhatsApp Chat 💬';
                      else if (isPhone) typeLabel = 'Phone Click 📞';

                      return (
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
                                <span>{badgeText}</span>
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

                          {/* Action Type Badge if auto-lead */}
                          {typeLabel && (
                            <div className="flex">
                              <span className="inline-block px-1.5 py-0.5 text-[8px] font-black uppercase bg-slate-50 border border-slate-200 text-slate-600 rounded">
                                {typeLabel}
                              </span>
                            </div>
                          )}

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
                              "{lead.message.replace('[Auto-Lead] ', '')}"
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
                              <span className="text-slate-455 font-semibold">Buyer Rating ⭐:</span>
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
                      );
                    })
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
      ) : (
        /* CRM Detailed Table View */
        <div className="overflow-x-auto rounded-none border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-black uppercase tracking-wider text-slate-500">
                <th className="p-4">Date & Time</th>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Phone Number</th>
                <th className="p-4">Interaction Type</th>
                <th className="p-4">Details / Message</th>
                <th className="p-4">AI Score</th>
                <th className="p-4">CRM Stage</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => {
                  const isView = lead.message.includes('opened your shop page') || lead.message.includes('Visited business storefront');
                  const isWhatsapp = lead.message.includes('chat with you on WhatsApp') || lead.message.includes('Clicked Chat on WhatsApp');
                  const isPhone = lead.message.includes('see your phone number') || lead.message.includes('Clicked Call/Phone');
                  
                  let typeLabel = 'Message ✉️';
                  let typeColor = 'text-indigo-650 bg-indigo-50 border-indigo-100';
                  if (isView) {
                    typeLabel = 'Shop View 👁️';
                    typeColor = 'text-cyan-600 bg-cyan-50 border-cyan-100';
                  } else if (isWhatsapp) {
                    typeLabel = 'WhatsApp Chat 💬';
                    typeColor = 'text-emerald-600 bg-emerald-50 border-emerald-100';
                  } else if (isPhone) {
                    typeLabel = 'Phone Click 📞';
                    typeColor = 'text-amber-600 bg-amber-50 border-amber-100';
                  }

                  return (
                    <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 whitespace-nowrap text-slate-500 text-[11px] font-medium">
                        {new Date(lead.createdAt).toLocaleString()}
                      </td>
                      <td className="p-4 font-bold text-slate-800 whitespace-nowrap">
                        {lead.customerName}
                        {lead.registeredUser && (
                          <span className="ml-1.5 inline-block px-1 text-[8px] font-black bg-blue-50 text-blue-600 border border-blue-100 rounded">MEMBER</span>
                        )}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <a href={`tel:${lead.phone}`} className="font-semibold text-slate-600 hover:text-indigo-650 hover:underline">{lead.phone}</a>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 border text-[9px] font-extrabold rounded-none ${typeColor}`}>
                          {typeLabel}
                        </span>
                      </td>
                      <td className="p-4 max-w-xs truncate font-medium text-slate-700" title={lead.message}>
                        {lead.message.replace('[Auto-Lead] ', '')}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`inline-flex items-center space-x-1 px-1.5 py-0.5 border text-[9px] font-extrabold rounded-none ${
                          lead.score === 'HOT' 
                            ? 'bg-rose-50 text-rose-600 border-rose-200' 
                            : lead.score === 'WARM'
                            ? 'bg-amber-50 text-amber-655 border-amber-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {lead.score === 'HOT' ? 'HOT 🔥' : lead.score === 'WARM' ? 'WARM 👍' : 'COLD 🔍'}
                        </span>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <select
                          value={lead.status}
                          onChange={(e) => moveLeadStatus(lead.id, e.target.value)}
                          className="bg-transparent font-bold text-slate-850 focus:outline-none cursor-pointer border border-slate-200 px-1.5 py-1 rounded text-2xs"
                        >
                          <option value="NEW">New Interest</option>
                          <option value="CONTACTED">Called / Talking</option>
                          <option value="CONVERTED">Deal Done</option>
                          <option value="CLOSED">Not Interested</option>
                        </select>
                      </td>
                      <td className="p-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => rescoreLead(lead.id)}
                          disabled={rescoringId === lead.id}
                          className="text-2xs font-extrabold text-indigo-655 hover:text-indigo-805 disabled:opacity-50"
                        >
                          {rescoringId === lead.id ? 'Scoring...' : 'Rescore 🧠'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-20 text-slate-500 font-semibold">
                    No leads or interactions found matching search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {hasMore && (
        <div className="flex justify-center pt-6">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="inline-flex items-center px-6 py-2.5 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50"
          >
            {loadingMore && <Loader2 className="w-4 h-4 mr-2 animate-spin text-slate-400" />}
            Load More Leads
          </button>
        </div>
      )}
    </div>
  );
};
export default LeadsManager;
