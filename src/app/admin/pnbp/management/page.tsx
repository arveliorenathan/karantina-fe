"use client";
import { LoadingOverlay } from "@/components/admin/loading-data";
import PNBPForm from "@/components/admin/pnbp/pnbp-form";
import { CreatePNBP, EditPNBP } from "@/lib/schemas/pnbp";
import { getPegawai } from "@/services/pegawaiService";
import { getPermohonan } from "@/services/permohonanService";
import { createPNBP, getPNBPById, updatePNBP } from "@/services/pnbpService";
import { PaginatedPegawai, Pegawai } from "@/types/pegawai";
import { PaginatedPermohonan, Permohonan } from "@/types/permohonan";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../auth-provider";

export default function ManagementPNBPPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  const isEditMode = Boolean(id);

  const [permohonanList, setPermohonanList] = useState<Permohonan[]>([]);
  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>([]);

  const [defaultValue, setDefaultValue] = useState<Partial<EditPNBP>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const permohonanResult: PaginatedPermohonan = await getPermohonan({
          status_penerimaan: "Terima",
          limit: 0,
        });

        const pegawaiResult: PaginatedPegawai = await getPegawai({
          status: "Aktif",
          limit: 0,
        });
        setPegawaiList(pegawaiResult.data);

        setPermohonanList(permohonanResult.data);

        if (isEditMode && id) {
          const paramResult = await getPNBPById(Number(id));
          setDefaultValue({
            id: paramResult.id,
            kode_permohonan: paramResult.kode_permohonan,
            pegawai_id: paramResult.pegawai_id,
            tarif_id: paramResult.penerima_tugas?.map((p: { id: number }) => p.id) ?? [],
            total_nominal: paramResult.total_nominal,
            tanggal_pnbp: paramResult.tanggal_pnbp,
            status: paramResult.status,
          });
        }
      } catch (error) {
        toast.error("Gagal memuat data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role !== "superadmin" && user?.role !== "pnbp") {
      logout("/forbidden");
    } else {
      fetchData();
    }
  }, [id, isEditMode, logout, router, user?.role]);

  const handleSubmit = async (data: CreatePNBP | EditPNBP) => {
    setLoading(true);
    try {
      if (isEditMode && id) {
        await updatePNBP(Number(id), data);
      } else {
        await createPNBP(data as CreatePNBP);
      }
      router.push("/admin/pnbp");
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
    <PNBPForm
      isEditMode={isEditMode}
      permohonanList={permohonanList}
      defaultValue={defaultValue}
      onSubmit={handleSubmit}
      loading={loading}
      pegawaiList={pegawaiList}
    />
  );
}
