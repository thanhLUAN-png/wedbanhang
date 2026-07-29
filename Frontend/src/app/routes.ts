import { createBrowserRouter } from "react-router";
import { AdminLayout } from "./components/layout/AdminLayout";
import { UserLayout } from "./components/layout/UserLayout";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import ProductReviewPage from "./pages/ProductReviewPage";
import RevenuePage from "./pages/RevenuePage";
import CategoriesPage from "./pages/CategoriesPage";
import ComplaintsPage from "./pages/ComplaintsPage";
import HomePage from "./pages/user/HomePage";
import ProductDetailPage from "./pages/user/ProductDetailPage";
import CartPage from "./pages/user/CartPage";
import CheckoutPage from "./pages/user/CheckoutPage";
import ProfilePage from "./pages/user/ProfilePage";
import SearchPage from "./pages/user/SearchPage";
import WishlistPage from "./pages/user/WishlistPage";
import OrdersPage from "./pages/user/OrdersPage";
import OrderDetailPage from "./pages/user/OrderDetailPage";
import RegisterSellerPage from "./pages/user/RegisterSellerPage";
import RegisterShipperPage from "./pages/user/RegisterShipperPage";
import NotificationsPage from "./pages/user/NotificationsPage";
import ShopPage from "./pages/user/ShopPage";
import ChatPage from "./pages/user/ChatPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import SellerLayout from "./components/layout/SellerLayout";
import SellerDashboardPage from "./pages/seller/DashboardPage";
import SellerOrdersPage from "./pages/seller/SellerOrdersPage";
import SellerProductsPage from "./pages/seller/SellerProductsPage";
import ShopInfoPage from "./pages/seller/ShopInfoPage";
import AnalyticsPage from "./pages/seller/AnalyticsPage";
import PromotionsPage from "./pages/seller/PromotionsPage";
import SellerChatPage from "./pages/seller/ChatPage";
import FinancePage from "./pages/seller/FinancePage";
import SettingsPage from "./pages/seller/SettingsPage";
import ShipperApp from "./pages/shipper/ShipperApp";

export const router = createBrowserRouter([
  // Auth (no layout)
  { path: "/login",            Component: LoginPage },
  { path: "/register",         Component: RegisterPage },
  { path: "/forgot-password",  Component: ForgotPasswordPage },

  // Admin
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true,                Component: DashboardPage },
      { path: "users",              Component: UsersPage },
      { path: "products",           Component: ProductReviewPage },
      { path: "revenue",            Component: RevenuePage },
      { path: "categories",         Component: CategoriesPage },
      { path: "complaints",         Component: ComplaintsPage },
    ],
  },

  // User (storefront)
  {
    path: "/",
    Component: UserLayout,
    children: [
      { index: true,                    Component: HomePage },
      { path: "product/:id",            Component: ProductDetailPage },
      { path: "cart",                   Component: CartPage },
      { path: "checkout",               Component: CheckoutPage },
      { path: "profile",                Component: ProfilePage },
      { path: "search",                 Component: SearchPage },
      { path: "wishlist",               Component: WishlistPage },
      { path: "register-seller",        Component: RegisterSellerPage },
      { path: "register-shipper",       Component: RegisterShipperPage },
      { path: "orders",                 Component: OrdersPage },
      { path: "orders/:id",             Component: OrderDetailPage },
      { path: "notifications",          Component: NotificationsPage },
      { path: "shop/:id",               Component: ShopPage },
      { path: "chat",                   Component: ChatPage },
    ],
  },

  // Seller
  {
    path: "/seller",
    Component: SellerLayout,
    children: [
      { index: true,                    Component: SellerDashboardPage },
      { path: "orders",                 Component: SellerOrdersPage },
      { path: "products",               Component: SellerProductsPage },
      { path: "shop",                   Component: ShopInfoPage },
      { path: "analytics",              Component: AnalyticsPage },
      { path: "promotions",             Component: PromotionsPage },
      { path: "chat",                   Component: SellerChatPage },
      { path: "finance",                Component: FinancePage },
      { path: "settings",               Component: SettingsPage },
    ]
  },

  // Shipper
  {
    path: "/shipper/*",
    Component: ShipperApp
  }
]);
