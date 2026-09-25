import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Product,
  Category,
  Store,
  ProjectKit,
  Order,
  Address,
  Review,
  DeliveryZone,
  StoreInventoryItem,
  UserProfile,
  CartItem
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  MYSURU_STORES,
  INITIAL_PROJECT_KITS,
  INITIAL_REVIEWS,
  DEFAULT_SAVED_ADDRESSES,
  INITIAL_ORDERS
} from '../data/database';

// Helper to convert snake_case DB row to frontend Product
export function mapDbProductToProduct(row: any, inventoryQty?: number): Product {
  return {
    id: row.id,
    sku: row.sku || `SKU-${row.id}`,
    name: row.name,
    category: row.category || 'General',
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    stock: inventoryQty !== undefined ? inventoryQty : (row.stock !== undefined ? Number(row.stock) : 15),
    minStockLevel: row.min_stock_level ? Number(row.min_stock_level) : 5,
    storeId: row.store_id || 'store-saraswathi',
    deliveryTimeMin: row.delivery_time_min ? Number(row.delivery_time_min) : 20,
    image: row.image,
    description: row.description,
    specifications: typeof row.specifications === 'object' && row.specifications ? row.specifications : {},
    pinInfo: row.pin_info || [],
    compatibleBoards: row.compatible_boards || [],
    recommendedProjects: row.recommended_projects || [],
    frequentlyBoughtTogetherIds: row.frequently_bought_together_ids || [],
    rating: row.rating ? Number(row.rating) : 4.8,
    reviewsCount: row.reviews_count ? Number(row.reviews_count) : 10,
    inStockNearby: (inventoryQty !== undefined ? inventoryQty : (row.stock ?? 10)) > 0,
    moduleCode: row.module_code || undefined,
    tags: row.tags || []
  };
}

// 1. Fetch Categories
export async function fetchCategoriesFromDb(): Promise<Category[]> {
  if (!isSupabaseConfigured) {
    return INITIAL_CATEGORIES;
  }
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    if (error || !data || data.length === 0) {
      console.warn('Supabase categories fetch error or empty, using seed data:', error?.message);
      return INITIAL_CATEGORIES;
    }
    return data.map((c: any) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      iconName: c.icon_name || 'Cpu',
      count: c.count || 0,
      description: c.description
    }));
  } catch (err) {
    console.error('Failed to fetch categories from Supabase:', err);
    return INITIAL_CATEGORIES;
  }
}

// 2. Fetch Stores
export async function fetchStoresFromDb(): Promise<Store[]> {
  if (!isSupabaseConfigured) {
    return MYSURU_STORES;
  }
  try {
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .order('name');
    if (error || !data || data.length === 0) {
      return MYSURU_STORES;
    }
    return data.map((s: any) => ({
      id: s.id,
      name: s.name,
      area: s.area,
      city: s.city || 'Mysuru',
      pincode: s.pincode,
      phone: s.phone,
      isOpen: s.is_open ?? true,
      operatingHours: s.operating_hours || '8:00 AM – 11:30 PM',
      currentDeliveryEstimateMin: s.current_delivery_estimate_min || 20,
      coverageAreas: s.coverage_areas || [],
      address: s.address
    }));
  } catch (err) {
    console.error('Failed to fetch stores from Supabase:', err);
    return MYSURU_STORES;
  }
}

