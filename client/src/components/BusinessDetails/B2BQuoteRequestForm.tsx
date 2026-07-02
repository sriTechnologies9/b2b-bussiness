import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { apiClient } from '../../api/client';
import { Loader2, Check } from 'lucide-react';

export const B2BQuoteRequestForm: React.FC<{ business: any }> = ({ business }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [nameVal, setNameVal] = useState('');
  const [phoneVal, setPhoneVal] = useState('');
  const [msgVal, setMsgVal] = useState(`Hi ${business.name || 'Merchant'}, I am interested in inquiring about your B2B wholesale prices and catalog availability. Please share a quotation.`);
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  const hoursMap = typeof business.hours === 'string' ? JSON.parse(business.hours) : business.hours;

  if (hoursMap?.storeStatus === false) {
    return (
      <div className="p-6 bg-slate-50 border border-dashed border-slate-200 text-center text-slate-500 font-semibold text-xs leading-normal">
        This merchant is temporarily offline. Online quote inquiries are paused.
      </div>
    );
  }

  const handleInlineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameVal || !phoneVal) {
      alert('Please fill in your Name and Contact Phone.');
      return;
    }
    setInquirySubmitting(true);
    try {
      await apiClient.post('/leads', {
        businessId: business.id,
        customerName: nameVal,
        phone: phoneVal,
        message: msgVal
      });
      setInquirySuccess(true);
      setNameVal('');
      setPhoneVal('');
    } catch (err) {
      console.error(err);
    } finally {
      setInquirySubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center p-6 border border-dashed border-slate-200 rounded-none bg-slate-50/30 space-y-3">
        <p className="text-slate-500 text-xs font-semibold leading-normal">
          You must be signed in to submit B2B quote inquiries to this seller.
        </p>
        <button
          onClick={() => {
            navigate(window.location.pathname, { replace: true, state: { openLogin: true } });
          }}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-2xs font-extrabold rounded-none transition-colors uppercase tracking-wider"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  if (inquirySuccess) {
    return (
      <div className="p-6 bg-emerald-50 border border-emerald-150 text-center space-y-3 animate-in fade-in duration-200">
        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <Check className="w-5 h-5" />
        </div>
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Inquiry Sent Successfully!</h4>
        <p className="text-[10px] text-slate-550 font-semibold leading-relaxed">
          Our team has received your wholesale requirements. We will contact you shortly.
        </p>
        <button
          onClick={() => setInquirySuccess(false)}
          className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-2xs font-extrabold uppercase rounded-none text-slate-700 transition-colors"
        >
          Send Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleInlineSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400">Full Name</label>
          <input
            type="text"
            required
            placeholder="e.g. John Doe"
            value={nameVal}
            onChange={(e) => setNameVal(e.target.value)}
            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 font-semibold rounded-none"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400">Contact Number</label>
          <input
            type="tel"
            required
            placeholder="e.g. 9876543210"
            value={phoneVal}
            onChange={(e) => setPhoneVal(e.target.value)}
            className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 font-semibold rounded-none"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400">Wholesale Requirements</label>
        <textarea
          required
          rows={3}
          value={msgVal}
          onChange={(e) => setMsgVal(e.target.value)}
          className="w-full p-3 text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 font-semibold rounded-none resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={inquirySubmitting}
        className="w-full py-3 bg-indigo-650 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider transition-all shadow hover:shadow-md flex items-center justify-center space-x-1.5 rounded-none"
      >
        {inquirySubmitting ? <Loader2 className="w-4.5 h-4.5 animate-spin mr-1.5 text-white" /> : null}
        <span>Submit Direct Quote Request</span>
      </button>
    </form>
  );
};
