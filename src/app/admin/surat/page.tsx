"use client";
import DeleteDialog from "@/components/admin/delete-dialog";
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
import { getSurat } from "@/services/suratService";
import { PaginatedSurat, Surat } from "@/types/surat";
import { SearchIcon, Pencil, Trash2, PlusCircle, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

export default function SuratPage() {
  const [surat, setSurat] = useState<Surat[]>([]);
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

  const fetchSurat = useCallback(async (page: number, search?: string) => {
    setLoading(true);
    try {
      const result: PaginatedSurat = await getSurat({
        page,
        search,
      });
      setSurat(result.data);
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

  useEffect(() => {
    fetchSurat(1, query.search || undefined);
  }, [query.search, fetchSurat]);

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
      {/* Data Section */}
      <div className="w-full">
        <Card className="rounded-md">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between mb-4 ">
              <ButtonGroup className="flex flex-col lg:flex-row w-full lg:w-auto">
                <Input
                  placeholder="Cari surat berdasarkan nomor surat..."
                  className="w-full lg:w-64 xl:w-80"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="default" aria-label="Search">
                  <SearchIcon />
                </Button>
              </ButtonGroup>

              <Button
                size="sm"
                onClick={() => router.push("/admin/surat/management")}
                className="flex items-center gap-2 px-6 shadow-sm hover:shadow-md transition cursor-pointer w-full lg:w-auto">
                <PlusCircle className="h-5 w-5" />
                <span className="font-semibold">Tambah surat</span>
              </Button>
            </div>

            {/* Employee Table */}
            <Table className="border">
              <TableHeader className="bg-primary">
                <TableRow>
                  <TableHead className="text-center text-primary-foreground">Nomor Surat</TableHead>
                  <TableHead className="text-center text-primary-foreground">Kode Permohonan</TableHead>
                  <TableHead className="text-center text-primary-foreground">Perihal</TableHead>
                  <TableHead className="text-center text-primary-foreground">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ) : surat.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                      Tidak ada data surat
                    </TableCell>
                  </TableRow>
                ) : (
                  surat.map((surat) => (
                    <TableRow key={surat.id}>
                      <TableCell className="text-center text-xs">{surat.nomor_surat}</TableCell>
                      <TableCell className="text-center text-xs">{surat.permohonan?.kode_permohonan}</TableCell>
                      <TableCell className="text-center text-xs">{surat.perihal}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center items-center gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon-sm"
                                onClick={() => {
                                  const hashedId = btoa(String(surat.id));
                                  router.push(`/pdf/surat-tugas?id=${encodeURIComponent(hashedId)}`);
                                }}>
                                <FileText className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Cetak Surat Tugas</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="default"
                                size="icon-sm"
                                className="bg-yellow-500 hover:bg-yellow-700"
                                onClick={() => router.push(`/admin/surat/management?id=${surat.id}`)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Perbarui Data Surat Tugas</TooltipContent>
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
                              endpoint={`/surat/${surat.id}`}
                              successMessage="Data surat berhasil dihapus"
                              onSuccess={() => fetchSurat(pagination.current_page)}
                            />
                            <TooltipContent>Hapus Data Surat Tugas</TooltipContent>
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
                        fetchSurat(1, search);
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
                          fetchSurat(pagination.current_page - 1, search);
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
                        fetchSurat(pagination.current_page - 1, search);
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
