import { useEffect, useState } from 'react';
import { Promotion } from '../../data/mockSellerData';
import { Plus, Edit2, Trash2, X, Tag, Copy, Check } from 'lucide-react';

type StatusFilter = 'all' | 'active' | 'expired' | 'upcoming';

const emptyForm = {
  code: '', discount: '', discountType: 'percent' as const,
  minOrder: '', maxDiscount: '', usageLimit: '',
  startDate: '', endDate: '', description: '',
};

function formatVND(v: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);
}

export default function PromotionsPage() {
  const [promos, setPromos] = useState<Promotion[]>([]);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const loadPromotions = () => fetch('/seller-api/seller/promotions?sellerCode=SL-BT-0001').then(r => r.json()).then(items => setPromos(items.map((p: any) => ({ id: String(p.id), code: p.code, discount: p.discount, discountType: p.discountType, minOrder: p.minOrder, maxDiscount: p.maxDiscount, usageLimit: p.usageLimit, usedCount: p.usedCount, startDate: p.startAt.slice(0,10), endDate: p.endAt.slice(0,10), description: p.description, status: new Date(p.endAt) < new Date() ? 'expired' : new Date(p.startAt) > new Date() ? 'upcoming' : 'active' }))));
  useEffect(() => { loadPromotions(); }, []);

  const filtered = promos.filter(p => filter === 'all' || p.status === filter);

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (p: Promotion) => {
    setForm({
      code: p.code, discount: String(p.discount), discountType: p.discountType,
      minOrder: String(p.minOrder), maxDiscount: String(p.maxDiscount),
      usageLimit: String(p.usageLimit), startDate: p.startDate,
      endDate: p.endDate, description: p.description,
    });
    setEditId(p.id);
    setShowModal(true);
  };

  const getStatus = (start: string, end: string): Promotion['status'] => {
    const now = new Date();
    if (new Date(start) > now) return 'upcoming';
    if (new Date(end) < now) return 'expired';
    return 'active';
  };

  const handleSave = async () => {
    if (!form.code.trim() || !form.discount) return;
    const status = getStatus(form.startDate, form.endDate);
    if (editId) {
      setPromos(prev => prev.map(p => p.id === editId ? {
        ...p, code: form.code.toUpperCase(), discount: Number(form.discount),
        discountType: form.discountType, minOrder: Number(form.minOrder),
        maxDiscount: Number(form.maxDiscount), usageLimit: Number(form.usageLimit),
        startDate: form.startDate, endDate: form.endDate, description: form.description, status,
      } : p));
    } else {
      await fetch('/seller-api/seller/promotions?sellerCode=SL-BT-0001', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: form.code, title: form.code, description: form.description, discountType: form.discountType, discount: Number(form.discount), minOrder: Number(form.minOrder), maxDiscount: Number(form.maxDiscount), usageLimit: Number(form.usageLimit), startAt: form.startDate, endAt: form.endDate }) });
      loadPromotions();
    }
    setShowModal(false);
  };

  const handleDelete = async () => {
    if (deleteId) { await fetch(`/seller-api/seller/promotions/${deleteId}/trash?sellerCode=SL-BT-0001`, { method: 'PUT' }); loadPromotions(); }
    setDeleteId(null);
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const statusConfig = {
    active: { text: 'Đang diễn ra', color: 'text-green-700', bg: 'bg-green-100' },
    expired: { text: 'Đã hết hạn', color: 'text-gray-600', bg: 'bg-gray-100' },
    upcoming: { text: 'Sắp diễn ra', color: 'text-blue-700', bg: 'bg-blue-100' },
  };

  const counts = { all: promos.length, active: 0, expired: 0, upcoming: 0 };
  promos.forEach(p => { counts[p.status] = (counts[p.status] || 0) + 1; });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý khuyến mãi</h1>
        <div className="flex items-center gap-2">
        <button onClick={() => window.alert('Thùng rác: mã đã xóa được giữ 30 ngày để khôi phục.')}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors">
          <Trash2 size={18} /> Thùng rác
        </button>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200">
          <Plus size={18} />
          Tạo mã giảm giá mới
        </button></div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 bg-white rounded-xl p-2 w-fit border border-gray-200 shadow-sm overflow-x-auto max-w-full">
        {([['all', 'Tất cả'], ['active', 'Đang diễn ra'], ['upcoming', 'Sắp diễn ra'], ['expired', 'Đã hết hạn']] as [StatusFilter, string][]).map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              filter === k ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50'
            }`}>
            {l} <span className="ml-1 opacity-60">({counts[k]})</span>
          </button>
        ))}
      </div>

      {/* Promo cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100 border-dashed">
            <Tag size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-base text-gray-500">Không có mã khuyến mãi nào</p>
          </div>
        ) : filtered.map(p => {
          const s = statusConfig[p.status];
          const usagePercent = Math.round((p.usedCount / p.usageLimit) * 100);
          return (
            <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
              <div className="flex items-start justify-between mb-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 rounded-lg border-2 border-dashed border-orange-500 bg-orange-50 font-mono text-base font-bold text-orange-600">
                    {p.code}
                  </div>
                  <button onClick={() => copyCode(p.code)}
                    className="p-2 text-gray-400 hover:text-orange-500 rounded-lg hover:bg-orange-50 transition-colors" title="Copy mã">
                    {copied === p.code ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                  </button>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${s.color} ${s.bg}`}>
                  {s.text}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-5 line-clamp-2 min-h-[40px]">{p.description}</p>

              <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-gray-700 mb-5 flex-1">
                <div>
                  <span className="text-gray-500 block text-xs mb-0.5">Giảm giá:</span>
                  <span className="font-bold text-orange-600">
                    {p.discountType === 'percent' ? `${p.discount}%` : formatVND(p.discount)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs mb-0.5">Đơn tối thiểu:</span>
                  <span className="font-medium">{formatVND(p.minOrder)}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs mb-0.5">Giảm tối đa:</span>
                  <span className="font-medium">{formatVND(p.maxDiscount)}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-xs mb-0.5">Hạn sử dụng:</span>
                  <span className="font-medium">{p.endDate}</span>
                </div>
              </div>

              <div className="mb-5">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Đã dùng: <span className="font-medium text-gray-900">{p.usedCount}</span> / {p.usageLimit}</span>
                  <span className="font-medium">{usagePercent}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-orange-500 transition-all" style={{ width: `${usagePercent}%` }} />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-100 mt-auto">
                <button onClick={() => openEdit(p)}
                  className="flex items-center gap-2 flex-1 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl text-sm hover:bg-gray-50 justify-center transition-colors">
                  <Edit2 size={16} className="text-gray-400" /> Sửa
                </button>
                <button onClick={() => setDeleteId(p.id)}
                  className="flex items-center gap-2 flex-1 py-2.5 border border-red-100 text-red-600 font-medium bg-red-50 rounded-xl text-sm hover:bg-red-100 justify-center transition-colors">
                  <Trash2 size={16} /> Xóa
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create/Edit modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">{editId ? 'Sửa mã giảm giá' : 'Tạo mã giảm giá mới'}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"><X size={20} /></button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mã giảm giá <span className="text-red-500">*</span></label>
                <input value={form.code} onChange={e => update('code', e.target.value.toUpperCase())} placeholder="VD: SIEUSALE"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-base font-mono bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 uppercase transition-colors" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Loại giảm giá</label>
                  <select value={form.discountType} onChange={e => update('discountType', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors">
                    <option value="percent">Phần trăm (%)</option>
                    <option value="fixed">Số tiền cố định (đ)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Giá trị giảm <span className="text-red-500">*</span></label>
                  <input type="number" value={form.discount} onChange={e => update('discount', e.target.value)}
                    placeholder={form.discountType === 'percent' ? 'VD: 15' : 'VD: 30000'}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Đơn tối thiểu (đ)</label>
                  <input type="number" value={form.minOrder} onChange={e => update('minOrder', e.target.value)} placeholder="VD: 150000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Giảm tối đa (đ)</label>
                  <input type="number" value={form.maxDiscount} onChange={e => update('maxDiscount', e.target.value)} placeholder="VD: 50000"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Giới hạn số lượt sử dụng</label>
                <input type="number" value={form.usageLimit} onChange={e => update('usageLimit', e.target.value)} placeholder="VD: 500"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày bắt đầu</label>
                  <input type="date" value={form.startDate} onChange={e => update('startDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ngày kết thúc</label>
                  <input type="date" value={form.endDate} onChange={e => update('endDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả chương trình</label>
                <textarea value={form.description} onChange={e => update('description', e.target.value)} placeholder="Nhập mô tả cho khách hàng dễ hiểu..." rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors resize-none" />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => setShowModal(false)}
                className="flex-1 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl text-base hover:bg-gray-50 transition-colors">Hủy</button>
              <button onClick={handleSave}
                className="flex-1 py-3 bg-orange-500 text-white font-medium rounded-xl text-base hover:bg-orange-600 transition-colors shadow-sm shadow-orange-200">
                {editId ? 'Lưu cập nhật' : 'Tạo mã mới'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
              <Trash2 size={32} className="text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Xóa mã giảm giá?</h3>
            <p className="text-base text-gray-500 mb-8">Bạn có chắc chắn muốn xóa mã này? Thao tác này không thể hoàn tác.</p>
            <div className="flex gap-4">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl text-base hover:bg-gray-50 transition-colors">Không</button>
              <button onClick={handleDelete}
                className="flex-1 py-3 bg-red-500 text-white font-medium rounded-xl text-base hover:bg-red-600 transition-colors shadow-sm shadow-red-200">Có, Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
