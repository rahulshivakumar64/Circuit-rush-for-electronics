import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, MapPin, Check, Search, Navigation, Building2 } from 'lucide-react';

const MYSURU_AREAS = [
  { name: 'Saraswathipuram', hub: 'Hub A (Saraswathipuram)', eta: '18 min', zone: 'College Hub', campuses: 'NIE Main Campus, Manasagangothri' },
  { name: 'NIE Campus / Manandavadi Rd', hub: 'Hub A (Saraswathipuram)', eta: '15 min', zone: 'Campus Zone', campuses: 'NIE Boys & Girls Hostels' },
  { name: 'SJCE / JSS Science & Tech University', hub: 'Hub C (Vidyaranyapuram)', eta: '18 min', zone: 'Campus Zone', campuses: 'SJCE Campus, ECE Labs' },
  { name: 'VVCE Campus / Gokulam', hub: 'Hub B (Hebbal Industrial)', eta: '20 min', zone: 'Campus Zone', campuses: 'Vidyavardhaka College of Engineering' },
  { name: 'Hebbal 1st & 2nd Stage', hub: 'Hub B (Hebbal Industrial)', eta: '16 min', zone: 'Industrial Area', campuses: 'Infosys / L&T Vicinity' },
  { name: 'Kuvempunagar', hub: 'Hub A (Saraswathipuram)', eta: '20 min', zone: 'Residential', campuses: 'Complex Circle, Apollo BGS' },
  { name: 'Jayalakshmipuram', hub: 'Hub B (Hebbal Industrial)', eta: '22 min', zone: 'Residential', campuses: 'Near Kalidasa Road' },
  { name: 'Vijayanagar 1st-4th Stage', hub: 'Hub B (Hebbal Industrial)', eta: '25 min', zone: 'Residential', campuses: 'Near Water Tank' },
  { name: 'Vidyaranyapuram & Chamundipuram', hub: 'Hub C (Vidyaranyapuram)', eta: '18 min', zone: 'Hub Central', campuses: 'Near Silk Factory' },
  { name: 'Bannimantap / Bamboo Bazar', hub: 'Hub B (Hebbal Industrial)', eta: '25 min', zone: 'Commercial', campuses: 'Near St. Philomena College' },
];

export const LocationSelectorModal: React.FC = () => {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    selectedArea,
    setSelectedArea,
    currentStore
  } = useApp();

  const [filterText, setFilterText] = useState('');
  const [customAddress, setCustomAddress] = useState('');

  if (!isLocationModalOpen) return null;

  const filteredAreas = MYSURU_AREAS.filter(
    a =>
      a.name.toLowerCase().includes(filterText.toLowerCase()) ||
      a.campuses.toLowerCase().includes(filterText.toLowerCase()) ||
      a.hub.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleSelect = (areaName: string) => {
    setSelectedArea(areaName);
    setIsLocationModalOpen(false);
  };

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (customAddress.trim()) {
      setSelectedArea(customAddress.trim());
      setIsLocationModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold font-heading text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-500" />
              Delivery Location in Mysuru
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select your college campus or neighborhood for instant 15–30 min delivery
            </p>
          </div>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Store Chip */}
        <div className="px-6 py-3 bg-amber-500/10 border-b border-amber-200/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-800">Assigned Hub:</span>
            <span className="text-amber-900 font-bold">{currentStore.name}</span>
          </div>
          <span className="font-bold text-emerald-700">🟢 Open & Packing</span>
        </div>

        {/* Search & Custom Input */}
        <div className="p-6 border-b border-slate-100 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filterText}
              onChange={e => setFilterText(e.target.value)}
              placeholder="Search area, college (NIE, SJCE, VVCE) or landmark..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 focus:bg-white border border-slate-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-xl text-sm outline-none transition-all"
            />
          </div>

          <form onSubmit={handleSaveCustom} className="flex gap-2">
            <input
              type="text"
              value={customAddress}
              onChange={e => setCustomAddress(e.target.value)}
              placeholder="Or enter custom hostel room / lab address..."
              className="flex-1 px-3.5 py-2 bg-white border border-slate-200 focus:border-amber-400 rounded-xl text-xs outline-none"
            />
            <button
              type="submit"
              disabled={!customAddress.trim()}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold cursor-pointer shrink-0"
            >
              Set Location
            </button>
          </form>
        </div>

        {/* List of Popular Delivery Zones & Engineering Colleges */}
        <div className="p-4 overflow-y-auto max-h-72 space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            Mysuru Engineering Hubs & Areas
          </p>

          <div className="space-y-1.5">
            {filteredAreas.map(item => {
              const isSelected = selectedArea.toLowerCase().includes(item.name.toLowerCase().split(' ')[0]);
              return (
                <button
                  key={item.name}
                  onClick={() => handleSelect(item.name)}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/50 shadow-xs ring-1 ring-amber-500/30'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg mt-0.5 ${isSelected ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900">{item.name}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                          {item.zone}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{item.campuses}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Fulfilled by: {item.hub}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      ⚡ ~{item.eta}
                    </span>
                    {isSelected && (
                      <div className="mt-1 flex items-center justify-end text-amber-600">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-amber-500" />
            Automatic dark store allocation based on distance
          </span>
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
