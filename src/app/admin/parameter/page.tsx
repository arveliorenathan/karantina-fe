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
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getParameter } from "@/services/parameterService";
import { PaginatedParameter, Parameter } from "@/types/parameter";
import { SearchIcon, Pencil, Eye, Plus, ListFilter, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../auth-provider";

export default function ParameterPage() {
  const { user } = useAuth();
  const [parameter, setParameter] = useState<Parameter[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [klasifikasi, setKlasifikasi] = useState("");
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });
  const router = useRouter();

  const fetchParameter = useCallback(async (page: number, search?: string, klasifikasi?: string) => {
    setLoading(true);
    try {
      const result: PaginatedParameter = await getParameter({
        page,
        search,
        klasifikasi,
      });
      setParameter(result.data);
      setPagination({
        current_page: result.current_page,
        last_page: result.last_page,
      });
    } catch (error) {
      console.error("Error fetching parameters:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchParameter(1, search || undefined, klasifikasi === "all" ? undefined : klasifikasi);
  }, [search, klasifikasi, fetchParameter]);

  const getBadgeClass = (klasifikasi: string) => {
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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Tersedia":
        return "bg-green-500 text-white";
      case "Tidak Tersedia":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  return (
    <div>
      {/* Data Section */}
      <div className="w-full">
        <Card className="rounded-md">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <ButtonGroup className="flex flex-col lg:flex-row w-full lg:w-auto">
                  <Input
                    placeholder="Cari parameter berdasarkan nama..."
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
                      <SelectLabel>Klasifikasi Parameter</SelectLabel>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="KH">Hewan</SelectItem>
                      <SelectItem value="KI">Ikan</SelectItem>
                      <SelectItem value="KT">Tumbuhan</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              {user?.role === "superadmin" && (
                <Button
                  size="sm"
                  onClick={() => router.push("/admin/parameter/management")}
                  className="flex items-center gap-2 px-6 shadow-sm hover:shadow-md transition cursor-pointer w-full lg:w-auto">
                  <Plus className="h-5 w-5" />
                  <span className="font-semibold">Tambah parameter</span>
                </Button>
              )}
            </div>

            {/* Parameter Table */}
            <div className="overflow-x-auto">
              <Table className="border">
                <TableHeader className="bg-primary">
                  <TableRow>
                    <TableHead className="text-center text-primary-foreground w-20 whitespace-nowrap">Kode</TableHead>
                    <TableHead className="text-center text-primary-foreground w-16">Nama</TableHead>
                    <TableHead className="text-center text-primary-foreground w-24 whitespace-nowrap">Standar</TableHead>
                    <TableHead className="text-center text-primary-foreground w-16 whitespace-nowrap">Metode</TableHead>
                    <TableHead className="text-center text-primary-foreground w-28 whitespace-nowrap">Akreditasi</TableHead>
                    <TableHead className="text-center text-primary-foreground w-32 whitespace-nowrap">PNBP</TableHead>
                    <TableHead className="text-center text-primary-foreground w-24 whitespace-nowrap">Klasifikasi</TableHead>
                    <TableHead className="text-center text-primary-foreground w-24 whitespace-nowrap">Status</TableHead>
                    <TableHead className="text-center text-primary-foreground w-32 whitespace-nowrap">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                      </TableCell>
                    </TableRow>
                  ) : parameter.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center py-12 text-muted-foreground">
                        Tidak ada data parameter
                      </TableCell>
                    </TableRow>
                  ) : (
                    parameter.map((parameter) => (
                      <TableRow key={parameter.id}>
                        <TableCell className="text-center text-xs whitespace-nowrap">{parameter.kode_parameter}</TableCell>
                        <TableCell className="text-center text-xs">{parameter.nama_parameter}</TableCell>
                        <TableCell className="text-center text-xs">{parameter.satuan_parameter}</TableCell>
                        <TableCell className="text-center text-xs">{parameter.metode_pengujian}</TableCell>
                        <TableCell className="text-center">
                          <Badge className="text-xs px-3 py-1">{parameter.keterangan_parameter}</Badge>
                        </TableCell>
                        <TableCell className="text-center text-xs whitespace-nowrap">
                          Rp. {Number(parameter.estimasi_pnbp).toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={`text-xs px-3 py-1 rounded-lg font-semibold ${getBadgeClass(parameter.klasifikasi_parameter)}`}>
                            {parameter.klasifikasi_parameter}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={`text-xs px-3 py-1 rounded-lg font-semibold ${getStatusBadgeClass(parameter.status)}`}>
                            {parameter.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center items-center gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="default" size="icon-sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Lihat Detail Data Parameter</TooltipContent>
                            </Tooltip>
                            {user?.role === "superadmin" && (
                              <>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="default"
                                      size="icon-sm"
                                      className="bg-yellow-500 hover:bg-yellow-700"
                                      onClick={() => router.push(`/admin/parameter/management?id=${parameter.id}`)}>
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Edit Data Parameter</TooltipContent>
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
                                    endpoint={`/parameter/${parameter.id}`}
                                    successMessage="Data laboratorium berhasil dihapus"
                                    onSuccess={() => fetchParameter(pagination.current_page)}
                                  />
                                  <TooltipContent>Hapus Data Parameter</TooltipContent>
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
            </div>
            <Pagination>
              <PaginationContent>
                {/* Previous Button */}
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (pagination.current_page > 1) {
                        fetchParameter(pagination.current_page + 1, search, klasifikasi);
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
                          fetchParameter(pageNum, search, klasifikasi);
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
                        fetchParameter(pagination.current_page + 1, search, klasifikasi);
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
