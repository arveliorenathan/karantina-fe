import api from "@/lib/api";
import { toast } from "sonner";
import { PaginatedPegawai, Pegawai } from "@/types/pegawai";

export async function getPegawai(params?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number
}): Promise<PaginatedPegawai> {
  try {
    const response = await api.get("/pegawai", {
      params: {
        search: params?.search,
        status: params?.status,
        page: params?.page,
        limit: params?.limit
      },
    });
    return response.data.data;
  } catch (error) {
    toast.error("Gagal mengambil data pegawai");
    throw error;
  }
}

export async function getPegawaiById(id: number) {
  try {
    const response = await api.get(`/pegawai/${id}`);
    return response.data.data;
  } catch (error) {
    toast.error("Gagal mengambil data pegawai by id");
    throw error;
  }
}

export async function createPegawai(
  data: Omit<Pegawai, "id" | "created_at" | "updated_at">,
) {
  try {
    const response = await api.post("/pegawai", data);
    toast.success("Data pegawai berhasil ditambahkan");
    return response.data.data;
  } catch (error) {
    toast.error("Gagal menambah data pegawai");
    throw error;
  }
}

export async function updatePegawai(id: number, data: Partial<Pegawai>) {
  try {
    const response = await api.patch(`/pegawai/${id}`, data);
    toast.success("Data pegawai berhasil diperbarui");
    return response.data.data;
  } catch (error) {
    toast.error("Gagal memperbarui data pegawai");
    throw error;
  }
}

export async function deletePegawai(id: number) {
  try {
    await api.delete(`/pegawai/${id}`);
    toast.success("Data pegawai berhasil dihapus");
  } catch (error) {
    toast.error("Gagal menhapus data pegawai");
    throw error;
  }
}
