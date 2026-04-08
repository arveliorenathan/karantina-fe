import { Laboratorium } from "./laboratorium";
import { Pegawai } from "./pegawai";
import { Pnbp } from "./pnbp";
import { Sampel } from "./sampel";

export type Permohonan = {
  id: number;
  kode_permohonan: string;
  pin: string;
  nama_perusahaan: string;
  nama_pembawa: string;
  kontak: string;
  alamat: string;
  tujuan_pengujian: string;
  nomor_refrensi?: string | null;
  lab_id: number;
  pegawai_id: number;
  status: "Selesai" | "Pengujian Laboratorium" | "Distribusi Laboratorium";
  status_penerimaan: "Terima" | "Tolak" | "Menunggu Konfirmasi Admin" | "Dibatalkan";
  keterangan?: string | null;
  tanggal_masuk?: string | null;
  tanggal_diterima?: string | null;
  created_at: string;
  updated_at: string;

  sampel?: Sampel[];
  pnbp?: Pnbp[];
  laboratorium?: Laboratorium;
  pegawai?: Pegawai;
};

export interface PaginatedPermohonan {
  current_page: number;
  data: Permohonan[];
  last_page: number;
  per_page: number;
  total: number;
}
