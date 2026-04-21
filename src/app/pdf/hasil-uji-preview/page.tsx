"use client";

import { LoadingOverlay } from "@/components/admin/loading-data";
import { PreviewHasilUjiPDF } from "@/components/pdf/hasil-uji/hasil-uji-preview";
import { getSampelById } from "@/services/sampelService";
import { getSurat } from "@/services/suratService";
import { Sampel } from "@/types/sampel";
import { Surat } from "@/types/surat";
import { PDFViewer } from "@react-pdf/renderer";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PreviewLembarHasilUji() {
  const [sampel, setSampel] = useState<Sampel | null>(null);
  const [surat, setSurat] = useState<Surat[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Ambil sampel
        const sampelResult = await getSampelById(Number(id));
        setSampel(sampelResult);

        if (sampelResult?.kode_permohonan) {
          const suratResult = await getSurat({
            permohonan_id: sampelResult.kode_permohonan,
            perihal: "Laporan Hasil Uji Laboratorium",
            limit: 0,
          });
          setSurat(suratResult.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <LoadingOverlay text="Menampilkan PDF..." />;
  }

  return (
    <PDFViewer style={{ width: "100%", height: "100vh" }}>
      <PreviewHasilUjiPDF data={{ sampel, surat }} />
    </PDFViewer>
  );
}
