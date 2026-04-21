import api from "@/lib/api";
import { PaginatedTarif, Tarif } from "@/types/tarif";
import { toast } from "sonner";

export async function getTarif(params?: { search?: string; page?: number; klasifikasi?: string; limit?: number }): Promise<PaginatedTarif> {
  try {
    const response = await api.get("/tarif", {
      params: {
        search: params?.search,
        page: params?.page,
        klasifikasi: params?.klasifikasi,
        limit: params?.limit,
      },
    });
    console.log("Data tarif: ", response.data);
    return response.data.data;
  } catch (error) {
    toast.error("Gagal mengambil data tarif");
    console.log("Error GET Tarif: ", error);
    throw new Error("Error GET Tarif");
  }
}

export async function getTarifById(id: number) {
  try {
    const response = await api.get(`/tarif/${id}`);
    console.log(`Data tarif by id ${id}`, response);
    return response.data.data;
  } catch (error) {
    toast.error("Gagal mengambil data tarif by id");
    console.log("Error GET Tarif by ID: ", error);
  }
}

export async function createTarif(data: Omit<Tarif, "id" | "kelompok_pengujian" | "created_at" | "updated_at">) {
  try {
    const response = await api.post("/tarif", data);
    toast.success("Data tarif berhasil ditambahkan");
    return response.data.data;
  } catch (error) {
    toast.error("Gagal membuat data tarif");
    console.log("Error POST Tarif: ", error);
  }
}

export async function updateTarif(id: number, data: Partial<Tarif>) {
  try {
    const response = await api.patch(`/tarif/${id}`, data);
    toast.success("Data tarif berhasil di perbaharui");
    return response.data.data;
  } catch (error) {
    toast.error("Gagal memperbaharui data tarif");
    console.log("Error PATCH Tarif: ", error);
  }
}

export async function deleteTarif(id: number) {
  try {
    await api.delete(`/tarif/${id}`);
    toast.success("Data tarif berhasil dihapus");
  } catch (error) {
    toast.error("Gagal menghapus data tarif");
    console.log("Error DELETE Tarif: ", error);
  }
}
