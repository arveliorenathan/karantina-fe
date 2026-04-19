import api from "@/lib/api";
import { PaginatedPNBP, Pnbp } from "@/types/pnbp";
import { toast } from "sonner";

export async function getPNBP(params?: { search?: string; page?: number; status?: string; limit?: number }): Promise<PaginatedPNBP> {
  try {
    const response = await api.get("/api/pnbp", {
      params: {
        search: params?.search,
        page: params?.page,
        status: params?.status,
        limit: params?.limit,
      },
    });
    console.log("Data PNBP: ", response.data);
    return response.data.data;
  } catch (error) {
    toast.error("Gagal mengambil data PNBP");
    console.log("Error GET PNBP: ", error);
    throw new Error("Error GET PNBP");
  }
}

export async function getPNBPById(id: number) {
  try {
    const response = await api.get(`/api/pnbp/${id}`);
    console.log(`Data PNBP by id ${id}`, response);
    return response.data.data;
  } catch (error) {
    toast.error("Gagal mengambil data PNBP by id");
    console.log("Error GET PNBP by ID: ", error);
  }
}

export async function createPNBP(data: Omit<Pnbp, "id" | "no_pnbp" | "no_bil" | "ntpn" | "status" | "created_at" | "updated_at">) {
  try {
    const response = await api.post("/api/pnbp", data);
    toast.success("Data PNBP berhasil ditambahkan");
    return response.data.data;
  } catch (error) {
    toast.error("Gagal membuat data PNBP");
    console.log("Error POST PNBP: ", error);
  }
}

export async function updatePNBP(id: number, data: Partial<Pnbp>) {
  try {
    const response = await api.patch(`/api/pnbp/${id}`, data);
    toast.success("Data PNBP berhasil di perbaharui");
    return response.data.data;
  } catch (error) {
    toast.error("Gagal memperbaharui data PNBP");
    console.log("Error PATCH PNBP: ", error);
  }
}

export async function deletePNBP(id: number) {
  try {
    await api.delete(`/api/pnbp/${id}`);
    toast.success("Data PNBP berhasil dihapus");
  } catch (error) {
    toast.error("Gagal menghapus data PNBP");
    console.log("Error DELETE PNBP: ", error);
  }
}
