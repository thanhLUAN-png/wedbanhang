export type OrderStatus = "pending" | "accepted" | "arrived" | "picked" | "delivering" | "delivered" | "cancelled";

export interface Order {
  id: string;
  code: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  shopName: string;
  items: string;
  weight: number;
  cod: number;
  shippingFee: number;
  distance: string;
  status: OrderStatus;
  createdAt: string;
  note?: string;
  proofPhoto?: string;
  signature?: string;
  customerRating?: number;
  shopRating?: number;
  ratingMessage?: string;
  customerRatingMessage?: string;
  shopRatingMessage?: string;
  ratingSubmittedAt?: string;
}

export interface Message {
  id: string;
  from: "shipper" | "other";
  text: string;
  time: string;
}

export interface Chat {
  id: string;
  orderId: string;
  orderCode: string;
  with: string;
  type: "customer" | "seller";
  avatar: string;
  messages: Message[];
  lastMessage: string;
  lastTime: string;
  unread: number;
}

export interface User {
  name: string;
  phone: string;
  isShipper: boolean;
  avatar?: string;
  vehicle?: string;
  licensePlate?: string;
  rating?: number;
  totalDeliveries?: number;
}
