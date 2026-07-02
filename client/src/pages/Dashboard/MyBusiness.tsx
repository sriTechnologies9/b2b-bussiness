import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, BadgeCheck, FileText, Smartphone, Mail, FileUp, Loader2 } from 'lucide-react';

const INDIAN_AREAS = [
  { address: 'Road No 12, Banjara Hills', city: 'Hyderabad', state: 'Telangana' },
  { address: 'Phani Block, Kondapur', city: 'Hyderabad', state: 'Telangana' },
  { address: 'Cyber Towers, Madhapur', city: 'Hyderabad', state: 'Telangana' },
  { address: 'DLF Cyber City, Gachibowli', city: 'Hyderabad', state: 'Telangana' },
  { address: 'Jubilee Hills Check Post', city: 'Hyderabad', state: 'Telangana' },
  { address: 'Begumpet Railway Station Rd', city: 'Hyderabad', state: 'Telangana' },
  { address: 'Koramangala 4th Block', city: 'Bangalore', state: 'Karnataka' },
  { address: 'Indiranagar 100 Feet Rd', city: 'Bangalore', state: 'Karnataka' },
  { address: 'Whitefield Main Rd', city: 'Bangalore', state: 'Karnataka' },
  { address: 'MG Road, Ashok Nagar', city: 'Bangalore', state: 'Karnataka' },
  { address: 'Linking Road, Bandra West', city: 'Mumbai', state: 'Maharashtra' },
  { address: 'Colaba Causeway, Fort', city: 'Mumbai', state: 'Maharashtra' },
  { address: 'Connaught Place, Block H', city: 'New Delhi', state: 'Delhi' },
  { address: 'Sector 62, Noida', city: 'Noida', state: 'Uttar Pradesh' },
  { address: 'T Nagar Main Rd', city: 'Chennai', state: 'Tamil Nadu' },
  { address: 'Salt Lake Sector V', city: 'Kolkata', state: 'West Bengal' }
];

export const parseGallery = (galleryStr: string): string[] => {
  if (!galleryStr) return [];
  if (galleryStr.includes('|')) {
    return galleryStr.split('|').map((s: string) => s.trim()).filter(Boolean);
  }
  if (galleryStr.startsWith('data:image/')) {
    return [galleryStr];
  }
  return galleryStr.split(',').map((s: string) => s.trim()).filter(Boolean);
};

const deduplicateGallery = (galleryStr: string): string => {
  if (!galleryStr) return '';
  const arr = parseGallery(galleryStr);
  return Array.from(new Set(arr)).join('|');
};

