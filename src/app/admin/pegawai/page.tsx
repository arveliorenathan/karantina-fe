"use client";
import DeleteDialog from "@/components/admin/delete-dialog";
import PegawaiDialog from "@/components/admin/pegawai/pegawai-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getPegawai } from "@/services/pegawaiService";
import { PaginatedPegawai, Pegawai } from "@/types/pegawai";
import { Eye, ListFilter, Mail, Pencil, Phone, SearchIcon, Trash2, UserPlus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useAuth } from "../auth-provider";
import { useRouter } from "next/navigation";

export default function PegawaiPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [pegawai, setPegawai] = useState<Pegawai[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });

  const fetchPegawai = useCallback(async (page: number, search?: string, status?: string) => {
    setLoading(true);
    try {
      const result: PaginatedPegawai = await getPegawai({
        page,
        search,
        status,
      });
      setPegawai(result.data);
      setPagination({
        current_page: result.current_page,
        last_page: result.last_page,
      });
    } catch (error) {
      console.error("Error fetching pegawai:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role !== "superadmin") {
      router.replace("/forbidden");
    } else {
      fetchPegawai(1, search || undefined, status === "all" ? undefined : status);
    }
  }, [search, status, fetchPegawai, user?.role, router]);

  const getBadgeColor = (status: string) => {
    switch (status) {
      case "Aktif":
        return "bg-green-500 text-white";
      case "Non Aktif":
        return "bg-red-500 text-white";
      case "Cuti":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  return (
    <div className="w-full">
      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <ButtonGroup className="flex flex-col lg:flex-row w-full lg:w-auto">
                <Input
                  placeholder="Cari pegawai berdasarkan nama, NIP..."
                  className="w-full lg:w-64 xl:w-80"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="default" aria-label="Search">
                  <SearchIcon />
                </Button>
              </ButtonGroup>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-56 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <ListFilter className="h-4 w-4 text-gray-500" />
                    <SelectValue placeholder="Semua Status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status Pegawai</SelectLabel>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="Aktif">Aktif</SelectItem>
                    <SelectItem value="Cuti">Cuti</SelectItem>
                    <SelectItem value="Non Aktif">Non Aktif</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <PegawaiDialog
              title="Tambah Data Pegawai"
              trigger={
                <Button size="sm" className="flex items-center gap-2 px-6 shadow-sm hover:shadow-md transition cursor-pointer w-full lg:w-auto">
                  <UserPlus className="h-5 w-5" />
                  <span className="font-semibold">Tambah Pegawai</span>
                </Button>
              }
              method="create"
              onSuccess={() => fetchPegawai(pagination.current_page)}
            />
          </div>

          {/* Employee Table */}
          <Table className="border">
            <TableHeader className="bg-primary">
              <TableRow>
                <TableHead className="text-center text-primary-foreground w-24">NIP</TableHead>
                <TableHead className="text-center text-primary-foreground w-24">Nama Pegawai</TableHead>
                <TableHead className="text-center text-primary-foreground w-24">Golongan</TableHead>
                <TableHead className="text-center text-primary-foreground w-24">Jabatan</TableHead>
                <TableHead className="text-center text-primary-foreground w-24">Kontak</TableHead>
                <TableHead className="text-center text-primary-foreground w-24">Status</TableHead>
                <TableHead className="text-center text-primary-foreground w-24">Aksi</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ) : pegawai.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                    Tidak ada data pegawai
                  </TableCell>
                </TableRow>
              ) : (
                pegawai.map((pegawai) => (
                  <TableRow key={pegawai.id}>
                    <TableCell className="text-center text-xs">{pegawai.nip}</TableCell>
                    <TableCell className="text-center text-xs">{pegawai.nama_pegawai}</TableCell>
                    <TableCell className="text-center text-xs">{pegawai.golongan}</TableCell>
                    <TableCell className="text-center text-xs">{pegawai.jabatan}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-3 text-gray-700">
                          <Mail className="h-4 w-4 text-blue-500" />
                          <span className="text-xs font-medium">{pegawai.email ?? "Belum Diset"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                          <Phone className="h-4 w-4 text-green-500" />
                          <span className="text-xs font-medium">{pegawai.kontak ?? "Belum Diset"}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={`text-xs px-3 py-1 rounded-lg font-semibold ${getBadgeColor(pegawai.status)}`}>{pegawai.status}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="default" size="icon-sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Lihat Detail Data Pegawai</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <PegawaiDialog
                            title="Perbarui Data Pegawai"
                            trigger={
                              <TooltipTrigger asChild>
                                <Button variant="default" size="icon-sm" className="bg-yellow-500 hover:bg-yellow-700">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                            }
                            method="edit"
                            defaultValue={pegawai}
                            onSuccess={() => fetchPegawai(pagination.current_page)}
                          />
                          <TooltipContent>Perbarui Data Pegawai</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <DeleteDialog
                            trigger={
                              <TooltipTrigger asChild>
                                <Button variant="destructive" size="icon" className="hover:bg-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                            }
                            endpoint={`/pegawai/${pegawai.id}`}
                            successMessage="Data pegawai berhasil dihapus"
                            onSuccess={() => fetchPegawai(pagination.current_page)}
                          />
                          <TooltipContent>Hapus Data Pegawai</TooltipContent>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <Pagination>
            <PaginationContent>
              {/* Previous Button */}
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.current_page > 1) {
                      fetchPegawai(pagination.current_page - 1, search, status);
                    }
                  }}
                  className={pagination.current_page === 1 ? "cursor-not-allowed opacity-50" : ""}
                />
              </PaginationItem>

              {/* Page Number Links */}
              {[...Array(pagination.last_page)].map((_, index) => {
                const pageNum = index + 1;
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        fetchPegawai(pageNum, search, status);
                      }}
                      isActive={pageNum === pagination.current_page}>
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {/* Ellipsis for large page ranges */}
              {pagination.current_page < pagination.last_page - 1 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              {/* Next Button */}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (pagination.current_page < pagination.last_page) {
                      fetchPegawai(pagination.current_page + 1, search, status);
                    }
                  }}
                  className={pagination.current_page === pagination.last_page ? "cursor-not-allowed opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>
    </div>
  );
}
