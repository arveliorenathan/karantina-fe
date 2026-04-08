import { z } from "zod";

export const CreateSampelSchema = z.object({
  kode_permohonan: z.string().min(1, "Kode permohonan wajib dipilih"),
  nama_sampel: z.string().min(1, "Nama sampel wajib diisi"),
  spesies: z.string().min(1, "Spesies wajib diisi"),
  jumlah: z.number().min(1, "Jumlah minimal 1"),
  satuan: z.string().min(1, "Satuan wajib diisi"),
  lab_id: z.number().min(1, "Laboratorium wajib dipilih"),
  tanggal_pengujian: z.string().nullable(),
});

export type CreateSampel = z.infer<typeof CreateSampelSchema>;

export const EditSampelSchema = CreateSampelSchema.partial().extend({
  id: z.number(),
  kesimpulan: z.string().nullable(),
});

export type EditSampel = z.infer<typeof EditSampelSchema>;
