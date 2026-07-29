import { useState } from "react";
import { DollarSign, ArrowUpRight, ArrowDownLeft, Wallet, CreditCard, RefreshCw, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Order } from "./types";

interface Transaction {
  id: string;
  type: "earn" | "cod_received" | "cod_transfer" | "withdraw";
  label: string;
  amount: number;
  date: string;
  orderCode?: string;
  occurredAt: string;
}

interface WalletPageProps {
  orders: Order[];
}

const dateOffset = (daysAgo: number, hour = 12) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hour, 0, 0, 0);
  return date;
};

const demoTransaction = (transaction: Omit<Transaction, "date" | "occurredAt">, daysAgo: number, hour?: number): Transaction => {
  const occurredAt = dateOffset(daysAgo, hour);
  return { ...transaction, occurredAt: occurredAt.toISOString(), date: occurredAt.toLocaleString("vi-VN") };
};

const initialTransactions: Transaction[] = [
  demoTransaction({ id: "t1", type: "earn", label: "Phí ship đơn hôm nay", amount: 18000 }, 0, 11),
  demoTransaction({ id: "cod1", type: "cod_received", label: "Đã thu COD - đơn #SN-DEMO-001", amount: 150000 }, 0, 11),
  demoTransaction({ id: "cod2", type: "cod_transfer", label: "Đã hoàn COD về quán - #SN-DEMO-001", amount: -150000 }, 0, 12),
  demoTransaction({ id: "t2", type: "earn", label: "Phí ship đơn hôm qua", amount: 25000 }, 1, 18),
  demoTransaction({ id: "cod3", type: "cod_received", label: "Đã thu COD - đơn #SN-DEMO-002", amount: 220000 }, 1, 18),
  demoTransaction({ id: "cod4", type: "cod_transfer", label: "Đã hoàn COD về quán - #SN-DEMO-002", amount: -220000 }, 1, 19),
  demoTransaction({ id: "t3", type: "earn", label: "Phí ship đơn 3 ngày trước", amount: 22000 }, 3, 12),
  demoTransaction({ id: "cod5", type: "cod_received", label: "Đã thu COD - đơn #SN-DEMO-003", amount: 98000 }, 3, 12),
  demoTransaction({ id: "cod6", type: "cod_transfer", label: "Đã hoàn COD về quán - #SN-DEMO-003", amount: -98000 }, 3, 13),
  demoTransaction({ id: "t8", type: "earn", label: "Phí ship - đơn #SN-DEMO-004", amount: 32000 }, 5, 20),
  demoTransaction({ id: "cod7", type: "cod_received", label: "Đã thu COD - đơn #SN-DEMO-004", amount: 315000 }, 5, 20),
  demoTransaction({ id: "cod8", type: "cod_transfer", label: "Đã hoàn COD về quán - #SN-DEMO-004", amount: -315000 }, 5, 21),
  demoTransaction({ id: "t9", type: "earn", label: "Phí ship - đơn #SN-DEMO-005", amount: 20000 }, 6, 9),
  demoTransaction({ id: "cod9", type: "cod_received", label: "Đã thu COD - đơn #SN-DEMO-005", amount: 75000 }, 6, 9),
  demoTransaction({ id: "cod10", type: "cod_transfer", label: "Đã hoàn COD về quán - #SN-DEMO-005", amount: -75000 }, 6, 10),
  demoTransaction({ id: "t4", type: "earn", label: "Phí ship đơn 8 ngày trước", amount: 30000 }, 8, 19),
  demoTransaction({ id: "t10", type: "earn", label: "Phí ship - đơn #SN-DEMO-006", amount: 24000 }, 12, 12),
  demoTransaction({ id: "cod11", type: "cod_received", label: "Đã thu COD - đơn #SN-DEMO-006", amount: 185000 }, 12, 12),
  demoTransaction({ id: "cod12", type: "cod_transfer", label: "Đã hoàn COD về quán - #SN-DEMO-006", amount: -185000 }, 12, 13),
  demoTransaction({ id: "t11", type: "earn", label: "Phí ship - đơn #SN-DEMO-007", amount: 28000 }, 18, 18),
  demoTransaction({ id: "cod13", type: "cod_received", label: "Đã thu COD - đơn #SN-DEMO-007", amount: 242000 }, 18, 18),
  demoTransaction({ id: "cod14", type: "cod_transfer", label: "Đã hoàn COD về quán - #SN-DEMO-007", amount: -242000 }, 18, 19),
  demoTransaction({ id: "t12", type: "earn", label: "Phí ship - đơn #SN-DEMO-008", amount: 35000 }, 25, 11),
  demoTransaction({ id: "w2", type: "withdraw", label: "Rút tiền về ngân hàng", amount: -100000 }, 20, 20),
  demoTransaction({ id: "t5", type: "earn", label: "Phí ship đơn tháng trước", amount: 20000 }, 45, 13),
  demoTransaction({ id: "t13", type: "earn", label: "Phí ship - đơn #SN-DEMO-009", amount: 26000 }, 60, 17),
  demoTransaction({ id: "cod15", type: "cod_received", label: "Đã thu COD - đơn #SN-DEMO-009", amount: 126000 }, 60, 17),
  demoTransaction({ id: "cod16", type: "cod_transfer", label: "Đã hoàn COD về quán - #SN-DEMO-009", amount: -126000 }, 60, 18),
  demoTransaction({ id: "t14", type: "earn", label: "Phí ship - đơn #SN-DEMO-010", amount: 30000 }, 90, 10),
  demoTransaction({ id: "w3", type: "withdraw", label: "Rút tiền về ngân hàng", amount: -75000 }, 75, 21),
  demoTransaction({ id: "t6", type: "earn", label: "Phí ship đơn đầu năm", amount: 28000 }, 180, 10),
  demoTransaction({ id: "t15", type: "earn", label: "Phí ship - đơn #SN-DEMO-011", amount: 22000 }, 270, 16),
  demoTransaction({ id: "t7", type: "withdraw", label: "Rút tiền về ngân hàng", amount: -50000 }, 2, 20),
];

