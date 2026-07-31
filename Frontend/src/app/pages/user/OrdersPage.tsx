import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronRight, PackageOpen, X } from "lucide-react";
import { toast } from "sonner";
import { statusLabel, statusColor, type Order, type OrderStatus } from "../../data/mockOrders";
import { useCart } from "../../context/CartContext";
import type { ShopProduct } from "../../data/mockShopProducts";

function ConfirmDialog({ open, onConfirm, onCancel }: { open: boolean; onConfirm: () => void; onCancel: () => void; }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
        <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold text-gray-900 mb-6">Bạn có muốn hủy đơn hàng này không?</h3>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Đóng
          </button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-colors shadow-sm">
            Hủy đơn
          </button>
        </div>
      </div>
    </div>
  );
}

function formatVND(v: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);
}

function OrderCard({ order, onCancel, onReorder }: { order: Order; onCancel: (id: string) => void; onReorder: (order: Order) => void }) {
  const isCollapsible = order.status === "delivered" || order.status === "cancelled";
  const [isExpanded, setIsExpanded] = useState(!isCollapsible);

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden hover:border-orange-200 transition-colors">
      {/* Header – bấm vào để xã/thu nếu là đã giao / đã hủy */}
      <div
        className={`px-5 py-3.5 bg-gray-50 flex flex-wrap items-center justify-between gap-2 ${isCollapsible ? "cursor-pointer select-none hover:bg-gray-100 transition-colors" : ""}`}
        onClick={() => isCollapsible && setIsExpanded(prev => !prev)}
      >
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-800">{order.items[0]?.shopName}</span>
          <span className="text-gray-300">|</span>
          <span className="text-sm font-mono text-gray-500">#{order.id}</span>
          {isCollapsible && !isExpanded && (
            <span className="text-sm font-bold text-orange-500 ml-1">{formatVND(order.total)}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-3 py-1 rounded-full border font-medium ${statusColor[order.status]}`}>
            {statusLabel[order.status]}
          </span>
          {isCollapsible && (
            <ChevronRight
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
            />
          )}
        </div>
      </div>

      {/* Body – chỉ hiện khi expanded */}
      {isExpanded && (
        <div className="p-5 space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 items-start">
              <img
                src={item.productImage}
                alt=""
                className="w-16 h-16 rounded-xl object-cover bg-gray-50 shrink-0 border border-gray-100"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/64x64/f1f5f9/94a3b8?text=SP"; }}
              />
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.productId}`} className="text-sm font-medium text-gray-800 hover:text-orange-500 line-clamp-2 mb-1">
                  {item.productName}
                </Link>
                {item.variant && <div className="text-xs text-gray-500">Phân loại: {item.variant}</div>}
                <div className="text-sm font-medium text-gray-600 mt-1">x{item.quantity}</div>
              </div>
              <div className="text-sm font-bold text-orange-500 shrink-0">
                {formatVND(item.price)}
              </div>
            </div>
          ))}

          <div className="border-t border-gray-100 pt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-gray-500 flex flex-col gap-1">
              {order.status === "cancelled" && order.cancelReason && <div className="text-red-500 font-medium">Lý do hủy: {order.cancelReason}</div>}
              <div>Thành tiền: <span className="text-lg font-bold text-orange-500 ml-1">{formatVND(order.total)}</span></div>
            </div>
            <div className="flex items-center gap-3">
              {order.status === "pending" && (
                <button
                  onClick={(e) => { e.stopPropagation(); onCancel(order.id); }}
                  className="px-5 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                >
                  Hủy đơn
                </button>
              )}
              {(order.status === "delivered" || order.status === "cancelled") && (
                <button
                  onClick={(e) => { e.stopPropagation(); onReorder(order); }}
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Mua lại
                </button>
              )}
              <Link
                to={`/orders/${order.id}`}
                className="px-5 py-2 border border-gray-200 hover:border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-colors flex items-center gap-1"
              >
                Xem chi tiết
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const navigate = useNavigate();
  const { addItem, clearCart } = useCart();
  const [filter, setFilter] = useState<string>("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const user = (() => { try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; } })();

  const loadOrders = async () => {
    if (!user.phone) { setLoadError("Vui lòng đăng nhập tài khoản có số điện thoại để xem đơn hàng."); setLoading(false); return; }
    try {
      const response = await fetch(`/seller-api/customer/orders?phone=${encodeURIComponent(user.phone)}`);
      if (!response.ok) throw new Error();
      const rows = await response.json();
      setOrders(rows.map((order: any) => ({
        id: order.id,
        status: (order.status === "completed" ? "delivered" :
          order.status === "arrived" ? "confirmed" :
          order.status === "handed_over" ? "confirmed" :
          order.status) as OrderStatus,
        items: order.items.map((item: any) => ({ ...item, id: String(item.id) })),
        subtotal: order.subtotal, shippingFee: order.shippingFee, discount: order.discount, total: order.total,
        address: { name: order.customerName, phone: order.phone, street: order.deliveryAddress, district: "", city: "" },
        paymentMethod: order.paymentMethod, note: order.note, createdAt: order.createdAt, updatedAt: order.updatedAt,
        cancelReason: order.cancelReason,
        shopName: order.shopName, shopPhone: order.shopPhone,
        shipperName: order.shipperName, shipperPhone: order.shipperPhone
      })));
    } catch { setLoadError("Không thể tải đơn hàng từ SQL Server."); }
    finally { setLoading(false); }
  };

  useEffect(() => { void loadOrders(); }, []);

  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const [cancelModal, setCancelModal] = useState<string | null>(null);

  const cancelOrder = (orderId: string) => {
    setCancelModal(orderId);
  };

  const confirmCancel = async () => {
    if (!cancelModal) return;
    const response = await fetch(`/seller-api/customer/orders/${encodeURIComponent(cancelModal)}/cancel?phone=${encodeURIComponent(user.phone)}`, { method: "PUT" });
    if (!response.ok) { toast.error("Không thể hủy đơn hàng."); setCancelModal(null); return; }
    await loadOrders();
    toast.success("Đã hủy đơn hàng");
    setCancelModal(null);
  };

  const reorderItems = async (order: Order) => {
    try {
      const res = await fetch("/seller-api/public/catalog");
      const data = res.ok ? await res.json() : null;
      const productsById = new Map<string, any>(data?.products?.map((p: any) => [`sql-product-${p.id}`, p]) ?? []);
      clearCart();
      let added = 0;
      for (const item of order.items) {
        const fresh: any = productsById.get(item.productId);
        const product: ShopProduct = {
          id: item.productId,
          name: item.productName,
          slug: item.productId,
          price: item.price,
          image: item.productImage || "",
          images: [item.productImage || ""],
          rating: 0, reviewCount: 0, sold: 0, stock: 99,
          category: "", categoryId: "",
          shopId: fresh ? `sql-shop-${fresh.shopId}` : "",
          shopName: fresh?.shopName ?? item.shopName ?? "",
          shopAvatar: fresh?.shopLogoUrl ?? "",
          shopRating: Number(fresh?.shopRating ?? 0),
          shopFollowers: 0,
          restaurantId: fresh ? Number(fresh.shopId) : undefined,
          description: "", specifications: [], tags: [],
        };
        addItem(product, item.quantity, item.variant ?? undefined);
        added++;
      }
      if (added > 0) { toast.success("Đã thêm sản phẩm vào giỏ hàng!"); navigate("/cart"); }
      else toast.error("Đơn hàng không có sản phẩm.");
    } catch { toast.error("Không thể thêm vào giỏ hàng."); }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <PackageOpen className="h-6 w-6 text-orange-500" />
        <h1 className="text-2xl font-bold text-gray-900">Đơn hàng của tôi</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {[
            { id: "all", label: "Tất cả" },
            { id: "pending", label: "Chờ xác nhận" },
            { id: "confirmed", label: "Đang chuẩn bị" },
            { id: "shipping", label: "Đang giao" },
            { id: "delivered", label: "Đã giao" },
            { id: "cancelled", label: "Đã hủy" },
          ].map((s) => (
            <button
              key={s.id}
              onClick={() => setFilter(s.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === s.id ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Order List */}
        <div className="space-y-4">
          {loading && <div className="text-center py-12 text-gray-500">Đang tải đơn hàng từ SQL Server...</div>}
          {loadError && <div className="text-center py-6 text-red-500">{loadError}</div>}
          {!loading && !loadError && filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <PackageOpen className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p>Chưa có đơn hàng nào</p>
            </div>
          ) : (
            filtered.map((order) => (
              <OrderCard key={order.id} order={order} onCancel={cancelOrder} onReorder={reorderItems} />
            ))
          )}
        </div>
      </div>

      <ConfirmDialog
        open={cancelModal !== null}
        onConfirm={confirmCancel}
        onCancel={() => setCancelModal(null)}
      />
    </div>
  );
}
