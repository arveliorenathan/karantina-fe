import { z } from "zod";

export const CreatePermohonanSchema = z.object({
  nama_perusahaan: z.string().min(1, { message: "Nama pengguna jasa wajib diisi" }).min(3, { message: "Nama pengguna jasa minimal 3 karakter" }),

  nama_pembawa: z.string().min(1, { message: "Nama pembawa wajib diisi" }).min(3, { message: "Nama pembawa minimal 3 karakter" }),

  kontak: z
    .string()
    .min(1, { message: "Kontak wajib diisi" })
    .min(10, { message: "Nomor kontak minimal 10 digit" })
    .max(15, { message: "Nomor kontak maksimal 15 digit" })
    .regex(/^[0-9]+$/, { message: "Kontak hanya boleh angka" }),

  alamat: z.string().min(1, { message: "Alamat wajib diisi" }).min(5, { message: "Alamat minimal 5 karakter" }),

  tujuan_pengujian: z.string().min(1, { message: "Tujuan pengujian wajib diisi" }),

  nomor_refrensi: z.string().nullable(),

  lab_id: z.number(),
  pegawai_id: z.number(),

  status: z.enum(["Selesai", "Pengujian Laboratorium", "Distribusi Laboratorium"]),
  status_penerimaan: z.enum(["Terima", "Tolak", "Menunggu Konfirmasi Admin", "Dibatalkan"]),

  tanggal_masuk: z.string().nullable(),
  tanggal_diterima: z.string().nullable(),
  keterangan: z.string().nullable(),
});
export type CreatePermohonan = z.infer<typeof CreatePermohonanSchema>;

export const EditPermohonanSchema = CreatePermohonanSchema.partial().extend({
  id: z.number(),
});

export type EditPermohonan = z.infer<typeof EditPermohonanSchema>;
