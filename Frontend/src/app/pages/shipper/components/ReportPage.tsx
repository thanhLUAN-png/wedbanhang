import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Package, DollarSign, Star, Clock, ArrowUpRight } from "lucide-react";

const weeklyData = [
  { day: "T2", orders: 3, earnings: 72000 },
  { day: "T3", orders: 5, earnings: 118000 },
  { day: "T4", orders: 4, earnings: 92000 },
  { day: "T5", orders: 6, earnings: 146000 },
  { day: "T6", orders: 5, earnings: 123000 },
  { day: "T7", orders: 7, earnings: 171000 },
  { day: "CN", orders: 4, earnings: 96000 },
];

type ReportPeriod = "today" | "week" | "month" | "year";

const reportSamples: Record<ReportPeriod, {
  chart: { label: string; orders: number; earnings: number; activeHours: number }[];
  success: number;
  failed: number;
  rating: string;
  reviews: number;
}> = {
  today: {
    chart: [
      { label: "08h", orders: 1, earnings: 20000, activeHours: 1 }, { label: "10h", orders: 2, earnings: 45000, activeHours: 1.5 },
      { label: "12h", orders: 3, earnings: 72000, activeHours: 2 }, { label: "14h", orders: 1, earnings: 22000, activeHours: 0.8 },
      { label: "17h", orders: 2, earnings: 50000, activeHours: 1.7 }, { label: "20h", orders: 1, earnings: 25000, activeHours: 1 },
    ], success: 9, failed: 1, rating: "4.9", reviews: 8,
  },
  week: {
    chart: weeklyData.map((item, index) => ({ ...item, label: item.day, activeHours: [6.5, 8, 5.5, 9, 7.5, 10, 6][index] })),
    success: 32, failed: 2, rating: "4.8", reviews: 29,
  },
  month: {
    chart: [
      { label: "Tuần 1", orders: 25, earnings: 612000, activeHours: 43 }, { label: "Tuần 2", orders: 31, earnings: 754000, activeHours: 51.5 },
      { label: "Tuần 3", orders: 28, earnings: 681000, activeHours: 47 }, { label: "Tuần 4", orders: 36, earnings: 889000, activeHours: 56.5 },
    ], success: 114, failed: 6, rating: "4.8", reviews: 103,
  },
  year: {
    chart: [
      { label: "T1", orders: 88, earnings: 2140000, activeHours: 156 }, { label: "T2", orders: 96, earnings: 2350000, activeHours: 168 },
      { label: "T3", orders: 105, earnings: 2580000, activeHours: 181 }, { label: "T4", orders: 112, earnings: 2740000, activeHours: 193 },
      { label: "T5", orders: 121, earnings: 2990000, activeHours: 207 }, { label: "T6", orders: 118, earnings: 2870000, activeHours: 199 },
      { label: "T7", orders: 126, earnings: 3110000, activeHours: 216 }, { label: "T8", orders: 119, earnings: 2920000, activeHours: 204 },
      { label: "T9", orders: 132, earnings: 3260000, activeHours: 225 }, { label: "T10", orders: 138, earnings: 3410000, activeHours: 234 },
      { label: "T11", orders: 145, earnings: 3580000, activeHours: 246 }, { label: "T12", orders: 151, earnings: 3740000, activeHours: 255 },
    ], success: 1402, failed: 49, rating: "4.8", reviews: 1218,
  },
};

const formatCurrency = (value: number) => `${(value / 1000).toFixed(0)}K`;
const formatActiveHours = (value: number) => {
  const hours = Math.floor(value);
  const minutes = Math.round((value - hours) * 60);
  return minutes > 0 ? `${hours} giờ ${minutes} phút` : `${hours} giờ`;
};

