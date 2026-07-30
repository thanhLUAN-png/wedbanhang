import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  Package, History, MessageSquare, BarChart2, User, Wallet,
  Bike, Bell, ChevronLeft, ChevronRight as ChevronRightIcon, LogOut, Star
} from "lucide-react";
import { OrdersPage } from "./components/OrdersPage";
import { OrderDetailPage } from "./components/OrderDetailPage";
import { HistoryPage } from "./components/HistoryPage";
import { ChatPage } from "./components/ChatPage";
import { ReportPage } from "./components/ReportPage";
import { WalletPage } from "./components/WalletPage";
import { ProfilePage } from "./components/ProfilePage";
import { RatingsPage } from "./components/RatingsPage";
import { mockChats } from "./components/mockData";
import { Order, OrderStatus, Chat, Message } from "./components/types";

// Mock shipper user - dùng chung với hệ thống, không cần đăng nhập riêng
const getShipperUser = () => {
  try {
    const saved = JSON.parse(localStorage.getItem("user") || "{}");
    return { name: saved.name || "Shipper", phone: saved.phone || "0933000001", isShipper: true };
  } catch {
    return { name: "Shipper", phone: "0933000001", isShipper: true };
  }
};

type Tab = "orders" | "history" | "chat" | "report" | "wallet" | "ratings" | "profile";

const navItems: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "orders",  label: "Nhận đơn",     icon: <Package className="w-5 h-5" /> },
  { key: "history", label: "Lịch sử",       icon: <History className="w-5 h-5" /> },
  { key: "chat",    label: "Tin nhắn",      icon: <MessageSquare className="w-5 h-5" /> },
  { key: "wallet",  label: "Ví cá nhân",    icon: <Wallet className="w-5 h-5" /> },
  { key: "report",  label: "Báo cáo",       icon: <BarChart2 className="w-5 h-5" /> },
  { key: "ratings", label: "Đánh giá",      icon: <Star className="w-5 h-5" /> },
  { key: "profile", label: "Cá nhân",       icon: <User className="w-5 h-5" /> },
];

