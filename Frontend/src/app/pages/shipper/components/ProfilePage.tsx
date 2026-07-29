import { useRef, useState } from "react";
import { User, Phone, Star, Package, Bike, ChevronRight, LogOut, Shield, Bell, HelpCircle, FileText, Camera, CheckCircle, Edit2 } from "lucide-react";
import { toast } from "sonner";

interface ProfilePageProps {
  user: { name: string; phone: string; isShipper: boolean };
  isOnline: boolean;
  onLogout: () => void;
  onRegisterShipper: (data: { vehicle: string; licensePlate: string; idCard: string }) => void;
}

export function ProfilePage({ user, isOnline, onLogout, onRegisterShipper }: ProfilePageProps) {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registerForm, setRegisterForm] = useState({ vehicle: "motorbike", licensePlate: "", idCard: "" });
  const [registerStep, setRegisterStep] = useState(1);
  const [activePanel, setActivePanel] = useState<null | "profile" | "vehicle" | "notifications" | "security" | "support" | "terms">(null);
  const [profile, setProfile] = useState({ name: user.name, phone: user.phone });
  const [profileDraft, setProfileDraft] = useState(profile);
  const [vehicle, setVehicle] = useState({ type: "Xe máy", licensePlate: "59-AB 12345" });
  const [vehicleDraft, setVehicleDraft] = useState(vehicle);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [notifications, setNotifications] = useState({ newOrder: true, chat: true, promotion: false });
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const openPanel = (panel: NonNullable<typeof activePanel>) => {
    if (panel === "profile") setProfileDraft(profile);
    if (panel === "vehicle") setVehicleDraft(vehicle);
    setActivePanel(panel);
  };

  const handleAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatar(URL.createObjectURL(file));
    toast.success("Đã cập nhật ảnh đại diện mẫu");
  };

  const handleRegister = () => {
    if (registerStep < 3) { setRegisterStep(registerStep + 1); }
    else { onRegisterShipper(registerForm); setShowRegisterModal(false); setRegisterStep(1); }
  };

  const menuSections = [
    {
      title: "Tài khoản",
      items: [
        { key: "notifications" as const, icon: <Bell className="w-4 h-4" />, label: "Thông báo", desc: "Cài đặt thông báo đơn hàng", color: "text-blue-500", bg: "bg-blue-50" },
        { key: "security" as const, icon: <Shield className="w-4 h-4" />, label: "Bảo mật tài khoản", desc: "Đổi mật khẩu, xác minh 2 bước", color: "text-green-500", bg: "bg-green-50" },
      ],
    },
    {
      title: "Hỗ trợ",
      items: [
        { key: "support" as const, icon: <HelpCircle className="w-4 h-4" />, label: "Trung tâm hỗ trợ", desc: "Câu hỏi thường gặp", color: "text-orange-500", bg: "bg-orange-50" },
        { key: "terms" as const, icon: <FileText className="w-4 h-4" />, label: "Điều khoản dịch vụ", desc: "Quy định & chính sách", color: "text-purple-500", bg: "bg-purple-50" },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-gray-900" style={{fontSize:"22px"}}>Trang cá nhân</h2>
        <p className="text-gray-500 text-sm mt-0.5">Quản lý thông tin và cài đặt tài khoản</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: profile card + menu */}
        <div className="col-span-1 space-y-4">
          {/* Profile */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-3">
                <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden">
                  {avatar ? <img src={avatar} alt="Ảnh đại diện" className="w-full h-full object-cover" /> : <User className="w-10 h-10 text-orange-300" />}
                </div>
                <button onClick={() => avatarInputRef.current?.click()} className="absolute -bottom-1 -right-1 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center shadow">
                  <Camera className="w-3.5 h-3.5 text-white" />
                </button>
                <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
              </div>
              <h3 className="text-gray-900">{profile.name}</h3>
              <p className="text-gray-500 text-sm flex items-center gap-1 mt-0.5"><Phone className="w-3.5 h-3.5" />{profile.phone}</p>
              {user.isShipper ? (
                <span className={`mt-2 px-3 py-1 text-xs rounded-full flex items-center gap-1 ${isOnline ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`} style={{fontWeight:500}}>
                  <Bike className="w-3 h-3" /> {isOnline ? "Shipper đang hoạt động" : "Shipper đã tắt hoạt động"}
                </span>
              ) : (
                <span className="mt-2 px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">Chưa đăng ký shipper</span>
              )}
            </div>

            {user.isShipper && (
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-gray-100 text-center">
                {[
                  { val: "4.8 ★", label: "Đánh giá" },
                  { val: "236", label: "Đơn tháng này" },
                  { val: "97.5%", label: "Tỷ lệ giao" },
                ].map(s => (
                  <div key={s.label}>
                    <p className="text-gray-900 text-sm" style={{fontWeight:700}}>{s.val}</p>
                    <p className="text-gray-400" style={{fontSize:"11px"}}>{s.label}</p>
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => openPanel("profile")} className="w-full mt-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm flex items-center justify-center gap-1.5 hover:bg-gray-50 transition-colors">
              <Edit2 className="w-3.5 h-3.5" /> Chỉnh sửa thông tin
            </button>
          </div>

          {/* Logout */}
          <button onClick={onLogout} className="w-full py-2.5 border border-red-200 text-red-500 rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-red-50 transition-colors" style={{fontWeight:500}}>
            <LogOut className="w-4 h-4" /> Đăng xuất
          </button>
        </div>

        {/* Right: content */}
        <div className="col-span-2 space-y-4">
          {/* Register shipper banner */}
          {!user.isShipper && (
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-5 text-white flex items-center gap-4">
              <Bike className="w-14 h-14 opacity-70 shrink-0" />
              <div className="flex-1">
                <p style={{fontWeight:700, fontSize:"18px"}}>Đăng ký làm Shipper</p>
                <p className="text-orange-100 text-sm mt-0.5">Bắt đầu nhận đơn và kiếm thu nhập ngay hôm nay</p>
              </div>
              <button onClick={() => setShowRegisterModal(true)} className="px-4 py-2.5 bg-white text-orange-500 rounded-xl text-sm shrink-0 hover:bg-orange-50 transition-colors" style={{fontWeight:600}}>
                Đăng ký ngay
              </button>
            </div>
          )}

          {/* Vehicle info */}
          {user.isShipper && (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-800" style={{fontSize:"15px"}}>Thông tin phương tiện</h3>
                <button onClick={() => openPanel("vehicle")} className="text-orange-500 text-sm hover:underline">Chỉnh sửa</button>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Bike className="w-7 h-7 text-orange-500" />
                </div>
                <div>
                  <p style={{fontWeight:600}}>{vehicle.type}</p>
                  <p className="text-gray-500 text-sm">Biển số: {vehicle.licensePlate}</p>
                  <p className="text-gray-400 text-xs">Đăng ký: 08/2025</p>
                </div>
                <div className="ml-auto px-3 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-200" style={{fontWeight:500}}>
                  Đã xác minh
                </div>
              </div>
            </div>
          )}

          {/* Menu sections */}
          {menuSections.map(section => (
            <div key={section.title} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100">
                <h3 className="text-gray-500 text-xs uppercase tracking-wide" style={{fontWeight:600}}>{section.title}</h3>
              </div>
              <div className="divide-y divide-gray-50">
                {section.items.map(item => (
                  <button key={item.label} onClick={() => openPanel(item.key)} className="w-full text-left flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors group">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.bg} ${item.color}`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{item.label}</p>
                      <p className="text-xs text-gray-400">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {activePanel && (
        <div onClick={() => setActivePanel(null)} className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div onClick={event => event.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[85vh] overflow-y-auto">
            <h3 className="text-lg text-gray-900 mb-5" style={{fontWeight:700}}>
              {{ profile: "Chỉnh sửa thông tin", vehicle: "Thông tin phương tiện", notifications: "Cài đặt thông báo", security: "Bảo mật tài khoản", support: "Trung tâm hỗ trợ", terms: "Điều khoản dịch vụ" }[activePanel]}
            </h3>

            {activePanel === "profile" && <div className="space-y-4">
              <div><label className="text-sm text-gray-600">Họ và tên</label><input value={profileDraft.name} onChange={e => setProfileDraft({...profileDraft, name:e.target.value})} className="mt-1.5 w-full px-4 py-3 border rounded-xl text-sm" /></div>
              <div><label className="text-sm text-gray-600">Số điện thoại</label><input value={profileDraft.phone} onChange={e => setProfileDraft({...profileDraft, phone:e.target.value})} className="mt-1.5 w-full px-4 py-3 border rounded-xl text-sm" /></div>
            </div>}

            {activePanel === "vehicle" && <div className="space-y-4">
              <div><label className="text-sm text-gray-600">Loại phương tiện</label><select value={vehicleDraft.type} onChange={e => setVehicleDraft({...vehicleDraft,type:e.target.value})} className="mt-1.5 w-full px-4 py-3 border rounded-xl text-sm"><option>Xe máy</option><option>Xe đạp</option><option>Ô tô</option></select></div>
              <div><label className="text-sm text-gray-600">Biển số xe</label><input value={vehicleDraft.licensePlate} onChange={e => setVehicleDraft({...vehicleDraft,licensePlate:e.target.value})} className="mt-1.5 w-full px-4 py-3 border rounded-xl text-sm" /></div>
            </div>}

            {activePanel === "notifications" && <div className="space-y-3">
              {([['newOrder','Đơn hàng mới'],['chat','Tin nhắn mới'],['promotion','Tin khuyến mãi']] as const).map(([key,label]) => <label key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-sm"><span>{label}</span><input type="checkbox" checked={notifications[key]} onChange={e => setNotifications({...notifications,[key]:e.target.checked})} className="w-4 h-4 accent-orange-500" /></label>)}
            </div>}

            {activePanel === "security" && <div className="space-y-3">
              <input type="password" value={passwords.current} onChange={e => setPasswords({...passwords,current:e.target.value})} placeholder="Mật khẩu hiện tại" className="w-full px-4 py-3 border rounded-xl text-sm" />
              <input type="password" value={passwords.next} onChange={e => setPasswords({...passwords,next:e.target.value})} placeholder="Mật khẩu mới" className="w-full px-4 py-3 border rounded-xl text-sm" />
              <input type="password" value={passwords.confirm} onChange={e => setPasswords({...passwords,confirm:e.target.value})} placeholder="Xác nhận mật khẩu mới" className="w-full px-4 py-3 border rounded-xl text-sm" />
            </div>}

            {activePanel === "support" && <div className="space-y-3 text-sm text-gray-600">
              {["Làm sao để nhận đơn mới?","Khi nào phí ship được cộng vào ví?","Xử lý thế nào khi khách không nhận món?"].map(q => <details key={q} className="p-3 border rounded-xl"><summary className="cursor-pointer text-gray-800">{q}</summary><p className="mt-2 text-gray-500">Đây là nội dung hỗ trợ mẫu. Bạn có thể liên hệ hotline 1900 1234 nếu cần trợ giúp thêm.</p></details>)}
              <button onClick={() => toast.success("Đã gửi yêu cầu hỗ trợ mẫu")} className="w-full py-2.5 bg-orange-500 text-white rounded-xl">Gửi yêu cầu hỗ trợ</button>
            </div>}

            {activePanel === "terms" && <div className="space-y-3 text-sm text-gray-600 leading-relaxed"><p>Shipper có trách nhiệm bảo quản món ăn, giao đúng người nhận và cập nhật trạng thái trung thực.</p><p>Tiền COD phải được đối soát theo quy định. Phí ship được ghi nhận sau khi đơn hoàn thành.</p><p>Không chia sẻ thông tin khách hàng hoặc sử dụng tài khoản cho mục đích trái phép.</p></div>}

            <div className="flex gap-3 mt-6">
              <button onClick={() => setActivePanel(null)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm">Đóng</button>
              {activePanel !== "support" && activePanel !== "terms" && <button onClick={() => {
                if (activePanel === "profile") setProfile(profileDraft);
                if (activePanel === "vehicle") setVehicle(vehicleDraft);
                if (activePanel === "security" && (passwords.next.length < 6 || passwords.next !== passwords.confirm)) { toast.error("Mật khẩu mới phải từ 6 ký tự và khớp xác nhận"); return; }
                toast.success("Đã lưu thay đổi mẫu"); setActivePanel(null);
              }} className="flex-1 py-2.5 bg-orange-500 text-white rounded-xl text-sm" style={{fontWeight:600}}>Lưu thay đổi</button>}
            </div>
          </div>
        </div>
      )}

      {/* Shipper Register Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <div className="flex items-center gap-3 mb-2">
              <Bike className="w-6 h-6 text-orange-500" />
              <h3 className="text-gray-900">Đăng ký làm Shipper</h3>
            </div>
            <p className="text-sm text-gray-500 mb-5">Bước {registerStep}/3 — {["Chọn phương tiện","Thông tin xe","Xác minh danh tính"][registerStep-1]}</p>

            {/* Progress */}
            <div className="flex gap-2 mb-6">
              {[1,2,3].map(s => <div key={s} className={`flex-1 h-1.5 rounded-full transition-colors ${s<=registerStep?"bg-orange-500":"bg-gray-200"}`} />)}
            </div>

            {registerStep === 1 && (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "motorbike", label: "Xe máy", emoji: "🏍️", desc: "Phù hợp đơn nhỏ" },
                  { value: "bicycle",   label: "Xe đạp", emoji: "🚲", desc: "Thân thiện môi trường" },
                  { value: "car",       label: "Ô tô",   emoji: "🚗", desc: "Đơn lớn, xa" },
                  { value: "truck",     label: "Xe tải", emoji: "🚛", desc: "Hàng cồng kềnh" },
                ].map(v => (
                  <button key={v.value} onClick={() => setRegisterForm({...registerForm, vehicle: v.value})}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${registerForm.vehicle===v.value?"border-orange-500 bg-orange-50":"border-gray-200 hover:border-gray-300"}`}>
                    <p className="text-2xl mb-1">{v.emoji}</p>
                    <p className="text-sm text-gray-800" style={{fontWeight:600}}>{v.label}</p>
                    <p className="text-xs text-gray-400">{v.desc}</p>
                  </button>
                ))}
              </div>
            )}

            {registerStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Biển số xe</label>
                  <input type="text" placeholder="VD: 59-AB 12345"
                    value={registerForm.licensePlate} onChange={e => setRegisterForm({...registerForm, licensePlate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-sm transition-all" />
                </div>
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <p className="text-xs text-gray-500">Lưu ý: Biển số xe phải khớp với giấy tờ xe. Thông tin sẽ được xác minh.</p>
                </div>
              </div>
            )}

            {registerStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Số CCCD/CMND</label>
                  <input type="text" placeholder="Nhập số CCCD/CMND"
                    value={registerForm.idCard} onChange={e => setRegisterForm({...registerForm, idCard: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 text-sm transition-all" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button className="h-28 border-2 border-dashed border-orange-300 rounded-xl flex flex-col items-center justify-center gap-2 text-orange-400 hover:bg-orange-50 transition-colors">
                    <Camera className="w-7 h-7" />
                    <span className="text-xs">CCCD mặt trước</span>
                  </button>
                  <button className="h-28 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:bg-gray-50 transition-colors">
                    <Camera className="w-7 h-7" />
                    <span className="text-xs">CCCD mặt sau</span>
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button onClick={() => registerStep===1 ? setShowRegisterModal(false) : setRegisterStep(registerStep-1)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                {registerStep===1?"Hủy":"Quay lại"}
              </button>
              <button onClick={handleRegister}
                className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm transition-colors" style={{fontWeight:600}}>
                {registerStep===3?"Hoàn tất đăng ký":"Tiếp theo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
