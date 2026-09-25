import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, OrderStatus } from '../types';
import {
  ShieldCheck,
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  Plus,
  Trash2,
  Edit2,
  Check,
  Search,
  Filter,
  Building2,
  ArrowUpRight,
  RotateCcw
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    orders,
    stores,
    user,
    setIsAuthModalOpen,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    updateProductStock,
    updateProductPrice,
    updateStoreInventory,
    getProductStockInStore,
    toggleUserRole,
    setCurrentView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'inventory'>('overview');
  const [productSearch, setProductSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Secure Admin Authorization Gate
  if (user.role !== 'admin') {
    return (
      <div className="py-20 px-4 max-w-lg mx-auto text-center space-y-5">
        <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="font-heading font-extrabold text-2xl text-slate-900">
          Admin Authentication Required
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Access to dark store inventory, order dispatch queues, and SKU pricing is restricted to verified administrators via Supabase Row Level Security.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm cursor-pointer transition-all flex items-center justify-center gap-2"
            id="admin-auth-login-btn"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sign In with Admin Credentials</span>
          </button>
          <button
            onClick={toggleUserRole}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs cursor-pointer transition-all"
            id="admin-demo-toggle-btn"
          >
            Switch to Admin Demo
          </button>
        </div>
      </div>
    );
  }

  // New product form state
  const [newProd, setNewProd] = useState<Partial<Product>>({
    name: '',
    category: 'Sensors',
    price: 99,
    originalPrice: 149,
    stock: 25,
    minStockLevel: 5,
    description: '',
    moduleCode: '',
    compatibleBoards: ['Arduino', 'ESP32'],
    image: 'https://images.unsplash.com/photo-1608555817771-a6511004f457?w=600&auto=format&fit=crop&q=80',
    inStockNearby: true,
    specifications: { 'Operating Voltage': '5V DC' }
  });

  // Calculate metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const activeOrdersCount = orders.filter(
    o => (o.orderStatus || o.status) !== 'Delivered' && (o.orderStatus || o.status) !== 'delivered'
  ).length;
  const lowStockCount = products.filter(p => p.stock <= p.minStockLevel).length;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) return;

    const fullProduct: Product = {
      id: `prod-custom-${Date.now()}`,
      sku: `CR-CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newProd.name!,
      category: newProd.category || 'Sensors',
      price: Number(newProd.price),
      originalPrice: Number(newProd.originalPrice || newProd.price),
      stock: Number(newProd.stock || 20),
      minStockLevel: Number(newProd.minStockLevel || 5),
      image: newProd.image || 'https://images.unsplash.com/photo-1608555817771-a6511004f457?w=600&auto=format&fit=crop&q=80',
      description: newProd.description || 'Quality tested electronics component for engineering and prototyping.',
      moduleCode: newProd.moduleCode || '',
      compatibleBoards: newProd.compatibleBoards || ['Arduino', 'ESP32'],
      specifications: newProd.specifications || { 'Voltage': '5V DC' },
      rating: 4.8,
      reviewsCount: 1,
      inStockNearby: true,
      storeId: 'store-saraswathi',
      storeIds: ['store-saraswathi', 'store-hebbal'],
      deliveryTimeMin: 18,
      tags: ['custom', 'mcu', 'iot'],
      recommendedProjects: [],
      frequentlyBoughtTogetherIds: []
    };

    addProduct(fullProduct);
    setIsAddModalOpen(false);
    setNewProd({
      name: '',
      category: 'Sensors',
      price: 99,
      originalPrice: 149,
      stock: 25,
      minStockLevel: 5,
      description: '',
      moduleCode: ''
    });
  };

  const filteredProducts = products.filter(
    p =>
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.moduleCode?.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-2xl shadow-sm border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-bold mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Store Manager Console (Mysuru Cluster)</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-white">
            CircuitRush Dark Store Operations
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage live product stock, packing queues, driver assignments, and dark store inventory across Saraswathipuram, Hebbal, and Vidyaranyapuram.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              toggleUserRole();
              setCurrentView('home');
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
          >
            Switch to Customer View
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'overview'
              ? 'text-amber-600 border-b-2 border-amber-500 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Operations Overview
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'products'
              ? 'text-amber-600 border-b-2 border-amber-500 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Product Catalog ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'orders'
              ? 'text-amber-600 border-b-2 border-amber-500 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Live Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`pb-3 transition-colors cursor-pointer ${
            activeTab === 'inventory'
              ? 'text-amber-600 border-b-2 border-amber-500 font-bold'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          Dark Store Matrix (3 Stores)
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Revenue</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 font-heading mt-2">
                ₹{totalRevenue.toLocaleString()}
              </p>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                +18.4% vs yesterday (Exam week peak)
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Deliveries</span>
                <ShoppingCart className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 font-heading mt-2">
                {activeOrdersCount}
              </p>
              <span className="text-[11px] text-amber-600 font-semibold mt-1 block">
                Average ETA: 18.2 minutes
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Catalog</span>
                <Package className="w-4 h-4 text-sky-500" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900 font-heading mt-2">
                {products.length}
              </p>
              <span className="text-[11px] text-slate-500 font-semibold mt-1 block">
                Electronics SKUs stocked
              </span>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Low Stock Alerts</span>
                <AlertTriangle className="w-4 h-4 text-rose-500" />
              </div>
              <p className="text-2xl font-extrabold text-rose-600 font-heading mt-2">
                {lowStockCount}
              </p>
              <span className="text-[11px] text-rose-600 font-semibold mt-1 block">
                Require replenishment from Bangalore central hub
              </span>
            </div>
          </div>

          {/* Quick Dispatch Status Summary */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
            <h2 className="font-heading font-bold text-base text-slate-900">
              Mysuru Dark Store Cluster Health
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {stores.map(st => (
                <div key={st.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{st.name}</span>
                    <span className="text-emerald-700 font-bold text-[10px] bg-emerald-100 px-1.5 py-0.5 rounded">
                      ONLINE
                    </span>
                  </div>
                  <p className="text-slate-500">{st.address}</p>
                  <div className="pt-2 border-t border-slate-200/80 flex justify-between text-slate-600">
                    <span>Active Riders: 4</span>
                    <span>Packing Queue: 1</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                placeholder="Search catalog by name, module code, or category..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs outline-none focus:border-amber-400"
              />
            </div>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Electronics SKU</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock Units</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map(prod => (
                  <tr key={prod.id} className="hover:bg-slate-50/80">
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-8 h-8 rounded-lg object-cover bg-slate-100 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{prod.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{prod.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-medium text-slate-600">{prod.category}</td>
                    <td className="p-3 font-bold text-slate-900">
                      ₹
                      <input
                        type="number"
                        defaultValue={prod.price}
                        onBlur={e =>
                          updateProduct(prod.id, { price: Number(e.target.value) })
                        }
                        className="w-16 p-1 border border-transparent hover:border-slate-200 focus:border-amber-400 rounded outline-none font-bold"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        defaultValue={prod.stock}
                        onBlur={e =>
                          updateProduct(prod.id, { stock: Number(e.target.value) })
                        }
                        className="w-16 p-1 border border-slate-200 focus:border-amber-400 rounded outline-none font-mono"
                      />
                    </td>
                    <td className="p-3">
                      {prod.stock <= 0 ? (
                        <span className="font-bold text-rose-600 text-[11px]">Out of stock</span>
                      ) : prod.stock <= prod.minStockLevel ? (
                        <span className="font-bold text-amber-600 text-[11px]">Low stock ({prod.stock})</span>
                      ) : (
                        <span className="font-bold text-emerald-600 text-[11px]">Healthy ({prod.stock})</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => deleteProduct(prod.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors cursor-pointer"
                        title="Delete SKU"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Customer & Area</th>
                  <th className="p-3">Hub</th>
                  <th className="p-3">Items</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map(order => {
                  const addr = order.deliveryAddress || order.shippingAddress;
                  const currentStatus = order.orderStatus || order.status || 'Placed';
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-mono font-bold text-slate-900">{order.id}</td>
                      <td className="p-3">
                        <p className="font-semibold text-slate-900">{addr?.recipientName || addr?.name || order.customerName}</p>
                        <p className="text-[11px] text-slate-500">{addr?.area}</p>
                      </td>
                      <td className="p-3 text-slate-600">{order.storeName}</td>
                      <td className="p-3 text-slate-600">{order.items.length} items</td>
                      <td className="p-3 font-bold text-slate-900">₹{order.total}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900">
                          {String(currentStatus).replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-3">
                        <select
                          value={currentStatus}
                          onChange={e =>
                            updateOrderStatus(order.id, e.target.value as OrderStatus)
                          }
                          className="p-1 bg-white border border-slate-200 rounded text-xs font-semibold outline-none focus:border-amber-400 cursor-pointer"
                        >
                          <option value="Placed">Order Placed</option>
                          <option value="Confirmed">Store Confirmed</option>
                          <option value="Packing">Packing Items</option>
                          <option value="OutForDelivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inventory Matrix Tab */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <h2 className="font-heading font-bold text-base text-slate-900">
              Dark Store Inventory Distribution (Mysuru Hubs)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              {stores.map(store => {
                const storeProducts = products.filter(
                  p => p.storeId === store.id || p.storeIds?.includes(store.id)
                );
                const totalStockInStore = storeProducts.reduce((sum, p) => sum + p.stock, 0);

                return (
                  <div key={store.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="font-bold text-sm text-slate-900">{store.name}</span>
                      <span className="font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px]">
                        Active
                      </span>
                    </div>

                    <p className="text-slate-600">{store.address || `${store.area}, Mysuru`}</p>

                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Total Units Stocked:</span>
                        <span className="font-bold text-slate-900">{totalStockInStore} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Unique SKUs:</span>
                        <span className="font-bold text-slate-900">{storeProducts.length} SKUs</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Average Transit ETA:</span>
                        <span className="font-bold text-amber-600">~18 mins</span>
                      </div>
                    </div>

                    <button
                      onClick={() => alert(`Replenishment batch triggered for ${store.name}`)}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Request Inter-Hub Restock
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Store-Specific Stock Table */}
            <div className="pt-6 border-t border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading font-bold text-sm text-slate-900">
                  Real-Time Stock by Hub (<code className="font-mono text-purple-700 bg-purple-50 px-1 py-0.5 rounded">store_inventory</code> table)
                </h3>
                <span className="text-[11px] text-slate-500">
                  Edit numbers to synchronize directly with Supabase
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="p-3">Component SKU</th>
                      <th className="p-3">Saraswathipuram (Hub A)</th>
                      <th className="p-3">Hebbal (Hub B)</th>
                      <th className="p-3">Vidyaranyapuram (Hub C)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.slice(0, 15).map(p => {
                      const stockA = getProductStockInStore(p.id, 'store-saraswathi');
                      const stockB = getProductStockInStore(p.id, 'store-hebbal');
                      const stockC = getProductStockInStore(p.id, 'store-vidya');

                      return (
                        <tr key={p.id} className="hover:bg-slate-50/70">
                          <td className="p-3">
                            <span className="font-bold text-slate-900 block">{p.name}</span>
                            <span className="font-mono text-[10px] text-slate-400">{p.sku}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min={0}
                                defaultValue={stockA}
                                onBlur={e => updateStoreInventory('store-saraswathi', p.id, Number(e.target.value))}
                                className="w-16 p-1 border border-slate-200 focus:border-amber-400 rounded outline-none font-bold font-mono text-slate-900"
                              />
                              <span className="text-[10px]">
                                {stockA <= 0 ? '🔴' : stockA <= 5 ? '🟡' : '🟢'}
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min={0}
                                defaultValue={stockB}
                                onBlur={e => updateStoreInventory('store-hebbal', p.id, Number(e.target.value))}
                                className="w-16 p-1 border border-slate-200 focus:border-amber-400 rounded outline-none font-bold font-mono text-slate-900"
                              />
                              <span className="text-[10px]">
                                {stockB <= 0 ? '🔴' : stockB <= 5 ? '🟡' : '🟢'}
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min={0}
                                defaultValue={stockC}
                                onBlur={e => updateStoreInventory('store-vidya', p.id, Number(e.target.value))}
                                className="w-16 p-1 border border-slate-200 focus:border-amber-400 rounded outline-none font-bold font-mono text-slate-900"
                              />
                              <span className="text-[10px]">
                                {stockC <= 0 ? '🔴' : stockC <= 5 ? '🟡' : '🟢'}
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-heading font-bold text-lg text-slate-900">
              Add New Electronics SKU
            </h3>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Component Name</label>
                <input
                  type="text"
                  required
                  value={newProd.name}
                  onChange={e => setNewProd({ ...newProd, name: e.target.value })}
                  placeholder="e.g. Raspberry Pi Pico W"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newProd.category}
                    onChange={e => setNewProd({ ...newProd, category: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  >
                    <option value="Microcontrollers">Microcontrollers</option>
                    <option value="Sensors">Sensors</option>
                    <option value="Motors & Actuators">Motors & Actuators</option>
                    <option value="Displays">Displays</option>
                    <option value="Communication & Wireless">Communication & Wireless</option>
                    <option value="Power & Relays">Power & Relays</option>
                    <option value="Prototyping & Tools">Prototyping & Tools</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Module Code</label>
                  <input
                    type="text"
                    value={newProd.moduleCode}
                    onChange={e => setNewProd({ ...newProd, moduleCode: e.target.value })}
                    placeholder="e.g. RP2040"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProd.price}
                    onChange={e => setNewProd({ ...newProd, price: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={newProd.stock}
                    onChange={e => setNewProd({ ...newProd, stock: Number(e.target.value) })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description</label>
                <textarea
                  value={newProd.description}
                  onChange={e => setNewProd({ ...newProd, description: e.target.value })}
                  placeholder="Component technical overview..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg outline-none resize-none h-16"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
