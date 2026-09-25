export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  minStockLevel: number;
  storeId: string;
  storeIds?: string[];
  deliveryTimeMin: number;
  image: string;
  description: string;
  specifications: Record<string, string>;
  pinInfo?: string[];
  compatibleBoards: string[];
  recommendedProjects: string[];
  frequentlyBoughtTogetherIds: string[];
  rating: number;
  reviewsCount: number;
  inStockNearby: boolean;
  moduleCode?: string;
  tags: string[];
  isFastDelivery?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  count: number;
  description?: string;
}

export interface Store {
  id: string;
  name: string;
  area: string;
  city: string;
  pincode: string;
  phone: string;
  isOpen: boolean;
  operatingHours: string;
  currentDeliveryEstimateMin: number;
  coverageAreas: string[];
  address?: string;
}

export interface StoreInventoryItem {
  id?: string;
  storeId: string;
  productId: string;
  quantity: number;
  minStockLevel: number;
  updatedAt?: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  storeId: string;
  minDeliveryMins: number;
  maxDeliveryMins: number;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  coverageAreas: string[];
  active: boolean;
}

export interface KitComponent {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface ProjectKit {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  difficulty: DifficultyLevel;
  estimatedBuildTime: string;
  components: KitComponent[];
  price: number;
  originalPrice: number;
  savings: number;
  deliveryEstimateMin: number;
  guideSteps: string[];
  skillsLearned: string[];
}

export interface ProjectIdea {
  id: string;
  name: string;
  category: string;
  difficulty: DifficultyLevel;
  estimatedBuildTime: string;
  description: string;
  image: string;
  requiredComponentIds: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus =
  | 'Placed'
  | 'Confirmed'
  | 'Packing'
  | 'OutForDelivery'
  | 'Delivered'
  | 'Cancelled'
  | 'order_placed'
  | 'store_confirmed'
  | 'packing'
  | 'out_for_delivery'
  | 'delivered';

export interface Address {
  id: string;
  label: 'Hostel' | 'College Lab' | 'Home' | 'Office' | 'PG' | string;
  tag?: string;
  recipientName: string;
  name?: string;
  phone: string;
  addressLine: string;
  area: string;
  city: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  image: string;
  price: number;
  quantity: number;
  product?: Product;
  unitPrice?: number;
  totalPrice?: number;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  phone: string;
  deliveryAddress: Address;
  shippingAddress?: Address;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: 'UPI' | 'Card' | 'COD' | 'upi' | 'card' | 'cod';
  paymentStatus: 'Paid' | 'Pending';
  orderStatus: OrderStatus;
  status?: OrderStatus;
  storeId: string;
  storeName: string;
  estimatedDeliveryMin: number;
  estimatedDeliveryMins?: number;
  createdAt: string;
  updatedAt: string;
  riderInfo?: {
    name: string;
    phone: string;
    vehicle: string;
    rating: number;
    currentLocation?: string;
  };
  deliveryPartner?: {
    name: string;
    phone: string;
    vehicle: string;
    rating: number;
    currentLocation?: string;
  };
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userRole: string; // e.g. "ECE Student, NIE Mysuru"
  rating: number;
  date: string;
  comment: string;
  verifiedBuyer: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  institution: string;
  role: 'customer' | 'admin';
  savedAddresses: Address[];
  addresses?: Address[];
}
