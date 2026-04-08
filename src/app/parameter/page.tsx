"use client";
import NavigationBar from "@/components/navigation-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, PackageSearch, Search, TestTube } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useCallback, useEffect, useState } from "react";
import { PaginatedParameter, Parameter } from "@/types/parameter";
import { getParameter } from "@/services/parameterService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/footer";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function KetersediaanParameter() {
  const [parameter, setParameter] = useState<Parameter[]>([]);
  const [search, setSearch] = useState("");
  const [klasifikasi, setKlasifikasi] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedParams, setSelectedParams] = useState<Map<number, number>>(new Map());
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
  });

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

  const handleSelectParameter = (param: Parameter) => {
    if (param.status !== "Tersedia") return;

    setSelectedParams((prev) => {
      const newMap = new Map(prev);
      const currentQty = newMap.get(param.id) || 0;
      if (currentQty === 0) {
        newMap.set(param.id, 1);
      } else {
        newMap.delete(param.id);
      }
      return newMap;
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setSelectedParams((prev) => {
      const newMap = new Map(prev);
      const currentQty = newMap.get(id) || 0;
      const newQty = currentQty + delta;

      if (newQty <= 0) {
        newMap.delete(id);
      } else {
        newMap.set(id, newQty);
      }
      return newMap;
    });
  };

  const totalEstimasi = Array.from(selectedParams.entries()).reduce((total, [id, qty]) => {
    const param = parameter.find((p) => p.id === id);
    if (param && param.estimasi_pnbp) {
      const estimasiNumber = typeof param.estimasi_pnbp === "string" ? parseFloat(param.estimasi_pnbp) : param.estimasi_pnbp;
      return total + estimasiNumber * qty;
    }
    return total;
  }, 0);

  return (
    <div>
      <NavigationBar />
      <section className="relative overflow-hidden">
        <section className="mx-auto max-w-7xl px-6 py-10 space-y-8">
          {/* Hero */}
          <div className="text-center space-y-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
              <PackageSearch className="h-7 w-7 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-primary">Ketersediaan Parameter Uji dan Estimasi PNBP</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Melihat ketersediaan parameter uji, serta estimasi PNBP dari setiap parameter uji
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_320px] md:grid-cols-1">
            <Card className="border-2 border-dashed border-primary/20 bg-card shadow-sm">
              <CardContent className="p-6">
                <div className="grid gap-4 sm:grid-cols-[1fr_1fr_auto]">
                  <div className="space-y-2">
                    <Label htmlFor="klasifikasi" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Klasifikasi
                    </Label>
                    <Select value={klasifikasi} onValueChange={setKlasifikasi}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih klasifikasi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="KI">Karantina Ikan</SelectItem>
                          <SelectItem value="KH">Karantina Hewan</SelectItem>
                          <SelectItem value="KT">Karantina Tumbuhan</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kode" className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Search
                    </Label>
                    <Input id="kode" placeholder="Masukan nama parameter uji" value={search} onChange={(e) => setSearch(e.target.value)} />
                  </div>

                  <div className="flex items-end">
                    <Button
                      className="px-6 w-full sm:w-auto"
                      disabled={loading}
                      onClick={() => fetchParameter(1, search || undefined, klasifikasi || undefined)}>
                      <Search className="h-4 w-4 mr-2" />
                      <span>{loading ? "Loading..." : "Search"}</span>
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto mt-8 space-y-4">
                  <Table className="border">
                    <TableHeader className="bg-primary">
                      <TableRow>
                        <TableHead className="text-center text-primary-foreground w-16">Nama</TableHead>
                        <TableHead className="text-center text-primary-foreground w-16 whitespace-nowrap">Metode</TableHead>
                        <TableHead className="text-center text-primary-foreground w-28 whitespace-nowrap">Akreditasi</TableHead>
                        <TableHead className="text-center text-primary-foreground w-32 whitespace-nowrap">Estimasi PNBP</TableHead>
                        <TableHead className="text-center text-primary-foreground w-24 whitespace-nowrap">Status</TableHead>
                        <TableHead className="text-center text-primary-foreground w-24 whitespace-nowrap">Pilih</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <>
                          {[1, 2, 3, 4].map((i) => (
                            <TableRow key={i}>
                              <TableCell colSpan={7} className="text-center">
                                <Skeleton className="h-8 w-full" />
                              </TableCell>
                            </TableRow>
                          ))}
                        </>
                      ) : parameter.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                            Tidak ada data parameter
                          </TableCell>
                        </TableRow>
                      ) : (
                        parameter.map((param) => {
                          const estimasiNumber = typeof param.estimasi_pnbp === "string" ? parseFloat(param.estimasi_pnbp) : param.estimasi_pnbp || 0;

                          return (
                            <TableRow key={param.id}>
                              <TableCell className="text-center text-xs">{param.nama_parameter}</TableCell>
                              <TableCell className="text-center text-xs">{param.metode_pengujian}</TableCell>
                              <TableCell className="text-center text-xs">
                                <Badge>{param.keterangan_parameter}</Badge>
                              </TableCell>
                              <TableCell className="text-center text-xs whitespace-nowrap">Rp. {estimasiNumber.toLocaleString("id-ID")}</TableCell>
                              <TableCell className="text-center">
                                <Badge className={`text-xs px-3 py-1 rounded-lg font-semibold ${getStatusBadgeClass(param.status)}`}>
                                  {param.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-center">
                                <Button
                                  variant={selectedParams.has(param.id) ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => handleSelectParameter(param)}
                                  disabled={param.status !== "Tersedia"}
                                  className="w-full">
                                  {selectedParams.has(param.id) ? "Selected" : "Select"}
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })
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
                                fetchParameter(pagination.current_page + 1, search, klasifikasi);
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
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 shadow-lg shadow-primary/5 h-fit sticky top-4">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calculator className="h-5 w-5 text-primary" />
                  Ringkasan Estimasi
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedParams.size === 0 ? (
                  <div className="py-6 text-center">
                    <TestTube className="mx-auto h-10 w-10 text-muted-foreground/30" />
                    <p className="mt-3 text-sm text-muted-foreground">Pilih parameter uji untuk melihat estimasi biaya</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Array.from(selectedParams.entries()).map(([id, qty]) => {
                      const p = parameter.find((x) => x.id === id);
                      if (!p) return null;
                      const estimasiNumber = typeof p.estimasi_pnbp === "string" ? parseFloat(p.estimasi_pnbp) : p.estimasi_pnbp || 0;
                      const subtotal = estimasiNumber * qty;
                      return (
                        <div key={id} className="flex items-start justify-between gap-2 text-sm">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-foreground">{p.nama_parameter}</span>
                              <div className="flex items-center gap-1">
                                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(id, -1)}>
                                  -
                                </Button>
                                <span className="w-8 text-center text-sm">{qty}</span>
                                <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => updateQuantity(id, 1)}>
                                  +
                                </Button>
                              </div>
                            </div>
                            <span className="block text-xs text-muted-foreground">
                              Rp {estimasiNumber.toLocaleString("id-ID")} × {qty}
                            </span>
                          </div>
                          <span className="font-semibold text-foreground shrink-0">Rp {subtotal.toLocaleString("id-ID")}</span>
                        </div>
                      );
                    })}
                    <div className="border-t pt-3 mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Total Estimasi PNBP</span>
                        <span className="text-xl font-bold text-primary">Rp {totalEstimasi.toLocaleString("id-ID")}</span>
                      </div>
                      <p className="mt-2 text-[10px] text-muted-foreground">*Estimasi biaya dapat berubah sesuai ketentuan yang berlaku</p>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => setSelectedParams(new Map())}>
                      Reset Pilihan
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </section>
      <Footer />
    </div>
  );
}
