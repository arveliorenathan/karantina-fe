import api from "@/lib/api";
import { PaginatedPermohonan, Permohonan } from "@/types/permohonan";
import { toast } from "sonner";

export async function getPermohonan(params?: {
  search?: string;
  kode_permohonan?: string;
  pin?: string;
  status?: string;
  status_penerimaan?: string;
  start_date?: string;
  end_date?: string;
  klasifikasi?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedPermohonan> {
  try {
    const response = await api.get("/api/permohonan", {
      params: {
        search: params?.search,
        kode_permohonan: params?.kode_permohonan,
        pin: params?.pin,
        status: params?.status,
        status_penerimaan: params?.status_penerimaan,
        start_date: params?.start_date,
        end_date: params?.end_date,
        klasifikasi: params?.klasifikasi,
        page: params?.page,
        limit: params?.limit,
      },
    });
    console.log("Data permohonan: ", response);
    return response.data.data;
  } catch (error) {
    toast.error("Gagal mengambil data pegawai");
    console.log("Error GET Pegawai: ", error);
    throw new Error("Error GET Pegawai");
  }
}

export async function getPermohonanById(id: number) {
  try {
    const response = await api.get(`/api/permohonan/${id}`);
    console.log(`Data permohonan by id ${id}: `, response);
    return response.data.data;
  } catch (error) {
    toast.error("Gagal mengambil data permohonan by id");
    console.log("Error GET Permohonan by ID: ", error);
  }
}

export async function createPermohonan(data: Omit<Permohonan, "id" | "kode_permohonan" | "pin" | "created_at" | "updated_at">) {
  try {
    const response = await api.post("/api/permohonan", data);
    toast.success("Data permohonan berhasil ditambahkan");
    return response.data.data;
  } catch (error) {
    toast.error("Gagal menambah data permohonan");
    console.log("Error POST Permohonan: ", error);
  }
}

export async function updatePermohonan(id: number, data: Partial<Permohonan>) {
  try {
    const response = await api.patch(`/api/permohonan/${id}`, data);
    toast.success("Data permohonan berhasil diperbarui");
    return response.data.data;
  } catch (error) {
    toast.error("Gagal memperbaharui data permohonan");
    console.log("Error PATCH Permohonan:", error);
  }
}

export async function deletePermohonan(id: number) {
  try {
    await api.delete(`/api/permohonan/${id}`);
    toast.success("Data permohonan berhasil dihapus");
  } catch (error) {
    toast.error("Gagal menghapus data permohonan");
    console.log("Error DELETE Permohonan:", error);
  }
}
