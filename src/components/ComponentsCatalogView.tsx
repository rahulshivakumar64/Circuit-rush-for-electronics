import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';
import {
  Layers,
  Filter,
  Search,
  X,
  SlidersHorizontal,
  CheckCircle2,
  Zap,
  ArrowUpDown
} from 'lucide-react';

const CATEGORY_TABS = [
  { label: 'All Components', value: 'all' },
  { label: 'Microcontrollers', value: 'microcontrollers' },
  { label: 'Sensors', value: 'sensors' },
  { label: 'Motors & Actuators', value: 'motors' },
  { label: 'Displays', value: 'displays' },
  { label: 'Communication & Wireless', value: 'wireless' },
  { label: 'Power & Relays', value: 'power' },
  { label: 'Prototyping & Tools', value: 'tools' }
];

export const ComponentsCatalogView: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    deliveryTimeEstimate,
    currentStore
  } = useApp();

  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<string>('all');

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (selectedCategory && selectedCategory !== 'all') {
        const matchesCategory = product.category.toLowerCase().includes(selectedCategory.toLowerCase());
        if (!matchesCategory) return false;
      }

      // Search query filter (matches name, moduleCode, category, specs)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesCode = product.moduleCode?.toLowerCase().includes(q);
        const matchesCategory = product.category.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        if (!matchesName && !matchesCode && !matchesCategory && !matchesDesc) {
          return false;
        }
      }

      // In stock filter
      if (inStockOnly && product.stock <= 0) {
        return false;
      }

      // Board compatibility filter
      if (selectedBoard !== 'all') {
        const matchesBoard = product.compatibleBoards.some(b =>
          b.toLowerCase().includes(selectedBoard.toLowerCase())
        );
        if (!matchesBoard) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // featured / natural order
    });
  }, [products, selectedCategory, searchQuery, inStockOnly, selectedBoard, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSearchQuery('');
    setInStockOnly(false);
    setSelectedBoard('all');
    setSortBy('featured');
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header & Local Store Dispatch Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Electronics Components Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>
              Real-time inventory from <strong>{currentStore.name}</strong> • Guaranteed delivery in ~{deliveryTimeEstimate} mins
            </span>
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 outline-none focus:border-amber-400 cursor-pointer shadow-2xs"
          >
            <option value="featured">Featured / Fastest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Customer Rating</option>
          </select>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {CATEGORY_TABS.map(tab => {
          const isActive =
            (tab.value === 'all' && !selectedCategory) ||
            selectedCategory?.toLowerCase() === tab.value.toLowerCase();

          return (
            <button
              key={tab.value}
              onClick={() => setSelectedCategory(tab.value === 'all' ? null : tab.value)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Filter Options Bar (In Stock Toggle, Board Compatibility, Clear) */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* In Stock Only Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 select-none">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={e => setInStockOnly(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-slate-300"
            />
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              In-Stock Nearby Only
            </span>
          </label>

          <span className="text-slate-300">|</span>

          {/* Board Compatibility Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Board:</span>
            <select
              value={selectedBoard}
              onChange={e => setSelectedBoard(e.target.value)}
              className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-800 outline-none"
            >
              <option value="all">All Boards</option>
              <option value="Arduino">Arduino Compatible</option>
              <option value="ESP32">ESP32 / ESP8266</option>
              <option value="Raspberry Pi">Raspberry Pi Pico</option>
              <option value="STM32">STM32</option>
            </select>
          </div>
        </div>

        {/* Results Count & Clear Button */}
        <div className="flex items-center gap-3">
          <span className="text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredProducts.length}</strong> components
          </span>
          {(selectedCategory || searchQuery || inStockOnly || selectedBoard !== 'all') && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-16 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-base text-slate-800">
            No electronics components found
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or clearing your category filters to view all available modules in Mysuru.
          </p>
          <button
            onClick={clearAllFilters}
            className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
};
