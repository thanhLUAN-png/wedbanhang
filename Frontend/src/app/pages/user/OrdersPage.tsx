import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ChevronRight, PackageOpen } from "lucide-react";
import { toast } from "sonner";
import { statusLabel, statusColor, type Order, type OrderStatus } from "../../data/mockOrders";

function formatVND(v: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);
}

export default function OrdersPage() {
  const [filter, setFilter] = useState<string>("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading,setLoading]=useState(true);
  const [loadError,setLoadError]=useState("");
  const user=(()=>{try{return JSON.parse(localStorage.getItem("user")||"{}")}catch{return {}}})();
  const loadOrders=async()=>{
    if(!user.phone){setLoadError("Vui lòng đăng nhập tài khoản có số điện thoại để xem đơn hàng.");setLoading(false);return;}
    try{
      const response=await fetch(`/seller-api/customer/orders?phone=${encodeURIComponent(user.phone)}`);
      if(!response.ok)throw new Error();
      const rows=await response.json();
      setOrders(rows.map((order:any)=>({
        id:order.id,status:(order.status==="completed"?"delivered":order.status) as OrderStatus,
        items:order.items.map((item:any)=>({...item,id:String(item.id)})),
        subtotal:order.subtotal,shippingFee:order.shippingFee,discount:order.discount,total:order.total,
        address:{name:order.customerName,phone:order.phone,street:order.deliveryAddress,district:"",city:""},
        paymentMethod:order.paymentMethod,note:order.note,createdAt:order.createdAt,updatedAt:order.updatedAt
      })));
    }catch{setLoadError("Không thể tải đơn hàng từ SQL Server.");}
    finally{setLoading(false);}
  };
  useEffect(()=>{void loadOrders()},[]);
  const filtered = filter === "all" ? orders : orders.filter(o => o.status === filter);

  const cancelOrder = async (orderId: string) => {
    if (!window.confirm("Bạn có chắc muốn hủy đơn hàng này không?")) return;
    const response=await fetch(`/seller-api/customer/orders/${encodeURIComponent(orderId)}/cancel?phone=${encodeURIComponent(user.phone)}`,{method:"PUT"});
    if(!response.ok){toast.error("Không thể hủy đơn hàng.");return;}
    await loadOrders();toast.success("Đã hủy đơn hàng");
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
          {[{ id: "all", label: "Tất cả" }, { id: "pending", label: "Chờ xác nhận" }, { id: "confirmed", label: "Đã xác nhận" }, { id: "shipping", label: "Đang giao" }, { id: "delivered", label: "Đã giao" }, { id: "cancelled", label: "Đã hủy" }].map((s) => (
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
          {loading&&<div className="text-center py-12 text-gray-500">Đang tải đơn hàng từ SQL Server...</div>}
          {loadError&&<div className="text-center py-6 text-red-500">{loadError}</div>}
          {!loading&&!loadError&&filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <PackageOpen className="h-12 w-12 mx-auto text-gray-300 mb-3" />
              <p>Chưa có đơn hàng nào</p>
            </div>
          ) : filtered.map((order) => (
            <div key={order.id} className="border border-gray-100 rounded-xl overflow-hidden hover:border-orange-200 transition-colors">
              <div className="px-5 py-3.5 bg-gray-50 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-gray-800">{order.items[0]?.shopName}</span>
                  <span className="text-gray-300">|</span>
                  <span className="text-sm font-mono text-gray-500">#{order.id}</span>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full border font-medium ${statusColor[order.status]}`}>
                  {statusLabel[order.status]}
                </span>
              </div>
              
              <div className="p-5 space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-start">
                    <img src={item.productImage} alt="" className="w-16 h-16 rounded-xl object-cover bg-gray-50 shrink-0 border border-gray-100" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/64x64/f1f5f9/94a3b8?text=SP"; }} />
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
                  <div className="text-sm text-gray-500">
                    Thành tiền: <span className="text-lg font-bold text-orange-500 ml-1">{formatVND(order.total)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {order.status === "pending" && (
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="px-5 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                      >
                        Hủy đơn
                      </button>
                    )}
                    {order.status === "delivered" && (
                      <button className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors">
                        Mua lại
                      </button>
                    )}
                    <Link to={`/orders/${order.id}`} className="px-5 py-2 border border-gray-200 hover:border-gray-300 rounded-lg text-sm font-medium text-gray-700 transition-colors flex items-center gap-1">
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
