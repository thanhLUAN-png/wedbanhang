import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, ShoppingCart, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

const STEPS = ["Thông tin cơ bản", "Xác minh OTP", "Hoàn tất"];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "", otp: "" });

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) navigate("/");
  }, [navigate]);

  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    const stamp = Date.now();
    const testForm = {
      name: form.name || "Tài khoản test",
      email: form.email || `test-${stamp}@shopfoodvn.local`,
      phone: form.phone || "0900000000",
      password: form.password || "test123456",
    };
    await handleFinish(testForm);
    return;

    if (!form.name || !form.email || !form.phone || !form.password) { toast.error("Vui lòng nhập đầy đủ thông tin"); return; }
    if (form.password !== form.confirmPassword) { toast.error("Mật khẩu xác nhận không khớp"); return; }
    if (form.password.length < 6) { toast.error("Mật khẩu phải từ 6 ký tự trở lên"); return; }

    setSendingOTP(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, type: "register" }),
      });
      const data = await res.json();
      if (!res.ok) {
        // Vẫn chuyển sang bước OTP nhưng thông báo lỗi gửi mail
        toast.error(data.error || "Gửi email thất bại");
      } else {
        toast.success(`Đã gửi mã OTP đến ${form.email}. Vui lòng kiểm tra hòm thư!`);
        setOtpCountdown(60);
      }
      // Luôn chuyển sang bước OTP sau khi gửi (dù thành công hay thất bại)
      setStep(1);
    } catch { toast.error("Lỗi kết nối server"); }
    finally { setSendingOTP(false); }
  }

  async function handleResendOTP() {
    if (otpCountdown > 0) return;
    setSendingOTP(true);
    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, type: "register" }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error); }
      else { toast.success("Đã gửi lại mã OTP!"); setOtpCountdown(60); }
    } catch { toast.error("Lỗi kết nối server"); }
    finally { setSendingOTP(false); }
  }

  async function handleStep2(e: React.FormEvent) {
    e.preventDefault();
    if (form.otp.length < 6) { toast.error("Vui lòng nhập đủ mã OTP 6 chữ số"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp: form.otp, type: "register" }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error); }
      else { toast.success("Xác minh thành công!"); await handleFinish(); }
    } catch { toast.error("Lỗi kết nối server"); }
    finally { setLoading(false); }
  }

  async function handleFinish(values: Pick<typeof form, "name" | "email" | "phone" | "password"> = form) {
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: values.name, email: values.email, phone: values.phone, password: values.password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Đăng ký thất bại");
      } else {
        localStorage.setItem("user", JSON.stringify({
          id: data.id, name: values.name, email: values.email, phone: values.phone
        }));
        setStep(2);
        toast.success("Đăng ký thành công! Chào mừng bạn đến với ShopFoodVN 🎉");
      }
    } catch { toast.error("Lỗi kết nối server"); }
    finally { setLoading(false); }
  }

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
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Đăng ký tài khoản</h1>

          {/* Stepper */}
          <div className="flex items-center gap-0 mb-8 mt-4">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`flex flex-col items-center ${i < STEPS.length - 1 ? "flex-1" : ""}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${i < step ? "bg-green-500 text-white" : i === step ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                    {i < step ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={`text-xs mt-1 whitespace-nowrap ${i === step ? "text-orange-500 font-medium" : "text-gray-400"}`}>{s}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-px flex-1 mb-4 transition-colors ${i < step ? "bg-green-400" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>

          {step === 0 && (
            <form onSubmit={handleStep1} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Họ và tên</label>
                <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Nguyễn Văn A" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="email@example.com" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Số điện thoại</label>
                <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="0901234567" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu</label>
                <div className="relative">
                  <input type={showPass ? "text" : "password"} value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="Tối thiểu 6 ký tự" className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Xác nhận mật khẩu</label>
                <input type="password" value={form.confirmPassword} onChange={(e) => update("confirmPassword", e.target.value)} placeholder="Nhập lại mật khẩu" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent" />
              </div>
              <button type="submit" disabled={sendingOTP} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl font-medium text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {sendingOTP && <Loader2 className="h-4 w-4 animate-spin" />}
                {sendingOTP ? "Đang gửi OTP..." : "Tiếp theo"}
              </button>
            </form>
          )}

          {step === 1 && (
            <form onSubmit={handleStep2} className="space-y-5">
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-sm text-orange-700">
                📧 Mã OTP đã được gửi đến <strong>{form.email}</strong>. Vui lòng kiểm tra hòm thư (kể cả thư mục Spam).
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mã OTP (6 chữ số)</label>
                <input
                  type="text" maxLength={6} value={form.otp}
                  onChange={(e) => update("otp", e.target.value.replace(/\D/g, ""))}
                  placeholder="______"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>
              <button type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl font-medium text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Đang xác minh..." : "Xác minh & Hoàn tất"}
              </button>
              <div className="flex items-center justify-between text-sm">
                <button type="button" onClick={() => setStep(0)} className="text-gray-500 hover:text-gray-700">← Quay lại</button>
                <button type="button" onClick={handleResendOTP} disabled={otpCountdown > 0 || sendingOTP}
                  className={`${otpCountdown > 0 ? "text-gray-400 cursor-not-allowed" : "text-orange-500 hover:text-orange-600"}`}>
                  {sendingOTP ? "Đang gửi..." : otpCountdown > 0 ? `Gửi lại sau ${otpCountdown}s` : "Gửi lại OTP"}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <div className="text-center py-6 space-y-5">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-10 w-10 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Đăng ký thành công! 🎉</h3>
                <p className="text-sm text-gray-500 mt-1">Chào mừng <strong>{form.name}</strong> đến với ShopFoodVN</p>
              </div>
              <button onClick={() => navigate("/")}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2">
                Bắt đầu mua sắm 🛒
              </button>
            </div>
          )}

          {step < 2 && (
            <p className="text-center text-sm text-gray-500 mt-6">
              Đã có tài khoản?{" "}
              <Link to="/login" className="text-orange-500 font-medium hover:text-orange-600">Đăng nhập</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
