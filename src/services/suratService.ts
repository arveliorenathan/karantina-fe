import api from "@/lib/api";
import { PaginatedSurat, Surat } from "@/types/surat";
import { toast } from "sonner";

export async function getSurat(params?: {
  search?: string;
  page?: number;
  permohonan_id?: number;
  perihal?: string;
  limit?: number;
}): Promise<PaginatedSurat> {
  try {
    const response = await api.get("/surat", {
      params: {
        search: params?.search,
        page: params?.page,
        limit: params?.limit,
        permohonan_id: params?.permohonan_id,
        perihal: params?.perihal,
      },
    });
    return response.data.data;
  } catch (error) {
    toast.error("Gagal mengambil data surat");
    throw error;
  }
}

export async function getSuratById(id: number) {
  try {
    const response = await api.get(`/surat/${id}`);
    return response.data.data;
  } catch (error) {
    toast.error("Gagal mengambil data surat by id");
    throw error;
  }
}

export async function createSurat(
  data: Omit<Surat, "id"| "nomor_surat" | "created_at" | "updated_at">,
) {
  try {
    const response = await api.post("/surat", data);
    toast.success("Data surat berhasil ditambahkan");
    return response.data.data;
  } catch (error) {
    toast.error("Gagal membuat data surat");
    throw error;
  }
}

export async function updateSurat(id: number, data: Partial<Surat>) {
  try {
    const response = await api.patch(`/surat/${id}`, data);
    toast.success("Data surat berhasil di perbaharui");
    return response.data.data;
  } catch (error) {
    toast.error("Gagal memperbaharui data surat");
    throw error;
  }
}

export async function deleteSurat(id: number) {
  try {
    await api.delete(`/surat/${id}`);
    toast.success("Data surat berhasil dihapus");
  } catch (error) {
    toast.error("Gagal menghapus data surat");
    throw error;
  }
}
