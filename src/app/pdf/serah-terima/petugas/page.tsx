"use client";

import { LoadingOverlay } from "@/components/admin/loading-data";
import { SerahTerimaPetugas } from "@/components/pdf/permohonan/serah-terima-petugas";
import { getPermohonanById } from "@/services/permohonanService";
import { getSurat } from "@/services/suratService";
import { Permohonan } from "@/types/permohonan";
import { Surat } from "@/types/surat";
import { PDFViewer } from "@react-pdf/renderer";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SerahTerimaPetugasPage() {
  const [permohonan, setPermohonan] = useState<Permohonan | null>(null);
  const [surat, setSurat] = useState<Surat[]>([]);
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

    const fetchSurat = async () => {
      try {
        const result = await getSurat({
          kode_permohonan: permohonan?.kode_permohonan,
          perihal: "Pemerikasaan Administrasi dan Penerimaan Sampel",
          limit: 0,
        });
        setSurat(result.data);
        console.log("Data: ", result.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    if (id) {
      fetchPermohonan();
    }

    fetchSurat();
  }, [id, permohonan?.kode_permohonan]);

  if (loading) {
    return <LoadingOverlay text="Memuat data..." />;
  }
  return (
    <div>
      <PDFViewer className="w-full h-screen">
        <SerahTerimaPetugas data={{ permohonan, surat }} />
      </PDFViewer>
    </div>
  );
}
