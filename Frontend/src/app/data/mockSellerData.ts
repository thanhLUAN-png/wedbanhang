// Mock data for Seller Portal (food-themed)

// Mã tỉnh/thành phố (theo chuẩn Việt Nam)
export const PROVINCE_CODES: Record<string, string> = {
  "TP. Hồ Chí Minh": "79",
  "Hà Nội": "01",
  "Long An": "62",
  "Bình Dương": "74",
  "Đồng Nai": "75",
  "Cần Thơ": "92",
  "Đà Nẵng": "48",
};

/**
 * Tạo mã đơn hàng theo format: {MãTỉnh(2)}{Ngày(2)}{Tháng(2)}{Năm(2)}{STT(4)}
 * Ví dụ: Long An + 13/07/2026 + đơn thứ 1 → 621307260001
 */
export function generateOrderCode(province: string, date: Date, sequence: number): string {
  const provinceCode = PROVINCE_CODES[province] ?? "79";
  const dd   = String(date.getDate()).padStart(2, "0");
  const mm   = String(date.getMonth() + 1).padStart(2, "0");
  const yy   = String(date.getFullYear()).slice(-2);
  const stt  = String(sequence).padStart(4, "0");
  return `${provinceCode}${dd}${mm}${yy}${stt}`;
}

export type SellerOrderStatus = "pending" | "confirmed" | "shipping" | "completed" | "returned" | "cancelled";

export interface SellerOrderItem {
  id: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  variant?: string;
}

export interface SellerOrder {
  id: string;           // Mã nội bộ (ORD-001...)
  orderCode: string;    // Mã hiển thị cho khách: {MãTỉnh}{DD}{MM}{YY}{STT}
  customer: { name: string; phone: string; address: string; city: string };
  items: SellerOrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: SellerOrderStatus;
  paymentMethod: "cod" | "bank" | "momo" | "zalopay";
  note?: string;
  shipperName?: string;
  createdAt: string;
}

export const sellerStatusLabel: Record<SellerOrderStatus, string> = {
  pending:   "Chờ xác nhận",
  confirmed: "Đang chuẩn bị",
  shipping:  "Đang giao",
  completed: "Hoàn thành",
  returned:  "Trả hàng",
  cancelled: "Đã hủy",
};

export const sellerStatusColor: Record<SellerOrderStatus, string> = {
  pending:   "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipping:  "bg-orange-100 text-orange-700",
  completed: "bg-green-100 text-green-700",
  returned:  "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
};

