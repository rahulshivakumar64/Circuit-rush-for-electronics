import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ProjectIdea } from '../types';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  Zap,
  ArrowRight,
  HelpCircle,
  Layers,
  Clock,
  Plus
} from 'lucide-react';

export const BuildMyProjectView: React.FC = () => {
  const {
    projectIdeas,
    products,
    addMultipleToCart,
    addToCart,
    deliveryTimeEstimate,
    currentStore
  } = useApp();

  const [selectedIdeaId, setSelectedIdeaId] = useState<string>(projectIdeas[0]?.id || 'idea-smart-dustbin');

  const selectedIdea = projectIdeas.find(i => i.id === selectedIdeaId) || projectIdeas[0];

  // Resolve required components
  const componentsList = (selectedIdea?.requiredComponentIds || []).map(id => {
    const prod = products.find(p => p.id === id);
    return {
      id,
      product: prod,
      isAvailable: prod ? prod.stock > 0 : false
    };
  });

  // Calculate total price of available items
  const totalPrice = componentsList.reduce((sum, item) => {
    return sum + (item.product ? item.product.price : 0);
  }, 0);

  const unavailableCount = componentsList.filter(item => !item.isAvailable).length;

  const handleBuyEverything = () => {
    const itemsToAdd = componentsList
      .filter(item => item.product && item.isAvailable)
      .map(item => ({ product: item.product!, quantity: 1 }));

    if (itemsToAdd.length > 0) {
      addMultipleToCart(itemsToAdd);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Page Title */}
      <div className="border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-800 text-xs font-bold mb-2">
          <Sparkles className="w-4 h-4 text-sky-500" />
          <span>Interactive Blueprint Builder</span>
        </div>
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
          Build My Project
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Select what you want to build. We calculate the exact bill of materials, verify inventory at your nearest Mysuru dark store, and bundle everything into your cart.
        </p>
      </div>

      {/* Main Builder Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Project Selector (What do you want to build?) */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-bold flex items-center justify-center">1</span>
            What do you want to build?
          </h2>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {projectIdeas.map(idea => {
              const isSelected = idea.id === selectedIdeaId;
              return (
                <button
                  key={idea.id}
                  onClick={() => setSelectedIdeaId(idea.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center gap-3.5 cursor-pointer ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50/50 shadow-xs ring-1 ring-sky-500/30'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80'
                  }`}
                  id={`select-project-${idea.id}`}
                >
                  <img
                    src={idea.image}
                    alt={idea.name}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-100 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-heading font-bold text-sm text-slate-900 truncate">
                        {idea.name}
                      </h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                        {idea.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {idea.description}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                      <span className="flex items-center gap-0.5">
                        <Clock className="w-3 h-3" /> {idea.estimatedBuildTime}
                      </span>
                      <span>•</span>
                      <span>{idea.requiredComponentIds.length} components</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Required Components Breakdown & 1-Click Buy */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-sky-600 uppercase tracking-wider">
                <span className="w-5 h-5 rounded-full bg-sky-500 text-white text-[11px] font-bold flex items-center justify-center">2</span>
                Required Components
              </div>
              <h3 className="text-xl font-bold font-heading text-slate-900 mt-1">
                {selectedIdea.name}
              </h3>
              <p className="text-xs text-slate-500">{selectedIdea.description}</p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 fill-emerald-500" />
                Delivery in ~{deliveryTimeEstimate} min
              </span>
            </div>
          </div>

          {/* Components Table / List */}
          <div className="space-y-2.5">
            {componentsList.map((item, index) => {
              const prod = item.product;
              if (!prod) return null;

              return (
                <div
                  key={prod.id || index}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    item.isAvailable
                      ? 'bg-slate-50/70 border-slate-200/80 hover:bg-slate-50'
                      : 'bg-rose-50/50 border-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-10 h-10 rounded-lg object-cover bg-white border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900 truncate">
                          {prod.name}
                        </span>
                        {prod.moduleCode && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 text-slate-700">
                            {prod.moduleCode}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-slate-700 font-bold">₹{prod.price}</span>
                        <span>•</span>
                        {item.isAvailable ? (
                          <span className="text-emerald-600 font-medium flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            In stock ({prod.stock} left)
                          </span>
                        ) : (
                          <span className="text-rose-600 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Out of stock (Suggest alternative: ESP8266 / Arduino Nano)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {item.isAvailable ? (
                      <button
                        onClick={() => addToCart(prod, 1)}
                        className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-400">Unavailable</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Unavailable Notice if any */}
          {unavailableCount > 0 && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold">{unavailableCount} item temporarily unavailable at {currentStore.name}</p>
                <p className="text-amber-800 mt-0.5">
                  You can still buy the remaining components and choose an alternative module from our catalog.
                </p>
              </div>
            </div>
          )}

          {/* Total & 1-Click Buy Everything Button */}
          <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-slate-400 block">
                Total Bill of Materials ({componentsList.length} Components):
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-extrabold text-white font-heading">
                  ₹{totalPrice}
                </span>
                <span className="text-xs text-amber-400 font-semibold">
                  ⚡ Hyperlocal delivery in ~{deliveryTimeEstimate} min
                </span>
              </div>
            </div>

            <button
              onClick={handleBuyEverything}
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-2 font-heading"
              id="buy-everything-btn"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Buy Everything — ₹{totalPrice}</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
