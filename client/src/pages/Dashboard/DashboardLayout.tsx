import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Store, ClipboardList, CreditCard, ArrowLeft, Loader2, Layers, LogOut, Tag, User, Menu, X, ChevronRight, Star, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../api/client';
import { Overview } from './Overview';
import { MyBusiness } from './MyBusiness';
import { LeadsManager } from './LeadsManager';
import { Subscriptions } from './Subscriptions';
import { RfqMarket } from './RfqMarket';
import { ProductsManager } from './ProductsManager';
import { UserProfile } from '../UserDashboard/UserProfile';
import { UserInquiries } from '../UserDashboard/UserInquiries';
import { UserReviews } from '../UserDashboard/UserReviews';
import { UserRfqs } from '../UserDashboard/UserRfqs';
import { CustomerReviews } from './CustomerReviews';

export const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, token, login, logout, loading: authLoading } = useAuth();

  // Redirect if logged in but role is not OWNER
  useEffect(() => {
    if (!authLoading && user && user.role !== 'OWNER') {
      if (user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/user', { replace: true });
      }
    }
  }, [user, authLoading, navigate]);

  // Dealer Login States
  const [dealerEmail, setDealerEmail] = useState('');
  const [dealerPassword, setDealerPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [submittingAuth, setSubmittingAuth] = useState(false);

  const handleDealerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setSubmittingAuth(true);

    try {
      const data = await apiClient.post('/auth/login', { email: dealerEmail, password: dealerPassword });

      if (data.user.role !== 'OWNER') {
        throw new Error('Access Denied: This account is not registered as a Business Owner.');
      }

      login(data.token, data.user);
      navigate('/dealersuser/profile');
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setSubmittingAuth(false);
    }
  };

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sidebarLinks = [
    { 
      name: 'Overview', 
      path: '/dealersuser', 
      icon: LayoutDashboard,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      activeColor: 'bg-gradient-to-r from-brand-600 to-brand-500 shadow-brand-500/20'
    },
    { 
      name: 'Business Profile', 
      path: '/dealersuser/profile', 
      icon: Store,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      activeColor: 'bg-gradient-to-r from-brand-600 to-brand-500 shadow-brand-500/20'
    },
    { 
      name: 'Manage Products', 
      path: '/dealersuser/products', 
      icon: Tag,
      color: 'text-rose-600 bg-rose-50 border-rose-100',
      activeColor: 'bg-gradient-to-r from-brand-600 to-brand-500 shadow-brand-500/20'
    },
    { 
      name: 'Lead Pipeline', 
      path: '/dealersuser/leads', 
      icon: ClipboardList,
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      activeColor: 'bg-gradient-to-r from-brand-600 to-brand-500 shadow-brand-500/20'
    },
    { 
      name: 'RFQ Leads Board', 
      path: '/dealersuser/rfq-market', 
      icon: Layers,
      color: 'text-violet-650 bg-violet-50 border-violet-100',
      activeColor: 'bg-gradient-to-r from-brand-600 to-brand-500 shadow-brand-500/20'
    },
    { 
      name: 'My Sent Inquiries', 
      path: '/dealersuser/my-inquiries', 
      icon: Send,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-100',
      activeColor: 'bg-gradient-to-r from-brand-600 to-brand-500 shadow-brand-500/20'
    },
    { 
      name: 'My RFQs / Requirements', 
      path: '/dealersuser/my-rfqs', 
      icon: MessageSquare,
      color: 'text-violet-600 bg-violet-50 border-violet-100',
      activeColor: 'bg-gradient-to-r from-brand-600 to-brand-500 shadow-brand-500/20'
    },
    { 
      name: 'My Reviews Posted', 
      path: '/dealersuser/my-reviews', 
      icon: Star,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      activeColor: 'bg-gradient-to-r from-brand-600 to-brand-500 shadow-brand-500/20'
    },
    { 
      name: 'Customer Reviews', 
      path: '/dealersuser/reviews', 
      icon: Star,
      color: 'text-indigo-650 bg-indigo-50 border-indigo-100',
      activeColor: 'bg-gradient-to-r from-brand-600 to-brand-500 shadow-brand-500/20'
    },
    { 
      name: 'SaaS Subscriptions', 
      path: '/dealersuser/subscriptions', 
      icon: CreditCard,
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      activeColor: 'bg-gradient-to-r from-brand-600 to-brand-500 shadow-brand-500/20'
    },
    { 
      name: 'Account Settings', 
      path: '/dealersuser/settings', 
      icon: User,
      color: 'text-teal-650 bg-teal-50 border-teal-100',
      activeColor: 'bg-gradient-to-r from-brand-600 to-brand-500 shadow-brand-500/20'
    }
  ];

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-brand-600" />
        <p className="text-sm text-slate-500 font-semibold">Verifying credentials...</p>
      </div>
    );
  }

  if (!token || !user || user.role !== 'OWNER') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center min-h-[75vh]">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 rounded-3xl overflow-hidden border border-slate-200/80 glass-panel shadow-glass">
          {/* Left Side: Marketing Text */}
          <div className="hidden md:flex md:col-span-6 bg-gradient-brand p-12 flex-col justify-between relative overflow-hidden rounded-l-3xl">
            {/* Overlay grid & glow */}
            <div className="absolute inset-0 bg-slate-950/20 mix-blend-overlay"></div>
            <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="relative z-10 space-y-2 text-left">
              <span className="text-[10px] font-extrabold tracking-widest text-indigo-200 uppercase">LocalConnect SaaS</span>
              <h2 className="text-3xl font-extrabold text-white leading-tight font-sans">
                Accelerate Your <br />
                Local Business Growth.
              </h2>
            </div>

            <div className="relative z-10 space-y-6 text-left">
              <div className="space-y-4 text-white/90 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center text-xs shrink-0 font-bold mt-0.5">✓</div>
                  <p className="leading-snug"><b>AI CRM Pipeline:</b> Auto-analyze and score client inquiries into Hot/Cold leads.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center text-xs shrink-0 font-bold mt-0.5">✓</div>
                  <p className="leading-snug"><b>AI Content Generators:</b> Generate optimized SEO descriptions and keywords in seconds.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-white/15 flex items-center justify-center text-xs shrink-0 font-bold mt-0.5">✓</div>
                  <p className="leading-snug"><b>Verification Badges:</b> Gain client trust with GSTIN and document verification steps.</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 text-white/50 text-[10px] text-left">
              © {new Date().getFullYear()} LocalConnect Workspace. Premium SaaS Portal.
            </div>
          </div>

          {/* Right Side: Login Form */}
          <div className="col-span-12 md:col-span-6 bg-white/70 p-8 flex flex-col justify-center relative overflow-hidden rounded-3xl md:rounded-r-3xl md:rounded-l-none">
            {/* Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-70 h-70 bg-brand-500/10 rounded-full blur-[90px] pointer-events-none"></div>

            <div className="relative max-w-sm w-full mx-auto space-y-6 z-10 text-left">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-brand-500/10 border border-brand-500/25 rounded-full flex items-center justify-center text-brand-600">
                  <Store className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">Dealer Authentication</h2>
                <p className="text-xs text-slate-500">Log in with your business owner credentials to access your SaaS portal.</p>
              </div>

              {authError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                  {authError}
                </div>
              )}

            <form onSubmit={handleDealerLogin} className="space-y-4">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-550 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={dealerEmail}
                  onChange={(e) => setDealerEmail(e.target.value)}
                  placeholder="e.g. rajesh@example.com"
                  className="w-full rounded-lg px-3 py-2 text-xs glass-input"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-550 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={dealerPassword}
                  onChange={(e) => setDealerPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg px-3 py-2 text-xs glass-input"
                />
              </div>

              <button
                type="submit"
                disabled={submittingAuth}
                className="w-full inline-flex items-center justify-center py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 disabled:opacity-55 transition-all shadow-md shadow-brand-600/10"
              >
                {submittingAuth ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                <span>Authenticate Dealer Account</span>
              </button>
            </form>

            <div className="text-center pt-2">
              <Link to="/" className="text-2xs text-slate-500 hover:text-slate-700 flex items-center justify-center space-x-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Directory</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:h-[calc(100vh-64px)] lg:overflow-hidden flex flex-col bg-slate-50/20">
      
      {/* Mobile Hamburger Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl m-4 mb-0 shadow-sm">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="flex items-center space-x-2 text-slate-700 hover:text-brand-600 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          <span className="font-extrabold text-xs uppercase tracking-wider">Dealer Navigation</span>
        </button>
        <span className="inline-flex items-center bg-brand-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide text-brand-600 border border-brand-200/50">
          SaaS Owner
        </span>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 lg:overflow-hidden gap-4 lg:gap-0 p-4 lg:p-0">
        
        {/* Sidebar */}
        <aside className={`lg:w-80 shrink-0 lg:h-full lg:overflow-y-auto lg:border-r border-slate-200 p-5 space-y-5 bg-white lg:rounded-none shadow-sm ${
          isMobileMenuOpen ? 'block' : 'hidden lg:block'
        }`}>
          <div className="px-1.5 pb-3.5 border-b border-slate-150 text-left">
            <h2 className="font-black text-slate-900 text-base tracking-tight">SaaS Portal</h2>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold mt-0.5">Local Business Owner</p>
          </div>

          {user && (
            <div className="px-4 py-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center space-x-3.5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-brand-500/[0.02] rounded-full blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500"></div>
              
              {/* Profile Avatar with Pulsing Online Indicator */}
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-full bg-gradient-brand text-white flex items-center justify-center text-sm font-extrabold shadow-sm border-2 border-white">
                  {user.name[0].toUpperCase()}
                </div>
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white">
                  <span className="absolute inset-0 block h-full w-full rounded-full bg-emerald-400 animate-ping opacity-75"></span>
                </span>
              </div>

              {/* User Meta Text */}
              <div className="min-w-0 flex-1 text-left">
                <div className="font-extrabold text-xs text-slate-900 truncate tracking-tight">{user.name}</div>
                <div className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">{user.email}</div>
                <div className="mt-1.5">
                  <span className="inline-flex items-center rounded bg-brand-50 px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-brand-600 border border-brand-150/50">
                    SaaS Merchant
                  </span>
                </div>
              </div>
            </div>
          )}

          <nav className="space-y-2">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 group border text-left ${
                    isActive 
                      ? `${link.activeColor} text-white border-transparent shadow-lg scale-[1.01] translate-x-0.5` 
                      : 'text-slate-655 hover:text-slate-900 bg-white hover:bg-slate-50 border-slate-150 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg border transition-all duration-300 group-hover:scale-105 shrink-0 ${
                      isActive ? 'bg-white/15 border-white/20 text-white' : link.color
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="group-hover:translate-x-0.5 transition-transform">{link.name}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 opacity-60 transition-transform ${
                    isActive ? 'translate-x-0.5 text-white' : 'group-hover:translate-x-1 text-slate-400'
                  }`} />
                </Link>
              );
            })}
          </nav>

          <hr className="border-slate-150" />

          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-3 py-2 rounded-xl text-[11px] font-extrabold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all text-left"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>Return to Home</span>
            </Link>

            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-[11px] font-extrabold text-red-650 hover:text-red-750 hover:bg-red-50/50 transition-all text-left"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Dashboard Content Outlet */}
        <main className="flex-1 lg:h-full lg:overflow-y-auto p-4 lg:p-8 space-y-6 bg-slate-50/30">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/profile" element={<MyBusiness />} />
            <Route path="/products" element={<ProductsManager />} />
            <Route path="/leads" element={<LeadsManager />} />
            <Route path="/rfq-market" element={<RfqMarket />} />
            <Route path="/my-inquiries" element={<UserInquiries />} />
            <Route path="/my-rfqs" element={<UserRfqs />} />
            <Route path="/my-reviews" element={<UserReviews />} />
            <Route path="/reviews" element={<CustomerReviews />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/settings" element={<UserProfile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
