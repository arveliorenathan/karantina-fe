import { z } from "zod";

export const CreateTarifSchema = z.object({
  nama_layanan: z.string().min(1, { message: "Nama layanan wajib diisi" }),
  deskripsi: z.string().min(1, { message: "Deskripsi wajib diisi" }),
  tarif: z.number().min(1, { message: "Tarif layanan wajib diisi" }),
  satuan: z.string().min(1, { message: "Satuan layanan wajib diisi" }),
  kelompok_pengujian: z.string().optional(),
  klasifikasi: z.string().min(1, { message: "Klasifikasi layanan wajib diisi" }),
});

export type CreateTarif = z.infer<typeof CreateTarifSchema>;

export const EditTarifSchema = CreateTarifSchema.partial().extend({
  id: z.number(),
});

export type EditTarif = z.infer<typeof EditTarifSchema>;
