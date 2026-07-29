import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { useState } from "react";
import {
  LayoutDashboard, ShoppingCart, Package, Store, BarChart3,
  MessageSquare, Truck, DollarSign, Tag, Settings, LogOut,
  Bell, ShoppingBag, Star, Menu, X
} from "lucide-react";

const SIDEBAR_LINKS = [
  { path: "/seller", label: "Tổng quan", icon: LayoutDashboard },
  { path: "/seller/orders", label: "Quản lý đơn hàng", icon: ShoppingCart },
  { path: "/seller/products", label: "Sản phẩm", icon: Package },
  { path: "/seller/analytics", label: "Thống kê đơn hàng", icon: BarChart3 },
  { path: "/seller/finance", label: "Báo cáo tài chính (Chưa vào)", icon: DollarSign },
  { path: "/seller/promotions", label: "Khuyến mãi", icon: Tag },
  { path: "/seller/chat", label: "Tin nhắn", icon: MessageSquare },
  { path: "/seller/settings", label: "Cài đặt", icon: Settings },
];

export default function SellerLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Mock data for display, in a real app these come from Context/State
  const shop = { name: "Cơm Tấm Sài Gòn", rating: "4.8" };
  const user = { name: "Nguyễn Văn A", email: "nva@gmail.com" };

  const handleLogout = () => {
    localStorage.removeItem("isSeller");
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between absolute w-full top-0 z-20">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-orange-500" />
          <span className="font-bold text-gray-800">ShopFoodVN Seller</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-600">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:relative top-0 left-0 z-30 h-screen w-56 bg-white border-r border-gray-200 flex flex-col shrink-0
        transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* Logo */}
        <div className="p-4 border-b border-gray-100 hidden md:block">
          <Link to="/seller" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-500">
              <ShoppingBag size={16} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-sm text-orange-500">ShopFoodVN Seller</div>
            </div>
          </Link>
        </div>

        {/* Shop info */}
        <div className="p-3 border-b border-gray-100 bg-orange-50">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 bg-orange-500">
              {shop?.name?.charAt(0) || 'S'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold truncate text-gray-800">{shop?.name}</div>
              <div className="flex items-center gap-1 text-xs text-yellow-500">
                <Star size={10} fill="currentColor" />
                <span className="text-gray-500">{shop?.rating}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2">
          {SIDEBAR_LINKS.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== '/seller' && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 text-xs transition-colors mx-2 rounded-lg my-0.5 ${
                  isActive
                    ? 'font-semibold text-white bg-orange-500'
                    : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                <link.icon size={16} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-2 px-1">
            <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-bold shrink-0">
              {user?.name?.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium truncate text-gray-700">{user?.name}</div>
              <div className="text-[10px] text-gray-400 truncate">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-red-500 hover:text-red-700 w-full px-1 py-1 rounded hover:bg-red-50 transition-colors"
          >
            <LogOut size={14} />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden w-full pt-14 md:pt-0">
        {/* Header */}
        <header className="hidden md:flex h-12 bg-white border-b border-gray-200 items-center justify-between px-5 shrink-0 sticky top-0 z-10">
          <div />
          <div className="flex items-center gap-3">
            <button className="relative p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50">
              <Bell size={18} />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2 text-sm text-gray-600 border-l pl-3 ml-1 border-gray-200">
              <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-xs font-bold text-orange-500">
                {user?.name?.charAt(0)}
              </div>
              <span className="text-xs font-medium">{user?.name}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50/50">
          <Outlet />
        </main>
      </div>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}
    </div>
  );
}
