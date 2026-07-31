import { useEffect, useState, useRef } from "react";
import { Send, Phone, MessageSquare, Store, Search, Users } from "lucide-react";

interface ChatParticipant {
  conversationId: number;
  orderCode: string;
  participantName: string;
  participantType: string;
  lastMessage: string;
  lastMessageAt: string;
}

interface ChatMessage {
  id: number;
  content: string;
  fromMe: boolean;
  sentAt: string;
  senderType: string;
}

function formatTime(t: string) {
  return new Date(t).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
}

interface ChatPageProps {
  initialActiveType?: "customer" | "seller";
  initialOrderCode?: string;
  onBack?: () => void;
}

export function ChatPage({ initialActiveType = "customer", initialOrderCode }: ChatPageProps) {
  const shipperPhone = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}").phone || "0933000001"; } catch { return "0933000001"; }
  })();

  const [activeType, setActiveType] = useState<"customer" | "seller">(initialActiveType);
  useEffect(() => { if (initialActiveType) setActiveType(initialActiveType); }, [initialActiveType]);
  const [customerConvs, setCustomerConvs] = useState<ChatParticipant[]>([]);
  const [sellerConvs, setSellerConvs] = useState<ChatParticipant[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);

  const convs = activeType === "customer" ? customerConvs : sellerConvs;
  const selected = convs.find(c => c.conversationId === selectedId);
  const filtered = convs.filter(c =>
    c.participantName?.toLowerCase().includes(search.toLowerCase()) ||
    c.orderCode?.toLowerCase().includes(search.toLowerCase())
  );

  // Poll conversations list
  useEffect(() => {
    let active = true;
    const fetchConvs = async () => {
      try {
        const res = await fetch(`/seller-api/shipper/chat/participants?phone=${shipperPhone}`);
        if (res.ok && active) {
          const data: ChatParticipant[] = await res.json();
          setCustomerConvs(data.filter(c => c.participantType === "customer"));
          setSellerConvs(data.filter(c => c.participantType === "seller"));
        }
      } catch (e) {}
    };
    fetchConvs();
    const interval = setInterval(fetchConvs, 3000);
    return () => { active = false; clearInterval(interval); };
  }, [shipperPhone]);

  const [initialSelectDone, setInitialSelectDone] = useState(false);
  useEffect(() => {
    if (!initialSelectDone && initialOrderCode) {
      if (customerConvs.length > 0 || sellerConvs.length > 0) {
        const matchConvos = activeType === "customer" ? customerConvs : sellerConvs;
        const match = matchConvos.find(c => c.orderCode === initialOrderCode);
        if (match) {
          setSelectedId(match.conversationId);
          setInitialSelectDone(true);
        } else if (matchConvos.length > 0 && !match) {
          // Attempt to find in the other tab just in case? Or just mark done
          setInitialSelectDone(true);
        }
      }
    }
  }, [initialOrderCode, activeType, customerConvs, sellerConvs, initialSelectDone]);

  // Poll messages when conversation selected
  useEffect(() => {
    if (!selected) return;
    let active = true;
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/seller-api/shipper/chat/${selected.conversationId}/messages?type=${selected.participantType}`);
        if (res.ok && active) setMessages(await res.json());
      } catch (e) {}
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => { active = false; clearInterval(interval); };
  }, [selected]);

  // Auto-scroll
  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [selected?.conversationId, messages.length]);

  const handleSend = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || !selected) return;
    if (!text) setInput("");
    try {
      await fetch(`/seller-api/shipper/chat/${selected.conversationId}/messages?type=${selected.participantType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: msg })
      });
    } catch (e) {}
  };

  const unreadCustomers = 0;
  const unreadSellers = 0;

  return (
    <div className="flex flex-col h-full">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-gray-900" style={{fontSize:"22px"}}>Tin nhắn</h2>
          <p className="text-gray-500 text-sm mt-0.5">Liên lạc với khách hàng và quán ăn</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button onClick={() => { setActiveType("customer"); setSearch(""); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${activeType === "customer" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
            style={{fontWeight:500}}>
            <Users className="w-4 h-4" /> Khách hàng
            {unreadCustomers > 0 && <span className="px-1.5 py-0.5 rounded-full bg-blue-500 text-white text-[10px]">{unreadCustomers}</span>}
          </button>
          <button onClick={() => { setActiveType("seller"); setSearch(""); }}
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
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                <MessageSquare className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-sm">Chưa có tin nhắn</p>
              </div>
            ) : filtered.map(c => (
              <div
                key={c.conversationId}
                onClick={() => setSelectedId(c.conversationId)}
                className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors border-b border-gray-50 ${
                  selectedId === c.conversationId
                    ? activeType === "customer" ? "bg-blue-50 border-l-2 border-l-blue-500" : "bg-green-50 border-l-2 border-l-green-500"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm ${activeType === "customer" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`} style={{fontWeight:700}}>
                  {(c.participantName || "?").charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-800 truncate" style={{fontWeight:600}}>{c.participantName}</p>
                    <p className="text-xs text-gray-400 shrink-0 ml-1">{formatTime(c.lastMessageAt)}</p>
                  </div>
                  <p className="text-xs text-gray-400 mb-0.5">{activeType === "customer" ? "Khách hàng" : "Quán ăn"} • #{c.orderCode}</p>
                  <p className="text-xs text-gray-500 truncate">{c.lastMessage || "Bắt đầu cuộc trò chuyện"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        {selected ? (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Chat header */}
            <div className="px-5 py-3.5 border-b border-gray-100 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm ${activeType === "customer" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"}`} style={{fontWeight:700}}>
                {(selected.participantName || "?").charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-gray-800" style={{fontWeight:600}}>{selected.participantName}</p>
                <p className="text-xs text-gray-400">{activeType === "customer" ? "Khách hàng" : "Quán ăn"} • #{selected.orderCode}</p>
              </div>
              <div className="ml-auto">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div ref={messagesRef} className="flex-1 overflow-y-auto p-5 space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.fromMe ? "justify-end" : "justify-start"} gap-2`}>
                  {!msg.fromMe && (
                    <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-1">
                      {activeType === "customer" ? <Users className="w-3.5 h-3.5 text-gray-500" /> : <Store className="w-3.5 h-3.5 text-gray-500" />}
                    </div>
                  )}
                  <div>
                    <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                      msg.fromMe ? "bg-orange-500 text-white rounded-tr-sm" : "bg-gray-100 text-gray-800 rounded-tl-sm"
                    }`}>
                      {msg.content}
                    </div>
                    <p className={`text-xs text-gray-400 mt-1 ${msg.fromMe ? "text-right" : ""}`}>{formatTime(msg.sentAt)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick replies */}
            <div className="px-5 pb-2 flex gap-2 overflow-x-auto">
              {["Tôi đang trên đường", "Khoảng 5 phút nữa", "Tôi đã đến", "Vui lòng gọi lại"].map(q => (
                <button key={q} onClick={() => handleSend(q)}
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
              <button onClick={() => handleSend()} className="w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded-xl flex items-center justify-center transition-colors">
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
