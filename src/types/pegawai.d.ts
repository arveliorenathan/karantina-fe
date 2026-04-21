export type Pegawai = {
  id: number;
  nip: string;
  nama_pegawai: string;
  golongan: string;
  jabatan: string;
  email: string;
  kontak: string;
  status: "Aktif" | "Cuti" | "Non Aktif";
  created_at: string;
  updated_at: string;
};

export interface PaginatedPegawai {
  current_page: number;
  data: Pegawai[];
  last_page: number;
  per_page: number;
  total: number;
}
