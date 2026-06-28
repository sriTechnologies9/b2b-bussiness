import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, X, Loader2, Sparkles, User } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, token, login, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'CUSTOMER' // CUSTOMER or OWNER
  });
  const [authError, setAuthError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Auto-open modal if redirected from a protected route
  useEffect(() => {
    if (location.state && (location.state as any).openLogin) {
      setAuthError('');
      setIsRegister(false);
      setIsOpen(true);
      // Clear history state to avoid opening on subsequent navigations
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setSubmitting(true);

    if (isRegister) {
      if (formData.role === 'OWNER' && !formData.email.toLowerCase().endsWith('@compaanynamedelaerss.com')) {
        setAuthError('Access Denied: Business Owner registrations require a @compaanynamedelaerss.com email address.');
        setSubmitting(false);
        return;
      }
    }

    const url = isRegister ? '/api/auth/register' : '/api/auth/login';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      login(data.token, data.user);
      setIsOpen(false);
      setFormData({ name: '', email: '', phone: '', password: '', role: 'CUSTOMER' });
      
      navigate('/');
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 bg-white/70 backdrop-blur-md">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="w-9 h-9 rounded-none bg-gradient-brand flex items-center justify-center text-white font-extrabold text-xl shadow-md group-hover:scale-105 transition-transform duration-300">
                  LC
                </div>
                <span className="font-extrabold text-xl tracking-tight text-slate-850 group-hover:text-brand-600 transition-colors">
                  Local<span className="text-brand-500">Connect</span>
                </span>
              </Link>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-slate-650 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Home
              </Link>
              <Link to="/products-feed" className="text-slate-650 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Products
              </Link>
              <Link to="/products-feed?filter=offers" className="text-slate-650 hover:text-slate-900 px-3.5 py-1.5 rounded-none text-sm font-extrabold transition-colors flex items-center space-x-1 text-amber-600 bg-amber-500/10 border border-amber-500/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <span>Offers</span>
              </Link>
              <Link to="/search" className="text-slate-650 hover:text-slate-900 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Sellers
              </Link>

              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin text-brand-500" />
              ) : token && user ? (
                <div className="relative">
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-none border border-slate-200 text-sm font-medium transition-all focus:outline-none"
                  >
                    <div className="w-6 h-6 rounded-none bg-brand-500/20 text-brand-600 flex items-center justify-center text-xs font-bold">
                      {user.name[0].toUpperCase()}
                    </div>
                    <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200/80 shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-left">
                      <div className="px-3.5 py-3 text-xs text-slate-500 bg-slate-50/50 rounded-xl mb-1.5">
                        <span>Signed in as</span>
                        <span className="font-extrabold text-slate-800 block truncate mt-0.5 text-xs" title={user.email}>
                          {user.email}
                        </span>
                        <div className="mt-2 flex items-center gap-1.5">
                          <span className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide ${user.role === 'OWNER' ? 'bg-indigo-55 text-indigo-650' : 'bg-emerald-50 text-emerald-650'}`}>
                            {user.role}
                          </span>
                          {user.subscription && (
                            <span className="inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide bg-amber-50 text-amber-650">
                              <Sparkles className="w-3 h-3 mr-0.5" /> {user.subscription.plan}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        {user.role === 'OWNER' && (
                          <>
                            <Link
                              to="/dealersuser"
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center space-x-2.5 text-slate-655 hover:text-slate-900 hover:bg-slate-50 px-3 py-2.5 rounded-xl text-xs font-bold transition-all"
                            >
                              <LayoutDashboard className="w-4 h-4 text-brand-500" />
                              <span>Business Dashboard</span>
                            </Link>
                            <Link
                              to="/dealersuser/profile"
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center space-x-2.5 text-slate-655 hover:text-slate-900 hover:bg-slate-50 px-3 py-2.5 rounded-xl text-xs font-bold transition-all"
                            >
                              <User className="w-4 h-4 text-brand-500" />
                              <span>Seller Profile</span>
                            </Link>
                          </>
                        )}

                        {user.role === 'CUSTOMER' && (
                          <>
                            <Link
                              to="/user"
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center space-x-2.5 text-slate-655 hover:text-slate-900 hover:bg-slate-50 px-3 py-2.5 rounded-xl text-xs font-bold transition-all"
                            >
                              <LayoutDashboard className="w-4 h-4 text-brand-500" />
                              <span>User Panel</span>
                            </Link>
                            <Link
                              to="/user/profile"
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center space-x-2.5 text-slate-655 hover:text-slate-900 hover:bg-slate-50 px-3 py-2.5 rounded-xl text-xs font-bold transition-all"
                            >
                              <User className="w-4 h-4 text-brand-500" />
                              <span>Customer Profile</span>
                            </Link>
                          </>
                        )}

                        {user.role === 'ADMIN' && (
                          <>
                            <Link
                              to="/admin"
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center space-x-2.5 text-slate-655 hover:text-slate-900 hover:bg-slate-50 px-3 py-2.5 rounded-xl text-xs font-bold transition-all"
                            >
                              <LayoutDashboard className="w-4 h-4 text-rose-500" />
                              <span>Admin Panel</span>
                            </Link>
                            <Link
                              to="/admin"
                              state={{ tab: 'profile' }}
                              onClick={() => setMenuOpen(false)}
                              className="flex items-center space-x-2.5 text-slate-655 hover:text-slate-900 hover:bg-slate-50 px-3 py-2.5 rounded-xl text-xs font-bold transition-all"
                            >
                              <User className="w-4 h-4 text-rose-500" />
                              <span>Admin Profile</span>
                            </Link>
                          </>
                        )}

                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            logout();
                            navigate('/');
                          }}
                          className="w-full flex items-center space-x-2.5 text-red-650 hover:text-red-750 hover:bg-red-50/50 px-3 py-2.5 rounded-xl text-xs font-bold text-left transition-all"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    setAuthError('');
                    setIsRegister(false);
                    setIsOpen(true);
                  }}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-none text-white bg-brand-600 hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-500/10 transition-all duration-200"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>

          {/* Modal Container */}
          <div className="relative w-full max-w-md bg-white border border-slate-200/80 rounded-none p-6 shadow-2xl z-10 overflow-hidden text-slate-900">
            <div className="absolute top-0 right-0 p-4">
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              {isRegister ? 'Create Business Account' : 'Sign In to LocalConnect'}
            </h2>
            <p className="text-sm text-slate-500 mb-6">
              {isRegister 
                ? 'Join thousands of local service providers and customers.' 
                : 'Manage listings, leads, write reviews, and explore.'}
            </p>

            {authError && (
              <div className="mb-4 p-3 rounded-none bg-red-50 border border-red-200 text-red-655 text-sm">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isRegister && (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-550 mb-1">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full rounded-none px-3 py-2 text-sm glass-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-550 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 9876543210"
                      className="w-full rounded-none px-3 py-2 text-sm glass-input"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-550 mb-1">Account Role</label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full rounded-none px-3 py-2 text-sm glass-input"
                    >
                      <option value="CUSTOMER">Customer (Looking for services)</option>
                      <option value="OWNER">Business Owner (Listing services)</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-550 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. user@example.com"
                  className="w-full rounded-none px-3 py-2 text-sm glass-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-550 mb-1">Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full rounded-none px-3 py-2 text-sm glass-input"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-none text-white bg-brand-600 hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-500/10 transition-all duration-200 disabled:opacity-55"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : null}
                {isRegister ? 'Create Account' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 text-center text-sm text-slate-500">
              {isRegister ? (
                <span>
                  Already have an account?{' '}
                  <button
                    onClick={() => {
                      setAuthError('');
                      setIsRegister(false);
                    }}
                    className="text-brand-600 hover:underline font-medium focus:outline-none"
                  >
                    Sign In
                  </button>
                </span>
              ) : (
                <span>
                  Don't have an account?{' '}
                  <button
                    onClick={() => {
                      setAuthError('');
                      setIsRegister(true);
                    }}
                    className="text-brand-600 hover:underline font-medium focus:outline-none"
                  >
                    Register Now
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
