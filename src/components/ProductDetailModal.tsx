import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CartItem } from '../types';
import {
  X,
  Zap,
  Star,
  Plus,
  Minus,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  ShoppingBag,
  Check,
  MessageSquare
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    isQuickViewOpen,
    setIsQuickViewOpen,
    products,
    addToCart,
    cart,
    updateCartQuantity,
    deliveryTimeEstimate,
    currentStore,
    reviews,
    addReview,
    addMultipleToCart,
    user
  } = useApp();

  const [activeTab, setActiveTab] = useState<'specs' | 'pinout' | 'reviews'>('specs');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [selectedBundleIds, setSelectedBundleIds] = useState<string[]>([]);

  if (!isQuickViewOpen || !selectedProduct) return null;

  const cartItem = cart.find((item: CartItem) => item.product.id === selectedProduct.id);
  const quantity = cartItem?.quantity || 0;
  const isOutOfStock = selectedProduct.stock <= 0;

  // Frequently bought together items
  const bundleProducts = (selectedProduct.frequentlyBoughtTogetherIds || [])
    .map(id => products.find(p => p.id === id))
    .filter((p): p is typeof products[0] => Boolean(p));

  // Initialize selected bundle items on mount or when product changes
  React.useEffect(() => {
    setSelectedBundleIds(bundleProducts.map(p => p.id));
  }, [selectedProduct.id]);

  const toggleBundleItem = (id: string) => {
    setSelectedBundleIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const bundleTotal =
    selectedProduct.price +
    bundleProducts
      .filter(p => selectedBundleIds.includes(p.id))
      .reduce((sum, p) => sum + p.price, 0);

  const handleAddBundleToCart = () => {
    const itemsToAdd = [
      { product: selectedProduct, quantity: 1 },
      ...bundleProducts
        .filter(p => selectedBundleIds.includes(p.id))
        .map(p => ({ product: p, quantity: 1 }))
    ];
    addMultipleToCart(itemsToAdd);
  };

  const productReviews = reviews.filter(r => r.productId === selectedProduct.id);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addReview({
      productId: selectedProduct.id,
      userName: user.name,
      userRole: `ECE Student, ${user.institution.split('(')[1]?.replace(')', '') || 'NIE Mysuru'}`,
      rating: newRating,
      comment: newComment.trim(),
      verifiedBuyer: true
    });
    setNewComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
              SKU: {selectedProduct.sku}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
              {selectedProduct.category}
            </span>
          </div>
          <button
            onClick={() => setIsQuickViewOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-8 flex-1">
          
          {/* Main Product Hero Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Image Preview */}
            <div className="md:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center relative">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full max-h-64 object-contain rounded-xl"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 text-xs font-bold border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Available Nearby
              </div>
            </div>

            {/* Product Meta & Actions */}
            <div className="md:col-span-7 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="font-bold text-amber-500 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    {selectedProduct.rating}
                  </span>
                  <span>({selectedProduct.reviewsCount} customer reviews)</span>
                  <span>•</span>
                  <span className="font-mono text-slate-600">{selectedProduct.moduleCode}</span>
                </div>

                <h1 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 leading-tight">
                  {selectedProduct.name}
                </h1>

                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Price & Delivery Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                      ₹{selectedProduct.price}
                    </span>
                    {selectedProduct.originalPrice && (
                      <span className="text-sm text-slate-400 line-through">
                        ₹{selectedProduct.originalPrice}
                      </span>
                    )}
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Inclusive of GST
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-900 block flex items-center gap-1 text-emerald-600">
                      <Zap className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                      Delivery in ~{deliveryTimeEstimate} min
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Dispatched from {currentStore.area}
                    </span>
                  </div>
                </div>

                {/* Stock status indicator */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                  <span className="font-medium text-slate-600">Inventory Status:</span>
                  {isOutOfStock ? (
                    <span className="font-bold text-rose-600 flex items-center gap-1">
                      🔴 Out of stock
                    </span>
                  ) : selectedProduct.stock <= (selectedProduct.minStockLevel || 5) ? (
                    <span className="font-bold text-amber-600 flex items-center gap-1">
                      🟡 Low stock ({selectedProduct.stock} left in {currentStore.area})
                    </span>
                  ) : (
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      🟢 In stock ({selectedProduct.stock} units available)
                    </span>
                  )}
                </div>
              </div>

              {/* Add to Cart Actions */}
              <div className="flex items-center gap-3 pt-1">
                {isOutOfStock ? (
                  <button
                    disabled
                    className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-400 font-bold text-sm cursor-not-allowed text-center"
                  >
                    Currently Out of Stock
                  </button>
                ) : quantity > 0 ? (
                  <div className="flex items-center gap-4 bg-slate-100 rounded-xl p-1.5 border border-slate-200">
                    <div className="flex items-center gap-2 bg-amber-400 text-slate-950 rounded-lg p-1 font-bold">
                      <button
                        onClick={() => updateCartQuantity(selectedProduct.id, quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-amber-300 transition-colors cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-extrabold">{quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(selectedProduct.id, quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center rounded hover:bg-amber-300 transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-xs font-semibold text-slate-700 pr-3">
                      Added in your quick cart
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => addToCart(selectedProduct, 1)}
                    className="flex-1 py-3 px-6 rounded-xl bg-slate-950 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-sm transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>ADD TO CART (₹{selectedProduct.price})</span>
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Tab Navigation: Specs, Pinout, Reviews */}
          <div className="border-b border-slate-200 flex gap-6">
            <button
              onClick={() => setActiveTab('specs')}
              className={`pb-3 text-sm font-bold transition-colors cursor-pointer relative ${
                activeTab === 'specs'
                  ? 'text-amber-600 border-b-2 border-amber-500'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Technical Specifications
            </button>
            <button
              onClick={() => setActiveTab('pinout')}
              className={`pb-3 text-sm font-bold transition-colors cursor-pointer relative ${
                activeTab === 'pinout'
                  ? 'text-amber-600 border-b-2 border-amber-500'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Pinout & Board Compatibility
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-sm font-bold transition-colors cursor-pointer relative ${
                activeTab === 'reviews'
                  ? 'text-amber-600 border-b-2 border-amber-500'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Customer Reviews ({productReviews.length})
            </button>
          </div>

          {/* Tab Contents */}
          {activeTab === 'specs' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(selectedProduct.specifications).map(([key, val]) => (
                  <div
                    key={key}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-slate-500">{key}</span>
                    <span className="font-bold text-slate-800 text-right">{val}</span>
                  </div>
                ))}
              </div>

              {selectedProduct.recommendedProjects && selectedProduct.recommendedProjects.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Recommended Student & DIY Projects
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.recommendedProjects.map(proj => (
                      <span
                        key={proj}
                        className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 text-xs font-medium text-slate-800 shadow-2xs"
                      >
                        {proj}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'pinout' && (
            <div className="space-y-4">
              {/* Pin Information */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Pin Configuration & Functional Mapping
                </h4>
                {selectedProduct.pinInfo && selectedProduct.pinInfo.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedProduct.pinInfo.map((pin, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-900 text-slate-100 font-mono text-xs flex items-center gap-2 border border-slate-800"
                      >
                        <Cpu className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{pin}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    Standard 2-terminal / through-hole component leads.
                  </p>
                )}
              </div>

              {/* Compatible Boards */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Supported Microcontrollers & Toolchains
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.compatibleBoards.map(board => (
                    <span
                      key={board}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      {board}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Existing Reviews */}
              <div className="space-y-3">
                {productReviews.length > 0 ? (
                  productReviews.map(rev => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{rev.userName}</span>
                          <span className="text-[11px] text-slate-500">({rev.userRole})</span>
                          {rev.verifiedBuyer && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                              Verified Mysuru Buyer
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-0.5 text-amber-500">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
                      <span className="text-[10px] text-slate-400 block">{rev.date}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic p-4 text-center">
                    No reviews for this module yet. Be the first engineering student to review it!
                  </p>
                )}
              </div>

              {/* Add Review Form */}
              <form
                onSubmit={handleReviewSubmit}
                className="p-4 rounded-xl bg-white border border-slate-200 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-amber-500" />
                    Write a Review (as {user.name})
                  </h4>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="cursor-pointer"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Share your testing experience, circuit notes, pin voltage tips..."
                  className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 focus:border-amber-400 rounded-lg outline-none resize-none h-20"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Post Review
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Frequently Bought Together Section */}
          {bundleProducts.length > 0 && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/60 to-slate-50 border border-amber-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-600" />
                    Frequently Bought Together
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Common companion parts requested together by Mysore students
                  </p>
                </div>
              </div>

              {/* Items List with Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {bundleProducts.map(bp => {
                  const isChecked = selectedBundleIds.includes(bp.id);
                  return (
                    <div
                      key={bp.id}
                      onClick={() => toggleBundleItem(bp.id)}
                      className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                        isChecked
                          ? 'border-amber-500 bg-white shadow-xs ring-1 ring-amber-500/20'
                          : 'border-slate-200 bg-white/60 opacity-60'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                          isChecked ? 'bg-amber-500 text-white' : 'border border-slate-300'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3" />}
                      </div>

                      <img
                        src={bp.image}
                        alt={bp.name}
                        className="w-10 h-10 object-cover rounded-lg bg-slate-100 shrink-0"
                      />

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-800 truncate">{bp.name}</p>
                        <p className="text-xs font-bold text-slate-900 mt-0.5">₹{bp.price}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bundle Action */}
              <div className="pt-2 border-t border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-600">
                  Total for this item + {selectedBundleIds.length} companion parts:{' '}
                  <span className="font-bold text-base text-slate-950 font-heading">
                    ₹{bundleTotal}
                  </span>
                </div>

                <button
                  onClick={handleAddBundleToCart}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add Bundle to Cart (₹{bundleTotal})</span>
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
