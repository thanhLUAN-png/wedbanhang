import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router";
import { ShoppingCart, Search, Bell, User, ChevronDown, Menu, X, Heart, LogOut, Package, MessageCircle, UtensilsCrossed } from "lucide-react";
import { CartProvider, useCart } from "../../context/CartContext";
import { categories } from "../../data/mockShopProducts";
import { getPromoNotifications, mockNotifications, PROMO_NOTIFICATION_EVENT } from "../../data/mockNotifications";

function Header() {
  const { count, wishlist } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [promoUnreadCount, setPromoUnreadCount] = useState(() => getPromoNotifications().filter(n => !n.isRead).length);
  const unreadCount = mockNotifications.filter(n => !n.isRead).length + promoUnreadCount;

  useEffect(() => {
    const updatePromoCount = () => setPromoUnreadCount(getPromoNotifications().filter(n => !n.isRead).length);
    window.addEventListener(PROMO_NOTIFICATION_EVENT, updatePromoCount);
    window.addEventListener("storage", updatePromoCount);
    return () => {
      window.removeEventListener(PROMO_NOTIFICATION_EVENT, updatePromoCount);
      window.removeEventListener("storage", updatePromoCount);
    };
  }, []);

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  function handleLogout() {
    localStorage.removeItem("user");
    setUserMenuOpen(false);
    navigate("/");
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search.trim())}`);
  }

  return (
    <header className="bg-orange-500 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 py-3">
          {/* Logo */}
          <Link to="/" className="text-white shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <UtensilsCrossed className="h-5 w-5 text-orange-500" />
              </div>
              <span className="hidden sm:block text-xl font-bold tracking-tight">ShopFoodVN</span>
            </div>
          </Link>

          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 flex">
            <div className="flex w-full rounded-full overflow-hidden bg-white shadow-sm">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm món ăn hoặc quán gần bạn..."
                className="flex-1 px-4 py-2 text-sm text-gray-800 outline-none bg-white"
              />
              <button type="submit" className="bg-orange-400 hover:bg-orange-300 px-4 flex items-center justify-center transition-colors">
                <Search className="h-4 w-4 text-white" />
              </button>
            </div>
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Link to="/notifications" className="relative text-white p-2 hover:text-orange-100 transition-colors hidden sm:block">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </Link>

            <Link to="/wishlist" className="relative text-white p-2 hover:text-orange-100 transition-colors">
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                  {wishlist.length > 99 ? "99+" : wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative text-white p-2 hover:text-orange-100 transition-colors">
              <ShoppingCart className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-medium">
                  {count > 99 ? "99+" : count}
                </span>
              )}
            </Link>

            <Link to="/orders" className="relative text-white p-2 hover:text-orange-100 transition-colors hidden sm:block" title="Đơn hàng của tôi">
              <Package className="h-5 w-5" />
            </Link>

            <div className="relative">
              {user ? (
                <>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 text-white hover:text-orange-100 transition-colors p-1"
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-7 h-7 rounded-full object-cover" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                    <span className="hidden md:block text-sm">Tài khoản</span>
                    <ChevronDown className="h-3 w-3 hidden md:block" />
                  </button>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100 bg-orange-50">
                          <div className="font-medium text-sm text-gray-800">{user.name}</div>
                          <div className="text-xs text-gray-500 truncate">{user.email || user.phone}</div>
                        </div>
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                          <User className="h-4 w-4 text-gray-400" />Hồ sơ của tôi
                        </Link>
                        <Link to="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                          <Package className="h-4 w-4 text-gray-400" />Đơn hàng
                        </Link>
                        <Link to="/chat" className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                          <MessageCircle className="h-4 w-4 text-gray-400" />Tin nhắn
                        </Link>
                        <div className="border-t border-gray-100">
                          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left">
                            <LogOut className="h-4 w-4" />Đăng xuất
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <Link to="/login" className="flex items-center gap-1.5 text-white hover:text-orange-100 transition-colors p-1">
                  <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="hidden md:block text-sm">Đăng nhập</span>
                </Link>
              )}
            </div>

            <button className="md:hidden text-white p-1" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>


      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <UtensilsCrossed className="h-4 w-4 text-white" />
              </div>
              <span className="text-white font-bold text-lg">ShopFoodVN</span>
            </div>
            <p className="text-sm leading-relaxed">Kết nối bạn với những quán ăn ngon quanh khu vực, giao nhanh và rõ ràng từng đơn.</p>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3">Hỗ trợ khách hàng</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Trung tâm trợ giúp</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hướng dẫn mua hàng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách đổi trả</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Liên hệ chúng tôi</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3">Về ShopFoodVN</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Giới thiệu</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tuyển dụng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-medium mb-3">Kết nối với chúng tôi</h4>
            <div className="flex gap-3 mt-2">
              {["Facebook", "TikTok", "Instagram", "YouTube"].map((s) => (
                <a key={s} href="#" className="text-xs hover:text-white transition-colors px-2 py-1 border border-gray-700 rounded hover:border-gray-500">
                  {s}
                </a>
              ))}
            </div>
            <div className="mt-4">
              <h4 className="text-white font-medium mb-2 text-sm">Tải ứng dụng</h4>
              <div className="flex gap-2">
                <div className="bg-gray-800 text-xs px-3 py-1.5 rounded border border-gray-700 hover:border-gray-500 cursor-pointer transition-colors">App Store</div>
                <div className="bg-gray-800 text-xs px-3 py-1.5 rounded border border-gray-700 hover:border-gray-500 cursor-pointer transition-colors">Google Play</div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
          © 2026 ShopFoodVN. Tất cả quyền được bảo lưu. Giấy phép ĐKKD: 01234567-2020/SKHĐT-TP.HCM
        </div>
      </div>
    </footer>
  );
}

function UserLayoutInner() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export function UserLayout() {
  return (
    <CartProvider>
      <UserLayoutInner />
    </CartProvider>
  );
}
