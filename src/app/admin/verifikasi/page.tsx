"use client";

import DetailDialog from "@/components/admin/verifikasi/detail-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getSampel } from "@/services/sampelService";
import { PaginatedSampel, Sampel } from "@/types/sampel";
import { Eye, ListFilter, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../auth-provider";
import { useRouter } from "next/navigation";

export default function Verifikasi() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [klasifikasi, setKlasifikasi] = useState("");
  const [loading, setLoading] = useState(false);
  const [sampel, setSampel] = useState<Sampel[]>([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });
  const [showTable, setShowTable] = useState(false);

  const fetchSampel = async (page: number, status: string = "Menunggu Verifikasi", klasifikasiFilter: string = "", searchFilter: string = "") => {
    setLoading(true);
    try {
      const result: PaginatedSampel = await getSampel({
        page,
        status,
        klasifikasi: klasifikasiFilter,
        search: searchFilter,
      });

      setSampel(result.data ?? []);
      setPagination({
        current_page: result.current_page,
        last_page: result.last_page,
      });
      setShowTable(true); // tampilkan tabel setelah fetch
    } catch (error) {
      console.error("Error fetch permohonan:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role !== "analis" && user?.role !== "superadmin") {
      logout("/forbidden");
    }
  }, [search, klasifikasi, user?.role, router, logout]);

  return (
    <div className="space-y-4">
      {/* Filter Section */}
      <Card>
        <CardContent>
          <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-4">
            <Input
              placeholder="Cari berdasarkan kode sampel..."
              className="w-full lg:w-60 xl:w-70"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Select value={klasifikasi} onValueChange={setKlasifikasi}>
              <SelectTrigger className="w-56 cursor-pointer">
                <div className="flex items-center gap-2">
                  <ListFilter className="h-4 w-4 text-gray-500" />
                  <SelectValue placeholder="Semua Klasifikasi" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Klasifikasi Laboratorium</SelectLabel>
                  <SelectItem value="KH">Karantina Hewan</SelectItem>
                  <SelectItem value="KI">Karantina Ikan</SelectItem>
                  <SelectItem value="KT">Karantina Tumbuhan</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button onClick={() => fetchSampel(1, "Menunggu Verifikasi", klasifikasi, search)} className="flex items-center gap-2">
              <SearchIcon />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table Section */}
      {showTable && (
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
                  sampel.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="text-center text-xs">{item.kode_sampel}</TableCell>
                      <TableCell className="text-center text-xs">{item.nama_sampel}</TableCell>
                      <TableCell className="text-center text-xs">{item.permohonan?.nama_perusahaan}</TableCell>
                      <TableCell className="text-center text-xs">
                        <Badge>{item.laboratorium?.nama_laboratorium}</Badge>
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
                            sampel={item}
                            onSuccess={() => fetchSampel(pagination.current_page, "Menunggu Verifikasi", klasifikasi, search)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (pagination.current_page > 1) {
                        fetchSampel(pagination.current_page - 1, "Menunggu Verifikasi", klasifikasi, search);
                      }
                    }}
                    className={pagination.current_page === 1 ? "cursor-not-allowed opacity-50" : ""}
                  />
                </PaginationItem>

                {[...Array(pagination.last_page)].map((_, index) => {
                  const pageNum = index + 1;
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          fetchSampel(pageNum, "Menunggu Verifikasi", klasifikasi, search);
                        }}
                        isActive={pageNum === pagination.current_page}>
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                {pagination.current_page < pagination.last_page - 1 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (pagination.current_page < pagination.last_page) {
                        fetchSampel(pagination.current_page + 1, "Menunggu Verifikasi", klasifikasi, search);
                      }
                    }}
                    className={pagination.current_page === pagination.last_page ? "cursor-not-allowed opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