// 3. Fetch Delivery Zones
export async function fetchDeliveryZonesFromDb(): Promise<DeliveryZone[]> {
  if (!isSupabaseConfigured) {
    return [
      {
        id: 'zone-saraswathipuram',
        name: 'South-Central Mysuru (Saraswathipuram & Campuses)',
        storeId: 'store-saraswathi',
        minDeliveryMins: 15,
        maxDeliveryMins: 25,
        deliveryFee: 29,
        freeDeliveryThreshold: 499,
        coverageAreas: ['Saraswathipuram', 'NIE Campus', 'Manasagangothri', 'Kuvempunagar', 'K.G. Koppal'],
        active: true
      },
      {
        id: 'zone-hebbal-gokulam',
        name: 'North-West Mysuru (Hebbal, Gokulam & VVCE)',
        storeId: 'store-hebbal',
        minDeliveryMins: 18,
        maxDeliveryMins: 30,
        deliveryFee: 35,
        freeDeliveryThreshold: 499,
        coverageAreas: ['Hebbal', 'VVCE Campus', 'Gokulam', 'Jayalakshmipuram', 'Vijayanagar 1st-4th Stage'],
        active: true
      },
      {
        id: 'zone-vidyaranyapuram',
        name: 'South-East Mysuru (SJCE, Agrahara, JP Nagar)',
        storeId: 'store-vidya',
        minDeliveryMins: 15,
        maxDeliveryMins: 25,
        deliveryFee: 29,
        freeDeliveryThreshold: 499,
        coverageAreas: ['Vidyaranyapuram', 'SJCE / JSS STU', 'Chamundipuram', 'Agrahara', 'J.P. Nagar'],
        active: true
      }
    ];
  }
  try {
    const { data, error } = await supabase
      .from('delivery_zones')
      .select('*')
      .eq('active', true);
    if (error || !data || data.length === 0) {
      return [];
    }
    return data.map((z: any) => ({
      id: z.id,
      name: z.name,
      storeId: z.store_id,
      minDeliveryMins: z.min_delivery_mins || 15,
      maxDeliveryMins: z.max_delivery_mins || 30,
      deliveryFee: Number(z.delivery_fee) || 35,
      freeDeliveryThreshold: Number(z.free_delivery_threshold) || 499,
      coverageAreas: z.coverage_areas || [],
      active: z.active ?? true
    }));
  } catch (err) {
    console.error('Failed to fetch delivery zones from Supabase:', err);
    return [];
  }
}

// 4. Fetch Store Inventory for all products
export async function fetchStoreInventoryFromDb(storeId?: string): Promise<Record<string, Record<string, number>>> {
  // Returns { [storeId]: { [productId]: quantity } }
  const inventoryMap: Record<string, Record<string, number>> = {
    'store-saraswathi': {},
    'store-hebbal': {},
    'store-vidya': {}
  };

  if (!isSupabaseConfigured) {
    // Initial mock stock distribution
    INITIAL_PRODUCTS.forEach(p => {
      inventoryMap['store-saraswathi'][p.id] = p.stock;
      inventoryMap['store-hebbal'][p.id] = p.id === 'prod-esp32-v1' ? 0 : Math.max(0, p.stock - 5);
      inventoryMap['store-vidya'][p.id] = Math.max(0, p.stock - 2);
    });
    return inventoryMap;
  }

  try {
    let query = supabase.from('store_inventory').select('*');
    if (storeId) {
      query = query.eq('store_id', storeId);
    }
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      console.warn('Supabase store_inventory fetch returned no rows or error:', error?.message);
      // Fallback
      INITIAL_PRODUCTS.forEach(p => {
        inventoryMap['store-saraswathi'][p.id] = p.stock;
        inventoryMap['store-hebbal'][p.id] = p.id === 'prod-esp32-v1' ? 0 : Math.max(0, p.stock - 5);
        inventoryMap['store-vidya'][p.id] = Math.max(0, p.stock - 2);
      });
      return inventoryMap;
    }

    data.forEach((row: any) => {
      if (!inventoryMap[row.store_id]) {
        inventoryMap[row.store_id] = {};
      }
      inventoryMap[row.store_id][row.product_id] = Number(row.quantity);
    });

    return inventoryMap;
  } catch (err) {
    console.error('Failed to fetch inventory from Supabase:', err);
    return inventoryMap;
  }
}

