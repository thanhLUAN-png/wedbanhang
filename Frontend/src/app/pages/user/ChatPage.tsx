import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router";
import { Send, Search, Phone, MoreVertical, ArrowLeft } from "lucide-react";

interface Message {
  id: number;
  content: string;
  fromMe: boolean;
  sentAt: string;
  senderType: string;
}

interface ChatParticipant {
  conversationId: number;
  orderCode: string;
  participantName: string;
  participantType: string;
  lastMessage: string;
  lastMessageAt: string;
}

function formatTime(t: string) { 
  return new Date(t).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }); 
}

export default function ChatPage() {
  const phone = (() => { try { return JSON.parse(localStorage.getItem("user") || "{}").phone || "0901234567"; } catch { return "0901234567"; } })();
  const [selected, setSelected] = useState<ChatParticipant | null>(null);
  const [message, setMessage] = useState("");
  const [convs, setConvs] = useState<ChatParticipant[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [search, setSearch] = useState("");
  const [showList, setShowList] = useState(true);
  const messagesRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const [initialSelectDone, setInitialSelectDone] = useState(false);

  useEffect(() => {
    if (!initialSelectDone && convs.length > 0 && location.state?.orderCode && location.state?.participantType) {
      const match = convs.find(c => c.orderCode === location.state.orderCode && c.participantType === location.state.participantType);
      if (match) {
        setSelected(match);
        setShowList(false);
        setInitialSelectDone(true);
      }
    }
  }, [convs, location.state, initialSelectDone]);

  useEffect(() => {
    let active = true;
    const fetchConvs = async () => {
      try {
        const res = await fetch(`/seller-api/customer/chat/participants?phone=${phone}`);
        if (res.ok) {
          const data = await res.json();
          if (active) setConvs(data);
        }
      } catch (e) {}
    };
    fetchConvs();
    const interval = setInterval(fetchConvs, 3000);
    return () => { active = false; clearInterval(interval); };
  }, [phone]);

  useEffect(() => {
    if (!selected) return;
    let active = true;
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/seller-api/customer/chat/${selected.conversationId}/messages?type=${selected.participantType}`);
        if (res.ok) {
          const data = await res.json();
          if (active) setMessages(data);
        }
      } catch (e) {}
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => { active = false; clearInterval(interval); };
  }, [selected]);

  useEffect(() => {
    const messagesEl = messagesRef.current;
    if (!selected || !messagesEl) return;
    messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: "smooth" });
  }, [selected?.conversationId, messages.length]);

  async function sendMessage() {
    if (!message.trim() || !selected) return;
    const text = message.trim();
    setMessage("");
    try {
      await fetch(`/seller-api/customer/chat/${selected.conversationId}/messages?type=${selected.participantType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text })
      });
      // messages will update on next poll
    } catch (e) {}
  }

  const filteredConvs = convs.filter(c => c.participantName.toLowerCase().includes(search.toLowerCase()) || c.orderCode.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto px-4 py-5">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ height: "calc(100vh - 160px)", minHeight: "500px" }}>
        <div className="flex h-full">
          {/* Sidebar list */}
          <div className={`${selected && !showList ? "hidden" : "flex"} md:flex w-full md:w-72 border-r border-gray-100 flex-col shrink-0`}>
            <div className="px-4 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800 mb-3">Tin nhắn</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm kiếm..." className="w-full pl-9 pr-3 py-2 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filteredConvs.map((c) => (
                <button key={c.conversationId} onClick={() => { setSelected(c); setShowList(false); }} className={`w-full flex gap-3 items-center px-4 py-3.5 hover:bg-orange-50 transition-colors border-b border-gray-50 text-left ${selected?.conversationId === c.conversationId ? "bg-orange-50" : ""}`}>
                  <div className="relative shrink-0">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(c.participantName)}&background=f97316&color=fff`} alt="" className="w-11 h-11 rounded-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-800 truncate">{c.participantName} ({c.participantType === 'seller' ? 'Cửa hàng' : 'Tài xế'})</span>
                      <span className="text-xs text-gray-400 shrink-0 ml-1">{formatTime(c.lastMessageAt)}</span>
                    </div>
                    <div className="text-xs text-orange-500 font-medium">{c.orderCode}</div>
                    <div className="text-xs mt-0.5 truncate text-gray-500">{c.lastMessage}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat window */}
          <div className={`${!selected || showList ? "hidden" : "flex"} md:flex flex-1 flex-col`}>
            {selected ? (
              <>
                {/* Header */}
                <div className="px-4 py-3.5 border-b border-gray-100 flex items-center gap-3">
                  <button onClick={() => setShowList(true)} className="md:hidden p-1 hover:bg-gray-100 rounded-lg mr-1">
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                  </button>
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selected.participantName)}&background=f97316&color=fff`} alt="" className="w-9 h-9 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-900">{selected.participantName}</div>
                    <div className="text-xs text-gray-500">{selected.participantType === 'seller' ? 'Cửa hàng' : 'Tài xế'} • Đơn {selected.orderCode}</div>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><Phone className="h-4 w-4 text-gray-500" /></button>
                    <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><MoreVertical className="h-4 w-4 text-gray-500" /></button>
                  </div>
                </div>

                {/* Messages */}
                <div ref={messagesRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}>
                      {!msg.fromMe && (
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selected.participantName)}&background=f97316&color=fff`} alt="" className="w-7 h-7 rounded-full object-cover mr-2 shrink-0 self-end" />
                      )}
                      <div className={`max-w-[75%] ${msg.fromMe ? "order-1" : ""}`}>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm ${msg.fromMe ? "bg-orange-500 text-white rounded-br-sm" : "bg-white text-gray-800 rounded-bl-sm shadow-sm"}`}>
                          {msg.content}
                        </div>
                        <div className={`text-[10px] text-gray-400 mt-1 ${msg.fromMe ? "text-right" : ""}`}>{formatTime(msg.sentAt)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="px-4 py-3 border-t border-gray-100 bg-white">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="Nhập tin nhắn..."
                      className="flex-1 px-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                    <button onClick={sendMessage} disabled={!message.trim()} className="w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-40">
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                  <Send className="h-10 w-10 text-orange-300" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Chọn cuộc trò chuyện</h3>
                <p className="text-sm text-gray-500">Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu nhắn tin.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
