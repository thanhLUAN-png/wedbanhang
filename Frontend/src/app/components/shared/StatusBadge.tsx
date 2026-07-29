import { Badge } from "../ui/badge";

type Status = "active" | "blocked" | "pending" | "approved" | "rejected" | "open" | "resolved" | "dismissed" | "completed" | "refunded";

const cfg: Record<Status, { label: string; cls: string }> = {
  active:    { label: "Hoạt động",      cls: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100" },
  blocked:   { label: "Bị chặn",        cls: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100" },
  pending:   { label: "Chờ duyệt",      cls: "bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100" },
  approved:  { label: "Đã duyệt",       cls: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100" },
  rejected:  { label: "Từ chối",        cls: "bg-red-100 text-red-800 border-red-200 hover:bg-red-100" },
  open:      { label: "Đang mở",        cls: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100" },
  resolved:  { label: "Đã giải quyết", cls: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100" },
  dismissed: { label: "Bác bỏ",         cls: "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-100" },
  completed: { label: "Hoàn thành",     cls: "bg-green-100 text-green-800 border-green-200 hover:bg-green-100" },
  refunded:  { label: "Hoàn tiền",      cls: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-100" },
};

export function StatusBadge({ status, className }: { status: Status, className?: string }) {
  const c = cfg[status] ?? { label: status, cls: "" };
  return <Badge variant="outline" className={`${c.cls} ${className || ""}`}>{c.label}</Badge>;
}