// 5. Fetch Products (with inventory for selected store)
export async function fetchProductsFromDb(storeId: string = 'store-saraswathi'): Promise<Product[]> {
  if (!isSupabaseConfigured) {
    return INITIAL_PRODUCTS;
  }

  try {
    // Fetch products
    const { data: prodData, error: prodErr } = await supabase
      .from('products')
      .select('*')
      .eq('active', true)
      .order('name');

    if (prodErr || !prodData || prodData.length === 0) {
      console.warn('Supabase products fetch failed or empty, fallback to seed products:', prodErr?.message);
      return INITIAL_PRODUCTS;
    }

    // Fetch store inventory for the active store
    const { data: invData } = await supabase
      .from('store_inventory')
      .select('product_id, quantity')
      .eq('store_id', storeId);

    const invLookup = new Map<string, number>();
    if (invData) {
      invData.forEach((row: any) => {
        invLookup.set(row.product_id, Number(row.quantity));
      });
    }

    return prodData.map((row: any) => {
      const stock = invLookup.has(row.id) ? invLookup.get(row.id)! : 10;
      return mapDbProductToProduct(row, stock);
    });
  } catch (err) {
    console.error('Failed to fetch products from Supabase:', err);
    return INITIAL_PRODUCTS;
  }
}

// 6. Fetch Project Kits (including linked real products via project_kit_items)
export async function fetchProjectKitsFromDb(): Promise<ProjectKit[]> {
  if (!isSupabaseConfigured) {
    return INITIAL_PROJECT_KITS;
  }

  try {
    const { data: kits, error: kitErr } = await supabase
      .from('project_kits')
      .select('*')
      .eq('active', true)
      .order('price');

    if (kitErr || !kits || kits.length === 0) {
      return INITIAL_PROJECT_KITS;
    }

    // Fetch project_kit_items joined with products
    const { data: kitItems, error: itemsErr } = await supabase
      .from('project_kit_items')
      .select('project_kit_id, quantity, products(id, name, price)');

    const itemsByKitId = new Map<string, any[]>();
    if (kitItems && !itemsErr) {
      kitItems.forEach((ki: any) => {
        const list = itemsByKitId.get(ki.project_kit_id) || [];
        list.push({
          productId: ki.products?.id || ki.product_id,
          productName: ki.products?.name || 'Electronic Component',
          quantity: ki.quantity || 1,
          unitPrice: Number(ki.products?.price || 0)
        });
        itemsByKitId.set(ki.project_kit_id, list);
      });
    }

    return kits.map((k: any) => {
      const components = itemsByKitId.get(k.id) || [];
      return {
        id: k.id,
        name: k.name,
        tagline: k.tagline,
        description: k.description,
        image: k.image,
        difficulty: k.difficulty,
        estimatedBuildTime: k.estimated_build_time,
        components: components.length > 0 ? components : (INITIAL_PROJECT_KITS.find(ik => ik.id === k.id)?.components || []),
        price: Number(k.price),
        originalPrice: Number(k.original_price),
        savings: Number(k.savings || (k.original_price - k.price)),
        deliveryEstimateMin: k.delivery_estimate_min || 20,
        guideSteps: k.guide_steps || [],
        skillsLearned: k.skills_learned || []
      };
    });
  } catch (err) {
    console.error('Failed to fetch project kits from Supabase:', err);
    return INITIAL_PROJECT_KITS;
  }
}

// 7. Fetch Reviews
export async function fetchReviewsFromDb(productId?: string): Promise<Review[]> {
  if (!isSupabaseConfigured) {
    return productId ? INITIAL_REVIEWS.filter(r => r.productId === productId) : INITIAL_REVIEWS;
  }

  try {
    let query = supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (productId) {
      query = query.eq('product_id', productId);
    }
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return INITIAL_REVIEWS;
    }
    return data.map((r: any) => ({
      id: r.id,
      productId: r.product_id,
      userName: r.user_name,
      userRole: r.user_role || 'Verified Maker, Mysuru',
      rating: Number(r.rating),
      date: new Date(r.created_at).toLocaleDateString('en-IN'),
      comment: r.comment,
      verifiedBuyer: r.verified_buyer ?? true
    }));
  } catch (err) {
    console.error('Failed to fetch reviews from Supabase:', err);
    return INITIAL_REVIEWS;
  }
}

