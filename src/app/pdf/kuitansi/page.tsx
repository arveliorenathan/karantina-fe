"use client";

import { PDFViewer } from "@react-pdf/renderer";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getPNBPById } from "@/services/pnbpService";
import { Pnbp } from "@/types/pnbp";
import { Kuitansi } from "@/components/pdf/kuitansi/kuitansi";
import { LoadingOverlay } from "@/components/admin/loading-data";

export default function ViewPdfPage() {
  const [pnbp, setPnbp] = useState<Pnbp | null>(null);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSampel = async () => {
      setLoading(true);
      try {
        const result = await getPNBPById(Number(id));
        setPnbp(result);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSampel();
    }
  }, [id]);

  if (loading) {
    return <LoadingOverlay text="Menampilkan PDF..." />;
  }

  return (
    <div>
      <PDFViewer className="w-full h-screen">
        <Kuitansi data={{ pnbp }} />
      </PDFViewer>
    </div>
  );
}
