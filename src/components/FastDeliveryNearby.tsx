import React from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import { Zap, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';

export const FastDeliveryNearby: React.FC = () => {
  const {
    products,
    currentStore,
    deliveryTimeEstimate,
    setCurrentView,
    setSelectedCategory
  } = useApp();

  // Filter products that are in stock and marked fast delivery
  const fastDeliveryProducts = products
    .filter(p => p.stock > 0 && p.inStockNearby)
    .slice(0, 8);

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <Zap className="w-4 h-4 fill-emerald-500" />
            <span>Fast Delivery Section</span>
          </div>

          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Available Nearby for Immediate Dispatch
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            Fulfilled in ~{deliveryTimeEstimate} mins from <strong className="text-slate-800">{currentStore.name}</strong>
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCategory(null);
            setCurrentView('components');
          }}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-700 hover:text-amber-800 cursor-pointer group"
        >
          <span>View all {products.length} components</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Grid of Fast Delivery Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {fastDeliveryProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Mysore Express Commitment Banner */}
      <div className="mt-8 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-950">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold shrink-0">
            ⚡
          </div>
          <div>
            <p className="font-bold text-sm text-slate-900">Need components for your lab period or project demo?</p>
            <p className="text-slate-600">
              Orders placed before 10:30 PM are delivered in 15–30 mins to NIE, SJCE, VVCE, ATME, and all Mysuru residences.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full text-[11px]">
            ✓ Zero delivery fee above ₹499
          </span>
        </div>
      </div>
    </section>
  );
};
