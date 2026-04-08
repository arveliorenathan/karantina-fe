import { Pegawai } from "./pegawai";
import { Permohonan } from "./permohonan";

export type Surat = {
  id: number;
  permohonan_id: number;
  nomor_surat: string;
  tanggal_surat: string;
  perihal: string;

  pemberi_id: number;
  penerima_id?: number[];

  kota_penerbit: string;

  created_at: string;
  updated_at: string;

  pemberi_tugas?: Pegawai;
  penerima_tugas?: Pegawai[];
  permohonan?: Permohonan;
};

export interface PaginatedSurat {
  current_page: number;
  data: Surat[];
  last_page: number;
  per_page: number;
  total: number;
}
