"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ParameterForm from "@/components/admin/parameter/parameter-form";
import { Laboratorium, PaginatedLaboratorium } from "@/types/laboratorium";
import { CreateParameter, EditParameter } from "@/lib/schemas/parameter";
import { createParameter, getParameterById, updateParameter } from "@/services/parameterService";
import { getLaboratorium } from "@/services/laboratoriumService";
import { toast } from "sonner";
import { LoadingOverlay } from "@/components/admin/loading-data";
import { useAuth } from "../../auth-provider";

export default function ManagementParameterPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const id = searchParams.get("id");
  const isEditMode = Boolean(id);

  const [laboratoriumList, setLaboratoriumList] = useState<Laboratorium[]>([]);
  const [defaultValue, setDefaultValue] = useState<Partial<EditParameter>>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: PaginatedLaboratorium = await getLaboratorium({
          status: "Aktif",
          limit: 0,
        });
        setLaboratoriumList(result.data);
        if (isEditMode && id) {
          const paramResult = await getParameterById(Number(id));

          setDefaultValue({
            ...paramResult,
            labId: paramResult.laboratorium?.id ?? undefined,
          });
        }
      } catch (error) {
        toast.error("Gagal memuat data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role !== "superadmin") {
      logout("/forbidden");
    } else {
      fetchData();
    }
  }, [id, isEditMode, logout, user?.role]);

  const handleSubmit = async (data: CreateParameter | EditParameter) => {
    setLoading(true);
    try {
      if (isEditMode && id) {
        await updateParameter(Number(id), data);
      } else {
        await createParameter(data as CreateParameter);
      }
      router.push("/admin/parameter");
    } catch (error) {
      toast.error("Terjadi kesalahan saat menyimpan data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingOverlay text="Memuat data..." />;
  }

  return (
    <ParameterForm
      isEditMode={isEditMode}
      defaultValue={defaultValue}
      laboratoriumList={laboratoriumList}
      onSubmit={handleSubmit}
      loading={loading}
    />
  );
}
