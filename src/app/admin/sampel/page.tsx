"use client";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getSampel } from "@/services/sampelService";
import { getSurat } from "@/services/suratService";
import { PaginatedSampel, Sampel } from "@/types/sampel";
import { PaginatedSurat } from "@/types/surat";

import { ClipboardList, Eye, Pencil, Plus, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

export default function SampelPage() {
  const [sampel, setSampel] = useState<Sampel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [query, setQuery] = useState({
    search: "",
  });

  const fetchSampel = useCallback(async (page: number, search?: string) => {
    setLoading(true);
    try {
      const result: PaginatedSampel = await getSampel({
        page,
        search,
      });
      setSampel(result.data);
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

  const handleCetak = async (sampelId: number, permohonan_id?: number) => {
    try {
      const result: PaginatedSurat = await getSurat({
        permohonan_id: permohonan_id,
        perihal: "Laporan Hasil Uji Laboratorium",
      });

      if (result.data.length === 0) {
        toast.error("Surat tugas untuk Laporan Hasil Uji belum dibuat.");
        return;
      }

      const hashedId = btoa(String(sampelId));
      router.push(`/pdf/hasil-uji-preview?id=${encodeURIComponent(hashedId)}`);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat memeriksa surat.");
    }
  };

  useEffect(() => {
    fetchSampel(1, query.search || undefined);
  }, [query.search, fetchSampel]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setQuery({
        search: search,
      });
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  return (
    <div>
      <Card className="rounded-md">
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between mb-4 ">
            <ButtonGroup className="flex flex-col lg:flex-row w-full lg:w-auto">
              <Input
                placeholder="Cari berdasarkan nama sampel..."
                className="w-full lg:w-60 xl:w-70"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button variant="default" aria-label="Search">
                <SearchIcon />
              </Button>
            </ButtonGroup>
            <Button
              onClick={() => router.push("/admin/sampel/management")}
              size="sm"
              className="flex items-center gap-2 px-6 shadow-sm hover:shadow-md transition cursor-pointer w-full lg:w-auto">
              <Plus className="h-5 w-5" />
              <span className="font-semibold">Tambah sampel</span>
            </Button>
          </div>

          {/* Employee Table */}
          <Table className="border">
            <TableHeader className="bg-primary">
              <TableRow>
                <TableHead className="text-center text-primary-foreground w-24">Kode Sampel</TableHead>
                <TableHead className="text-center text-primary-foreground w-24">Nama Sampel</TableHead>
                <TableHead className="text-center text-primary-foreground w-32">Laboratorium</TableHead>
                <TableHead className="text-center text-primary-foreground w-24">Tanggal Pengujian</TableHead>
                <TableHead className="text-center text-primary-foreground w-24">Tanggal Penandatanganan</TableHead>
                <TableHead className="text-center text-primary-foreground w-32">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ) : sampel.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    Tidak ada data sampel
                  </TableCell>
                </TableRow>
              ) : (
                sampel.map((sampel) => (
                  <TableRow key={sampel.id}>
                    <TableCell className="text-center text-xs">{sampel.kode_sampel}</TableCell>
                    <TableCell className="text-center text-xs">{sampel.nama_sampel}</TableCell>
                    <TableCell className="text-center text-xs">
                      {sampel.laboratorium?.nama_laboratorium} - {sampel.laboratorium?.klasifikasi}
                    </TableCell>
                    <TableCell className="text-center text-xs">
                      {sampel.tanggal_pengujian ? new Date(sampel.tanggal_pengujian).toLocaleDateString("id-ID") : "Belum Dilakukan Pengujian"}
                    </TableCell>
                    <TableCell className="text-center text-xs">
                      {sampel.tanggal_penandatanganan
                        ? new Date(sampel.tanggal_penandatanganan).toLocaleDateString("id-ID")
                        : "Belum Dilakukan Penandatanganan"}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center items-center gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="default"
                              size="icon-sm"
                              disabled={!sampel.tanggal_penandatanganan}
                              onClick={() => handleCetak(sampel.id, sampel.permohonan?.id)}>
                              <ClipboardList className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Cetak Surat Hasil Uji</TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="default" size="icon-sm" onClick={() => router.push(`/admin/sampel/detail?id=${sampel.id}`)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Detail Sampel</TooltipContent>
                        </Tooltip>

                        {(!sampel.tanggal_penandatanganan || !sampel.hasil_uji?.every((h) => h.status === "Selesai")) && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="default"
                                size="icon-sm"
                                className="bg-yellow-500 hover:bg-yellow-700"
                                onClick={() => router.push(`/admin/sampel/management?id=${sampel.id}`)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Ubah Data Sampel</TooltipContent>
                          </Tooltip>
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
                      fetchSampel(pagination.current_page - 1, search);
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
                        fetchSampel(pageNum, search);
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
                      fetchSampel(pagination.current_page + 1, search);
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
