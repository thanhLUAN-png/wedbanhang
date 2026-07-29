import { useState } from "react";
import { CheckCircle, XCircle, MapPin, Search, Package, ChevronRight } from "lucide-react";
import { Order } from "./types";

interface HistoryPageProps {
  history: Order[];
  onSelectOrder: (order: Order) => void;
}

const statusConfig: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  delivered: { label: "Giao thành công", icon: <CheckCircle className="w-3.5 h-3.5" />, color: "text-green-700", bg: "bg-green-50 border-green-200" },
  cancelled: { label: "Không giao được", icon: <XCircle className="w-3.5 h-3.5" />, color: "text-red-600", bg: "bg-red-50 border-red-200" },
};

export function HistoryPage({ history, onSelectOrder }: HistoryPageProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "delivered" | "cancelled">("all");

  const filtered = history.filter(o => {
    const q = search.toLowerCase();
    const match = o.code.toLowerCase().includes(q) || o.receiverName.toLowerCase().includes(q);
    if (filter === "delivered") return match && o.status === "delivered";
    if (filter === "cancelled") return match && o.status === "cancelled";
    return match;
  });

  const totalEarned = history.filter(o => o.status === "delivered").reduce((s, o) => s + o.shippingFee, 0);
  const successCount = history.filter(o => o.status === "delivered").length;
  const successRate = history.length > 0 ? Math.round((successCount / history.length) * 100) : 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900" style={{fontSize:"22px"}}>Lịch sử giao hàng</h2>
          <p className="text-gray-500 text-sm mt-0.5">Xem lại toàn bộ các đơn đã giao</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text" placeholder="Tìm mã đơn, tên khách..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400 w-64"
            />
          </div>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {[{k:"all",l:"Tất cả"},{k:"delivered",l:"Thành công"},{k:"cancelled",l:"Không giao được"}].map(f => (
              <button key={f.k} onClick={() => setFilter(f.k as typeof filter)}
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${filter===f.k?"bg-white shadow text-gray-900":"text-gray-500"}`}
                style={filter===f.k?{fontWeight:500}:{}}>
                {f.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: "Tổng đơn", value: history.length, color: "text-gray-800", bg: "bg-gray-50" },
          { label: "Giao thành công", value: successCount, color: "text-green-600", bg: "bg-green-50" },
          { label: "Tỷ lệ thành công", value: `${successRate}%`, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Tổng phí ship", value: `${totalEarned.toLocaleString("vi-VN")}đ`, color: "text-blue-600", bg: "bg-blue-50" },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-gray-100`}>
            <p className={`text-2xl ${s.color}`} style={{fontWeight:700}}>{s.value}</p>
            <p className="text-gray-500 text-sm mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex-1 flex flex-col">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-200 bg-gray-50 text-xs text-gray-500 uppercase tracking-wide" style={{fontWeight:600}}>
          <div className="col-span-2">Mã đơn / Ngày</div>
          <div className="col-span-3">Người nhận</div>
          <div className="col-span-2">Hàng hóa</div>
          <div className="col-span-1 text-right">Phí ship</div>
          <div className="col-span-1 text-right">COD</div>
          <div className="col-span-2">Trạng thái</div>
          <div className="col-span-1"></div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Package className="w-12 h-12 mb-3 opacity-30" />
              <p>Không tìm thấy kết quả</p>
            </div>
          ) : filtered.map(order => {
            const st = statusConfig[order.status] || statusConfig.delivered;
            return (
              <div key={order.id} className="grid grid-cols-12 gap-4 px-4 py-3.5 hover:bg-gray-50 cursor-pointer transition-colors items-center group" onClick={() => onSelectOrder(order)}>
                <div className="col-span-2">
                  <p className="text-sm text-gray-800" style={{fontWeight:500}}>{order.code}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
                </div>
                <div className="col-span-3">
                  <p className="text-sm text-gray-800" style={{fontWeight:500}}>{order.receiverName}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate flex items-center gap-1">
                    <MapPin className="w-3 h-3 shrink-0" />{order.receiverAddress}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-700 truncate">{order.items}</p>
                </div>
                <div className="col-span-1 text-right">
                  {order.status === "delivered"
                    ? <p className="text-sm text-green-600" style={{fontWeight:600}}>+{order.shippingFee.toLocaleString("vi-VN")}đ</p>
                    : <p className="text-sm text-gray-400">—</p>
                  }
                </div>
                <div className="col-span-1 text-right">
                  <p className="text-sm text-gray-600">{order.cod > 0 ? `${order.cod.toLocaleString("vi-VN")}đ` : "—"}</p>
                </div>
                <div className="col-span-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${st.color} ${st.bg}`} style={{fontWeight:500}}>
                    {st.icon}{st.label}
                  </span>
                </div>
                <div className="col-span-1 flex justify-end">
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-orange-400 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
