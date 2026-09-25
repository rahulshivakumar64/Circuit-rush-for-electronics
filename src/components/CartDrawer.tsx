import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Zap,
  Tag,
  ShieldCheck,
  Check
} from 'lucide-react';
import { CartItem } from '../types';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    deliveryFee,
    totalAmount,
    deliveryTimeEstimate,
    selectedArea,
    appliedPromo,
    applyPromoCode,
    removePromoCode,
    setIsCheckoutModalOpen,
    setCurrentView
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartDrawerOpen) return null;

  const freeDeliveryThreshold = 499;
  const amountToFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const freeDeliveryPercent = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const success = applyPromoCode(couponInput.trim());
    if (success) {
      setCouponInput('');
    } else {
      setCouponError('Invalid promo code. Try MYSURUFIRST or STUDENT50');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartDrawerOpen(false);
    setIsCheckoutModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              <h2 className="font-heading font-bold text-lg text-slate-900">
                Your Components Cart
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                {cart.reduce((a: number, b: CartItem) => a + b.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery ETA Alert */}
          <div className="px-4 py-2.5 bg-amber-500/10 border-b border-amber-200/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-800">
              <Zap className="w-4 h-4 text-amber-600 fill-amber-500 shrink-0" />
              <span>
                Delivery in <strong>~{deliveryTimeEstimate} mins</strong> to {selectedArea}
              </span>
            </div>
            <span className="text-[11px] font-bold text-emerald-700">⚡ Express</span>
          </div>

          {/* Free Delivery Bar */}
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 text-xs">
            {amountToFreeDelivery > 0 ? (
              <div>
                <p className="text-slate-600 mb-1">
                  Add <strong className="text-slate-900">₹{amountToFreeDelivery}</strong> more to qualify for <strong>FREE Delivery</strong>
                </p>
                <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-300"
                    style={{ width: `${freeDeliveryPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <Check className="w-4 h-4" />
                <span>You unlocked FREE Express Delivery for this order!</span>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length > 0 ? (
              cart.map((item: CartItem) => (
                <div
                  key={item.product.id}
                  className="p-3 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between gap-3"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-50 border border-slate-100 shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {item.product.name}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      ₹{item.product.price} each
                    </p>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5">
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-200 text-slate-700 cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-200 text-slate-700 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold text-slate-900 font-heading">
                      ₹{item.product.price * item.quantity}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-slate-400 hover:text-rose-500 p-1 cursor-pointer transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-base text-slate-800">
                  Your cart is empty
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Add components or ready project kits to get them delivered in ~{deliveryTimeEstimate} mins in Mysuru.
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setCurrentView('components');
                  }}
                  className="mt-4 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
                >
                  Explore Electronics Catalog
                </button>
              </div>
            )}
          </div>

          {/* Footer Bill & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
              {/* Promo code form */}
              {appliedPromo ? (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
                  <span className="font-bold flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    Promo {appliedPromo.code} applied (-₹{appliedPromo.discount})
                  </span>
                  <button
                    onClick={removePromoCode}
                    className="text-emerald-700 hover:text-rose-600 font-bold cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Coupon (e.g. MYSURUFIRST)"
                    className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 focus:border-amber-400 rounded-xl outline-none font-mono uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && (
                <p className="text-[11px] text-rose-600">{couponError}</p>
              )}

              {/* Bill Details */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">₹{cartSubtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Hyperlocal Delivery Fee</span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    <span className="font-semibold text-slate-900">₹{deliveryFee}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span>ESD Anti-Static Safe Packaging</span>
                  <span className="font-semibold text-slate-900">₹15</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount</span>
                    <span>-₹{appliedPromo.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>To Pay</span>
                  <span className="font-heading text-base font-extrabold text-slate-950">
                    ₹{totalAmount + 15}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-98 cursor-pointer flex items-center justify-between font-heading"
                id="cart-checkout-btn"
              >
                <span>PROCEED TO CHECKOUT</span>
                <div className="flex items-center gap-1">
                  <span>₹{totalAmount + 15}</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Components verified with multimeter check prior to dispatch</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
