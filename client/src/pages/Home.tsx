import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, MapPin, Sparkles, Utensils, Zap, Droplet, Activity, Dumbbell, Scissors, Camera, 
  Home as HomeIcon, ShoppingBag, ShieldCheck, ArrowRight, ChevronLeft, ChevronRight, 
  ClipboardList, Layers, UserCheck, ChevronDown, ChevronUp, Quote, Users, Star, Loader2, Store, HelpCircle
} from 'lucide-react';
import { BusinessCard } from '../components/BusinessCard';
import { LeadModal } from '../components/LeadModal';

const CATEGORIES = [
  { name: 'Restaurants', slug: 'restaurants', icon: Utensils, color: 'text-rose-450 bg-rose-500/10 border-rose-500/20' },
  { name: 'Electricians', slug: 'electricians', icon: Zap, color: 'text-amber-450 bg-amber-500/10 border-amber-500/20' },
  { name: 'Plumbers', slug: 'plumbers', icon: Droplet, color: 'text-blue-450 bg-blue-500/10 border-blue-500/20' },
  { name: 'Clinics', slug: 'clinics', icon: Activity, color: 'text-emerald-450 bg-emerald-500/10 border-emerald-500/20' },
  { name: 'Gyms', slug: 'gyms', icon: Dumbbell, color: 'text-indigo-450 bg-indigo-500/10 border-indigo-500/20' },
  { name: 'Salons', slug: 'salons', icon: Scissors, color: 'text-pink-450 bg-pink-500/10 border-pink-500/20' },
  { name: 'CCTV Shops', slug: 'cctv-shops', icon: Camera, color: 'text-cyan-455 bg-cyan-500/10 border-cyan-500/20' },
  { name: 'Real Estate', slug: 'real-estate', icon: HomeIcon, color: 'text-violet-450 bg-violet-500/10 border-violet-500/20' },
  { name: 'Retail Stores', slug: 'retail-stores', icon: ShoppingBag, color: 'text-teal-450 bg-teal-500/10 border-teal-500/20' }
];

const CATEGORY_ICONS: { [key: string]: any } = {
  restaurants: Utensils,
  electricians: Zap,
  plumbers: Droplet,
  clinics: Activity,
  gyms: Dumbbell,
  salons: Scissors,
  'cctv-shops': Camera,
  'real-estate': HomeIcon,
  'retail-stores': ShoppingBag
};

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

