import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star, MapPin, Phone, Mail, Globe, MessageSquare, Clock, Send,
  BadgeAlert, ShieldCheck, Loader2, IndianRupee,
  Sparkles, ShoppingBag, ExternalLink, Calendar,
  Share2, Award, X, ChevronLeft, ChevronRight, Copy, Check, Search,
  Camera, Bookmark, Edit, UserPlus, TrendingUp, Facebook, Instagram, Youtube, Twitter
} from 'lucide-react';
import { MapWidget } from '../components/MapWidget';
import { LeadModal } from '../components/LeadModal';
import { useAuth } from '../context/AuthContext';

const categoryServices: Record<string, string[]> = {
  'restaurants': [
    'Fine Dine-in Experience',
    'Quick Takeaway & Self Pick-up',
    'Contactless Home Delivery',
    'Custom Catering (Weddings, Corporates & Parties)',
    'Event Venue Booking',
    'Vegetarian & Vegan Meal Options',
    'Bulk Party Orders & Platters'
  ],
  'electricians': [
    'Complete Commercial & Residential Wiring',
    'Emergency Electrical Breakdown Repair',
    'Appliance & Smart Home Installation',
    'Safety Inspections & Auditing',
    'Short Circuit & Fuse Troubleshooting',
    'Lighting Design & Power Socket Upgrades',
    'Generator & UPS System Setup'
  ],
  'plumbers': [
    'Pipeline Leak Detection & Repair',
    'Drain Cleaning & Clog Removal',
    'Water Heater Installation & Fixing',
    'Bathroom & Kitchen Sanitary Fittings',
    'Emergency Plumbing Maintenance 24/7',
    'Water Pump Repair & Pressure Tuning',
    'Sewage Pipeline Upgrades'
  ],
  'clinics': [
    'General Outpatient Consultation',
    'Pediatric & Family Medicine Care',
    'Diagnostic Labs & Blood Tests',
    'Immunization & Preventive Care',
    'In-house Pharmacy & Medical Supplies',
    'Physiotherapy & Rehabilitation',
    'Specialist Referrals'
  ],
  'gyms': [
    'Strength Training & Heavy Weights Zone',
    'Cardiovascular Conditioning Area',
    'Personal Training & Fitness Mentorship',
    'Yoga, Pilates & Group Aerobics Classes',
    'Nutritional Diet Planning & Consultation',
    'Locker Rooms, Steam & Shower Facilities',
    'Body Composition Analysis'
  ],
  'salons': [
    'Advanced Hair Cutting & Styling',
    'Luxury Hair Spa & Keratin Treatments',
    'Organic Facials & Skincare Therapies',
    'Bridal & Groom Makeover Packages',
    'Nail Art, Manicure & Pedicure Care',
    'Therapeutic Massages & Grooming',
    'Waxing & Threading Services'
  ],
  'cctv-shops': [
    'Professional CCTV Camera Installation',
    'Surveillance Network & DVR Configuration',
    'Biometric Attendance & Access Control',
    'Smart Locks & Smart Home Automation',
    'Security System Consultation & Auditing',
    'Annual Maintenance Contracts (AMC)',
    'Remote Mobile View & Cloud Storage Setup'
  ],
  'real-estate': [
    'Commercial Property Leasing & Sale',
    'Residential Property Buying & Selling',
    'Rental Agreement & Documentation Support',
    'Authorized Valuation Consulting',
    'Real Estate Portfolio Management',
    'Land Development & Joint Ventures',
    'Property Inspection & Verification'
  ],
  'retail-stores': [
    'Premium B2B Wholesale Supply',
    'Express Home Delivery & Order Pickup',
    'Store Credit & B2B Purchase Account',
    'Custom Product Sourcing',
    'Exchange & Easy Return Guarantee',
    'Bulk Purchasing Discounts',
    'Special Order Packaging & Supply'
  ]
};

