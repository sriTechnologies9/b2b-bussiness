import React from 'react';
import { Link } from 'react-router-dom';
import { Loader2, CheckCircle, XCircle, Trash2, Sparkles, Plus } from 'lucide-react';

interface ListingsTabProps {
  businesses: any[];
  categories: any[];
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  cityQuery: string;
  setCityQuery: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  loading: boolean;
  verifyListing: (id: string, name: string) => void;
  rejectListing: (id: string, name: string) => void;
  deleteBusiness: (id: string, name: string) => void;
  setCatError: (val: string) => void;
  setIsCategoryModalOpen: (val: boolean) => void;
  logs: string[];
}

export const ListingsTab: React.FC<ListingsTabProps> = ({
  businesses, categories, searchQuery, setSearchQuery, cityQuery, setCityQuery,
  selectedCategory, setSelectedCategory, loading, verifyListing, rejectListing,
  deleteBusiness, setCatError, setIsCategoryModalOpen, logs
}) => {
  return (
    <div className="space-y-6">
      <div className="text-left">
        <h1 className="text-2xl font-extrabold text-slate-900">Marketplace Listings Manager</h1>
        <p className="text-xs text-slate-500 mt-1">Review, approve, verify or reject registered local business profiles.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-panel border border-slate-200 shadow-glass-sm flex flex-col justify-between space-y-2 text-left bg-white">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Listings</span>
          <span className="text-2xl font-black text-slate-800">{businesses.length}</span>
        </div>
        <div className="p-4 rounded-none glass-panel border border-slate-200 shadow-glass-sm flex flex-col justify-between space-y-2 text-left bg-amber-500/5">
          <span className="text-[10px] uppercase font-bold text-amber-605">Pending Approval</span>
          <span className="text-2xl font-black text-amber-600">{businesses.filter(b => b.status === 'PENDING').length}</span>
        </div>
        <div className="p-4 rounded-none glass-panel border border-slate-200 shadow-glass-sm flex flex-col justify-between space-y-2 text-left bg-emerald-500/5">
          <span className="text-[10px] uppercase font-bold text-emerald-600">Verified Active</span>
          <span className="text-2xl font-black text-emerald-600">{businesses.filter(b => b.status === 'VERIFIED').length}</span>
        </div>
        <div className="p-4 rounded-none glass-panel border border-slate-200 shadow-glass-sm flex flex-col justify-between space-y-2 text-left bg-rose-500/5">
          <span className="text-[10px] uppercase font-bold text-rose-600">Rejected / Banned</span>
          <span className="text-2xl font-black text-rose-600">{businesses.filter(b => b.status === 'REJECTED').length}</span>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          <div className="xl:col-span-8 space-y-4 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50/50 border border-slate-200 rounded-none">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Search Listing Name</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name..."
                  className="w-full rounded-none px-3 py-2 text-xs glass-input font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Search City</label>
                <input
                  type="text"
                  value={cityQuery}
                  onChange={(e) => setCityQuery(e.target.value)}
                  placeholder="Search city..."
                  className="w-full rounded-none px-3 py-2 text-xs glass-input font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Filter Category</label>
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-none px-3 py-2 text-xs glass-input font-bold appearance-none bg-white pr-8"
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

            <div className="rounded-none glass-panel border border-slate-200 overflow-hidden bg-white shadow-glass-sm animate-in fade-in-50 duration-200">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/65 border-b border-slate-150 text-slate-655 uppercase tracking-wider font-bold">
                      <th className="p-3.5">Business Name</th>
                      <th className="p-3.5">City</th>
                      <th className="p-3.5">Category</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {businesses.filter(biz => {
                      const matchesSearch = searchQuery === '' || biz.name.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchesCity = cityQuery === '' || biz.city.toLowerCase().includes(cityQuery.toLowerCase());
                      const matchesCategory = selectedCategory === 'ALL' || biz.categoryId === selectedCategory;
                      return matchesSearch && matchesCity && matchesCategory;
                    }).length > 0 ? (
                      businesses
                        .filter(biz => {
                          const matchesSearch = searchQuery === '' || biz.name.toLowerCase().includes(searchQuery.toLowerCase());
                          const matchesCity = cityQuery === '' || biz.city.toLowerCase().includes(cityQuery.toLowerCase());
                          const matchesCategory = selectedCategory === 'ALL' || biz.categoryId === selectedCategory;
                          return matchesSearch && matchesCity && matchesCategory;
                        })
                        .map((biz) => (
                          <tr key={biz.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-3.5 font-bold text-slate-900">
                              <Link to={`/business/${biz.slug}`} className="hover:underline hover:text-rose-600">
                                {biz.name}
                              </Link>
                            </td>
                            <td className="p-3.5">{biz.city}</td>
                            <td className="p-3.5">
                              <span className="px-2.5 py-0.5 rounded-none bg-slate-100 border border-slate-200/60 text-[10px] text-slate-550 font-bold uppercase tracking-wide">
                                {biz.category?.name || 'General'}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-none text-[10px] font-extrabold ${
                                biz.status === 'VERIFIED'
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-250'
                                  : biz.status === 'REJECTED'
                                  ? 'bg-rose-50 text-rose-600 border border-rose-250'
                                  : 'bg-amber-50 text-amber-655 border border-amber-250'
                              }`}>
                                {biz.status}
                              </span>
                            </td>
                            <td className="p-3.5 text-right space-x-1 shrink-0 whitespace-nowrap">
                              {biz.status !== 'VERIFIED' && (
                                <button
                                  onClick={() => verifyListing(biz.id, biz.name)}
                                  className="inline-flex items-center justify-center p-1.5 rounded-none bg-emerald-50 border border-emerald-200 text-emerald-600 hover:bg-emerald-100 shadow-2xs"
                                  title="Approve & Verify"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                              )}
                              {biz.status !== 'REJECTED' && (
                                <button
                                  onClick={() => rejectListing(biz.id, biz.name)}
                                  className="inline-flex items-center justify-center p-1.5 rounded-none bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 shadow-2xs"
                                  title="Reject / Deactivate"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => deleteBusiness(biz.id, biz.name)}
                                className="inline-flex items-center justify-center p-1.5 rounded-none bg-slate-50 border border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 shadow-2xs"
                                title="Delete Listing Permanently"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                          No listings match the filter settings.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="xl:col-span-4 space-y-6 text-left">
            <div className="rounded-none glass-panel border border-slate-200 p-5 space-y-4 shadow-glass bg-white">
              <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center space-x-1">
                <Sparkles className="w-4 h-4 text-rose-600" />
                <span>Quick Actions</span>
              </h3>
              <button
                onClick={() => {
                  setCatError('');
                  setIsCategoryModalOpen(true);
                }}
                className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-none text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/10 transition-all"
              >
                <Plus className="w-4 h-4 mr-1" />
                <span>Create Category</span>
              </button>
            </div>

            <div className="rounded-none glass-panel border border-slate-200 p-5 space-y-3.5 shadow-glass bg-white">
              <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-none bg-rose-600 animate-pulse"></span>
                <span>System Audit Logs</span>
              </h3>
              <div className="h-64 bg-slate-900 text-slate-200 font-mono text-[9px] p-3 rounded-none overflow-y-auto space-y-2 select-text border border-slate-800 shadow-inner">
                {logs.map((log, index) => (
                  <div key={index} className="leading-relaxed whitespace-pre-wrap break-all border-b border-slate-800 pb-1 last:border-b-0">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
