import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ShoppingCart, Loader2, ArrowLeft, Mail, KeyRound, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

type Step = "email" | "otp" | "newpass";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("email");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  async function handleSendOTP(e: React.FormEvent) {
    e.preventDefault();
    if (!email) { toast.error("Vui lòng nhập email"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "forgot" }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error); }
      else { toast.success(`Đã gửi mã OTP đến ${email}`); setStep("otp"); }
    } catch { toast.error("Lỗi kết nối server"); }
    finally { setLoading(false); }
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    if (otp.length < 6) { toast.error("Vui lòng nhập đủ 6 chữ số"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, type: "forgot" }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error); }
      else { toast.success("Xác minh thành công!"); setStep("newpass"); }
    } catch { toast.error("Lỗi kết nối server"); }
    finally { setLoading(false); }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!newPassword || !confirmPassword) { toast.error("Vui lòng nhập đầy đủ thông tin"); return; }
    if (newPassword.length < 6) { toast.error("Mật khẩu phải từ 6 ký tự trở lên"); return; }
    if (newPassword !== confirmPassword) { toast.error("Mật khẩu xác nhận không khớp"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error); }
      else {
        toast.success(data.message);
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch { toast.error("Lỗi kết nối server"); }
    finally { setLoading(false); }
  }

  const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all";
  const btnClass = "w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl font-medium text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2";

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-orange-500">ShopFoodVN</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <Link to="/login" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-orange-500 mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Quay lại đăng nhập
          </Link>

          {step === "email" && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Mail className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Quên mật khẩu</h1>
                </div>
              </div>
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email lúc đăng ký tài khoản</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" className={inputClass} />
                </div>
                <button type="submit" disabled={loading} className={btnClass}>
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? "Đang gửi..." : "Gửi mã OTP"}
                </button>
              </form>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <KeyRound className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Nhập mã OTP</h1>
                  <p className="text-xs text-gray-500">Mã đã được gửi đến <strong>{email}</strong></p>
                </div>
              </div>
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mã OTP (6 chữ số)</label>
                  <input
                    type="text" maxLength={6} value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="______"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  />
                </div>
                <button type="submit" disabled={loading} className={btnClass}>
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? "Đang xác minh..." : "Xác minh OTP"}
                </button>
                <button type="button" onClick={() => { setOtp(""); handleSendOTP({ preventDefault: () => {} } as any); }}
                  className="w-full text-sm text-orange-500 hover:text-orange-600 text-center">
                  Gửi lại mã OTP
                </button>
              </form>
            </>
          )}

          {step === "newpass" && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <KeyRound className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Mật khẩu mới</h1>
                  <p className="text-xs text-gray-500">Tạo mật khẩu mới cho tài khoản của bạn</p>
                </div>
              </div>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu mới</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"} value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Tối thiểu 6 ký tự" className={`${inputClass} pr-10`}
                    />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Xác nhận mật khẩu</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Nhập lại mật khẩu mới" className={inputClass} />
                </div>
                <button type="submit" disabled={loading} className={btnClass}>
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
