import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Star, Loader2, MessageSquare, Calendar, User } from 'lucide-react';
import { apiClient } from '../../api/client';

export const CustomerReviews: React.FC = () => {
  const { token } = useAuth();
  const [business, setBusiness] = useState<any | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinessReviews = async () => {
      if (!token) return;
      try {
        // 1. Get my business listing
        const bizList = await apiClient.get('/businesses/my-listings');
        if (bizList.length > 0) {
          const myBiz = bizList[0];
          
          // 2. Fetch full business listing details by slug (includes reviews with author user names)
          const details = await apiClient.get(`/businesses/slug/${myBiz.slug}`);
          setBusiness(details);
          setReviews(details.reviews || []);
        }
      } catch (err) {
        console.error('Failed to load reviews data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessReviews();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  if (!business) {
    return (
      <div className="rounded-2xl glass-panel border border-slate-200 p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-slate-800">No Business Profile Found</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          You must list your business profile first in order to receive customer reviews and feedback ratings.
        </p>
      </div>
    );
  }

  // Calculate metrics
  const totalReviews = reviews.length;
  const averageRating = business.averageRating || 0;

  // Star ratings distribution count
  const ratingDistribution = [0, 0, 0, 0, 0];
  reviews.forEach(r => {
    const starIndex = Math.max(1, Math.min(5, r.rating)) - 1;
    ratingDistribution[starIndex]++;
  });

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-200">
      <div>
        <div className="flex items-center space-x-2 text-brand-600 font-extrabold text-[10px] uppercase tracking-widest mb-1">
          <Star className="w-3.5 h-3.5 fill-brand-400 text-brand-400" />
          <span>Customer Feedback & Ratings</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Customer Reviews</h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor your customer satisfaction rating, feedback messages, and review ratings left for your business.
        </p>
      </div>

      {totalReviews > 0 ? (
        <>
          {/* Review Metrics Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Average Rating Block */}
            <div className="rounded-2xl bg-white border border-slate-200 p-5 flex flex-col justify-center items-center text-center shadow-sm relative overflow-hidden group">
              <div className="absolute -left-6 -bottom-6 w-16 h-16 bg-amber-500/[0.03] rounded-full blur-[8px] pointer-events-none group-hover:scale-150 transition-transform duration-500"></div>
              <div className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Average Rating</div>
              <div className="text-3xl font-black text-slate-900 mt-1.5 flex items-baseline">
                {averageRating}
                <span className="text-xs text-slate-400 font-bold ml-1">/ 5</span>
              </div>
              <div className="flex items-center space-x-0.5 mt-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= Math.round(averageRating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Total Reviews Block */}
            <div className="rounded-2xl bg-white border border-slate-200 p-5 flex flex-col justify-center items-center text-center shadow-sm relative overflow-hidden group">
              <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-indigo-500/[0.03] rounded-full blur-[8px] pointer-events-none group-hover:scale-150 transition-transform duration-500"></div>
              <div className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Total Reviews Received</div>
              <div className="text-3xl font-black text-slate-900 mt-1.5">
                {totalReviews}
              </div>
              <div className="text-2xs text-slate-450 font-bold mt-2.5 flex items-center space-x-1">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                <span>Active directory reviews</span>
              </div>
            </div>

            {/* Bar Chart Breakdown */}
            <div className="rounded-2xl bg-white border border-slate-200 p-4 space-y-1.5 shadow-sm text-left">
              <div className="text-[9px] uppercase font-extrabold text-slate-400 mb-1 tracking-wider">Stars Distribution</div>
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingDistribution[stars - 1];
                const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center text-2xs space-x-2 text-slate-500">
                    <span className="w-3.5 font-bold">{stars}★</span>
                    <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/30">
                      <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }}></div>
                    </div>
                    <span className="w-4 text-right font-extrabold text-slate-700">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="rounded-2xl bg-white border border-slate-200 p-5 space-y-3 shadow-sm transition-all hover:shadow-md duration-300 relative group overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <div className="flex justify-between items-start pb-2.5 border-b border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-xs font-bold text-brand-600">
                      <User className="w-4 h-4 text-brand-500" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-xs tracking-tight">
                        {rev.user?.name || 'Anonymous Customer'}
                      </h4>
                      <div className="flex items-center space-x-1.5 text-[10px] text-slate-450 font-medium">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Submitted {new Date(rev.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic pl-1 pr-4 font-medium">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-20 border border-dashed border-slate-200 rounded-3xl text-slate-500 text-sm bg-white shadow-sm flex flex-col items-center justify-center p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800">No Reviews Posted</h3>
            <p className="text-xs text-slate-505">Your business listing hasn't received any customer review ratings yet.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerReviews;
