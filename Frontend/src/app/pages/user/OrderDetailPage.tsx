import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { ChevronRight, Package, Truck, CheckCircle, XCircle, Clock, MapPin, CreditCard, ArrowLeft, X, Store, User, Phone, MessageSquare } from "lucide-react";
import { statusLabel, statusColor, type Order, type OrderStatus } from "../../data/mockOrders";
import { toast } from "sonner";
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

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

const paymentLabels: Record<string, string> = { cod: "Thanh toán khi nhận hàng", bank: "Chuyển khoản ngân hàng", momo: "Ví MoMo", zalopay: "ZaloPay" };

const statusSteps: { status: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { status: "pending",   label: "Chờ xác nhận", icon: Clock },
  { status: "confirmed", label: "Đã xác nhận",  icon: CheckCircle },
  { status: "preparing", label: "Đang chuẩn bị",icon: Package },
  { status: "shipping",  label: "Đang giao",    icon: Truck },
  { status: "delivered", label: "Đã giao",      icon: CheckCircle },
];

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, clearCart } = useCart();
  const [order,setOrder]=useState<Order|undefined>();
  const [loading,setLoading]=useState(true);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const reorderItems = async (o: Order) => {
    try {
      const res = await fetch("/seller-api/public/catalog");
      const data = res.ok ? await res.json() : null;
      const productsById = new Map<string, any>(data?.products?.map((p: any) => [`sql-product-${p.id}`, p]) ?? []);
      clearCart();
      for (const item of o.items) {
        const fresh: any = productsById.get(item.productId);
        const product: ShopProduct = {
          id: item.productId, name: item.productName, slug: item.productId,
          price: item.price, image: item.productImage || "", images: [item.productImage || ""],
          rating: 0, reviewCount: 0, sold: 0, stock: 99, category: "", categoryId: "",
          shopId: fresh ? `sql-shop-${fresh.shopId}` : "",
          shopName: fresh?.shopName ?? item.shopName ?? "",
          shopAvatar: fresh?.shopLogoUrl ?? "", shopRating: Number(fresh?.shopRating ?? 0), shopFollowers: 0,
          restaurantId: fresh ? Number(fresh.shopId) : undefined,
          description: "", specifications: [], tags: [],
        };
        addItem(product, item.quantity, item.variant ?? undefined);
      }
      toast.success("Đã thêm sản phẩm vào giỏ hàng!");
      navigate("/cart");
    } catch { toast.error("Không thể thêm vào giỏ hàng."); }
  };

  const handleCancel = async () => {
    let phone="";try{phone=JSON.parse(localStorage.getItem("user")||"{}").phone||""}catch{}
    const response=await fetch(`/seller-api/customer/orders/${encodeURIComponent(order!.id)}/cancel?phone=${encodeURIComponent(phone)}`,{method:"PUT"});
    if(response.ok){
      toast.success("Đã hủy đơn hàng");
      navigate("/orders");
    }else{
      toast.error("Không thể hủy đơn hàng.");
      setCancelModalOpen(false);
    }
  };
  useEffect(()=>{
    let phone="";
    try{phone=JSON.parse(localStorage.getItem("user")||"{}").phone||""}catch{}
    if(!phone){setLoading(false);return;}
    fetch(`/seller-api/customer/orders?phone=${encodeURIComponent(phone)}`).then(r=>r.ok?r.json():[]).then(rows=>{
      const found=rows.find((x:any)=>x.id===id);
      if(found){
        const rawStatus = found.status;
        const mappedStatus = (
          rawStatus==="completed" ? "delivered" :
          rawStatus==="arrived"   ? "confirmed" :
          rawStatus==="handed_over" ? "confirmed" :
          rawStatus
        ) as OrderStatus;
        setOrder({id:found.id,status:mappedStatus,items:found.items.map((item:any)=>({...item,id:String(item.id)})),subtotal:found.subtotal,shippingFee:found.shippingFee,discount:found.discount,total:found.total,address:{name:found.customerName,phone:found.phone,street:found.deliveryAddress,district:"",city:""},paymentMethod:found.paymentMethod,note:found.note,createdAt:found.createdAt,updatedAt:found.updatedAt,cancelReason:found.cancelReason,shopName:found.shopName,shopPhone:found.shopPhone,shipperName:found.shipperName,shipperPhone:found.shipperPhone});
      }
    }).finally(()=>setLoading(false));
  },[id]);

  if(loading)return <div className="max-w-3xl mx-auto px-4 py-20 text-center text-gray-500">Đang tải đơn hàng từ SQL Server...</div>;

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Không tìm thấy đơn hàng</h2>
        <Link to="/profile?tab=orders" className="text-orange-500 hover:text-orange-600">← Quay lại đơn hàng</Link>
      </div>
    );
  }

  const isCancelledOrReturned = order.status === "cancelled" || order.status === "returned";
  const activeStepIdx = isCancelledOrReturned ? -1 : 
    order.status === "pending" ? 0 :
    order.status === "confirmed" ? 2 :
    order.status === "shipping" ? 3 :
    order.status === "delivered" ? 4 : -1;

  return (
    <div className="max-w-3xl mx-auto px-4 py-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-gray-500">
            <Link to="/" className="hover:text-orange-500">Trang chủ</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/profile?tab=orders" className="hover:text-orange-500">Đơn hàng</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-gray-800 font-mono">{order.id}</span>
          </nav>
        </div>
        <span className={`ml-auto text-xs px-3 py-1.5 rounded-full border font-medium ${statusColor[order.status]}`}>{statusLabel[order.status]}</span>
      </div>

      <div className="space-y-4">
        {/* Timeline */}
        {!isCancelledOrReturned ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800 mb-5">Tiến trình đơn hàng</h3>
            <div className="flex items-start justify-between">
              {statusSteps.map((step, i) => {
                const done = i <= activeStepIdx;
                const active = i === activeStepIdx;
                return (
                  <div key={step.status} className="flex flex-col items-center flex-1 relative">
                    {i < statusSteps.length - 1 && (
                      <div className={`absolute top-4 left-1/2 w-full h-0.5 transition-colors ${i < activeStepIdx ? "bg-orange-500" : "bg-gray-200"}`} />
                    )}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors ${done ? "bg-orange-500" : "bg-gray-100"}`}>
                      <step.icon className={`h-4 w-4 ${done ? "text-white" : "text-gray-400"}`} />
                    </div>
                    <div className={`mt-2 text-xs text-center max-w-[80px] ${active ? "text-orange-500 font-medium" : done ? "text-gray-700" : "text-gray-400"}`}>{step.label}</div>
                  </div>
                );
              })}
            </div>
            {order.trackingCode && (
              <div className="mt-5 bg-orange-50 rounded-xl px-4 py-3 text-sm">
                Mã vận đơn: <span className="font-mono font-semibold text-orange-600">{order.trackingCode}</span>
              </div>
            )}
          </div>
        ) : (
          <div className={`rounded-2xl border p-5 flex items-center gap-3 ${order.status === "cancelled" ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"}`}>
            <XCircle className={`h-6 w-6 ${order.status === "cancelled" ? "text-red-500" : "text-gray-500"}`} />
            <div>
              <div className="font-medium text-gray-800">{statusLabel[order.status]}</div>
              {order.status === "cancelled" && order.cancelReason && <div className="text-sm text-red-600 mt-0.5">Lý do hủy: {order.cancelReason}</div>}
              {order.note && order.status !== "cancelled" && <div className="text-sm text-gray-500 mt-0.5">Lý do: {order.note}</div>}
            </div>
          </div>
        )}

        {/* Contact Cards */}
        {!isCancelledOrReturned && order.status !== "pending" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Shop Contact */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center gap-2 text-orange-600 mb-3">
                <Store className="w-5 h-5" />
                <span className="font-medium">Người gửi (Quán)</span>
              </div>
              <div className="font-semibold text-gray-800 text-lg mb-1">{order.shopName || "Cửa hàng"}</div>
              <div className="text-gray-500 text-sm mb-5">{order.shopPhone}</div>
              <div className="flex gap-3 mt-auto">
                <a href={`tel:${order.shopPhone}`} className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                  <Phone className="w-4 h-4" /> Gọi
                </a>
                <button onClick={() => navigate("/chat", { state: { orderCode: order.id, participantType: "seller" } })} className="flex-1 flex items-center justify-center gap-2 py-2 border border-orange-200 text-orange-600 rounded-xl font-medium hover:bg-orange-50 transition-colors">
                  <MessageSquare className="w-4 h-4" /> Nhắn tin
                </button>
              </div>
            </div>

            {/* Shipper Contact */}
            {order.shipperName ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 text-blue-600 mb-3">
                  <User className="w-5 h-5" />
                  <span className="font-medium">Tài xế (Shipper)</span>
                </div>
                <div className="font-semibold text-gray-800 text-lg mb-1">{order.shipperName}</div>
                <div className="text-gray-500 text-sm mb-5">{order.shipperPhone}</div>
                <div className="flex gap-3 mt-auto">
                  <a href={`tel:${order.shipperPhone}`} className="flex-1 flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                    <Phone className="w-4 h-4" /> Gọi
                  </a>
                  <button onClick={() => navigate("/chat", { state: { orderCode: order.id, participantType: "shipper" } })} className="flex-1 flex items-center justify-center gap-2 py-2 border border-blue-200 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors">
                    <MessageSquare className="w-4 h-4" /> Nhắn tin
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center justify-center text-gray-400 min-h-[160px]">
                <User className="w-8 h-8 mb-3 opacity-30" />
                <p className="font-medium">Đang tìm tài xế...</p>
              </div>
            )}
          </div>
        )}

        {/* Items */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-gray-100 font-semibold text-gray-800">Sản phẩm đã đặt</div>
          <div className="divide-y divide-gray-100">
            {order.items.map((item) => (
              <div key={item.id} className="px-5 py-4 flex gap-3 items-center">
                <img src={item.productImage} alt="" className="w-16 h-16 rounded-xl object-cover bg-gray-50 shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/64x64/f1f5f9/94a3b8?text=SP"; }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-800 line-clamp-2">{item.productName}</div>
                  {item.variant && <div className="text-xs text-gray-400 mt-0.5">{item.variant}</div>}
                  <div className="text-xs text-gray-500 mt-0.5">{item.shopName}</div>
                  <div className="text-sm font-semibold text-orange-500 mt-1">{formatVND(item.price)} × {item.quantity}</div>
                </div>
                <div className="text-sm font-bold text-gray-900 shrink-0">{formatVND(item.price * item.quantity)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery + Payment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-orange-500" />
              <h3 className="font-semibold text-gray-800">Địa chỉ giao hàng</h3>
            </div>
            <div className="text-sm text-gray-700">
              <div className="font-medium">{order.address.name} · {order.address.phone}</div>
              <div className="text-gray-500 mt-1">{order.address.street}, {order.address.district}, {order.address.city}</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-4 w-4 text-orange-500" />
              <h3 className="font-semibold text-gray-800">Thanh toán</h3>
            </div>
            <div className="text-sm text-gray-700">
              <div>{paymentLabels[order.paymentMethod]}</div>
              <div className="text-gray-500 text-xs mt-1">Đặt lúc: {formatDateTime(order.createdAt)}</div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Tóm tắt đơn hàng</h3>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between text-gray-600"><span>Tạm tính</span><span>{formatVND(order.subtotal)}</span></div>
            <div className="flex justify-between text-gray-600"><span>Phí vận chuyển</span><span className={order.shippingFee === 0 ? "text-green-600" : ""}>{order.shippingFee === 0 ? "Miễn phí" : formatVND(order.shippingFee)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Giảm giá</span><span>-{formatVND(order.discount)}</span></div>}
            <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-3">
              <span>Tổng cộng</span>
              <span className="text-orange-500">{formatVND(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {order.status === "pending" && (
          <button
            onClick={() => setCancelModalOpen(true)}
            className="w-full py-3 border-2 border-red-300 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
          >
            Hủy đơn hàng
          </button>
        )}
        {(order.status === "delivered" || order.status === "cancelled") && (
          <button
            onClick={() => void reorderItems(order)}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Mua lại
          </button>
        )}
      </div>

      <ConfirmDialog
        open={cancelModalOpen}
        onConfirm={handleCancel}
        onCancel={() => setCancelModalOpen(false)}
      />
    </div>
  );
}
