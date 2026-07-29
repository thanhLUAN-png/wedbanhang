import { useState, useMemo } from "react";
import { TrendingUp, Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Search } from "lucide-react";
import { StatusBadge } from "../components/shared/StatusBadge";
import { mockTransactions, revenueAreaData, revenueHourlyData } from "../data/mockRevenue";
import { formatVND, formatDate } from "../lib/formatters";

const areaConfig = { commission: { label: "Doanh thu", color: "#3b82f6" } };

export default function RevenuePage() {
  const [period, setPeriod] = useState("7");
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");

  // Mock "today" as 2026-07-14 to match mock data
  const today = new Date("2026-07-14T00:00:00Z");

  const { allTxInPeriod, filteredTx, filteredArea, dateString, counts } = useMemo(() => {
    const days = parseInt(period);
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - days + 1); // e.g. for 1 day, start = end

    const startStr = startDate.toLocaleDateString("vi-VN", { day: "numeric", month: "numeric", year: "numeric" });
    const endStr = today.toLocaleDateString("vi-VN", { day: "numeric", month: "numeric", year: "numeric" });
    const dString = days === 1 ? `Ngày ${endStr}` : `Từ ${startStr} đến ${endStr}`;

    const startIso = startDate.toISOString().split("T")[0];

    const allTx = mockTransactions.filter(t => t.date >= startIso);
    
    const countAll = allTx.length;
    const countShop = allTx.filter(t => t.id.startsWith("GD")).length;
    const countShipper = allTx.filter(t => t.id.startsWith("SH")).length;

    let finalTx = allTx;
    if (tab === "shop") finalTx = allTx.filter(t => t.id.startsWith("GD"));
    if (tab === "shipper") finalTx = allTx.filter(t => t.id.startsWith("SH"));

    // For area chart: hourly for 1 day, daily slices otherwise
    let fArea = revenueAreaData;
    if (days === 1) fArea = revenueHourlyData;
    else if (days === 7) fArea = revenueAreaData.slice(-7);

    return { allTxInPeriod: allTx, filteredTx: finalTx, filteredArea: fArea, dateString: dString, counts: { all: countAll, shop: countShop, shipper: countShipper } };
  }, [period, tab]);

  const totalCommission = allTxInPeriod.filter(t => t.status === "completed").reduce((s, t) => s + t.commission, 0);
  const totalTx = allTxInPeriod.length;
  const avgCommission = totalTx > 0 ? Math.round(totalCommission / allTxInPeriod.filter(t => t.status === "completed").length) : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Doanh thu & Hoa hồng</h1>
          <div className="flex items-center gap-2 mt-1 text-muted-foreground text-sm">
            <CalendarIcon className="h-4 w-4" />
            <span>{dateString}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-600">Thời gian:</span>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px] bg-white"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 ngày</SelectItem>
              <SelectItem value="7">7 ngày</SelectItem>
              <SelectItem value="30">1 tháng</SelectItem>
              <SelectItem value="90">3 tháng</SelectItem>
              <SelectItem value="365">1 năm</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Tổng doanh thu (Khấu trừ)", value: formatVND(totalCommission), sub: "Từ giao dịch hoàn thành", color: "text-blue-600" },
          { label: "Số giao dịch",             value: `${totalTx}`,              sub: "Của shop và shipper", color: "text-emerald-600" },
          { label: "Trung bình / giao dịch",   value: formatVND(avgCommission || 0),  sub: "Doanh thu trung bình",    color: "text-purple-600" },
        ].map((k) => (
          <Card key={k.label} className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{k.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${k.color}`}>{k.value}</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                <span className="text-xs text-muted-foreground">{k.sub}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Area chart */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-base">Biểu đồ doanh thu</CardTitle>
          <CardDescription>Tổng tiền khấu trừ thu về theo ngày (đơn vị: ₫)</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={areaConfig} className="h-[240px] w-full">
            <AreaChart data={filteredArea}>
              <defs>
                <linearGradient id="gradBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`} tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent formatter={(v) => formatVND(Number(v))} />} />
              <Area type="monotone" dataKey="commission" stroke="#3b82f6" strokeWidth={2} fill="url(#gradBlue)" />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Transactions table */}
      <Card className="bg-white">
        <div className="px-6 pt-5 pb-0">
          <CardTitle className="text-base">Chi tiết giao dịch</CardTitle>
        </div>
        
        <Tabs value={tab} onValueChange={setTab}>
          <div className="px-6 pt-4 border-b border-slate-100 pb-4 flex items-center gap-3">
            <TabsList className="bg-slate-100">
              <TabsTrigger value="all">Tất cả ({counts.all})</TabsTrigger>
              <TabsTrigger value="shop">Quán ăn ({counts.shop})</TabsTrigger>
              <TabsTrigger value="shipper">Shipper ({counts.shipper})</TabsTrigger>
            </TabsList>
            <div className="relative ml-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm mã GD..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 h-9 text-sm w-48"
              />
            </div>
          </div>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="pl-6">Mã GD</TableHead>
                  <TableHead>Đối tác (Shop/Shipper)</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead className="text-right">Giá trị gốc</TableHead>
                  <TableHead className="text-right">Khấu trừ</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead>Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTx.filter(t => {
                  const q = search.toLowerCase();
                  return !q || t.id.toLowerCase().includes(q) || t.seller.toLowerCase().includes(q) || t.shopName.toLowerCase().includes(q) || t.product.toLowerCase().includes(q);
                }).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Không có giao dịch nào phù hợp.</TableCell>
                  </TableRow>
                )}
                {filteredTx.filter(t => {
                  const q = search.toLowerCase();
                  return !q || t.id.toLowerCase().includes(q) || t.seller.toLowerCase().includes(q) || t.shopName.toLowerCase().includes(q) || t.product.toLowerCase().includes(q);
                }).map((t) => (
                  <TableRow key={t.id} className="hover:bg-slate-50">
                    <TableCell className="pl-6 font-mono text-sm font-medium">{t.id}</TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{t.seller}</div>
                      <div className="text-xs text-muted-foreground">{t.shopName}</div>
                    </TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate">{t.product}</TableCell>
                    <TableCell className="text-right text-sm">{formatVND(t.orderValue)}</TableCell>
                    <TableCell className="text-right text-sm font-bold text-blue-600">{formatVND(t.commission)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(t.date)}</TableCell>
                    <TableCell><StatusBadge status={t.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