const TOP_CITIES = [
  { name: 'Hyderabad', image: 'https://images.unsplash.com/photo-1605007493699-af65834f8a00?w=400&q=80', description: 'Charminar & IT Hub' },
  { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&q=80', description: 'Financial Capital' },
  { name: 'Bangalore', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&q=80', description: 'Silicon Valley of India' },
  { name: 'Pune', image: 'https://images.unsplash.com/photo-1601999109332-542b18dbec57?w=400&q=80', description: 'Oxford of the East' },
  { name: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80', description: 'National Capital' }
];


const POPULAR_SEARCHES = [
  { title: 'Commercial AC Installation', categorySlug: 'electricians', image: 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?w=400&q=80', tagline: 'Top-rated AC mechanics' },
  { title: 'Residential CCTV Cameras', categorySlug: 'cctv-shops', image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&q=80', tagline: 'Premium CCTV surveillance' },
  { title: 'Local Plumber Contractors', categorySlug: 'plumbers', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80', tagline: '24/7 plumbing assistance' },
  { title: 'Cardiology & General Checkup', categorySlug: 'clinics', image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=80', tagline: 'Verified local clinics' },
  { title: 'Professional Bridal Makeup', categorySlug: 'salons', image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80', tagline: 'Stylists and beauty parlours' },
  { title: 'Corporate Catering Services', categorySlug: 'restaurants', image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=400&q=80', tagline: 'Top buffet dining hosts' }
];

const MOCK_TESTIMONIALS = [
  {
    name: 'Rajesh Kumar',
    role: 'Owner, RK Electricals',
    quote: 'LocalConnect AI leads changed my business. The CRM automatically filters HOT leads. I secured 3 contracts in my first week!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80',
    rating: 5,
    city: 'Hyderabad'
  },
  {
    name: 'Anjali Sharma',
    role: 'Manager, Spice Garden Cafe',
    quote: 'The direct WhatsApp chat button allows customers to book reservations instantly. Our profile visits grew by 150% in two months.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80',
    rating: 5,
    city: 'Mumbai'
  },
  {
    name: 'Suresh Patel',
    role: 'Client, Procurement manager',
    quote: 'Posting an RFQ for commercial plumbers saved me hours. I got 5 bids with pricing in a few hours and hired a verified professional.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80',
    rating: 5,
    city: 'Bangalore'
  },
  {
    name: 'Pooja Reddy',
    role: 'Owner, Glow & Style Salon',
    quote: 'The AI Description Generator saved me so much time writing website copy. The GST verification tag gives clients immediate trust!',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&q=80',
    rating: 5,
    city: 'Chennai'
  }
];

const MOCK_FAQS = [
  {
    q: 'How does the Procurement RFQ system work?',
    a: 'Customers submit a Request for Quote (RFQ) specifying their requirements, city, and optional budget. Local businesses registered in that category receive notifications and can submit competitive pricing bids directly.'
  },
  {
    q: 'What is AI Lead Scoring and CRM pipeline?',
    a: 'When buyers inquire, our AI models analyze the text intent, budget, and contact credentials. Leads are categorized into HOT (ready to buy), WARM, or COLD priority bands, helping dealers focus on high-conversion leads first.'
  },
  {
    q: 'How do dealers verify their businesses?',
    a: 'Dealers can submit their GSTIN or Aadhaar numbers inside their MyBusiness profile. The system runs validation checks to mark profiles with a green "VERIFIED" trust seal, which boosts listing visibility and customer trust.'
  },
  {
    q: 'Is it free to list my business?',
    a: 'Yes! We offer a FREE listing plan where you can set up your storefront and catalog. We also offer Premium SaaS Subscriptions with features like AI description generators, custom SEO tags, CRM pipeline score tools, and high-priority RFQ board alerts.'
  }
];

export const Home: React.FC = () => {
  const navigate = useNavigate();

  // Update document title and meta description for SEO
  useEffect(() => {
    document.title = 'LocalConnect - IndiaMART & Justdial Style B2B Marketplace';
    document.querySelector('meta[name="description"]')?.setAttribute(
      'content',
      'Discover and connect with top local businesses, restaurants, electricians, and more. Get quotes, review ratings, and find verified dealer contacts.'
    );
  }, []);

  // Search & data states
  const [featured, setFeatured] = useState<any[]>([]);
  const [allBusinesses, setAllBusinesses] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryBiz, setEnquiryBiz] = useState<{ id: string; name: string; message?: string } | null>(null);
  const [isAllCategoriesExpanded, setIsAllCategoriesExpanded] = useState(false);
  const [explorerTab, setExplorerTab] = useState<'vendors' | 'products'>('vendors');

  // Hero Slider State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSliderHovered, setIsSliderHovered] = useState(false);

  const heroSlides = [
    {
      badge: "India's Premier AI B2B Directory",
      title: "Explore Local Products & Verified Sellers",
      desc: "Connect directly with verified local businesses, explore storefront catalogs, request custom quotes, and chat instantly via WhatsApp.",
      actionText: "Browse Categories",
      actionLink: "#categories",
      bgClass: "from-slate-955 via-slate-900 to-indigo-950/95",
      accentColor: "border-brand-500/20 text-brand-450 bg-brand-500/10",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
      icon: Sparkles
    },
    {
      badge: "Live RFQ Bidding Marketplace",
      title: "Post Requirements. Get Competitive Bids.",
      desc: "Skip scrolling through listings. Post your project specs or procurement needs as an RFQ, and let nearby verified businesses bid directly.",
      actionText: "Post an RFQ",
      actionLink: "/user/rfqs",
      bgClass: "from-slate-955 via-slate-900 to-rose-950/90",
      accentColor: "border-rose-500/20 text-rose-455 bg-rose-500/10",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
      icon: ClipboardList
    },
    {
      badge: "Merchant SaaS Dashboard Suite",
      title: "Empower Your Business Storefront",
      desc: "Register as an Owner to unlock AI Copywriter biography tools, automatic lead CRM scores (Hot/Cold), and verified GSTIN trust badges.",
      actionText: "Register Store",
      actionLink: "#register-cta",
      bgClass: "from-slate-955 via-slate-900 to-emerald-950/90",
      accentColor: "border-emerald-500/20 text-emerald-455 bg-emerald-500/10",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
      icon: Store
    }
  ];

  // Auto-play effect
  useEffect(() => {
    if (isSliderHovered) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isSliderHovered, heroSlides.length]);

  // Explorer active filters
  const [explorerSearch, setExplorerSearch] = useState('');
  const [explorerCity, setExplorerCity] = useState('');



  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const productScrollRef = useRef<HTMLDivElement>(null);
  const testimonialScrollRef = useRef<HTMLDivElement>(null);

  // Fetch initial directory data
  const loadInitialData = async () => {
    try {
      // Fetch businesses
      const resBiz = await fetch('/api/businesses');
      if (resBiz.ok) {
        const dataBiz = await resBiz.json();
        setAllBusinesses(dataBiz);
        setFeatured(dataBiz.slice(0, 3));
      }

      // Fetch all products
      const resProd = await fetch('/api/businesses/all/products');
      if (resProd.ok) {
        const dataProd = await resProd.json();
        setProducts(dataProd);
      }
    } catch (err) {
      console.error('Failed to load directory data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Lock body scroll when category overlay is active
  useEffect(() => {
    if (selectedCategory !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedCategory]);

  // Testimonials Infinite Autoplay Slow Scroll Effect
  useEffect(() => {
    const container = testimonialScrollRef.current;
    if (!container) return;

    let animationFrameId: number;
    let lastTime = 0;
    const speed = 0.025; // Frame-rate independent slow speed

    const scroll = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const elapsed = timestamp - lastTime;
      lastTime = timestamp;

      container.scrollLeft += speed * elapsed;

      // Wrap around seamlessly at half width
      const halfWidth = container.scrollWidth / 2;
      if (container.scrollLeft >= halfWidth) {
        container.scrollLeft -= halfWidth;
      }

      animationFrameId = requestAnimationFrame(scroll);
    };

    const handleMouseEnter = () => {
      cancelAnimationFrame(animationFrameId);
    };

    const handleMouseLeave = () => {
      lastTime = 0;
      animationFrameId = requestAnimationFrame(scroll);
    };

    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Start autoscrolling
    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (container) {
        container.removeEventListener('mouseenter', handleMouseEnter);
        container.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);


  const handleCategoryClick = (slug: string) => {
    setSelectedCategory(slug);
    setExplorerTab('vendors');
  };

  const handleCityClick = (city: string) => {
    setExplorerCity(city);
    setTimeout(() => {
      const target = document.getElementById('categories');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handlePopularSearchEnquiry = (categorySlug: string, serviceTitle: string) => {
    const matchingBiz = products.find(p => p.business?.category?.slug === categorySlug)?.business || 
                        featured.find(b => b.category?.slug === categorySlug) ||
                        featured[0];

    if (matchingBiz) {
      setEnquiryBiz({
        id: matchingBiz.id,
        name: matchingBiz.name,
        message: `I am interested in: ${serviceTitle}. Please share pricing quotations and catalog options.`
      });
      setIsEnquiryOpen(true);
    } else {
      alert("All category dealers are currently offline. Please post a general RFQ instead!");
    }
  };

  const scrollContainer = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.75 : scrollLeft + clientWidth * 0.75;
      ref.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };



  // Filter products for the Explorer Pane
  const filteredProducts = products.filter(item => {
    // Category
    if (selectedCategory) {
      if (item.business?.category?.slug !== selectedCategory) return false;
    }
    // Keywords
    if (explorerSearch) {
      const q = explorerSearch.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchDesc = item.description.toLowerCase().includes(q);
      if (!matchName && !matchDesc) return false;
    }
    // City
    if (explorerCity) {
      const c = explorerCity.toLowerCase();
      const matchCity = item.business?.city?.toLowerCase().includes(c);
      if (!matchCity) return false;
    }
    return true;
  });

  // Filter businesses for the Explorer Pane
  const filteredBusinesses = allBusinesses.filter(biz => {
    // Category
    if (selectedCategory) {
      if (biz.category?.slug !== selectedCategory) return false;
    }
    // Keywords
    if (explorerSearch) {
      const q = explorerSearch.toLowerCase();
      const matchName = biz.name.toLowerCase().includes(q);
      const matchDesc = biz.description.toLowerCase().includes(q);
      const matchAddress = biz.address.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchAddress) return false;
    }
    // City
    if (explorerCity) {
      const c = explorerCity.toLowerCase();
      const matchCity = biz.city?.toLowerCase().includes(c);
      if (!matchCity) return false;
    }
    return true;
  });

  return (
    <div className="space-y-20 pb-24 text-slate-800">
      
      {/* 1. HERO BANNER SLIDER CAROUSEL */}
      <div 
        className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 pt-8 pb-4"
        onMouseEnter={() => setIsSliderHovered(true)}
        onMouseLeave={() => setIsSliderHovered(false)}
      >
        <div className="relative rounded-none overflow-hidden border border-slate-200/80 shadow-glass bg-slate-950 min-h-[340px] flex items-center">
          
          {/* Slides */}
          {heroSlides.map((slide, index) => {
            const Icon = slide.icon;
            const isActive = index === currentSlide;
            return (
              <div
                key={index}
                className={`absolute inset-0 bg-gradient-to-r ${slide.bgClass} flex items-center transition-all duration-700 ease-in-out ${
                  isActive ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 pointer-events-none z-0"
                }`}
              >
                {/* Background ambient blur orb */}
                <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-brand-500/5 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="w-full max-w-7xl mx-auto px-8 md:px-16 py-12 relative z-20">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full">
                    
                    {/* Left details column */}
                    <div className="md:col-span-7 flex flex-col justify-center text-left space-y-4">
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-none border ${slide.accentColor} text-[10px] font-black uppercase tracking-wider w-fit`}>
                        <Icon className="w-3.5 h-3.5 animate-pulse" />
                        <span>{slide.badge}</span>
                      </div>
                      
                      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-none font-sans">
                        {slide.title}
                      </h1>
                      
                      <p className="text-xs sm:text-sm text-slate-350 font-medium leading-relaxed max-w-xl">
                        {slide.desc}
                      </p>
                      
                      <div className="pt-2">
                        <a
                          href={slide.actionLink}
                          onClick={(e) => {
                            if (slide.actionLink.startsWith('#')) {
                              e.preventDefault();
                              const target = document.getElementById(slide.actionLink.substring(1));
                              if (target) target.scrollIntoView({ behavior: 'smooth' });
                            }
                          }}
                          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-none text-xs font-bold text-slate-900 bg-white hover:bg-slate-50 shadow-md transition-all hover:scale-102"
                        >
                          <span>{slide.actionText}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {/* Right image column */}
                    <div className="md:col-span-5 relative h-64 md:h-72 rounded-none overflow-hidden shadow-lg border border-white/10 shrink-0 group/img hidden md:block">
                      <div className="absolute inset-0 bg-slate-950/20 z-10 transition-opacity duration-300 group-hover/img:opacity-10 pointer-events-none"></div>
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/img:scale-105"
                      />
                    </div>

                  </div>
                </div>
              </div>
            );
          })}

          {/* Left/Right Control Arrows */}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-none border border-white/10 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm z-30 transition-all shadow-sm hidden sm:block"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % heroSlides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-none border border-white/10 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm z-30 transition-all shadow-sm hidden sm:block"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 transition-all duration-300 ${
                  index === currentSlide ? "w-6 bg-white" : "w-2 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>

        </div>
      </div>

      {/* 1.5. EXPLORE TOP CITIES */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 space-y-6">
        <div className="text-left space-y-1">
          <div className="inline-flex items-center space-x-1.5 text-brand-600 font-extrabold text-[10px] uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            <span>Local Directories</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Explore Top Business Cities</h2>
          <p className="text-slate-500 text-xs max-w-lg">
            Directly browse local catalogs, wholesalers, and services across major Indian commercial hubs.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
          {TOP_CITIES.map((city) => {
            const isActive = explorerCity.toLowerCase() === city.name.toLowerCase();
            return (
              <button
                key={city.name}
                onClick={() => handleCityClick(city.name)}
                className={`relative rounded-none overflow-hidden h-36 border transition-all duration-300 group hover:-translate-y-1 shadow-sm ${
                  isActive 
                    ? 'border-brand-600 ring-4 ring-brand-500/10' 
                    : 'border-slate-200 hover:border-brand-500/30'
                }`}
              >
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-4 text-left">
                  <span className="text-white font-extrabold text-sm tracking-tight">{city.name}</span>
                  <span className="text-slate-300 text-[9px] font-medium leading-none mt-1">{city.description}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. MAIN CATEGORIES DIRECTORY - Premium Justdial Category Icon Grid */}
      <section id="directory-sectors" className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 space-y-8">
        <div className="text-left space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-brand-600 font-extrabold text-[10px] uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-brand-500" />
            <span>Service Sectors</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Explore by Services</h2>
          <p className="text-slate-500 text-xs max-w-lg">
            Quickly filter through popular industries to find matching local contractors, dealers or retail outlets.
          </p>
        </div>

        {/* Premium Grid Layout: 2 cols on mobile, 5 cols on tablets/desktops */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 md:gap-6">
          {/* All Services / All Products Card */}
          <button
            onClick={() => {
              setSelectedCategory(null);
              setTimeout(() => {
                const target = document.getElementById('categories');
                if (target) target.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className={`relative flex flex-col items-center justify-center p-6 rounded-none border transition-all duration-300 group text-center shadow-sm ${
              selectedCategory === null 
                ? 'border-brand-600 bg-brand-50/20 ring-4 ring-brand-500/10 shadow-md scale-102 z-10' 
                : 'bg-white border-slate-200 hover:border-brand-500/40 hover:bg-slate-50/50 hover:shadow-md hover:-translate-y-1'
            }`}
          >
            <div className={`p-4 rounded-none mb-4 border transition-all duration-300 ${
              selectedCategory === null 
                ? 'text-brand-600 bg-brand-100/80 border-brand-200 shadow-inner' 
                : 'text-indigo-650 bg-indigo-50 border-indigo-100 group-hover:scale-110'
            }`}>
              <Layers className="w-6 h-6" />
            </div>
            <span className={`text-xs font-bold leading-tight tracking-tight ${
              selectedCategory === null ? 'text-brand-650' : 'text-slate-700 group-hover:text-brand-600'
            }`}>
              All Products
            </span>
            
            {/* Small active state indicator pill */}
            {selectedCategory === null && (
              <span className="absolute bottom-2 w-4 h-0.5 bg-brand-650"></span>
            )}
          </button>

          {(isAllCategoriesExpanded ? CATEGORIES : CATEGORIES.slice(0, 8)).map((cat) => {
            const Icon = CATEGORY_ICONS[cat.slug] || Store;
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.slug}
                onClick={() => handleCategoryClick(cat.slug)}
                className={`relative flex flex-col items-center justify-center p-6 rounded-none border transition-all duration-300 group text-center shadow-sm ${
                  isSelected 
                    ? 'border-brand-600 bg-brand-50/20 ring-4 ring-brand-500/10 shadow-md scale-102 z-10' 
                    : 'bg-white border-slate-200 hover:border-brand-500/40 hover:bg-slate-50/50 hover:shadow-md hover:-translate-y-1'
                }`}
              >
                <div className={`p-4 rounded-none mb-4 border transition-all duration-300 ${
                  isSelected 
                    ? 'text-brand-600 bg-brand-100/80 border-brand-200 shadow-inner' 
                    : (cat.color || 'text-slate-600 bg-slate-50 border-slate-100') + ' group-hover:scale-110'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-xs font-bold leading-tight tracking-tight ${
                  isSelected ? 'text-brand-650' : 'text-slate-750 group-hover:text-brand-600'
                }`}>
                  {cat.name}
                </span>

                {/* Small active state indicator pill */}
                {isSelected && (
                  <span className="absolute bottom-2 w-4 h-0.5 bg-brand-650"></span>
                )}
              </button>
            );
          })}

          {/* More Services Button */}
          {!isAllCategoriesExpanded && CATEGORIES.length > 8 && (
            <button
              onClick={() => setIsAllCategoriesExpanded(true)}
              className="relative flex flex-col items-center justify-center p-6 rounded-none border border-slate-200 bg-white hover:border-brand-500/40 hover:bg-slate-50/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group text-center shadow-sm"
            >
              <div className="p-4 rounded-none mb-4 border border-slate-200 text-slate-500 bg-slate-50 group-hover:bg-slate-100 group-hover:scale-110 transition-all duration-300">
                <ChevronDown className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold leading-tight tracking-tight text-slate-700 group-hover:text-brand-600">
                More Services
              </span>
            </button>
          )}

          {/* Show Less Button */}
          {isAllCategoriesExpanded && CATEGORIES.length > 8 && (
            <button
              onClick={() => setIsAllCategoriesExpanded(false)}
              className="relative flex flex-col items-center justify-center p-6 rounded-none border border-slate-200 bg-white hover:border-brand-500/40 hover:bg-slate-50/50 hover:shadow-md hover:-translate-y-1 transition-all duration-300 group text-center shadow-sm"
            >
              <div className="p-4 rounded-none mb-4 border border-slate-200 text-slate-500 bg-slate-50 group-hover:bg-slate-100 group-hover:scale-110 transition-all duration-300">
                <ChevronUp className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold leading-tight tracking-tight text-slate-700 group-hover:text-brand-600">
                Show Less
              </span>
            </button>
          )}
        </div>
      </section>

      {/* 2. SPLIT-PANE CATALOG EXPLORER */}
      <section id="categories" className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 space-y-6 text-left animate-in zoom-in-95 duration-200">
          
        {/* Header Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-150 pb-5 gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Marketplace Directory Catalog</h2>
            <p className="text-xs text-slate-500">Filter offerings by category or verified seller storefronts.</p>
          </div>

            {/* Keyword Search Filters inside Explorer */}
            <div className="flex flex-wrap gap-2.5 items-center">
              <div className="relative w-56">
                <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-450" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={explorerSearch}
                  onChange={(e) => setExplorerSearch(e.target.value)}
                  className="w-full rounded-none pl-8 pr-3 py-1.5 text-xs glass-input font-bold"
                />
              </div>

              <div className="relative w-44">
                <MapPin className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-450" />
                <input
                  type="text"
                  placeholder="Filter city..."
                  value={explorerCity}
                  onChange={(e) => setExplorerCity(e.target.value)}
                  className="w-full rounded-none pl-8 pr-3 py-1.5 text-xs glass-input font-bold"
                />
              </div>

              {(explorerSearch || explorerCity || selectedCategory) && (
                <button
                  onClick={() => {
                    setExplorerSearch('');
                    setExplorerCity('');
                    setSelectedCategory(null);
                  }}
                  className="px-3 py-1.5 rounded-none text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* PRODUCTS SHOWCASE GRID */}
          <main className="w-full space-y-6">
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-650" />
                <span className="text-xs text-slate-500 font-semibold">Filtering product offerings...</span>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 items-stretch">
                {filteredProducts.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full justify-between text-left group relative hover:-translate-y-0.5"
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

                      {/* Category specific Color Badge */}
                      {item.business?.category?.slug && (
                        <span className={`absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[7px] font-extrabold uppercase border ${
                          CATEGORY_COLORS[item.business.category.slug] || 'bg-slate-100 text-slate-600 border-slate-200'
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

                    {/* Content */}
                    <div className="p-2.5 flex-grow flex flex-col justify-between space-y-2">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-1">
                          <h3 className="font-bold text-slate-900 text-xs line-clamp-1 group-hover:text-indigo-650 transition-colors">
                            {item.name}
                          </h3>
                          <span className="font-extrabold text-slate-900 text-xs shrink-0">
                            ₹{item.price.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-500 line-clamp-2 leading-snug">
                          {item.description}
                        </p>
                      </div>

                      {/* Seller profile reference badge */}
                      <div className="pt-2 border-t border-slate-100 flex flex-col space-y-1.5">
                        {item.business && (
                          <div className="p-1.5 bg-slate-50/50 border border-slate-150 rounded-lg space-y-0.5 text-left">
                            <span className="text-[6px] uppercase font-bold text-slate-450 tracking-wider">Store Seller</span>
                            <div className="font-bold text-slate-800 text-[10px] truncate leading-none">{item.business.name}</div>
                            <div className="text-[9px] text-slate-500 flex items-center mt-0.5">
                              <MapPin className="w-2.5 h-2.5 mr-0.5 text-slate-450" />
                              <span>{item.business.city}</span>
                            </div>
                          </div>
                        )}

                        <Link
                          to={item.business ? `/business/${item.business.slug}` : '#'}
                          className="inline-flex items-center justify-between text-[9px] font-bold text-indigo-655 hover:text-indigo-700 hover:translate-x-0.5 transition-transform pt-0.5"
                        >
                          <span>View Store Details</span>
                          <ArrowRight className="w-3 h-3 text-indigo-500" />
                        </Link>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 rounded-none border border-dashed border-slate-200">
                <p className="text-slate-500 text-sm font-semibold mb-1">No products match your selected directory filters.</p>
                <p className="text-xs text-slate-400">Try selecting "All Category Items", changing your seller filter, or typing keywords.</p>
              </div>
            )}

          </main>
        </section>



      {/* 5. PRODUCTS HORIZONTAL SLIDER */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center space-x-1.5 text-brand-600 font-extrabold text-[10px] uppercase tracking-wider">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Sellers Catalog</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Featured Products & Deals</h2>
            <p className="text-slate-500 text-xs">
              Explore catalog items and active discount deals posted by verified local storefronts.
            </p>
          </div>
          
          <div className="flex items-center space-x-4 self-end sm:self-auto shrink-0">
            <Link
              to="/products-feed"
              className="text-xs font-extrabold text-brand-600 hover:text-brand-700 flex items-center space-x-1.5"
            >
              <span>Explore Marketplace Feed</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <div className="flex space-x-1">
              <button 
                onClick={() => scrollContainer(productScrollRef, 'left')}
                className="p-2 rounded-none bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-600 transition-colors"
                title="Scroll Left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => scrollContainer(productScrollRef, 'right')}
                className="p-2 rounded-none bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-600 transition-colors"
                title="Scroll Right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        {loading ? (
          <div className="flex overflow-x-auto gap-6 pb-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="w-64 h-80 rounded-none bg-slate-100/50 border border-slate-200 animate-pulse shrink-0"></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div 
            ref={productScrollRef}
            className="flex overflow-x-auto gap-6 pb-4 scroll-smooth snap-x snap-mandatory scrollbar-hide select-none"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {products.map((item) => (
              <div 
                key={item.id}
                className="w-44 snap-start shrink-0 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between overflow-hidden text-left hover:shadow-md transition-all duration-300 group relative hover:-translate-y-0.5"
              >
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

                  {item.isOffer && (
                    <div className="absolute top-1.5 left-1.5 bg-gradient-to-r from-amber-500 to-yellow-500 border border-amber-400/30 text-white font-extrabold text-[7px] px-1.5 py-0.5 rounded shadow uppercase tracking-wide flex items-center space-x-0.5">
                      <Sparkles className="w-2 h-2 text-white animate-pulse" />
                      <span>{item.offerDiscount || 'DEAL'}</span>
                    </div>
                  )}
                </div>

                <div className="p-2.5 flex-grow flex flex-col justify-between space-y-2">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start gap-1">
                      <h3 className="font-bold text-slate-900 text-xs line-clamp-1 group-hover:text-indigo-650 transition-colors">
                        {item.name}
                      </h3>
                      <span className="font-extrabold text-slate-900 text-xs shrink-0">
                        ₹{item.price.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[9px] text-slate-500 line-clamp-2 leading-snug">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex flex-col space-y-1.5">
                    {item.business && (
                      <div className="flex flex-col space-y-0.5 text-[8px] text-slate-400">
                        <span className="uppercase font-bold text-slate-450 tracking-wider text-[6px]">Sold By</span>
                        <span className="font-bold text-slate-700 text-[10px] truncate leading-none">{item.business.name}</span>
                        <span className="text-[9px] text-slate-400">{item.business.city}</span>
                      </div>
                    )}
                    <Link
                      to={item.business ? `/business/${item.business.slug}` : '#'}
                      className="inline-flex items-center justify-between text-[9px] font-bold text-indigo-655 hover:text-indigo-700 hover:translate-x-0.5 transition-transform pt-0.5"
                    >
                      <span>View Storefront</span>
                      <ArrowRight className="w-3 h-3 text-indigo-500" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-none border border-dashed border-slate-200 text-slate-500 text-xs">
            No products listed currently.
          </div>
        )}
      </section>

      {/* 6. SPLIT FEATURES VIEW - Upgraded Merchant SaaS Dashboard */}
      <section id="rfq-section" className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
               {/* Right Dashboard Mockup Column - Placed as col-span-6 */}
          <div className="lg:col-span-6 lg:order-2 bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 border border-slate-200/80 rounded-none p-6 md:p-8 min-h-[480px] relative overflow-hidden flex flex-col justify-between shadow-xl text-left">
            {/* Background glowing gradients */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-rose-500/5 rounded-full blur-[60px] pointer-events-none"></div>
            <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-indigo-550/5 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="space-y-6 relative z-10 w-full">
              {/* Header */}
              <div className="flex justify-between items-center w-full border-b border-slate-200/80 pb-4">
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-none border border-rose-100 tracking-wider">
                    Storefront SaaS Dashboard
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-1 font-sans">Live CRM Pipeline</h3>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" title="Live Sync Active"></div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white border border-slate-200/70 rounded-none p-3 space-y-1 shadow-2xs">
                  <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider block">Store Views</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-extrabold text-slate-900">+145%</span>
                    <span className="text-[8px] font-black text-emerald-600">▲</span>
                  </div>
                </div>
                <div className="bg-white border border-slate-200/70 rounded-none p-3 space-y-1 shadow-2xs">
                  <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider block">Hot Leads</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-extrabold text-slate-900">12</span>
                    <span className="px-1.5 py-0.5 rounded-none text-[8px] bg-rose-50 text-rose-600 font-bold uppercase border border-rose-200/60">Active</span>
                  </div>
                </div>
                <div className="bg-white border border-slate-200/70 rounded-none p-3 space-y-1 shadow-2xs">
                  <span className="text-[9px] text-slate-450 font-bold uppercase tracking-wider block">RFQ Bids</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm font-extrabold text-slate-900">8</span>
                    <span className="text-[8px] text-indigo-600 font-black">Submitted</span>
                  </div>
                </div>
              </div>

              {/* Leads Feed */}
              <div className="space-y-3">
                <span className="text-[9px] uppercase font-bold text-slate-455 tracking-widest block mb-2">Qualified Incoming Leads</span>
                
                {/* Lead 1 */}
                <div className="p-3 bg-white hover:bg-slate-50 border border-slate-200/70 rounded-none flex items-center justify-between transition-colors duration-200 shadow-2xs">
                  <div className="space-y-0.5 min-w-0">
                    <span className="block font-bold text-xs text-slate-900 truncate">Amit Kumar</span>
                    <span className="block text-[10px] text-slate-500 truncate">Electrical wholesale contract</span>
                  </div>
                  <div className="flex flex-col items-end space-y-1 shrink-0">
                    <span className="px-2 py-0.5 rounded-none text-[8px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200/60 uppercase tracking-wide">
                      HOT LEAD
                    </span>
                    <span className="text-[9px] font-bold text-slate-455">score: 94%</span>
                  </div>
                </div>

                {/* Lead 2 */}
                <div className="p-3 bg-white hover:bg-slate-50 border border-slate-200/70 rounded-none flex items-center justify-between transition-colors duration-200 shadow-2xs">
                  <div className="space-y-0.5 min-w-0">
                    <span className="block font-bold text-xs text-slate-900 truncate">Anjali Sharma</span>
                    <span className="block text-[10px] text-slate-500 truncate">AC maintenance specs proposal</span>
                  </div>
                  <div className="flex flex-col items-end space-y-1 shrink-0">
                    <span className="px-2 py-0.5 rounded-none text-[8px] font-black bg-amber-50 text-amber-700 border border-amber-200/60 uppercase tracking-wide">
                      WARM LEAD
                    </span>
                    <span className="text-[9px] font-bold text-slate-455">score: 78%</span>
                  </div>
                </div>

                {/* Lead 3 */}
                <div className="p-3 bg-white hover:bg-slate-50 border border-slate-200/70 rounded-none flex items-center justify-between transition-colors duration-200 opacity-70 shadow-2xs">
                  <div className="space-y-0.5 min-w-0">
                    <span className="block font-bold text-xs text-slate-900 truncate">Pooja Reddy</span>
                    <span className="block text-[10px] text-slate-500 truncate">Custom general plumbing quote</span>
                  </div>
                  <div className="flex flex-col items-end space-y-1 shrink-0">
                    <span className="px-2 py-0.5 rounded-none text-[8px] font-black bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wide">
                      COLD LEAD
                    </span>
                    <span className="text-[9px] font-bold text-slate-450">score: 45%</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Left Details & Feature Cards Column - Placed as col-span-6 */}
          <div className="lg:col-span-6 lg:order-1 space-y-6 text-left">
            <div className="inline-flex items-center space-x-1.5 text-rose-600 font-extrabold text-[10px] uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              <span>SaaS Features</span>
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight font-sans">Full Dealer Suite with AI Assistants.</h3>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
              Are you a dealer? Showcase your products, upload discounts, and qualify client inquiries inside our robust SaaS pipeline. Benefit from built-in automation assistants.
            </p>

            {/* Grid of 4 Feature Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              {/* Feature 1 */}
              <div className="p-4 rounded-none bg-white border border-slate-200/80 shadow-sm space-y-3 hover:shadow-md hover:border-rose-200 transition-all duration-300">
                <div className="w-8 h-8 rounded-none bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-sm shrink-0">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-xs">AI Description Writer</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">Draft professional store biography copy & optimized SEO keywords automatically.</p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="p-4 rounded-none bg-white border border-slate-200/80 shadow-sm space-y-3 hover:shadow-md hover:border-indigo-200 transition-all duration-300">
                <div className="w-8 h-8 rounded-none bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-650 shadow-sm shrink-0">
                  <ClipboardList className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-xs">AI Lead Intent CRM</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">Scores customer inquiries (Hot/Warm/Cold) automatically for quick conversions.</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="p-4 rounded-none bg-white border border-slate-200/80 shadow-sm space-y-3 hover:shadow-md hover:border-amber-200 transition-all duration-300">
                <div className="w-8 h-8 rounded-none bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-sm shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-xs">Live RFQ Bidding Board</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">Receive immediate alerts when buyers post custom project orders and submit bids.</p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="p-4 rounded-none bg-white border border-slate-200/80 shadow-sm space-y-3 hover:shadow-md hover:border-emerald-200 transition-all duration-300">
                <div className="w-8 h-8 rounded-none bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-900 text-xs">Verified Trust Badges</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">Submit GSTIN validations to unlock the green Trust Seal and boost listing rank.</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 6.5. POPULAR SEARCHES GRID WITH QUICK ENQUIRY */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 space-y-8">
        <div className="text-left space-y-1">
          <div className="inline-flex items-center space-x-1.5 text-brand-600 font-extrabold text-[10px] uppercase tracking-wider">
            <Search className="w-3.5 h-3.5" />
            <span>Popular Requisitions</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Popular Services & Searches</h2>
          <p className="text-slate-500 text-xs max-w-lg">
            Directly submit requirements to verified local merchants and contractors matching these services.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-left">
          {POPULAR_SEARCHES.map((search, idx) => (
            <div key={idx} className="rounded-none border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between group">
              <div className="h-44 bg-slate-100 relative overflow-hidden shrink-0">
                <img
                  src={search.image}
                  alt={search.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/10 transition-colors pointer-events-none"></div>
              </div>

              <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-650 transition-colors leading-tight">
                    {search.title}
                  </h3>
                  <p className="text-3xs text-slate-450 font-bold uppercase tracking-wider">
                    {search.tagline}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => handleCategoryClick(search.categorySlug)}
                    className="text-3xs font-extrabold text-slate-450 hover:text-slate-700 uppercase tracking-wider flex items-center space-x-1"
                  >
                    <span>View Category</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                  
                  <button
                    onClick={() => handlePopularSearchEnquiry(search.categorySlug, search.title)}
                    className="px-3.5 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-none text-3xs font-extrabold uppercase tracking-wider transition-colors shadow-sm"
                  >
                    Enquire Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. POPULAR PROVIDERS */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 space-y-8">
        <div className="flex items-end justify-between">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center space-x-1.5 text-brand-600 font-extrabold text-[10px] uppercase tracking-wider">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Local Providers</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Popular Service Providers</h2>
            <p className="text-slate-500 text-xs">
              Discover top-rated local listings backed by high reviews and customer ratings.
            </p>
          </div>
          <button
            onClick={() => navigate('/search')}
            className="text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors shrink-0"
          >
            See All Listings →
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-none bg-slate-100/50 border border-slate-200 animate-pulse"></div>
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((item) => (
              <BusinessCard key={item.id} business={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-none border border-dashed border-slate-200 text-slate-500 text-xs">
            No businesses found. Run seed script in database.
          </div>
        )}
      </section>

      {/* 9. FAQ ACCORDION */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 space-y-10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center space-x-1.5 text-brand-600 font-extrabold text-[10px] uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help Center</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-sans">Frequently Asked Questions</h2>
          <p className="text-slate-550 text-xs">Find answer snippets to billing, procurement proposals, and AI-enabled merchant CRM settings.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-5xl mx-auto">
          {MOCK_FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div 
                key={index} 
                className={`p-5 rounded-none border transition-all duration-300 flex flex-col justify-between space-y-4 ${
                  isOpen 
                    ? 'bg-gradient-to-br from-white to-slate-50/50 border-brand-500/30 shadow-md shadow-brand-500/5' 
                    : 'bg-white border-slate-200/80 hover:border-slate-350 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-3.5 min-w-0">
                    <div className={`w-8 h-8 rounded-none flex items-center justify-center shrink-0 border transition-colors ${
                      isOpen 
                        ? 'bg-brand-50 border-brand-100 text-brand-600 shadow-2xs' 
                        : 'bg-slate-50 border-slate-100 text-slate-500'
                    }`}>
                      <HelpCircle className="w-4 h-4" />
                    </div>
                    <div className="space-y-1.5">
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        className="text-left font-extrabold text-slate-900 text-xs hover:text-brand-600 transition-colors focus:outline-none leading-snug"
                      >
                        {faq.q}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className={`p-1.5 rounded-none border transition-all shrink-0 ${
                      isOpen 
                        ? 'bg-brand-100/50 border-brand-200 text-brand-600 rotate-180' 
                        : 'bg-slate-50 border-slate-150 text-slate-400 hover:text-slate-655 hover:bg-slate-100'
                    }`}
                    title={isOpen ? "Collapse" : "Expand"}
                  >
                    <ChevronDown className="w-3.5 h-3.5 transform transition-transform duration-350" />
                  </button>
                </div>

                {isOpen && (
                  <div className="text-xs text-slate-550 leading-relaxed font-semibold bg-slate-50/30 border-t border-slate-100 pt-4 animate-in fade-in slide-in-from-top-1 duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. TESTIMONIALS */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 space-y-8">
        <div className="bg-slate-50/50 py-12 px-6 md:px-10 rounded-none border border-slate-200/60 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center space-x-1.5 text-brand-600 font-extrabold text-[10px] uppercase tracking-wider">
              <Users className="w-3.5 h-3.5" />
              <span>Success Stories</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Trusted By Local Stores & Buyers</h2>
            <p className="text-slate-500 text-xs">Read what clients and business owners say about their conversion rates.</p>
          </div>

          <div className="flex space-x-1 shrink-0">
            <button 
              onClick={() => scrollContainer(testimonialScrollRef, 'left')}
              className="p-2 rounded-none bg-white hover:bg-slate-100 border border-slate-200 text-slate-655 transition-colors shadow-sm"
              title="Previous Testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => scrollContainer(testimonialScrollRef, 'right')}
              className="p-2 rounded-none bg-white hover:bg-slate-100 border border-slate-200 text-slate-655 transition-colors shadow-sm"
              title="Next Testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div 
          ref={testimonialScrollRef}
          className="flex overflow-x-auto gap-6 pb-4 scroll-smooth snap-x snap-mandatory scrollbar-hide select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {[...MOCK_TESTIMONIALS, ...MOCK_TESTIMONIALS].map((t, index) => (
            <div 
              key={index}
              className="w-80 sm:w-96 snap-start shrink-0 rounded-none border border-slate-205 bg-gradient-to-br from-white to-slate-50/50 p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-6 text-left relative group/t"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-0.5 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="inline-flex items-center text-[8px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-none border border-emerald-100 uppercase tracking-wide">
                    Verified Feedback
                  </span>
                </div>
                <p className="text-xs text-slate-755 leading-relaxed font-semibold italic">
                  "{t.quote}"
                </p>
              </div>

              <div className="flex items-center space-x-3.5 border-t border-slate-100 pt-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-none object-cover border-2 border-brand-500/10 shadow-sm shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h4 className="font-extrabold text-slate-900 text-xs truncate">{t.name}</h4>
                  <p className="text-[10px] text-slate-455 truncate">{t.role} • {t.city}</p>
                </div>
                <Quote className="w-8 h-8 text-slate-100 fill-slate-100 shrink-0 self-end transition-colors group-hover/t:text-brand-550/10 group-hover/t:fill-brand-550/10" />
              </div>
            </div>
          ))}
        </div>
        </div>
      </section>

      {/* 10. GROW CTA */}
      <section id="register-cta" className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="rounded-none bg-gradient-brand p-8 md:p-12 relative overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-slate-955/20 mix-blend-overlay"></div>
          <div className="absolute right-0 bottom-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-6 text-left">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight font-sans">
                Are you a Local Business Owner? <br />
                Grow your clientele with LocalConnect.
              </h2>
              <p className="text-white/80 text-sm md:text-base leading-relaxed">
                Add your business in minutes. Generate high-converting profiles using our built-in AI generators, receive Hot/Cold qualified client leads, and verify your business credentials via GST & Aadhaar.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center space-x-2 text-white/95 text-xs font-semibold bg-white/10 rounded-none px-3 py-1.5 backdrop-blur-sm border border-white/15">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Verified Profiles</span>
                </div>
                <div className="flex items-center space-x-2 text-white/95 text-xs font-semibold bg-white/10 rounded-none px-3 py-1.5 backdrop-blur-sm border border-white/15">
                  <Sparkles className="w-4 h-4 shrink-0" />
                  <span>AI CRM Pipeline</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 flex justify-end">
              <button
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  const navLoginBtn = document.querySelector('nav button');
                  if (navLoginBtn instanceof HTMLButtonElement) navLoginBtn.click();
                }}
                className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-white text-slate-900 hover:bg-slate-50 hover:shadow-xl font-bold rounded-none transition-all duration-200 shrink-0"
              >
                List Your Business Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SPA Category Products Overlay - Full Viewport */}
      {selectedCategory !== null && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] bg-white flex flex-col animate-in fade-in duration-200">
          <div className="w-full h-full flex flex-col relative z-10">
            
            {/* Header */}
            <header className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between z-10 shadow-sm">
              <div className="flex items-center space-x-3 text-left">
                <div className={`p-2 rounded-none border ${
                  CATEGORY_COLORS[selectedCategory!] || 'text-slate-655 bg-slate-50 border-slate-100'
                }`}>
                  {(() => {
                    const IconComponent = CATEGORY_ICONS[selectedCategory!] || Store;
                    return <IconComponent className="w-5 h-5" />;
                  })()}
                </div>
                <div>
                  <h2 className="text-base md:text-lg font-black text-slate-900 capitalize">
                    {CATEGORIES.find(c => c.slug === selectedCategory)?.name || selectedCategory}
                  </h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Category Directory
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Quick Filters */}
                <div className="hidden md:flex items-center space-x-2">
                  <div className="relative w-48">
                    <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-455" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={explorerSearch}
                      onChange={(e) => setExplorerSearch(e.target.value)}
                      className="w-full rounded-none pl-8 pr-3 py-1.5 text-xs bg-slate-100 border-none font-bold focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                  <div className="relative w-40">
                    <MapPin className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-455" />
                    <input
                      type="text"
                      placeholder="Filter city..."
                      value={explorerCity}
                      onChange={(e) => setExplorerCity(e.target.value)}
                      className="w-full rounded-none pl-8 pr-3 py-1.5 text-xs bg-slate-100 border-none font-bold focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="p-2.5 rounded-none bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center space-x-1.5 border border-slate-200 shadow-sm font-bold"
                  title="Close Category View"
                >
                  <span className="text-2xs font-extrabold uppercase tracking-wider px-0.5">Close</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* Mobile Filter Bar */}
            <div className="md:hidden bg-white border-b border-slate-150 px-6 py-2.5 flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 w-3 h-3 text-slate-450" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={explorerSearch}
                  onChange={(e) => setExplorerSearch(e.target.value)}
                  className="w-full rounded-none pl-6 pr-2 py-1.5 text-3xs bg-slate-100 border-none font-semibold"
                />
              </div>
              <div className="relative flex-1">
                <MapPin className="absolute left-2 top-2.5 w-3 h-3 text-slate-455" />
                <input
                  type="text"
                  placeholder="City..."
                  value={explorerCity}
                  onChange={(e) => setExplorerCity(e.target.value)}
                  className="w-full rounded-none pl-6 pr-2 py-1.5 text-3xs bg-slate-100 border-none font-semibold"
                />
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto px-6 md:px-8 pt-2 md:pt-4 pb-8 space-y-6 bg-white">
              
              {/* Category Info Header Banner */}
              <div className="rounded-none bg-white border border-slate-200 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm text-left">
                <div className="space-y-1.5">
                  <h3 className="text-xl md:text-2xl font-black text-slate-900">
                    Verified Listings for {CATEGORIES.find(c => c.slug === selectedCategory)?.name || selectedCategory}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                    Browse catalog listings, check verified vendor store discounts, and chat with dealers directly. Post custom RFQs to request quotes instantly.
                  </p>
                </div>
                
                <button
                  onClick={() => {
                    const activeCat = CATEGORIES.find(c => c.slug === selectedCategory);
                    setEnquiryBiz({
                      id: 'general',
                      name: `Verified ${activeCat?.name || selectedCategory} Dealers`,
                      message: `I want to submit a request for quotation (RFQ) for ${activeCat?.name || selectedCategory} services in ${explorerCity || 'my city'}.`
                    });
                    setIsEnquiryOpen(true);
                  }}
                  className="px-5 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-none text-xs font-bold shadow-md shadow-brand-500/10 hover:shadow-lg transition-all shrink-0"
                >
                  Post Category RFQ
                </button>
              </div>

              {/* Tab Switcher */}
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => setExplorerTab('vendors')}
                  className={`px-6 py-3 text-xs uppercase tracking-wider font-extrabold border-b-2 transition-all ${
                    explorerTab === 'vendors'
                      ? 'border-brand-600 text-brand-605'
                      : 'border-transparent text-slate-455 hover:text-slate-800'
                  }`}
                >
                  Verified Providers ({filteredBusinesses.length})
                </button>
                <button
                  onClick={() => setExplorerTab('products')}
                  className={`px-6 py-3 text-xs uppercase tracking-wider font-extrabold border-b-2 transition-all ${
                    explorerTab === 'products'
                      ? 'border-brand-600 text-brand-605'
                      : 'border-transparent text-slate-455 hover:text-slate-800'
                  }`}
                >
                  Catalog Items & Deals ({filteredProducts.length})
                </button>
              </div>

              {/* Showcase Grid based on Tab */}
              {explorerTab === 'vendors' ? (
                <div className="space-y-6">
                  <h4 className="text-xs font-extrabold text-slate-800 text-left uppercase tracking-wider">
                    Verified Vendor Listings ({filteredBusinesses.length})
                  </h4>

                  {filteredBusinesses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 items-stretch">
                      {filteredBusinesses.map((biz) => (
                        <BusinessCard key={biz.id} business={biz} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 rounded-none border border-dashed border-slate-205 bg-white">
                      <p className="text-slate-500 text-sm font-semibold mb-1">No verified providers match your filters in this category.</p>
                      <p className="text-xs text-slate-400">Try changing the keywords or removing the city filter.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6">
                  <h4 className="text-xs font-extrabold text-slate-800 text-left uppercase tracking-wider">
                    Catalog Items ({filteredProducts.length})
                  </h4>

                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 items-stretch">
                      {filteredProducts.map((item) => (
                        <div
                          key={item.id}
                          className="rounded-none border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full justify-between text-left group"
                        >
                          {/* Image */}
                          <div className="h-32 sm:h-36 bg-slate-55 relative overflow-hidden shrink-0">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-355">
                                <ShoppingBag className="w-6 h-6" />
                              </div>
                            )}
                            
                            {item.isOffer && (
                              <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-yellow-500 border border-amber-400/30 text-white font-extrabold text-[8px] px-2 py-0.5 rounded-none shadow uppercase tracking-wide">
                                {item.offerDiscount || 'DEAL'}
                              </div>
                            )}
                          </div>

                          {/* Body */}
                          <div className="p-3.5 flex-grow flex flex-col justify-between space-y-3">
                            <div className="space-y-1">
                              <div className="flex flex-col justify-between items-start gap-1">
                                <h5 className="font-bold text-slate-905 text-xs line-clamp-1 group-hover:text-brand-600 transition-colors">
                                  {item.name}
                                </h5>
                                <span className="font-extrabold text-slate-955 text-xs">
                                  ₹{item.price.toLocaleString()}
                                </span>
                              </div>
                              <p className="text-3xs text-slate-500 line-clamp-2 leading-relaxed h-7">
                                {item.description}
                              </p>
                            </div>

                            {/* Store Detail */}
                            <div className="pt-2 border-t border-slate-100 flex flex-col space-y-2">
                              {item.business && (
                                <div className="p-2 bg-slate-55 rounded-none space-y-0.5">
                                  <div className="font-bold text-slate-800 text-[9px] truncate">{item.business.name}</div>
                                  <div className="text-[8px] text-slate-500 flex items-center">
                                    <MapPin className="w-2 h-2 mr-0.5 text-slate-450" />
                                    <span>{item.business.city}</span>
                                  </div>
                                </div>
                              )}

                              <div className="flex items-center justify-between gap-2 pt-0.5">
                                <Link
                                  to={item.business ? `/business/${item.business.slug}` : '#'}
                                  className="text-3xs font-extrabold text-brand-600 hover:text-brand-700 hover:translate-x-0.5 transition-transform uppercase tracking-wider flex items-center space-x-0.5"
                                >
                                  <span>Visit</span>
                                  <ArrowRight className="w-2.5 h-2.5" />
                                </Link>
                                
                                <button
                                  onClick={() => {
                                    setEnquiryBiz({
                                      id: item.business.id,
                                      name: item.business.name,
                                      message: `I am interested in purchasing "${item.name}" listed under the ${CATEGORIES.find(c => c.slug === selectedCategory)?.name || selectedCategory} category. Please share pricing and catalog details.`
                                    });
                                    setIsEnquiryOpen(true);
                                  }}
                                  className="px-2.5 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-none text-3xs font-extrabold uppercase tracking-wider transition-colors shadow-sm"
                                >
                                  Enquire
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 rounded-none border border-dashed border-slate-205 bg-white">
                      <p className="text-slate-500 text-sm font-semibold mb-1">No products match your filters in this category.</p>
                      <p className="text-xs text-slate-400">Try changing the keywords or removing the city filter.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* LeadModal Overlay for Quick Enquiry */}
      {enquiryBiz && (
        <LeadModal
          isOpen={isEnquiryOpen}
          onClose={() => {
            setIsEnquiryOpen(false);
            setEnquiryBiz(null);
          }}
          businessId={enquiryBiz.id}
          businessName={enquiryBiz.name}
          initialMessage={enquiryBiz.message}
        />
      )}
    </div>
  );
};

export default Home;
