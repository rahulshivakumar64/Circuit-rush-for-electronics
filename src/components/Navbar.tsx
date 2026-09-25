import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Zap,
  MapPin,
  Search,
  ShoppingCart,
  ShieldCheck,
  User,
  ChevronDown,
  Layers,
  Sparkles,
  Wrench,
  Package,
  RotateCcw,
  X
} from 'lucide-react';
import { CartItem } from '../types';

const SEARCH_SUGGESTIONS = [
  { label: 'ESP32 DevKit', query: 'ESP32' },
  { label: 'HC-SR04 Ultrasonic', query: 'ultrasonic' },
  { label: 'Arduino UNO', query: 'Arduino' },
  { label: 'SG90 Servo Motor', query: 'servo' },
  { label: 'L298N Motor Driver', query: 'motor driver' },
  { label: '12V / 5V Relay', query: '12v relay' },
  { label: 'OLED 0.96"', query: 'OLED' },
  { label: 'Jumper Wires', query: 'jumper wires' },
  { label: 'Breadboard MB-102', query: 'breadboard' },
];

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    selectedArea,
    deliveryTimeEstimate,
    setIsLocationModalOpen,
    searchQuery,
    setSearchQuery,
    cart,
    cartSubtotal,
    setIsCartDrawerOpen,
    user,
    toggleUserRole,
    setSelectedCategory
  } = useApp();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const cartItemsCount = cart.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);

  // Close search suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (q: string) => {
    setSearchQuery(q);
    setIsSearchFocused(false);
    if (currentView !== 'components' && currentView !== 'home') {
      setCurrentView('components');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Top Banner: Local Hub Status in Mysuru */}
      <div className="bg-slate-900 text-slate-100 text-xs py-1 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
              Mysuru Local
            </span>
            <span className="hidden sm:inline text-slate-300">
              ⚡ Ultra-fast 15–30 min delivery to NIE, SJCE, VVCE, ATME & citywide
            </span>
            <span className="sm:hidden text-slate-300">
              ⚡ 15–30 min delivery in Mysuru
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={toggleUserRole}
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors text-xs font-medium cursor-pointer"
              id="nav-role-toggle-btn"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Role: <strong className="text-white capitalize">{user.role}</strong> (Switch)</span>
            </button>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-300">Hubs: Saraswathipuram • Hebbal • Vidyaranyapuram</span>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => {
                setCurrentView('home');
                setSelectedCategory(null);
                setSearchQuery('');
              }}
              className="flex items-center gap-2 text-left group cursor-pointer"
              id="brand-logo-btn"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Zap className="w-6 h-6 text-slate-950 fill-slate-950" />
              </div>
              <div>
                <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900 block leading-tight">
                  Circuit<span className="text-amber-500">Rush</span>
                </span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider block -mt-0.5">
                  Build it. Get it. Now.
                </span>
              </div>
            </button>

            {/* Hyperlocal Location Selector Widget */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="hidden lg:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 transition-colors text-left group cursor-pointer"
              id="navbar-location-btn"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="max-w-[160px]">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    ~{deliveryTimeEstimate} mins
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-800 truncate flex items-center gap-0.5">
                  <span>{selectedArea}, Mysuru</span>
                  <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-slate-600 transition-transform" />
                </div>
              </div>
            </button>
          </div>

          {/* Search Input with Auto-Suggestions */}
          <div className="flex-1 max-w-xl relative" ref={searchRef}>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search Arduino, ESP32, sensors, motors, HC-SR04..."
                className="w-full pl-10 pr-9 py-2.5 bg-slate-100/90 focus:bg-white border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-xl text-sm text-slate-900 placeholder-slate-400 transition-all outline-none font-medium"
                id="main-search-input"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick search popup suggestions */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">
                  Popular Electronics Searches
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SEARCH_SUGGESTIONS.map(s => (
                    <button
                      key={s.label}
                      onMouseDown={() => handleSelectSuggestion(s.query)}
                      className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 transition-colors cursor-pointer"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-1">
                  <span>Supports module codes: <code className="text-slate-700">HC-05</code>, <code className="text-slate-700">L298N</code>, <code className="text-slate-700">SSD1306</code></span>
                  <span className="text-[11px] text-amber-600 font-medium">⚡ In-stock priority</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons & Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* User Profile / Admin Toggle */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200/60 cursor-pointer"
                id="user-profile-menu-btn"
              >
                <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">
                  {user.role === 'admin' ? '⚙️' : user.name.charAt(0)}
                </div>
                <div className="hidden md:block text-left text-xs">
                  <span className="font-semibold text-slate-800 block truncate max-w-[100px]">{user.name.split(' ')[0]}</span>
                  <span className="text-[10px] text-slate-500 capitalize">{user.role}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50">
                  <div className="p-3 border-b border-slate-100">
                    <p className="font-semibold text-sm text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                      NIE Mysuru Campus Account
                    </div>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setCurrentView('profile');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      My Profile & Addresses
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView('track');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4 text-slate-400" />
                      Order Tracking
                    </button>
                    <button
                      onClick={() => {
                        setCurrentView('admin');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg flex items-center gap-2 cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-500" />
                      Admin Dashboard
                    </button>
                  </div>
                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        toggleUserRole();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50 rounded-lg cursor-pointer"
                    >
                      Switch to {user.role === 'customer' ? 'Admin Mode' : 'Customer Mode'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 text-white font-medium shadow-md shadow-slate-950/20 transition-transform active:scale-95 cursor-pointer"
              id="navbar-cart-btn"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-[10px] text-slate-300 font-semibold leading-tight">My Cart</span>
                <span className="text-xs font-bold text-amber-400 leading-tight">
                  ₹{cartSubtotal}
                </span>
              </div>
            </button>
          </div>

        </div>

        {/* Secondary Navigation Row: Quick links */}
        <div className="hidden md:flex items-center justify-between py-2 border-t border-slate-100 text-xs font-medium">
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => {
                setCurrentView('components');
                setSelectedCategory(null);
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentView === 'components' && !searchQuery
                  ? 'bg-amber-500/10 text-amber-800 font-bold border border-amber-500/30'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              id="nav-components-btn"
            >
              <Layers className="w-3.5 h-3.5" />
              Shop Components
            </button>

            <button
              onClick={() => setCurrentView('kits')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentView === 'kits'
                  ? 'bg-amber-500/10 text-amber-800 font-bold border border-amber-500/30'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              id="nav-kits-btn"
            >
              <Package className="w-3.5 h-3.5" />
              Project Kits
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-400 text-slate-900">
                8 Ready Kits
              </span>
            </button>

            <button
              onClick={() => setCurrentView('build-my-project')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentView === 'build-my-project'
                  ? 'bg-sky-500/10 text-sky-800 font-bold border border-sky-500/30'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              id="nav-build-my-project-btn"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              Build My Project
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-sky-100 text-sky-700">
                Select & Buy All
              </span>
            </button>

            <button
              onClick={() => setCurrentView('what-can-i-build')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentView === 'what-can-i-build'
                  ? 'bg-emerald-500/10 text-emerald-800 font-bold border border-emerald-500/30'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              id="nav-what-can-i-build-btn"
            >
              <Wrench className="w-3.5 h-3.5 text-emerald-500" />
              What Can I Build?
              <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                Component Matcher
              </span>
            </button>

            <button
              onClick={() => setCurrentView('track')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                currentView === 'track'
                  ? 'bg-amber-500/10 text-amber-800 font-bold border border-amber-500/30'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              id="nav-track-btn"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Live Order Tracker
            </button>
          </nav>

          <div className="flex items-center gap-3 text-slate-500 text-xs">
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              All 3 Mysuru Dark Stores Active
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