export function ReportPage() {
  const [period, setPeriod] = useState<ReportPeriod>("week");
  const sample = reportSamples[period];
  const totalOrders = sample.success + sample.failed;
  const totalEarnings = sample.chart.reduce((sum, item) => sum + item.earnings, 0);
  const totalActiveHours = sample.chart.reduce((sum, item) => sum + item.activeHours, 0);
  const successRate = totalOrders > 0 ? ((sample.success / totalOrders) * 100).toFixed(1) : "0";
  const pieData = useMemo(() => [
    { name: "Giao thành công", value: sample.success, color: "#22c55e" },
    { name: "Không giao được", value: sample.failed, color: "#f87171" },
  ], [sample]);

  const today = new Date();
  const startDate = new Date(today);
  if (period === "week") startDate.setDate(today.getDate() - 6);
  if (period === "month") startDate.setDate(today.getDate() - 29);
  if (period === "year") startDate.setFullYear(today.getFullYear() - 1);
  const dateLabel = period === "today"
    ? `Hôm nay, ${today.toLocaleDateString("vi-VN")}`
    : `${startDate.toLocaleDateString("vi-VN")} - ${today.toLocaleDateString("vi-VN")}`;
  const periodLabel = period === "today" ? "hôm nay" : period === "week" ? "7 ngày qua" : period === "month" ? "30 ngày qua" : "1 năm qua";

  const kpis = [
    { icon: <Package className="w-5 h-5" />, label: `Tổng đơn ${periodLabel}`, value: totalOrders.toLocaleString("vi-VN"), sub: "Dữ liệu mẫu", color: "text-blue-600", bg: "bg-blue-50", trend: true },
    { icon: <DollarSign className="w-5 h-5" />, label: `Thu nhập ${periodLabel}`, value: `${totalEarnings.toLocaleString("vi-VN")}đ`, sub: "Phí ship thực nhận", color: "text-green-600", bg: "bg-green-50", trend: true },
    { icon: <Star className="w-5 h-5" />, label: "Đánh giá trung bình", value: `${sample.rating} ★`, sub: `${sample.reviews} lượt đánh giá`, color: "text-yellow-600", bg: "bg-yellow-50", trend: false },
    { icon: <TrendingUp className="w-5 h-5" />, label: "Tỷ lệ thành công", value: `${successRate}%`, sub: `${sample.failed} đơn không giao được`, color: "text-orange-600", bg: "bg-orange-50", trend: true },
    { icon: <Clock className="w-5 h-5" />, label: "Giờ hoạt động", value: formatActiveHours(totalActiveHours), sub: `Tổng thời gian ${periodLabel}`, color: "text-purple-600", bg: "bg-purple-50", trend: false },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-gray-900" style={{fontSize:"22px"}}>Báo cáo hoạt động</h2>
          <p className="text-gray-500 text-sm mt-0.5">{dateLabel}</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          {([
            ["today", "Hôm nay"], ["week", "7 ngày qua"],
            ["month", "30 ngày qua"], ["year", "1 năm qua"],
          ] as [ReportPeriod, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setPeriod(key)}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${period === key ? "bg-white text-orange-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              style={{fontWeight:500}}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {kpis.map(k => (
          <div key={k.label} className={`${k.bg} rounded-xl p-4 border border-gray-100`}>
            <div className={`${k.color} mb-2`}>{k.icon}</div>
            <p className="text-gray-900" style={{fontWeight:700, fontSize:"20px"}}>{k.value}</p>
            <p className="text-gray-500 text-xs mt-0.5">{k.label}</p>
            <div className="flex items-center gap-1 mt-1.5">
              {k.trend && <ArrowUpRight className="w-3 h-3 text-green-500" />}
              <p className="text-gray-400" style={{fontSize:"11px"}}>{k.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Weekly bar */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-gray-800 mb-4" style={{fontSize:"15px"}}>Đơn hàng {periodLabel}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={sample.chart} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [v, "Đơn hàng"]} contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }} />
              <Bar dataKey="orders" fill="#f97316" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-gray-800 mb-4" style={{fontSize:"15px"}}>Tỷ lệ giao hàng</h3>
          <div className="flex flex-col items-center">
            <PieChart width={160} height={160}>
              <Pie data={pieData} cx={75} cy={75} innerRadius={45} outerRadius={75} dataKey="value" paddingAngle={3}>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => [v, "Đơn"]} contentStyle={{ borderRadius: 8, border: "none" }} />
            </PieChart>
            <div className="space-y-2 w-full mt-2">
              {pieData.map(d => (
                <div key={d.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
                    <span className="text-xs text-gray-600">{d.name}</span>
                  </div>
                  <span className="text-xs text-gray-800" style={{fontWeight:600}}>{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-3 gap-4">
        {/* Monthly earnings */}
        <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-gray-800 mb-4" style={{fontSize:"15px"}}>Thu nhập {periodLabel}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={sample.chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v: number) => [`${v.toLocaleString("vi-VN")}đ`, "Thu nhập"]} contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }} />
              <Line dataKey="earnings" stroke="#f97316" strokeWidth={2.5} dot={{ fill: "#f97316", r: 5, strokeWidth: 2, stroke: "#fff" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Active hours */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-gray-800 mb-1" style={{fontSize:"15px"}}>Giờ hoạt động</h3>
          <p className="text-xs text-gray-400 mb-3">Biến động {periodLabel}</p>
          <ResponsiveContainer width="100%" height={175}>
            <LineChart data={sample.chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={28} />
              <Tooltip
                formatter={(value: number) => [formatActiveHours(value), "Giờ hoạt động"]}
                contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
              />
              <Line type="monotone" dataKey="activeHours" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: "#8b5cf6", r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
