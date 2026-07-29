import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { 
  mockCustomerConversations, mockChatMessages, 
  mockShipperConversations, mockShipperMessages, 
  ChatMessage 
} from '../../data/mockSellerData';
import { Send, Search, MessageSquare, Users, Truck } from 'lucide-react';

type Conversation = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  isTemp?: boolean;
  orderCode?: string;
};

export default function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') === 'shippers' ? 'shippers' : 'customers';
  const [activeTab, setActiveTab] = useState<'customers' | 'shippers'>(initialTab);

  // Cập nhật tab nếu URL thay đổi (VD: user click từ trang Orders)
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'shippers' || tab === 'customers') {
      setActiveTab(tab);
    }
    
    const newId = searchParams.get('newId');
    const newName = searchParams.get('newName');
    const newOrderCode = searchParams.get('orderCode');
    
    if (newId && newName) {
      if (tab === 'customers') {
        setCustomerConvos(prev => {
          if (prev.find(c => c.id === newId)) return prev;
          return [{ id: newId, name: newName, orderCode: newOrderCode || undefined, lastMessage: '', time: 'Mới', unread: 0, isTemp: true }, ...prev];
        });
        setSelectedCustomerId(newId);
      } else if (tab === 'shippers') {
        setShipperConvos(prev => {
          if (prev.find(c => c.id === newId)) return prev;
          return [{ id: newId, name: newName, orderCode: newOrderCode || undefined, lastMessage: '', time: 'Mới', unread: 0, isTemp: true }, ...prev];
        });
        setSelectedShipperId(newId);
      }
    }
  }, [searchParams]);

  const handleTabChange = (tab: 'customers' | 'shippers') => {
    // Cleanup any isTemp conversations that have no messages when clicking away
    setCustomerConvos(prev => prev.filter(c => !(c.isTemp && (!customerMessages[c.id] || customerMessages[c.id].length === 0))));
    setShipperConvos(prev => prev.filter(c => !(c.isTemp && (!shipperMessages[c.id] || shipperMessages[c.id].length === 0))));
    
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  // State for Customers
  const [customerConvos, setCustomerConvos] = useState<Conversation[]>(mockCustomerConversations);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(customerConvos[0]?.id || null);
  const [customerMessages, setCustomerMessages] = useState<Record<string, ChatMessage[]>>(mockChatMessages);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerInput, setCustomerInput] = useState('');

  // State for Shippers
  const [shipperConvos, setShipperConvos] = useState<Conversation[]>(mockShipperConversations);
  const [selectedShipperId, setSelectedShipperId] = useState<string | null>(shipperConvos[0]?.id || null);
  const [shipperMessages, setShipperMessages] = useState<Record<string, ChatMessage[]>>(mockShipperMessages);
  const [shipperSearch, setShipperSearch] = useState('');
  const [shipperInput, setShipperInput] = useState('');

  useEffect(() => {
    const load = (type: 'customer' | 'shipper') => fetch(`/seller-api/seller/chat/participants?type=${type}&sellerCode=SL-BT-0001`).then(r => r.json()).then(rows => rows.map((x: any) => ({ id: x.id, name: x.name, orderCode: x.orderCode, lastMessage: x.lastMessage, time: new Date(x.lastMessageAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }), unread: 0 })));
    load('customer').then(setCustomerConvos).catch(() => setCustomerConvos([]));
    load('shipper').then(setShipperConvos).catch(() => setShipperConvos([]));
  }, []);

  // Active Context
  const isCustomer = activeTab === 'customers';
  
  const convos = isCustomer ? customerConvos : shipperConvos;
  const setConvos = isCustomer ? setCustomerConvos : setShipperConvos;
  
  const selectedId = isCustomer ? selectedCustomerId : selectedShipperId;
  const setSelectedId = isCustomer ? setSelectedCustomerId : setSelectedShipperId;
  
  const messages = isCustomer ? customerMessages : shipperMessages;
  const setMessages = isCustomer ? setCustomerMessages : setShipperMessages;
  
  const search = isCustomer ? customerSearch : shipperSearch;
  const setSearch = isCustomer ? setCustomerSearch : setShipperSearch;
  
  const input = isCustomer ? customerInput : shipperInput;
  const setInput = isCustomer ? setCustomerInput : setShipperInput;

  const filtered = convos.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()));
  const selected = convos.find(c => c.id === selectedId);
  const currentMessages = selectedId ? (messages[selectedId] || []) : [];

  const handleSelect = (id: string) => {
    // Cleanup any isTemp conversations that have no messages when clicking away
    setCustomerConvos(prev => prev.filter(c => c.id === id || !(c.isTemp && (!customerMessages[c.id] || customerMessages[c.id].length === 0))));
    setShipperConvos(prev => prev.filter(c => c.id === id || !(c.isTemp && (!shipperMessages[c.id] || shipperMessages[c.id].length === 0))));

    setSelectedId(id);
    (setConvos as any)(prev => prev.map((c: Conversation) => c.id === id ? { ...c, unread: 0 } : c));
  };

  const handleSend = () => {
    if (!input.trim() || !selectedId) return;
    const msg: ChatMessage = {
      id: `m${Date.now()}`,
      sender: 'me',
      content: input.trim(),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };
    (setMessages as any)(prev => ({ ...prev, [selectedId]: [...(prev[selectedId] || []), msg] }));
    (setConvos as any)(prev => prev.map((c: Conversation) => c.id === selectedId ? { ...c, lastMessage: input.trim(), time: 'Vừa xong', isTemp: false } : c));
    setInput('');
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
              <button key={c.id} onClick={() => handleSelect(c.id)}
                className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-colors ${
                  selectedId === c.id ? `${selectedBgColor} border` : 'hover:bg-white border border-transparent'
                }`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0 ${badgeColor} shadow-sm ${badgeShadow}`}>
                  {c.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-gray-900 truncate">{c.name}</span>
                      {c.orderCode && (
                        <span className="text-xs font-mono font-bold text-gray-500 tracking-wider mt-0.5">#{c.orderCode}</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-400 ml-2 shrink-0 self-start mt-0.5">{c.time}</span>
                  </div>
                  <div className={`text-sm truncate mt-0.5 ${c.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                    {c.lastMessage}
                  </div>
                </div>
                {c.unread > 0 && (
                  <span className={`w-5 h-5 rounded-full text-white text-xs font-medium flex items-center justify-center shrink-0 ${badgeColor} mt-3 shadow-sm ${badgeShadow}`}>
                    {c.unread}
                  </span>
                )}
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
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold ${badgeColor} shadow-sm ${badgeShadow}`}>
                  {selected.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <div className="text-base font-bold text-gray-900">{selected.name}</div>
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

              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                {currentMessages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                      msg.sender === 'me' ? `${msgBgMe} rounded-br-sm` : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                    }`}>
                      <p className="leading-relaxed">{msg.content}</p>
                      <p className={`text-xs mt-1 text-right ${msg.sender === 'me' ? textMe : 'text-gray-400'}`}>{msg.time}</p>
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
