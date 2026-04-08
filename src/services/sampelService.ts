import api from "@/lib/api";
import { PaginatedSampel, Sampel } from "@/types/sampel";
import { toast } from "sonner";

export async function getSampel(params?: { search?: string; page?: number; limit?: number; status?: string }): Promise<PaginatedSampel> {
  try {
    const response = await api.get("/sampel", {
      params: {
        search: params?.search,
        page: params?.page,
        limit: params?.limit,
        status: params?.status,
      },
    });
    return response.data.data;
  } catch (error) {
    toast.error("Gagal mengambil data sampel");
    console.error("Error GET Sampel: ", error);
    throw new Error("Error GET Parameter");
  }
}

export async function getSampelById(id: number) {
  try {
    const response = await api.get(`/sampel/${id}`);
    return response.data.data;
  } catch (error) {
    toast.error("Gagal mengambil data sampel by id");
    console.error("Error GET Sampel by ID: ", error);
  }
}

export async function createSampel(data: Omit<Sampel, "id" | "kode_sampel" | "created_at" | "updated_at">) {
  try {
    const response = await api.post("/sampel", data);
    toast.success("Data sampel berhasil ditambahkan");
    return response.data.data;
  } catch (error) {
    console.error("Error POST Sampel: ", error);
    throw error;
  }
}

export async function updateSampel(id: number, data: Partial<Sampel>) {
  try {
    const response = await api.patch(`/sampel/${id}`, data);
    toast.success("Data sampel berhasil diperbarui");
    return response.data.data;
  } catch (error) {
    console.error("Error PATCH Sampel: ", error);
    throw error;
  }
}

export async function deleteSampel(id: number) {
  try {
    await api.delete(`/sampel/${id}`);
    toast.success("Data sampel berhasil dihapus");
  } catch (error) {
    toast.error("Gagal menghapus data sampel");
    console.error("Error DELETE Sampel: ", error);
  }
}
