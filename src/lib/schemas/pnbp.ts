import { z } from "zod";

export const CreatePNBPSchema = z.object({
  kode_permohonan: z.string().min(1, "Kode permohonan wajib dipilih"),
  pegawai_id: z.number().positive(),
  tarif_id: z.array(z.number().int()).min(1, "Minimal memilih salah satu layanan"),
  jumlah: z.array(z.number().int()),
  total_nominal: z.number(),
  tanggal_pnbp: z.string(),
});

export type CreatePNBP = z.infer<typeof CreatePNBPSchema>;

export const EditPNBPSchema = CreatePNBPSchema.partial().extend({
  id: z.number(),
  no_bil: z.string(),
  ntpn: z.string(),
  status: z.string(),
  pegawai_id: z.number().positive(),
  tarif_id: z.array(z.number().int()).optional(),
  jumlah: z.array(z.number().int()).optional(),
});

export type EditPNBP = z.infer<typeof EditPNBPSchema>;