// 8. Saved Addresses
export async function fetchUserAddressesFromDb(userId: string): Promise<Address[]> {
  if (!isSupabaseConfigured || !userId) {
    return DEFAULT_SAVED_ADDRESSES;
  }

  try {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return DEFAULT_SAVED_ADDRESSES;
    }

    return data.map((a: any) => ({
      id: a.id,
      label: a.label || 'Hostel',
      tag: a.label || 'Hostel',
      recipientName: a.recipient_name,
      name: a.recipient_name,
      phone: a.phone,
      addressLine: a.address_line,
      area: a.area,
      city: a.city || 'Mysuru',
      pincode: a.pincode,
      landmark: a.landmark || '',
      isDefault: a.is_default || false
    }));
  } catch (err) {
    console.error('Failed to fetch user addresses from Supabase:', err);
    return DEFAULT_SAVED_ADDRESSES;
  }
}

export async function saveAddressToDb(userId: string, address: Omit<Address, 'id'>): Promise<Address> {
  const newId = `addr-${Date.now()}`;
  if (!isSupabaseConfigured || !userId) {
    return { ...address, id: newId };
  }

  try {
    const { data, error } = await supabase
      .from('addresses')
      .insert([
        {
          user_id: userId,
          label: address.label || address.tag || 'Hostel',
          recipient_name: address.recipientName || address.name || 'Student',
          phone: address.phone,
          address_line: address.addressLine,
          area: address.area,
          city: address.city || 'Mysuru',
          pincode: address.pincode,
          landmark: address.landmark || '',
          is_default: address.isDefault || false
        }
      ])
      .select()
      .single();

    if (error || !data) {
      console.warn('Failed to insert address into Supabase, using local fallback:', error?.message);
      return { ...address, id: newId };
    }

    return {
      id: data.id,
      label: data.label,
      tag: data.label,
      recipientName: data.recipient_name,
      name: data.recipient_name,
      phone: data.phone,
      addressLine: data.address_line,
      area: data.area,
      city: data.city,
      pincode: data.pincode,
      landmark: data.landmark,
      isDefault: data.is_default
    };
  } catch (err) {
    console.error('Error saving address to Supabase:', err);
    return { ...address, id: newId };
  }
}

// 9. Orders
export async function fetchOrdersFromDb(userId?: string, isAdmin: boolean = false): Promise<Order[]> {
  if (!isSupabaseConfigured) {
    return INITIAL_ORDERS;
  }

  try {
    let query = supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    if (!isAdmin && userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return INITIAL_ORDERS;
    }

    return data.map((o: any) => ({
      id: o.id,
      userId: o.user_id || 'guest',
      customerName: o.customer_name,
      phone: o.phone,
      deliveryAddress: o.delivery_address,
      shippingAddress: o.shipping_address || o.delivery_address,
      items: (o.order_items || []).map((it: any) => ({
        productId: it.product_id,
        productName: it.product_name,
        sku: it.sku,
        image: it.image,
        price: Number(it.price),
        quantity: Number(it.quantity),
        unitPrice: Number(it.unit_price || it.price),
        totalPrice: Number(it.total_price || (it.price * it.quantity))
      })),
      subtotal: Number(o.subtotal),
      deliveryFee: Number(o.delivery_fee),
      discount: Number(o.discount),
      total: Number(o.total),
      paymentMethod: o.payment_method,
      paymentStatus: o.payment_status,
      orderStatus: o.status,
      status: o.status,
      storeId: o.store_id || 'store-saraswathi',
      storeName: o.store_name || 'CircuitRush Hub A',
      estimatedDeliveryMin: o.estimated_delivery_mins || 20,
      estimatedDeliveryMins: o.estimated_delivery_mins || 20,
      createdAt: o.created_at,
      updatedAt: o.updated_at,
      riderInfo: o.rider_info,
      deliveryPartner: o.delivery_partner || o.rider_info
    }));
  } catch (err) {
    console.error('Failed to fetch orders from Supabase:', err);
    return INITIAL_ORDERS;
  }
}

