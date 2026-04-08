import { z } from "zod";

export const CreateHasilUjiSchema = z.object({
  sampel_id: z.number(),
  parameter_id: z.number().positive(),
  penguji_id: z.number().positive(),
  status: z.literal("Pengujian"),
});

export type CreateHasilUji = z.infer<typeof CreateHasilUjiSchema>;

export const EditHasilUjiSchema = CreateHasilUjiSchema.omit({ status: true })
  .partial()
  .extend({
    id: z.number(),
    hasil_sementara: z.string().nullable(),
    hasil: z.string().nullable(),
    keterangan_sementara: z.string().nullable(),
    keterangan: z.string().nullable(),
    status: z.string(),
    status_penerimaan: z.enum(["Terima", "Tolak"]).nullable().optional(),
    tanggal_pengujian: z.string().nullable(),
    tanggal_selesai: z.string().nullable(),
  });

export type EditHasilUji = z.infer<typeof EditHasilUjiSchema>;
