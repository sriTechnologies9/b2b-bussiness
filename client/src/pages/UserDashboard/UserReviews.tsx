import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Star, Loader2, MessageSquare, Trash2, Calendar } from 'lucide-react';

export const UserReviews: React.FC = () => {
  const { token } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchReviews = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/reviews/my-reviews', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [token]);

  const handleDeleteReview = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    setDeletingId(id);

    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setReviews(prev => prev.filter(r => r.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete review');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting review');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  // Calculate metrics
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? parseFloat((reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1))
    : 0;

  // Casing ratings array count
  const ratingDistribution = [0, 0, 0, 0, 0]; // index 0 matches 1 star
  reviews.forEach(r => {
    const starIndex = Math.max(1, Math.min(5, r.rating)) - 1;
    ratingDistribution[starIndex]++;
  });

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-200">
      <div>
        <div className="flex items-center space-x-2 text-amber-600 font-extrabold text-[10px] uppercase tracking-widest mb-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>My Testimonials & Feedback</span>
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Reviews</h1>
        <p className="text-xs text-slate-500 mt-1">Review feedback ratings, comments, and testimonials you submitted across local businesses.</p>
      </div>

      {totalReviews > 0 && (
        /* Review Metrics Header */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Average Rating Block */}
          <div className="rounded-2xl bg-white border border-slate-200 p-5 flex flex-col justify-center items-center text-center shadow-sm relative overflow-hidden group">
            <div className="absolute -left-6 -bottom-6 w-16 h-16 bg-amber-500/[0.03] rounded-full blur-[8px] pointer-events-none group-hover:scale-150 transition-transform duration-500"></div>
            <div className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Average Rating Given</div>
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
            <div className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">Total Businesses Reviewed</div>
            <div className="text-3xl font-black text-slate-900 mt-1.5">
              {totalReviews}
            </div>
            <div className="text-2xs text-slate-450 font-bold mt-2.5 flex items-center space-x-1">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
              <span>Active directory feedback listings</span>
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
      )}

      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((rev) => (
            <div key={rev.id} className="rounded-2xl bg-white border border-slate-200 p-5 space-y-4 shadow-sm transition-all hover:shadow-md hover:border-slate-300 duration-300 relative group overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Review Header */}
              <div className="flex justify-between items-start pb-3 border-b border-slate-100 relative z-10">
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">
                    Reviewed: <span className="text-brand-600 hover:underline cursor-pointer">{rev.business?.name}</span>
                  </h4>
                  <div className="flex items-center mt-1 space-x-1.5 text-2xs text-slate-400 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Posted {new Date(rev.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  {/* Stars Row */}
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

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteReview(rev.id)}
                    disabled={deletingId === rev.id}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg border border-red-100 hover:bg-red-50 text-red-500 hover:text-red-750 inline-flex items-center"
                    title="Delete Review"
                  >
                    {deletingId === rev.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Review Text */}
              <div className="relative z-10">
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-medium italic pr-4 pl-1">
                  "{rev.comment}"
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 border border-dashed border-slate-200 rounded-3xl text-slate-500 text-sm bg-white shadow-sm flex flex-col items-center justify-center p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800">No Reviews Found</h3>
              <p className="text-xs text-slate-500">You have not posted any business feedback reviews yet. Visit listings to submit ratings.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default UserReviews;
