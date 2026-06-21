import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { BusinessDetails } from './pages/BusinessDetails';
import { DashboardLayout } from './pages/Dashboard/DashboardLayout';
import { UserDashboardLayout } from './pages/UserDashboard/UserDashboardLayout';
import { AdminDashboardLayout } from './pages/AdminDashboard/AdminDashboardLayout';
import { ProductsFeed } from './pages/ProductsFeed';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ProfileRedirect } from './pages/ProfileRedirect';
import { Globe, Heart, Facebook, Twitter, Instagram, Linkedin, Send, Mail, MapPin } from 'lucide-react';

function AppContent() {
  const location = useLocation();
  
  // Hide main navbar and footer on dealer, user, and admin dashboard panels
  const path = location.pathname.toLowerCase();
  const isDashboard = path.startsWith('/dealersuser') || 
                      path.startsWith('/user') || 
                      path.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      
      {/* Header Navbar */}
      <Navbar />

      {/* Main Content Viewport */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/products-feed" element={<ProductsFeed />} />
          <Route path="/business/:slug" element={<BusinessDetails />} />
          <Route path="/dealersuser/*" element={<DashboardLayout />} />
          <Route path="/user/*" element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
              <UserDashboardLayout />
            </ProtectedRoute>
          } />
          <Route path="/admin/*" element={<AdminDashboardLayout />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ProfileRedirect />
            </ProtectedRoute>
          } />
        </Routes>
      </main>

      {/* Sticky Footer - Hidden on Dashboards */}
      {!isDashboard && (
        <footer className="w-full bg-slate-950 text-slate-400 border-t border-slate-900 py-16 text-xs text-left relative overflow-hidden">
          {/* Subtle glowing dark-mode background mesh */}
          <div className="absolute -top-48 -left-48 w-96 h-96 bg-brand-600/5 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>

          <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 max-w-7xl mx-auto space-y-12 relative z-10">
            {/* Top Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
              
              {/* Column 1: Brand & Socials */}
              <div className="md:col-span-4 space-y-5">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-650 flex items-center justify-center text-white font-black text-sm shadow-md">
                    LC
                  </div>
                  <span className="font-extrabold text-white text-base tracking-tight font-sans">
                    LocalConnect
                  </span>
                </div>
                <p className="text-slate-500 leading-relaxed pr-4 text-[11px]">
                  India's premier AI-enabled B2B directory connecting verified local service providers, retail outlets, and contractors directly to customer requisitions.
                </p>
                <div className="space-y-2 text-[11px] text-slate-500">
                  <div className="flex items-center space-x-2.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-655" />
                    <span>Hitech City, Hyderabad, India</span>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <Mail className="w-3.5 h-3.5 text-slate-655" />
                    <span>support@localconnect.in</span>
                  </div>
                </div>
                {/* Social Icons */}
                <div className="flex space-x-3 pt-2">
                  <a href="#" className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-center text-slate-500 hover:text-white hover:bg-brand-600 hover:border-brand-500 transition-colors" title="Facebook">
                    <Facebook className="w-3.5 h-3.5" />
                  </a>
                  <a href="#" className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-center text-slate-500 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-colors" title="Twitter">
                    <Twitter className="w-3.5 h-3.5" />
                  </a>
                  <a href="#" className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-center text-slate-500 hover:text-white hover:bg-pink-600 hover:border-pink-500 transition-colors" title="Instagram">
                    <Instagram className="w-3.5 h-3.5" />
                  </a>
                  <a href="#" className="w-7 h-7 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-center text-slate-500 hover:text-white hover:bg-brand-600 hover:border-brand-500 transition-colors" title="LinkedIn">
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Column 2: Popular Categories */}
              <div className="md:col-span-2 space-y-4">
                <h4 className="text-white text-xs font-black uppercase tracking-wider">Popular Directory</h4>
                <ul className="space-y-2 text-[11px] text-slate-500">
                  <li><a href="#" className="hover:text-white transition-colors">Restaurants & Dining</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Electricians & Plumbers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Clinics & Health Care</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Gyms & Fitness Studios</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Salons & Beauty Parlors</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">CCTV & Security Systems</a></li>
                </ul>
              </div>

              {/* Column 3: Merchant Solutions */}
              <div className="md:col-span-3 space-y-4">
                <h4 className="text-white text-xs font-black uppercase tracking-wider">Merchant Tools</h4>
                <ul className="space-y-2 text-[11px] text-slate-500">
                  <li><a href="#" className="hover:text-white transition-colors">Register Storefront (Free)</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">AI CRM Intent Classifier</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Live RFQ Bidding Board</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">GSTIN & Verification Badges</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Premium SaaS Plans</a></li>
                </ul>
              </div>

              {/* Column 4: Newsletter */}
              <div className="md:col-span-3 space-y-4">
                <h4 className="text-white text-xs font-black uppercase tracking-wider">Stay Updated</h4>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Subscribe to our newsletter for insights on regional consumer demands, RFQ updates, and local SEO tips.
                </p>
                <div className="flex space-x-1.5 pt-1">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3 top-3 w-3.5 h-3.5 text-slate-655" />
                    <input
                      type="email"
                      placeholder="Enter email"
                      className="w-full rounded-xl pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 text-[11px] font-bold text-slate-200 placeholder-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                    />
                  </div>
                  <button className="px-3 py-2 bg-brand-600 hover:bg-brand-550 border border-brand-500 text-white font-extrabold rounded-xl transition-colors shadow-sm" title="Subscribe">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>

            {/* Bottom Row */}
            <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-[11px] text-slate-600 text-center md:text-left flex items-center space-x-1 flex-wrap justify-center">
                <span>© {new Date().getFullYear()} LocalConnect Platform. Built with</span>
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500 mx-0.5" />
                <span>for SaaS B2B Excellence. All rights reserved.</span>
              </div>
              <div className="flex items-center space-x-5 text-[11px] text-slate-600">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors flex items-center space-x-1">
                  <Globe className="w-3.5 h-3.5" />
                  <span>India (English)</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      )}

    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
