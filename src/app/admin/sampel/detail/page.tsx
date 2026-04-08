"use client";

import DeleteDialog from "@/components/admin/delete-dialog";
import HasilUjiDialog from "@/components/admin/hasil_uji/hasil-uji-dialog";
import KesimpulanDialog from "@/components/admin/hasil_uji/kesimpulan-dialog";
import SignatureDialog from "@/components/admin/hasil_uji/signature-dialog";
import { LoadingOverlay } from "@/components/admin/loading-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getHasilUji } from "@/services/hasilUjiService";
import { getParameter } from "@/services/parameterService";
import { getPegawai } from "@/services/pegawaiService";
import { getSampelById } from "@/services/sampelService";
import { HasilUji } from "@/types/hasilUji";
import { PaginatedParameter, Parameter } from "@/types/parameter";
import { PaginatedPegawai, Pegawai } from "@/types/pegawai";
import { Sampel } from "@/types/sampel";
import {
  Building2,
  Calendar,
  Eye,
  FlaskConical,
  Info,
  ListCheck,
  Package,
  Pencil,
  PlusCircle,
  Ruler,
  Scale,
  Signature,
  TestTubeDiagonal,
  Trash2,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function DetailSampel() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [sampel, setSampel] = useState<Sampel>();
  const [hasil, setHasil] = useState<HasilUji[]>([]);
  const [parameter, setParameter] = useState<Parameter[]>([]);
  const [pegawai, setPegawai] = useState<Pegawai[]>([]);

  const fetchHasilUji = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getHasilUji(Number(id));
      setHasil(result);
    } catch (error) {
      console.error("Error fetch hasil uji:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchParameter = useCallback(async () => {
    setLoading(true);
    try {
      const result: PaginatedParameter = await getParameter({
        limit: 0,
      });
      setParameter(result.data);
    } catch (error) {
      console.error("Error fetch parameter:", error);
    } finally {
      setLoading(false);
    }
  }, []);

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

  useEffect(() => {
    const fetchSampel = async () => {
      setLoading(true);
      try {
        const result = await getSampelById(Number(id));
        setSampel(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchSampel();
    fetchParameter();
    fetchPegawai();
    fetchHasilUji();
  }, [fetchHasilUji, fetchPegawai, fetchParameter, id]);

  const filteredParameters = parameter.filter((param) => param.klasifikasi_parameter === sampel?.laboratorium?.klasifikasi);

  const isAllSampelFinished = hasil.every((h) => h.status === "LHU Sementara" || h.status === "Revisi LHU");

  if (loading) {
    return <LoadingOverlay text="Memuat data..." />;
  }

  return (
    <div className="flex-col space-y-8">
      {/* Header Informasi Otomatis */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-full shrink-0">
            <Info className="h-5 w-5 text-blue-700" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">Detail Sampel</h3>
            <p className="text-sm text-muted-foreground mt-1">Informasi detail sampel.</p>
          </div>
        </div>
      </div>

      {/* Informasi Sampel */}
      <Card>
        <CardContent className="space-y-6">
          {/* Header Section */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full shrink-0">
                <FlaskConical className="h-6 w-6 text-blue-700" />
              </div>
              <p className="text-xl font-semibold text-gray-800">Informasi Sampel</p>
            </div>
            <div className="flex items-center gap-3 text-right">
              <div>
                <p className="text-sm font-medium text-gray-700">Kode Sampel</p>
                <p className="text-base font-mono font-semibold text-primary">{sampel?.kode_sampel || "-"}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Nama Sampel */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-full shrink-0 mt-1">
                <Package className="h-4 w-4 text-blue-700" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">Nama Sampel</p>
                <p className="text-sm font-semibold text-gray-900">{sampel?.nama_sampel || "-"}</p>
              </div>
            </div>

            {/* Spesies */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-100 rounded-full shrink-0 mt-1">
                <Scale className="h-4 w-4 text-green-700" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">Spesies</p>
                <p className="text-sm font-semibold text-gray-900">{sampel?.spesies || "-"}</p>
              </div>
            </div>

            {/* Jumlah */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-100 rounded-full shrink-0 mt-1">
                <Ruler className="h-4 w-4 text-yellow-700" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">Jumlah</p>
                <p className="text-sm font-semibold text-gray-900">
                  {sampel?.jumlah || "0"} {sampel?.satuan ? `(${sampel.satuan})` : ""}
                </p>
              </div>
            </div>

            {/* Satuan */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-purple-100 rounded-full shrink-0 mt-1">
                <Package className="h-4 w-4 text-purple-700" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">Satuan</p>
                <p className="text-sm font-semibold text-gray-900">{sampel?.satuan || "-"}</p>
              </div>
            </div>

            {/* Laboratorium */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-100 rounded-full shrink-0 mt-1">
                <Building2 className="h-4 w-4 text-indigo-700" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">Laboratorium</p>
                <p className="text-sm font-semibold text-gray-900">{sampel?.laboratorium?.nama_laboratorium || "-"}</p>
              </div>
            </div>

            {/* Tanggal Pengujian */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-teal-100 rounded-full shrink-0 mt-1">
                <Calendar className="h-4 w-4 text-teal-700" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">Tanggal Pengujian</p>
                <p className="text-sm font-semibold text-gray-900">{sampel?.tanggal_pengujian || "-"}</p>
              </div>
            </div>

            {/* Tanggal Penandatanganan */}
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-100 rounded-full shrink-0 mt-1">
                <Calendar className="h-4 w-4 text-red-700" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700 mb-1">Tanggal Penandatanganan</p>
                <p className="text-sm font-semibold text-gray-900">{sampel?.tanggal_penandatanganan || "Belum ditandatangani"}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          {/* Header Section */}
          <div className="flex items-center gap-3 pb-4 border-b">
            <div className="p-2 bg-blue-100 rounded-full shrink-0">
              <TestTubeDiagonal className="h-6 w-6 text-blue-700" />
            </div>
            <p className="text-xl font-semibold text-gray-800">Informasi Parameter</p>
          </div>

          <div className="flex items-center gap-2">
            {!isAllSampelFinished && (
              <HasilUjiDialog
                title="Tambah Data Hasil Uji"
                trigger={
                  <Button variant="default" size="sm">
                    <PlusCircle className="h-4 w-4" />
                    Tambah Parameter
                  </Button>
                }
                method="create"
                sampel={sampel}
                parameterList={filteredParameters}
                pegawaiList={pegawai}
                onSuccess={() => fetchHasilUji()}
              />
            )}

            {/* Kolom Kesimpulan */}
            {hasil.length > 0 && isAllSampelFinished && (
              <KesimpulanDialog
                id={Number(id)}
                trigger={
                  <Button variant="default" size="sm">
                    <ListCheck className="h-4 w-4" />
                    Buat Kesimpulan
                  </Button>
                }
              />
            )}

            {/* Kolom Pengajuan Tanda Tangan */}
            {hasil.length > 0 && isAllSampelFinished && (
              <SignatureDialog
                trigger={
                  <Button variant="default" size="sm" disabled={!sampel?.kesimpulan}>
                    <Signature className="h-4 w-4" />
                    Mengajukan Tanda Tangan
                  </Button>
                }
                defaultValues={hasil}
                onSuccess={() => fetchHasilUji()}
              />
            )}
          </div>

          <Table className="border">
            <TableHeader className="bg-primary">
              <TableRow>
                <TableHead className="text-center text-primary-foreground font-semibold">Kode Sampel</TableHead>
                <TableHead className="text-center text-primary-foreground font-semibold">Parameter</TableHead>
                <TableHead className="text-center text-primary-foreground font-semibold">Penguji</TableHead>
                <TableHead className="text-center text-primary-foreground font-semibold">Hasil</TableHead>
                <TableHead className="text-center text-primary-foreground font-semibold">Keterangan</TableHead>
                <TableHead className="text-center text-primary-foreground font-semibold">Status</TableHead>
                <TableHead className="text-center text-primary-foreground font-semibold w-40 ">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hasil.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    Tidak ada data parameter pada sampel ini
                  </TableCell>
                </TableRow>
              ) : (
                hasil.map((hasil) => (
                  <TableRow key={hasil.id}>
                    <TableCell className="text-center text-xs">{hasil.sampel?.kode_sampel}</TableCell>
                    <TableCell className="text-center text-xs">{hasil.parameter?.nama_parameter}</TableCell>
                    <TableCell className="text-center text-xs">{hasil.penguji?.nama_pegawai}</TableCell>
                    <TableCell className="text-center text-xs">{hasil.hasil ?? "Pengujian masih dilakukan"}</TableCell>
                    <TableCell className="text-center text-xs">{hasil.keterangan ?? "Pengujian masih dilakukan"}</TableCell>
                    <TableCell className="text-center text-xs">
                      <Badge className="px-3 py-1">{hasil.status}</Badge>
                    </TableCell>
                    {hasil.status !== "Menunggu Verifikasi" && hasil.status !== "Selesai" && (
                      <TableCell className="text-center">
                        <div className="flex justify-center items-center gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="default" size="icon-sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Detail Laporan Hasil Uji</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <HasilUjiDialog
                              title="Tambah Data Hasil Uji"
                              trigger={
                                <TooltipTrigger asChild>
                                  <Button variant="default" size="icon-sm" className="bg-yellow-500 hover:bg-yellow-700">
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                              }
                              method="edit"
                              sampel={sampel}
                              parameterList={parameter}
                              pegawaiList={pegawai}
                              defaultValue={hasil}
                              onSuccess={() => fetchHasilUji()}
                            />
                            <TooltipContent>Perbarui Data Parameter</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <DeleteDialog
                              trigger={
                                <TooltipTrigger asChild>
                                  <Button variant="destructive" size="icon">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                              }
                              endpoint={`/hasil_uji/${hasil.id}`}
                              successMessage="Data hasil uji pada sampel berhasil dihapus"
                              onSuccess={() => fetchHasilUji()}
                            />
                            <TooltipContent>Hapus Data Parameter Uji</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
