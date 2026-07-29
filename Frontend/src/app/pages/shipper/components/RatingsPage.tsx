import { useEffect, useState } from "react";
import { Star, Store, User, MessageSquare, Eye, Pencil, Lock } from "lucide-react";
import { Order } from "./types";

interface RatingsPageProps {
  orders: Order[];
  onViewOrder: (order: Order) => void;
  onUpdateRating: (orderId: string, customerRating?: number, shopRating?: number, customerRatingMessage?: string, shopRatingMessage?: string) => void;
}

function Stars({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <Star key={star} className={`w-4 h-4 ${star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
      ))}
      <span className="ml-1 text-xs text-gray-500">{value}/5</span>
    </div>
  );
}

export function RatingsPage({ orders, onViewOrder, onUpdateRating }: RatingsPageProps) {
  const [now, setNow] = useState(Date.now());
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editCustomerRating, setEditCustomerRating] = useState(0);
  const [editShopRating, setEditShopRating] = useState(0);
  const [editCustomerMessage, setEditCustomerMessage] = useState("");
  const [editShopMessage, setEditShopMessage] = useState("");

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const getRemainingMinutes = (order: Order) => {
    if (!order.ratingSubmittedAt) return 0;
    return Math.max(0, Math.ceil((new Date(order.ratingSubmittedAt).getTime() + 60 * 60 * 1000 - now) / 60_000));
  };

  const openEdit = (order: Order) => {
    setEditingOrder(order);
    setEditCustomerRating(order.customerRating || 0);
    setEditShopRating(order.shopRating || 0);
    setEditCustomerMessage(order.customerRatingMessage || "");
    setEditShopMessage(order.shopRatingMessage || "");
  };

  const saveEdit = () => {
    if (!editingOrder || (editCustomerRating === 0 && editShopRating === 0)) return;
    if ((editCustomerRating > 0 && !editCustomerMessage.trim()) || (editShopRating > 0 && !editShopMessage.trim())) return;
    onUpdateRating(editingOrder.id, editCustomerRating || undefined, editShopRating || undefined, editCustomerMessage.trim() || undefined, editShopMessage.trim() || undefined);
    setEditingOrder(null);
  };
  const ratedOrders = orders.filter(order => order.customerRating || order.shopRating);
  const customerRatings = ratedOrders.filter(order => order.customerRating);
  const shopRatings = ratedOrders.filter(order => order.shopRating);
  const customerAverage = customerRatings.length
    ? customerRatings.reduce((sum, order) => sum + (order.customerRating || 0), 0) / customerRatings.length
    : 0;
  const shopAverage = shopRatings.length
    ? shopRatings.reduce((sum, order) => sum + (order.shopRating || 0), 0) / shopRatings.length
    : 0;

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-gray-900" style={{fontSize:"22px"}}>Đánh giá đã gửi</h2>
        <p className="text-gray-500 text-sm mt-0.5">Xem lại đánh giá khách hàng và quán ăn theo từng đơn</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
          <User className="w-5 h-5 text-blue-500 mb-2" />
          <div className="flex items-center gap-1.5">
            <p className="text-2xl text-gray-900" style={{fontWeight:700}}>{customerAverage.toFixed(1)}</p>
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
          </div>
          <p className="text-sm text-gray-500">Điểm khách hàng trung bình</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-5">
          <Store className="w-5 h-5 text-green-500 mb-2" />
          <div className="flex items-center gap-1.5">
            <p className="text-2xl text-gray-900" style={{fontWeight:700}}>{shopAverage.toFixed(1)}</p>
            <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
          </div>
          <p className="text-sm text-gray-500">Điểm quán ăn trung bình</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5">
          <Star className="w-5 h-5 text-yellow-500 mb-2 fill-yellow-400" />
          <p className="text-2xl text-gray-900" style={{fontWeight:700}}>{ratedOrders.length}</p>
          <p className="text-sm text-gray-500">Đơn đã đánh giá</p>
        </div>
      </div>

      <div className="space-y-4">
        {ratedOrders.map(order => (
          <div key={order.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-5 py-3.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-gray-800 font-mono" style={{fontWeight:700}}>#{order.code}</p>
                <p className="text-xs text-gray-400 mt-1">Ngày đơn: {new Date(order.createdAt).toLocaleDateString("vi-VN")}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => onViewOrder(order)} className="flex items-center gap-1.5 px-3 py-2 border border-blue-200 rounded-lg text-blue-600 hover:bg-blue-50 text-xs">
                  <Eye className="w-3.5 h-3.5" /> Chi tiết
                </button>
                {getRemainingMinutes(order) > 0 ? (
                  <button onClick={() => openEdit(order)} className="flex items-center gap-1.5 px-3 py-2 border border-orange-200 rounded-lg text-orange-600 hover:bg-orange-50 text-xs">
                    <Pencil className="w-3.5 h-3.5" /> Sửa ({getRemainingMinutes(order)}p)
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-gray-400"><Lock className="w-3.5 h-3.5" /> Đã khóa</span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-5">
              <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-4">
                <div className="flex items-center gap-2 mb-3"><User className="w-4 h-4 text-blue-500" /><span className="text-sm text-gray-900" style={{fontWeight:700}}>Khách hàng: {order.receiverName}</span></div>
                <div className="mb-3">{order.customerRating ? <Stars value={order.customerRating} /> : <span className="text-xs text-gray-400">Không đánh giá</span>}</div>
                <div className="flex items-start gap-2 text-sm text-gray-600"><MessageSquare className="w-4 h-4 shrink-0 mt-0.5 text-blue-400" /><span>{order.customerRatingMessage || "Không có nhận xét"}</span></div>
              </div>
              <div className="rounded-xl border border-green-100 bg-green-50/50 p-4">
                <div className="flex items-center gap-2 mb-3"><Store className="w-4 h-4 text-green-500" /><span className="text-sm text-gray-900" style={{fontWeight:700}}>Quán ăn: {order.shopName}</span></div>
                <div className="mb-3">{order.shopRating ? <Stars value={order.shopRating} /> : <span className="text-xs text-gray-400">Không đánh giá</span>}</div>
                <div className="flex items-start gap-2 text-sm text-gray-600"><MessageSquare className="w-4 h-4 shrink-0 mt-0.5 text-green-400" /><span>{order.shopRatingMessage || "Không có nhận xét"}</span></div>
              </div>
            </div>
          </div>
        ))}
        {ratedOrders.length === 0 && (
          <div className="py-16 text-center text-gray-400">
            <Star className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Chưa có đơn nào được đánh giá</p>
          </div>
        )}
      </div>

      {editingOrder && (
        <div onClick={() => setEditingOrder(null)} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div onClick={event => event.stopPropagation()} className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg text-gray-900 mb-1" style={{fontWeight:700}}>Sửa đánh giá</h3>
            <p className="text-sm text-gray-500 mb-5">Đơn #{editingOrder.code} · còn {getRemainingMinutes(editingOrder)} phút</p>
            {([
              { label: "Khách hàng", value: editCustomerRating, setValue: setEditCustomerRating, clearMessage: () => setEditCustomerMessage(""), icon: User },
              { label: "Quán ăn", value: editShopRating, setValue: setEditShopRating, clearMessage: () => setEditShopMessage(""), icon: Store },
            ] as const).map(({ label, value, setValue, clearMessage, icon: RatingIcon }) => (
              <div key={label} className="mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-700 mb-2"><RatingIcon className="w-4 h-4" />{label}</div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} onClick={() => { if (value === star) { setValue(0); clearMessage(); } else setValue(star); }}><Star className={`w-7 h-7 ${star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} /></button>
                  ))}
                  {value > 0 && <button onClick={() => { setValue(0); clearMessage(); }} className="ml-2 text-xs text-gray-400 hover:text-red-500">Bỏ đánh giá</button>}
                </div>
              </div>
            ))}
            {editCustomerRating > 0 && (
              <div className="mb-3">
                <label className="block text-sm text-gray-700 mb-1.5">Nhận xét khách hàng</label>
                <textarea value={editCustomerMessage} onChange={event => setEditCustomerMessage(event.target.value)} rows={2} maxLength={300}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-blue-400" />
              </div>
            )}
            {editShopRating > 0 && (
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Nhận xét quán ăn</label>
                <textarea value={editShopMessage} onChange={event => setEditShopMessage(event.target.value)} rows={2} maxLength={300}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-green-400" />
              </div>
            )}
            <div className="flex gap-3 mt-5">
              <button onClick={() => setEditingOrder(null)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm">Đóng</button>
              <button onClick={saveEdit} disabled={(editCustomerRating === 0 && editShopRating === 0) || (editCustomerRating > 0 && !editCustomerMessage.trim()) || (editShopRating > 0 && !editShopMessage.trim()) || getRemainingMinutes(editingOrder) === 0}
                className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-sm disabled:opacity-40" style={{fontWeight:600}}>Lưu thay đổi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
