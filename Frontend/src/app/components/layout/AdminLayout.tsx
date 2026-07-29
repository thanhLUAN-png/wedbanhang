import { Outlet } from "react-router";
import { SidebarProvider, SidebarInset } from "../ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";

export function AdminLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 overflow-auto bg-slate-50">
          <div className="p-6">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
