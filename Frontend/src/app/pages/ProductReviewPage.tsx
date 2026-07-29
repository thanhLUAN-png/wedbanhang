import { useState, useMemo } from "react";
import { CheckCircle, XCircle, Search, RotateCcw, ChevronDown, ChevronUp, Store } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "../components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { StatusBadge } from "../components/shared/StatusBadge";
import { mockProducts, groupProductsByShop, Product, ProductStatus } from "../data/mockProducts";
import { formatVND, formatDate } from "../lib/formatters";

export default function ProductReviewPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [search, setSearch] = useState("");
  const [rejectTarget, setRejectTarget] = useState<Product | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [expandedShops, setExpandedShops] = useState<Set<string>>(new Set(["SHOP01", "SHOP02", "SHOP03", "SHOP04", "SHOP05", "SHOP06", "SHOP07"]));

  function toggleShop(shopId: string) {
    setExpandedShops(prev => {
      const next = new Set(prev);
      if (next.has(shopId)) next.delete(shopId);
      else next.add(shopId);
      return next;
    });
  }

  function approve(id: string) {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: "approved" } : p));
    toast.success("Đã duyệt sản phẩm");
  }

  function restore(id: string) {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: "pending", rejectionReason: undefined } : p));
    toast.info("Đã hoàn lại về chờ duyệt");
  }

  function reject() {
    if (!rejectTarget || !rejectReason.trim()) return;
    setProducts(prev => prev.map(p =>
      p.id === rejectTarget.id ? { ...p, status: "rejected", rejectionReason: rejectReason } : p
    ));
    toast.error("Đã từ chối sản phẩm");
    setRejectTarget(null);
    setRejectReason("");
  }

  const filterByTab = (list: Product[], tab: ProductStatus | "all") =>
    list.filter(p => tab === "all" || p.status === tab);

  const filterBySearch = (list: Product[]) => {
    const q = search.toLowerCase();
    if (!q) return list;
    return list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.shopName.toLowerCase().includes(q) ||
      p.seller.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  };

  const counts = {
    all:      products.length,
    pending:  products.filter(p => p.status === "pending").length,
    approved: products.filter(p => p.status === "approved").length,
    rejected: products.filter(p => p.status === "rejected").length,
  };

  function ShopGroupView({ tab }: { tab: ProductStatus | "all" }) {
    const filteredProducts = filterBySearch(filterByTab(products, tab));
    const shops = useMemo(() => groupProductsByShop(filteredProducts), [filteredProducts]);

    if (shops.length === 0) {
      return (
        <div className="py-16 text-center text-muted-foreground text-sm">
          Không có sản phẩm nào
        </div>
      );
    }

    return (
      <div className="space-y-4 p-4">
        {shops.map(shop => {
          const isExpanded = expandedShops.has(shop.shopId);
          const shopCounts = {
            pending:  shop.products.filter(p => p.status === "pending").length,
            approved: shop.products.filter(p => p.status === "approved").length,
            rejected: shop.products.filter(p => p.status === "rejected").length,
          };
          return (
            <div key={shop.shopId} className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              {/* Shop header */}
              <button
                className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                onClick={() => toggleShop(shop.shopId)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={shop.shopAvatar}
                      alt={shop.shopName}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                      onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/44x44/e2e8f0/94a3b8?text=S"; }}
                    />
                    <Store className="absolute -bottom-1 -right-1 h-3.5 w-3.5 text-orange-500 bg-white rounded-full p-0.5" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm text-slate-800">{shop.shopName}</p>
                    <p className="text-xs text-muted-foreground">Chủ quán: {shop.seller} · {shop.products.length} món</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex gap-2 text-xs">
                    {shopCounts.pending  > 0 && <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 font-medium">{shopCounts.pending} chờ</span>}
                    {shopCounts.approved > 0 && <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">{shopCounts.approved} duyệt</span>}
                    {shopCounts.rejected > 0 && <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-medium">{shopCounts.rejected} từ chối</span>}
                  </div>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                </div>
              </button>

              {/* Products list */}
              {isExpanded && (
                <div className="divide-y divide-slate-100">
                  {shop.products.map(p => (
                    <div key={p.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/60 transition-colors">
                      {/* Image */}
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-100 flex-shrink-0"
                        onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/48x48/fef3c7/d97706?text=🍜"; }}
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 truncate">{p.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{p.description}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-slate-500">{p.category}</span>
                          <span className="text-xs font-semibold text-orange-600">{formatVND(p.price)}</span>
                          <span className="text-xs text-slate-400">{formatDate(p.submittedAt)}</span>
                        </div>
                        {p.status === "rejected" && p.rejectionReason && (
                          <p className="text-xs text-red-500 mt-1 line-clamp-2">
                            ⚠️ {p.rejectionReason}
                          </p>
                        )}
                      </div>

                      {/* Status */}
                      <div className="w-24 flex-shrink-0 flex justify-center">
                        <StatusBadge status={p.status} className="w-24 justify-center" />
                      </div>

                      {/* Actions */}
                      <div className="w-[200px] flex-shrink-0 flex justify-end gap-2">
                        {p.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="w-24 bg-green-600 hover:bg-green-700 text-white h-7 text-xs justify-center"
                              onClick={() => approve(p.id)}
                            >
                              <CheckCircle className="h-3.5 w-3.5 mr-1" />Duyệt
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="w-24 h-7 text-xs justify-center"
                              onClick={() => { setRejectTarget(p); setRejectReason(""); }}
                            >
                              <XCircle className="h-3.5 w-3.5 mr-1" />Từ chối
                            </Button>
                          </>
                        )}
                        {p.status === "approved" && (
                          <>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="w-24 h-7 text-xs justify-center"
                              onClick={() => { setRejectTarget(p); setRejectReason(""); }}
                            >
                              <XCircle className="h-3.5 w-3.5 mr-1" />Từ chối
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-24 h-7 text-xs border-slate-300 text-slate-600 hover:bg-slate-50 justify-center"
                              onClick={() => restore(p.id)}
                            >
                              <RotateCcw className="h-3.5 w-3.5 mr-1" />Hoàn lại
                            </Button>
                          </>
                        )}
                        {p.status === "rejected" && (
                          <>
                            <Button
                              size="sm"
                              className="w-24 bg-green-600 hover:bg-green-700 text-white h-7 text-xs justify-center"
                              onClick={() => approve(p.id)}
                            >
                              <CheckCircle className="h-3.5 w-3.5 mr-1" />Duyệt
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-24 h-7 text-xs border-orange-300 text-orange-600 hover:bg-orange-50 justify-center"
                              onClick={() => restore(p.id)}
                            >
                              <RotateCcw className="h-3.5 w-3.5 mr-1" />Hoàn lại
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Kiểm duyệt Sản phẩm</h1>
        <p className="text-muted-foreground text-sm mt-1">Xem xét và phê duyệt món ăn từ các quán</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Tổng sản phẩm", value: counts.all,      color: "text-slate-700" },
          { label: "Chờ duyệt",     value: counts.pending,  color: "text-yellow-600" },
          { label: "Đã duyệt",      value: counts.approved, color: "text-green-600" },
          { label: "Từ chối",       value: counts.rejected, color: "text-red-600" },
        ].map((s) => (
          <Card key={s.label} className="bg-white">
            <CardContent className="pt-4 pb-3">
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white">
        {/* Search */}
        <div className="px-5 pt-5 pb-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm tên món, tên quán, người bán..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Tabs defaultValue="all">
          <div className="px-5 border-b border-slate-100">
            <TabsList className="bg-slate-100">
              <TabsTrigger value="all">Tất cả ({counts.all})</TabsTrigger>
              <TabsTrigger value="pending">Chờ duyệt ({counts.pending})</TabsTrigger>
              <TabsTrigger value="approved">Đã duyệt ({counts.approved})</TabsTrigger>
              <TabsTrigger value="rejected">Từ chối ({counts.rejected})</TabsTrigger>
            </TabsList>
          </div>
          {(["all", "pending", "approved", "rejected"] as const).map(tab => (
            <TabsContent key={tab} value={tab} className="mt-0">
              <ShopGroupView tab={tab} />
            </TabsContent>
          ))}
        </Tabs>
      </Card>

      {/* Dialog từ chối */}
      <Dialog open={!!rejectTarget} onOpenChange={o => { if (!o) setRejectTarget(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối sản phẩm</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <img
                src={rejectTarget?.image}
                alt={rejectTarget?.name}
                className="w-12 h-12 rounded-lg object-cover"
                onError={e => { (e.target as HTMLImageElement).src = "https://placehold.co/48x48/fef3c7/d97706?text=🍜"; }}
              />
              <div>
                <p className="text-sm font-medium">{rejectTarget?.name}</p>
                <p className="text-xs text-muted-foreground">{rejectTarget?.shopName}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Lý do từ chối *</label>
              <Textarea
                className="mt-1.5"
                placeholder="Nhập lý do từ chối món ăn này (ảnh không rõ, giá sai, mô tả thiếu...)..."
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectTarget(null)}>Hủy</Button>
            <Button variant="destructive" onClick={reject} disabled={!rejectReason.trim()}>Xác nhận từ chối</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
