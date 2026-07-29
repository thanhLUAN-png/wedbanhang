// ─── KPI by period ───────────────────────────────────────────────────────────
export type DashPeriod = "7d" | "1m" | "3m" | "1y";

export const kpiByPeriod: Record<DashPeriod, {
  revenue: number; revenueGrowth: number;
  orders: number;  ordersGrowth: number;
  users: number;   usersGrowth: number;
}> = {
  "7d": { revenue: 1_820_000_000, revenueGrowth: 12, orders:  8_729, ordersGrowth:  8, users:  2_684, usersGrowth:  5 },
  "1m": { revenue: 7_540_000_000, revenueGrowth:  9, orders: 34_200, ordersGrowth:  6, users: 10_480, usersGrowth:  7 },
  "3m": { revenue: 21_300_000_000,revenueGrowth: 14, orders: 98_600, ordersGrowth: 11, users: 29_350, usersGrowth: 10 },
  "1y": { revenue: 87_600_000_000,revenueGrowth: 22, orders:392_000, ordersGrowth: 18, users:115_000, usersGrowth: 15 },
};

// ─── Revenue chart data by period ────────────────────────────────────────────
export const revenueChartByPeriod: Record<DashPeriod, { label: string; revenue: number }[]> = {
  "7d": [
    { label: "T2", revenue: 185_000_000 },
    { label: "T3", revenue: 220_000_000 },
    { label: "T4", revenue: 198_000_000 },
    { label: "T5", revenue: 260_000_000 },
    { label: "T6", revenue: 310_000_000 },
    { label: "T7", revenue: 345_000_000 },
    { label: "CN", revenue: 245_800_000 },
  ],
  "1m": [
    { label: "T1", revenue: 1_820_000_000 },
    { label: "T2", revenue: 2_100_000_000 },
    { label: "T3", revenue: 1_940_000_000 },
    { label: "T4", revenue: 1_680_000_000 },
  ],
  "3m": [
    { label: "Th1", revenue: 6_200_000_000 },
    { label: "Th2", revenue: 7_400_000_000 },
    { label: "Th3", revenue: 7_700_000_000 },
  ],
  "1y": [
    { label: "T1",  revenue: 5_800_000_000 },
    { label: "T2",  revenue: 6_100_000_000 },
    { label: "T3",  revenue: 6_900_000_000 },
    { label: "T4",  revenue: 7_200_000_000 },
    { label: "T5",  revenue: 8_100_000_000 },
    { label: "T6",  revenue: 7_600_000_000 },
    { label: "T7",  revenue: 8_800_000_000 },
    { label: "T8",  revenue: 9_200_000_000 },
    { label: "T9",  revenue: 8_700_000_000 },
    { label: "T10", revenue: 9_600_000_000 },
    { label: "T11", revenue: 9_900_000_000 },
    { label: "T12", revenue:10_700_000_000 },
  ],
};

// ─── Orders chart data by period ─────────────────────────────────────────────
export const ordersChartByPeriod: Record<DashPeriod, { label: string; orders: number }[]> = {
  "7d": [
    { label: "T2", orders:  980 },
    { label: "T3", orders: 1120 },
    { label: "T4", orders: 1050 },
    { label: "T5", orders: 1300 },
    { label: "T6", orders: 1480 },
    { label: "T7", orders: 1620 },
    { label: "CN", orders: 1247 },
  ],
  "1m": [
    { label: "T1", orders:  8200 },
    { label: "T2", orders:  9100 },
    { label: "T3", orders:  8700 },
    { label: "T4", orders:  8200 },
  ],
  "3m": [
    { label: "Th1", orders: 30200 },
    { label: "Th2", orders: 34100 },
    { label: "Th3", orders: 34300 },
  ],
  "1y": [
    { label: "T1",  orders: 27000 },
    { label: "T2",  orders: 28500 },
    { label: "T3",  orders: 31000 },
    { label: "T4",  orders: 33500 },
    { label: "T5",  orders: 36000 },
    { label: "T6",  orders: 34000 },
    { label: "T7",  orders: 38000 },
    { label: "T8",  orders: 40000 },
    { label: "T9",  orders: 38500 },
    { label: "T10", orders: 42000 },
    { label: "T11", orders: 44000 },
    { label: "T12", orders: 46500 },
  ],
};

// ─── Recent activities ────────────────────────────────────────────────────────
export const recentActivities = [
  { id: 1, type: "order",     message: "Đơn hàng #DH20240892 vừa được đặt",              time: "2 phút trước" },
  { id: 2, type: "user",      message: "Nguyễn Thị Thảo vừa đăng ký tài khoản",          time: "5 phút trước" },
  { id: 3, type: "complaint", message: "Khiếu nại mới từ Trần Minh Tuấn",                time: "12 phút trước" },
  { id: 4, type: "product",   message: "Sản phẩm mới cần duyệt từ shop Hoàng Gia",       time: "20 phút trước" },
  { id: 5, type: "order",     message: "Đơn hàng #DH20240891 đã hoàn thành",             time: "35 phút trước" },
];

// kept for backward compat
export const kpiData = {
  revenueToday: 245_800_000, revenueGrowth: 12,
  newOrders: 1247, ordersGrowth: 8,
  newUsers: 384,   usersGrowth: 5,
};
