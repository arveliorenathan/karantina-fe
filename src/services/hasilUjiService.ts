import api from "@/lib/api";
import { toast } from "sonner";
import { HasilUji } from "@/types/hasilUji";

export async function getHasilUji(sampel_id?: number, status?: string) {
  try {
    const response = await api.get("/api/hasil_uji", {
      params: {
        sampel_id: sampel_id,
        status: status,
      },
    });
    console.log("Data hasil_uji: ", response);
    return response.data.data;
  } catch (error) {
    toast.error("Gagal mengambil data hasil uji");
    console.log("Error GET Hasil Uji: ", error);
  }
}

export async function getHasilUjiById(id: number) {
  try {
    const response = await api.get(`/api/hasil_uji/${id}`);
    console.log(`Data hasil_uji by id ${id}`, response);
    return response.data.data;
  } catch (error) {
    toast.error("Gagal mengambil data hasil uji by id");
    console.log("Error GET Hasil Uji by ID: ", error);
  }
}

export async function createHasilUji(data: Omit<HasilUji, "id" | "created_at" | "updated_at">) {
  try {
    const response = await api.post("/api/hasil_uji", data);
    toast.success("Data hasil uji berhasil ditambahkan");
    return response.data.data;
  } catch (error) {
    toast.error("Gagal membuat data hasil uji");
    console.log("Error POST Hasil Uji: ", error);
  }
}

export async function updateHasilUji(id: number, data: Partial<HasilUji>) {
  try {
    const response = await api.patch(`/api/hasil_uji/${id}`, data);
    toast.success("Data hasil uji berhasil di perbaharui");
    return response.data.data;
  } catch (error) {
    toast.error("Gagal memperbaharui data hasil uji");
    console.log("Error PATCH Hasil Uji: ", error);
  }
}

export async function deleteHasilUji(id: number) {
  try {
    await api.delete(`/api/hasil_uji/${id}`);
    toast.success("Data hasil uji berhasil dihapus");
  } catch (error) {
    toast.error("Gagal menghapus data hasil uji");
    console.log("Error DELETE Hasil Uji: ", error);
  }
}