export const MyBusiness: React.FC = () => {
  const { token, updateUser } = useAuth();

  const [categories, setCategories] = useState<any[]>([]);
  const [business, setBusiness] = useState<any | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    categoryName: '',
    description: '',
    address: '',
    city: '',
    state: '',
    phone: '',
    email: '',
    whatsapp: '',
    website: '',
    hours: {
      monday: '09:00 - 18:00',
      tuesday: '09:00 - 18:00',
      wednesday: '09:00 - 18:00',
      thursday: '09:00 - 18:00',
      friday: '09:00 - 18:00',
      saturday: '09:00 - 18:00',
      sunday: 'Closed',
      customBadge1: '',
      customBadge2: '',
      googleMapsLink: '',
      googleEmbedUrl: '',
      logoUrl: '',
      facebookUrl: '',
      instagramUrl: '',
      youtubeUrl: '',
      twitterUrl: '',
      storeStatus: true,
      whyStoreOff: ''
    },
    gallery: '',
    latitude: '17.3850',
    longitude: '78.4867'
  });

  // AI Mocks Loading
  const [generatingDesc, setGeneratingDesc] = useState(false);
  const [generatingSeo, setGeneratingSeo] = useState(false);
  const [seoResult, setSeoResult] = useState<{
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  } | null>(null);

  // Verification Mocks States
  const [verifyingOtp, setVerifyingOtp] = useState<Record<string, boolean>>({ phone: false, email: false });
  const [otpSent, setOtpSent] = useState<Record<string, boolean>>({ phone: false, email: false });
  const [otpCodes, setOtpCodes] = useState<Record<string, string>>({ phone: '', email: '' });
  const [otpVerified, setOtpVerified] = useState<Record<string, boolean>>({ phone: false, email: false });
  
  const [gstNum, setGstNum] = useState('');
  const [gstVerified, setGstVerified] = useState(false);
  const [gstVerifying, setGstVerifying] = useState(false);
  const [gstDetails, setGstDetails] = useState<any | null>(null);

  const [documentUploaded, setDocumentUploaded] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  // Fetch Categories & Business Listing
  const loadData = async () => {
    if (!token) return;
    try {
      // Fetch categories
      let catList: any[] = [];
      const resCats = await fetch('/api/businesses/categories');
      if (resCats.ok) {
        const catData = await resCats.json();
        setCategories(catData);
        catList = catData;
      }

      // Fetch my business
      const resBiz = await fetch('/api/businesses/my-listings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resBiz.ok) {
        const bizList = await resBiz.json();
        if (bizList.length > 0) {
          const myBiz = bizList[0];
          setBusiness(myBiz);
          
          const matchedCat = catList.find((c: any) => c.id === myBiz.categoryId);
          
          setFormData({
            name: myBiz.name,
            categoryId: myBiz.categoryId,
            categoryName: myBiz.category?.name || matchedCat?.name || '',
            description: myBiz.description,
            address: myBiz.address,
            city: myBiz.city,
            state: myBiz.state,
            phone: myBiz.phone,
            email: myBiz.email,
            whatsapp: myBiz.whatsapp || '',
            website: myBiz.website || '',
            hours: myBiz.hours ? { ...formData.hours, ...JSON.parse(myBiz.hours) } : formData.hours,
            gallery: deduplicateGallery(myBiz.gallery),
            latitude: myBiz.latitude !== undefined && myBiz.latitude !== null ? myBiz.latitude.toString() : '17.3850',
            longitude: myBiz.longitude !== undefined && myBiz.longitude !== null ? myBiz.longitude.toString() : '78.4867'
          });

          // Prefill verification states if business is already verified
          if (myBiz.status === 'VERIFIED') {
            setOtpVerified({ phone: true, email: true });
            setGstVerified(true);
            setDocumentUploaded(true);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load profile details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, address: value }));

    if (value.trim().length > 1) {
      const filtered = INDIAN_AREAS.filter(item => 
        item.address.toLowerCase().includes(value.toLowerCase()) ||
        item.city.toLowerCase().includes(value.toLowerCase())
      );
      setAddressSuggestions(filtered);
    } else {
      setAddressSuggestions([]);
    }
  };

  const selectAddressSuggestion = (suggestion: any) => {
    setFormData(prev => ({
      ...prev,
      address: suggestion.address,
      city: suggestion.city,
      state: suggestion.state
    }));
    setAddressSuggestions([]);
  };

  const handleHoursChange = (day: string, value: any) => {
    setFormData({
      ...formData,
      hours: {
        ...formData.hours,
        [day]: value
      }
    });
  };

  const handleMapsLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    
    // Parse coordinates out of the Google Maps link
    let parsedLat = '';
    let parsedLng = '';

    // Match pattern: @lat,lng (e.g. @17.4482,78.3741)
    const atMatch = link.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) {
      parsedLat = atMatch[1];
      parsedLng = atMatch[2];
    } else {
      // Match pattern: query=lat,lng (e.g. query=17.4482,78.3741)
      const queryMatch = link.match(/query=(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (queryMatch) {
        parsedLat = queryMatch[1];
        parsedLng = queryMatch[2];
      }
    }

    setFormData(prev => ({
      ...prev,
      latitude: parsedLat ? parsedLat : prev.latitude,
      longitude: parsedLng ? parsedLng : prev.longitude,
      hours: {
        ...prev.hours,
        googleMapsLink: link
      }
    }));
  };

  const handleEmbedCodeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const code = e.target.value;
    let finalUrl = code.trim();
    
    if (finalUrl.includes('<iframe')) {
      const srcMatch = finalUrl.match(/src=["']([^"']+)["']/);
      if (srcMatch) {
        finalUrl = srcMatch[1];
      }
    }

    setFormData(prev => ({
      ...prev,
      hours: {
        ...prev.hours,
        googleEmbedUrl: finalUrl
      }
    }));
  };

  // Submit Profile Form (Save)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');
    setSubmitting(true);

    const isEditing = !!business;
    const url = isEditing ? `/api/businesses/${business.id}` : '/api/businesses';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          hours: JSON.stringify(formData.hours),
          latitude: formData.latitude ? parseFloat(formData.latitude) : 17.3850,
          longitude: formData.longitude ? parseFloat(formData.longitude) : 78.4867
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save profile');
      }

      setSuccessMsg(isEditing ? 'Profile updated successfully!' : 'Profile created successfully!');
      
      // Update local storage/context user listings if new creation
      if (!isEditing) {
        // reload me profile
        const meRes = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (meRes.ok) {
          const meData = await meRes.json();
          updateUser(meData.user);
        }
      }

      loadData();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // State for typed image URL input
  const [typedImageUrl, setTypedImageUrl] = useState('');

  // Helper to auto-save gallery to the database immediately
  const saveGallery = async (newGallery: string) => {
    if (!business) return;
    try {
      const res = await fetch(`/api/businesses/${business.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          gallery: newGallery
        })
      });
      if (!res.ok) {
        throw new Error('Failed to auto-save gallery changes');
      }
    } catch (err) {
      console.error('Failed to auto-save gallery:', err);
    }
  };

  // Handle Business Cover Banner Upload with Auto-Compression to ~50KB
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const galleryArray = parseGallery(formData.gallery);
    if (galleryArray.length >= 5) {
      alert('You can upload up to 5 banner images only.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        
        // Define max width and height for balanced compression ratio
        const max_width = 800;
        const max_height = 450; // 16:9 ratio
        
        let width = img.width;
        let height = img.height;

        // Calculate size maintaining aspect ratio
        if (width > height) {
          if (width > max_width) {
            height = Math.round((height * max_width) / width);
            width = max_width;
          }
        } else {
          if (height > max_height) {
            width = Math.round((width * max_height) / height);
            height = max_height;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          
          // Export as compressed JPEG (0.6 quality gives small file size around ~30-50KB)
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          
          if (galleryArray.includes(dataUrl)) {
            alert('This image has already been uploaded.');
            return;
          }
          
          galleryArray.push(dataUrl);

          const updatedGallery = Array.from(new Set(galleryArray)).join('|');
          setFormData(prev => ({
            ...prev,
            gallery: updatedGallery
          }));
          saveGallery(updatedGallery);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Add Banner Image via URL
  const addBannerImageUrl = () => {
    const urlToAdd = typedImageUrl.trim();
    if (!urlToAdd) return;
    const galleryArray = parseGallery(formData.gallery);
    if (galleryArray.length >= 5) {
      alert('You can upload up to 5 banner images only.');
      return;
    }
    if (galleryArray.includes(urlToAdd)) {
      alert('This banner URL is already added.');
      return;
    }
    galleryArray.push(urlToAdd);
    const updatedGallery = Array.from(new Set(galleryArray)).join('|');
    setFormData(prev => ({
      ...prev,
      gallery: updatedGallery
    }));
    saveGallery(updatedGallery);
    setTypedImageUrl('');
  };

  // Remove Banner Image at a specific index
  const removeBannerImage = (index: number) => {
    const galleryArray = parseGallery(formData.gallery);
    galleryArray.splice(index, 1);
    const updatedGallery = Array.from(new Set(galleryArray)).join('|');
    setFormData(prev => ({
      ...prev,
      gallery: updatedGallery
    }));
    saveGallery(updatedGallery);
  };

  // AI Description Generator Trigger
  const triggerAIDescription = async () => {
    if (!formData.name || !formData.categoryId || !formData.city) {
      alert('Please fill Name, Category, and City before generating.');
      return;
    }
    setGeneratingDesc(true);
    try {
      const selectedCat = categories.find(c => c.id === formData.categoryId);
      const categoryName = selectedCat ? selectedCat.name : 'Service';

      const res = await fetch('/api/businesses/generate-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          category: categoryName,
          location: formData.city
        })
      });
      const data = await res.json();
      if (res.ok) {
        setFormData(prev => ({
          ...prev,
          description: data.description
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingDesc(false);
    }
  };

  // AI SEO Generator Trigger
  const triggerAISeo = async () => {
    if (!formData.name || !formData.categoryId || !formData.city) {
      alert('Please fill Name, Category, and City before generating.');
      return;
    }
    setGeneratingSeo(true);
    try {
      const selectedCat = categories.find(c => c.id === formData.categoryId);
      const categoryName = selectedCat ? selectedCat.name : 'Service';

      const res = await fetch('/api/businesses/generate-seo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          category: categoryName,
          location: formData.city
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSeoResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingSeo(false);
    }
  };

  // Verification: Send OTP Mock
  const sendOtp = (type: 'phone' | 'email') => {
    setOtpSent(prev => ({ ...prev, [type]: true }));
    alert(`Mock OTP "123456" sent to your registered ${type}!`);
  };

  // Verification: Verify OTP Mock
  const verifyOtpCode = async (type: 'phone' | 'email') => {
    const code = otpCodes[type];
    setVerifyingOtp(prev => ({ ...prev, [type]: true }));
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type,
          code,
          value: type === 'phone' ? formData.phone : formData.email
        })
      });
      const data = await res.json();
      if (res.ok) {
        setOtpVerified(prev => ({ ...prev, [type]: true }));
      } else {
        alert(data.error || 'Verification failed');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setVerifyingOtp(prev => ({ ...prev, [type]: false }));
    }
  };

  // Verification: GST Verification Mock
  const handleGstCheck = async () => {
    if (gstNum.length !== 15) {
      alert('GST number must be exactly 15 characters.');
      return;
    }
    setGstVerifying(true);
    try {
      const res = await fetch('/api/auth/verify-gst', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ gstNumber: gstNum })
      });
      const data = await res.json();
      if (res.ok) {
        setGstVerified(true);
        setGstDetails(data);
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGstVerifying(false);
    }
  };

  // Verification: Document upload simulation
  const handleDocumentUpload = () => {
    setUploadingDoc(true);
    setTimeout(() => {
      setUploadingDoc(false);
      setDocumentUploaded(true);
    }, 1500);
  };

  // Finalize Business Verification (Calls API to change status to VERIFIED)
  const finalizeVerification = async () => {
    if (!business) return;
    if (!otpVerified.phone || !otpVerified.email || !gstVerified || !documentUploaded) {
      alert('Please complete all checklist items before verifying.');
      return;
    }

    try {
      const res = await fetch(`/api/businesses/${business.id}/verify`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        alert('Congratulations! Your business is now verified on LocalConnect!');
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <span className="text-slate-400 text-sm">Loading business profile...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Manage Business Profile</h1>
        <p className="text-xs text-slate-500 mt-1">Add, update, generate description text, and verify listing details.</p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-650 text-sm font-semibold">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-650 text-sm font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Editor & AI Utilities Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Profile Edit Form */}
        <div className="lg:col-span-8 rounded-2xl glass-panel border border-slate-200 p-6 space-y-6">
          <h2 className="font-bold text-slate-900 text-lg">Profile Information</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Business Profile Photo / Logo Upload Panel */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50/50 border border-slate-200 rounded-xl text-left">
              <div className="w-16 h-16 rounded-full border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden bg-slate-100 shadow-sm relative group/logo">
                {formData.hours.logoUrl ? (
                  <img src={formData.hours.logoUrl} alt="Branding Logo" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-900 text-white flex items-center justify-center font-black text-xs uppercase">
                    Logo
                  </div>
                )}
              </div>
              <div className="flex-grow space-y-1 w-full text-left">
                <label className="block text-xs font-black uppercase tracking-wider text-slate-655">Business Profile Photo / Logo Image URL</label>
                <input
                  type="url"
                  placeholder="Paste profile photo URL (e.g. https://images.unsplash.com/... or company logo link)"
                  value={formData.hours.logoUrl || ''}
                  onChange={(e) => handleHoursChange('logoUrl', e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-xs glass-input font-bold"
                />
                <span className="block text-[10px] text-slate-400 font-semibold leading-normal">
                  Provide a clean square image URL to display as your business logo on directories and search results.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-550 mb-1">Business Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. SafeHome CCTV Solutions"
                  className="w-full rounded-lg px-3 py-2 text-sm glass-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-550 mb-1">Business Category</label>
                <select
                  name="categoryId"
                  required
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  className="w-full rounded-lg px-3 py-2 text-sm glass-input"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description Editor + AI Trigger */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-555">Business Description</label>
                <button
                  type="button"
                  onClick={triggerAIDescription}
                  disabled={generatingDesc}
                  className="inline-flex items-center space-x-1 text-2xs font-bold text-violet-600 hover:text-violet-750 disabled:opacity-55"
                >
                  {generatingDesc ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Generate via AI</span>
                </button>
              </div>
              <textarea
                name="description"
                required
                rows={5}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Give a detailed overview of your local business services..."
                className="w-full rounded-lg px-3 py-2 text-sm glass-input resize-none"
              />
            </div>

            {/* Contacts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-555 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="e.g. 9876543210"
                  className="w-full rounded-lg px-3 py-2 text-sm glass-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-555 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="e.g. info@safehome.com"
                  className="w-full rounded-lg px-3 py-2 text-sm glass-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-555 mb-1">WhatsApp Mobile</label>
                <input
                  type="tel"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  placeholder="e.g. 9876543210"
                  className="w-full rounded-lg px-3 py-2 text-sm glass-input"
                />
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 relative">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-555 mb-1">Full Street Address</label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleAddressChange}
                  placeholder="e.g. Road No. 12, Banjara Hills"
                  className="w-full rounded-lg px-3 py-2 text-sm glass-input"
                  autoComplete="off"
                />
                {addressSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto divide-y divide-slate-100">
                    {addressSuggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => selectAddressSuggestion(sug)}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 text-xs text-slate-700 transition-colors flex flex-col"
                      >
                        <span className="font-bold text-slate-800">{sug.address}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">{sug.city}, {sug.state}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-555 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g. Hyderabad"
                  className="w-full rounded-lg px-3 py-2 text-sm glass-input"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-555 mb-1">State</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="e.g. Telangana"
                  className="w-full rounded-lg px-3 py-2 text-sm glass-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-555 mb-1">Website URL (Optional)</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="e.g. https://www.mybusiness.com"
                  className="w-full rounded-lg px-3 py-2 text-sm glass-input"
                />
              </div>
            </div>

            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Store Location Coordinates & Maps</h3>
                <p className="text-2xs text-slate-450 font-semibold mt-0.5">Let customers find your shop route easily. Paste your Google Maps links below, and our system will extract your coordinates automatically!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-555 mb-1">Google Maps Share / Directions Link</label>
                  <input
                    type="url"
                    name="googleMapsLink"
                    value={(formData.hours as any).googleMapsLink || ''}
                    onChange={handleMapsLinkChange}
                    placeholder="e.g. https://maps.app.goo.gl/... or directions URL"
                    className="w-full rounded-lg px-3 py-2 text-sm glass-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-555 mb-1">Google Maps HTML Embed Iframe Code</label>
                  <input
                    type="text"
                    name="googleEmbedUrl"
                    value={(formData.hours as any).googleEmbedUrl || ''}
                    onChange={handleEmbedCodeChange}
                    placeholder='e.g. <iframe src="https://www.google.com/maps/embed?..."></iframe>'
                    className="w-full rounded-lg px-3 py-2 text-sm glass-input"
                  />
                </div>
              </div>

            </div>

            {/* Working Hours */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-555 mb-2">Weekly Working Hours</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                {Object.keys(formData.hours)
                  .filter((key) => ![
                    'customBadge1', 'customBadge2', 'googleMapsLink', 
                    'googleEmbedUrl', 'logoUrl', 'facebookUrl', 
                    'instagramUrl', 'youtubeUrl', 'twitterUrl',
                    'storeStatus', 'whyStoreOff'
                  ].includes(key))
                  .map((day) => (
                    <div key={day} className="space-y-1">
                      <label className="block text-[10px] uppercase font-bold text-slate-500 capitalize">{day}</label>
                      <input
                        type="text"
                        value={(formData.hours as any)[day]}
                        onChange={(e) => handleHoursChange(day, e.target.value)}
                        className="w-full rounded-lg px-2.5 py-1.5 text-xs glass-input"
                      />
                    </div>
                  ))}
              </div>
            </div>

            {/* Custom Highlights & Badges */}
            <div className="border-t border-slate-100 pt-6 space-y-4 text-left">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Custom Highlights & Badges</h3>
                <p className="text-2xs text-slate-450 font-semibold mt-0.5">Customize the highlight badges shown at the top of your public profile (e.g. "Pure Veg", "Price for two ₹300", "1-Year Warranty"). Leave empty to use category defaults.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-555 mb-1">Primary Attribute Badge</label>
                  <input
                    type="text"
                    value={(formData.hours as any).customBadge1 || ''}
                    onChange={(e) => handleHoursChange('customBadge1', e.target.value)}
                    placeholder="e.g. Pure Veg & Non-Veg, HD Cameras Setup"
                    className="w-full rounded-lg px-3 py-2 text-sm glass-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-555 mb-1">Secondary Info Badge</label>
                  <input
                    type="text"
                    value={(formData.hours as any).customBadge2 || ''}
                    onChange={(e) => handleHoursChange('customBadge2', e.target.value)}
                    placeholder="e.g. Price for two ₹400, 1-Year Warranty"
                    className="w-full rounded-lg px-3 py-2 text-sm glass-input"
                  />
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="border-t border-slate-100 pt-6 space-y-4 text-left">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Social Media & External Links</h3>
                <p className="text-2xs text-slate-450 font-semibold mt-0.5">Add your business profiles on popular social networks to display clickable brand badges on your storefront!</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-555 mb-1">Facebook URL</label>
                  <input
                    type="url"
                    value={(formData.hours as any).facebookUrl || ''}
                    onChange={(e) => handleHoursChange('facebookUrl', e.target.value)}
                    placeholder="e.g. https://facebook.com/mybusiness"
                    className="w-full rounded-lg px-3 py-2 text-sm glass-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-555 mb-1">Instagram URL</label>
                  <input
                    type="url"
                    value={(formData.hours as any).instagramUrl || ''}
                    onChange={(e) => handleHoursChange('instagramUrl', e.target.value)}
                    placeholder="e.g. https://instagram.com/mybusiness"
                    className="w-full rounded-lg px-3 py-2 text-sm glass-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-555 mb-1">YouTube Channel URL</label>
                  <input
                    type="url"
                    value={(formData.hours as any).youtubeUrl || ''}
                    onChange={(e) => handleHoursChange('youtubeUrl', e.target.value)}
                    placeholder="e.g. https://youtube.com/@mybusiness"
                    className="w-full rounded-lg px-3 py-2 text-sm glass-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-555 mb-1">Twitter / X URL</label>
                  <input
                    type="url"
                    value={(formData.hours as any).twitterUrl || ''}
                    onChange={(e) => handleHoursChange('twitterUrl', e.target.value)}
                    placeholder="e.g. https://x.com/mybusiness"
                    className="w-full rounded-lg px-3 py-2 text-sm glass-input"
                  />
                </div>
              </div>
            </div>

            {/* Store Availability Status */}
            <div className="border-t border-slate-100 pt-6 space-y-4 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span>Store Availability Status</span>
                    <span className="text-[9px] font-black bg-emerald-50 text-emerald-650 px-2 py-0.5 rounded border border-emerald-250/50 uppercase tracking-wider">
                      All Plans Active
                    </span>
                  </h3>
                  <p className="text-2xs text-slate-450 font-semibold mt-0.5">Temporarily toggle your storefront availability on/off for directory search results.</p>
                </div>
                
                {/* Styled Active Switch Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    const currentVal = (formData.hours as any).storeStatus !== false;
                    handleHoursChange('storeStatus', !currentVal);
                  }}
                  className="flex items-center space-x-2.5 focus:outline-none group/toggle"
                >
                  <span className={`text-[10px] font-bold transition-colors ${!(formData.hours as any).storeStatus ? 'text-slate-900 font-extrabold' : 'text-slate-400'}`}>OFF</span>
                  <div className={`w-11 h-6 rounded-full p-1 transition-all duration-300 flex items-center ${
                    ((formData.hours as any).storeStatus !== false) ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
                  }`}>
                    <div className="w-4 h-4 bg-white rounded-full shadow-md transform group-hover/toggle:scale-105 transition-transform"></div>
                  </div>
                  <span className={`text-[10px] font-bold transition-colors ${((formData.hours as any).storeStatus !== false) ? 'text-emerald-600 font-extrabold' : 'text-slate-400'}`}>ON</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-555 mb-1">Reason for closing / Store OFF description</label>
                <input
                  type="text"
                  value={(formData.hours as any).whyStoreOff || ''}
                  onChange={(e) => handleHoursChange('whyStoreOff', e.target.value)}
                  placeholder="e.g. Closed for weekly maintenance, back on Monday!"
                  className="w-full rounded-lg px-3 py-2 text-sm glass-input font-medium"
                />
                <span className="block text-[10px] text-slate-400 font-semibold leading-normal mt-1 text-left">
                  This custom message will be displayed on your storefront page header to inform visitors when your store is set to offline.
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center space-x-1 px-5 py-2.5 text-sm font-semibold rounded-lg text-white bg-brand-600 hover:bg-brand-500 disabled:opacity-55 transition-all shadow-md shadow-brand-600/10"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null}
              <span>Save Business Details</span>
            </button>
          </form>
        </div>

        {/* AI SEO & Business Verification sidebar */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Business Cover Banners (Gallery) Widget */}
          <div className="rounded-2xl glass-panel border border-slate-200 p-6 space-y-4 bg-white text-left shadow-glass-sm animate-in fade-in-50 duration-200">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center space-x-2">
              <FileUp className="w-4.5 h-4.5 text-brand-600" />
              <span>Business Banners (Up to 5)</span>
            </h3>

            {/* Banners Grid */}
            {formData.gallery ? (
              <div className="grid grid-cols-2 gap-2">
                {parseGallery(formData.gallery).map((imgUrl, index) => (
                  <div 
                    key={index} 
                    className={`relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group transition-all ${
                      index === 0 ? 'col-span-2 aspect-[21/9]' : 'aspect-square'
                    }`}
                  >
                    <img
                       src={imgUrl}
                       alt={`Banner ${index + 1}`}
                       className="w-full h-full object-cover"
                       onError={(e) => {
                         (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500';
                       }}
                    />
                    
                    {/* Primary label */}
                    {index === 0 && (
                      <span className="absolute top-2 left-2 text-[8px] font-black text-white uppercase tracking-widest bg-brand-600 px-1.5 py-0.5 rounded shadow-sm">
                        Primary Cover
                      </span>
                    )}

                    {/* Hover delete overlay */}
                    <div className="absolute inset-0 bg-slate-950/65 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeBannerImage(index)}
                        className="p-1.5 rounded-lg bg-red-650 hover:bg-red-750 text-white font-bold text-2xs uppercase tracking-wider flex items-center space-x-1 shadow"
                        title="Remove Image"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 border border-dashed border-slate-200 rounded-xl text-center text-slate-400 text-xs italic font-semibold">
                No cover banners uploaded yet.
              </div>
            )}

            {/* Upload Inputs (only visible if gallery has less than 5 images) */}
            {(!formData.gallery || parseGallery(formData.gallery).length < 5) ? (
              <div className="space-y-3 pt-2 border-t border-slate-100">
                
                {/* File Upload */}
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-wider text-slate-450 mb-1.5">
                    Upload Banners ({formData.gallery ? parseGallery(formData.gallery).length : 0}/5)
                  </label>
                  <div className="relative flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-14 border border-slate-300 border-dashed rounded-xl cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center space-x-2 pt-1 pb-1 px-2 text-slate-500">
                        <FileUp className="w-4.5 h-4.5 text-slate-450" />
                        <span className="text-[10px] font-extrabold uppercase tracking-wide">Upload Image File</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleBannerUpload}
                      />
                    </label>
                  </div>
                </div>

                {/* OR divider */}
                <div className="relative flex py-0.5 items-center">
                  <div className="flex-grow border-t border-slate-150"></div>
                  <span className="flex-shrink mx-2 text-[8px] text-slate-400 font-extrabold uppercase tracking-widest">OR</span>
                  <div className="flex-grow border-t border-slate-150"></div>
                </div>

                {/* URL Upload */}
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-wider text-slate-450 mb-1">Add Banner Image via URL</label>
                  <div className="flex space-x-1.5">
                    <input
                      type="text"
                      placeholder="Paste image url..."
                      value={typedImageUrl}
                      onChange={(e) => setTypedImageUrl(e.target.value)}
                      className="flex-grow rounded-lg px-2 py-1 text-2xs glass-input font-bold"
                    />
                    <button
                      type="button"
                      onClick={addBannerImageUrl}
                      disabled={!typedImageUrl.trim()}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-2xs font-extrabold uppercase tracking-wider disabled:opacity-40"
                    >
                      Add
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-3 bg-amber-50 border border-amber-150 rounded-xl text-center text-[10px] font-extrabold text-amber-705 uppercase tracking-wide">
                Maximum 5 banner images uploaded.
              </div>
            )}
          </div>

          {/* AI SEO Generator widget */}
          <div className="rounded-2xl glass-panel border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-violet-500" />
                <span>AI SEO Generator</span>
              </h3>
              <button
                type="button"
                onClick={triggerAISeo}
                disabled={generatingSeo}
                className="text-2xs font-bold text-violet-600 hover:text-violet-700 hover:underline disabled:opacity-55"
              >
                {generatingSeo ? 'Generating...' : 'Generate Tags'}
              </button>
            </div>
            
            <p className="text-[10px] text-slate-500 leading-normal">
              Creates highly optimized page meta titles and description keywords targeted at search rankings.
            </p>

            {seoResult && (
              <div className="space-y-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <span className="font-bold text-slate-600 block mb-0.5">Meta Title:</span>
                  <p className="text-slate-800">{seoResult.metaTitle}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-600 block mb-0.5">Meta Description:</span>
                  <p className="text-slate-850 leading-relaxed">{seoResult.metaDescription}</p>
                </div>
                <div>
                  <span className="font-bold text-slate-600 block mb-0.5">Keywords:</span>
                  <p className="text-slate-800">{seoResult.keywords}</p>
                </div>
              </div>
            )}
          </div>

          {/* Verification Portal */}
          <div className="rounded-2xl glass-panel border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-slate-850 text-sm uppercase tracking-wider flex items-center space-x-2">
              <BadgeCheck className="w-4 h-4 text-brand-500" />
              <span>Listing Verification</span>
            </h3>

            {business?.status === 'VERIFIED' ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <BadgeCheck className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900 text-sm">Verified Profile Active</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Your business has completed mobile, email, GSTIN, and doc verification. A verified badge is active on your profile.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* 1. Mobile OTP Check */}
                <div className="p-3 border border-slate-200 bg-slate-50/30 rounded-xl space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-750 flex items-center space-x-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                      <span>Phone OTP Check</span>
                    </span>
                    {otpVerified.phone ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Verified</span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-655 bg-amber-50 px-1.5 py-0.5 rounded">Required</span>
                    )}
                  </div>
                  {!otpVerified.phone && (
                    <div className="space-y-2">
                      {!otpSent.phone ? (
                        <button
                          onClick={() => sendOtp('phone')}
                          className="w-full text-center py-1.5 bg-slate-100 hover:bg-slate-200 text-2xs font-bold rounded-lg text-slate-700"
                        >
                          Send Mobile OTP Code
                        </button>
                      ) : (
                        <div className="flex space-x-1">
                          <input
                            type="text"
                            placeholder="Enter 123456"
                            value={otpCodes.phone}
                            onChange={(e) => setOtpCodes(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-2/3 rounded-lg px-2 py-1 text-2xs glass-input"
                          />
                          <button
                            onClick={() => verifyOtpCode('phone')}
                            disabled={verifyingOtp.phone}
                            className="w-1/3 bg-brand-600 hover:bg-brand-500 rounded-lg text-2xs font-semibold text-white"
                          >
                            Verify
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. Email OTP Check */}
                <div className="p-3 border border-slate-200 bg-slate-50/30 rounded-xl space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-750 flex items-center space-x-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>Email OTP Check</span>
                    </span>
                    {otpVerified.email ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Verified</span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-655 bg-amber-50 px-1.5 py-0.5 rounded">Required</span>
                    )}
                  </div>
                  {!otpVerified.email && (
                    <div className="space-y-2">
                      {!otpSent.email ? (
                        <button
                          onClick={() => sendOtp('email')}
                          className="w-full text-center py-1.5 bg-slate-100 hover:bg-slate-200 text-2xs font-bold rounded-lg text-slate-700"
                        >
                          Send Email OTP Code
                        </button>
                      ) : (
                        <div className="flex space-x-1">
                          <input
                            type="text"
                            placeholder="Enter 123456"
                            value={otpCodes.email}
                            onChange={(e) => setOtpCodes(prev => ({ ...prev, email: e.target.value }))}
                            className="w-2/3 rounded-lg px-2 py-1 text-2xs glass-input"
                          />
                          <button
                            onClick={() => verifyOtpCode('email')}
                            disabled={verifyingOtp.email}
                            className="w-1/3 bg-brand-600 hover:bg-brand-500 rounded-lg text-2xs font-semibold text-white"
                          >
                            Verify
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 3. GST Verification */}
                <div className="p-3 border border-slate-200 bg-slate-50/30 rounded-xl space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-750 flex items-center space-x-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      <span>GSTIN Verification</span>
                    </span>
                    {gstVerified ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Verified</span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-655 bg-amber-50 px-1.5 py-0.5 rounded">Required</span>
                    )}
                  </div>
                  {!gstVerified ? (
                    <div className="flex space-x-1">
                      <input
                        type="text"
                        placeholder="GST (15 characters)"
                        value={gstNum}
                        onChange={(e) => setGstNum(e.target.value)}
                        className="w-2/3 rounded-lg px-2 py-1.5 text-2xs glass-input"
                      />
                      <button
                        onClick={handleGstCheck}
                        disabled={gstVerifying}
                        className="w-1/3 bg-brand-600 hover:bg-brand-500 rounded-lg text-2xs font-semibold text-white"
                      >
                        {gstVerifying ? 'Checking' : 'Verify'}
                      </button>
                    </div>
                  ) : gstDetails && (
                    <div className="p-2 bg-slate-50 rounded-lg text-[9px] text-slate-600 space-y-0.5 border border-slate-200">
                      <span className="font-bold block text-slate-800">{gstDetails.businessName}</span>
                      <span>Addr: {gstDetails.address}</span>
                      <span className="text-emerald-650 block font-semibold mt-0.5">Status: {gstDetails.status}</span>
                    </div>
                  )}
                </div>

                {/* 4. Aadhaar/PAN Document Upload */}
                <div className="p-3 border border-slate-200 bg-slate-50/30 rounded-xl space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-750 flex items-center space-x-1.5">
                      <FileUp className="w-3.5 h-3.5 text-slate-400" />
                      <span>PAN/Aadhaar Proof</span>
                    </span>
                    {documentUploaded ? (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">Uploaded</span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-655 bg-amber-50 px-1.5 py-0.5 rounded">Required</span>
                    )}
                  </div>
                  {!documentUploaded && (
                    <button
                      onClick={handleDocumentUpload}
                      disabled={uploadingDoc}
                      className="w-full text-center py-1.5 bg-slate-100 hover:bg-slate-200 text-2xs font-bold rounded-lg text-slate-700"
                    >
                      {uploadingDoc ? 'Uploading Proof...' : 'Upload PAN/Aadhaar Card PDF'}
                    </button>
                  )}
                </div>

                {/* Complete verification trigger */}
                {business && (
                  <button
                    onClick={finalizeVerification}
                    className="w-full inline-flex items-center justify-center py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500"
                  >
                    Activate Verified Profile Badge
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
export default MyBusiness;
