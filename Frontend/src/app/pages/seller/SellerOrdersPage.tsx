import { useEffect, useState } from "react";
import { Search, MessageCircle, ChevronRight, Bike, User, ChevronDown, ChevronUp, CheckCircle, X } from "lucide-react";
import { useNavigate } from "react-router";
import { sellerStatusLabel, sellerStatusColor, type SellerOrderStatus, type SellerOrder } from "../../data/mockSellerData";

function formatVND(v: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);
}

function formatOrderTime(s: string) {
  const d = new Date(s);
  const hh = d.getHours();
  const mm = String(d.getMinutes()).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const mo = String(d.getMonth() + 1).padStart(2, "0");
  return `Đặt lúc ${hh}:${mm} ngày ${dd}/${mo}`;
}

const TABS: { id: SellerOrderStatus | "all"; label: string }[] = [
  { id: "all",       label: "Tất cả" },
  { id: "pending",   label: "Nhận đơn" },
  { id: "confirmed", label: "Đang chuẩn bị" },
  { id: "shipping",  label: "Đang giao" },
  { id: "completed", label: "Hoàn thành" },
  { id: "returned",  label: "Trả hàng/Hoàn tiền" },
  { id: "cancelled", label: "Đã hủy" },
];

const paymentLabel: Record<string, string> = {
  cod: "Tiền mặt (COD)", bank: "Chuyển khoản", momo: "MoMo", zalopay: "ZaloPay",
};

const cardBgColor: Record<SellerOrderStatus, string> = {
  pending:   "bg-orange-50/40 hover:bg-orange-50/80 border-orange-100",
  confirmed: "bg-blue-50/50 hover:bg-blue-50 border-blue-100",
  arrived:   "bg-blue-50/50 hover:bg-blue-50 border-blue-100",
  shipping:  "bg-sky-50/50 hover:bg-sky-50 border-sky-100",
  completed: "bg-green-50/50 hover:bg-green-50 border-green-100",
  cancelled: "bg-red-50/50 hover:bg-red-50 border-red-100",
  returned:  "bg-purple-50/50 hover:bg-purple-50 border-purple-100",
};

