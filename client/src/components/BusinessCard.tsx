import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, MessageSquare } from 'lucide-react';

export interface BusinessCardProps {
  business: {
    id: string;
    name: string;
    slug: string;
    description: string;
    address: string;
    city: string;
    state: string;
    phone: string;
    whatsapp?: string;
    gallery: string;
    averageRating?: number;
    reviewCount?: number;
    category?: {
      name: string;
      icon: string;
    };
  };
}

export const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  const rating = business.averageRating || 0;
  const reviewCount = business.reviewCount || 0;
  
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

  // Extract first image from list
  const imageUrls = parseGallery(business.gallery);
  const primaryImage = imageUrls[0] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500';

  return (
    <div className="flex flex-col rounded-none bg-gradient-to-b from-white to-slate-50/40 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_-6px_rgba(0,0,0,0.12)] transition-all duration-300 h-full group relative overflow-hidden">
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
        <img
          src={primaryImage}
          alt={business.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        {/* Diagonal shape cut */}
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-white -mb-2 transform skew-y-3 origin-bottom-right z-10 transition-transform group-hover:skew-y-2"></div>
        
        {business.category && (
          <span className="absolute top-2.5 left-2.5 inline-flex items-center px-1.5 py-0.5 rounded-none text-[8px] sm:text-xs font-semibold bg-brand-600/90 text-white backdrop-blur-sm shadow-sm z-20">
            {business.category.name}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-3 sm:p-5 relative">
        {/* Background shape accent */}
        <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tr from-brand-500/[0.04] to-transparent rounded-tl-full pointer-events-none group-hover:scale-125 transition-transform duration-500 z-0"></div>
        <div className="flex items-center justify-between mb-2">
          {/* Rating */}
          <div className="flex items-center space-x-1">
            <Star className={`w-3 h-3 sm:w-4 sm:h-4 ${rating > 0 ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
            <span className={`text-2xs sm:text-sm font-bold ${rating > 0 ? 'text-slate-800' : 'text-slate-400'}`}>
              {rating > 0 ? rating : 'No ratings'}
            </span>
            {reviewCount > 0 && (
              <span className="text-[9px] sm:text-xs text-slate-500 font-medium">({reviewCount})</span>
            )}
          </div>
        </div>

        {/* Name */}
        <h3 className="text-xs sm:text-base md:text-lg font-bold text-slate-900 mb-1.5 line-clamp-1 group-hover:text-brand-600 transition-colors">
          <Link to={`/business/${business.slug}`}>{business.name}</Link>
        </h3>

        {/* Description */}
        <p className="text-[10px] sm:text-xs md:text-sm text-slate-655 line-clamp-2 mb-3 flex-grow font-medium leading-relaxed">
          {business.description}
        </p>

        {/* Location & Address */}
        <div className="flex items-start space-x-1 text-[9px] sm:text-xs text-slate-600 mb-4">
          <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 shrink-0 mt-0.5" />
          <span className="line-clamp-1">{business.address}, {business.city}</span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-1.5 mt-auto">
          {business.whatsapp ? (
            <a
              href={`https://wa.me/91${business.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-1 px-1.5 py-1.5 border border-slate-200 hover:border-emerald-500/50 hover:bg-emerald-50 text-[10px] sm:text-xs font-bold rounded-none text-emerald-600 transition-colors duration-200"
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span>WhatsApp</span>
            </a>
          ) : (
            <div className="text-slate-455 bg-slate-50 border border-slate-200 rounded-none text-[10px] sm:text-xs flex items-center justify-center space-x-1 font-bold">
              <span>No Chat</span>
            </div>
          )}

          <Link
            to={`/business/${business.slug}`}
            className="inline-flex items-center justify-center px-1.5 py-1.5 text-[10px] sm:text-xs font-bold rounded-none text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors duration-200 border border-slate-200/80"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};
