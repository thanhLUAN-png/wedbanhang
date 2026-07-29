import { useState } from "react";
import { useSearchParams, Link } from "react-router";
import { User, Star, Settings, Camera, Edit3, Check, Store, Truck } from "lucide-react";

function formatVND(v: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);
}

const BASE_TABS = [
  { id: "info",          label: "Hồ sơ",             icon: User },
  { id: "reviews",       label: "Đánh giá",          icon: Star },
];

const SELLER_TAB = { id: "seller_portal", label: "Kênh Người Bán", icon: Store, isExternal: true, href: "/seller" };
const REGISTRATION_TABS = [
  { id: "register_shop", label: "Đăng ký người bán", icon: Store, isExternal: true, href: "/register-seller" },
  { id: "register_ship", label: "Đăng ký shipper",   icon: Truck, isExternal: true, href: "/register-shipper" },
];

const END_TABS = [
  { id: "settings",      label: "Cài đặt",           icon: Settings },
];

function InfoTab() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "Nguyễn Văn An", phone: "0901234567", email: "van.an@email.com", dob: "1995-03-15", gender: "male" });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800">Thông tin cá nhân</h3>
        <button onClick={() => setEditing(!editing)} className="flex items-center gap-1.5 text-orange-500 text-sm hover:text-orange-600">
          {editing ? <><Check className="h-4 w-4" />Lưu</> : <><Edit3 className="h-4 w-4" />Chỉnh sửa</>}
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: "Họ và tên", key: "name", type: "text" },
          { label: "Số điện thoại", key: "phone", type: "tel" },
          { label: "Email", key: "email", type: "email" },
          { label: "Ngày sinh", key: "dob", type: "date" },
        ].map((f) => (
          <div key={f.key}>
            <label className="block text-xs text-gray-500 mb-1.5">{f.label}</label>
            {editing ? (
              <input
                type={f.type}
                value={form[f.key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            ) : (
              <div className="px-3 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-800">{form[f.key as keyof typeof form]}</div>
            )}
          </div>
        ))}
        <div>
          <label className="block text-xs text-gray-500 mb-1.5">Giới tính</label>
          {editing ? (
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          ) : (
            <div className="px-3 py-2.5 bg-gray-50 rounded-xl text-sm text-gray-800">{form.gender === "male" ? "Nam" : form.gender === "female" ? "Nữ" : "Khác"}</div>
          )}
        </div>
      </div>
    </div>
  );
}


function ReviewsTab() {
  const reviews = [
    { id: 1, product: "Điện thoại Samsung Galaxy A54 5G", image: "https://picsum.photos/seed/phone1/60/60", rating: 5, comment: "Sản phẩm tốt, dùng rất ổn định!", date: "05/07/2026" },
    { id: 2, product: "Kem Dưỡng Ẩm Neutrogena Hydro Boost", image: "https://picsum.photos/seed/cream1/60/60", rating: 4, comment: "Dưỡng ẩm tốt, mùi dễ chịu. Sẽ mua lại.", date: "03/07/2026" },
  ];

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div key={r.id} className="border border-gray-100 rounded-xl p-4">
          <div className="flex gap-3 items-center mb-3">
            <img src={r.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-gray-50" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/48x48/f1f5f9/94a3b8?text=SP"; }} />
            <div>
              <div className="text-sm font-medium text-gray-800">{r.product}</div>
              <div className="flex items-center gap-1 mt-0.5">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                ))}
                <span className="text-xs text-gray-400 ml-1">{r.date}</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-gray-700">{r.comment}</p>
        </div>
      ))}
    </div>
  );
}

function SettingsTab() {
  const [notifications, setNotifications] = useState({ order: true, promo: true, chat: false });

  return (
    <div className="space-y-5">
      <div>
        <h4 className="font-medium text-gray-800 mb-3">Thông báo</h4>
        <div className="space-y-3">
          {[
            { key: "order", label: "Đơn hàng", desc: "Cập nhật trạng thái đơn hàng" },
            { key: "promo", label: "Khuyến mãi", desc: "Flash sale, voucher, ưu đãi" },
            { key: "chat", label: "Tin nhắn", desc: "Tin nhắn từ người bán" },
          ].map((n) => (
            <div key={n.key} className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl">
              <div>
                <div className="text-sm font-medium text-gray-800">{n.label}</div>
                <div className="text-xs text-gray-500">{n.desc}</div>
              </div>
              <button
                onClick={() => setNotifications({ ...notifications, [n.key]: !notifications[n.key as keyof typeof notifications] })}
                className={`w-11 h-6 rounded-full transition-colors relative ${notifications[n.key as keyof typeof notifications] ? "bg-orange-500" : "bg-gray-300"}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${notifications[n.key as keyof typeof notifications] ? "left-6" : "left-1"}`} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-medium text-gray-800 mb-3">Bảo mật</h4>
        <div className="space-y-2">
          {["Đổi mật khẩu", "Xác minh 2 bước", "Thiết bị đã đăng nhập"].map((s) => (
            <button key={s} className="w-full flex items-center justify-between p-3.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-sm text-gray-700">
              {s} <span className="text-gray-400">›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "info";
  
  // Demo mode: check if user is seller from localStorage
  const isSeller = localStorage.getItem("isSeller") === "true";
  
  const TABS = [
    ...BASE_TABS,
    ...(isSeller ? [SELLER_TAB] : REGISTRATION_TABS),
    ...END_TABS
  ];

  const tabContent: Record<string, JSX.Element> = {
    info: <InfoTab />,
    reviews: <ReviewsTab />,
    settings: <SettingsTab />,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row gap-5">
        {/* Sidebar */}
        <div className="md:w-64 shrink-0">
          {/* Avatar */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 text-center">
            <div className="relative inline-block">
              <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center mx-auto text-3xl font-bold text-orange-500">A</div>
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center shadow-sm hover:bg-orange-600 transition-colors">
                <Camera className="h-3.5 w-3.5 text-white" />
              </button>
            </div>
            <div className="mt-3 font-semibold text-gray-900">Nguyễn Văn An</div>
            <div className="text-xs text-gray-500 mt-0.5">van.an@email.com</div>

          </div>

          {/* Nav */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {TABS.map((tab) => {
              if (tab.isExternal) {
                return (
                  <Link
                    key={tab.id}
                    to={tab.href as string}
                    className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-medium transition-colors border-b border-gray-100 last:border-0 text-gray-700 hover:bg-gray-50"
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </Link>
                );
              }
              return (
                <button
                  key={tab.id}
                  onClick={() => setSearchParams({ tab: tab.id })}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 text-sm transition-colors border-b border-gray-100 last:border-0 ${activeTab === tab.id ? "bg-orange-50 text-orange-500 font-medium" : "text-gray-700 hover:bg-gray-50"}`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-100 p-6">
          {tabContent[activeTab] || <InfoTab />}
        </div>
      </div>
    </div>
  );
}
