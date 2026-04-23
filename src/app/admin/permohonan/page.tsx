"use client";
import DeleteDialog from "@/components/admin/delete-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getPermohonan } from "@/services/permohonanService";
import { PaginatedPermohonan, Permohonan } from "@/types/permohonan";
import { Building, Eye, FileText, MoreHorizontal, Pencil, PlusCircle, QrCode, SearchIcon, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../auth-provider";
import { getSurat } from "@/services/suratService";
import { toast } from "sonner";
import { PaginatedSurat } from "@/types/surat";

export default function PermohonanPage() {
  const { user } = useAuth();
  const [permohonan, setPermohonan] = useState<Permohonan[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [statusPenerimaan, setStatusPenerimaan] = useState("");
  const [klasifikasi, setKlasifikasi] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const router = useRouter();
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });

  const fetchPermohonan = useCallback(
    async (page?: number, search?: string, status?: string, status_penerimaan?: string, klasifikasi?: string) => {
      setLoading(true);
      try {
        const result: PaginatedPermohonan = await getPermohonan({
          page,
          search,
          status,
          status_penerimaan,
          klasifikasi,
          start_date: startDate,
          end_date: endDate,
        });
        setPermohonan(result.data);
        setPagination({
          current_page: result.current_page,
          last_page: result.last_page,
        });
      } catch (error) {
        console.error("Error fetch permohonan:", error);
      } finally {
        setLoading(false);
      }
    },
    [endDate, startDate],
  );

  const handleCetak = async (permohonanId: number) => {
    try {
      const result: PaginatedSurat = await getSurat({
        permohonan_id: permohonanId,
        perihal: "Pemerikasaan Administrasi dan Penerimaan Sampel",
      });

      if (result.data.length === 0) {
        toast.error("Surat tugas untuk Pemerikasaan Administrasi dan Penerimaan Sampel.");
        return;
      }

      const hashedId = btoa(String(permohonanId));
      router.push(`/pdf/hasil-uji-preview?id=${encodeURIComponent(hashedId)}`);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat memeriksa surat.");
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Selesai":
        return "bg-green-500 text-white";
      case "Pengujian Laboratorium":
        return "bg-blue-500 text-white";
      case "Distribusi Laboratorium":
        return "bg-yellow-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const getStatusPenerimaanBadgeColor = (statusPenerimaan: string) => {
    switch (statusPenerimaan) {
      case "Terima":
        return "bg-green-500 text-white";
      case "Tolak":
        return "bg-red-500 text-white";
      case "Menunggu Konfirmasi Admin":
        return "bg-yellow-500 text-white";
      case "Dibatalkan":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  useEffect(() => {
    fetchPermohonan(
      0,
      search || undefined,
      status === "all" ? undefined : status,
      statusPenerimaan === "all" ? undefined : statusPenerimaan,
      klasifikasi === "all" ? undefined : klasifikasi,
    );
  }, [fetchPermohonan, klasifikasi, search, status, statusPenerimaan]);

  return (
    <div className="flex-col space-y-6">
      <div>
        <Card className="border">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Filter & Pencarian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {/* Search Field */}
              <div>
                <Field>
                  <FieldLabel>Cari Permohonan</FieldLabel>
                  <ButtonGroup className="flex flex-col lg:flex-row w-full lg:w-auto">
                    <Input
                      placeholder="Nama perusahaan atau kode..."
                      className="w-full lg:w-64 xl:w-80"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <Button variant="default" aria-label="Search">
                      <SearchIcon />
                    </Button>
                  </ButtonGroup>
                </Field>
              </div>

              {/* Klasifikasi */}
              <div>
                <Field>
                  <FieldLabel>Laboratorium</FieldLabel>
                  <Select value={klasifikasi} onValueChange={setKlasifikasi}>
                    <SelectTrigger>
                      <SelectValue placeholder="Semua laboratorium" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="KH">Karantina Hewan</SelectItem>
                      <SelectItem value="KI">Karantina Ikan</SelectItem>
                      <SelectItem value="KT">Karantina Tumbuhan</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              {/* Status Field */}
              <div>
                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Semua status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Selesai">Selesai</SelectItem>
                      <SelectItem value="Pengujian Laboratorium">Pengujian Laboratorium</SelectItem>
                      <SelectItem value="Distribusi Laboratorium">Distribusi Laboratorium</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              {/* Status Penerimaan Field */}
              <div>
                <Field>
                  <FieldLabel>Status Penerimaan</FieldLabel>
                  <Select value={statusPenerimaan} onValueChange={setStatusPenerimaan}>
                    <SelectTrigger>
                      <SelectValue placeholder="Semua status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Terima">Terima</SelectItem>
                      <SelectItem value="Tolak">Tolak</SelectItem>
                      <SelectItem value="Menunggu Konfirmasi Admin">Menunggu Konfirmasi Admin</SelectItem>
                      <SelectItem value="Dibatalkan">Dibatalkan</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              {/* Tanggal Mulai Field */}
              <div>
                <Field>
                  <FieldLabel>Tanggal Mulai</FieldLabel>
                  <Input type="date" className="w-full lg:w-64 xl:w-80" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </Field>
              </div>

              {/* Tanggal Akhir Field */}
              <div>
                <Field>
                  <FieldLabel>Tanggal Akhir</FieldLabel>
                  <Input type="date" className="w-full lg:w-64 xl:w-80" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </Field>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 items-center mt-6">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch("");
                    setStatus("");
                    setStatusPenerimaan("");
                  }}>
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <div>
        <Card className="border">
          <CardContent className="space-y-4">
            <div className="flex items-end justify-end mb-4">
              <Button onClick={() => router.push("/admin/permohonan/management")}>
                <PlusCircle /> Tambah Permohonan
              </Button>
            </div>
            {/* Employee Table */}
            <Table className="border w-full overflow-x-auto">
              <TableHeader className="bg-primary">
                <TableRow>
                  <TableHead className="text-center text-primary-foreground w-30 sm:w-37.5">Kode Permohonan</TableHead>
                  <TableHead className="text-center text-primary-foreground w-20 sm:w-25">PIN</TableHead>
                  <TableHead className="text-center text-primary-foreground w-30 sm:w-37.5">Pengguna Jasa</TableHead>
                  <TableHead className="text-center text-primary-foreground w-37.5 sm:w-50">Tanggal Masuk</TableHead>
                  <TableHead className="text-center text-primary-foreground w-37.5 sm:w-50">Tanggal Diterima</TableHead>
                  <TableHead className="text-center text-primary-foreground w-50 sm:w-62.5">Laboratorium</TableHead>
                  <TableHead className="text-center text-primary-foreground w-25 sm:w-30">Status</TableHead>
                  <TableHead className="text-center text-primary-foreground w-30 sm:w-37.5">Status Penerimaan</TableHead>
                  <TableHead className="text-center text-primary-foreground w-30 sm:w-37.5">Aksi</TableHead>
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
                ) : permohonan.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                      Tidak ada data permohonan
                    </TableCell>
                  </TableRow>
                ) : (
                  permohonan.map((permohonan) => (
                    <TableRow key={permohonan.id}>
                      <TableCell className="text-center text-xs">{permohonan.kode_permohonan}</TableCell>
                      <TableCell className="text-center text-xs">{permohonan.pin}</TableCell>
                      <TableCell className="text-xs">
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-1.5 font-medium">
                            <Building className="h-3.5 w-3.5 text-muted-foreground" />
                            <span>{permohonan.nama_perusahaan}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <User className="h-3.5 w-3.5" />
                            <span>{permohonan.nama_pembawa}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-xs text-wrap">
                        {permohonan.tanggal_masuk ? new Date(permohonan.tanggal_masuk).toLocaleDateString("id-ID") : "-"}
                      </TableCell>
                      <TableCell className="text-center text-xs text-wrap">
                        {permohonan.tanggal_diterima
                          ? new Date(permohonan.tanggal_diterima).toLocaleDateString("id-ID")
                          : "Permohonan Belum Diterima"}
                      </TableCell>

                      <TableCell className="text-center text-xs">{permohonan.laboratorium?.nama_laboratorium}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={`text-xs px-3 py-1 rounded-lg font-semibold ${getStatusBadgeColor(permohonan.status)}`}>
                          {permohonan.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={`text-xs px-3 py-1 rounded-lg font-semibold ${getStatusPenerimaanBadgeColor(permohonan.status_penerimaan)}`}>
                          {permohonan.status_penerimaan}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center items-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="default" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-70">
                              <DropdownMenuItem
                                className="gap-2 cursor-pointer"
                                disabled={permohonan.sampel?.length === 0 || permohonan?.sampel?.every((sampel) => sampel.hasil_uji?.length === 0)}
                                onClick={() => {
                                  const hashedId = btoa(String(permohonan.id));
                                  router.push(`/pdf/serah-terima/pengguna-jasa?id=${encodeURIComponent(hashedId)}`);
                                }}>
                                <FileText className="h-4 w-4" />
                                <span>Berita Acara (Pengguna Jasa)</span>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="gap-2 cursor-pointer"
                                disabled={permohonan.sampel?.length === 0 || permohonan?.sampel?.every((sampel) => sampel.hasil_uji?.length === 0)}
                                onClick={() => handleCetak(permohonan.id)}>
                                <FileText className="h-4 w-4" />
                                <span>Berita Acara (Petugas)</span>
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                className="gap-2 cursor-pointer"
                                disabled={permohonan.sampel?.length === 0 || permohonan?.sampel?.every((sampel) => sampel.hasil_uji?.length === 0)}
                                onClick={() => router.push(`/admin/permohonan/label?id=${permohonan.id}`)}>
                                <QrCode className="h-4 w-4" />
                                <span>Cetak Label</span>
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              <DropdownMenuItem
                                className="gap-2 cursor-pointer"
                                onClick={() => router.push(`/admin/permohonan/detail?id=${permohonan.id}`)}>
                                <Eye className="h-4 w-4" />
                                <span>Detail Permohonan</span>
                              </DropdownMenuItem>

                              {(user?.role === "superadmin" || user?.role === "admin") && (
                                <>
                                  <DropdownMenuItem
                                    className="gap-2 cursor-pointer"
                                    disabled={permohonan.status == "Selesai"}
                                    onClick={() => router.push(`/admin/permohonan/management?id=${permohonan.id}`)}>
                                    <Pencil className="h-4 w-4" />
                                    <span>Edit Permohonan</span>
                                  </DropdownMenuItem>

                                  <DropdownMenuSeparator />

                                  <div onClick={(e) => e.stopPropagation()}>
                                    <DeleteDialog
                                      trigger={
                                        <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-red-600 hover:bg-red-700 hover:text-white  cursor-pointer rounded-sm w-full">
                                          <Trash2 className="h-4 w-4" />
                                          <span>Hapus Permohonan</span>
                                        </div>
                                      }
                                      endpoint={`/permohonan/${permohonan.id}`}
                                      successMessage="Data permohonan berhasil dihapus"
                                      onSuccess={() => fetchPermohonan(pagination.current_page)}
                                    />
                                  </div>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
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
                        fetchPermohonan(pagination.current_page - 1, search, status, statusPenerimaan, klasifikasi);
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
                          fetchPermohonan(pageNum, search, status, statusPenerimaan, klasifikasi);
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
                        fetchPermohonan(pagination.current_page + 1, search, status, statusPenerimaan, klasifikasi);
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
    </div>
  );
}
