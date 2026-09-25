import React from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  Phone,
  RotateCcw,
  Zap,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { OrderStatus } from '../types';

const STATUS_STEPS = [
  {
    key: 'placed',
    label: 'Order Placed',
    desc: 'Order received and logged in the Mysuru fulfillment network'
  },
  {
    key: 'confirmed',
    label: 'Store Confirmed',
    desc: 'Technician checked module inventory and component health'
  },
  {
    key: 'packing',
    label: 'Items Being Packed',
    desc: 'Protected with ESD anti-static pouches and sealed'
  },
  {
    key: 'out_for_delivery',
    label: 'Out for Delivery',
    desc: 'Rider is on the way to your college campus / address'
  },
  {
    key: 'delivered',
    label: 'Delivered',
    desc: 'Handed over securely to the recipient'
  }
];

const getStepIndex = (statusStr?: string) => {
  if (!statusStr) return 0;
  const s = statusStr.toLowerCase().replace(/_/g, '');
  if (s.includes('deliver') && !s.includes('out')) return 4;
  if (s.includes('out') || s.includes('route')) return 3;
  if (s.includes('pack')) return 2;
  if (s.includes('confirm')) return 1;
  return 0; // Placed
};

export const OrderTrackingView: React.FC = () => {
  const {
    orders,
    currentTrackingOrderId,
    advanceOrderSimulation,
    setCurrentView
  } = useApp();

  const activeOrder =
    orders.find(o => o.id === currentTrackingOrderId) || orders[0];

  if (!activeOrder) {
    return (
      <div className="py-16 px-4 text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-heading font-bold text-xl text-slate-900">
          No Active Orders
        </h2>
        <p className="text-xs text-slate-500">
          Order components or kits to track your 15–30 minute delivery in real time across Mysuru.
        </p>
        <button
          onClick={() => setCurrentView('components')}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
        >
          Browse Components
        </button>
      </div>
    );
  }

  const currentStatus = activeOrder.orderStatus || activeOrder.status || 'Placed';
  const currentStepIndex = getStepIndex(currentStatus);
  const isDelivered = currentStepIndex >= 4;
  const etaMinutes = activeOrder.estimatedDeliveryMin || activeOrder.estimatedDeliveryMins || 15;
  const rider = activeOrder.riderInfo || activeOrder.deliveryPartner;
  const address = activeOrder.deliveryAddress || activeOrder.shippingAddress;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      
      {/* Header with Fast-Forward Simulator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-900 text-amber-400">
              {activeOrder.id}
            </span>
            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Live Order
            </span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight mt-1">
            Order Status & Live Tracking
          </h1>
        </div>

        {/* Demo Fast Forward Button */}
        <div className="flex items-center gap-2">
          {!isDelivered && (
            <button
              onClick={() => advanceOrderSimulation(activeOrder.id)}
              className="px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              title="Simulate moving to next fulfillment stage"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Simulate Next Stage &rarr;</span>
            </button>
          )}
        </div>
      </div>

      {/* Live Status Hero Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        
        {/* Delivery ETA Countdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Estimated Delivery Window</p>
              <p className="font-heading font-bold text-lg text-white">
                {isDelivered
                  ? 'Delivered Successfully!'
                  : `Arriving in ~${etaMinutes} Minutes`}
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-slate-400">
            <p>Dispatched from: <strong className="text-white">{activeOrder.storeName}</strong></p>
            <p className="mt-0.5">Destination: {address?.area || 'Mysuru'}, Mysuru</p>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="space-y-6 pt-2">
          {STATUS_STEPS.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <div key={step.key} className="flex items-start gap-4 relative group">
                {/* Vertical connecting line */}
                {index < STATUS_STEPS.length - 1 && (
                  <div
                    className={`absolute left-4 top-8 -bottom-6 w-0.5 ${
                      index < currentStepIndex ? 'bg-amber-500' : 'bg-slate-200'
                    }`}
                  />
                )}

                {/* Node icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-colors ${
                    isCompleted
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  } ${isCurrent ? 'ring-4 ring-amber-100 animate-pulse' : ''}`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-semibold">{index + 1}</span>
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 pb-2">
                  <div className="flex items-center justify-between">
                    <h2
                      className={`text-sm font-bold ${
                        isCompleted ? 'text-slate-900' : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </h2>
                    {isCurrent && (
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        In Progress
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Delivery Partner Details Card */}
        {rider && (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm">
                🚴
              </div>
              <div>
                <p className="font-bold text-slate-900">{rider.name}</p>
                <p className="text-slate-500">
                  {rider.vehicle} • Rating: {rider.rating}★
                </p>
                {rider.currentLocation && (
                  <p className="text-[11px] text-amber-800 font-medium">
                    Live: {rider.currentLocation}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${rider.phone}`}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>Call Rider ({rider.phone})</span>
              </a>
            </div>
          </div>
        )}

      </div>

      {/* Order Details & Items Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h2 className="font-heading font-bold text-base text-slate-900">
          Items in this Delivery ({activeOrder.items.length})
        </h2>

        <div className="divide-y divide-slate-100">
          {activeOrder.items.map((item, idx) => {
            const itemImg = item.product?.image || item.image;
            const itemName = item.product?.name || item.productName;
            const itemPrice = item.unitPrice || item.price;
            const itemTotal = item.totalPrice || (itemPrice * item.quantity);

            return (
              <div key={item.productId || idx} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={itemImg}
                    alt={itemName}
                    className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {itemName}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Qty: {item.quantity} × ₹{itemPrice}
                    </p>
                  </div>
                </div>
                <span className="font-heading font-bold text-xs text-slate-900">
                  ₹{itemTotal}
                </span>
              </div>
            );
          })}
        </div>

        {/* Shipping Destination */}
        {address && (
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-bold text-slate-500 block mb-1">Delivery Destination:</span>
              <p className="font-semibold text-slate-900">{address.recipientName || address.name}</p>
              <p className="text-slate-600">{address.addressLine}</p>
              <p className="text-slate-600">{address.area}, Mysuru - {address.pincode}</p>
              {address.landmark && (
                <p className="text-amber-800 font-medium mt-0.5">Landmark: {address.landmark}</p>
              )}
            </div>

            <div>
              <span className="font-bold text-slate-500 block mb-1">Payment Summary:</span>
              <div className="space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{activeOrder.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span>₹{activeOrder.deliveryFee}</span>
                </div>
                {activeOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount:</span>
                    <span>-₹{activeOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-slate-900 pt-1 border-t border-slate-100">
                  <span>Total Paid ({String(activeOrder.paymentMethod).toUpperCase()}):</span>
                  <span>₹{activeOrder.total}</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
