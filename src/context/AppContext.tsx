import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Product,
  Category,
  Store,
  ProjectKit,
  ProjectIdea,
  CartItem,
  Order,
  OrderStatus,
  Address,
  UserProfile,
  Review,
  DeliveryZone
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  MYSURU_STORES,
  INITIAL_PROJECT_KITS,
  INITIAL_PROJECT_IDEAS,
  INITIAL_REVIEWS,
  DEFAULT_SAVED_ADDRESSES,
  INITIAL_ORDERS
} from '../data/database';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  fetchProductsFromDb,
  fetchCategoriesFromDb,
  fetchStoresFromDb,
  fetchStoreInventoryFromDb,
  fetchProjectKitsFromDb,
  fetchReviewsFromDb,
  fetchUserAddressesFromDb,
  saveAddressToDb,
  fetchOrdersFromDb,
  placeOrderInSupabase,
  updateOrderStatusInDb,
  updateStoreInventoryInDb,
  updateProductPriceInDb,
  createProductInDb,
  fetchProfileFromDb
} from '../services/supabaseService';

export type AppView =
  | 'home'
  | 'components'
  | 'kits'
  | 'build-my-project'
  | 'what-can-i-build'
  | 'track'
  | 'admin'
  | 'profile';

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  duration?: number;
}

export interface AppContextType {
  // Navigation & View
  currentView: AppView;
  setCurrentView: (view: AppView) => void;

  // Products & Categories
  products: Product[];
  categories: Category[];
  selectedCategory: string | null;
  setSelectedCategory: (cat: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (prod: Product | null) => void;

  // Location & Store
  stores: Store[];
  currentStore: Store;
  selectedArea: string;
  setSelectedArea: (area: string) => void;
  deliveryTimeEstimate: number;
  deliveryZones: DeliveryZone[];

  // Store-Specific Inventory
  storeInventoryMap: Record<string, Record<string, number>>;
  getProductStockInStore: (productId: string, storeId?: string) => number;

  // Cart State & Actions
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: voidFunction;

  // Cart Calculations & Aliases
  cartSubtotal: number;
  cartDeliveryFee: number;
  deliveryFee: number;
  cartDiscount: number;
  cartTotal: number;
  totalAmount: number;
  appliedCoupon: string | null;
  appliedPromo: { code: string; discount: number } | null;
  applyCoupon: (code: string) => boolean;
  applyPromoCode: (code: string) => boolean;
  removeCoupon: voidFunction;
  removePromoCode: voidFunction;
  addMultipleToCart: (items: Array<{ product: Product; quantity: number }>) => void;

  // Project Kits & Ideas
  projectKits: ProjectKit[];
  projectIdeas: ProjectIdea[];
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;

  // Orders & Tracking
  orders: Order[];
  currentTrackingOrderId: string | null;
  setCurrentTrackingOrderId: (id: string | null) => void;
  placeOrder: (
    address: Address,
    paymentMethod: 'UPI' | 'Card' | 'COD' | 'upi' | 'card' | 'cod',
    notes?: string
  ) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  advanceOrderSimulation: (orderId: string) => void;

  // Supabase Auth & Profile
  user: UserProfile;
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (email: string, pass: string, name: string, phone: string, role: 'customer' | 'admin') => Promise<boolean>;
  logout: () => Promise<void>;
  authLoading: boolean;
  authError: string | null;
  toggleUserRole: voidFunction; // Demo convenience / testing helper
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  setDefaultAddress: (id: string) => void;

  // Admin Operations (Connected to Supabase)
  updateProduct: (productOrId: Product | string, updates?: Partial<Product>) => void;
  addProduct: (product: Omit<Product, 'id'> | Product) => void;
  deleteProduct: (productId: string) => void;
  updateProductStock: (productId: string, newStock: number) => void;
  updateStoreInventory: (storeId: string, productId: string, newStock: number) => void;
  updateProductPrice: (productId: string, newPrice: number) => void;
  addProjectKit: (kit: Omit<ProjectKit, 'id'>) => void;
  updateProjectKit: (kit: ProjectKit) => void;

  // Notifications
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;

  // Modals
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isQuickViewOpen: boolean;
  setIsQuickViewOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // System Loading & Error States
  loadingMessage: string | null;
  setLoadingMessage: (msg: string | null) => void;
  errorMessage: string | null;
  setErrorMessage: (err: string | null) => void;
  refreshData: () => Promise<void>;
}

type voidFunction = () => void;

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Modals
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // System Loading & Error States
  const [loadingMessage, setLoadingMessage] = useState<string | null>('Loading products...');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Locations & Stores (Mysuru Dark Stores)
  const [stores, setStores] = useState<Store[]>(MYSURU_STORES);
  const [selectedArea, setSelectedArea] = useState<string>('Saraswathipuram');
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>([]);

