import React from 'react';
import { Star } from 'lucide-react';

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
