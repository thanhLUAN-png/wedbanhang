import { useState } from 'react';
import { mockTransactions, generateMonthlyRevenue, generateDailyRevenue } from '../../data/mockSellerData';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const monthly = generateMonthlyRevenue();
const daily = generateDailyRevenue();

type Filter = 'all' | 'revenue' | 'expense';

function formatVND(v: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);
}

export default function FinancePage() {
  const [filter, setFilter] = useState<Filter>('all');

  const totalRevenue = mockTransactions.filter(t => t.type === 'revenue' && t.status === 'completed').reduce((s, t) => s + t.amount, 0);
  const totalExpense = mockTransactions.filter(t => t.type === 'expense' && t.status === 'completed').reduce((s, t) => s + t.amount, 0);
  const profit = totalRevenue - totalExpense;

  const filtered = mockTransactions.filter(t => filter === 'all' || t.type === filter);

  const summaryCards = [
    { label: 'Tổng doanh thu', value: totalRevenue, icon: TrendingUp, color: '#f97316', bg: '#fff7ed', prefix: '+' },
    { label: 'Tổng chi phí', value: totalExpense, icon: TrendingDown, color: '#ef4444', bg: '#fef2f2', prefix: '-' },
    { label: 'Lợi nhuận', value: profit, icon: DollarSign, color: '#16a34a', bg: '#f0fdf4', prefix: '' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Báo cáo tài chính</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryCards.map(({ label, value, icon: Icon, color, bg, prefix }) => (
          <div key={label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-gray-500">{label}</span>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
                <Icon size={24} style={{ color }} />
              </div>
            </div>
            <div className="text-3xl font-bold" style={{ color }}>
              {prefix}{formatVND(value)}
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-gray-400">
              <span>Tháng 7/2026</span>
            </div>
          </div>
        ))}
      </div>

      {/* Daily revenue chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Doanh thu theo ngày (30 ngày gần nhất)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={daily}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#6b7280' }} interval={4} />
            <YAxis tickFormatter={v => `${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip formatter={(v: number) => [formatVND(v), 'Doanh thu']} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Line type="monotone" dataKey="revenue" stroke="#f97316" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#f97316', stroke: '#fff', strokeWidth: 2 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly bar chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Doanh thu & Chi phí theo tháng</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#6b7280' }} />
            <YAxis tickFormatter={v => `${(v / 1000000).toFixed(0)}M`} tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip formatter={(v: number) => [formatVND(v)]} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: '10px' }} />
            <Bar dataKey="revenue" name="Doanh thu" fill="#f97316" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="Chi phí" fill="#fca5a5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Transaction table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-gray-900">Lịch sử giao dịch</h3>
          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl">
            {([['all', 'Tất cả'], ['revenue', 'Tiền vào'], ['expense', 'Tiền ra']] as [Filter, string][]).map(([k, l]) => (
              <button key={k} onClick={() => setFilter(k)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === k ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-sm text-gray-500">
                <th className="px-6 py-4 font-medium whitespace-nowrap">Mã GD</th>
                <th className="px-6 py-4 font-medium">Mô tả</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Loại</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Số tiền</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Ngày</th>
                <th className="px-6 py-4 font-medium whitespace-nowrap">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono font-medium text-gray-600">{t.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-[300px]">{t.description}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      {t.type === 'revenue' ? (
                        <><div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center"><ArrowUpRight size={14} className="text-green-600" /></div><span className="text-sm font-medium text-green-700">Thu</span></>
                      ) : (
                        <><div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center"><ArrowDownRight size={14} className="text-red-500" /></div><span className="text-sm font-medium text-red-600">Chi</span></>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold" style={{ color: t.type === 'revenue' ? '#16a34a' : '#ef4444' }}>
                    {t.type === 'revenue' ? '+' : '-'}{formatVND(t.amount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{t.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                      t.status === 'completed' ? 'bg-green-100 text-green-700' :
                      t.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-600'
                    }`}>
                      {t.status === 'completed' ? 'Hoàn thành' : t.status === 'pending' ? 'Đang xử lý' : 'Thất bại'}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">Không có giao dịch nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
