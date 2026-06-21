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
    <div className="flex flex-col rounded-none glass-panel glass-panel-hover overflow-hidden h-full group">
      {/* Thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
        <img
          src={primaryImage}
          alt={business.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        {business.category && (
          <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-0.5 rounded-none text-xs font-semibold bg-brand-600/90 text-white backdrop-blur-sm shadow-sm">
            {business.category.name}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-5">
        <div className="flex items-center justify-between mb-2">
          {/* Rating */}
          <div className="flex items-center space-x-1">
            <Star className={`w-4 h-4 ${rating > 0 ? 'text-amber-400 fill-amber-400' : 'text-slate-400'}`} />
            <span className={`text-sm font-bold ${rating > 0 ? 'text-slate-800' : 'text-slate-400'}`}>
              {rating > 0 ? rating : 'No ratings'}
            </span>
            {reviewCount > 0 && (
              <span className="text-xs text-slate-500">({reviewCount} reviews)</span>
            )}
          </div>
        </div>

        {/* Name */}
        <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-brand-600 transition-colors">
          <Link to={`/business/${business.slug}`}>{business.name}</Link>
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-655 line-clamp-2 mb-4 flex-grow">
          {business.description}
        </p>

        {/* Location & Address */}
        <div className="flex items-start space-x-1.5 text-xs text-slate-600 mb-5">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span className="line-clamp-1">{business.address}, {business.city}</span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          {business.whatsapp ? (
            <a
              href={`https://wa.me/91${business.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-1.5 px-3 py-2 border border-slate-200 hover:border-emerald-500/50 hover:bg-emerald-50 text-xs font-semibold rounded-none text-emerald-600 transition-colors duration-200"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          ) : (
            <div className="text-slate-455 bg-slate-50 border border-slate-200 rounded-none text-xs flex items-center justify-center space-x-1">
              <span>No WhatsApp</span>
            </div>
          )}

          <Link
            to={`/business/${business.slug}`}
            className="inline-flex items-center justify-center px-3 py-2 text-xs font-semibold rounded-none text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors duration-200 border border-slate-200/80"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};
