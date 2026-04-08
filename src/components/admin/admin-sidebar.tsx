"use client";

import {
  CalendarDays,
  FlaskConical,
  Users,
  ChevronDown,
  FileText,
  TestTube,
  Wrench,
  Mails,
  BookText,
  FileStack,
  Landmark,
  Banknote,
  WalletCards,
  FileCheck,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import Link from "next/link";
import Image from "next/image";

export function AdminSidebar() {
  return (
    <Sidebar>
      {/* HEADER */}
      <SidebarHeader className="p-6.5">
        <div className="flex items-center gap-3">
          <Image src="/images/Barantin.png" height={40} width={40} alt="Logo" />
          <div>
            <p className="text-lg font-bold tracking-wide">BBKHIT Bali</p>
            <p className="text-sm font-bold tracking-wide">Dewata E-Laboratory</p>
          </div>
        </div>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {/* DASHBOARD
              <SidebarMenuItem>
                <SidebarMenuButton variant="default" className="px-4 py-6">
                  <Link href="/admin/dashboard" className="flex w-full items-center gap-4">
                    <CalendarDays className="h-5 w-5" />
                    <span className="font-semibold">Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem> */}

              {/* PEGAWAI */}
              <SidebarMenuItem>
                <SidebarMenuButton variant="default" className="px-4 py-6">
                  <Link href="/admin/pegawai" className="flex w-full items-center gap-4">
                    <Users className="h-5 w-5" />
                    <span className="font-semibold">Data Pegawai</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* LABORATORIUM DROPDOWN */}
              <Collapsible>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton variant="default" className="px-4 py-6 flex justify-between">
                      <div className="flex items-center gap-4">
                        <FlaskConical className="h-5 w-5" />
                        <span className="font-semibold">Laboratorium</span>
                      </div>
                      <ChevronDown className="h-4 w-4 opacity-70" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  {/* SUB MENU */}
                  <CollapsibleContent>
                    <div className="ml-6 mt-2 space-y-1">
                      <SidebarMenuButton className="py-5">
                        <Link href="/admin/laboratorium" className="flex items-center gap-3 w-full">
                          <FlaskConical className="h-4 w-4" />
                          <span>Data Laboratorium</span>
                        </Link>
                      </SidebarMenuButton>

                      <SidebarMenuButton className="py-5">
                        <Link href="/admin/parameter" className="flex items-center gap-3 w-full">
                          <Wrench className="h-4 w-4" />
                          <span>Data Parameter</span>
                        </Link>
                      </SidebarMenuButton>
                    </div>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* PERMOHONAN DROPDOWN */}
              <Collapsible>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton variant="default" className="px-4 py-6 flex justify-between">
                      <div className="flex items-center gap-4">
                        <FileText className="h-5 w-5" />
                        <span className="font-semibold">Permohonan</span>
                      </div>
                      <ChevronDown className="h-4 w-4 opacity-70" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  {/* SUB MENU */}
                  <CollapsibleContent>
                    <div className="ml-6 mt-2 space-y-1">
                      <SidebarMenuButton className="py-5">
                        <Link href="/admin/permohonan" className="flex items-center gap-3 w-full">
                          <FileText className="h-4 w-4" />
                          <span>Data Permohonan</span>
                        </Link>
                      </SidebarMenuButton>

                      <SidebarMenuButton className="py-5">
                        <Link href="/admin/sampel" className="flex items-center gap-3 w-full">
                          <TestTube className="h-4 w-4" />
                          <span>Penerimaan Sampel</span>
                        </Link>
                      </SidebarMenuButton>

                      <SidebarMenuButton className="py-5">
                        <Link href="/admin/verifikasi" className="flex items-center gap-3 w-full">
                          <FileCheck className="h-4 w-4" />
                          <span>Verifikasi Permohonan</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuButton className="py-5">
                        <Link href="/admin/surat" className="flex w-full items-center gap-3">
                          <Mails className="h-4 w-4" />
                          <span className="font-semibold">Data Surat Tugas</span>
                        </Link>
                      </SidebarMenuButton>
                    </div>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Dokumen Dropdown */}
              <Collapsible>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton variant="default" className="px-4 py-6 flex justify-between">
                      <div className="flex items-center gap-4">
                        <FileStack className="h-5 w-5" />
                        <span className="font-semibold">Dokumen Rekapitulasi</span>
                      </div>
                      <ChevronDown className="h-4 w-4 opacity-70" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  {/* SUB MENU */}
                  <CollapsibleContent>
                    <div className="ml-6 mt-2 space-y-1">
                      <SidebarMenuButton className="py-5">
                        <Link href="/admin/agenda" className="flex items-center gap-3 w-full">
                          <BookText className="h-4 w-4" />
                          <span className="font-semibold">Agenda Hasil Pengujian</span>
                        </Link>
                      </SidebarMenuButton>
                    </div>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* PNBP */}
              <Collapsible>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton variant="default" className="px-4 py-6 flex justify-between">
                      <div className="flex items-center gap-4">
                        <Landmark className="h-5 w-5" />
                        <span className="font-semibold">PNBP</span>
                      </div>
                      <ChevronDown className="h-4 w-4 opacity-70" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  {/* SUB MENU */}
                  <CollapsibleContent>
                    <div className="ml-6 mt-2 space-y-1">
                      <SidebarMenuButton className="py-5">
                        <Link href="/admin/pnbp" className="flex w-full items-center gap-3">
                          <Banknote className="h-4 w-4" />
                          <span className="font-semibold">Data Kuitansi</span>
                        </Link>
                      </SidebarMenuButton>

                      <SidebarMenuButton className="py-5">
                        <Link href="/admin/pnbp/layanan" className="flex items-center gap-3 w-full">
                          <WalletCards className="h-4 w-4" />
                          <span className="font-semibold">Data Layanan</span>
                        </Link>
                      </SidebarMenuButton>
                    </div>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter className="p-4 text-center">
        <span className="text-xs text--foreground">
          &copy; {new Date().getFullYear()} Dewata E-Laboratorium. <br />
          All rights reserved.
        </span>
      </SidebarFooter>
    </Sidebar>
  );
}
