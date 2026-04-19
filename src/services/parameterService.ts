import api from "@/lib/api";
import { PaginatedParameter, Parameter } from "@/types/parameter";
import { toast } from "sonner";

export async function getParameter(params?: {
  search?: string;
  status?: string;
  klasifikasi?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedParameter> {
  try {
    const response = await api.get("/api/parameter", {
      params: {
        search: params?.search,
        status: params?.status,
        klasifikasi: params?.klasifikasi,
        page: params?.page,
        limit: params?.limit,
      },
    });
    console.log("Data parameter: ", response.data.data);
    return response.data.data;
  } catch (error) {
    toast.error("Gagal mengambil data parameter");
    console.log("Error GET parameter", error);
    throw new Error("Error GET Parameter");
  }
}

export async function getParameterById(id: number) {
  try {
    const response = await api.get(`/api/parameter/${id}`);
    console.log(`Data parameter by id ${id}: `, response);
    return response.data.data;
  } catch (error) {
    toast.error("Gagal mengambil data parameter");
    console.log("Error GET parameter by id", error);
  }
}

export async function createParameter(
  data: Omit<Parameter, "id" | "kode_parameter" | "created_at" | "updated_at">,
) {
  try {
    const response = await api.post("/api/parameter", data);
    toast.success("Data parameter berhasil ditambahkan");
    return response.data.data;
  } catch (error) {
    toast.error("Gagal menambah data parameter");
    console.log("Error POST parameter", error);
  }
}

export async function updateParameter(id: number, data: Partial<Parameter>) {
  try {
    const response = await api.patch(`/api/parameter/${id}`, data);
    toast.success("Data parameter berhasil diperbaharui");
    return response.data.data;
  } catch (error) {
    toast.error("Gagal memperbaharui data parameter");
    console.log("Error PATCH parameter", error);
  }
}

export async function deleteParameter(id: number) {
  try {
    await api.delete(`/api/parameter/${id}`);
    toast.success("Data parameter berhasil dihapus");
  } catch (error) {
    toast.error("Gagal menghapus data parameter");
    console.log("Error DELETE parameter", error);
  }
}
