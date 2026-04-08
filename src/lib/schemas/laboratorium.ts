import { z } from "zod";

export const CreateLaboratoriumSchema = z.object({
  nama_laboratorium: z
    .string()
    .min(1, { message: "Nama laboratorium wajib diisi" })
    .min(3, { message: "Nama laboratorium minimal 3 karakter" }),

  nama_kantor: z
    .string()
    .min(1, { message: "Nama kantor wajib diisi" })
    .min(3, { message: "Nama kantor minimal 3 karakter" }),

  alamat: z
    .string()
    .min(1, { message: "Alamat wajib diisi" })
    .min(5, { message: "Alamat minimal 5 karakter" }),

  kontak: z
    .string()
    .min(1, { message: "Nomor kontak wajib diisi" })
    .min(10, { message: "Nomor kontak minimal 10 digit" })
    .max(15, { message: "Nomor kontak maksimal 15 digit" })
    .regex(/^[0-9]+$/, { message: "Nomor kontak hanya boleh angka" }),

  pegawai_id: z.number().positive(),

  klasifikasi: z.enum(["KH", "KI", "KT"]),

  status: z.enum(["Aktif", "Perbaikan", "Non Aktif"]),
});

export type CreateLaboratorium = z.infer<typeof CreateLaboratoriumSchema>;

export const EditLaboratoriumSchema = CreateLaboratoriumSchema.partial().extend(
  {
    id: z.number(),
  },
);

export type EditLaboratorium = z.infer<typeof EditLaboratoriumSchema>;
