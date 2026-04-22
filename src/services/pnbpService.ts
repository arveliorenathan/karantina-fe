import api from "@/lib/api";
import { PaginatedPNBP, Pnbp } from "@/types/pnbp";
import { toast } from "sonner";

export async function getPNBP(params?: { search?: string; page?: number; status?: string; limit?: number }): Promise<PaginatedPNBP> {
  try {
    const response = await api.get("/pnbp", {
      params: {
        search: params?.search,
        page: params?.page,
        status: params?.status,
        limit: params?.limit,
      },
    });
    return response.data.data;
  } catch (error) {
    toast.error("Gagal mengambil data PNBP");
    throw error;
  }
}

export async function getPNBPById(id: number) {
  try {
    const response = await api.get(`/pnbp/${id}`);
    return response.data.data;
  } catch (error) {
    toast.error("Gagal mengambil data PNBP by id");
    throw error;
  }
}

export async function createPNBP(data: Omit<Pnbp, "id" | "no_pnbp" | "no_bil" | "ntpn" | "status" | "created_at" | "updated_at">) {
  try {
    const response = await api.post("/pnbp", data);
    toast.success("Data PNBP berhasil ditambahkan");
    return response.data.data;
  } catch (error) {
    toast.error("Gagal membuat data PNBP");
    throw error;
  }
}

export async function updatePNBP(id: number, data: Partial<Pnbp>) {
  try {
    const response = await api.patch(`/pnbp/${id}`, data);
    toast.success("Data PNBP berhasil di perbaharui");
    return response.data.data;
  } catch (error) {
    toast.error("Gagal memperbaharui data PNBP");
    throw error;
  }
}

export async function deletePNBP(id: number) {
  try {
    await api.delete(`/pnbp/${id}`);
    toast.success("Data PNBP berhasil dihapus");
  } catch (error) {
    toast.error("Gagal menghapus data PNBP");
    throw error;
  }
}
