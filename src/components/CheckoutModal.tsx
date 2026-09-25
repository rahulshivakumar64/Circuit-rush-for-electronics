import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  MapPin,
  CreditCard,
  QrCode,
  Banknote,
  Zap,
  CheckCircle2,
  Plus,
  ShieldCheck,
  Building,
  Phone
} from 'lucide-react';
import { Address, CartItem } from '../types';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    user,
    cart,
    totalAmount,
    deliveryTimeEstimate,
    currentStore,
    placeOrder,
    setCurrentView
  } = useApp();

  const userAddresses = user.addresses || user.savedAddresses || [];

  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    userAddresses[0]?.id || ''
  );
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('rahul@okaxis');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New address inline form state
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    tag: 'Hostel' as const,
    name: user.name,
    phone: user.phone,
    addressLine: '',
    area: 'Saraswathipuram',
    landmark: '',
    pincode: '570009'
  });

  if (!isCheckoutModalOpen) return null;

  const currentAddress = userAddresses.find(a => a.id === selectedAddressId) || userAddresses[0];

  const [orderError, setOrderError] = useState<string | null>(null);

  const handlePlaceOrder = async () => {
    if (!currentAddress) {
      setOrderError('Please select or specify a delivery address.');
      return;
    }
    setOrderError(null);
    setIsSubmitting(true);
    try {
      await placeOrder(
        currentAddress,
        paymentMethod,
        `Special ESD packaging for sensitive electronics. Contact before gate entry.`
      );
      setIsSubmitting(false);
      setIsCheckoutModalOpen(false);
      setCurrentView('track');
    } catch (err: any) {
      setIsSubmitting(false);
      setOrderError(err.message || 'Failed to place order due to stock constraints.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[95vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="font-heading font-bold text-lg text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500 fill-amber-500" />
              Express Checkout (Mysuru Local)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Packaged with anti-static bubble wrap and delivered in ~{deliveryTimeEstimate} mins
            </p>
          </div>
          <button
            onClick={() => setIsCheckoutModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {orderError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <X className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{orderError}</span>
            </div>
          )}
          
          {/* Section 1: Delivery Address */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-500" />
                Delivery Address in Mysuru
              </h3>
              <button
                onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingNewAddress ? 'Select Saved' : 'Add New Location'}</span>
              </button>
            </div>

            {!isAddingNewAddress ? (
              <div className="space-y-2">
                {userAddresses.map(addr => {
                  const isSelected = addr.id === selectedAddressId;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-3 rounded-xl border flex items-start justify-between cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/50 shadow-xs ring-1 ring-amber-500/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${
                            isSelected ? 'border-amber-500 bg-amber-500' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{addr.tag}</span>
                            <span className="text-slate-400">•</span>
                            <span className="text-xs text-slate-700 font-medium">{addr.name}</span>
                            <span className="text-[11px] text-slate-500">({addr.phone})</span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">
                            {addr.addressLine}, {addr.area}, Mysuru - {addr.pincode}
                          </p>
                          {addr.landmark && (
                            <p className="text-[11px] text-amber-800 mt-0.5 font-medium">
                              Landmark: {addr.landmark}
                            </p>
                          )}
                        </div>
                      </div>

                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md shrink-0">
                        ⚡ ~{deliveryTimeEstimate} min
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3 text-xs">
                <p className="font-bold text-slate-800">Add Hostel Room or Lab Address</p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Recipient Name"
                    value={newAddr.name}
                    onChange={e => setNewAddr({ ...newAddr, name: e.target.value })}
                    className="p-2 bg-white border border-slate-200 rounded-lg outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={newAddr.phone}
                    onChange={e => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="p-2 bg-white border border-slate-200 rounded-lg outline-none"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Hostel Block, Room / Lab No. / Building"
                  value={newAddr.addressLine}
                  onChange={e => setNewAddr({ ...newAddr, addressLine: e.target.value })}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Area / College (e.g. NIE, SJCE, VVCE)"
                    value={newAddr.area}
                    onChange={e => setNewAddr({ ...newAddr, area: e.target.value })}
                    className="p-2 bg-white border border-slate-200 rounded-lg outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Nearby Landmark"
                    value={newAddr.landmark}
                    onChange={e => setNewAddr({ ...newAddr, landmark: e.target.value })}
                    className="p-2 bg-white border border-slate-200 rounded-lg outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddingNewAddress(false)}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Save & Use Address
                </button>
              </div>
            )}
          </div>

          {/* Section 2: Payment Method */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-500" />
              Payment Method
            </h3>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  paymentMethod === 'upi'
                    ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <QrCode className="w-4 h-4 text-amber-600" />
                  <span>UPI Instant</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">GPay, PhonePe, Paytm</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  paymentMethod === 'card'
                    ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <CreditCard className="w-4 h-4 text-amber-600" />
                  <span>Cards</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Debit & Credit</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  paymentMethod === 'cod'
                    ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Banknote className="w-4 h-4 text-amber-600" />
                  <span>Cash on Deliv.</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Pay rider on arrival</p>
              </button>
            </div>

            {/* UPI details box */}
            {paymentMethod === 'upi' && (
              <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">UPI ID / VPA:</span>
                  <span className="text-[11px] font-bold text-emerald-600">Simulated 0% MDR</span>
                </div>
                <input
                  type="text"
                  value={upiId}
                  onChange={e => setUpiId(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-mono outline-none"
                  placeholder="e.g. yourname@oksbi"
                />
              </div>
            )}
          </div>

          {/* Section 3: Order Summary Preview */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between items-center font-bold text-slate-900">
              <span>Items in Order ({cart.length})</span>
              <span>Dispatched from {currentStore.name}</span>
            </div>
            <div className="max-h-24 overflow-y-auto space-y-1 text-slate-600">
              {cart.map((item: CartItem) => (
                <div key={item.product.id} className="flex justify-between">
                  <span className="truncate max-w-[240px]">
                    {item.quantity}x {item.product.name}
                  </span>
                  <span className="font-mono">₹{item.product.price * item.quantity}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
              <span>Total Payable</span>
              <span className="font-heading text-base font-extrabold text-amber-600">
                ₹{totalAmount + 15}
              </span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            <span>Estimated delivery time: </span>
            <strong className="text-slate-900">~{deliveryTimeEstimate} mins</strong>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-98 cursor-pointer flex items-center gap-2 font-heading"
            id="confirm-place-order-btn"
          >
            {isSubmitting ? (
              <span>Dispatching Order...</span>
            ) : (
              <span>Confirm & Place Order (₹{totalAmount + 15})</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