const TrafficChart: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'>('Mon');

  // Traffic density levels (0-100) for hours 9 AM to 8 PM
  const trafficData: Record<string, number[]> = {
    Mon: [15, 25, 45, 60, 75, 80, 70, 50, 40, 30, 20, 10],
    Tue: [20, 30, 50, 65, 70, 75, 65, 55, 45, 35, 25, 15],
    Wed: [18, 28, 48, 62, 72, 78, 68, 52, 42, 32, 22, 12],
    Thu: [22, 32, 52, 68, 74, 82, 72, 58, 48, 38, 28, 18],
    Fri: [25, 40, 65, 85, 90, 95, 85, 75, 60, 45, 30, 20],
    Sat: [30, 55, 80, 95, 100, 95, 90, 85, 70, 50, 35, 25],
    Sun: [10, 20, 35, 45, 50, 45, 40, 35, 25, 15, 10, 5]
  };

  const hoursList = [
    "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM",
    "3 PM", "4 PM", "5 PM", "6 PM", "7 PM", "8 PM"
  ];

  const currentHour = new Date().getHours();

  const isTodaySelected = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[new Date().getDay()] === selectedDay;
  };

  const activeTraffic = trafficData[selectedDay];

  return (
    <div className="rounded-none border border-slate-200 bg-white p-6 md:p-8 text-left space-y-6 shadow-glass-sm mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-150 pb-4 gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-indigo-650" />
            <span>Popular Times & storefront Traffic</span>
          </h3>
          <p className="text-2xs text-slate-450 font-semibold font-sans">Storefront visitor traffic density and communication response peaks.</p>
        </div>

        {/* Day Selectors */}
        <div className="flex flex-wrap gap-1">
          {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const).map(day => (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDay(day)}
              className={`px-2 py-1 text-3xs font-extrabold transition-all border uppercase ${selectedDay === day
                ? 'bg-indigo-650 border-indigo-650 text-white shadow-2xs'
                : 'bg-slate-50 border-slate-200 text-slate-550 hover:bg-slate-100'
                }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Bars */}
      <div className="space-y-5">
        <div className="flex items-end justify-between h-36 pt-4 border-b border-slate-100 px-1 gap-1.5 sm:gap-2 overflow-x-auto select-none">
          {activeTraffic.map((val, idx) => {
            const hourText = hoursList[idx];
            const hrNum = 9 + idx; // 9 AM is 9, 8 PM is 20
            const isLive = isTodaySelected() && currentHour === hrNum;

            return (
              <div key={idx} className="flex flex-col items-center flex-grow min-w-[20px] group relative">
                {/* Hover Tooltip */}
                <div className="absolute bottom-full mb-1 bg-slate-900 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow">
                  {isLive ? "LIVE: " : ""}{val}% busy
                </div>

                {/* Vertical Bar */}
                <div className="w-full bg-slate-100 rounded-t-sm h-28 flex items-end">
                  <div
                    className={`w-full rounded-t-sm transition-all duration-700 ${isLive
                      ? 'bg-rose-500 animate-pulse'
                      : 'bg-indigo-600 group-hover:bg-indigo-500'
                      }`}
                    style={{ height: `${val}%` }}
                  ></div>
                </div>

                {/* Label */}
                <span className={`text-[8px] font-black uppercase tracking-wider mt-2 whitespace-nowrap ${isLive ? 'text-rose-600 font-black' : 'text-slate-400 font-bold'
                  }`}>
                  {isLive ? "Live" : hourText}
                </span>
              </div>
            );
          })}
        </div>

        {/* Summary text */}
        <div className="flex items-start space-x-2 text-2xs text-slate-500 leading-normal font-semibold">
          <span className="inline-block w-2.5 h-2.5 bg-rose-500 rounded-full mt-0.5 shrink-0 animate-ping"></span>
          <p>
            Showing visitor volume for <strong className="text-slate-900 uppercase">{selectedDay}</strong>.
            {selectedDay === 'Sat' || selectedDay === 'Fri'
              ? " Typically busiest between 12 PM and 4 PM. High response delays might occur."
              : " Normal traffic levels. Average lead response is under 15 minutes."}
          </p>
        </div>
      </div>
    </div>
  );
};

export const ReviewsSection: React.FC<{ business: any, reviewsRef?: React.RefObject<HTMLDivElement | null> }> = ({ business, reviewsRef }) => {
  const reviewsList = business?.reviews || [];
  const totalReviews = reviewsList.length;
  const ratingCounts = [0, 0, 0, 0, 0]; // 1, 2, 3, 4, 5 stars

  reviewsList.forEach((r: any) => {
    const starIndex = Math.max(1, Math.min(5, Math.round(r.rating))) - 1;
    ratingCounts[starIndex]++;
  });

  const ratingBreakdowns = ratingCounts.map((count) => {
    const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { count, percent };
  }).reverse(); // 5 stars down to 1 star

  return (
    <div ref={reviewsRef} className="rounded-none border border-slate-200 bg-white p-6 md:p-8 text-left space-y-8 shadow-glass-sm mt-6">
      <h3 className="text-lg font-black text-slate-900 border-b border-slate-150 pb-4">
        Reviews & Client Satisfaction
      </h3>

      {/* Ratings Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-slate-50/50 p-5 rounded-none border border-slate-200/80">

        {/* Left Average Card */}
        <div className="md:col-span-4 text-center md:border-r border-slate-200 space-y-1.5 md:pr-6">
          <span className="block text-4xl font-black text-slate-900 leading-none">
            {business.averageRating || 'N/A'}
          </span>
          <div className="flex justify-center space-x-0.5">
            {[1, 2, 3, 4, 5].map((s) => {
              const isLit = s <= Math.round(business.averageRating || 0);
              return <Star key={s} className={`w-4 h-4 ${isLit ? 'text-amber-400 fill-amber-400' : 'text-slate-350'}`} />;
            })}
          </div>
          <span className="block text-3xs font-extrabold text-slate-450 uppercase tracking-wider">
            Based on {totalReviews} Reviews
          </span>
        </div>

        {/* Right Bars Column */}
        <div className="md:col-span-8 space-y-2 text-left">
          {ratingBreakdowns.map((val, idx) => {
            const starsCount = 5 - idx;
            return (
              <div key={starsCount} className="flex items-center space-x-3 text-xs font-bold text-slate-600">
                <span className="w-10 truncate text-slate-500 shrink-0 text-right">{starsCount} Star</span>
                <div className="w-full bg-slate-200 h-2 rounded-none overflow-hidden shrink">
                  <div
                    className="bg-brand-500 h-full rounded-none transition-all duration-500"
                    style={{ width: `${val.percent}%` }}
                  ></div>
                </div>
                <span className="w-12 text-slate-450 shrink-0 text-[10px] text-right font-black">
                  {val.percent}% ({val.count})
                </span>
              </div>
            );
          })}
        </div>

      </div>

      {/* Feedback List */}
      <div className="space-y-4.5">
        {reviewsList.filter((r: any) => r.rating >= 3).length > 0 ? (
          reviewsList
            .filter((r: any) => r.rating >= 3)
            .map((r: any) => {
              const initialStr = r.user?.name ? r.user.name.charAt(0).toUpperCase() : 'U';

              return (
                <div
                  key={r.id}
                  className="rounded-none border border-slate-150 p-5 space-y-3.5 bg-white hover:border-slate-250 transition-colors shadow-2xs text-left"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-none bg-gradient-brand text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                        {initialStr}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-900 text-xs flex items-center">
                          <span>{r.user?.name || 'Verified Client'}</span>
                          <span className="ml-1.5 inline-flex items-center px-1 rounded-none bg-slate-100 text-[8px] font-bold text-slate-500 border border-slate-200 uppercase">
                            Buyer
                          </span>
                        </h4>
                        <span className="text-[9px] text-slate-400 font-semibold">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Stars */}
                    <div className="flex items-center space-x-0.5 bg-slate-50 border border-slate-150 px-2 py-1 rounded-none">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-3.5 h-3.5 ${s <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-655 text-xs font-medium leading-relaxed italic">
                    "{r.comment}"
                  </p>
                </div>
              );
            })
        ) : (
          <div className="text-center py-10 rounded-none border border-dashed border-slate-200 text-slate-500 text-xs font-semibold">
            No positive client reviews posted currently. Be the first to leave your feedback!
          </div>
        )}
      </div>
    </div>
  );
};

const B2BQuoteRequestForm: React.FC<{ business: any }> = ({ business }) => {
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
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          businessId: business.id,
          customerName: nameVal,
          phone: phoneVal,
          message: msgVal
        })
      });
      if (res.ok) {
        setInquirySuccess(true);
        setNameVal('');
        setPhoneVal('');
      } else {
        alert('Failed to send inquiry. Please try again.');
      }
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

const B2BContactForm: React.FC<{ business: any }> = ({ business }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [nameVal, setNameVal] = useState('');
  const [phoneVal, setPhoneVal] = useState('');
  const [msgVal, setMsgVal] = useState(`Hi ${business.name || 'Merchant'}, I would like to contact you regarding business inquiries. Please get back to me.`);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const hoursMap = typeof business.hours === 'string' ? JSON.parse(business.hours) : business.hours;

  if (hoursMap?.storeStatus === false) {
    return (
      <div className="p-8 bg-slate-50/50 border border-dashed border-slate-200 text-center text-slate-500 font-semibold text-xs leading-normal">
        This merchant is temporarily offline. Contact messages are paused.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameVal || !phoneVal || !msgVal) {
      alert('Please fill in all the details.');
      return;
    }
    setSubmitting(true);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          businessId: business.id,
          customerName: nameVal,
          phone: phoneVal,
          message: `[Contact-Form] ${msgVal}`
        })
      });
      if (res.ok) {
        setSuccess(true);
        setNameVal('');
        setPhoneVal('');
        setMsgVal('');
      } else {
        alert('Failed to send contact message. Please try again.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center p-8 border border-dashed border-slate-200 rounded-none bg-slate-50/30 space-y-3">
        <p className="text-slate-500 text-xs font-semibold leading-normal">
          You must be logged in to send direct contact messages to this merchant.
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

  if (success) {
    return (
      <div className="p-6 bg-emerald-50 border border-emerald-150 text-center space-y-3 animate-in fade-in duration-200">
        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <Check className="w-5 h-5" />
        </div>
        <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Message Sent Successfully!</h4>
        <p className="text-[10px] text-slate-550 font-semibold leading-relaxed">
          Your contact request has been sent to the business. They will contact you shortly.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-2xs font-extrabold uppercase rounded-none text-slate-700 transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400">Your Full Name</label>
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
          <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400">Your Phone Number</label>
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
        <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400">Your Message</label>
        <textarea
          required
          rows={4}
          value={msgVal}
          onChange={(e) => setMsgVal(e.target.value)}
          placeholder="Type your message details here..."
          className="w-full p-3 text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 font-semibold rounded-none resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider transition-all shadow hover:shadow-md flex items-center justify-center space-x-1.5 rounded-none"
      >
        {submitting ? <Loader2 className="w-4.5 h-4.5 animate-spin mr-1.5 text-white" /> : null}
        <span>Send Contact Message</span>
      </button>
    </form>
  );
};

export const BusinessDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [business, setBusiness] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<any>('');

  // Map & Location configuration states
  const [editingMap, setEditingMap] = useState(false);
  const [mapForm, setMapForm] = useState({
    latitude: '',
    longitude: '',
    googleMapsLink: '',
    googleEmbedUrl: ''
  });

  const handleStartEditMap = () => {
    if (!business) return;
    setMapForm({
      latitude: (business.latitude || 17.3850).toString(),
      longitude: (business.longitude || 78.4867).toString(),
      googleMapsLink: hoursMap.googleMapsLink || '',
      googleEmbedUrl: hoursMap.googleEmbedUrl || ''
    });
    setEditingMap(true);
  };

  const handleSaveMapDetails = async () => {
    if (!token || !business) return;
    try {
      const latVal = parseFloat(mapForm.latitude);
      const lngVal = parseFloat(mapForm.longitude);

      if (isNaN(latVal) || isNaN(lngVal)) {
        alert('Please enter valid numeric values for Latitude and Longitude');
        return;
      }

      // Validate and clean map links for security (prevent XSS/Redirects)
      const mapsLink = mapForm.googleMapsLink.trim();
      if (mapsLink && !mapsLink.startsWith('http://') && !mapsLink.startsWith('https://')) {
        alert('Google Maps link must start with http:// or https://');
        return;
      }

      // Extract embed URL from complete iframe paste if necessary
      let finalEmbedUrl = mapForm.googleEmbedUrl.trim();
      if (finalEmbedUrl.includes('<iframe')) {
        const srcMatch = finalEmbedUrl.match(/src=["']([^"']+)["']/);
        if (srcMatch) {
          finalEmbedUrl = srcMatch[1];
        }
      }

      if (finalEmbedUrl && !finalEmbedUrl.startsWith('https://www.google.com/maps/') && !finalEmbedUrl.startsWith('https://maps.google.com/')) {
        alert('Invalid Google Maps Embed URL. It must be a valid Google Maps URL.');
        return;
      }

      const updatedHours = {
        ...hoursMap,
        googleMapsLink: mapsLink,
        googleEmbedUrl: finalEmbedUrl
      };

      const res = await fetch(`/api/businesses/${business.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          latitude: latVal,
          longitude: lngVal,
          hours: JSON.stringify(updatedHours)
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update location details');
      }

      setEditingMap(false);
      fetchDetails();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSaveField = async (fieldName: string) => {
    if (!token || !business) return;
    try {
      let bodyData: any = {};
      if (fieldName === 'hours') {
        bodyData = { hours: JSON.stringify(editValue) };
      } else {
        bodyData = { [fieldName]: editValue };
      }

      const res = await fetch(`/api/businesses/${business.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(bodyData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update business');
      }

      setEditingField(null);
      fetchDetails();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const [products, setProducts] = useState<any[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);

  // Product Catalog Filters & Search
  const [productFilter, setProductFilter] = useState<'all' | 'deals'>('all');
  const [catalogSubFilter, setCatalogSubFilter] = useState('All');
  const [productSearch, setProductSearch] = useState('');

  // Product catalog pagination states
  const [catalogPage, setCatalogPage] = useState(1);
  const [catalogItemsPerPage, setCatalogItemsPerPage] = useState(10); // Defaults to 10 items (2 rows of 5 items on desktop)

  // Reset pagination when catalog search/filters change
  useEffect(() => {
    setCatalogPage(1);
    setCatalogItemsPerPage(10);
    setCatalogSubFilter('All');
  }, [productFilter, productSearch]);

  // Lead Modal Control
  const [isLeadOpen, setIsLeadOpen] = useState(false);
  const [leadInitialMessage, setLeadInitialMessage] = useState('');

  // Review Form
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [headerHoverRating, setHeaderHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // Wishlist Demo State
  const [isSaved, setIsSaved] = useState(false);

  // Follower system states
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  // Product detail modal state
  const [activeProductDetails, setActiveProductDetails] = useState<any | null>(null);

  const handleFollowToggle = async () => {
    if (!business) return;
    if (!token) {
      // Fallback for guest users
      const newState = !isFollowing;
      setIsFollowing(newState);
      setFollowerCount(prev => newState ? prev + 1 : prev - 1);
      localStorage.setItem(`follow_${business.id}`, newState ? 'true' : 'false');
      return;
    }

    try {
      const res = await fetch(`/api/businesses/${business.id}/follow`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setIsFollowing(data.isFollowing);
        setFollowerCount(data.followerCount);
        localStorage.setItem(`follow_${business.id}`, data.isFollowing ? 'true' : 'false');
      }
    } catch (err) {
      console.error('Failed to toggle follow status:', err);
    }
  };

  // Gallery Lightbox State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Product Zoom State
  const [productLightboxImg, setProductLightboxImg] = useState<string | null>(null);

  // Copy Feedback State
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  // WhatsApp Message Preset Template
  const [whatsappTemplate, setWhatsappTemplate] = useState<'quotation' | 'callback' | 'hours'>('quotation');

  // Refs for scrolling to sections
  const overviewRef = React.useRef<HTMLDivElement>(null);
  const catalogRef = React.useRef<HTMLDivElement>(null);
  const mapRef = React.useRef<HTMLDivElement>(null);
  const reviewsRef = React.useRef<HTMLDivElement>(null);

  // Active navigation tab state
  const [activeTab, setActiveTab] = useState<'overview' | 'catalog' | 'map' | 'reviews' | 'contact'>('catalog');

  // Phone reveal state
  const [phoneRevealed, setPhoneRevealed] = useState(false);

  const parseGallery = (galleryStr: string): string[] => {
    if (!galleryStr) return [];
    if (galleryStr.includes('|')) {
      return galleryStr.split('|').map((s: string) => s.trim()).filter(Boolean);
    }
    if (galleryStr.startsWith('data:image/')) {
      return [galleryStr];
    }
    return galleryStr.split(',').map((s: string) => s.trim()).filter(Boolean);
  };

  // Parse Gallery and Hours safely
  let galleryImages: string[] = [];
  try {
    if (business && business.gallery) {
      const parsed = parseGallery(business.gallery);
      galleryImages = Array.from(new Set(parsed));
    }
  } catch (err) {
    console.error('Failed to parse gallery', err);
  }

  let hoursMap: any = {};
  try {
    if (business && business.hours) {
      hoursMap = typeof business.hours === 'string' ? JSON.parse(business.hours) : business.hours;
    }
  } catch (err) {
    console.error('Failed to parse hours', err);
  }

  const fallbackCovers = [
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&auto=format&fit=crop'
  ];

  if (galleryImages.length === 0) {
    galleryImages = [fallbackCovers[0]];
  }

  const mainCover = galleryImages[0];
  const secondaryCover = galleryImages[1];
  const tertiaryCover = galleryImages[2];
  const quaternaryCover = galleryImages[3];

  const isOwnerOrAdmin = !!(user && business && (user.role === 'ADMIN' || user.id === business.userId));

  // Ratings calculation breakdown
  const reviewsList = business?.reviews || [];
  const totalReviews = reviewsList.length;
  const ratingCounts = [0, 0, 0, 0, 0]; // 1, 2, 3, 4, 5 stars

  reviewsList.forEach((r: any) => {
    const starIndex = Math.max(1, Math.min(5, Math.round(r.rating))) - 1;
    ratingCounts[starIndex]++;
  });

  const ratingBreakdowns = ratingCounts.map((count) => {
    const percent = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
    return { count, percent };
  }).reverse(); // 5 stars down to 1 star

  // Dynamic Open / Closed calculation
  const getOpenStatus = () => {
    try {
      if (!business) return { isOpen: false, text: 'Closed Today' };
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const now = new Date();
      const currentDay = days[now.getDay()];

      let daySchedule = hoursMap[currentDay] || hoursMap[currentDay.charAt(0).toUpperCase() + currentDay.slice(1)] || '09:00 AM - 08:00 PM';

      if (typeof daySchedule !== 'string') {
        daySchedule = '09:00 AM - 08:00 PM';
      }

      const schedLower = daySchedule.toLowerCase();
      if (schedLower.includes('closed')) {
        return { isOpen: false, text: 'Closed Today' };
      }

      const timeParts = daySchedule.split('-');
      if (timeParts.length !== 2) {
        return { isOpen: true, text: 'Open Today' };
      }

      const parseTimeToMinutes = (timeStr: string) => {
        const str = timeStr.trim().toLowerCase();
        let hours = 0;
        let minutes = 0;

        const ampmMatch = str.match(/(\d+):?(\d*)\s*(am|pm)/);
        if (ampmMatch) {
          hours = parseInt(ampmMatch[1], 10);
          minutes = ampmMatch[2] ? parseInt(ampmMatch[2], 10) : 0;
          const ampm = ampmMatch[3];
          if (ampm === 'pm' && hours < 12) hours += 12;
          if (ampm === 'am' && hours === 12) hours = 0;
        } else {
          const hours24Match = str.match(/(\d+)[:.](\d+)/);
          if (hours24Match) {
            hours = parseInt(hours24Match[1], 10);
            minutes = parseInt(hours24Match[2], 10);
          }
        }
        return hours * 60 + minutes;
      };

      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const startMinutes = parseTimeToMinutes(timeParts[0]);
      const endMinutes = parseTimeToMinutes(timeParts[1]);

      if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
        return { isOpen: true, text: `Open Now • Closes at ${timeParts[1].trim()}` };
      } else {
        return { isOpen: false, text: `Closed • Opens at ${timeParts[0].trim()}` };
      }
    } catch (e) {
      return { isOpen: true, text: 'Open Today' };
    }
  };

  const storeStatus = getOpenStatus();

  // Custom pre-filled WhatsApp preset message builder
  const getWhatsappUrl = () => {
    if (!business) return '';
    let msg = `Hi ${business.name}, I am interested in inquiring about your store profile on LocalConnect. `;
    if (whatsappTemplate === 'quotation') {
      msg += 'Could you please share your latest pricing catalog quotations and bulk purchase discount details?';
    } else if (whatsappTemplate === 'callback') {
      msg += 'I would like to schedule a quick callback or phone consultation regarding your B2B services. Please reach out to me.';
    } else if (whatsappTemplate === 'hours') {
      msg += 'I would like to verify your store availability hours and check if a physical visit is required to inspect catalog inventory.';
    }
    return `https://wa.me/91${business.whatsapp || business.phone}?text=${encodeURIComponent(msg)}`;
  };

  // Filter products locally based on tabs, subcategories & search query
  const filteredProducts = products.filter(p => {
    const matchesTab = productFilter === 'all' || p.isOffer;
    const matchesSearch = !productSearch ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(productSearch.toLowerCase());

    let matchesSub = true;
    if (catalogSubFilter !== 'All') {
      const parts = (p.description || '').split(' ||| ');
      const subCat = parts[1] || 'General';
      matchesSub = subCat.toLowerCase() === catalogSubFilter.toLowerCase();
    }

    return matchesTab && matchesSearch && matchesSub;
  });

  // Catalog Pagination Math
  const totalCatalogItems = filteredProducts.length;
  const totalCatalogPages = Math.ceil(totalCatalogItems / catalogItemsPerPage);
  const catalogLastIdx = catalogPage * catalogItemsPerPage;
  const catalogFirstIdx = catalogLastIdx - catalogItemsPerPage;
  const currentCatalogItems = filteredProducts.slice(catalogFirstIdx, catalogLastIdx);

  // Extract all unique product subcategories
  const uniqueSubCategories = Array.from(new Set(
    products.map(p => {
      const parts = (p.description || '').split(' ||| ');
      return parts[1] || 'General';
    })
  )).filter(Boolean);

  // Parse hours to check for social media links
  let socialLinks: { facebook?: string; instagram?: string; youtube?: string; twitter?: string } = {};
  try {
    if (business && business.hours) {
      const parsed = typeof business.hours === 'string' ? JSON.parse(business.hours) : business.hours;
      socialLinks = {
        facebook: parsed.facebookUrl || '',
        instagram: parsed.instagramUrl || '',
        youtube: parsed.youtubeUrl || '',
        twitter: parsed.twitterUrl || ''
      };
    }
  } catch (err) { }

  const catSlug = business?.category?.slug || '';
  const services = categoryServices[catSlug] || [
    'B2B Product Wholesaling',
    'Express Store Pick-up',
    'Customized Order Processing',
    'On-demand Consultation',
    'Direct WhatsApp Inquiries',
    'Verified Quality Standard Services'
  ];

  const openLightbox = (index: number) => {
    setActivePhotoIndex(index);
    setIsLightboxOpen(true);
  };

  const getCategoryBadges = () => {
    if (!business) return null;
    const isVerified = business.status === 'VERIFIED';

    // Parse hours to check if custom badges are set
    const badge1 = hoursMap?.customBadge1 || '';
    const badge2 = hoursMap?.customBadge2 || '';

    if (badge1 || badge2) {
      return (
        <>
          {badge1 && (
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-100 uppercase text-[9px] font-bold">
              {badge1}
            </span>
          )}
          {badge1 && badge2 && <span>•</span>}
          {badge2 && (
            <span className="text-slate-700 bg-slate-100 px-2 py-0.5 border border-slate-200 uppercase text-[9px] font-semibold">
              {badge2}
            </span>
          )}
          {isVerified && (
            <>
              {(badge1 || badge2) && <span>•</span>}
              <span className="text-indigo-650 bg-indigo-50 px-2 py-0.5 border border-indigo-100 uppercase text-[9px] font-bold">GST Active</span>
            </>
          )}
        </>
      );
    }

    switch (catSlug) {
      case 'restaurants':
        return (
          <>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-100 uppercase text-[9px] font-bold">Pure Veg & Non-Veg</span>
            <span>•</span>
            <span>Price for two ₹400</span>
            {isVerified && (
              <>
                <span>•</span>
                <span className="text-indigo-650 bg-indigo-50 px-2 py-0.5 border border-indigo-100 uppercase text-[9px] font-bold">GST Active</span>
              </>
            )}
          </>
        );
      case 'cctv-shops':
        return (
          <>
            <span className="text-blue-700 bg-blue-50 px-2 py-0.5 border border-blue-100 uppercase text-[9px] font-bold">HD Cameras Setup</span>
            <span>•</span>
            <span>1-Year Warranty</span>
            {isVerified && (
              <>
                <span>•</span>
                <span className="text-indigo-650 bg-indigo-50 px-2 py-0.5 border border-indigo-100 uppercase text-[9px] font-bold">GST Active</span>
              </>
            )}
          </>
        );
      case 'electricians':
        return (
          <>
            <span className="text-amber-700 bg-amber-50 px-2 py-0.5 border border-amber-100 uppercase text-[9px] font-bold">On-Demand Booking</span>
            <span>•</span>
            <span>24/7 Emergencies</span>
            {isVerified && (
              <>
                <span>•</span>
                <span className="text-indigo-650 bg-indigo-50 px-2 py-0.5 border border-indigo-100 uppercase text-[9px] font-bold">GST Active</span>
              </>
            )}
          </>
        );
      case 'plumbers':
        return (
          <>
            <span className="text-cyan-700 bg-cyan-50 px-2 py-0.5 border border-cyan-100 uppercase text-[9px] font-bold">Licensed Contractors</span>
            <span>•</span>
            <span>Free Estimates</span>
            {isVerified && (
              <>
                <span>•</span>
                <span className="text-indigo-650 bg-indigo-50 px-2 py-0.5 border border-indigo-100 uppercase text-[9px] font-bold">GST Active</span>
              </>
            )}
          </>
        );
      case 'clinics':
        return (
          <>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 border border-emerald-100 uppercase text-[9px] font-bold">Certified Doctors</span>
            <span>•</span>
            <span>Walk-ins Welcome</span>
            {isVerified && (
              <>
                <span>•</span>
                <span className="text-indigo-650 bg-indigo-50 px-2 py-0.5 border border-indigo-100 uppercase text-[9px] font-bold">GST Active</span>
              </>
            )}
          </>
        );
      case 'gyms':
        return (
          <>
            <span className="text-violet-700 bg-violet-50 px-2 py-0.5 border border-violet-100 uppercase text-[9px] font-bold">Modern Equipment</span>
            <span>•</span>
            <span>Trainer Guided</span>
            {isVerified && (
              <>
                <span>•</span>
                <span className="text-indigo-650 bg-indigo-50 px-2 py-0.5 border border-indigo-100 uppercase text-[9px] font-bold">GST Active</span>
              </>
            )}
          </>
        );
      case 'salons':
        return (
          <>
            <span className="text-pink-700 bg-pink-50 px-2 py-0.5 border border-pink-100 uppercase text-[9px] font-bold">Unisex Services</span>
            <span>•</span>
            <span>AC Studio</span>
            {isVerified && (
              <>
                <span>•</span>
                <span className="text-indigo-650 bg-indigo-50 px-2 py-0.5 border border-indigo-100 uppercase text-[9px] font-bold">GST Active</span>
              </>
            )}
          </>
        );
      case 'real-estate':
        return (
          <>
            <span className="text-teal-700 bg-teal-50 px-2 py-0.5 border border-teal-100 uppercase text-[9px] font-bold">Verified Properties</span>
            <span>•</span>
            <span>Zero Commission Options</span>
            {isVerified && (
              <>
                <span>•</span>
                <span className="text-indigo-650 bg-indigo-50 px-2 py-0.5 border border-indigo-100 uppercase text-[9px] font-bold">GST Active</span>
              </>
            )}
          </>
        );
      case 'retail-stores':
        return (
          <>
            <span className="text-blue-700 bg-blue-50 px-2 py-0.5 border border-blue-100 uppercase text-[9px] font-bold">Retail & Wholesale</span>
            <span>•</span>
            <span>Store Pick-up</span>
            {isVerified && (
              <>
                <span>•</span>
                <span className="text-indigo-650 bg-indigo-50 px-2 py-0.5 border border-indigo-100 uppercase text-[9px] font-bold">GST Active</span>
              </>
            )}
          </>
        );
      default:
        return (
          <>
            <span className="text-slate-700 bg-slate-50 px-2 py-0.5 border border-slate-200 uppercase text-[9px] font-bold">Verified Seller</span>
            <span>•</span>
            <span>Direct Inquiry</span>
            {isVerified && (
              <>
                <span>•</span>
                <span className="text-indigo-650 bg-indigo-50 px-2 py-0.5 border border-indigo-100 uppercase text-[9px] font-bold">GST Active</span>
              </>
            )}
          </>
        );
    }
  };

  const selectTab = (tabName: 'overview' | 'catalog' | 'map' | 'reviews' | 'contact') => {
    setActiveTab(tabName);
    const tabNav = document.getElementById('details-tabs-header');
    if (tabNav) {
      const elementPosition = tabNav.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - 80,
        behavior: 'smooth'
      });
    }
  };

  const scrollToSection = (_ref: React.RefObject<HTMLDivElement | null>, tabName: 'overview' | 'catalog' | 'map' | 'reviews' | 'contact') => {
    selectTab(tabName);
  };

  // Update document title and description dynamically for SEO
  useEffect(() => {
    if (business) {
      const categoryName = business.category?.name || 'Local Business';
      document.title = `${business.name} - Verified ${categoryName} in ${business.city}, ${business.state} | LocalConnect`;
      document.querySelector('meta[name="description"]')?.setAttribute(
        'content',
        `Contact ${business.name}, a verified ${categoryName} in ${business.city}, ${business.state}. View catalog products, deals, reviews, address map, and phone number.`
      );
    }
  }, [business]);

  const fetchProducts = async (bizId: string) => {
    setProductsLoading(true);
    try {
      const res = await fetch(`/api/businesses/${bizId}/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProductsLoading(false);
    }
  };

  const trackAction = async (actionType: 'visit' | 'whatsapp' | 'phone', bizId?: string) => {
    const targetBizId = bizId || business?.id;
    if (!targetBizId) return;

    try {
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      await fetch('/api/leads/track', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          businessId: targetBizId,
          action: actionType
        })
      });
    } catch (err) {
      console.error('Failed to log lead action tracking:', err);
    }
  };

  const fetchDetails = async () => {
    try {
      const res = await fetch(`/api/businesses/slug/${slug}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to load details');
      }
      setBusiness(data);

      // Initialize follower states from database list
      const hoursMap = typeof data.hours === 'string' ? JSON.parse(data.hours) : (data.hours || {});
      const list = hoursMap.followersList || [];
      let followState = false;
      if (user) {
        followState = list.includes(user.id);
      } else {
        followState = localStorage.getItem(`follow_${data.id}`) === 'true';
      }
      setIsFollowing(followState);
      setFollowerCount(data.followerCount || list.length || 0);

      fetchProducts(data.id);
      trackAction('visit', data.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [slug]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setReviewError('');
    setSubmittingReview(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          businessId: business.id,
          rating,
          comment
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setComment('');
      setRating(5);
      fetchDetails();
    } catch (err: any) {
      setReviewError(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleProductInquire = (prodName: string) => {
    if (!token) {
      navigate(window.location.pathname, { replace: true, state: { openLogin: true } });
      return;
    }
    setLeadInitialMessage(`Hi, I am interested in inquiring about your product/service: "${prodName}". Please provide catalog info and custom quote pricing details.`);
    setIsLeadOpen(true);
  };

  const handleGeneralInquire = () => {
    if (!token) {
      navigate(window.location.pathname, { replace: true, state: { openLogin: true } });
      return;
    }
    setLeadInitialMessage('');
    setIsLeadOpen(true);
  };

  const handleCopyAddress = () => {
    if (!business) return;
    const fullAddress = `${business.address}, ${business.city}, ${business.state}`;
    navigator.clipboard.writeText(fullAddress);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-650" />
        <span className="text-sm text-slate-400 font-semibold">Retrieving premium store catalog...</span>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6 animate-in fade-in duration-300">
        <div className="w-20 h-20 bg-rose-50 border border-rose-100 rounded-none flex items-center justify-center mx-auto text-rose-500">
          <BadgeAlert className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Business Profile Not Found</h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto">{error || 'The requested business listing details could not be resolved from our index directory.'}</p>
        <Link to="/search" className="inline-flex px-6 py-3 bg-slate-900 text-white rounded-none text-sm font-extrabold hover:bg-slate-800 transition-all shadow-lg">
          Back to B2B Directory
        </Link>
      </div>
    );
  }



  return (
    <div className="space-y-6 pb-24 text-slate-800 bg-slate-50/30">

      {/* 1. HERO COVER & GALLERY PREVIEW */}
      <section className="relative w-full px-4 sm:px-8 lg:px-12 xl:px-16 pt-4 space-y-3">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap items-center space-x-1.5 text-[11px] font-medium text-slate-500 pb-1">
          <Link to="/" className="hover:underline">Home</Link>
          <span>&gt;</span>
          <Link to="/search" className="hover:underline">{business.city || 'Mumbai'}</Link>
          <span>&gt;</span>
          <span className="capitalize">{business.category?.name || 'Restaurants'} in {business.city || 'Mumbai'}</span>
          <span>&gt;</span>
          <span className="text-slate-900 font-bold">{business.name}</span>
        </div>

        {/* Compact Justdial-Style Gallery Banner Grid */}
        {/* Compact Justdial-Style Gallery Banner Grid */}
        {galleryImages.length === 1 ? (
          <div className="w-full h-[220px] md:h-[300px] rounded-none overflow-hidden border border-slate-200/80 shadow-sm bg-slate-950">
            <button
              onClick={() => openLightbox(0)}
              className="w-full h-full relative group overflow-hidden text-left"
            >
              <img
                src={mainCover}
                alt={business.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
            </button>
          </div>
        ) : galleryImages.length === 2 ? (
          <div className="grid grid-cols-2 gap-1 h-[220px] md:h-[300px] rounded-none overflow-hidden border border-slate-200/80 shadow-sm bg-slate-950">
            <button
              onClick={() => openLightbox(0)}
              className="relative group overflow-hidden h-full w-full text-left"
            >
              <img
                src={mainCover}
                alt={business.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
            </button>
            <button
              onClick={() => openLightbox(1)}
              className="relative group overflow-hidden h-full w-full text-left border-l border-slate-200/20"
            >
              <img
                src={secondaryCover}
                alt="Store Interior"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
            </button>
          </div>
        ) : galleryImages.length === 3 ? (
          <div className="grid grid-cols-12 gap-1 h-[220px] md:h-[300px] rounded-none overflow-hidden border border-slate-200/80 shadow-sm bg-slate-950">
            <button
              onClick={() => openLightbox(0)}
              className="col-span-8 relative group overflow-hidden h-full w-full text-left"
            >
              <img
                src={mainCover}
                alt={business.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
            </button>
            <div className="col-span-4 flex flex-col gap-1 h-full">
              <button
                onClick={() => openLightbox(1)}
                className="relative group overflow-hidden h-[calc(50%-1px)] w-full text-left"
              >
                <img
                  src={secondaryCover}
                  alt="Store Interior"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
              </button>
              <button
                onClick={() => openLightbox(2)}
                className="relative group overflow-hidden h-[calc(50%-1px)] w-full text-left"
              >
                <img
                  src={tertiaryCover}
                  alt="Store Operations"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-1 h-[220px] md:h-[300px] rounded-none overflow-hidden border border-slate-200/80 shadow-sm bg-slate-950">
            {/* Main cover image - Column 1 */}
            <button
              onClick={() => openLightbox(0)}
              className="col-span-12 md:col-span-5 relative group overflow-hidden h-full w-full text-left"
            >
              <img
                src={mainCover}
                alt={business.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
            </button>

            {/* Secondary cover image - Column 2 */}
            <button
              onClick={() => openLightbox(1)}
              className="col-span-12 md:col-span-4 relative group overflow-hidden h-full w-full text-left border-l border-r border-slate-955/20"
            >
              <img
                src={secondaryCover}
                alt="Store Interior"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
            </button>

            {/* Column 3 - Split Right Panel */}
            <div className="col-span-12 md:col-span-3 flex flex-col gap-1 h-full">
              {/* Top Half Tertiary Cover */}
              <button
                onClick={() => openLightbox(2)}
                className="relative group overflow-hidden h-[calc(50%-2px)] w-full rounded-none"
              >
                <img
                  src={tertiaryCover}
                  alt="Store Operations"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300"></div>
              </button>

              {/* Bottom Half Grid split */}
              <div className="grid grid-cols-2 gap-1 h-[calc(50%-2px)]">
                {/* Bottom-left: Quaternary Image with overlay */}
                <button
                  onClick={() => openLightbox(3)}
                  className="relative group overflow-hidden h-full w-full rounded-none"
                >
                  <img
                    src={quaternaryCover}
                    alt="Store Catalog"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102"
                  />
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 flex flex-col items-center justify-center text-center p-1 text-white">
                    <span className="text-sm font-black tracking-wider">
                      +{galleryImages.length > 4 ? galleryImages.length - 3 : 22}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-slate-200">More</span>
                  </div>
                </button>

                {/* Bottom-right: Add More Photo Dashed Card */}
                <div
                  onClick={() => openLightbox(0)}
                  className="rounded-none bg-slate-50 border border-dashed border-slate-350 hover:bg-slate-100 hover:border-slate-400 transition-all flex flex-col items-center justify-center text-center p-2 cursor-pointer group"
                >
                  <Camera className="w-5 h-5 text-slate-400 group-hover:scale-105 transition-transform mb-1" />
                  <span className="text-[9px] font-black tracking-wider text-slate-500 uppercase leading-tight">Add More Photo</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {hoursMap.storeStatus === false && (
          <div className="bg-red-50 border border-red-200 p-4 text-left flex items-start space-x-3.5 animate-in slide-in-from-top-2 duration-300">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-650 flex items-center justify-center shrink-0">
              <span className="font-extrabold text-lg">⚠️</span>
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              <h4 className="text-xs font-black text-red-800 uppercase tracking-wider">Store Temporarily Offline</h4>
              <p className="text-xs text-red-650 font-semibold leading-relaxed">
                {hoursMap.whyStoreOff || 'This store is temporarily closed. Online inquiries and catalog requests are paused.'}
              </p>
            </div>
          </div>
        )}

        {/* Dedicated Premium Profile Title Header Card */}
        <div className="bg-white border border-slate-200 p-5 md:p-6 text-left space-y-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left gap-4">

              {/* Store Logo Box */}
              <div className="relative w-20 h-20 md:w-24 md:h-24 bg-white border border-slate-200 p-1 flex items-center justify-center rounded-full shrink-0 shadow-md overflow-hidden bg-slate-50 group/logo">
                {hoursMap.logoUrl ? (
                  <img src={hoursMap.logoUrl} alt={business.name} className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-650 to-indigo-850 text-white flex items-center justify-center font-black text-2xl uppercase rounded-full">
                    {business.name.slice(0, 2)}
                  </div>
                )}
                {isOwnerOrAdmin && (
                  <button
                    onClick={async () => {
                      const newLogo = prompt('Enter Profile Photo / Logo Image URL:', hoursMap.logoUrl || '');
                      if (newLogo !== null) {
                        try {
                          const updatedHours = { ...hoursMap, logoUrl: newLogo.trim() };
                          const res = await fetch(`/api/businesses/${business.id}`, {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                              'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({ hours: JSON.stringify(updatedHours) })
                          });
                          if (res.ok) {
                            fetchDetails();
                          } else {
                            alert('Failed to update profile logo');
                          }
                        } catch (err) {
                          console.error(err);
                        }
                      }
                    }}
                    className="absolute inset-0 bg-black/60 opacity-0 group-hover/logo:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer rounded-full"
                    title="Change Profile Photo"
                  >
                    <Camera className="w-4 h-4 text-white mb-0.5" />
                    <span className="text-[7px] font-black uppercase tracking-wider text-slate-100">Upload</span>
                  </button>
                )}
              </div>

              {/* Business Info details */}
              <div className="space-y-1.5 w-full">
                {/* Business Name */}
                {editingField === 'name' ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="border border-slate-350 rounded px-2.5 py-1 text-sm font-bold text-slate-800 focus:outline-none focus:border-brand-500"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveField('name')}
                      className="bg-[#008f5d] text-white px-2.5 py-1 text-xs font-bold rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingField(null)}
                      className="bg-slate-200 text-slate-700 px-2.5 py-1 text-xs font-bold rounded"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-tight font-sans flex items-center justify-center sm:justify-start gap-2 flex-wrap group">
                    <span>{business.name}</span>
                    {isOwnerOrAdmin && (
                      <button
                        onClick={() => {
                          setEditingField('name');
                          setEditValue(business.name);
                        }}
                        className="text-slate-400 hover:text-brand-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Edit Name"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {business.status === 'VERIFIED' ? (
                      <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 border border-emerald-500/20 bg-emerald-50 text-emerald-700 font-extrabold text-[8px] uppercase tracking-wider">
                        <ShieldCheck className="w-3 h-3 text-emerald-600 fill-emerald-100" />
                        <span>Verified</span>
                      </span>
                    ) : null}
                  </h1>
                )}

                {/* Ratings Row */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs font-bold text-slate-500">
                  <div className="bg-[#008f5d] text-white font-black text-[11px] px-2 py-0.5 rounded-none flex items-center space-x-1 shrink-0">
                    <span>{business.reviewCount > 0 ? business.averageRating : '0'}</span>
                    <Star className="w-3 h-3 text-white fill-white" />
                  </div>
                  <span className="text-slate-400 font-semibold hover:underline cursor-pointer" onClick={() => scrollToSection(reviewsRef, 'reviews')}>
                    {business.reviewCount || 0} Ratings
                  </span>
                  <span>•</span>
                  <span className="capitalize">{business.category?.name || 'Restaurants'}</span>
                </div>

                {/* Location & Open Hours */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-semibold">
                  {editingField === 'address' ? (
                    <div className="flex gap-1.5 items-center mt-1">
                      <input
                        type="text"
                        value={editValue.address || ''}
                        placeholder="Street Address"
                        onChange={(e) => setEditValue({ ...editValue, address: e.target.value })}
                        className="border border-slate-300 rounded px-1.5 py-0.5 text-2xs font-normal text-slate-800"
                        autoFocus
                      />
                      <input
                        type="text"
                        value={editValue.city || ''}
                        placeholder="City"
                        onChange={(e) => setEditValue({ ...editValue, city: e.target.value })}
                        className="border border-slate-300 rounded px-1.5 py-0.5 text-2xs font-normal text-slate-800"
                      />
                      <button
                        onClick={async () => {
                          if (!token || !business) return;
                          try {
                            const res = await fetch(`/api/businesses/${business.id}`, {
                              method: 'PUT',
                              headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                              },
                              body: JSON.stringify({
                                address: editValue.address,
                                city: editValue.city
                              })
                            });
                            if (!res.ok) throw new Error('Failed to update address');
                            setEditingField(null);
                            fetchDetails();
                          } catch (err: any) {
                            alert(err.message);
                          }
                        }}
                        className="bg-[#008f5d] text-white px-2 py-0.5 text-2xs font-bold rounded"
                      >
                        Save
                      </button>
                      <button onClick={() => setEditingField(null)} className="bg-slate-200 text-slate-700 px-2 py-0.5 text-2xs font-bold rounded">Cancel</button>
                    </div>
                  ) : (
                    <span className="flex items-center text-slate-700 group relative pr-6">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      <span>{business.address}, {business.city}</span>
                      {isOwnerOrAdmin && (
                        <button
                          onClick={() => {
                            setEditingField('address');
                            setEditValue({ address: business.address, city: business.city });
                          }}
                          className="text-slate-400 hover:text-brand-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity ml-1.5"
                          title="Edit Location"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </span>
                  )}
                  <span>•</span>
                  <span className={storeStatus.isOpen ? "text-emerald-600 font-bold flex items-center" : "text-rose-600 font-bold flex items-center"}>
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {storeStatus.text}
                  </span>
                </div>

                {/* Extra dynamic flags */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-2xs text-slate-500 font-semibold pt-0.5">
                  {getCategoryBadges()}
                </div>

                {/* Social Media Links Row */}
                {(socialLinks.facebook || socialLinks.instagram || socialLinks.youtube || socialLinks.twitter) && (
                  <div className="flex items-center space-x-2 pt-2 border-t border-slate-100/50 mt-1 select-none">
                    <span className="text-[8px] uppercase font-black text-slate-400 tracking-wider">Socials:</span>
                    {socialLinks.facebook && (
                      <a
                        href={socialLinks.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-slate-400 hover:text-[#1877F2] hover:bg-slate-105 border border-transparent hover:border-slate-200 transition-all rounded-none"
                        title="Facebook Profile"
                      >
                        <Facebook className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {socialLinks.instagram && (
                      <a
                        href={socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-slate-400 hover:text-[#E1306C] hover:bg-slate-105 border border-transparent hover:border-slate-200 transition-all rounded-none"
                        title="Instagram Profile"
                      >
                        <Instagram className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {socialLinks.youtube && (
                      <a
                        href={socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-slate-400 hover:text-[#FF0000] hover:bg-slate-105 border border-transparent hover:border-slate-200 transition-all rounded-none"
                        title="YouTube Channel"
                      >
                        <Youtube className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {socialLinks.twitter && (
                      <a
                        href={socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-slate-400 hover:text-[#000000] hover:bg-slate-105 border border-transparent hover:border-slate-200 transition-all rounded-none"
                        title="Twitter / X Profile"
                      >
                        <Twitter className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Bookmark & Follow buttons on the far right */}
            <div className="flex items-center space-x-2.5 shrink-0 self-end md:self-start">
              {/* Follower Stats Card */}
              <div className="text-right shrink-0 pr-1 select-none">
                <span className="block text-xs font-black text-slate-900 leading-none">
                  {followerCount.toLocaleString()}
                </span>
                <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                  Followers
                </span>
              </div>

              {/* Follow Button */}
              <button
                onClick={handleFollowToggle}
                className={`px-3 py-2 text-3xs font-extrabold uppercase tracking-wider transition-all flex items-center space-x-1 border rounded-none shadow-2xs ${isFollowing
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 font-black'
                  : 'bg-indigo-650 border-indigo-650 hover:bg-indigo-700 text-white'
                  }`}
              >
                {isFollowing ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Following</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Follow</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`p-2.5 border transition-all rounded-none ${isSaved
                  ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-55'
                  }`}
                title={isSaved ? "Saved" : "Save Store"}
              >
                <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="grid grid-cols-2 md:flex md:flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
            {/* Show Number */}
            <button
              onClick={() => {
                setPhoneRevealed(!phoneRevealed);
                if (!phoneRevealed) {
                  trackAction('phone');
                }
              }}
              className="col-span-1 md:w-auto bg-[#008f5d] hover:bg-[#00764d] text-white font-black text-xs px-4 py-2.5 rounded-none flex items-center justify-center space-x-2 transition-colors shrink-0 shadow-sm"
            >
              <Phone className="w-4 h-4 fill-white text-white" />
              <span>{phoneRevealed ? business.phone : 'Show Number'}</span>
            </button>

            {/* WhatsApp */}
            <a
              href={getWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackAction('whatsapp')}
              className="col-span-1 md:w-auto border border-[#008f5d] text-[#008f5d] hover:bg-emerald-50/50 font-black text-xs px-4 py-2.5 rounded-none flex items-center justify-center space-x-2 transition-colors shrink-0 bg-white"
            >
              <MessageSquare className="w-4 h-4 text-[#008f5d]" />
              <span>WhatsApp</span>
            </a>

            {/* Ask Anything AI */}
            <button
              onClick={handleGeneralInquire}
              className="col-span-2 md:w-auto border border-blue-500 text-blue-600 hover:bg-blue-50/50 font-black text-xs px-4 py-2.5 rounded-none flex items-center justify-center space-x-2 transition-colors relative shrink-0 bg-white"
            >
              <Send className="w-4 h-4 text-blue-600" />
              <span>Ask Anything</span>
              <span className="absolute -top-1.5 -right-1 bg-blue-600 text-white text-[8px] font-black px-1 py-0.2 uppercase tracking-wider rounded-none scale-90 shadow-2xs">
                AI B2B
              </span>
            </button>

            {/* Share */}
            <button
              onClick={handleShareLink}
              className="col-span-1 md:w-auto border border-slate-200 text-slate-600 hover:bg-slate-50 font-black text-xs px-4 py-2.5 rounded-none flex items-center justify-center space-x-2 transition-colors shrink-0 bg-white"
            >
              <Share2 className="w-4 h-4" />
              <span>{copiedShare ? 'Copied!' : 'Share'}</span>
            </button>

            {/* Write Review */}
            <button
              onClick={() => scrollToSection(reviewsRef, 'reviews')}
              className="col-span-1 md:w-auto border border-slate-200 text-slate-600 hover:bg-slate-55 font-black text-xs px-4 py-2.5 rounded-none flex items-center justify-center space-x-2 transition-colors shrink-0 bg-white"
            >
              <Edit className="w-4 h-4" />
              <span>Write Review</span>
            </button>

            {/* Click to Rate star ratings */}
            <div className="hidden lg:flex items-center space-x-2 text-xs font-bold text-slate-400 ml-auto pl-4 border-l border-slate-100">
              <span className="text-slate-500">Click to Rate:</span>
              <div className="flex space-x-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setRating(s);
                      scrollToSection(reviewsRef, 'reviews');
                    }}
                    onMouseEnter={() => setHeaderHoverRating(s)}
                    onMouseLeave={() => setHeaderHoverRating(null)}
                    className="hover:scale-115 transition-transform focus:outline-none"
                  >
                    <Star
                      className={`w-4 h-4 transition-colors ${(headerHoverRating !== null ? s <= headerHoverRating : s <= rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-350'
                        }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll navigation tabs */}
        <div id="details-tabs-header" className="bg-white border-b border-slate-200 sticky top-[64px] z-30 -mx-4 sm:-mx-8 lg:-mx-12 xl:-mx-16 px-4 sm:px-8 lg:px-12 xl:px-16 flex space-x-8 text-xs font-bold text-slate-500 overflow-x-auto scrollbar-none shadow-sm animate-in fade-in duration-300">
          <button
            onClick={() => selectTab('overview')}
            className={`py-3.5 border-b-2 transition-all whitespace-nowrap shrink-0 ${activeTab === 'overview'
              ? 'border-blue-600 text-blue-600 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
          >
            Overview
          </button>
          <button
            onClick={() => selectTab('catalog')}
            className={`py-3.5 border-b-2 transition-all whitespace-nowrap shrink-0 ${activeTab === 'catalog'
              ? 'border-blue-600 text-blue-600 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
          >
            Catalog & Offerings
          </button>
          <button
            onClick={() => selectTab('map')}
            className={`py-3.5 border-b-2 transition-all whitespace-nowrap shrink-0 ${activeTab === 'map'
              ? 'border-blue-600 text-blue-600 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
          >
            Location Map
          </button>
          <button
            onClick={() => selectTab('reviews')}
            className={`py-3.5 border-b-2 transition-all whitespace-nowrap shrink-0 hidden lg:block ${activeTab === 'reviews'
              ? 'border-blue-600 text-blue-600 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
          >
            Reviews
          </button>
          <button
            onClick={() => selectTab('contact')}
            className={`py-3.5 border-b-2 transition-all whitespace-nowrap shrink-0 ${activeTab === 'contact'
              ? 'border-blue-600 text-blue-600 font-black'
              : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
          >
            Contact Us
          </button>
        </div>
      </section>

      {/* 2. DUAL COLUMN DETAILS LAYOUT */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* LEFT COLUMN: OVERVIEW, PRODUCTS & SERVICES, MAP, REVIEWS (SPA Tab Switcher) */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-10">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-10 animate-in fade-in duration-300">
              {/* About Section */}
              <div ref={overviewRef} className="rounded-none border border-slate-200 bg-white p-6 md:p-8 text-left space-y-4 shadow-glass-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/[0.01] rounded-none blur-2xl"></div>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                    <Award className="w-5 h-5 text-brand-600" />
                    <span>Business Overview</span>
                  </h3>

                  {/* Dynamic open status badge */}
                  <span className={`px-3 py-1 text-xs font-extrabold uppercase border ${storeStatus.isOpen
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}>
                    {storeStatus.text}
                  </span>
                </div>

                {editingField === 'description' ? (
                  <div className="space-y-2 mt-2">
                    <textarea
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full border border-slate-350 rounded p-2.5 text-sm font-normal text-slate-800 focus:outline-none focus:border-brand-500"
                      rows={4}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveField('description')}
                        className="bg-[#008f5d] text-white px-3.5 py-1.5 text-xs font-bold rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingField(null)}
                        className="bg-slate-200 text-slate-700 px-3.5 py-1.5 text-xs font-bold rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative group">
                    <p className="text-slate-655 leading-relaxed text-sm whitespace-pre-line font-medium pr-8">
                      {business.description || "Welcome to our store! We provide high-quality services and custom catalog options. Click details to browse our available items, request price details directly, or connect on WhatsApp."}
                    </p>
                    {isOwnerOrAdmin && (
                      <button
                        onClick={() => {
                          setEditingField('description');
                          setEditValue(business.description || '');
                        }}
                        className="absolute top-0 right-0 text-slate-400 hover:text-brand-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Edit Description"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}

                {/* Sub attributes tags for verification */}
                <div className="pt-2 flex flex-wrap gap-2.5">
                  <span className="inline-flex items-center text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-none border border-emerald-100 uppercase">
                    ✓ Verified Address
                  </span>
                  <span className="inline-flex items-center text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-none border border-indigo-100 uppercase">
                    ✓ AI Lead Intent Scored
                  </span>
                  <span className="inline-flex items-center text-[10px] font-extrabold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-none border border-slate-150 uppercase">
                    ✓ WhatsApp Direct Connect
                  </span>
                </div>

                {/* Services Offered Section */}
                <div className="pt-6 border-t border-slate-150 space-y-3">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Services Offered
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {services.map((srv, index) => (
                      <div key={index} className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
                        <span className="text-emerald-600 flex-shrink-0 font-bold bg-emerald-50 border border-emerald-100 w-4 h-4 flex items-center justify-center text-[10px] rounded-none">
                          ✓
                        </span>
                        <span>{srv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ratings Breakdown Grid (Directly visible on Overview Tab) */}
                <div className="pt-6 border-t border-slate-150 space-y-4">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Customer Ratings Overview
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-50/50 p-4 rounded-none border border-slate-200/85">
                    {/* Left Average Card */}
                    <div className="md:col-span-4 text-center md:border-r border-slate-200 space-y-1.5 md:pr-4">
                      <span className="block text-3xl font-black text-slate-900 leading-none">
                        {business.averageRating || 'N/A'}
                      </span>
                      <div className="flex justify-center space-x-0.5">
                        {[1, 2, 3, 4, 5].map((s) => {
                          const isLit = s <= Math.round(business.averageRating || 0);
                          return <Star key={s} className={`w-3.5 h-3.5 ${isLit ? 'text-amber-400 fill-amber-400' : 'text-slate-350'}`} />;
                        })}
                      </div>
                      <span className="block text-[8px] font-black text-slate-450 uppercase tracking-wider">
                        Based on {totalReviews} Reviews
                      </span>
                    </div>

                    {/* Right Bars Column */}
                    <div className="md:col-span-8 space-y-2 text-left">
                      {ratingBreakdowns.map((val, idx) => {
                        const starsCount = 5 - idx;
                        return (
                          <div key={starsCount} className="flex items-center space-x-3 text-[11px] font-bold text-slate-600">
                            <span className="w-10 truncate text-slate-500 shrink-0 text-right">{starsCount} Star</span>
                            <div className="w-full bg-slate-200 h-1.5 rounded-none overflow-hidden shrink">
                              <div
                                className="bg-brand-500 h-full rounded-none transition-all duration-500"
                                style={{ width: `${val.percent}%` }}
                              ></div>
                            </div>
                            <span className="w-12 text-slate-450 shrink-0 text-[9px] text-right font-black">
                              {val.percent}% ({val.count})
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Frequently Asked Questions Section */}
              <div className="rounded-none border border-slate-200 bg-white p-6 md:p-8 text-left space-y-6 shadow-glass-sm">
                <h3 className="text-lg font-black text-slate-900 border-b border-slate-150 pb-4 flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-indigo-650" />
                  <span>Frequently Asked Questions</span>
                </h3>

                <div className="space-y-4">
                  {[
                    {
                      q: "Do you offer wholesale or bulk purchasing discounts?",
                      a: "Yes, we are a verified B2B dealer and offer tiered wholesale pricing for bulk purchases. Please click \"Ask Anything\" or \"Inquire\" next to any product to request a customized quote."
                    },
                    {
                      q: "Is a GST tax invoice provided for purchases?",
                      a: "Absolutely. We issue complete tax invoices including valid GST details, enabling commercial buyers to claim Input Tax Credit (ITC) for business purchases."
                    },
                    {
                      q: "What is your typical lead response time?",
                      a: "We usually respond to inquiries and quotation requests in less than 15 minutes during standard working hours. You can also connect directly via the WhatsApp preset messages."
                    }
                  ].map((faq, idx) => (
                    <div key={idx} className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0 text-left space-y-1.5 animate-in fade-in duration-300">
                      <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                        Q: {faq.q}
                      </h4>
                      <p className="text-2xs sm:text-xs text-slate-555 leading-relaxed font-medium pl-3 border-l-2 border-slate-200">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick B2B Quote Request Card */}
              <div className="rounded-none border border-slate-200 bg-white p-6 md:p-8 text-left space-y-6 shadow-glass-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/[0.02] rounded-none blur-3xl pointer-events-none"></div>

                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                    <Send className="w-5 h-5 text-indigo-650" />
                    <span>Quick B2B Quote Request</span>
                  </h3>
                  <p className="text-2xs text-slate-400 font-semibold">
                    Submit your custom volume requirements and get verified quotes directly in 15 minutes.
                  </p>
                </div>

                {/* Inline form */}
                <B2BQuoteRequestForm business={business} />
              </div>
            </div>
          )}

          {/* TAB 2: CATALOG */}
          {activeTab === 'catalog' && (
            <div className="animate-in fade-in duration-300">
              {/* Products/Catalog Section with Live Search & Filter */}
              <div ref={catalogRef} className="rounded-none border border-slate-200 bg-white p-4 sm:p-6 md:p-8 text-left space-y-4 sm:space-y-6 shadow-glass-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-150 pb-4 gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                      <ShoppingBag className="w-5 h-5 text-brand-500" />
                      <span>Store Catalog & Offerings</span>
                    </h3>
                    <p className="text-2xs text-slate-400 font-semibold">Browse verified dealer catalogs and request instant pricing details.</p>
                  </div>

                  {/* Filter Tabs */}
                  <div className="flex bg-slate-100 p-1 rounded-none w-fit shrink-0">
                    <button
                      onClick={() => setProductFilter('all')}
                      className={`px-3.5 py-1.5 rounded-none text-2xs font-extrabold transition-all ${productFilter === 'all'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                      All Items ({products.length})
                    </button>
                    <button
                      onClick={() => setProductFilter('deals')}
                      className={`px-3.5 py-1.5 rounded-none text-2xs font-extrabold transition-all ${productFilter === 'deals'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-800'
                        }`}
                    >
                      Hot Deals ({products.filter(p => p.isOffer).length})
                    </button>
                  </div>
                </div>

                {/* Hot Promotional Deals Banner */}
                {products.filter(p => p.isOffer).length > 0 ? (
                  <div className="relative w-full bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 border border-indigo-950 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg overflow-hidden animate-in fade-in duration-300">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="space-y-2 text-left relative z-10">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider">
                        <Sparkles className="w-3 h-3 fill-slate-950 text-slate-950" />
                        <span>Active Storefront Promotion</span>
                      </span>
                      <h3 className="text-lg md:text-xl font-black text-white leading-tight">
                        Exclusive Deals & B2B Wholesale Offers
                      </h3>
                      <p className="text-xs text-slate-300 max-w-lg leading-relaxed font-semibold">
                        Get direct bulk order discounts, promotional rates, and special pricing packages on featured products listed below.
                      </p>
                    </div>

                    <div className="shrink-0 relative z-10 w-full md:w-auto">
                      <button
                        onClick={() => setProductFilter('deals')}
                        className="w-full md:w-auto px-6 py-3 bg-amber-400 hover:bg-amber-505 text-slate-955 font-black text-xs uppercase tracking-wider transition-all shadow hover:shadow-lg rounded-none"
                      >
                        View Active Deals ({products.filter(p => p.isOffer).length})
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full bg-gradient-to-r from-slate-900 via-[#1e1b4b] to-slate-900 border border-slate-800 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg overflow-hidden animate-in fade-in duration-300">
                    <div className="space-y-2 text-left">
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-indigo-650 text-white font-black text-[9px] uppercase tracking-wider">
                        <span>Wholesale Order Discount</span>
                      </span>
                      <h3 className="text-lg md:text-xl font-black text-white leading-tight">
                        Bulk Purchase Custom Price Quotations
                      </h3>
                      <p className="text-xs text-slate-300 max-w-lg leading-relaxed font-semibold">
                        Save more on large-volume orders. Contact our support or tap the WhatsApp button to request customized quotations and catalog pricing lists.
                      </p>
                    </div>

                    <div className="shrink-0 w-full md:w-auto">
                      <a
                        href={getWhatsappUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackAction('whatsapp')}
                        className="inline-flex w-full md:w-auto items-center justify-center space-x-2 px-6 py-3 bg-[#008f5d] hover:bg-[#00764d] text-white font-black text-xs uppercase tracking-wider transition-all shadow hover:shadow-lg rounded-none"
                      >
                        <MessageSquare className="w-4 h-4 fill-white text-white" />
                        <span>Request Quote on WhatsApp</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Catalog Live Search Bar */}
                <div className="relative w-full">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search products in this store storefront catalog..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:border-indigo-500 font-semibold rounded-none"
                  />
                  {productSearch && (
                    <button
                      onClick={() => setProductSearch('')}
                      className="absolute right-3 top-3 text-xs font-bold text-slate-400 hover:text-slate-600"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Catalog Subcategories Variety Toggles */}
                {uniqueSubCategories.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-slate-100/50">
                    <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider mr-2">Varieties:</span>
                    <button
                      onClick={() => setCatalogSubFilter('All')}
                      className={`px-3 py-1.5 text-3xs font-extrabold transition-all border uppercase ${catalogSubFilter === 'All'
                        ? 'bg-indigo-650 text-white border-indigo-650 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-550 hover:bg-slate-100'
                        }`}
                    >
                      All ({products.length})
                    </button>
                    {uniqueSubCategories.map((subCat) => {
                      const count = products.filter(p => {
                        const parts = (p.description || '').split(' ||| ');
                        return (parts[1] || 'General').toLowerCase() === subCat.toLowerCase();
                      }).length;

                      return (
                        <button
                          key={subCat}
                          onClick={() => setCatalogSubFilter(subCat)}
                          className={`px-3 py-1.5 text-3xs font-extrabold transition-all border uppercase ${catalogSubFilter.toLowerCase() === subCat.toLowerCase()
                            ? 'bg-indigo-650 text-white border-indigo-650 shadow-2xs'
                            : 'bg-slate-50 border-slate-200 text-slate-550 hover:bg-slate-100'
                            }`}
                        >
                          {subCat} ({count})
                        </button>
                      );
                    })}
                  </div>
                )}

                {productsLoading ? (
                  <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-650" />
                  </div>
                ) : currentCatalogItems.length > 0 ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                      {currentCatalogItems.map((prod) => (
                        <div
                          key={prod.id}
                          className="rounded-xl border border-slate-150 bg-white hover:shadow-lg hover:border-slate-200 transition-all duration-300 flex flex-col h-full overflow-hidden text-left group hover:-translate-y-0.5 relative"
                        >
                          {/* Offer discount banner */}
                          {prod.isOffer && (
                            <div className="absolute top-1.5 left-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-extrabold text-[7px] px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wide flex items-center space-x-0.5 z-10">
                              <Sparkles className="w-2 h-2 animate-pulse" />
                              <span>{prod.offerDiscount || 'DEAL'}</span>
                            </div>
                          )}

                          <div className="aspect-square bg-slate-50 overflow-hidden relative border-b border-slate-100 cursor-pointer">
                            <img
                              src={prod.image || 'https://images.unsplash.com/photo-1546269901-ba9599a7e63c?w=450'}
                              alt={prod.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                              onClick={() => setActiveProductDetails(prod)}
                            />
                          </div>

                          <div className="p-3 flex flex-col flex-grow text-left space-y-1.5">
                            <div className="min-h-[56px] space-y-0.5 text-left">
                              <h4
                                className="font-extrabold text-slate-850 text-2xs line-clamp-2 group-hover:text-brand-600 transition-colors cursor-pointer"
                                onClick={() => setActiveProductDetails(prod)}
                              >
                                {prod.name}
                              </h4>
                              {(() => {
                                const parts = (prod.description || '').split(' ||| ');
                                const desc = parts[0] || '';
                                const sub = parts[1] || '';
                                return (
                                  <div className="space-y-1">
                                    <p className="text-[9px] text-slate-500 leading-snug font-medium line-clamp-2">
                                      {desc}
                                    </p>
                                    {sub && sub.toLowerCase() !== 'general' && (
                                      <span className="inline-block px-1 py-0.5 rounded bg-indigo-50 border border-indigo-150 text-indigo-650 font-extrabold text-[6px] uppercase tracking-wider">
                                        {sub}
                                      </span>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t border-slate-100 mt-auto gap-1">
                              <div className="flex flex-col">
                                <span className="text-[8px] uppercase font-bold text-slate-450 tracking-wider leading-none">Est. Price</span>
                                <span className="font-extrabold text-slate-900 text-xs flex items-center mt-0.5">
                                  <IndianRupee className="w-2.5 h-2.5 mr-0.5 text-slate-700" />
                                  <span>{prod.price.toLocaleString()}</span>
                                </span>
                              </div>

                              <button
                                onClick={() => handleProductInquire(prod.name)}
                                className="inline-flex items-center space-x-1 px-2.5 py-1 bg-slate-900 hover:bg-indigo-650 hover:text-white text-white font-extrabold text-[9px] uppercase rounded transition-all shadow-sm shrink-0"
                              >
                                <Send className="w-2.5 h-2.5 text-indigo-400" />
                                <span>Inquire</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination & Load More Actions */}
                    {totalCatalogPages > 1 && (
                      <div className="flex flex-col items-center justify-center pt-6 space-y-5">
                        {/* View More Button (Loads 2 more rows of 10 items) */}
                        {catalogLastIdx < totalCatalogItems && (
                          <button
                            onClick={() => setCatalogItemsPerPage(prev => prev + 10)}
                            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all shadow hover:shadow-md hover:-translate-y-0.5"
                          >
                            View More Catalog Items
                          </button>
                        )}

                        {/* Page Navigator */}
                        <div className="flex flex-col sm:flex-row items-center justify-between w-full pt-4 border-t border-slate-100 gap-4">
                          <span className="text-2xs font-extrabold uppercase tracking-wider text-slate-400">
                            Showing {catalogFirstIdx + 1}-{Math.min(catalogLastIdx, totalCatalogItems)} of {totalCatalogItems} items
                          </span>

                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => setCatalogPage(prev => Math.max(prev - 1, 1))}
                              disabled={catalogPage === 1}
                              className="px-3 py-2 border border-slate-200 text-slate-655 rounded-lg text-xs font-bold hover:bg-slate-50 disabled:opacity-40"
                            >
                              Prev
                            </button>

                            {Array.from({ length: totalCatalogPages }, (_, i) => i + 1).map((page) => (
                              <button
                                key={page}
                                onClick={() => setCatalogPage(page)}
                                className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${catalogPage === page
                                  ? 'bg-indigo-650 text-white shadow'
                                  : 'border border-slate-200 text-slate-655 hover:bg-slate-50'
                                  }`}
                              >
                                {page}
                              </button>
                            ))}

                            <button
                              onClick={() => setCatalogPage(prev => Math.min(prev + 1, totalCatalogPages))}
                              disabled={catalogPage === totalCatalogPages}
                              className="px-3 py-2 border border-slate-200 text-slate-655 rounded-lg text-xs font-bold hover:bg-slate-50 disabled:opacity-40"
                            >
                              Next
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-slate-50/50 rounded-none border border-dashed border-slate-200 text-slate-500 text-xs font-semibold">
                    No items match your catalog filters. Try changing search keywords.
                  </div>
                )}
              </div>

              {/* Frequently Asked Questions Section inside Catalog tab (Separate Card) */}
              <div className="hidden lg:block rounded-none border border-slate-200 bg-white p-6 md:p-8 text-left space-y-6 shadow-glass-sm mt-6">
                <h3 className="text-lg font-black text-slate-900 border-b border-slate-150 pb-4 flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-indigo-650" />
                  <span>Frequently Asked Questions</span>
                </h3>

                <div className="space-y-4">
                  {[
                    {
                      q: "Do you offer wholesale or bulk purchasing discounts?",
                      a: "Yes, we offer tiered wholesale pricing for bulk purchases. Please click \"Inquire\" next to any product to request a customized quote."
                    },
                    {
                      q: "Is a GST tax invoice provided for purchases?",
                      a: "Absolutely. We issue complete tax invoices including valid GST details, enabling commercial buyers to claim Input Tax Credit (ITC) for business purchases."
                    },
                    {
                      q: "What is your typical lead response time?",
                      a: "We usually respond to inquiries and quotation requests in less than 15 minutes during standard working hours. You can also connect directly via the WhatsApp preset messages."
                    }
                  ].map((faq, idx) => (
                    <div key={idx} className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0 text-left space-y-1.5 animate-in fade-in duration-300">
                      <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                        Q: {faq.q}
                      </h4>
                      <p className="text-2xs sm:text-xs text-slate-555 leading-relaxed font-medium pl-3 border-l-2 border-slate-200">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enterprise B2B Trust & Services Grid (Separate Card Row) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                <div className="p-4 bg-white border border-slate-200 rounded-none text-left space-y-2 shadow-glass-sm">
                  <div className="w-8 h-8 rounded-none bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-650">
                    <Award className="w-4.5 h-4.5" />
                  </div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Verified B2B Dealer</h4>
                  <p className="text-[10px] text-slate-550 leading-normal font-semibold">100% verified merchant credentials, GST active and compliance audited storefront.</p>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-none text-left space-y-2 shadow-glass-sm">
                  <div className="w-8 h-8 rounded-none bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <ShieldCheck className="w-4.5 h-4.5" />
                  </div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Secure Escrow Trade</h4>
                  <p className="text-[10px] text-slate-550 leading-normal font-semibold">Protected buyer inquiries, verified contract proposals and direct vendor payments.</p>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-none text-left space-y-2 shadow-glass-sm">
                  <div className="w-8 h-8 rounded-none bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                    <ShoppingBag className="w-4.5 h-4.5" />
                  </div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">Wholesale Logistics</h4>
                  <p className="text-[10px] text-slate-550 leading-normal font-semibold">Express bulk cargo dispatch, PAN-India logistics coordination and tracking support.</p>
                </div>

                <div className="p-4 bg-white border border-slate-200 rounded-none text-left space-y-2 shadow-glass-sm">
                  <div className="w-8 h-8 rounded-none bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                    <MessageSquare className="w-4.5 h-4.5" />
                  </div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">15-Min Response Rate</h4>
                  <p className="text-[10px] text-slate-550 leading-normal font-semibold">Superfast B2B lead callback processing, custom pricing quotes and active support.</p>
                </div>
              </div>

              {/* On mobile/tablet, render Traffic Chart and Ratings & Reviews inline inside the Catalog/Products tab */}
              <div className="lg:hidden space-y-6">
                <TrafficChart />
                <ReviewsSection business={business} reviewsRef={reviewsRef} />
              </div>
            </div>
          )}

          {/* TAB 3: LOCATION MAP */}
          {activeTab === 'map' && (
            <div className="animate-in fade-in duration-300">
              {/* Location & Directions Map */}
              <div ref={mapRef} className="rounded-none border border-slate-200 bg-white p-6 md:p-8 text-left space-y-4 shadow-glass-sm">
                <div className="flex justify-between items-center border-b border-slate-150 pb-3">
                  <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-rose-550" />
                    <span>Locate Storefront</span>
                  </h3>
                  <div className="flex items-center space-x-3">
                    {isOwnerOrAdmin && (
                      <button
                        onClick={handleStartEditMap}
                        className="text-[10px] font-black uppercase text-slate-600 hover:text-indigo-600 hover:border-indigo-200 flex items-center space-x-1.5 transition-colors border border-slate-250 px-3 py-1.5 bg-slate-50 shadow-3xs"
                      >
                        <Edit className="w-3 h-3 text-slate-500" />
                        <span>Edit Location</span>
                      </button>
                    )}
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${business.latitude || 17.3850},${business.longitude || 78.4867}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-extrabold text-indigo-650 hover:text-indigo-755 flex items-center space-x-1 transition-colors"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {editingMap ? (
                  <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Latitude</label>
                        <input
                          type="text"
                          value={mapForm.latitude}
                          onChange={(e) => setMapForm({ ...mapForm, latitude: e.target.value })}
                          className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-brand-500 bg-slate-50"
                          placeholder="e.g. 17.4156"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Longitude</label>
                        <input
                          type="text"
                          value={mapForm.longitude}
                          onChange={(e) => setMapForm({ ...mapForm, longitude: e.target.value })}
                          className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-brand-500 bg-slate-50"
                          placeholder="e.g. 78.4346"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-455 tracking-wider">Google Maps Navigation/Directions Link</label>
                      <input
                        type="url"
                        value={mapForm.googleMapsLink}
                        onChange={(e) => setMapForm({ ...mapForm, googleMapsLink: e.target.value })}
                        className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-brand-500 bg-slate-50"
                        placeholder="e.g. https://goo.gl/maps/... or directions link"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-455 tracking-wider">Google Maps HTML Embed Code (Iframe)</label>
                      <textarea
                        value={mapForm.googleEmbedUrl}
                        onChange={(e) => setMapForm({ ...mapForm, googleEmbedUrl: e.target.value })}
                        className="w-full border border-slate-200 rounded px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-brand-500 bg-slate-50"
                        placeholder='Paste iframe code here: e.g. <iframe src="https://www.google.com/maps/embed?pb=..." ...></iframe>'
                        rows={3}
                      />
                      <p className="text-[9px] text-slate-400 font-semibold italic">Tip: You can copy this code from Google Maps by clicking "Share" &rarr; "Embed a map" &rarr; "Copy HTML".</p>
                    </div>

                    <div className="flex gap-2.5 pt-2 border-t border-slate-100">
                      <button
                        onClick={handleSaveMapDetails}
                        className="bg-[#008f5d] text-white px-4 py-2 text-xs font-bold rounded shadow-sm hover:shadow"
                      >
                        Save Location Settings
                      </button>
                      <button
                        onClick={() => setEditingMap(false)}
                        className="bg-slate-200 text-slate-700 px-4 py-2 text-xs font-bold rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="relative rounded-none overflow-hidden border border-slate-200 h-[200px] shadow-sm">
                      {hoursMap.googleEmbedUrl ? (
                        <iframe
                          src={hoursMap.googleEmbedUrl}
                          className="w-full h-full border-0"
                          allowFullScreen={true}
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                      ) : (hoursMap.googleMapsLink || (business.latitude && business.latitude !== 17.3850)) ? (
                        <MapWidget
                          latitude={business.latitude || 17.3850}
                          longitude={business.longitude || 78.4867}
                          businessName={business.name}
                          height="200px"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full bg-slate-50 text-slate-500 space-y-2 border border-dashed border-slate-200 p-4">
                          <MapPin className="w-7 h-7 text-slate-355" />
                          <div className="text-center">
                            <span className="block font-black text-2xs text-slate-800">No Location Map Shared</span>
                            <span className="block text-3xs text-slate-400 mt-0.5 max-w-[200px] font-semibold leading-relaxed">This store owner has not shared their GPS location map links yet.</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {(hoursMap.googleMapsLink || hoursMap.googleEmbedUrl || (business.latitude && business.latitude !== 17.3850)) ? (
                      <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <a
                          href={hoursMap.googleMapsLink || `https://www.google.com/maps/dir/?api=1&destination=${business.latitude || 17.3850},${business.longitude || 78.4867}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center space-x-2 py-3 rounded-none text-xs font-black text-white bg-indigo-650 hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <MapPin className="w-4 h-4 text-rose-300 animate-bounce" />
                          <span>Find Route & Navigate</span>
                        </a>
                        <button
                          onClick={handleCopyAddress}
                          className="px-6 py-3 border border-slate-200 bg-slate-50 text-slate-700 text-xs font-extrabold rounded-none hover:bg-slate-100 transition-colors flex items-center justify-center space-x-2"
                        >
                          {copiedAddress ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600 animate-scale" />
                              <span className="text-emerald-600">Address Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Full Address</span>
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="text-center pt-2">
                        <a
                          href={getWhatsappUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackAction('whatsapp')}
                          className="inline-flex items-center space-x-1.5 px-4 py-2.5 border border-emerald-500/20 bg-emerald-50 hover:bg-[#008f5d] text-emerald-700 hover:text-white font-extrabold text-xs transition-all shadow-2xs hover:shadow-md"
                        >
                          <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                          <span>Ask Owner on WhatsApp for Location</span>
                        </a>
                      </div>
                    )}

                    <p className="text-2xs text-slate-400 font-semibold italic">
                      📍 Coordinates: Latitude: {business.latitude || '17.3850'}, Longitude: {business.longitude || '78.4867'}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="animate-in fade-in duration-300">
              {/* Reviews Breakdown & Feedback list */}
              <div ref={reviewsRef} className="rounded-none border border-slate-200 bg-white p-6 md:p-8 text-left space-y-8 shadow-glass-sm">
                <h3 className="text-lg font-black text-slate-900 border-b border-slate-150 pb-4">
                  Reviews & Client Satisfaction
                </h3>

                {/* Ratings Breakdown Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-slate-50/50 p-5 rounded-none border border-slate-200/80">

                  {/* Left Average Card */}
                  <div className="md:col-span-4 text-center md:border-r border-slate-200 space-y-1.5 md:pr-6">
                    <span className="block text-4xl font-black text-slate-900 leading-none">
                      {business.averageRating || 'N/A'}
                    </span>
                    <div className="flex justify-center space-x-0.5">
                      {[1, 2, 3, 4, 5].map((s) => {
                        const isLit = s <= Math.round(business.averageRating || 0);
                        return <Star key={s} className={`w-4 h-4 ${isLit ? 'text-amber-400 fill-amber-400' : 'text-slate-350'}`} />;
                      })}
                    </div>
                    <span className="block text-3xs font-extrabold text-slate-450 uppercase tracking-wider">
                      Based on {totalReviews} Reviews
                    </span>
                  </div>

                  {/* Right Bars Column */}
                  <div className="md:col-span-8 space-y-2 text-left">
                    {ratingBreakdowns.map((val, idx) => {
                      const starsCount = 5 - idx;
                      return (
                        <div key={starsCount} className="flex items-center space-x-3 text-xs font-bold text-slate-600">
                          <span className="w-10 truncate text-slate-500 shrink-0 text-right">{starsCount} Star</span>
                          <div className="w-full bg-slate-200 h-2 rounded-none overflow-hidden shrink">
                            <div
                              className="bg-brand-500 h-full rounded-none transition-all duration-500"
                              style={{ width: `${val.percent}%` }}
                            ></div>
                          </div>
                          <span className="w-12 text-slate-450 shrink-0 text-[10px] text-right font-black">
                            {val.percent}% ({val.count})
                          </span>
                        </div>
                      );
                    })}
                  </div>

                </div>

                {/* Feedback List */}
                <div className="space-y-4.5">
                  {reviewsList.filter((r: any) => r.rating >= 3).length > 0 ? (
                    reviewsList
                      .filter((r: any) => r.rating >= 3)
                      .map((r: any) => {
                        const initialStr = r.user?.name ? r.user.name.charAt(0).toUpperCase() : 'U';

                        return (
                          <div
                            key={r.id}
                            className="rounded-none border border-slate-150 p-5 space-y-3.5 bg-white hover:border-slate-250 transition-colors shadow-2xs text-left"
                          >
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center space-x-3">
                                <div className="w-9 h-9 rounded-none bg-gradient-brand text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                                  {initialStr}
                                </div>
                                <div>
                                  <h4 className="font-extrabold text-slate-900 text-xs flex items-center">
                                    <span>{r.user?.name || 'Verified Client'}</span>
                                    <span className="ml-1.5 inline-flex items-center px-1 rounded-none bg-slate-100 text-[8px] font-bold text-slate-500 border border-slate-200 uppercase">
                                      Buyer
                                    </span>
                                  </h4>
                                  <span className="text-[9px] text-slate-400 font-semibold">{new Date(r.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>

                              {/* Stars */}
                              <div className="flex items-center space-x-0.5 bg-slate-50 border border-slate-150 px-2 py-1 rounded-none">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-3.5 h-3.5 ${s <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-slate-655 text-xs font-medium leading-relaxed italic">
                              "{r.comment}"
                            </p>
                          </div>
                        );
                      })
                  ) : (
                    <div className="text-center py-10 rounded-none border border-dashed border-slate-200 text-slate-500 text-xs font-semibold">
                      No positive client reviews posted currently. Be the first to leave your feedback!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CONTACT US */}
          {activeTab === 'contact' && (
            <div className="animate-in fade-in duration-300">
              <div className="rounded-none border border-slate-200 bg-white p-6 md:p-8 text-left space-y-6 shadow-glass-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/[0.02] rounded-none blur-3xl pointer-events-none"></div>

                <div className="space-y-1 border-b border-slate-150 pb-4">
                  <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
                    <Mail className="w-5 h-5 text-indigo-650" />
                    <span>Contact {business.name}</span>
                  </h3>
                  <p className="text-2xs text-slate-400 font-semibold">
                    Have questions or want to partner with us? Leave a message and our team will get back to you.
                  </p>
                </div>

                <B2BContactForm business={business} />
              </div>
            </div>
          )}
          {/* Google Maps style Popular Times / Daily Traffic Chart */}
          <div className="hidden lg:block">
            <TrafficChart />
          </div>

        </div>

        {/* RIGHT COLUMN: STICKY CONNECT WIDGET, WORKING HOURS */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24 text-left">

          {/* Quick Actions Panel */}
          <div className="rounded-none border border-slate-200 bg-white shadow-glass-sm overflow-hidden">
            {/* Premium gradient header */}
            <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-700 px-6 py-5 space-y-1">
              <h3 className="font-black text-white text-xs uppercase tracking-widest flex items-center space-x-1.5">
                <MessageSquare className="w-4 h-4 text-indigo-300" />
                <span>Connect Direct</span>
              </h3>
              <p className="text-[10px] text-indigo-300 font-semibold">Request customized quotes or call backs.</p>
            </div>

            <div className="p-6 space-y-5">

              {/* Direct inquiry CTA */}
              <button
                onClick={handleGeneralInquire}
                className="w-full inline-flex items-center justify-center space-x-2 py-3 rounded-none text-xs font-extrabold text-white bg-gradient-brand hover:shadow-lg hover:shadow-brand-500/10 hover:translate-y-[-1px] active:translate-y-[0px] transition-all duration-200 shrink-0"
              >
                <Send className="w-4 h-4 text-indigo-200" />
                <span>Request Pricing Quote</span>
              </button>

              {/* WhatsApp Integration with Presets selector */}
              <div className="space-y-3 pt-2">
                <span className="block text-[8px] uppercase font-bold text-slate-450 tracking-wider">WhatsApp Preset Message</span>
                <div className="grid grid-cols-3 gap-1 bg-slate-100 p-0.5 border border-slate-200 rounded-none">
                  <button
                    onClick={() => setWhatsappTemplate('quotation')}
                    className={`py-1 text-[9px] font-black uppercase transition-all rounded-none ${whatsappTemplate === 'quotation' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'
                      }`}
                  >
                    Quote
                  </button>
                  <button
                    onClick={() => setWhatsappTemplate('callback')}
                    className={`py-1 text-[9px] font-black uppercase transition-all rounded-none ${whatsappTemplate === 'callback' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'
                      }`}
                  >
                    Callback
                  </button>
                  <button
                    onClick={() => setWhatsappTemplate('hours')}
                    className={`py-1 text-[9px] font-black uppercase transition-all rounded-none ${whatsappTemplate === 'hours' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500'
                      }`}
                  >
                    Hours
                  </button>
                </div>

                <a
                  href={getWhatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackAction('whatsapp')}
                  className="w-full inline-flex items-center justify-center space-x-2 py-3 border border-emerald-500/20 hover:bg-[#008f5d] bg-emerald-50 text-emerald-700 hover:text-white font-extrabold text-xs rounded-none transition-all shadow-2xs hover:shadow-md hover:shadow-emerald-500/15"
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

            </div>{/* end padded inner div */}
            {/* Phone */}
            <div className="flex items-center space-x-3 text-xs text-slate-700 font-semibold group relative">
              <div className="w-7 h-7 rounded-none bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-650 shrink-0 group-hover:scale-105 transition-transform">
                <Phone className="w-3.5 h-3.5" />
              </div>
              {editingField === 'phone' ? (
                <div className="flex-1 flex gap-1 items-center">
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="border border-slate-300 rounded px-1.5 py-0.5 text-xs w-full font-normal text-slate-800 focus:outline-none"
                    autoFocus
                  />
                  <button onClick={() => handleSaveField('phone')} className="bg-[#008f5d] text-white px-2 py-0.5 text-2xs font-bold rounded">Save</button>
                  <button onClick={() => setEditingField(null)} className="bg-slate-200 text-slate-700 px-2 py-0.5 text-2xs font-bold rounded">X</button>
                </div>
              ) : (
                <div className="min-w-0 flex-1 pr-6">
                  <span className="block text-[8px] uppercase font-bold text-slate-450 tracking-wider">Phone</span>
                  <a
                    href={`tel:${business.phone}`}
                    onClick={() => trackAction('phone')}
                    className="hover:underline hover:text-brand-600 truncate block text-slate-800 font-bold"
                  >
                    {business.phone}
                  </a>
                  {isOwnerOrAdmin && (
                    <button
                      onClick={() => {
                        setEditingField('phone');
                        setEditValue(business.phone);
                      }}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Edit Phone"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Email */}
            <div className="flex items-center space-x-3 text-xs text-slate-700 font-semibold group relative">
              <div className="w-7 h-7 rounded-none bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-650 shrink-0 group-hover:scale-105 transition-transform">
                <Mail className="w-3.5 h-3.5" />
              </div>
              {editingField === 'email' ? (
                <div className="flex-1 flex gap-1 items-center">
                  <input
                    type="email"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="border border-slate-300 rounded px-1.5 py-0.5 text-xs w-full font-normal text-slate-800 focus:outline-none"
                    autoFocus
                  />
                  <button onClick={() => handleSaveField('email')} className="bg-[#008f5d] text-white px-2 py-0.5 text-2xs font-bold rounded">Save</button>
                  <button onClick={() => setEditingField(null)} className="bg-slate-200 text-slate-700 px-2 py-0.5 text-2xs font-bold rounded">X</button>
                </div>
              ) : (
                <div className="min-w-0 flex-1 pr-6">
                  <span className="block text-[8px] uppercase font-bold text-slate-455 tracking-wider">Email</span>
                  <a href={`mailto:${business.email}`} className="hover:underline hover:text-brand-600 truncate block text-slate-805 font-bold">{business.email}</a>
                  {isOwnerOrAdmin && (
                    <button
                      onClick={() => {
                        setEditingField('email');
                        setEditValue(business.email);
                      }}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Edit Email"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Website */}
            {(business.website || isOwnerOrAdmin) && (
              <div className="flex items-center space-x-3 text-xs text-slate-700 font-semibold group relative">
                <div className="w-7 h-7 rounded-none bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-650 shrink-0 group-hover:scale-105 transition-transform">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                {editingField === 'website' ? (
                  <div className="flex-1 flex gap-1 items-center">
                    <input
                      type="url"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="border border-slate-300 rounded px-1.5 py-0.5 text-xs w-full font-normal text-slate-850 focus:outline-none"
                      autoFocus
                    />
                    <button onClick={() => handleSaveField('website')} className="bg-[#008f5d] text-white px-2 py-0.5 text-2xs font-bold rounded">Save</button>
                    <button onClick={() => setEditingField(null)} className="bg-slate-200 text-slate-700 px-2 py-0.5 text-2xs font-bold rounded">X</button>
                  </div>
                ) : (
                  <div className="min-w-0 flex-1 pr-6">
                    <span className="block text-[8px] uppercase font-bold text-slate-455 tracking-wider">Website</span>
                    {business.website ? (
                      <a href={business.website} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-brand-600 truncate block text-slate-805 font-bold">{business.website}</a>
                    ) : (
                      <span className="block text-slate-400 font-medium italic">No website added</span>
                    )}
                    {isOwnerOrAdmin && (
                      <button
                        onClick={() => {
                          setEditingField('website');
                          setEditValue(business.website || '');
                        }}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Edit Website"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

        {/* Verification & Trust Badge Block (Govt Check Mockup) */}
        <div className="rounded-none border border-slate-200 bg-white p-6 shadow-glass-sm space-y-4">
          <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2 pb-2.5 border-b border-slate-150">
            <ShieldCheck className="w-4.5 h-4.5 text-indigo-600" />
            <span>Verified Store Credentials</span>
          </h3>
          <div className="space-y-3 text-xs font-semibold">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 text-slate-600">
              <span className="text-slate-500 font-medium">B2B Trust Index</span>
              <span className="text-emerald-600 font-extrabold">98% (High Response)</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 text-slate-600">
              <span className="text-slate-500 font-medium">Govt GSTIN Record</span>
              <span className="text-slate-800 font-extrabold">{business.status === 'VERIFIED' ? 'Active & Checked' : 'Pending Verification'}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 text-slate-600">
              <span className="text-slate-500 font-medium">Store Authenticated</span>
              <span className="text-indigo-650 font-extrabold">Govt DB Registry ID Checked</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span className="text-slate-500 font-medium">Transaction Guarantee</span>
              <span className="text-slate-805 font-extrabold text-[10px]">Secure Gateway Active</span>
            </div>
          </div>
        </div>

        {/* Quick Info & Payment Modes Block */}
        <div className="rounded-none border border-slate-200 bg-white p-6 shadow-glass-sm space-y-4">
          <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center space-x-2 pb-2.5 border-b border-slate-150">
            <Award className="w-4.5 h-4.5 text-brand-600" />
            <span>B2B Store Quick Info</span>
          </h3>
          <div className="space-y-3 text-xs font-semibold">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 text-slate-655">
              <span className="text-slate-500 font-medium">Year Established</span>
              <span className="text-slate-800 font-extrabold">2018</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 text-slate-655">
              <span className="text-slate-500 font-medium">Response Rate</span>
              <span className="text-emerald-600 font-extrabold">&lt; 15 Mins (Fast)</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 text-slate-655">
              <span className="text-slate-500 font-medium">Languages</span>
              <span className="text-slate-800 font-extrabold">English, Hindi, Telugu</span>
            </div>
            <div className="space-y-1.5 pt-1.5">
              <span className="text-slate-500 font-medium block">Accepted Payment Modes</span>
              <div className="flex flex-wrap gap-1.5">
                {['UPI / QR', 'GST Invoice', 'Net Banking', 'Credit Card', 'Cash'].map((m) => (
                  <span key={m} className="px-2 py-0.5 border border-slate-200 bg-slate-50 text-slate-600 text-[9px] font-black uppercase rounded-none">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Working Hours Card */}
        <div className="rounded-none border border-slate-200 bg-white shadow-glass-sm overflow-hidden">
          {/* premium section header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 flex items-center justify-between">
            <h3 className="font-black text-white text-xs uppercase tracking-widest flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-300" />
              <span>Working Hours</span>
            </h3>
            {isOwnerOrAdmin && (
              <button
                onClick={() => {
                  const dayHours: Record<string, string> = {};
                  ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].forEach(d => {
                    dayHours[d] = hoursMap[d] || '9:00 AM - 8:00 PM';
                  });
                  setEditingField('hours');
                  setEditValue(dayHours);
                }}
                className="text-slate-400 hover:text-white p-1 transition-colors"
                title="Edit Hours"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="p-6">
            {editingField === 'hours' ? (
              <div className="space-y-2 mt-2">
                {Object.keys(editValue).map((day) => (
                  <div key={day} className="flex justify-between items-center text-xs">
                    <span className="capitalize text-slate-500 font-medium">{day}</span>
                    <input
                      type="text"
                      value={editValue[day]}
                      onChange={(e) => setEditValue({ ...editValue, [day]: e.target.value })}
                      className="border border-slate-300 rounded px-1.5 py-0.5 text-2xs font-normal text-slate-800 w-2/3 text-right focus:outline-none"
                    />
                  </div>
                ))}
                <div className="flex gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => handleSaveField('hours')}
                    className="bg-[#008f5d] text-white px-3 py-1.5 text-xs font-bold rounded"
                  >
                    Save Hours
                  </button>
                  <button
                    onClick={() => setEditingField(null)}
                    className="bg-slate-200 text-slate-700 px-3 py-1.5 text-xs font-bold rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs font-semibold">
                {Object.keys(hoursMap).length > 0 ? (
                  Object.keys(hoursMap).map((day) => (
                    <div key={day} className="flex justify-between border-b border-slate-100 pb-1.5 capitalize text-slate-600">
                      <span className="text-slate-500 font-medium">{day}</span>
                      <span className="text-slate-850 font-extrabold">{hoursMap[day]}</span>
                    </div>
                  ))
                ) : (
                  ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                    <div key={day} className="flex justify-between border-b border-slate-100 pb-1.5 text-slate-600">
                      <span className="text-slate-500 font-medium">{day}</span>
                      <span className="text-slate-850 font-extrabold">9:00 AM - 8:00 PM</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>{/* end p-6 */}
        </div>

        {/* Review Submission Box with dynamic star highlights */}
        <div className="rounded-none border border-slate-200 bg-white shadow-glass-sm overflow-hidden">
          <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-indigo-900 px-6 py-4">
            <h3 className="font-black text-white text-xs uppercase tracking-widest flex items-center space-x-2 pb-0">
              <Calendar className="w-4.5 h-4.5 text-rose-300" />
              <span>Submit Store Review</span>
            </h3>
          </div>
          <div className="p-6 space-y-4">

            {token ? (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {reviewError && (
                  <div className="p-3 rounded-none bg-red-50 border border-red-200 text-red-650 text-xs">
                    {reviewError}
                  </div>
                )}

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Rating Stars</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-0.5 focus:outline-none hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${(hoverRating !== null ? s <= hoverRating : s <= rating)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-350'
                            }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-black uppercase tracking-wider text-slate-400 mb-1.5">Comment Feed</label>
                  <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe your service experience with this dealer..."
                    className="w-full rounded-none p-3 text-xs glass-input resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-none text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-55 transition-all shadow-sm"
                >
                  {submittingReview ? <Loader2 className="w-4.5 h-4.5 animate-spin mr-1.5 text-white" /> : null}
                  <span>Submit Review</span>
                </button>
              </form>
            ) : (
              <div className="text-center p-4 border border-dashed border-slate-200 rounded-none bg-slate-50/50 space-y-2">
                <p className="text-slate-500 text-xs font-semibold leading-normal">You must be logged in to submit a dealer storefront review.</p>
                <button
                  onClick={() => {
                    navigate(window.location.pathname, { replace: true, state: { openLogin: true } });
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-2xs font-extrabold rounded-none text-slate-700 transition-colors"
                >
                  Sign In / Login
                </button>
              </div>
            )}
          </div>
        </div>

      </div>

    </section>

            {/* 3. PHOTO LIGHTBOX MODAL OVERLAY */}
            {isLightboxOpen && (
              <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                <button
                  onClick={() => setIsLightboxOpen(false)}
                  className="absolute top-6 right-6 text-white/70 hover:text-white p-2 border border-white/10 hover:bg-white/10 transition-colors rounded-none"
                  title="Close Lightbox"
                >
                  <X className="w-6 h-6" />
                </button>

                <button
                  onClick={() => setActivePhotoIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
                  className="absolute left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 border border-white/10 hover:bg-white/10 transition-colors rounded-none"
                  title="Previous Image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="max-w-4xl max-h-[80vh] flex flex-col items-center">
                  <img
                    src={galleryImages[activePhotoIndex]}
                    alt={`Gallery View ${activePhotoIndex + 1}`}
                    className="max-w-full max-h-[70vh] object-contain border border-white/10 rounded-none shadow-2xl"
                  />
                  <span className="text-white/60 text-xs font-bold uppercase tracking-widest mt-4">
                    Photo {activePhotoIndex + 1} / {galleryImages.length}
                  </span>
                </div>

                <button
                  onClick={() => setActivePhotoIndex((prev) => (prev + 1) % galleryImages.length)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-3 border border-white/10 hover:bg-white/10 transition-colors rounded-none"
                  title="Next Image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            )}

            {/* Lead Modal dialog overlay */}
            <LeadModal
              isOpen={isLeadOpen}
              onClose={() => setIsLeadOpen(false)}
              businessId={business.id}
              businessName={business.name}
              initialMessage={leadInitialMessage}
            />

            {/* Product Image Lightbox */}
            {productLightboxImg && (
              <div className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                <button
                  onClick={() => setProductLightboxImg(null)}
                  className="absolute top-6 right-6 text-white/70 hover:text-white p-2 border border-white/10 hover:bg-white/10 transition-colors rounded-none"
                  title="Close Lightbox"
                >
                  <X className="w-6 h-6" />
                </button>
                <div className="max-w-4xl max-h-[80vh] flex flex-col items-center">
                  <img
                    src={productLightboxImg}
                    alt="Product View"
                    className="max-w-full max-h-[75vh] object-contain border border-white/10 rounded-none shadow-2xl"
                  />
                  <span className="text-white/60 text-xs font-bold uppercase tracking-widest mt-4">
                    Product Zoom Preview
                  </span>
                </div>
              </div>
            )}

            {/* Product Details Modal Overlay */}
            {activeProductDetails && (() => {
              const parts = (activeProductDetails.description || '').split(' ||| ');
              const descText = parts[0] || '';
              const subCategoryTag = parts[1] || '';

              // Extract recommended products (other products from the same storefront)
              const recommendedProducts = products
                .filter(p => p.id !== activeProductDetails.id)
                .slice(0, 4);

              return (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
                  {/* Backdrop */}
                  <div
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
                    onClick={() => setActiveProductDetails(null)}
                  ></div>

                  {/* Modal Box */}
                  <div className="relative w-full max-w-4xl bg-white border border-slate-200 shadow-2xl z-10 flex flex-col md:flex-row rounded-none text-slate-800 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto md:overflow-visible">

                    {/* Close Button */}
                    <button
                      onClick={() => setActiveProductDetails(null)}
                      className="absolute top-4 right-4 z-20 bg-slate-100 hover:bg-slate-200 border border-slate-200 p-1.5 transition-colors rounded-none"
                      title="Close details"
                    >
                      <X className="w-4 h-4 text-slate-700" />
                    </button>

                    {/* Left Column: Image Banner */}
                    <div className="w-full md:w-1/2 bg-slate-50 relative shrink-0 border-b md:border-b-0 md:border-r border-slate-150 flex items-center justify-center min-h-[300px] md:min-h-[480px]">
                      <img
                        src={activeProductDetails.image || 'https://images.unsplash.com/photo-1546269901-ba9599a7e63c?w=600'}
                        alt={activeProductDetails.name}
                        className="w-full h-full object-cover max-h-[350px] md:max-h-full"
                      />

                      {activeProductDetails.isOffer && (
                        <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-extrabold text-[8px] px-2 py-0.5 rounded shadow uppercase tracking-wider animate-pulse">
                          {activeProductDetails.offerDiscount || 'Special Deal'}
                        </div>
                      )}
                    </div>

                    {/* Right Column: details & suggested */}
                    <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto max-h-[85vh] md:max-h-[600px] text-left space-y-6">

                      {/* Meta details */}
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <span className="inline-block px-2 py-0.5 bg-indigo-50 border border-indigo-150 text-indigo-755 font-extrabold text-[8px] uppercase tracking-wider">
                            {subCategoryTag || 'General'}
                          </span>
                          <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                            {activeProductDetails.name}
                          </h2>
                          <div className="flex items-center space-x-3 text-[10px] font-bold text-slate-400">
                            <span>PID-{activeProductDetails.id.slice(0, 8).toUpperCase()}</span>
                            <span>•</span>
                            <span>SID-{business.id.slice(0, 8).toUpperCase()}</span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline space-x-1.5 py-1">
                          <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider">Est. Wholesale Price</span>
                          <span className="text-2xl font-black text-slate-950 flex items-center">
                            <IndianRupee className="w-5 h-5 text-slate-900 mr-0.5 animate-pulse" />
                            <span>{activeProductDetails.price.toLocaleString()}</span>
                          </span>
                        </div>

                        {/* Description */}
                        <div className="space-y-2 border-t border-slate-150 pt-4">
                          <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-wider">Product Specifications</h4>
                          <p className="text-xs text-slate-655 leading-relaxed font-medium">
                            {descText}
                          </p>
                        </div>

                        {/* Action */}
                        <button
                          onClick={() => {
                            setActiveProductDetails(null);
                            handleProductInquire(activeProductDetails.name);
                          }}
                          className="w-full py-3 bg-indigo-650 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 rounded-none"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Inquire & Request Wholesale Quote</span>
                        </button>
                      </div>

                      {/* Suggested / Recommended Products */}
                      {recommendedProducts.length > 0 && (
                        <div className="border-t border-slate-150 pt-5 space-y-3">
                          <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-wider flex items-center space-x-1">
                            <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                            <span>Recommended from this seller</span>
                          </h4>
                          <div className="grid grid-cols-2 gap-2">
                            {recommendedProducts.map(p => {
                              const subParts = (p.description || '').split(' ||| ');
                              const subTag = subParts[1] || 'General';

                              return (
                                <div
                                  key={p.id}
                                  onClick={() => setActiveProductDetails(p)}
                                  className="p-2 border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-350 transition-all flex items-center space-x-2 cursor-pointer select-none group/rec"
                                >
                                  <div className="w-10 h-10 bg-slate-100 border border-slate-200 rounded-none overflow-hidden shrink-0">
                                    <img src={p.image || 'https://images.unsplash.com/photo-1546269901-ba9599a7e63c?w=150'} alt={p.name} className="w-full h-full object-cover group-hover/rec:scale-105 transition-transform duration-300" />
                                  </div>
                                  <div className="min-w-0 flex-grow text-left">
                                    <h5 className="font-extrabold text-slate-800 text-[10px] truncate leading-tight group-hover/rec:text-indigo-650 transition-colors">{p.name}</h5>
                                    <div className="flex items-center space-x-1.5 mt-0.5">
                                      <span className="text-[9px] font-extrabold text-slate-900">₹{p.price.toLocaleString()}</span>
                                      {subTag && subTag.toLowerCase() !== 'general' && (
                                        <span className="inline-block px-1 py-0.2 rounded bg-indigo-50 border border-indigo-100 text-indigo-600 font-extrabold text-[5px] uppercase tracking-wider">
                                          {subTag}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                    </div>

                  </div>
                </div>
              );
            })()}
          </div>
          );
};

          export default BusinessDetails;
