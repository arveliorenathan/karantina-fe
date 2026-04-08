import { Pegawai } from "./pegawai";
import { Permohonan } from "./permohonan";

type Pnbp = {
  id: number;
  kode_permohonan: string;
  pegawai_id: number;
  no_pnbp: string;
  tarif_id?: number[];
  no_bil: string | null;
  ntpn: string | null;
  total_nominal: number;
  tanggal_pnbp: string;
  status: string;
  tarif_layanan: {
    id: number;
    nama_layanan: string;
    tarif: number;
    pivot: Pivot;
  }[];
  permohonan: Permohonan;
  pegawai: Pegawai;
  created_at: string;
  updated_at: string;
};

type Pivot = {
  pnbp_id: number;
  tarif_id: number;
  jumlah: number;
  total: number;
};

export interface PaginatedPNBP {
  current_page: number;
  data: Pnbp[];
  last_page: number;
  per_page: number;
  total: number;
}
