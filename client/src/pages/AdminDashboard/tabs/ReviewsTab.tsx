import React, { useState, useEffect } from 'react';
import { Loader2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../../api/client';

interface ReviewsTabProps {
  addLog: (message: string) => void;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({ addLog }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const data = await apiClient.get('/admin/reviews');
      setReviews(data);
      addLog(`[Audit] Loaded review moderation list. Found ${data.length} entries.`);
    } catch (err) {
      console.error('Failed to fetch reviews', err);
      addLog(`[Error] Failed to load reviews.`);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const deleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await apiClient.delete(`/admin/reviews/${reviewId}`);
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      addLog(`[Audit] Deleted review ID ${reviewId}.`);
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Failed to delete review');
      addLog(`[Error] Failed to delete review ID ${reviewId}.`);
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Review Moderation Panel</h1>
        <p className="text-xs text-slate-500 mt-1">Review ratings submitted by users and remove fraudulent, abusive, or low-quality comments.</p>
      </div>

      {reviewsLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
        </div>
      ) : (
        <div className="rounded-none glass-panel border border-slate-200 overflow-hidden bg-white shadow-glass-sm animate-in fade-in-50 duration-200">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/65 border-b border-slate-150 text-slate-655 uppercase tracking-wider font-bold">
                  <th className="p-3.5">Business Name</th>
                  <th className="p-3.5">Review Submitter</th>
                  <th className="p-3.5 text-center">Rating</th>
                  <th className="p-3.5">Comment Feed</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <tr key={rev.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3.5 font-bold text-slate-900">
                        <Link to={`/business/${rev.business?.slug}`} className="hover:underline hover:text-rose-600">
                          {rev.business?.name}
                        </Link>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold">{rev.user?.name}</div>
                        <div className="text-[10px] text-slate-400">{rev.user?.email}</div>
                      </td>
                      <td className="p-3.5 text-center whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-none bg-amber-50 border border-amber-200 text-xs font-black text-amber-600">
                          ★ {rev.rating}.0
                        </span>
                      </td>
                      <td className="p-3.5 max-w-sm font-medium text-slate-600 leading-relaxed italic">
                        "{rev.comment}"
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => deleteReview(rev.id)}
                          className="inline-flex items-center justify-center p-1.5 rounded-none bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 shadow-2xs"
                          title="Delete Review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 italic">
                      No customer reviews found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
