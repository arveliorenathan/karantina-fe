"use client";
import DeleteDialog from "@/components/admin/delete-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent } from "@/components/ui/card";
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getPNBP } from "@/services/pnbpService";
import { PaginatedPNBP, Pnbp } from "@/types/pnbp";
import { ListFilter, Pencil, PlusCircle, Receipt, SearchIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "../auth-provider";

export default function PNBP() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [pnbp, setPnbp] = useState<Pnbp[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });

  const fetchPNBP = useCallback(async (page?: number, search?: string, status?: string) => {
    setLoading(true);
    try {
      const result: PaginatedPNBP = await getPNBP({
        page,
        search,
        status,
      });
      setPnbp(result.data);
      setPagination({
        current_page: result.current_page,
        last_page: result.last_page,
      });
    } catch (error) {
      console.error("Error fetch permohonan:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Sudah Dibayar":
        return "bg-green-500 text-white";
      case "Menunggu Pembayaran":
        return "bg-yellow-500 text-white";
      case "Pembayaran Dibatalkan":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  useEffect(() => {
    if (user?.role !== "superadmin" && user?.role !== "pnbp") {
      logout("/forbidden");
    } else {
      fetchPNBP(1, search || undefined, status === "all" ? undefined : status);
    }
  }, [search, status, fetchPNBP, user?.role, router, logout]);

  return (
    <div className="space-y-8">
      <div className="w-full">
        <Card className="rounded-md">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <ButtonGroup className="flex flex-col lg:flex-row w-full lg:w-auto">
                  <Input
                    placeholder="Cari kuitansi perusahaan..."
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
                      <SelectItem value="Sudah Dibayar">Sudah Dibayar</SelectItem>
                      <SelectItem value="Menunggu Pembayaran">Menunggu Pembayaran</SelectItem>
                      <SelectItem value="Pembayaran Dibatalkan">Pembayaran Dibatalkan</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Button
                size="sm"
                className="flex items-center gap-2 px-6 shadow-sm hover:shadow-md transition cursor-pointer w-full lg:w-auto"
                onClick={() => router.push("/admin/pnbp/management")}>
                <PlusCircle className="h-5 w-5" />
                <span className="font-semibold">Buat Kuitansi PNBP</span>
              </Button>
            </div>

            {/* Employee Table */}
            <Table className="border">
              <TableHeader className="bg-primary">
                <TableRow>
                  <TableHead className="text-center text-primary-foreground w-24">No PNBP</TableHead>
                  <TableHead className="text-center text-primary-foreground w-24">Kode Permohonan</TableHead>
                  <TableHead className="text-center text-primary-foreground w-24">Tanggal Kuitansi</TableHead>
                  <TableHead className="text-center text-primary-foreground w-24">Total Jasa Lab</TableHead>
                  <TableHead className="text-center text-primary-foreground w-24">No Bil</TableHead>
                  <TableHead className="text-center text-primary-foreground w-24">NTPN</TableHead>
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
                ) : pnbp.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                      Tidak ada data kuitansi PNBP
                    </TableCell>
                  </TableRow>
                ) : (
                  pnbp.map((pnbp) => (
                    <TableRow key={pnbp.id}>
                      <TableCell className="text-center text-xs">{pnbp.no_pnbp}</TableCell>
                      <TableCell className="text-center text-xs">{pnbp.kode_permohonan}</TableCell>
                      <TableCell className="text-center text-xs">{pnbp.tanggal_pnbp}</TableCell>
                      <TableCell className="text-center text-xs">{pnbp.total_nominal}</TableCell>
                      <TableCell className="text-center text-xs">{pnbp.no_bil ?? "-"}</TableCell>
                      <TableCell className="text-center text-xs">{pnbp.ntpn ?? "-"}</TableCell>
                      <TableCell className="text-center text-xs">
                        <Badge className={`text-xs px-3 py-1 rounded-lg font-semibold ${getStatusBadgeColor(pnbp.status)}`}>{pnbp.status}</Badge>
                      </TableCell>
                      <TableCell className="text-center text-xs">
                        <div className="flex justify-center items-center gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="default"
                                disabled={pnbp.status !== "Sudah Dibayar"}
                                size="icon-sm"
                                onClick={() => router.push(`/pdf/kuitansi?id=${pnbp.id}`)}>
                                <Receipt className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Cetak Kuitansi PNBP</TooltipContent>
                          </Tooltip>
                          {pnbp.status !== "Sudah Dibayar" && (
                            <>
                              {/* Edit Button */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="default"
                                    size="icon-sm"
                                    className="bg-yellow-500 hover:bg-yellow-700"
                                    onClick={() => router.push(`/admin/pnbp/management?id=${pnbp.id}`)}>
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit Kuitansi PNBP</TooltipContent>
                              </Tooltip>

                              {/* Delete Button */}
                              <Tooltip>
                                <DeleteDialog
                                  trigger={
                                    <TooltipTrigger asChild>
                                      <Button variant="destructive" size="icon" className="hover:bg-red-700">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                  }
                                  endpoint={`/pnbp/${pnbp.id}`}
                                  successMessage="Data kuitansi berhasil dihapus"
                                  onSuccess={() => fetchPNBP(pagination.current_page)}
                                />
                                <TooltipContent>Hapus data kuitansi PNBP</TooltipContent>
                              </Tooltip>
                            </>
                          )}
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
                        fetchPNBP(pagination.current_page - 1, search, status);
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
                          fetchPNBP(pageNum, search, status);
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
                        fetchPNBP(pagination.current_page + 1, search, status);
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
