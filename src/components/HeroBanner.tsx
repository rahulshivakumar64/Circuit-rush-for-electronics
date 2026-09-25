import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Zap,
  Search,
  ArrowRight,
  Package,
  Layers,
  Sparkles,
  ShieldAlert,
  Clock
} from 'lucide-react';

const QUICK_CATEGORIES = [
  { name: 'Arduino', slug: 'arduino', icon: '⚡' },
  { name: 'ESP32', slug: 'esp32', icon: '📶' },
  { name: 'Sensors', slug: 'sensors', icon: '📡' },
  { name: 'Motors', slug: 'motors', icon: '⚙️' },
  { name: 'Displays', slug: 'displays', icon: '🖥️' },
  { name: 'Robotics', slug: 'robotics', icon: '🤖' },
  { name: 'IoT', slug: 'iot', icon: '☁️' },
  { name: 'Project Kits', slug: 'project-kits', icon: '📦' },
];

export const HeroBanner: React.FC = () => {
  const {
    setCurrentView,
    searchQuery,
    setSearchQuery,
    setSelectedCategory,
    deliveryTimeEstimate,
    currentStore
  } = useApp();

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentView('components');
    }
  };

  const handleCategoryClick = (slug: string) => {
    if (slug === 'project-kits') {
      setCurrentView('kits');
    } else {
      setSelectedCategory(slug);
      setCurrentView('components');
    }
  };

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white pt-10 pb-14 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
      {/* Background Circuit Grid Texture */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top Ticker: Local Mysore Delivery */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-emerald-400">Mysuru Express Dispatch</span>
            <span className="text-slate-500">•</span>
            <span>{currentStore.name} active</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-amber-400/90 font-medium">
            <Clock className="w-3.5 h-3.5" />
            <span>Average delivery time: ~{deliveryTimeEstimate} mins to engineering colleges</span>
          </div>
        </div>

        {/* Hero Content */}
        <div className="max-w-3xl">
          <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white leading-[1.08]">
            Build it. Get it. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">Now.</span>
          </h1>
          
          <p className="mt-4 text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
            Electronics components and complete project kits delivered quickly to your doorstep, college lab, or hostel room in Mysuru.
          </p>

          {/* Large Hero Search Bar */}
          <form onSubmit={handleQuickSearch} className="mt-8 flex flex-col sm:flex-row gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search Arduino, ESP32, sensors, motors, breadboard..."
                className="w-full pl-12 pr-4 py-3.5 bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-900 placeholder-slate-400 border border-white/20 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 rounded-2xl text-sm font-medium transition-all outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-2xl transition-transform active:scale-95 shadow-lg shadow-amber-400/20 cursor-pointer flex items-center justify-center gap-2 shrink-0 font-heading"
            >
              <span>Search Parts</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setCurrentView('components');
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition-colors border border-slate-700 flex items-center gap-2 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Shop Components</span>
            </button>

            <button
              onClick={() => setCurrentView('kits')}
              className="px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-xs transition-colors border border-amber-500/40 flex items-center gap-2 cursor-pointer"
            >
              <Package className="w-4 h-4 text-amber-400" />
              <span>Explore Project Kits</span>
            </button>

            <button
              onClick={() => setCurrentView('build-my-project')}
              className="px-5 py-2.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-semibold text-xs transition-colors border border-sky-500/40 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>Build My Project (Interactive)</span>
            </button>
          </div>
        </div>

        {/* Quick Categories Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Quick Categories
            </h2>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Instant local stock in Mysuru
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {QUICK_CATEGORIES.map(cat => (
              <button
                key={cat.slug}
                onClick={() => handleCategoryClick(cat.slug)}
                className="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-400/50 transition-all text-left group cursor-pointer"
              >
                <div className="text-xl mb-1 group-hover:scale-110 transition-transform">
                  {cat.icon}
                </div>
                <p className="text-xs font-bold text-slate-200 group-hover:text-amber-400 truncate">
                  {cat.name}
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">Explore &rarr;</p>
              </button>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
