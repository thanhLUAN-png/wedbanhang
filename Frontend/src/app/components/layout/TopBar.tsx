import { useLocation } from "react-router";
import { Bell } from "lucide-react";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "../ui/avatar";

const labels: Record<string, string> = {
  "/admin":             "Tổng quan",
  "/admin/users":       "Người dùng",
  "/admin/products":    "Kiểm duyệt sản phẩm",
  "/admin/revenue":     "Doanh thu",
  "/admin/categories":  "Danh mục",
  "/admin/complaints":  "Khiếu nại / Báo cáo",
};

export function TopBar() {
  const { pathname } = useLocation();
  const label = labels[pathname] ?? "Trang";
  const isHome = pathname === "/admin";

  return (
    <header className="flex h-14 items-center gap-2 border-b bg-background px-4 shrink-0">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />
      <Breadcrumb className="flex-1">
        <BreadcrumbList>
          {!isHome && (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink href="/admin" className="text-muted-foreground hover:text-foreground">Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
            </>
          )}
          <BreadcrumbItem>
            <BreadcrumbPage>{label}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-blue-600 text-white text-xs">QT</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
