import { z } from "zod";

export const CreateSuratSchema = z.object({
  permohonan_id: z.number(),
  tanggal_surat: z.string().min(1, { message: "Tanggal surat wajib diisi" }),
  perihal: z.string().min(1, { message: "Perihal surat wajib diisi" }).min(3, { message: "Perihal surat minimal 3 karakter" }),
  pemberi_id: z.number().int().positive(),
  penerima_id: z.array(z.number().int()).min(1, "Minimal satu penerima tugas"),
  kota_penerbit: z.string().min(1, { message: "Kota penerbit wajib diisi" }).min(3, { message: "Nama kota minimal 3 karakter" }),
});

export type CreateSurat = z.infer<typeof CreateSuratSchema>;

export const EditSuratSchema = CreateSuratSchema.partial().extend({
  id: z.number(),
});

export type EditSurat = z.infer<typeof EditSuratSchema>;
