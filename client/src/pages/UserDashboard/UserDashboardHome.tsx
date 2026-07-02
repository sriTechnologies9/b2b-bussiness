import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../api/client';
import { 
  ClipboardList, 
  MessageSquare, 
  Star, 
  User, 
  ArrowRight, 
  Sparkles, 
  Plus, 
  Search, 
  ShoppingBag, 
  Calendar, 
  ArrowUpRight, 
  Loader2
} from 'lucide-react';

export const UserDashboardHome: React.FC = () => {
  const { user, token } = useAuth();

  const [inquiries, setInquiries] = useState<any[]>([]);
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;
      try {
        const [inqData, rfqData, revData] = await Promise.all([
          apiClient.get('/leads/my-inquiries').catch(() => null),
          apiClient.get('/rfqs/my-rfqs').catch(() => null),
          apiClient.get('/reviews/my-reviews').catch(() => null)
        ]);

        if (inqData) setInquiries(inqData);
        if (rfqData) setRfqs(rfqData);
        if (revData) setReviews(revData);
      } catch (err) {
        console.error('Error loading customer dashboard home statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  // Derived statistics
  const totalInquiries = inquiries.length;
  const totalRfqs = rfqs.length;
  const totalReviews = reviews.length;

  const totalBidsReceived = rfqs.reduce((acc, rfq) => acc + (rfq.proposals?.length || 0), 0);
  const openRfqs = rfqs.filter(rfq => rfq.status === 'OPEN');
  const activeBids = openRfqs.reduce((acc, rfq) => acc + (rfq.proposals?.length || 0), 0);

  const averageRating = totalReviews > 0
    ? parseFloat((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1))
    : 0;

  // Profile strength
  let profileStrength = 33;
  if (user?.name) profileStrength += 33;
  if (user?.phone) profileStrength += 34;

  // Combine latest activity
  const activities: any[] = [];
  inquiries.forEach(inq => {
    activities.push({
      type: 'inquiry',
      title: `Sent Inquiry to ${inq.business?.name || 'Local Seller'}`,
      date: new Date(inq.createdAt),
      status: inq.status,
      desc: inq.message,
      link: '/user/inquiries'
    });
  });

  rfqs.forEach(rfq => {
    activities.push({
      type: 'rfq',
      title: `Created RFQ: ${rfq.title}`,
      date: new Date(rfq.createdAt),
      status: rfq.status,
      desc: rfq.message,
      link: '/user/rfqs'
    });
    
    // Add bid events if any
    if (rfq.proposals && rfq.proposals.length > 0) {
      rfq.proposals.forEach((prop: any) => {
        activities.push({
          type: 'proposal',
          title: `Received Quote of ₹${prop.price.toLocaleString()} from ${prop.business?.name}`,
          date: new Date(prop.createdAt),
          status: prop.status,
          desc: prop.message,
          link: '/user/rfqs'
        });
      });
    }
  });

  reviews.forEach(rev => {
    activities.push({
      type: 'review',
      title: `Reviewed ${rev.business?.name || 'Local Seller'}`,
      date: new Date(rev.createdAt),
      status: `${rev.rating} ★`,
      desc: rev.comment,
      link: '/user/reviews'
    });
  });

  // Sort activities by date descending
  const sortedActivities = activities
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-650 p-6 md:p-8 text-white shadow-lg border border-indigo-500/25">
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-[40px] pointer-events-none"></div>
        <div className="absolute right-12 bottom-0 w-32 h-32 bg-brand-500/20 rounded-full blur-[20px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white flex items-center justify-center text-2xl font-black shadow-inner">
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-black tracking-tight text-left">
                  Hello, {user?.name || 'Customer'}!
                </h1>
                <span className="inline-flex items-center bg-white/15 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide text-white border border-white/10 backdrop-blur-xs">
                  Client Portal
                </span>
              </div>
              <p className="text-xs text-indigo-100/90 mt-1 text-left font-medium">
                Welcome back. Track your active leads, procurement RFQs, and vendor feedback from your personalized console.
              </p>
            </div>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-1.5 self-stretch md:self-auto justify-center md:justify-start">
            <span className="text-2xs font-extrabold uppercase tracking-widest text-indigo-200/90 flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
            <div className="w-full md:w-36 bg-white/10 border border-white/15 rounded-lg p-2 flex items-center justify-between text-left backdrop-blur-xs">
              <div>
                <span className="text-[8px] uppercase tracking-wider font-bold text-indigo-200 block">Profile Completed</span>
                <span className="text-xs font-extrabold">{profileStrength}%</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                <div className="relative flex items-center justify-center">
                  <svg className="w-8 h-8 transform -rotate-90">
                    <circle cx="16" cy="16" r="12" stroke="currentColor" className="text-white/10" strokeWidth="2.5" fill="transparent" />
                    <circle cx="16" cy="16" r="12" stroke="currentColor" className="text-white" strokeWidth="2.5" fill="transparent"
                      strokeDasharray={2 * Math.PI * 12}
                      strokeDashoffset={2 * Math.PI * 12 * (1 - profileStrength / 100)} />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Inquiries */}
        <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-500/[0.02] rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Lead Inquiries Sent</span>
            <div className="p-2 rounded-lg bg-blue-50 border border-blue-100 text-blue-600">
              <ClipboardList className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2 mt-4">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{totalInquiries}</span>
            <span className="text-2xs text-slate-500 font-bold">active submissions</span>
          </div>
          <div className="border-t border-slate-100 pt-3.5 mt-3.5 flex items-center justify-between">
            <span className="text-2xs text-slate-400 font-bold">
              {inquiries.filter(i => i.status === 'NEW').length} unprocessed new leads
            </span>
            <Link to="/user/inquiries" className="text-2xs font-extrabold text-blue-600 hover:text-blue-700 flex items-center gap-0.5">
              <span>View details</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Card 2: RFQs & Bids */}
        <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-indigo-500/[0.02] rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Requirements RFQs</span>
            <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-650">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2 mt-4">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{totalRfqs}</span>
            <span className="text-2xs text-slate-500 font-bold">
              {totalBidsReceived > 0 ? `with ${totalBidsReceived} total bids` : 'requirements posted'}
            </span>
          </div>
          <div className="border-t border-slate-100 pt-3.5 mt-3.5 flex items-center justify-between">
            <span className="text-2xs text-slate-400 font-bold">
              {activeBids} active bids on open RFQs
            </span>
            <Link to="/user/rfqs" className="text-2xs font-extrabold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5">
              <span>View bids</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Card 3: Reviews */}
        <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-amber-500/[0.02] rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500"></div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">My Reviews Given</span>
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-100 text-amber-500">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2 mt-4">
            <span className="text-3xl font-black text-slate-900 tracking-tight">{totalReviews}</span>
            <span className="text-2xs text-slate-500 font-bold">average of {averageRating}★</span>
          </div>
          <div className="border-t border-slate-100 pt-3.5 mt-3.5 flex items-center justify-between">
            <div className="flex items-center space-x-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3 h-3 ${
                    s <= Math.round(averageRating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                  }`}
                />
              ))}
            </div>
            <Link to="/user/reviews" className="text-2xs font-extrabold text-amber-600 hover:text-amber-700 flex items-center gap-0.5">
              <span>View reviews</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-slate-900 text-sm tracking-tight text-left">Quick Console Actions</h2>
          <span className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold">Instant Shortcuts</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            to="/user/rfqs" 
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-indigo-100/30 border border-indigo-100 text-center hover:scale-[1.02] hover:shadow-sm active:scale-95 transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-650 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
              <Plus className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xs text-slate-800">Post New RFQ</span>
            <span className="text-[9px] text-slate-400 mt-1 font-semibold">Request competitive quotes</span>
          </Link>

          <Link 
            to="/search" 
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/30 border border-blue-100 text-center hover:scale-[1.02] hover:shadow-sm active:scale-95 transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
              <Search className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xs text-slate-800">Find Businesses</span>
            <span className="text-[9px] text-slate-400 mt-1 font-semibold">Search local marketplace</span>
          </Link>

          <Link 
            to="/products-feed" 
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/30 border border-purple-100 text-center hover:scale-[1.02] hover:shadow-sm active:scale-95 transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-650 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xs text-slate-800">Explore Products</span>
            <span className="text-[9px] text-slate-400 mt-1 font-semibold">Browse latest catalog items</span>
          </Link>

          <Link 
            to="/user/profile" 
            className="flex flex-col items-center justify-center p-5 rounded-2xl bg-gradient-to-br from-teal-50 to-teal-100/30 border border-teal-100 text-center hover:scale-[1.02] hover:shadow-sm active:scale-95 transition-all duration-300 group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-650 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
              <User className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xs text-slate-800">Manage Profile</span>
            <span className="text-[9px] text-slate-400 mt-1 font-semibold">Configure credentials & keys</span>
          </Link>
        </div>
      </div>

      {/* Two Column Layout: Recent Activities & Pending RFQs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Activity Timeline */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-sm space-y-4 text-left">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm tracking-tight">Recent Dashboard Activity</h3>
            <span className="inline-flex items-center bg-slate-50 border border-slate-150 px-2 py-0.5 rounded-full text-[9px] font-extrabold text-slate-500">
              Timeline Audit
            </span>
          </div>

          <div className="space-y-4">
            {sortedActivities.length > 0 ? (
              sortedActivities.map((act, index) => {
                let badgeStyle = 'bg-slate-150 text-slate-600';
                if (act.type === 'inquiry') badgeStyle = 'bg-blue-50 text-blue-650 border border-blue-150';
                else if (act.type === 'rfq') badgeStyle = 'bg-indigo-50 text-indigo-650 border border-indigo-150';
                else if (act.type === 'proposal') badgeStyle = 'bg-emerald-50 text-emerald-650 border border-emerald-150';
                else if (act.type === 'review') badgeStyle = 'bg-amber-50 text-amber-650 border border-amber-150';

                return (
                  <div key={index} className="flex gap-3 group relative pb-3 border-b border-slate-100/50 last:border-0 last:pb-0">
                    <div className="shrink-0 relative">
                      <div className="w-7 h-7 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-600">
                        {act.type === 'inquiry' && <ClipboardList className="w-3.5 h-3.5 text-blue-550" />}
                        {act.type === 'rfq' && <MessageSquare className="w-3.5 h-3.5 text-indigo-550" />}
                        {act.type === 'proposal' && <Sparkles className="w-3.5 h-3.5 text-emerald-555 animate-pulse" />}
                        {act.type === 'review' && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />}
                      </div>
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-extrabold text-xs text-slate-800 leading-tight">
                          {act.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                          {act.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal italic line-clamp-1">
                        "{act.desc}"
                      </p>
                      <div className="flex items-center justify-between pt-1">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase ${badgeStyle}`}>
                          {act.status}
                        </span>
                        <Link to={act.link} className="text-[9px] font-extrabold text-slate-400 hover:text-slate-800 flex items-center gap-0.5">
                          <span>Inspect</span>
                          <ArrowUpRight className="w-2.5 h-2.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs italic bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl">
                No activity found. Browse the business directory and submit requirements or post RFQ bids to get started.
              </div>
            )}
          </div>
        </div>

        {/* Pending Quotations Summary Card */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-sm space-y-4 text-left">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-sm tracking-tight">Active Quote Alerts</h3>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Listening for dealer bids"></span>
          </div>

          <div className="space-y-3">
            {openRfqs.length > 0 ? (
              openRfqs.slice(0, 3).map((rfq) => {
                const bidsCount = rfq.proposals?.length || 0;
                return (
                  <div key={rfq.id} className="p-3.5 rounded-2xl border border-slate-150 bg-slate-50/30 hover:bg-slate-50/80 transition-colors space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <span className="font-bold text-xs text-slate-950 truncate max-w-[70%]">
                        {rfq.title}
                      </span>
                      <span className="bg-amber-50 border border-amber-200 text-amber-650 px-2 py-0.5 rounded text-[9px] font-black shrink-0">
                        {rfq.budget ? `₹${rfq.budget.toLocaleString()}` : 'No Budget'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                      <span className="font-bold text-indigo-650 bg-indigo-50 border border-indigo-150 px-2 py-0.5 rounded-md">
                        {bidsCount} quote{bidsCount !== 1 ? 's' : ''} received
                      </span>
                      <Link to="/user/rfqs" className="font-extrabold text-slate-400 hover:text-slate-800 flex items-center gap-0.5">
                        <span>Open RFQ</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs italic bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-4">
                <span className="font-bold text-slate-800">No Open RFQs</span>
                <p className="text-[10px] text-slate-400 mt-1">Post a requirement RFQ to get matched with suppliers and receive proposals.</p>
                <Link to="/user/rfqs" className="mt-3.5 inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-[10px] font-bold rounded-xl text-white transition-all shadow-xs">
                  <span>Create Request</span>
                  <Plus className="w-3 h-3" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardHome;
