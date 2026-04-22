"use client";
import { LoadingOverlay } from "@/components/admin/loading-data";
import SampelForm from "@/components/admin/sampel/sampel-form";
import { CreateSampel, EditSampel } from "@/lib/schemas/sampel";
import { getLaboratorium } from "@/services/laboratoriumService";
import { getPermohonan } from "@/services/permohonanService";
import { createSampel, getSampelById, updateSampel } from "@/services/sampelService";
import { Laboratorium, PaginatedLaboratorium } from "@/types/laboratorium";
import { PaginatedPermohonan, Permohonan } from "@/types/permohonan";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../auth-provider";

export default function ManagementSampel() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  const isEditMode = Boolean(id);

  const [defaultValue, setDefaultValue] = useState<Partial<EditSampel>>({});
  const [loading, setLoading] = useState(true);
  const [laboratoriumList, setLaboratoriumList] = useState<Laboratorium[]>([]);
  const [permohonanList, setPermohonanList] = useState<Permohonan[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const labResult: PaginatedLaboratorium = await getLaboratorium({
          status: "Aktif",
          limit: 0,
        });
        setLaboratoriumList(labResult.data);

        const permohonanResult: PaginatedPermohonan = await getPermohonan({
          status_penerimaan: "Terima",
          limit: 0,
        });

        setPermohonanList(permohonanResult.data);

        if (isEditMode && id) {
          const sample = await getSampelById(Number(id));
          console.log(sample);
          if (sample) {
            setDefaultValue({
              id: sample.id,
              kode_permohonan: sample.kode_permohonan,
              nama_sampel: sample.nama_sampel,
              spesies: sample.spesies,
              jumlah: sample.jumlah,
              satuan: sample.satuan,
              lab_id: sample.lab_id,
              tanggal_pengujian: sample.tanggal_pengujian || undefined,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role !== "superadmin" && user?.role !== "admin") {
      logout("/forbidden");
    } else {
      fetchData();
    }
  }, [id, isEditMode, logout, router, user?.role]);

  const handleSubmit = async (data: CreateSampel | EditSampel) => {
    setLoading(true);
    try {
      if (isEditMode && id) {
        await updateSampel(Number(id), data);
      } else {
        await createSampel(data as CreateSampel);
      }
      router.push("/admin/sampel");
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
    <SampelForm
      isEditMode={isEditMode}
      laboratoriumList={laboratoriumList}
      permohonanList={permohonanList}
      defaultValues={defaultValue}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
}