const typeConfig: Record<string, { icon: React.ReactNode; label: string; color: string; bg: string; dot: string }> = {
  earn:         { icon: <DollarSign className="w-4 h-4" />,      label: "Phí ship",       color: "text-green-700",  bg: "bg-green-50",  dot: "bg-green-400" },
  cod_received: { icon: <ArrowDownLeft className="w-4 h-4" />,   label: "Thu COD",        color: "text-blue-700",   bg: "bg-blue-50",   dot: "bg-blue-400" },
  cod_transfer: { icon: <ArrowUpRight className="w-4 h-4" />,    label: "Chuyển COD",     color: "text-orange-700", bg: "bg-orange-50", dot: "bg-orange-400" },
  withdraw:     { icon: <CreditCard className="w-4 h-4" />,      label: "Rút tiền",       color: "text-purple-700", bg: "bg-purple-50", dot: "bg-purple-400" },
};

export function WalletPage({ orders }: WalletPageProps) {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    [...initialTransactions].sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime())
  );
  const [filter, setFilter] = useState<"all" | "earn" | "cod" | "withdraw">("all");
  const [action, setAction] = useState<"withdraw" | "cod_transfer" | null>(null);
  const [amount, setAmount] = useState("");
  const [feePeriod, setFeePeriod] = useState<"today" | "week" | "month" | "year">("today");
  const periodDays = feePeriod === "today" ? 1 : feePeriod === "week" ? 7 : feePeriod === "month" ? 30 : 365;
  const periodStart = new Date();
  periodStart.setDate(periodStart.getDate() - periodDays + 1);
  periodStart.setHours(0, 0, 0, 0);
  const totalEarned = transactions.filter(t => t.type === "earn" && new Date(t.occurredAt) >= periodStart).reduce((s, t) => s + t.amount, 0);
  const activeCodOrders = orders.filter(order => ["accepted", "picked", "delivering"].includes(order.status) && order.cod > 0);
  const codHeld = activeCodOrders.reduce((sum, order) => sum + order.cod, 0);
  const balance      = transactions.filter(t => t.type === "earn" || t.type === "withdraw").reduce((s, t) => s + t.amount, 0);
  const filteredTransactions = transactions.filter(transaction => {
    if (filter === "all") return true;
    if (filter === "cod") return transaction.type === "cod_received" || transaction.type === "cod_transfer";
    return transaction.type === filter;
  });

  const openAction = (nextAction: "withdraw" | "cod_transfer") => {
    const maximum = nextAction === "withdraw" ? balance : codHeld;
    if (maximum <= 0) {
      toast.error(nextAction === "withdraw" ? "Số dư hiện không đủ để rút" : "Không có tiền COD cần chuyển");
      return;
    }
    setAction(nextAction);
    setAmount(String(maximum));
  };

  const handleConfirmAction = () => {
    if (!action) return;
    const parsedAmount = Number(amount);
    const maximum = action === "withdraw" ? balance : codHeld;
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0 || parsedAmount > maximum) {
      toast.error(`Số tiền phải từ 1đ đến ${maximum.toLocaleString("vi-VN")}đ`);
      return;
    }

    const isWithdraw = action === "withdraw";
    const transaction: Transaction = {
      id: `demo-${Date.now()}`,
      type: action,
      label: isWithdraw ? "Rút tiền về ngân hàng (demo)" : "Chuyển COD về quán (demo)",
      amount: -parsedAmount,
      date: new Date().toLocaleString("vi-VN", { hour: "2-digit", minute: "2-digit", day: "2-digit", month: "2-digit", year: "numeric" }),
      occurredAt: new Date().toISOString(),
    };
    setTransactions(previous => [transaction, ...previous]);
    setAction(null);
    setAmount("");
    toast.success(isWithdraw ? "Đã tạo giao dịch rút tiền mẫu" : "Đã chuyển COD mẫu về quán");
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-gray-900" style={{fontSize:"22px"}}>Ví cá nhân</h2>
        <p className="text-gray-500 text-sm mt-0.5">Quản lý thu nhập và tiền thu hộ (COD)</p>
      </div>

      {/* Top cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-1 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white">
          <div className="flex items-center gap-2 mb-3 opacity-80">
            <Wallet className="w-5 h-5" />
            <p className="text-sm">Số dư khả dụng</p>
          </div>
          <p style={{fontWeight:700, fontSize:"30px"}}>{balance.toLocaleString("vi-VN")}đ</p>
          <button onClick={() => openAction("withdraw")} className="mt-4 w-full py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm transition-colors border border-white/30" style={{fontWeight:500}}>
            Rút tiền về tài khoản
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-sm text-gray-500">Tổng phí ship nhận</p>
          </div>
          <p className="text-green-600" style={{fontWeight:700, fontSize:"24px"}}>{totalEarned.toLocaleString("vi-VN")}đ</p>
          <div className="flex flex-wrap gap-1 mt-3">
            {([['today','Hôm nay'],['week','7 ngày'],['month','30 ngày'],['year','1 năm']] as const).map(([key, label]) => (
              <button key={key} onClick={() => setFeePeriod(key)} className={`px-2 py-1 rounded-md text-[11px] ${feePeriod === key ? "bg-green-500 text-white" : "bg-gray-100 text-gray-500"}`}>{label}</button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-sm text-gray-500">Tiền COD đang giữ</p>
          </div>
          <p className="text-blue-600" style={{fontWeight:700, fontSize:"24px"}}>{codHeld.toLocaleString("vi-VN")}đ</p>
          <p className="text-gray-400 text-xs mt-1">
            {activeCodOrders.length > 0 ? `${activeCodOrders.length} đơn tiền mặt đang giao` : "Không giữ COD của đơn nào"}
          </p>
        </div>
      </div>

      {/* Cash flow example */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
        <p className="text-blue-900 text-sm mb-3" style={{fontWeight:700}}>Ví dụ dòng tiền đơn tiền mặt</p>
        <div className="grid grid-cols-4 gap-3 text-center">
          <div className="bg-white rounded-lg p-3 border border-blue-100"><p className="text-xs text-gray-500">Tiền món (COD)</p><p className="text-blue-700 mt-1" style={{fontWeight:700}}>150.000đ</p></div>
          <div className="bg-white rounded-lg p-3 border border-green-100"><p className="text-xs text-gray-500">Phí ship</p><p className="text-green-600 mt-1" style={{fontWeight:700}}>18.000đ</p></div>
          <div className="bg-white rounded-lg p-3 border border-orange-100"><p className="text-xs text-gray-500">Thu khách tiền mặt</p><p className="text-orange-600 mt-1" style={{fontWeight:700}}>168.000đ</p></div>
          <div className="bg-white rounded-lg p-3 border border-purple-100"><p className="text-xs text-gray-500">Shipper được hưởng</p><p className="text-purple-600 mt-1" style={{fontWeight:700}}>18.000đ</p></div>
        </div>
        <p className="text-xs text-blue-700 mt-3">150.000đ COD phải trả cho quán; 18.000đ phí ship được cộng vào số dư khả dụng. COD chỉ hiện khi đã nhận đơn và tự mất khỏi “COD đang giữ” khi đơn kết thúc.</p>
      </div>

      {/* Transaction table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex-1">
        <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-gray-800" style={{fontSize:"15px"}}>Lịch sử giao dịch</h3>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {([['all','Tất cả'],['earn','Phí ship'],['cod','COD'],['withdraw','Rút tiền']] as const).map(([key, label]) => (
              <button key={key} onClick={() => setFilter(key)} className={`px-3 py-1 rounded-md text-xs transition-all ${filter === key ? "bg-white text-orange-600 shadow" : "text-gray-500 hover:bg-white"}`}>{label}</button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          <div className="grid grid-cols-12 gap-4 px-5 py-2.5 text-xs text-gray-400 uppercase tracking-wide bg-gray-50" style={{fontWeight:600}}>
            <div className="col-span-5">Mô tả</div>
            <div className="col-span-2">Loại</div>
            <div className="col-span-3">Thời gian</div>
            <div className="col-span-2 text-right">Số tiền</div>
          </div>
          {filteredTransactions.map(tx => {
            const cfg = typeConfig[tx.type];
            return (
              <div key={tx.id} className="grid grid-cols-12 gap-4 px-5 py-3.5 items-center hover:bg-gray-50 transition-colors">
                <div className="col-span-5 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cfg.bg} ${cfg.color} shrink-0`}>
                    {cfg.icon}
                  </div>
                  <p className="text-sm text-gray-800">{tx.label}</p>
                </div>
                <div className="col-span-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${cfg.color} ${cfg.bg}`} style={{fontWeight:500}}>
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </span>
                </div>
                <div className="col-span-3">
                  <p className="text-sm text-gray-500">{tx.date}</p>
                </div>
                <div className="col-span-2 text-right">
                  <p className={`text-sm ${tx.amount > 0 ? "text-green-600" : "text-gray-700"}`} style={{fontWeight:600}}>
                    {tx.amount > 0 ? "+" : ""}{tx.amount.toLocaleString("vi-VN")}đ
                  </p>
                </div>
              </div>
            );
          })}
          {filteredTransactions.length === 0 && (
            <div className="py-10 text-center text-sm text-gray-400">Chưa có giao dịch thuộc nhóm này</div>
          )}
        </div>
      </div>

      {action && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg text-gray-900 mb-1" style={{fontWeight:700}}>
              {action === "withdraw" ? "Rút tiền về ngân hàng" : "Chuyển COD về quán"}
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Khả dụng: {(action === "withdraw" ? balance : codHeld).toLocaleString("vi-VN")}đ
            </p>
            <label className="block text-sm text-gray-700 mb-1.5" style={{fontWeight:500}}>Số tiền</label>
            <div className="relative mb-5">
              <input
                autoFocus
                type="number"
                min="1"
                value={amount}
                onChange={event => setAmount(event.target.value)}
                className="w-full px-4 py-3 pr-10 border border-gray-200 rounded-xl text-lg focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">đ</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setAction(null); setAmount(""); }} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Đóng</button>
              <button onClick={handleConfirmAction} className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm" style={{fontWeight:600}}>
                Xác nhận
              </button>
            </div>
            <p className="text-xs text-center text-gray-400 mt-3">Giao dịch mẫu phục vụ kiểm thử giao diện</p>
          </div>
        </div>
      )}
    </div>
  );
}
