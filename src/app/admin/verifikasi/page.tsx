"use client";
import DetailDialog from "@/components/admin/verifikasi/detail-dialog";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getSampel } from "@/services/sampelService";
import { PaginatedSampel, Sampel } from "@/types/sampel";
import { Eye, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Verifikasi() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [sampel, setSampel] = useState<Sampel[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });

  const fetchSampel = async (page: number, status: string) => {
    setLoading(true);
    try {
      const result: PaginatedSampel = await getSampel({
        status: status,
      });
      setSampel(result.data);
      setPagination({
        current_page: result.current_page,
        last_page: result.last_page,
      });
      console.log(result.data);
    } catch (error) {
      console.error("Error fetch permohonan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSampel(1, "Menunggu Verifikasi");
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent>
          <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <ButtonGroup>
              <Input
                placeholder="Cari berdasarkan nama sampel..."
                className="w-full lg:w-60 xl:w-70"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button variant="default" aria-label="Search" className="w-full lg:w-auto">
                <SearchIcon />
              </Button>
            </ButtonGroup>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <Table className="border">
            <TableHeader className="bg-primary">
              <TableRow>
                <TableHead className="text-center text-primary-foreground w-1/6">Kode Sampel</TableHead>
                <TableHead className="text-center text-primary-foreground w-1/6">Nama Sampel</TableHead>
                <TableHead className="text-center text-primary-foreground w-1/6">Perusahaan</TableHead>
                <TableHead className="text-center text-primary-foreground w-1/6">Laboratorium</TableHead>
                <TableHead className="text-center text-primary-foreground w-1/6">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                </TableRow>
              ) : sampel.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                    Tidak ada data pengajuan verifikasi
                  </TableCell>
                </TableRow>
              ) : (
                sampel.map((sampel) => (
                  <TableRow key={sampel.id}>
                    <TableCell className="text-center text-xs">{sampel?.kode_sampel}</TableCell>
                    <TableCell className="text-center text-xs">{sampel?.nama_sampel}</TableCell>
                    <TableCell className="text-center text-xs">{sampel.permohonan?.nama_perusahaan}</TableCell>
                    <TableCell className="text-center text-xs">
                      <Badge>{sampel.laboratorium?.nama_laboratorium}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="space-x-2 flex justify-center items-center">
                        <DetailDialog
                          title="Detail Hasil Pengujian Sampel"
                          trigger={
                            <Button size={"icon-sm"} className="text-xs">
                              <Eye className="h-4 w-4" />
                            </Button>
                          }
                          sampel={sampel}
                          onSuccess={() => fetchSampel(pagination.current_page, "Menunggu Verifikasi")}
                        />
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
                      fetchSampel(pagination.current_page - 1, "Menunggu Verifikasi");
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
                        fetchSampel(pageNum, "Menunggu Verifikasi");
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
                      fetchSampel(pagination.current_page + 1, "Menunggu Verifikasi");
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
