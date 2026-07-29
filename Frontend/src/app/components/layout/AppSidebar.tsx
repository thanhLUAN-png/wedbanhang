import { useLocation, Link } from "react-router";
import { LayoutDashboard, Users, Package, BarChart3, FolderTree, MessageSquareWarning, LogOut, ShoppingBag } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail,
} from "../ui/sidebar";
import { Avatar, AvatarFallback } from "../ui/avatar";

const navItems = [
  { path: "/admin",             label: "Tổng quan",             icon: LayoutDashboard },
  { path: "/admin/users",       label: "Người dùng",             icon: Users },
  { path: "/admin/products",    label: "Kiểm duyệt sản phẩm",   icon: Package },
  { path: "/admin/revenue",     label: "Doanh thu",              icon: BarChart3 },
  { path: "/admin/categories",  label: "Danh mục",               icon: FolderTree },
  { path: "/admin/complaints",  label: "Khiếu nại / Báo cáo",   icon: MessageSquareWarning },
];

export function AppSidebar() {
  const { pathname } = useLocation();

  return (
    <Sidebar
      collapsible="icon"
      className="border-r-0"
      style={{
        "--sidebar": "#0f172a",
        "--sidebar-foreground": "#e2e8f0",
        "--sidebar-accent": "#1e293b",
        "--sidebar-accent-foreground": "#f1f5f9",
        "--sidebar-border": "#1e293b",
        "--sidebar-ring": "#475569",
        "--sidebar-primary": "#3b82f6",
        "--sidebar-primary-foreground": "#ffffff",
      } as React.CSSProperties}
    >
      <SidebarHeader className="border-b border-slate-700 pb-4">
        <div className="flex items-center gap-3 px-2 pt-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 shrink-0">
            <ShoppingBag className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-semibold text-slate-100 text-sm">ShopViet Admin</span>
            <span className="text-xs text-slate-400">Quản trị hệ thống</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-500 text-xs uppercase tracking-wider group-data-[collapsible=icon]:hidden">
            Quản lý
          </SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const isActive = item.path === "/admin" ? pathname === "/admin" : pathname.startsWith(item.path);
              return (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={item.label}
                    className="text-slate-300 hover:text-slate-100 hover:bg-slate-700 data-[active=true]:bg-blue-600 data-[active=true]:text-white"
                  >
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-slate-700 pt-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-slate-300 hover:text-slate-100 hover:bg-slate-700 h-auto py-2" tooltip="Quản trị viên">
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarFallback className="bg-blue-600 text-white text-xs">QT</AvatarFallback>
              </Avatar>
              <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
                <span className="text-sm text-slate-100">Quản trị viên</span>
                <span className="text-xs text-slate-400">admin@shopviet.vn</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="text-slate-400 hover:text-red-400 hover:bg-slate-700" tooltip="Đăng xuất">
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
