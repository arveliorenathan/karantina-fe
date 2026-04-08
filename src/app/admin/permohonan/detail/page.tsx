"use client";
import { LoadingOverlay } from "@/components/admin/loading-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getPermohonanById } from "@/services/permohonanService";
import { Permohonan } from "@/types/permohonan";
import { Building2, Calendar, FileText, FlaskConical, Info, Key, MapPin, Phone, User } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function DetailPermohonan() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [permohonan, setPermohonan] = useState<Permohonan>();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPermohonan = async () => {
      setLoading(true);
      try {
        const result = await getPermohonanById(Number(id));
        setPermohonan(result);
        console.log(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPermohonan();
  }, [id]);

  if (loading) {
    return <LoadingOverlay text="Memuat data..." />;
  }

  return (
    <div>
      {/* Informasi Otomatis + Kode & PIN */}
      <Card className="overflow-hidden shadow-sm">
        <CardContent className="space-y-6">
          {/* Header Informasi Otomatis */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200">
            <div className="flex items-center gap-3 ">
              <div className="p-2 bg-blue-100 rounded-full shrink-0">
                <Info className="h-5 w-5 text-blue-700" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">Detail Permohonan</h3>
                <p className="text-sm text-muted-foreground mt-1">Informasi detail permohonan.</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge
                className={`text-xs px-3 py-1 rounded-lg font-semibold 
    ${
      permohonan?.status_penerimaan === "Terima"
        ? "bg-green-500 text-white"
        : permohonan?.status_penerimaan === "Tolak"
          ? "bg-red-500 text-white"
          : permohonan?.status_penerimaan === "Menunggu Konfirmasi Admin"
            ? "bg-yellow-500 text-white"
            : permohonan?.status_penerimaan === "Dibatalkan"
              ? "bg-red-500 text-white"
              : "bg-gray-400 text-white"
    }`}>
                {permohonan?.status_penerimaan}
              </Badge>
              <Badge className="px-3 py-1">{permohonan?.status}</Badge>
            </div>
          </div>

          {/* Kode Permohonan & PIN */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className=" bg-blue-100 rounded-full shrink-0">
                    <FileText className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Kode Permohonan</p>
                    <p className="text-base font-mono font-semibold text-primary">{permohonan?.kode_permohonan}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className=" bg-blue-100 rounded-full shrink-0">
                    <Key className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">PIN</p>
                    <p className="text-base font-mono font-semibold text-primary">{permohonan?.pin}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className=" bg-blue-100 rounded-full shrink-0">
                    <Calendar className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Tanggal Diterima</p>
                    <p className="text-base font-mono font-semibold text-primary">{permohonan?.tanggal_diterima}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex-col space-y-6">
            {/* Header Section */}
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="p-2 bg-blue-100 rounded-full shrink-0">
                <Building2 className="h-6 w-6 text-blue-700" />
              </div>
              <p className="text-xl font-semibold text-gray-800">Informasi Perusahaan</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nama Perusahaan */}
              <div className="flex items-center gap-2 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Building2 className="h-4 w-4 text-blue-700" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-700">Nama Perusahaan</p>
                  <p className="text-sm  font-semibold text-primary">{permohonan?.nama_perusahaan}</p>
                </div>
              </div>

              {/* Nama Pembawa Sampel */}
              <div className="flex items-center gap-2 rounded-lg">
                <div className="p-2 bg-green-100 rounded-full">
                  <User className="h-4 w-4 text-green-700" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-700">Nama Pembawa Sampel</p>
                  <p className="text-sm  font-semibold text-primary">{permohonan?.nama_pembawa}</p>
                </div>
              </div>

              {/* Kontak */}
              <div className="flex items-center gap-2 rounded-lg">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Phone className="h-4 w-4 text-yellow-700" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-700">Kontak</p>
                  <p className="text-sm  font-semibold text-primary">{permohonan?.kontak}</p>
                </div>
              </div>

              {/* Alamat */}
              <div className="flex items-center gap-2 rounded-lg">
                <div className="p-2 bg-purple-100 rounded-full">
                  <MapPin className="h-4 w-4 text-purple-700" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-700">Alamat</p>
                  <p className="text-sm  font-semibold text-primary">{permohonan?.alamat}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-col space-y-6">
            {/* Header Section */}
            <div className="flex items-center gap-3 pb-4 border-b">
              <div className="p-2 bg-blue-100 rounded-full shrink-0">
                <FlaskConical className="h-6 w-6 text-blue-700" />
              </div>
              <p className="text-xl font-semibold text-gray-800">Informasi Pengujian</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tujuan Pengujian */}
              <div className="flex items-center gap-2 rounded-lg">
                <div>
                  <p className="text-xs font-medium text-gray-700">Tujuan Pengujian</p>
                  <p className="text-sm  font-semibold text-primary">{permohonan?.tujuan_pengujian || "-"}</p>
                </div>
              </div>

              {/* Nomor Refrensi */}
              <div className="flex items-center gap-2 rounded-lg">
                <div>
                  <p className="text-xs font-medium text-gray-700">Nomor Refrensi</p>
                  <p className="text-sm  font-semibold text-primary">{permohonan?.nomor_refrensi || "-"}</p>
                </div>
              </div>

              {/* Laboratorium */}
              <div className="flex items-center gap-2 rounded-lg">
                <div>
                  <p className="text-xs font-medium text-gray-700">Laboratorium</p>
                  <p className="text-sm  font-semibold text-primary">{permohonan?.laboratorium?.nama_laboratorium || "-"}</p>
                </div>
              </div>

              {/* Penanggung Jawab */}
              <div className="flex items-center gap-2 rounded-lg">
                <div>
                  <p className="text-xs font-medium text-gray-700">Penanggung Jawab</p>
                  <p className="text-sm  font-semibold text-primary">{permohonan?.pegawai?.nama_pegawai || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
