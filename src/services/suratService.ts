import api from "@/lib/api";
import { PaginatedSurat, Surat } from "@/types/surat";
import { toast } from "sonner";

export async function getSurat(params?: {
  search?: string;
  page?: number;
  kode_permohonan?: string;
  perihal?: string;
  limit?: number;
}): Promise<PaginatedSurat> {
  try {
    const response = await api.get("/api/surat", {
      params: {
        search: params?.search,
        page: params?.page,
        limit: params?.limit,
        kode_permohonan: params?.kode_permohonan,
        perihal: params?.perihal,
      },
    });
    console.log("Data surat: ", response.data);
    return response.data.data;
  } catch (error) {
    toast.error("Gagal mengambil data surat");
    console.log("Error GET Surat: ", error);
    throw new Error("Error GET Parameter");
  }
}

export async function getSuratById(id: number) {
  try {
    const response = await api.get(`/api/surat/${id}`);
    console.log(`Data surat by id ${id}`, response);
    return response.data.data;
  } catch (error) {
    toast.error("Gagal mengambil data surat by id");
    console.log("Error GET Surat by ID: ", error);
  }
}

export async function createSurat(
  data: Omit<Surat, "id"| "nomor_surat" | "created_at" | "updated_at">,
) {
  try {
    const response = await api.post("/api/surat", data);
    toast.success("Data surat berhasil ditambahkan");
    return response.data.data;
  } catch (error) {
    toast.error("Gagal membuat data surat");
    console.log("Error POST Surat: ", error);
  }
}

export async function updateSurat(id: number, data: Partial<Surat>) {
  try {
    const response = await api.patch(`/api/surat/${id}`, data);
    toast.success("Data surat berhasil di perbaharui");
    return response.data.data;
  } catch (error) {
    toast.error("Gagal memperbaharui data surat");
    console.log("Error PATCH Surat: ", error);
  }
}

export async function deleteSurat(id: number) {
  try {
    await api.delete(`/api/surat/${id}`);
    toast.success("Data surat berhasil dihapus");
  } catch (error) {
    toast.error("Gagal menghapus data surat");
    console.log("Error DELETE Surat: ", error);
  }
}
