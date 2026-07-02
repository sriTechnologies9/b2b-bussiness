import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserProfile } from '../UserDashboard/UserProfile';
import { apiClient } from '../../api/client';
import { UsersTab } from './tabs/UsersTab';
import { RfqsTab } from './tabs/RfqsTab';
import { ReviewsTab } from './tabs/ReviewsTab';
import { CategoriesTab } from './tabs/CategoriesTab';
import { 
  ShieldCheck, Store, ArrowLeft, CheckCircle, XCircle, Loader2, LogOut, X, Sparkles, Plus, 
  Menu, Users, FileText, MessageSquare, Tags, BarChart3, Trash2, Edit3, ChevronRight, User, ClipboardList,
  Image
} from 'lucide-react';


export const AdminDashboardLayout: React.FC = () => {
  const { user, token, login, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if logged in but role is not ADMIN
  useEffect(() => {
    if (!authLoading && user && user.role !== 'ADMIN') {
      if (user.role === 'OWNER') {
        navigate('/dealersuser', { replace: true });
      } else {
        navigate('/user', { replace: true });
      }
    }
  }, [user, authLoading, navigate]);

  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'listings' | 'users' | 'rfqs' | 'reviews' | 'analytics' | 'categories' | 'profile' | 'dealerRequests' | 'sliders'>(
    (location.state as any)?.tab || 'listings'
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sidebarLinks = [
    { 
      name: 'Manage Listings', 
      tab: 'listings' as const, 
      icon: Store, 
      color: 'text-rose-600 bg-rose-50 border-rose-100',
      activeColor: 'bg-gradient-to-r from-rose-600 to-pink-600 shadow-rose-500/20'
    },
    { 
      name: 'Dealer Requests', 
      tab: 'dealerRequests' as const, 
      icon: ClipboardList, 
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      activeColor: 'bg-gradient-to-r from-rose-600 to-pink-600 shadow-rose-500/20'
    },
    { 
      name: 'Manage Users', 
      tab: 'users' as const, 
      icon: Users, 
      color: 'text-blue-600 bg-blue-50 border-blue-100',
      activeColor: 'bg-gradient-to-r from-rose-600 to-pink-600 shadow-rose-500/20'
    },
    { 
      name: 'Manage RFQs', 
      tab: 'rfqs' as const, 
      icon: FileText, 
      color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      activeColor: 'bg-gradient-to-r from-rose-600 to-pink-600 shadow-rose-500/20'
    },
    { 
      name: 'Manage Reviews', 
      tab: 'reviews' as const, 
      icon: MessageSquare, 
      color: 'text-amber-600 bg-amber-50 border-amber-100',
      activeColor: 'bg-gradient-to-r from-rose-600 to-pink-600 shadow-rose-500/20'
    },
    { 
      name: 'Manage Categories', 
      tab: 'categories' as const, 
      icon: Tags, 
      color: 'text-teal-655 bg-teal-50 border-teal-100',
      activeColor: 'bg-gradient-to-r from-rose-600 to-pink-600 shadow-rose-500/20'
    },
    { 
      name: 'Manage Sliders', 
      tab: 'sliders' as const, 
      icon: Image, 
      color: 'text-indigo-650 bg-indigo-50 border-indigo-105',
      activeColor: 'bg-gradient-to-r from-rose-600 to-pink-600 shadow-rose-500/20'
    },
    { 
      name: 'Platform Analytics', 
      tab: 'analytics' as const, 
      icon: BarChart3, 
      color: 'text-purple-650 bg-purple-50 border-purple-100',
      activeColor: 'bg-gradient-to-r from-rose-600 to-pink-600 shadow-rose-500/20'
    },
    { 
      name: 'Admin Profile', 
      tab: 'profile' as const, 
      icon: User, 
      color: 'text-teal-650 bg-teal-50 border-teal-100',
      activeColor: 'bg-gradient-to-r from-rose-600 to-pink-600 shadow-rose-500/20'
    }
  ];

  // Listings Tab States
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Users Tab States (Moved to UsersTab component)


  // Dealer Requests Tab States
  const [dealerRequests, setDealerRequests] = useState<any[]>([]);
  const [dealerRequestsLoading, setDealerRequestsLoading] = useState(false);

  // RFQs Tab States (Moved to RfqsTab component)

  // Reviews Tab States (Moved to ReviewsTab component)

  // Stats / Analytics States
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Admin Login States
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [submittingAuth, setSubmittingAuth] = useState(false);

  // Category Modal States (Moved to CategoriesTab)

  // System Logs States
  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] [System] Server initialized successfully on port 5000.`,
    `[${new Date().toLocaleTimeString()}] [Database] SQLite database connected.`,
    `[${new Date().toLocaleTimeString()}] [Security] Enforcing strict dashboard role checks.`
  ]);

  const addLog = (message: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev]);
  };

  // Sliders Tab States
  const [sliders, setSliders] = useState<any[]>([]);
  const [slidersLoading, setSlidersLoading] = useState(false);
  const [isSliderModalOpen, setIsSliderModalOpen] = useState(false);
  const [selectedSliderIndex, setSelectedSliderIndex] = useState<number | null>(null);
  
  // Slider form data state
  const [sliderForm, setSliderForm] = useState({
    badge: '',
    title: '',
    desc: '',
    actionText: '',
    actionLink: '',
    image: '',
    icon: 'Sparkles',
    bgClass: 'from-slate-955 via-slate-900 to-indigo-950/95',
    accentColor: 'border-brand-500/20 text-brand-450 bg-brand-500/10'
  });

  // Fetch sliders
  const fetchSliders = async () => {
    if (!token) return;
    setSlidersLoading(true);
    try {
      const data = await apiClient.get('/businesses/sliders/all');
      setSliders(data);
      addLog(`[Audit] Loaded sliders list. Found ${data.length} banners.`);
    } catch (err) {
      console.error('Failed to fetch sliders', err);
      addLog(`[Error] Failed to load sliders.`);
    } finally {
      setSlidersLoading(false);
    }
  };

  // Save sliders back to backend
  const saveSliders = async (updatedSliders: any[]) => {
    try {
      await apiClient.post('/businesses/sliders/manage', { sliders: updatedSliders });
      setSliders(updatedSliders);
      addLog(`[Audit] Dynamic home hero sliders saved successfully.`);
      return true;
    } catch (err: any) {
      console.error('Failed to save sliders', err);
      addLog(`[Error] Failed to save sliders: ${err.message}`);
      alert(err.message || 'Failed to save sliders');
      return false;
    }
  };

  const handleSliderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedSliders = [...sliders];
    if (selectedSliderIndex !== null) {
      updatedSliders[selectedSliderIndex] = sliderForm;
    } else {
      updatedSliders.push(sliderForm);
    }
    const success = await saveSliders(updatedSliders);
    if (success) {
      setIsSliderModalOpen(false);
      resetSliderForm();
    }
  };

  const deleteSlider = async (index: number) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) return;
    const updatedSliders = sliders.filter((_, i) => i !== index);
    await saveSliders(updatedSliders);
  };

  const openEditSlider = (index: number) => {
    setSelectedSliderIndex(index);
    setSliderForm(sliders[index]);
    setIsSliderModalOpen(true);
  };

  const openAddSlider = () => {
    setSelectedSliderIndex(null);
    resetSliderForm();
    setIsSliderModalOpen(true);
  };

  const resetSliderForm = () => {
    setSliderForm({
      badge: '',
      title: '',
      desc: '',
      actionText: '',
      actionLink: '',
      image: '',
      icon: 'Sparkles',
      bgClass: 'from-slate-955 via-slate-900 to-indigo-950/95',
      accentColor: 'border-brand-500/20 text-brand-450 bg-brand-500/10'
    });
  };


  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setSubmittingAuth(true);

    try {
      const data = await apiClient.post('/auth/login', { email: adminEmail, password: adminPassword });
      
      if (data.user.role !== 'ADMIN') {
        throw new Error('Access Denied: You do not have administrator privileges.');
      }

      login(data.token, data.user);
      setActiveTab('profile');
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setSubmittingAuth(false);
    }
  };

  // 1. Fetch Listings & Categories (Runs on Listings or Categories Tab)
  const loadAdminData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await apiClient.get('/businesses?status=ALL');
      setBusinesses(data);
      addLog(`[Audit] Fetched listing database. Found ${data.length} listings.`);

      const dataCats = await apiClient.get('/businesses/categories');
      setCategories(dataCats);
      addLog(`[Audit] Fetched categories. Found ${dataCats.length} active tags.`);
    } catch (err) {
      console.error(err);
      addLog(`[Error] Failed to fetch admin data.`);
    } finally {
      setLoading(false);
    }
  };

  // 2. Fetch Users (Moved to UsersTab component)

  // 3. Fetch RFQs (Moved to RfqsTab component)

  // 4. Fetch Reviews (Moved to ReviewsTab component)

  // 5. Fetch Platform Stats (Runs on Analytics Tab)
  const fetchStats = async () => {
    if (!token) return;
    setStatsLoading(true);
    try {
      const data = await apiClient.get('/admin/stats');
      setStats(data);
      addLog(`[Audit] Pulled system growth analytics and role distributions.`);
    } catch (err) {
      console.error('Failed to fetch stats', err);
      addLog(`[Error] Failed to load statistics.`);
    } finally {
      setStatsLoading(false);
    }
  };

  // 6. Fetch Dealer Requests (Runs on Dealer Requests Tab)
  const fetchDealerRequests = async () => {
    if (!token) return;
    setDealerRequestsLoading(true);
    try {
      const data = await apiClient.get('/admin/dealer-requests');
      setDealerRequests(data);
      addLog(`[Audit] Loaded dealer requests list. Found ${data.length} entries.`);
    } catch (err) {
      console.error('Failed to fetch dealer requests', err);
      addLog(`[Error] Failed to load dealer requests.`);
    } finally {
      setDealerRequestsLoading(false);
    }
  };

  // Tab routing driver
  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      if (activeTab === 'listings') {
        loadAdminData();
      } else if (activeTab === 'categories') {
        loadAdminData();
      } else if (activeTab === 'analytics') {
        fetchStats();
      } else if (activeTab === 'dealerRequests') {
        fetchDealerRequests();
      } else if (activeTab === 'sliders') {
        fetchSliders();
      }
    }
  }, [activeTab, token, user]);

  // Actions: Approve dealer request
  const approveDealerRequest = async (id: string, bizName: string) => {
    try {
      const data = await apiClient.post(`/admin/dealer-requests/${id}/approve`, {});
      setDealerRequests(prev => prev.map(r => r.id === id ? {
        ...r,
        status: 'APPROVED',
        generatedEmail: data.request.generatedEmail,
        generatedPass: data.request.generatedPass
      } : r));
      addLog(`[Audit] Approved dealer request for "${bizName}". Credentials generated.`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to approve request');
      addLog(`[Error] Failed to approve dealer request for "${bizName}": ${err.message}`);
    }
  };

  // Actions: Reject dealer request
  const rejectDealerRequest = async (id: string, bizName: string) => {
    try {
      const data = await apiClient.post(`/admin/dealer-requests/${id}/reject`, {});
      setDealerRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'REJECTED' } : r));
      addLog(`[Audit] Rejected dealer request for "${bizName}".`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to reject request');
      addLog(`[Error] Failed to reject dealer request for "${bizName}": ${err.message}`);
    }
  };

  // Actions: Verify listing
  const verifyListing = async (id: string, name: string) => {
    try {
      await apiClient.post(`/businesses/${id}/verify`, {});
      setBusinesses(prev => prev.map(b => b.id === id ? { ...b, status: 'VERIFIED' } : b));
      addLog(`[Audit] Listing "${name}" status updated to VERIFIED.`);
    } catch (err: any) {
      console.error(err);
      addLog(`[Error] Failed to verify listing "${name}".`);
    }
  };

  // Actions: Reject listing
  const rejectListing = async (id: string, name: string) => {
    try {
      await apiClient.put(`/businesses/${id}`, { status: 'REJECTED' });
      setBusinesses(prev => prev.map(b => b.id === id ? { ...b, status: 'REJECTED' } : b));
      addLog(`[Audit] Listing "${name}" status updated to REJECTED.`);
    } catch (err: any) {
      console.error(err);
      addLog(`[Error] Failed to reject listing "${name}".`);
    }
  };

  // Actions: Delete business listing
  const deleteBusiness = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete business "${name}"? This action is permanent.`)) return;
    try {
      await apiClient.delete(`/businesses/${id}`);
      setBusinesses(prev => prev.filter(b => b.id !== id));
      addLog(`[Audit] Deleted business listing "${name}".`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to delete listing');
      addLog(`[Error] Failed to delete business listing "${name}".`);
    }
  };

  // Actions: Change user role (Moved to UsersTab component)
  // Actions: Delete user (Moved to UsersTab component)

  // Actions: Delete RFQ (Moved to RfqsTab component)

  // Actions: Delete Review (Moved to ReviewsTab component)

  // Actions: Edit Category (Moved to CategoriesTab)
  // Actions: Delete Category (Moved to CategoriesTab)
  // Action: Create Category (Moved to CategoriesTab)

  if (authLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-rose-600" />
        <p className="text-sm text-slate-500 font-semibold">Verifying credentials...</p>
      </div>
    );
  }

  // Not authenticated as ADMIN view
  if (!token || !user || user.role !== 'ADMIN') {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center min-h-[75vh]">
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 rounded-3xl overflow-hidden border border-slate-200/80 glass-panel shadow-glass bg-white">
          <div className="hidden md:flex md:col-span-6 bg-gradient-dark p-12 flex-col justify-between relative overflow-hidden border-r border-slate-200 bg-slate-50/20 rounded-l-3xl">
            <div className="absolute inset-0 bg-slate-950/5 mix-blend-overlay"></div>
            <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-rose-500/5 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="relative z-10 space-y-2 text-left">
              <span className="text-[10px] font-extrabold tracking-widest text-rose-600 uppercase">Administration Center</span>
              <h2 className="text-3xl font-extrabold text-slate-900 leading-tight font-sans">
                Control & Manage <br />
                LocalConnect Directory.
              </h2>
            </div>

            <div className="relative z-10 space-y-6 text-left">
              <div className="space-y-4 text-slate-700 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-rose-50 flex items-center justify-center text-xs shrink-0 font-bold mt-0.5 text-rose-600">✓</div>
                  <p className="leading-snug"><b>Listings Audits:</b> Review business listing submissions and activate verified profiles.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-rose-50 flex items-center justify-center text-xs shrink-0 font-bold mt-0.5 text-rose-600">✓</div>
                  <p className="leading-snug"><b>Moderation Center:</b> Decline or ban fraudulent profiles to keep the marketplace safe.</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 rounded-full bg-rose-50 flex items-center justify-center text-xs shrink-0 font-bold mt-0.5 text-rose-600">✓</div>
                  <p className="leading-snug"><b>Relational Reporting:</b> Verify users, reviews, leads flow, and system metrics.</p>
                </div>
              </div>
            </div>

            <div className="relative z-10 text-slate-500 text-[10px] text-left">
              © {new Date().getFullYear()} LocalConnect Platform. Administrator Control.
            </div>
          </div>

          <div className="col-span-12 md:col-span-6 bg-white/70 p-8 flex flex-col justify-center relative overflow-hidden rounded-3xl md:rounded-r-3xl md:rounded-l-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-70 h-70 bg-rose-500/10 rounded-full blur-[90px] pointer-events-none"></div>

            <div className="relative max-w-sm w-full mx-auto space-y-6 z-10 text-left">
              <div className="space-y-2">
                <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/25 rounded-full flex items-center justify-center text-rose-600">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h2 className="text-xl font-extrabold text-slate-900">Admin Authentication</h2>
                <p className="text-xs text-slate-500">Log in with super administrator credentials to manage directories.</p>
              </div>

              {authError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs">
                  {authError}
                </div>
              )}

              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-555 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="e.g. admin@example.com"
                    className="w-full rounded-lg px-3 py-2 text-xs glass-input"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-555 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg px-3 py-2 text-xs glass-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingAuth}
                  className="w-full inline-flex items-center justify-center py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-55 transition-all shadow-md shadow-rose-600/10"
                >
                  {submittingAuth ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  <span>Authenticate Administrator</span>
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
          className="flex items-center space-x-2 text-slate-700 hover:text-rose-600 transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          <span className="font-extrabold text-xs uppercase tracking-wider">Admin Navigation</span>
        </button>
        <span className="inline-flex items-center bg-rose-50 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide text-rose-600 border border-rose-250/50">
          Super Admin
        </span>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 lg:overflow-hidden gap-4 lg:gap-0 p-4 lg:p-0">
        
        {/* Sidebar */}
        <aside className={`lg:w-80 shrink-0 lg:h-full lg:overflow-y-auto lg:border-r border-slate-200 p-5 space-y-5 bg-white lg:rounded-none shadow-sm ${
          isMobileMenuOpen ? 'block' : 'hidden lg:block'
        }`}>
          <div className="px-1.5 pb-3.5 border-b border-slate-150 text-left">
            <h2 className="font-black text-slate-900 text-base tracking-tight flex items-center space-x-1.5">
              <ShieldCheck className="w-5 h-5 text-rose-600" />
              <span>Admin Center</span>
            </h2>
            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-extrabold mt-0.5">Super Administrator</p>
          </div>

          {user && (
            <div className="px-4 py-4 rounded-none bg-white border border-slate-200 shadow-2xs flex items-center space-x-3.5 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-rose-500/[0.02] rounded-none blur-xl pointer-events-none group-hover:scale-150 transition-transform duration-500"></div>
              
              {/* Profile Avatar with Pulsing Online Indicator */}
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-none bg-gradient-to-r from-rose-600 to-pink-650 text-white flex items-center justify-center text-sm font-extrabold shadow-sm border-2 border-white">
                  {user.name[0].toUpperCase()}
                </div>
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-none bg-emerald-500 ring-2 ring-white">
                  <span className="absolute inset-0 block h-full w-full rounded-none bg-emerald-400 animate-ping opacity-75"></span>
                </span>
              </div>

              {/* User Meta Text */}
              <div className="min-w-0 flex-1 text-left">
                <div className="font-extrabold text-xs text-slate-900 truncate tracking-tight">{user.name}</div>
                <div className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">{user.email}</div>
                <div className="mt-1.5">
                  <span className="inline-flex items-center rounded-none bg-rose-50 px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-rose-655 border border-rose-150/50">
                    System Director
                  </span>
                </div>
              </div>
            </div>
          )}

          <nav className="space-y-2">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeTab === link.tab;
              return (
                <button
                  key={link.tab}
                  onClick={() => { setActiveTab(link.tab); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-none text-xs font-bold transition-all duration-300 group border text-left ${
                    isActive 
                      ? `${link.activeColor} text-white border-transparent shadow-lg scale-[1.01] translate-x-0.5` 
                      : 'text-slate-655 hover:text-slate-900 bg-white hover:bg-slate-50 border-slate-150 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-none border transition-all duration-300 group-hover:scale-105 shrink-0 ${
                      isActive ? 'bg-white/15 border-white/20 text-white' : link.color
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="group-hover:translate-x-0.5 transition-transform">{link.name}</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 opacity-60 transition-transform ${
                    isActive ? 'translate-x-0.5 text-white' : 'group-hover:translate-x-1 text-slate-400'
                  }`} />
                </button>
              );
            })}
          </nav>

          <hr className="border-slate-150" />

          <div className="space-y-1">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center space-x-3 px-3 py-2 rounded-none text-[11px] font-extrabold text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all text-left"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              <span>Return to Directory</span>
            </Link>

            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-none text-[11px] font-extrabold text-red-650 hover:text-red-750 hover:bg-red-50/50 transition-all text-left"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Admin Content Area */}
        <main className="flex-1 lg:h-full lg:overflow-y-auto p-4 lg:p-8 space-y-6 bg-slate-50/30">
          
          {/* TAB 1: LISTINGS MANAGER */}
          {activeTab === 'listings' && (
            <div className="space-y-6">
              <div className="text-left">
                <h1 className="text-2xl font-extrabold text-slate-900">Marketplace Listings Manager</h1>
                <p className="text-xs text-slate-500 mt-1">Review, approve, verify or reject registered local business profiles.</p>
              </div>

              {/* Top Metrics Cards */}
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
                  
                  {/* Listings Table */}
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

                  {/* System Audit Logs */}
                  <div className="xl:col-span-4 space-y-6 text-left">
                    <div className="rounded-none glass-panel border border-slate-200 p-5 space-y-4 shadow-glass bg-white">
                      <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider flex items-center space-x-1">
                        <Sparkles className="w-4 h-4 text-rose-600" />
                        <span>Quick Actions</span>
                      </h3>
                      <button
                        onClick={() => setActiveTab('categories')}
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
          )}

          {/* TAB 2: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <UsersTab addLog={addLog} />
          )}

          {/* TAB 3: RFQ MODERATION */}
          {activeTab === 'rfqs' && (
            <RfqsTab addLog={addLog} />
          )}

          {/* TAB 4: REVIEWS MODERATION */}
          {activeTab === 'reviews' && (
            <ReviewsTab addLog={addLog} />
          )}

          {/* TAB 5: CATEGORIES TAXONOMY */}
          {activeTab === 'categories' && (
            <CategoriesTab addLog={addLog} />
          )}

          {/* TAB 6: PLATFORM ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 text-left">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">Analytics & Growth Metrics</h1>
                <p className="text-xs text-slate-500 mt-1">Real-time statistics covering user engagement, business listings ratios, and SaaS subscription breakdowns.</p>
              </div>

              {statsLoading || !stats ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in-50 duration-300">
                  {/* Top Stats Overview */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    <div className="p-5 rounded-none glass-panel border border-slate-200 bg-white shadow-glass-sm space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Total Registered Users</span>
                      <div className="text-3xl font-black text-slate-900">{stats.overview.totalUsers}</div>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-none">
                        +{stats.growth.newUsersThisMonth} this month
                      </span>
                    </div>

                    <div className="p-5 rounded-none glass-panel border border-slate-200 bg-white shadow-glass-sm space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Local Business Listings</span>
                      <div className="text-3xl font-black text-slate-900">{stats.overview.totalBusinesses}</div>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-none">
                        +{stats.growth.newBusinessesThisMonth} this month
                      </span>
                    </div>

                    <div className="p-5 rounded-none glass-panel border border-slate-200 bg-white shadow-glass-sm space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">CRM Leads Exchanged</span>
                      <div className="text-3xl font-black text-slate-900">{stats.overview.totalLeads}</div>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-none">
                        +{stats.growth.newLeadsThisMonth} this month
                      </span>
                    </div>

                    <div className="p-5 rounded-none glass-panel border border-slate-200 bg-white shadow-glass-sm space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Procurement RFQs Posted</span>
                      <div className="text-3xl font-black text-slate-900">{stats.overview.totalRfqs}</div>
                      <span className="text-[10px] text-slate-500 font-bold bg-slate-100 px-1.5 py-0.5 rounded-none">
                        {stats.status.openRfqs} active open RFQs
                      </span>
                    </div>

                    <div className="p-5 rounded-none glass-panel border border-slate-200 bg-white shadow-glass-sm space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Ratings & Reviews Moderated</span>
                      <div className="text-3xl font-black text-slate-900">{stats.overview.totalReviews}</div>
                      <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded-none">
                        ★ Directory feedback loop
                      </span>
                    </div>

                    <div className="p-5 rounded-none glass-panel border border-slate-200 bg-white shadow-glass-sm space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Connected Storefront Products</span>
                      <div className="text-3xl font-black text-slate-900">{stats.overview.totalProducts}</div>
                      <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded-none">
                        Marketplace inventory
                      </span>
                    </div>
                  </div>

                  {/* Distribution Breakdowns (CSS Horizontal Charts) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    {/* User Roles & Subscriptions */}
                    <div className="p-6 rounded-none glass-panel border border-slate-200 bg-white shadow-glass space-y-6">
                      <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-100 pb-3">
                        User Base & Subscription Levels
                      </h3>

                      {/* User Roles Breakdown */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Account Role Breakdown</h4>
                        {Object.entries(stats.breakdown.usersByRole || {}).map(([role, count]: any) => {
                          const percent = Math.round((count / stats.overview.totalUsers) * 100) || 0;
                          return (
                            <div key={role} className="space-y-1 text-xs">
                              <div className="flex justify-between font-bold text-slate-700">
                                <span className="uppercase">{role}</span>
                                <span>{count} ({percent}%)</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-none h-2 overflow-hidden border border-slate-200/40">
                                <div className="h-full rounded-none bg-rose-600" style={{ width: `${percent}%` }}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Subscriptions breakdown */}
                      <div className="space-y-3 pt-3">
                        <h4 className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Active SaaS Subscription Plans</h4>
                        {['FREE', 'BASIC', 'PRO', 'PREMIUM'].map((plan) => {
                          const count = stats.breakdown.subscriptionsByPlan[plan] || 0;
                          const totalSubs = Object.values(stats.breakdown.subscriptionsByPlan).reduce((a: any, b: any) => a + b, 0) as number;
                          const percent = Math.round((count / totalSubs) * 100) || 0;
                          return (
                            <div key={plan} className="space-y-1 text-xs">
                              <div className="flex justify-between font-bold text-slate-700">
                                <span className="uppercase">{plan} Plan</span>
                                <span>{count} ({percent}%)</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-none h-2 overflow-hidden border border-slate-200/40">
                                <div className="h-full rounded-none bg-indigo-600" style={{ width: `${percent}%` }}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* CRM Leads Scoring & Listings Status */}
                    <div className="p-6 rounded-none glass-panel border border-slate-200 bg-white shadow-glass space-y-6">
                      <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider border-b border-slate-100 pb-3">
                        CRM Leads Quality & Listings Audit
                      </h3>

                      {/* CRM Scoring breakdown */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">AI Lead Priority Scoring (CRM Flow)</h4>
                        {['HOT', 'WARM', 'COLD'].map((score) => {
                          const count = stats.breakdown.leadsByScore[score] || 0;
                          const percent = Math.round((count / stats.overview.totalLeads) * 100) || 0;
                          return (
                            <div key={score} className="space-y-1 text-xs">
                              <div className="flex justify-between font-bold text-slate-700">
                                <span className="uppercase">{score}</span>
                                <span>{count} ({percent}%)</span>
                              </div>
                              <div className="w-full bg-slate-100 rounded-none h-2 overflow-hidden border border-slate-200/40">
                                <div className={`h-full rounded-none ${
                                  score === 'HOT' ? 'bg-amber-500' : score === 'WARM' ? 'bg-indigo-500' : 'bg-slate-400'
                                }`} style={{ width: `${percent}%` }}></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Verification Audit status */}
                      <div className="space-y-3 pt-3">
                        <h4 className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Business Listing Approval Rates</h4>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                          <div className="p-3 bg-emerald-50 border border-emerald-150 rounded-none">
                            <span className="block font-black text-emerald-600 text-lg">
                              {Math.round((stats.status.verifiedBusinesses / stats.overview.totalBusinesses) * 100) || 0}%
                            </span>
                            <span className="text-[9px] uppercase font-bold text-emerald-600/80">Approved</span>
                          </div>
                          <div className="p-3 bg-amber-50 border border-amber-150 rounded-none">
                            <span className="block font-black text-amber-600 text-lg">
                              {Math.round((stats.status.pendingBusinesses / stats.overview.totalBusinesses) * 100) || 0}%
                            </span>
                            <span className="text-[9px] uppercase font-bold text-amber-600/80">Pending</span>
                          </div>
                          <div className="p-3 bg-rose-50 border border-rose-150 rounded-none">
                            <span className="block font-black text-rose-600 text-lg">
                              {Math.round(((stats.overview.totalBusinesses - stats.status.verifiedBusinesses - stats.status.pendingBusinesses) / stats.overview.totalBusinesses) * 100) || 0}%
                            </span>
                            <span className="text-[9px] uppercase font-bold text-rose-600/80">Rejected</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: ADMIN PROFILE */}
          {activeTab === 'profile' && (
            <UserProfile />
          )}

          {/* TAB 8: DEALER REQUESTS */}
          {activeTab === 'dealerRequests' && (
            <div className="space-y-6 text-left">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 font-sans">Dealer Onboarding Requests</h1>
                <p className="text-xs text-slate-500 mt-1">Review merchant requests to upgrade. Approving them will automatically generate dealer login credentials and set up their storefront.</p>
              </div>

              {dealerRequestsLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm animate-in fade-in-50 duration-200">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50/65 border-b border-slate-150 text-slate-655 uppercase tracking-wider font-extrabold">
                          <th className="p-4">Customer</th>
                          <th className="p-4">Business Details</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Generated Credentials</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {dealerRequests.length > 0 ? (
                          dealerRequests.map((req) => (
                            <tr key={req.id} className="hover:bg-slate-50/30 transition-colors">
                              <td className="p-4">
                                <div className="font-extrabold text-slate-900">{req.user?.name}</div>
                                <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{req.user?.email}</div>
                                <div className="text-[9px] text-slate-400 mt-1">Applied: {new Date(req.createdAt).toLocaleDateString()}</div>
                              </td>
                              <td className="p-4">
                                <div className="font-extrabold text-slate-800 text-xs">{req.businessName}</div>
                                <div className="text-[10px] text-slate-455 mt-0.5">{req.contactEmail}</div>
                                <div className="text-[10px] text-slate-455 mt-0.5">{req.contactPhone}</div>
                              </td>
                              <td className="p-4 whitespace-nowrap">
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] text-slate-600 font-bold uppercase tracking-wide">
                                  {req.categoryName}
                                </span>
                              </td>
                              <td className="p-4">
                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${
                                  req.status === 'APPROVED' 
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-250'
                                    : req.status === 'REJECTED'
                                    ? 'bg-rose-50 text-rose-600 border-rose-250'
                                    : 'bg-amber-50 text-amber-605 border-amber-250'
                                }`}>
                                  {req.status}
                                </span>
                              </td>
                              <td className="p-4 font-mono text-[10px]">
                                {req.status === 'APPROVED' ? (
                                  <div className="space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-150 max-w-xs">
                                    <div><span className="text-slate-400 font-sans font-bold">Email:</span> <span className="font-bold text-slate-800">{req.generatedEmail}</span></div>
                                    <div><span className="text-slate-400 font-sans font-bold">Pass:</span> <span className="font-bold text-slate-800">{req.generatedPass}</span></div>
                                  </div>
                                ) : req.status === 'REJECTED' ? (
                                  <span className="text-slate-400 italic">Disapproved</span>
                                ) : (
                                  <span className="text-slate-400 italic">Pending Approval</span>
                                )}
                              </td>
                              <td className="p-4 text-right whitespace-nowrap">
                                {req.status === 'PENDING' ? (
                                  <div className="flex justify-end space-x-1.5">
                                    <button
                                      onClick={() => approveDealerRequest(req.id, req.businessName)}
                                      className="inline-flex items-center justify-center px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-2xs shadow-sm transition-colors"
                                    >
                                      Approve
                                    </button>
                                    <button
                                      onClick={() => rejectDealerRequest(req.id, req.businessName)}
                                      className="inline-flex items-center justify-center px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-2xs shadow-sm transition-colors"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-slate-400 italic text-[10px]">Processed</span>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                              No dealer requests found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 9: HERO SLIDER BANNER MANAGER */}
          {activeTab === 'sliders' && (
            <div className="space-y-6 text-left animate-in fade-in-50 duration-200">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 font-sans">Home Hero Sliders Manager</h1>
                  <p className="text-xs text-slate-500 mt-1">Configure and manage home hero slider banners. Add dynamic marketing images, action links, and badges.</p>
                </div>
                <button
                  onClick={openAddSlider}
                  className="inline-flex items-center space-x-1 px-4 py-2 rounded-none text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/10 transition-all"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  <span>Add New Slide</span>
                </button>
              </div>

              {slidersLoading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
                </div>
              ) : (
                <div className="rounded-none glass-panel border border-slate-200 overflow-hidden bg-white shadow-glass-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50/65 border-b border-slate-150 text-slate-655 uppercase tracking-wider font-extrabold">
                          <th className="p-4">Banner Preview</th>
                          <th className="p-4">Badge & Title</th>
                          <th className="p-4">Description</th>
                          <th className="p-4">Action Button Info</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {sliders.length > 0 ? (
                          sliders.map((slide, index) => (
                            <tr key={index} className="hover:bg-slate-50/30 transition-colors">
                              <td className="p-4 w-28">
                                <div className="w-24 h-16 bg-slate-100 border border-slate-200 overflow-hidden shadow-sm">
                                  <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                                </div>
                              </td>
                              <td className="p-4 max-w-xs">
                                <span className={`inline-flex px-1.5 py-0.5 rounded-none text-[8px] font-black uppercase tracking-wider border ${slide.accentColor || 'border-brand-500/20 text-brand-450 bg-brand-500/10'} mb-1`}>
                                  {slide.badge}
                                </span>
                                <div className="font-extrabold text-slate-900 leading-snug">{slide.title}</div>
                                <div className="text-[9px] text-slate-400 font-semibold mt-1">Icon: {slide.icon || 'Sparkles'}</div>
                              </td>
                              <td className="p-4 max-w-sm">
                                <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-3">{slide.desc}</p>
                              </td>
                              <td className="p-4">
                                <div className="font-bold text-slate-800">{slide.actionText}</div>
                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{slide.actionLink}</div>
                              </td>
                              <td className="p-4 text-right whitespace-nowrap space-x-1">
                                <button
                                  onClick={() => openEditSlider(index)}
                                  className="inline-flex items-center justify-center p-1.5 rounded-none bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-855 shadow-2xs"
                                  title="Edit Slide"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteSlider(index)}
                                  className="inline-flex items-center justify-center p-1.5 rounded-none bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 shadow-2xs"
                                  title="Delete Slide"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                              No slider banners configured. Click "Add New Slide" to create one.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* Add / Edit Slider Modal Overlay */}
      {isSliderModalOpen && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsSliderModalOpen(false)}></div>

          <div className="relative w-full max-w-lg bg-white border border-slate-200/80 rounded-none p-6 shadow-2xl z-10 overflow-hidden text-slate-900 text-left animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="absolute top-0 right-0 p-4">
              <button onClick={() => setIsSliderModalOpen(false)} className="text-slate-400 hover:text-slate-655 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-xl font-black text-slate-900 mb-1 tracking-tight font-sans">
              {selectedSliderIndex !== null ? 'Edit Hero Slider' : 'Add New Hero Slider'}
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Configure banner content, images, and quick action parameters.
            </p>

            <form onSubmit={handleSliderSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-455 mb-1">Badge Text</label>
                  <input
                    type="text"
                    required
                    value={sliderForm.badge}
                    onChange={(e) => setSliderForm({ ...sliderForm, badge: e.target.value })}
                    placeholder="e.g. India's Premier AI B2B Directory"
                    className="w-full rounded-none px-3 py-2 text-xs glass-input font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-455 mb-1">Lucide Icon name</label>
                  <input
                    type="text"
                    required
                    value={sliderForm.icon}
                    onChange={(e) => setSliderForm({ ...sliderForm, icon: e.target.value })}
                    placeholder="e.g. Sparkles, Store, ClipboardList"
                    className="w-full rounded-none px-3 py-2 text-xs glass-input font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-455 mb-1">Slide Title</label>
                <input
                  type="text"
                  required
                  value={sliderForm.title}
                  onChange={(e) => setSliderForm({ ...sliderForm, title: e.target.value })}
                  placeholder="e.g. Explore Local Products & Verified Sellers"
                  className="w-full rounded-none px-3 py-2 text-xs glass-input font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-455 mb-1">Description Paragraph</label>
                <textarea
                  required
                  rows={3}
                  value={sliderForm.desc}
                  onChange={(e) => setSliderForm({ ...sliderForm, desc: e.target.value })}
                  placeholder="A short descriptive text explaining this slide to your visitors..."
                  className="w-full rounded-none px-3 py-2 text-xs glass-input font-bold resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-455 mb-1">Banner Image URL</label>
                <input
                  type="url"
                  required
                  value={sliderForm.image}
                  onChange={(e) => setSliderForm({ ...sliderForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full rounded-none px-3 py-2 text-xs glass-input font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-455 mb-1">Action Button Text</label>
                  <input
                    type="text"
                    required
                    value={sliderForm.actionText}
                    onChange={(e) => setSliderForm({ ...sliderForm, actionText: e.target.value })}
                    placeholder="e.g. Browse Categories"
                    className="w-full rounded-none px-3 py-2 text-xs glass-input font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-455 mb-1">Action Button Link / Anchor</label>
                  <input
                    type="text"
                    required
                    value={sliderForm.actionLink}
                    onChange={(e) => setSliderForm({ ...sliderForm, actionLink: e.target.value })}
                    placeholder="e.g. #categories or /user/rfqs"
                    className="w-full rounded-none px-3 py-2 text-xs glass-input font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsSliderModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-xs font-bold rounded-none text-slate-655 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-none text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-md shadow-rose-600/10 transition-all"
                >
                  <span>{selectedSliderIndex !== null ? 'Save Changes' : 'Create Slide'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminDashboardLayout;

