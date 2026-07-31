import { useState, useRef } from "react";
import {
  ArrowLeft, Phone, MapPin, Package, DollarSign, MessageSquare,
  Camera, CheckCircle, XCircle, User, Store, AlertCircle, Star,
  Navigation, ShoppingBag, Truck
} from "lucide-react";
import { Order, OrderStatus } from "./types";

interface OrderDetailPageProps {
  order: Order;
  onBack: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus, proof?: string, cancelReason?: string, customerRating?: number, shopRating?: number, customerRatingMessage?: string, shopRatingMessage?: string) => void;
  onChat: (orderId: string, type: "customer" | "seller") => void;
}

const statusFlow: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { status: "accepted",   label: "Đã nhận đơn",      icon: <CheckCircle className="w-4 h-4" /> },
  { status: "arrived",    label: "Đã tới quán",       icon: <Navigation className="w-4 h-4" /> },
  { status: "delivering", label: "Đang giao",         icon: <Truck className="w-4 h-4" /> },
  { status: "delivered",  label: "Giao thành công",   icon: <ShoppingBag className="w-4 h-4" /> },
];

const statusOrder: OrderStatus[] = ["pending","accepted","arrived","picked","delivering","delivered","cancelled"];

export function OrderDetailPage({ order, onBack, onUpdateStatus, onChat }: OrderDetailPageProps) {
  const [showPickupPhotoModal, setShowPickupPhotoModal] = useState(false);
  const [showDeliveryPhotoModal, setShowDeliveryPhotoModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [pickupPhoto, setPickupPhoto] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(order.proofPhoto || null);
  const [cancelReason, setCancelReason] = useState("");
  const [customCancelReason, setCustomCancelReason] = useState("");
  const [customerRating, setCustomerRating] = useState(0);
  const [shopRating, setShopRating] = useState(0);
  const [customerRatingMessage, setCustomerRatingMessage] = useState("");
  const [shopRatingMessage, setShopRatingMessage] = useState("");
  const [showRatingModal, setShowRatingModal] = useState(false);
  const pickupInputRef = useRef<HTMLInputElement>(null);
  const deliveryInputRef = useRef<HTMLInputElement>(null);

  // Normalize: "picked" maps visually to delivering step
  const visualStatus = order.status === "picked" ? "delivering" : order.status;
  const currentIdx = statusFlow.findIndex(s => s.status === visualStatus);
  const isActive = !["delivered","cancelled"].includes(order.status) && order.status !== "pending";

  const platformCommissionRate = 0.1;
  const platformCommission = Math.round(order.cod * platformCommissionRate);
  const shopPayout = order.cod - platformCommission;

  // Determine next action label + icon
  const nextActionConfig: Partial<Record<OrderStatus, { label: string; icon: React.ReactNode; color: string }>> = {
    accepted:   { label: "Đã tới quán",         icon: <Navigation className="w-4 h-4" />,   color: "bg-blue-500 hover:bg-blue-600" },
    arrived:    { label: "Đã lấy món",          icon: <ShoppingBag className="w-4 h-4" />,  color: "bg-indigo-500 hover:bg-indigo-600" },
    picked:     { label: "Bắt đầu đi giao",     icon: <ShoppingBag className="w-4 h-4" />,  color: "bg-purple-500 hover:bg-purple-600" },
    delivering: { label: "Xác nhận giao thành công", icon: <CheckCircle className="w-4 h-4" />, color: "bg-green-500 hover:bg-green-600" },
  };

  const handleNextStatus = () => {
    if (order.status === "accepted") {
      onUpdateStatus(order.id, "arrived");
    } else if (order.status === "arrived") {
      onUpdateStatus(order.id, "picked");
    } else if (order.status === "picked") {
      // Yêu cầu chụp ảnh nhận hàng tại quán
      setShowPickupPhotoModal(true);
    } else if (order.status === "delivering") {
      // Yêu cầu chụp ảnh giao thành công
      setShowDeliveryPhotoModal(true);
    }
  };

  const handleConfirmPickup = () => {
    setShowPickupPhotoModal(false);
    onUpdateStatus(order.id, "delivering", pickupPhoto || undefined);
  };

  const handleConfirmDelivered = () => {
    setShowDeliveryPhotoModal(false);
    setShowRatingModal(true);
  };

  const resetRatingForm = () => {
    setCustomerRating(0);
    setShopRating(0);
    setCustomerRatingMessage("");
    setShopRatingMessage("");
  };

  const finishDeliveredWithoutRating = () => {
    onUpdateStatus(order.id, "delivered", capturedPhoto || undefined);
    setShowRatingModal(false);
    resetRatingForm();
  };

  const finishDeliveredWithRating = () => {
    onUpdateStatus(order.id, "delivered", capturedPhoto || undefined, undefined, customerRating || undefined, shopRating || undefined, customerRatingMessage.trim() || undefined, shopRatingMessage.trim() || undefined);
    setShowRatingModal(false);
    resetRatingForm();
  };

  const handleFileCapture = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setter(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const nextCfg = nextActionConfig[order.status];

  return (
    <div className="flex flex-col h-full">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <button onClick={onBack} className="flex items-center gap-1.5 text-gray-500 hover:text-orange-500 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
        </button>
        <span className="text-gray-300">/</span>
        <span className="text-gray-700 text-sm" style={{fontWeight:500}}>Chi tiết đơn {order.code}</span>
      </div>

      <div className="flex gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Left column */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Status timeline – 4 steps */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-gray-800 mb-4" style={{fontSize:"15px"}}>Tiến trình đơn hàng</h3>

            {order.status === "cancelled" ? (
              <div className="flex items-center gap-3 p-3 bg-red-50 rounded-xl border border-red-100">
                <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                <div>
                  <p className="text-sm text-red-600" style={{fontWeight:600}}>Đơn hàng đã bị hủy</p>
                  {order.note && <p className="text-xs text-red-400 mt-0.5">Lý do: {order.note}</p>}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-0">
                {statusFlow.map((step, i) => {
                  const stepCompleted = currentIdx > i;
                  const stepCurrent  = currentIdx === i;
                  return (
                    <div key={step.status} className="flex items-center flex-1">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                          stepCompleted ? "bg-orange-500 border-orange-500 text-white"
                            : stepCurrent ? "bg-orange-50 border-orange-400 text-orange-500 ring-4 ring-orange-100"
                            : "border-gray-200 text-gray-300 bg-white"
                        }`}>
                          {stepCompleted ? <CheckCircle className="w-5 h-5" /> : step.icon}
                        </div>
                        <p className={`text-xs mt-2 text-center whitespace-nowrap ${
                          stepCompleted ? "text-orange-500" : stepCurrent ? "text-orange-600" : "text-gray-400"
                        }`} style={stepCurrent ? {fontWeight:700} : stepCompleted ? {fontWeight:500} : {}}>
                          {step.label}
                        </p>
                      </div>
                      {i < statusFlow.length - 1 && (
                        <div className={`flex-1 h-0.5 mb-5 ${stepCompleted ? "bg-orange-400" : "bg-gray-200"}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}


          </div>

          {/* Pickup photo */}
          {(order.status === "delivering" || order.status === "delivered") && pickupPhoto && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-gray-800 mb-3" style={{fontSize:"15px"}}>Ảnh nhận hàng tại quán</h3>
              <img src={pickupPhoto} alt="Pickup" className="w-full max-h-48 object-cover rounded-lg" />
            </div>
          )}

          {/* Delivery proof photo */}
          {order.status === "delivered" && capturedPhoto && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-gray-800 mb-3" style={{fontSize:"15px"}}>Ảnh xác nhận giao hàng</h3>
              <img src={capturedPhoto} alt="Proof" className="w-full max-h-48 object-cover rounded-lg" />
            </div>
          )}

          {/* Package info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-purple-500" />
              <h3 className="text-gray-800" style={{fontSize:"15px"}}>Thông tin món ăn</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Hàng hóa", value: order.items },
                { label: "Khối lượng", value: `${order.weight} kg` },
                { label: "Khoảng cách", value: order.distance },
                { label: "Thời gian tạo", value: new Date(order.createdAt).toLocaleString("vi-VN") },
              ].map(row => (
                <div key={row.label}>
                  <p className="text-xs text-gray-400 mb-0.5">{row.label}</p>
                  <p className="text-sm text-gray-800">{row.value}</p>
                </div>
              ))}
            </div>
            {order.note && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg flex gap-2 border border-yellow-100">
                <AlertCircle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-sm text-yellow-700">{order.note}</p>
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-500" />
              <h3 className="text-gray-800" style={{fontSize:"15px"}}>Thanh toán</h3>
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Phí vận chuyển (shipper nhận)</span>
                <span className="text-green-600" style={{fontWeight:600}}>+{order.shippingFee.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Trả cho quán ăn (sau chiết khấu)</span>
                <span className="text-blue-600" style={{fontWeight:600}}>{shopPayout.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Chiết khấu nền tảng / Admin (10%)</span>
                <span className="text-purple-600" style={{fontWeight:600}}>{platformCommission.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="border-t border-gray-100 pt-2.5 flex justify-between">
                <span className="text-gray-700">Tổng thu từ khách</span>
                <span className="text-gray-900" style={{fontWeight:700}}>{(order.cod + order.shippingFee).toLocaleString("vi-VN")}đ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="w-80 space-y-4 overflow-y-auto">
          {/* Action buttons */}
          {isActive && (nextCfg || ["accepted","arrived","picked","delivering"].includes(order.status)) && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 space-y-2">
              <h3 className="text-orange-800 text-sm mb-3" style={{fontWeight:600}}>Cập nhật trạng thái</h3>
              {nextCfg && (
                <button
                  onClick={handleNextStatus}
                  className={`w-full py-3 text-white rounded-xl text-sm transition-colors flex items-center justify-center gap-2 ${nextCfg.color}`}
                  style={{fontWeight:600}}
                >
                  {nextCfg.icon}
                  {nextCfg.label}
                </button>
              )}
              {!nextCfg && order.status === "arrived" && (
                <div className="w-full py-3 bg-gray-100 text-gray-500 rounded-xl text-sm text-center flex items-center justify-center gap-2" style={{fontWeight:600}}>
                  <Store className="w-4 h-4" />
                  Đang chờ quán giao hàng...
                </div>
              )}
              {["accepted","arrived","picked","delivering"].includes(order.status) && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full py-2 border border-red-300 text-red-500 hover:bg-red-50 rounded-xl text-sm transition-colors"
                >
                  Hủy đơn hàng
                </button>
              )}
            </div>
          )}

          {/* Sender */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Store className="w-4 h-4 text-orange-500" />
              <h3 className="text-gray-700 text-sm" style={{fontWeight:600}}>Người gửi (Quán)</h3>
            </div>
            <p className="text-sm text-gray-800" style={{fontWeight:500}}>{order.senderName}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{order.senderAddress}</p>
            <p className="text-xs text-gray-500 mt-0.5">{order.senderPhone}</p>
            <div className="flex gap-2 mt-3">
              <a href={`tel:${order.senderPhone}`} className="flex-1 flex items-center justify-center gap-1 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs hover:bg-gray-50 transition-colors">
                <Phone className="w-3.5 h-3.5" /> Gọi
              </a>
              <button onClick={() => onChat(order.id, "seller")} className="flex-1 flex items-center justify-center gap-1 py-2 border border-orange-200 text-orange-600 rounded-lg text-xs hover:bg-orange-50 transition-colors">
                <MessageSquare className="w-3.5 h-3.5" /> Nhắn tin
              </button>
            </div>
          </div>

          {/* Receiver */}
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-blue-500" />
              <h3 className="text-gray-700 text-sm" style={{fontWeight:600}}>Người nhận (Khách)</h3>
            </div>
            <p className="text-sm text-gray-800" style={{fontWeight:500}}>{order.receiverName}</p>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{order.receiverAddress}</p>
            <p className="text-xs text-gray-500 mt-0.5">{order.receiverPhone}</p>
            <div className="flex gap-2 mt-3">
              <a href={`tel:${order.receiverPhone}`} className="flex-1 flex items-center justify-center gap-1 py-2 border border-gray-200 text-gray-600 rounded-lg text-xs hover:bg-gray-50 transition-colors">
                <Phone className="w-3.5 h-3.5" /> Gọi
              </a>
              <button onClick={() => onChat(order.id, "customer")} className="flex-1 flex items-center justify-center gap-1 py-2 border border-blue-200 text-blue-600 rounded-lg text-xs hover:bg-blue-50 transition-colors">
                <MessageSquare className="w-3.5 h-3.5" /> Nhắn tin
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ MODAL: Chụp ảnh nhận hàng tại quán ═══ */}
      {showPickupPhotoModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-2 mb-1">
              <ShoppingBag className="w-5 h-5 text-purple-500" />
              <h3 className="text-gray-900" style={{fontWeight:700}}>Xác nhận nhận hàng tại quán</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">Chụp ảnh đơn hàng/hóa đơn bạn nhận từ quán để làm bằng chứng (tùy chọn)</p>
            {pickupPhoto ? (
              <div className="relative mb-4">
                <img src={pickupPhoto} alt="Pickup" className="w-full h-48 object-cover rounded-xl" />
                <button onClick={() => setPickupPhoto(null)} className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center">
                  <XCircle className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <button onClick={() => pickupInputRef.current?.click()} className="w-full h-40 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 mb-4 text-gray-400 hover:border-purple-300 hover:text-purple-400 transition-colors">
                <Camera className="w-8 h-8" />
                <span className="text-sm">Chụp ảnh hàng tại quán</span>
              </button>
            )}
            <input ref={pickupInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileCapture(setPickupPhoto)} />
            <div className="flex gap-3">
              <button onClick={() => setShowPickupPhotoModal(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Hủy</button>
              <button onClick={handleConfirmPickup} className="flex-1 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-sm" style={{fontWeight:600}}>
                {pickupPhoto ? "Đã nhận hàng – Bắt đầu giao" : "Bỏ qua & Bắt đầu giao"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ MODAL: Chụp ảnh giao thành công ═══ */}
      {showDeliveryPhotoModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h3 className="text-gray-900" style={{fontWeight:700}}>Xác nhận giao hàng thành công</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">Chụp ảnh tại nơi giao hoặc ảnh khách nhận hàng (tùy chọn)</p>
            {capturedPhoto ? (
              <div className="relative mb-4">
                <img src={capturedPhoto} alt="Proof" className="w-full h-48 object-cover rounded-xl" />
                <button onClick={() => setCapturedPhoto(null)} className="absolute top-2 right-2 w-7 h-7 bg-black/50 rounded-full flex items-center justify-center">
                  <XCircle className="w-4 h-4 text-white" />
                </button>
              </div>
            ) : (
              <button onClick={() => deliveryInputRef.current?.click()} className="w-full h-40 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 mb-4 text-gray-400 hover:border-green-300 hover:text-green-400 transition-colors">
                <Camera className="w-8 h-8" />
                <span className="text-sm">Chụp ảnh xác nhận giao hàng</span>
              </button>
            )}
            <input ref={deliveryInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileCapture(setCapturedPhoto)} />
            <div className="flex gap-3">
              <button onClick={() => setShowDeliveryPhotoModal(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Hủy</button>
              <button onClick={handleConfirmDelivered} className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm" style={{fontWeight:600}}>
                {capturedPhoto ? "Xác nhận giao hàng" : "Bỏ qua & Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ MODAL: Đánh giá sau giao ═══ */}
      {showRatingModal && (
        <div onClick={finishDeliveredWithoutRating} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div onClick={event => event.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-gray-900 mb-1" style={{fontWeight:700}}>Đánh giá sau khi giao hàng</h3>
            <p className="text-sm text-gray-500 mb-4">Bạn có thể đánh giá một bên, cả hai bên hoặc bỏ qua bước này.</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {([
                { label: "Khách hàng", value: customerRating, setValue: setCustomerRating, clearMessage: () => setCustomerRatingMessage(""), icon: User },
                { label: "Quán ăn", value: shopRating, setValue: setShopRating, clearMessage: () => setShopRatingMessage(""), icon: Store },
              ] as const).map(({ label, value, setValue, clearMessage, icon: RatingIcon }) => (
                <div key={label} className="border border-gray-200 rounded-xl p-3 bg-gray-50">
                  <div className="flex items-center gap-1.5 text-sm text-gray-700 mb-2"><RatingIcon className="w-4 h-4" />{label}</div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} type="button" onClick={() => { if (value === star) { setValue(0); clearMessage(); } else setValue(star); }} aria-label={`${star} sao`}>
                        <Star className={`w-6 h-6 ${star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-300"}`} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {customerRating > 0 && (
              <div className="mb-3">
                <label className="block text-sm text-gray-700 mb-1.5" style={{fontWeight:500}}>Lời nhận xét khách hàng</label>
                <textarea value={customerRatingMessage} onChange={event => setCustomerRatingMessage(event.target.value)} placeholder="Nhận xét về khách hàng..." rows={2} maxLength={300}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-blue-400" />
              </div>
            )}
            {shopRating > 0 && (
              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-1.5" style={{fontWeight:500}}>Lời nhận xét quán ăn</label>
                <textarea value={shopRatingMessage} onChange={event => setShopRatingMessage(event.target.value)} placeholder="Nhận xét về quán ăn..." rows={2} maxLength={300}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-green-400" />
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={finishDeliveredWithoutRating} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Bỏ qua</button>
              <button onClick={finishDeliveredWithRating}
                disabled={(customerRating === 0 && shopRating === 0) || (customerRating > 0 && !customerRatingMessage.trim()) || (shopRating > 0 && !shopRatingMessage.trim())}
                className="flex-1 py-2.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl text-sm disabled:opacity-40"
                style={{fontWeight:600}}>Gửi đánh giá</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ MODAL: Hủy đơn ═══ */}
      {showCancelModal && (
        <div onClick={() => { setShowCancelModal(false); setCancelReason(""); setCustomCancelReason(""); resetRatingForm(); }} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div onClick={event => event.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-red-600 mb-1" style={{fontWeight:700}}>Hủy đơn hàng</h3>
            <p className="text-sm text-gray-500 mb-4">Chọn lý do không giao được hàng</p>
            <div className="space-y-2 mb-4">
              {["Khách không nghe máy","Khách không nhận hàng","Sai địa chỉ","Khách hủy đơn","Quán chưa có hàng","Lý do khác"].map(r => (
                <button key={r} onClick={() => setCancelReason(r)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-colors ${
                    cancelReason===r ? "border-red-400 bg-red-50 text-red-600" : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}>
                  {r}
                </button>
              ))}
            </div>
            {cancelReason === "Lý do khác" && (
              <div className="mb-4">
                <label className="block text-sm text-gray-700 mb-1.5" style={{fontWeight:500}}>Nhập lý do hủy</label>
                <textarea autoFocus value={customCancelReason} onChange={e => setCustomCancelReason(e.target.value)}
                  placeholder="Ví dụ: Xe gặp sự cố, quán đóng cửa..." rows={3} maxLength={300}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100" />
                <p className="text-xs text-gray-400 mt-1 text-right">{customCancelReason.length}/300</p>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => { setShowCancelModal(false); setCancelReason(""); setCustomCancelReason(""); resetRatingForm(); }} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm">Không hủy</button>
              <button
                onClick={() => {
                  const reason = cancelReason === "Lý do khác" ? customCancelReason.trim() : cancelReason;
                  onUpdateStatus(order.id, "cancelled", undefined, reason, customerRating || undefined, shopRating || undefined, customerRatingMessage.trim() || undefined, shopRatingMessage.trim() || undefined);
                  setShowCancelModal(false);
                  setCancelReason("");
                  setCustomCancelReason("");
                  resetRatingForm();
                }}
                disabled={!cancelReason || (cancelReason === "Lý do khác" && !customCancelReason.trim())}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm disabled:opacity-40 transition-colors"
                style={{fontWeight:600}}>
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
