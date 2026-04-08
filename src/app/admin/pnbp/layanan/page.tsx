"use client";
import DeleteDialog from "@/components/admin/delete-dialog";
import TarifDialog from "@/components/admin/layanan/layanan-dialog";
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
import { getTarif } from "@/services/tarifService";
import { PaginatedTarif, Tarif } from "@/types/tarif";
import { ListFilter, Pencil, PlusCircle, SearchIcon, Trash2 } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

export default function DataLayanan() {
  const [tarif, setTarif] = useState<Tarif[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [klasifikasi, setKlasifikasi] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });

  const fetchTarif = useCallback(async (page: number, search?: string, klasifikasi?: string) => {
    setLoading(true);
    try {
      const result: PaginatedTarif = await getTarif({
        page,
        search,
        klasifikasi,
      });
      setTarif(result.data);
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
    fetchTarif(1, search || undefined, klasifikasi === "all" ? undefined : klasifikasi);
  }, [search, klasifikasi, fetchTarif]);

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

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="w-full">
      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <ButtonGroup className="flex flex-col lg:flex-row w-full lg:w-auto">
                <Input
                  placeholder="Cari jenis layanan..."
                  className="w-full lg:w-64 xl:w-80"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Button variant="default" aria-label="Search">
                  <SearchIcon />
                </Button>
              </ButtonGroup>

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
                    <SelectItem value="all">Semua Klasifikasi</SelectItem>
                    <SelectItem value="KH">Karantina Hewan</SelectItem>
                    <SelectItem value="KI">Karantina Ikan</SelectItem>
                    <SelectItem value="KT">Karantina Tumbuhan</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <TarifDialog
              title="Tambah Data Tarif Layanan"
              trigger={
                <Button size="sm" className="flex items-center gap-2 px-6 shadow-sm hover:shadow-md transition cursor-pointer w-full lg:w-auto">
                  <PlusCircle className="h-5 w-5" />
                  <span className="font-semibold">Tambah Data Layanan</span>
                </Button>
              }
              method="create"
              onSuccess={() => fetchTarif(pagination.current_page)}
            />
          </div>

          {/* Employee Table */}
          <Table className="border">
            <TableHeader className="bg-primary">
              <TableRow>
                <TableHead className="text-center text-primary-foreground w-24">Nama Layanan</TableHead>
                <TableHead className="text-center text-primary-foreground w-24">Tarif</TableHead>
                <TableHead className="text-center text-primary-foreground w-24">Satuan</TableHead>
                <TableHead className="text-center text-primary-foreground w-24">Klasifikasi</TableHead>
                <TableHead className="text-center text-primary-foreground w-24">Aksi</TableHead>
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
              ) : tarif.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    Tidak ada data tarif layanan
                  </TableCell>
                </TableRow>
              ) : (
                tarif.map((tarif) => (
                  <TableRow key={tarif.id}>
                    <TableCell className="text-left text-xs">{tarif.nama_layanan}</TableCell>
                    <TableCell className="text-center text-xs">{formatRupiah(tarif.tarif)}</TableCell>
                    <TableCell className="text-center text-xs">{tarif.satuan}</TableCell>
                    <TableCell className="text-center text-xs">
                      <Badge className={`text-xs px-3 py-1 rounded-lg font-semibold ${getKlasifikasiBadgeColor(tarif.klasifikasi)}`}>
                        {tarif.klasifikasi}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center items-center gap-2">
                        <Tooltip>
                          <TarifDialog
                            title="Edit Data Pegawai"
                            trigger={
                              <TooltipTrigger asChild>
                                <Button variant="default" size="icon-sm" className="bg-yellow-500 hover:bg-yellow-700">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                            }
                            method="edit"
                            defaultValue={tarif}
                            onSuccess={() => fetchTarif(pagination.current_page)}
                          />
                          <TooltipContent>Perbarui Data Tarif Layanan</TooltipContent>
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
                            endpoint={`/tarif/${tarif.id}`}
                            successMessage="Data layanan berhasil dihapus"
                            onSuccess={() => fetchTarif(pagination.current_page)}
                          />
                          <TooltipContent>Hapus Data Tarif Layanan</TooltipContent>
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
                      fetchTarif(pagination.current_page - 1, search, klasifikasi);
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
                        fetchTarif(pageNum, search, klasifikasi);
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
                      fetchTarif(pagination.current_page + 1, search, klasifikasi);
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
