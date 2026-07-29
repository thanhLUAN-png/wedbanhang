import { useState } from "react";
import { Bell, Package, Tag, Settings, Star, MessageCircle, CheckCheck } from "lucide-react";
import { getPromoNotifications, mockNotifications, savePromoNotifications, type Notification, type NotificationType } from "../../data/mockNotifications";

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  if (days > 0) return `${days} ngày trước`;
  if (hrs > 0) return `${hrs} giờ trước`;
  if (mins > 0) return `${mins} phút trước`;
  return "Vừa xong";
}

const typeIcon: Record<NotificationType, React.ComponentType<{ className?: string }>> = {
  order:  Package,
  promo:  Tag,
  system: Settings,
  review: Star,
  chat:   MessageCircle,
};

const typeBg: Record<NotificationType, string> = {
  order:  "bg-blue-50 text-blue-600",
  promo:  "bg-orange-50 text-orange-600",
  system: "bg-gray-50 text-gray-600",
  review: "bg-yellow-50 text-yellow-600",
  chat:   "bg-green-50 text-green-600",
};

const typeLabel: Record<NotificationType, string> = {
  order:  "Đơn hàng",
  promo:  "Khuyến mãi",
  system: "Hệ thống",
  review: "Đánh giá",
  chat:   "Tin nhắn",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(() => [...getPromoNotifications(), ...mockNotifications]);
  const [activeTab, setActiveTab] = useState<"all" | NotificationType>("all");

  const filtered = activeTab === "all" ? notifications : notifications.filter(n => n.type === activeTab);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  function markAllRead() {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, isRead: true }));
      savePromoNotifications(updated.filter(n => n.id.startsWith("lucky-")));
      return updated;
    });
  }

  function markRead(id: string) {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, isRead: true } : n);
      savePromoNotifications(updated.filter(n => n.id.startsWith("lucky-")));
      return updated;
    });
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5 text-orange-500" />
          <h1 className="text-xl font-bold text-gray-900">Thông báo</h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">{unreadCount} mới</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-1.5 text-orange-500 text-sm hover:text-orange-600">
            <CheckCheck className="h-4 w-4" />Đánh dấu đã đọc
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {([["all", "Tất cả"], ...Object.entries(typeLabel)] as [string, string][]).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setActiveTab(k as "all" | NotificationType)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${activeTab === k ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Bell className="h-12 w-12 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400">Không có thông báo nào</p>
          </div>
        ) : filtered.map((n: Notification) => {
          const Icon = typeIcon[n.type];
          return (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`flex gap-3 p-4 rounded-2xl border cursor-pointer transition-all hover:shadow-sm ${n.isRead ? "bg-white border-gray-100" : "bg-orange-50 border-orange-100"}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${typeBg[n.type]}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="font-medium text-sm text-gray-900 line-clamp-1">{n.title}</div>
                  {!n.isRead && <div className="w-2 h-2 bg-orange-500 rounded-full shrink-0 mt-1.5" />}
                </div>
                <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{n.message}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-gray-400">{timeAgo(n.createdAt)}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded ${typeBg[n.type]}`}>{typeLabel[n.type]}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
