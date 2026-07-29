import { useState } from "react";
import { TrendingUp, TrendingDown, ShoppingCart, UserPlus, DollarSign, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from "recharts";
import {
  DashPeriod,
  kpiByPeriod,
  revenueChartByPeriod,
  ordersChartByPeriod,
  recentActivities,
} from "../data/mockDashboard";
import { formatVND, formatNumber } from "../lib/formatters";

const revenueConfig = { revenue: { label: "Doanh thu", color: "#3b82f6" } };
const ordersConfig  = { orders:  { label: "Đơn hàng",  color: "#10b981" } };
const activityIcon: Record<string, string> = { order: "🛍️", user: "👤", complaint: "⚠️", product: "📦" };

const PERIODS: { key: DashPeriod; label: string }[] = [
  { key: "7d", label: "7 ngày" },
  { key: "1m", label: "1 tháng" },
  { key: "3m", label: "3 tháng" },
  { key: "1y", label: "1 năm" },
];

const PERIOD_COMPARE: Record<DashPeriod, string> = {
  "7d": "tuần trước",
  "1m": "tháng trước",
  "3m": "quý trước",
  "1y": "năm trước",
};

const fmt = (d: Date) => d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });

function getDateRangeLabel(p: DashPeriod): string {
  const today = new Date();
  const from = new Date(today);
  if (p === "7d")  { from.setDate(today.getDate() - 6); return `${fmt(from)} – ${fmt(today)}`; }
  if (p === "1m")  { from.setMonth(today.getMonth() - 1); from.setDate(from.getDate() + 1); return `${fmt(from)} – ${fmt(today)}`; }
  if (p === "3m")  { from.setMonth(today.getMonth() - 3); from.setDate(from.getDate() + 1); return `${fmt(from)} – ${fmt(today)}`; }
  return `Năm ${today.getFullYear()}`;
}

export default function DashboardPage() {
  const [period, setPeriod] = useState<DashPeriod>("7d");
  const kpi = kpiByPeriod[period];
  const revenueData = revenueChartByPeriod[period];
  const ordersData  = ordersChartByPeriod[period];
  const compareLabel = PERIOD_COMPARE[period];

  return (
    <div className="space-y-6">
      {/* Header + period filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Tổng quan</h1>
          <p className="text-xs text-slate-400 mt-0.5">{getDateRangeLabel(period)}</p>
        </div>
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1 self-start sm:self-auto">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                ${period === p.key
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: period === "7d" ? "Doanh thu 7 ngày" : period === "1m" ? "Doanh thu tháng" : period === "3m" ? "Doanh thu quý" : "Doanh thu năm",
            value: formatVND(kpi.revenue),
            growth: kpi.revenueGrowth,
            icon: DollarSign,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600",
          },
          {
            label: "Tổng đơn hàng",
            value: formatNumber(kpi.orders),
            growth: kpi.ordersGrowth,
            icon: ShoppingCart,
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-600",
          },
          {
            label: "Người dùng mới",
            value: formatNumber(kpi.users),
            growth: kpi.usersGrowth,
            icon: UserPlus,
            iconBg: "bg-purple-50",
            iconColor: "text-purple-600",
          },
        ].map((kpi) => (
          <Card key={kpi.label} className="bg-white">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.label}</CardTitle>
                <div className={`h-9 w-9 rounded-lg ${kpi.iconBg} flex items-center justify-center`}>
                  <kpi.icon className={`h-5 w-5 ${kpi.iconColor}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {kpi.growth >= 0
                  ? <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                  : <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                }
                <span className={`text-xs font-medium ${kpi.growth >= 0 ? "text-green-600" : "text-red-500"}`}>
                  {kpi.growth >= 0 ? "+" : ""}{kpi.growth}%
                </span>
                <span className="text-xs text-muted-foreground">so với {compareLabel}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-base">Doanh thu</CardTitle>
            <CardDescription>
              {period === "7d" ? "Biểu đồ doanh thu 7 ngày gần nhất" :
               period === "1m" ? "Biểu đồ doanh thu theo tuần trong tháng" :
               period === "3m" ? "Biểu đồ doanh thu theo tháng trong quý" :
               "Biểu đồ doanh thu theo tháng trong năm"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueConfig} className="h-[220px] w-full">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `${(v / 1e6).toFixed(0)}M`} tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent formatter={(v) => formatVND(Number(v))} />} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-base">Đơn hàng</CardTitle>
            <CardDescription>
              {period === "7d" ? "Lượng đơn hàng 7 ngày gần nhất" :
               period === "1m" ? "Lượng đơn hàng theo tuần trong tháng" :
               period === "3m" ? "Lượng đơn hàng theo tháng trong quý" :
               "Lượng đơn hàng theo tháng trong năm"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={ordersConfig} className="h-[220px] w-full">
              <BarChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => formatNumber(Number(v))} tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent formatter={(v) => `${formatNumber(Number(v))} đơn`} />} />
                <Bar dataKey="orders" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity feed */}
      <Card className="bg-white">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base">Hoạt động gần đây</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentActivities.map((a) => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                <span className="text-lg">{activityIcon[a.type]}</span>
                <p className="flex-1 text-sm truncate">{a.message}</p>
                <span className="text-xs text-muted-foreground shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
