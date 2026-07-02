import React, { useState, useEffect } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import { apiClient } from '../../../api/client';

interface RfqsTabProps {
  addLog: (message: string) => void;
}

export const RfqsTab: React.FC<RfqsTabProps> = ({ addLog }) => {
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [rfqsLoading, setRfqsLoading] = useState(false);
  const [rfqStatusFilter, setRfqStatusFilter] = useState('ALL');

  const fetchRfqs = async () => {
    setRfqsLoading(true);
    try {
      const data = await apiClient.get(`/admin/rfqs?status=${rfqStatusFilter}`);
      setRfqs(data);
      addLog(`[Audit] Loaded RFQ list. Found ${data.length} posts.`);
    } catch (err) {
      console.error('Failed to fetch rfqs', err);
      addLog(`[Error] Failed to load RFQs.`);
    } finally {
      setRfqsLoading(false);
    }
  };

  useEffect(() => {
    fetchRfqs();
  }, [rfqStatusFilter]);

  const deleteRfq = async (rfqId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete RFQ "${title}"?`)) return;
    try {
      await apiClient.delete(`/rfqs/${rfqId}`);
      setRfqs(prev => prev.filter(r => r.id !== rfqId));
      addLog(`[Audit] Deleted RFQ "${title}".`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to delete RFQ');
      addLog(`[Error] Failed to delete RFQ "${title}".`);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">RFQ Moderation Panel</h1>
        <p className="text-xs text-slate-500 mt-1">Monitor all active procurement bids, client requests, and remove inappropriate entries.</p>
      </div>

      {/* Filters */}
      <div className="flex p-4 bg-slate-50/50 border border-slate-200 rounded-2xl justify-between items-center">
        <div className="w-64">
          <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Filter RFQ Status</label>
          <div className="relative">
            <select
              value={rfqStatusFilter}
              onChange={(e) => { setRfqStatusFilter(e.target.value); }}
              className="w-full rounded-xl px-3 py-2 text-xs glass-input font-bold appearance-none bg-white pr-8"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">OPEN (Receiving Bids)</option>
              <option value="ACCEPTED">ACCEPTED (Deal Closed)</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              ▼
            </div>
          </div>
        </div>
        <div className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider">
          Total System RFQs: {rfqs.length}
        </div>
      </div>

      {rfqsLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
        </div>
      ) : (
        <div className="rounded-none glass-panel border border-slate-200 overflow-hidden bg-white shadow-glass-sm animate-in fade-in-50 duration-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/65 border-b border-slate-150 text-slate-655 uppercase tracking-wider font-bold">
                  <th className="p-3.5">Requirement Details</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Client Info</th>
                  <th className="p-3.5">Bids / Proposals</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {rfqs.length > 0 ? (
                  rfqs.map((rfq) => (
                    <tr key={rfq.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3.5 max-w-xs">
                        <div className="font-bold text-slate-900 leading-snug">{rfq.title}</div>
                        <div className="text-2xs text-slate-455 truncate mt-0.5">{rfq.description}</div>
                      </td>
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded-none bg-slate-100 border border-slate-200 text-[10px] text-slate-550 font-bold uppercase tracking-wide">
                          {rfq.category?.name || 'General'}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold">{rfq.customer?.name}</div>
                        <div className="text-[10px] text-slate-400">{rfq.customer?.email}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-none bg-indigo-50 border border-indigo-200 text-[10px] font-extrabold text-indigo-600">
                          {rfq.proposals?.length || 0}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`inline-flex px-2 py-0.5 rounded-none text-[10px] font-extrabold ${
                          rfq.status === 'OPEN' 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                        }`}>
                          {rfq.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => deleteRfq(rfq.id, rfq.title)}
                          className="inline-flex items-center justify-center p-1.5 rounded-none bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 shadow-2xs"
                          title="Delete RFQ Listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                      No RFQ posts found in the system.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
