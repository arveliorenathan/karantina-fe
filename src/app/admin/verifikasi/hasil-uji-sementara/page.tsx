"use client";

import { HasilUjiSementaraPDF } from "@/components/pdf/hasil-uji/hasil-uji-sementara";
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
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    const fetchSampel = async () => {
      try {
        const result = await getSampelById(Number(id));
        setSampel(result);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    const fetchSurat = async () => {
      try {
        const result = await getSurat({
          kode_permohonan: sampel?.kode_permohonan,
          perihal: "Analisa dan Pengujian Sampel",
          limit: 0,
        });
        setSurat(result.data);
        console.log("Data: ", result.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    if (id) {
      fetchSampel();
    }

    if (sampel?.kode_permohonan) {
      fetchSurat();
    }
  }, [id, sampel?.kode_permohonan]);

  return (
    <div>
      <PDFViewer className="w-full h-screen">
        <HasilUjiSementaraPDF data={{ sampel, surat }} />
      </PDFViewer>
    </div>
  );
}
