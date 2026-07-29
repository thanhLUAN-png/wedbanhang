import { useState } from "react";
import { Bike, Eye, EyeOff, Phone, Lock, User, Mail, CheckCircle } from "lucide-react";

interface AuthPageProps {
  onLogin: (user: { name: string; phone: string; isShipper: boolean }) => void;
}

const features = [
  "Nhận đơn hàng nhanh chóng",
  "Theo dõi thu nhập theo thời gian thực",
  "Nhắn tin với khách & người bán",
  "Báo cáo hoạt động chi tiết",
];

export function AuthPage({ onLogin }: AuthPageProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ name: form.name || "Nguyễn Văn A", phone: form.phone || "0901234567", isShipper: true });
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-orange-500 to-orange-600 p-12 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Bike className="w-6 h-6 text-white" />
          </div>
          <span style={{fontSize:"22px", fontWeight:700}}>ShipNhanh</span>
        </div>

        <div>
          <h1 className="text-white mb-4" style={{fontSize:"36px", fontWeight:700, lineHeight:"1.2"}}>
            Ứng dụng quản lý<br />shipper chuyên nghiệp
          </h1>
          <p className="text-orange-100 mb-8" style={{fontSize:"16px"}}>
            Quản lý đơn hàng, thu nhập và khách hàng tất cả trong một nền tảng duy nhất.
          </p>
          <div className="space-y-3">
            {features.map(f => (
              <div key={f} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-orange-200 shrink-0" />
                <span className="text-orange-50">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-orange-200 text-sm">© 2026 ShipNhanh. Tất cả quyền được bảo lưu.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Bike className="w-7 h-7 text-orange-500" />
            <span className="text-orange-500" style={{fontSize:"20px", fontWeight:700}}>ShipNhanh</span>
          </div>

          <h2 className="text-gray-900 mb-1" style={{fontSize:"28px"}}>
            {mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
          </h2>
          <p className="text-gray-500 mb-8">
            {mode === "login" ? "Chào mừng bạn trở lại!" : "Bắt đầu hành trình giao hàng của bạn"}
          </p>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2.5 rounded-lg text-sm transition-all ${mode === "login" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
              style={mode === "login" ? {fontWeight:600} : {}}
            >
              Đăng nhập
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2.5 rounded-lg text-sm transition-all ${mode === "register" ? "bg-white shadow text-gray-900" : "text-gray-500"}`}
              style={mode === "register" ? {fontWeight:600} : {}}
            >
              Đăng ký
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Họ và tên</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Số điện thoại</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  placeholder="0901 234 567"
                  value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                />
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-sm text-gray-600 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm text-gray-600 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === "login" && (
              <div className="flex justify-end">
                <button type="button" className="text-orange-500 text-sm hover:underline">Quên mật khẩu?</button>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors shadow-sm"
              style={{fontWeight:600, fontSize:"15px"}}
            >
              {mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
            </button>
          </form>

          {mode === "register" && (
            <p className="text-xs text-gray-400 text-center mt-4">
              Bằng cách đăng ký, bạn đồng ý với{" "}
              <span className="text-orange-500 cursor-pointer hover:underline">Điều khoản dịch vụ</span>{" "}
              của chúng tôi
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
