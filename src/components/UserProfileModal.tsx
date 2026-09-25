import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  MapPin,
  Clock,
  ShieldCheck,
  Building,
  Phone,
  Mail,
  ExternalLink,
  Plus,
  LogOut,
  LogIn,
  Check,
  X
} from 'lucide-react';

export const UserProfileModal: React.FC = () => {
  const {
    user,
    orders,
    currentStore,
    setCurrentView,
    setCurrentTrackingOrderId,
    logout,
    setIsAuthModalOpen,
    addAddress,
    setIsLocationModalOpen
  } = useApp();

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addrLabel, setAddrLabel] = useState('Hostel Room');
  const [addrRecipient, setAddrRecipient] = useState(user.name);
  const [addrPhone, setAddrPhone] = useState(user.phone);
  const [addrLine, setAddrLine] = useState('');
  const [addrArea, setAddrArea] = useState(currentStore.coverageAreas[0] || 'Saraswathipuram');
  const [addrLandmark, setAddrLandmark] = useState('');

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrLine.trim()) return;

    await addAddress({
      label: addrLabel,
      tag: addrLabel,
      recipientName: addrRecipient,
      name: addrRecipient,
      phone: addrPhone,
      addressLine: addrLine,
      area: addrArea,
      city: 'Mysuru',
      pincode: '570009',
      landmark: addrLandmark,
      isDefault: (user.savedAddresses || []).length === 0
    });

    setIsAddingAddress(false);
    setAddrLine('');
    setAddrLandmark('');
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-6">
      
      {/* Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-400 text-slate-950 font-black text-2xl flex items-center justify-center font-heading shadow-xs">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-extrabold text-xl text-slate-900">
                {user.name}
              </h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {user.role === 'admin' ? 'Dark Store Admin' : 'Verified Maker'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user.institution}</p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> {user.email}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> {user.phone}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user.role === 'admin' && (
            <button
              onClick={() => setCurrentView('admin')}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Console</span>
            </button>
          )}

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1.5"
            id="profile-switch-account-btn"
          >
            <LogIn className="w-3.5 h-3.5 text-slate-600" />
            <span>Switch / Login</span>
          </button>

          <button
            onClick={logout}
            className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 transition-colors cursor-pointer"
            title="Log Out"
            id="profile-logout-btn"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Saved Delivery Addresses */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-500" />
            Saved Campus & Hostel Addresses
          </h2>
          <button
            onClick={() => setIsAddingAddress(prev => !prev)}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer bg-amber-50 px-3 py-1.5 rounded-lg transition-colors"
            id="add-new-address-btn"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAddingAddress ? 'Cancel' : 'Add New Address'}</span>
          </button>
        </div>

        {/* Add Address Inline Form */}
        {isAddingAddress && (
          <form onSubmit={handleSaveAddress} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in duration-150">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Save New Delivery Location</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Label / Tag</label>
                <input
                  type="text"
                  required
                  value={addrLabel}
                  onChange={e => setAddrLabel(e.target.value)}
                  placeholder="e.g. NIE Boys Hostel Room 304"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Area / College</label>
                <select
                  value={addrArea}
                  onChange={e => setAddrArea(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  <option value="Saraswathipuram">Saraswathipuram</option>
                  <option value="NIE Campus">NIE Campus</option>
                  <option value="SJCE / JSS STU">SJCE / JSS STU Campus</option>
                  <option value="VVCE Campus">VVCE Campus (Gokulam/Hebbal)</option>
                  <option value="Manasagangothri">Manasagangothri PG Quarters</option>
                  <option value="Kuvempunagar">Kuvempunagar</option>
                  <option value="Vidyaranyapuram">Vidyaranyapuram</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Detailed Street Address / Room No</label>
                <input
                  type="text"
                  required
                  value={addrLine}
                  onChange={e => setAddrLine(e.target.value)}
                  placeholder="e.g. 4th Floor, Block B, Room 412, Near College Canteen"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nearest Landmark</label>
                <input
                  type="text"
                  value={addrLandmark}
                  onChange={e => setAddrLandmark(e.target.value)}
                  placeholder="e.g. Next to NIE Golden Jubilee Block"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingAddress(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-xs"
              >
                Save to Profile
              </button>
            </div>
          </form>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(user.addresses || user.savedAddresses || []).map(addr => (
            <div
              key={addr.id}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5 hover:border-amber-400 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{addr.tag || addr.label}</span>
                {addr.isDefault && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">
                    Default
                  </span>
                )}
              </div>
              <p className="text-slate-700">{addr.addressLine}</p>
              <p className="text-slate-500">{addr.area}, Mysuru - {addr.pincode}</p>
              {addr.landmark && (
                <p className="text-[11px] text-amber-800 font-medium">Near: {addr.landmark}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Order History */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-base text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-500" />
            Recent Orders & Invoices ({orders.length})
          </h2>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-3">
            {orders.map(order => {
              const currentStatus = order.orderStatus || order.status || 'Placed';
              return (
                <div
                  key={order.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-slate-300 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">{order.id}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : 'Today'}
                      </span>
                      <span className="text-slate-400">•</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 uppercase tracking-wider">
                        {String(currentStatus).replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-slate-600 mt-1">
                      {order.items.length} items: {order.items.map(i => i.product?.name || i.productName).join(', ')}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Fulfilled from: {order.storeName}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-heading font-extrabold text-sm text-slate-900">
                      ₹{order.total}
                    </span>
                    <button
                      onClick={() => {
                        setCurrentTrackingOrderId(order.id);
                        setCurrentView('track');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <span>Track Live</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No previous orders found.</p>
        )}
      </div>

    </div>
  );
};
