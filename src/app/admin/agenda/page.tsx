"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, FileText, FlaskConical } from "lucide-react";
import React, { useCallback, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { PaginatedPermohonan, Permohonan } from "@/types/permohonan";
import { getPermohonan } from "@/services/permohonanService";
import { useRouter } from "next/navigation";

export default function AgendaPage() {
  const [loading, setLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [klasifikasi, setKlasifikasi] = useState("");
  const router = useRouter();

  const handleButtonClick = () => {
    if (startDate && endDate && klasifikasi) {
      router.push(`/admin/agenda/document?startDate=${startDate}&endDate=${endDate}&klasifikasi=${klasifikasi}`);
    } else {
      alert("Harap lengkapi semua input");
    }
  };

  const fetchPermohonan = useCallback(async (): Promise<Permohonan[]> => {
    try {
      const result: PaginatedPermohonan = await getPermohonan({
        start_date: startDate,
        end_date: endDate,
        klasifikasi: klasifikasi,
        limit: 0,
      });
      return result.data || [];
    } catch (error) {
      console.error("Error fetching permohonan:", error);
      return [];
    }
  }, [startDate, endDate, klasifikasi]);

  const handleDownloadXLSX = async () => {
    if (!startDate || !endDate || !klasifikasi) {
      alert("Harap lengkapi semua filter");
      return;
    }

    setLoading(true);
    try {
      const data = await fetchPermohonan(); // ambil data dari API

      // Konversi data sesuai kolom yang diinginkan
      const formattedData = data.flatMap((item, indexPermohonan) =>
        item?.sampel?.map((sampelItem, indexSampel) => ({
          No: indexPermohonan + 1 + indexSampel,
          Tanggal: item.created_at,
          "Nama Perusahaan": item.nama_perusahaan,
          "Nama Sampel": sampelItem.nama_sampel,
          Jumlah: sampelItem.jumlah ? `${sampelItem.jumlah} ${sampelItem.satuan || ""}` : "-",
          "Tujuan Uji": item.tujuan_pengujian,
          Parameter: sampelItem.hasil_uji?.map((h) => h.parameter?.nama_parameter).join(", ") || "-",
          "Hasil Uji": sampelItem.hasil_uji?.map((h) => h.hasil || "-").join(", ") || "-",
          "Nama Penguji": sampelItem.hasil_uji?.map((h) => h.penguji?.nama_pegawai).join(", ") || "-",
          "Selesai Uji": sampelItem.tanggal_penandatanganan ? sampelItem.tanggal_penandatanganan : "Belum Selesai",
        })),
      );
      // Buat worksheet
      const worksheet = XLSX.utils.json_to_sheet(formattedData, {
        header: ["No", "Tanggal", "Nama Perusahaan", "Nama Sampel", "Jumlah", "Tujuan Uji", "Parameter", "Hasil Uji", "Nama Penguji", "Selesai Uji"],
      });

      // Styling header: bold, center
      const range = XLSX.utils.decode_range(worksheet["!ref"]!);
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
        if (!worksheet[cellAddress]) continue;
        worksheet[cellAddress].s = {
          font: { bold: true },
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          },
        };
      }

      // Styling seluruh sel (garis border)
      for (let R = range.s.r + 1; R <= range.e.r; ++R) {
        for (let C = range.s.c; C <= range.e.c; ++C) {
          const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
          if (!worksheet[cellAddress]) continue;
          worksheet[cellAddress].s = {
            alignment: { vertical: "center", horizontal: "left" },
            border: {
              top: { style: "thin" },
              bottom: { style: "thin" },
              left: { style: "thin" },
              right: { style: "thin" },
            },
          };
        }
      }

      // Buat workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Rekap Hasil");

      // Download file
      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array", cellStyles: true });
      // Format nama file
      const fileName = `Rekap Agenda Pengujian ${startDate} - ${endDate} ${klasifikasi}.xlsx`;
      // Save file
      saveAs(new Blob([excelBuffer], { type: "application/octet-stream" }), fileName);
    } catch (error) {
      console.error(error);
      alert("Gagal download XLSX");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Rekapitulasi Agenda Hasil Pengujian</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-6 items-center">
            {/* Tanggal Awal */}
            <div className="flex-1">
              <Field>
                <FieldLabel className="text-sm ">
                  <Calendar className="h-4 w-4" />
                  Tanggal Awal
                </FieldLabel>
                <Input
                  type="date"
                  className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </Field>
            </div>
            {/* Tanggal Akhir */}
            <div className="flex-1">
              <Field>
                <FieldLabel className="text-sm ">
                  <Calendar className="h-4 w-4" />
                  Tanggal Akhir
                </FieldLabel>
                <Input
                  type="date"
                  className="w-full p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </Field>
            </div>
            {/* Klasifikasi */}
            <div className="flex-1">
              <Field>
                <FieldLabel className="text-sm ">
                  <FlaskConical className="h-4 w-4" />
                  Klasifikasi
                </FieldLabel>
                <Select onValueChange={(value) => setKlasifikasi(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih klasifikasi laboratorium" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KH">Karantina Hewan</SelectItem>
                    <SelectItem value="KI">Karantina Ikan</SelectItem>
                    <SelectItem value="KT">Karantina Tumbuhan</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="flex items-center gap-2">
              <Field>
                <FieldLabel></FieldLabel>
                <Button className="p-2 rounded-lg shadow-md transition-all duration-200 mt-4" onClick={handleButtonClick} disabled={loading}>
                  <FileText />
                  Tampilkan PDF
                </Button>
              </Field>
              <Field>
                <FieldLabel></FieldLabel>
                <Button className="p-2 rounded-lg shadow-md transition-all duration-200 mt-4" onClick={handleDownloadXLSX} disabled={loading}>
                  <FileText />
                  {loading ? "Loading..." : "Download XLSX"}
                </Button>
              </Field>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
