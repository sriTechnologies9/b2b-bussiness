import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, MapPin, Sparkles, Loader2, ArrowRight, ShoppingBag
} from 'lucide-react';
import { apiClient } from '../api/client';

const CATEGORY_COLORS: { [key: string]: string } = {
  restaurants: 'text-rose-600 bg-rose-50 border-rose-100',
  electricians: 'text-amber-600 bg-amber-50 border-amber-100',
  plumbers: 'text-blue-600 bg-blue-50 border-blue-100',
  clinics: 'text-emerald-600 bg-emerald-50 border-emerald-100',
  gyms: 'text-indigo-600 bg-indigo-50 border-indigo-100',
  salons: 'text-pink-600 bg-pink-50 border-pink-100',
  'cctv-shops': 'text-cyan-600 bg-cyan-50 border-cyan-100',
  'real-estate': 'text-violet-600 bg-violet-50 border-violet-100',
  'retail-stores': 'text-teal-600 bg-teal-50 border-teal-100'
};

export const ProductsFeed: React.FC = () => {
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get('filter');
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  
  const [filterType, setFilterType] = useState<'all' | 'products' | 'offers'>(
    filterParam === 'offers' ? 'offers' : filterParam === 'products' ? 'products' : 'all'
  );

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Reset pagination when search parameters change
  useEffect(() => {
    setCurrentPage(1);
    setProducts([]);
    loadDirectoryData(1);
  }, [searchQuery, cityQuery, filterType]);

  useEffect(() => {
    const param = searchParams.get('filter');
    if (param === 'offers') {
      setFilterType('offers');
    } else if (param === 'products') {
      setFilterType('products');
    } else {
      setFilterType('all');
    }
  }, [searchParams]);

  const loadDirectoryData = async (page = 1) => {
    try {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      const params = new URLSearchParams();
      if (searchQuery) params.append('query', searchQuery);
      if (cityQuery) params.append('city', cityQuery);
      if (filterType !== 'all') params.append('filterType', filterType);
      params.append('page', page.toString());
      params.append('limit', '12');

      const dataProd = await apiClient.get(`/businesses/all/products?${params.toString()}`);
      
      if (page === 1) {
        setProducts(dataProd);
      } else {
        setProducts(prev => [...prev, ...dataProd]);
      }
      setHasMore(dataProd.length === 12);
    } catch (err) {
      console.error('Failed to load directory data', err);
    } finally {
      if (page === 1) setLoading(false);
      else setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadDirectoryData(nextPage);
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-500 text-xs font-semibold uppercase tracking-wider">
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Local Marketplace Feed</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Browse Products & <span className="bg-gradient-to-br from-[#6366f1] via-[#4338ca] to-[#312e81] bg-clip-text text-transparent">Special Deals</span>
        </h1>
        <p className="text-sm md:text-base text-slate-500 max-w-xl mx-auto">
          Discover products, services, and exclusive discount offers uploaded directly by verified local businesses near you.
        </p>
      </div>

      {/* Filter and Search Bar Widget */}
      <div className="p-4 rounded-2xl glass-panel border border-slate-200 shadow-glass space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          
          {/* Keyword Search */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products, items, services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl pl-9 pr-3 py-2 text-sm glass-input font-bold"
            />
          </div>

          {/* City Search */}
          <div className="md:col-span-4 relative">
            <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by city (e.g. Hyderabad)..."
              value={cityQuery}
              onChange={(e) => setCityQuery(e.target.value)}
              className="w-full rounded-xl pl-9 pr-3 py-2 text-sm glass-input font-bold"
            />
          </div>

          {/* Type Selector Tabs */}
          <div className="md:col-span-3 flex justify-between bg-slate-100/60 border border-slate-200/50 p-1 rounded-xl gap-1">
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 text-center py-1.5 rounded-lg text-2xs font-bold uppercase transition-all ${
                filterType === 'all' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-450 hover:text-slate-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterType('products')}
              className={`flex-1 text-center py-1.5 rounded-lg text-2xs font-bold uppercase transition-all ${
                filterType === 'products' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-450 hover:text-slate-700'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => setFilterType('offers')}
              className={`flex-1 text-center py-1.5 rounded-lg text-2xs font-bold uppercase transition-all ${
                filterType === 'offers' ? 'bg-white text-slate-800 shadow-sm border border-slate-200/50' : 'text-slate-450 hover:text-slate-700'
              }`}
            >
              Offers
            </button>
          </div>

        </div>
      </div>

      {/* PRODUCTS SHOWCASE GRID */}
      <main className="w-full space-y-6">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
            <span className="text-xs text-slate-500 font-semibold">Filtering product offerings...</span>
          </div>
        ) : products.length > 0 ? (
          <div className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 items-stretch">
              {products.map((item) => (
                <div 
                  key={item.id} 
                  className="rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between text-left relative group h-full hover:-translate-y-0.5 duration-300"
                >
                  {/* Product Image */}
                  <div className="aspect-[16/10] bg-slate-50 relative overflow-hidden shrink-0 border-b border-slate-100">
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                    )}

                    {/* Category Specific Color Badge */}
                    {item.business?.category?.slug && (
                      <span className={`absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[7px] font-extrabold uppercase border ${
                        CATEGORY_COLORS[item.business.category.slug] || 'bg-slate-100 text-slate-655 border-slate-200'
                      }`}>
                        {item.business.category.name}
                      </span>
                    )}

                    {/* Offer Tag */}
                    {item.isOffer && (
                      <div className="absolute top-1.5 left-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 border border-amber-400/30 text-white font-extrabold text-[7px] px-1.5 py-0.5 rounded shadow uppercase tracking-wide flex items-center space-x-0.5">
                        <Sparkles className="w-2 h-2 text-white animate-pulse" />
                        <span>{item.offerDiscount || 'DEAL'}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Details */}
                  <div className="p-2.5 flex-grow flex flex-col justify-between space-y-2">
                    
                    {/* Text Info */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-start gap-1">
                        <h3 className="font-bold text-slate-900 text-xs line-clamp-1 group-hover:text-indigo-650 transition-colors">
                          {item.name}
                        </h3>
                        <span className="font-extrabold text-slate-900 text-xs flex items-center shrink-0">
                          <span>₹{item.price.toLocaleString()}</span>
                        </span>
                      </div>
                      
                      {(() => {
                        const parts = (item.description || '').split(' ||| ');
                        const desc = parts[0] || '';
                        const tag = parts[1] || '';
                        return (
                          <div className="space-y-1 text-left">
                            <p className="text-[9px] text-slate-500 line-clamp-2 leading-snug">
                              {desc}
                            </p>
                            {tag && tag.toLowerCase() !== 'general' && (
                              <div className="flex flex-wrap gap-1 mt-1">
                                {tag.split(',').map((s: string) => s.trim()).filter(Boolean).map((singleTag: string, tIdx: number) => (
                                  <span key={tIdx} className="inline-block px-1 py-0.5 rounded bg-brand-50 border border-brand-100 text-brand-600 font-extrabold text-[6px] uppercase tracking-wider">
                                    {singleTag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Seller Business Info Link */}
                    <div className="pt-2 border-t border-slate-100 flex flex-col space-y-1.5">
                      {item.business && (() => {
                        let logoUrl = '';
                        try {
                          if (item.business.hours) {
                            const parsed = typeof item.business.hours === 'string' ? JSON.parse(item.business.hours) : item.business.hours;
                            logoUrl = parsed.logoUrl || '';
                          }
                        } catch (err) {}

                        return (
                          <div className="flex items-center space-x-2 bg-slate-50/50 p-1.5 border border-slate-100 rounded-lg text-left">
                            <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-200 bg-white flex items-center justify-center shrink-0 shadow-2xs">
                              {logoUrl ? (
                                <img src={logoUrl} alt={item.business.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-black text-[8px] uppercase">
                                  {item.business.name.slice(0, 2)}
                                </div>
                              )}
                            </div>
                            <div className="flex-grow min-w-0">
                              <span className="block text-[6px] uppercase font-bold text-slate-400 tracking-wider leading-none">Sold By</span>
                              <span className="block font-bold text-slate-750 text-[9px] truncate mt-0.5 leading-none">{item.business.name}</span>
                              <span className="block text-[8px] text-slate-450 italic truncate leading-none mt-0.5">{item.business.city}</span>
                            </div>
                          </div>
                        );
                      })()}
                      
                      <Link
                        to={item.business ? `/business/${item.business.slug}` : '#'}
                        className="inline-flex items-center justify-between text-[9px] font-bold text-indigo-600 hover:text-indigo-700 hover:translate-x-0.5 transition-all pt-1"
                      >
                        <span>View Storefront</span>
                        <ArrowRight className="w-3 h-3 text-indigo-500" />
                      </Link>
                    </div>

                  </div>

                </div>
              ))}
            </div>

            {/* Pagination & Load More Actions */}
            {hasMore && (
              <div className="flex flex-col items-center justify-center pt-8 space-y-5">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all shadow hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 inline-flex items-center"
                >
                  {loadingMore && <Loader2 className="w-4 h-4 mr-2 animate-spin text-slate-400" />}
                  View More Products
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-28 rounded-2xl border border-dashed border-slate-300 bg-white shadow-sm">
            <p className="text-slate-500 mb-2 font-semibold">No products or special deals match your filters.</p>
            <p className="text-xs text-slate-450">Try modifying your keyword search, selecting "All", or expanding your city search.</p>
          </div>
        )}

      </main>

    </div>
  );
};

export default ProductsFeed;
