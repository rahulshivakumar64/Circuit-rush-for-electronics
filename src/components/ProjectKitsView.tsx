import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProjectKit } from '../types';
import {
  PackageCheck,
  Clock,
  Zap,
  Tag,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';

export const ProjectKitsView: React.FC = () => {
  const {
    projectKits,
    products,
    addMultipleToCart,
    deliveryTimeEstimate,
    currentStore,
    setCurrentView
  } = useApp();

  const [expandedKitId, setExpandedKitId] = useState<string | null>('kit-smart-dustbin');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');

  const handleBuyKit = (kit: ProjectKit) => {
    const itemsToAdd = kit.components
      .map(c => {
        const prod = products.find(p => p.id === c.productId);
        if (!prod) return null;
        return { product: prod, quantity: c.quantity };
      })
      .filter((item): item is { product: typeof products[0]; quantity: number } => item !== null);

    addMultipleToCart(itemsToAdd);
  };

  const filteredKits = projectKits.filter(kit => {
    if (filterDifficulty === 'All') return true;
    return kit.difficulty === filterDifficulty;
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-800 text-xs font-bold mb-2">
            <PackageCheck className="w-4 h-4 text-amber-600" />
            <span>Complete Engineering & School Project Kits</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Ready-to-Build Project Kits
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Everything you need in one box. Tested microcontrollers, calibrated sensors, jumper harnesses, and step-by-step schematics delivered in ~{deliveryTimeEstimate} mins in Mysuru.
          </p>
        </div>

        {/* Difficulty Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-semibold shrink-0">
          {['All', 'Beginner', 'Intermediate'].map(diff => (
            <button
              key={diff}
              onClick={() => setFilterDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                filterDifficulty === diff
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Kits Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredKits.map(kit => {
          const isExpanded = expandedKitId === kit.id;
          return (
            <div
              key={kit.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              id={`kit-card-${kit.id}`}
            >
              <div>
                {/* Kit Header Image & Badges */}
                <div className="relative aspect-16/9 bg-slate-100 overflow-hidden">
                  <img
                    src={kit.image}
                    alt={kit.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                  {/* Badges on Image */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold shadow-xs ${
                        kit.difficulty === 'Beginner'
                          ? 'bg-emerald-500 text-white'
                          : kit.difficulty === 'Intermediate'
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      {kit.difficulty}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-xs text-white text-xs font-semibold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      Build time: ~{kit.estimatedBuildTime}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-rose-500 text-white text-xs font-black shadow-xs flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    <span>Save ₹{kit.savings} vs individual parts</span>
                  </div>

                  {/* Title & Tagline on Image */}
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-white">
                      {kit.name}
                    </h2>
                    <p className="text-xs text-slate-200 mt-0.5 line-clamp-1">
                      {kit.tagline}
                    </p>
                  </div>
                </div>

                {/* Kit Info & Components Breakdown */}
                <div className="p-5 space-y-4">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {kit.description}
                  </p>

                  {/* Included Components List */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Components Included ({kit.components.length} Items):
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {kit.components.map((comp, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/70 text-xs"
                        >
                          <span className="flex items-center gap-1.5 font-medium text-slate-800 truncate">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span className="truncate">{comp.productName}</span>
                          </span>
                          <span className="text-slate-500 font-mono text-[11px] shrink-0">
                            x{comp.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Skills Learned Pill List */}
                  {kit.skillsLearned && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
                        <Award className="w-3 h-3 text-amber-500" />
                        Skills:
                      </span>
                      {kit.skillsLearned.map(skill => (
                        <span
                          key={skill}
                          className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Accordion for Guide Steps */}
                  <div>
                    <button
                      onClick={() => setExpandedKitId(isExpanded ? null : kit.id)}
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{isExpanded ? 'Hide Build Guide & Wiring' : 'View Quick Build Guide'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 animate-in fade-in duration-150">
                        {kit.guideSteps.map((step, sIdx) => (
                          <div key={sIdx} className="flex items-start gap-2 text-slate-700">
                            <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                              {sIdx + 1}
                            </span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Kit Footer / Pricing & CTA */}
              <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-slate-900 font-heading">
                      ₹{kit.price}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      ₹{kit.originalPrice}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      Save ₹{kit.savings}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                    ⚡ Delivery in ~{deliveryTimeEstimate} min from {currentStore.area}
                  </span>
                </div>

                <button
                  onClick={() => handleBuyKit(kit)}
                  className="px-6 py-3 rounded-xl bg-slate-950 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2 font-heading"
                  id={`buy-kit-btn-${kit.id}`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>BUY PROJECT KIT</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
