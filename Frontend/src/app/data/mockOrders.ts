export type OrderStatus = "pending" | "confirmed" | "shipping" | "delivered" | "cancelled" | "returned";

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  shopName: string;
  price: number;
  quantity: number;
  variant?: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  address: {
    name: string;
    phone: string;
    street: string;
    district: string;
    city: string;
  };
  paymentMethod: "cod" | "bank" | "momo" | "zalopay";
  note?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingCode?: string;
}

export const statusLabel: Record<OrderStatus, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  shipping: "Đang giao hàng",
  delivered: "Đã giao hàng",
  cancelled: "Đã hủy",
  returned: "Trả hàng",
};

export const statusColor: Record<OrderStatus, string> = {
  pending:   "text-yellow-600 bg-yellow-50 border-yellow-200",
  confirmed: "text-blue-600 bg-blue-50 border-blue-200",
  shipping:  "text-orange-600 bg-orange-50 border-orange-200",
  delivered: "text-green-600 bg-green-50 border-green-200",
  cancelled: "text-red-600 bg-red-50 border-red-200",
  returned:  "text-gray-600 bg-gray-50 border-gray-200",
};

export const mockOrders: Order[] = [
  {
    id: "ORD-20260722-007",
    status: "pending",
    items: [
      { id: "i9", productId: "food-com-suon", productName: "Cơm tấm sườn bì chả", productImage: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=400&q=80", shopName: "Cơm Tấm Sài Gòn", price: 65000, quantity: 2 },
      { id: "i10", productId: "food-tra-dao", productName: "Trà đào cam sả", productImage: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=400&q=80", shopName: "Cơm Tấm Sài Gòn", price: 25000, quantity: 1 },
    ],
    subtotal: 155000, shippingFee: 18000, discount: 15000, total: 158000,
    address: { name: "Nguyễn Văn An", phone: "0901234567", street: "123 Nguyễn Huệ", district: "Quận 1", city: "TP. Hồ Chí Minh" },
    paymentMethod: "cod",
    note: "Ít cơm, thêm nước mắm",
    createdAt: "2026-07-22T11:20:00", updatedAt: "2026-07-22T11:20:00",
    estimatedDelivery: "2026-07-22T12:00:00",
  },
  {
    id: "ORD-20260701-001",
    status: "delivered",
    items: [
      { id: "i1", productId: "food-pho-bo", productName: "Phở bò tái đặc biệt", productImage: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=400&q=80", shopName: "Phở Bát Đàn", price: 65000, quantity: 2 },
      { id: "i2", productId: "food-quay", productName: "Quẩy giòn", productImage: "https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=400&q=80", shopName: "Phở Bát Đàn", price: 10000, quantity: 2 },
    ],
    subtotal: 150000, shippingFee: 18000, discount: 20000, total: 148000,
    address: { name: "Nguyễn Văn An", phone: "0901234567", street: "123 Nguyễn Huệ", district: "Quận 1", city: "TP. Hồ Chí Minh" },
    paymentMethod: "bank",
    createdAt: "2026-07-01T10:30:00", updatedAt: "2026-07-04T15:00:00",
    trackingCode: "GHN-ABC123456",
  },
  {
    id: "ORD-20260705-002",
    status: "shipping",
    items: [
      { id: "i3", productId: "food-bun-bo", productName: "Bún bò Huế đặc biệt", productImage: "https://images.unsplash.com/photo-1576577445504-6af96477db52?auto=format&fit=crop&w=400&q=80", shopName: "Bún Bò Cô Lan", price: 70000, quantity: 1 },
      { id: "i4", productId: "food-cha-gio", productName: "Chả giò hải sản", productImage: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=400&q=80", shopName: "Bún Bò Cô Lan", price: 35000, quantity: 1 },
    ],
    subtotal: 105000, shippingFee: 20000, discount: 10000, total: 115000,
    address: { name: "Nguyễn Văn An", phone: "0901234567", street: "123 Nguyễn Huệ", district: "Quận 1", city: "TP. Hồ Chí Minh" },
    paymentMethod: "momo",
    createdAt: "2026-07-05T09:15:00", updatedAt: "2026-07-06T08:00:00",
    estimatedDelivery: "2026-07-08",
    trackingCode: "GHTK-XYZ789",
  },
  {
    id: "ORD-20260708-003",
    status: "confirmed",
    items: [
      { id: "i5", productId: "food-banh-mi", productName: "Bánh mì bò nướng sốt tiêu", productImage: "https://images.unsplash.com/photo-1600454309261-3dc9b7597637?auto=format&fit=crop&w=400&q=80", shopName: "Bánh Mì Hoa Phát", price: 45000, quantity: 2, variant: "Không cay" },
    ],
    subtotal: 90000, shippingFee: 18000, discount: 10000, total: 98000,
    address: { name: "Nguyễn Văn An", phone: "0901234567", street: "123 Nguyễn Huệ", district: "Quận 1", city: "TP. Hồ Chí Minh" },
    paymentMethod: "cod",
    note: "Giao giờ hành chính",
    createdAt: "2026-07-08T14:20:00", updatedAt: "2026-07-08T15:00:00",
    estimatedDelivery: "2026-07-11",
  },
  {
    id: "ORD-20260710-004",
    status: "pending",
    items: [
      { id: "i6", productId: "food-ga-ran", productName: "Combo gà rán giòn cay", productImage: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=400&q=80", shopName: "Gà Rán Thu Hương", price: 99000, quantity: 1, variant: "2 miếng gà + khoai + nước" },
    ],
    subtotal: 99000, shippingFee: 22000, discount: 15000, total: 106000,
    address: { name: "Nguyễn Văn An", phone: "0901234567", street: "123 Nguyễn Huệ", district: "Quận 1", city: "TP. Hồ Chí Minh" },
    paymentMethod: "bank",
    createdAt: "2026-07-10T11:00:00", updatedAt: "2026-07-10T11:00:00",
    estimatedDelivery: "2026-07-13",
  },
  {
    id: "ORD-20260703-005",
    status: "cancelled",
    items: [
      { id: "i7", productId: "food-lau-thai", productName: "Lẩu Thái hải sản", productImage: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=400&q=80", shopName: "Lẩu Thái Cô Nga", price: 249000, quantity: 1, variant: "Phần 2 người" },
    ],
    subtotal: 249000, shippingFee: 25000, discount: 30000, total: 244000,
    address: { name: "Nguyễn Văn An", phone: "0901234567", street: "123 Nguyễn Huệ", district: "Quận 1", city: "TP. Hồ Chí Minh" },
    paymentMethod: "zalopay",
    createdAt: "2026-07-03T16:45:00", updatedAt: "2026-07-03T18:00:00",
  },
  {
    id: "ORD-20260629-006",
    status: "returned",
    items: [
      { id: "i8", productId: "food-sushi", productName: "Sushi cá hồi tổng hợp", productImage: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80", shopName: "Sushi Nhà Làm", price: 135000, quantity: 1, variant: "12 miếng" },
    ],
    subtotal: 135000, shippingFee: 20000, discount: 0, total: 155000,
    address: { name: "Nguyễn Văn An", phone: "0901234567", street: "123 Nguyễn Huệ", district: "Quận 1", city: "TP. Hồ Chí Minh" },
    paymentMethod: "momo",
    note: "Món giao thiếu phần nước chấm",
    createdAt: "2026-06-29T13:30:00", updatedAt: "2026-07-02T10:00:00",
  },
];
