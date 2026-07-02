import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit, Trash2, IndianRupee, Tag, Sparkles, Loader2, Image, ToggleLeft, ToggleRight, Check } from 'lucide-react';

export const ProductsManager: React.FC = () => {
  const { token } = useAuth();
  
  // State
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [selectedBizId, setSelectedBizId] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [subCategory, setSubCategory] = useState('General');
  const [image, setImage] = useState('');
  const [isOffer, setIsOffer] = useState(false);
  const [offerDiscount, setOfferDiscount] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'all' | 'products' | 'offers'>('all');

  const fetchMyBusinesses = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/businesses/my-listings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBusinesses(data);
        if (data.length > 0) {
          setSelectedBizId(data[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (bizId: string) => {
    if (!bizId) return;
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

  useEffect(() => {
    fetchMyBusinesses();
  }, [token]);

  useEffect(() => {
    if (selectedBizId) {
      fetchProducts(selectedBizId);
    }
  }, [selectedBizId]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setName('');
    setPrice('');
    setDescription('');
    setSubCategory('General');
    setImage('');
    setIsOffer(false);
    setOfferDiscount('');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod: any) => {
    setEditingProduct(prod);
    setName(prod.name);
    setPrice(prod.price.toString());
    
    // Split description to extract subCategory
    const parts = (prod.description || '').split(' ||| ');
    setDescription(parts[0] || '');
    setSubCategory(parts[1] || 'General');

    setImage(prod.image || '');
    setIsOffer(prod.isOffer);
    setOfferDiscount(prod.offerDiscount || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);

    const finalDescription = description.trim() + ' ||| ' + subCategory.trim();

    const payload = {
      businessId: selectedBizId,
      name,
      description: finalDescription,
      price: parseFloat(price),
      image: image || null,
      isOffer,
      offerDiscount: isOffer ? offerDiscount : null
    };

    const isEditing = !!editingProduct;
    const url = isEditing 
      ? `/api/businesses/products/manage/${editingProduct.id}` 
      : '/api/businesses/products/manage';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product');
      }

      setIsModalOpen(false);
      fetchProducts(selectedBizId);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this product/offer listing?')) return;
    try {
      const res = await fetch(`/api/businesses/products/manage/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchProducts(selectedBizId);
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete product');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter(p => {
    if (activeTab === 'products') return !p.isOffer;
    if (activeTab === 'offers') return p.isOffer;
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-brand-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Manage Products & Offers</h1>
          <p className="text-xs text-slate-500 mt-1">Display your services, showcase catalog items, and promote active discount deals.</p>
        </div>

        {businesses.length > 0 && (
          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-600/10 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product / Offer</span>
          </button>
        )}
      </div>

      {businesses.length > 0 ? (
        <div className="space-y-6">
          {/* Select Listing Selector */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-white/70 backdrop-blur shadow-sm max-w-sm flex items-center space-x-3 text-left">
            <Tag className="w-5 h-5 text-brand-500 shrink-0" />
            <div className="min-w-0 flex-1">
              <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">Active Business Profile</label>
              <select
                value={selectedBizId}
                onChange={(e) => setSelectedBizId(e.target.value)}
                className="w-full bg-transparent border-none font-bold text-sm text-slate-800 focus:outline-none focus:ring-0 p-0 cursor-pointer"
              >
                {businesses.map((biz) => (
                  <option key={biz.id} value={biz.id}>{biz.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Tabs Control */}
          <div className="flex border-b border-slate-200 gap-6">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition-colors relative ${
                activeTab === 'all' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              All Listings ({products.length})
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition-colors relative ${
                activeTab === 'products' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Standard Products ({products.filter(p => !p.isOffer).length})
            </button>
            <button
              onClick={() => setActiveTab('offers')}
              className={`pb-2.5 text-xs font-bold uppercase tracking-wider transition-colors relative ${
                activeTab === 'offers' ? 'text-brand-600 border-b-2 border-brand-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              Special Offers ({products.filter(p => p.isOffer).length})
            </button>
          </div>

          {/* Products Grid */}
          {productsLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((prod) => (
                <div key={prod.id} className="rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col relative group">
                  {/* Image banner */}
                  <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden shrink-0 border-b border-slate-100">
                    {prod.image ? (
                      <img 
                        src={prod.image} 
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-350 space-y-1">
                        <Image className="w-6 h-6" />
                        <span className="text-[8px] font-bold uppercase tracking-wider">No Image</span>
                      </div>
                    )}

                    {/* Offer Tag Badge */}
                    {prod.isOffer && (
                      <div className="absolute top-1.5 left-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 border border-amber-400/40 text-white font-extrabold text-[8px] px-2 py-0.5 rounded shadow uppercase tracking-wide flex items-center space-x-0.5 animate-pulse">
                        <Sparkles className="w-2.5 h-2.5 text-white" />
                        <span>{prod.offerDiscount || 'DEAL'}</span>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-3 flex-grow flex flex-col justify-between space-y-2">
                    <div className="space-y-1 text-left">
                      <div className="flex justify-between items-start gap-1">
                        <h3 className="font-bold text-slate-900 text-xs line-clamp-1">{prod.name}</h3>
                        <span className="font-extrabold text-slate-950 text-xs flex items-center shrink-0">
                          <IndianRupee className="w-2.5 h-2.5 mr-0.5" />
                          <span>{prod.price.toLocaleString()}</span>
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 line-clamp-2 leading-relaxed">{prod.description}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-1.5 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleOpenEditModal(prod)}
                        className="p-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 transition-colors"
                        title="Edit Details"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="p-1 rounded-lg border border-red-100 hover:bg-red-50 text-red-500 hover:text-red-755 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-dashed border-slate-350 rounded-2xl text-slate-500 text-sm">
              No product or offer listings match this filter tab. Click "Add Product / Offer" to list one.
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-slate-300 rounded-2xl text-slate-500 text-sm">
          Please register your business profile under the "Business Profile" tab first before listing products or special deals.
        </div>
      )}

      {/* Add / Edit Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>

          <div className="relative w-full max-w-lg bg-white border border-slate-200/80 rounded-2xl p-6 shadow-2xl z-10 overflow-hidden text-slate-900">
            <div className="absolute top-0 right-0 p-4">
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-1">{editingProduct ? 'Edit Catalog Listing' : 'Add Product / Offer'}</h2>
            <p className="text-sm text-slate-500 mb-6">
              Create an entry to showcase in the public catalog and your profile website.
            </p>

            {formError && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-650 text-xs text-left">
                {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="text-left">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-550 mb-1">Catalog Name / Title</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. HD Dome Camera"
                    className="w-full rounded-lg px-3 py-2 text-sm glass-input"
                  />
                </div>
                <div className="text-left">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-550 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 2800"
                    className="w-full rounded-lg px-3 py-2 text-sm glass-input"
                  />
                </div>
              </div>

              <div className="text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-550 mb-1">Catalog Image URL (Optional)</label>
                <input
                  type="url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="e.g. https://images.unsplash.com/..."
                  className="w-full rounded-lg px-3 py-2 text-sm glass-input"
                />
              </div>

              {/* Offer Toggle Selector */}
              <div className="p-3 bg-slate-50/50 border border-slate-200/80 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <span className="font-bold text-slate-850 text-xs block">Is this a Special Discount Offer?</span>
                    <span className="text-3xs text-slate-400">Promotes this listing dynamically on the public Deals & Offers marketplace.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsOffer(!isOffer)}
                    className="text-brand-600 focus:outline-none"
                  >
                    {isOffer ? (
                      <ToggleRight className="w-10 h-6 text-brand-600" />
                    ) : (
                      <ToggleLeft className="w-10 h-6 text-slate-350" />
                    )}
                  </button>
                </div>

                {isOffer && (
                  <div className="text-left animate-in slide-in-from-top-1 duration-150">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-550 mb-1">Offer Tag / Discount Message</label>
                    <input
                      type="text"
                      required
                      value={offerDiscount}
                      onChange={(e) => setOfferDiscount(e.target.value)}
                      placeholder="e.g. 15% OFF, Buy 1 Get 1 Free, Flat ₹2,000 Off"
                      className="w-full rounded-lg px-3 py-2 text-sm glass-input"
                    />
                  </div>
                )}
              </div>

              <div className="text-left space-y-2">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-550 mb-1">Product Subcategory / Variety Tag</label>
                <div className="flex flex-wrap gap-1">
                  {['Rice', 'Curry', 'Non-Veg', 'Beverages', 'Sweets', 'Snacks', 'Electronics', 'Plumbing', 'General'].map(tag => {
                    const isSelected = subCategory.split(',').map(s => s.trim().toLowerCase()).includes(tag.toLowerCase());
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          let tags = subCategory.split(',').map(s => s.trim()).filter(Boolean);
                          if (tag.toLowerCase() === 'general') {
                            tags = ['General'];
                          } else {
                            tags = tags.filter(t => t.toLowerCase() !== 'general');
                            const idx = tags.findIndex(t => t.toLowerCase() === tag.toLowerCase());
                            if (idx > -1) {
                              tags.splice(idx, 1);
                            } else {
                              tags.push(tag);
                            }
                          }
                          if (tags.length === 0) {
                            setSubCategory('General');
                          } else {
                            setSubCategory(tags.join(', '));
                          }
                        }}
                        className={`px-2 py-0.5 rounded text-[9px] font-bold border transition-all ${
                          isSelected
                            ? 'bg-indigo-650 border-indigo-650 text-white shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
                <input
                  type="text"
                  required
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  placeholder="Or type custom subcategory (e.g. Dessert, Starters)..."
                  className="w-full rounded-lg px-3 py-2 text-sm glass-input font-semibold"
                />
              </div>

              <div className="text-left">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-550 mb-1">Description</label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your product details, specification notes, or offer details..."
                  className="w-full rounded-lg px-3 py-2 text-sm glass-input resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-sm font-semibold rounded-lg text-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-sm font-semibold rounded-lg text-white bg-brand-600 hover:bg-brand-500 shadow-md shadow-brand-500/10 transition-all disabled:opacity-55"
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4" />}
                  <span>{editingProduct ? 'Save Changes' : 'Publish Listing'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// Simple Close Icon mapping
const X: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
export default ProductsManager;