  // Current Store determination
  const currentStore = stores.find(s => s.coverageAreas.includes(selectedArea)) || stores[0] || MYSURU_STORES[0];

  // Store-Specific Inventory: { [storeId]: { [productId]: quantity } }
  const [storeInventoryMap, setStoreInventoryMap] = useState<Record<string, Record<string, number>>>({
    'store-saraswathi': {},
    'store-hebbal': {},
    'store-vidya': {}
  });

  // Base Products & Categories (Supabase fetched)
  const [rawProducts, setRawProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [projectKits, setProjectKits] = useState<ProjectKit[]>(INITIAL_PROJECT_KITS);
  const [projectIdeas] = useState<ProjectIdea[]>(INITIAL_PROJECT_IDEAS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // Helper: get product stock in selected or specified store
  const getProductStockInStore = useCallback((productId: string, storeId?: string): number => {
    const targetStoreId = storeId || currentStore.id;
    const storeStocks = storeInventoryMap[targetStoreId];
    if (storeStocks && storeStocks[productId] !== undefined) {
      return storeStocks[productId];
    }
    // Fallback: check product's default stock
    const prod = rawProducts.find(p => p.id === productId);
    return prod ? prod.stock : 10;
  }, [currentStore.id, storeInventoryMap, rawProducts]);

  // Derived Products with Store-Specific Stock for Active Dark Store
  const products: Product[] = rawProducts.map(p => {
    const stock = getProductStockInStore(p.id, currentStore.id);
    return {
      ...p,
      stock,
      inStockNearby: stock > 0
    };
  });

  // Delivery Time Estimate based on zone and dark store
  const matchingZone = deliveryZones.find(z => z.coverageAreas.includes(selectedArea));
  const deliveryTimeEstimate = matchingZone
    ? Math.round((matchingZone.minDeliveryMins + matchingZone.maxDeliveryMins) / 2)
    : (currentStore.currentDeliveryEstimateMin || 20);

  // Cart (Temporary client state)
  const [cart, setCart] = useState<CartItem[]>([
    { product: INITIAL_PRODUCTS[0], quantity: 1 },
    { product: INITIAL_PRODUCTS[2], quantity: 1 },
    { product: INITIAL_PRODUCTS[3], quantity: 1 }
  ]);

  // Coupons
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('STUDENT50');

  // Supabase User & Saved Addresses
  const [savedAddresses, setSavedAddresses] = useState<Address[]>(DEFAULT_SAVED_ADDRESSES);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile>({
    id: 'user-demo-rahul',
    name: 'Rahul Shivakumar',
    email: 'rahul.mysuru.maker@gmail.com',
    phone: '+91 98451 22910',
    institution: 'The National Institute of Engineering (NIE), Mysuru',
    role: 'customer',
    savedAddresses: DEFAULT_SAVED_ADDRESSES,
    addresses: DEFAULT_SAVED_ADDRESSES
  });

  const user: UserProfile = {
    ...currentUserProfile,
    savedAddresses,
    addresses: savedAddresses
  };

  // Orders
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [currentTrackingOrderId, setCurrentTrackingOrderId] = useState<string | null>(
    INITIAL_ORDERS[0]?.id || null
  );

  // Toasts
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = useCallback((toast: Omit<ToastNotification, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // 1. Initial Data Fetching from Supabase
  const loadData = useCallback(async () => {
    setLoadingMessage('Loading products & dark store inventory...');
    setErrorMessage(null);
    try {
      const [fetchedCats, fetchedStores, fetchedProds, fetchedKits, fetchedReviews, fetchedInv] =
        await Promise.all([
          fetchCategoriesFromDb(),
          fetchStoresFromDb(),
          fetchProductsFromDb(currentStore.id),
          fetchProjectKitsFromDb(),
          fetchReviewsFromDb(),
          fetchStoreInventoryFromDb()
        ]);

      setCategories(fetchedCats);
      setStores(fetchedStores);
      setRawProducts(fetchedProds);
      setProjectKits(fetchedKits);
      setReviews(fetchedReviews);
      setStoreInventoryMap(fetchedInv);
    } catch (err: any) {
      console.error('Data load error:', err);
      setErrorMessage('Failed to connect to backend. Operating with cached catalog.');
    } finally {
      setLoadingMessage(null);
    }
  }, [currentStore.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 2. Supabase Auth Listener
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Check existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfileFromDb(session.user.id);
        const addresses = await fetchUserAddressesFromDb(session.user.id);
        const userOrders = await fetchOrdersFromDb(session.user.id, profile?.role === 'admin');

        setCurrentUserProfile({
          id: session.user.id,
          name: profile?.name || session.user.user_metadata?.full_name || 'Maker',
          email: session.user.email || '',
          phone: profile?.phone || '+91 98450 12345',
          institution: profile?.institution || 'Engineering / Maker in Mysuru',
          role: profile?.role || 'customer',
          savedAddresses: addresses,
          addresses
        });
        setSavedAddresses(addresses);
        if (userOrders.length > 0) {
          setOrders(userOrders);
        }
      }
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const profile = await fetchProfileFromDb(session.user.id);
        const addresses = await fetchUserAddressesFromDb(session.user.id);
        const userOrders = await fetchOrdersFromDb(session.user.id, profile?.role === 'admin');

        setCurrentUserProfile({
          id: session.user.id,
          name: profile?.name || session.user.user_metadata?.full_name || 'Maker',
          email: session.user.email || '',
          phone: profile?.phone || '+91 98450 12345',
          institution: profile?.institution || 'Engineering / Maker in Mysuru',
          role: profile?.role || 'customer',
          savedAddresses: addresses,
          addresses
        });
        setSavedAddresses(addresses);
        if (userOrders.length > 0) {
          setOrders(userOrders);
        }
        addToast({
          type: 'success',
          title: 'Welcome!',
          message: `Signed in as ${profile?.role === 'admin' ? 'Store Admin' : 'Student Customer'}.`
        });
      } else if (event === 'SIGNED_OUT') {
        setCurrentUserProfile({
          id: 'guest',
          name: 'Guest Maker',
          email: 'guest@circuitrush.in',
          phone: '+91 98450 00000',
          institution: 'Student in Mysuru',
          role: 'customer',
          savedAddresses: DEFAULT_SAVED_ADDRESSES,
          addresses: DEFAULT_SAVED_ADDRESSES
        });
        setSavedAddresses(DEFAULT_SAVED_ADDRESSES);
        setCurrentView('home');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [addToast]);

  // Auth Functions
  const login = async (email: string, pass: string): Promise<boolean> => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: pass
        });
        if (error) {
          setAuthError(error.message);
          addToast({
            type: 'error',
            title: 'Sign In Failed',
            message: error.message
          });
          return false;
        }
        return true;
      } else {
        // Safe offline simulated login
        const isAdmin = email.toLowerCase().includes('admin');
        const role = isAdmin ? 'admin' : 'customer';
        setCurrentUserProfile(prev => ({
          ...prev,
          email,
          name: isAdmin ? 'Dark Store Manager' : 'Rahul Shivakumar',
          role
        }));
        addToast({
          type: 'success',
          title: 'Simulated Sign In',
          message: `Signed in as ${role === 'admin' ? 'Admin' : 'Student'}.`
        });
        if (role === 'admin') {
          setCurrentView('admin');
        }
        return true;
      }
    } catch (err: any) {
      setAuthError(err.message || 'Login failed');
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const signup = async (
    email: string,
    pass: string,
    name: string,
    phone: string,
    role: 'customer' | 'admin'
  ): Promise<boolean> => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: {
            data: {
              full_name: name,
              phone,
              role
            }
          }
        });
        if (error) {
          setAuthError(error.message);
          return false;
        }
        // Update profile in profiles table
        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email,
            full_name: name,
            phone,
            role
          });
        }
        return true;
      } else {
        setCurrentUserProfile({
          id: `user-${Date.now()}`,
          name,
          email,
          phone,
          institution: 'College in Mysuru',
          role,
          savedAddresses: DEFAULT_SAVED_ADDRESSES,
          addresses: DEFAULT_SAVED_ADDRESSES
        });
        return true;
      }
    } catch (err: any) {
      setAuthError(err.message || 'Signup failed');
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    } else {
      setCurrentUserProfile({
        id: 'guest',
        name: 'Guest Maker',
        email: 'guest@circuitrush.in',
        phone: '+91 98450 00000',
        institution: 'Student in Mysuru',
        role: 'customer',
        savedAddresses: DEFAULT_SAVED_ADDRESSES,
        addresses: DEFAULT_SAVED_ADDRESSES
      });
      setCurrentView('home');
      addToast({
        type: 'info',
        title: 'Logged Out',
        message: 'You have been safely signed out.'
      });
    }
  };

  // Switch between Student and Admin testing role helper
  const toggleUserRole = () => {
    const nextRole = currentUserProfile.role === 'customer' ? 'admin' : 'customer';
    setCurrentUserProfile(prev => ({
      ...prev,
      role: nextRole
    }));
    addToast({
      type: 'info',
      title: nextRole === 'admin' ? 'Switched to Admin Role' : 'Switched to Customer Role',
      message: nextRole === 'admin' ? 'Dark store management & inventory console active.' : 'Shopping as verified maker in Mysuru.'
    });
    if (nextRole === 'admin') {
      setCurrentView('admin');
    }
  };

  // Cart Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = cartSubtotal >= 499 || cartSubtotal === 0 ? 0 : 29;
  const cartDeliveryFee = deliveryFee;

  let cartDiscount = 0;
  if (appliedCoupon === 'STUDENT50') {
    cartDiscount = Math.min(50, cartSubtotal);
  } else if (appliedCoupon === 'FIRST100') {
    cartDiscount = Math.min(100, cartSubtotal);
  } else if (appliedCoupon === 'MAKER50') {
    cartDiscount = Math.min(50, cartSubtotal);
  }

  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + deliveryFee);
  const totalAmount = cartTotal;

  const appliedPromo = appliedCoupon ? { code: appliedCoupon, discount: cartDiscount } : null;

  const applyCoupon = (code: string): boolean => {
    const upper = code.trim().toUpperCase();
    if (['STUDENT50', 'FIRST100', 'MAKER50'].includes(upper)) {
      setAppliedCoupon(upper);
      addToast({
        type: 'success',
        title: 'Coupon Applied!',
        message: `Saved with coupon code ${upper}.`
      });
      return true;
    }
    addToast({
      type: 'error',
      title: 'Invalid Coupon',
      message: 'Code not recognized or expired.'
    });
    return false;
  };

  const applyPromoCode = applyCoupon;
  const removeCoupon = () => setAppliedCoupon(null);
  const removePromoCode = removeCoupon;

  // Cart Management
  const addToCart = (product: Product, quantity: number = 1) => {
    const availableStock = getProductStockInStore(product.id, currentStore.id);
    if (availableStock <= 0) {
      addToast({
        type: 'error',
        title: 'Out of Stock',
        message: `Sorry, ${product.name} is currently out of stock at ${currentStore.name}.`
      });
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        const nextQty = existing.quantity + quantity;
        if (nextQty > availableStock) {
          addToast({
            type: 'warning',
            title: 'Stock Limit Reached',
            message: `Only ${availableStock} units available at ${currentStore.name}.`
          });
          return prev.map(item =>
            item.product.id === product.id ? { ...item, quantity: availableStock } : item
          );
        }
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: nextQty } : item
        );
      }
      return [...prev, { product, quantity: Math.min(quantity, availableStock) }];
    });

    addToast({
      type: 'success',
      title: 'Added to Cart',
      message: `${product.name} ready for 15-min delivery.`
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const availableStock = getProductStockInStore(productId, currentStore.id);
    if (quantity > availableStock) {
      addToast({
        type: 'warning',
        title: 'Stock Limit',
        message: `Only ${availableStock} units available in ${currentStore.name}.`
      });
      quantity = availableStock;
    }

    setCart(prev =>
      prev.map(item => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => setCart([]);

  const addMultipleToCart = (items: Array<{ product: Product; quantity: number }>) => {
    items.forEach(({ product, quantity }) => {
      addToCart(product, quantity);
    });
  };

  // Place Order (Real Supabase + Inventory Validation + Atomic Deduction)
  const placeOrder = async (
    address: Address,
    paymentMethod: 'UPI' | 'Card' | 'COD' | 'upi' | 'card' | 'cod',
    notes?: string
  ): Promise<Order> => {
    setLoadingMessage('Placing order & checking inventory...');
    setErrorMessage(null);

    // 1. Validate store inventory for each item in cart
    for (const item of cart) {
      const stock = getProductStockInStore(item.product.id, currentStore.id);
      if (stock < item.quantity) {
        setLoadingMessage(null);
        const msg = `Out of stock: "${item.product.name}" only has ${stock} units available at ${currentStore.name}.`;
        setErrorMessage(msg);
        addToast({
          type: 'error',
          title: 'Order Blocked',
          message: msg
        });
        throw new Error(msg);
      }
    }

    const orderId = `CR-${Date.now().toString().slice(-6)}`;
    const riderInfo = {
      name: 'Girish M. (CircuitRunner)',
      phone: '+91 97422 44109',
      vehicle: 'Ather 450X (KA-09-EU-7712)',
      rating: 4.95,
      currentLocation: `Packing at ${currentStore.area} Dark Store`
    };

    try {
      const result = await placeOrderInSupabase({
        orderId,
        userId: currentUserProfile.id,
        storeId: currentStore.id,
        storeName: currentStore.name,
        customerName: address.recipientName || address.name || currentUserProfile.name,
        phone: address.phone || currentUserProfile.phone,
        address,
        cart,
        subtotal: cartSubtotal,
        deliveryFee,
        discount: cartDiscount,
        total: totalAmount,
        paymentMethod,
        deliveryTimeEstimate,
        riderInfo
      });

      if (!result.success || !result.order) {
        throw new Error(result.error || 'Failed to place order in database');
      }

      const confirmedOrder = result.order;

      // Deduct stock locally in storeInventoryMap
      setStoreInventoryMap(prev => {
        const storeStock = { ...(prev[currentStore.id] || {}) };
        cart.forEach(item => {
          storeStock[item.product.id] = Math.max(0, (storeStock[item.product.id] || item.product.stock) - item.quantity);
        });
        return {
          ...prev,
          [currentStore.id]: storeStock
        };
      });

      // Update state
      setOrders(prev => [confirmedOrder, ...prev]);
      clearCart();
      setCurrentTrackingOrderId(orderId);
      setCurrentView('track');

      addToast({
        type: 'success',
        title: 'Order Confirmed! ⚡',
        message: `Order #${orderId} placed. Dispatched from ${currentStore.name}.`
      });

      return confirmedOrder;
    } catch (err: any) {
      console.error('Order placement failure:', err);
      setErrorMessage(err.message || 'Failed to complete order. Please try again.');
      addToast({
        type: 'error',
        title: 'Order Failed',
        message: err.message || 'Could not verify dark store inventory.'
      });
      throw err;
    } finally {
      setLoadingMessage(null);
    }
  };

  // Update Order Status (Admin action)
  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    setLoadingMessage('Updating order status...');
    await updateOrderStatusInDb(orderId, status);
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, orderStatus: status, status, updatedAt: 'Just now' } : o))
    );
    setLoadingMessage(null);
    addToast({
      type: 'info',
      title: 'Order Status Updated',
      message: `Order #${orderId} is now ${status}.`
    });
  };

  const advanceOrderSimulation = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const sequence: OrderStatus[] = ['Placed', 'Confirmed', 'Packing', 'OutForDelivery', 'Delivered'];
    const currentNorm = (order.status || order.orderStatus) as OrderStatus;
    const currentIndex = sequence.indexOf(currentNorm);
    if (currentIndex < sequence.length - 1) {
      const nextStatus = sequence[currentIndex + 1];
      updateOrderStatus(orderId, nextStatus);
    } else {
      addToast({
        type: 'info',
        title: 'Already Delivered',
        message: `Order #${orderId} has been successfully delivered!`
      });
    }
  };

  // Addresses
  const addAddress = async (addr: Omit<Address, 'id'>) => {
    const saved = await saveAddressToDb(currentUserProfile.id, addr);
    setSavedAddresses(prev => [...prev, saved]);
    addToast({
      type: 'success',
      title: 'Address Saved',
      message: `${addr.label || 'Saved'} location added to your profile.`
    });
  };

  const setDefaultAddress = (id: string) => {
    setSavedAddresses(prev =>
      prev.map(a => ({ ...a, isDefault: a.id === id }))
    );
  };

  // Reviews
  const addReview = (review: Omit<Review, 'id' | 'date'>) => {
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: 'Today'
    };
    setReviews(prev => [newRev, ...prev]);
    addToast({
      type: 'success',
      title: 'Review Posted',
      message: 'Thank you for sharing your component feedback!'
    });
  };

  // Admin Operations (Connected to Supabase)
  const updateProductStock = async (productId: string, newStock: number) => {
    setLoadingMessage('Updating inventory...');
    await updateStoreInventoryInDb(currentStore.id, productId, newStock);
    setStoreInventoryMap(prev => ({
      ...prev,
      [currentStore.id]: {
        ...(prev[currentStore.id] || {}),
        [productId]: newStock
      }
    }));
    setLoadingMessage(null);
    addToast({
      type: 'success',
      title: 'Inventory Synchronized',
      message: `Stock updated to ${newStock} units at ${currentStore.name}.`
    });
  };

  const updateStoreInventory = async (storeId: string, productId: string, newStock: number) => {
    setLoadingMessage('Updating store inventory...');
    await updateStoreInventoryInDb(storeId, productId, newStock);
    setStoreInventoryMap(prev => ({
      ...prev,
      [storeId]: {
        ...(prev[storeId] || {}),
        [productId]: newStock
      }
    }));
    setLoadingMessage(null);
    addToast({
      type: 'success',
      title: 'Hub Inventory Updated',
      message: `Stock set to ${newStock} units.`
    });
  };

  const updateProductPrice = async (productId: string, newPrice: number) => {
    setLoadingMessage('Updating product price...');
    await updateProductPriceInDb(productId, newPrice);
    setRawProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, price: newPrice } : p))
    );
    setLoadingMessage(null);
    addToast({
      type: 'success',
      title: 'Price Updated',
      message: `Price adjusted to ₹${newPrice}.`
    });
  };

  const updateProduct = (productOrId: Product | string, updates?: Partial<Product>) => {
    if (typeof productOrId === 'string') {
      if (updates?.price !== undefined) {
        updateProductPrice(productOrId, updates.price);
      }
      if (updates?.stock !== undefined) {
        updateProductStock(productOrId, updates.stock);
      }
    } else {
      if (updates?.price !== undefined) {
        updateProductPrice(productOrId.id, updates.price);
      }
    }
  };

  const addProduct = async (product: Omit<Product, 'id'> | Product) => {
    setLoadingMessage('Creating product in Supabase...');
    const id = 'id' in product ? product.id : `prod-${Date.now()}`;
    const fullProd: Product = {
      ...product,
      id,
      sku: product.sku || `CR-${Date.now().toString().slice(-4)}`
    };
    await createProductInDb(fullProd);
    setRawProducts(prev => [fullProd, ...prev]);
    setStoreInventoryMap(prev => ({
      ...prev,
      [currentStore.id]: {
        ...(prev[currentStore.id] || {}),
        [id]: fullProd.stock
      }
    }));
    setLoadingMessage(null);
    addToast({
      type: 'success',
      title: 'Product Added',
      message: `Added ${fullProd.name} to CircuitRush catalog.`
    });
  };

  const deleteProduct = (productId: string) => {
    setRawProducts(prev => prev.filter(p => p.id !== productId));
    addToast({
      type: 'info',
      title: 'Product Removed',
      message: 'Product archived from store listing.'
    });
  };

  const addProjectKit = (kit: Omit<ProjectKit, 'id'>) => {
    const newKit: ProjectKit = {
      ...kit,
      id: `kit-${Date.now()}`
    };
    setProjectKits(prev => [...prev, newKit]);
    addToast({
      type: 'success',
      title: 'Project Kit Added',
      message: `${newKit.name} added to catalog.`
    });
  };

  const updateProjectKit = (kit: ProjectKit) => {
    setProjectKits(prev => prev.map(k => (k.id === kit.id ? kit : k)));
    addToast({
      type: 'info',
      title: 'Kit Updated',
      message: `Updated ${kit.name}.`
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        products,
        categories,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedProduct,
        setSelectedProduct,
        stores,
        currentStore,
        selectedArea,
        setSelectedArea,
        deliveryTimeEstimate,
        deliveryZones,
        storeInventoryMap,
        getProductStockInStore,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        cartSubtotal,
        cartDeliveryFee,
        deliveryFee,
        cartDiscount,
        cartTotal,
        totalAmount,
        appliedCoupon,
        appliedPromo,
        applyCoupon,
        applyPromoCode,
        removeCoupon,
        removePromoCode,
        addMultipleToCart,
        projectKits,
        projectIdeas,
        reviews,
        addReview,
        orders,
        currentTrackingOrderId,
        setCurrentTrackingOrderId,
        placeOrder,
        updateOrderStatus,
        advanceOrderSimulation,
        user,
        login,
        signup,
        logout,
        authLoading,
        authError,
        toggleUserRole,
        addAddress,
        setDefaultAddress,
        updateProduct,
        addProduct,
        deleteProduct,
        updateProductStock,
        updateStoreInventory,
        updateProductPrice,
        addProjectKit,
        updateProjectKit,
        toasts,
        addToast,
        removeToast,
        isLocationModalOpen,
        setIsLocationModalOpen,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isQuickViewOpen,
        setIsQuickViewOpen,
        isCheckoutModalOpen,
        setIsCheckoutModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        loadingMessage,
        setLoadingMessage,
        errorMessage,
        setErrorMessage,
        refreshData: loadData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
