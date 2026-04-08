"use client";

import { LoadingOverlay } from "@/components/admin/loading-data";
import { SerahTerimaPenggunaJasa } from "@/components/pdf/permohonan/serah-terima-pengguna-jasa";
import { getPermohonanById } from "@/services/permohonanService";
import { Permohonan } from "@/types/permohonan";
import { PDFViewer } from "@react-pdf/renderer";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SerahTerimaPenggunaJasaPage() {
  const [permohonan, setPermohonan] = useState<Permohonan | null>(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPermohonan = async () => {
      setLoading(true);
      try {
        const result = await getPermohonanById(Number(id));
        setPermohonan(result);
        console.log(result);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPermohonan();
    }
  }, [id]);

  if (loading) {
    return <LoadingOverlay text="Memuat data..." />;
  }
  return (
    <div>
      <PDFViewer className="w-full h-screen">
        <SerahTerimaPenggunaJasa data={permohonan} />
      </PDFViewer>
    </div>
  );
}
