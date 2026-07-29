import { useEffect, useState } from "react";
import { TrendingUp, Package, ShoppingBag, DollarSign } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type RevenuePoint = { time: string; revenue: number };
type TopProduct = { name: string; quantity: number };
type RecentOrder = { orderCode: string; customerName: string; itemCount: number; total: number; status: string; orderedAt: string };
type Dashboard = { revenueToday: number; ordersToday: number; pendingOrders: number; shippingOrders: number; revenueByHour: RevenuePoint[]; topProducts: TopProduct[]; recentOrders: RecentOrder[] };

const emptyDashboard: Dashboard = { revenueToday: 0, ordersToday: 0, pendingOrders: 0, shippingOrders: 0, revenueByHour: [], topProducts: [], recentOrders: [] };

const statusNames: Record<string, string> = { pending: "Chờ xác nhận", confirmed: "Đang chuẩn bị", shipping: "Đang giao", completed: "Hoàn thành", returned: "Trả hàng", cancelled: "Đã hủy" };
const statusColors: Record<string, string> = { pending: "bg-yellow-100 text-yellow-700", confirmed: "bg-blue-100 text-blue-700", shipping: "bg-orange-100 text-orange-700", completed: "bg-green-100 text-green-700", returned: "bg-gray-100 text-gray-700", cancelled: "bg-red-100 text-red-700" };

function formatVND(value: number) { return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value || 0); }

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<Dashboard>(emptyDashboard);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    fetch("/seller-api/seller/dashboard?sellerCode=SL-BT-0001", { signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error("Không thể tải dữ liệu tổng quan.");
        return response.json() as Promise<Dashboard>;
      })
      .then(setDashboard)
      .catch(() => setError("Chưa kết nối được Backend .NET/SQL Server. Số liệu hiện hiển thị là 0."))
      .finally(() => { window.clearTimeout(timeout); setLoading(false); });
    fetch("/seller-api/seller/activity?sellerCode=SL-BT-0001").then(r=>r.json()).then(x=>setIsActive(x.isActive)).catch(()=>{});
    return () => { window.clearTimeout(timeout); controller.abort(); };
  }, []);

  const today = new Date().toLocaleDateString("vi-VN");
  const stats = [
    { label: "Doanh thu (Ngày)", value: formatVND(dashboard.revenueToday), icon: DollarSign, color: "text-green-500", bg: "bg-green-50" },
    { label: "Đơn chờ xác nhận", value: String(dashboard.pendingOrders), hint: "Cần xử lý gấp", icon: Package, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Đang giao", value: String(dashboard.shippingOrders), hint: "Shipper đang giao", icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Số đơn (Ngày)", value: String(dashboard.ordersToday), icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-50" },
  ];

  return <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div><h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1><p className="mt-1 text-sm text-gray-500">Hôm nay, {today}</p></div>
      <div className="flex items-center gap-3"><span className="rounded-xl border border-orange-200 bg-orange-50 px-4 py-2.5 text-sm font-medium text-orange-600">Hôm nay</span><button onClick={async()=>{const next=!isActive;setIsActive(next);await fetch('/seller-api/seller/activity?sellerCode=SL-BT-0001',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({isActive:next})})}} className={`rounded-xl px-4 py-2.5 text-sm font-medium ${isActive?'bg-green-100 text-green-700':'bg-gray-100 text-gray-600'}`}>Quán {isActive?'đang hoạt động':'chưa hoạt động'}</button></div>
    </div>

    {error && <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</p>}

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(({ label, value, hint, icon: Icon, color, bg }) => <div key={label} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${bg} ${color}`}><Icon className="h-5 w-5" /></div>
        <p className="mb-1 text-2xl font-bold text-gray-900">{loading ? "…" : value}</p><p className="text-xs text-gray-500">{label}</p>
        {hint && <p className="mt-1 text-xs font-medium text-orange-500">{hint}</p>}
      </div>)}
    </div>

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="flex min-h-[340px] flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
        <div className="mb-6 flex items-center justify-between"><h2 className="font-bold text-gray-800">Doanh thu hôm nay</h2><span className="text-sm text-gray-500">Kênh người bán</span></div>
        <div className="min-h-[240px] flex-1"><ResponsiveContainer width="100%" height="100%"><LineChart data={dashboard.revenueByHour}>
          <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" /><XAxis dataKey="time" tick={{ fontSize: 11, fill: "#6b7280" }} /><YAxis tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} tick={{ fontSize: 11, fill: "#6b7280" }} />
          <Tooltip formatter={(v: number) => [formatVND(v), "Doanh thu"]} /><Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
        </LineChart></ResponsiveContainer></div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"><h2 className="mb-5 font-bold text-gray-800">🏆 Bán chạy nhất (Hôm nay)</h2>
        {dashboard.topProducts.length === 0 ? <p className="py-10 text-center text-sm text-gray-400">Chưa có món nào được bán hôm nay.</p> : <div className="space-y-4">{dashboard.topProducts.map((product, index) => <div key={product.name} className="flex items-center gap-3"><span className="w-5 text-xs font-bold text-orange-500">#{index + 1}</span><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-gray-800">{product.name}</p><p className="text-xs text-gray-500">Đã bán: <b className="text-orange-500">{product.quantity}</b></p></div></div>)}</div>}
      </div>
    </div>

    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"><div className="mb-5 flex items-center justify-between"><h2 className="font-bold text-gray-800">Đơn hàng mới nhất</h2><a href="/seller/orders" className="text-sm font-medium text-orange-500 hover:underline">Xem tất cả →</a></div>
      {dashboard.recentOrders.length === 0 ? <p className="py-8 text-center text-sm text-gray-400">Chưa có đơn hàng nào.</p> : <div className="space-y-3">{dashboard.recentOrders.map(order => <div key={order.orderCode} className="flex items-center gap-4 rounded-xl border border-transparent p-3 hover:border-gray-100 hover:bg-gray-50"><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className="font-mono text-xs font-medium tracking-wider text-gray-500">#{order.orderCode}</span><span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${statusColors[order.status] ?? "bg-gray-100 text-gray-700"}`}>{statusNames[order.status] ?? order.status}</span></div><p className="mt-1 text-sm font-medium text-gray-800">{order.customerName} · {order.itemCount} món</p></div><p className="shrink-0 text-base font-bold text-orange-500">{formatVND(order.total)}</p></div>)}</div>}
    </div>
  </div>;
}