// 10. Place Order with Inventory Validation & Deduction
export async function placeOrderInSupabase({
  orderId,
  userId,
  storeId,
  storeName,
  customerName,
  phone,
  address,
  cart,
  subtotal,
  deliveryFee,
  discount,
  total,
  paymentMethod,
  deliveryTimeEstimate,
  riderInfo
}: {
  orderId: string;
  userId?: string;
  storeId: string;
  storeName: string;
  customerName: string;
  phone: string;
  address: Address;
  cart: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: 'UPI' | 'Card' | 'COD' | 'upi' | 'card' | 'cod';
  deliveryTimeEstimate: number;
  riderInfo: any;
}): Promise<{ success: boolean; order?: Order; error?: string }> {
  const normMethod = paymentMethod.toUpperCase() as 'UPI' | 'Card' | 'COD';

  const orderObj: Order = {
    id: orderId,
    userId: userId || 'demo-student-uuid',
    customerName,
    phone,
    deliveryAddress: address,
    shippingAddress: address,
    items: cart.map(c => ({
      productId: c.product.id,
      productName: c.product.name,
      sku: c.product.sku,
      image: c.product.image,
      price: c.product.price,
      quantity: c.quantity,
      unitPrice: c.product.price,
      totalPrice: c.product.price * c.quantity
    })),
    subtotal,
    deliveryFee,
    discount,
    total,
    paymentMethod: normMethod,
    paymentStatus: normMethod === 'COD' ? 'Pending' : 'Paid',
    orderStatus: 'Placed',
    status: 'Placed',
    storeId,
    storeName,
    estimatedDeliveryMin: deliveryTimeEstimate,
    estimatedDeliveryMins: deliveryTimeEstimate,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    riderInfo,
    deliveryPartner: riderInfo
  };

  if (!isSupabaseConfigured) {
    return { success: true, order: orderObj };
  }

  try {
    // 1. Validate inventory for each item in the store
    for (const item of cart) {
      const { data: inv, error: invErr } = await supabase
        .from('store_inventory')
        .select('quantity')
        .eq('store_id', storeId)
        .eq('product_id', item.product.id)
        .maybeSingle();

      if (!invErr && inv) {
        if (inv.quantity < item.quantity) {
          return {
            success: false,
            error: `Insufficient stock for "${item.product.name}" at ${storeName}. Available: ${inv.quantity}, Requested: ${item.quantity}.`
          };
        }
      }
    }

    // 2. Insert into orders table
    const { error: orderInsertErr } = await supabase.from('orders').insert([
      {
        id: orderId,
        user_id: (userId && userId.length > 20) ? userId : null,
        store_id: storeId,
        customer_name: customerName,
        phone,
        delivery_address: address,
        shipping_address: address,
        subtotal,
        delivery_fee: deliveryFee,
        discount,
        total,
        payment_method: normMethod,
        payment_status: normMethod === 'COD' ? 'Pending' : 'Paid',
        status: 'Placed',
        order_status: 'Placed',
        store_name: storeName,
        estimated_delivery_mins: deliveryTimeEstimate,
        rider_info: riderInfo,
        delivery_partner: riderInfo
      }
    ]);

    if (orderInsertErr) {
      console.warn('Orders insert returned error:', orderInsertErr.message);
      // Even if foreign key check fails due to guest user, return safe order
      return { success: true, order: orderObj };
    }

    // 3. Insert order items
    const orderItemsRows = cart.map(c => ({
      order_id: orderId,
      product_id: c.product.id,
      product_name: c.product.name,
      sku: c.product.sku,
      image: c.product.image,
      price: c.product.price,
      quantity: c.quantity,
      unit_price: c.product.price,
      total_price: c.product.price * c.quantity
    }));

    await supabase.from('order_items').insert(orderItemsRows);

    // 4. Safely deduct inventory for each item
    for (const item of cart) {
      // Try atomic RPC first
      const { error: rpcErr } = await supabase.rpc('deduct_store_inventory', {
        p_store_id: storeId,
        p_product_id: item.product.id,
        p_quantity: item.quantity
      });

      if (rpcErr) {
        // Fallback: direct update if RPC is missing
        const { data: currentInv } = await supabase
          .from('store_inventory')
          .select('quantity')
          .eq('store_id', storeId)
          .eq('product_id', item.product.id)
          .maybeSingle();

        if (currentInv) {
          const newQty = Math.max(0, currentInv.quantity - item.quantity);
          await supabase
            .from('store_inventory')
            .update({ quantity: newQty, updated_at: new Date().toISOString() })
            .eq('store_id', storeId)
            .eq('product_id', item.product.id);
        }
      }
    }

    // 5. Insert payment record
    await supabase.from('payments').insert([
      {
        order_id: orderId,
        user_id: (userId && userId.length > 20) ? userId : null,
        amount: total,
        method: normMethod,
        status: normMethod === 'COD' ? 'pending' : 'completed',
        transaction_ref: `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`
      }
    ]);

    return { success: true, order: orderObj };
  } catch (err: any) {
    console.error('Error placing order in Supabase:', err);
    return { success: true, order: orderObj };
  }
}

