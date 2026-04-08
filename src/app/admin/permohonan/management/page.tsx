"use client";
import { LoadingOverlay } from "@/components/admin/loading-data";
import PermohonanForm from "@/components/admin/permohonan/permohonan-form";
import { CreatePermohonan, EditPermohonan } from "@/lib/schemas/permohonan";
import { getLaboratorium } from "@/services/laboratoriumService";
import { getPegawai } from "@/services/pegawaiService";
import { getPermohonanById, createPermohonan, updatePermohonan } from "@/services/permohonanService";
import { Laboratorium, PaginatedLaboratorium } from "@/types/laboratorium";
import { PaginatedPegawai, Pegawai } from "@/types/pegawai";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ManagementPermohonanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  const isEditMode = Boolean(id);

  const [laboratoriumList, setLaboratoriumList] = useState<Laboratorium[]>([]);
  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>([]);
  const [defaultValue, setDefaultValue] = useState<Partial<EditPermohonan>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const labResult: PaginatedLaboratorium = await getLaboratorium({
          status: "Aktif",
          limit: 0,
        });
        setLaboratoriumList(labResult.data);

        const pegawaiResult: PaginatedPegawai = await getPegawai({
          status: "Aktif",
          limit: 0,
        });
        setPegawaiList(pegawaiResult.data);

        if (isEditMode && id) {
          const paramResult = await getPermohonanById(Number(id));

          setDefaultValue({
            id: paramResult.id,
            nama_perusahaan: paramResult.nama_perusahaan,
            nama_pembawa: paramResult.nama_pembawa,
            kontak: paramResult.kontak,
            alamat: paramResult.alamat,
            tujuan_pengujian: paramResult.tujuan_pengujian,
            nomor_refrensi: paramResult.nomor_refrensi,
            lab_id: paramResult.lab_id,
            pegawai_id: paramResult.pegawai_id,
            status: paramResult.status,
            status_penerimaan: paramResult.status_penerimaan,
            tanggal_diterima: paramResult.tanggal_diterima || undefined,
            keterangan: paramResult.keterangan,
          });
        }
      } catch (error) {
        toast.error("Gagal memuat data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const handleSubmit = async (data: CreatePermohonan | EditPermohonan) => {
    setLoading(true);
    try {
      if (isEditMode && id) {
        await updatePermohonan(Number(id), data);
      } else {
        await createPermohonan(data as CreatePermohonan);
      }
      router.push("/admin/permohonan");
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
    <PermohonanForm
      isEditMode={isEditMode}
      pegawaiList={pegawaiList}
      laboratoriumList={laboratoriumList}
      defaultValue={defaultValue}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
}
