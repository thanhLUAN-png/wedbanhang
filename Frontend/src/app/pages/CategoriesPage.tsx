import { useState } from "react";
import { Plus, Pencil, Trash2, Store, UtensilsCrossed, Search, ChevronRight, ChevronDown, Folder } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { ConfirmDialog } from "../components/shared/ConfirmDialog";
import { mockCategories, Category } from "../data/mockCategories";
import { formatVND } from "../lib/formatters";

type EditMode = "add" | "edit";
interface FormState { name: string; slug: string; parentId: string }
const emptyForm: FormState = { name: "", slug: "", parentId: "none" };

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [selectedId, setSelectedId] = useState<string | null>(null); // null means "Tất cả"
  const [dialogOpen, setDialogOpen] = useState(false);
  const [mode, setMode] = useState<EditMode>("add");
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [searchShop, setSearchShop] = useState("");
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  const toggleNode = (id: string) => setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));

  function openAdd() {
    setMode("add");
    setEditTarget(null);
    setForm(emptyForm);
    setDialogOpen(true);
  }

  function openEdit(cat: Category) {
    setMode("edit");
    setEditTarget(cat);
    setForm({ name: cat.name, slug: cat.slug, parentId: cat.parentId ?? "none" });
    setDialogOpen(true);
  }

  function handleNameChange(name: string) {
    setForm((f) => ({ ...f, name, slug: slugify(name) }));
  }

  function save() {
    if (!form.name.trim()) return;
    if (mode === "add") {
      const newCat: Category = {
        id: `C${Date.now()}`,
        name: form.name,
        slug: form.slug || slugify(form.name),
        icon: "🍽️",
        parentId: null,
        itemCount: 0,
        shops: [],
      };
      setCategories((prev) => [...prev, newCat]);
      toast.success(`Đã thêm danh mục "${form.name}"`);
    } else if (editTarget) {
      setCategories((prev) =>
        prev.map((c) => c.id === editTarget.id ? { ...c, name: form.name, slug: form.slug } : c)
      );
      toast.success(`Đã cập nhật danh mục "${form.name}"`);
    }
    setDialogOpen(false);
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setCategories((prev) => prev.filter((c) => c.id !== deleteTarget.id));
    if (selectedId === deleteTarget.id) {
      setSelectedId(null);
    }
    toast.error(`Đã xóa danh mục "${deleteTarget.name}"`);
    setDeleteTarget(null);
  }

  const displayCategories = selectedId === null 
    ? categories 
    : categories.filter(c => c.id === selectedId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Quản lý Danh mục</h1>
          <p className="text-muted-foreground text-sm mt-1">Danh mục món ăn và các quán đã đăng ký</p>
        </div>
        <Button className="gap-2 shrink-0" onClick={openAdd}>
          <Plus className="h-4 w-4" />
          Thêm danh mục
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { label: "Tổng danh mục", value: categories.length },
          { label: "Tổng quán ăn",  value: categories.reduce((s, c) => s + (c.shops?.length ?? 0), 0) },
          { label: "Tổng món ăn",   value: categories.reduce((s, c) => s + (c.shops?.reduce((ss, sh) => ss + sh.items.length, 0) ?? 0), 0) },
        ].map((s) => (
          <Card key={s.label} className="bg-white">
            <CardContent className="pt-4 pb-3">
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category Tabs */}
      <Card className="bg-white">
        {/* Search */}
        <div className="px-5 pt-5 pb-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm quán ăn, món ăn..."
              value={searchShop}
              onChange={(e) => setSearchShop(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Tabs value={selectedId ?? "__all__"} onValueChange={(v) => setSelectedId(v === "__all__" ? null : v)}>
          <div className="px-5 border-b border-slate-100">
            <TabsList className="bg-slate-100 flex-wrap h-auto gap-1">
              <TabsTrigger value="__all__">Tất cả</TabsTrigger>
              {categories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.id} className="group relative">
                  {cat.name}
                  <span className="ml-1.5 text-xs">({cat.shops?.length ?? 0})</span>
                  <div
                    className="absolute -top-2 -right-2 hidden group-hover:flex items-center gap-0.5 bg-white shadow border border-slate-100 rounded-full p-0.5 z-20"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="w-5 h-5 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 cursor-pointer" onClick={() => openEdit(cat)}>
                      <Pencil className="h-2.5 w-2.5" />
                    </div>
                    <div className="w-5 h-5 rounded-full hover:bg-red-50 flex items-center justify-center text-red-500 cursor-pointer" onClick={() => setDeleteTarget(cat)}>
                      <Trash2 className="h-2.5 w-2.5" />
                    </div>
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>
      </Card>

      {/* Main detail area */}
      <div className="space-y-8">
        {selectedId === null ? (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 font-semibold bg-slate-50 flex items-center justify-between">
              <span>Cây danh mục</span>
            </div>
            <div className="p-4 space-y-2">
              {categories.map((cat) => {
                const isCatExpanded = expandedNodes[cat.id];
                return (
                  <div key={cat.id} className="space-y-1">
                    {/* Category Node */}
                    <div 
                      className="flex items-center gap-2 py-2 px-2 hover:bg-slate-50 rounded-lg cursor-pointer text-slate-800 font-medium group"
                      onClick={() => toggleNode(cat.id)}
                    >
                      <button className="p-1 rounded-md hover:bg-slate-200 text-slate-400">
                        {isCatExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                      <Folder className="w-5 h-5 text-orange-400" />
                      <span>{cat.name}</span>
                      <span className="text-xs text-muted-foreground bg-slate-100 px-2 rounded-full ml-2">
                        {cat.shops?.length ?? 0} quán
                      </span>
                      
                      <div className="ml-auto hidden group-hover:flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <div className="w-7 h-7 rounded-full hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer" onClick={() => openEdit(cat)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </div>
                        <div className="w-7 h-7 rounded-full hover:bg-red-50 flex items-center justify-center text-red-500 cursor-pointer" onClick={() => setDeleteTarget(cat)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </div>

                    {/* Shops Node */}
                    {isCatExpanded && (
                      <div className="ml-8 pl-4 border-l-2 border-slate-100 space-y-1 mt-1">
                        {!cat.shops?.length && (
                          <div className="text-sm text-slate-400 py-1 italic">Danh mục trống</div>
                        )}
                        {cat.shops?.map(shop => {
                          const isShopExpanded = expandedNodes[`${cat.id}-${shop.shopId}`];
                          return (
                            <div key={shop.shopId} className="space-y-1">
                              <div 
                                className="flex items-center gap-2 py-1.5 px-2 hover:bg-slate-50 rounded-lg cursor-pointer text-sm text-slate-700"
                                onClick={() => toggleNode(`${cat.id}-${shop.shopId}`)}
                              >
                                <button className="p-0.5 rounded-md hover:bg-slate-200 text-slate-400">
                                  {isShopExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                                </button>
                                <Folder className="w-4 h-4 text-blue-400" />
                                <span>{shop.shopName}</span>
                                <span className="text-xs text-muted-foreground ml-2">
                                  ({shop.items.length} món)
                                </span>
                              </div>
                              
                              {/* Menu Items Node */}
                              {isShopExpanded && (
                                <div className="ml-7 pl-4 border-l-2 border-slate-100 space-y-1 mt-1 mb-2">
                                  {shop.items.map(item => (
                                    <div key={item.id} className="flex items-center gap-2 py-1.5 px-2 text-sm text-slate-600 hover:bg-slate-50 rounded-md">
                                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                      <span>{item.name}</span>
                                      <span className="text-xs font-medium text-orange-600 ml-auto">{formatVND(item.price)}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          displayCategories.map((cat) => {
            const filteredShops = cat.shops?.filter((s) => {
              const q = searchShop.toLowerCase();
              return !q || s.shopName.toLowerCase().includes(q) || s.owner.toLowerCase().includes(q) || s.items.some(i => i.name.toLowerCase().includes(q));
            });

            return (
              <div key={cat.id} className="space-y-3">
                {/* Category header */}
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cat.icon}</span>
                  <div>
                    <h2 className="font-semibold text-slate-800">{cat.name}</h2>
                    <p className="text-xs text-muted-foreground">
                      {cat.shops?.length ?? 0} quán ăn &bull; {cat.shops?.reduce((s, sh) => s + sh.items.length, 0) ?? 0} món
                    </p>
                  </div>
                </div>

                {!filteredShops?.length && (
                  <Card className="bg-white">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <UtensilsCrossed className="h-8 w-8 mb-2 opacity-30" />
                      <p className="text-sm">Chưa có quán ăn nào</p>
                    </CardContent>
                  </Card>
                )}

                {/* Shops as collapsible rows */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                  {filteredShops?.map((shop) => {
                    const isExpanded = expandedNodes[`cat-${cat.id}-${shop.shopId}`];
                    return (
                      <div key={shop.shopId}>
                        {/* Shop row — click to toggle */}
                        <button
                          className="w-full flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors text-left"
                          onClick={() => toggleNode(`cat-${cat.id}-${shop.shopId}`)}
                        >
                          <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                            <Store className="h-4 w-4 text-orange-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-slate-800">{shop.shopName}</div>
                            <div className="text-xs text-muted-foreground">Chủ quán: {shop.owner}</div>
                          </div>
                          <span className="text-xs text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full mr-2">
                            {shop.items.length} món
                          </span>
                          {isExpanded
                            ? <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
                            : <ChevronRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
                          }
                        </button>

                        {/* Items list — visible when expanded */}
                        {isExpanded && (
                          <div className="bg-slate-50 border-t border-slate-100 divide-y divide-slate-100">
                            {shop.items.map((item) => (
                              <div key={item.id} className="flex items-center gap-3 px-5 py-2.5 pl-16">
                                <div className="h-6 w-6 rounded-md bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                                  <UtensilsCrossed className="h-3 w-3 text-slate-400" />
                                </div>
                                <span className="flex-1 text-sm text-slate-600">{item.name}</span>
                                <span className="text-sm font-semibold text-orange-600">{formatVND(item.price)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }))}
      </div>

      {/* Add / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{mode === "add" ? "Thêm danh mục mới" : "Chỉnh sửa danh mục"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Tên danh mục *</Label>
              <Input placeholder="VD: Bánh Tráng" value={form.name} onChange={(e) => handleNameChange(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Slug</Label>
              <Input placeholder="vd: banh-trang" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
            <Button onClick={save} disabled={!form.name.trim()}>
              {mode === "add" ? "Thêm danh mục" : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {deleteTarget && (
        <ConfirmDialog
          open={!!deleteTarget}
          onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}
          title="Xóa danh mục?"
          description={`Bạn có chắc muốn xóa danh mục "${deleteTarget.name}"?`}
          confirmLabel="Xóa"
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
