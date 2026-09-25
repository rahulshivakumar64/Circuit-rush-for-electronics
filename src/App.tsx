import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastContainer } from './components/ToastContainer';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { LocationSelectorModal } from './components/LocationSelectorModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { HeroBanner } from './components/HeroBanner';
import { FastDeliveryNearby } from './components/FastDeliveryNearby';
import { ComponentsCatalogView } from './components/ComponentsCatalogView';
import { ProjectKitsView } from './components/ProjectKitsView';
import { BuildMyProjectView } from './components/BuildMyProjectView';
import { WhatCanIBuildView } from './components/WhatCanIBuildView';
import { OrderTrackingView } from './components/OrderTrackingView';
import { AdminDashboard } from './components/AdminDashboard';
import { UserProfileModal } from './components/UserProfileModal';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import {
  Package,
  Sparkles,
  Wrench,
  Clock,
  ArrowRight,
  Star,
  CheckCircle2,
  ShieldCheck,
  Zap
} from 'lucide-react';

const HomeView: React.FC = () => {
  const { setCurrentView, projectKits, addMultipleToCart, products, deliveryTimeEstimate } = useApp();

  const handleQuickBuyKit = (kit: typeof projectKits[0]) => {
    const itemsToAdd = kit.components
      .map(c => {
        const prod = products.find(p => p.id === c.productId);
        if (!prod) return null;
        return { product: prod, quantity: c.quantity };
      })
      .filter((item): item is { product: typeof products[0]; quantity: number } => item !== null);

    addMultipleToCart(itemsToAdd);
  };

  return (
    <div>
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Fast Delivery Section: Components Available Nearby */}
      <FastDeliveryNearby />

      {/* 3. Featured Project Kits Carousel / Grid */}
      <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
              <Package className="w-4 h-4 text-amber-600" />
              <span>Tested & Calibrated Bundles</span>
            </div>
            <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Ready Project Kits for Students & Makers
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Every resistor, module, chassis, and wire needed for college lab submissions and hobby builds.
            </p>
          </div>

          <button
            onClick={() => setCurrentView('kits')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-700 hover:text-amber-800 cursor-pointer group"
          >
            <span>View All {projectKits.length} Project Kits</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectKits.slice(0, 3).map(kit => (
            <div
              key={kit.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-16/10 bg-slate-100 overflow-hidden">
                  <img
                    src={kit.image}
                    alt={kit.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-slate-950">
                    {kit.difficulty}
                  </div>
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-950/80 text-white">
                    ~{kit.estimatedBuildTime}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-heading font-bold text-base text-slate-900">
                    {kit.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {kit.description}
                  </p>
                  <p className="text-[11px] text-slate-600 font-medium pt-1">
                    Includes {kit.components.length} parts (ESP32 / Microcontroller, sensors & harnesses)
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-lg font-extrabold text-slate-900 font-heading">
                    ₹{kit.price}
                  </span>
                  <span className="text-xs text-slate-400 line-through ml-1.5">
                    ₹{kit.originalPrice}
                  </span>
                </div>

                <button
                  onClick={() => handleQuickBuyKit(kit)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Buy Kit
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Interactive Maker Tools Promo Banner: Build My Project & What Can I Build */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Build My Project */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-500/10 via-white to-slate-50 border border-sky-200/80 shadow-2xs flex flex-col justify-between space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                <span>Feature: Build My Project</span>
              </div>
              <h3 className="font-heading font-extrabold text-xl text-slate-900">
                “What do you want to build?”
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Choose a project like Smart Dustbin, IoT Plant Monitor, Line Following Robot, or Bluetooth Car. We calculate all required sensors, drivers, and boards and bundle them into your cart in one click.
              </p>
            </div>

            <button
              onClick={() => setCurrentView('build-my-project')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch Project Blueprint Builder</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: What Can I Build? */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-white to-slate-50 border border-emerald-200/80 shadow-2xs flex flex-col justify-between space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold mb-2">
                <Wrench className="w-3.5 h-3.5 text-emerald-600" />
                <span>Feature: What Can I Build?</span>
              </div>
              <h3 className="font-heading font-extrabold text-xl text-slate-900">
                Check Off Components You Already Own
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Got an ESP32 or Arduino gathering dust? Select what you have in your desk drawer, and our smart engine will calculate which projects you can build right now, or deliver the 1 or 2 missing parts in ~{deliveryTimeEstimate} mins!
              </p>
            </div>

            <button
              onClick={() => setCurrentView('what-can-i-build')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Match My Components</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </section>

      {/* 5. Mysuru Engineering College Student Reviews */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200">
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold mb-2">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Mysuru Engineering Community</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Trusted During Lab Hours & Hackathons
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Delivering in 15–30 minutes directly to college hostels and engineering campus gates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed italic">
              “Our team burned an ESP32 board at 9 PM right before the annual NIE project evaluation. CircuitRush delivered a fresh ESP32 DevKit to our hostel gate in 17 minutes flat. Absolute lifesaver.”
            </p>
            <div>
              <p className="font-bold text-xs text-slate-900">Aditya K.</p>
              <p className="text-[11px] text-slate-500">ECE 7th Sem, NIE Mysuru</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed italic">
              “The 'What Can I Build?' tool is pure genius. I had an ultrasonic sensor and an Arduino sitting around, and it told me I only needed a ₹119 servo to build the Smart Dustbin. Ordered and arrived in 20 mins.”
            </p>
            <div>
              <p className="font-bold text-xs text-slate-900">Sneha R.</p>
              <p className="text-[11px] text-slate-500">Robotics Club, SJCE / JSS STU</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-1 text-amber-400">
              {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-700 leading-relaxed italic">
              “All components come in anti-static ESD pouches with straight header pins. No bent pins or dead sensors like when ordering from distant e-commerce sites.”
            </p>
            <div>
              <p className="font-bold text-xs text-slate-900">Karthik M.</p>
              <p className="text-[11px] text-slate-500">IoT Lab Lead, VVCE Gokulam</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const MainContent: React.FC = () => {
  const { currentView } = useApp();

  switch (currentView) {
    case 'components':
      return <ComponentsCatalogView />;
    case 'kits':
      return <ProjectKitsView />;
    case 'build-my-project':
      return <BuildMyProjectView />;
    case 'what-can-i-build':
      return <WhatCanIBuildView />;
    case 'track':
      return <OrderTrackingView />;
    case 'admin':
      return <AdminDashboard />;
    case 'profile':
      return <UserProfileModal />;
    case 'home':
    default:
      return <HomeView />;
  }
};

const GlobalStatusFeedback: React.FC = () => {
  const { loadingMessage, errorMessage, setErrorMessage, refreshData } = useApp();

  return (
    <>
      {loadingMessage && (
        <div className="fixed bottom-20 md:bottom-4 left-4 z-50 flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-950/90 text-white shadow-lg backdrop-blur-md text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-150">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>{loadingMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="fixed top-14 left-0 right-0 z-50 flex items-center justify-center p-2.5 bg-rose-600 text-white text-xs font-semibold shadow-md gap-3">
          <span>{errorMessage}</span>
          <button
            onClick={() => refreshData()}
            className="underline font-bold hover:text-amber-200 cursor-pointer"
          >
            Retry
          </button>
          <button
            onClick={() => setErrorMessage(null)}
            className="p-1 hover:bg-rose-700 rounded-full cursor-pointer ml-2"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950 pb-16 md:pb-0">
        {/* Global Notifications */}
        <ToastContainer />

        {/* Global Modals */}
        <LocationSelectorModal />
        <ProductDetailModal />
        <CartDrawer />
        <CheckoutModal />
        <AuthModal />

        {/* Global Status Bar */}
        <GlobalStatusFeedback />

        {/* Sticky Header Navbar */}
        <Navbar />

        {/* Main Content View (Router) */}
        <main className="flex-1">
          <MainContent />
        </main>

        {/* Footer */}
        <Footer />

        {/* Mobile Sticky Bottom Nav Bar */}
        <MobileBottomNav />
      </div>
    </AppProvider>
  );
}
