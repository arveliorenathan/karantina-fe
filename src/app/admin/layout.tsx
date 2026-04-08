import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex w-full max-w-lvw min-h-screen overflow-hidden bg-background">
        <AdminSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <AdminHeader username={"Arvelio Renathan Budisantoso"} />
          <Separator />
          <main className="flex-1 p-6 overflow-auto">
            <div className="container mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
