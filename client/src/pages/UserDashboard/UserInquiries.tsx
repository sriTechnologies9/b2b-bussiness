import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../api/client';
import { ClipboardList, Sparkles, Loader2, Calendar, Building2, ArrowRight } from 'lucide-react';

export const UserInquiries: React.FC = () => {
  const { token } = useAuth();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      if (!token) return;
      try {
        const data = await apiClient.get('/leads/my-inquiries');
        if (data) {
          setInquiries(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, [token]);

  const getInquiredProduct = (message: string) => {
    const match = message.match(/product\/service:\s*["']([^"']+)["']/);
    return match ? match[1] : null;
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
      <div>
        <div className="flex items-center space-x-2 text-blue-600 font-extrabold text-[10px] uppercase tracking-widest mb-1">
          <ClipboardList className="w-3.5 h-3.5" />
          <span>My Leads Directory</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Lead Inquiries</h1>
        <p className="text-xs text-slate-500 mt-1">Track response pipeline updates and intent ratings for requirements sent directly to local merchants.</p>
      </div>

      <div className="space-y-5">
        {inquiries.length > 0 ? (
          inquiries.map((inq) => {
            const isHot = inq.score === 'HOT';
            const isWarm = inq.score === 'WARM';
            const product = getInquiredProduct(inq.message);
            
            // Score color styles
            let scoreBg = 'bg-slate-50 text-slate-500 border-slate-200';
            let scoreBarColor = 'bg-slate-300';
            let scorePercent = '25%';
            if (isHot) {
              scoreBg = 'bg-rose-50 text-rose-600 border-rose-150';
              scoreBarColor = 'bg-rose-500';
              scorePercent = '95%';
            } else if (isWarm) {
              scoreBg = 'bg-amber-50 text-amber-600 border-amber-150';
              scoreBarColor = 'bg-amber-500';
              scorePercent = '70%';
            }

            // Status color styles
            let statusBg = 'bg-slate-50 text-slate-500 border-slate-200';
            if (inq.status === 'NEW') statusBg = 'bg-cyan-50 text-cyan-655 border-cyan-150';
            else if (inq.status === 'CONTACTED') statusBg = 'bg-indigo-50 text-indigo-655 border-indigo-150';
            else if (inq.status === 'CONVERTED') statusBg = 'bg-emerald-50 text-emerald-655 border-emerald-200';
            else if (inq.status === 'CLOSED') statusBg = 'bg-slate-50 text-slate-400 border-slate-200';

            return (
              <div key={inq.id} className="rounded-none bg-white border border-slate-200/90 p-5 md:p-6 space-y-5 shadow-sm hover:shadow-md hover:border-slate-355 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Header Row */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-11 h-11 rounded-none bg-slate-50 border border-slate-150 flex items-center justify-center text-slate-500 shrink-0 shadow-2xs group-hover:scale-105 transition-transform duration-300">
                      <Building2 className="w-5 h-5 text-indigo-650" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-slate-900 text-sm tracking-tight hover:text-brand-600 transition-colors">
                        {inq.business?.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        {inq.business?.category?.name && (
                          <span className="px-2 py-0.5 border border-indigo-200 bg-indigo-50 text-indigo-700 font-extrabold text-[8px] uppercase tracking-wider rounded-none">
                            {inq.business.category.name}
                          </span>
                        )}
                        {inq.business?.user?.name && (
                          <span className="text-[10px] text-slate-450 font-semibold">
                            Seller: <span className="text-slate-800 font-extrabold">{inq.business.user.name}</span>
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1.5 mt-0.5 text-[10px] text-slate-450 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Submitted {new Date(inq.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {inq.business?.phone && (
                      <a
                        href={`https://wa.me/91${inq.business.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 px-3 py-1.5 text-2xs font-extrabold text-emerald-600 bg-emerald-50 hover:bg-emerald-100/85 rounded-none border border-emerald-200 transition-colors shadow-2xs"
                        title="Start instant WhatsApp Chat with seller"
                      >
                        <svg className="w-3.5 h-3.5 mr-0.5 fill-emerald-650" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.528 2.017 14.077 1.01 11.95 1.01 6.51 1.01 2.085 5.382 2.081 10.81c0 1.688.455 3.324 1.32 4.787L2.445 19.83l4.202-1.107zM9.049 5.86c-.27-.61-.556-.622-.813-.633l-.693-.013c-.244 0-.643.092-.98.463-.338.372-1.29 1.258-1.29 3.067 0 1.81 1.318 3.562 1.502 3.81.184.248 2.593 3.96 6.282 5.553.878.378 1.562.604 2.096.773.882.28 1.686.24 2.32.145.707-.104 2.174-.888 2.479-1.747.304-.858.304-1.595.213-1.747-.092-.152-.338-.243-.717-.432-.38-.189-2.247-1.108-2.594-1.234-.347-.126-.6-.189-.851.189-.251.378-.973 1.234-1.192 1.487-.218.252-.437.283-.817.094-.38-.189-1.603-.59-3.054-1.885-1.129-1.008-1.89-2.253-2.112-2.632-.221-.379-.024-.585.166-.773.17-.168.38-.437.57-.655.189-.219.252-.375.38-.624.127-.25.063-.467-.032-.656-.094-.189-.817-1.973-1.119-2.707z" />
                        </svg>
                        <span>Chat WhatsApp</span>
                      </a>
                    )}
                    {/* Status Pill */}
                    <span className={`px-2.5 py-1.5 rounded-none text-2xs font-black tracking-wide border uppercase ${statusBg}`}>
                      {inq.status}
                    </span>
                  </div>
                </div>

                {/* Inquired Product Badge Row */}
                {product && (
                  <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                    <span className="text-slate-400">Inquired Item:</span>
                    <span className="px-2.5 py-1 bg-slate-900 text-white font-extrabold text-[10px] uppercase rounded-none tracking-wide shadow-2xs">
                      {product}
                    </span>
                  </div>
                )}

                {/* Requirement Message Block */}
                <div className="space-y-1.5 bg-slate-50 border border-slate-150 rounded-none p-4">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 flex items-center space-x-1">
                    <ClipboardList className="w-3.5 h-3.5 text-blue-500" />
                    <span>My Request Description</span>
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium italic">
                    "{inq.message}"
                  </p>
                </div>

                {/* AI Score and Reason grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
                  {/* Gauge indicator */}
                  <div className="md:col-span-4 p-4 bg-white border border-slate-150 rounded-none flex items-center justify-between space-x-3.5 shadow-2xs">
                    <div className="space-y-1 flex-1">
                      <div className="text-[9px] uppercase font-extrabold text-slate-400 tracking-wider">AI Priority score</div>
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-none border ${scoreBg}`}>
                          {inq.score}
                        </span>
                        <span className="text-2xs font-extrabold text-slate-500">{scorePercent}</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 overflow-hidden mt-1.5">
                        <div className={`h-full ${scoreBarColor}`} style={{ width: scorePercent }}></div>
                      </div>
                    </div>
                  </div>

                  {/* AI reason summary */}
                  {inq.scoreReason && (
                    <div className="md:col-span-8 p-4 bg-gradient-to-br from-violet-500/[0.03] via-indigo-500/[0.03] to-transparent border border-violet-100/80 rounded-none flex items-start space-x-3">
                      <div className="p-1 rounded-none bg-violet-100/50 shrink-0">
                        <Sparkles className="w-4 h-4 text-violet-650 shrink-0 animate-pulse" />
                      </div>
                      <div className="text-2xs text-slate-655 leading-normal text-left">
                        <b className="text-violet-850 font-bold uppercase tracking-wider block mb-0.5 text-[8px]">AI Analytics Intent Score</b>
                        {inq.scoreReason}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 border border-dashed border-slate-200 rounded-none text-slate-500 text-sm bg-white shadow-sm flex flex-col items-center justify-center p-8 space-y-3">
            <div className="w-12 h-12 rounded-none bg-slate-100 flex items-center justify-center text-slate-400">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800">No Inquiries Found</h3>
              <p className="text-xs text-slate-500">You have not submitted any requirement inquiries to business directory lists yet.</p>
            </div>
            <button
              onClick={() => window.location.href = '/search'}
              className="mt-2 inline-flex items-center space-x-1 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-bold rounded-none text-slate-700 transition-colors shadow-2xs bg-white"
            >
              <span>Explore Directory</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInquiries;
