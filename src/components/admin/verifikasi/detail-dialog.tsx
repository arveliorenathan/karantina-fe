"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CheckCircle, FileText, FlaskConical, Package, X } from "lucide-react";
import { Sampel } from "@/types/sampel";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { updateHasilUji } from "@/services/hasilUjiService";
import { useRouter } from "next/navigation";

interface DetailDialogProps {
  title: string;
  trigger: React.ReactNode;
  sampel: Sampel;
  onSuccess?: () => void;
}

export default function DetailDialog({ title, trigger, sampel, onSuccess }: DetailDialogProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [hasilUjiStatus, setHasilUjiStatus] = useState<{ id: number; status: string }[]>(
    sampel.hasil_uji?.map((h) => ({ id: h.id, status: h.status || "Menunggu Verifikasi" })) || [],
  );
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [loadingAll, setLoadingAll] = useState(false);

  // Update satu hasil uji dengan loading
  const handleUpdateStatus = async (id: number, status: "Selesai" | "Revisi LHU") => {
    try {
      setLoadingId(id);

      setHasilUjiStatus((prev) => prev.map((h) => (h.id === id ? { ...h, status } : h)));

      await updateHasilUji(id, { status });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Gagal update status", error);
      // Rollback on error
      setHasilUjiStatus(sampel.hasil_uji?.map((h) => ({ id: h.id, status: h.status || "Menunggu Verifikasi" })) || []);
    } finally {
      setLoadingId(null);
    }
  };

  // Update semua hasil uji dengan loading
  const handleUpdateAllStatus = async (status: "Selesai" | "Revisi LHU") => {
    try {
      setLoadingAll(true);
      const ids = sampel.hasil_uji?.map((h) => h.id) || [];

      setHasilUjiStatus((prev) => prev.map((h) => ({ ...h, status })));

      for (const id of ids) {
        await updateHasilUji(id, { status });
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Gagal update semua status", error);
      // Rollback on error
      setHasilUjiStatus(sampel.hasil_uji?.map((h) => ({ id: h.id, status: h.status || "Menunggu Verifikasi" })) || []);
    } finally {
      setLoadingAll(false);
    }
  };

  // Handle dialog close with refresh
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && onSuccess) {
      onSuccess();
    }
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="w-4xl max-w-[90vw] rounded-2xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-slate-900">{title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Informasi Sampel */}
            <Card className="shadow-md rounded-xl border border-gray-100">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2 ">
                  <Package className="h-5 w-5 text-primary" />
                  Informasi Sampel
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Nama Sampel</p>
                  <p className="font-medium text-slate-900">{sampel?.nama_sampel}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Spesies</p>
                  <p className="font-medium text-slate-900">{sampel?.spesies}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Jumlah</p>
                  <p className="font-medium text-slate-900">
                    {sampel?.jumlah} {sampel?.satuan}
                  </p>
                </div>
                <div className="sm:col-span-3">
                  <p className="text-xs text-muted-foreground">Laboratorium</p>
                  <p className="font-medium text-slate-900">{sampel?.laboratorium?.nama_laboratorium}</p>
                </div>
              </CardContent>
            </Card>

            {/* Hasil Pengujian */}
            <Card className="shadow-md rounded-xl border border-gray-100">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2 ">
                  <FlaskConical className="h-5 w-5 text-primary" />
                  Hasil Pengujian
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-4">
                <Table className="rounded-sm overflow-hidden">
                  <TableHeader className="bg-primary">
                    <TableRow>
                      <TableHead className="text-center w-1/6 text-white">Parameter Uji</TableHead>
                      <TableHead className="text-center w-1/6 text-white">Hasil</TableHead>
                      <TableHead className="text-center w-1/3 text-white">Keterangan</TableHead>
                      <TableHead className="text-center w-1/6 text-white">Status</TableHead>
                      <TableHead className="text-center w-1/6 text-white">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="border">
                    {sampel.hasil_uji?.map((hasil) => {
                      const currentStatus = hasilUjiStatus.find((h) => h.id === hasil.id)?.status || hasil.status;
                      return (
                        <TableRow key={hasil.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell className="text-center text-xs">{hasil.parameter?.nama_parameter}</TableCell>
                          <TableCell className="text-center text-xs">{hasil.hasil}</TableCell>
                          <TableCell className="text-center text-xs">{hasil.keterangan}</TableCell>
                          <TableCell className="text-center text-xs">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                currentStatus === "Selesai"
                                  ? "bg-green-100 text-green-700"
                                  : currentStatus === "Revisi LHU"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-yellow-100 text-yellow-700"
                              }`}>
                              {currentStatus || "Menunggu Verifikasi"}
                            </span>
                          </TableCell>
                          <TableCell className="text-center text-xs space-x-2">
                            <Button
                              size="icon-sm"
                              className="bg-green-500 text-white hover:bg-green-600 transition-colors"
                              disabled={loadingId === hasil.id || currentStatus === "Selesai"}
                              onClick={() => handleUpdateStatus(hasil.id, "Selesai")}>
                              {loadingId === hasil.id ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              size="icon-sm"
                              variant="destructive"
                              disabled={loadingId === hasil.id || currentStatus === "Revisi LHU"}
                              onClick={() => handleUpdateStatus(hasil.id, "Revisi LHU")}>
                              {loadingId === hasil.id ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                              ) : (
                                <X className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Kesimpulan */}
            <Card className="shadow-md rounded-xl border border-gray-100">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2 ">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Kesimpulan Hasil Pengujian
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-4">
                <p className="text-sm">{sampel.kesimpulan || "-"}</p>
              </CardContent>
            </Card>

            {/* Tombol aksi */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Button
                className="flex items-center justify-center gap-2 border transition-colors"
                onClick={() => router.push(`/admin/verifikasi/hasil-uji-sementara?id=${sampel.id}`)}>
                <FileText className="h-4 w-4" />
                Lihat LHU Sementara
              </Button>

              <Button
                className="flex items-center justify-center gap-2 bg-green-500 text-white hover:bg-green-600 transition-colors"
                disabled={loadingAll}
                onClick={() => handleUpdateAllStatus("Selesai")}>
                {loadingAll ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Terima Seluruh Hasil Uji
              </Button>

              <Button
                variant="destructive"
                className="flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
                disabled={loadingAll}
                onClick={() => handleUpdateAllStatus("Revisi LHU")}>
                {loadingAll ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <X className="h-4 w-4" />
                )}
                Tolak Semua Hasil Uji
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
