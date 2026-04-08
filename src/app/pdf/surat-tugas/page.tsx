"use client";

import { LoadingOverlay } from "@/components/admin/loading-data";
import { SuratPenugasan } from "@/components/pdf/surat/surat-pdf";
import { getSuratById } from "@/services/suratService";
import { Surat } from "@/types/surat";
import { PDFViewer } from "@react-pdf/renderer";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SuratDocument() {
  const [surat, setSurat] = useState<Surat | null>(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSurat = async () => {
      setLoading(true);
      try {
        const result = await getSuratById(Number(id));
        setSurat(result);
        console.log("Surat: ", result);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSurat();
    }
  }, [id]);

  if (loading) {
    return <LoadingOverlay text="Memuat data..." />;
  }

  return (
    <div>
      <PDFViewer className="w-full h-screen">
        <SuratPenugasan data={{ surat }} />
      </PDFViewer>
    </div>
  );
}
