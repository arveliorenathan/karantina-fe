"use client";
import DeleteDialog from "@/components/admin/delete-dialog";
import LaboratoriumDialog from "@/components/admin/laboratorium/laboratorium-dialog";
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
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getLaboratorium } from "@/services/laboratoriumService";
import { getPegawai } from "@/services/pegawaiService";
import { Laboratorium, PaginatedLaboratorium } from "@/types/laboratorium";
import { PaginatedPegawai, Pegawai } from "@/types/pegawai";
import { SearchIcon, UserPlus, Pencil, Trash2, ListFilter, Eye } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function LaboratoriumPage() {
  const [laboratorium, setLaboratorium] = useState<Laboratorium[]>([]);
  const [pegawai, setPegawai] = useState<Pegawai[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [klasifikasi, setKlasifikasi] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });

  const fetchPegawai = useCallback(async () => {
    setLoading(true);
    try {
      const result: PaginatedPegawai = await getPegawai({
        status: "Aktif",
        limit: 0,
      });
      setPegawai(result.data);
    } catch (error) {
      console.error("Error fetch pegawai:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLaboratorium = useCallback(async (page: number, search?: string, status?: string, klasifikasi?: string) => {
    setLoading(true);
    try {
      const result: PaginatedLaboratorium = await getLaboratorium({
        page,
        search,
        status,
        klasifikasi,
      });
      setLaboratorium(result.data);
      setPagination({
        current_page: result.current_page,
        last_page: result.last_page,
      });
    } catch (error) {
      console.error("Error fetch laboratorium:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLaboratorium(1, search, status, klasifikasi);
    fetchPegawai();
  }, [search, status, klasifikasi, fetchLaboratorium, fetchPegawai]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Aktif":
        return "bg-green-500 text-white";
      case "Non Aktif":
        return "bg-red-500 text-white";
      case "Perbaikan":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const getKlasifikasiBadgeColor = (klasifikasi: string) => {
    switch (klasifikasi) {
      case "KH":
        return "bg-purple-500 text-white";
      case "KI":
        return "bg-blue-500 text-white";
      case "KT":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  return (
    <div>
      {/* Table Section */}
      <div className="w-full">
        <Card className="rounded-md">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between mb-4 ">
              <div className="flex items-center gap-4">
                <ButtonGroup className="flex flex-col lg:flex-row w-full lg:w-auto">
                  <Input
                    placeholder="Cari pegawai berdasarkan nama..."
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
                      <SelectLabel>Status Laboratorium</SelectLabel>
                      <SelectItem value="Aktif">Aktif</SelectItem>
                      <SelectItem value="Perbaikan">Perbaikan</SelectItem>
                      <SelectItem value="Non Aktif">Non Aktif</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>

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
              </div>
              <LaboratoriumDialog
                title="Tambah Data Laboratorium"
                trigger={
                  <Button size="sm" className="flex items-center gap-2 px-6 shadow-sm hover:shadow-md transition cursor-pointer w-full lg:w-auto">
                    <UserPlus className="h-5 w-5" />
                    <span className="font-semibold">Tambah Laboratorium</span>
                  </Button>
                }
                pegawaiList={pegawai}
                method="create"
                onSuccess={() => fetchLaboratorium(pagination.current_page)}
              />
            </div>

            <Table className="border">
              <TableHeader className="bg-primary">
                <TableRow>
                  <TableHead className="text-center text-primary-foreground">Nama Laboratorium</TableHead>
                  <TableHead className="text-center text-primary-foreground">Nama Kantor</TableHead>
                  <TableHead className="text-center text-primary-foreground">Alamat</TableHead>
                  <TableHead className="text-center text-primary-foreground">Kontak</TableHead>
                  <TableHead className="text-center text-primary-foreground">Penanggung Jawab</TableHead>
                  <TableHead className="text-center text-primary-foreground">Klasifikasi</TableHead>
                  <TableHead className="text-center text-primary-foreground">Status</TableHead>
                  <TableHead className="text-center text-primary-foreground">Aksi</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ) : laboratorium.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                      Tidak ada data laboratorium
                    </TableCell>
                  </TableRow>
                ) : (
                  laboratorium?.map((laboratorium) => (
                    <TableRow key={laboratorium.id}>
                      <TableCell className="text-center text-xs">{laboratorium.nama_laboratorium}</TableCell>
                      <TableCell className="text-center text-xs">{laboratorium.nama_kantor}</TableCell>
                      <TableCell className="text-center text-xs">{laboratorium.alamat}</TableCell>
                      <TableCell className="text-center text-xs">{laboratorium.kontak}</TableCell>
                      <TableCell className="text-center text-xs">{laboratorium.pegawai?.nama_pegawai}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={`text-xs px-3 py-1 rounded-lg font-semibold ${getKlasifikasiBadgeColor(laboratorium.klasifikasi)}`}>
                          {laboratorium.klasifikasi}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={`text-xs px-3 py-1 rounded-lg font-semibold ${getStatusBadgeColor(laboratorium.status)}`}>
                          {laboratorium.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center items-center gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="default" size="icon-sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Lihat Detail Data Laboratorium</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <LaboratoriumDialog
                              title="Perbarui Data Laboratorium"
                              trigger={
                                <TooltipTrigger asChild>
                                  <Button variant="default" size="icon-sm" className="bg-yellow-500 hover:bg-yellow-700">
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                              }
                              pegawaiList={pegawai}
                              method="edit"
                              defaultValue={laboratorium}
                              onSuccess={() => fetchLaboratorium(pagination.current_page)}
                            />
                            <TooltipContent>Perbarui Data Laboratorium</TooltipContent>
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
                              endpoint={`/laboratorium/${laboratorium.id}`}
                              successMessage="Data laboratorium berhasil dihapus"
                              onSuccess={() => fetchLaboratorium(pagination.current_page)}
                            />
                            <TooltipContent>Hapus Data Laboratorium</TooltipContent>
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
                        fetchLaboratorium(pagination.current_page - 1, search, status, klasifikasi);
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
                          fetchLaboratorium(pageNum, search, status, klasifikasi);
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
                        fetchLaboratorium(pagination.current_page + 1, search, status, klasifikasi);
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
