import { useState, useRef, useEffect } from "react";
import { Send, Search, Phone, MoreVertical, ArrowLeft } from "lucide-react";

interface Message {
  id: number;
  text: string;
  fromMe: boolean;
  time: string;
}

interface Conversation {
  id: string;
  shopName: string;
  shopAvatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  messages: Message[];
}

const conversations: Conversation[] = [
  {
    id: "c1", shopName: "TechStore Official", shopAvatar: "https://picsum.photos/seed/shop1/80/80",
    lastMessage: "Sản phẩm này còn hàng không shop?", time: "14:30", unread: 1,
    messages: [
      { id: 1, text: "Chào shop! Mình muốn hỏi về Samsung Galaxy A54 5G", fromMe: true, time: "14:00" },
      { id: 2, text: "Chào bạn! Sản phẩm hiện đang có sẵn. Bạn cần tư vấn thêm không?", fromMe: false, time: "14:05" },
      { id: 3, text: "Cho mình hỏi màu đen còn không ạ?", fromMe: true, time: "14:20" },
      { id: 4, text: "Dạ màu đen đang còn hàng bạn nhé! Bạn muốn đặt ngay không?", fromMe: false, time: "14:30" },
    ],
  },
  {
    id: "c2", shopName: "Beauty World", shopAvatar: "https://picsum.photos/seed/shop3/80/80",
    lastMessage: "Cảm ơn bạn đã tin tưởng shop!", time: "Hôm qua", unread: 0,
    messages: [
      { id: 1, text: "Shop ơi sản phẩm Neutrogena có phải hàng chính hãng không?", fromMe: true, time: "09:00" },
      { id: 2, text: "Dạ 100% hàng chính hãng bạn nhé, có tem phụ và hóa đơn VAT đầy đủ.", fromMe: false, time: "09:10" },
      { id: 3, text: "Ok cảm ơn shop, mình đặt ngay đây!", fromMe: true, time: "09:15" },
      { id: 4, text: "Cảm ơn bạn đã tin tưởng shop! Mình sẽ đóng gói cẩn thận và giao nhanh nhé.", fromMe: false, time: "09:20" },
    ],
  },
  {
    id: "c3", shopName: "Fashion House VN", shopAvatar: "https://picsum.photos/seed/shop2/80/80",
    lastMessage: "Size L thì hợp với cân 65kg không shop?", time: "2 ngày", unread: 2,
    messages: [
      { id: 1, text: "Shop ơi cho hỏi áo Polo size L thì hợp với cân 65kg không?", fromMe: true, time: "10:00" },
      { id: 2, text: "Dạ cân 65kg mặc size L hơi rộng một chút, shop recommend size M bạn nhé!", fromMe: false, time: "10:15" },
    ],
  },
];

function formatTime(t: string) { return t; }

export default function ChatPage() {
  const [selected, setSelected] = useState<Conversation | null>(null);
  const [message, setMessage] = useState("");
  const [convs, setConvs] = useState(conversations);
  const [search, setSearch] = useState("");
  const [showList, setShowList] = useState(true);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messagesEl = messagesRef.current;
    if (!selected || !messagesEl) return;

    messagesEl.scrollTo({
      top: messagesEl.scrollHeight,
      behavior: "smooth",
    });
  }, [selected?.id, selected?.messages.length]);

  function sendMessage() {
    if (!message.trim() || !selected) return;
    const newMsg: Message = { id: Date.now(), text: message.trim(), fromMe: true, time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) };
    setConvs(prev => prev.map(c => c.id === selected.id ? { ...c, messages: [...c.messages, newMsg], lastMessage: message.trim(), time: newMsg.time } : c));
    setSelected(prev => prev ? { ...prev, messages: [...prev.messages, newMsg] } : prev);
    setMessage("");

    setTimeout(() => {
      const reply: Message = { id: Date.now() + 1, text: "Shop đang xử lý yêu cầu của bạn, vui lòng chờ trong giây lát nhé! 😊", fromMe: false, time: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }) };
      setConvs(prev => prev.map(c => c.id === selected.id ? { ...c, messages: [...c.messages, reply], lastMessage: reply.text, time: reply.time } : c));
      setSelected(prev => prev ? { ...prev, messages: [...prev.messages, reply] } : prev);
    }, 1000);
  }

  const filteredConvs = convs.filter(c => c.shopName.toLowerCase().includes(search.toLowerCase()));

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
                <button key={c.id} onClick={() => { setSelected(c); setShowList(false); }} className={`w-full flex gap-3 items-center px-4 py-3.5 hover:bg-orange-50 transition-colors border-b border-gray-50 text-left ${selected?.id === c.id ? "bg-orange-50" : ""}`}>
                  <div className="relative shrink-0">
                    <img src={c.shopAvatar} alt="" className="w-11 h-11 rounded-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/44x44/f97316/fff?text=S"; }} />
                    {c.unread > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">{c.unread}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-800 truncate">{c.shopName}</span>
                      <span className="text-xs text-gray-400 shrink-0 ml-1">{c.time}</span>
                    </div>
                    <div className={`text-xs mt-0.5 truncate ${c.unread > 0 ? "text-gray-800 font-medium" : "text-gray-400"}`}>{c.lastMessage}</div>
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
                  <img src={selected.shopAvatar} alt="" className="w-9 h-9 rounded-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/36x36/f97316/fff?text=S"; }} />
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-900">{selected.shopName}</div>
                    <div className="text-xs text-green-500">Đang hoạt động</div>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><Phone className="h-4 w-4 text-gray-500" /></button>
                    <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><MoreVertical className="h-4 w-4 text-gray-500" /></button>
                  </div>
                </div>

                {/* Messages */}
                <div ref={messagesRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
                  {selected.messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}>
                      {!msg.fromMe && (
                        <img src={selected.shopAvatar} alt="" className="w-7 h-7 rounded-full object-cover mr-2 shrink-0 self-end" onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/28x28/f97316/fff?text=S"; }} />
                      )}
                      <div className={`max-w-[75%] ${msg.fromMe ? "order-1" : ""}`}>
                        <div className={`px-4 py-2.5 rounded-2xl text-sm ${msg.fromMe ? "bg-orange-500 text-white rounded-br-sm" : "bg-white text-gray-800 rounded-bl-sm shadow-sm"}`}>
                          {msg.text}
                        </div>
                        <div className={`text-[10px] text-gray-400 mt-1 ${msg.fromMe ? "text-right" : ""}`}>{msg.time}</div>
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
