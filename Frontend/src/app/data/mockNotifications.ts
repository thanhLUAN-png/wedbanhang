export type NotificationType = "order" | "promo" | "system" | "review" | "chat";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  link?: string;
  image?: string;
}

export const PROMO_NOTIFICATION_STORAGE_KEY = "shopfoodvn_promo_notifications";
export const PROMO_NOTIFICATION_EVENT = "shopfoodvn:promo-notification";

export function getPromoNotifications(): Notification[] {
  try {
    const value = localStorage.getItem(PROMO_NOTIFICATION_STORAGE_KEY);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

export function savePromoNotifications(notifications: Notification[]) {
  localStorage.setItem(PROMO_NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications));
  window.dispatchEvent(new CustomEvent(PROMO_NOTIFICATION_EVENT));
}

export const mockNotifications: Notification[] = [
  { id: "n01", type: "order", title: "Đơn hàng đã được giao", message: "Đơn hàng ORD-20260701-001 đã được giao thành công. Vui lòng xác nhận nhận hàng.", isRead: false, createdAt: "2026-07-04T15:30:00", link: "/orders/ORD-20260701-001", image: "https://picsum.photos/seed/phone1/80/80" },
  { id: "n02", type: "promo", title: "Flash Sale hôm nay - Giảm đến 50%!", message: "Đừng bỏ lỡ hàng nghìn sản phẩm Flash Sale giảm sốc từ 20-50% chỉ trong hôm nay!", isRead: false, createdAt: "2026-07-13T08:00:00", link: "/" },
  { id: "n03", type: "order", title: "Đơn hàng đang được giao", message: "Đơn hàng ORD-20260705-002 đang trên đường giao đến bạn. Mã vận đơn: GHTK-XYZ789", isRead: false, createdAt: "2026-07-06T09:00:00", link: "/orders/ORD-20260705-002" },
  { id: "n04", type: "system", title: "Tài khoản được xác minh thành công", message: "Chúc mừng! Tài khoản của bạn đã được xác minh email thành công. Bạn có thể mua sắm đầy đủ tính năng.", isRead: true, createdAt: "2026-06-30T10:00:00" },
  { id: "n05", type: "review", title: "Nhớ đánh giá sản phẩm đã mua", message: "Bạn chưa đánh giá sản phẩm từ đơn hàng ORD-20260701-001. Đánh giá ngay để nhận xu thưởng!", isRead: true, createdAt: "2026-07-05T12:00:00", link: "/profile?tab=orders" },
  { id: "n06", type: "chat", title: "TechStore Official đã trả lời", message: "TechStore Official: Sản phẩm này còn hàng bạn nhé! Bạn muốn đặt ngay không?", isRead: true, createdAt: "2026-07-07T14:30:00", link: "/chat", image: "https://picsum.photos/seed/shop1/80/80" },
  { id: "n07", type: "promo", title: "Voucher sinh nhật dành riêng cho bạn", message: "ShopeeVN gửi tặng bạn voucher giảm 100.000đ nhân dịp sinh nhật. Hạn sử dụng đến hết ngày 31/07.", isRead: true, createdAt: "2026-07-01T00:00:00" },
  { id: "n08", type: "order", title: "Đơn hàng đã xác nhận", message: "Đơn hàng ORD-20260708-003 đã được người bán xác nhận và đang chuẩn bị hàng.", isRead: true, createdAt: "2026-07-08T15:00:00", link: "/orders/ORD-20260708-003" },
  { id: "n09", type: "system", title: "Cập nhật chính sách bảo mật", message: "ShopeeVN đã cập nhật chính sách bảo mật. Vui lòng đọc và xác nhận để tiếp tục sử dụng dịch vụ.", isRead: true, createdAt: "2026-07-01T09:00:00" },
  { id: "n10", type: "promo", title: "Miễn phí vận chuyển cho đơn từ 99k", message: "Hôm nay đặt hàng bất kỳ từ 99.000đ được miễn phí vận chuyển toàn quốc. Mua ngay!", isRead: true, createdAt: "2026-07-12T07:00:00", link: "/" },
];
