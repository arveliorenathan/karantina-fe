"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import SuratForm from "@/components/admin/surat/surat-form";
import { CreateSurat, EditSurat } from "@/lib/schemas/surat";
import { getPegawai } from "@/services/pegawaiService";
import { getPermohonan } from "@/services/permohonanService";
import { createSurat, getSuratById, updateSurat } from "@/services/suratService";
import { PaginatedPegawai, Pegawai } from "@/types/pegawai";
import { PaginatedPermohonan, Permohonan } from "@/types/permohonan";
import { LoadingOverlay } from "@/components/admin/loading-data";

export default function ManagementSurat() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isEditMode = Boolean(id);

  const [defaultValue, setDefaultValue] = useState<Partial<EditSurat>>({});
  const [permohonanList, setPermohonanList] = useState<Permohonan[]>([]);
  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const pegawaiResult: PaginatedPegawai = await getPegawai({
          status: "Aktif",
          limit: 0,
        });
        setPegawaiList(pegawaiResult.data);

        const permohonanResult: PaginatedPermohonan = await getPermohonan({
          status_penerimaan: "Terima",
          limit: 0,
        });

        setPermohonanList(permohonanResult.data);

        if (isEditMode && id) {
          const surat = await getSuratById(Number(id));
          if (surat) {
            setDefaultValue({
              id: surat.id,
              tanggal_surat: surat.tanggal_surat,
              perihal: surat.perihal,
              permohonan_id: surat.permohonan_id,
              pemberi_id: surat.pemberi_id,
              penerima_id: surat.penerima_tugas?.map((p: { id: number }) => p.id) ?? [],
              kota_penerbit: surat.kota_penerbit,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const handleSubmit = async (data: CreateSurat | EditSurat) => {
    setLoading(true);
    try {
      if (isEditMode && id) {
        await updateSurat(Number(id), data);
      } else {
        await createSurat(data as CreateSurat);
      }
      router.push("/admin/surat");
    } catch (error) {
      toast.error("Gagal menyimpan data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingOverlay text="Memuat data..." />;
  }

  return (
    <SuratForm
      isEditMode={isEditMode}
      permohonanList={permohonanList}
      pegawaiList={pegawaiList}
      defaultValue={defaultValue}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
}
