import { useState } from "react";
import { Search, MessageSquareWarning, ShoppingBag, User } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../components/ui/sheet";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { StatusBadge } from "../components/shared/StatusBadge";
import { mockComplaints, Complaint, ComplaintStatus, ComplaintType } from "../data/mockComplaints";
import { formatDate } from "../lib/formatters";

const typeLabel: Record<ComplaintType, string> = { product: "Sản phẩm", user: "Người dùng", shop: "Cửa hàng" };
const typeCls: Record<ComplaintType, string> = {
  product: "bg-orange-100 text-orange-700 border-orange-200",
  user:    "bg-blue-100 text-blue-700 border-blue-200",
  shop:    "bg-purple-100 text-purple-700 border-purple-200",
};
const TypeIcon: Record<ComplaintType, React.ComponentType<{ className?: string }>> = {
  product: ShoppingBag,
  user:    User,
  shop:    MessageSquareWarning,
};

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>(mockComplaints);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [note, setNote] = useState("");

  const filtered = complaints.filter((c) => {
    const q = search.toLowerCase();
    const matchQ = c.reporter.toLowerCase().includes(q) || c.targetName.toLowerCase().includes(q) || c.reason.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchQ && matchStatus;
  });

  function resolve(status: ComplaintStatus) {
    if (!selected) return;
    setComplaints((prev) => prev.map((c) => c.id === selected.id ? { ...c, status, resolvedNote: note } : c));
    toast.success(status === "resolved" ? "Đã giải quyết khiếu nại" : "Đã bác bỏ khiếu nại");
    setSelected(null);
    setNote("");
  }

  const counts = {
    all:      complaints.length,
    open:     complaints.filter(c => c.status === "open").length,
    resolved: complaints.filter(c => c.status === "resolved").length,
    dismissed:complaints.filter(c => c.status === "dismissed").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Khiếu nại / Báo cáo</h1>
        <p className="text-muted-foreground text-sm mt-1">Xem xét và xử lý các khiếu nại từ người dùng</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Tổng khiếu nại",    value: counts.all,       color: "text-foreground" },
          { label: "Đang chờ xử lý",    value: counts.open,      color: "text-blue-600" },
          { label: "Đã giải quyết",     value: counts.resolved,  color: "text-green-600" },
          { label: "Đã bác bỏ",         value: counts.dismissed, color: "text-gray-500" },
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
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Tìm người báo cáo, đối tượng, lý do..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả ({counts.all})</SelectItem>
                <SelectItem value="open">Đang mở ({counts.open})</SelectItem>
                <SelectItem value="resolved">Đã giải quyết ({counts.resolved})</SelectItem>
                <SelectItem value="dismissed">Bác bỏ ({counts.dismissed})</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="pl-6">Mã KN</TableHead>
                <TableHead>Người báo cáo</TableHead>
                <TableHead>Đối tượng</TableHead>
                <TableHead>Lý do</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right pr-6">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">Không tìm thấy khiếu nại nào</TableCell></TableRow>
              ) : filtered.map((c) => {
                const Icon = TypeIcon[c.targetType];
                return (
                  <TableRow key={c.id} className="hover:bg-slate-50">
                    <TableCell className="pl-6 font-mono text-sm font-medium">{c.id}</TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">{c.reporter}</div>
                      <div className="text-xs text-muted-foreground">{c.reporterEmail}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant="outline" className={`${typeCls[c.targetType]} gap-1 text-xs`}>
                          <Icon className="h-3 w-3" />
                          {typeLabel[c.targetType]}
                        </Badge>
                        <div className="text-xs text-muted-foreground max-w-[140px] truncate">{c.targetName}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm max-w-[180px] truncate">{c.reason}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(c.createdAt)}</TableCell>
                    <TableCell><StatusBadge status={c.status} /></TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => { setSelected(c); setNote(c.resolvedNote ?? ""); }}
                      >
                        Xem chi tiết
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail sheet */}
      <Sheet open={!!selected} onOpenChange={(o) => { if (!o) setSelected(null); }}>
        <SheetContent className="w-[480px] sm:max-w-[480px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Chi tiết khiếu nại {selected?.id}</SheetTitle>
          </SheetHeader>
          {selected && (
            <div className="mt-6 space-y-5">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Thông tin người báo cáo</p>
                <p className="text-sm font-medium">{selected.reporter}</p>
                <p className="text-sm text-muted-foreground">{selected.reporterEmail}</p>
              </div>
              <Separator />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Đối tượng bị báo cáo</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={typeCls[selected.targetType]}>{typeLabel[selected.targetType]}</Badge>
                  <span className="text-sm font-medium">{selected.targetName}</span>
                </div>
              </div>
              <Separator />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Lý do khiếu nại</p>
                <p className="text-sm font-medium">{selected.reason}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Mô tả chi tiết</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{selected.description}</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ngày tạo</p>
                  <p className="text-sm">{formatDate(selected.createdAt)}</p>
                </div>
                <StatusBadge status={selected.status} />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Ghi chú xử lý</Label>
                <Textarea
                  rows={3}
                  placeholder="Nhập ghi chú về cách xử lý khiếu nại..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={selected.status !== "open"}
                />
              </div>
              {selected.status === "open" ? (
                <div className="flex gap-3 pt-2">
                  <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" onClick={() => resolve("resolved")}>
                    Giải quyết
                  </Button>
                  <Button variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50" onClick={() => resolve("dismissed")}>
                    Bác bỏ
                  </Button>
                </div>
              ) : (
                <div className="pt-2">
                  <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50" onClick={() => resolve("open")}>
                    Chuyển về Đang mở (Khôi phục)
                  </Button>
                </div>
              )}
              {selected.resolvedNote && selected.status !== "open" && (
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-muted-foreground mb-1">Ghi chú đã lưu</p>
                  <p className="text-sm">{selected.resolvedNote}</p>
                </div>
              )}
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