export const mockSellerOrders: SellerOrder[] = [
  {
    id: "ORD-001",
    orderCode: generateOrderCode("TP. Hồ Chí Minh", new Date("2026-07-13"), 1), // 791307260001
    customer: { name: "Nguyễn Văn An", phone: "0901234567", address: "123 Nguyễn Huệ, Q.1", city: "TP. Hồ Chí Minh" },
    items: [
      { id: "i1", productName: "Cơm Sườn Nướng", productImage: "https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?w=100&h=100&fit=crop", price: 35000, quantity: 2 },
      { id: "i2", productName: "Chả Giò Tôm Cua", productImage: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=100&h=100&fit=crop", price: 25000, quantity: 1 },
    ],
    subtotal: 95000, shippingFee: 15000, discount: 0, total: 110000,
    status: "pending", paymentMethod: "cod",
    shipperName: "Trần Shipper B",
    note: "Không hành, thêm nhiều tương ớt",
    createdAt: "2026-07-13T20:55:00",
  },
  {
    id: "ORD-002",
    orderCode: generateOrderCode("TP. Hồ Chí Minh", new Date("2026-07-13"), 2), // 791307260002
    customer: { name: "Trần Thị Bích", phone: "0912345678", address: "456 Lê Lợi, Q.3", city: "TP. Hồ Chí Minh" },
    items: [
      { id: "i3", productName: "Cơm Gà Xối Mỡ", productImage: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=100&h=100&fit=crop", price: 40000, quantity: 1 },
      { id: "i4", productName: "Canh Chua Cá Lóc", productImage: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=100&h=100&fit=crop", price: 30000, quantity: 1 },
    ],
    subtotal: 70000, shippingFee: 15000, discount: 10000, total: 75000,
    status: "pending", paymentMethod: "momo",
    createdAt: "2026-07-13T20:40:00",
  },
  {
    id: "ORD-003",
    orderCode: generateOrderCode("TP. Hồ Chí Minh", new Date("2026-07-13"), 3), // 791307260003
    customer: { name: "Lê Minh Tuấn", phone: "0987654321", address: "789 CMT8, Q.10", city: "TP. Hồ Chí Minh" },
    items: [
      { id: "i5", productName: "Cơm Chiên Hải Sản", productImage: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=100&h=100&fit=crop", price: 45000, quantity: 2 },
    ],
    subtotal: 90000, shippingFee: 0, discount: 0, total: 90000,
    status: "confirmed", paymentMethod: "bank",
    createdAt: "2026-07-13T19:30:00",
  },
  {
    id: "ORD-004",
    orderCode: generateOrderCode("TP. Hồ Chí Minh", new Date("2026-07-13"), 4), // 791307260004
    customer: { name: "Phạm Ngọc Mai", phone: "0966777888", address: "12 Hoàng Diệu, Q.4", city: "TP. Hồ Chí Minh" },
    items: [
      { id: "i6", productName: "Phở Bò Tái Nạm", productImage: "https://images.unsplash.com/photo-1503764654157-72d979d9af2f?w=100&h=100&fit=crop", price: 55000, quantity: 1 },
      { id: "i7", productName: "Cơm Sườn Nướng", productImage: "https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?w=100&h=100&fit=crop", price: 35000, quantity: 1 },
    ],
    subtotal: 90000, shippingFee: 15000, discount: 0, total: 105000,
    status: "shipping", paymentMethod: "cod",
    shipperName: "Trần Shipper B",
    createdAt: "2026-07-13T18:15:00",
  },
  {
    id: "ORD-005",
    orderCode: generateOrderCode("TP. Hồ Chí Minh", new Date("2026-07-13"), 5), // 791307260005
    customer: { name: "Vũ Đức Hải", phone: "0944333222", address: "34 Đinh Tiên Hoàng, Bình Thạnh", city: "TP. Hồ Chí Minh" },
    items: [
      { id: "i8", productName: "Bún Bò Huế", productImage: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=100&h=100&fit=crop", price: 50000, quantity: 3 },
    ],
    subtotal: 150000, shippingFee: 15000, discount: 20000, total: 145000,
    status: "completed", paymentMethod: "zalopay",
    shipperName: "Lê Shipper C",
    createdAt: "2026-07-13T11:00:00",
  },
  {
    id: "ORD-006",
    orderCode: generateOrderCode("TP. Hồ Chí Minh", new Date("2026-07-12"), 1), // 791207260001
    customer: { name: "Hoàng Thu Hà", phone: "0933666555", address: "56 Phan Xích Long, Phú Nhuận", city: "TP. Hồ Chí Minh" },
    items: [
      { id: "i9", productName: "Cơm Gà Xối Mỡ", productImage: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=100&h=100&fit=crop", price: 40000, quantity: 1 },
    ],
    subtotal: 40000, shippingFee: 15000, discount: 0, total: 55000,
    status: "returned", paymentMethod: "cod",
    shipperName: "Lê Shipper C",
    note: "Shipper giao nhầm, nhận được cơm chiên thay vì cơm gà",
    createdAt: "2026-07-12T14:30:00",
  },
  {
    id: "ORD-007",
    orderCode: generateOrderCode("Hà Nội", new Date("2026-07-13"), 6),
    customer: { name: "Nguyễn Minh Nhật", phone: "0981112222", address: "125 Thái Hà, Đống Đa", city: "Hà Nội" },
    items: [
      { id: "i10", productName: "Phở Bò Tái Nạm", productImage: "https://images.unsplash.com/photo-1503764654157-72d979d9af2f?w=100&h=100&fit=crop", price: 55000, quantity: 2 },
    ],
    subtotal: 110000, shippingFee: 20000, discount: 0, total: 130000,
    status: "pending", paymentMethod: "momo",
    createdAt: "2026-07-13T21:05:00",
  },
  {
    id: "ORD-008",
    orderCode: generateOrderCode("TP. Hồ Chí Minh", new Date("2026-07-13"), 7),
    customer: { name: "Lý Hải", phone: "0977888999", address: "KĐT Sala, Quận 2", city: "TP. Hồ Chí Minh" },
    items: [
      { id: "i11", productName: "Cơm Sườn Nướng", productImage: "https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?w=100&h=100&fit=crop", price: 35000, quantity: 4 },
    ],
    subtotal: 140000, shippingFee: 15000, discount: 15000, total: 140000,
    status: "confirmed", paymentMethod: "bank",
    shipperName: "Hoàng Shipper D",
    createdAt: "2026-07-13T20:10:00",
  },
  {
    id: "ORD-009",
    orderCode: generateOrderCode("Long An", new Date("2026-07-13"), 1),
    customer: { name: "Trương Mỹ Lan", phone: "0902223333", address: "Bến Lức", city: "Long An" },
    items: [
      { id: "i12", productName: "Canh Chua Cá Lóc", productImage: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=100&h=100&fit=crop", price: 30000, quantity: 1 },
      { id: "i13", productName: "Chả Giò Tôm Cua", productImage: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=100&h=100&fit=crop", price: 25000, quantity: 2 },
    ],
    subtotal: 80000, shippingFee: 25000, discount: 0, total: 105000,
    status: "shipping", paymentMethod: "cod",
    shipperName: "Đinh Shipper E",
    note: "Gọi trước khi giao 15p nha",
    createdAt: "2026-07-13T19:45:00",
  },
  {
    id: "ORD-010",
    orderCode: generateOrderCode("Đồng Nai", new Date("2026-07-13"), 2),
    customer: { name: "Đỗ Bảo", phone: "0966444555", address: "Biên Hòa", city: "Đồng Nai" },
    items: [
      { id: "i14", productName: "Bún Bò Huế", productImage: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=100&h=100&fit=crop", price: 50000, quantity: 1 },
    ],
    subtotal: 50000, shippingFee: 30000, discount: 0, total: 80000,
    status: "pending", paymentMethod: "cod",
    createdAt: "2026-07-13T21:15:00",
  },
  {
    id: "ORD-011",
    orderCode: generateOrderCode("Bình Dương", new Date("2026-07-13"), 3),
    customer: { name: "Bùi Tiến Dũng", phone: "0911555666", address: "Dĩ An", city: "Bình Dương" },
    items: [
      { id: "i15", productName: "Cơm Chiên Hải Sản", productImage: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=100&h=100&fit=crop", price: 45000, quantity: 3 },
    ],
    subtotal: 135000, shippingFee: 20000, discount: 0, total: 155000,
    status: "completed", paymentMethod: "zalopay",
    shipperName: "Ngô Shipper F",
    createdAt: "2026-07-13T12:20:00",
  },
  {
    id: "ORD-012",
    orderCode: generateOrderCode("TP. Hồ Chí Minh", new Date("2026-07-13"), 8),
    customer: { name: "Cao Thắng", phone: "0988777999", address: "Quận 7", city: "TP. Hồ Chí Minh" },
    items: [
      { id: "i16", productName: "Cơm Gà Xối Mỡ", productImage: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=100&h=100&fit=crop", price: 40000, quantity: 2 },
    ],
    subtotal: 80000, shippingFee: 15000, discount: 0, total: 95000,
    status: "cancelled", paymentMethod: "cod",
    shipperName: "Phan Shipper G",
    note: "Giao trễ quá nên khách hủy",
    createdAt: "2026-07-13T10:05:00",
  },
  {
    id: "ORD-013",
    orderCode: generateOrderCode("TP. Hồ Chí Minh", new Date("2026-07-13"), 9),
    customer: { name: "Nguyễn Thị Lớn", phone: "0909090909", address: "Quận 1", city: "TP. Hồ Chí Minh" },
    items: [
      { id: "i17", productName: "Cơm Sườn Nướng", productImage: "https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?w=100&h=100&fit=crop", price: 35000, quantity: 2 },
      { id: "i18", productName: "Cơm Gà Xối Mỡ", productImage: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=100&h=100&fit=crop", price: 40000, quantity: 1 },
      { id: "i19", productName: "Canh Chua Cá Lóc", productImage: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=100&h=100&fit=crop", price: 30000, quantity: 1 },
      { id: "i20", productName: "Chả Giò Tôm Cua", productImage: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=100&h=100&fit=crop", price: 25000, quantity: 1 },
      { id: "i21", productName: "Bún Bò Huế", productImage: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=100&h=100&fit=crop", price: 50000, quantity: 1 },
    ],
    subtotal: 215000, shippingFee: 15000, discount: 0, total: 230000,
    status: "pending", paymentMethod: "momo",
    note: "Cho nhiều nước mắm",
    createdAt: "2026-07-13T22:00:00",
  },
];

// Revenue chart mock data
export const revenueData = [
  { day: "T2", revenue: 850000 },
  { day: "T3", revenue: 1200000 },
  { day: "T4", revenue: 950000 },
  { day: "T5", revenue: 1450000 },
  { day: "T6", revenue: 1800000 },
  { day: "T7", revenue: 2200000 },
  { day: "CN", revenue: 1650000 },
];

// Top selling products
export const topProducts = [
  { name: "Cơm Sườn Nướng", sold: 124, revenue: 4340000, image: "https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?w=60&h=60&fit=crop" },
  { name: "Cơm Gà Xối Mỡ", sold: 98, revenue: 3920000, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=60&h=60&fit=crop" },
  { name: "Phở Bò Tái Nạm", sold: 87, revenue: 4785000, image: "https://images.unsplash.com/photo-1503764654157-72d979d9af2f?w=60&h=60&fit=crop" },
  { name: "Bún Bò Huế", sold: 72, revenue: 3600000, image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=60&h=60&fit=crop" },
  { name: "Cơm Chiên Hải Sản", sold: 65, revenue: 2925000, image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=60&h=60&fit=crop" },
];

export function generateDailyRevenue() {
  const data = [];
  const now = new Date();
  for (let i = 30; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    data.push({
      date: `${d.getDate()}/${d.getMonth() + 1}`,
      revenue: Math.floor(Math.random() * 2000000) + 1000000,
      orders: Math.floor(Math.random() * 20) + 10,
    });
  }
  return data;
}

export function generateMonthlyRevenue() {
  const months = ['Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7'];
  return months.map(month => ({
    month,
    revenue: Math.floor(Math.random() * 50000000) + 20000000,
    expense: Math.floor(Math.random() * 20000000) + 10000000,
  }));
}

export type Transaction = {
  id: string;
  type: 'revenue' | 'expense';
  amount: number;
  date: string;
  description: string;
  status: 'completed' | 'pending' | 'failed';
};

export const mockTransactions: Transaction[] = [
  { id: 'TXN-001', type: 'revenue', amount: 1500000, date: '13/07/2026', description: 'Rút tiền doanh thu ngày 12/07', status: 'completed' },
  { id: 'TXN-002', type: 'expense', amount: 50000, date: '13/07/2026', description: 'Phí dịch vụ nền tảng', status: 'completed' },
  { id: 'TXN-003', type: 'revenue', amount: 800000, date: '12/07/2026', description: 'Đơn hàng sỉ', status: 'pending' },
  { id: 'TXN-004', type: 'expense', amount: 300000, date: '11/07/2026', description: 'Chạy quảng cáo khuyến mãi', status: 'completed' },
];

export type Promotion = {
  id: string;
  code: string;
  discount: number;
  discountType: 'percent' | 'fixed';
  minOrder: number;
  maxDiscount: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  description: string;
  status: 'active' | 'expired' | 'upcoming';
};

export const mockPromotions: Promotion[] = [
  { id: 'PM001', code: 'GIAM10K', discount: 10000, discountType: 'fixed', minOrder: 50000, maxDiscount: 10000, usageLimit: 100, usedCount: 45, startDate: '2026-07-01', endDate: '2026-07-30', description: 'Giảm 10.000đ cho đơn từ 50.000đ, áp dụng toàn bộ menu', status: 'active' },
  { id: 'PM002', code: 'KHAITRUONG', discount: 20, discountType: 'percent', minOrder: 100000, maxDiscount: 30000, usageLimit: 50, usedCount: 50, startDate: '2026-06-01', endDate: '2026-06-30', description: 'Giảm 20% nhân dịp khai trương, tối đa 30.000đ', status: 'expired' },
  { id: 'PM003', code: 'FREESHIP', discount: 15000, discountType: 'fixed', minOrder: 150000, maxDiscount: 15000, usageLimit: 200, usedCount: 0, startDate: '2026-08-01', endDate: '2026-08-31', description: 'Hỗ trợ 15.000đ phí ship cho đơn từ 150.000đ', status: 'upcoming' },
  { id: 'PM004', code: 'WEEKEND30', discount: 30, discountType: 'percent', minOrder: 200000, maxDiscount: 50000, usageLimit: 150, usedCount: 98, startDate: '2026-07-05', endDate: '2026-07-27', description: 'Giảm 30% cuối tuần cho đơn từ 200.000đ, tối đa 50.000đ', status: 'active' },
  { id: 'PM005', code: 'COMTAM25K', discount: 25000, discountType: 'fixed', minOrder: 80000, maxDiscount: 25000, usageLimit: 300, usedCount: 214, startDate: '2026-07-10', endDate: '2026-07-25', description: 'Giảm 25.000đ khi mua cơm tấm, áp dụng đơn từ 80.000đ', status: 'active' },
  { id: 'PM006', code: 'SINH_NHAT', discount: 15, discountType: 'percent', minOrder: 0, maxDiscount: 40000, usageLimit: 500, usedCount: 500, startDate: '2026-05-15', endDate: '2026-06-15', description: 'Mừng sinh nhật shop – giảm 15% tất cả đơn hàng', status: 'expired' },
  { id: 'PM007', code: 'FIRSTORDER', discount: 20000, discountType: 'fixed', minOrder: 30000, maxDiscount: 20000, usageLimit: 1000, usedCount: 376, startDate: '2026-07-01', endDate: '2026-12-31', description: 'Ưu đãi 20.000đ cho khách hàng đặt lần đầu tiên', status: 'active' },
  { id: 'PM008', code: 'TRUA_NGON', discount: 10, discountType: 'percent', minOrder: 60000, maxDiscount: 20000, usageLimit: 200, usedCount: 12, startDate: '2026-07-21', endDate: '2026-07-31', description: 'Giảm 10% cho các đơn đặt trong khung giờ trưa 11h–13h', status: 'active' },
  { id: 'PM009', code: 'SUMMER50K', discount: 50000, discountType: 'fixed', minOrder: 300000, maxDiscount: 50000, usageLimit: 80, usedCount: 0, startDate: '2026-08-10', endDate: '2026-08-20', description: 'Flash sale mùa hè – giảm đến 50.000đ cho đơn từ 300.000đ', status: 'upcoming' },
  { id: 'PM010', code: 'COMBO_VIP', discount: 25, discountType: 'percent', minOrder: 250000, maxDiscount: 75000, usageLimit: 60, usedCount: 60, startDate: '2026-05-01', endDate: '2026-05-31', description: 'Giảm 25% combo VIP, chỉ áp dụng cho combo đặc biệt', status: 'expired' },
  { id: 'PM011', code: 'NUOC_FREE', discount: 10000, discountType: 'fixed', minOrder: 70000, maxDiscount: 10000, usageLimit: 500, usedCount: 88, startDate: '2026-07-15', endDate: '2026-07-31', description: 'Tặng 10.000đ tiền nước khi đặt đơn từ 70.000đ', status: 'active' },
  { id: 'PM012', code: 'BACKTOSCHOOL', discount: 15, discountType: 'percent', minOrder: 50000, maxDiscount: 25000, usageLimit: 400, usedCount: 0, startDate: '2026-09-01', endDate: '2026-09-15', description: 'Mừng năm học mới – giảm 15% cho học sinh sinh viên', status: 'upcoming' },
];

export type ChatMessage = {
  id: string;
  sender: 'me' | 'them';
  content: string;
  time: string;
};

export const mockCustomerConversations = [
  { id: 'c1', name: 'Nguyễn Văn A', orderCode: '791307260001', lastMessage: 'Shop có món cơm tấm sườn chả không?', time: '10:30', unread: 2 },
  { id: 'c2', name: 'Trần Thị B', orderCode: '791307260002', lastMessage: 'Đơn hàng của mình bao giờ giao tới ạ?', time: 'Hôm qua', unread: 0 },
  { id: 'c3', name: 'Lê Minh Tuấn', orderCode: '791307260003', lastMessage: 'Dạ mình đổi sườn nướng thành gà nướng được không shop?', time: '09:15', unread: 1 },
  { id: 'c4', name: 'Phạm Ngọc Mai', orderCode: '791307260004', lastMessage: 'Hôm qua mình đặt cơm mà shop quên cho nước mắm 😢', time: 'T2', unread: 0 },
  { id: 'c5', name: 'Vũ Đức Hải', orderCode: '791307260005', lastMessage: 'Mình muốn đặt 50 phần cho công ty vào ngày mai, shop có nhận không?', time: 'T7', unread: 0 },
  { id: 'c6', name: 'Hoàng Thu Hà', orderCode: '791207260001', lastMessage: 'Nhớ cho mình thêm nhiều tóp mỡ nha shop', time: '14:20', unread: 1 },
  { id: 'c7', name: 'Nguyễn Minh Nhật', orderCode: '011307260006', lastMessage: 'Shop ơi mình lỡ đặt nhầm địa chỉ, hủy giúp mình với', time: '11:45', unread: 0 },
  { id: 'c8', name: 'Trương Mỹ Lan', orderCode: '791307260007', lastMessage: 'Cơm nay ngon lắm nha shop, 10 điểm!', time: '13:00', unread: 0 },
];

export const mockChatMessages: Record<string, ChatMessage[]> = {
  'c1': [
    { id: 'm1', sender: 'them', content: 'Chào shop, cho mình hỏi thăm tí', time: '10:28' },
    { id: 'm2', sender: 'them', content: 'Shop có món cơm tấm sườn chả không?', time: '10:30' }
  ],
  'c2': [
    { id: 'm3', sender: 'them', content: 'Đơn hàng của mình bao giờ giao tới ạ?', time: '15:20' },
    { id: 'm4', sender: 'me', content: 'Dạ shipper đang giao ạ, bạn ráng đợi 5p nữa nha', time: '15:22' },
    { id: 'm5', sender: 'them', content: 'Cảm ơn shop', time: '15:25' }
  ],
  'c3': [
    { id: 'm6', sender: 'them', content: 'Shop ơi mình mới lên đơn #791307260003', time: '09:10' },
    { id: 'm7', sender: 'them', content: 'Dạ mình đổi sườn nướng thành gà nướng được không shop?', time: '09:15' }
  ],
  'c4': [
    { id: 'm8', sender: 'them', content: 'Hôm qua mình đặt cơm mà shop quên cho nước mắm 😢', time: '12:00' },
    { id: 'm9', sender: 'me', content: 'Trời ơi shop xin lỗi bạn nhiều nha, do hôm qua quán đông quá bạn nhân viên quên bỏ vào', time: '12:05' },
    { id: 'm10', sender: 'me', content: 'Lần sau bạn đặt nhớ nhắn shop, shop tặng bạn thêm cái trứng ốp la đền bù nha', time: '12:06' }
  ],
  'c5': [
    { id: 'm11', sender: 'them', content: 'Mình muốn đặt 50 phần cho công ty vào ngày mai, shop có nhận không?', time: '16:00' },
    { id: 'm12', sender: 'me', content: 'Dạ shop có nhận khách nhé, bạn cần đặt giờ nào và menu như thế nào ạ?', time: '16:15' }
  ],
  'c6': [
    { id: 'm13', sender: 'them', content: 'Shop ơi mình mới đặt đơn #791207260001', time: '14:18' },
    { id: 'm14', sender: 'them', content: 'Nhớ cho mình thêm nhiều tóp mỡ nha shop', time: '14:20' }
  ],
  'c7': [
    { id: 'm15', sender: 'them', content: 'Shop ơi mình lỡ đặt nhầm địa chỉ, hủy giúp mình với', time: '11:45' },
    { id: 'm16', sender: 'me', content: 'Dạ shop xác nhận hủy, bạn đặt lại đơn mới với địa chỉ đúng nhé', time: '11:50' }
  ],
  'c8': [
    { id: 'm17', sender: 'them', content: 'Cơm nay ngon lắm nha shop, 10 điểm!', time: '13:00' },
    { id: 'm18', sender: 'me', content: 'Dạ shop cảm ơn bạn rất nhiều ạ 😍', time: '13:10' }
  ]
};

export const mockShipperConversations = [
  { id: 's1', name: 'Lê Shipper C', orderCode: '791307260001', lastMessage: 'Mình tới trước quán rồi', time: '11:00', unread: 1 },
  { id: 's2', name: 'Trần Văn Tài', orderCode: '791307260002', lastMessage: 'Khách không nghe máy shop ơi', time: '12:30', unread: 2 },
  { id: 's3', name: 'Phạm Hùng', orderCode: '791307260005', lastMessage: 'Mưa lớn quá mình tới trễ 5p nhé', time: '18:15', unread: 0 },
  { id: 's4', name: 'Nguyễn Tấn', orderCode: '791307260012', lastMessage: 'Đơn này có nước không shop?', time: '09:45', unread: 0 },
  { id: 's5', name: 'Lý Tiểu Long', orderCode: '011307260006', lastMessage: 'Ok shop nha', time: 'Hôm qua', unread: 0 },
];

export const mockShipperMessages: Record<string, ChatMessage[]> = {
  's1': [
    { id: 'sm1', sender: 'them', content: 'Alo shop chuẩn bị đơn ORD-005 chưa?', time: '10:55' },
    { id: 'sm2', sender: 'me', content: 'Rồi ạ, bạn tới lấy đi', time: '10:56' },
    { id: 'sm3', sender: 'them', content: 'Mình tới trước quán rồi', time: '11:00' }
  ],
  's2': [
    { id: 'sm4', sender: 'them', content: 'Mình tới điểm giao rồi mà khách gọi không được', time: '12:25' },
    { id: 'sm5', sender: 'them', content: 'Khách không nghe máy shop ơi', time: '12:30' }
  ],
  's3': [
    { id: 'sm6', sender: 'them', content: 'Mưa lớn quá mình tới trễ 5p nhé', time: '18:15' },
    { id: 'sm7', sender: 'me', content: 'Dạ ok anh, chạy cẩn thận nha', time: '18:16' }
  ],
  's4': [
    { id: 'sm8', sender: 'them', content: 'Đơn này có nước không shop?', time: '09:45' },
    { id: 'sm9', sender: 'me', content: 'Dạ không anh, chỉ có 2 hộp cơm thôi ạ', time: '09:46' }
  ],
  's5': [
    { id: 'sm10', sender: 'them', content: 'Tí mình ghé lấy đơn ORD-088 nha', time: '19:00' },
    { id: 'sm11', sender: 'me', content: 'Dạ đã chuẩn bị xong, a tới là lấy luôn', time: '19:01' },
    { id: 'sm12', sender: 'them', content: 'Ok shop nha', time: '19:05' }
  ]
};

export const mockShop = {
  name: 'Cơm Tấm Sài Gòn',
  description: 'Chuyên cung cấp các loại cơm tấm sườn bi chả cực ngon, công thức gia truyền hơn 20 năm.',
  phone: '0987 654 321',
  email: 'contact@comtamsaigon.vn',
  address: '123 Đường Số 1, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
  category: 'Đồ ăn',
  openTime: '08:00',
  closeTime: '22:00',
  rating: 4.8,
  totalOrders: 15420,
  pickupAddress: '123 Đường Số 1, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
  shippingFee: 15000,
  freeShipMinOrder: 200000,
};
