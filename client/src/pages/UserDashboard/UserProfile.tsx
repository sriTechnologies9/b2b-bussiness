import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../api/client';
import { User, Mail, Phone, ShieldCheck, CheckCircle2, Edit2, Save, X, Sparkles, Loader2, Lock } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { user, token, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Password modify states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securitySaving, setSecuritySaving] = useState(false);
  const [securitySuccess, setSecuritySuccess] = useState('');
  const [securityError, setSecurityError] = useState('');

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSecuritySaving(true);
    setSecuritySuccess('');
    setSecurityError('');

    if (newPassword !== confirmPassword) {
      setSecurityError('New passwords do not match');
      setSecuritySaving(false);
      return;
    }

    if (newPassword.length < 6) {
      setSecurityError('Password must be at least 6 characters');
      setSecuritySaving(false);
      return;
    }

    try {
      await apiClient.put('/auth/password', { currentPassword, newPassword });

      setSecuritySuccess('Password successfully modified!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setSecurityError(err.message);
    } finally {
      setSecuritySaving(false);
    }
  };

  if (!user) return null;

  // Profile strength calculation
  let strengthPercent = 33; // Role + Email set
  if (name) strengthPercent += 33;
  if (phone) strengthPercent += 34;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      const data = await apiClient.put('/auth/profile', { name, phone });

      login(data.token, data.user);
      setSuccessMsg('Profile details updated successfully!');
      setIsEditing(false);
    } catch (err: any) {
      setSuccessMsg('');
      alert(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-200">
      <div>
        <div className="flex items-center space-x-2 text-teal-650 font-extrabold text-[10px] uppercase tracking-widest mb-1">
          <User className="w-3.5 h-3.5" />
          <span>My Profile & Security Settings</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Profile Details</h1>
        <p className="text-xs text-slate-500 mt-1">Manage your public contact credentials, verification badges, and account metadata settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Card: Main profile details */}
        <div className="lg:col-span-8 rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm">
          {/* Profile Header Gradient */}
          <div className="h-28 bg-gradient-to-r from-brand-600 via-indigo-650 to-purple-650 relative">
            <div className="absolute inset-0 bg-slate-900/10 mix-blend-overlay"></div>
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-[20px]"></div>
          </div>

          {/* Profile Details Area */}
          <div className="p-6 pt-0 relative space-y-6">
            {/* Avatar overlay */}
            <div className="flex justify-between items-end -translate-y-6 mb-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-650 to-purple-650 text-white flex items-center justify-center text-2xl font-extrabold shadow-md border-4 border-white shrink-0">
                {name ? name[0].toUpperCase() : user.email[0].toUpperCase()}
              </div>

              {!isEditing ? (
                <button
                  onClick={() => {
                    setName(user.name);
                    setPhone(user.phone || '');
                    setIsEditing(true);
                    setSuccessMsg('');
                  }}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shadow-2xs bg-white"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <button
                  onClick={() => setIsEditing(false)}
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl border border-slate-250 hover:bg-slate-50 text-xs font-bold text-slate-500 transition-colors shadow-2xs bg-white"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              )}
            </div>

            {successMsg && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-250 text-emerald-650 rounded-2xl text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {!isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50/50 border border-slate-150">
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>Full Name</span>
                  </span>
                  <div className="text-sm font-extrabold text-slate-800">{user.name}</div>
                </div>

                <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50/50 border border-slate-150">
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider flex items-center space-x-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Email Address</span>
                  </span>
                  <div className="text-sm font-extrabold text-slate-800">{user.email}</div>
                </div>

                <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50/50 border border-slate-150">
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Mobile Number</span>
                  </span>
                  <div className="text-sm font-extrabold text-slate-800">{user.phone || 'Not provided'}</div>
                </div>

                <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50/50 border border-slate-150">
                  <span className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>User Role</span>
                  </span>
                  <div>
                    <span className="inline-flex items-center rounded-lg bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-650 border border-emerald-200">
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-4 text-left">
                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-450 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl px-3.5 py-2.5 text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-450 mb-1.5">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full rounded-xl px-3.5 py-2.5 text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-bold bg-white"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/10 transition-all disabled:opacity-55"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Save className="w-4 h-4 mr-1.5" />}
                    <span>Save Updates</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Right Side: Account verification status and stats */}
        <div className="lg:col-span-4 space-y-6">
          {/* Profile Strength Meter */}
          <div className="rounded-3xl bg-white border border-slate-200 p-5 space-y-3.5 shadow-sm text-left">
            <h3 className="font-extrabold text-slate-800 text-[10px] uppercase tracking-wider">Profile Strength</h3>
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-extrabold text-slate-700">
                <span>Completed</span>
                <span>{strengthPercent}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/40">
                <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-600" style={{ width: `${strengthPercent}%` }}></div>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal font-medium">
              {strengthPercent === 100 
                ? 'Excellent! Your profile details are completely filled. This ensures local businesses can contact you regarding bids.'
                : 'Add a phone number to complete your profile details and enable fast SMS bidding options.'}
            </p>
          </div>

          {/* Verification Badges */}
          <div className="rounded-3xl bg-white border border-slate-200 p-5 space-y-4 shadow-sm text-left">
            <h3 className="font-extrabold text-slate-800 text-[10px] uppercase tracking-wider">Account Credentials</h3>
            
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs p-3 bg-slate-50/50 border border-slate-150 rounded-2xl">
                <span className="font-bold text-slate-750">Email Address</span>
                <span className="inline-flex items-center text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-250">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Active
                </span>
              </div>

              <div className="flex items-center justify-between text-xs p-3 bg-slate-50/50 border border-slate-150 rounded-2xl">
                <span className="font-bold text-slate-750">Phone Status</span>
                {user.phone ? (
                  <span className="inline-flex items-center text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-250">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center text-[9px] font-extrabold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                    Pending
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs p-3 bg-slate-50/50 border border-slate-150 rounded-2xl">
                <span className="font-bold text-slate-750">Client Badge</span>
                <span className="inline-flex items-center text-[9px] font-extrabold text-indigo-605 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-250 uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-indigo-500 animate-pulse" /> Standard
                </span>
              </div>
            </div>
          </div>

          {/* Security Settings - Change Password */}
          <div className="rounded-3xl bg-white border border-slate-200 p-5 space-y-4 shadow-sm text-left">
            <h3 className="font-extrabold text-slate-800 text-[10px] uppercase tracking-wider flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Security Settings</span>
            </h3>

            {securitySuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-250 text-emerald-650 rounded-2xl text-2xs font-extrabold flex items-center space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                <span>{securitySuccess}</span>
              </div>
            )}

            {securityError && (
              <div className="p-3 bg-rose-50 border border-rose-250 text-rose-650 rounded-2xl text-2xs font-extrabold flex items-center space-x-2">
                <X className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                <span>{securityError}</span>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-3.5 text-left">
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl px-3 py-2 text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-bold bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl px-3 py-2 text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-bold bg-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl px-3 py-2 text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-bold bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={securitySaving}
                className="w-full inline-flex items-center justify-center space-x-1.5 px-3 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md transition-all disabled:opacity-55"
              >
                {securitySaving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Save className="w-3.5 h-3.5 mr-1.5" />}
                <span>Update Password</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default UserProfile;
