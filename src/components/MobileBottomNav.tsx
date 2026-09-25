import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Package, Sparkles, Wrench, ShoppingBag, Clock } from 'lucide-react';
import { CartItem } from '../types';

export const MobileBottomNav: React.FC = () => {
  const { currentView, setCurrentView, cart, setIsCartDrawerOpen } = useApp();
  const cartItemsCount = cart.reduce((acc: number, item: CartItem) => acc + item.quantity, 0);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 shadow-lg safe-bottom">
      <div className="grid grid-cols-5 items-center text-center">
        
        {/* Home */}
        <button
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            currentView === 'home' ? 'text-amber-600 font-bold' : 'text-slate-500'
          }`}
          id="mobile-nav-home"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        {/* Project Kits */}
        <button
          onClick={() => setCurrentView('kits')}
          className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            currentView === 'kits' ? 'text-amber-600 font-bold' : 'text-slate-500'
          }`}
          id="mobile-nav-kits"
        >
          <Package className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Kits</span>
        </button>

        {/* Build My Project */}
        <button
          onClick={() => setCurrentView('build-my-project')}
          className={`flex flex-col items-center justify-center py-1 transition-colors relative cursor-pointer ${
            currentView === 'build-my-project' ? 'text-amber-600 font-bold' : 'text-slate-500'
          }`}
          id="mobile-nav-build"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-sky-500" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-sky-500" />
          </div>
          <span className="text-[10px] mt-0.5">Build</span>
        </button>

        {/* Track */}
        <button
          onClick={() => setCurrentView('track')}
          className={`flex flex-col items-center justify-center py-1 transition-colors cursor-pointer ${
            currentView === 'track' ? 'text-amber-600 font-bold' : 'text-slate-500'
          }`}
          id="mobile-nav-track"
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Track</span>
        </button>

        {/* Cart */}
        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className="flex flex-col items-center justify-center py-1 text-slate-700 hover:text-slate-900 transition-colors relative cursor-pointer"
          id="mobile-nav-cart"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 text-slate-900" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-amber-400 text-slate-950 font-bold text-[9px] flex items-center justify-center">
                {cartItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 font-semibold text-slate-900">Cart</span>
        </button>

      </div>
    </div>
  );
};
