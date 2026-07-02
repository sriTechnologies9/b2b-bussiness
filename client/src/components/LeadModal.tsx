import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  businessName: string;
  initialMessage?: string;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  businessId,
  businessName,
  initialMessage
}) => {
  const { user, token } = useAuth();
  
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    message: ''
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill profile info if user is authenticated
  useEffect(() => {
    if (isOpen) {
      setFormData({
        customerName: user?.name || '',
        phone: user?.phone || '',
        message: initialMessage || ''
      });
    }
  }, [isOpen, user, initialMessage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await apiClient.post('/leads', {
        businessId,
        ...formData
      });

      setIsSuccess(true);
      setFormData({ customerName: '', phone: '', message: '' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Box */}
      <div className="relative w-full max-w-lg bg-white border border-slate-200/80 rounded-none p-6 shadow-2xl z-10 overflow-hidden text-slate-900">
        <div className="absolute top-0 right-0 p-4">
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-none flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Requirement Submitted!</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
              Your inquiry has been sent to <b>{businessName}</b>. The business owner will get in touch with you shortly.
            </p>
            <button
              onClick={() => {
                setIsSuccess(false);
                onClose();
              }}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-none text-white bg-brand-600 hover:bg-brand-500 transition-all"
            >
              Close Window
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Send Requirement</h2>
            <p className="text-sm text-slate-500 mb-6">
              Fill out the form below to receive a call back and quotes from <b>{businessName}</b>.
            </p>

            {error && (
              <div className="mb-4 p-3 rounded-none bg-red-50 border border-red-200 text-red-650 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Your Name</label>
                <input
                  type="text"
                  name="customerName"
                  required
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="e.g. Sanjay Dutt"
                  className="w-full rounded-none px-3 py-2 text-sm glass-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. 9876543210"
                  className="w-full rounded-none px-3 py-2 text-sm glass-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Requirement Details</label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Describe what you need (e.g. 'Need 4 outdoor cameras installed at my retail shop in Hyderabad next weekend.')"
                  className="w-full rounded-none px-3 py-2 text-sm glass-input resize-none"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  * Our AI Lead Scorer will priority-tag this lead based on urgency and details.
                </span>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-55 text-sm font-semibold rounded-none text-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-sm font-semibold rounded-none text-white bg-brand-600 hover:bg-brand-500 hover:shadow-lg hover:shadow-brand-500/10 transition-all disabled:opacity-55"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>Submit Inquiry</span>
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
