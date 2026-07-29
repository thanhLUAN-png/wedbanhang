import { useEffect, useState } from "react";
import { MapPin, Package, DollarSign, Clock, AlertCircle, Truck, Power } from "lucide-react";
import { Order } from "./types";

interface OrdersPageProps {
  orders: Order[];
  isOnline: boolean;
  onToggleOnline: () => void;
  onSelectOrder: (order: Order) => void;
  onAcceptOrder: (orderId: string) => void;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  pending:   { label: "Chờ nhận",     color: "text-yellow-700", bg: "bg-yellow-50 border border-yellow-200",  dot: "bg-yellow-400" },
  accepted:  { label: "Đã nhận",      color: "text-blue-700",   bg: "bg-blue-50 border border-blue-200",    dot: "bg-blue-400" },
  picked:    { label: "Đã lấy món",  color: "text-purple-700", bg: "bg-purple-50 border border-purple-200", dot: "bg-purple-400" },
  delivering:{ label: "Đang giao",    color: "text-orange-700", bg: "bg-orange-50 border border-orange-200", dot: "bg-orange-400" },
  delivered: { label: "Đã giao",      color: "text-green-700",  bg: "bg-green-50 border border-green-200",  dot: "bg-green-400" },
  cancelled: { label: "Đã hủy",       color: "text-red-700",    bg: "bg-red-50 border border-red-200",      dot: "bg-red-400" },
};

export function OrdersPage({ orders, isOnline, onToggleOnline, onSelectOrder, onAcceptOrder }: OrdersPageProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setCurrentDate(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  const currentDateLabel = currentDate.toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-gray-900" style={{fontSize:"22px"}}>Trang nhận đơn</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            {currentDateLabel.charAt(0).toUpperCase() + currentDateLabel.slice(1)}
          </p>
        </div>
        <button
          onClick={onToggleOnline}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm transition-all ${
            isOnline
              ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
              : "bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200"
          }`}
          style={{fontWeight:600}}
        >
          <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
          <Power className="w-4 h-4" />
          {isOnline ? "Đang hoạt động" : "Đã tắt hoạt động"}
        </button>
      </div>

      {/* Table header */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden flex-1 flex flex-col">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-200 bg-gray-100 text-xs text-gray-500 uppercase tracking-wide" style={{fontWeight:600}}>
          <div className="col-span-2">Mã đơn</div>
          <div className="col-span-3">Người nhận</div>
          <div className="col-span-2">Món ăn</div>
          <div className="col-span-1">Ship</div>
          <div className="col-span-1">COD</div>
          <div className="col-span-1">Khoảng cách</div>
          <div className="col-span-1">Trạng thái</div>
          <div className="col-span-1"></div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 bg-white rounded-b-xl">
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Package className="w-12 h-12 mb-3 opacity-30" />
              <p>Không có đơn hàng nào</p>
            </div>
          ) : orders.map(order => {
            const st = statusConfig[order.status];
            return (
              <div
                key={order.id}
                className="grid grid-cols-12 gap-4 px-4 py-3.5 hover:bg-orange-50/50 cursor-pointer transition-colors items-center group"
                onClick={() => onSelectOrder(order)}
              >
                <div className="col-span-2">
                  <p className="text-sm text-gray-800" style={{fontWeight:500}}>{order.code}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
                <div className="col-span-3">
                  <p className="text-sm text-gray-800" style={{fontWeight:500}}>{order.receiverName}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate flex items-center gap-1">
                    <MapPin className="w-3 h-3 shrink-0" />{order.receiverAddress}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-700 truncate">{order.items}</p>
                  <p className="text-xs text-gray-400">{order.weight} kg</p>
                </div>
                <div className="col-span-1">
                  <p className="text-sm text-green-600" style={{fontWeight:600}}>+{order.shippingFee.toLocaleString("vi-VN")}đ</p>
                </div>
                <div className="col-span-1">
                  <p className="text-sm text-gray-700">{order.cod > 0 ? `${order.cod.toLocaleString("vi-VN")}đ` : "—"}</p>
                </div>
                <div className="col-span-1">
                  <p className="text-sm text-gray-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{order.distance}</p>
                </div>
                <div className="col-span-1">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${st.color} ${st.bg}`} style={{fontWeight:500}}>
                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                    {st.label}
                  </span>
                </div>
                <div className="col-span-1 flex justify-end">
                  {order.status === "pending" ? (
                    <button
                      onClick={e => { e.stopPropagation(); onAcceptOrder(order.id); }}
                      disabled={!isOnline}
                      className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                      style={{fontWeight:500}}
                    >
                      {isOnline ? "Nhận đơn" : "Đang tắt"}
                    </button>
                  ) : (
                    <button
                      onClick={e => { e.stopPropagation(); onSelectOrder(order); }}
                      className="px-3 py-1.5 border border-orange-300 text-orange-600 hover:bg-orange-50 text-xs rounded-lg transition-colors whitespace-nowrap"
                      style={{fontWeight:500}}
                    >
                      Chi tiết
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
