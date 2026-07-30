import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Minus, Plus, Trash2, Tag, ShoppingBag, ChevronRight, Store } from "lucide-react";
import { toast } from "sonner";
import { cartLineKey, useCart } from "../../context/CartContext";

function formatVND(v: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);
}

type AppliedVoucher = { type: "percent" | "fixed"; value: number; label: string; restaurantId: number; restaurantName: string };

export default function CartPage() {
  const { items, updateQty, removeItem } = useCart();
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState("");
  const [appliedVoucher, setAppliedVoucher] = useState<AppliedVoucher | null>(null);
  const [selected, setSelected] = useState<string[]>(items.map((i) => cartLineKey(i.product.id,i.variant)));

  const subtotal = items
    .filter((i) => selected.includes(cartLineKey(i.product.id,i.variant)))
    .reduce((s, i) => s + i.product.price * i.quantity, 0);
  const shippingFee = subtotal >= 99000 ? 0 : 30000;
  const promotionSubtotal = appliedVoucher
    ? items.filter(i => selected.includes(cartLineKey(i.product.id,i.variant)) && i.product.restaurantId === appliedVoucher.restaurantId).reduce((sum,i)=>sum+i.product.price*i.quantity,0)
    : 0;
  const discount = appliedVoucher
    ? appliedVoucher.type === "percent"
      ? Math.round(promotionSubtotal * appliedVoucher.value / 100)
      : Math.min(appliedVoucher.value, promotionSubtotal)
    : 0;
  const total = subtotal + shippingFee - discount;

  async function applyVoucher() {
    const code=voucher.toUpperCase().trim();
    if(!code){toast.error("Vui lòng nhập mã giảm giá");return;}
    const response=await fetch(`/seller-api/public/promotions/validate?code=${encodeURIComponent(code)}`);
    const body=await response.json().catch(()=>null);
    if(!response.ok){toast.error(body?.error||"Mã giảm giá không hợp lệ");return;}
    const hasShop=items.some(i=>selected.includes(cartLineKey(i.product.id,i.variant))&&i.product.restaurantId===Number(body.restaurantId));
    if(!hasShop){toast.error(`Mã này chỉ áp dụng cho quán ${body.restaurantName}, nhưng bạn chưa chọn món của quán đó.`);return;}
    const type=body.discountType==="percent"?"percent":"fixed";
    const value=Number(body.discount);
    setAppliedVoucher({type,value,restaurantId:Number(body.restaurantId),restaurantName:body.restaurantName,label:type==="percent"?`Giảm ${value}% tại ${body.restaurantName}`:`Giảm ${formatVND(value)} tại ${body.restaurantName}`});
    toast.success(`Đã áp dụng mã cho quán ${body.restaurantName}`);
  }

  function toggleSelect(id: string) {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  }

  function toggleAll() {
    setSelected((prev) => prev.length === items.length ? [] : items.map((i) => cartLineKey(i.product.id,i.variant)));
  }

  const selectedCount = selected.length;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingBag className="h-12 w-12 text-orange-300" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Giỏ hàng trống</h2>
        <p className="text-gray-500 mb-6">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm.</p>
        <Link to="/" className="bg-orange-500 text-white px-8 py-3 rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors inline-block">
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  const grouped = items.reduce<Record<string, {shopName:string;items:typeof items}>>((acc, item) => {
    const shopKey = item.product.shopId || item.product.shopName;
    if (!acc[shopKey]) acc[shopKey] = {shopName:item.product.shopName,items:[]};
    acc[shopKey].shopName=item.product.shopName;
    acc[shopKey].items.push(item);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 py-5">
      <h1 className="text-xl font-bold text-gray-900 mb-5">Giỏ hàng ({items.length} sản phẩm)</h1>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Items */}
        <div className="flex-1 space-y-4">
          {/* Select all */}
          <div className="bg-white rounded-2xl border border-gray-100 px-5 py-3 flex items-center gap-3">
            <input type="checkbox" checked={selectedCount === items.length} onChange={toggleAll} className="w-4 h-4 accent-orange-500 cursor-pointer" />
            <span className="text-sm text-gray-700">Chọn tất cả ({items.length} sản phẩm)</span>
          </div>

          {Object.entries(grouped).map(([shopKey, group]) => (
            <div key={shopKey} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
                <Store className="h-4 w-4 text-orange-500" />
                <span className="text-sm font-medium text-gray-800">{group.shopName}</span>
              </div>
              <div className="divide-y divide-gray-100">
                {group.items.map((item) => (
                  <div key={`${item.product.id}-${item.variant||'base'}`} className="px-5 py-4 flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selected.includes(cartLineKey(item.product.id,item.variant))}
                      onChange={() => toggleSelect(cartLineKey(item.product.id,item.variant))}
                      className="w-4 h-4 accent-orange-500 cursor-pointer mt-1 shrink-0"
                    />
                    <img src={item.product.image} alt={item.product.name} className="w-20 h-20 rounded-xl object-cover bg-gray-50 shrink-0" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/80x80/f1f5f9/94a3b8?text=SP"; }} />
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.product.id}`} className="text-sm font-medium text-gray-800 hover:text-orange-500 line-clamp-2">{item.product.name}</Link>
                      {item.variant && <div className="text-xs text-gray-400 mt-0.5">{item.variant}</div>}
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-orange-500 font-semibold text-sm">{formatVND(item.product.price)}</span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <button aria-label={`Giảm số lượng ${item.variant ? "món có topping" : "món không topping"}`} onClick={() => updateQty(item.product.id, item.quantity - 1,item.variant)} className="px-2 py-1 hover:bg-gray-50 transition-colors">
                              <Minus className="h-3.5 w-3.5 text-gray-600" />
                            </button>
                            <span className="px-3 py-1 text-sm border-x border-gray-200">{item.quantity}</span>
                            <button aria-label={`Tăng số lượng ${item.variant ? "món có topping" : "món không topping"}`} onClick={() => updateQty(item.product.id, item.quantity + 1,item.variant)} className="px-2 py-1 hover:bg-gray-50 transition-colors">
                              <Plus className="h-3.5 w-3.5 text-gray-600" />
                            </button>
                          </div>
                          <button aria-label={`Xóa ${item.variant ? "món có topping" : "món không topping"}`} onClick={() => { removeItem(item.product.id,item.variant); toast.success("Đã xóa sản phẩm"); }} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:w-80 space-y-4">
          {/* Voucher */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-800">Mã giảm giá</span>
            </div>
            {appliedVoucher ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
                <div>
                  <div className="text-sm font-medium text-green-700">{voucher.toUpperCase()}</div>
                  <div className="text-xs text-green-600">{appliedVoucher.label}</div>
                </div>
                <button onClick={() => { setAppliedVoucher(null); setVoucher(""); }} className="text-xs text-red-500 hover:text-red-600">Xóa</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={voucher}
                  onChange={(e) => setVoucher(e.target.value)}
                  placeholder="Nhập mã voucher..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  onKeyDown={(e) => e.key === "Enter" && applyVoucher()}
                />
                <button onClick={applyVoucher} className="px-4 py-2 bg-orange-500 text-white text-sm rounded-xl hover:bg-orange-600 transition-colors font-medium">Áp dụng</button>
              </div>
            )}
            <p className="text-xs text-gray-400 mt-2">Mỗi mã chỉ áp dụng cho món thuộc đúng quán đã tạo mã.</p>
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sticky top-24">
            <h3 className="font-semibold text-gray-800 mb-4">Tổng đơn hàng</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính ({selectedCount} sản phẩm)</span>
                <span>{formatVND(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span className={shippingFee === 0 ? "text-green-600" : ""}>{shippingFee === 0 ? "Miễn phí" : formatVND(shippingFee)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá</span>
                  <span>-{formatVND(discount)}</span>
                </div>
              )}
              {subtotal >= 99000 && shippingFee === 0 && (
                <div className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">✓ Miễn phí vận chuyển cho đơn từ 99.000đ</div>
              )}
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-base">
                <span>Tổng cộng</span>
                <span className="text-orange-500">{formatVND(total)}</span>
              </div>
            </div>
            <button
              onClick={() => { if (selectedCount === 0) { toast.error("Vui lòng chọn ít nhất 1 sản phẩm"); return; } navigate("/checkout",{state:{discount,promotionCode:appliedVoucher?voucher.toUpperCase().trim():"",promotionRestaurant:appliedVoucher?.restaurantName||"",promotionRestaurantId:appliedVoucher?.restaurantId||null}}); }}
              className="w-full mt-5 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2"
            >
              Đặt hàng <ChevronRight className="h-4 w-4" />
            </button>
            <Link to="/" className="block text-center text-sm text-gray-500 hover:text-orange-500 mt-3 transition-colors">← Tiếp tục mua sắm</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
