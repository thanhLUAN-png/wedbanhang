import { useState } from "react";
import {
  Search, Ban, Unlock, CheckCircle, XCircle, Store, Bike, User as UserIcon,
  Eye, Phone, Mail, MapPin, Car, FileText, Calendar, Hash
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../components/ui/dialog";
import { Textarea } from "../components/ui/textarea";
import { mockUsers, User, UserRole } from "../data/mockUsers";
import { formatDate } from "../lib/formatters";

function StatusPill({ status }: { status: User["status"] }) {
  const cfg = {
    active:   { label: "Hoạt động",  cls: "bg-green-100 text-green-700 border-green-200" },
    blocked:  { label: "Đã ban",     cls: "bg-red-100 text-red-700 border-red-200" },
    pending:  { label: "Chờ duyệt",  cls: "bg-yellow-100 text-yellow-700 border-yellow-200" },
    rejected: { label: "Đã từ chối", cls: "bg-slate-100 text-slate-600 border-slate-200" },
  }[status];
  return <Badge variant="outline" className={cfg.cls}>{cfg.label}</Badge>;
}

function UserAvatar({ name, role }: { name: string; role: UserRole }) {
  const colors: Record<UserRole, string> = {
    buyer:   "bg-blue-100 text-blue-700",
    seller:  "bg-orange-100 text-orange-700",
    shipper: "bg-teal-100 text-teal-700",
  };
  return (
    <Avatar className="h-9 w-9 flex-shrink-0">
      <AvatarFallback className={`text-xs font-semibold ${colors[role]}`}>
        {name.split(" ").pop()?.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
}

// ── Detail Dialog ─────────────────────────────────────────────────────────────
function DetailDialog({
  user,
  onClose,
  onApprove,
  onReject,
  onBan,
}: {
  user: User | null;
  onClose: () => void;
  onApprove: (id: string) => void;
  onReject: (u: User) => void;
  onBan: (u: User) => void;
}) {
  if (!user) return null;

  const isSeller  = user.role === "seller";
  const isShipper = user.role === "shipper";

  return (
    <Dialog open={!!user} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isSeller  && <Store className="h-5 w-5 text-orange-500" />}
            {isShipper && <Bike  className="h-5 w-5 text-teal-500" />}
            {!isSeller && !isShipper && <UserIcon className="h-5 w-5 text-blue-500" />}
            Chi tiết {isSeller ? "Quán ăn" : isShipper ? "Shipper" : "Người mua"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status header */}
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
            <Avatar className="h-12 w-12">
              <AvatarFallback className={`text-base font-bold ${isSeller ? "bg-orange-100 text-orange-700" : isShipper ? "bg-teal-100 text-teal-700" : "bg-blue-100 text-blue-700"}`}>
                {user.name.split(" ").pop()?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="font-semibold">{user.name}</div>
              {isSeller  && <div className="text-sm text-orange-600 font-medium">{user.shopName}</div>}
              {isShipper && <div className="text-sm text-teal-600 font-medium">{user.vehicleType}</div>}
            </div>
            <StatusPill status={user.status} />
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-1 gap-2.5">
            {/* Common info */}
            <InfoRow icon={<Mail className="h-4 w-4" />}     label="Email"     value={user.email} />
            <InfoRow icon={<Phone className="h-4 w-4" />}    label="Điện thoại" value={user.phone} />
            <InfoRow icon={<Hash className="h-4 w-4" />}     label="Mã tài khoản" value={user.id} />
            <InfoRow icon={<Calendar className="h-4 w-4" />} label="Ngày đăng ký" value={formatDate(user.joinedAt)} />

            {/* Seller specific */}
            {isSeller && (
              <>
                <div className="border-t border-slate-100 pt-2 mt-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Thông tin quán</p>
                </div>
                <InfoRow icon={<Store className="h-4 w-4" />}    label="Tên quán"   value={user.shopName ?? "—"} />
                <InfoRow icon={<MapPin className="h-4 w-4" />}   label="Địa chỉ"    value={user.shopAddress ?? "—"} />
              </>
            )}

            {/* Shipper specific */}
            {isShipper && (
              <>
                <div className="border-t border-slate-100 pt-2 mt-1">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Thông tin phương tiện</p>
                </div>
                <InfoRow icon={<Car className="h-4 w-4" />}        label="Loại xe"    value={user.vehicleType ?? "—"} />
                <InfoRow icon={<FileText className="h-4 w-4" />}   label="Biển số"    value={user.licensePlate ?? "—"} />
              </>
            )}

            {/* Reject / Ban reason */}
            {user.status === "rejected" && user.rejectReason && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-600">
                <span className="font-medium text-slate-700">Lý do từ chối: </span>{user.rejectReason}
              </div>
            )}
            {user.status === "blocked" && user.banReason && (
              <div className="p-3 bg-red-50 rounded-lg border border-red-100 text-sm text-red-600">
                <span className="font-medium text-red-700">Lý do ban: </span>{user.banReason}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-wrap gap-2">
          <Button variant="outline" onClick={onClose}>Đóng</Button>
          {user.status === "pending" && (
            <>
              <Button variant="destructive" className="h-9 text-sm" onClick={() => { onClose(); onReject(user); }}>
                <XCircle className="h-4 w-4 mr-1" />Từ chối
              </Button>
              <Button className="h-9 text-sm bg-green-600 hover:bg-green-700 text-white" onClick={() => { onApprove(user.id); onClose(); }}>
                <CheckCircle className="h-4 w-4 mr-1" />Duyệt
              </Button>
            </>
          )}
          {user.status === "active" && (
            <Button variant="outline" className="h-9 text-sm border-red-200 text-red-600 hover:bg-red-50" onClick={() => { onClose(); onBan(user); }}>
              <Ban className="h-4 w-4 mr-1" />Ban
            </Button>
          )}
          {user.status === "rejected" && (
            <Button className="h-9 text-sm bg-green-600 hover:bg-green-700 text-white" onClick={() => { onApprove(user.id); onClose(); }}>
              <CheckCircle className="h-4 w-4 mr-1" />Duyệt lại
            </Button>
          )}
          {user.status === "blocked" && (
            <Button variant="outline" className="h-9 text-sm border-green-200 text-green-700 hover:bg-green-50" onClick={() => { onApprove(user.id); onClose(); }}>
              <Unlock className="h-4 w-4 mr-1" />Mở ban
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 text-sm">
      <span className="text-slate-400 mt-0.5 flex-shrink-0">{icon}</span>
      <span className="text-slate-500 w-28 flex-shrink-0">{label}</span>
      <span className="text-slate-800 font-medium break-all">{value}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function UsersPage() {
  const [users, setUsers]               = useState<User[]>(mockUsers);
  const [search, setSearch]             = useState("");
  const [roleTab, setRoleTab]           = useState("all");
  const [statusTab, setStatusTab]       = useState("all");

  const [banTarget, setBanTarget]       = useState<User | null>(null);
  const [banReason, setBanReason]       = useState("");
  const [rejectTarget, setRejectTarget] = useState<User | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [detailUser, setDetailUser]     = useState<User | null>(null);

  function handleRoleChange(val: string) {
    setRoleTab(val);
    setStatusTab("all");
    setSearch("");
  }

  const roleFilter = (u: User) =>
    roleTab === "all" ||
    (roleTab === "buyer"   && u.role === "buyer")   ||
    (roleTab === "seller"  && u.role === "seller")  ||
    (roleTab === "shipper" && u.role === "shipper");

  const searchFilter = (u: User) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.shopName?.toLowerCase().includes(q) ?? false) ||
      (u.licensePlate?.toLowerCase().includes(q) ?? false)
    );
  };

  const statusFilter = (u: User) =>
    statusTab === "all" || u.status === statusTab;

  const filtered = users.filter(u => roleFilter(u) && searchFilter(u) && statusFilter(u));

  const c = (role: UserRole | "all", status?: User["status"]) =>
    users.filter(u =>
      (role === "all" || u.role === role) &&
      (status == null || u.status === status)
    ).length;

  const total = users.length;
  const bc  = { total: c("buyer"),   active: c("buyer","active"),   blocked: c("buyer","blocked") };
  const sc  = { total: c("seller"),  active: c("seller","active"),  pending: c("seller","pending"),  rejected: c("seller","rejected"),  blocked: c("seller","blocked") };
  const shc = { total: c("shipper"), active: c("shipper","active"), pending: c("shipper","pending"), rejected: c("shipper","rejected"), blocked: c("shipper","blocked") };

  function approve(id: string) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: "active", rejectReason: undefined } : u));
    toast.success("Đã duyệt tài khoản");
  }
  function doReject() {
    if (!rejectTarget || !rejectReason.trim()) return;
    setUsers(prev => prev.map(u => u.id === rejectTarget.id ? { ...u, status: "rejected", rejectReason } : u));
    toast.error("Đã từ chối tài khoản");
    setRejectTarget(null); setRejectReason("");
  }
  function doBan() {
    if (!banTarget || !banReason.trim()) return;
    setUsers(prev => prev.map(u => u.id === banTarget.id ? { ...u, status: "blocked", banReason } : u));
    toast.error(`Đã ban ${banTarget.name}`);
    setBanTarget(null); setBanReason("");
  }
  function unban(id: string, name: string) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: "active", banReason: undefined } : u));
    toast.success(`Đã mở ban ${name}`);
  }

  // Row component
  function UserRow({ u }: { u: User }) {
    return (
      <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50/70 transition-colors border-b border-slate-100 last:border-0">
        <UserAvatar name={u.name} role={u.role} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium text-slate-800">{u.name}</span>
            <StatusPill status={u.status} />
          </div>
          <p className="text-xs text-muted-foreground">{u.email} · {u.phone}</p>
          {u.role === "seller" && u.shopName && (
            <p className="text-xs text-orange-600 flex items-center gap-1 mt-0.5">
              <Store className="h-3 w-3" />{u.shopName} · {u.shopAddress}
            </p>
          )}
          {u.role === "shipper" && u.vehicleType && (
            <p className="text-xs text-teal-600 flex items-center gap-1 mt-0.5">
              <Bike className="h-3 w-3" />{u.vehicleType} · {u.licensePlate}
            </p>
          )}
          {u.status === "blocked" && u.banReason && (
            <p className="text-xs text-red-500 mt-0.5">🚫 {u.banReason}</p>
          )}
          {u.status === "rejected" && u.rejectReason && (
            <p className="text-xs text-slate-500 mt-0.5">⚠️ {u.rejectReason}</p>
          )}
          <p className="text-xs text-slate-400 mt-0.5">
            Tham gia: {formatDate(u.joinedAt)}{u.orders != null ? ` · ${u.orders} đơn` : ""}
          </p>
        </div>
        <div className="flex-shrink-0 flex gap-2 flex-wrap justify-end">
          {/* Chi tiết — all roles */}
          <Button size="sm" variant="outline" className="h-7 px-3 text-xs" onClick={() => setDetailUser(u)}>
            <Eye className="h-3.5 w-3.5 mr-1" />Chi tiết
          </Button>

          {u.status === "pending" && (
            <>
              <Button size="sm" className="h-7 px-3 text-xs bg-green-600 hover:bg-green-700 text-white" onClick={() => approve(u.id)}>
                <CheckCircle className="h-3.5 w-3.5 mr-1" />Duyệt
              </Button>
              <Button size="sm" variant="destructive" className="h-7 px-3 text-xs" onClick={() => { setRejectTarget(u); setRejectReason(""); }}>
                <XCircle className="h-3.5 w-3.5 mr-1" />Từ chối
              </Button>
            </>
          )}
          {u.status === "active" && (
            <Button size="sm" variant="outline" className="h-7 px-3 text-xs border-red-200 text-red-600 hover:bg-red-50" onClick={() => { setBanTarget(u); setBanReason(""); }}>
              <Ban className="h-3.5 w-3.5 mr-1" />Ban
            </Button>
          )}
          {u.status === "blocked" && (
            <Button size="sm" variant="outline" className="h-7 px-3 text-xs border-green-200 text-green-700 hover:bg-green-50" onClick={() => unban(u.id, u.name)}>
              <Unlock className="h-3.5 w-3.5 mr-1" />Mở ban
            </Button>
          )}
          {u.status === "rejected" && (
            <>
              <Button size="sm" className="h-7 px-3 text-xs bg-green-600 hover:bg-green-700 text-white" onClick={() => approve(u.id)}>
                <CheckCircle className="h-3.5 w-3.5 mr-1" />Duyệt lại
              </Button>
              <Button size="sm" variant="outline" className="h-7 px-3 text-xs border-red-200 text-red-600 hover:bg-red-50" onClick={() => { setBanTarget(u); setBanReason(""); }}>
                <Ban className="h-3.5 w-3.5 mr-1" />Ban
              </Button>
            </>
          )}
        </div>
      </div>
    );
  }

  function StatusSubTabs({ role }: { role: UserRole | "all" }) {
    const tabs =
      role === "buyer"
        ? [
            { value: "all",     label: "Tất cả",    count: bc.total },
            { value: "active",  label: "Hoạt động", count: bc.active },
            { value: "blocked", label: "Đã ban",     count: bc.blocked },
          ]
        : role === "seller"
        ? [
            { value: "all",      label: "Tất cả",     count: sc.total },
            { value: "pending",  label: "Chờ duyệt",  count: sc.pending },
            { value: "active",   label: "Hoạt động",  count: sc.active },
            { value: "rejected", label: "Đã từ chối", count: sc.rejected },
            { value: "blocked",  label: "Đã ban",      count: sc.blocked },
          ]
        : role === "shipper"
        ? [
            { value: "all",      label: "Tất cả",     count: shc.total },
            { value: "pending",  label: "Chờ duyệt",  count: shc.pending },
            { value: "active",   label: "Hoạt động",  count: shc.active },
            { value: "rejected", label: "Đã từ chối", count: shc.rejected },
            { value: "blocked",  label: "Đã ban",      count: shc.blocked },
          ]
        : [
            { value: "all",      label: "Tất cả",     count: total },
            { value: "pending",  label: "Chờ duyệt",  count: sc.pending + shc.pending },
            { value: "active",   label: "Hoạt động",  count: c("all","active") },
            { value: "rejected", label: "Đã từ chối", count: c("all","rejected") },
            { value: "blocked",  label: "Đã ban",      count: c("all","blocked") },
          ];

    return (
      <div className="flex gap-1 px-5 py-3 border-b border-slate-100 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.value}
            onClick={() => setStatusTab(t.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              statusTab === t.value
                ? "bg-slate-800 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t.label}
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
              statusTab === t.value ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"
            }`}>{t.count}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Quản lý Người dùng</h1>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Tổng cộng", count: total,     color: "text-slate-700",   icon: <UserIcon className="h-4 w-4" /> },
          { label: "Người mua", count: bc.total,  color: "text-blue-600",   icon: <UserIcon className="h-4 w-4" /> },
          { label: "Quán ăn",   count: sc.total,  color: "text-orange-600", icon: <Store className="h-4 w-4" /> },
          { label: "Shipper",   count: shc.total, color: "text-teal-600",   icon: <Bike className="h-4 w-4" /> },
        ].map(s => (
          <Card key={s.label} className="bg-white">
            <CardContent className="pt-4 pb-3 flex items-start justify-between">
              <div>
                <div className={`text-2xl font-bold ${s.color}`}>{s.count}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
              </div>
              <div className={`mt-1 ${s.color} opacity-60`}>{s.icon}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white">
        <Tabs value={roleTab} onValueChange={handleRoleChange}>
          <div className="px-5 pt-5 border-b border-slate-100">
            <TabsList className="bg-slate-100">
              <TabsTrigger value="all">
                Tất cả <span className="ml-1.5 text-xs bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full">{total}</span>
              </TabsTrigger>
              <TabsTrigger value="buyer">
                Người mua <span className="ml-1.5 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">{bc.total}</span>
              </TabsTrigger>
              <TabsTrigger value="seller">
                Quán ăn
                <span className="ml-1.5 text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full">{sc.total}</span>
                {sc.pending > 0 && <span className="ml-1 text-xs bg-yellow-400 text-white px-1.5 py-0.5 rounded-full">{sc.pending}</span>}
              </TabsTrigger>
              <TabsTrigger value="shipper">
                Shipper
                <span className="ml-1.5 text-xs bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded-full">{shc.total}</span>
                {shc.pending > 0 && <span className="ml-1 text-xs bg-yellow-400 text-white px-1.5 py-0.5 rounded-full">{shc.pending}</span>}
              </TabsTrigger>
            </TabsList>
          </div>

          {(["all","buyer","seller","shipper"] as const).map(role => (
            <TabsContent key={role} value={role} className="mt-0">
              <div className="px-5 py-3 border-b border-slate-100">
                <div className="relative max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={
                      role === "buyer"   ? "Tìm tên, email..." :
                      role === "seller"  ? "Tìm tên, email, tên quán..." :
                      role === "shipper" ? "Tìm tên, email, biển số..." :
                      "Tìm tên, email, tên quán, biển số..."
                    }
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
              </div>
              <StatusSubTabs role={role} />
              {filtered.length === 0
                ? <p className="text-center py-12 text-muted-foreground text-sm">Không tìm thấy người dùng nào</p>
                : filtered.map(u => <UserRow key={u.id} u={u} />)
              }
            </TabsContent>
          ))}
        </Tabs>
      </Card>

      {/* Detail Dialog */}
      <DetailDialog
        user={detailUser}
        onClose={() => setDetailUser(null)}
        onApprove={approve}
        onReject={(u) => { setRejectTarget(u); setRejectReason(""); }}
        onBan={(u) => { setBanTarget(u); setBanReason(""); }}
      />

      {/* Dialog Từ chối */}
      <Dialog open={!!rejectTarget} onOpenChange={o => { if (!o) setRejectTarget(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Từ chối đăng ký</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <UserAvatar name={rejectTarget?.name ?? ""} role={rejectTarget?.role ?? "buyer"} />
              <div>
                <p className="text-sm font-medium">{rejectTarget?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {rejectTarget?.role === "seller" ? rejectTarget.shopName : `${rejectTarget?.vehicleType} · ${rejectTarget?.licensePlate}`}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Lý do từ chối *</label>
              <Textarea className="mt-1.5" rows={3}
                placeholder="VD: Giấy phép không hợp lệ, địa chỉ không tồn tại..."
                value={rejectReason} onChange={e => setRejectReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectTarget(null)}>Hủy</Button>
            <Button variant="destructive" onClick={doReject} disabled={!rejectReason.trim()}>Xác nhận từ chối</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Ban */}
      <Dialog open={!!banTarget} onOpenChange={o => { if (!o) setBanTarget(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Ban tài khoản</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-100">
              <UserAvatar name={banTarget?.name ?? ""} role={banTarget?.role ?? "buyer"} />
              <div>
                <p className="text-sm font-medium">{banTarget?.name}</p>
                <p className="text-xs text-muted-foreground">{banTarget?.email}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Lý do ban *</label>
              <Textarea className="mt-1.5" rows={3}
                placeholder="VD: Vi phạm điều khoản, gian lận đơn hàng, bán đồ ăn mất vệ sinh..."
                value={banReason} onChange={e => setBanReason(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Lý do sẽ được lưu lại và hiển thị cho admin.</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBanTarget(null)}>Hủy</Button>
            <Button variant="destructive" onClick={doBan} disabled={!banReason.trim()}>
              <Ban className="h-4 w-4 mr-2" />Xác nhận ban
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
