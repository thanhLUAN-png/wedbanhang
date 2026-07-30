import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2, X, Package, Layers, RotateCcw, Trash } from "lucide-react";

function formatVND(v: number) {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(v);
}

// ── Modal quản lý danh mục ──
function ManageCategoriesModal({ 
  categories,
  onClose, 
  onAdd,
  onEdit,
  onDelete
}: { 
  categories: string[];
  onClose: () => void; 
  onAdd: (name: string) => void;
  onEdit: (oldName: string, newName: string) => void;
  onDelete: (name: string) => void;
}) {
  const [name, setName] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState("");

  const handleAdd = () => {
    if (name.trim()) {
      onAdd(name.trim());
      setName("");
    }
  };

  const handleEditSave = (oldName: string) => {
    if (editName.trim() && editName.trim() !== oldName) {
      onEdit(oldName, editName.trim());
    }
    setEditingIndex(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 text-lg">Quản lý danh mục</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Add new */}
        <div className="flex items-center gap-2 mb-6">
          <input
            type="text"
            placeholder="Thêm danh mục mới..."
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
          />
          <button
            onClick={handleAdd}
            className="p-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors shrink-0"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto min-h-[200px] pr-1">
          {categories.length === 0 ? (
            <div className="text-center text-gray-500 text-sm py-8">Chưa có danh mục nào</div>
          ) : (
            <div className="space-y-2">
              {categories.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group">
                  {editingIndex === idx ? (
                    <input
                      autoFocus
                      type="text"
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleEditSave(cat);
                        if (e.key === 'Escape') setEditingIndex(null);
                      }}
                      onBlur={() => handleEditSave(cat)}
                      className="flex-1 bg-white border border-orange-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
                    />
                  ) : (
                    <span className="text-sm font-medium text-gray-700">{cat}</span>
                  )}
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                    {editingIndex !== idx && (
                      <>
                        <button
                          onClick={() => {
                            setEditingIndex(idx);
                            setEditName(cat);
                          }}
                          className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(cat)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Modal thêm món mới ──
function AddProductModal({ onClose, type, categories, initialProduct, onSave }: { onClose: () => void; type: "single" | "combo", categories: string[], initialProduct?: any, onSave: (product: any) => void }) {
  const [toppingError, setToppingError] = useState("");
  const [form, setForm] = useState({
    name: initialProduct?.name || "", 
    category: initialProduct?.category || (categories[0] || "Cơm"), 
    price: initialProduct?.price?.toString() || "", 
    available: initialProduct?.status !== "out_of_stock", 
    description: initialProduct?.description || "", 
    image: initialProduct?.image || "",
    // Chỉ dành cho combo
    items: initialProduct?.items || [{ name: "", qty: "" }, { name: "", qty: "" }],
    // Topping
    toppings: initialProduct?.toppings || [{ name: "", price: "" }],
  });

  const isCombo = type === "combo";
  const isEditing = !!initialProduct;

  const addComboItem = () => {
    setForm(f => ({ ...f, items: [...f.items, { name: "", qty: "" }] }));
  };

  const removeComboItem = (idx: number) => {
    setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== idx) }));
  };

  const addTopping = () => {
    setForm(f => ({ ...f, toppings: [...f.toppings, { name: "", price: "" }] }));
  };

  const removeTopping = (idx: number) => {
    setForm(f => ({ ...f, toppings: f.toppings.filter((_, i) => i !== idx) }));
    setToppingError("");
  };

  const saveProduct = () => {
    // A topping is an optional row, but once the seller adds it both values are required.
    // This prevents an accidental second blank row from being saved to SQL Server.
    const enteredToppings = form.toppings.filter(t => t.name.trim() || String(t.price).replace(/\D/g, ""));
    const incompleteIndex = enteredToppings.findIndex(t => !t.name.trim() || !String(t.price).replace(/\D/g, ""));
    if (incompleteIndex >= 0) {
      setToppingError(`Topping dòng ${incompleteIndex + 1} chưa đủ tên hoặc giá. Hãy nhập đủ hoặc bấm dấu × để xoá dòng đó.`);
      return;
    }

    setToppingError("");
    onSave({
      ...initialProduct,
      ...form,
      type,
      price: Number(form.price.replace(/\D/g, "")),
      toppings: enteredToppings.map(t => ({
        name: t.name.trim(),
        price: Number(String(t.price).replace(/\D/g, "")),
      })),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`px-6 py-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-2xl`}>
          <div className="flex items-center gap-2.5">
            {isCombo ? (
              <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center">
                <Layers className="w-5 h-5 text-purple-600" />
              </div>
            ) : (
              <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-orange-500" />
              </div>
            )}
            <div>
              <h2 className="font-bold text-gray-900 text-lg">
                {isEditing ? (isCombo ? "Chỉnh sửa Combo" : "Chỉnh sửa Món") : (isCombo ? "Thêm Combo mới" : "Thêm Món mới")}
              </h2>
              <p className="text-xs text-gray-400">
                {isEditing ? "Cập nhật thông tin sản phẩm" : (isCombo ? "Tạo combo nhiều món gộp lại" : "Thêm món đơn vào thực đơn")}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Ảnh đại diện */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Ảnh {isCombo ? "combo" : "món ăn"}
            </label>
            <div className="flex items-center gap-3">
              <label className="w-24 h-24 rounded-xl bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-200 hover:border-orange-300 flex flex-col items-center justify-center shrink-0 overflow-hidden cursor-pointer transition-colors">
                <Plus className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-xs text-gray-500 font-medium">Tải ảnh</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setForm({ ...form, image: URL.createObjectURL(file) });
                    }
                  }}
                />
              </label>
              {form.image && (
                <div className="w-24 h-24 rounded-xl border border-gray-200 overflow-hidden relative group shrink-0">
                  <img src={form.image} className="w-full h-full object-cover" />
                  <button
                    onClick={() => setForm({ ...form, image: "" })}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tên & Danh mục */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tên {isCombo ? "combo" : "món ăn"} <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                placeholder={isCombo ? "VD: Combo Gia Đình" : "VD: Cơm Sườn Nướng"}
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Danh mục <span className="text-red-400">*</span>
              </label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Danh sách món trong combo */}
          {isCombo && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Món bao gồm trong combo <span className="text-red-400">*</span>
              </label>
              <div className="space-y-2">
                {form.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`Tên món ${idx + 1}`}
                      value={item.name}
                      onChange={e => {
                        const items = [...form.items];
                        items[idx].name = e.target.value;
                        setForm({ ...form, items });
                      }}
                      className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                    />
                    <input
                      type="number"
                      placeholder="SL"
                      value={item.qty}
                      onChange={e => {
                        const items = [...form.items];
                        items[idx].qty = e.target.value;
                        setForm({ ...form, items });
                      }}
                      className="w-16 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 text-center"
                    />
                    {form.items.length > 1 && (
                      <button onClick={() => removeComboItem(idx)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={addComboItem}
                className="mt-2 flex items-center gap-1.5 text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
              >
                <Plus className="w-4 h-4" /> Thêm món vào combo
              </button>
            </div>
          )}

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
            <textarea
              rows={3}
              placeholder="Mô tả ngắn về món ăn, nguyên liệu, hương vị..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 resize-none"
            />
          </div>

          {/* Giá */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Giá bán (₫) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              placeholder="VD: 55000"
              value={form.price}
              inputMode="numeric"
              onChange={e => { const raw = e.target.value.replace(/\D/g, ''); setForm({ ...form, price: raw ? new Intl.NumberFormat('vi-VN').format(Number(raw)) : '' }); }}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
            />
          </div>

          {/* Danh sách topping */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Các tuỳ chọn Topping
            </label>
            <div className="space-y-2">
              {form.toppings.map((topping, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Tên topping (VD: Thêm trứng)`}
                    value={topping.name}
                    onChange={e => {
                      const toppings = [...form.toppings];
                      toppings[idx].name = e.target.value;
                      setForm({ ...form, toppings });
                      setToppingError("");
                    }}
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                  />
                  <input
                    type="text"
                    placeholder="Giá (₫)"
                    value={topping.price}
                    inputMode="numeric"
                    onChange={e => {
                      const toppings = [...form.toppings];
                      const raw = e.target.value.replace(/\D/g, '');
                      toppings[idx].price = raw ? new Intl.NumberFormat('vi-VN').format(Number(raw)) : '';
                      setForm({ ...form, toppings });
                      setToppingError("");
                    }}
                    className="w-28 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400"
                  />
                  <button onClick={() => removeTopping(idx)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addTopping}
              className="mt-2 flex items-center gap-1.5 text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
            >
              <Plus className="w-4 h-4" /> Thêm topping
            </button>
            {toppingError && <p className="mt-2 text-sm text-red-600">{toppingError}</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl hover:border-gray-300 transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={saveProduct}
            className={`px-6 py-2.5 text-sm font-medium text-white rounded-xl transition-colors ${isCombo ? "bg-purple-500 hover:bg-purple-600" : "bg-orange-500 hover:bg-orange-600"}`}
          >
            {isEditing ? "Lưu thay đổi" : (isCombo ? "Tạo Combo" : "Thêm Món")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal Thùng rác ──
function TrashBinModal({ trashedProducts, onClose, onRestore, onDeleteForever }: {
  trashedProducts: any[];
  onClose: () => void;
  onRestore: (id: number) => void;
  onDeleteForever: (id: number) => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[80vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-red-100 rounded-xl flex items-center justify-center">
              <Trash className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Thùng rác</h2>
              <p className="text-xs text-gray-400">{trashedProducts.length} sản phẩm đã xóa</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4">
          {trashedProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-gray-400">
              <Trash className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm font-medium">Thùng rác trống</p>
            </div>
          ) : (
            <div className="space-y-3">
              {trashedProducts.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover border border-gray-200 opacity-60 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-700 truncate text-sm">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.category} &bull; {formatVND(p.price)}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => onRestore(p.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Khôi phục
                    </button>
                    <button
                      onClick={() => onDeleteForever(p.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      Xóa vĩnh viễn
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SellerProductsPage() {
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [trashedProducts, setTrashedProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [modal, setModal] = useState<null | "single" | "combo" | "category" | "trash">(null);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    fetch("/seller-api/seller/products?sellerCode=SL-BT-0001")
      .then(async response => {
        if (!response.ok) throw new Error("Không thể tải sản phẩm từ SQL Server.");
        return response.json();
      })
      .then(data => {
        const loaded = data.map((p: any) => {
          let toppings: Array<{ name: string; price: number | string }> = [];
          try {
            const parsed = JSON.parse(p.toppingsJson || "[]");
            toppings = Array.isArray(parsed)
              ? parsed.map((t: any) => ({
                  name: String(t.name || ""),
                  price: Number(t.price) > 0 ? new Intl.NumberFormat("vi-VN").format(Number(t.price)) : "",
                }))
              : [];
          } catch {
            toppings = [];
          }
          return { ...p, toppings, type: p.type || "single", image: p.image || "https://placehold.co/96x96/f3f4f6/6b7280?text=Mon" };
        });
        setProducts(loaded);
        setCategories(current => Array.from(new Set([...current, ...loaded.map((p: any) => p.category)])));
      })
      .catch(error => setSaveError(error.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch("/seller-api/seller/product-categories?sellerCode=SL-BT-0001")
      .then(r => r.ok ? r.json() : [])
      .then(rows => { if (rows.length) setCategories(rows.map((x: any) => x.name)); })
      .catch(() => {});
  }, []);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    const matchType = typeFilter === "all" || p.type === typeFilter;
    const matchCategory = categoryFilter === "all" || p.category === categoryFilter;
    return matchSearch && matchStatus && matchType && matchCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Nút Thùng rác */}
          <button
            onClick={() => setModal("trash")}
            className="relative flex items-center gap-2 bg-red-50 text-red-500 px-4 py-2.5 rounded-xl font-medium hover:bg-red-100 transition-colors text-sm"
          >
            <Trash2 className="w-4 h-4" />
            Thùng rác
            {trashedProducts.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {trashedProducts.length}
              </span>
            )}
          </button>
          {/* Quản lý danh mục */}
          <button
            onClick={() => setModal("category")}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2.5 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm"
          >
            <Layers className="w-4 h-4" /> Quản lý danh mục
          </button>
          {/* Thêm món mới */}
          <button
            onClick={() => {
              setEditingProduct(null);
              setModal("single");
            }}
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-orange-600 transition-colors text-sm shadow-sm shadow-orange-200"
          >
            <Package className="w-4 h-4" /> Thêm món mới
          </button>
          {/* Thêm combo */}
          <button
            onClick={() => {
              setEditingProduct(null);
              setModal("combo");
            }}
            className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-purple-600 transition-colors text-sm shadow-sm shadow-purple-200"
          >
            <Layers className="w-4 h-4" /> Thêm Combo
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-100 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Tìm tên món ăn, combo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full border border-gray-200 rounded-xl focus:outline-none focus:border-orange-500 text-sm"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 bg-white text-sm text-gray-600"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 bg-white text-sm text-gray-600"
          >
            <option value="all">Tất cả loại</option>
            <option value="single">Món đơn</option>
            <option value="combo">Combo</option>
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:border-orange-500 bg-white text-sm text-gray-600"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang bán</option>
            <option value="out_of_stock">Hết hàng</option>
            <option value="hidden">Đã ẩn</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-100">
                <th className="px-6 py-4 font-medium">Sản phẩm</th>
                <th className="px-6 py-4 font-medium">Danh mục</th>
                <th className="px-6 py-4 font-medium">Loại</th>
                <th className="px-6 py-4 font-medium">Giá bán</th>
                <th className="px-6 py-4 font-medium">Trạng thái</th>
                <th className="px-6 py-4 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover border border-gray-100" />
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600 font-medium text-sm">{product.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${product.type === "combo" ? "bg-purple-100 text-purple-600" : "bg-blue-50 text-blue-500"}`}>
                      {product.type === "combo" ? "🍱 Combo" : "🍽️ Món đơn"}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-orange-500">
                    {formatVND(product.price)}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={product.status}
                      onChange={e => {
                        setProducts(products.map(p => p.id === product.id ? { ...p, status: e.target.value } : p));
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border-0 cursor-pointer focus:ring-2 focus:ring-orange-200 outline-none
                        ${product.status === "active" ? "bg-green-100 text-green-700" : 
                          product.status === "out_of_stock" ? "bg-red-100 text-red-600" : 
                          "bg-gray-100 text-gray-600"}`}
                    >
                      <option value="active">Đang bán</option>
                      <option value="out_of_stock">Hết hàng</option>
                      <option value="hidden">Đã ẩn</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingProduct(product);
                          setModal(product.type as "single" | "combo");
                        }}
                        className="p-2 text-gray-400 hover:text-blue-500 bg-white border border-gray-200 rounded-lg hover:border-blue-400 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setTrashedProducts([...trashedProducts, product]);
                          setProducts(products.filter(p => p.id !== product.id));
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 bg-white border border-gray-200 rounded-lg hover:border-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {/* Modal Thùng rác */}
      {modal === "trash" && (
        <TrashBinModal
          trashedProducts={trashedProducts}
          onClose={() => setModal(null)}
          onRestore={id => {
            const item = trashedProducts.find(p => p.id === id);
            if (item) {
              setProducts([...products, item]);
              setTrashedProducts(trashedProducts.filter(p => p.id !== id));
            }
          }}
          onDeleteForever={id => {
            setTrashedProducts(trashedProducts.filter(p => p.id !== id));
          }}
        />
      )}
      {modal === "category" && (
        <ManageCategoriesModal
          categories={categories}
          onClose={() => setModal(null)}
          onAdd={name => {
            if (categories.includes(name)) return;
            fetch("/seller-api/seller/product-categories?sellerCode=SL-BT-0001", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) })
              .then(r => { if (!r.ok) throw new Error(); setCategories(current => [...current, name]); })
              .catch(() => setSaveError("Không thể lưu danh mục vào SQL Server."));
          }}
          onEdit={(oldName, newName) => {
            if (categories.includes(newName)) return;
            setCategories(categories.map(c => c === oldName ? newName : c));
          }}
          onDelete={name => {
            fetch("/seller-api/seller/product-categories/trash-by-name?sellerCode=SL-BT-0001", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) })
              .then(r => { if (!r.ok) throw new Error(); setCategories(current => current.filter(c => c !== name)); })
              .catch(() => setSaveError("Không thể chuyển danh mục vào thùng rác."));
          }}
        />
      )}
      {(modal === "single" || modal === "combo") && (
        <AddProductModal 
          type={modal} 
          categories={categories} 
          initialProduct={editingProduct}
          onSave={product => {
            const save = async () => {
              setSaveError("");
              try {
                const response = await fetch(editingProduct ? `/seller-api/seller/products/${editingProduct.id}?sellerCode=SL-BT-0001` : "/seller-api/seller/products?sellerCode=SL-BT-0001", {
                  method: editingProduct ? "PUT" : "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: product.name, price: product.price, category: product.category, type: product.type,
                    description: product.description, status: product.available ? "active" : "out_of_stock", toppingsJson: JSON.stringify(product.toppings || []),
                    image: product.image?.startsWith("blob:") ? null : product.image
                  })
                });
                const saved = response.status === 204 ? null : await response.json().catch(() => null);
                if (!response.ok) throw new Error(saved?.error || "Không thể lưu sản phẩm.");
                const item = { ...product, ...saved, id: editingProduct?.id || saved?.id, type: saved?.type || product.type || "single", image: saved?.image || product.image || "https://placehold.co/96x96/f3f4f6/6b7280?text=Mon" };
                setProducts(current => editingProduct ? current.map(p => p.id === editingProduct.id ? item : p) : [item, ...current]);
                setCategories(current => Array.from(new Set([...current, item.category])));
                setModal(null);
                setEditingProduct(null);
              } catch (error) {
                setSaveError(error instanceof Error ? error.message : "Không thể lưu sản phẩm.");
              }
            };
            void save();
          }}
          onClose={() => {
            setModal(null);
            setEditingProduct(null);
          }} 
        />
      )}
    </div>
  );
}
