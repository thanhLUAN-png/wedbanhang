import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const GOOGLE_CLIENT_ID = "793507799075-7i4o8pqvhn6cfo6vq9r8u88gnl4sau3o.apps.googleusercontent.com";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) navigate("/");
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { toast.error("Vui lòng nhập đầy đủ thông tin"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone: email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Đăng nhập thất bại");
      } else {
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success(data.message || "Đăng nhập thành công!");
        const destination = data.user.role === "admin"
          ? "/admin"
          : data.user.role === "seller"
          ? "/seller"
          : data.user.role === "shipper"
            ? "/shipper"
            : "/";
        navigate(destination);
      }
    } catch { toast.error("Lỗi kết nối đến server"); }
    finally { setLoading(false); }
  }

  async function handleGoogleSuccess(credentialResponse: any) {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Đăng nhập Google thất bại");
      } else {
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success(data.message || "Đăng nhập thành công!");
        const destination = data.user.role === "admin"
          ? "/admin"
          : data.user.role === "seller"
          ? "/seller"
          : data.user.role === "shipper"
            ? "/shipper"
            : "/";
        navigate(destination);
      }
    } catch { toast.error("Lỗi kết nối đến server"); }
    finally { setLoading(false); }
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Đăng nhập</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email / Số điện thoại</label>
                <input
                  type="text" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="Nhập email hoặc số điện thoại"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                  <Link to="/forgot-password" className="text-xs text-orange-500 hover:text-orange-600">Quên mật khẩu?</Link>
                </div>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"} value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl font-medium text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center text-xs text-gray-400 bg-white px-2">Hoặc tiếp tục với</div>
            </div>

            {/* Google Login */}
            <div className="flex justify-center mb-3">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Đăng nhập Google thất bại")}
                width="368"
                shape="rectangular"
                theme="outline"
                text="signin_with"
                locale="vi"
              />
            </div>

            {/* Facebook placeholder */}
            <button
              onClick={() => toast.info("Tính năng đăng nhập Facebook sẽ sớm được cập nhật")}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium">
              <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Đăng nhập với Facebook
            </button>

            <p className="text-center text-sm text-gray-500 mt-6">
              Chưa có tài khoản?{" "}
              <Link to="/register" className="text-orange-500 font-medium hover:text-orange-600">Đăng ký ngay</Link>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            Bằng việc đăng nhập, bạn đồng ý với{" "}
            <a href="#" className="text-orange-500">Điều khoản</a> và{" "}
            <a href="#" className="text-orange-500">Chính sách bảo mật</a> của ShopFoodVN
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
