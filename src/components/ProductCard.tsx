import React from 'react';
import { Product, CartItem } from '../types';
import { useApp } from '../context/AppContext';
import { Plus, Minus, Zap, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    cart,
    updateCartQuantity,
    setSelectedProduct,
    setIsQuickViewOpen,
    deliveryTimeEstimate
  } = useApp();

  const cartItem = cart.find((item: CartItem) => item.product.id === product.id);
  const quantity = cartItem?.quantity || 0;

  // Stock status logic
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= product.minStockLevel;

  const handleOpenDetail = () => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className="group relative bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
      id={`product-card-${product.id}`}
    >
      {/* Product Image & Badges */}
      <div
        onClick={handleOpenDetail}
        className="relative w-full aspect-4/3 bg-slate-50 overflow-hidden cursor-pointer flex items-center justify-center p-3"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 rounded-xl"
          loading="lazy"
        />

        {/* Delivery ETA Pill */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs border border-slate-200/60 shadow-xs text-[11px] font-bold text-slate-800">
          <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span>~{deliveryTimeEstimate} min</span>
        </div>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-extrabold">
            {discountPercent}% OFF
          </div>
        )}

        {/* Module code pill (e.g. HC-SR04) */}
        {product.moduleCode && (
          <div className="absolute bottom-2 left-2.5 px-1.5 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-[10px] font-mono text-white">
            {product.moduleCode}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium text-slate-500 text-[11px] truncate uppercase tracking-wider">
              {product.category}
            </span>
            <div className="flex items-center gap-0.5 text-amber-500 font-bold text-xs shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-[10px] text-slate-400">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3
            onClick={handleOpenDetail}
            className="font-heading font-semibold text-sm sm:text-base text-slate-900 line-clamp-2 hover:text-amber-600 transition-colors cursor-pointer leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Stock Status Tag */}
          <div className="mt-1.5 flex items-center gap-1.5 text-xs">
            {isOutOfStock ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600">
                <span>🔴</span>
                <span>Out of stock</span>
              </span>
            ) : isLowStock ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                <span>🟡</span>
                <span>Low stock ({product.stock} left)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                <span>🟢</span>
                <span>In stock</span>
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Add to Cart Controls */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-extrabold text-slate-900 font-heading">
                ₹{product.price}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-slate-400 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Add / Stepper Button */}
          <div className="shrink-0">
            {isOutOfStock ? (
              <button
                disabled
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-400 text-xs font-semibold cursor-not-allowed"
              >
                Sold Out
              </button>
            ) : quantity > 0 ? (
              <div className="flex items-center gap-1 bg-amber-400 text-slate-950 rounded-xl p-0.5 font-bold shadow-xs">
                <button
                  onClick={() => updateCartQuantity(product.id, quantity - 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-amber-300 transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center text-xs font-extrabold">{quantity}</span>
                <button
                  onClick={() => updateCartQuantity(product.id, quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-amber-300 transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(product, 1)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer flex items-center gap-1"
                id={`add-btn-${product.id}`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>ADD</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
