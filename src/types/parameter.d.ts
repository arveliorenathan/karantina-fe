import { Laboratorium } from "./laboratorium";

export type Parameter = {
  id: number;
  kode_parameter: string;
  nama_parameter: string;
  satuan_parameter: string;
  lod: string | null;
  standar_parameter: string;
  metode_pengujian: string;
  spesifikasi_pengujian: string | null;
  keterangan_parameter: "KAN" | "Non KAN";
  klasifikasi_parameter: string;
  estimasi_pnbp: string;
  kel_param: string | null;
  kel_param2: string | null;
  kel_param3: string | null;
  lab_id: number;
  sub_organo: string | null;
  estimasi_pengujian: string | null;
  status: "Tersedia" | "Tidak Tersedia";
  created_at: date;
  updated_at: date;

  laboratorium?: Laboratorium;
};

export interface PaginatedParameter {
  current_page: number;
  data: Parameter[];
  last_page: number;
  per_page: number;
  total: number;
}
