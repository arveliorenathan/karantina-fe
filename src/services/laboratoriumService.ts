import api from "@/lib/api";
import { toast } from "sonner";
import { Laboratorium, PaginatedLaboratorium } from "@/types/laboratorium";

export async function getLaboratorium(params?: {
  search?: string;
  status?: string;
  klasifikasi?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedLaboratorium> {
  try {
    const response = await api.get("/laboratorium", {
      params: {
        search: params?.search,
        status: params?.status,
        klasifikasi: params?.klasifikasi,
        page: params?.page,
        limit: params?.limit,
      },
    });
    return response.data.data;
  } catch (error) {
    toast.error("Gagal mengambil data laboratorium");
    throw error;
  }
}

export async function getLaboratoriumById(id: number) {
  try {
    const response = await api.get(`/laboratorium/${id}`);
    return response.data.data;
  } catch (error) {
    toast.error("Gagal mengambil data laboratorium by id");
    throw error;
  }
}

export async function createLaboratorium(data: Omit<Laboratorium, "id" | "created_at" | "updated_at">) {
  try {
    const response = await api.post("/laboratorium", data);
    toast.success("Data laboratorium berhasil ditambahkan");
    return response.data.data;
  } catch (error) {
    toast.error("Gagal membuat data laboratorium");
    throw error;
  }
}

export async function updateLaboratorium(id: number, data: Partial<Laboratorium>) {
  try {
    const response = await api.patch(`/laboratorium/${id}`, data);
    toast.success("Data laboratorium berhasil di perbaharui");
    return response.data.data;
  } catch (error) {
    toast.error("Gagal memperbaharui data laboratorium");
    throw error;
  }
}

export async function deleteLaboratorium(id: number) {
  try {
    await api.delete(`/laboratorium/${id}`);
    toast.success("Data laboratorium berhasil dihapus");
  } catch (error) {
    toast.error("Gagal menghapus data laboratorium");
    throw error;
  }
}
