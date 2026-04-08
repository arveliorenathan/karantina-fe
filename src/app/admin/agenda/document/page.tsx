"use client";
import { LoadingOverlay } from "@/components/admin/loading-data";
import { RekapitulasiAgenda } from "@/components/pdf/agenda/rekapitulasi-agenda";
import { getPermohonan } from "@/services/permohonanService";
import { PaginatedPermohonan, Permohonan } from "@/types/permohonan";
import { PDFViewer } from "@react-pdf/renderer";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function RekapAgenda() {
  const searchParams = useSearchParams();
  const startDate = searchParams.get("startDate") ?? "";
  const endDate = searchParams.get("endDate") ?? "";
  const klasifikasi = searchParams.get("klasifikasi") ?? "";

  const [permohonan, setPermohonan] = useState<Permohonan[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPermohonan = useCallback(async () => {
    setLoading(true);
    try {
      const result: PaginatedPermohonan = await getPermohonan({
        start_date: startDate,
        end_date: endDate,
        klasifikasi: klasifikasi,
        limit: 0,
      });
      setPermohonan(result.data);
      console.log("Data: ", result);
    } catch (error) {
      console.error("Error fetching permohonan:", error);
    } finally {
      setLoading(false);
    }
  }, [startDate, endDate, klasifikasi]);

  useEffect(() => {
    fetchPermohonan();
  }, [fetchPermohonan, startDate, endDate, klasifikasi]);

  if (loading) {
    return <LoadingOverlay text="Memuat data..." />;
  }

  return (
    <div>
      <PDFViewer className="w-full h-screen">
        <RekapitulasiAgenda data={permohonan} start_date={startDate} end_date={endDate} />
      </PDFViewer>
    </div>
  );
}
