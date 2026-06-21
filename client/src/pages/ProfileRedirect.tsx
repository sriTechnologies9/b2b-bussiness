import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export const ProfileRedirect: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === 'ADMIN') {
        navigate('/admin', { state: { tab: 'profile' } });
      } else if (user.role === 'OWNER') {
        navigate('/dealersuser/profile');
      } else {
        navigate('/user/profile');
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-10 h-10 animate-spin text-brand-600" />
      <p className="text-sm text-slate-500 font-semibold">Redirecting to your profile...</p>
    </div>
  );
};

export default ProfileRedirect;
