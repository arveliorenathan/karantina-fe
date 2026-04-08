import { Pegawai } from "./pegawai";

export type Laboratorium = {
  id: number;
  nama_laboratorium: string;
  nama_kantor: string;
  alamat: string;
  kontak: string;
  pegawai_id: number;
  klasifikasi: "KH" | "KI" | "KT";
  status: "Aktif" | "Perbaikan" | "Non Aktif";
  created_at: date;
  updated_at: date;

  pegawai?: Pegawai;
};

export interface PaginatedLaboratorium {
  current_page: number;
  data: Laboratorium[];
  last_page: number;
  per_page: number;
  total: number;
}
