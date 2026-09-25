import React from 'react';
import { useApp } from '../context/AppContext';
import { Zap, MapPin, ShieldCheck, Heart, Cpu, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, setSelectedCategory, toggleUserRole } = useApp();

  return (
    <footer className="bg-slate-950 text-white border-t border-slate-800 text-xs mt-16">
      {/* Top Banner: Campus Delivery Trust */}
      <div className="border-b border-slate-800 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-100">15–30 Min Hyperlocal Delivery</p>
              <p className="text-slate-400 text-[11px]">Direct to hostels, engineering labs, and residences across Mysuru.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-100">Tested & ESD Safe</p>
              <p className="text-slate-400 text-[11px]">Every module is multimeter-tested with pin headers intact.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-100">Student & Maker Friendly</p>
              <p className="text-slate-400 text-[11px]">Single-resistor or full project kit, no minimum order required.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center">
                <Zap className="w-5 h-5 text-slate-950 fill-slate-950" />
              </div>
              <span className="font-heading font-black text-lg tracking-tight text-white">
                Circuit<span className="text-amber-400">Rush</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Hyperlocal electronics quick-commerce for makers, engineering students, and IoT developers in Mysuru, Karnataka.
            </p>
            <p className="font-mono text-[11px] text-amber-400">
              “Build it. Get it. Now.”
            </p>
          </div>

          {/* Catalog Links */}
          <div className="space-y-2">
            <p className="font-heading font-bold text-sm text-slate-200">Catalog</p>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('Microcontrollers');
                    setCurrentView('components');
                  }}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Microcontrollers (ESP32, Arduino)
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('Sensors');
                    setCurrentView('components');
                  }}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Sensors & Detectors
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('Motors & Actuators');
                    setCurrentView('components');
                  }}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Motors & Servo Drivers
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('kits')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  Complete Ready Project Kits
                </button>
              </li>
            </ul>
          </div>

          {/* Smart Maker Tools */}
          <div className="space-y-2">
            <p className="font-heading font-bold text-sm text-slate-200">Smart Tools</p>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <button
                  onClick={() => setCurrentView('build-my-project')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Build My Project (Interactive BOM)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('what-can-i-build')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  What Can I Build? (Component Matcher)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('track')}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Live Order Tracker
                </button>
              </li>
              <li>
                <button
                  onClick={toggleUserRole}
                  className="hover:text-amber-400 transition-colors cursor-pointer text-left"
                >
                  Dark Store Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Mysuru Delivery Hubs */}
          <div className="space-y-2">
            <p className="font-heading font-bold text-sm text-slate-200 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Mysuru Dark Stores
            </p>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              • Hub A: Saraswathipuram (covers NIE, Manasagangothri, Kuvempunagar)
              <br />
              • Hub B: Hebbal Industrial (covers VVCE, Gokulam, Vijayanagar)
              <br />
              • Hub C: Vidyaranyapuram (covers SJCE / JSS STU, Chamundipuram)
            </p>
            <p className="text-emerald-400 text-[11px] font-semibold pt-1">
              🟢 Delivering 7 days a week • 8:00 AM – 11:00 PM
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px] gap-2">
          <p>© {new Date().getFullYear()} CircuitRush Quick-Commerce Technologies. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for engineering students & makers in Mysuru with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
