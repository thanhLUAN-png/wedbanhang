import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { ChevronRight, MapPin, CreditCard, Truck, Check, Loader2, Edit3 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../../context/CartContext";

function formatVND(v: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);
}

const paymentMethods = [
  { id: "cod",     label: "Thanh toán khi nhận hàng (COD)", icon: "💵", desc: "Trả tiền mặt khi nhận hàng" },
  { id: "momo",    label: "Ví MoMo",                         icon: "💜", desc: "Thanh toán qua ví điện tử MoMo" },
  { id: "zalopay", label: "ZaloPay",                          icon: "🔵", desc: "Thanh toán qua ví ZaloPay" },
  { id: "bank",    label: "Chuyển khoản ngân hàng",           icon: "🏦", desc: "ATM / Internet Banking" },
];

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({ name: "Nguyễn Văn An", phone: "0901234567", street: "123 Nguyễn Huệ", district: "Quận 1", city: "TP. Hồ Chí Minh" });
  const [editingAddress, setEditingAddress] = useState(false);

  const shippingFee = total >= 99000 ? 0 : 30000;
  const finalTotal = total + shippingFee;

  async function handlePlaceOrder() {
    if (!address.name || !address.phone || !address.street || !address.city) {
      toast.error("Vui lòng nhập đầy đủ địa chỉ giao hàng");
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    clearCart();
    toast.success("Đặt hàng thành công! Cảm ơn bạn đã mua hàng 🎉");
    navigate("/profile?tab=orders");
  }

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Giỏ hàng trống</h2>
        <Link to="/" className="bg-orange-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors">Mua sắm ngay</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-5">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-5">
        <Link to="/" className="hover:text-orange-500">Trang chủ</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/cart" className="hover:text-orange-500">Giỏ hàng</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-gray-800">Thanh toán</span>
      </nav>

      <h1 className="text-xl font-bold text-gray-900 mb-5">Thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <div className="lg:col-span-3 space-y-4">
          {/* Address */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-500" />
                <h3 className="font-semibold text-gray-800">Địa chỉ nhận hàng</h3>
              </div>
              <button onClick={() => setEditingAddress(!editingAddress)} className="flex items-center gap-1 text-orange-500 text-sm hover:text-orange-600">
                <Edit3 className="h-3.5 w-3.5" />{editingAddress ? "Lưu" : "Thay đổi"}
              </button>
            </div>
            {editingAddress ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Họ tên</label>
                    <input value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Số điện thoại</label>
                    <input value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Địa chỉ</label>
                  <input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Quận/Huyện</label>
                    <input value={address.district} onChange={(e) => setAddress({ ...address, district: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Tỉnh/Thành phố</label>
                    <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-orange-50 rounded-xl p-4">
                <div className="font-medium text-gray-900 text-sm">{address.name} · {address.phone}</div>
                <div className="text-sm text-gray-600 mt-0.5">{address.street}, {address.district}, {address.city}</div>
              </div>
            )}
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Truck className="h-4 w-4 text-orange-500" />
              <h3 className="font-semibold text-gray-800">Phương thức vận chuyển</h3>
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-800">Giao hàng tiêu chuẩn</div>
                <div className="text-xs text-gray-500 mt-0.5">Nhận hàng trong 3-5 ngày làm việc</div>
              </div>
              <div className="text-sm font-semibold text-green-600">{shippingFee === 0 ? "Miễn phí" : formatVND(shippingFee)}</div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-4 w-4 text-orange-500" />
              <h3 className="font-semibold text-gray-800">Phương thức thanh toán</h3>
            </div>
            <div className="space-y-2">
              {paymentMethods.map((m) => (
                <label key={m.id} className={`flex items-center gap-3 p-3.5 border-2 rounded-xl cursor-pointer transition-colors ${paymentMethod === m.id ? "border-orange-500 bg-orange-50" : "border-gray-100 hover:border-gray-200"}`}>
                  <input type="radio" name="payment" value={m.id} checked={paymentMethod === m.id} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-orange-500" />
                  <span className="text-xl">{m.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-800">{m.label}</div>
                    <div className="text-xs text-gray-500">{m.desc}</div>
                  </div>
                  {paymentMethod === m.id && <Check className="h-4 w-4 text-orange-500 shrink-0" />}
                </label>
              ))}
            </div>
          </div>

          {/* Note */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800 mb-3">Ghi chú đơn hàng</h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..."
              rows={2}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
            />
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
            <h3 className="font-semibold text-gray-800 mb-4">Đơn hàng ({items.length})</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-3 items-center">
                  <img src={item.product.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-50 shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/48x48/f1f5f9/94a3b8?text=SP"; }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-800 line-clamp-2 leading-snug">{item.product.name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">x{item.quantity}</div>
                  </div>
                  <div className="text-xs font-semibold text-orange-500 shrink-0">{formatVND(item.product.price * item.quantity)}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính</span><span>{formatVND(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Vận chuyển</span><span className={shippingFee === 0 ? "text-green-600" : ""}>{shippingFee === 0 ? "Miễn phí" : formatVND(shippingFee)}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-3">
                <span>Tổng cộng</span>
                <span className="text-orange-500">{formatVND(finalTotal)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full mt-5 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Đang xử lý...</> : "Đặt hàng"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
