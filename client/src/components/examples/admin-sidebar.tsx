import { AdminSidebar } from "../admin-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AdminSidebarExample() {
  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <h2 className="text-2xl font-display">Admin Dashboard Content</h2>
          <p className="text-muted-foreground mt-2">
            Click the sidebar items to navigate
          </p>
        </div>
      </div>
    </SidebarProvider>
  );
}
