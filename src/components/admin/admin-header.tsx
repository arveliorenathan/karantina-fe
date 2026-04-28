"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/app/admin/auth-provider";

function getPageInfo(pathname: string) {
  switch (pathname) {
    case "/admin/pegawai":
      return { title: "Data Pegawai", description: "Kelola data pegawai BBKHIT Bali" };
    case "/admin/laboratorium":
      return { title: "Data Laboratorium", description: "Kelola data laboratorium BBKHIT Bali" };
    case "/admin/parameter":
      return { title: "Data Parameter", description: "Kelola data parameter disetiap laboratorium BBKHIT Bali" };
    case "/admin/permohonan":
      return { title: "Data Permohonan", description: "Mengelola permohonan karantina, melacak pengajuan, dan memantau status pemrosesan." };
    case "/admin/sampel":
      return {
        title: "Data Sampel",
        description: "Mengelola data sampel yang terkait dengan permohonan karantina dan memantau proses pemrosesan sampel yang masuk.",
      };
    case "/admin/surat":
      return { title: "Data Surat Tugas", description: "Mengelola data surat tugas untuk pegawai." };
    case "/admin/agenda":
      return { title: "Rekap Agenda Hasil Pengujian", description: "Melihat hasil rekapitulasi agenda hasil pengujian." };
    case "/admin/verifikasi":
      return { title: "Verifikasi Permohonan", description: "Memverifikasi kelengkapan dan keabsahan permohonan yang diajukan." };
    case "/admin/pnbp":
      return { title: "Data PNBP", description: "Kelola data PNBP pengguna jasa BBKHIT Bali." };
    case "/admin/pnbp/layanan":
      return { title: "Data Layanan PNBP", description: "Kelola data jenis layanan PNBP BBKHIT Bali." };
    default:
      return { title: "Dewata E-Laboratorium", description: "Selamat datang di Sistem Informasi Laboratorium BBKHIT Bali" };
  }
}

export function AdminHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { title, description } = getPageInfo(pathname);

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-primary px-5 py-5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="mt-1 text-white" />
        <div>
          <h1 className="text-lg font-bold tracking-tight text-accent">{title}</h1>
          <p className="text-sm text-accent mt-1">{description}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-white">
        <span className="hidden sm:block text-sm">
          Selamat Datang, <span className="font-medium">{user?.username}</span>
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10">
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://github.com/octocat.png" alt={"profile"} />
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 cursor-pointer">
              <LogOut className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
