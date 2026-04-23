"use client";

import { LoadingOverlay } from "@/components/admin/loading-data";
import { HasilUjiPDF } from "@/components/pdf/hasil-uji/hasil-uji";
import { getSampelById } from "@/services/sampelService";
import { getSurat } from "@/services/suratService";
import { Sampel } from "@/types/sampel";
import { Surat } from "@/types/surat";
import { PDFViewer } from "@react-pdf/renderer";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LembarHasilUji() {
  const [sampel, setSampel] = useState<Sampel | null>(null);
  const [surat, setSurat] = useState<Surat[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const hashedId = searchParams.get("id");
  const id = hashedId ? Number(atob(decodeURIComponent(hashedId))) : null;

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Ambil sampel
        const sampelResult = await getSampelById(Number(id));
        setSampel(sampelResult);

        if (sampelResult?.permohonan?.id) {
          const suratResult = await getSurat({
            permohonan_id: sampelResult.permohonan?.id,
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
      <HasilUjiPDF data={{ sampel, surat }} />
    </PDFViewer>
  );
}
