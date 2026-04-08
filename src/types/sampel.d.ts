import { HasilUji } from "./hasilUji";
import { Laboratorium } from "./laboratorium";
import { Permohonan } from "./permohonan";

export type Sampel = {
  id: number;
  kode_permohonan: string;
  kode_sampel: string;
  nama_sampel: string;
  spesies: string;
  jumlah: number;
  satuan: string;
  lab_id: number;
  tanggal_pengujian?: string | null;
  tanggal_penandatanganan?: string | null;
  kesimpulan?: string | null;
  created_at: date;
  updated_at: date;
  permohonan?: Permohonan;
  laboratorium?: Laboratorium;
  hasil_uji?: HasilUji[];
};

export interface PaginatedSampel {
  current_page: number;
  data: Sampel[];
  last_page: number;
  per_page: number;
  total: number;
}
