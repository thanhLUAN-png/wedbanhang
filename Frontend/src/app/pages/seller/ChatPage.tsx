import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useLocation } from 'react-router';
import { Send, Search, MessageSquare, Users, Truck } from 'lucide-react';

interface Conversation {
  conversationId: number;
  participantName: string;
  lastMessage: string;
  lastMessageAt: string;
  participantType: string;
  orderCode?: string;
}

interface ChatMessage {
  id: number;
  content: string;
  fromMe: boolean;
  sentAt: string;
  senderType: string;
}

function formatTime(t: string) { 
  return new Date(t).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }); 
}

export default function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const initialTabFromState = location.state?.tab;
  const initialTab = initialTabFromState || (searchParams.get('tab') === 'shippers' ? 'shippers' : 'customers');
  const [activeTab, setActiveTab] = useState<'customers' | 'shippers'>(initialTab as 'customers' | 'shippers');
  const [initialSelectDone, setInitialSelectDone] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'shippers' || tab === 'customers') setActiveTab(tab);
  }, [searchParams]);

  const handleTabChange = (tab: 'customers' | 'shippers') => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // State for Customers
  const [customerConvos, setCustomerConvos] = useState<Conversation[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerInput, setCustomerInput] = useState('');

  // State for Shippers
  const [shipperConvos, setShipperConvos] = useState<Conversation[]>([]);
  const [selectedShipperId, setSelectedShipperId] = useState<number | null>(null);
  const [shipperSearch, setShipperSearch] = useState('');
  const [shipperInput, setShipperInput] = useState('');

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    const fetchConvs = async (type: 'customer' | 'shipper') => {
      try {
        const res = await fetch(`/seller-api/seller/chat/participants?type=${type}&sellerCode=SL-BT-0001`);
        if (res.ok) {
          const data = await res.json();
          if (active) {
            if (type === 'customer') setCustomerConvos(data);
            else setShipperConvos(data);
          }
        }
      } catch (e) {}
    };
    fetchConvs('customer');
    fetchConvs('shipper');
    const interval = setInterval(() => { fetchConvs('customer'); fetchConvs('shipper'); }, 3000);
    return () => { active = false; clearInterval(interval); };
  }, []);

  // Active Context
  const isCustomer = activeTab === 'customers';
  
  const convos = isCustomer ? customerConvos : shipperConvos;
  
  const selectedId = isCustomer ? selectedCustomerId : selectedShipperId;
  const setSelectedId = isCustomer ? setSelectedCustomerId : setSelectedShipperId;
  const search = isCustomer ? customerSearch : shipperSearch;
  const setSearch = isCustomer ? setCustomerSearch : setShipperSearch;
  const input = isCustomer ? customerInput : shipperInput;
  const setInput = isCustomer ? setCustomerInput : setShipperInput;

  useEffect(() => {
    if (!initialSelectDone && location.state?.orderCode && location.state?.participantType) {
      const matchConvos = location.state.participantType === 'customer' ? customerConvos : shipperConvos;
      if (matchConvos.length > 0) {
        const match = matchConvos.find(c => c.orderCode === location.state.orderCode);
        if (match) {
          if (location.state.participantType === 'customer') {
            setSelectedCustomerId(match.conversationId);
          } else {
            setSelectedShipperId(match.conversationId);
          }
          setInitialSelectDone(true);
        }
      }
    }
  }, [customerConvos, shipperConvos, location.state, initialSelectDone]);

  const filtered = convos.filter(c => !search || c.participantName?.toLowerCase().includes(search.toLowerCase()) || c.orderCode?.toLowerCase().includes(search.toLowerCase()));
  const selected = convos.find(c => c.conversationId === selectedId);

  useEffect(() => {
    if (!selected) return;
    let active = true;
    const fetchMessages = async () => {
      try {
        const res = await fetch(`/seller-api/seller/chat/${selected.conversationId}/messages?type=${selected.participantType}`);
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
    messagesEl.scrollTo({ top: messagesEl.scrollHeight, behavior: 'smooth' });
  }, [selected?.conversationId, messages.length]);

  const handleSelect = (id: number) => {
    setSelectedId(id);
  };

  const handleSend = async () => {
    if (!input.trim() || !selected) return;
    const text = input.trim();
    setInput('');
    try {
      await fetch(`/seller-api/seller/chat/${selected.conversationId}/messages?type=${selected.participantType}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text })
      });
    } catch (e) {}
  };

  const badgeColor = isCustomer ? 'bg-orange-500' : 'bg-sky-500';
  const badgeShadow = isCustomer ? 'shadow-orange-200' : 'shadow-sky-200';
  const buttonColor = isCustomer ? 'bg-orange-500 hover:bg-orange-600' : 'bg-sky-500 hover:bg-sky-600';
  const selectedBgColor = isCustomer ? 'bg-orange-50 border-orange-100' : 'bg-sky-50 border-sky-100';
  const sendBtnColor = isCustomer ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-200' : 'bg-sky-500 hover:bg-sky-600 shadow-sky-200';
  const msgBgMe = isCustomer ? 'bg-orange-500 text-white' : 'bg-sky-500 text-white';
  const textMe = isCustomer ? 'text-orange-100' : 'text-sky-100';

  const unreadCustomers = customerConvos.reduce((sum, c) => sum + c.unread, 0);
  const unreadShippers = shipperConvos.reduce((sum, c) => sum + c.unread, 0);

  return (
    <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Tin nhắn</h1>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => handleTabChange('customers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              isCustomer ? 'bg-white text-orange-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users size={16} />
            Khách hàng
            {unreadCustomers > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-orange-500 text-white text-[10px]">
                {unreadCustomers}
              </span>
            )}
          </button>
          <button
            onClick={() => handleTabChange('shippers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              !isCustomer ? 'bg-white text-sky-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Truck size={16} />
            Tài xế
            {unreadShippers > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-sky-500 text-white text-[10px]">
                {unreadShippers}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-1 min-h-[480px]">
        {/* Sidebar */}
        <div className="w-80 border-r border-gray-100 flex flex-col shrink-0 bg-gray-50/50">
          <div className="p-4 border-b border-gray-100 bg-white">
            <div className="relative">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder={`Tìm kiếm ${isCustomer ? 'khách hàng' : 'tài xế'}...`}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filtered.map(c => (
              <button key={c.conversationId} onClick={() => handleSelect(c.conversationId)}
                className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-colors ${
                  selectedId === c.conversationId ? `${selectedBgColor} border` : 'hover:bg-white border border-transparent'
                }`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0 ${badgeColor} shadow-sm ${badgeShadow}`}>
                  {(c.participantName || "?").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-gray-900 truncate">{c.participantName}</span>
                      {c.orderCode && (
                        <span className="text-xs font-mono font-bold text-gray-500 tracking-wider mt-0.5">#{c.orderCode}</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 ml-2 shrink-0 self-start mt-0.5">{formatTime(c.lastMessageAt)}</span>
                  </div>
                  <div className="text-sm truncate mt-0.5 text-gray-500">
                    {c.lastMessage}
                  </div>
                </div>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                Không tìm thấy {isCustomer ? 'khách hàng' : 'tài xế'}
              </div>
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col bg-white">
          {selected ? (
            <>
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4 bg-white">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${badgeColor} text-white`}>
                  {(selected.participantName || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-base font-bold text-gray-900">{selected.participantName}</div>
                    {selected.orderCode && (
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-800 text-sm font-mono font-bold tracking-wider">
                        #{selected.orderCode}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-green-500 font-medium flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> Đang hoạt động
                  </div>
                </div>
              </div>

              <div ref={messagesRef} className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                      msg.fromMe ? `${msgBgMe} rounded-br-sm` : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                    }`}>
                      <p className="leading-relaxed">{msg.content}</p>
                      <p className={`text-xs mt-1 text-right ${msg.fromMe ? textMe : 'text-gray-400'}`}>{formatTime(msg.sentAt)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-gray-100 flex items-center gap-3 bg-white">
                <input value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-5 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors" />
                <button onClick={handleSend}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-white transition-colors shrink-0 shadow-sm ${sendBtnColor}`}>
                  <Send size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 bg-gray-50/50">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare size={32} className="text-gray-400" />
                </div>
                <p className="text-base font-medium text-gray-600">Chọn một cuộc trò chuyện để bắt đầu</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