export default function ShipperApp() {
  const navigate = useNavigate();
  const currentUser = getShipperUser();
  const [activeTab, setActiveTab]         = useState<Tab>("orders");
  const [orders, setOrders]               = useState<Order[]>([]);
  const [history, setHistory]             = useState<Order[]>([]);
  const [chats, setChats]                 = useState<Chat[]>(mockChats);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeChatId, setActiveChatId]   = useState<string | undefined>(undefined);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isOnline, setIsOnline] = useState(() => localStorage.getItem("shipperOnline") !== "false");

  useEffect(() => {
    localStorage.setItem("shipperOnline", String(isOnline));
  }, [isOnline]);

  const mapSqlOrder = (order: any): Order => ({
    id: order.id, code: order.code, senderName: order.senderName,
    senderPhone: order.senderPhone, senderAddress: order.senderAddress,
    shopName: order.senderName, receiverName: order.receiverName,
    receiverPhone: order.receiverPhone, receiverAddress: order.receiverAddress,
    items: order.items, weight: 0, cod: order.cod, shippingFee: order.shippingFee,
    distance: "—",
    status: order.status === "arrived" ? "arrived"
      : order.status === "handed_over" ? "picked"
      : order.status === "shipping" ? "delivering"
      : order.status === "completed" ? "delivered"
      : order.status === "cancelled" ? "cancelled"
      : order.assignedToMe ? "accepted" : "pending",
    createdAt: order.createdAt, note: order.note,
  });

  const loadOrders = useCallback(async () => {
    const response = await fetch(`/seller-api/shipper/orders?phone=${encodeURIComponent(currentUser.phone)}`);
    if (!response.ok) return;
    const data = (await response.json()).map(mapSqlOrder) as Order[];
    setOrders(data.filter(order => !["delivered", "cancelled"].includes(order.status)));
    setHistory(data.filter(order => ["delivered", "cancelled"].includes(order.status)));
  }, [currentUser.phone]);

  useEffect(() => {
    void loadOrders();
    const timer = window.setInterval(() => void loadOrders(), 5000);
    return () => window.clearInterval(timer);
  }, [loadOrders]);

  const handleLogout = () => navigate("/");

  const connectOrderChats = (order: Order) => {
    setChats(prev => {
      const nextChats = [...prev];
      const now = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });

      if (!nextChats.some(chat => chat.orderId === order.id && chat.type === "customer")) {
        nextChats.unshift({
          id: `customer-${order.id}`,
          orderId: order.id,
          orderCode: order.code,
          with: order.receiverName,
          type: "customer",
          avatar: order.receiverName.substring(0, 2).toUpperCase(),
          lastMessage: "Đã kết nối với người mua",
          lastTime: now,
          unread: 0,
          messages: [{
            id: `system-customer-${Date.now()}`,
            from: "shipper",
            text: `Xin chào, tôi là shipper giao đơn #${order.code} của bạn.`,
            time: now,
          }],
        });
      }

      if (!nextChats.some(chat => chat.orderId === order.id && chat.type === "seller")) {
        nextChats.unshift({
          id: `seller-${order.id}`,
          orderId: order.id,
          orderCode: order.code,
          with: order.senderName,
          type: "seller",
          avatar: order.senderName.substring(0, 2).toUpperCase(),
          lastMessage: "Đã kết nối với quán ăn",
          lastTime: now,
          unread: 0,
          messages: [{
            id: `system-seller-${Date.now()}`,
            from: "shipper",
            text: `Xin chào quán, tôi là shipper nhận giao đơn #${order.code}.`,
            time: now,
          }],
        });
      }

      return nextChats;
    });
  };

  const handleAcceptOrder = async (orderId: string) => {
    const activeOrder = orders.find(o => ["accepted", "arrived", "picked", "delivering"].includes(o.status));
    if (activeOrder && activeOrder.id !== orderId) {
      toast.error(`Bạn đang thực hiện đơn #${activeOrder.code}. Hãy hoàn thành đơn này trước.`);
      return;
    }

    const response = await fetch(`/seller-api/shipper/orders/${encodeURIComponent(orderId)}/accept?phone=${encodeURIComponent(currentUser.phone)}`, { method: "PUT" });
    if (!response.ok) {
      toast.error("Đơn đã có shipper khác nhận hoặc bạn đang giao đơn khác.");
      await loadOrders();
      return;
    }

    setOrders(prev => prev
      .map(o => o.id === orderId ? { ...o, status: "accepted" as OrderStatus } : o)
    );
    setSelectedOrder(prev => prev?.id === orderId ? { ...prev, status: "accepted" } : prev);
    const acceptedOrder = orders.find(order => order.id === orderId);
    if (acceptedOrder) connectOrderChats(acceptedOrder);
    toast.success("Đã nhận đơn! Hãy di chuyển đến quán để lấy hàng.");
  };

  const handleUpdateStatus = async (orderId: string, status: OrderStatus, proof?: string, cancelReason?: string, customerRating?: number, shopRating?: number, customerRatingMessage?: string, shopRatingMessage?: string) => {
    // API status cho "delivering" (shipper đã nhận hàng) là "delivering", backend sẽ map về "shipping"
    if (["arrived", "delivering", "delivered", "cancelled"].includes(status)) {
      const apiStatus = status === "arrived" ? "arrived" : status;
      const response = await fetch(`/seller-api/shipper/orders/${encodeURIComponent(orderId)}/status?phone=${encodeURIComponent(currentUser.phone)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: apiStatus }),
      });
      if (!response.ok) {
        toast.error("Không thể cập nhật trạng thái. Có thể quán chưa bấm giao hàng, vui lòng đợi quán xác nhận giao.");
        await loadOrders();
        return;
      }
    }
    // "picked" là sau khi seller giao hàng cho shipper, DB đã là "shipping" → đổi UI thành "delivering"
    // Status "picked" chỉ là UI intermediate, không cần gọi API thêm
    const ratingSubmittedAt = customerRating || shopRating ? new Date().toISOString() : undefined;
    setOrders(prev => prev.map(o =>
      o.id === orderId ? { ...o, status, proofPhoto: proof ?? o.proofPhoto, note: cancelReason ?? o.note, customerRating, shopRating, customerRatingMessage, shopRatingMessage, ratingSubmittedAt } : o
    ));
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status, proofPhoto: proof ?? prev.proofPhoto, note: cancelReason ?? prev.note, customerRating, shopRating, customerRatingMessage, shopRatingMessage, ratingSubmittedAt } : null);
    }
    if (status === "delivered" || status === "cancelled") {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        setHistory(prev => [{ ...order, status, proofPhoto: proof, note: cancelReason ?? order.note, customerRating, shopRating, customerRatingMessage, shopRatingMessage, ratingSubmittedAt }, ...prev]);
        setOrders(prev => prev.filter(o => o.id !== orderId));
        setSelectedOrder(null);

      }
    }
  };

  const handleUpdateRating = (orderId: string, customerRating?: number, shopRating?: number, customerRatingMessage?: string, shopRatingMessage?: string) => {
    setHistory(previous => previous.map(order => order.id === orderId
      ? { ...order, customerRating, shopRating, customerRatingMessage, shopRatingMessage }
      : order
    ));
  };

  const handleOpenChat = (orderId: string, type: "customer" | "seller") => {
    const existing = chats.find(c => c.orderId === orderId && c.type === type);
    if (existing) {
      setActiveChatId(existing.id);
    } else {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;
      const newChat: Chat = {
        id: `c-${Date.now()}`,
        orderId,
        orderCode: order.code,
        with: type === "customer" ? order.receiverName : order.senderName,
        type,
        avatar: (type === "customer" ? order.receiverName : order.senderName).substring(0, 2).toUpperCase(),
        lastMessage: "",
        lastTime: "Vừa xong",
        unread: 0,
        messages: [],
      };
      setChats(prev => [newChat, ...prev]);
      setActiveChatId(newChat.id);
    }
    setActiveTab("chat");
    setSelectedOrder(null);
  };

  const handleSendMessage = (chatId: string, text: string) => {
    const newMsg: Message = {
      id: `m-${Date.now()}`,
      from: "shipper",
      text,
      time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
    };
    setChats(prev => prev.map(c =>
      c.id === chatId
        ? { ...c, messages: [...c.messages, newMsg], lastMessage: text, lastTime: newMsg.time, unread: 0 }
        : c
    ));
  };

  const handleRegisterShipper = (data: { vehicle: string; licensePlate: string; idCard: string }) => {
    // mock: đã là shipper rồi
  };

  const totalUnread = chats.reduce((s, c) => s + c.unread, 0);
  const pendingOrders = orders.filter(o => o.status === "pending").length;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`flex flex-col bg-white border-r border-gray-200 transition-all duration-200 shrink-0 ${sidebarCollapsed ? "w-16" : "w-56"}`}>
        {/* Logo */}
        <div className={`flex items-center gap-2.5 px-4 py-4 border-b border-gray-100 ${sidebarCollapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shrink-0">
            <Bike className="w-5 h-5 text-white" />
          </div>
          {!sidebarCollapsed && <span className="text-gray-900" style={{fontWeight:700, fontSize:"16px"}}>ShipNhanh</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const isActive = activeTab === item.key && !selectedOrder;
            const badge = item.key === "chat" ? totalUnread : item.key === "orders" ? pendingOrders : 0;
            return (
              <button
                key={item.key}
                onClick={() => { setActiveTab(item.key); setSelectedOrder(null); setActiveChatId(undefined); }}
                title={sidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative group ${
                  isActive
                    ? "bg-orange-50 text-orange-600"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                }`}
              >
                <div className="relative shrink-0">
                  {item.icon}
                  {badge > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center leading-none">
                      {badge}
                    </span>
                  )}
                </div>
                {!sidebarCollapsed && (
                  <span className="text-sm" style={isActive ? {fontWeight:600} : {fontWeight:400}}>{item.label}</span>
                )}
                {isActive && !sidebarCollapsed && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-orange-500 rounded-l" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User info + Logout at bottom */}
        {!sidebarCollapsed && currentUser && (
          <div className="border-t border-gray-100 p-3">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-orange-500" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-gray-800 truncate" style={{fontWeight:500}}>{currentUser.name}</p>
                <p className="text-xs text-gray-400 truncate">{currentUser.phone}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs text-red-500 hover:text-red-700 w-full px-1 py-1 rounded hover:bg-red-50 transition-colors"
            >
              <LogOut size={14} />
              Về trang chủ
            </button>
          </div>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setSidebarCollapsed(c => !c)}
          className="border-t border-gray-100 p-3 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
        >
          {sidebarCollapsed ? <ChevronRightIcon className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>ShipNhanh</span>
            <span className="text-gray-300">/</span>
            {selectedOrder ? (
              <>
                <button onClick={() => setSelectedOrder(null)} className="hover:text-orange-500 transition-colors">
                  {navItems.find(n => n.key === activeTab)?.label}
                </button>
                <span className="text-gray-300">/</span>
                <span className="text-gray-700">{selectedOrder.code}</span>
              </>
            ) : (
              <span className="text-gray-700">{navItems.find(n => n.key === activeTab)?.label}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {pendingOrders > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-lg text-xs" style={{fontWeight:500}}>
                <Package className="w-3.5 h-3.5" />
                {pendingOrders} đơn đang chờ nhận
              </div>
            )}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              {totalUnread > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
            {currentUser && (
              <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                <div className="w-7 h-7 bg-orange-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-orange-500" />
                </div>
                <span className="text-sm text-gray-700" style={{fontWeight:500}}>{currentUser.name}</span>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {selectedOrder ? (
            <OrderDetailPage
              order={selectedOrder}
              onBack={() => setSelectedOrder(null)}
              onUpdateStatus={handleUpdateStatus}
              onChat={handleOpenChat}
            />
          ) : activeTab === "orders" ? (
            <OrdersPage
              orders={orders}
              isOnline={isOnline}
              onToggleOnline={() => setIsOnline(value => !value)}
              onSelectOrder={setSelectedOrder}
              onAcceptOrder={handleAcceptOrder}
            />
          ) : activeTab === "history" ? (
            <HistoryPage
              history={history}
              onSelectOrder={order => { setSelectedOrder(order); setActiveTab("orders"); }}
            />
          ) : activeTab === "chat" ? (
            <ChatPage
              chats={chats}
              activeChatId={activeChatId}
              onBack={() => setActiveChatId(undefined)}
              onSendMessage={handleSendMessage}
            />
          ) : activeTab === "wallet" ? (
            <WalletPage orders={orders} />
          ) : activeTab === "report" ? (
            <ReportPage />
          ) : activeTab === "ratings" ? (
            <RatingsPage orders={history} onViewOrder={setSelectedOrder} onUpdateRating={handleUpdateRating} />
          ) : activeTab === "profile" && currentUser ? (
            <ProfilePage
              user={currentUser}
              isOnline={isOnline}
              onLogout={handleLogout}
              onRegisterShipper={handleRegisterShipper}
            />
          ) : null}
        </main>
      </div>
    </div>
  );
}
