export type Tarif = {
  id: number;
  nama_layanan: string;
  deskripsi: string;
  tarif: number;
  satuan: string;
  kelompok_pengujian: string;
  klasifikasi: string;
  created_at: string;
  updated_at: string;
};

export interface PaginatedTarif {
  current_page: number;
  data: Tarif[];
  last_page: number;
  per_page: number;
  total: number;
}