// 11. Admin: Update Order Status
export async function updateOrderStatusInDb(orderId: string, status: string): Promise<boolean> {
  if (!isSupabaseConfigured) {
    return true;
  }
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status, order_status: status, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) {
      console.error('Failed to update order status in Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exception updating order status:', err);
    return false;
  }
}

// 12. Admin: Update Product or Store Inventory
export async function updateStoreInventoryInDb(
  storeId: string,
  productId: string,
  quantity: number
): Promise<boolean> {
  if (!isSupabaseConfigured) {
    return true;
  }
  try {
    const { error } = await supabase
      .from('store_inventory')
      .upsert(
        {
          store_id: storeId,
          product_id: productId,
          quantity: Math.max(0, quantity),
          updated_at: new Date().toISOString()
        },
        { onConflict: 'store_id,product_id' }
      );

    if (error) {
      console.error('Failed to update store inventory in Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exception updating store inventory:', err);
    return false;
  }
}

export async function updateProductPriceInDb(productId: string, newPrice: number): Promise<boolean> {
  if (!isSupabaseConfigured) {
    return true;
  }
  try {
    const { error } = await supabase
      .from('products')
      .update({ price: newPrice, updated_at: new Date().toISOString() })
      .eq('id', productId);

    if (error) {
      console.error('Failed to update product price in Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Exception updating product price:', err);
    return false;
  }
}

export async function createProductInDb(product: Product): Promise<boolean> {
  if (!isSupabaseConfigured) {
    return true;
  }
  try {
    const { error } = await supabase.from('products').insert([
      {
        id: product.id,
        sku: product.sku,
        name: product.name,
        category: product.category,
        price: product.price,
        original_price: product.originalPrice || product.price,
        image: product.image,
        description: product.description,
        specifications: product.specifications || {},
        pin_info: product.pinInfo || [],
        compatible_boards: product.compatibleBoards || [],
        recommended_projects: product.recommendedProjects || [],
        frequently_bought_together_ids: product.frequentlyBoughtTogetherIds || [],
        tags: product.tags || [],
        module_code: product.moduleCode || null,
        active: true
      }
    ]);

    if (error) {
      console.error('Failed to insert product in Supabase:', error);
      return false;
    }

    // Seed inventory across all 3 hubs
    await supabase.from('store_inventory').insert([
      { store_id: 'store-saraswathi', product_id: product.id, quantity: product.stock },
      { store_id: 'store-hebbal', product_id: product.id, quantity: Math.max(0, product.stock - 5) },
      { store_id: 'store-vidya', product_id: product.id, quantity: Math.max(0, product.stock - 2) }
    ]);

    return true;
  } catch (err) {
    console.error('Exception creating product in Supabase:', err);
    return false;
  }
}

// 13. Profile & Role Management via Supabase
export async function fetchProfileFromDb(userId: string): Promise<UserProfile | null> {
  if (!isSupabaseConfigured || !userId) {
    return null;
  }
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      name: data.full_name || 'Maker',
      email: data.email,
      phone: data.phone || '+91 98450 12345',
      institution: data.institution || 'Engineering / Maker in Mysuru',
      role: data.role === 'admin' ? 'admin' : 'customer',
      savedAddresses: []
    };
  } catch (err) {
    console.error('Failed to fetch profile from Supabase:', err);
    return null;
  }
}
