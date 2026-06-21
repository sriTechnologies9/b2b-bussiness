import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Star, ArrowLeft, ClipboardList, User, MessageSquare, LogOut, Menu, X, ChevronRight, LayoutDashboard, Store } from 'lucide-react';

import { UserDashboardHome } from './UserDashboardHome';
import { UserInquiries } from './UserInquiries';
import { UserReviews } from './UserReviews';
import { UserProfile } from './UserProfile';
import { UserRfqs } from './UserRfqs';
import { BecomeDealer } from './BecomeDealer';

export const UserDashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Redirect if logged in but role is not CUSTOMER
  useEffect(() => {
    if (user && user.role !== 'CUSTOMER') {
      if (user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'OWNER') {
        navigate('/dealersuser', { replace: true });
      }
    }
  }, [user, navigate]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) return null;

  const sidebarLinks = [
    { 
      name: 'Dashboard Home', 
      path: '/user', 
      icon: LayoutDashboard, 
      color: 'text-brand-600 bg-brand-50 border-brand-100',
      activeColor: 'bg-gradient-to-r from-brand-600 to-indigo-650 shadow-brand-500/20'
    },
    { 
      name: 'My Lead Inquiries', 
      path: '/user/inquiries', 
      icon: ClipboardList, 
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      activeColor: 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-blue-500/20'
    },
    { 
      name: 'My RFQs / Bids', 
      path: '/user/rfqs', 
      icon: MessageSquare, 
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      activeColor: 'bg-gradient-to-r from-indigo-600 to-violet-650 shadow-indigo-500/20'
    },
    { 
      name: 'My Reviews', 
      path: '/user/reviews', 
      icon: Star, 
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      activeColor: 'bg-gradient-to-r from-amber-500 to-yellow-500 shadow-amber-500/20'
    },
    { 
      name: 'Become a Dealer', 
      path: '/user/become-dealer', 
      icon: Store, 
      color: 'text-purple-600 bg-purple-50 border-purple-100',
      activeColor: 'bg-gradient-to-r from-purple-650 to-indigo-600 shadow-purple-500/20'
    },
    { 
      name: 'Profile Details', 
      path: '/user/profile', 
      icon: User, 
      color: 'text-teal-600 bg-teal-50 border-teal-100',
      activeColor: 'bg-gradient-to-r from-teal-650 to-emerald-600 shadow-teal-500/20'
    }
  ];

  return (
    <div className="w-full lg:h-[calc(100vh-64px)] lg:overflow-hidden flex flex-col bg-slate-50/20">
      
      {/* Mobile Hamburger Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl m-4 mb-0 shadow-sm">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="flex items-center space-x-2 text-slate-700 hover:text-brand-600 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          <span className="font-extrabold text-xs uppercase tracking-wider">User Navigation</span>
        </button>
        <span className="inline-flex items-center bg-emerald-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide text-emerald-600 border border-emerald-250/50">
          Client Portal
        </span>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 lg:overflow-hidden gap-4 lg:gap-0 p-4 lg:p-0">
        
        {/* Sidebar */}
        <aside className={`lg:w-80 shrink-0 lg:h-full lg:overflow-y-auto lg:border-r border-slate-200 p-5 space-y-5 bg-white lg:rounded-none shadow-sm ${
          isMobileMenuOpen ? 'block' : 'hidden lg:block'
        }`}>
          <div className="px-1.5 pb-3.5 border-b border-slate-150">
            <h2 className="font-black text-slate-900 text-base tracking-tight text-left">Customer Portal</h2>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold mt-0.5 text-left">User settings panel</p>
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
                  <span className="inline-flex items-center rounded bg-emerald-50 px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-emerald-600 border border-emerald-150/50">
                    Verified Customer
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
              <span>Return to Directory</span>
            </Link>

            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-[11px] font-extrabold text-red-650 hover:text-red-755 hover:bg-red-50/50 transition-all text-left"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Panel Content Outlet */}
        <main className="flex-1 lg:h-full lg:overflow-y-auto p-4 lg:p-8 space-y-6 bg-slate-50/30">
          <Routes>
            <Route path="/" element={<UserDashboardHome />} />
            <Route path="/inquiries" element={<UserInquiries />} />
            <Route path="/rfqs" element={<UserRfqs />} />
            <Route path="/reviews" element={<UserReviews />} />
            <Route path="/become-dealer" element={<BecomeDealer />} />
            <Route path="/profile" element={<UserProfile />} />
          </Routes>
        </main>

      </div>
    </div>
  );
};

export default UserDashboardLayout;
