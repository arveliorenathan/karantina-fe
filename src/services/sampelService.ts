import api from "@/lib/api";
import { PaginatedSampel, Sampel } from "@/types/sampel";
import { toast } from "sonner";

export async function getSampel(params?: {
  search?: string;
  klasifikasi?: string;
  page?: number;
  limit?: number;
  status?: string;
}): Promise<PaginatedSampel> {
  try {
    const response = await api.get("/sampel", {
      params: {
        search: params?.search,
        klasifikasi: params?.klasifikasi,
        page: params?.page,
        limit: params?.limit,
        status: params?.status,
      },
    });
    return response.data.data;
  } catch (error) {
    toast.error("Gagal mengambil data sampel");
    throw error;
  }
}

export async function getSampelById(id: number) {
  try {
    const response = await api.get(`/sampel/${id}`);
    return response.data.data;
  } catch (error) {
    toast.error("Gagal mengambil data sampel by id");
    throw error;
  }
}

export async function createSampel(data: Omit<Sampel, "id" | "kode_sampel" | "created_at" | "updated_at">) {
  try {
    const response = await api.post("/sampel", data);
    toast.success("Data sampel berhasil ditambahkan");
    return response.data.data;
  } catch (error) {
    toast.error("Gagal menambahkan data sampel by id");
    throw error;
  }
}

export async function updateSampel(id: number, data: Partial<Sampel>) {
  try {
    const response = await api.patch(`/sampel/${id}`, data);
    toast.success("Data sampel berhasil diperbarui");
    return response.data.data;
  } catch (error) {
    toast.error("Gagal memperbarui data sampel by id");
    throw error;
  }
}

export async function deleteSampel(id: number) {
  try {
    await api.delete(`/sampel/${id}`);
    toast.success("Data sampel berhasil dihapus");
  } catch (error) {
    toast.error("Gagal menghapus data sampel");
    throw error;
  }
}