// Confirm dialog component
function ConfirmDialog({
  open, title, message, confirmLabel, confirmClass, onConfirm, onCancel
}: {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel: string;
  confirmClass: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <h3 className={`text-lg font-bold text-gray-900 ${message ? 'mb-2' : 'mb-6'}`}>{title}</h3>
        {message && <p className="text-sm text-gray-600 mb-6">{message}</p>}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Huỷ
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

function OrderCard({
  order,
  onConfirm,
  onCancel,
  onHandOff,
}: {
  order: SellerOrder;
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
  onHandOff: (id: string, currentStatus: string) => void;
}) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const isCollapsible = order.status === "shipping" || order.status === "completed";
  const [isCardExpanded, setIsCardExpanded] = useState(!isCollapsible);
  const [dialog, setDialog] = useState<null | "confirm" | "cancel" | "handoff">(null);

  const displayedItems = isExpanded ? order.items : order.items.slice(0, 3);
  const hiddenCount = order.items.length - 3;

  return (
    <>
      <div className={`p-5 transition-colors border rounded-2xl ${cardBgColor[order.status]}`}>
        {/* ── Header row ── */}
        <div
          className={`flex flex-wrap items-center justify-between gap-2 mb-4 ${isCollapsible ? 'cursor-pointer select-none' : ''}`}
          onClick={() => isCollapsible && setIsCardExpanded(prev => !prev)}
        >
          <div className="flex items-center gap-2.5">
            <span className="font-mono text-sm font-bold text-gray-800 tracking-wider">#{order.orderCode}</span>
            <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${sellerStatusColor[order.status]}`}>
              {sellerStatusLabel[order.status]}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {(!isCardExpanded && isCollapsible) ? (
              <>
                <span className="font-bold text-orange-500 text-sm">{formatVND(order.total)}</span>
                <span className="text-xs text-gray-400 hidden sm:inline-block">
                  {formatOrderTime(order.createdAt)}
                </span>
                <ChevronDown className="w-5 h-5 text-gray-400" />
              </>
            ) : (
              <>
                <span className="text-xs text-gray-400">
                  {formatOrderTime(order.createdAt)} · Thanh toán bằng {paymentLabel[order.paymentMethod]}
                </span>
                {isCollapsible && (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                )}
              </>
            )}
          </div>
        </div>

        {isCardExpanded && (
          <div className="mt-2">

        {/* ── Items ── */}
        <div className="space-y-3 mb-2">
          {displayedItems.map(item => (
            <div key={item.id} className="flex items-center gap-3">
              <img
                src={item.productImage}
                alt={item.productName}
                className="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-100"
                onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/48x48/f1f5f9/94a3b8?text=SP"; }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{item.productName}</p>
                {item.variant && <p className="text-xs text-gray-400">{item.variant}</p>}
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm text-gray-500">x{item.quantity}</p>
                <p className="text-sm font-bold text-orange-500">{formatVND(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Nút Xem thêm / Thu gọn */}
        {order.items.length > 3 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-orange-500 font-medium mb-4 transition-colors"
          >
            {isExpanded ? (
              <>Thu gọn <ChevronUp className="w-3.5 h-3.5" /></>
            ) : (
              <>Xem thêm {hiddenCount} món <ChevronDown className="w-3.5 h-3.5" /></>
            )}
          </button>
        )}
        {order.items.length <= 3 && <div className="mb-4" />}

        {/* ── Footer ── */}
        <div className="pt-3 border-t border-gray-100 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-2 flex-1 min-w-0">
              {/* Customer Info */}
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-400 shrink-0" />
                <span className="font-medium text-gray-800">{order.customer.name}</span>
                <span className="text-gray-400">·</span>
                <span className="text-gray-500">{order.customer.phone}</span>
                <button
                  onClick={() => navigate(`/seller/chat?tab=customers&newId=c_${order.customer.phone}&newName=${encodeURIComponent(order.customer.name)}&orderCode=${order.orderCode}`)}
                  className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-full transition-colors ml-1"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Chat
                </button>
              </div>

              {/* Note */}
              {order.note ? (
                <p className="text-xs text-gray-500 italic bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-lg inline-block">
                  📝 Ghi chú: "{order.note}"
                </p>
              ) : (
                <p className="text-xs text-gray-400 italic bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-lg inline-block">
                  📝 Không có ghi chú
                </p>
              )}

              {/* Shipper Info / Status */}
              {order.shipperName ? (
                <div className="flex items-center gap-2 text-xs bg-green-50 border border-green-100 px-3 py-2 rounded-lg mt-2 w-max">
                  <Bike className="w-4 h-4 text-green-500 shrink-0" />
                  <span className="text-green-700 font-medium">Shipper: {order.shipperName}</span>
                  <button
                    onClick={() => navigate(`/seller/chat?tab=shippers&newId=s_${encodeURIComponent(order.shipperName!)}&newName=${encodeURIComponent(order.shipperName!)}&orderCode=${order.orderCode}`)}
                    className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-full transition-colors ml-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Chat
                  </button>
                </div>
              ) : order.status === "confirmed" ? (
                order.shipperName ? (
                  <div className="flex items-center gap-2 text-xs bg-orange-50 border border-orange-100 px-3 py-2 rounded-lg mt-2 w-max">
                    <Bike className="w-4 h-4 text-orange-400 animate-pulse" />
                    <span className="text-orange-600 font-medium">Shipper đang trên đường tới...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-3 py-2 rounded-lg mt-2 w-max">
                    <Bike className="w-4 h-4 text-blue-400 animate-pulse" />
                    <span className="text-blue-600 font-medium">Đang chờ shipper đến lấy hàng...</span>
                  </div>
                )
              ) : order.status === "pending" ? (
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-3 py-2 rounded-lg mt-2 w-max">
                  <Bike className="w-4 h-4 text-gray-400 animate-pulse" />
                  <span className="text-orange-500 font-medium">Đang tìm shipper...</span>
                </div>
              ) : null}

              {/* Địa chỉ giao hàng */}
              <p className="text-xs text-gray-400">
                📍 {order.customer.address}, {order.customer.city}
              </p>
            </div>

            <div className="text-right shrink-0 flex flex-col items-end gap-2">
              <div>
                <p className="text-xs text-gray-400">Tổng tiền</p>
                <p className="font-bold text-orange-500 text-lg">{formatVND(order.total)}</p>
              </div>

              {/* ── Action buttons theo từng trạng thái ── */}

              {/* ARRIVED: Shipper đã tới – nút Giao hàng (xanh) */}
              {order.status === "arrived" && (
                <div className="flex flex-col gap-2 items-end">
                  <button
                    onClick={() => setDialog("handoff")}
                    className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4" /> Giao hàng cho Shipper
                  </button>
                </div>
              )}

              {/* CONFIRMED: luôn xám – dù có shipper hay chưa, phải đợi shipper tới quán */}
              {order.status === "confirmed" && (
                <div className="flex flex-col gap-2 items-end">
                  <button
                    disabled
                    className="flex items-center gap-1.5 px-4 py-2 bg-gray-200 text-gray-400 rounded-xl text-sm font-medium cursor-not-allowed"
                  >
                    <Bike className="w-4 h-4" /> {order.shipperName ? "Chờ Shipper tới quán" : "Chờ Shipper"}
                  </button>
                </div>
              )}

              {/* PENDING: Xác nhận đơn */}
              {order.status === "pending" && (
                <div className="flex flex-row gap-2 items-center">
                  <button
                    onClick={() => setDialog("cancel")}
                    className="flex items-center gap-1.5 px-4 py-2 border border-red-200 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
                  >
                    <X className="w-4 h-4" /> Từ chối
                  </button>
                  <button
                    onClick={() => setDialog("confirm")}
                    className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm"
                  >
                    <CheckCircle className="w-4 h-4" /> Xác nhận đơn
                  </button>
                </div>
              )}

              {/* OTHER: Chi tiết */}
              {(order.status === "returned" || order.status === "cancelled") && (
                <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 px-4 py-2 rounded-xl hover:border-gray-300 transition-colors">
                  Chi tiết <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
          </div>
        )}
      </div>

      {/* Dialog xác nhận đơn */}
      <ConfirmDialog
        open={dialog === "confirm"}
        title="Xác nhận đơn hàng?"
        message={`Bạn sẽ xác nhận đơn #${order.orderCode} và bắt đầu chuẩn bị món. Shipper sẽ được thông báo đến lấy hàng.`}
        confirmLabel="Xác nhận"
        confirmClass="bg-orange-500 hover:bg-orange-600"
        onConfirm={() => { setDialog(null); onConfirm(order.id); }}
        onCancel={() => setDialog(null)}
      />

      <ConfirmDialog
        open={dialog === "handoff"}
        title="Giao hàng cho Shipper?"
        confirmLabel="Xác nhận giao"
        confirmClass="bg-green-500 hover:bg-green-600"
        onConfirm={() => { setDialog(null); onHandOff(order.id, order.status); }}
        onCancel={() => setDialog(null)}
      />

      {/* Dialog từ chối đơn */}
      <ConfirmDialog
        open={dialog === "cancel"}
        title="Từ chối đơn hàng?"
        message={`Bạn sẽ từ chối đơn #${order.orderCode}. Khách hàng sẽ được hoàn tiền (nếu đã thanh toán trước).`}
        confirmLabel="Từ chối"
        confirmClass="bg-red-500 hover:bg-red-600"
        onConfirm={() => { setDialog(null); onCancel(order.id); }}
        onCancel={() => setDialog(null)}
      />
    </>
  );
}

export default function SellerOrdersPage() {
  const [activeTab, setActiveTab] = useState<SellerOrderStatus | "all">("all");
  const [search, setSearch] = useState("");
  // Local state để demo chuyển trạng thái
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = () => fetch("/seller-api/seller/orders?sellerCode=SL-BT-0001")
      .then(async response => {
        if (!response.ok) throw new Error();
        return response.json();
      })
      .then((data: any[]) => setOrders(data.map(order => ({
        id: order.id,
        orderCode: order.orderCode,
        status: order.status,
        paymentMethod: order.paymentMethod?.toLowerCase() === "cod" ? "cod" : order.paymentMethod?.toLowerCase() === "momo" ? "momo" : "bank",
        customer: { name: order.customerName, phone: order.customerPhone, address: order.deliveryAddress, city: "" },
        items: order.items.map((item: any) => ({ id: item.id, productName: item.productName, productImage: "https://placehold.co/48x48/f1f5f9/94a3b8?text=SP", price: item.price, quantity: item.quantity })),
        subtotal: order.items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0), shippingFee: 0, discount: 0,
        total: order.total, note: order.note, shipperName: order.shipperName, createdAt: order.orderedAt,
      } as SellerOrder))))
      .catch(() => setError("Không thể tải đơn hàng từ SQL Server."))
      .finally(() => setLoading(false));
    void load();
    const timer = window.setInterval(() => void load(), 5000);
    return () => window.clearInterval(timer);
  }, []);

  const updateOrderStatus = async (id: string, status: "confirmed" | "shipping" | "cancelled" | "ready") => {
    const response = await fetch(`/seller-api/seller/orders/${encodeURIComponent(id)}/status?sellerCode=SL-BT-0001`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      setError("Trạng thái đơn đã thay đổi. Vui lòng tải lại danh sách.");
      return;
    }
    setError("");
    // "ready" -> DB sets shipping, but UI should show shipping
    const uiStatus = status === "ready" ? "shipping" : status;
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: uiStatus } : o));
  };

  const handleConfirm = (id: string) => {
    void updateOrderStatus(id, "confirmed");
  };

  const handleCancel = (id: string) => {
    void updateOrderStatus(id, "cancelled");
  };

  const handleHandOff = (id: string, currentStatus?: string) => {
    // Nếu shipper đã tới quán (arrived) -> dùng "ready"
    // Nếu shipper đã nhận nhưng chưa tới (confirmed) -> dùng "ready_confirmed"
    const action = currentStatus === "confirmed" ? "ready_confirmed" : "ready";
    void updateOrderStatus(id, action as any);
  };

  const filtered = orders.filter(o => {
    const matchTab = activeTab === "all" 
      || o.status === activeTab 
      || (activeTab === "confirmed" && o.status === "arrived");
    const matchSearch =
      o.orderCode.includes(search) ||
      o.customer.name.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const countBy = (id: string) => {
    if (id === "all") return orders.length;
    if (id === "confirmed") return orders.filter(o => o.status === "confirmed" || o.status === "arrived").length;
    return orders.filter(o => o.status === id).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
        <div className="relative">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            type="text"
            placeholder="Tìm mã đơn, tên khách..."
            className="pl-10 pr-4 py-2.5 w-full sm:w-64 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 text-sm"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-100 scrollbar-hide">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.id ? "border-orange-500 text-orange-500" : "border-transparent text-gray-500 hover:text-gray-700"}`}
            >
              {tab.label}
              {countBy(tab.id) > 0 && (
                <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${activeTab === tab.id ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"}`}>
                  {countBy(tab.id)}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Order List */}
        <div className="p-4 flex flex-col gap-4 bg-gray-50/50">
          {error ? <div className="py-16 text-center text-red-500">{error}</div> : loading ? <div className="py-16 text-center text-gray-400">Đang tải đơn hàng...</div> : filtered.length === 0 ? (
            <div className="py-16 text-center text-gray-400">Không có đơn hàng nào</div>
          ) : filtered.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
              onHandOff={handleHandOff}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
