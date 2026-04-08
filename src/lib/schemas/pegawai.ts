import { z } from "zod";

export const CreatePegawaiSchema = z.object({
  nip: z
    .string()
    .min(1, { message: "NIP wajib diisi" })
    .min(5, { message: "NIP minimal 5 karakter" }),

  nama_pegawai: z
    .string()
    .min(1, { message: "Nama pegawai wajib diisi" })
    .min(3, { message: "Nama pegawai minimal 3 karakter" }),

  golongan: z.string().min(1, { message: "Golongan wajib diisi" }),

  jabatan: z
    .string()
    .min(1, { message: "Jabatan wajib diisi" })
    .min(3, { message: "Jabatan minimal 3 karakter" }),

  email: z
    .string()
    .min(1, { message: "Email wajib diisi" })
    .email({ message: "Format email tidak valid" })
    .refine((email) => email.toLowerCase().endsWith("@gmail.com"), {
      message: "Email harus menggunakan Gmail (@gmail.com)",
    }),

  kontak: z
    .string()
    .min(1, { message: "Nomor kontak wajib diisi" })
    .min(10, { message: "Nomor kontak minimal 10 digit" })
    .max(15, { message: "Nomor kontak maksimal 15 digit" })
    .regex(/^[0-9]+$/, { message: "Nomor kontak hanya boleh angka" }),

  jenis_kelamin: z.enum(["Pria", "Wanita"]),
  status: z.enum(["Aktif", "Cuti", "Non Aktif"]),
});

export type CreatePegawai = z.infer<typeof CreatePegawaiSchema>;

export const EditPegawaiSchema = CreatePegawaiSchema.partial().extend({
  id: z.number(),
});

export type EditPegawai = z.infer<typeof EditPegawaiSchema>;
