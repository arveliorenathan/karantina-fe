import { z } from "zod";

export const CreateParameterSchema = z.object({
  nama_parameter: z
    .string()
    .min(1, { message: "Nama parameter wajib diisi" })
    .min(3, { message: "Nama parameter minimal 3 karakter" }),

  satuan_parameter: z
    .string()
    .min(1, { message: "Satuan parameter wajib diisi" }),
  lod: z.string().nullable(),

  standar_parameter: z
    .string()
    .min(1, { message: "Standar parameter wajib diisi" }),

  metode_pengujian: z
    .string()
    .min(1, { message: "Metode pengujian wajib diisi" }),

  spesifikasi_pengujian: z.string().nullable(),

  keterangan_parameter: z.enum(["KAN", "Non KAN"]),

  klasifikasi_parameter: z
    .string()
    .min(1, { message: "Klasifikasi parameter wajib diisi" }),

  estimasi_pnbp: z
    .string()
    .min(1, { message: "Estimasi PNBP wajib diisi" })
    .regex(/^[0-9]+$/, { message: "Estimasi PNBP harus berupa angka" }),

  kel_param: z.string().nullable(),
  kel_param2: z.string().nullable(),
  kel_param3: z.string().nullable(),
  lab_id: z.number(),
  sub_organo: z.string().nullable(),
  estimasi_pengujian: z.string().nullable(),
  status: z.enum(["Tersedia", "Tidak Tersedia"]),
});

export type CreateParameter = z.infer<typeof CreateParameterSchema>;

export const EditParameterSchema = CreateParameterSchema.partial().extend({
  id: z.number(),
});

export type EditParameter = z.infer<typeof EditParameterSchema>;
