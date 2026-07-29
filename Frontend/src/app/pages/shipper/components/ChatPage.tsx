import { useEffect, useState } from "react";
import { Send, Phone, MessageSquare, User, Store, Search, Users } from "lucide-react";
import { Chat, Message } from "./types";

interface ChatPageProps {
  chats: Chat[];
  activeChatId?: string;
  onBack: () => void;
  onSendMessage: (chatId: string, text: string) => void;
}

export function ChatPage({ chats, activeChatId, onBack, onSendMessage }: ChatPageProps) {
  const initialChat = chats.find(c => c.id === activeChatId) || chats[0];
  const [activeType, setActiveType] = useState<"customer" | "seller">(initialChat?.type || "customer");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(initialChat?.id ?? null);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");

  const selectedChat = chats.find(c => c.id === selectedChatId && c.type === activeType);
  const filteredChats = chats.filter(c => {
    const query = search.trim().toLowerCase();
    return c.type === activeType && (
      c.with.toLowerCase().includes(query) ||
      c.orderCode.toLowerCase().includes(query)
    );
  });
  const unreadCustomers = chats.filter(c => c.type === "customer").reduce((s, c) => s + c.unread, 0);
  const unreadSellers = chats.filter(c => c.type === "seller").reduce((s, c) => s + c.unread, 0);

  useEffect(() => {
    if (!selectedChat) setSelectedChatId(chats.find(c => c.type === activeType)?.id ?? null);
  }, [activeType, chats, selectedChat]);

  const handleTypeChange = (type: "customer" | "seller") => {
    setActiveType(type);
    setSearch("");
    setSelectedChatId(chats.find(c => c.type === type)?.id ?? null);
  };

  const handleSend = () => {
    if (!input.trim() || !selectedChatId) return;
    onSendMessage(selectedChatId, input.trim());
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-gray-900" style={{fontSize:"22px"}}>Tin nhắn</h2>
          <p className="text-gray-500 text-sm mt-0.5">Liên lạc với khách hàng và quán ăn</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button onClick={() => handleTypeChange("customer")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${activeType === "customer" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            style={{fontWeight:500}}>
            <Users className="w-4 h-4" /> Khách hàng
            {unreadCustomers > 0 && <span className="px-1.5 py-0.5 rounded-full bg-blue-500 text-white text-[10px]">{unreadCustomers}</span>}
          </button>
          <button onClick={() => handleTypeChange("seller")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${activeType === "seller" ? "bg-white text-green-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            style={{fontWeight:500}}>
            <Store className="w-4 h-4" /> Quán ăn
            {unreadSellers > 0 && <span className="px-1.5 py-0.5 rounded-full bg-green-500 text-white text-[10px]">{unreadSellers}</span>}
          </button>
        </div>
      </div>

      <div className="flex gap-4 flex-1 min-h-0 overflow-hidden border border-gray-200 rounded-xl bg-white">
        {/* Sidebar */}
        <div className="w-72 border-r border-gray-100 flex flex-col">
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                type="text" placeholder="Tìm tên hoặc mã đơn..."
                value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:border-orange-300"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <MessageSquare className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-sm">Chưa có tin nhắn</p>
              </div>
            ) : filteredChats.map(chat => (
              <div
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors border-b border-gray-50 ${
                  selectedChatId === chat.id
                    ? activeType === "customer" ? "bg-blue-50 border-l-2 border-l-blue-500" : "bg-green-50 border-l-2 border-l-green-500"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="relative shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${activeType === "customer" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`} style={{fontWeight:700}}>
                    {chat.avatar}
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center ${chat.type === "customer" ? "bg-blue-500" : "bg-green-500"}`}>
                    {chat.type === "customer" ? <User className="w-2.5 h-2.5 text-white" /> : <Store className="w-2.5 h-2.5 text-white" />}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-800" style={{fontWeight:600}}>{chat.with}</p>
                    <p className="text-xs text-gray-400">{chat.lastTime}</p>
                  </div>
                  <p className="text-xs text-gray-400 mb-0.5">{chat.type === "customer" ? "Khách hàng" : "Quán ăn"} • #{chat.orderCode}</p>
                  <p className="text-xs text-gray-500 truncate">{chat.lastMessage || "Bắt đầu cuộc trò chuyện"}</p>
                </div>
                {chat.unread > 0 && (
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-white text-xs">{chat.unread}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        {selectedChat ? (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat header */}
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-sm" style={{fontWeight:700}}>
                  {selectedChat.avatar}
                </div>
                <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full flex items-center justify-center ${selectedChat.type === "customer" ? "bg-blue-500" : "bg-green-500"}`}>
                  {selectedChat.type === "customer" ? <User className="w-2 h-2 text-white" /> : <Store className="w-2 h-2 text-white" />}
                </div>
              </div>
              <div>
                <p className="text-gray-800" style={{fontWeight:600}}>{selectedChat.with}</p>
                <p className="text-xs text-gray-400">{selectedChat.type === "customer" ? "Khách hàng" : "Quán ăn"} • #{selectedChat.orderCode}</p>
              </div>
              <div className="ml-auto">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              <div className="text-center text-xs text-gray-400 mb-2">Hôm nay</div>
              {selectedChat.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.from === "shipper" ? "justify-end" : "justify-start"} gap-2`}>
                  {msg.from !== "shipper" && (
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-1">
                      {selectedChat.type === "customer" ? <User className="w-3.5 h-3.5 text-gray-500" /> : <Store className="w-3.5 h-3.5 text-gray-500" />}
                    </div>
                  )}
                  <div>
                    <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                      msg.from === "shipper" ? "bg-orange-500 text-white rounded-tr-sm" : "bg-gray-100 text-gray-800 rounded-tl-sm"
                    }`}>
                      {msg.text}
                    </div>
                    <p className={`text-xs text-gray-400 mt-1 ${msg.from === "shipper" ? "text-right" : ""}`}>{msg.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick replies */}
            <div className="px-5 pb-2 flex gap-2 overflow-x-auto">
              {["Tôi đang trên đường", "Khoảng 5 phút nữa", "Tôi đã đến", "Vui lòng gọi lại"].map(q => (
                <button key={q} onClick={() => { onSendMessage(selectedChat.id, q); }}
                  className="whitespace-nowrap px-3 py-1.5 bg-orange-50 border border-orange-200 text-orange-600 rounded-full text-xs hover:bg-orange-100 transition-colors">
                  {q}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="px-5 py-3 border-t border-gray-100 flex gap-2">
              <input
                type="text" placeholder="Nhập tin nhắn..."
                value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-300 transition-colors"
              />
              <button onClick={handleSend} className="w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded-xl flex items-center justify-center transition-colors">
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <MessageSquare className="w-16 h-16 mb-3 opacity-20" />
            <p>Chọn một cuộc trò chuyện</p>
          </div>
        )}
      </div>
    </div>
  );
}
