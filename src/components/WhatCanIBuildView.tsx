import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Wrench,
  CheckCircle2,
  AlertCircle,
  Plus,
  ShoppingBag,
  Zap,
  Sparkles,
  ArrowRight,
  Filter,
  Check
} from 'lucide-react';

export const WhatCanIBuildView: React.FC = () => {
  const {
    products,
    projectIdeas,
    addMultipleToCart,
    deliveryTimeEstimate,
    currentStore
  } = useApp();

  // Selected owned component IDs
  const [ownedComponentIds, setOwnedComponentIds] = useState<string[]>([
    'prod-esp32-devkit',
    'prod-breadboard-mb102',
    'prod-jumper-wires-combo'
  ]);

  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  // Toggle owned component
  const toggleOwned = (id: string) => {
    setOwnedComponentIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllCommon = () => {
    setOwnedComponentIds([
      'prod-arduino-uno-r3',
      'prod-esp32-devkit',
      'prod-breadboard-mb102',
      'prod-jumper-wires-combo',
      'prod-ultrasonic-hcsr04',
      'prod-sg90-servo'
    ]);
  };

  const handleClearAll = () => {
    setOwnedComponentIds([]);
  };

  // Group products for selection
  const selectableComponents = products.filter(p => {
    if (categoryFilter === 'All') return true;
    return p.category.toLowerCase().includes(categoryFilter.toLowerCase());
  });

  // Calculate project readiness
  const analyzedProjects = projectIdeas.map(idea => {
    const required = idea.requiredComponentIds;
    const owned = required.filter(id => ownedComponentIds.includes(id));
    const missing = required.filter(id => !ownedComponentIds.includes(id));
    const matchPercent = Math.round((owned.length / required.length) * 100);

    const missingProducts = missing
      .map(id => products.find(p => p.id === id))
      .filter((p): p is typeof products[0] => Boolean(p));

    const missingCost = missingProducts.reduce((sum, p) => sum + p.price, 0);

    return {
      idea,
      matchPercent,
      ownedCount: owned.length,
      totalCount: required.length,
      owned,
      missing,
      missingProducts,
      missingCost,
      isFullyBuildable: missing.length === 0
    };
  }).sort((a, b) => b.matchPercent - a.matchPercent);

  // Buy missing parts for a project
  const handleBuyMissing = (missingProds: typeof products) => {
    const itemsToAdd = missingProds.map(p => ({ product: p, quantity: 1 }));
    addMultipleToCart(itemsToAdd);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-800 text-xs font-bold mb-2">
          <Wrench className="w-4 h-4 text-emerald-600" />
          <span>Smart Inventory Matcher</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
          What Can I Build?
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Check off the electronics components already sitting in your desk drawer or college locker. We'll show you what exciting projects you can build right now, or deliver the missing parts in ~{deliveryTimeEstimate} mins.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Section: Component Checklist (What do you own?) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Step 1: Check what you own
              </h2>
              <p className="text-xs text-slate-500">
                {ownedComponentIds.length} components selected
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={handleSelectAllCommon}
                className="text-amber-700 hover:text-amber-800 font-semibold cursor-pointer"
              >
                Preset
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={handleClearAll}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Quick Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
            {['All', 'Microcontrollers', 'Sensors', 'Motors', 'Wiring'].map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-lg shrink-0 transition-colors cursor-pointer ${
                  categoryFilter === cat
                    ? 'bg-slate-900 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Checklist Items */}
          <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
            {selectableComponents.map(product => {
              const isOwned = ownedComponentIds.includes(product.id);
              return (
                <div
                  key={product.id}
                  onClick={() => toggleOwned(product.id)}
                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    isOwned
                      ? 'border-emerald-500 bg-emerald-50/50 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                        isOwned ? 'bg-emerald-600 text-white' : 'border border-slate-300'
                      }`}
                    >
                      {isOwned && <Check className="w-3 h-3" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">
                        {product.moduleCode || product.category}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-mono text-slate-600 shrink-0">
                    ₹{product.price}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Section: Matches & Missing Parts Buy */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Step 2: Projects You Can Build
              </h2>
              <p className="text-xs text-slate-500">
                Sorted by highest component match with your inventory
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              {analyzedProjects.filter(p => p.isFullyBuildable).length} 100% Ready
            </span>
          </div>

          {/* List of project matches */}
          <div className="space-y-4">
            {analyzedProjects.map(item => {
              const {
                idea,
                matchPercent,
                ownedCount,
                totalCount,
                missingProducts,
                missingCost,
                isFullyBuildable
              } = item;

              return (
                <div
                  key={idea.id}
                  className={`bg-white rounded-2xl border transition-all p-5 space-y-4 ${
                    isFullyBuildable
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                      : 'border-slate-200 shadow-2xs hover:shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <img
                        src={idea.image}
                        alt={idea.name}
                        className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading font-bold text-base text-slate-900">
                            {idea.name}
                          </h3>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {idea.difficulty}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {idea.description}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Build time: ~{idea.estimatedBuildTime}
                        </p>
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1.5 justify-end">
                        <span className="text-xs font-bold text-slate-500">
                          {ownedCount}/{totalCount} components
                        </span>
                        <span
                          className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
                            isFullyBuildable
                              ? 'bg-emerald-100 text-emerald-800'
                              : matchPercent >= 60
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {matchPercent}% Match
                        </span>
                      </div>
                      {/* Progress Bar */}
                      <div className="w-28 h-1.5 rounded-full bg-slate-100 overflow-hidden mt-1.5 ml-auto">
                        <div
                          className={`h-full rounded-full ${
                            isFullyBuildable ? 'bg-emerald-500' : 'bg-amber-400'
                          }`}
                          style={{ width: `${matchPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Components Breakdown */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-600 block mb-1">
                        Status Breakdown:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {idea.requiredComponentIds.map(id => {
                          const prod = products.find(p => p.id === id);
                          const isOwned = ownedComponentIds.includes(id);
                          return (
                            <span
                              key={id}
                              className={`px-2 py-0.5 rounded-md text-[11px] flex items-center gap-1 font-medium ${
                                isOwned
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {isOwned ? (
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <AlertCircle className="w-3 h-3 text-rose-500" />
                              )}
                              <span>{prod?.name || id}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Action Row */}
                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {isFullyBuildable ? (
                      <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span>You have all components! Ready to assemble right now.</span>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-600">
                        Missing {missingProducts.length} component{missingProducts.length > 1 ? 's' : ''}:{' '}
                        <span className="font-bold text-slate-900 font-heading">
                          ₹{missingCost}
                        </span>
                        <span className="text-[11px] text-slate-400 ml-1">
                          (Delivery in ~{deliveryTimeEstimate} min)
                        </span>
                      </div>
                    )}

                    {!isFullyBuildable && missingProducts.length > 0 && (
                      <button
                        onClick={() => handleBuyMissing(missingProducts)}
                        className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 font-heading"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Buy Missing Parts — ₹{missingCost}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>

    </div>
  );
};
