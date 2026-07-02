import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, MapPin, Layers, Loader2 } from 'lucide-react';
import { BusinessCard } from '../components/BusinessCard';
import { MapWidget } from '../components/MapWidget';
import { apiClient } from '../api/client';

export const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  
  const [categories, setCategories] = useState<any[]>([]);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Update document title and meta description dynamically for SEO
  useEffect(() => {
    const q = searchParams.get('query') || '';
    const c = searchParams.get('city') || '';
    const cat = searchParams.get('category') || '';
    
    let titleStr = 'Search Local Businesses';
    if (cat) {
      const catObj = categories.find(x => x.slug === cat);
      titleStr = catObj ? `Top ${catObj.name}` : `Top ${cat}`;
    }
    if (q) titleStr += ` for "${q}"`;
    if (c) titleStr += ` in ${c}`;
    
    document.title = `${titleStr} | LocalConnect`;
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      `Find the best ${titleStr.toLowerCase()} on LocalConnect. Read user reviews, see shop location maps, and contact dealers directly.`
    );
  }, [searchParams, categories]);

  // Fetch categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await apiClient.get('/businesses/categories');
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch businesses based on query parameters
  const fetchListings = async (pageNum = 1) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const q = searchParams.get('query') || '';
      const c = searchParams.get('city') || '';
      const cat = searchParams.get('category') || '';

      const params = new URLSearchParams();
      if (q) params.append('query', q);
      if (c) params.append('city', c);
      if (cat) params.append('category', cat);
      params.append('page', pageNum.toString());
      params.append('limit', '20');

      const data = await apiClient.get(`/businesses?${params.toString()}`);
      if (pageNum === 1) {
        setBusinesses(data);
      } else {
        setBusinesses(prev => [...prev, ...data]);
      }
      setHasMore(data.length === 20);
    } catch (err) {
      console.error('Failed to fetch businesses', err);
    } finally {
      if (pageNum === 1) setLoading(false);
      else setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchListings(1);
  }, [searchParams]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchListings(nextPage);
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams();
    if (query) newParams.append('query', query);
    if (city) newParams.append('city', city);
    if (category) newParams.append('category', category);
    setSearchParams(newParams);
  };

  // Determine map center coordinates
  const mapCenter = businesses.length > 0 
    ? { lat: businesses[0].latitude, lng: businesses[0].longitude, name: businesses[0].name }
    : { lat: 17.3850, lng: 78.4867, name: 'Hyderabad center' }; // default

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 space-y-6">
      {/* Search Header Form */}
      <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 rounded-2xl glass-panel border border-slate-200 shadow-glass">
        {/* Keyword input */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search keywords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl pl-9 pr-3 py-2.5 text-sm glass-input"
          />
        </div>

        {/* City input */}
        <div className="relative">
          <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="City name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-xl pl-9 pr-3 py-2.5 text-sm glass-input"
          />
        </div>

        {/* Category selector */}
        <div className="relative">
          <Layers className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-xl pl-9 pr-3 py-2.5 text-sm glass-input appearance-none"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Filter button */}
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 transition-colors"
        >
          Apply Filters
        </button>
      </form>

      {/* Main search results content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Results List */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <span className="text-sm text-slate-550 font-medium">
              Showing <span className="text-slate-900 font-bold">{businesses.length}</span> business listings
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
              <span className="text-sm text-slate-500">Searching business directory...</span>
            </div>
          ) : businesses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {businesses.map((item) => (
                  <BusinessCard key={item.id} business={item} />
                ))}
              </div>
              {hasMore && (
                <div className="flex justify-center pt-6">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="inline-flex items-center px-6 py-2.5 rounded-xl text-sm font-bold text-slate-700 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 disabled:opacity-50 transition-colors"
                  >
                    {loadingMore && <Loader2 className="w-4 h-4 mr-2 animate-spin text-slate-400" />}
                    Load More Businesses
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-24 rounded-2xl border border-dashed border-slate-300">
              <p className="text-slate-500 mb-2">No businesses found matching your parameters.</p>
              <p className="text-xs text-slate-450">Try broadening your search keywords or clearing city filter.</p>
            </div>
          )}
        </div>

        {/* Map View Panel */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-600 flex items-center space-x-1.5">
              <MapPin className="w-4 h-4 text-brand-500" />
              <span>Geographic Map View</span>
            </h3>
          </div>
          <div className="h-[450px]">
            {!loading && (
              <MapWidget
                latitude={mapCenter.lat}
                longitude={mapCenter.lng}
                businessName={mapCenter.name}
                height="450px"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
